/**
 * Panel rendering for Eyeglass Inspector
 */
import type { SemanticSnapshot, InteractionStatus, ActivityEvent } from "@eyeglass/types";
import type { PanelMode } from "../types.js";
export interface PanelPosition {
    x: number;
    y: number;
}
/**
 * Calculates the panel position based on the element and window dimensions
 */
export declare function calculatePanelPosition(elementRect: DOMRect, mode: PanelMode, customPosition: PanelPosition | null): PanelPosition;
export interface InputModeState {
    componentName: string;
    filePath: string | null;
    multiSelectMode: boolean;
    selectedSnapshots: SemanticSnapshot[];
}
export interface InputModeCallbacks {
    onClose: () => void;
    onSubmit: (userNote: string) => void;
    onToggleMultiSelect: () => void;
    onRemoveFromSelection: (index: number) => void;
    onPanelDragStart: (e: MouseEvent) => void;
}
/**
 * Renders the input mode panel content and wires up event handlers
 */
export declare function renderInputMode(panel: HTMLDivElement, state: InputModeState, callbacks: InputModeCallbacks): void;
export interface ActivityModeState {
    componentName: string;
    filePath: string | null;
    submittedSnapshots: SemanticSnapshot[];
    activityEvents: ActivityEvent[];
    currentStatus: InteractionStatus;
    autoCommitEnabled: boolean;
    userNote: string;
    interactionId: string | null;
    phraseIndex: number;
}
export interface ActivityModeCallbacks {
    onClose: () => void;
    onSubmitFollowUp: (userNote: string) => void;
    onSubmitAnswer: (questionId: string, answerId: string, answerLabel: string) => void;
    onCommit: () => void;
    onUndo: () => void;
    onPanelDragStart: (e: MouseEvent) => void;
}
/**
 * Renders the activity mode panel content and wires up event handlers
 */
export declare function renderActivityMode(panel: HTMLDivElement, state: ActivityModeState, callbacks: ActivityModeCallbacks): void;
/**
 * Updates just the status text in the footer (for phrase rotation)
 */
export declare function updateFooterStatusText(panel: HTMLDivElement | null, status: InteractionStatus, phraseIndex: number): void;
