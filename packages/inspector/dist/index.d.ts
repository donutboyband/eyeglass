/**
 * @eyeglass/inspector - Browser-side inspection web component
 *
 * Usage:
 *   import '@eyeglass/inspector';
 *   // Or inject via script tag
 *
 * This automatically registers the <eyeglass-inspector> custom element.
 */
export { EyeglassInspector } from './inspector.js';
export { captureSnapshot } from './snapshot.js';
export { extractFrameworkInfo } from './fiber-walker.js';
export type { FrameworkInfo } from './fiber-walker.js';
/**
 * Initialize the inspector by appending it to the document
 */
export declare function initInspector(): void;
