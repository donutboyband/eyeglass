/**
 * Hub rendering for Eyeglass Inspector
 */
import type { HistoryItem, ThemePreference } from "../types.js";
export declare const LOGO_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">\n  <defs>\n    <linearGradient id=\"lensGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n      <stop offset=\"0%\" style=\"stop-color:#60a5fa;stop-opacity:0.3\"/>\n      <stop offset=\"100%\" style=\"stop-color:#3b82f6;stop-opacity:0.1\"/>\n    </linearGradient>\n  </defs>\n  <circle cx=\"30\" cy=\"50\" r=\"20\" fill=\"url(#lensGrad)\" stroke=\"#3b82f6\" stroke-width=\"3\"/>\n  <circle cx=\"70\" cy=\"50\" r=\"20\" fill=\"url(#lensGrad)\" stroke=\"#3b82f6\" stroke-width=\"3\"/>\n  <path d=\"M 50 50 Q 50 42 50 50\" stroke=\"#3b82f6\" stroke-width=\"3\" fill=\"none\"/>\n  <line x1=\"50\" y1=\"47\" x2=\"50\" y2=\"53\" stroke=\"#3b82f6\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n  <line x1=\"10\" y1=\"50\" x2=\"10\" y2=\"50\" stroke=\"#3b82f6\" stroke-width=\"3\"/>\n  <path d=\"M 10 50 L 5 45\" stroke=\"#3b82f6\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n  <path d=\"M 90 50 L 95 45\" stroke=\"#3b82f6\" stroke-width=\"3\" stroke-linecap=\"round\"/>\n  <path d=\"M 65 45 L 65 60 L 69 56 L 74 63 L 76 61 L 71 54 L 76 54 Z\" fill=\"#3b82f6\"/>\n</svg>";
export declare const EYE_OPEN_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>";
export declare const EYE_CLOSED_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\"/><line x1=\"1\" y1=\"1\" x2=\"23\" y2=\"23\"/></svg>";
export declare const GEAR_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"/></svg>";
export declare const PAUSE_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"/></svg>";
export declare const PLAY_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"8 5 18 12 8 19 8 5\"/></svg>";
export declare const SUN_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"5\"/><line x1=\"12\" y1=\"1\" x2=\"12\" y2=\"3\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"23\"/><line x1=\"4.22\" y1=\"4.22\" x2=\"5.64\" y2=\"5.64\"/><line x1=\"18.36\" y1=\"18.36\" x2=\"19.78\" y2=\"19.78\"/><line x1=\"1\" y1=\"12\" x2=\"3\" y2=\"12\"/><line x1=\"21\" y1=\"12\" x2=\"23\" y2=\"12\"/><line x1=\"4.22\" y1=\"19.78\" x2=\"5.64\" y2=\"18.36\"/><line x1=\"18.36\" y1=\"5.64\" x2=\"19.78\" y2=\"4.22\"/></svg>";
export declare const MOON_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z\"/></svg>";
export declare const AUTO_SVG = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/></svg>";
export interface HubMainPageState {
    hubExpanded: boolean;
    inspectorEnabled: boolean;
    history: HistoryItem[];
}
export interface HubMainPageCallbacks {
    onToggleExpanded: () => void;
    onToggleEnabled: () => void;
    onOpenSettings: () => void;
    onUndo: (interactionId: string) => void;
}
/**
 * Renders the hub main page HTML and wires up event handlers
 */
export declare function renderHubMainPage(hub: HTMLDivElement, state: HubMainPageState, callbacks: HubMainPageCallbacks): void;
export interface HubSettingsPageState {
    themePreference: ThemePreference;
    autoCommitEnabled: boolean;
}
export interface HubSettingsPageCallbacks {
    onBack: () => void;
    onThemeChange: (theme: ThemePreference) => void;
    onAutoCommitToggle: () => void;
}
/**
 * Renders the hub settings page HTML and wires up event handlers
 */
export declare function renderHubSettingsPage(hub: HTMLDivElement, state: HubSettingsPageState, callbacks: HubSettingsPageCallbacks): void;
export interface DomPauseButtonState {
    domPaused: boolean;
}
export interface DomPauseButtonCallbacks {
    onToggleDomPause: () => void;
}
/**
 * Renders the independent DOM pause button
 */
export declare function renderDomPauseButton(button: HTMLButtonElement, state: DomPauseButtonState, callbacks: DomPauseButtonCallbacks): void;
