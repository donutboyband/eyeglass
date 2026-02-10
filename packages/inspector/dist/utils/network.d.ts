/**
 * Network utilities for Eyeglass Inspector
 * Handles SSE connections and API calls to the bridge server
 */
import type { SemanticSnapshot, ActivityEvent } from "@eyeglass/types";
import type { HistoryItem } from "../types.js";
export interface NetworkCallbacks {
    onActivityEvent: (event: ActivityEvent) => void;
    onReconnect: () => void;
}
/**
 * Creates and manages an SSE connection to the bridge server
 */
export declare function connectSSE(callbacks: NetworkCallbacks): EventSource;
export interface SubmitFocusParams {
    interactionId: string;
    userNote: string;
    autoCommit: boolean;
    snapshots: SemanticSnapshot[];
}
export interface SubmitFocusResult {
    success: boolean;
    error?: string;
}
/**
 * Submits a focus request to the bridge server
 */
export declare function submitFocus(params: SubmitFocusParams): Promise<SubmitFocusResult>;
/**
 * Submits an answer to a question from the agent
 */
export declare function submitAnswer(interactionId: string, questionId: string, answerId: string, answerLabel: string): Promise<void>;
export interface UndoResult {
    success: boolean;
}
/**
 * Requests to undo changes for an interaction
 */
export declare function requestUndo(interactionId: string): Promise<UndoResult>;
export interface CommitResult {
    success: boolean;
}
/**
 * Requests to commit changes for an interaction
 */
export declare function requestCommit(interactionId: string): Promise<CommitResult>;
/**
 * Builds a history item from snapshots
 */
export declare function buildHistoryItem(interactionId: string, userNote: string, snapshots: SemanticSnapshot[]): HistoryItem;
