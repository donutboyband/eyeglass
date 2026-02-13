/**
 * Context Overlays Renderer for Eyeglass v2.0
 * Draws colored outlines around related elements when "Show Relationships" is toggled
 */
import type { SemanticSnapshot } from '@eyeglass/types';
export interface ContextOverlay {
    element: Element;
    type: 'component' | 'state-owner' | 'layout-parent' | 'event-blocker';
    color: string;
    label: string;
}
/**
 * Find related elements based on the snapshot
 */
export declare function findRelatedElements(element: Element, snapshot: SemanticSnapshot): ContextOverlay[];
/**
 * Render context overlay elements into the shadow DOM
 */
export declare function renderContextOverlays(shadow: ShadowRoot, overlays: ContextOverlay[]): HTMLDivElement[];
/**
 * Remove all context overlays from the shadow DOM
 */
export declare function clearContextOverlays(shadow: ShadowRoot): void;
/**
 * Update overlay positions (e.g., on scroll)
 */
export declare function updateOverlayPositions(shadow: ShadowRoot, overlays: ContextOverlay[], elements: HTMLDivElement[]): void;
/**
 * Context Overlay CSS styles
 */
export declare const CONTEXT_OVERLAY_STYLES = "\n.context-overlay {\n  animation: context-appear 0.2s ease-out;\n  box-shadow: none;\n  background: transparent;\n}\n\n@keyframes context-appear {\n  from {\n    opacity: 0;\n    transform: scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n\n.context-label {\n  box-shadow: none;\n}\n";
