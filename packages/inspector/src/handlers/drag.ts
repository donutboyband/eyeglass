/**
 * Drag handlers for Eyeglass Inspector panel and lens
 */

export interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  panel: HTMLDivElement | null;
  lens?: HTMLDivElement | null;
}

export interface DragCallbacks {
  setDragging: (isDragging: boolean) => void;
  setDragOffset: (offset: { x: number; y: number }) => void;
  setCustomPanelPosition: (position: { x: number; y: number }) => void;
  setCustomLensPosition: (position: { x: number; y: number }) => void;
}

/**
 * Creates panel/lens drag handler functions
 */
export function createDragHandlers(
  getState: () => DragState,
  callbacks: DragCallbacks
): {
  handlePanelDragStart: (e: MouseEvent) => void;
  handlePanelDrag: (e: MouseEvent) => void;
  handlePanelDragEnd: () => void;
  handleLensDragStart: (e: MouseEvent) => void;
} {
  // Track which element is being dragged
  let dragTarget: HTMLDivElement | null = null;

  const handleDrag = (e: MouseEvent): void => {
    const state = getState();
    if (!state.isDragging || !dragTarget) return;

    const x = Math.max(
      0,
      Math.min(e.clientX - state.dragOffset.x, window.innerWidth - 340)
    );
    const y = Math.max(
      0,
      Math.min(e.clientY - state.dragOffset.y, window.innerHeight - 100)
    );

    if (dragTarget === state.lens) {
      callbacks.setCustomLensPosition({ x, y });
    } else {
      callbacks.setCustomPanelPosition({ x, y });
    }
    dragTarget.style.left = `${x}px`;
    dragTarget.style.top = `${y}px`;
  };

  const handleDragEnd = (): void => {
    callbacks.setDragging(false);
    dragTarget = null;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  const handlePanelDragStart = (e: MouseEvent): void => {
    // Don't drag if clicking on buttons or inputs
    if ((e.target as HTMLElement).closest("button, input")) return;

    const state = getState();
    if (!state.panel) return;

    dragTarget = state.panel;
    callbacks.setDragging(true);
    const panelRect = state.panel.getBoundingClientRect();
    callbacks.setDragOffset({
      x: e.clientX - panelRect.left,
      y: e.clientY - panelRect.top,
    });

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  const handleLensDragStart = (e: MouseEvent): void => {
    // Don't drag if clicking on buttons or inputs
    if ((e.target as HTMLElement).closest("button, input")) return;

    const state = getState();
    if (!state.lens) return;

    dragTarget = state.lens;
    callbacks.setDragging(true);
    const lensRect = state.lens.getBoundingClientRect();
    callbacks.setDragOffset({
      x: e.clientX - lensRect.left,
      y: e.clientY - lensRect.top,
    });

    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
  };

  return {
    handlePanelDragStart,
    handlePanelDrag: handleDrag,
    handlePanelDragEnd: handleDragEnd,
    handleLensDragStart,
  };
}
