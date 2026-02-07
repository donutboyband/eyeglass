/**
 * Eyeglass Inspector - Glass UI for visual element inspection
 */

import type {
  FocusPayload,
  SemanticSnapshot,
  ActivityEvent,
  AnswerPayload,
  InteractionStatus,
} from '@eyeglass/types';
import { captureSnapshot } from './snapshot.js';

const BRIDGE_URL = 'http://localhost:3300';
const STORAGE_KEY = 'eyeglass_session';
const HISTORY_KEY = 'eyeglass_history';
const SESSION_TTL = 10000; // 10 seconds

const STYLES = `
:host {
  all: initial;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2147483647;
  pointer-events: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  box-sizing: border-box;
  --glass-bg: rgba(255, 255, 255, 0.72);
  --glass-border: rgba(0, 0, 0, 0.25);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  --divider: rgba(0, 0, 0, 0.18);
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;
  --accent: #6366f1;
  --accent-soft: rgba(99, 102, 241, 0.1);
  --success: #10b981;
  --error: #ef4444;
  --border-radius: 16px;
  --border-radius-sm: 10px;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Highlight overlay */
.highlight {
  position: absolute;
  border: 2px solid var(--accent);
  background: var(--accent-soft);
  pointer-events: none;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
}

/* Glass Panel */
.glass-panel {
  position: absolute;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--glass-shadow);
  pointer-events: auto;
  width: 340px;
  overflow: hidden;
  animation: panelIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes panelIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Panel Header */
.panel-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: grab;
  user-select: none;
}

.panel-header:active {
  cursor: grabbing;
}

.component-tag {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 12px;
  font-weight: 500;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: -0.01em;
}

.file-path {
  font-size: 11px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.close-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-size: 18px;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

/* User Request */
.user-request {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid var(--divider);
}

.user-request-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.user-request-text {
  color: var(--text-primary);
  font-weight: 500;
}

/* Input Mode */
.input-area {
  padding: 12px 16px 16px;
}

.input-field {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.6);
  color: var(--text-primary);
  outline: none;
  transition: all 0.15s;
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-field:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
  background: white;
}

.btn-row {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn {
  flex: 1;
  padding: 9px 14px;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(0, 0, 0, 0.04);
  color: var(--text-secondary);
}

.btn-secondary:hover {
  background: rgba(0, 0, 0, 0.08);
}

/* Activity Feed */
.activity-feed {
  max-height: 280px;
  overflow-y: auto;
  padding: 8px 0;
}

.activity-feed::-webkit-scrollbar {
  width: 6px;
}

.activity-feed::-webkit-scrollbar-track {
  background: transparent;
}

.activity-feed::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.activity-item {
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  animation: itemIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes itemIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.activity-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 10px;
}

.activity-icon.status { background: var(--accent-soft); color: var(--accent); }
.activity-icon.thought { background: rgba(139, 92, 246, 0.1); color: #8b5cf6; }
.activity-icon.action { background: rgba(14, 165, 233, 0.1); color: #0ea5e9; }
.activity-icon.question { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.activity-icon.success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
.activity-icon.error { background: rgba(239, 68, 68, 0.1); color: var(--error); }

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  color: var(--text-primary);
  word-wrap: break-word;
}

.activity-text.muted {
  color: var(--text-secondary);
}

.activity-target {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Question UI */
.question-box {
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: var(--border-radius-sm);
  padding: 12px;
  margin: 8px 16px;
  animation: questionIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes questionIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.question-text {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.question-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.question-option {
  padding: 7px 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.15s;
}

.question-option:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}

/* Status Footer */
.panel-footer {
  padding: 10px 16px;
  border-top: 1px solid var(--divider);
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
}

.status-indicator.pending {
  background: var(--accent);
  animation: pulse 1.5s ease-in-out infinite;
}

.status-indicator.fixing {
  background: #0ea5e9;
  animation: pulse 1s ease-in-out infinite;
}

.status-indicator.success { background: var(--success); }
.status-indicator.failed { background: var(--error); }

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.9); }
}

.status-text {
  font-size: 12px;
  color: var(--text-secondary);
  flex: 1;
}

/* Done state */
.panel-footer.done {
  background: rgba(16, 185, 129, 0.06);
}

.panel-footer.done .status-text {
  color: var(--success);
  font-weight: 500;
}

/* Result Toast - shows after page reload */
.result-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--glass-shadow);
  padding: 14px 18px;
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 320px;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.toast-icon.success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.toast-icon.failed {
  background: rgba(239, 68, 68, 0.15);
  color: var(--error);
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.toast-message {
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toast-close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

/* Hub - Request History */
.hub {
  position: fixed;
  bottom: 24px;
  left: 24px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--glass-shadow);
  pointer-events: auto;
  min-width: 48px;
  overflow: hidden;
  animation: hubIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes hubIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.hub.disabled {
  opacity: 0.5;
}

.hub-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
}

.hub-header:hover {
  background: rgba(0, 0, 0, 0.03);
}

.hub-logo {
  width: 24px;
  height: 24px;
  background: var(--accent);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
}

.hub-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.hub-badge {
  font-size: 10px;
  font-weight: 600;
  background: var(--accent);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.hub-toggle {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: transform 0.2s;
}

.hub-toggle.expanded {
  transform: rotate(180deg);
}

.hub-disable {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.15s;
  flex-shrink: 0;
}

.hub-disable:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

.hub-disable.active {
  color: var(--accent);
}

.hub-content {
  border-top: 1px solid var(--divider);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.hub-content.expanded {
  max-height: 300px;
}

.hub-list {
  max-height: 260px;
  overflow-y: auto;
  padding: 8px 0;
}

.hub-list::-webkit-scrollbar {
  width: 6px;
}

.hub-list::-webkit-scrollbar-track {
  background: transparent;
}

.hub-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.hub-item {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hub-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.hub-item-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hub-item-status.pending { background: var(--accent); animation: pulse 1.5s ease-in-out infinite; }
.hub-item-status.fixing { background: #0ea5e9; animation: pulse 1s ease-in-out infinite; }
.hub-item-status.success { background: var(--success); }
.hub-item-status.failed { background: var(--error); }

.hub-item-content {
  flex: 1;
  min-width: 0;
}

.hub-item-component {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
}

.hub-item-note {
  font-size: 12px;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hub-item-undo {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  opacity: 0;
  transition: all 0.15s;
  flex-shrink: 0;
}

.hub-item:hover .hub-item-undo {
  opacity: 1;
}

.hub-item-undo:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.hub-empty {
  padding: 16px 12px;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
}

/* Collapsed hub (minimal) */
.hub.collapsed .hub-title,
.hub.collapsed .hub-toggle {
  display: none;
}

.hub.collapsed .hub-header {
  padding: 8px;
  gap: 6px;
}
`;

type PanelMode = 'input' | 'activity';

interface PersistedSession {
  interactionId: string;
  userNote: string;
  componentName: string;
  status: InteractionStatus;
  message?: string;
  timestamp: number;
}

interface HistoryItem {
  interactionId: string;
  userNote: string;
  componentName: string;
  filePath?: string;
  status: InteractionStatus;
  timestamp: number;
}

export class EyeglassInspector extends HTMLElement {
  private shadow: ShadowRoot;
  private highlight: HTMLDivElement | null = null;
  private panel: HTMLDivElement | null = null;
  private toast: HTMLDivElement | null = null;
  private hub: HTMLDivElement | null = null;
  private currentElement: Element | null = null;
  private currentSnapshot: SemanticSnapshot | null = null;
  private interactionId: string | null = null;
  private frozen = false;
  private eventSource: EventSource | null = null;
  private throttleTimeout: number | null = null;
  private mode: PanelMode = 'input';
  private activityEvents: ActivityEvent[] = [];
  private currentStatus: InteractionStatus = 'idle';
  private hubExpanded = false;
  private inspectorEnabled = true;
  private history: HistoryItem[] = [];
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private customPanelPosition: { x: number; y: number } | null = null;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback(): void {
    const style = document.createElement('style');
    style.textContent = STYLES;
    this.shadow.appendChild(style);

    this.highlight = document.createElement('div');
    this.highlight.className = 'highlight';
    this.highlight.style.display = 'none';
    this.shadow.appendChild(this.highlight);

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePanelDragStart = this.handlePanelDragStart.bind(this);

    document.addEventListener('mousemove', this.handleMouseMove, true);
    document.addEventListener('click', this.handleClick, true);
    document.addEventListener('keydown', this.handleKeyDown, true);

    this.loadHistory();
    this.renderHub();
    this.connectSSE();
    this.restoreSession();
  }

  private saveSession(message?: string): void {
    if (!this.interactionId) return;

    const session: PersistedSession = {
      interactionId: this.interactionId,
      userNote: (this as any)._userNote || '',
      componentName: this.currentSnapshot?.framework.componentName || this.currentSnapshot?.tagName || 'element',
      status: this.currentStatus,
      message,
      timestamp: Date.now(),
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      // Ignore storage errors
    }
  }

  private restoreSession(): void {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const session: PersistedSession = JSON.parse(stored);

      // Check if session is still fresh
      if (Date.now() - session.timestamp > SESSION_TTL) {
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      // Only show toast for completed sessions
      if (session.status === 'success' || session.status === 'failed') {
        this.showResultToast(session);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  private showResultToast(session: PersistedSession): void {
    this.toast = document.createElement('div');
    this.toast.className = 'result-toast';

    const isSuccess = session.status === 'success';
    const icon = isSuccess ? '✓' : '✕';
    const title = isSuccess ? 'Done!' : 'Failed';

    this.toast.innerHTML = `
      <div class="toast-icon ${session.status}">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${this.escapeHtml(session.message || session.userNote)}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;

    const closeBtn = this.toast.querySelector('.toast-close') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.hideToast());

    this.shadow.appendChild(this.toast);

    // Auto-hide after 4 seconds
    setTimeout(() => this.hideToast(), 4000);
  }

  private hideToast(): void {
    if (this.toast) {
      this.toast.remove();
      this.toast = null;
    }
  }

  private loadHistory(): void {
    try {
      const stored = sessionStorage.getItem(HISTORY_KEY);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (e) {
      this.history = [];
    }
  }

  private saveHistory(): void {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
    } catch (e) {
      // Ignore storage errors
    }
  }

  private addToHistory(item: HistoryItem): void {
    // Check if this interaction already exists
    const existingIndex = this.history.findIndex(h => h.interactionId === item.interactionId);
    if (existingIndex >= 0) {
      this.history[existingIndex] = item;
    } else {
      this.history.unshift(item);
      // Keep only last 20 items
      if (this.history.length > 20) {
        this.history = this.history.slice(0, 20);
      }
    }
    this.saveHistory();
    this.renderHub();
  }

  private updateHistoryStatus(interactionId: string, status: InteractionStatus): void {
    const item = this.history.find(h => h.interactionId === interactionId);
    if (item) {
      item.status = status;
      this.saveHistory();
      this.renderHub();
    }
  }

  private renderHub(): void {
    if (!this.hub) {
      this.hub = document.createElement('div');
      this.hub.className = 'hub';
      this.shadow.appendChild(this.hub);
    }

    const collapsedClass = this.hubExpanded ? '' : 'collapsed';
    const disabledClass = this.inspectorEnabled ? '' : 'disabled';
    const expandedClass = this.hubExpanded ? 'expanded' : '';
    const activeCount = this.history.filter(h => h.status === 'pending' || h.status === 'fixing').length;

    this.hub.className = `hub ${collapsedClass} ${disabledClass}`.trim();

    this.hub.innerHTML = `
      <div class="hub-header">
        <div class="hub-logo">👁</div>
        <span class="hub-title">Eyeglass</span>
        ${activeCount > 0 ? `<span class="hub-badge">${activeCount}</span>` : ''}
        <button class="hub-toggle ${expandedClass}" title="Toggle history">▼</button>
        <button class="hub-disable ${this.inspectorEnabled ? 'active' : ''}" title="${this.inspectorEnabled ? 'Disable' : 'Enable'} inspector">
          ${this.inspectorEnabled ? '●' : '○'}
        </button>
      </div>
      <div class="hub-content ${expandedClass}">
        ${this.history.length > 0 ? `
          <div class="hub-list">
            ${this.history.map(item => `
              <div class="hub-item" data-id="${item.interactionId}">
                <div class="hub-item-status ${item.status}"></div>
                <div class="hub-item-content">
                  <div class="hub-item-component">${this.escapeHtml(item.componentName)}</div>
                  <div class="hub-item-note">${this.escapeHtml(item.userNote)}</div>
                </div>
                ${item.status === 'success' ? `
                  <button class="hub-item-undo" data-id="${item.interactionId}" title="Undo">↩</button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="hub-empty">No requests yet</div>
        `}
      </div>
    `;

    // Wire up event handlers
    const header = this.hub.querySelector('.hub-header') as HTMLDivElement;
    const toggleBtn = this.hub.querySelector('.hub-toggle') as HTMLButtonElement;
    const disableBtn = this.hub.querySelector('.hub-disable') as HTMLButtonElement;

    // Toggle expand/collapse on header click (except disable button)
    header.addEventListener('click', (e) => {
      if (e.target === disableBtn) return;
      this.hubExpanded = !this.hubExpanded;
      this.renderHub();
    });

    // Toggle inspector enabled state
    disableBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.inspectorEnabled = !this.inspectorEnabled;
      if (!this.inspectorEnabled) {
        this.unfreeze();
      }
      this.renderHub();
    });

    // Wire up undo buttons
    this.hub.querySelectorAll('.hub-item-undo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (e.currentTarget as HTMLButtonElement).dataset.id!;
        this.requestUndo(id);
      });
    });
  }

  private async requestUndo(interactionId: string): Promise<void> {
    const item = this.history.find(h => h.interactionId === interactionId);
    if (!item) return;

    try {
      const response = await fetch(`${BRIDGE_URL}/undo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interactionId }),
      });

      if (response.ok) {
        // Mark as pending while undo is in progress
        item.status = 'pending';
        this.saveHistory();
        this.renderHub();
      }
    } catch (err) {
      // Silently fail, bridge may not support undo yet
      console.warn('Undo request failed:', err);
    }
  }

  disconnectedCallback(): void {
    document.removeEventListener('mousemove', this.handleMouseMove, true);
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('keydown', this.handleKeyDown, true);
    this.eventSource?.close();
  }

  private connectSSE(): void {
    this.eventSource = new EventSource(`${BRIDGE_URL}/events`);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'activity') {
          this.handleActivityEvent(data.payload as ActivityEvent);
        }
      } catch (e) {
        // Ignore parse errors
      }
    };

    this.eventSource.onerror = () => {
      this.eventSource?.close();
      setTimeout(() => this.connectSSE(), 3000);
    };
  }

  private handleActivityEvent(event: ActivityEvent): void {
    // Update history for any matching interaction, even if not current
    if (event.type === 'status') {
      this.updateHistoryStatus(event.interactionId, event.status);
    }

    if (event.interactionId !== this.interactionId) return;

    this.activityEvents.push(event);

    if (event.type === 'status') {
      this.currentStatus = event.status;
      // Persist session so we can show result after page reload
      this.saveSession(event.message);

      if (event.status === 'success' || event.status === 'failed') {
        setTimeout(() => this.unfreeze(), 4000);
      }
    }

    this.renderPanel();
  }

  private handleMouseMove(e: MouseEvent): void {
    if (this.frozen || !this.inspectorEnabled) return;

    if (this.throttleTimeout) return;
    this.throttleTimeout = window.setTimeout(() => {
      this.throttleTimeout = null;
    }, 16);

    this.style.pointerEvents = 'none';
    const target = document.elementFromPoint(e.clientX, e.clientY);
    this.style.pointerEvents = '';

    if (!target || target === document.documentElement || target === document.body) {
      this.hideHighlight();
      return;
    }

    if (this.shadow.contains(target as Node)) return;

    this.currentElement = target;
    this.showHighlight(target);
  }

  private handleClick(e: MouseEvent): void {
    if (this.frozen || !this.inspectorEnabled) return;
    if (!this.currentElement) return;

    const path = e.composedPath();
    if (path.some((el) => el === this)) return;

    e.preventDefault();
    e.stopPropagation();

    this.freeze();
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.unfreeze();
    }
  }

  private handlePanelDragStart(e: MouseEvent): void {
    // Don't drag if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return;

    this.isDragging = true;
    const panelRect = this.panel!.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - panelRect.left,
      y: e.clientY - panelRect.top,
    };

    document.addEventListener('mousemove', this.handlePanelDrag);
    document.addEventListener('mouseup', this.handlePanelDragEnd);
  }

  private handlePanelDrag = (e: MouseEvent): void => {
    if (!this.isDragging || !this.panel) return;

    const x = Math.max(0, Math.min(e.clientX - this.dragOffset.x, window.innerWidth - 340));
    const y = Math.max(0, Math.min(e.clientY - this.dragOffset.y, window.innerHeight - 100));

    this.customPanelPosition = { x, y };
    this.panel.style.left = `${x}px`;
    this.panel.style.top = `${y}px`;
  };

  private handlePanelDragEnd = (): void => {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.handlePanelDrag);
    document.removeEventListener('mouseup', this.handlePanelDragEnd);
  };

  private showHighlight(element: Element): void {
    if (!this.highlight) return;

    const rect = element.getBoundingClientRect();
    this.highlight.style.display = 'block';
    this.highlight.style.left = `${rect.left - 2}px`;
    this.highlight.style.top = `${rect.top - 2}px`;
    this.highlight.style.width = `${rect.width + 4}px`;
    this.highlight.style.height = `${rect.height + 4}px`;
  }

  private hideHighlight(): void {
    if (this.highlight) {
      this.highlight.style.display = 'none';
    }
    this.currentElement = null;
  }

  private freeze(): void {
    if (!this.currentElement) return;

    this.frozen = true;
    this.currentSnapshot = captureSnapshot(this.currentElement);
    this.mode = 'input';
    this.activityEvents = [];
    this.currentStatus = 'idle';
    this.renderPanel();
  }

  private unfreeze(): void {
    this.frozen = false;
    this.currentSnapshot = null;
    this.interactionId = null;
    this.mode = 'input';
    this.activityEvents = [];
    this.customPanelPosition = null;
    this.hidePanel();
    this.hideHighlight();

    // Clear persisted session
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }

  private renderPanel(): void {
    if (!this.currentSnapshot || !this.currentElement) return;

    const rect = this.currentElement.getBoundingClientRect();
    const { framework } = this.currentSnapshot;

    if (!this.panel) {
      this.panel = document.createElement('div');
      this.panel.className = 'glass-panel';
      this.shadow.appendChild(this.panel);
    }

    // Position panel - use custom position if user has dragged it
    if (this.customPanelPosition) {
      this.panel.style.left = `${this.customPanelPosition.x}px`;
      this.panel.style.top = `${this.customPanelPosition.y}px`;
    } else {
      const spaceBelow = window.innerHeight - rect.bottom;
      const panelHeight = this.mode === 'activity' ? 400 : 200;
      let top = rect.bottom + 12;
      if (spaceBelow < panelHeight && rect.top > panelHeight) {
        top = rect.top - panelHeight - 12;
      }

      let left = rect.left;
      if (left + 340 > window.innerWidth - 20) {
        left = window.innerWidth - 360;
      }
      if (left < 20) left = 20;

      this.panel.style.left = `${left}px`;
      this.panel.style.top = `${top}px`;
    }

    const componentName = framework.componentName || this.currentSnapshot.tagName;
    const filePath = framework.filePath
      ? framework.filePath.split('/').slice(-2).join('/')
      : null;

    if (this.mode === 'input') {
      this.renderInputMode(componentName, filePath);
    } else {
      this.renderActivityMode(componentName, filePath);
    }
  }

  private renderInputMode(componentName: string, filePath: string | null): void {
    if (!this.panel) return;

    this.panel.innerHTML = `
      <div class="panel-header">
        <span class="component-tag">&lt;${componentName} /&gt;</span>
        ${filePath ? `<span class="file-path">${filePath}</span>` : ''}
        <button class="close-btn" title="Cancel (Esc)">&times;</button>
      </div>
      <div class="input-area">
        <input
          type="text"
          class="input-field"
          placeholder="What do you want to change?"
          autofocus
        />
        <div class="btn-row">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Send</button>
        </div>
      </div>
    `;

    const input = this.panel.querySelector('.input-field') as HTMLInputElement;
    const closeBtn = this.panel.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = this.panel.querySelector('.btn-secondary') as HTMLButtonElement;
    const sendBtn = this.panel.querySelector('.btn-primary') as HTMLButtonElement;

    closeBtn.addEventListener('click', () => this.unfreeze());
    cancelBtn.addEventListener('click', () => this.unfreeze());
    sendBtn.addEventListener('click', () => this.submit(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.submit(input.value);
      }
    });

    // Make panel draggable via header
    const header = this.panel.querySelector('.panel-header') as HTMLDivElement;
    header.addEventListener('mousedown', this.handlePanelDragStart);

    requestAnimationFrame(() => input.focus());
  }

  private renderActivityMode(componentName: string, filePath: string | null): void {
    if (!this.panel) return;

    const userNote = this.activityEvents.length > 0
      ? (this.panel.querySelector('.user-request-text')?.textContent || '')
      : '';

    const isDone = this.currentStatus === 'success' || this.currentStatus === 'failed';

    this.panel.innerHTML = `
      <div class="panel-header">
        <span class="component-tag">&lt;${componentName} /&gt;</span>
        ${filePath ? `<span class="file-path">${filePath}</span>` : ''}
        <button class="close-btn" title="Close">&times;</button>
      </div>
      <div class="user-request">
        <div class="user-request-label">Your request</div>
        <div class="user-request-text">${this.escapeHtml(this.getUserNote())}</div>
      </div>
      <div class="activity-feed">
        ${this.renderActivityFeed()}
      </div>
      <div class="panel-footer ${isDone ? 'done' : ''}">
        <div class="status-indicator ${this.currentStatus}"></div>
        <span class="status-text">${this.getStatusText()}</span>
      </div>
    `;

    const closeBtn = this.panel.querySelector('.close-btn') as HTMLButtonElement;
    closeBtn.addEventListener('click', () => this.unfreeze());

    // Make panel draggable via header
    const header = this.panel.querySelector('.panel-header') as HTMLDivElement;
    header.addEventListener('mousedown', this.handlePanelDragStart);

    // Wire up question buttons if present
    this.panel.querySelectorAll('.question-option').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const questionId = target.dataset.questionId!;
        const answerId = target.dataset.answerId!;
        const answerLabel = target.textContent!;
        this.submitAnswer(questionId, answerId, answerLabel);
      });
    });

    // Scroll to bottom of activity feed
    const feed = this.panel.querySelector('.activity-feed');
    if (feed) {
      feed.scrollTop = feed.scrollHeight;
    }
  }

  private renderActivityFeed(): string {
    return this.activityEvents.map((event) => {
      switch (event.type) {
        case 'status':
          if (event.status === 'pending') return ''; // Skip initial pending
          return this.renderStatusItem(event);
        case 'thought':
          return this.renderThoughtItem(event);
        case 'action':
          return this.renderActionItem(event);
        case 'question':
          return this.renderQuestionItem(event);
        default:
          return '';
      }
    }).join('');
  }

  private renderStatusItem(event: { status: InteractionStatus; message?: string }): string {
    const iconClass = event.status === 'success' ? 'success' :
                      event.status === 'failed' ? 'error' : 'status';
    const icon = event.status === 'success' ? '✓' :
                 event.status === 'failed' ? '✕' : '●';
    return `
      <div class="activity-item">
        <div class="activity-icon ${iconClass}">${icon}</div>
        <div class="activity-content">
          <div class="activity-text">${this.escapeHtml(event.message || event.status)}</div>
        </div>
      </div>
    `;
  }

  private renderThoughtItem(event: { content: string }): string {
    return `
      <div class="activity-item">
        <div class="activity-icon thought">💭</div>
        <div class="activity-content">
          <div class="activity-text muted">${this.escapeHtml(event.content)}</div>
        </div>
      </div>
    `;
  }

  private renderActionItem(event: { action: string; target: string; complete?: boolean }): string {
    const icons: Record<string, string> = {
      reading: '📖',
      writing: '✏️',
      searching: '🔍',
      thinking: '🧠',
    };
    const verbs: Record<string, string> = {
      reading: 'Reading',
      writing: 'Writing',
      searching: 'Searching',
      thinking: 'Thinking about',
    };
    return `
      <div class="activity-item">
        <div class="activity-icon action">${icons[event.action] || '●'}</div>
        <div class="activity-content">
          <div class="activity-text">${verbs[event.action] || event.action}${event.complete ? ' ✓' : '...'}</div>
          <div class="activity-target">${this.escapeHtml(event.target)}</div>
        </div>
      </div>
    `;
  }

  private renderQuestionItem(event: { questionId: string; question: string; options: Array<{ id: string; label: string }>; timestamp: number }): string {
    // Check if this question was already answered
    const wasAnswered = this.activityEvents.some(
      (e) => e.type === 'status' && e.timestamp > event.timestamp
    );

    if (wasAnswered) {
      return `
        <div class="activity-item">
          <div class="activity-icon question">?</div>
          <div class="activity-content">
            <div class="activity-text muted">${this.escapeHtml(event.question)}</div>
          </div>
        </div>
      `;
    }

    return `
      <div class="question-box">
        <div class="question-text">${this.escapeHtml(event.question)}</div>
        <div class="question-options">
          ${event.options.map((opt) => `
            <button
              class="question-option"
              data-question-id="${event.questionId}"
              data-answer-id="${opt.id}"
            >${this.escapeHtml(opt.label)}</button>
          `).join('')}
        </div>
      </div>
    `;
  }

  private getUserNote(): string {
    // Find the original focus payload from the first status event or stored value
    const active = this.activityEvents.find((e) => e.type === 'status');
    // We need to store this separately
    return (this as any)._userNote || '';
  }

  private getStatusText(): string {
    switch (this.currentStatus) {
      case 'idle': return 'Ready';
      case 'pending': return 'Waiting for agent...';
      case 'fixing': return 'Agent is working...';
      case 'success': return 'Done!';
      case 'failed': return 'Failed';
      default: return this.currentStatus;
    }
  }

  private hidePanel(): void {
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }

  private async submit(userNote: string): Promise<void> {
    if (!this.currentSnapshot || !userNote.trim()) return;

    this.interactionId = `eyeglass-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    (this as any)._userNote = userNote.trim();

    const payload: FocusPayload = {
      interactionId: this.interactionId,
      snapshot: this.currentSnapshot,
      userNote: userNote.trim(),
    };

    // Add to history
    this.addToHistory({
      interactionId: this.interactionId,
      userNote: userNote.trim(),
      componentName: this.currentSnapshot.framework.componentName || this.currentSnapshot.tagName,
      filePath: this.currentSnapshot.framework.filePath,
      status: 'pending',
      timestamp: Date.now(),
    });

    this.mode = 'activity';
    this.activityEvents = [];
    this.currentStatus = 'pending';
    this.renderPanel();

    try {
      const response = await fetch(`${BRIDGE_URL}/focus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      this.currentStatus = 'failed';
      this.updateHistoryStatus(this.interactionId, 'failed');
      this.activityEvents.push({
        type: 'status',
        interactionId: this.interactionId,
        status: 'failed',
        message: 'Failed to connect to bridge',
        timestamp: Date.now(),
      });
      this.renderPanel();
    }
  }

  private async submitAnswer(questionId: string, answerId: string, answerLabel: string): Promise<void> {
    if (!this.interactionId) return;

    const answer: AnswerPayload = {
      interactionId: this.interactionId,
      questionId,
      answerId,
      answerLabel,
    };

    try {
      await fetch(`${BRIDGE_URL}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answer),
      });
    } catch (err) {
      // Silently fail
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

if (!customElements.get('eyeglass-inspector')) {
  customElements.define('eyeglass-inspector', EyeglassInspector);
}
