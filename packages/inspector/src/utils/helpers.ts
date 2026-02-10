/**
 * Helper utilities for Eyeglass Inspector
 */

import type { InteractionStatus } from "@eyeglass/types";
import { WORKING_PHRASES, EYE_CURSOR } from "../constants.js";

/**
 * Escapes HTML special characters in a string
 */
export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Gets the display text for a status
 */
export function getStatusText(
  status: InteractionStatus,
  phraseIndex: number
): string {
  switch (status) {
    case "idle":
      return "Ready";
    case "pending":
      return "Waiting for agent...";
    case "fixing":
      return WORKING_PHRASES[phraseIndex % WORKING_PHRASES.length];
    case "success":
      return "Done!";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

/**
 * Updates the cursor style in the document
 */
export function updateCursor(
  inspectorEnabled: boolean,
  frozen: boolean,
  multiSelectMode: boolean,
  cursorStyleElement: HTMLStyleElement | null
): HTMLStyleElement | null {
  // Show eye cursor when: enabled AND (not frozen OR in multi-select mode)
  const showEyeCursor =
    inspectorEnabled && (!frozen || multiSelectMode);

  if (showEyeCursor) {
    // Add eye cursor to document
    let styleElement = cursorStyleElement;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "eyeglass-cursor-style";
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `
      html, body, body * {
        cursor: ${EYE_CURSOR} !important;
      }
    `;
    return styleElement;
  } else {
    // Remove custom cursor
    if (cursorStyleElement) {
      cursorStyleElement.textContent = "";
    }
    return cursorStyleElement;
  }
}

/**
 * Generates a unique interaction ID
 */
export function generateInteractionId(): string {
  return `eyeglass-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
