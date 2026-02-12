/**
 * Panel rendering for Eyeglass Inspector
 */

import type { SemanticSnapshot, InteractionStatus, ActivityEvent } from "@eyeglass/types";
import type { PanelMode } from "../types.js";
import { escapeHtml, getStatusText } from "../utils/helpers.js";
import { renderActivityFeed } from "./activity-feed.js";

export interface PanelPosition {
  x: number;
  y: number;
}

/**
 * Calculates the panel position based on the element and window dimensions
 */
export function calculatePanelPosition(
  elementRect: DOMRect,
  mode: PanelMode,
  customPosition: PanelPosition | null
): PanelPosition {
  if (customPosition) {
    return customPosition;
  }

  const spaceBelow = window.innerHeight - elementRect.bottom;
  const panelHeight = mode === "activity" ? 400 : 200;
  let top = elementRect.bottom + 12;
  if (spaceBelow < panelHeight && elementRect.top > panelHeight) {
    top = elementRect.top - panelHeight - 12;
  }

  // Clamp top to stay within viewport bounds
  const minTop = 20;
  const maxTop = window.innerHeight - panelHeight - 20;
  top = Math.max(minTop, Math.min(top, maxTop));

  let left = elementRect.left;
  if (left + 340 > window.innerWidth - 20) {
    left = window.innerWidth - 360;
  }
  if (left < 20) left = 20;

  return { x: left, y: top };
}

export interface InputModeState {
  componentName: string;
  filePath: string | null;
  multiSelectMode: boolean;
  selectedSnapshots: SemanticSnapshot[];
}

export interface InputModeCallbacks {
  onClose: () => void;
  onSubmit: (userNote: string) => void;
  onToggleMultiSelect: () => void;
  onRemoveFromSelection: (index: number) => void;
  onPanelDragStart: (e: MouseEvent) => void;
}

/**
 * Renders the input mode panel content and wires up event handlers
 */
export function renderInputMode(
  panel: HTMLDivElement,
  state: InputModeState,
  callbacks: InputModeCallbacks
): void {
  const isMultiSelect = state.multiSelectMode;
  const multiSelectIconClass = isMultiSelect
    ? "multi-select-icon active"
    : "multi-select-icon";

  // Build selected list HTML for multi-select mode
  const selectedListHtml = isMultiSelect
    ? `
    <div class="selected-list">
      <div class="selected-list-header">
        <span class="selected-count">${state.selectedSnapshots.length} element${state.selectedSnapshots.length !== 1 ? "s" : ""} selected</span>
      </div>
      <div class="selected-chips">
        ${state.selectedSnapshots
          .map((snapshot, index) => {
            const name = snapshot.framework.componentName || snapshot.tagName;
            return `
            <div class="selected-chip" data-index="${index}">
              <span class="selected-chip-number">${index + 1}</span>
              <span>${escapeHtml(name)}</span>
              <button class="selected-chip-remove" data-index="${index}" title="Remove">&times;</button>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `
    : "";

  const multiModeHint = isMultiSelect
    ? `
    <div class="multi-mode-hint">Click elements to add/remove from selection</div>
  `
    : "";

  panel.innerHTML = `
    <div class="panel-header">
      <span class="component-tag">&lt;${escapeHtml(state.componentName)} /&gt;</span>
      ${state.filePath ? `<span class="file-path">${escapeHtml(state.filePath)}</span>` : ""}
      <button class="${multiSelectIconClass}" title="${isMultiSelect ? "Exit multi-select" : "Select multiple elements"}">+</button>
      <button class="close-btn" title="Cancel (Esc)">&times;</button>
    </div>
    ${multiModeHint}
    ${selectedListHtml}
    <div class="input-area">
      <textarea
        class="input-field"
        placeholder="${isMultiSelect ? "Describe what to change for these elements..." : "What do you want to change?"}"
        autofocus
        rows="2"
      ></textarea>
      <div class="btn-row">
        <button class="btn btn-secondary">Cancel</button>
        <button class="btn btn-primary" aria-label="Send request">Send</button>
      </div>
    </div>
  `;

  const input = panel.querySelector(".input-field") as HTMLTextAreaElement;
  const closeBtn = panel.querySelector(".close-btn") as HTMLButtonElement;
  const cancelBtn = panel.querySelector(".btn-secondary") as HTMLButtonElement;
  const sendBtn = panel.querySelector(".btn-primary") as HTMLButtonElement;
  const multiSelectBtn = panel.querySelector(".multi-select-icon") as HTMLButtonElement;

  closeBtn.addEventListener("click", () => callbacks.onClose());
  cancelBtn.addEventListener("click", () => callbacks.onClose());
  sendBtn.addEventListener("click", () => callbacks.onSubmit(input.value));
  sendBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callbacks.onSubmit(input.value);
    }
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && input.value.trim()) {
      e.preventDefault();
      callbacks.onSubmit(input.value);
    }
  });

  // Multi-select toggle button
  multiSelectBtn.addEventListener("click", () => {
    callbacks.onToggleMultiSelect();
  });

  // Wire up chip remove buttons
  panel.querySelectorAll(".selected-chip-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(
        (e.currentTarget as HTMLButtonElement).dataset.index!,
        10
      );
      callbacks.onRemoveFromSelection(index);
    });
  });

  // Make panel draggable via header
  const header = panel.querySelector(".panel-header") as HTMLDivElement;
  header.addEventListener("mousedown", callbacks.onPanelDragStart);

  requestAnimationFrame(() => input.focus());
}

export interface ActivityModeState {
  componentName: string;
  filePath: string | null;
  submittedSnapshots: SemanticSnapshot[];
  activityEvents: ActivityEvent[];
  currentStatus: InteractionStatus;
  autoCommitEnabled: boolean;
  userNote: string;
  interactionId: string | null;
  phraseIndex: number;
}

export interface ActivityModeCallbacks {
  onClose: () => void;
  onSubmitFollowUp: (userNote: string) => void;
  onSubmitAnswer: (questionId: string, answerId: string, answerLabel: string) => void;
  onCommit: () => void;
  onUndo: () => void;
  onPanelDragStart: (e: MouseEvent) => void;
}

/**
 * Renders the activity mode panel content and wires up event handlers
 */
export function renderActivityMode(
  panel: HTMLDivElement,
  state: ActivityModeState,
  callbacks: ActivityModeCallbacks
): void {
  const isDone =
    state.currentStatus === "success" || state.currentStatus === "failed";
  const showActionButtons =
    state.currentStatus === "success" && !state.autoCommitEnabled;
  const showFollowUp = state.currentStatus === "success";

  // Build header display based on submitted snapshots
  const snapshotCount = state.submittedSnapshots.length;
  const headerDisplay =
    snapshotCount > 1
      ? `${snapshotCount} elements`
      : `&lt;${escapeHtml(state.componentName)} /&gt;`;

  const statusText = getStatusText(state.currentStatus, state.phraseIndex);

  panel.innerHTML = `
    <div class="panel-header">
      <span class="component-tag">${headerDisplay}</span>
      ${snapshotCount <= 1 && state.filePath ? `<span class="file-path">${escapeHtml(state.filePath)}</span>` : ""}
      <button class="close-btn" title="Close">&times;</button>
    </div>
    <div class="user-request">
      <div class="user-request-label">Your request</div>
      <div class="user-request-text">${escapeHtml(state.userNote)}</div>
    </div>
    <div class="activity-feed">
      ${renderActivityFeed(state.activityEvents, state.currentStatus)}
    </div>
    <div class="panel-footer ${isDone ? "done" : ""}">
      <div class="status-indicator ${state.currentStatus}"></div>
      <span class="status-text">${statusText}</span>
      ${
        showActionButtons
          ? `
        <div class="success-actions">
          <button class="action-btn action-btn-undo" title="Discard changes">Undo</button>
          <button class="action-btn action-btn-commit" title="Commit changes">Commit</button>
        </div>
      `
          : ""
      }
    </div>
    ${
      showFollowUp
        ? `
      <div class="followup-area">
        <div class="followup-row">
          <textarea class="followup-input" placeholder="Anything else?" rows="1"></textarea>
          <button class="followup-send">Send</button>
          <button class="followup-done">\u2715</button>
        </div>
      </div>
    `
        : ""
    }
  `;

  const closeBtn = panel.querySelector(".close-btn") as HTMLButtonElement;
  closeBtn.addEventListener("click", () => callbacks.onClose());

  // Make panel draggable via header
  const header = panel.querySelector(".panel-header") as HTMLDivElement;
  header.addEventListener("mousedown", callbacks.onPanelDragStart);

  // Wire up question buttons if present
  panel.querySelectorAll(".question-option").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Use currentTarget (the element with the listener) not target (might be nested element)
      const button = e.currentTarget as HTMLButtonElement;
      const questionId = button.dataset.questionId!;
      const answerId = button.dataset.answerId!;
      const answerLabel = button.textContent!;
      callbacks.onSubmitAnswer(questionId, answerId, answerLabel);
    });
  });

  // Wire up action buttons (commit/undo) if present
  const commitBtn = panel.querySelector(".action-btn-commit");
  const undoBtn = panel.querySelector(".action-btn-undo");
  if (commitBtn) {
    commitBtn.addEventListener("click", () => callbacks.onCommit());
  }
  if (undoBtn) {
    undoBtn.addEventListener("click", () => callbacks.onUndo());
  }

  // Wire up follow-up input if present
  const followupInput = panel.querySelector(".followup-input") as HTMLTextAreaElement;
  const followupSend = panel.querySelector(".followup-send") as HTMLButtonElement;
  const followupDone = panel.querySelector(".followup-done") as HTMLButtonElement;
  if (followupInput && followupSend) {
    followupSend.addEventListener("click", () => {
      if (followupInput.value.trim()) {
        callbacks.onSubmitFollowUp(followupInput.value);
      }
    });
    followupInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey && followupInput.value.trim()) {
        e.preventDefault();
        callbacks.onSubmitFollowUp(followupInput.value);
      }
    });
    // Focus the follow-up input
    requestAnimationFrame(() => followupInput.focus());
  }
  if (followupDone) {
    followupDone.addEventListener("click", () => callbacks.onClose());
  }

  // Scroll to bottom of activity feed
  const feed = panel.querySelector(".activity-feed");
  if (feed) {
    feed.scrollTop = feed.scrollHeight;
  }
}

/**
 * Updates just the status text in the footer (for phrase rotation)
 */
export function updateFooterStatusText(
  panel: HTMLDivElement | null,
  status: InteractionStatus,
  phraseIndex: number
): void {
  if (!panel) return;
  const statusText = panel.querySelector(".status-text");
  if (statusText) {
    statusText.textContent = getStatusText(status, phraseIndex);
  }
}
