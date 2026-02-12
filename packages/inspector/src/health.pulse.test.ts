import { describe, it, expect } from 'vitest';
import { analyzeHealth, calculatePulseLevel } from './utils/health.js';
import type { SemanticSnapshot } from '@eyeglass/types';

function snapshotWith(overrides: Partial<SemanticSnapshot>): SemanticSnapshot {
  const base: SemanticSnapshot = {
    role: 'button',
    name: 'Click',
    tagName: 'button',
    framework: { type: 'react', displayName: 'Button', state: { props: {}, hooks: [], context: [] } },
    geometry: { x: 0, y: 0, width: 80, height: 30, visible: true },
    styles: {
      display: 'inline-flex',
      position: 'relative',
      padding: '8px',
      margin: '0px',
      color: '#000',
      backgroundColor: '#fff',
      fontFamily: 'sans-serif',
      zIndex: 'auto',
    },
    causality: {
      events: { listeners: [], blockingHandlers: [] },
      stackingContext: { isStackingContext: false, parentContext: null, effectiveZIndex: 0 },
      layoutConstraints: [],
    },
    perception: {
      affordance: { looksInteractable: true, isInteractable: true, dissonanceScore: 0 },
      visibility: { isOccluded: false, effectiveOpacity: 1 },
      legibility: { contrastRatio: 5, wcagStatus: 'pass', effectiveBgColor: '#fff' },
      usability: { touchTargetSize: '80x30', isTouchTargetValid: true },
    },
    metal: {
      pipeline: { layerPromoted: false, layoutThrashingRisk: 'none' },
      performance: { renderCount: 1 },
      memory: { listenerCount: 0 },
    },
    systemic: {
      impact: { importCount: 0, riskLevel: 'Local' },
      designSystem: { tokenMatches: [], deviations: [] },
    },
    timestamp: Date.now(),
    url: 'http://localhost',
  };

  return {
    ...base,
    ...overrides,
    causality: { ...base.causality, ...overrides.causality },
    perception: { ...base.perception, ...overrides.perception },
  };
}

describe('health pulse', () => {
  it('raises critical issue when ancestor is inert', () => {
    const snapshot = snapshotWith({
      causality: {
        events: {
          listeners: [],
          blockingHandlers: [{ element: 'div.card', event: 'all', reason: 'inert' }],
        },
        stackingContext: { isStackingContext: false, parentContext: null, effectiveZIndex: 0 },
        layoutConstraints: [],
      },
    });

    const issues = analyzeHealth(snapshot);
    expect(issues.some(i => i.message.includes('inert'))).toBe(true);
    expect(calculatePulseLevel(snapshot)).toBe('critical');
  });

  it('flags occluded clickable elements as warnings', () => {
    const snapshot = snapshotWith({
      perception: {
        affordance: { looksInteractable: true, isInteractable: true, dissonanceScore: 0 },
        visibility: { isOccluded: true, occludedBy: '.header', effectiveOpacity: 1 },
        legibility: { contrastRatio: 5, wcagStatus: 'pass', effectiveBgColor: '#fff' },
        usability: { touchTargetSize: '80x30', isTouchTargetValid: true },
      },
    });

    const issues = analyzeHealth(snapshot);
    expect(issues.some(i => i.message.includes('occluded'))).toBe(true);
    expect(calculatePulseLevel(snapshot)).toBe('warning');
  });
});
