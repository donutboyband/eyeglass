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
    showHighlight: (element: Element, event?: MouseEvent) => void;
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
export interface KeyDownHandlerState {
    frozen: boolean;
    multiSelectMode: boolean;
    inspectorEnabled: boolean;
}
export interface KeyDownHandlerCallbacks {
    unfreeze: () => void;
    toggleInspectorEnabled: () => void;
    toggleContextOverlays: () => void;
    toggleMultiSelect: () => void;
    submitShortcut: () => void;
    rotateInteractionState: () => void;
    captureStateCapsule: () => void;
    toggleDomPause: () => void;
}
/**
 * Creates a keydown handler function
 *
 * Keyboard shortcuts:
 * - Escape: Close panel / unfreeze
 * - Ctrl/Cmd + Shift + E: Toggle inspector enabled
 * - Ctrl/Cmd + Shift + M: Toggle multi-select (when frozen)
 * - Ctrl/Cmd + Shift + C: Toggle context overlays (when frozen)
 * - Ctrl/Cmd + Enter: Submit current note (when frozen and input has value)
 */
export declare function createKeyDownHandler(getState: () => KeyDownHandlerState, callbacks: KeyDownHandlerCallbacks): (e: KeyboardEvent) => void;
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
