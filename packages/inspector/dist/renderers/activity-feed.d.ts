/**
 * Activity feed rendering for Eyeglass Inspector
 */
import type { ActivityEvent, InteractionStatus } from "@eyeglass/types";
/**
 * Renders the activity feed content
 */
export declare function renderActivityFeed(activityEvents: ActivityEvent[], currentStatus: InteractionStatus): string;
/**
 * Renders a status activity item
 */
export declare function renderStatusItem(event: {
    status: InteractionStatus;
    message?: string;
}): string;
/**
 * Renders a thought activity item
 */
export declare function renderThoughtItem(event: {
    content: string;
}): string;
/**
 * Renders an action activity item
 */
export declare function renderActionItem(event: {
    action: string;
    target: string;
    complete?: boolean;
}): string;
/**
 * Renders a question activity item
 */
export declare function renderQuestionItem(event: {
    questionId: string;
    question: string;
    options: Array<{
        id: string;
        label: string;
    }>;
    timestamp: number;
    selectedAnswerId?: string;
    selectedAnswerLabel?: string;
}, _activityEvents: ActivityEvent[]): string;
