import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
const MAX_HISTORY = 5;
const CONTEXT_FILE = '.eyeglass_context.md';
export class ContextStore extends EventEmitter {
    constructor() {
        super(...arguments);
        this.active = null;
        this.history = [];
        this.currentStatus = 'idle';
        this.pendingQuestion = null;
    }
    setFocus(payload) {
        if (this.active) {
            this.history.unshift(this.active);
            if (this.history.length > MAX_HISTORY) {
                this.history.pop();
            }
        }
        this.active = payload;
        this.currentStatus = 'pending';
        this.emitActivity({
            type: 'status',
            interactionId: payload.interactionId,
            status: 'pending',
            message: 'Waiting for agent...',
            timestamp: Date.now(),
        });
        this.writeContextFile();
    }
    getActive() {
        return this.active;
    }
    getHistory() {
        return this.history;
    }
    // Status update
    updateStatus(interactionId, status, message) {
        if (this.active?.interactionId !== interactionId)
            return;
        this.currentStatus = status;
        this.emitActivity({
            type: 'status',
            interactionId,
            status,
            message,
            timestamp: Date.now(),
        });
    }
    // Send a thought/reasoning to the user
    sendThought(interactionId, content) {
        if (this.active?.interactionId !== interactionId)
            return;
        this.emitActivity({
            type: 'thought',
            interactionId,
            content,
            timestamp: Date.now(),
        });
    }
    // Report an action being taken
    reportAction(interactionId, action, target, complete = false) {
        if (this.active?.interactionId !== interactionId)
            return;
        this.emitActivity({
            type: 'action',
            interactionId,
            action,
            target,
            complete,
            timestamp: Date.now(),
        });
    }
    // Ask a question and wait for answer
    async askQuestion(interactionId, questionId, question, options) {
        if (this.active?.interactionId !== interactionId) {
            throw new Error('No active interaction');
        }
        // Emit the question event
        this.emitActivity({
            type: 'question',
            interactionId,
            questionId,
            question,
            options,
            timestamp: Date.now(),
        });
        // Wait for the answer
        return new Promise((resolve) => {
            this.pendingQuestion = { questionId, resolve };
        });
    }
    // Receive answer from the browser
    receiveAnswer(answer) {
        if (!this.pendingQuestion || this.pendingQuestion.questionId !== answer.questionId) {
            return false;
        }
        this.pendingQuestion.resolve(answer);
        this.pendingQuestion = null;
        return true;
    }
    hasPendingQuestion() {
        return this.pendingQuestion !== null;
    }
    emitActivity(event) {
        this.emit('activity', event);
    }
    formatAsMarkdown() {
        if (!this.active) {
            return '# No Active Focus\n\nNo element is currently focused.';
        }
        const { snapshot, userNote, interactionId } = this.active;
        const { framework, a11y, geometry, styles } = snapshot;
        const componentInfo = framework.componentName
            ? `\`<${framework.componentName} />\` (${framework.filePath || 'unknown file'}${framework.lineNumber ? `:${framework.lineNumber}` : ''})`
            : `\`<${snapshot.tagName}>\` (vanilla element)`;
        return `## User Focus Request
**Interaction ID:** ${interactionId}
**User Note:** "${userNote}"
**Component:** ${componentInfo}

### Element Info
- Tag: \`<${snapshot.tagName}>\`
- Role: ${snapshot.role}
- Name: "${snapshot.name}"

### Accessibility Tree
- Label: ${a11y.label ?? 'none'}
- Description: ${a11y.description ?? 'none'}
- Disabled: ${a11y.disabled}
- Hidden: ${a11y.hidden}
${a11y.expanded !== undefined ? `- Expanded: ${a11y.expanded}` : ''}
${a11y.checked !== undefined ? `- Checked: ${a11y.checked}` : ''}

### Geometry
- Box: ${geometry.width}x${geometry.height} at (${geometry.x}, ${geometry.y})
- Visible: ${geometry.visible}

### Computed Styles
- Display: ${styles.display}
- Position: ${styles.position}
${styles.flexDirection ? `- Flex Direction: ${styles.flexDirection}` : ''}
${styles.gridTemplate ? `- Grid Template: ${styles.gridTemplate}` : ''}
- Padding: ${styles.padding}
- Margin: ${styles.margin}
- Color: ${styles.color}
- Background: ${styles.backgroundColor}
- Font: ${styles.fontFamily}
- Z-Index: ${styles.zIndex}

### Framework
- Detected: ${framework.name}
${framework.props ? `- Props: ${JSON.stringify(framework.props, null, 2)}` : ''}

### Page Context
- URL: ${snapshot.url}
- Timestamp: ${new Date(snapshot.timestamp).toISOString()}
`;
    }
    writeContextFile() {
        try {
            const content = this.formatAsMarkdown();
            fs.writeFileSync(path.resolve(process.cwd(), CONTEXT_FILE), content, 'utf-8');
        }
        catch (err) {
            // Silently fail file writes
        }
    }
}
export const store = new ContextStore();
