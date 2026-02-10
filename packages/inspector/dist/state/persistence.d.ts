/**
 * Persistence utilities for Eyeglass Inspector
 * Handles saving/loading state to localStorage and sessionStorage
 */
import type { InteractionStatus, SemanticSnapshot } from "@eyeglass/types";
import type { PersistedSession, HistoryItem, ThemePreference } from "../types.js";
export declare function saveSession(interactionId: string | null, userNote: string, currentSnapshot: SemanticSnapshot | null, currentStatus: InteractionStatus, message?: string): void;
export declare function loadSession(): PersistedSession | null;
export declare function clearSession(): void;
export declare function loadHistory(): HistoryItem[];
export declare function saveHistory(history: HistoryItem[]): void;
export declare function addToHistory(history: HistoryItem[], item: HistoryItem): HistoryItem[];
export declare function updateHistoryStatus(history: HistoryItem[], interactionId: string, status: InteractionStatus): HistoryItem[];
export declare function removeFromHistory(history: HistoryItem[], interactionId: string): HistoryItem[];
export declare function loadEnabledState(): boolean;
export declare function saveEnabledState(enabled: boolean): void;
export declare function loadAutoCommitState(): boolean;
export declare function saveAutoCommitState(enabled: boolean): void;
export declare function loadThemeState(): ThemePreference;
export declare function saveThemeState(theme: ThemePreference): void;
