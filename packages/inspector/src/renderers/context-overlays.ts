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

// Colors for different relationship types
const OVERLAY_COLORS = {
  component: '#3b82f6',       // Blue - The selected component
  'state-owner': '#8b5cf6',   // Purple - Parent passing props
  'layout-parent': '#f97316', // Orange - Flex/Grid container
  'event-blocker': '#ef4444', // Red - Event blocking element
};

const OVERLAY_LABELS = {
  component: 'Component',
  'state-owner': 'State Owner',
  'layout-parent': 'Layout Parent',
  'event-blocker': 'Event Blocker',
};

/**
 * Find related elements based on the snapshot
 */
export function findRelatedElements(element: Element, snapshot: SemanticSnapshot): ContextOverlay[] {
  const overlays: ContextOverlay[] = [];

  // 1. The selected component itself
  overlays.push({
    element,
    type: 'component',
    color: OVERLAY_COLORS.component,
    label: snapshot.framework.displayName || snapshot.framework.componentName || snapshot.tagName,
  });

  // 2. Find layout parent (flex/grid container)
  let current = element.parentElement;
  while (current && current !== document.body) {
    const computed = getComputedStyle(current);
    if (computed.display.includes('flex') || computed.display.includes('grid')) {
      overlays.push({
        element: current,
        type: 'layout-parent',
        color: OVERLAY_COLORS['layout-parent'],
        label: `Layout (${computed.display})`,
      });
      break;
    }
    current = current.parentElement;
  }

  // 3. Find event blockers from causality info
  if (snapshot.causality?.events?.blockingHandlers) {
    for (const blocker of snapshot.causality.events.blockingHandlers) {
      // Try to find the blocking element by selector
      try {
        const blockingEl = document.querySelector(blocker.element);
        if (blockingEl && !overlays.some(o => o.element === blockingEl)) {
          overlays.push({
            element: blockingEl,
            type: 'event-blocker',
            color: OVERLAY_COLORS['event-blocker'],
            label: `Blocks ${blocker.event} (${blocker.reason})`,
          });
        }
      } catch {
        // Invalid selector, skip
      }
    }
  }

  // 4. Find state owner (parent passing props) - from ancestry
  if (snapshot.framework.ancestry && snapshot.framework.ancestry.length > 1) {
    // Walk up the DOM to find React component boundaries
    const fiberKey = Object.keys(element).find(k => k.startsWith('__reactFiber$'));
    if (fiberKey) {
      let fiber = (element as any)[fiberKey];
      let depth = 0;

      while (fiber && depth < 10) {
        if (fiber.return && fiber.return.type && typeof fiber.return.type === 'function') {
          const parentName = fiber.return.type.displayName || fiber.return.type.name;
          if (parentName && fiber.return.stateNode instanceof Element) {
            overlays.push({
              element: fiber.return.stateNode,
              type: 'state-owner',
              color: OVERLAY_COLORS['state-owner'],
              label: `<${parentName} /> (props source)`,
            });
            break;
          }
        }
        fiber = fiber.return;
        depth++;
      }
    }
  }

  return overlays;
}

/**
 * Render context overlay elements into the shadow DOM
 */
export function renderContextOverlays(
  shadow: ShadowRoot,
  overlays: ContextOverlay[]
): HTMLDivElement[] {
  const elements: HTMLDivElement[] = [];

  for (const overlay of overlays) {
    const rect = overlay.element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    const div = document.createElement('div');
    div.className = `context-overlay context-${overlay.type}`;
    div.style.cssText = `
      position: fixed;
      left: ${rect.left - 2}px;
      top: ${rect.top - 2}px;
      width: ${rect.width + 4}px;
      height: ${rect.height + 4}px;
      border: 2px solid ${overlay.color};
      border-radius: 4px;
      pointer-events: none;
      z-index: 9;
      box-sizing: border-box;
    `;

    // Add label
    const label = document.createElement('div');
    label.className = 'context-label';
    label.textContent = overlay.label;
    label.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      padding: 2px 6px;
      background: ${overlay.color};
      color: white;
      font-size: 10px;
      font-weight: 500;
      border-radius: 4px;
      white-space: nowrap;
      pointer-events: none;
    `;
    div.appendChild(label);

    shadow.appendChild(div);
    elements.push(div);
  }

  return elements;
}

/**
 * Remove all context overlays from the shadow DOM
 */
export function clearContextOverlays(shadow: ShadowRoot): void {
  const overlays = shadow.querySelectorAll('.context-overlay');
  overlays.forEach(el => el.remove());
}

/**
 * Update overlay positions (e.g., on scroll)
 */
export function updateOverlayPositions(
  shadow: ShadowRoot,
  overlays: ContextOverlay[],
  elements: HTMLDivElement[]
): void {
  for (let i = 0; i < overlays.length && i < elements.length; i++) {
    const rect = overlays[i].element.getBoundingClientRect();
    const div = elements[i];

    div.style.left = `${rect.left - 2}px`;
    div.style.top = `${rect.top - 2}px`;
    div.style.width = `${rect.width + 4}px`;
    div.style.height = `${rect.height + 4}px`;
  }
}

/**
 * Context Overlay CSS styles
 */
export const CONTEXT_OVERLAY_STYLES = `
.context-overlay {
  animation: context-appear 0.2s ease-out;
}

@keyframes context-appear {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.context-overlay.context-component {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.context-overlay.context-state-owner {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}

.context-overlay.context-layout-parent {
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.2);
}

.context-overlay.context-event-blocker {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
}

.context-label {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
`;
