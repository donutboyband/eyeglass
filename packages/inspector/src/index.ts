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
export function initInspector(): void {
  if (document.querySelector('eyeglass-inspector')) {
    console.warn('[eyeglass] Inspector already initialized');
    return;
  }

  const inspector = document.createElement('eyeglass-inspector');
  document.body.appendChild(inspector);
  console.log('[eyeglass] Inspector initialized. Hover over elements and click to annotate.');
}

// Auto-initialize when imported in a browser context
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInspector);
  } else {
    initInspector();
  }
}
