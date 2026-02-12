/**
 * Eyeglass Inspector - Glass UI for visual element inspection
 * v2.0 - Loupe-to-Lens interaction model
 */

import type {
  FocusPayload,
  SemanticSnapshot,
  ActivityEvent,
  InteractionStatus,
} from "@eyeglass/types";
import { captureSnapshot } from "./snapshot.js";

// Import constants
import { WORKING_PHRASES } from "./constants.js";

// Import types
import type { PanelMode, HistoryItem, ThemePreference, HubPage } from "./types.js";

// Import styles
import { STYLES } from "./styles.js";

// Import utilities
import { escapeHtml, updateCursor, generateInteractionId } from "./utils/helpers.js";
import {
  connectSSE,
  submitFocus,
  submitAnswer,
  requestUndo,
  requestCommit,
  buildHistoryItem,
} from "./utils/network.js";

// Import renderers
import {
  renderHubMainPage,
  renderHubSettingsPage,
} from "./renderers/hub.js";
import {
  renderInputMode,
  renderActivityMode,
  calculatePanelPosition,
  updateFooterStatusText,
} from "./renderers/panel.js";

// Import v2.0 Loupe/Lens renderers
import {
  createLoupe,
  updateLoupe,
  showLoupe,
  hideLoupe,
} from "./renderers/loupe.js";
import {
  renderLensCard,
  calculateLensPosition,
} from "./renderers/lens.js";
import {
  findRelatedElements,
  renderContextOverlays,
  clearContextOverlays,
  updateOverlayPositions,
  type ContextOverlay,
} from "./renderers/context-overlays.js";

// Import handlers
import {
  createMouseMoveHandler,
  createClickHandler,
  createKeyDownHandler,
  createScrollHandler,
} from "./handlers/events.js";
import { createDragHandlers } from "./handlers/drag.js";

// Import state management
import {
  saveSession,
  loadSession,
  clearSession,
  loadHistory,
  saveHistory,
  addToHistory,
  updateHistoryStatus,
  removeFromHistory,
  loadEnabledState,
  saveEnabledState,
  loadAutoCommitState,
  saveAutoCommitState,
  loadThemeState,
  saveThemeState,
} from "./state/persistence.js";
import {
  renderMultiSelectHighlights,
  clearMultiSelectHighlights,
  updateMultiSelectHighlightPositions,
  disableHighlightTransitions,
  enableHighlightTransitions,
} from "./state/multi-select.js";

// v2.0 UI Mode - Loupe follows cursor, Lens is expanded view
type UIMode = 'loupe' | 'lens';

export class EyeglassInspector extends HTMLElement {
  private shadow: ShadowRoot;
  private highlight: HTMLDivElement | null = null;
  private panel: HTMLDivElement | null = null;
  private toast: HTMLDivElement | null = null;
  private hub: HTMLDivElement | null = null;
  private currentElement: Element | null = null;
  private currentSnapshot: SemanticSnapshot | null = null;
  private interactionId: string | null = null;
  private frozen = false;
  private eventSource: EventSource | null = null;
  private throttleTimeout: number | null = null;
  private mode: PanelMode = "input";
  private activityEvents: ActivityEvent[] = [];
  private currentStatus: InteractionStatus = "idle";
  private hubExpanded = false;
  private hubPage: HubPage = "main";
  private inspectorEnabled = true;
  private autoCommitEnabled = true;
  private themePreference: ThemePreference = "auto";
  private history: HistoryItem[] = [];
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private customPanelPosition: { x: number; y: number } | null = null;

  // Multi-select state
  private multiSelectMode = false;
  private selectedElements: Element[] = [];
  private selectedSnapshots: SemanticSnapshot[] = [];
  private multiSelectHighlights: HTMLDivElement[] = [];
  private submittedSnapshots: SemanticSnapshot[] = [];

  // Cursor style element (injected into document head)
  private cursorStyleElement: HTMLStyleElement | null = null;

  // Scroll handling
  private scrollTimeout: number | null = null;

  // Rotating status phrases
  private phraseIndex = 0;
  private phraseInterval: number | null = null;

  // User note (stored temporarily)
  private _userNote = "";

  // v2.0 Loupe/Lens UI state
  private uiMode: UIMode = 'loupe';
  private loupe: HTMLDivElement | null = null;
  private lens: HTMLDivElement | null = null;
  private lastMouseX = 0;
  private lastMouseY = 0;

  // Context overlay state
  private showingContextOverlays = false;
  private contextOverlays: ContextOverlay[] = [];
  private contextOverlayElements: HTMLDivElement[] = [];

  // Bound handlers
  private handleMouseMove: (e: MouseEvent) => void;
  private handleClick: (e: MouseEvent) => void;
  private handleKeyDown: (e: KeyboardEvent) => void;
  private handleScroll: () => void;
  private dragHandlers: ReturnType<typeof createDragHandlers>;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "closed" });

    // Create bound handlers
    this.handleMouseMove = createMouseMoveHandler(
      this,
      this.shadow,
      () => ({
        frozen: this.frozen,
        multiSelectMode: this.multiSelectMode,
        inspectorEnabled: this.inspectorEnabled,
        throttleTimeout: this.throttleTimeout,
      }),
      {
        setThrottleTimeout: (t) => (this.throttleTimeout = t),
        hideHighlight: () => this.hideHighlight(),
        showHighlight: (el, e?: MouseEvent) => {
          // v2.0: Track mouse position for Loupe
          if (e) {
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
          }
          this.showHighlight(el);
        },
        setCurrentElement: (el) => (this.currentElement = el),
      }
    );

    this.handleClick = createClickHandler(
      this,
      () => ({
        inspectorEnabled: this.inspectorEnabled,
        currentElement: this.currentElement,
        frozen: this.frozen,
        multiSelectMode: this.multiSelectMode,
      }),
      {
        toggleInSelection: (el) => this.toggleInSelection(el),
        freeze: () => this.freeze(),
      }
    );

    this.handleKeyDown = createKeyDownHandler(
      () => ({
        frozen: this.frozen,
      }),
      {
        unfreeze: () => this.unfreeze(),
        toggleInspectorEnabled: () => this.toggleInspectorEnabled(),
      }
    );

    this.handleScroll = createScrollHandler(
      () => ({
        frozen: this.frozen,
        currentElement: this.currentElement,
        highlight: this.highlight,
        multiSelectMode: this.multiSelectMode,
        selectedElements: this.selectedElements,
        scrollTimeout: this.scrollTimeout,
      }),
      {
        showHighlight: (el) => this.showHighlight(el),
        updateMultiSelectHighlightPositions: () =>
          updateMultiSelectHighlightPositions(
            this.selectedElements,
            this.multiSelectHighlights
          ),
        disableHighlightTransitions: () =>
          disableHighlightTransitions(this.highlight, this.multiSelectHighlights),
        enableHighlightTransitions: () =>
          enableHighlightTransitions(this.highlight, this.multiSelectHighlights),
        setScrollTimeout: (t) => (this.scrollTimeout = t),
      }
    );

    this.dragHandlers = createDragHandlers(
      () => ({
        isDragging: this.isDragging,
        dragOffset: this.dragOffset,
        panel: this.panel,
        lens: this.lens,
      }),
      {
        setDragging: (d) => (this.isDragging = d),
        setDragOffset: (o) => (this.dragOffset = o),
        setCustomPanelPosition: (p) => (this.customPanelPosition = p),
      }
    );
  }

  connectedCallback(): void {
    const style = document.createElement("style");
    style.textContent = STYLES;
    this.shadow.appendChild(style);

    this.highlight = document.createElement("div");
    this.highlight.className = "highlight";
    this.highlight.style.display = "none";
    this.shadow.appendChild(this.highlight);

    // v2.0: Create the Loupe element
    this.loupe = createLoupe(this.shadow);

    document.addEventListener("mousemove", this.handleMouseMove, true);
    document.addEventListener("click", this.handleClick, true);
    document.addEventListener("keydown", this.handleKeyDown, true);
    window.addEventListener("scroll", this.handleScroll, true);

    this.inspectorEnabled = loadEnabledState();
    this.autoCommitEnabled = loadAutoCommitState();
    this.themePreference = loadThemeState();
    this.applyTheme();
    this.history = loadHistory();
    this.renderHub();
    this.connectSSE();
    this.restoreSession();
    this.updateCursor();
  }

  disconnectedCallback(): void {
    document.removeEventListener("mousemove", this.handleMouseMove, true);
    document.removeEventListener("click", this.handleClick, true);
    document.removeEventListener("keydown", this.handleKeyDown, true);
    window.removeEventListener("scroll", this.handleScroll, true);
    this.eventSource?.close();
    // Clean up cursor style
    if (this.cursorStyleElement) {
      this.cursorStyleElement.remove();
      this.cursorStyleElement = null;
    }
  }

  private connectSSE(): void {
    this.eventSource = connectSSE({
      onActivityEvent: (event) => this.handleActivityEvent(event),
      onReconnect: () => this.connectSSE(),
    });
  }

  private handleActivityEvent(event: ActivityEvent): void {
    // Update history for any matching interaction, even if not current
    if (event.type === "status") {
      this.history = updateHistoryStatus(
        this.history,
        event.interactionId,
        event.status
      );
      saveHistory(this.history);
      this.renderHub();
    }

    if (event.interactionId !== this.interactionId) return;

    this.activityEvents.push(event);

    if (event.type === "status") {
      this.currentStatus = event.status;
      // Persist session so we can show result after page reload
      saveSession(
        this.interactionId,
        this._userNote,
        this.currentSnapshot,
        this.currentStatus,
        event.message
      );

      // Manage phrase rotation based on status
      if (event.status === "fixing") {
        this.startPhraseRotation();
      } else {
        this.stopPhraseRotation();
      }

      if (event.status === "failed") {
        // Auto-close on failure after delay
        setTimeout(() => this.unfreeze(), 4000);
      }
      // Don't auto-close on success - show follow-up UI instead
    }

    // v2.0: Re-render lens when in lens mode
    if (this.uiMode === 'lens') {
      this.renderLens();
    } else {
      this.renderPanel();
    }
  }

  private restoreSession(): void {
    const session = loadSession();
    if (!session) return;

    // Only show toast for completed sessions
    if (session.status === "success" || session.status === "failed") {
      this.showResultToast(session);
      clearSession();
    }
  }

  private showResultToast(session: { status: InteractionStatus; message?: string; userNote: string }): void {
    this.toast = document.createElement("div");
    this.toast.className = "result-toast";

    const isSuccess = session.status === "success";
    const icon = isSuccess ? "\u2713" : "\u2715";
    const title = isSuccess ? "Done!" : "Failed";

    this.toast.innerHTML = `
      <div class="toast-icon ${session.status}">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${escapeHtml(session.message || session.userNote)}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;

    const closeBtn = this.toast.querySelector(".toast-close") as HTMLButtonElement;
    closeBtn.addEventListener("click", () => this.hideToast());

    this.shadow.appendChild(this.toast);

    // Auto-hide after 4 seconds
    setTimeout(() => this.hideToast(), 4000);
  }

  private hideToast(): void {
    if (this.toast) {
      this.toast.remove();
      this.toast = null;
    }
  }

  private applyTheme(): void {
    this.setAttribute("data-theme", this.themePreference);
  }

  private toggleInspectorEnabled(): void {
    this.inspectorEnabled = !this.inspectorEnabled;
    saveEnabledState(this.inspectorEnabled);
    if (!this.inspectorEnabled) {
      this.unfreeze();
    }
    this.updateCursor();
    this.renderHub();
  }

  private updateCursor(): void {
    this.cursorStyleElement = updateCursor(
      this.inspectorEnabled,
      this.frozen,
      this.multiSelectMode,
      this.cursorStyleElement
    );
  }

  private showHighlight(element: Element): void {
    if (!this.highlight) return;

    const rect = element.getBoundingClientRect();
    const padding = 3;
    this.highlight.style.display = "block";
    this.highlight.style.left = `${rect.left - padding}px`;
    this.highlight.style.top = `${rect.top - padding}px`;
    this.highlight.style.width = `${rect.width + padding * 2}px`;
    this.highlight.style.height = `${rect.height + padding * 2}px`;

    // v2.0: Update and show the Loupe when not frozen
    if (!this.frozen && this.loupe && this.uiMode === 'loupe') {
      // Capture snapshot for loupe display
      const snapshot = captureSnapshot(element);
      this.currentSnapshot = snapshot;
      // Pass element rect for intelligent positioning (not cursor position)
      updateLoupe(this.loupe, snapshot, rect);
      showLoupe(this.loupe);
    }
  }

  private hideHighlight(): void {
    if (this.highlight) {
      this.highlight.style.display = "none";
    }
    // v2.0: Hide the Loupe when not hovering
    if (this.loupe && !this.frozen) {
      hideLoupe(this.loupe);
    }
    // Don't clear currentElement - it's needed for panel rendering in multi-select mode
    // and will be updated naturally when mouse moves back to page elements
  }

  private freeze(): void {
    if (!this.currentElement) return;

    this.frozen = true;
    this.currentSnapshot = captureSnapshot(this.currentElement);
    // Initialize selectedElements with the first element
    this.selectedElements = [this.currentElement];
    this.selectedSnapshots = [this.currentSnapshot];
    this.mode = "input";
    this.activityEvents = [];
    this.currentStatus = "idle";
    this.updateCursor();

    // v2.0: Hide loupe and show lens
    if (this.loupe) {
      hideLoupe(this.loupe);
    }
    this.uiMode = 'lens';
    this.renderLens();
  }

  private unfreeze(): void {
    this.frozen = false;
    this.currentSnapshot = null;
    this.interactionId = null;
    this.mode = "input";
    this.activityEvents = [];
    this.customPanelPosition = null;

    // Clear multi-select state
    this.multiSelectMode = false;
    this.selectedElements = [];
    this.selectedSnapshots = [];
    this.submittedSnapshots = [];
    clearMultiSelectHighlights(
      { multiSelectHighlights: this.multiSelectHighlights } as any,
      this.shadow
    );
    this.multiSelectHighlights = [];

    // Stop phrase rotation
    this.stopPhraseRotation();

    // v2.0: Hide lens and reset to loupe mode
    this.hideLens();
    this.uiMode = 'loupe';

    // Clear context overlays
    this.hideContextOverlays();

    this.hidePanel();
    this.hideHighlight();
    this.updateCursor();
    clearSession();
  }

  private enterMultiSelectMode(): void {
    if (!this.frozen || this.multiSelectMode) return;

    this.multiSelectMode = true;
    // Render highlight for the first selected element
    this.multiSelectHighlights = renderMultiSelectHighlights(
      {
        multiSelectMode: true,
        selectedElements: this.selectedElements,
        selectedSnapshots: this.selectedSnapshots,
        multiSelectHighlights: this.multiSelectHighlights,
        currentElement: this.currentElement,
        currentSnapshot: this.currentSnapshot,
      },
      this.shadow
    );
    // Hide the main single highlight when in multi-select mode
    if (this.highlight) {
      this.highlight.style.display = "none";
    }
    this.updateCursor();

    // v2.0: Render lens when in lens mode
    if (this.uiMode === 'lens') {
      this.renderLens();
    } else {
      this.renderPanel();
    }
  }

  private exitMultiSelectMode(): void {
    this.multiSelectMode = false;
    // Keep the first selected element as the current single selection
    if (this.selectedElements.length > 0) {
      this.currentElement = this.selectedElements[0];
      this.currentSnapshot = this.selectedSnapshots[0];
    }
    this.selectedElements = this.currentElement ? [this.currentElement] : [];
    this.selectedSnapshots = this.currentSnapshot ? [this.currentSnapshot] : [];

    // Clear multi-select highlights
    clearMultiSelectHighlights(
      { multiSelectHighlights: this.multiSelectHighlights } as any,
      this.shadow
    );
    this.multiSelectHighlights = [];
    // Show single highlight for current element
    if (this.currentElement) {
      this.showHighlight(this.currentElement);
    }
    this.updateCursor();

    // v2.0: Render lens when in lens mode
    if (this.uiMode === 'lens') {
      this.renderLens();
    } else {
      this.renderPanel();
    }
  }

  private toggleInSelection(element: Element): void {
    if (!this.multiSelectMode) return;

    // Check if element is already selected (by reference)
    const existingIndex = this.selectedElements.indexOf(element);

    if (existingIndex >= 0) {
      // Remove from selection
      this.removeFromSelection(existingIndex);
    } else {
      // Add to selection (if under limit)

      const snapshot = captureSnapshot(element);
      this.selectedElements.push(element);
      this.selectedSnapshots.push(snapshot);
    }

    this.multiSelectHighlights = renderMultiSelectHighlights(
      {
        multiSelectMode: true,
        selectedElements: this.selectedElements,
        selectedSnapshots: this.selectedSnapshots,
        multiSelectHighlights: this.multiSelectHighlights,
        currentElement: this.currentElement,
        currentSnapshot: this.currentSnapshot,
      },
      this.shadow
    );
    // Hide the main single highlight when in multi-select mode
    if (this.highlight) {
      this.highlight.style.display = "none";
    }

    // v2.0: Render lens when in lens mode
    if (this.uiMode === 'lens') {
      this.renderLens();
    } else {
      this.renderPanel();
    }
  }

  private removeFromSelection(index: number): void {
    if (index < 0 || index >= this.selectedElements.length) return;

    // Don't allow removing the last element
    if (this.selectedElements.length === 1) {
      this.exitMultiSelectMode();
      return;
    }

    this.selectedElements.splice(index, 1);
    this.selectedSnapshots.splice(index, 1);

    this.multiSelectHighlights = renderMultiSelectHighlights(
      {
        multiSelectMode: true,
        selectedElements: this.selectedElements,
        selectedSnapshots: this.selectedSnapshots,
        multiSelectHighlights: this.multiSelectHighlights,
        currentElement: this.currentElement,
        currentSnapshot: this.currentSnapshot,
      },
      this.shadow
    );
    // Hide the main single highlight when in multi-select mode
    if (this.highlight) {
      this.highlight.style.display = "none";
    }

    // v2.0: Render lens when in lens mode
    if (this.uiMode === 'lens') {
      this.renderLens();
    } else {
      this.renderPanel();
    }
  }

  private renderHub(): void {
    if (!this.hub) {
      this.hub = document.createElement("div");
      this.hub.className = "hub";
      this.shadow.appendChild(this.hub);
    }

    if (this.hubPage === "settings") {
      renderHubSettingsPage(this.hub, {
        themePreference: this.themePreference,
        autoCommitEnabled: this.autoCommitEnabled,
      }, {
        onBack: () => {
          this.hubPage = "main";
          this.renderHub();
        },
        onThemeChange: (theme) => {
          this.themePreference = theme;
          saveThemeState(theme);
          this.applyTheme();
          this.renderHub();
        },
        onAutoCommitToggle: () => {
          this.autoCommitEnabled = !this.autoCommitEnabled;
          saveAutoCommitState(this.autoCommitEnabled);
          this.renderHub();
        },
      });
    } else {
      renderHubMainPage(this.hub, {
        hubExpanded: this.hubExpanded,
        inspectorEnabled: this.inspectorEnabled,
        history: this.history,
      }, {
        onToggleExpanded: () => {
          this.hubExpanded = !this.hubExpanded;
          this.renderHub();
        },
        onToggleEnabled: () => this.toggleInspectorEnabled(),
        onOpenSettings: () => {
          this.hubPage = "settings";
          this.hubExpanded = true;
          this.renderHub();
        },
        onUndo: (id) => this.handleUndoRequest(id),
      });
    }
  }

  private renderPanel(): void {
    if (!this.currentSnapshot || !this.currentElement) return;

    const rect = this.currentElement.getBoundingClientRect();
    const { framework } = this.currentSnapshot;

    if (!this.panel) {
      this.panel = document.createElement("div");
      this.panel.className = "glass-panel";
      this.shadow.appendChild(this.panel);
    }

    // Position panel
    const position = calculatePanelPosition(rect, this.mode, this.customPanelPosition);
    this.panel.style.left = `${position.x}px`;
    this.panel.style.top = `${position.y}px`;

    const componentName = framework.componentName || this.currentSnapshot.tagName;
    const filePath = framework.filePath
      ? framework.filePath.split("/").slice(-2).join("/")
      : null;

    if (this.mode === "input") {
      renderInputMode(this.panel, {
        componentName,
        filePath,
        multiSelectMode: this.multiSelectMode,
        selectedSnapshots: this.selectedSnapshots,
      }, {
        onClose: () => this.unfreeze(),
        onSubmit: (userNote) => this.submit(userNote),
        onToggleMultiSelect: () => {
          if (this.multiSelectMode) {
            this.exitMultiSelectMode();
          } else {
            this.enterMultiSelectMode();
          }
        },
        onRemoveFromSelection: (index) => this.removeFromSelection(index),
        onPanelDragStart: this.dragHandlers.handlePanelDragStart,
      });
    } else {
      renderActivityMode(this.panel, {
        componentName,
        filePath,
        submittedSnapshots: this.submittedSnapshots,
        activityEvents: this.activityEvents,
        currentStatus: this.currentStatus,
        autoCommitEnabled: this.autoCommitEnabled,
        userNote: this._userNote,
        interactionId: this.interactionId,
        phraseIndex: this.phraseIndex,
      }, {
        onClose: () => this.unfreeze(),
        onSubmitFollowUp: (userNote) => this.submitFollowUp(userNote),
        onSubmitAnswer: (qId, aId, aLabel) => this.handleSubmitAnswer(qId, aId, aLabel),
        onCommit: () => this.handleCommitRequest(),
        onUndo: () => this.handleUndoFromPanel(),
        onPanelDragStart: this.dragHandlers.handlePanelDragStart,
      });
    }
  }

  private hidePanel(): void {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }

  // ========================================
  // v2.0 Lens Card Methods
  // ========================================

  private renderLens(): void {
    if (!this.currentSnapshot || !this.currentElement) return;

    if (!this.lens) {
      this.lens = document.createElement("div");
      this.lens.className = "lens-card";
      this.shadow.appendChild(this.lens);
    }

    // Render the lens card content
    const state = {
      shadow: this.shadow,
      highlight: this.highlight,
      panel: this.panel,
      toast: this.toast,
      hub: this.hub,
      currentElement: this.currentElement,
      currentSnapshot: this.currentSnapshot,
      interactionId: this.interactionId,
      frozen: this.frozen,
      mode: this.mode,
      activityEvents: this.activityEvents,
      currentStatus: this.currentStatus,
      hubExpanded: this.hubExpanded,
      hubPage: this.hubPage,
      inspectorEnabled: this.inspectorEnabled,
      autoCommitEnabled: this.autoCommitEnabled,
      themePreference: this.themePreference,
      history: this.history,
      isDragging: this.isDragging,
      dragOffset: this.dragOffset,
      customPanelPosition: this.customPanelPosition,
      multiSelectMode: this.multiSelectMode,
      selectedElements: this.selectedElements,
      selectedSnapshots: this.selectedSnapshots,
      multiSelectHighlights: this.multiSelectHighlights,
      submittedSnapshots: this.submittedSnapshots,
      cursorStyleElement: this.cursorStyleElement,
      throttleTimeout: this.throttleTimeout,
      scrollTimeout: this.scrollTimeout,
      phraseIndex: this.phraseIndex,
      phraseInterval: this.phraseInterval,
      _userNote: this._userNote,
      eventSource: this.eventSource,
    };

    const callbacks = {
      unfreeze: () => this.unfreeze(),
      submit: (userNote: string) => this.submit(userNote),
      submitFollowUp: (userNote: string) => this.submitFollowUp(userNote),
      submitAnswer: (qId: string, aId: string, aLabel: string) => this.handleSubmitAnswer(qId, aId, aLabel),
      requestUndo: (id: string) => this.handleUndoRequest(id),
      requestCommit: (id: string) => this.handleCommitRequest(),
      enterMultiSelectMode: () => this.enterMultiSelectMode(),
      exitMultiSelectMode: () => this.exitMultiSelectMode(),
      removeFromSelection: (index: number) => this.removeFromSelection(index),
      toggleHubExpanded: () => { this.hubExpanded = !this.hubExpanded; this.renderHub(); },
      toggleInspectorEnabled: () => this.toggleInspectorEnabled(),
      openSettingsPage: () => { this.hubPage = "settings"; this.hubExpanded = true; this.renderHub(); },
      closeSettingsPage: () => { this.hubPage = "main"; this.renderHub(); },
      setTheme: (theme: ThemePreference) => { this.themePreference = theme; saveThemeState(theme); this.applyTheme(); },
      toggleAutoCommit: () => { this.autoCommitEnabled = !this.autoCommitEnabled; saveAutoCommitState(this.autoCommitEnabled); },
      handlePanelDragStart: this.dragHandlers.handlePanelDragStart,
      renderHub: () => this.renderHub(),
      renderPanel: () => this.renderPanel(),
    };

    this.lens.innerHTML = renderLensCard(state, callbacks);

    // Position the lens card
    const elementRect = this.currentElement.getBoundingClientRect();
    const lensRect = { width: 320, height: this.lens.offsetHeight || 300 };
    const position = calculateLensPosition(elementRect, lensRect);
    this.lens.style.left = `${position.x}px`;
    this.lens.style.top = `${position.y}px`;

    // Wire up event listeners
    this.wireLensEvents();
  }

  private wireLensEvents(): void {
    if (!this.lens) return;

    // Drag handler on header
    const header = this.lens.querySelector('.lens-header');
    if (header) {
      header.addEventListener("mousedown", this.dragHandlers.handleLensDragStart as EventListener);
    }

    // Close button
    const closeBtn = this.lens.querySelector('[data-action="close"]');
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.unfreeze());
    }

    // Submit button
    const submitBtn = this.lens.querySelector('[data-action="submit"]');
    const input = this.lens.querySelector('.lens-input') as HTMLInputElement;
    if (submitBtn && input) {
      submitBtn.addEventListener("click", () => {
        if (input.value.trim()) {
          this.submit(input.value);
        }
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
          this.submit(input.value);
        }
      });
      // Auto-focus input
      setTimeout(() => input.focus(), 100);
    }

    // Multi-select button
    const multiSelectBtn = this.lens.querySelector('[data-action="multi-select"]');
    if (multiSelectBtn) {
      multiSelectBtn.addEventListener("click", () => {
        if (this.multiSelectMode) {
          this.exitMultiSelectMode();
        } else {
          this.enterMultiSelectMode();
        }
        this.renderLens();
      });
    }

    // Toggle context overlays
    const contextBtn = this.lens.querySelector('[data-action="toggle-context"]');
    if (contextBtn) {
      contextBtn.addEventListener("click", () => this.toggleContextOverlays());
    }

    // Exit multi-select
    const exitMultiBtn = this.lens.querySelector('[data-action="exit-multi"]');
    if (exitMultiBtn) {
      exitMultiBtn.addEventListener("click", () => {
        this.exitMultiSelectMode();
        this.renderLens();
      });
    }

    // Remove from selection
    this.lens.querySelectorAll('[data-action="remove-selection"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index") || "0", 10);
        this.removeFromSelection(index);
        this.renderLens();
      });
    });

    // Answer question
    this.lens.querySelectorAll('[data-action="answer"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const qId = btn.getAttribute("data-question-id") || "";
        const aId = btn.getAttribute("data-answer-id") || "";
        const aLabel = btn.getAttribute("data-answer-label") || "";
        this.handleSubmitAnswer(qId, aId, aLabel);
      });
    });

    // New request button
    const newRequestBtn = this.lens.querySelector('[data-action="new-request"]');
    if (newRequestBtn) {
      newRequestBtn.addEventListener("click", () => {
        this.mode = "input";
        this.activityEvents = [];
        this.currentStatus = "idle";
        this.renderLens();
      });
    }
  }

  private hideLens(): void {
    if (this.lens) {
      this.lens.remove();
      this.lens = null;
    }
  }

  // ========================================
  // v2.0 Context Overlay Methods
  // ========================================

  private toggleContextOverlays(): void {
    if (this.showingContextOverlays) {
      this.hideContextOverlays();
    } else {
      this.showContextOverlays();
    }
  }

  private showContextOverlays(): void {
    if (!this.currentElement || !this.currentSnapshot) return;

    this.showingContextOverlays = true;
    this.contextOverlays = findRelatedElements(this.currentElement, this.currentSnapshot);
    this.contextOverlayElements = renderContextOverlays(this.shadow, this.contextOverlays);
  }

  private hideContextOverlays(): void {
    this.showingContextOverlays = false;
    clearContextOverlays(this.shadow);
    this.contextOverlays = [];
    this.contextOverlayElements = [];
  }

  private startPhraseRotation(): void {
    if (this.phraseInterval) return;
    this.phraseIndex = Math.floor(Math.random() * WORKING_PHRASES.length);
    this.phraseInterval = window.setInterval(() => {
      this.phraseIndex = (this.phraseIndex + 1) % WORKING_PHRASES.length;
      updateFooterStatusText(this.panel, this.currentStatus, this.phraseIndex);
    }, 10000);
  }

  private stopPhraseRotation(): void {
    if (this.phraseInterval) {
      window.clearInterval(this.phraseInterval);
      this.phraseInterval = null;
    }
  }

  private async submit(userNote: string): Promise<void> {
    if (!userNote.trim()) return;
    if (this.selectedSnapshots.length === 0 && !this.currentSnapshot) return;

    this.interactionId = generateInteractionId();
    this._userNote = userNote.trim();

    // Build payload
    const snapshots =
      this.selectedSnapshots.length > 0
        ? this.selectedSnapshots
        : this.currentSnapshot
          ? [this.currentSnapshot]
          : [];
    // Store for activity mode display
    this.submittedSnapshots = [...snapshots];

    // Add to history
    const historyItem = buildHistoryItem(this.interactionId, userNote, snapshots);
    this.history = addToHistory(this.history, historyItem);
    saveHistory(this.history);
    this.renderHub();

    // Store multi-select state to restore on failure
    const wasMultiSelect = this.multiSelectMode;
    const savedElements = [...this.selectedElements];
    const savedSnapshots = [...this.selectedSnapshots];

    // Clear multi-select highlights before switching to activity mode
    clearMultiSelectHighlights(
      { multiSelectHighlights: this.multiSelectHighlights } as any,
      this.shadow
    );
    this.multiSelectHighlights = [];
    this.multiSelectMode = false;

    this.mode = "activity";
    this.activityEvents = [];
    this.currentStatus = "pending";

    // v2.0: Render lens when in lens mode
    if (this.uiMode === 'lens') {
      this.renderLens();
    } else {
      this.renderPanel();
    }

    const result = await submitFocus({
      interactionId: this.interactionId,
      userNote: userNote.trim(),
      autoCommit: this.autoCommitEnabled,
      snapshots,
    });

    if (!result.success) {
      this.currentStatus = "failed";
      this.history = updateHistoryStatus(this.history, this.interactionId, "failed");
      saveHistory(this.history);
      this.renderHub();
      this.activityEvents.push({
        type: "status",
        interactionId: this.interactionId,
        status: "failed",
        message: result.error || "Failed to connect to bridge",
        timestamp: Date.now(),
      });

      // Restore multi-select state on failure so user doesn't lose their selection
      if (wasMultiSelect && savedElements.length > 1) {
        this.multiSelectMode = true;
        this.selectedElements = savedElements;
        this.selectedSnapshots = savedSnapshots;
        this.mode = "input";
        this.multiSelectHighlights = renderMultiSelectHighlights(
          {
            multiSelectMode: true,
            selectedElements: this.selectedElements,
            selectedSnapshots: this.selectedSnapshots,
            multiSelectHighlights: this.multiSelectHighlights,
            currentElement: this.currentElement,
            currentSnapshot: this.currentSnapshot,
          },
          this.shadow
        );
        // Hide the main single highlight when in multi-select mode
        if (this.highlight) {
          this.highlight.style.display = "none";
        }
      }

      // v2.0: Render lens when in lens mode
      if (this.uiMode === 'lens') {
        this.renderLens();
      } else {
        this.renderPanel();
      }
    }
  }

  private async submitFollowUp(userNote: string): Promise<void> {
    if (!userNote.trim()) return;
    if (this.submittedSnapshots.length === 0) return;

    // Create new interaction ID for the follow-up
    this.interactionId = generateInteractionId();
    this._userNote = userNote.trim();

    // Reuse the same snapshots from the previous request
    const snapshots = this.submittedSnapshots;

    // Add to history
    const historyItem = buildHistoryItem(this.interactionId, userNote, snapshots);
    this.history = addToHistory(this.history, historyItem);
    saveHistory(this.history);
    this.renderHub();

    // Reset activity state for new request
    this.activityEvents = [];
    this.currentStatus = "pending";

    // v2.0: Render lens when in lens mode
    if (this.uiMode === 'lens') {
      this.renderLens();
    } else {
      this.renderPanel();
    }

    const result = await submitFocus({
      interactionId: this.interactionId,
      userNote: userNote.trim(),
      autoCommit: this.autoCommitEnabled,
      snapshots,
    });

    if (!result.success) {
      this.currentStatus = "failed";
      this.history = updateHistoryStatus(this.history, this.interactionId, "failed");
      saveHistory(this.history);
      this.renderHub();
      this.activityEvents.push({
        type: "status",
        interactionId: this.interactionId,
        status: "failed",
        message: result.error || "Failed to connect to bridge",
        timestamp: Date.now(),
      });

      // v2.0: Render lens when in lens mode
      if (this.uiMode === 'lens') {
        this.renderLens();
      } else {
        this.renderPanel();
      }
    }
  }

  private async handleSubmitAnswer(
    questionId: string,
    answerId: string,
    answerLabel: string
  ): Promise<void> {
    if (!this.interactionId) return;

    // Mark the question as answered in the activity events
    const questionEvent = this.activityEvents.find(
      (e) => e.type === "question" && (e as any).questionId === questionId
    );
    if (questionEvent) {
      (questionEvent as any).selectedAnswerId = answerId;
      (questionEvent as any).selectedAnswerLabel = answerLabel;
    }

    // Re-render to show the selected answer
    // v2.0: Render lens when in lens mode
    if (this.uiMode === 'lens') {
      this.renderLens();
    } else {
      this.renderPanel();
    }

    await submitAnswer(this.interactionId, questionId, answerId, answerLabel);
  }

  private async handleUndoRequest(interactionId: string): Promise<void> {
    const itemIndex = this.history.findIndex(
      (h) => h.interactionId === interactionId
    );
    if (itemIndex === -1) return;

    // Mark as pending while undo is in progress
    this.history[itemIndex].status = "pending";
    saveHistory(this.history);
    this.renderHub();

    const result = await requestUndo(interactionId);

    if (result.success) {
      // Remove from history on successful undo
      this.history = removeFromHistory(this.history, interactionId);
    } else {
      // Mark as failed if undo didn't work
      this.history[itemIndex].status = "failed";
    }
    saveHistory(this.history);
    this.renderHub();
  }

  private async handleUndoFromPanel(): Promise<void> {
    if (this.interactionId) {
      await this.handleUndoRequest(this.interactionId);
    }
  }

  private async handleCommitRequest(): Promise<void> {
    if (!this.interactionId) return;

    const itemIndex = this.history.findIndex(
      (h) => h.interactionId === this.interactionId
    );

    const result = await requestCommit(this.interactionId);

    if (result.success) {
      // Update status to show it's committed
      if (itemIndex >= 0) {
        this.history[itemIndex].status = "success";
        saveHistory(this.history);
        this.renderHub();
      }
      // Close the panel after commit
      this.unfreeze();
    }
  }
}

if (!customElements.get("eyeglass-inspector")) {
  customElements.define("eyeglass-inspector", EyeglassInspector);
}
