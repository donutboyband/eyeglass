/**
 * Helper utilities for Eyeglass Inspector
 */
import type { InteractionStatus } from "@eyeglass/types";
/**
 * Escapes HTML special characters in a string
 */
export declare function escapeHtml(text: string): string;
/**
 * Gets the display text for a status
 */
export declare function getStatusText(status: InteractionStatus, phraseIndex: number): string;
/**
 * Updates the cursor style in the document
 */
export declare function updateCursor(inspectorEnabled: boolean, frozen: boolean, multiSelectMode: boolean, cursorStyleElement: HTMLStyleElement | null): HTMLStyleElement | null;
/**
 * Generates a unique interaction ID
 */
export declare function generateInteractionId(): string;
