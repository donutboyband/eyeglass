/**
 * Lens Card Renderer for Eyeglass v2.0
 * Sharp, minimal, editorial design - no rounded corners, clean lines
 */

import type { SemanticSnapshot } from '@eyeglass/types';
import { analyzeHealth, calculatePulseLevel, getPulseColor, HealthIssue } from '../utils/health.js';
import type { InspectorState, InspectorCallbacks } from '../types.js';

function getDisplayName(snapshot: SemanticSnapshot): string {
  const fw = snapshot.framework;
  return fw.displayName || fw.componentName || snapshot.tagName;
}

function getFilePath(snapshot: SemanticSnapshot): string | null {
  const fw = snapshot.framework;
  if (!fw.filePath) return null;
  const parts = fw.filePath.split('/');
  const shortPath = parts.slice(-2).join('/');
  return fw.lineNumber ? `${shortPath}:${fw.lineNumber}` : shortPath;
}

function renderHealthIssues(issues: HealthIssue[]): string {
  if (issues.length === 0) return '';
  return `
    <div class="lens-issues">
      ${issues.map(issue => `
        <div class="lens-issue ${issue.level}">
          <span class="issue-dot"></span>
          <span class="issue-text">${escapeHtml(issue.message)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

export function renderLensCard(
  state: InspectorState,
  callbacks: InspectorCallbacks
): string {
  const { currentSnapshot, mode, multiSelectMode, selectedSnapshots } = state;

  if (multiSelectMode && selectedSnapshots.length > 0) {
    return renderMultiSelectLens(state);
  }

  if (!currentSnapshot) {
    return '<div class="lens-empty">No element selected</div>';
  }

  const displayName = getDisplayName(currentSnapshot);
  const filePath = getFilePath(currentSnapshot);
  const pulseLevel = calculatePulseLevel(currentSnapshot);
  const pulseColor = getPulseColor(pulseLevel);
  const issues = analyzeHealth(currentSnapshot);

  if (mode === 'activity') {
    return renderActivityLens(state, displayName, filePath);
  }

  return `
    <div class="lens-bar">
      <span class="lens-tag">&lt;${escapeHtml(displayName)} /&gt;</span>
      ${pulseLevel !== 'healthy' ? `<span class="lens-dot" style="background:${pulseColor}"></span>` : ''}
      <div class="lens-tools">
        <button class="lens-tool" data-action="toggle-context" title="Context"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="lens-tool" data-action="multi-select" title="Multi-select"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></button>
        <button class="lens-tool lens-close" data-action="close" title="Close"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${filePath ? `<div class="lens-path">${escapeHtml(filePath)}</div>` : ''}
    ${renderHealthIssues(issues)}
    <div class="lens-input-row">
      <input
        type="text"
        class="lens-input"
        placeholder="Ask Eyeglass..."
        value="${escapeHtml(state._userNote || '')}"
        data-action="input"
      />
      <kbd class="lens-enter-hint">↵</kbd>
    </div>
    <div class="lens-schema" data-expanded="false">
      <button class="lens-schema-toggle" data-action="toggle-schema">
        <span>Schema</span>
        <svg class="lens-schema-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <pre class="lens-schema-code"></pre>
    </div>
  `;
}

function renderActivityLens(state: InspectorState, displayName: string, filePath: string | null): string {
  const { currentStatus, activityEvents } = state;
  const lastThought = [...activityEvents].reverse().find(e => e.type === 'thought');
  const lastAction = [...activityEvents].reverse().find(e => e.type === 'action');
  const lastQuestion = [...activityEvents].reverse().find(e => e.type === 'question' && (e as any).questionId);

  let message = 'Working...';
  if (currentStatus === 'pending') message = 'Waiting for agent...';
  else if (currentStatus === 'success') message = 'Done';
  else if (currentStatus === 'failed') message = 'Failed';
  else if (lastThought) message = (lastThought as any).content;
  else if (lastAction) message = `${(lastAction as any).action}: ${(lastAction as any).target}`;

  return `
    <div class="lens-bar">
      <span class="lens-tag">&lt;${escapeHtml(displayName)} /&gt;</span>
      <span class="lens-status-badge ${currentStatus}">${currentStatus}</span>
      <div class="lens-tools">
        <button class="lens-tool lens-close" data-action="close" title="Close"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${filePath ? `<div class="lens-path">${escapeHtml(filePath)}</div>` : ''}
    <div class="lens-activity">
      ${currentStatus === 'fixing' ? '<div class="lens-progress"><div class="lens-progress-bar"></div></div>' : ''}
      <div class="lens-message">${escapeHtml(message)}</div>
    </div>
    ${lastQuestion ? renderQuestion(lastQuestion as any) : ''}
    ${currentStatus === 'success' || currentStatus === 'failed' ? `
      <div class="lens-footer">
        <button class="lens-btn" data-action="new-request">New Request</button>
      </div>
    ` : ''}
  `;
}

function renderMultiSelectLens(state: InspectorState): string {
  const { selectedSnapshots, _userNote } = state;
  return `
    <div class="lens-bar">
      <span class="lens-tag">${selectedSnapshots.length} selected</span>
      <div class="lens-tools">
        <button class="lens-tool lens-close" data-action="exit-multi" title="Exit"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    <div class="lens-selection">
      ${selectedSnapshots.map((s, i) => `
        <div class="lens-chip">
          <span class="chip-num">${i + 1}</span>
          <span class="chip-name">&lt;${escapeHtml(getDisplayName(s))} /&gt;</span>
          <button class="chip-remove" data-action="remove-selection" data-index="${i}">×</button>
        </div>
      `).join('')}
    </div>
    <div class="lens-input-row">
      <input
        type="text"
        class="lens-input"
        placeholder="What should change?"
        value="${escapeHtml(_userNote || '')}"
        data-action="input"
      />
      <kbd class="lens-enter-hint">↵</kbd>
    </div>
  `;
}

function renderQuestion(q: { questionId: string; question: string; options: Array<{ id: string; label: string }> }): string {
  return `
    <div class="lens-question">
      <div class="lens-q-text">${escapeHtml(q.question)}</div>
      <div class="lens-q-options">
        ${q.options.map(opt => `
          <button class="lens-q-btn" data-action="answer" data-question-id="${q.questionId}" data-answer-id="${opt.id}" data-answer-label="${escapeHtml(opt.label)}">
            ${escapeHtml(opt.label)}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

export function calculateLensPosition(
  elementRect: DOMRect,
  lensRect: { width: number; height: number }
): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 8;

  let x = elementRect.right + gap;
  if (x + lensRect.width > vw - gap) x = elementRect.left - gap - lensRect.width;
  if (x < gap) x = gap;

  let y = elementRect.top;
  if (y + lensRect.height > vh - gap) y = vh - lensRect.height - gap;
  if (y < gap) y = gap;

  return { x: Math.round(x), y: Math.round(y) };
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Lens styles - Sharp edges, minimal editorial design
 */
export const LENS_STYLES = `
.lens-card {
  position: fixed;
  width: 220px;
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  pointer-events: auto;
  overflow: hidden;
  animation: lensEnter 0.12s ease-out;
}

@keyframes lensEnter {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Top bar */
.lens-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--divider);
  cursor: grab;
  user-select: none;
}

.lens-bar:active {
  cursor: grabbing;
}

.lens-tag {
  font-family: 'SF Mono', 'Fira Code', Monaco, monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lens-dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
}

.lens-tools {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.lens-tool {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.1s;
}

.lens-tool:hover {
  color: var(--accent);
}

.lens-tool.lens-close:hover {
  color: var(--error);
}

/* File path */
.lens-path {
  padding: 4px 10px 6px;
  font-family: 'SF Mono', monospace;
  font-size: 9px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--divider);
}

/* Status badge */
.lens-status-badge {
  font-family: 'SF Mono', monospace;
  font-size: 9px;
  font-weight: 500;
  padding: 2px 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lens-status-badge.fixing {
  background: var(--accent-soft);
  color: var(--accent);
}

.lens-status-badge.success {
  background: rgba(16,185,129,0.15);
  color: var(--success);
}

.lens-status-badge.failed {
  background: rgba(239,68,68,0.15);
  color: var(--error);
}

.lens-status-badge.pending {
  background: rgba(245,158,11,0.15);
  color: #f59e0b;
}

/* Issues */
.lens-issues {
  padding: 6px 10px;
  border-bottom: 1px solid var(--divider);
}

.lens-issue {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
}

.issue-dot {
  width: 4px;
  height: 4px;
  flex-shrink: 0;
}

.lens-issue.warning .issue-dot {
  background: #f59e0b;
}

.lens-issue.critical .issue-dot {
  background: var(--error);
}

.issue-text {
  font-size: 10px;
  color: var(--text-secondary);
}

/* Input */
.lens-input-row {
  padding: 8px 10px;
  position: relative;
  display: flex;
  align-items: center;
}

.lens-input {
  flex: 1;
  padding: 8px 10px;
  padding-right: 32px;
  background: rgba(0,0,0,0.06);
  border: 1px solid var(--glass-border);
  font-size: 11px;
  font-family: inherit;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.1s, background 0.1s;
}

.lens-input:focus {
  border-color: var(--accent);
  background: rgba(0,0,0,0.08);
}

.lens-input::placeholder {
  color: var(--text-muted);
}

.lens-enter-hint {
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-family: inherit;
  font-size: 11px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--glass-border);
  opacity: 0.6;
  transition: opacity 0.1s;
  pointer-events: none;
}

.lens-input:focus + .lens-enter-hint {
  opacity: 1;
  color: var(--accent);
  border-color: var(--accent);
}

/* Activity */
.lens-activity {
  padding: 10px;
}

.lens-progress {
  height: 2px;
  background: rgba(0,0,0,0.08);
  margin-bottom: 8px;
  overflow: hidden;
}

.lens-progress-bar {
  height: 100%;
  width: 30%;
  background: var(--accent);
  animation: progressSlide 1s ease-in-out infinite;
}

@keyframes progressSlide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

.lens-message {
  font-size: 10px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Footer */
.lens-footer {
  padding: 8px 10px;
  border-top: 1px solid var(--divider);
}

.lens-btn {
  width: 100%;
  padding: 8px;
  background: var(--accent);
  border: none;
  font-size: 10px;
  font-weight: 600;
  font-family: inherit;
  color: white;
  cursor: pointer;
  transition: filter 0.1s;
}

.lens-btn:hover {
  filter: brightness(1.1);
}

/* Question */
.lens-question {
  padding: 10px;
  border-top: 1px solid var(--divider);
}

.lens-q-text {
  font-size: 10px;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1.4;
}

.lens-q-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lens-q-btn {
  padding: 6px 10px;
  background: transparent;
  border: 1px solid var(--glass-border);
  font-size: 10px;
  font-family: inherit;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all 0.1s;
}

.lens-q-btn:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

/* Selection (multi-select) */
.lens-selection {
  padding: 8px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  border-bottom: 1px solid var(--divider);
}

.lens-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  background: var(--accent-soft);
  font-size: 10px;
}

.chip-num {
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: white;
  font-size: 9px;
  font-weight: 600;
}

.chip-name {
  font-family: 'SF Mono', monospace;
  color: var(--text-primary);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-remove {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}

.chip-remove:hover {
  color: var(--error);
}

/* Schema (expandable) */
.lens-schema {
  border-top: 1px solid var(--divider);
}

.lens-schema-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: transparent;
  border: none;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.1s;
}

.lens-schema-toggle:hover {
  color: var(--text-secondary);
}

.lens-schema-chevron {
  transition: transform 0.15s;
}

.lens-schema[data-expanded="true"] .lens-schema-chevron {
  transform: rotate(180deg);
}

.lens-schema-code {
  margin: 0;
  padding: 0;
  font-family: 'SF Mono', monospace;
  font-size: 9px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.15s ease-out, padding 0.15s ease-out;
}

.lens-schema[data-expanded="true"] .lens-schema-code {
  max-height: 160px;
  padding: 8px 10px;
  overflow-y: auto;
}

/* JSON syntax highlighting */
.lens-schema-code .json-key { color: #7dd3fc; }
.lens-schema-code .json-string { color: #86efac; }
.lens-schema-code .json-number { color: #fcd34d; }
.lens-schema-code .json-bool { color: #f9a8d4; }
.lens-schema-code .json-null { color: var(--text-muted); }
.lens-schema-code .json-bracket { color: var(--text-secondary); }

.lens-empty {
  padding: 20px;
  text-align: center;
  font-size: 10px;
  color: var(--text-muted);
}
`;
