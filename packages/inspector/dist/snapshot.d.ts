/**
 * Captures a semantic snapshot of a DOM element
 * Includes 7 layers: Code, State, Visual, Causal, Perceptual, Metal, Systemic
 */
import type { SemanticSnapshot } from '@eyeglass/types';
/**
 * Capture a complete semantic snapshot of an element
 * Returns all 7 layers of frontend reality
 */
export declare function captureSnapshot(element: Element): SemanticSnapshot;
