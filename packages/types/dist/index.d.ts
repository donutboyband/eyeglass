export type InteractionStatus = 'idle' | 'pending' | 'fixing' | 'success' | 'failed';
export type PulseLevel = 'healthy' | 'warning' | 'critical';
export interface HookInfo {
    name: string;
    value?: unknown;
    label?: string;
}
export interface ContextInfo {
    name: string;
    value: unknown;
}
export interface ReactState {
    props: Record<string, unknown>;
    hooks: HookInfo[];
    context: ContextInfo[];
}
export interface EventListener {
    type: string;
    capture: boolean;
    source?: string;
}
export interface BlockingHandler {
    element: string;
    event: string;
    reason: 'stopPropagation' | 'pointer-events:none' | 'captured' | 'visibility:hidden' | 'opacity:0' | 'inert';
}
export interface StackingContext {
    isStackingContext: boolean;
    parentContext: string | null;
    reason?: string;
    effectiveZIndex: number;
}
export interface CausalityInfo {
    events: {
        listeners: EventListener[];
        blockingHandlers: BlockingHandler[];
    };
    stackingContext: StackingContext;
    layoutConstraints: string[];
}
export interface AffordanceInfo {
    looksInteractable: boolean;
    isInteractable: boolean;
    dissonanceScore: number;
}
export interface VisibilityInfo {
    isOccluded: boolean;
    occludedBy?: string;
    effectiveOpacity: number;
}
export interface LegibilityInfo {
    contrastRatio: number;
    wcagStatus: 'pass' | 'fail';
    effectiveBgColor: string;
}
export interface UsabilityInfo {
    touchTargetSize: string;
    isTouchTargetValid: boolean;
}
export interface PerceptionInfo {
    affordance: AffordanceInfo;
    visibility: VisibilityInfo;
    legibility: LegibilityInfo;
    usability: UsabilityInfo;
}
export interface PipelineInfo {
    layerPromoted: boolean;
    layoutThrashingRisk: 'none' | 'low' | 'high';
}
export interface PerformanceInfo {
    renderCount: number;
    lastRenderReason?: string;
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
export interface ImpactInfo {
    importCount?: number;
    riskLevel: 'Local' | 'Moderate' | 'Critical';
}
export interface TokenMatch {
    property: string;
    token: string;
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
export interface InteractionStateInfo {
    variant?: string;
    label?: string;
    domPaused?: boolean;
    capturedAt: number;
}
export interface A11yInfo {
    label: string | null;
    description: string | null;
    disabled: boolean;
    expanded?: boolean;
    checked?: boolean | 'mixed';
    hidden: boolean;
}
export interface SemanticSnapshot {
    role: string;
    name: string;
    tagName: string;
    id?: string;
    className?: string;
    dataAttributes?: Record<string, string>;
    framework: {
        type?: 'react' | 'vanilla';
        displayName?: string;
        key?: string | null;
        name?: 'react' | 'vue' | 'svelte' | 'vanilla';
        componentName?: string;
        filePath?: string;
        lineNumber?: number;
        ancestry?: string[];
        props?: Record<string, unknown>;
        state?: ReactState;
    };
    a11y?: A11yInfo;
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
    causality?: CausalityInfo;
    perception?: PerceptionInfo;
    metal?: MetalInfo;
    systemic?: SystemicInfo;
    interactionState?: InteractionStateInfo;
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
            count?: number;
        }>;
    };
    timestamp: number;
    url: string;
}
export interface FocusPayload {
    interactionId: string;
    snapshot?: SemanticSnapshot;
    snapshots?: SemanticSnapshot[];
    userNote: string;
    autoCommit?: boolean;
}
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
    options: Array<{
        id: string;
        label: string;
    }>;
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
export interface StatusUpdate {
    interactionId: string;
    status: InteractionStatus;
    agentMessage?: string;
}
