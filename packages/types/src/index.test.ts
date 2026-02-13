import { describe, it, expect } from 'vitest';
import type {
  SemanticSnapshot,
  FocusPayload,
  InteractionStatus,
  PulseLevel,
  ActivityEvent,
  StatusEvent,
  ThoughtEvent,
  QuestionEvent,
  ActionEvent,
  HookInfo,
  ContextInfo,
  CausalityInfo,
  PerceptionInfo,
  MetalInfo,
  SystemicInfo,
} from './index.js';

describe('@eyeglass/types', () => {
  describe('InteractionStatus', () => {
    it('should allow valid status values', () => {
      const statuses: InteractionStatus[] = ['idle', 'pending', 'fixing', 'success', 'failed'];
      expect(statuses).toHaveLength(5);
    });
  });

  describe('PulseLevel', () => {
    it('should allow valid pulse levels', () => {
      const levels: PulseLevel[] = ['healthy', 'warning', 'critical'];
      expect(levels).toHaveLength(3);
    });
  });

  describe('SemanticSnapshot', () => {
    it('should conform to the expected shape (v2.0 style)', () => {
      const snapshot: SemanticSnapshot = {
        role: 'button',
        name: 'Submit',
        tagName: 'button',
        framework: {
          type: 'react',
          displayName: 'SubmitButton',
          filePath: 'src/components/SubmitButton.tsx',
          lineNumber: 42,
          state: {
            props: { variant: 'primary', disabled: false },
            hooks: [
              { name: 'useState', value: false, label: 'isLoading' },
              { name: 'useCallback', label: 'handleClick' },
            ],
            context: [
              { name: 'ThemeContext', value: { mode: 'dark' } },
            ],
          },
        },
        geometry: {
          x: 100,
          y: 200,
          width: 120,
          height: 40,
          visible: true,
        },
        styles: {
          display: 'inline-flex',
          position: 'relative',
          padding: '8px 16px',
          margin: '0px',
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(59, 130, 246)',
          fontFamily: 'Inter, sans-serif',
          zIndex: 'auto',
        },
        timestamp: Date.now(),
        url: 'http://localhost:3000/',
      };

      expect(snapshot.role).toBe('button');
      expect(snapshot.framework.type).toBe('react');
      expect(snapshot.framework.displayName).toBe('SubmitButton');
      expect(snapshot.framework.state?.hooks).toHaveLength(2);
      expect(snapshot.geometry.visible).toBe(true);
    });

    it('should support legacy framework.name for backward compatibility', () => {
      const snapshot: SemanticSnapshot = {
        role: 'button',
        name: 'Submit',
        tagName: 'button',
        framework: {
          name: 'react',
          componentName: 'SubmitButton',
          filePath: 'src/components/SubmitButton.tsx',
          lineNumber: 42,
        },
        a11y: {
          label: 'Submit form',
          description: null,
          disabled: false,
          hidden: false,
        },
        geometry: {
          x: 100,
          y: 200,
          width: 120,
          height: 40,
          visible: true,
        },
        styles: {
          display: 'inline-flex',
          position: 'relative',
          padding: '8px 16px',
          margin: '0px',
          color: 'rgb(255, 255, 255)',
          backgroundColor: 'rgb(59, 130, 246)',
          fontFamily: 'Inter, sans-serif',
          zIndex: 'auto',
        },
        timestamp: Date.now(),
        url: 'http://localhost:3000/',
      };

      expect(snapshot.framework.name).toBe('react');
      expect(snapshot.framework.componentName).toBe('SubmitButton');
      expect(snapshot.a11y?.disabled).toBe(false);
    });

    it('should support optional fields', () => {
      const snapshot: SemanticSnapshot = {
        role: 'generic',
        name: '',
        tagName: 'div',
        id: 'my-div',
        className: 'container main',
        dataAttributes: { 'data-testid': 'main-container' },
        framework: {
          type: 'vanilla',
        },
        a11y: {
          label: null,
          description: null,
          disabled: false,
          expanded: true,
          checked: 'mixed',
          hidden: false,
        },
        geometry: {
          x: 0,
          y: 0,
          width: 800,
          height: 600,
          visible: true,
        },
        styles: {
          display: 'block',
          position: 'static',
          padding: '0px',
          margin: '0px',
          color: 'rgb(0, 0, 0)',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          fontFamily: 'system-ui',
          zIndex: 'auto',
        },
        timestamp: Date.now(),
        url: 'http://localhost:3000/',
      };

      expect(snapshot.id).toBe('my-div');
      expect(snapshot.className).toBe('container main');
      expect(snapshot.dataAttributes).toEqual({ 'data-testid': 'main-container' });
      expect(snapshot.a11y?.expanded).toBe(true);
      expect(snapshot.a11y?.checked).toBe('mixed');
    });

    it('should support new v2.0 layers', () => {
      const causality: CausalityInfo = {
        events: {
          listeners: [
            { type: 'click', capture: false, source: 'Button.tsx:15' },
          ],
          blockingHandlers: [],
        },
        stackingContext: {
          isStackingContext: false,
          parentContext: null,
          effectiveZIndex: 0,
        },
        layoutConstraints: ['Width constrained by flex-basis'],
      };

      const perception: PerceptionInfo = {
        affordance: {
          looksInteractable: true,
          isInteractable: true,
          dissonanceScore: 0,
        },
        visibility: {
          isOccluded: false,
          effectiveOpacity: 1,
        },
        legibility: {
          contrastRatio: 7.5,
          wcagStatus: 'pass',
          effectiveBgColor: 'rgb(255, 255, 255)',
        },
        usability: {
          touchTargetSize: '120x40',
          isTouchTargetValid: false,
        },
      };

      const metal: MetalInfo = {
        pipeline: {
          layerPromoted: false,
          layoutThrashingRisk: 'none',
        },
        performance: {
          renderCount: 3,
          lastRenderReason: "Prop 'onClick' changed identity",
        },
        memory: {
          listenerCount: 1,
        },
      };

      const systemic: SystemicInfo = {
        impact: {
          importCount: 15,
          riskLevel: 'Moderate',
        },
        designSystem: {
          tokenMatches: [{ property: 'backgroundColor', token: 'blue-500' }],
          deviations: [],
        },
      };

      const snapshot: SemanticSnapshot = {
        role: 'button',
        name: 'Submit',
        tagName: 'button',
        framework: {
          type: 'react',
          displayName: 'SubmitButton',
        },
        geometry: { x: 0, y: 0, width: 120, height: 40, visible: true },
        styles: {
          display: 'inline-flex',
          position: 'relative',
          padding: '8px 16px',
          margin: '0px',
          color: 'white',
          backgroundColor: 'blue',
          fontFamily: 'sans-serif',
          zIndex: 'auto',
        },
        causality,
        perception,
        metal,
        systemic,
        timestamp: Date.now(),
        url: 'http://localhost:3000/',
      };

      expect(snapshot.causality?.events.listeners).toHaveLength(1);
      expect(snapshot.perception?.affordance.dissonanceScore).toBe(0);
      expect(snapshot.metal?.performance.renderCount).toBe(3);
      expect(snapshot.systemic?.impact.riskLevel).toBe('Moderate');
    });
  });

  describe('FocusPayload', () => {
    it('should support single snapshot (backwards compat)', () => {
      const payload: FocusPayload = {
        interactionId: 'abc-123',
        snapshot: {
          role: 'button',
          name: 'Click me',
          tagName: 'button',
          framework: { name: 'react' },
          a11y: { label: null, description: null, disabled: false, hidden: false },
          geometry: { x: 0, y: 0, width: 100, height: 40, visible: true },
          styles: {
            display: 'block',
            position: 'static',
            padding: '0px',
            margin: '0px',
            color: 'black',
            backgroundColor: 'white',
            fontFamily: 'Arial',
            zIndex: 'auto',
          },
          timestamp: Date.now(),
          url: 'http://localhost/',
        },
        userNote: 'Make this blue',
      };

      expect(payload.snapshot).toBeDefined();
      expect(payload.snapshots).toBeUndefined();
    });

    it('should support multiple snapshots (multi-select)', () => {
      const baseSnapshot = {
        role: 'button',
        name: '',
        tagName: 'button',
        framework: { type: 'react' as const },
        geometry: { x: 0, y: 0, width: 100, height: 40, visible: true },
        styles: {
          display: 'block',
          position: 'static',
          padding: '0px',
          margin: '0px',
          color: 'black',
          backgroundColor: 'white',
          fontFamily: 'Arial',
          zIndex: 'auto',
        },
        timestamp: Date.now(),
        url: 'http://localhost/',
      };

      const payload: FocusPayload = {
        interactionId: 'abc-123',
        snapshots: [
          { ...baseSnapshot, name: 'Button 1' },
          { ...baseSnapshot, name: 'Button 2' },
        ],
        userNote: 'Style these buttons consistently',
      };

      expect(payload.snapshots).toHaveLength(2);
      expect(payload.snapshot).toBeUndefined();
    });
  });

  describe('ActivityEvent types', () => {
    it('should create valid StatusEvent', () => {
      const event: StatusEvent = {
        type: 'status',
        interactionId: 'abc-123',
        status: 'fixing',
        message: 'Working on it...',
        timestamp: Date.now(),
      };

      expect(event.type).toBe('status');
      expect(event.status).toBe('fixing');
    });

    it('should create valid ThoughtEvent', () => {
      const event: ThoughtEvent = {
        type: 'thought',
        interactionId: 'abc-123',
        content: 'I need to change the background color',
        timestamp: Date.now(),
      };

      expect(event.type).toBe('thought');
      expect(event.content).toContain('background color');
    });

    it('should create valid QuestionEvent', () => {
      const event: QuestionEvent = {
        type: 'question',
        interactionId: 'abc-123',
        questionId: 'q-1',
        question: 'Which shade of blue?',
        options: [
          { id: 'light', label: 'Light blue' },
          { id: 'dark', label: 'Dark blue' },
        ],
        timestamp: Date.now(),
      };

      expect(event.type).toBe('question');
      expect(event.options).toHaveLength(2);
    });

    it('should create valid ActionEvent', () => {
      const event: ActionEvent = {
        type: 'action',
        interactionId: 'abc-123',
        action: 'writing',
        target: 'src/components/Button.tsx',
        complete: false,
        timestamp: Date.now(),
      };

      expect(event.type).toBe('action');
      expect(event.action).toBe('writing');
    });

    it('should allow ActivityEvent union', () => {
      const events: ActivityEvent[] = [
        { type: 'status', interactionId: 'a', status: 'idle', timestamp: 1 },
        { type: 'thought', interactionId: 'a', content: 'thinking', timestamp: 2 },
        { type: 'question', interactionId: 'a', questionId: 'q', question: '?', options: [], timestamp: 3 },
        { type: 'action', interactionId: 'a', action: 'reading', target: 'file.ts', timestamp: 4 },
      ];

      expect(events).toHaveLength(4);
    });
  });

  describe('Hook and Context types', () => {
    it('should support HookInfo', () => {
      const hooks: HookInfo[] = [
        { name: 'useState', value: 0, label: 'count' },
        { name: 'useEffect' },
        { name: 'useMemo', value: { cached: true } },
        { name: 'useRef', value: null },
        { name: 'useContext', value: { theme: 'dark' } },
      ];

      expect(hooks).toHaveLength(5);
      expect(hooks[0].label).toBe('count');
    });

    it('should support ContextInfo', () => {
      const contexts: ContextInfo[] = [
        { name: 'ThemeContext', value: { mode: 'dark', colors: {} } },
        { name: 'AuthContext', value: { user: null, isAuthenticated: false } },
      ];

      expect(contexts).toHaveLength(2);
      expect(contexts[0].name).toBe('ThemeContext');
    });
  });
});
