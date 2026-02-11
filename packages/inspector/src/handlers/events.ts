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
export function createMouseMoveHandler(
  host: HTMLElement,
  shadow: ShadowRoot,
  getState: () => MouseMoveHandlerState,
  callbacks: MouseMoveHandlerCallbacks
): (e: MouseEvent) => void {
  return (e: MouseEvent) => {
    const state = getState();

    // In multi-select mode, continue raycasting even when frozen
    if (!state.multiSelectMode && state.frozen) return;
    if (!state.inspectorEnabled) return;

    // Don't raycast if hovering over our own UI (hub, panel, etc.)
    // When pointer-events: auto elements in our shadow DOM are hovered,
    // the host element will be in the composed path
    const path = e.composedPath();
    if (path.includes(host)) {
      callbacks.hideHighlight();
      return;
    }

    if (state.throttleTimeout) return;
    callbacks.setThrottleTimeout(
      window.setTimeout(() => {
        callbacks.setThrottleTimeout(null);
      }, 16)
    );

    host.style.pointerEvents = "none";
    const target = document.elementFromPoint(e.clientX, e.clientY);
    host.style.pointerEvents = "";

    if (
      !target ||
      target === document.documentElement ||
      target === document.body
    ) {
      callbacks.hideHighlight();
      return;
    }

    if (shadow.contains(target as Node)) return;

    callbacks.setCurrentElement(target);
    callbacks.showHighlight(target);
  };
}

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
export function createClickHandler(
  host: HTMLElement,
  getState: () => ClickHandlerState,
  callbacks: ClickHandlerCallbacks
): (e: MouseEvent) => void {
  return (e: MouseEvent) => {
    const state = getState();

    if (!state.inspectorEnabled) return;
    if (!state.currentElement) return;

    const path = e.composedPath();
    if (path.some((el) => el === host)) return;

    e.preventDefault();
    e.stopPropagation();

    // In multi-select mode, add/toggle element in selection
    if (state.multiSelectMode) {
      callbacks.toggleInSelection(state.currentElement);
      return;
    }

    // Normal single-select behavior
    if (state.frozen) return;
    callbacks.freeze();
  };
}

export interface KeyDownHandlerState {
  frozen: boolean;
}

export interface KeyDownHandlerCallbacks {
  unfreeze: () => void;
  toggleInspectorEnabled: () => void;
}

/**
 * Creates a keydown handler function
 *
 * Keyboard shortcuts:
 * - Escape: Close panel / unfreeze
 * - Ctrl/Cmd + Shift + E: Toggle inspector enabled
 */
export function createKeyDownHandler(
  getState: () => KeyDownHandlerState,
  callbacks: KeyDownHandlerCallbacks
): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    const state = getState();

    // Escape to close panel (only when panel is open)
    if (e.key === "Escape" && state.frozen) {
      e.preventDefault();
      callbacks.unfreeze();
    }

    // Ctrl/Cmd + Shift + E to toggle inspector
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modifierKey = isMac ? e.metaKey : e.ctrlKey;
    if (modifierKey && e.shiftKey && e.key.toLowerCase() === "e") {
      e.preventDefault();
      callbacks.toggleInspectorEnabled();
    }
  };
}

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
export function createScrollHandler(
  getState: () => ScrollHandlerState,
  callbacks: ScrollHandlerCallbacks
): () => void {
  return () => {
    const state = getState();

    if (!state.frozen) return;

    // Disable transitions during scroll for instant updates
    callbacks.disableHighlightTransitions();

    // Update single highlight position
    if (state.currentElement && state.highlight && !state.multiSelectMode) {
      callbacks.showHighlight(state.currentElement);
    }

    // Update multi-select highlights
    if (state.multiSelectMode && state.selectedElements.length > 0) {
      callbacks.updateMultiSelectHighlightPositions();
    }

    // Re-enable transitions after scrolling stops
    if (state.scrollTimeout) {
      window.clearTimeout(state.scrollTimeout);
    }
    callbacks.setScrollTimeout(
      window.setTimeout(() => {
        callbacks.enableHighlightTransitions();
        callbacks.setScrollTimeout(null);
      }, 150)
    );
  };
}
