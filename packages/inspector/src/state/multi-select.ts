/**
 * Multi-select state management for Eyeglass Inspector
 */

import type { SemanticSnapshot } from "@eyeglass/types";
import { MAX_SELECTION } from "../constants.js";
import { captureSnapshot } from "../snapshot.js";

export interface MultiSelectState {
  multiSelectMode: boolean;
  selectedElements: Element[];
  selectedSnapshots: SemanticSnapshot[];
  multiSelectHighlights: HTMLDivElement[];
  currentElement: Element | null;
  currentSnapshot: SemanticSnapshot | null;
}

export interface MultiSelectCallbacks {
  updateCursor: () => void;
  renderPanel: () => void;
  showHighlight: (element: Element) => void;
}

/**
 * Enters multi-select mode
 */
export function enterMultiSelectMode(
  state: MultiSelectState,
  shadow: ShadowRoot,
  callbacks: MultiSelectCallbacks
): MultiSelectState {
  if (!state.currentElement || state.multiSelectMode) {
    return state;
  }

  const newState = {
    ...state,
    multiSelectMode: true,
  };

  // Render highlight for the first selected element
  renderMultiSelectHighlights(newState, shadow);
  callbacks.updateCursor();
  callbacks.renderPanel();

  return newState;
}

/**
 * Exits multi-select mode
 */
export function exitMultiSelectMode(
  state: MultiSelectState,
  shadow: ShadowRoot,
  callbacks: MultiSelectCallbacks
): MultiSelectState {
  // Keep the first selected element as the current single selection
  const currentElement = state.selectedElements.length > 0 ? state.selectedElements[0] : null;
  const currentSnapshot = state.selectedSnapshots.length > 0 ? state.selectedSnapshots[0] : null;

  // Clear multi-select highlights
  clearMultiSelectHighlights(state, shadow);

  const newState: MultiSelectState = {
    multiSelectMode: false,
    currentElement,
    currentSnapshot,
    selectedElements: currentElement ? [currentElement] : [],
    selectedSnapshots: currentSnapshot ? [currentSnapshot] : [],
    multiSelectHighlights: [],
  };

  // Show single highlight for current element
  if (currentElement) {
    callbacks.showHighlight(currentElement);
  }
  callbacks.updateCursor();
  callbacks.renderPanel();

  return newState;
}

/**
 * Toggles an element in the selection
 */
export function toggleInSelection(
  state: MultiSelectState,
  element: Element,
  shadow: ShadowRoot,
  callbacks: MultiSelectCallbacks
): MultiSelectState {
  if (!state.multiSelectMode) {
    return state;
  }

  // Check if element is already selected (by reference)
  const existingIndex = state.selectedElements.indexOf(element);

  let newState: MultiSelectState;

  if (existingIndex >= 0) {
    // Remove from selection
    newState = removeFromSelectionByIndex(state, existingIndex, shadow, callbacks);
  } else {
    // Add to selection (if under limit)
    if (state.selectedElements.length >= MAX_SELECTION) {
      // Could show a toast/warning, for now just ignore
      return state;
    }

    const snapshot = captureSnapshot(element);
    newState = {
      ...state,
      selectedElements: [...state.selectedElements, element],
      selectedSnapshots: [...state.selectedSnapshots, snapshot],
    };

    renderMultiSelectHighlights(newState, shadow);
    callbacks.renderPanel();
  }

  return newState;
}

/**
 * Removes an element from the selection by index
 */
export function removeFromSelectionByIndex(
  state: MultiSelectState,
  index: number,
  shadow: ShadowRoot,
  callbacks: MultiSelectCallbacks
): MultiSelectState {
  if (index < 0 || index >= state.selectedElements.length) {
    return state;
  }

  // Don't allow removing the last element
  if (state.selectedElements.length === 1) {
    return exitMultiSelectMode(state, shadow, callbacks);
  }

  const newSelectedElements = [...state.selectedElements];
  const newSelectedSnapshots = [...state.selectedSnapshots];
  newSelectedElements.splice(index, 1);
  newSelectedSnapshots.splice(index, 1);

  const newState: MultiSelectState = {
    ...state,
    selectedElements: newSelectedElements,
    selectedSnapshots: newSelectedSnapshots,
  };

  renderMultiSelectHighlights(newState, shadow);
  callbacks.renderPanel();

  return newState;
}

/**
 * Renders multi-select highlights in the shadow DOM
 */
export function renderMultiSelectHighlights(
  state: MultiSelectState,
  shadow: ShadowRoot
): HTMLDivElement[] {
  // Clear existing multi-select highlights
  state.multiSelectHighlights.forEach((h) => h.remove());

  const newHighlights: HTMLDivElement[] = [];
  const padding = 3;

  state.selectedElements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const highlight = document.createElement("div");
    highlight.className = "highlight multi";
    highlight.style.display = "block";
    highlight.style.left = `${rect.left - padding}px`;
    highlight.style.top = `${rect.top - padding}px`;
    highlight.style.width = `${rect.width + padding * 2}px`;
    highlight.style.height = `${rect.height + padding * 2}px`;

    // Add numbered badge
    const badge = document.createElement("div");
    badge.className = "highlight-badge";
    badge.textContent = String(index + 1);
    highlight.appendChild(badge);

    shadow.appendChild(highlight);
    newHighlights.push(highlight);
  });

  return newHighlights;
}

/**
 * Clears all multi-select highlights from the shadow DOM
 */
export function clearMultiSelectHighlights(
  state: MultiSelectState,
  shadow: ShadowRoot
): void {
  state.multiSelectHighlights.forEach((h) => h.remove());
}

/**
 * Updates multi-select highlight positions (called during scroll)
 */
export function updateMultiSelectHighlightPositions(
  selectedElements: Element[],
  multiSelectHighlights: HTMLDivElement[]
): void {
  const padding = 3;
  selectedElements.forEach((element, index) => {
    const highlight = multiSelectHighlights[index];
    if (!highlight) return;

    const rect = element.getBoundingClientRect();
    highlight.style.left = `${rect.left - padding}px`;
    highlight.style.top = `${rect.top - padding}px`;
    highlight.style.width = `${rect.width + padding * 2}px`;
    highlight.style.height = `${rect.height + padding * 2}px`;
  });
}

/**
 * Disables transitions on highlight elements for smooth scrolling
 */
export function disableHighlightTransitions(
  highlight: HTMLDivElement | null,
  multiSelectHighlights: HTMLDivElement[]
): void {
  if (highlight) {
    highlight.classList.add("no-transition");
  }
  multiSelectHighlights.forEach((h) => h.classList.add("no-transition"));
}

/**
 * Enables transitions on highlight elements
 */
export function enableHighlightTransitions(
  highlight: HTMLDivElement | null,
  multiSelectHighlights: HTMLDivElement[]
): void {
  if (highlight) {
    highlight.classList.remove("no-transition");
  }
  multiSelectHighlights.forEach((h) => h.classList.remove("no-transition"));
}
