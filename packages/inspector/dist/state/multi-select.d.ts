/**
 * Multi-select state management for Eyeglass Inspector
 */
import type { SemanticSnapshot } from "@eyeglass/types";
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
export declare function enterMultiSelectMode(state: MultiSelectState, shadow: ShadowRoot, callbacks: MultiSelectCallbacks): MultiSelectState;
/**
 * Exits multi-select mode
 */
export declare function exitMultiSelectMode(state: MultiSelectState, shadow: ShadowRoot, callbacks: MultiSelectCallbacks): MultiSelectState;
/**
 * Toggles an element in the selection
 */
export declare function toggleInSelection(state: MultiSelectState, element: Element, shadow: ShadowRoot, callbacks: MultiSelectCallbacks): MultiSelectState;
/**
 * Removes an element from the selection by index
 */
export declare function removeFromSelectionByIndex(state: MultiSelectState, index: number, shadow: ShadowRoot, callbacks: MultiSelectCallbacks): MultiSelectState;
/**
 * Renders multi-select highlights in the shadow DOM
 */
export declare function renderMultiSelectHighlights(state: MultiSelectState, shadow: ShadowRoot): HTMLDivElement[];
/**
 * Clears all multi-select highlights from the shadow DOM
 */
export declare function clearMultiSelectHighlights(state: MultiSelectState, shadow: ShadowRoot): void;
/**
 * Updates multi-select highlight positions (called during scroll)
 */
export declare function updateMultiSelectHighlightPositions(selectedElements: Element[], multiSelectHighlights: HTMLDivElement[]): void;
/**
 * Disables transitions on highlight elements for smooth scrolling
 */
export declare function disableHighlightTransitions(highlight: HTMLDivElement | null, multiSelectHighlights: HTMLDivElement[]): void;
/**
 * Enables transitions on highlight elements
 */
export declare function enableHighlightTransitions(highlight: HTMLDivElement | null, multiSelectHighlights: HTMLDivElement[]): void;
