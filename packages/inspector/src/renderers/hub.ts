/**
 * Hub rendering for Eyeglass Inspector
 */

import type { HistoryItem, ThemePreference } from "../types.js";
import { escapeHtml } from "../utils/helpers.js";

// SVG Icons
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#60a5fa;stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.1"/>
    </linearGradient>
  </defs>
  <circle cx="30" cy="50" r="20" fill="url(#lensGrad)" stroke="#3b82f6" stroke-width="3"/>
  <circle cx="70" cy="50" r="20" fill="url(#lensGrad)" stroke="#3b82f6" stroke-width="3"/>
  <path d="M 50 50 Q 50 42 50 50" stroke="#3b82f6" stroke-width="3" fill="none"/>
  <line x1="50" y1="47" x2="50" y2="53" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <line x1="10" y1="50" x2="10" y2="50" stroke="#3b82f6" stroke-width="3"/>
  <path d="M 10 50 L 5 45" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <path d="M 90 50 L 95 45" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <path d="M 65 45 L 65 60 L 69 56 L 74 63 L 76 61 L 71 54 L 76 54 Z" fill="#3b82f6"/>
</svg>`;

export const EYE_OPEN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

export const EYE_CLOSED_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

export const GEAR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;

export const PAUSE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
export const PLAY_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="8 5 18 12 8 19 8 5"/></svg>`;

export const SUN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

export const MOON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

export const AUTO_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

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
export function renderHubMainPage(
  hub: HTMLDivElement,
  state: HubMainPageState,
  callbacks: HubMainPageCallbacks
): void {
  const collapsedClass = state.hubExpanded ? "" : "collapsed";
  const disabledClass = state.inspectorEnabled ? "" : "disabled";
  const expandedClass = state.hubExpanded ? "expanded" : "";
  const activeCount = state.history.filter(
    (h) => h.status === "pending" || h.status === "fixing"
  ).length;

  hub.className = `hub ${collapsedClass} ${disabledClass}`.trim();

  hub.innerHTML = `
    <div class="hub-header">
      <div class="hub-header-left">
        <div class="hub-logo">${LOGO_SVG}</div>
        ${activeCount > 0 ? `<span class="hub-badge">${activeCount}</span>` : ""}
        <button class="hub-toggle ${expandedClass}" title="Toggle history">\u25BC</button>
      </div>
      <div class="hub-button-group">
      <button class="hub-settings-btn" title="Settings">${GEAR_SVG}</button>
      <button class="hub-disable ${state.inspectorEnabled ? "active" : ""}" title="${state.inspectorEnabled ? "Disable" : "Enable"} inspector (⌘/Ctrl + Shift + E)">
        ${state.inspectorEnabled ? EYE_OPEN_SVG : EYE_CLOSED_SVG}
      </button>
      </div>
    </div>
    <div class="hub-content ${expandedClass}">
      ${
        state.history.length > 0
          ? `
        <div class="hub-list">
          ${state.history
            .map(
              (item) => `
            <div class="hub-item" data-id="${item.interactionId}">
              <div class="hub-item-status ${item.status}"></div>
              <div class="hub-item-content">
                <div class="hub-item-component">${escapeHtml(item.componentName)}</div>
                <div class="hub-item-note">${escapeHtml(item.userNote)}</div>
              </div>
              ${
                item.status === "success"
                  ? `
                <button class="hub-item-undo" data-id="${item.interactionId}" title="Undo">\u21A9</button>
              `
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : `
        <div class="hub-empty">No requests yet</div>
      `
      }
    </div>
  `;

  // Wire up event handlers
  const header = hub.querySelector(".hub-header") as HTMLDivElement;
  const disableBtn = hub.querySelector(".hub-disable") as HTMLButtonElement;
  const settingsBtn = hub.querySelector(".hub-settings-btn") as HTMLButtonElement;

  // Toggle expand/collapse on header click (except buttons)
  header.addEventListener("click", (e) => {
    if (
      e.target === disableBtn ||
      e.target === settingsBtn ||
      (e.target as Element).closest(".hub-settings-btn")
    )
      return;
    callbacks.onToggleExpanded();
  });

  // Open settings page
  settingsBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    callbacks.onOpenSettings();
  });

  // Toggle inspector enabled state
  disableBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    callbacks.onToggleEnabled();
  });

  // Wire up undo buttons
  hub.querySelectorAll(".hub-item-undo").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = (e.currentTarget as HTMLButtonElement).dataset.id!;
      callbacks.onUndo(id);
    });
  });
}

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
export function renderHubSettingsPage(
  hub: HTMLDivElement,
  state: HubSettingsPageState,
  callbacks: HubSettingsPageCallbacks
): void {
  hub.className = "hub";

  hub.innerHTML = `
    <div class="hub-header">
      <div class="hub-header-left">
        <div class="hub-logo">${LOGO_SVG}</div>
        <span class="hub-title">Eyeglass</span>
      </div>
    </div>
    <div class="hub-content expanded">
      <div class="hub-settings-page">
        <div class="hub-settings-header">
          <button class="hub-back-btn" title="Back">\u2190</button>
          <span class="hub-settings-title">Settings</span>
        </div>
        <div class="hub-settings-list">
          <div class="hub-setting-row">
            <div class="hub-setting-info">
              <div class="hub-setting-label">Theme</div>
              <div class="hub-setting-desc">Light, dark, or match system</div>
            </div>
            <div class="theme-selector">
              <button class="theme-btn ${state.themePreference === "light" ? "active" : ""}" data-theme="light" title="Light">${SUN_SVG}</button>
              <button class="theme-btn ${state.themePreference === "auto" ? "active" : ""}" data-theme="auto" title="Auto">${AUTO_SVG}</button>
              <button class="theme-btn ${state.themePreference === "dark" ? "active" : ""}" data-theme="dark" title="Dark">${MOON_SVG}</button>
            </div>
          </div>
          <div class="hub-setting-row">
            <div class="hub-setting-info">
              <div class="hub-setting-label">Auto-commit</div>
              <div class="hub-setting-desc">Automatically commit changes on success</div>
            </div>
            <button class="toggle-switch ${state.autoCommitEnabled ? "active" : ""}" data-setting="autoCommit"></button>
          </div>
        </div>
        <div class="hub-shortcuts-section">
          <div class="hub-shortcuts-title">Keyboard Shortcuts</div>
          <div class="hub-shortcuts-list">
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Toggle inspector</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? "\u2318" : "Ctrl"}</kbd> <kbd>Shift</kbd> <kbd>E</kbd></span>
            </div>
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Toggle multi-select</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? "\u2318" : "Ctrl"}</kbd> <kbd>Shift</kbd> <kbd>M</kbd></span>
            </div>
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Toggle context overlays</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? "\u2318" : "Ctrl"}</kbd> <kbd>Shift</kbd> <kbd>C</kbd></span>
            </div>
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Submit request</span>
              <span class="hub-shortcut-keys"><kbd>${navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? "\u2318" : "Ctrl"}</kbd> <kbd>Enter</kbd></span>
            </div>
            <div class="hub-shortcut-row">
              <span class="hub-shortcut-label">Close panel / cancel</span>
              <span class="hub-shortcut-keys"><kbd>Esc</kbd></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Wire up back button
  const backBtn = hub.querySelector(".hub-back-btn") as HTMLButtonElement;
  backBtn.addEventListener("click", () => {
    callbacks.onBack();
  });

  // Wire up theme selector
  hub.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const theme = (e.currentTarget as HTMLButtonElement).dataset
        .theme as ThemePreference;
      callbacks.onThemeChange(theme);
    });
  });

  // Wire up toggle switches
  hub.querySelectorAll(".toggle-switch").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const setting = (e.currentTarget as HTMLButtonElement).dataset.setting;
      if (setting === "autoCommit") {
        callbacks.onAutoCommitToggle();
      }
    });
  });
}

export interface DomPauseButtonState {
  domPaused: boolean;
}

export interface DomPauseButtonCallbacks {
  onToggleDomPause: () => void;
}

/**
 * Renders the independent DOM pause button
 */
export function renderDomPauseButton(
  button: HTMLButtonElement,
  state: DomPauseButtonState,
  callbacks: DomPauseButtonCallbacks
): void {
  button.className = `dom-pause-btn ${state.domPaused ? "active" : ""}`;
  button.title = state.domPaused ? "Resume DOM (⌘/Ctrl + Shift + U)" : "Pause DOM (⌘/Ctrl + Shift + U)";
  button.innerHTML = state.domPaused ? PLAY_SVG : PAUSE_SVG;

  // Remove existing listeners by cloning
  const newButton = button.cloneNode(true) as HTMLButtonElement;
  button.parentNode?.replaceChild(newButton, button);

  newButton.addEventListener("click", () => {
    callbacks.onToggleDomPause();
  });
}
