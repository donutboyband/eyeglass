/**
 * Drag handlers for Eyeglass Inspector panel
 */

export interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  panel: HTMLDivElement | null;
}

export interface DragCallbacks {
  setDragging: (isDragging: boolean) => void;
  setDragOffset: (offset: { x: number; y: number }) => void;
  setCustomPanelPosition: (position: { x: number; y: number }) => void;
}

/**
 * Creates panel drag handler functions
 */
export function createDragHandlers(
  getState: () => DragState,
  callbacks: DragCallbacks
): {
  handlePanelDragStart: (e: MouseEvent) => void;
  handlePanelDrag: (e: MouseEvent) => void;
  handlePanelDragEnd: () => void;
} {
  const handlePanelDrag = (e: MouseEvent): void => {
    const state = getState();
    if (!state.isDragging || !state.panel) return;

    const x = Math.max(
      0,
      Math.min(e.clientX - state.dragOffset.x, window.innerWidth - 340)
    );
    const y = Math.max(
      0,
      Math.min(e.clientY - state.dragOffset.y, window.innerHeight - 100)
    );

    callbacks.setCustomPanelPosition({ x, y });
    state.panel.style.left = `${x}px`;
    state.panel.style.top = `${y}px`;
  };

  const handlePanelDragEnd = (): void => {
    callbacks.setDragging(false);
    document.removeEventListener("mousemove", handlePanelDrag);
    document.removeEventListener("mouseup", handlePanelDragEnd);
  };

  const handlePanelDragStart = (e: MouseEvent): void => {
    // Don't drag if clicking on buttons
    if ((e.target as HTMLElement).closest("button")) return;

    const state = getState();
    if (!state.panel) return;

    callbacks.setDragging(true);
    const panelRect = state.panel.getBoundingClientRect();
    callbacks.setDragOffset({
      x: e.clientX - panelRect.left,
      y: e.clientY - panelRect.top,
    });

    document.addEventListener("mousemove", handlePanelDrag);
    document.addEventListener("mouseup", handlePanelDragEnd);
  };

  return {
    handlePanelDragStart,
    handlePanelDrag,
    handlePanelDragEnd,
  };
}
