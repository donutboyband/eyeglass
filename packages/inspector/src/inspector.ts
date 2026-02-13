/**
 * Eyeglass Inspector - Glass UI for visual element inspection
 * v2.0 - Loupe-to-Lens interaction model
 */

import type {
  FocusPayload,
  SemanticSnapshot,
  ActivityEvent,
  InteractionStatus,
  InteractionStateInfo,
} from "@eyeglass/types";
import { captureSnapshot } from "./snapshot.js";

// Import constants
import { WORKING_PHRASES } from "./constants.js";

// Import types
import type { PanelMode, HistoryItem, ThemePreference, HubPage, StateCapsule } from "./types.js";

// Import styles
import { STYLES } from "./styles.js";

// Import utilities
import { escapeHtml, updateCursor, generateInteractionId } from "./utils/helpers.js";
import { analyzeHealth, HealthIssue } from "./utils/health.js";
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
  renderDomPauseButton,
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
  LENS_STYLES,
  renderOrganizedSchema,
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

const STATE_VARIANTS = ["default", "hover", "focus", "pressed"];
const MAX_STATE_CAPSULES = 6;

export class EyeglassInspector extends HTMLElement {
  private shadow: ShadowRoot;
  private highlight: HTMLDivElement | null = null;
  private panel: HTMLDivElement | null = null;
  private toast: HTMLDivElement | null = null;
  private hub: HTMLDivElement | null = null;
  private domPauseBtn: HTMLButtonElement | null = null;
  private currentElement: Element | null = null;
  private currentSnapshot: SemanticSnapshot | null = null;
  private interactionId: string | null = null;
  private frozen = false;
  private eventSource: EventSource | null = null;
  private throttleTimeout: number | null = null;
  private mode: PanelMode = "input";
  private activityEvents: ActivityEvent[] = [];
  private currentStatus: InteractionStatus = "idle";
  private currentStatusMessage: string | null = null;
  private hubExpanded = false;
  private hubPage: HubPage = "main";
  private inspectorEnabled = true;
  private autoCommitEnabled = true;
  private themePreference: ThemePreference = "auto";
  private history: HistoryItem[] = [];
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private customPanelPosition: { x: number; y: number } | null = null;
  private customLensPosition: { x: number; y: number } | null = null;

  // Multi-select state
  private multiSelectMode = false;
  private selectedElements: Element[] = [];
  private selectedSnapshots: SemanticSnapshot[] = [];
  private multiSelectHighlights: HTMLDivElement[] = [];
  private submittedSnapshots: SemanticSnapshot[] = [];
  private stateCapsules: StateCapsule[] = [];
  private activeCapsuleId: string | null = null;
  private interactionStateLabel = "default";
  private frozenHealthIssues: HealthIssue[] = [];

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
  private crosshairX: HTMLDivElement | null = null;
  private crosshairY: HTMLDivElement | null = null;
  private simulatedHoverElement: Element | null = null;
  private simulatedPressedElement: Element | null = null;
  private simulatedFocusedElement: Element | null = null;
  private simulatedStateVariant: string = "default";
  private domPaused = false;
  private pauseStyleElement: HTMLStyleElement | null = null;
  private pausedAnimations: Animation[] = [];
  // For pausing JS animations (RAF-based)
  private nativeRAF: typeof requestAnimationFrame | null = null;
  private nativeCAF: typeof cancelAnimationFrame | null = null;
  private queuedRAFCallbacks: Map<number, FrameRequestCallback> = new Map();
  private rafIdCounter = 0;
  private pauseStartTime = 0;
  private totalPausedTime = 0;
  private rafInstalled = false;
  private pseudoMirrorReady = false;
  private pseudoMirrorStyle: HTMLStyleElement | null = null;
  private forcedStateElements = new Set<Element>();

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
            this.updateCrosshair(this.lastMouseX, this.lastMouseY);
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
        multiSelectMode: this.multiSelectMode,
        inspectorEnabled: this.inspectorEnabled,
      }),
      {
        unfreeze: () => this.unfreeze(),
        toggleInspectorEnabled: () => this.toggleInspectorEnabled(),
        toggleContextOverlays: () => this.toggleContextOverlays(),
        toggleMultiSelect: () => {
          if (!this.frozen) return;
          if (this.multiSelectMode) {
            this.exitMultiSelectMode();
          } else {
            this.enterMultiSelectMode();
          }
        },
        submitShortcut: () => this.submitFromLensShortcut(),
        rotateInteractionState: () => this.rotateInteractionState(),
        captureStateCapsule: () => this.captureStateCapsule(),
        toggleDomPause: () => this.toggleDomPause(),
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
        setCustomLensPosition: (p) => (this.customLensPosition = p),
      }
    );
  }

  connectedCallback(): void {
    const style = document.createElement("style");
    style.textContent = STYLES + LENS_STYLES;
    this.shadow.appendChild(style);

    this.highlight = document.createElement("div");
    this.highlight.className = "highlight";
    this.highlight.style.display = "none";
    this.shadow.appendChild(this.highlight);

    // v2.0: Create the Loupe element
    this.loupe = createLoupe(this.shadow);
    this.crosshairX = document.createElement("div");
    this.crosshairX.className = "crosshair crosshair-x";
    this.shadow.appendChild(this.crosshairX);

    this.crosshairY = document.createElement("div");
    this.crosshairY.className = "crosshair crosshair-y";
    this.shadow.appendChild(this.crosshairY);

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
    this.crosshairX?.remove();
    this.crosshairY?.remove();
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
      this.currentStatusMessage = event.message || null;
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
      this.toggleCrosshair(false);
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
    // Keep crosshair visible while hovering (but not when frozen)
    if (!this.frozen) {
      this.toggleCrosshair(true);
    }
  }

  private updateCrosshair(x: number, y: number): void {
    if (!this.crosshairX || !this.crosshairY) return;
    if (!this.inspectorEnabled) {
      this.toggleCrosshair(false);
      return;
    }
    this.crosshairX.style.transform = `translateY(${y}px)`;
    this.crosshairY.style.transform = `translateX(${x}px)`;
    this.toggleCrosshair(true);
  }

  private submitFromLensShortcut(): void {
    if (!this.lens) return;
    const input = this.lens.querySelector('.lens-input') as HTMLTextAreaElement | null;
    if (!input) return;
    const value = input.value.trim();
    if (!value) return;
    this.submit(value);
  }

  private toggleCrosshair(show: boolean): void {
    if (!this.crosshairX || !this.crosshairY) return;
    const opacity = show ? "1" : "0";
    this.crosshairX.style.opacity = opacity;
    this.crosshairY.style.opacity = opacity;
  }

  private hideHighlight(): void {
    if (this.highlight) {
      this.highlight.style.display = "none";
    }
    // v2.0: Hide the Loupe when not hovering
    if (this.loupe && !this.frozen) {
      hideLoupe(this.loupe);
    }
    this.toggleCrosshair(false);
    // Don't clear currentElement - it's needed for panel rendering in multi-select mode
    // and will be updated naturally when mouse moves back to page elements
  }

  private freeze(): void {
    if (!this.currentElement) return;

    this.frozen = true;
    this._userNote = "";
    // Turn off crosshair BEFORE capturing so we get accurate cursor values
    this.toggleCrosshair(false);
    this.updateCursor();
    // Ensure pseudo-mirror styles are ready BEFORE capturing snapshot
    // so all snapshots are captured under the same conditions
    this.ensurePseudoMirrorStyles();
    this.applyInteractionVariant(this.interactionStateLabel);
    // Now capture snapshot after styles are set up
    const snapshot = captureSnapshot(this.currentElement, this.buildInteractionStateInfo());
    this.applySnapshotSelection(snapshot);
    // Capture health issues from ALL states to get element-level issues
    // (some issues like affordance mismatch only appear on hover)
    this.frozenHealthIssues = this.captureAllStateHealthIssues();
    // Initialize selectedElements with the first element
    this.selectedElements = [this.currentElement];
    this.mode = "input";
    this.activityEvents = [];
    this.currentStatus = "idle";
    this.stateCapsules = [];
    const initialCapsule = this.pushCapsule(snapshot);
    this.activeCapsuleId = initialCapsule.id;

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
    this._userNote = "";
    this.activityEvents = [];
    this.currentStatusMessage = null;
    this.customPanelPosition = null;
    this.customLensPosition = null;

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
    this.stateCapsules = [];
    this.activeCapsuleId = null;
    this.interactionStateLabel = "default";
    this.frozenHealthIssues = [];
    this.clearSimulatedState();

    // Stop phrase rotation
    this.stopPhraseRotation();

    // v2.0: Hide lens and reset to loupe mode
    this.hideLens();
    this.uiMode = 'loupe';

    // Clear context overlays
    this.hideContextOverlays();

    this.hidePanel();
    this.hideHighlight();
    this.toggleCrosshair(false);
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
    this.toggleCrosshair(false);

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

  private buildInteractionStateInfo(overrides: Partial<InteractionStateInfo> = {}): InteractionStateInfo {
    return {
      variant: overrides.variant ?? this.interactionStateLabel,
      label: overrides.label ?? this.interactionStateLabel,
      domPaused: overrides.domPaused ?? this.domPaused,
      capturedAt: overrides.capturedAt ?? Date.now(),
    };
  }

  /**
   * Capture health issues from all interaction states (default, hover, focus, pressed)
   * and return a deduplicated combined list. This ensures element-level issues are caught
   * even if they only manifest on certain states (e.g., affordance mismatch on hover).
   */
  private captureAllStateHealthIssues(): HealthIssue[] {
    if (!this.currentElement) return [];

    const allIssues: HealthIssue[] = [];
    const seenMessages = new Set<string>();
    const states = ['default', 'hover', 'focus', 'pressed'];

    for (const state of states) {
      // Apply the state
      this.applyInteractionVariant(state);

      // Force style recalculation
      void (this.currentElement as HTMLElement).offsetHeight;

      // Capture snapshot for this state
      const snapshot = captureSnapshot(this.currentElement, this.buildInteractionStateInfo({ variant: state }));

      // Analyze health and add unique issues
      const issues = analyzeHealth(snapshot);
      for (const issue of issues) {
        if (!seenMessages.has(issue.message)) {
          seenMessages.add(issue.message);
          allIssues.push(issue);
        }
      }
    }

    // Reset to default state
    this.applyInteractionVariant('default');

    return allIssues;
  }

  private applySnapshotSelection(snapshot: SemanticSnapshot): void {
    this.currentSnapshot = snapshot;
    if (!this.multiSelectMode) {
      this.selectedSnapshots = [snapshot];
    }
  }

  private capturePreviewSnapshot(): void {
    if (!this.currentElement) return;
    // Clear active capsule first
    this.activeCapsuleId = null;
    // Capture fresh snapshot
    const info = this.buildInteractionStateInfo();
    const snapshot = captureSnapshot(this.currentElement, info);
    // Update current snapshot
    this.currentSnapshot = snapshot;
    if (!this.multiSelectMode) {
      this.selectedSnapshots = [snapshot];
    }
  }

  private toCapsule(snapshot: SemanticSnapshot): StateCapsule {
    const meta = snapshot.interactionState ?? this.buildInteractionStateInfo();
    const variant = meta.variant || "custom";
    return {
      id: generateInteractionId(),
      variant,
      label: meta.label || variant,
      snapshot,
      capturedAt: meta.capturedAt ?? Date.now(),
    };
  }

  private pushCapsule(snapshot: SemanticSnapshot): StateCapsule {
    const capsule = this.toCapsule(snapshot);
    this.stateCapsules = [capsule, ...this.stateCapsules].slice(0, MAX_STATE_CAPSULES);
    return capsule;
  }

  private captureStateCapsule(): void {
    if (!this.currentElement) return;
    this.applyInteractionVariant(this.interactionStateLabel);
    // Use rAF to ensure styles have been recalculated before capturing snapshot
    requestAnimationFrame(() => {
      if (!this.currentElement) return;
      const info = this.buildInteractionStateInfo();
      const snapshot = captureSnapshot(this.currentElement, info);
      this.applySnapshotSelection(snapshot);
      const capsule = this.pushCapsule(snapshot);
      this.activeCapsuleId = capsule.id;
      this.renderLens();
    });
  }

  private selectStateCapsule(id: string): void {
    const capsule = this.stateCapsules.find((c) => c.id === id);
    if (!capsule) return;
    this.activeCapsuleId = capsule.id;
    this.interactionStateLabel = capsule.variant;
    this.applyInteractionVariant(this.interactionStateLabel);
    this.applySnapshotSelection(capsule.snapshot);
    this.renderLens();
  }

  private deleteStateCapsule(id: string): void {
    const removedActive = this.activeCapsuleId === id;
    this.stateCapsules = this.stateCapsules.filter((c) => c.id !== id);
    if (removedActive) {
      const fallback = this.stateCapsules[0];
      if (fallback) {
        this.selectStateCapsule(fallback.id);
        return;
      }
      this.activeCapsuleId = null;
      this.applyInteractionVariant(this.interactionStateLabel);
      this.capturePreviewSnapshot();
    }
    this.renderLens();
  }

  private rotateInteractionState(): void {
    const currentIndex = STATE_VARIANTS.indexOf(this.interactionStateLabel);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % STATE_VARIANTS.length;
    this.interactionStateLabel = STATE_VARIANTS[nextIndex];
    this.applyInteractionVariant(this.interactionStateLabel);

    // For "default" state, use the initial capsule's snapshot if available
    // This avoids issues with browser's real :hover affecting the capture
    if (this.interactionStateLabel === "default") {
      const defaultCapsule = this.stateCapsules.find(c => c.variant === "default");
      if (defaultCapsule) {
        this.activeCapsuleId = null;
        this.currentSnapshot = defaultCapsule.snapshot;
        if (!this.multiSelectMode) {
          this.selectedSnapshots = [defaultCapsule.snapshot];
        }
      } else {
        this.capturePreviewSnapshot();
      }
    } else {
      this.capturePreviewSnapshot();
    }

    if (this.uiMode === 'lens') {
      this.renderLens();
    }
  }

  private applyInteractionVariant(variant: string): void {
    if (!this.currentElement) return;
    if (variant === this.simulatedStateVariant && variant !== "pressed") {
      return;
    }
    this.ensurePseudoMirrorStyles();
    this.clearSimulatedState();
    this.simulatedStateVariant = variant;
    switch (variant) {
      case "hover":
        this.simulateHover(this.currentElement);
        break;
      case "focus":
        this.simulateFocus(this.currentElement);
        break;
      case "pressed":
        this.simulatePressed(this.currentElement);
        break;
      default:
        break;
    }
    const forcedStates = this.getForcedStatesForVariant(variant);
    this.updateForcedStates(this.currentElement, forcedStates);
  }

  private clearSimulatedState(): void {
    // Clear tracked elements without dispatching events
    // (dispatching events can trigger React state changes that persist)
    this.simulatedHoverElement = null;
    this.simulatedPressedElement = null;
    if (this.simulatedFocusedElement && this.simulatedFocusedElement instanceof HTMLElement) {
      this.simulatedFocusedElement.blur();
      this.simulatedFocusedElement = null;
    }
    this.simulatedStateVariant = "default";
    if (this.currentElement) {
      this.updateForcedStates(this.currentElement, []);
    }
  }

  private simulateHover(element: Element): void {
    // Only track the element - don't dispatch events as they can trigger
    // React state changes that persist and interfere with snapshot capture
    this.simulatedHoverElement = element;
  }

  private simulateFocus(element: Element): void {
    if (element instanceof HTMLElement && typeof element.focus === "function") {
      try {
        element.focus({ preventScroll: true });
        this.simulatedFocusedElement = element;
      } catch {
        // ignore focus errors
      }
    }
  }

  private simulatePressed(element: Element): void {
    // Only track the element - don't dispatch events as they can trigger
    // React state changes that persist and interfere with snapshot capture
    this.simulatedPressedElement = element;
  }

  private dispatchSyntheticEvent(element: Element, type: string, options: MouseEventInit = {}): void {
    const eventInit: MouseEventInit = {
      bubbles: true,
      cancelable: true,
      view: window,
      ...options,
    };
    const isPointer = type.startsWith("pointer");
    if (isPointer && typeof PointerEvent !== "undefined") {
      try {
        element.dispatchEvent(new PointerEvent(type, eventInit));
        return;
      } catch {
        // fall back
      }
    }
    const mouseType = isPointer ? type.replace("pointer", "mouse") : type;
    element.dispatchEvent(new MouseEvent(mouseType as keyof DocumentEventMap, eventInit));
  }

  private getElementCenter(element: Element): { x: number; y: number } {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  private getForcedStatesForVariant(variant: string): string[] {
    switch (variant) {
      case "hover":
        return ["hover"];
      case "focus":
        return ["focus", "focus-visible"];
      case "pressed":
        return ["hover", "active"];
      default:
        return [];
    }
  }

  private updateForcedStates(element: Element, states: string[]): void {
    if (!element) return;
    if (states.length === 0) {
      // Use "default" instead of removing - this lets us override real :hover
      element.setAttribute("data-eyeglass-force-state", "default");
      this.forcedStateElements.add(element);
      return;
    }
    element.setAttribute("data-eyeglass-force-state", states.join(" "));
    this.forcedStateElements.add(element);
  }

  private ensurePseudoMirrorStyles(): void {
    if (this.pseudoMirrorReady) return;
    const rules: string[] = [];
    const defaultBlockers: string[] = [];
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        if (!sheet.cssRules) continue;
      } catch {
        continue;
      }
      try {
        this.collectPseudoMirrorRules(sheet.cssRules, rules, defaultBlockers);
      } catch {
        // Ignore sheets we can't read
      }
    }
    const allRules = [...rules, ...defaultBlockers];
    if (allRules.length > 0) {
      this.pseudoMirrorStyle = document.createElement("style");
      this.pseudoMirrorStyle.dataset.source = "eyeglass-pseudo-mirror";
      this.pseudoMirrorStyle.textContent = allRules.join("\n");
      document.head.appendChild(this.pseudoMirrorStyle);
    }
    this.pseudoMirrorReady = true;
  }

  private collectPseudoMirrorRules(ruleList: CSSRuleList, fragments: string[], defaultBlockers: string[]): void {
    const pseudos: Array<{ pseudo: string; attr: string }> = [
      { pseudo: ":hover", attr: '[data-eyeglass-force-state~="hover"]' },
      { pseudo: ":focus-visible", attr: '[data-eyeglass-force-state~="focus-visible"]' },
      { pseudo: ":focus", attr: '[data-eyeglass-force-state~="focus"]' },
      { pseudo: ":active", attr: '[data-eyeglass-force-state~="active"]' },
    ];

    const StyleRule = typeof CSSStyleRule !== "undefined" ? CSSStyleRule : null;
    const MediaRule = typeof CSSMediaRule !== "undefined" ? CSSMediaRule : null;
    const SupportsRule = typeof CSSSupportsRule !== "undefined" ? CSSSupportsRule : null;

    for (const rule of Array.from(ruleList)) {
      if (StyleRule && rule instanceof StyleRule) {
        const styleRule = rule as CSSStyleRule;
        let selector = styleRule.selectorText;
        let replaced = false;
        let hasHover = selector.includes(":hover");

        for (const { pseudo, attr } of pseudos) {
          if (selector.includes(pseudo)) {
            selector = selector.split(pseudo).join(attr);
            replaced = true;
          }
        }
        if (replaced) {
          fragments.push(`${selector} { ${styleRule.style.cssText} }`);

          // For :hover rules, also create a blocker for "default" state
          // This prevents real CSS :hover from applying when we want default state
          if (hasHover) {
            const defaultSelector = styleRule.selectorText.replace(/:hover/g, '[data-eyeglass-force-state="default"]:hover');
            // Reset each property to 'unset' to undo hover styles
            const props = Array.from(styleRule.style).map(p => `${p}: unset !important`).join("; ");
            defaultBlockers.push(`${defaultSelector} { ${props}; }`);
          }
        }
      } else if (MediaRule && rule instanceof MediaRule) {
        const nested: string[] = [];
        const nestedBlockers: string[] = [];
        this.collectPseudoMirrorRules(rule.cssRules, nested, nestedBlockers);
        if (nested.length > 0) {
          fragments.push(`@media ${rule.conditionText} {\n${nested.join("\n")}\n}`);
        }
        if (nestedBlockers.length > 0) {
          defaultBlockers.push(`@media ${rule.conditionText} {\n${nestedBlockers.join("\n")}\n}`);
        }
      } else if (SupportsRule && rule instanceof SupportsRule) {
        const nested: string[] = [];
        const nestedBlockers: string[] = [];
        this.collectPseudoMirrorRules(rule.cssRules, nested, nestedBlockers);
        if (nested.length > 0) {
          fragments.push(`@supports ${rule.conditionText} {\n${nested.join("\n")}\n}`);
        }
        if (nestedBlockers.length > 0) {
          defaultBlockers.push(`@supports ${rule.conditionText} {\n${nestedBlockers.join("\n")}\n}`);
        }
      }
    }
  }

  private toggleDomPause(): void {
    if (this.domPaused) {
      this.resumeDom();
    } else {
      this.pauseDom();
    }
    // Update the DOM pause button state
    this.renderHub();
    if (this.uiMode === 'lens') {
      this.renderLens();
    }
  }

  /**
   * Install a permanent RAF wrapper that adjusts timestamps to account for paused time.
   * This wrapper stays installed and ensures all RAF callbacks get adjusted timestamps.
   */
  private installRAFWrapper(): void {
    if (this.rafInstalled) return;

    // Store native functions
    this.nativeRAF = window.requestAnimationFrame.bind(window);
    this.nativeCAF = window.cancelAnimationFrame.bind(window);

    const self = this;

    // Map our IDs to native IDs for cancellation support
    const idMap = new Map<number, number>();

    window.requestAnimationFrame = function(callback: FrameRequestCallback): number {
      const ourId = ++self.rafIdCounter;

      if (self.domPaused) {
        // When paused, queue the callback instead of executing
        self.queuedRAFCallbacks.set(ourId, callback);
        return ourId;
      } else {
        // When not paused, call native RAF but adjust the timestamp
        const nativeId = self.nativeRAF!((timestamp: number) => {
          idMap.delete(ourId);
          // Always adjust timestamp by total paused time
          callback(timestamp - self.totalPausedTime);
        });
        idMap.set(ourId, nativeId);
        return ourId;
      }
    };

    window.cancelAnimationFrame = function(id: number): void {
      if (self.queuedRAFCallbacks.has(id)) {
        // Cancel queued callback
        self.queuedRAFCallbacks.delete(id);
      } else if (idMap.has(id)) {
        // Cancel native RAF callback
        self.nativeCAF!(idMap.get(id)!);
        idMap.delete(id);
      }
    };

    this.rafInstalled = true;
  }

  private pauseDom(): void {
    if (this.domPaused) return;
    this.domPaused = true;

    // Install RAF wrapper if not already installed
    this.installRAFWrapper();

    // Record when we started pausing
    this.pauseStartTime = performance.now();

    // 1. Pause Web Animations API animations
    if (typeof document.getAnimations === 'function') {
      this.pausedAnimations = document.getAnimations();
      this.pausedAnimations.forEach((anim) => {
        try {
          anim.pause();
        } catch {
          // ignore animation pause errors
        }
      });
    }

    // 2. Pause CSS animations/transitions via stylesheet
    this.pauseStyleElement = document.createElement("style");
    this.pauseStyleElement.dataset.source = "eyeglass-pause";
    this.pauseStyleElement.textContent = `
      * {
        transition-property: none !important;
        animation-play-state: paused !important;
      }
    `;
    document.head.appendChild(this.pauseStyleElement);

    // 3. Try to pause GSAP if present
    const gsap = (window as any).gsap;
    if (gsap?.globalTimeline?.pause) {
      try {
        gsap.globalTimeline.pause();
      } catch {
        // ignore
      }
    }

    document.documentElement.classList.add("eyeglass-dom-paused");
  }

  private resumeDom(): void {
    if (!this.domPaused) return;
    this.domPaused = false;

    // Calculate how long we were paused and add to total
    if (this.pauseStartTime > 0) {
      const pauseDuration = performance.now() - this.pauseStartTime;
      this.totalPausedTime += pauseDuration;
      this.pauseStartTime = 0;
    }

    // 1. Resume Web Animations API
    this.pausedAnimations.forEach((anim) => {
      try {
        anim.play();
      } catch {
        // ignore
      }
    });
    this.pausedAnimations = [];

    // 2. Remove pause stylesheet
    if (this.pauseStyleElement) {
      this.pauseStyleElement.remove();
      this.pauseStyleElement = null;
    }

    // 3. Flush queued RAF callbacks - they'll get adjusted timestamps through our wrapper
    const callbacks = Array.from(this.queuedRAFCallbacks.values());
    this.queuedRAFCallbacks.clear();

    callbacks.forEach((callback) => {
      try {
        // The wrapper will adjust the timestamp automatically
        window.requestAnimationFrame(callback);
      } catch {
        // ignore
      }
    });

    // 4. Resume GSAP if present
    const gsap = (window as any).gsap;
    if (gsap?.globalTimeline?.resume) {
      try {
        gsap.globalTimeline.resume();
      } catch {
        // ignore
      }
    }

    document.documentElement.classList.remove("eyeglass-dom-paused");
  }

  private renderHub(): void {
    if (!this.hub) {
      this.hub = document.createElement("div");
      this.hub.className = "hub";
      this.shadow.appendChild(this.hub);
    }

    // Create DOM pause button if it doesn't exist
    if (!this.domPauseBtn) {
      this.domPauseBtn = document.createElement("button");
      this.shadow.appendChild(this.domPauseBtn);
    }

    // Render the DOM pause button
    renderDomPauseButton(this.domPauseBtn, {
      domPaused: this.domPaused,
    }, {
      onToggleDomPause: () => this.toggleDomPause(),
    });
    // Update reference after possible clone replacement
    this.domPauseBtn = this.shadow.querySelector(".dom-pause-btn") as HTMLButtonElement;

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
      currentStatusMessage: this.currentStatusMessage,
      hubExpanded: this.hubExpanded,
      hubPage: this.hubPage,
      inspectorEnabled: this.inspectorEnabled,
      autoCommitEnabled: this.autoCommitEnabled,
      themePreference: this.themePreference,
      history: this.history,
      isDragging: this.isDragging,
      dragOffset: this.dragOffset,
      customPanelPosition: this.customPanelPosition,
      customLensPosition: this.customLensPosition,
      multiSelectMode: this.multiSelectMode,
      selectedElements: this.selectedElements,
      selectedSnapshots: this.selectedSnapshots,
      multiSelectHighlights: this.multiSelectHighlights,
      submittedSnapshots: this.submittedSnapshots,
      stateCapsules: this.stateCapsules,
      activeCapsuleId: this.activeCapsuleId,
      interactionStateLabel: this.interactionStateLabel,
      domPaused: this.domPaused,
      cursorStyleElement: this.cursorStyleElement,
      throttleTimeout: this.throttleTimeout,
      scrollTimeout: this.scrollTimeout,
      phraseIndex: this.phraseIndex,
      phraseInterval: this.phraseInterval,
      _userNote: this._userNote,
      eventSource: this.eventSource,
      frozenHealthIssues: this.frozenHealthIssues,
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
      captureStateCapsule: () => this.captureStateCapsule(),
      selectStateCapsule: (id: string) => this.selectStateCapsule(id),
      deleteStateCapsule: (id: string) => this.deleteStateCapsule(id),
      rotateInteractionState: () => this.rotateInteractionState(),
      toggleDomPause: () => this.toggleDomPause(),
    };

    this.lens.innerHTML = renderLensCard(state, callbacks);

    // Position the lens card
    const elementRect = this.currentElement.getBoundingClientRect();
    const lensRect = { width: 220, height: this.lens.offsetHeight || 200 };
    const position = this.customLensPosition ?? calculateLensPosition(elementRect, lensRect);
    this.lens.style.left = `${position.x}px`;
    this.lens.style.top = `${position.y}px`;

    // Wire up event listeners
    this.wireLensEvents();
  }

  private wireLensEvents(): void {
    if (!this.lens) return;

    // Drag handler on bar
    const bar = this.lens.querySelector('.lens-bar');
    if (bar) {
      bar.addEventListener("mousedown", this.dragHandlers.handleLensDragStart as EventListener);
    }

    // Schema toggle
    const schemaToggle = this.lens.querySelector('[data-action="toggle-schema"]');
    if (schemaToggle) {
      schemaToggle.addEventListener("click", () => this.toggleSchemaView());
    }

    // JSON view toggle
    const jsonToggle = this.lens.querySelector('[data-action="toggle-json-view"]');
    if (jsonToggle) {
      jsonToggle.addEventListener("click", () => this.toggleJsonView());
    }

    // Close button
    const closeBtn = this.lens.querySelector('[data-action="close"]');
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.unfreeze());
    }

    const lensCommitBtn = this.lens.querySelector('[data-action="lens-commit"]');
    if (lensCommitBtn) {
      lensCommitBtn.addEventListener('click', () => this.handleCommitRequest());
    }

    const lensUndoBtn = this.lens.querySelector('[data-action="lens-undo"]');
    if (lensUndoBtn) {
      lensUndoBtn.addEventListener('click', () => this.handleUndoFromPanel());
    }

    // Input field - Enter to submit
    const input = this.lens.querySelector('.lens-input') as HTMLTextAreaElement;
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && input.value.trim()) {
          this.submit(input.value);
          e.preventDefault();
        }
      });
      // Auto-focus input
      setTimeout(() => input.focus(), 100);
    }

    // Clickable enter/send button for accessibility
    const enterBtn = this.lens.querySelector('.lens-enter-btn') as HTMLButtonElement;
    if (enterBtn && input) {
      enterBtn.addEventListener("click", () => {
        if (input.value.trim()) {
          this.submit(input.value);
        } else {
          input.focus();
        }
      });
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

    const rotateStateBtn = this.lens.querySelector('[data-action="rotate-state"]');
    rotateStateBtn?.addEventListener("click", () => {
      // Trigger cycling animation - organic morph effect
      rotateStateBtn.classList.add('cycling');

      // Trigger SVG filter animations
      const animates = rotateStateBtn.querySelectorAll('animate');
      animates.forEach((anim: SVGAnimateElement) => {
        anim.beginElement();
      });

      setTimeout(() => rotateStateBtn.classList.remove('cycling'), 500);
      this.rotateInteractionState();
    });

    const captureCapsuleBtn = this.lens.querySelector('[data-action="capture-capsule"]');
    captureCapsuleBtn?.addEventListener("click", () => this.captureStateCapsule());

    this.lens.querySelectorAll('[data-action="select-capsule"]').forEach((el) => {
      el.addEventListener("click", (event) => {
        const id = (event.currentTarget as HTMLElement).getAttribute("data-capsule-id");
        if (id) this.selectStateCapsule(id);
      });
    });

    this.lens.querySelectorAll('[data-action="delete-capsule"]').forEach((el) => {
      el.addEventListener("click", (event) => {
        event.stopPropagation();
        const id = (event.currentTarget as HTMLElement).getAttribute("data-capsule-id");
        if (id) this.deleteStateCapsule(id);
      });
    });

    // Peek raw schema
    const peekSchemaBtn = this.lens.querySelector('[data-action="peek-schema"]');
    if (peekSchemaBtn) {
      peekSchemaBtn.addEventListener("click", () => this.toggleSchemaView());
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

    // Append health issue to prompt
    this.lens.querySelectorAll('[data-action="issue-insert"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const issueText = btn.getAttribute("data-issue") || "";
        if (!issueText) return;
        const inputField = this.lens?.querySelector('.lens-input') as HTMLTextAreaElement | null;
        if (!inputField) return;
        const needsNewline = inputField.value.length > 0 && !inputField.value.endsWith('\n');
        inputField.value = `${inputField.value}${needsNewline ? '\n' : ''}${issueText}`;
        this._userNote = inputField.value;
        inputField.dispatchEvent(new Event("input", { bubbles: true }));
        inputField.focus();
        inputField.setSelectionRange(inputField.value.length, inputField.value.length);
      });
    });

    // New request button
    const newRequestBtn = this.lens.querySelector('[data-action="new-request"]');
    if (newRequestBtn) {
      newRequestBtn.addEventListener("click", () => {
        this.mode = "input";
        this._userNote = "";
        this.activityEvents = [];
        this.currentStatus = "idle";
        this.renderLens();
      });
    }

    // Follow-up send from lens activity view
    const followupBtn = this.lens.querySelector('.lens-followup-send') as HTMLButtonElement | null;
    const followupInput = this.lens.querySelector('.lens-followup-input') as HTMLTextAreaElement | null;
    if (followupBtn && followupInput) {
      followupBtn.addEventListener("click", () => {
        const val = followupInput.value.trim();
        if (val) this.submitFollowUp(val);
      });
      followupInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          const val = followupInput.value.trim();
          if (val) this.submitFollowUp(val);
        }
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

  private toggleSchemaView(): void {
    if (!this.lens || !this.currentSnapshot) return;

    const schema = this.lens.querySelector('.lens-schema') as HTMLElement;
    const organized = this.lens.querySelector('.lens-schema-organized') as HTMLElement;
    const code = this.lens.querySelector('.lens-schema-code') as HTMLElement;
    if (!schema || !organized || !code) return;

    const isExpanded = schema.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
      schema.setAttribute('data-expanded', 'false');
    } else {
      // Populate organized view
      organized.innerHTML = renderOrganizedSchema(this.currentSnapshot);
      // Wire up section toggle handlers
      this.wireSchemaSection();
      // Populate JSON view (for when user switches)
      const json = JSON.stringify(this.currentSnapshot, null, 2);
      code.innerHTML = this.highlightJson(json);
      schema.setAttribute('data-expanded', 'true');
    }
  }

  private toggleJsonView(): void {
    if (!this.lens) return;

    const schema = this.lens.querySelector('.lens-schema') as HTMLElement;
    if (!schema) return;

    const currentView = schema.getAttribute('data-view') || 'organized';
    schema.setAttribute('data-view', currentView === 'json' ? 'organized' : 'json');
  }

  private wireSchemaSection(): void {
    if (!this.lens) return;

    this.lens.querySelectorAll('[data-action="toggle-section"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sectionId = (e.currentTarget as HTMLElement).getAttribute('data-section');
        const section = this.lens?.querySelector(`.schema-section[data-section="${sectionId}"]`) as HTMLElement;
        if (section) {
          const isCollapsed = section.getAttribute('data-collapsed') === 'true';
          section.setAttribute('data-collapsed', isCollapsed ? 'false' : 'true');
        }
      });
    });
  }

  private highlightJson(json: string): string {
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="json-key">$1</span>:')
      .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="json-string">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="json-bool">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>')
      .replace(/([{}\[\]])/g, '<span class="json-bracket">$1</span>');
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
    this.currentStatusMessage = null;

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
    this.currentStatusMessage = null;

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
