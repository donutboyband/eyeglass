import { describe, it, expect } from 'vitest';
import { renderLensCard } from './renderers/lens.js';
import type { SemanticSnapshot } from '@eyeglass/types';
import type { InspectorState, InspectorCallbacks } from './types.js';
import { analyzeHealth } from './utils/health.js';

function buildState(snapshot: Partial<SemanticSnapshot>): InspectorState {
  const baseSnapshot: SemanticSnapshot = {
    role: 'button',
    name: 'Click',
    tagName: 'button',
    framework: { type: 'react', displayName: 'Button', state: { props: {}, hooks: [], context: [] } },
    geometry: { x: 0, y: 0, width: 100, height: 40, visible: true },
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
      usability: { touchTargetSize: '100x40', isTouchTargetValid: true },
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

  const merged: SemanticSnapshot = {
    ...baseSnapshot,
    ...snapshot,
    framework: { ...baseSnapshot.framework, ...snapshot.framework },
    systemic: {
      ...baseSnapshot.systemic!,
      ...snapshot.systemic,
      impact: {
        ...baseSnapshot.systemic!.impact,
        ...snapshot.systemic?.impact,
      },
      designSystem: {
        ...baseSnapshot.systemic!.designSystem,
        ...snapshot.systemic?.designSystem,
      },
    },
    perception: {
      ...baseSnapshot.perception!,
      ...snapshot.perception,
      affordance: {
        ...baseSnapshot.perception!.affordance,
        ...snapshot.perception?.affordance,
      },
      visibility: {
        ...baseSnapshot.perception!.visibility,
        ...snapshot.perception?.visibility,
      },
      legibility: {
        ...baseSnapshot.perception!.legibility,
        ...snapshot.perception?.legibility,
      },
      usability: {
        ...baseSnapshot.perception!.usability,
        ...snapshot.perception?.usability,
      },
    },
    causality: {
      ...baseSnapshot.causality!,
      ...snapshot.causality,
      events: {
        ...baseSnapshot.causality!.events,
        ...snapshot.causality?.events,
      },
    },
  };

  const state: InspectorState = {
    shadow: {} as ShadowRoot,
    highlight: null,
    panel: null,
    toast: null,
    hub: null,
    currentElement: document.createElement('div'),
    currentSnapshot: merged,
    interactionId: null,
    frozen: true,
    mode: 'input',
    activityEvents: [],
    currentStatus: 'idle',
    currentStatusMessage: null,
    hubExpanded: false,
    hubPage: 'main',
    inspectorEnabled: true,
    autoCommitEnabled: true,
    themePreference: 'auto',
    history: [],
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    customPanelPosition: null,
    customLensPosition: null,
    multiSelectMode: false,
    selectedElements: [],
    selectedSnapshots: [],
    multiSelectHighlights: [],
    submittedSnapshots: [],
    stateCapsules: [],
    activeCapsuleId: null,
    interactionStateLabel: 'default',
    domPaused: false,
    cursorStyleElement: null,
    throttleTimeout: null,
    scrollTimeout: null,
    phraseIndex: 0,
    phraseInterval: null,
    _userNote: '',
    eventSource: null,
    frozenHealthIssues: analyzeHealth(merged),
  };

  return state;
}

const noopCallbacks: InspectorCallbacks = {
  unfreeze: () => {},
  submit: () => {},
  submitFollowUp: () => {},
  submitAnswer: () => {},
  requestUndo: () => {},
  requestCommit: () => {},
  enterMultiSelectMode: () => {},
  exitMultiSelectMode: () => {},
  removeFromSelection: () => {},
  toggleHubExpanded: () => {},
  toggleInspectorEnabled: () => {},
  openSettingsPage: () => {},
  closeSettingsPage: () => {},
  setTheme: () => {},
  toggleAutoCommit: () => {},
  handlePanelDragStart: () => {},
  renderHub: () => {},
  renderPanel: () => {},
  captureStateCapsule: () => {},
  selectStateCapsule: () => {},
  deleteStateCapsule: () => {},
  rotateInteractionState: () => {},
  toggleDomPause: () => {},
};

describe('Lens systemic impact', () => {
  it('renders import count and risk badge when systemic impact present', () => {
    const state = buildState({
      systemic: {
        impact: { importCount: 7, riskLevel: 'Moderate' },
        designSystem: { tokenMatches: [], deviations: [] },
      },
    });

    const html = renderLensCard(state, noopCallbacks);
    expect(html).toContain('7 imports');
    expect(html).toContain('lens-risk-badge moderate');
  });
});
