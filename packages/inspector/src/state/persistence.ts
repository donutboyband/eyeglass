/**
 * Persistence utilities for Eyeglass Inspector
 * Handles saving/loading state to localStorage and sessionStorage
 */

import type { InteractionStatus, SemanticSnapshot } from "@eyeglass/types";
import type { PersistedSession, HistoryItem, ThemePreference } from "../types.js";
import {
  STORAGE_KEY,
  HISTORY_KEY,
  ENABLED_KEY,
  AUTOCOMMIT_KEY,
  THEME_KEY,
  SESSION_TTL,
} from "../constants.js";

// Session persistence

export function saveSession(
  interactionId: string | null,
  userNote: string,
  currentSnapshot: SemanticSnapshot | null,
  currentStatus: InteractionStatus,
  message?: string
): void {
  if (!interactionId) return;

  const session: PersistedSession = {
    interactionId,
    userNote,
    componentName:
      currentSnapshot?.framework.componentName ||
      currentSnapshot?.tagName ||
      "element",
    status: currentStatus,
    message,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    // Ignore storage errors
  }
}

export function loadSession(): PersistedSession | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session: PersistedSession = JSON.parse(stored);

    // Check if session is still fresh
    if (Date.now() - session.timestamp > SESSION_TTL) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore
  }
}

// History persistence

export function loadHistory(): HistoryItem[] {
  try {
    const stored = sessionStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    // Fall through
  }
  return [];
}

export function saveHistory(history: HistoryItem[]): void {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    // Ignore storage errors
  }
}

export function addToHistory(
  history: HistoryItem[],
  item: HistoryItem
): HistoryItem[] {
  const newHistory = [...history];

  // Check if this interaction already exists
  const existingIndex = newHistory.findIndex(
    (h) => h.interactionId === item.interactionId
  );
  if (existingIndex >= 0) {
    newHistory[existingIndex] = item;
  } else {
    newHistory.unshift(item);
    // Keep only last 20 items
    if (newHistory.length > 20) {
      newHistory.length = 20;
    }
  }

  return newHistory;
}

export function updateHistoryStatus(
  history: HistoryItem[],
  interactionId: string,
  status: InteractionStatus
): HistoryItem[] {
  return history.map((item) =>
    item.interactionId === interactionId ? { ...item, status } : item
  );
}

export function removeFromHistory(
  history: HistoryItem[],
  interactionId: string
): HistoryItem[] {
  return history.filter((item) => item.interactionId !== interactionId);
}

// Settings persistence

export function loadEnabledState(): boolean {
  try {
    const stored = localStorage.getItem(ENABLED_KEY);
    if (stored !== null) {
      return stored === "true";
    }
  } catch (e) {
    // Ignore storage errors
  }
  return true; // Default enabled
}

export function saveEnabledState(enabled: boolean): void {
  try {
    localStorage.setItem(ENABLED_KEY, String(enabled));
  } catch (e) {
    // Ignore storage errors
  }
}

export function loadAutoCommitState(): boolean {
  try {
    const stored = localStorage.getItem(AUTOCOMMIT_KEY);
    if (stored !== null) {
      return stored === "true";
    }
  } catch (e) {
    // Ignore storage errors
  }
  return true; // Default enabled
}

export function saveAutoCommitState(enabled: boolean): void {
  try {
    localStorage.setItem(AUTOCOMMIT_KEY, String(enabled));
  } catch (e) {
    // Ignore storage errors
  }
}

export function loadThemeState(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark" || stored === "auto") {
      return stored;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return "auto"; // Default
}

export function saveThemeState(theme: ThemePreference): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    // Ignore storage errors
  }
}
