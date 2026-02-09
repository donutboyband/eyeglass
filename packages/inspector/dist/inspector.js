/**
 * Eyeglass Inspector - Glass UI for visual element inspection
 */
import { captureSnapshot } from './snapshot.js';
const BRIDGE_URL = 'http://localhost:3300';
const STORAGE_KEY = 'eyeglass_session';
const HISTORY_KEY = 'eyeglass_history';
const ENABLED_KEY = 'eyeglass_enabled';
const AUTOCOMMIT_KEY = 'eyeglass_autocommit';
const SESSION_TTL = 10000; // 10 seconds
// Fun rotating phrases for the "fixing" status
const WORKING_PHRASES = [
    'Ruminating...',
    'Percolating...',
    'Divining...',
    'Grokking...',
    'Communing...',
    'Concocting...',
    'Synthesizing...',
    'Distilling...',
    'Incubating...',
    'Forging...',
    'Scrutinizing...',
    'Triangulating...',
    'Unraveling...',
    'Traversing...',
    'Sifting...',
    'Marshaling...',
    'Hydrating...',
    'Harmonizing...',
    'Indexing...',
    'Entangling...',
];
// Eye cursor as base64-encoded SVG (16x16 eye icon, indigo color)
const EYE_CURSOR = `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xIDEyczQtOCAxMS04IDExIDggMTEgOC00IDgtMTEgOC0xMS04LTExLTh6Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMyIgZmlsbD0iIzYzNjZmMSIvPjwvc3ZnPg==") 8 8, crosshair`;
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
  --glass-bg: rgba(255, 255, 255, 0.88);
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
  z-index: 2147483640;
  border: 2px solid var(--accent);
  background: rgba(99, 102, 241, 0.06);
  pointer-events: none;
  border-radius: 6px;
  transition: all 0.1s ease-out;
  box-shadow:
    0 0 0 3px rgba(99, 102, 241, 0.08),
    0 2px 8px rgba(99, 102, 241, 0.1);
}

.highlight.no-transition {
  transition: none;
}

/* Glass Panel */
.glass-panel {
  position: absolute;
  z-index: 2147483647;
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
  cursor: default;
}

.glass-panel *, .glass-panel *::before, .glass-panel *::after {
  cursor: inherit;
}

.glass-panel button, .glass-panel input {
  cursor: pointer;
}

.glass-panel input[type="text"] {
  cursor: text;
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

/* Skeleton loader */
.skeleton-item {
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.skeleton-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  width: 60%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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
  bottom: 16px;
  left: 16px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  box-shadow: var(--glass-shadow);
  pointer-events: auto;
  min-width: 36px;
  max-width: 200px;
  overflow: hidden;
  animation: hubIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
}

.hub *, .hub *::before, .hub *::after {
  cursor: inherit;
}

.hub button {
  cursor: pointer;
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
  justify-content: space-between;
  gap: 6px;
  padding: 6px 8px;
  cursor: pointer;
  user-select: none;
}

.hub-header:hover {
  background: rgba(0, 0, 0, 0.03);
}

.hub-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hub-logo {
  width: 20px;
  height: 20px;
  background: var(--accent);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: white;
  flex-shrink: 0;
}

.hub-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
  flex: 1;
}

.hub-badge {
  font-size: 9px;
  font-weight: 600;
  background: var(--accent);
  color: white;
  padding: 1px 5px;
  border-radius: 8px;
  min-width: 14px;
  text-align: center;
}

.hub-toggle {
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  transition: transform 0.2s;
}

.hub-toggle.expanded {
  transform: rotate(180deg);
}

.hub-disable {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.hub-disable svg {
  width: 14px;
  height: 14px;
}

.hub-content {
  border-top: 1px solid var(--divider);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.hub-content.expanded {
  max-height: 220px;
}

.hub-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
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
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hub-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.hub-item-status {
  width: 6px;
  height: 6px;
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
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
}

.hub-item-note {
  font-size: 11px;
  color: var(--text-primary);
  word-wrap: break-word;
}

.hub-item-undo {
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
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
  padding: 10px 8px;
  text-align: center;
  font-size: 10px;
  color: var(--text-muted);
}

.hub-settings-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}

.hub-settings-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-secondary);
}

.hub-settings-btn svg {
  width: 12px;
  height: 12px;
}

/* Settings Page */
.hub-settings-page {
  padding: 8px 0;
}

.hub-settings-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px 8px;
  border-bottom: 1px solid var(--divider);
}

.hub-back-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.hub-back-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.hub-settings-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-primary);
}

.hub-settings-list {
  padding: 8px;
}

.hub-setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
}

.hub-setting-row:not(:last-child) {
  border-bottom: 1px solid var(--divider);
  padding-bottom: 10px;
  margin-bottom: 4px;
}

.hub-setting-info {
  flex: 1;
}

.hub-setting-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
}

.hub-setting-desc {
  font-size: 9px;
  color: var(--text-muted);
  margin-top: 2px;
}

/* Collapsed hub (minimal) */
.hub.collapsed .hub-title,
.hub.collapsed .hub-toggle,
.hub.collapsed .hub-settings-btn {
  display: none;
}

.hub.collapsed .hub-header {
  padding: 5px;
}

.hub.collapsed .hub-header-left {
  gap: 4px;
}

.toggle-switch {
  position: relative;
  width: 32px;
  height: 18px;
  background: #cbd5e1;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.2s;
  border: none;
  padding: 0;
}

.toggle-switch.active {
  background: var(--accent);
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.toggle-switch.active::after {
  transform: translateX(14px);
}

/* Success action buttons */
.success-actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.action-btn {
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn-commit {
  background: var(--success);
  color: white;
}

.action-btn-commit:hover {
  background: #059669;
}

.action-btn-undo {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.action-btn-undo:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Follow-up input */
.followup-area {
  padding: 12px 16px;
  border-top: 1px solid var(--divider);
  background: rgba(16, 185, 129, 0.04);
}

.followup-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.followup-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-primary);
  outline: none;
  transition: all 0.15s;
}

.followup-input::placeholder {
  color: var(--text-muted);
}

.followup-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-soft);
  background: white;
}

.followup-send {
  padding: 8px 14px;
  border: none;
  border-radius: var(--border-radius-sm);
  background: var(--accent);
  color: white;
  font-size: 12px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.followup-send:hover {
  background: #4f46e5;
}

.followup-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.followup-done {
  padding: 8px 14px;
  border: 1px solid var(--divider);
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.followup-done:hover {
  background: rgba(0, 0, 0, 0.04);
}

/* Multi-select styles */
.highlight.multi {
  border-style: dashed;
  border-width: 2px;
  box-shadow:
    0 0 0 2px rgba(99, 102, 241, 0.06),
    0 2px 6px rgba(99, 102, 241, 0.08);
}

.highlight-badge {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 20px;
  height: 20px;
  background: var(--accent);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.multi-select-icon {
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
  font-size: 16px;
  line-height: 1;
}

.multi-select-icon:hover {
  background: var(--accent-soft);
  color: var(--accent);
}

.multi-select-icon.active {
  background: var(--accent);
  color: white;
}

.selected-list {
  padding: 8px 16px;
  border-bottom: 1px solid var(--divider);
  background: rgba(0, 0, 0, 0.02);
}

.selected-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.selected-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
}

.selected-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selected-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--accent-soft);
  border-radius: 6px;
  font-size: 11px;
  color: var(--accent);
  font-weight: 500;
}

.selected-chip-number {
  width: 16px;
  height: 16px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
}

.selected-chip-remove {
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: var(--accent);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  opacity: 0.7;
  transition: all 0.15s;
  padding: 0;
}

.selected-chip-remove:hover {
  opacity: 1;
  background: rgba(99, 102, 241, 0.2);
}

.multi-mode-hint {
  padding: 8px 16px;
  background: var(--accent-soft);
  border-bottom: 1px solid var(--divider);
  font-size: 11px;
  color: var(--accent);
  text-align: center;
}
`;
export class EyeglassInspector extends HTMLElement {
    constructor() {
        super();
        this.highlight = null;
        this.panel = null;
        this.toast = null;
        this.hub = null;
        this.currentElement = null;
        this.currentSnapshot = null;
        this.interactionId = null;
        this.frozen = false;
        this.eventSource = null;
        this.throttleTimeout = null;
        this.mode = 'input';
        this.activityEvents = [];
        this.currentStatus = 'idle';
        this.hubExpanded = false;
        this.hubPage = 'main';
        this.inspectorEnabled = true;
        this.autoCommitEnabled = true;
        this.history = [];
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.customPanelPosition = null;
        // Multi-select state
        this.multiSelectMode = false;
        this.selectedElements = [];
        this.selectedSnapshots = [];
        this.multiSelectHighlights = [];
        this.submittedSnapshots = []; // Track what was submitted for activity mode display
        // Cursor style element (injected into document head)
        this.cursorStyleElement = null;
        // Scroll handling
        this.scrollTimeout = null;
        // Rotating status phrases
        this.phraseIndex = 0;
        this.phraseInterval = null;
        this.handlePanelDrag = (e) => {
            if (!this.isDragging || !this.panel)
                return;
            const x = Math.max(0, Math.min(e.clientX - this.dragOffset.x, window.innerWidth - 340));
            const y = Math.max(0, Math.min(e.clientY - this.dragOffset.y, window.innerHeight - 100));
            this.customPanelPosition = { x, y };
            this.panel.style.left = `${x}px`;
            this.panel.style.top = `${y}px`;
        };
        this.handlePanelDragEnd = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', this.handlePanelDrag);
            document.removeEventListener('mouseup', this.handlePanelDragEnd);
        };
        this.shadow = this.attachShadow({ mode: 'closed' });
    }
    connectedCallback() {
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
        this.handleScroll = this.handleScroll.bind(this);
        document.addEventListener('mousemove', this.handleMouseMove, true);
        document.addEventListener('click', this.handleClick, true);
        document.addEventListener('keydown', this.handleKeyDown, true);
        window.addEventListener('scroll', this.handleScroll, true);
        this.loadEnabledState();
        this.loadAutoCommitState();
        this.loadHistory();
        this.renderHub();
        this.connectSSE();
        this.restoreSession();
        this.updateCursor();
    }
    saveSession(message) {
        if (!this.interactionId)
            return;
        const session = {
            interactionId: this.interactionId,
            userNote: this._userNote || '',
            componentName: this.currentSnapshot?.framework.componentName || this.currentSnapshot?.tagName || 'element',
            status: this.currentStatus,
            message,
            timestamp: Date.now(),
        };
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        }
        catch (e) {
            // Ignore storage errors
        }
    }
    restoreSession() {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (!stored)
                return;
            const session = JSON.parse(stored);
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
        }
        catch (e) {
            // Ignore parse errors
        }
    }
    showResultToast(session) {
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
        const closeBtn = this.toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.hideToast());
        this.shadow.appendChild(this.toast);
        // Auto-hide after 4 seconds
        setTimeout(() => this.hideToast(), 4000);
    }
    hideToast() {
        if (this.toast) {
            this.toast.remove();
            this.toast = null;
        }
    }
    loadEnabledState() {
        try {
            const stored = localStorage.getItem(ENABLED_KEY);
            if (stored !== null) {
                this.inspectorEnabled = stored === 'true';
            }
        }
        catch (e) {
            // Ignore storage errors
        }
    }
    saveEnabledState() {
        try {
            localStorage.setItem(ENABLED_KEY, String(this.inspectorEnabled));
        }
        catch (e) {
            // Ignore storage errors
        }
    }
    loadAutoCommitState() {
        try {
            const stored = localStorage.getItem(AUTOCOMMIT_KEY);
            if (stored !== null) {
                this.autoCommitEnabled = stored === 'true';
            }
        }
        catch (e) {
            // Ignore storage errors
        }
    }
    saveAutoCommitState() {
        try {
            localStorage.setItem(AUTOCOMMIT_KEY, String(this.autoCommitEnabled));
        }
        catch (e) {
            // Ignore storage errors
        }
    }
    loadHistory() {
        try {
            const stored = sessionStorage.getItem(HISTORY_KEY);
            if (stored) {
                this.history = JSON.parse(stored);
            }
        }
        catch (e) {
            this.history = [];
        }
    }
    saveHistory() {
        try {
            sessionStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
        }
        catch (e) {
            // Ignore storage errors
        }
    }
    addToHistory(item) {
        // Check if this interaction already exists
        const existingIndex = this.history.findIndex(h => h.interactionId === item.interactionId);
        if (existingIndex >= 0) {
            this.history[existingIndex] = item;
        }
        else {
            this.history.unshift(item);
            // Keep only last 20 items
            if (this.history.length > 20) {
                this.history = this.history.slice(0, 20);
            }
        }
        this.saveHistory();
        this.renderHub();
    }
    updateHistoryStatus(interactionId, status) {
        const item = this.history.find(h => h.interactionId === interactionId);
        if (item) {
            item.status = status;
            this.saveHistory();
            this.renderHub();
        }
    }
    renderHub() {
        if (!this.hub) {
            this.hub = document.createElement('div');
            this.hub.className = 'hub';
            this.shadow.appendChild(this.hub);
        }
        if (this.hubPage === 'settings') {
            this.renderHubSettingsPage();
        }
        else {
            this.renderHubMainPage();
        }
    }
    renderHubMainPage() {
        if (!this.hub)
            return;
        const collapsedClass = this.hubExpanded ? '' : 'collapsed';
        const disabledClass = this.inspectorEnabled ? '' : 'disabled';
        const expandedClass = this.hubExpanded ? 'expanded' : '';
        const activeCount = this.history.filter(h => h.status === 'pending' || h.status === 'fixing').length;
        this.hub.className = `hub ${collapsedClass} ${disabledClass}`.trim();
        const eyeOpenSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        const eyeClosedSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
        const gearSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
        this.hub.innerHTML = `
      <div class="hub-header">
        <div class="hub-header-left">
          <div class="hub-logo">👁</div>
          <span class="hub-title">Eyeglass</span>
          ${activeCount > 0 ? `<span class="hub-badge">${activeCount}</span>` : ''}
          <button class="hub-toggle ${expandedClass}" title="Toggle history">▼</button>
        </div>
        <button class="hub-settings-btn" title="Settings">${gearSvg}</button>
        <button class="hub-disable ${this.inspectorEnabled ? 'active' : ''}" title="${this.inspectorEnabled ? 'Disable' : 'Enable'} inspector">
          ${this.inspectorEnabled ? eyeOpenSvg : eyeClosedSvg}
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
        const header = this.hub.querySelector('.hub-header');
        const disableBtn = this.hub.querySelector('.hub-disable');
        const settingsBtn = this.hub.querySelector('.hub-settings-btn');
        // Toggle expand/collapse on header click (except buttons)
        header.addEventListener('click', (e) => {
            if (e.target === disableBtn || e.target === settingsBtn || e.target.closest('.hub-settings-btn'))
                return;
            this.hubExpanded = !this.hubExpanded;
            this.renderHub();
        });
        // Open settings page
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hubPage = 'settings';
            this.hubExpanded = true; // Ensure expanded when viewing settings
            this.renderHub();
        });
        // Toggle inspector enabled state
        disableBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.inspectorEnabled = !this.inspectorEnabled;
            this.saveEnabledState();
            if (!this.inspectorEnabled) {
                this.unfreeze();
            }
            this.updateCursor();
            this.renderHub();
        });
        // Wire up undo buttons
        this.hub.querySelectorAll('.hub-item-undo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                this.requestUndo(id);
            });
        });
    }
    renderHubSettingsPage() {
        if (!this.hub)
            return;
        this.hub.className = 'hub';
        this.hub.innerHTML = `
      <div class="hub-header">
        <div class="hub-header-left">
          <div class="hub-logo">👁</div>
          <span class="hub-title">Eyeglass</span>
        </div>
      </div>
      <div class="hub-content expanded">
        <div class="hub-settings-page">
          <div class="hub-settings-header">
            <button class="hub-back-btn" title="Back">←</button>
            <span class="hub-settings-title">Settings</span>
          </div>
          <div class="hub-settings-list">
            <div class="hub-setting-row">
              <div class="hub-setting-info">
                <div class="hub-setting-label">Auto-commit</div>
                <div class="hub-setting-desc">Automatically commit changes on success</div>
              </div>
              <button class="toggle-switch ${this.autoCommitEnabled ? 'active' : ''}" data-setting="autoCommit"></button>
            </div>
          </div>
        </div>
      </div>
    `;
        // Wire up back button
        const backBtn = this.hub.querySelector('.hub-back-btn');
        backBtn.addEventListener('click', () => {
            this.hubPage = 'main';
            this.renderHub();
        });
        // Wire up toggle switches
        this.hub.querySelectorAll('.toggle-switch').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const setting = e.currentTarget.dataset.setting;
                if (setting === 'autoCommit') {
                    this.autoCommitEnabled = !this.autoCommitEnabled;
                    this.saveAutoCommitState();
                    this.renderHub();
                }
            });
        });
    }
    async requestUndo(interactionId) {
        const itemIndex = this.history.findIndex(h => h.interactionId === interactionId);
        if (itemIndex === -1)
            return;
        // Mark as pending while undo is in progress
        this.history[itemIndex].status = 'pending';
        this.saveHistory();
        this.renderHub();
        try {
            const response = await fetch(`${BRIDGE_URL}/undo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interactionId }),
            });
            if (response.ok) {
                // Remove from history on successful undo
                this.history.splice(itemIndex, 1);
                this.saveHistory();
                this.renderHub();
            }
            else {
                // Mark as failed if undo didn't work
                this.history[itemIndex].status = 'failed';
                this.saveHistory();
                this.renderHub();
            }
        }
        catch (err) {
            // Mark as failed on error
            if (this.history[itemIndex]) {
                this.history[itemIndex].status = 'failed';
                this.saveHistory();
                this.renderHub();
            }
            console.warn('Undo request failed:', err);
        }
    }
    async requestCommit(interactionId) {
        const itemIndex = this.history.findIndex(h => h.interactionId === interactionId);
        try {
            const response = await fetch(`${BRIDGE_URL}/commit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interactionId }),
            });
            if (response.ok) {
                // Update status to show it's committed
                if (itemIndex >= 0) {
                    this.history[itemIndex].status = 'success';
                    this.saveHistory();
                    this.renderHub();
                }
                // Close the panel after commit
                this.unfreeze();
            }
            else {
                console.warn('Commit request failed');
            }
        }
        catch (err) {
            console.warn('Commit request failed:', err);
        }
    }
    disconnectedCallback() {
        document.removeEventListener('mousemove', this.handleMouseMove, true);
        document.removeEventListener('click', this.handleClick, true);
        document.removeEventListener('keydown', this.handleKeyDown, true);
        window.removeEventListener('scroll', this.handleScroll, true);
        this.eventSource?.close();
        // Clean up cursor style
        if (this.cursorStyleElement) {
            this.cursorStyleElement.remove();
            this.cursorStyleElement = null;
        }
    }
    connectSSE() {
        this.eventSource = new EventSource(`${BRIDGE_URL}/events`);
        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'activity') {
                    this.handleActivityEvent(data.payload);
                }
            }
            catch (e) {
                // Ignore parse errors
            }
        };
        this.eventSource.onerror = () => {
            this.eventSource?.close();
            setTimeout(() => this.connectSSE(), 3000);
        };
    }
    handleActivityEvent(event) {
        // Update history for any matching interaction, even if not current
        if (event.type === 'status') {
            this.updateHistoryStatus(event.interactionId, event.status);
        }
        if (event.interactionId !== this.interactionId)
            return;
        this.activityEvents.push(event);
        if (event.type === 'status') {
            this.currentStatus = event.status;
            // Persist session so we can show result after page reload
            this.saveSession(event.message);
            // Manage phrase rotation based on status
            if (event.status === 'fixing') {
                this.startPhraseRotation();
            }
            else {
                this.stopPhraseRotation();
            }
            if (event.status === 'failed') {
                // Auto-close on failure after delay
                setTimeout(() => this.unfreeze(), 4000);
            }
            // Don't auto-close on success - show follow-up UI instead
        }
        this.renderPanel();
    }
    handleMouseMove(e) {
        // In multi-select mode, continue raycasting even when frozen
        if (!this.multiSelectMode && this.frozen)
            return;
        if (!this.inspectorEnabled)
            return;
        // Don't raycast if hovering over our own UI (hub, panel, etc.)
        // When pointer-events: auto elements in our shadow DOM are hovered,
        // the host element will be in the composed path
        const path = e.composedPath();
        if (path.includes(this)) {
            if (!this.multiSelectMode) {
                this.hideHighlight();
            }
            return;
        }
        if (this.throttleTimeout)
            return;
        this.throttleTimeout = window.setTimeout(() => {
            this.throttleTimeout = null;
        }, 16);
        this.style.pointerEvents = 'none';
        const target = document.elementFromPoint(e.clientX, e.clientY);
        this.style.pointerEvents = '';
        if (!target || target === document.documentElement || target === document.body) {
            if (!this.multiSelectMode) {
                this.hideHighlight();
            }
            return;
        }
        if (this.shadow.contains(target))
            return;
        this.currentElement = target;
        this.showHighlight(target);
    }
    handleClick(e) {
        if (!this.inspectorEnabled)
            return;
        if (!this.currentElement)
            return;
        const path = e.composedPath();
        if (path.some((el) => el === this))
            return;
        e.preventDefault();
        e.stopPropagation();
        // In multi-select mode, add/toggle element in selection
        if (this.multiSelectMode) {
            this.toggleInSelection(this.currentElement);
            return;
        }
        // Normal single-select behavior
        if (this.frozen)
            return;
        this.freeze();
    }
    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.unfreeze();
        }
    }
    handleScroll() {
        if (!this.frozen)
            return;
        // Disable transitions during scroll for instant updates
        this.disableHighlightTransitions();
        // Update single highlight position
        if (this.currentElement && this.highlight && !this.multiSelectMode) {
            this.showHighlight(this.currentElement);
        }
        // Update multi-select highlights
        if (this.multiSelectMode && this.selectedElements.length > 0) {
            this.updateMultiSelectHighlightPositions();
        }
        // Re-enable transitions after scrolling stops
        if (this.scrollTimeout) {
            window.clearTimeout(this.scrollTimeout);
        }
        this.scrollTimeout = window.setTimeout(() => {
            this.enableHighlightTransitions();
            this.scrollTimeout = null;
        }, 150);
    }
    disableHighlightTransitions() {
        if (this.highlight) {
            this.highlight.classList.add('no-transition');
        }
        this.multiSelectHighlights.forEach(h => h.classList.add('no-transition'));
    }
    enableHighlightTransitions() {
        if (this.highlight) {
            this.highlight.classList.remove('no-transition');
        }
        this.multiSelectHighlights.forEach(h => h.classList.remove('no-transition'));
    }
    updateMultiSelectHighlightPositions() {
        const padding = 3;
        this.selectedElements.forEach((element, index) => {
            const highlight = this.multiSelectHighlights[index];
            if (!highlight)
                return;
            const rect = element.getBoundingClientRect();
            highlight.style.left = `${rect.left - padding}px`;
            highlight.style.top = `${rect.top - padding}px`;
            highlight.style.width = `${rect.width + padding * 2}px`;
            highlight.style.height = `${rect.height + padding * 2}px`;
        });
    }
    handlePanelDragStart(e) {
        // Don't drag if clicking on buttons
        if (e.target.closest('button'))
            return;
        this.isDragging = true;
        const panelRect = this.panel.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - panelRect.left,
            y: e.clientY - panelRect.top,
        };
        document.addEventListener('mousemove', this.handlePanelDrag);
        document.addEventListener('mouseup', this.handlePanelDragEnd);
    }
    showHighlight(element) {
        if (!this.highlight)
            return;
        const rect = element.getBoundingClientRect();
        const padding = 3;
        this.highlight.style.display = 'block';
        this.highlight.style.left = `${rect.left - padding}px`;
        this.highlight.style.top = `${rect.top - padding}px`;
        this.highlight.style.width = `${rect.width + padding * 2}px`;
        this.highlight.style.height = `${rect.height + padding * 2}px`;
    }
    hideHighlight() {
        if (this.highlight) {
            this.highlight.style.display = 'none';
        }
        this.currentElement = null;
    }
    freeze() {
        if (!this.currentElement)
            return;
        this.frozen = true;
        this.currentSnapshot = captureSnapshot(this.currentElement);
        // Initialize selectedElements with the first element
        this.selectedElements = [this.currentElement];
        this.selectedSnapshots = [this.currentSnapshot];
        this.mode = 'input';
        this.activityEvents = [];
        this.currentStatus = 'idle';
        this.updateCursor();
        this.renderPanel();
    }
    enterMultiSelectMode() {
        if (!this.frozen || this.multiSelectMode)
            return;
        this.multiSelectMode = true;
        // Render highlight for the first selected element
        this.renderMultiSelectHighlights();
        this.updateCursor();
        this.renderPanel();
    }
    toggleInSelection(element) {
        if (!this.multiSelectMode)
            return;
        // Check if element is already selected (by reference)
        const existingIndex = this.selectedElements.indexOf(element);
        if (existingIndex >= 0) {
            // Remove from selection
            this.removeFromSelection(existingIndex);
        }
        else {
            // Add to selection (if under limit)
            if (this.selectedElements.length >= EyeglassInspector.MAX_SELECTION) {
                // Could show a toast/warning, for now just ignore
                return;
            }
            const snapshot = captureSnapshot(element);
            this.selectedElements.push(element);
            this.selectedSnapshots.push(snapshot);
        }
        this.renderMultiSelectHighlights();
        this.renderPanel();
    }
    removeFromSelection(index) {
        if (index < 0 || index >= this.selectedElements.length)
            return;
        // Don't allow removing the last element
        if (this.selectedElements.length === 1) {
            this.exitMultiSelectMode();
            return;
        }
        this.selectedElements.splice(index, 1);
        this.selectedSnapshots.splice(index, 1);
        this.renderMultiSelectHighlights();
        this.renderPanel();
    }
    exitMultiSelectMode() {
        this.multiSelectMode = false;
        // Keep the first selected element as the current single selection
        if (this.selectedElements.length > 0) {
            this.currentElement = this.selectedElements[0];
            this.currentSnapshot = this.selectedSnapshots[0];
        }
        this.selectedElements = this.currentElement ? [this.currentElement] : [];
        this.selectedSnapshots = this.currentSnapshot ? [this.currentSnapshot] : [];
        // Clear multi-select highlights
        this.clearMultiSelectHighlights();
        // Show single highlight for current element
        if (this.currentElement) {
            this.showHighlight(this.currentElement);
        }
        this.updateCursor();
        this.renderPanel();
    }
    renderMultiSelectHighlights() {
        // Clear existing multi-select highlights
        this.clearMultiSelectHighlights();
        const padding = 3;
        this.selectedElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const highlight = document.createElement('div');
            highlight.className = 'highlight multi';
            highlight.style.display = 'block';
            highlight.style.left = `${rect.left - padding}px`;
            highlight.style.top = `${rect.top - padding}px`;
            highlight.style.width = `${rect.width + padding * 2}px`;
            highlight.style.height = `${rect.height + padding * 2}px`;
            // Add numbered badge
            const badge = document.createElement('div');
            badge.className = 'highlight-badge';
            badge.textContent = String(index + 1);
            highlight.appendChild(badge);
            this.shadow.appendChild(highlight);
            this.multiSelectHighlights.push(highlight);
        });
        // Hide the main single highlight when in multi-select mode
        if (this.highlight) {
            this.highlight.style.display = 'none';
        }
    }
    clearMultiSelectHighlights() {
        this.multiSelectHighlights.forEach((h) => h.remove());
        this.multiSelectHighlights = [];
    }
    unfreeze() {
        this.frozen = false;
        this.currentSnapshot = null;
        this.interactionId = null;
        this.mode = 'input';
        this.activityEvents = [];
        this.customPanelPosition = null;
        // Clear multi-select state
        this.multiSelectMode = false;
        this.selectedElements = [];
        this.selectedSnapshots = [];
        this.submittedSnapshots = [];
        this.clearMultiSelectHighlights();
        // Stop phrase rotation
        this.stopPhraseRotation();
        this.hidePanel();
        this.hideHighlight();
        this.updateCursor();
        // Clear persisted session
        try {
            sessionStorage.removeItem(STORAGE_KEY);
        }
        catch (e) {
            // Ignore
        }
    }
    renderPanel() {
        if (!this.currentSnapshot || !this.currentElement)
            return;
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
        }
        else {
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
            if (left < 20)
                left = 20;
            this.panel.style.left = `${left}px`;
            this.panel.style.top = `${top}px`;
        }
        const componentName = framework.componentName || this.currentSnapshot.tagName;
        const filePath = framework.filePath
            ? framework.filePath.split('/').slice(-2).join('/')
            : null;
        if (this.mode === 'input') {
            this.renderInputMode(componentName, filePath);
        }
        else {
            this.renderActivityMode(componentName, filePath);
        }
    }
    renderInputMode(componentName, filePath) {
        if (!this.panel)
            return;
        const isMultiSelect = this.multiSelectMode;
        const multiSelectIconClass = isMultiSelect ? 'multi-select-icon active' : 'multi-select-icon';
        // Build selected list HTML for multi-select mode
        const selectedListHtml = isMultiSelect ? `
      <div class="selected-list">
        <div class="selected-list-header">
          <span class="selected-count">${this.selectedElements.length} element${this.selectedElements.length !== 1 ? 's' : ''} selected</span>
        </div>
        <div class="selected-chips">
          ${this.selectedSnapshots.map((snapshot, index) => {
            const name = snapshot.framework.componentName || snapshot.tagName;
            return `
              <div class="selected-chip" data-index="${index}">
                <span class="selected-chip-number">${index + 1}</span>
                <span>${this.escapeHtml(name)}</span>
                <button class="selected-chip-remove" data-index="${index}" title="Remove">&times;</button>
              </div>
            `;
        }).join('')}
        </div>
      </div>
    ` : '';
        const multiModeHint = isMultiSelect ? `
      <div class="multi-mode-hint">Click elements to add/remove from selection (max ${EyeglassInspector.MAX_SELECTION})</div>
    ` : '';
        this.panel.innerHTML = `
      <div class="panel-header">
        <span class="component-tag">&lt;${this.escapeHtml(componentName)} /&gt;</span>
        ${filePath ? `<span class="file-path">${this.escapeHtml(filePath)}</span>` : ''}
        <button class="${multiSelectIconClass}" title="${isMultiSelect ? 'Exit multi-select' : 'Select multiple elements'}">+</button>
        <button class="close-btn" title="Cancel (Esc)">&times;</button>
      </div>
      ${multiModeHint}
      ${selectedListHtml}
      <div class="input-area">
        <input
          type="text"
          class="input-field"
          placeholder="${isMultiSelect ? 'Describe what to change for these elements...' : 'What do you want to change?'}"
          autofocus
        />
        <div class="btn-row">
          <button class="btn btn-secondary">Cancel</button>
          <button class="btn btn-primary">Send</button>
        </div>
      </div>
    `;
        const input = this.panel.querySelector('.input-field');
        const closeBtn = this.panel.querySelector('.close-btn');
        const cancelBtn = this.panel.querySelector('.btn-secondary');
        const sendBtn = this.panel.querySelector('.btn-primary');
        const multiSelectBtn = this.panel.querySelector('.multi-select-icon');
        closeBtn.addEventListener('click', () => this.unfreeze());
        cancelBtn.addEventListener('click', () => this.unfreeze());
        sendBtn.addEventListener('click', () => this.submit(input.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                this.submit(input.value);
            }
        });
        // Multi-select toggle button
        multiSelectBtn.addEventListener('click', () => {
            if (this.multiSelectMode) {
                this.exitMultiSelectMode();
            }
            else {
                this.enterMultiSelectMode();
            }
        });
        // Wire up chip remove buttons
        this.panel.querySelectorAll('.selected-chip-remove').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(e.currentTarget.dataset.index, 10);
                this.removeFromSelection(index);
            });
        });
        // Make panel draggable via header
        const header = this.panel.querySelector('.panel-header');
        header.addEventListener('mousedown', this.handlePanelDragStart);
        requestAnimationFrame(() => input.focus());
    }
    renderActivityMode(componentName, filePath) {
        if (!this.panel)
            return;
        const userNote = this.activityEvents.length > 0
            ? (this.panel.querySelector('.user-request-text')?.textContent || '')
            : '';
        const isDone = this.currentStatus === 'success' || this.currentStatus === 'failed';
        const showActionButtons = this.currentStatus === 'success' && !this.autoCommitEnabled;
        const showFollowUp = this.currentStatus === 'success';
        // Build header display based on submitted snapshots
        const snapshotCount = this.submittedSnapshots.length;
        const headerDisplay = snapshotCount > 1
            ? `${snapshotCount} elements`
            : `&lt;${this.escapeHtml(componentName)} /&gt;`;
        this.panel.innerHTML = `
      <div class="panel-header">
        <span class="component-tag">${headerDisplay}</span>
        ${snapshotCount <= 1 && filePath ? `<span class="file-path">${this.escapeHtml(filePath)}</span>` : ''}
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
        ${showActionButtons ? `
          <div class="success-actions">
            <button class="action-btn action-btn-undo" title="Discard changes">Undo</button>
            <button class="action-btn action-btn-commit" title="Commit changes">Commit</button>
          </div>
        ` : ''}
      </div>
      ${showFollowUp ? `
        <div class="followup-area">
          <div class="followup-row">
            <input type="text" class="followup-input" placeholder="Anything else?" />
            <button class="followup-send">Send</button>
            <button class="followup-done">Done</button>
          </div>
        </div>
      ` : ''}
    `;
        const closeBtn = this.panel.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.unfreeze());
        // Make panel draggable via header
        const header = this.panel.querySelector('.panel-header');
        header.addEventListener('mousedown', this.handlePanelDragStart);
        // Wire up question buttons if present
        this.panel.querySelectorAll('.question-option').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const target = e.target;
                const questionId = target.dataset.questionId;
                const answerId = target.dataset.answerId;
                const answerLabel = target.textContent;
                this.submitAnswer(questionId, answerId, answerLabel);
            });
        });
        // Wire up action buttons (commit/undo) if present
        const commitBtn = this.panel.querySelector('.action-btn-commit');
        const undoBtn = this.panel.querySelector('.action-btn-undo');
        if (commitBtn && this.interactionId) {
            commitBtn.addEventListener('click', () => this.requestCommit(this.interactionId));
        }
        if (undoBtn && this.interactionId) {
            undoBtn.addEventListener('click', () => this.requestUndo(this.interactionId));
        }
        // Wire up follow-up input if present
        const followupInput = this.panel.querySelector('.followup-input');
        const followupSend = this.panel.querySelector('.followup-send');
        const followupDone = this.panel.querySelector('.followup-done');
        if (followupInput && followupSend) {
            followupSend.addEventListener('click', () => {
                if (followupInput.value.trim()) {
                    this.submitFollowUp(followupInput.value);
                }
            });
            followupInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && followupInput.value.trim()) {
                    this.submitFollowUp(followupInput.value);
                }
            });
            // Focus the follow-up input
            requestAnimationFrame(() => followupInput.focus());
        }
        if (followupDone) {
            followupDone.addEventListener('click', () => this.unfreeze());
        }
        // Scroll to bottom of activity feed
        const feed = this.panel.querySelector('.activity-feed');
        if (feed) {
            feed.scrollTop = feed.scrollHeight;
        }
    }
    renderActivityFeed() {
        const items = this.activityEvents.map((event) => {
            switch (event.type) {
                case 'status':
                    // Skip pending - shown in footer. Show fixing only if it has a meaningful message
                    if (event.status === 'pending')
                        return '';
                    if (event.status === 'fixing') {
                        // Skip generic/missing messages - we have rotating phrases in the footer
                        if (!event.message || event.message === 'Agent is working...')
                            return '';
                    }
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
        }).filter(Boolean);
        // Show skeleton while waiting for first meaningful activity
        if (items.length === 0 && (this.currentStatus === 'pending' || this.currentStatus === 'fixing')) {
            return `
        <div class="skeleton-item">
          <div class="skeleton-icon"></div>
          <div class="skeleton-line"></div>
        </div>
      `;
        }
        return items.join('');
    }
    renderStatusItem(event) {
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
    renderThoughtItem(event) {
        return `
      <div class="activity-item">
        <div class="activity-icon thought">💭</div>
        <div class="activity-content">
          <div class="activity-text muted">${this.escapeHtml(event.content)}</div>
        </div>
      </div>
    `;
    }
    renderActionItem(event) {
        const icons = {
            reading: '📖',
            writing: '✏️',
            searching: '🔍',
            thinking: '🧠',
        };
        const verbs = {
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
    renderQuestionItem(event) {
        // Check if this question was already answered
        const wasAnswered = this.activityEvents.some((e) => e.type === 'status' && e.timestamp > event.timestamp);
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
    getUserNote() {
        // Find the original focus payload from the first status event or stored value
        const active = this.activityEvents.find((e) => e.type === 'status');
        // We need to store this separately
        return this._userNote || '';
    }
    getStatusText() {
        switch (this.currentStatus) {
            case 'idle': return 'Ready';
            case 'pending': return 'Waiting for agent...';
            case 'fixing': return WORKING_PHRASES[this.phraseIndex % WORKING_PHRASES.length];
            case 'success': return 'Done!';
            case 'failed': return 'Failed';
            default: return this.currentStatus;
        }
    }
    startPhraseRotation() {
        if (this.phraseInterval)
            return;
        this.phraseIndex = Math.floor(Math.random() * WORKING_PHRASES.length);
        this.phraseInterval = window.setInterval(() => {
            this.phraseIndex = (this.phraseIndex + 1) % WORKING_PHRASES.length;
            this.updateFooterText();
        }, 10000);
    }
    stopPhraseRotation() {
        if (this.phraseInterval) {
            window.clearInterval(this.phraseInterval);
            this.phraseInterval = null;
        }
    }
    updateFooterText() {
        if (!this.panel)
            return;
        const statusText = this.panel.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = this.getStatusText();
        }
    }
    hidePanel() {
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
    }
    async submit(userNote) {
        if (!userNote.trim())
            return;
        if (this.selectedSnapshots.length === 0 && !this.currentSnapshot)
            return;
        this.interactionId = `eyeglass-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        this._userNote = userNote.trim();
        // Build payload - use snapshots array if multiple, otherwise single snapshot for backwards compat
        const snapshots = this.selectedSnapshots.length > 0 ? this.selectedSnapshots : (this.currentSnapshot ? [this.currentSnapshot] : []);
        // Store for activity mode display
        this.submittedSnapshots = [...snapshots];
        const payload = {
            interactionId: this.interactionId,
            userNote: userNote.trim(),
            autoCommit: this.autoCommitEnabled,
            ...(snapshots.length === 1
                ? { snapshot: snapshots[0] }
                : { snapshots }),
        };
        // Build component name for history (combine if multiple)
        const componentNames = snapshots.map(s => s.framework.componentName || s.tagName);
        const historyComponentName = snapshots.length === 1
            ? componentNames[0]
            : `${componentNames.length} elements`;
        // Add to history
        this.addToHistory({
            interactionId: this.interactionId,
            userNote: userNote.trim(),
            componentName: historyComponentName,
            filePath: snapshots[0]?.framework.filePath,
            status: 'pending',
            timestamp: Date.now(),
        });
        // Store multi-select state to restore on failure
        const wasMultiSelect = this.multiSelectMode;
        const savedElements = [...this.selectedElements];
        const savedSnapshots = [...this.selectedSnapshots];
        // Clear multi-select highlights before switching to activity mode
        this.clearMultiSelectHighlights();
        this.multiSelectMode = false;
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
        }
        catch (err) {
            this.currentStatus = 'failed';
            this.updateHistoryStatus(this.interactionId, 'failed');
            this.activityEvents.push({
                type: 'status',
                interactionId: this.interactionId,
                status: 'failed',
                message: 'Failed to connect to bridge',
                timestamp: Date.now(),
            });
            // Restore multi-select state on failure so user doesn't lose their selection
            if (wasMultiSelect && savedElements.length > 1) {
                this.multiSelectMode = true;
                this.selectedElements = savedElements;
                this.selectedSnapshots = savedSnapshots;
                this.mode = 'input';
                this.renderMultiSelectHighlights();
            }
            this.renderPanel();
        }
    }
    async submitFollowUp(userNote) {
        if (!userNote.trim())
            return;
        if (this.submittedSnapshots.length === 0)
            return;
        // Create new interaction ID for the follow-up
        this.interactionId = `eyeglass-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        this._userNote = userNote.trim();
        // Reuse the same snapshots from the previous request
        const snapshots = this.submittedSnapshots;
        const payload = {
            interactionId: this.interactionId,
            userNote: userNote.trim(),
            autoCommit: this.autoCommitEnabled,
            ...(snapshots.length === 1
                ? { snapshot: snapshots[0] }
                : { snapshots }),
        };
        // Build component name for history
        const componentNames = snapshots.map(s => s.framework.componentName || s.tagName);
        const historyComponentName = snapshots.length === 1
            ? componentNames[0]
            : `${componentNames.length} elements`;
        // Add to history
        this.addToHistory({
            interactionId: this.interactionId,
            userNote: userNote.trim(),
            componentName: historyComponentName,
            filePath: snapshots[0]?.framework.filePath,
            status: 'pending',
            timestamp: Date.now(),
        });
        // Reset activity state for new request
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
        }
        catch (err) {
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
    async submitAnswer(questionId, answerId, answerLabel) {
        if (!this.interactionId)
            return;
        const answer = {
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
        }
        catch (err) {
            // Silently fail
        }
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    updateCursor() {
        // Show eye cursor when: enabled AND (not frozen OR in multi-select mode)
        const showEyeCursor = this.inspectorEnabled && (!this.frozen || this.multiSelectMode);
        if (showEyeCursor) {
            // Add eye cursor to document
            if (!this.cursorStyleElement) {
                this.cursorStyleElement = document.createElement('style');
                this.cursorStyleElement.id = 'eyeglass-cursor-style';
                document.head.appendChild(this.cursorStyleElement);
            }
            this.cursorStyleElement.textContent = `
        html, body, body * {
          cursor: ${EYE_CURSOR} !important;
        }
      `;
        }
        else {
            // Remove custom cursor
            if (this.cursorStyleElement) {
                this.cursorStyleElement.textContent = '';
            }
        }
    }
}
EyeglassInspector.MAX_SELECTION = 5;
if (!customElements.get('eyeglass-inspector')) {
    customElements.define('eyeglass-inspector', EyeglassInspector);
}
