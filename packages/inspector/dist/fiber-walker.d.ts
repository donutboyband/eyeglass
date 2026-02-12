/**
 * React Fiber Walker - Deep React runtime introspection
 * Extracts component info, hooks, context, and re-render data from React DevTools internals
 */
import type { HookInfo, ContextInfo, ReactState } from '@eyeglass/types';
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
    memoizedState?: any;
    alternate?: ReactFiber | null;
    stateNode?: any;
}
export interface FrameworkInfo {
    type?: 'react' | 'vanilla';
    displayName?: string;
    key?: string | null;
    filePath?: string;
    lineNumber?: number;
    ancestry?: string[];
    state?: ReactState;
    name?: 'react' | 'vue' | 'svelte' | 'vanilla';
    componentName?: string;
    props?: Record<string, unknown>;
}
/**
 * Extract hooks from a fiber's memoizedState chain
 */
export declare function extractHooks(fiber: ReactFiber): HookInfo[];
/**
 * Extract context providers by walking up the fiber tree
 */
export declare function extractContext(fiber: ReactFiber): ContextInfo[];
export interface RenderAnalysis {
    renderCount: number;
    lastRenderReason?: string;
    changedProps?: string[];
}
/**
 * Detect why a component re-rendered by comparing with alternate fiber
 */
export declare function detectRenderReason(fiber: ReactFiber): RenderAnalysis;
/**
 * Extract framework information from a DOM element
 * In v2.0, this focuses exclusively on React
 */
export declare function extractFrameworkInfo(element: Element): FrameworkInfo;
/**
 * Get render analysis for the current element's component
 */
export declare function getRenderAnalysis(element: Element): RenderAnalysis | null;
export {};
