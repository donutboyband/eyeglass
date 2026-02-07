import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContextStore } from './store.js';
// Mock child_process to avoid actual git operations
vi.mock('child_process', () => ({
    execSync: vi.fn(() => ''),
}));
// Mock fs to avoid file writes
vi.mock('fs', () => ({
    writeFileSync: vi.fn(),
}));
function createMockSnapshot(overrides = {}) {
    return {
        role: 'button',
        name: 'Test Button',
        tagName: 'button',
        framework: { name: 'react', componentName: 'TestButton' },
        a11y: { label: null, description: null, disabled: false, hidden: false },
        geometry: { x: 0, y: 0, width: 100, height: 40, visible: true },
        styles: {
            display: 'inline-flex',
            position: 'relative',
            padding: '8px 16px',
            margin: '0px',
            color: 'rgb(0, 0, 0)',
            backgroundColor: 'rgb(255, 255, 255)',
            fontFamily: 'sans-serif',
            zIndex: 'auto',
        },
        timestamp: Date.now(),
        url: 'http://localhost:3000/',
        ...overrides,
    };
}
function createMockPayload(overrides = {}) {
    return {
        interactionId: `test-${Date.now()}`,
        snapshot: createMockSnapshot(),
        userNote: 'Test note',
        ...overrides,
    };
}
describe('ContextStore', () => {
    let store;
    beforeEach(() => {
        store = new ContextStore();
    });
    describe('setFocus', () => {
        it('should set the active focus payload', () => {
            const payload = createMockPayload();
            store.setFocus(payload);
            expect(store.getActive()).toEqual(payload);
        });
        it('should move previous active to history', () => {
            const payload1 = createMockPayload({ interactionId: 'first' });
            const payload2 = createMockPayload({ interactionId: 'second' });
            store.setFocus(payload1);
            store.setFocus(payload2);
            expect(store.getActive()?.interactionId).toBe('second');
            expect(store.getHistory()).toHaveLength(1);
            expect(store.getHistory()[0].interactionId).toBe('first');
        });
        it('should limit history to MAX_HISTORY (5) items', () => {
            for (let i = 0; i < 7; i++) {
                store.setFocus(createMockPayload({ interactionId: `item-${i}` }));
            }
            expect(store.getHistory()).toHaveLength(5);
            // History should have items 1-5 (item-0 was pushed out)
            expect(store.getHistory()[0].interactionId).toBe('item-5');
            expect(store.getHistory()[4].interactionId).toBe('item-1');
        });
        it('should emit status activity event', () => {
            const events = [];
            store.on('activity', (event) => events.push(event));
            store.setFocus(createMockPayload());
            expect(events).toHaveLength(1);
            expect(events[0].type).toBe('status');
            if (events[0].type === 'status') {
                expect(events[0].status).toBe('pending');
            }
        });
    });
    describe('updateStatus', () => {
        it('should emit status activity event with message', () => {
            const payload = createMockPayload({ interactionId: 'test-123' });
            store.setFocus(payload);
            const events = [];
            store.on('activity', (event) => events.push(event));
            store.updateStatus('test-123', 'fixing', 'Working on it');
            expect(events).toHaveLength(1);
            expect(events[0].type).toBe('status');
            if (events[0].type === 'status') {
                expect(events[0].status).toBe('fixing');
                expect(events[0].message).toBe('Working on it');
            }
        });
        it('should ignore updates for non-active interaction', () => {
            const payload = createMockPayload({ interactionId: 'active-id' });
            store.setFocus(payload);
            const events = [];
            store.on('activity', (event) => events.push(event));
            store.updateStatus('wrong-id', 'fixing', 'This should be ignored');
            expect(events).toHaveLength(0);
        });
    });
    describe('sendThought', () => {
        it('should emit thought activity event', () => {
            const payload = createMockPayload({ interactionId: 'test-123' });
            store.setFocus(payload);
            const events = [];
            store.on('activity', (event) => events.push(event));
            store.sendThought('test-123', 'I think we should change the color');
            expect(events).toHaveLength(1);
            expect(events[0].type).toBe('thought');
            if (events[0].type === 'thought') {
                expect(events[0].content).toBe('I think we should change the color');
            }
        });
    });
    describe('reportAction', () => {
        it('should emit action activity event', () => {
            const payload = createMockPayload({ interactionId: 'test-123' });
            store.setFocus(payload);
            const events = [];
            store.on('activity', (event) => events.push(event));
            store.reportAction('test-123', 'reading', 'src/Button.tsx');
            expect(events).toHaveLength(1);
            expect(events[0].type).toBe('action');
            if (events[0].type === 'action') {
                expect(events[0].action).toBe('reading');
                expect(events[0].target).toBe('src/Button.tsx');
                expect(events[0].complete).toBe(false);
            }
        });
        it('should support complete flag', () => {
            const payload = createMockPayload({ interactionId: 'test-123' });
            store.setFocus(payload);
            const events = [];
            store.on('activity', (event) => events.push(event));
            store.reportAction('test-123', 'writing', 'src/Button.tsx', true);
            if (events[0].type === 'action') {
                expect(events[0].complete).toBe(true);
            }
        });
    });
    describe('askQuestion / receiveAnswer', () => {
        it('should emit question event and resolve on answer', async () => {
            const payload = createMockPayload({ interactionId: 'test-123' });
            store.setFocus(payload);
            const events = [];
            store.on('activity', (event) => events.push(event));
            const questionPromise = store.askQuestion('test-123', 'q-1', 'Which color?', [
                { id: 'blue', label: 'Blue' },
                { id: 'red', label: 'Red' },
            ]);
            expect(events).toHaveLength(1);
            expect(events[0].type).toBe('question');
            expect(store.hasPendingQuestion()).toBe(true);
            const answered = store.receiveAnswer({
                interactionId: 'test-123',
                questionId: 'q-1',
                answerId: 'blue',
                answerLabel: 'Blue',
            });
            expect(answered).toBe(true);
            expect(store.hasPendingQuestion()).toBe(false);
            const answer = await questionPromise;
            expect(answer.answerId).toBe('blue');
        });
        it('should reject wrong question id', () => {
            const payload = createMockPayload({ interactionId: 'test-123' });
            store.setFocus(payload);
            store.askQuestion('test-123', 'q-1', 'Which color?', []);
            const answered = store.receiveAnswer({
                interactionId: 'test-123',
                questionId: 'wrong-id',
                answerId: 'blue',
                answerLabel: 'Blue',
            });
            expect(answered).toBe(false);
            expect(store.hasPendingQuestion()).toBe(true);
        });
    });
    describe('waitForFocus', () => {
        it('should return immediately if pending request exists', async () => {
            const payload = createMockPayload({ interactionId: 'test-123' });
            store.setFocus(payload);
            const result = await store.waitForFocus();
            expect(result.interactionId).toBe('test-123');
        });
        it('should resolve when new focus arrives', async () => {
            expect(store.isWaitingForFocus()).toBe(false);
            const waitPromise = store.waitForFocus();
            expect(store.isWaitingForFocus()).toBe(true);
            const payload = createMockPayload({ interactionId: 'new-request' });
            store.setFocus(payload);
            const result = await waitPromise;
            expect(result.interactionId).toBe('new-request');
            expect(store.isWaitingForFocus()).toBe(false);
        });
        it('should timeout if specified', async () => {
            const waitPromise = store.waitForFocus(50);
            await expect(waitPromise).rejects.toThrow('Timeout waiting for focus request');
        });
    });
    describe('formatAsMarkdown', () => {
        it('should return no focus message when empty', () => {
            const markdown = store.formatAsMarkdown();
            expect(markdown).toContain('No Active Focus');
        });
        it('should format single snapshot correctly', () => {
            const payload = createMockPayload({
                interactionId: 'test-123',
                userNote: 'Make it blue',
                snapshot: createMockSnapshot({
                    role: 'button',
                    name: 'Submit',
                    framework: {
                        name: 'react',
                        componentName: 'SubmitButton',
                        filePath: 'src/components/SubmitButton.tsx',
                        lineNumber: 42,
                    },
                }),
            });
            store.setFocus(payload);
            const markdown = store.formatAsMarkdown();
            expect(markdown).toContain('test-123');
            expect(markdown).toContain('Make it blue');
            expect(markdown).toContain('SubmitButton');
            expect(markdown).toContain('src/components/SubmitButton.tsx');
            expect(markdown).toContain(':42');
            expect(markdown).toContain('Role: button');
            expect(markdown).toContain('Name: "Submit"');
        });
        it('should format multiple snapshots correctly', () => {
            const payload = createMockPayload({
                interactionId: 'multi-123',
                userNote: 'Style these consistently',
                snapshot: undefined,
                snapshots: [
                    createMockSnapshot({ name: 'Button 1' }),
                    createMockSnapshot({ name: 'Button 2' }),
                ],
            });
            store.setFocus(payload);
            const markdown = store.formatAsMarkdown();
            expect(markdown).toContain('2 Elements');
            expect(markdown).toContain('Element 1:');
            expect(markdown).toContain('Element 2:');
            expect(markdown).toContain('Button 1');
            expect(markdown).toContain('Button 2');
        });
        it('should include element identifiers when present', () => {
            const payload = createMockPayload({
                snapshot: createMockSnapshot({
                    id: 'my-button',
                    className: 'btn btn-primary',
                    dataAttributes: { 'data-testid': 'submit-btn' },
                }),
            });
            store.setFocus(payload);
            const markdown = store.formatAsMarkdown();
            expect(markdown).toContain('#my-button');
            expect(markdown).toContain('btn btn-primary');
            expect(markdown).toContain('data-testid="submit-btn"');
        });
    });
});
