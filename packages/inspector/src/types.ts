/**
 * Internal types for Eyeglass Inspector
 */

import type { InteractionStatus, SemanticSnapshot, ActivityEvent } from "@eyeglass/types";

export type PanelMode = "input" | "activity";

export type ThemePreference = "light" | "dark" | "auto";

export type HubPage = "main" | "settings";

export interface PersistedSession {
  interactionId: string;
  userNote: string;
  componentName: string;
  status: InteractionStatus;
  message?: string;
  timestamp: number;
}

export interface HistoryItem {
  interactionId: string;
  userNote: string;
  componentName: string;
  filePath?: string;
  status: InteractionStatus;
  timestamp: number;
}

export interface StateCapsule {
  id: string;
  variant: string;
  label: string;
  snapshot: SemanticSnapshot;
  capturedAt: number;
}

/**
 * State interface for the inspector that modules can access
 */
export interface InspectorState {
  // Core DOM elements
  shadow: ShadowRoot;
  highlight: HTMLDivElement | null;
  panel: HTMLDivElement | null;
  toast: HTMLDivElement | null;
  hub: HTMLDivElement | null;

  // Current element and snapshot
  currentElement: Element | null;
  currentSnapshot: SemanticSnapshot | null;

  // Interaction state
  interactionId: string | null;
  frozen: boolean;
  mode: PanelMode;
  activityEvents: ActivityEvent[];
  currentStatus: InteractionStatus;
  currentStatusMessage?: string | null;

  // Hub state
  hubExpanded: boolean;
  hubPage: HubPage;

  // Settings
  inspectorEnabled: boolean;
  autoCommitEnabled: boolean;
  themePreference: ThemePreference;

  // History
  history: HistoryItem[];

  // Drag state
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  customPanelPosition: { x: number; y: number } | null;
  customLensPosition?: { x: number; y: number } | null;

  // Multi-select state
  multiSelectMode: boolean;
  selectedElements: Element[];
  selectedSnapshots: SemanticSnapshot[];
  multiSelectHighlights: HTMLDivElement[];
  submittedSnapshots: SemanticSnapshot[];
  stateCapsules: StateCapsule[];
  activeCapsuleId: string | null;
  interactionStateLabel: string;
  domPaused: boolean;

  // Cursor style
  cursorStyleElement: HTMLStyleElement | null;

  // Timeouts
  throttleTimeout: number | null;
  scrollTimeout: number | null;

  // Phrase rotation
  phraseIndex: number;
  phraseInterval: number | null;

  // User note (stored temporarily)
  _userNote: string;

  // Event source for SSE
  eventSource: EventSource | null;
}

/**
 * Callbacks interface for renderers to invoke inspector methods
 */
export interface InspectorCallbacks {
  unfreeze: () => void;
  submit: (userNote: string) => void;
  submitFollowUp: (userNote: string) => void;
  submitAnswer: (questionId: string, answerId: string, answerLabel: string) => void;
  requestUndo: (interactionId: string) => void;
  requestCommit: (interactionId: string) => void;
  enterMultiSelectMode: () => void;
  exitMultiSelectMode: () => void;
  removeFromSelection: (index: number) => void;
  toggleHubExpanded: () => void;
  toggleInspectorEnabled: () => void;
  openSettingsPage: () => void;
  closeSettingsPage: () => void;
  setTheme: (theme: ThemePreference) => void;
  toggleAutoCommit: () => void;
  handlePanelDragStart: (e: MouseEvent) => void;
  renderHub: () => void;
  renderPanel: () => void;
  captureStateCapsule: () => void;
  selectStateCapsule: (id: string) => void;
  deleteStateCapsule: (id: string) => void;
  rotateInteractionState: () => void;
  toggleDomPause: () => void;
}
