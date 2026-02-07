/**
 * Captures a semantic snapshot of a DOM element
 */
import { extractFrameworkInfo } from './fiber-walker.js';
/**
 * Get computed accessibility properties
 */
function getA11yInfo(element) {
    const ariaLabel = element.getAttribute('aria-label');
    const ariaDescribedBy = element.getAttribute('aria-describedby');
    const ariaDisabled = element.getAttribute('aria-disabled');
    const ariaExpanded = element.getAttribute('aria-expanded');
    const ariaChecked = element.getAttribute('aria-checked');
    const ariaHidden = element.getAttribute('aria-hidden');
    // Get description from aria-describedby if it points to an element
    let description = null;
    if (ariaDescribedBy) {
        const descElement = document.getElementById(ariaDescribedBy);
        description = descElement?.textContent?.trim() || null;
    }
    // Check if element is disabled
    const disabled = ariaDisabled === 'true' ||
        element.disabled ||
        element.hasAttribute('disabled');
    return {
        label: ariaLabel || element.getAttribute('title') || null,
        description,
        disabled,
        expanded: ariaExpanded ? ariaExpanded === 'true' : undefined,
        checked: ariaChecked === 'true'
            ? true
            : ariaChecked === 'false'
                ? false
                : ariaChecked === 'mixed'
                    ? 'mixed'
                    : undefined,
        hidden: ariaHidden === 'true' || element.hidden || false,
    };
}
/**
 * Get geometry information
 */
function getGeometry(element) {
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
function getStyles(element) {
    const computed = getComputedStyle(element);
    return {
        display: computed.display,
        position: computed.position,
        flexDirection: computed.flexDirection !== 'row' ? computed.flexDirection : undefined,
        gridTemplate: computed.display === 'grid'
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
function getRole(element) {
    // Explicit role takes precedence
    const explicitRole = element.getAttribute('role');
    if (explicitRole)
        return explicitRole;
    // Implicit roles based on tag
    const tag = element.tagName.toLowerCase();
    const roleMap = {
        a: 'link',
        button: 'button',
        input: element.type || 'textbox',
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
function getAccessibleName(element) {
    // aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel)
        return ariaLabel;
    // aria-labelledby
    const labelledBy = element.getAttribute('aria-labelledby');
    if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        if (labelElement)
            return labelElement.textContent?.trim() || '';
    }
    // For inputs, check associated label
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
        const id = element.getAttribute('id');
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label)
                return label.textContent?.trim() || '';
        }
    }
    // For images, use alt
    if (element.tagName === 'IMG') {
        return element.alt || '';
    }
    // Text content (truncated)
    const text = element.textContent?.trim() || '';
    return text.length > 50 ? text.slice(0, 50) + '...' : text;
}
/**
 * Get element identifiers (id, className, data-* attributes)
 */
function getElementIdentifiers(element) {
    const result = {};
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
    const dataAttrs = {};
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
/**
 * Capture a complete semantic snapshot of an element
 */
export function captureSnapshot(element) {
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
        timestamp: Date.now(),
        url: window.location.href,
    };
}
