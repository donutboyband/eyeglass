import { FocusPayload, InteractionStatus, AnswerPayload } from '@eyeglass/types';
import { EventEmitter } from 'events';
export declare class ContextStore extends EventEmitter {
    private active;
    private history;
    private currentStatus;
    private pendingQuestion;
    setFocus(payload: FocusPayload): void;
    getActive(): FocusPayload | null;
    getHistory(): FocusPayload[];
    updateStatus(interactionId: string, status: InteractionStatus, message?: string): void;
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
    private writeContextFile;
}
export declare const store: ContextStore;
