import { FocusPayload, InteractionStatus, AnswerPayload } from '@eyeglass/types';
import { EventEmitter } from 'events';
export declare class ContextStore extends EventEmitter {
    private active;
    private history;
    private currentStatus;
    private pendingQuestion;
    private pendingWait;
    private commitMap;
    private pendingCommitMessage;
    setFocus(payload: FocusPayload): void;
    /**
     * Wait for a new focus request from the browser.
     * If there's already an active pending request, resolves immediately.
     * @param timeoutMs - Optional timeout in milliseconds (default: no timeout)
     */
    waitForFocus(timeoutMs?: number): Promise<FocusPayload>;
    /**
     * Check if an agent is currently waiting for a request
     */
    isWaitingForFocus(): boolean;
    getActive(): FocusPayload | null;
    getHistory(): FocusPayload[];
    updateStatus(interactionId: string, status: InteractionStatus, message?: string): void;
    /**
     * Commit all staged and unstaged changes with the interaction ID
     */
    private commitChanges;
    /**
     * Undo changes for a specific interaction by reverting its commit
     */
    undoInteraction(interactionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private revertCommit;
    /**
     * Manually commit changes for an interaction (when autoCommit is disabled)
     */
    manualCommit(interactionId: string): {
        success: boolean;
        message: string;
    };
    /**
     * Discard uncommitted changes for an interaction (when autoCommit is disabled)
     */
    discardChanges(interactionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendThought(interactionId: string, content: string): void;
    reportAction(interactionId: string, action: 'reading' | 'writing' | 'searching' | 'thinking', target: string, complete?: boolean): void;
    askQuestion(interactionId: string, questionId: string, question: string, options: Array<{
        id: string;
        label: string;
    }>): Promise<AnswerPayload>;
    receiveAnswer(answer: AnswerPayload): boolean;
    hasPendingQuestion(): boolean;
    private emitActivity;
    formatAsMarkdown(): string;
    private formatSingleSnapshot;
    private formatMultipleSnapshots;
    private writeContextFile;
}
export declare const store: ContextStore;
