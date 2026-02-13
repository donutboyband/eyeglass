/**
 * Loupe Renderer for Eyeglass v2.0
 * A small pill that hovers above the cursor showing component info
 */

import type { SemanticSnapshot, PulseLevel } from '@eyeglass/types';
import { calculatePulseLevel, getPulseColor } from '../utils/health.js';

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
export function createLoupe(shadow: ShadowRoot): HTMLDivElement {
  const loupe = document.createElement('div');
  loupe.className = 'loupe';
  loupe.setAttribute('aria-hidden', 'true');
  shadow.appendChild(loupe);
  return loupe;
}

/**
 * Get the display name for the component
 */
function getDisplayName(snapshot: SemanticSnapshot): string {
  const fw = snapshot.framework;
  const name = fw.displayName || fw.componentName;

  if (name) {
    return `<${name} />`;
  }

  // Fallback to tag name with identifier hints
  let displayName = `<${snapshot.tagName}>`;

  if (snapshot.id) {
    displayName = `#${snapshot.id}`;
  } else if (snapshot.className) {
    const firstClass = snapshot.className.split(/\s+/)[0];
    displayName = `.${firstClass}`;
  }

  return displayName;
}

/**
 * Position options for the loupe relative to the element
 */
type LoupePosition = 'above' | 'below' | 'left' | 'right';

/**
 * Calculate the best position for the loupe that doesn't occlude the element
 * Per SPEC-V2: "Respect the User - Never block the element the user is looking at"
 */
function calculateBestPosition(
  elementRect: DOMRect,
  loupeWidth: number,
  loupeHeight: number
): { position: LoupePosition; x: number; y: number } {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 8;
  const gap = 10; // Gap between element and loupe

  // Calculate available space in each direction
  const spaceAbove = elementRect.top - padding;
  const spaceBelow = viewportHeight - elementRect.bottom - padding;
  const spaceLeft = elementRect.left - padding;
  const spaceRight = viewportWidth - elementRect.right - padding;

  // Determine best position based on available space
  // Prefer above, then below, then right, then left
  let position: LoupePosition;
  let x: number;
  let y: number;

  if (spaceAbove >= loupeHeight + gap) {
    // Position above the element
    position = 'above';
    x = elementRect.left + (elementRect.width - loupeWidth) / 2;
    y = elementRect.top - loupeHeight - gap;
  } else if (spaceBelow >= loupeHeight + gap) {
    // Position below the element
    position = 'below';
    x = elementRect.left + (elementRect.width - loupeWidth) / 2;
    y = elementRect.bottom + gap;
  } else if (spaceRight >= loupeWidth + gap) {
    // Position to the right of the element
    position = 'right';
    x = elementRect.right + gap;
    y = elementRect.top + (elementRect.height - loupeHeight) / 2;
  } else if (spaceLeft >= loupeWidth + gap) {
    // Position to the left of the element
    position = 'left';
    x = elementRect.left - loupeWidth - gap;
    y = elementRect.top + (elementRect.height - loupeHeight) / 2;
  } else {
    // Fallback: position above anyway, but ensure it's in viewport
    position = 'above';
    x = elementRect.left + (elementRect.width - loupeWidth) / 2;
    y = Math.max(padding, elementRect.top - loupeHeight - gap);
  }

  // Clamp to viewport bounds
  x = Math.max(padding, Math.min(x, viewportWidth - loupeWidth - padding));
  y = Math.max(padding, Math.min(y, viewportHeight - loupeHeight - padding));

  return { position, x, y };
}

/**
 * Update the Loupe content and position
 * Positions relative to the element, not the cursor, to avoid occlusion
 */
export function updateLoupe(
  loupe: HTMLDivElement,
  snapshot: SemanticSnapshot,
  elementRect: DOMRect
): void {
  const displayName = getDisplayName(snapshot);
  const pulseLevel = calculatePulseLevel(snapshot);
  const pulseColor = getPulseColor(pulseLevel);

  // Only show pulse dot if there's an issue
  const showPulse = pulseLevel !== 'healthy';

  loupe.innerHTML = `
    <span class="loupe-name">${escapeHtml(displayName)}</span>
    ${showPulse ? `<span class="loupe-pulse" style="background: ${pulseColor};"></span>` : ''}
  `;

  // Get loupe dimensions (need to measure after setting content)
  // Use a rough estimate first, then refine
  const estimatedWidth = Math.min(300, displayName.length * 8 + 30);
  const estimatedHeight = 28;

  const { x, y } = calculateBestPosition(elementRect, estimatedWidth, estimatedHeight);
  loupe.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
}

/**
 * Show the Loupe
 */
export function showLoupe(loupe: HTMLDivElement): void {
  loupe.classList.add('visible');
}

/**
 * Hide the Loupe
 */
export function hideLoupe(loupe: HTMLDivElement): void {
  loupe.classList.remove('visible');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get Loupe CSS styles
 */
export const LOUPE_STYLES = `
.loupe {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: var(--glass-shadow);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  font-size: 12px;
  color: var(--text-primary);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease-out;
  z-index: 10;
  white-space: nowrap;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loupe.visible {
  opacity: 1;
}

.loupe-name {
  color: var(--accent);
  font-weight: 500;
}

.loupe-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.15);
  }
}
`;
