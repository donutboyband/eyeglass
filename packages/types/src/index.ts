export type InteractionStatus = 'idle' | 'pending' | 'fixing' | 'success' | 'failed';

// Health indicator for the Loupe pulse dot
export type PulseLevel = 'healthy' | 'warning' | 'critical';

// --- LAYER 2: STATE (React) Types ---
export interface HookInfo {
  name: string;     // e.g., "useState", "useEffect", "useMemo"
  value?: unknown;  // Current runtime value (serializable primitives only)
  label?: string;   // Heuristic label if detectable (e.g., variable name)
}

export interface ContextInfo {
  name: string;     // e.g., "ThemeProvider", "AuthContext"
  value: unknown;   // The context value provided
}

export interface ReactState {
  props: Record<string, unknown>;
  hooks: HookInfo[];
  context: ContextInfo[];
}

// --- LAYER 4: CAUSAL Types ---
export interface EventListener {
  type: string;       // e.g., "click", "mousedown"
  capture: boolean;
  source?: string;    // Source file if traceable
}

export interface BlockingHandler {
  element: string;    // Selector of blocking ancestor
  event: string;
  reason: 'stopPropagation' | 'pointer-events:none' | 'captured';
}

export interface StackingContext {
  isStackingContext: boolean;
  parentContext: string | null; // Selector of ancestor creating context
  reason?: string;              // e.g., "transform", "opacity", "z-index"
  effectiveZIndex: number;      // Calculated relative to root
}

export interface CausalityInfo {
  events: {
    listeners: EventListener[];
    blockingHandlers: BlockingHandler[];
  };
  stackingContext: StackingContext;
  layoutConstraints: string[]; // e.g., "Width constrained by flex-basis"
}

// --- LAYER 5: PERCEPTUAL Types ---
export interface AffordanceInfo {
  looksInteractable: boolean; // Has cursor:pointer / color:blue / underline
  isInteractable: boolean;    // Has listener / is button/a/input
  dissonanceScore: number;    // 0.0 - 1.0 (Confusion metric)
}

export interface VisibilityInfo {
  isOccluded: boolean;
  occludedBy?: string;        // Selector of element covering this one
  effectiveOpacity: number;
}

export interface LegibilityInfo {
  contrastRatio: number;
  wcagStatus: 'pass' | 'fail';
  effectiveBgColor: string;
}

export interface UsabilityInfo {
  touchTargetSize: string;    // e.g., "48x32"
  isTouchTargetValid: boolean; // >= 44px in both dimensions
}

export interface PerceptionInfo {
  affordance: AffordanceInfo;
  visibility: VisibilityInfo;
  legibility: LegibilityInfo;
  usability: UsabilityInfo;
}

// --- LAYER 6: METAL Types ---
export interface PipelineInfo {
  layerPromoted: boolean;     // On GPU layer?
  layoutThrashingRisk: 'none' | 'low' | 'high';
}

export interface PerformanceInfo {
  renderCount: number;        // React Fiber renders
  lastRenderReason?: string;  // e.g., "Prop 'style' changed identity"
}

export interface MemoryInfo {
  detachedNodesRetained?: number;
  listenerCount: number;
}

export interface MetalInfo {
  pipeline: PipelineInfo;
  performance: PerformanceInfo;
  memory: MemoryInfo;
}

// --- LAYER 7: SYSTEMIC Types ---
export interface ImpactInfo {
  importCount?: number;       // How many files import this component?
  riskLevel: 'Local' | 'Moderate' | 'Critical';
}

export interface TokenMatch {
  property: string;  // CSS property, e.g., "color"
  token: string;     // Design token name, e.g., "blue-500"
}

export interface TokenDeviation {
  property: string;
  value: string;
  suggestion: string;
}

export interface DesignSystemInfo {
  tokenMatches: TokenMatch[];
  deviations: TokenDeviation[];
}

export interface SystemicInfo {
  impact: ImpactInfo;
  designSystem: DesignSystemInfo;
}

// --- ACCESSIBILITY Types (for backward compat) ---
export interface A11yInfo {
  label: string | null;
  description: string | null;
  disabled: boolean;
  expanded?: boolean;
  checked?: boolean | 'mixed';
  hidden: boolean;
}

// --- MAIN SEMANTIC SNAPSHOT ---
export interface SemanticSnapshot {
  // --- LAYER 1: CODE (Identity) ---
  role: string;           // ARIA role (button, link, textbox, etc.)
  name: string;           // Accessible name
  tagName: string;        // HTML tag
  id?: string;            // Element ID
  className?: string;     // CSS classes
  dataAttributes?: Record<string, string>;

  // --- LAYER 2: STATE (React Brain) ---
  framework: {
    // New 2.0 fields
    type?: 'react' | 'vanilla';  // Strictly React focused in 2.0
    displayName?: string;        // e.g., "SubmitButton"
    key?: string | null;         // React key (critical for list bugs)

    // Legacy fields (for backward compat)
    name?: 'react' | 'vue' | 'svelte' | 'vanilla';  // @deprecated - use type
    componentName?: string;       // @deprecated - use displayName

    filePath?: string;           // e.g., "src/components/Button.tsx"
    lineNumber?: number;
    ancestry?: string[];         // Parent component chain, e.g., ['Card', 'App']
    props?: Record<string, unknown>;  // Legacy props location

    // The "Live Logic" - only present for React (2.0)
    state?: ReactState;
  };

  // --- ACCESSIBILITY (Layer 1 extension / backward compat) ---
  a11y?: A11yInfo;

  // --- LAYER 3: VISUAL (Render Tree) ---
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
  };

  styles: {
    display: string;
    position: string;
    flexDirection?: string;
    gridTemplate?: string;
    padding: string;
    margin: string;
    color: string;
    backgroundColor: string;
    fontFamily: string;
    zIndex: string;
  };

  // --- LAYER 4: CAUSAL (The "Why") ---
  causality?: CausalityInfo;

  // --- LAYER 5: PERCEPTUAL (The Human Eye) ---
  perception?: PerceptionInfo;

  // --- LAYER 6: METAL (Hardware Reality) ---
  metal?: MetalInfo;

  // --- LAYER 7: SYSTEMIC (Architectural Impact) ---
  systemic?: SystemicInfo;

  // --- DOM Neighborhood (Layout Context) ---
  neighborhood?: {
    parents: Array<{
      tagName: string;
      className?: string;
      styles: {
        display: string;
        position: string;
        flexDirection?: string;
        alignItems?: string;
        justifyContent?: string;
        gap?: string;
        gridTemplate?: string;
      };
    }>;
    children: Array<{
      tagName: string;
      className?: string;
      count?: number; // If multiple similar children, group them
    }>;
  };

  // Metadata
  timestamp: number;
  url: string;
}

// --- FOCUS PAYLOAD ---
export interface FocusPayload {
  interactionId: string;
  snapshot?: SemanticSnapshot;      // Single (backwards compat)
  snapshots?: SemanticSnapshot[];   // Multiple (for multi-select)
  userNote: string;
  autoCommit?: boolean;             // Whether to auto-commit changes on success
}

// --- ACTIVITY EVENTS ---
export type ActivityEventType = 'status' | 'thought' | 'question' | 'action';

export interface BaseActivityEvent {
  interactionId: string;
  timestamp: number;
}

export interface StatusEvent extends BaseActivityEvent {
  type: 'status';
  status: InteractionStatus;
  message?: string;
}

export interface ThoughtEvent extends BaseActivityEvent {
  type: 'thought';
  content: string;
}

export interface QuestionEvent extends BaseActivityEvent {
  type: 'question';
  questionId: string;
  question: string;
  options: Array<{ id: string; label: string }>;
}

export interface AnswerPayload {
  interactionId: string;
  questionId: string;
  answerId: string;
  answerLabel: string;
}

export interface ActionEvent extends BaseActivityEvent {
  type: 'action';
  action: 'reading' | 'writing' | 'searching' | 'thinking';
  target: string;
  complete?: boolean;
}

export type ActivityEvent = StatusEvent | ThoughtEvent | QuestionEvent | ActionEvent;

// Legacy compat
export interface StatusUpdate {
  interactionId: string;
  status: InteractionStatus;
  agentMessage?: string;
}
