/**
 * Drag handlers for Eyeglass Inspector panel
 */
export interface DragState {
    isDragging: boolean;
    dragOffset: {
        x: number;
        y: number;
    };
    panel: HTMLDivElement | null;
}
export interface DragCallbacks {
    setDragging: (isDragging: boolean) => void;
    setDragOffset: (offset: {
        x: number;
        y: number;
    }) => void;
    setCustomPanelPosition: (position: {
        x: number;
        y: number;
    }) => void;
}
/**
 * Creates panel drag handler functions
 */
export declare function createDragHandlers(getState: () => DragState, callbacks: DragCallbacks): {
    handlePanelDragStart: (e: MouseEvent) => void;
    handlePanelDrag: (e: MouseEvent) => void;
    handlePanelDragEnd: () => void;
};
