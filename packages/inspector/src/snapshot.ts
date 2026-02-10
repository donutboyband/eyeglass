/**
 * Captures a semantic snapshot of a DOM element
 */

import type { SemanticSnapshot } from '@eyeglass/types';
import { extractFrameworkInfo } from './fiber-walker.js';

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

/**
 * Capture a complete semantic snapshot of an element
 */
export function captureSnapshot(element: Element): SemanticSnapshot {
  const identifiers = getElementIdentifiers(element);

  return {
    role: getRole(element),
    name: getAccessibleName(element),
    tagName: element.tagName.toLowerCase(),
    ...identifiers,
    framework: extractFrameworkInfo(element),
    a11y: getA11yInfo(element),
    geometry: getGeometry(element),
    styles: getStyles(element),
    neighborhood: getNeighborhood(element),
    timestamp: Date.now(),
    url: window.location.href,
  };
}
