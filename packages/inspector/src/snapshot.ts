/**
 * Captures a semantic snapshot of a DOM element
 * Includes 7 layers: Code, State, Visual, Causal, Perceptual, Metal, Systemic
 */

import type {
  SemanticSnapshot,
  CausalityInfo,
  PerceptionInfo,
  MetalInfo,
  SystemicInfo,
  EventListener,
  BlockingHandler,
  StackingContext,
} from '@eyeglass/types';
import { extractFrameworkInfo, getRenderAnalysis } from './fiber-walker.js';
import { getSystemicInfo } from './utils/systemic.js';

/**
 * Get computed accessibility properties
 */
function getA11yInfo(element: Element): SemanticSnapshot['a11y'] {
  const ariaLabel = element.getAttribute('aria-label');
  const ariaDescribedBy = element.getAttribute('aria-describedby');
  const ariaDisabled = element.getAttribute('aria-disabled');
  const ariaExpanded = element.getAttribute('aria-expanded');
  const ariaChecked = element.getAttribute('aria-checked');
  const ariaHidden = element.getAttribute('aria-hidden');

  // Get description from aria-describedby if it points to an element
  let description: string | null = null;
  if (ariaDescribedBy) {
    const descElement = document.getElementById(ariaDescribedBy);
    description = descElement?.textContent?.trim() || null;
  }

  // Check if element is disabled
  const disabled =
    ariaDisabled === 'true' ||
    (element as HTMLButtonElement).disabled ||
    element.hasAttribute('disabled');

  return {
    label: ariaLabel || element.getAttribute('title') || null,
    description,
    disabled,
    expanded: ariaExpanded ? ariaExpanded === 'true' : undefined,
    checked:
      ariaChecked === 'true'
        ? true
        : ariaChecked === 'false'
          ? false
          : ariaChecked === 'mixed'
            ? 'mixed'
            : undefined,
    hidden: ariaHidden === 'true' || (element as HTMLElement).hidden || false,
  };
}

/**
 * Get geometry information
 */
function getGeometry(element: Element): SemanticSnapshot['geometry'] {
  const rect = element.getBoundingClientRect();
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    visible: rect.width > 0 && rect.height > 0,
  };
}

/**
 * Get targeted computed styles
 */
function getStyles(element: Element): SemanticSnapshot['styles'] {
  const computed = getComputedStyle(element);
  return {
    display: computed.display,
    position: computed.position,
    flexDirection: computed.flexDirection !== 'row' ? computed.flexDirection : undefined,
    gridTemplate:
      computed.display === 'grid'
        ? `${computed.gridTemplateColumns} / ${computed.gridTemplateRows}`
        : undefined,
    padding: computed.padding,
    margin: computed.margin,
    color: computed.color,
    backgroundColor: computed.backgroundColor,
    fontFamily: computed.fontFamily,
    zIndex: computed.zIndex,
  };
}

/**
 * Get the accessible role of an element
 */
function getRole(element: Element): string {
  // Explicit role takes precedence
  const explicitRole = element.getAttribute('role');
  if (explicitRole) return explicitRole;

  // Implicit roles based on tag
  const tag = element.tagName.toLowerCase();
  const roleMap: Record<string, string> = {
    a: 'link',
    button: 'button',
    input: (element as HTMLInputElement).type || 'textbox',
    select: 'combobox',
    textarea: 'textbox',
    img: 'img',
    nav: 'navigation',
    main: 'main',
    header: 'banner',
    footer: 'contentinfo',
    aside: 'complementary',
    article: 'article',
    section: 'region',
    form: 'form',
    ul: 'list',
    ol: 'list',
    li: 'listitem',
    table: 'table',
    tr: 'row',
    td: 'cell',
    th: 'columnheader',
    dialog: 'dialog',
    h1: 'heading',
    h2: 'heading',
    h3: 'heading',
    h4: 'heading',
    h5: 'heading',
    h6: 'heading',
  };

  return roleMap[tag] || 'generic';
}

/**
 * Get the accessible name of an element
 */
function getAccessibleName(element: Element): string {
  // aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent?.trim() || '';
  }

  // For inputs, check associated label
  if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
    const id = element.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || '';
    }
  }

  // For images, use alt
  if (element.tagName === 'IMG') {
    return (element as HTMLImageElement).alt || '';
  }

  // Text content (truncated)
  const text = element.textContent?.trim() || '';
  return text.length > 50 ? text.slice(0, 50) + '...' : text;
}

/**
 * Get element identifiers (id, className, data-* attributes)
 */
function getElementIdentifiers(element: Element): {
  id?: string;
  className?: string;
  dataAttributes?: Record<string, string>;
} {
  const result: {
    id?: string;
    className?: string;
    dataAttributes?: Record<string, string>;
  } = {};

  // Get id
  const id = element.getAttribute('id');
  if (id) {
    result.id = id;
  }

  // Get class names
  const className = element.getAttribute('class');
  if (className?.trim()) {
    result.className = className.trim();
  }

  // Get data-* attributes
  const dataAttrs: Record<string, string> = {};
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr.name.startsWith('data-')) {
      dataAttrs[attr.name] = attr.value;
    }
  }
  if (Object.keys(dataAttrs).length > 0) {
    result.dataAttributes = dataAttrs;
  }

  return result;
}

// Type helpers for neighborhood
type NeighborhoodType = NonNullable<SemanticSnapshot['neighborhood']>;
type ParentInfo = NeighborhoodType['parents'][0];
type ChildInfo = NeighborhoodType['children'][0];

/**
 * Get layout-relevant styles for a parent element
 */
function getParentLayoutStyles(element: Element): ParentInfo['styles'] {
  const computed = getComputedStyle(element);
  const styles: ParentInfo['styles'] = {
    display: computed.display,
    position: computed.position,
  };

  // Only include flex properties if it's a flex container
  if (computed.display.includes('flex')) {
    if (computed.flexDirection !== 'row') styles.flexDirection = computed.flexDirection;
    if (computed.alignItems !== 'normal') styles.alignItems = computed.alignItems;
    if (computed.justifyContent !== 'normal') styles.justifyContent = computed.justifyContent;
    if (computed.gap !== 'normal' && computed.gap !== '0px') styles.gap = computed.gap;
  }

  // Only include grid properties if it's a grid container
  if (computed.display.includes('grid')) {
    styles.gridTemplate = `${computed.gridTemplateColumns} / ${computed.gridTemplateRows}`;
  }

  return styles;
}

/**
 * Get neighborhood context (parents and children)
 */
function getNeighborhood(element: Element): NeighborhoodType {
  const parents: ParentInfo[] = [];
  const children: ChildInfo[] = [];

  // Get up to 2 parent levels
  let current = element.parentElement;
  let depth = 0;
  while (current && depth < 2 && current !== document.body && current !== document.documentElement) {
    const className = current.getAttribute('class')?.trim();
    parents.push({
      tagName: current.tagName.toLowerCase(),
      ...(className && { className }),
      styles: getParentLayoutStyles(current),
    });
    current = current.parentElement;
    depth++;
  }

  // Get direct children, grouped by tagName
  const childMap = new Map<string, { className?: string; count: number }>();
  for (const child of Array.from(element.children)) {
    const tag = child.tagName.toLowerCase();
    const className = child.getAttribute('class')?.trim();
    const key = `${tag}:${className || ''}`;

    if (childMap.has(key)) {
      childMap.get(key)!.count++;
    } else {
      childMap.set(key, { className: className || undefined, count: 1 });
    }
  }

  for (const [key, value] of childMap) {
    const tag = key.split(':')[0];
    children.push({
      tagName: tag,
      ...(value.className && { className: value.className }),
      ...(value.count > 1 && { count: value.count }),
    });
  }

  return { parents, children };
}

// ============================================================================
// LAYER 4: CAUSALITY (Event Listeners, Stacking Context, Layout Constraints)
// ============================================================================

/**
 * Build a CSS selector for an element (for debugging/identification)
 */
function buildSelector(element: Element): string {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const className = element.className && typeof element.className === 'string'
    ? '.' + element.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.')
    : '';
  return `${tag}${id}${className}`;
}

/**
 * Get event listeners attached to an element
 * Uses Chrome DevTools API if available, otherwise checks common patterns
 */
function getEventListeners(element: Element): EventListener[] {
  const listeners: EventListener[] = [];

  // Try Chrome DevTools getEventListeners API (only available in DevTools console)
  if (typeof (window as any).getEventListeners === 'function') {
    try {
      const devToolsListeners = (window as any).getEventListeners(element);
      for (const eventType of Object.keys(devToolsListeners)) {
        for (const listener of devToolsListeners[eventType]) {
          listeners.push({
            type: eventType,
            capture: listener.capture || false,
            source: listener.listener?.toString?.()?.slice(0, 50),
          });
        }
      }
      return listeners;
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback: Check for inline event handlers
  const eventAttributes = [
    'onclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmouseout',
    'onfocus', 'onblur', 'onkeydown', 'onkeyup', 'onkeypress',
    'onchange', 'oninput', 'onsubmit', 'ontouchstart', 'ontouchend',
  ];

  for (const attr of eventAttributes) {
    if (element.hasAttribute(attr) || (element as any)[attr]) {
      listeners.push({
        type: attr.slice(2), // Remove 'on' prefix
        capture: false,
      });
    }
  }

  // Check for React synthetic events (if fiber is available)
  const keys = Object.keys(element);
  const reactPropsKey = keys.find(k => k.startsWith('__reactProps$'));
  if (reactPropsKey) {
    const props = (element as any)[reactPropsKey];
    if (props) {
      for (const key of Object.keys(props)) {
        if (key.startsWith('on') && typeof props[key] === 'function') {
          const eventType = key.slice(2).toLowerCase();
          if (!listeners.some(l => l.type === eventType)) {
            listeners.push({
              type: eventType,
              capture: false,
              source: 'React synthetic event',
            });
          }
        }
      }
    }
  }

  return listeners;
}

/**
 * Find event handlers on ancestors that might block events
 */
function getBlockingHandlers(element: Element): BlockingHandler[] {
  const blockers: BlockingHandler[] = [];

  function pushStyleBlocker(target: Element, reason: BlockingHandler['reason']) {
    blockers.push({
      element: buildSelector(target),
      event: 'all',
      reason,
    });
  }

  function inspectComputed(target: Element, computed: CSSStyleDeclaration): void {
    if (computed.pointerEvents === 'none') {
      pushStyleBlocker(target, 'pointer-events:none');
    }
    if (computed.visibility === 'hidden') {
      pushStyleBlocker(target, 'visibility:hidden');
    }
    if (parseFloat(computed.opacity) === 0) {
      pushStyleBlocker(target, 'opacity:0');
    }
  }

  const elementComputed = getComputedStyle(element);
  inspectComputed(element, elementComputed);
  if ((element as HTMLElement).inert) {
    pushStyleBlocker(element, 'inert');
  }

  // Walk up ancestors to find potential blockers
  let current = element.parentElement;
  while (current && current !== document.body) {
    const parentComputed = getComputedStyle(current);
    inspectComputed(current, parentComputed);
    if ((current as HTMLElement).inert) {
      pushStyleBlocker(current, 'inert');
    }

    const listeners = getEventListeners(current);
    for (const listener of listeners) {
      if (listener.capture) {
        blockers.push({
          element: buildSelector(current),
          event: listener.type,
          reason: 'captured',
        });
      }
    }

    current = current.parentElement;
  }

  return blockers;
}

/**
 * Detect if an element creates a stacking context
 */
function getStackingContext(element: Element): StackingContext {
  const computed = getComputedStyle(element);

  // Check conditions that create a new stacking context
  const conditions: Array<{ check: boolean; reason: string }> = [
    { check: computed.position === 'fixed' || computed.position === 'sticky', reason: 'position:fixed/sticky' },
    { check: (computed.position === 'absolute' || computed.position === 'relative') && computed.zIndex !== 'auto', reason: 'positioned with z-index' },
    { check: parseFloat(computed.opacity) < 1, reason: 'opacity' },
    { check: computed.transform !== 'none', reason: 'transform' },
    { check: computed.filter !== 'none', reason: 'filter' },
    { check: computed.perspective !== 'none', reason: 'perspective' },
    { check: computed.clipPath !== 'none', reason: 'clip-path' },
    { check: computed.mask !== 'none' && computed.mask !== '', reason: 'mask' },
    { check: computed.isolation === 'isolate', reason: 'isolation:isolate' },
    { check: computed.mixBlendMode !== 'normal', reason: 'mix-blend-mode' },
    { check: computed.willChange.includes('transform') || computed.willChange.includes('opacity'), reason: 'will-change' },
    { check: computed.contain === 'layout' || computed.contain === 'paint' || computed.contain === 'strict' || computed.contain === 'content', reason: 'contain' },
  ];

  const isStackingContext = conditions.some(c => c.check);
  const reason = conditions.find(c => c.check)?.reason;

  // Find parent stacking context
  let parentContext: string | null = null;
  let effectiveZIndex = computed.zIndex === 'auto' ? 0 : parseInt(computed.zIndex, 10) || 0;

  let current = element.parentElement;
  while (current && current !== document.body) {
    const parentComputed = getComputedStyle(current);
    const parentConditions = [
      parentComputed.position === 'fixed' || parentComputed.position === 'sticky',
      (parentComputed.position === 'absolute' || parentComputed.position === 'relative') && parentComputed.zIndex !== 'auto',
      parseFloat(parentComputed.opacity) < 1,
      parentComputed.transform !== 'none',
    ];

    if (parentConditions.some(Boolean)) {
      parentContext = buildSelector(current);
      break;
    }
    current = current.parentElement;
  }

  return {
    isStackingContext,
    parentContext,
    reason,
    effectiveZIndex,
  };
}

/**
 * Get layout constraints affecting the element
 */
function getLayoutConstraints(element: Element): string[] {
  const constraints: string[] = [];
  const computed = getComputedStyle(element);
  const parent = element.parentElement;

  if (parent) {
    const parentComputed = getComputedStyle(parent);

    // Flex constraints
    if (parentComputed.display.includes('flex')) {
      if (computed.flexGrow !== '0') constraints.push(`Flex grow: ${computed.flexGrow}`);
      if (computed.flexShrink !== '1') constraints.push(`Flex shrink: ${computed.flexShrink}`);
      if (computed.flexBasis !== 'auto') constraints.push(`Flex basis: ${computed.flexBasis}`);
      if (computed.alignSelf !== 'auto') constraints.push(`Align self: ${computed.alignSelf}`);
    }

    // Grid constraints
    if (parentComputed.display.includes('grid')) {
      if (computed.gridColumn !== 'auto') constraints.push(`Grid column: ${computed.gridColumn}`);
      if (computed.gridRow !== 'auto') constraints.push(`Grid row: ${computed.gridRow}`);
    }
  }

  // Size constraints
  if (computed.maxWidth !== 'none') constraints.push(`Max width: ${computed.maxWidth}`);
  if (computed.minWidth !== '0px' && computed.minWidth !== 'auto') constraints.push(`Min width: ${computed.minWidth}`);
  if (computed.maxHeight !== 'none') constraints.push(`Max height: ${computed.maxHeight}`);
  if (computed.overflow !== 'visible') constraints.push(`Overflow: ${computed.overflow}`);

  return constraints;
}

/**
 * Get full causality information
 */
function getCausalityInfo(element: Element): CausalityInfo {
  return {
    events: {
      listeners: getEventListeners(element),
      blockingHandlers: getBlockingHandlers(element),
    },
    stackingContext: getStackingContext(element),
    layoutConstraints: getLayoutConstraints(element),
  };
}

// ============================================================================
// LAYER 5: PERCEPTUAL (Affordance, Visibility, Legibility, Usability)
// ============================================================================

/**
 * Parse a color string to RGB values
 */
function parseColor(colorStr: string): { r: number; g: number; b: number; a: number } | null {
  // Handle rgb/rgba
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
      a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  // Handle transparent
  if (colorStr === 'transparent' || colorStr === 'rgba(0, 0, 0, 0)') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  return null;
}

/**
 * Calculate relative luminance for WCAG contrast
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
function getContrastRatio(fg: { r: number; g: number; b: number }, bg: { r: number; g: number; b: number }): number {
  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get the effective background color by walking up ancestors
 */
function getEffectiveBackgroundColor(element: Element): string {
  let current: Element | null = element;
  let bgColor = 'rgb(255, 255, 255)'; // Default to white

  while (current && current !== document.documentElement) {
    const computed = getComputedStyle(current);
    const bg = computed.backgroundColor;
    const parsed = parseColor(bg);

    if (parsed && parsed.a > 0) {
      bgColor = bg;
      if (parsed.a === 1) break; // Fully opaque, no need to continue
    }

    current = current.parentElement;
  }

  return bgColor;
}

/**
 * Get legibility information (contrast ratio, WCAG status)
 */
function getLegibility(element: Element): PerceptionInfo['legibility'] {
  const computed = getComputedStyle(element);
  const fgColor = parseColor(computed.color);
  const effectiveBgColor = getEffectiveBackgroundColor(element);
  const bgColor = parseColor(effectiveBgColor);

  let contrastRatio = 1;
  if (fgColor && bgColor) {
    contrastRatio = getContrastRatio(fgColor, bgColor);
  }

  // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
  const fontSize = parseFloat(computed.fontSize);
  const fontWeight = parseInt(computed.fontWeight, 10) || 400;
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
  const requiredRatio = isLargeText ? 3 : 4.5;

  return {
    contrastRatio: Math.round(contrastRatio * 100) / 100,
    wcagStatus: contrastRatio >= requiredRatio ? 'pass' : 'fail',
    effectiveBgColor,
  };
}

/**
 * Detect if element is occluded by another element
 */
function getVisibility(element: Element): PerceptionInfo['visibility'] {
  const rect = element.getBoundingClientRect();

  if (rect.width === 0 || rect.height === 0) {
    return {
      isOccluded: false,
      effectiveOpacity: 0,
    };
  }

  let effectiveOpacity = 1;
  let current: Element | null = element;
  while (current && current !== document.documentElement) {
    const computed = getComputedStyle(current);
    effectiveOpacity *= parseFloat(computed.opacity);
    current = current.parentElement;
  }

  const samplePoints: Array<{ x: number; y: number }> = [];
  const midX = rect.left + rect.width / 2;
  const midY = rect.top + rect.height / 2;
  samplePoints.push({ x: midX, y: midY });

  // Additional points (quarters and corners) to better detect partial occlusion
  const offsets = [0.25, 0.75];
  for (const ox of offsets) {
    for (const oy of offsets) {
      samplePoints.push({ x: rect.left + rect.width * ox, y: rect.top + rect.height * oy });
    }
  }

  let occludedBy: string | undefined;
  let isOccluded = false;

  const htmlElement = element instanceof HTMLElement ? element : null;
  const previousPointerEvents = htmlElement ? htmlElement.style.pointerEvents : '';
  if (htmlElement) {
    htmlElement.style.pointerEvents = 'auto';
  }

  for (const point of samplePoints) {
    const target = document.elementFromPoint(point.x, point.y);
    if (!target || target === element || element.contains(target)) {
      continue;
    }
    if (target.contains(element)) {
      continue;
    }
    isOccluded = true;
    occludedBy = buildSelector(target);
    break;
  }

  if (htmlElement) {
    htmlElement.style.pointerEvents = previousPointerEvents;
  }

  return {
    isOccluded,
    occludedBy,
    effectiveOpacity: Math.round(effectiveOpacity * 100) / 100,
  };
}

/**
 * Detect affordance (does it look clickable? is it actually clickable?)
 */
function getAffordance(element: Element): PerceptionInfo['affordance'] {
  const computed = getComputedStyle(element);
  const tag = element.tagName.toLowerCase();

  // Does it LOOK interactable?
  const looksInteractable =
    computed.cursor === 'pointer' ||
    computed.textDecoration.includes('underline') ||
    tag === 'a' ||
    tag === 'button' ||
    computed.color.includes('0, 0, 255') || // Blue color
    computed.color.includes('0, 102, 204') || // Link blue
    element.getAttribute('role') === 'button' ||
    element.getAttribute('role') === 'link';

  // IS it actually interactable?
  const listeners = getEventListeners(element);
  const hasListeners = listeners.length > 0;
  const isInteractiveTag = ['a', 'button', 'input', 'select', 'textarea', 'label'].includes(tag);
  const hasTabIndex = element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1';
  const hasInertAncestor = Boolean((element as HTMLElement).closest('[inert]'));
  const isDisabled =
    (element as HTMLButtonElement).disabled ||
    element.getAttribute('aria-disabled') === 'true' ||
    computed.pointerEvents === 'none';
  const isInteractable = !hasInertAncestor && !isDisabled && (hasListeners || isInteractiveTag || hasTabIndex);

  // Calculate dissonance (mismatch between appearance and reality)
  let dissonanceScore = 0;
  if (looksInteractable && !isInteractable) {
    dissonanceScore = 0.7; // Looks clickable but isn't
  } else if (!looksInteractable && isInteractable) {
    dissonanceScore = 0.3; // Is clickable but doesn't look like it
  }

  return {
    looksInteractable,
    isInteractable,
    dissonanceScore,
  };
}

/**
 * Get usability information (touch target size)
 */
function getUsability(element: Element): PerceptionInfo['usability'] {
  const rect = element.getBoundingClientRect();
  const width = Math.round(rect.width);
  const height = Math.round(rect.height);

  // WCAG recommends 44x44px minimum for touch targets
  const isTouchTargetValid = width >= 44 && height >= 44;

  return {
    touchTargetSize: `${width}x${height}`,
    isTouchTargetValid,
  };
}

/**
 * Get full perception information
 */
function getPerceptionInfo(element: Element): PerceptionInfo {
  return {
    affordance: getAffordance(element),
    visibility: getVisibility(element),
    legibility: getLegibility(element),
    usability: getUsability(element),
  };
}

// ============================================================================
// LAYER 6: METAL (Performance metrics)
// ============================================================================

/**
 * Get performance/metal information
 */
function getMetalInfo(element: Element): MetalInfo {
  const computed = getComputedStyle(element);
  const listeners = getEventListeners(element);

  // Check if layer is promoted to GPU
  const layerPromoted =
    computed.transform !== 'none' ||
    computed.willChange.includes('transform') ||
    computed.willChange.includes('opacity');

  // Detect layout thrashing risk
  let layoutThrashingRisk: 'none' | 'low' | 'high' = 'none';
  if (computed.position === 'absolute' || computed.position === 'fixed') {
    layoutThrashingRisk = 'none'; // Positioned elements don't cause reflow
  } else if (computed.display === 'inline') {
    layoutThrashingRisk = 'low';
  } else if (listeners.some(l => ['scroll', 'resize', 'mousemove'].includes(l.type))) {
    layoutThrashingRisk = 'high'; // Frequent events that might query layout
  }

  // Get render analysis from fiber walker
  const renderAnalysis = getRenderAnalysis(element);

  return {
    pipeline: {
      layerPromoted,
      layoutThrashingRisk,
    },
    performance: {
      renderCount: renderAnalysis?.renderCount || 0,
      lastRenderReason: renderAnalysis?.lastRenderReason,
    },
    memory: {
      listenerCount: listeners.length,
    },
  };
}

/**
 * Capture a complete semantic snapshot of an element
 * Returns all 7 layers of frontend reality
 */
export function captureSnapshot(element: Element): SemanticSnapshot {
  const identifiers = getElementIdentifiers(element);
  const frameworkInfo = extractFrameworkInfo(element);
  const styles = getStyles(element);

  return {
    // Layer 1: Code (Identity)
    role: getRole(element),
    name: getAccessibleName(element),
    tagName: element.tagName.toLowerCase(),
    ...identifiers,

    // Layer 2: State (React)
    framework: frameworkInfo,

    // Layer 1 extension: Accessibility
    a11y: getA11yInfo(element),

    // Layer 3: Visual (Render)
    geometry: getGeometry(element),
    styles,

    // Layer 4: Causal (Engine)
    causality: getCausalityInfo(element),

    // Layer 5: Perceptual (Experience)
    perception: getPerceptionInfo(element),

    // Layer 6: Metal (Performance)
    metal: getMetalInfo(element),

    // Layer 7: Systemic (Architecture)
    systemic: getSystemicInfo(frameworkInfo.filePath, styles),

    // DOM Neighborhood (Layout Context)
    neighborhood: getNeighborhood(element),

    // Metadata
    timestamp: Date.now(),
    url: window.location.href,
  };
}
