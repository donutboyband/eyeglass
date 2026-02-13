/**
 * Internal types for Eyeglass Inspector
 */
import type { InteractionStatus, SemanticSnapshot, ActivityEvent } from "@eyeglass/types";
import type { HealthIssue } from "./utils/health.js";
export type PanelMode = "input" | "activity";
export type ThemePreference = "light" | "dark" | "auto";
export type HubPage = "main" | "settings";
export interface PersistedSession {
    interactionId: string;
    userNote: string;
    componentName: string;
    status: InteractionStatus;
    message?: string;
    timestamp: number;
}
export interface HistoryItem {
    interactionId: string;
    userNote: string;
    componentName: string;
    filePath?: string;
    status: InteractionStatus;
    timestamp: number;
}
export interface StateCapsule {
    id: string;
    variant: string;
    label: string;
    snapshot: SemanticSnapshot;
    capturedAt: number;
}
/**
 * State interface for the inspector that modules can access
 */
export interface InspectorState {
    shadow: ShadowRoot;
    highlight: HTMLDivElement | null;
    panel: HTMLDivElement | null;
    toast: HTMLDivElement | null;
    hub: HTMLDivElement | null;
    currentElement: Element | null;
    currentSnapshot: SemanticSnapshot | null;
    interactionId: string | null;
    frozen: boolean;
    mode: PanelMode;
    activityEvents: ActivityEvent[];
    currentStatus: InteractionStatus;
    currentStatusMessage?: string | null;
    hubExpanded: boolean;
    hubPage: HubPage;
    inspectorEnabled: boolean;
    autoCommitEnabled: boolean;
    themePreference: ThemePreference;
    history: HistoryItem[];
    isDragging: boolean;
    dragOffset: {
        x: number;
        y: number;
    };
    customPanelPosition: {
        x: number;
        y: number;
    } | null;
    customLensPosition?: {
        x: number;
        y: number;
    } | null;
    multiSelectMode: boolean;
    selectedElements: Element[];
    selectedSnapshots: SemanticSnapshot[];
    multiSelectHighlights: HTMLDivElement[];
    submittedSnapshots: SemanticSnapshot[];
    stateCapsules: StateCapsule[];
    activeCapsuleId: string | null;
    interactionStateLabel: string;
    domPaused: boolean;
    cursorStyleElement: HTMLStyleElement | null;
    throttleTimeout: number | null;
    scrollTimeout: number | null;
    phraseIndex: number;
    phraseInterval: number | null;
    _userNote: string;
    eventSource: EventSource | null;
    frozenHealthIssues: HealthIssue[];
}
/**
 * Callbacks interface for renderers to invoke inspector methods
 */
export interface InspectorCallbacks {
    unfreeze: () => void;
    submit: (userNote: string) => void;
    submitFollowUp: (userNote: string) => void;
    submitAnswer: (questionId: string, answerId: string, answerLabel: string) => void;
    requestUndo: (interactionId: string) => void;
    requestCommit: (interactionId: string) => void;
    enterMultiSelectMode: () => void;
    exitMultiSelectMode: () => void;
    removeFromSelection: (index: number) => void;
    toggleHubExpanded: () => void;
    toggleInspectorEnabled: () => void;
    openSettingsPage: () => void;
    closeSettingsPage: () => void;
    setTheme: (theme: ThemePreference) => void;
    toggleAutoCommit: () => void;
    handlePanelDragStart: (e: MouseEvent) => void;
    renderHub: () => void;
    renderPanel: () => void;
    captureStateCapsule: () => void;
    selectStateCapsule: (id: string) => void;
    deleteStateCapsule: (id: string) => void;
    rotateInteractionState: () => void;
    toggleDomPause: () => void;
}
