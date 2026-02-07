/**
 * React Fiber Walker - extracts component info from React DevTools internals
 */
export interface FrameworkInfo {
    name: 'react' | 'vue' | 'svelte' | 'vanilla';
    componentName?: string;
    filePath?: string;
    lineNumber?: number;
    props?: Record<string, unknown>;
}
/**
 * Extract framework information from a DOM element
 */
export declare function extractFrameworkInfo(element: Element): FrameworkInfo;
