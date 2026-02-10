/**
 * Network utilities for Eyeglass Inspector
 * Handles SSE connections and API calls to the bridge server
 */

import type {
  FocusPayload,
  AnswerPayload,
  SemanticSnapshot,
  ActivityEvent,
} from "@eyeglass/types";
import { BRIDGE_URL } from "../constants.js";
import type { HistoryItem } from "../types.js";

export interface NetworkCallbacks {
  onActivityEvent: (event: ActivityEvent) => void;
  onReconnect: () => void;
}

/**
 * Creates and manages an SSE connection to the bridge server
 */
export function connectSSE(callbacks: NetworkCallbacks): EventSource {
  const eventSource = new EventSource(`${BRIDGE_URL}/events`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "activity") {
        callbacks.onActivityEvent(data.payload as ActivityEvent);
      }
    } catch (e) {
      // Ignore parse errors
    }
  };

  eventSource.onerror = () => {
    eventSource.close();
    setTimeout(() => callbacks.onReconnect(), 3000);
  };

  return eventSource;
}

export interface SubmitFocusParams {
  interactionId: string;
  userNote: string;
  autoCommit: boolean;
  snapshots: SemanticSnapshot[];
}

export interface SubmitFocusResult {
  success: boolean;
  error?: string;
}

/**
 * Submits a focus request to the bridge server
 */
export async function submitFocus(
  params: SubmitFocusParams
): Promise<SubmitFocusResult> {
  const payload: FocusPayload = {
    interactionId: params.interactionId,
    userNote: params.userNote.trim(),
    autoCommit: params.autoCommit,
    ...(params.snapshots.length === 1
      ? { snapshot: params.snapshots[0] }
      : { snapshots: params.snapshots }),
  };

  try {
    const response = await fetch(`${BRIDGE_URL}/focus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to connect to bridge" };
  }
}

/**
 * Submits an answer to a question from the agent
 */
export async function submitAnswer(
  interactionId: string,
  questionId: string,
  answerId: string,
  answerLabel: string
): Promise<void> {
  const answer: AnswerPayload = {
    interactionId,
    questionId,
    answerId,
    answerLabel,
  };

  try {
    await fetch(`${BRIDGE_URL}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answer),
    });
  } catch (err) {
    // Silently fail
  }
}

export interface UndoResult {
  success: boolean;
}

/**
 * Requests to undo changes for an interaction
 */
export async function requestUndo(interactionId: string): Promise<UndoResult> {
  try {
    const response = await fetch(`${BRIDGE_URL}/undo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interactionId }),
    });

    return { success: response.ok };
  } catch (err) {
    console.warn("Undo request failed:", err);
    return { success: false };
  }
}

export interface CommitResult {
  success: boolean;
}

/**
 * Requests to commit changes for an interaction
 */
export async function requestCommit(
  interactionId: string
): Promise<CommitResult> {
  try {
    const response = await fetch(`${BRIDGE_URL}/commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interactionId }),
    });

    if (!response.ok) {
      console.warn("Commit request failed");
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.warn("Commit request failed:", err);
    return { success: false };
  }
}

/**
 * Builds a history item from snapshots
 */
export function buildHistoryItem(
  interactionId: string,
  userNote: string,
  snapshots: SemanticSnapshot[]
): HistoryItem {
  const componentNames = snapshots.map(
    (s) => s.framework.componentName || s.tagName
  );
  const historyComponentName =
    snapshots.length === 1
      ? componentNames[0]
      : `${componentNames.length} elements`;

  return {
    interactionId,
    userNote: userNote.trim(),
    componentName: historyComponentName,
    filePath: snapshots[0]?.framework.filePath,
    status: "pending",
    timestamp: Date.now(),
  };
}
