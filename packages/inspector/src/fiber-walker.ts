/**
 * React Fiber Walker - extracts component info from React DevTools internals
 */

interface ReactFiber {
  tag: number;
  type: any;
  return: ReactFiber | null;
  _debugSource?: {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
  };
  memoizedProps?: Record<string, unknown>;
}

export interface FrameworkInfo {
  name: 'react' | 'vue' | 'svelte' | 'vanilla';
  componentName?: string;
  filePath?: string;
  lineNumber?: number;
  props?: Record<string, unknown>;
}

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
function getFiberFromElement(element: Element): ReactFiber | null {
  const keys = Object.keys(element);
  const fiberKey = keys.find(
    (k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$')
  );
  if (!fiberKey) return null;
  return (element as any)[fiberKey] as ReactFiber;
}

/**
 * Walk up the fiber tree to find the nearest user-defined component
 */
function findComponentFiber(fiber: ReactFiber | null): ReactFiber | null {
  let current = fiber;
  while (current) {
    if (COMPONENT_TAGS.has(current.tag) && typeof current.type === 'function') {
      // Skip built-in React components (Context.Provider, etc.)
      const name = current.type.displayName || current.type.name || '';
      if (name && !name.startsWith('Context') && !name.endsWith('Provider')) {
        return current;
      }
    }
    current = current.return;
  }
  return null;
}

/**
 * Get safe props (primitives only, no functions/objects)
 */
function getSafeProps(props: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!props) return undefined;
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue;
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
function detectVue(element: Element): FrameworkInfo | null {
  const vueInstance = (element as any).__vue__;
  if (vueInstance) {
    const componentName = vueInstance.$options?.name || vueInstance.$options?._componentTag;
    return {
      name: 'vue',
      componentName,
    };
  }

  // Vue 3
  const vueKey = Object.keys(element).find((k) => k.startsWith('__vueParentComponent'));
  if (vueKey) {
    const instance = (element as any)[vueKey];
    return {
      name: 'vue',
      componentName: instance?.type?.name,
    };
  }

  return null;
}

/**
 * Detect Svelte component
 */
function detectSvelte(element: Element): FrameworkInfo | null {
  const svelteKey = Object.keys(element).find((k) => k.startsWith('__svelte'));
  if (svelteKey) {
    return {
      name: 'svelte',
    };
  }
  return null;
}

/**
 * Extract framework information from a DOM element
 */
export function extractFrameworkInfo(element: Element): FrameworkInfo {
  // Try React first
  const fiber = getFiberFromElement(element);
  if (fiber) {
    const componentFiber = findComponentFiber(fiber);
    if (componentFiber) {
      const componentName =
        componentFiber.type.displayName || componentFiber.type.name || undefined;
      const debugSource = componentFiber._debugSource;

      return {
        name: 'react',
        componentName,
        filePath: debugSource?.fileName,
        lineNumber: debugSource?.lineNumber,
        props: getSafeProps(componentFiber.memoizedProps),
      };
    }
    // React element but no user component found (just DOM nodes)
    return { name: 'react' };
  }

  // Try Vue
  const vueInfo = detectVue(element);
  if (vueInfo) return vueInfo;

  // Try Svelte
  const svelteInfo = detectSvelte(element);
  if (svelteInfo) return svelteInfo;

  // Vanilla fallback
  return { name: 'vanilla' };
}
