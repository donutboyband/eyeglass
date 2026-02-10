/**
 * Event handlers for Eyeglass Inspector
 */
export interface MouseMoveHandlerState {
    frozen: boolean;
    multiSelectMode: boolean;
    inspectorEnabled: boolean;
    throttleTimeout: number | null;
}
export interface MouseMoveHandlerCallbacks {
    setThrottleTimeout: (timeout: number | null) => void;
    hideHighlight: () => void;
    showHighlight: (element: Element) => void;
    setCurrentElement: (element: Element | null) => void;
}
/**
 * Creates a mouse move handler function
 */
export declare function createMouseMoveHandler(host: HTMLElement, shadow: ShadowRoot, getState: () => MouseMoveHandlerState, callbacks: MouseMoveHandlerCallbacks): (e: MouseEvent) => void;
export interface ClickHandlerState {
    inspectorEnabled: boolean;
    currentElement: Element | null;
    frozen: boolean;
    multiSelectMode: boolean;
}
export interface ClickHandlerCallbacks {
    toggleInSelection: (element: Element) => void;
    freeze: () => void;
}
/**
 * Creates a click handler function
 */
export declare function createClickHandler(host: HTMLElement, getState: () => ClickHandlerState, callbacks: ClickHandlerCallbacks): (e: MouseEvent) => void;
export interface KeyDownHandlerCallbacks {
    unfreeze: () => void;
}
/**
 * Creates a keydown handler function
 */
export declare function createKeyDownHandler(callbacks: KeyDownHandlerCallbacks): (e: KeyboardEvent) => void;
export interface ScrollHandlerState {
    frozen: boolean;
    currentElement: Element | null;
    highlight: HTMLDivElement | null;
    multiSelectMode: boolean;
    selectedElements: Element[];
    scrollTimeout: number | null;
}
export interface ScrollHandlerCallbacks {
    showHighlight: (element: Element) => void;
    updateMultiSelectHighlightPositions: () => void;
    disableHighlightTransitions: () => void;
    enableHighlightTransitions: () => void;
    setScrollTimeout: (timeout: number | null) => void;
}
/**
 * Creates a scroll handler function
 */
export declare function createScrollHandler(getState: () => ScrollHandlerState, callbacks: ScrollHandlerCallbacks): () => void;
