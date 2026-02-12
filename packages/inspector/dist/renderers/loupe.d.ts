/**
 * Loupe Renderer for Eyeglass v2.0
 * A small pill that hovers above the cursor showing component info
 */
import type { SemanticSnapshot } from '@eyeglass/types';
export interface LoupeState {
    element: HTMLDivElement | null;
    visible: boolean;
    lastX: number;
    lastY: number;
    animationFrame: number | null;
}
/**
 * Create the Loupe element
 */
export declare function createLoupe(shadow: ShadowRoot): HTMLDivElement;
/**
 * Update the Loupe content and position
 * Positions relative to the element, not the cursor, to avoid occlusion
 */
export declare function updateLoupe(loupe: HTMLDivElement, snapshot: SemanticSnapshot, elementRect: DOMRect): void;
/**
 * Show the Loupe
 */
export declare function showLoupe(loupe: HTMLDivElement): void;
/**
 * Hide the Loupe
 */
export declare function hideLoupe(loupe: HTMLDivElement): void;
/**
 * Get Loupe CSS styles
 */
export declare const LOUPE_STYLES = "\n.loupe {\n  position: fixed;\n  top: 0;\n  left: 0;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 10px;\n  background: var(--glass-bg);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid var(--glass-border);\n  border-radius: 20px;\n  box-shadow: var(--glass-shadow);\n  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;\n  font-size: 12px;\n  color: var(--text-primary);\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 0.15s ease-out;\n  z-index: 10;\n  white-space: nowrap;\n  max-width: 300px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.loupe.visible {\n  opacity: 1;\n}\n\n.loupe-name {\n  color: var(--accent);\n  font-weight: 500;\n}\n\n.loupe-pulse {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  flex-shrink: 0;\n  animation: pulse-glow 2s ease-in-out infinite;\n}\n\n@keyframes pulse-glow {\n  0%, 100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.7;\n    transform: scale(1.15);\n  }\n}\n";
