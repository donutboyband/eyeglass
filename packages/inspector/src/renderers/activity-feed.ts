/**
 * Activity feed rendering for Eyeglass Inspector
 */

import type { ActivityEvent, InteractionStatus } from "@eyeglass/types";
import { escapeHtml } from "../utils/helpers.js";

/**
 * Renders the activity feed content
 */
export function renderActivityFeed(
  activityEvents: ActivityEvent[],
  currentStatus: InteractionStatus
): string {
  const items: string[] = [];

  for (const event of activityEvents) {
    if (event.type === "status") {
      // Skip pending - shown in footer. Show fixing only if it has a meaningful message
      if (event.status === "pending") continue;
      if (event.status === "fixing") {
        if (!event.message || event.message === "Agent is working...") continue;
      }
      items.push(renderStatusItem(event));
    } else if (event.type === "thought") {
      items.push(renderThoughtItem(event));
    } else if (event.type === "action") {
      items.push(renderActionItem(event));
    } else if (event.type === "question") {
      items.push(renderQuestionItem(event, activityEvents));
    }
  }

  // Show skeleton while waiting for first meaningful activity
  if (
    items.length === 0 &&
    (currentStatus === "pending" || currentStatus === "fixing")
  ) {
    return `
      <div class="skeleton-item">
        <div class="skeleton-icon"></div>
        <div class="skeleton-line"></div>
      </div>
    `;
  }

  return items.join("");
}

/**
 * Renders a status activity item
 */
export function renderStatusItem(event: {
  status: InteractionStatus;
  message?: string;
}): string {
  const iconClass =
    event.status === "success"
      ? "success"
      : event.status === "failed"
        ? "error"
        : "status";
  const icon =
    event.status === "success" ? "\u2713" : event.status === "failed" ? "\u2715" : "\u25CF";
  return `
    <div class="activity-item">
      <div class="activity-icon ${iconClass}">${icon}</div>
      <div class="activity-content">
        <div class="activity-text">${escapeHtml(event.message || event.status)}</div>
      </div>
    </div>
  `;
}

/**
 * Renders a thought activity item
 */
export function renderThoughtItem(event: { content: string }): string {
  return `
    <div class="activity-item">
      <div class="activity-icon thought">\uD83D\uDCAD</div>
      <div class="activity-content">
        <div class="activity-text muted">${escapeHtml(event.content)}</div>
      </div>
    </div>
  `;
}

/**
 * Renders an action activity item
 */
export function renderActionItem(event: {
  action: string;
  target: string;
  complete?: boolean;
}): string {
  const icons: Record<string, string> = {
    reading: "\uD83D\uDCD6",
    writing: "\u270F\uFE0F",
    searching: "\uD83D\uDD0D",
    thinking: "\uD83E\uDDE0",
  };
  const verbs: Record<string, string> = {
    reading: "Reading",
    writing: "Writing",
    searching: "Searching",
    thinking: "Thinking about",
  };
  return `
    <div class="activity-item">
      <div class="activity-icon action">${icons[event.action] || "\u25CF"}</div>
      <div class="activity-content">
        <div class="activity-text">${verbs[event.action] || event.action}${event.complete ? " \u2713" : "..."}</div>
        <div class="activity-target">${escapeHtml(event.target)}</div>
      </div>
    </div>
  `;
}

/**
 * Renders a question activity item
 */
export function renderQuestionItem(
  event: {
    questionId: string;
    question: string;
    options: Array<{ id: string; label: string }>;
    timestamp: number;
    selectedAnswerId?: string;
    selectedAnswerLabel?: string;
  },
  _activityEvents: ActivityEvent[]
): string {
  // Collapse to summary once answered
  if (event.selectedAnswerId) {
    return `
      <div class="activity-item">
        <div class="activity-icon question">?</div>
        <div class="activity-content">
          <div class="activity-text muted">${escapeHtml(event.question)}</div>
          <div class="activity-target">${escapeHtml(event.selectedAnswerLabel || event.selectedAnswerId)}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="question-box">
      <div class="question-text">${escapeHtml(event.question)}</div>
      <div class="question-options">
        ${event.options
          .map(
            (opt) => `
          <button
            class="question-option"
            data-question-id="${event.questionId}"
            data-answer-id="${opt.id}"
          >${escapeHtml(opt.label)}</button>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}
