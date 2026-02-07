export type InteractionStatus = 'idle' | 'pending' | 'fixing' | 'success' | 'failed';
export interface SemanticSnapshot {
    role: string;
    name: string;
    tagName: string;
    framework: {
        name: 'react' | 'vue' | 'svelte' | 'vanilla';
        componentName?: string;
        filePath?: string;
        lineNumber?: number;
        props?: Record<string, unknown>;
        ancestry?: string[];
    };
    a11y: {
        label: string | null;
        description: string | null;
        disabled: boolean;
        expanded?: boolean;
        checked?: boolean | 'mixed';
        hidden: boolean;
    };
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
    timestamp: number;
    url: string;
}
export interface FocusPayload {
    interactionId: string;
    snapshot: SemanticSnapshot;
    userNote: string;
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
