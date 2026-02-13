/**
 * React Fiber Walker - Deep React runtime introspection
 * Extracts component info, hooks, context, and re-render data from React DevTools internals
 */

import type { HookInfo, ContextInfo, ReactState } from '@eyeglass/types';

// --- React Fiber Types ---
interface ReactFiber {
  tag: number;
  type: any;
  return: ReactFiber | null;
  key?: string | null;
  _debugSource?: {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
  };
  memoizedProps?: Record<string, unknown>;
  memoizedState?: any;  // Hook chain head
  alternate?: ReactFiber | null;  // For re-render detection
  stateNode?: any;  // DOM node or class instance
}

export interface FrameworkInfo {
  // v2.0 fields
  type?: 'react' | 'vanilla';
  displayName?: string;
  key?: string | null;
  filePath?: string;
  lineNumber?: number;
  ancestry?: string[];
  state?: ReactState;

  // Legacy fields (for backward compat with SemanticSnapshot.framework)
  name?: 'react' | 'vue' | 'svelte' | 'vanilla';  // @deprecated - use type
  componentName?: string;      // @deprecated - use displayName
  props?: Record<string, unknown>;  // @deprecated - use state.props
}

// --- Fiber tag constants ---
const FunctionComponent = 0;
const ClassComponent = 1;
const HostRoot = 3;
const HostComponent = 5;
const ForwardRef = 11;
const MemoComponent = 14;
const SimpleMemoComponent = 15;
const ContextProvider = 10;
const ContextConsumer = 9;

const COMPONENT_TAGS = new Set([
  FunctionComponent,
  ClassComponent,
  ForwardRef,
  MemoComponent,
  SimpleMemoComponent,
]);

// --- Render tracking ---
// We track renders by checking if the fiber has an alternate (previous render).
// The "alternate" fiber represents the previous committed state.
// A fiber without an alternate is on its initial render.
// We use a WeakMap to store the last known updateQueue identity to detect new renders.

// --- Hook type detection ---
const HOOK_PATTERNS = {
  useState: (hook: any) => hook !== null && typeof hook === 'object' && 'baseState' in hook && 'queue' in hook && !('deps' in hook),
  useReducer: (hook: any) => hook !== null && typeof hook === 'object' && 'baseState' in hook && 'queue' in hook && hook.queue?.lastRenderedReducer,
  useEffect: (hook: any) => hook !== null && typeof hook === 'object' && 'tag' in hook && (hook.tag & 0b100) !== 0,
  useLayoutEffect: (hook: any) => hook !== null && typeof hook === 'object' && 'tag' in hook && (hook.tag & 0b010) !== 0,
  useMemo: (hook: any) => hook !== null && typeof hook === 'object' && Array.isArray(hook) && hook.length === 2,
  useCallback: (hook: any) => hook !== null && typeof hook === 'object' && Array.isArray(hook) && hook.length === 2,
  useRef: (hook: any) => hook !== null && typeof hook === 'object' && 'current' in hook && Object.keys(hook).length === 1,
  useContext: () => false, // Context is handled separately, not as a hook in the chain
};

// --- Core Fiber Functions ---

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
 * Check if a fiber is a user-defined component (not built-in React internals)
 */
function isUserComponent(fiber: ReactFiber): boolean {
  if (!COMPONENT_TAGS.has(fiber.tag) || typeof fiber.type !== 'function') {
    return false;
  }
  const name = fiber.type.displayName || fiber.type.name || '';
  // Skip built-in React components (Context.Provider, StrictMode, etc.)
  if (!name || name === 'StrictMode' || name === 'Suspense' || name === 'Fragment') {
    return false;
  }
  return true;
}

/**
 * Get component name from fiber
 */
function getComponentName(fiber: ReactFiber): string | undefined {
  return fiber.type?.displayName || fiber.type?.name || undefined;
}

/**
 * Walk up the fiber tree to find the nearest user-defined component
 */
function findComponentFiber(fiber: ReactFiber | null): ReactFiber | null {
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
function collectAncestry(fiber: ReactFiber | null): string[] {
  const ancestry: string[] = [];
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
 * Get safe props (primitives only, no functions/complex objects)
 */
function getSafeProps(props: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!props) return {};
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue;
    const type = typeof value;
    if (type === 'string' || type === 'number' || type === 'boolean' || value === null) {
      safe[key] = value;
    } else if (Array.isArray(value) && value.every(v => typeof v === 'string' || typeof v === 'number')) {
      // Allow simple arrays of primitives
      safe[key] = value;
    }
  }
  return safe;
}

/**
 * Safely serialize a value for the snapshot
 */
function safeSerialize(value: unknown, depth = 0): unknown {
  if (depth > 2) return '[nested]';
  if (value === null || value === undefined) return value;

  const type = typeof value;
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return value;
  }
  if (type === 'function') {
    return '[function]';
  }
  if (Array.isArray(value)) {
    if (value.length > 5) return `[Array(${value.length})]`;
    return value.map(v => safeSerialize(v, depth + 1));
  }
  if (type === 'object') {
    // Check for React elements
    if ((value as any).$$typeof) {
      return '[React Element]';
    }
    // Check for DOM nodes
    if (value instanceof Element || value instanceof Node) {
      return '[DOM Node]';
    }
    const keys = Object.keys(value);
    if (keys.length > 10) return `[Object(${keys.length} keys)]`;
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      result[key] = safeSerialize((value as any)[key], depth + 1);
    }
    return result;
  }
  return String(value);
}

// --- Hook Extraction ---

/**
 * Detect the type of a hook from its structure
 */
function detectHookType(hook: any): string {
  // useState/useReducer check (has baseState and queue)
  if (hook && typeof hook === 'object' && 'baseState' in hook && 'queue' in hook) {
    if (hook.queue?.lastRenderedReducer?.name === 'basicStateReducer') {
      return 'useState';
    }
    return 'useReducer';
  }

  // useRef check (only has current property)
  if (hook && typeof hook === 'object' && 'current' in hook) {
    const keys = Object.keys(hook);
    if (keys.length === 1 && keys[0] === 'current') {
      return 'useRef';
    }
  }

  // useMemo/useCallback (array with value and deps)
  if (Array.isArray(hook) && hook.length === 2 && Array.isArray(hook[1])) {
    return typeof hook[0] === 'function' ? 'useCallback' : 'useMemo';
  }

  // useEffect/useLayoutEffect (has tag property)
  if (hook && typeof hook === 'object' && 'tag' in hook && 'create' in hook) {
    // Tag encoding: Layout=0b010, Passive(Effect)=0b100
    if ((hook.tag & 0b100) !== 0) return 'useEffect';
    if ((hook.tag & 0b010) !== 0) return 'useLayoutEffect';
  }

  return 'unknown';
}

/**
 * Extract hook value based on hook type
 */
function extractHookValue(hook: any, hookType: string): unknown {
  switch (hookType) {
    case 'useState':
    case 'useReducer':
      return safeSerialize(hook.baseState);
    case 'useRef':
      return safeSerialize(hook.current);
    case 'useMemo':
      return safeSerialize(hook[0]);
    case 'useCallback':
      return '[callback]';
    case 'useEffect':
    case 'useLayoutEffect':
      return undefined; // Effects don't have meaningful serializable values
    default:
      return safeSerialize(hook);
  }
}

/**
 * Extract hooks from a fiber's memoizedState chain
 */
export function extractHooks(fiber: ReactFiber): HookInfo[] {
  const hooks: HookInfo[] = [];

  // Only function components have hooks in memoizedState
  if (fiber.tag !== FunctionComponent && fiber.tag !== ForwardRef &&
      fiber.tag !== MemoComponent && fiber.tag !== SimpleMemoComponent) {
    return hooks;
  }

  let hookState = fiber.memoizedState;
  let index = 0;

  while (hookState !== null && hookState !== undefined) {
    // Hook state can be the value directly or wrapped in { memoizedState, next }
    const hookValue = hookState.memoizedState !== undefined ? hookState.memoizedState : hookState;
    const hookType = detectHookType(hookValue);

    if (hookType !== 'unknown') {
      hooks.push({
        name: hookType,
        value: extractHookValue(hookValue, hookType),
        label: `hook_${index}`, // We can't reliably get variable names at runtime
      });
    }

    // Move to next hook in the chain
    hookState = hookState.next;
    index++;

    // Safety: prevent infinite loops
    if (index > 100) break;
  }

  return hooks;
}

// --- Context Extraction ---

/**
 * Check if a fiber is a Context Provider
 */
function isContextProvider(fiber: ReactFiber): boolean {
  return fiber.tag === ContextProvider;
}

/**
 * Get the context name from a Provider fiber
 */
function getContextName(fiber: ReactFiber): string {
  const contextType = fiber.type?._context || fiber.type;
  return contextType?.displayName || contextType?.Provider?.displayName || 'Context';
}

/**
 * Extract context providers by walking up the fiber tree
 */
export function extractContext(fiber: ReactFiber): ContextInfo[] {
  const contexts: ContextInfo[] = [];
  const seen = new Set<any>(); // Avoid duplicate contexts

  let current: ReactFiber | null = fiber.return;

  while (current) {
    if (isContextProvider(current)) {
      const contextType = current.type?._context;
      if (contextType && !seen.has(contextType)) {
        seen.add(contextType);
        contexts.push({
          name: getContextName(current),
          value: safeSerialize(current.memoizedProps?.value),
        });
      }
    }
    current = current.return;
  }

  return contexts;
}

// --- Re-render Detection ---

export interface RenderAnalysis {
  renderCount: number;
  lastRenderReason?: string;
  changedProps?: string[];
}

/**
 * Compare props to detect what changed
 */
function findChangedProps(oldProps: Record<string, unknown> | undefined, newProps: Record<string, unknown> | undefined): string[] {
  if (!oldProps || !newProps) return [];

  const changed: string[] = [];
  const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);

  for (const key of allKeys) {
    if (key === 'children') continue;
    const oldVal = oldProps[key];
    const newVal = newProps[key];

    // Reference equality check
    if (oldVal !== newVal) {
      changed.push(key);
    }
  }

  return changed;
}

/**
 * Detect if a component has re-rendered and analyze why.
 *
 * NOTE: We can only detect if the component has been rendered MORE THAN ONCE
 * by checking if an alternate fiber exists. We cannot reliably count the exact
 * number of renders without instrumenting React itself (e.g., via DevTools hooks).
 *
 * The "alternate" fiber is the previous committed version. If it exists, the
 * component has rendered at least twice.
 */
export function detectRenderReason(fiber: ReactFiber): RenderAnalysis {
  const alternate = fiber.alternate;

  // No alternate means this is the initial render (component rendered exactly once)
  if (!alternate) {
    return {
      renderCount: 1,
      lastRenderReason: 'Initial render',
    };
  }

  // Alternate exists - component has rendered at least twice.
  // We can't know the exact count, but we can indicate it's been re-rendered.
  const result: RenderAnalysis = {
    renderCount: 2, // Indicates "has re-rendered" - not an exact count
  };

  // Analyze WHY it re-rendered by comparing props/state
  const changedProps = findChangedProps(alternate.memoizedProps, fiber.memoizedProps);
  if (changedProps.length > 0) {
    result.changedProps = changedProps;

    // Check specifically for style object identity change (common perf issue)
    if (changedProps.includes('style')) {
      const oldStyle = alternate.memoizedProps?.style;
      const newStyle = fiber.memoizedProps?.style;
      if (oldStyle && newStyle && JSON.stringify(oldStyle) === JSON.stringify(newStyle)) {
        result.lastRenderReason = "Prop 'style' changed identity (same value, new object)";
        return result;
      }
    }

    result.lastRenderReason = `Props changed: ${changedProps.join(', ')}`;
    return result;
  }

  // Check for state changes (hooks)
  if (fiber.memoizedState !== alternate.memoizedState) {
    result.lastRenderReason = 'State changed (hook update)';
    return result;
  }

  // Parent re-rendered (no props/state change detected)
  result.lastRenderReason = 'Parent re-rendered';
  return result;
}

// --- Main Export ---

/**
 * Extract framework information from a DOM element
 * In v2.0, this focuses exclusively on React
 */
export function extractFrameworkInfo(element: Element): FrameworkInfo {
  const fiber = getFiberFromElement(element);

  if (!fiber) {
    // No React fiber found - vanilla DOM
    return {
      type: 'vanilla',
      name: 'vanilla', // Legacy compat
    };
  }

  const componentFiber = findComponentFiber(fiber);

  if (componentFiber) {
    const displayName = getComponentName(componentFiber);
    const debugSource = componentFiber._debugSource;
    const ancestry = collectAncestry(componentFiber);
    const props = getSafeProps(componentFiber.memoizedProps);

    // Extract deep React state
    const hooks = extractHooks(componentFiber);
    const context = extractContext(componentFiber);

    const result: FrameworkInfo = {
      // v2.0 fields
      type: 'react',
      displayName,
      key: componentFiber.key,
      filePath: debugSource?.fileName,
      lineNumber: debugSource?.lineNumber,
      ancestry: ancestry.length > 0 ? ancestry : undefined,
      state: {
        props,
        hooks,
        context,
      },

      // Legacy compat
      name: 'react',
      componentName: displayName,
      props,
    };

    return result;
  }

  // React element but no user component found (just DOM nodes in React tree)
  const ancestry = collectAncestry(fiber);

  return {
    type: 'react',
    name: 'react', // Legacy compat
    ancestry: ancestry.length > 0 ? ancestry : undefined,
  };
}

/**
 * Get render analysis for the current element's component
 */
export function getRenderAnalysis(element: Element): RenderAnalysis | null {
  const fiber = getFiberFromElement(element);
  if (!fiber) return null;

  const componentFiber = findComponentFiber(fiber);
  if (!componentFiber) return null;

  return detectRenderReason(componentFiber);
}
