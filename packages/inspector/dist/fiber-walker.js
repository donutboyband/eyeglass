/**
 * React Fiber Walker - extracts component info from React DevTools internals
 */
// Fiber tag constants
const FunctionComponent = 0;
const ClassComponent = 1;
const ForwardRef = 11;
const MemoComponent = 14;
const SimpleMemoComponent = 15;
const COMPONENT_TAGS = new Set([
    FunctionComponent,
    ClassComponent,
    ForwardRef,
    MemoComponent,
    SimpleMemoComponent,
]);
/**
 * Find the React Fiber attached to a DOM element
 */
function getFiberFromElement(element) {
    const keys = Object.keys(element);
    const fiberKey = keys.find((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!fiberKey)
        return null;
    return element[fiberKey];
}
/**
 * Check if a fiber is a user-defined component (not built-in React internals)
 */
function isUserComponent(fiber) {
    if (!COMPONENT_TAGS.has(fiber.tag) || typeof fiber.type !== 'function') {
        return false;
    }
    const name = fiber.type.displayName || fiber.type.name || '';
    // Skip built-in React components (Context.Provider, StrictMode, etc.)
    if (!name || name.startsWith('Context') || name.endsWith('Provider') || name === 'StrictMode') {
        return false;
    }
    return true;
}
/**
 * Get component name from fiber
 */
function getComponentName(fiber) {
    return fiber.type.displayName || fiber.type.name || undefined;
}
/**
 * Walk up the fiber tree to find the nearest user-defined component
 */
function findComponentFiber(fiber) {
    let current = fiber;
    while (current) {
        if (isUserComponent(current)) {
            return current;
        }
        current = current.return;
    }
    return null;
}
/**
 * Collect all parent component names by walking up the fiber tree
 */
function collectAncestry(fiber) {
    const ancestry = [];
    let current = fiber;
    while (current) {
        if (isUserComponent(current)) {
            const name = getComponentName(current);
            if (name) {
                ancestry.push(name);
            }
        }
        current = current.return;
    }
    return ancestry;
}
/**
 * Get safe props (primitives only, no functions/objects)
 */
function getSafeProps(props) {
    if (!props)
        return undefined;
    const safe = {};
    for (const [key, value] of Object.entries(props)) {
        if (key === 'children')
            continue;
        const type = typeof value;
        if (type === 'string' || type === 'number' || type === 'boolean' || value === null) {
            safe[key] = value;
        }
    }
    return Object.keys(safe).length > 0 ? safe : undefined;
}
/**
 * Detect Vue component
 */
function detectVue(element) {
    // Vue 2
    const vueInstance = element.__vue__;
    if (vueInstance) {
        const componentName = vueInstance.$options?.name || vueInstance.$options?._componentTag;
        return {
            name: 'vue',
            componentName,
        };
    }
    // Vue 3 - check for any __vue* property
    const keys = Object.keys(element);
    const vueKey = keys.find((k) => k.startsWith('__vue'));
    if (vueKey) {
        const vnode = element[vueKey];
        // Try to get component info from vnode
        if (vnode) {
            // Walk up to find component instance
            let instance = vnode;
            let componentName;
            let props;
            // Check various Vue 3 internal structures
            if (instance?.type?.name) {
                componentName = instance.type.name;
            }
            else if (instance?.type?.__name) {
                componentName = instance.type.__name;
            }
            else if (instance?.component?.type?.name) {
                componentName = instance.component.type.name;
            }
            else if (instance?.component?.type?.__name) {
                componentName = instance.component.type.__name;
            }
            // Try to get props
            const rawProps = instance?.props || instance?.component?.props;
            if (rawProps) {
                props = getSafeProps(rawProps);
            }
            // Try to get file info from __file
            let filePath;
            if (instance?.type?.__file) {
                filePath = instance.type.__file;
            }
            else if (instance?.component?.type?.__file) {
                filePath = instance.component.type.__file;
            }
            return {
                name: 'vue',
                componentName,
                filePath,
                props,
            };
        }
        return { name: 'vue' };
    }
    return null;
}
/**
 * Detect Svelte component
 */
function detectSvelte(element) {
    const keys = Object.keys(element);
    const svelteKey = keys.find((k) => k.startsWith('__svelte'));
    if (svelteKey) {
        const svelteData = element[svelteKey];
        // Try to extract component info from Svelte internals
        let componentName;
        // Svelte 5 uses different structure
        if (svelteData?.constructor?.name && svelteData.constructor.name !== 'Object') {
            componentName = svelteData.constructor.name;
        }
        // Check for component context
        if (!componentName && svelteData?.$$?.ctx) {
            // Svelte 4 structure
            const ctx = svelteData.$$.ctx;
            if (ctx?.constructor?.name && ctx.constructor.name !== 'Object') {
                componentName = ctx.constructor.name;
            }
        }
        return {
            name: 'svelte',
            componentName,
        };
    }
    return null;
}
/**
 * Extract framework information from a DOM element
 */
export function extractFrameworkInfo(element) {
    // Try React first
    const fiber = getFiberFromElement(element);
    if (fiber) {
        const componentFiber = findComponentFiber(fiber);
        if (componentFiber) {
            const componentName = getComponentName(componentFiber);
            const debugSource = componentFiber._debugSource;
            const ancestry = collectAncestry(componentFiber);
            return {
                name: 'react',
                componentName,
                filePath: debugSource?.fileName,
                lineNumber: debugSource?.lineNumber,
                props: getSafeProps(componentFiber.memoizedProps),
                ancestry: ancestry.length > 0 ? ancestry : undefined,
            };
        }
        // React element but no user component found (just DOM nodes)
        // Still try to get ancestry from the fiber
        const ancestry = collectAncestry(fiber);
        return {
            name: 'react',
            ancestry: ancestry.length > 0 ? ancestry : undefined,
        };
    }
    // Try Vue
    const vueInfo = detectVue(element);
    if (vueInfo)
        return vueInfo;
    // Try Svelte
    const svelteInfo = detectSvelte(element);
    if (svelteInfo)
        return svelteInfo;
    // Vanilla fallback
    return { name: 'vanilla' };
}
