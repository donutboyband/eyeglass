/**
 * Lens Card Renderer for Eyeglass v2.0
 * Sharp, minimal, editorial design - no rounded corners, clean lines
 */

import type { ActivityEvent, InteractionStatus, SemanticSnapshot } from '@eyeglass/types';
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
          <button class="issue-add-btn" data-action="issue-insert" data-issue="${escapeHtml(issue.message)}" title="Add to prompt">↵</button>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSystemicImpact(snapshot: SemanticSnapshot): string {
  const impact = snapshot.systemic?.impact;
  if (!impact || impact.importCount === undefined) return '';

  const countLabel = impact.importCount === 1 ? 'import' : 'imports';
  const risk = impact.riskLevel || 'Local';
  return `
    <div class="lens-systemic">
      <div class="lens-systemic-label">Impact</div>
      <div class="lens-systemic-row">
        <span class="lens-systemic-count">${impact.importCount} ${countLabel}</span>
        <span class="lens-risk-badge ${risk.toLowerCase()}">${risk}</span>
      </div>
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
  const systemicImpact = renderSystemicImpact(currentSnapshot);

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
    ${systemicImpact}
    <div class="lens-input-row">
      <textarea
        class="lens-input"
        placeholder="Ask Eyeglass..."
        data-action="input"
        rows="2"
      >${escapeHtml(state._userNote || '')}</textarea>
      <button class="lens-enter-btn" data-action="submit-note" aria-label="Send request" title="Send">↵</button>
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
  const { currentStatus, currentStatusMessage, activityEvents, _userNote, autoCommitEnabled } = state;
  const requiresManualCommit = currentStatus === 'success' && !autoCommitEnabled;
  const lastThought = [...activityEvents].reverse().find(e => e.type === 'thought');
  const lastAction = [...activityEvents].reverse().find(e => e.type === 'action');
  const activityFeed = renderLensActivityFeed(activityEvents, currentStatus);

  let message = 'Working...';
  if (lastThought) {
    message = (lastThought as any).content;
  } else if (lastAction) {
    const action = lastAction as any;
    message = `${action.action}: ${action.target}${action.complete ? ' ✓' : '...'}`;
  } else if (currentStatusMessage) {
    message = currentStatusMessage;
  } else if (currentStatus === 'pending') {
    message = 'Waiting for agent...';
  } else if (currentStatus === 'success') {
    message = 'Done';
  } else if (currentStatus === 'failed') {
    message = 'Failed';
  }

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
      ${_userNote ? `<div class="lens-user-note" title="Original request">${escapeHtml(_userNote)}</div>` : ''}
      ${activityFeed}
      ${requiresManualCommit ? `
        <div class="lens-actions">
          <div class="lens-actions-text">Auto-commit is off. Apply these changes?</div>
          <div class="lens-actions-row">
            <button class="lens-btn" data-action="lens-undo">Undo</button>
            <button class="lens-btn primary" data-action="lens-commit">Commit</button>
          </div>
        </div>
      ` : ''}
      ${currentStatus === 'success' || currentStatus === 'failed' ? `
        <div class="lens-followup">
          <textarea class="lens-followup-input" rows="2" placeholder="Send a follow-up..."></textarea>
          <button class="lens-followup-send" data-action="send-followup" aria-label="Send follow-up" title="Send follow-up">\u21B5</button>
        </div>
      ` : ''}
    </div>
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
      <textarea
        class="lens-input"
        placeholder="What should change?"
        data-action="input"
        rows="2"
      >${escapeHtml(_userNote || '')}</textarea>
      <button class="lens-enter-btn" data-action="submit-note" aria-label="Send request" title="Send">↵</button>
    </div>
  `;
}

function renderLensActivityFeed(events: ActivityEvent[], status: InteractionStatus): string {
  if (events.length === 0) return '';
  const items = events
    .map((event) => renderLensActivityItem(event))
    .filter((html): html is string => Boolean(html))
    .join('');

  if (!items) {
    if (status === 'pending' || status === 'fixing') {
      return `
        <div class="lens-feed">
          <div class="lens-feed-skeleton">
            <div class="lens-feed-dot skeleton"></div>
            <div class="lens-feed-skeleton-line"></div>
          </div>
        </div>
      `;
    }
    return '';
  }

  return `<div class="lens-feed">${items}</div>`;
}

function renderLensActivityItem(event: ActivityEvent): string | null {
  switch (event.type) {
    case 'status':
      return renderLensStatusItem(event);
    case 'thought':
      return `
        <div class="lens-feed-item">
          <div class="lens-feed-dot thought"></div>
          <div class="lens-feed-body lens-feed-subtle">${escapeHtml(event.content)}</div>
        </div>
      `;
    case 'action':
      return `
        <div class="lens-feed-item">
          <div class="lens-feed-dot action"></div>
          <div class="lens-feed-body">
            <div class="lens-feed-title">${escapeHtml(event.action)}${event.complete ? ' ✓' : ' ...'}</div>
            <div class="lens-feed-subtle">${escapeHtml(event.target)}</div>
          </div>
        </div>
      `;
    case 'question':
      return renderLensQuestionItem(event);
    default:
      return null;
  }
}

function renderLensStatusItem(event: Extract<ActivityEvent, { type: 'status' }>): string | null {
  if (event.status === 'pending') return null;
  if (event.status === 'fixing' && (!event.message || event.message === 'Agent is working...')) {
    return null;
  }

  return `
    <div class="lens-feed-item">
      <div class="lens-feed-dot status ${event.status}" title="${event.status}"></div>
      <div class="lens-feed-body">${escapeHtml(event.message || event.status)}</div>
    </div>
  `;
}

function renderLensQuestionItem(event: Extract<ActivityEvent, { type: 'question' }>): string {
  const answered = Boolean((event as any).selectedAnswerId);
  const answerLabel =
    (event as any).selectedAnswerLabel ||
    event.options.find((opt) => opt.id === (event as any).selectedAnswerId)?.label ||
    '';

  if (answered) {
    return `
      <div class="lens-feed-item question answered">
        <div class="lens-feed-dot question"></div>
        <div class="lens-feed-body">
          <div class="lens-feed-question">${escapeHtml(event.question)}</div>
          <div class="lens-feed-answer">${escapeHtml(answerLabel)}</div>
        </div>
      </div>
    `;
  }

  return `
    <div class="lens-feed-item question">
      <div class="lens-feed-dot question"></div>
      <div class="lens-feed-body">
        <div class="lens-feed-question">${escapeHtml(event.question)}</div>
        <div class="lens-feed-options">
          ${event.options
            .map(
              (opt) => `
            <button
              class="lens-feed-option"
              data-action="answer"
              data-question-id="${event.questionId}"
              data-answer-id="${opt.id}"
              data-answer-label="${escapeHtml(opt.label)}"
            >${escapeHtml(opt.label)}</button>
          `
            )
            .join('')}
        </div>
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
  z-index: 2147483645;
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

.lens-actions {
  margin-top: 10px;
  padding: 8px 10px;
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lens-actions-text {
  font-size: 11px;
  color: var(--text-secondary);
}

.lens-actions-row {
  display: flex;
  gap: 6px;
}

.lens-btn {
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.05);
  color: var(--text-primary);
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
}

.lens-btn.primary {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
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

.issue-add-btn {
  margin-left: auto;
  border: 1px solid var(--glass-border);
  background: transparent;
  color: var(--text-muted);
  font-size: 9px;
  padding: 2px 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border-radius: 2px;
}

.issue-add-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
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

.lens-systemic {
  padding: 6px 10px;
  border-bottom: 1px solid var(--divider);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lens-systemic-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.lens-systemic-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lens-systemic-count {
  font-size: 11px;
  color: var(--text-primary);
}

.lens-risk-badge {
  padding: 2px 6px;
  font-size: 10px;
  border: 1px solid var(--glass-border);
  text-transform: uppercase;
}

.lens-risk-badge.local {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.4);
}

.lens-risk-badge.moderate {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.4);
}

.lens-risk-badge.critical {
  color: var(--error);
  border-color: rgba(239, 68, 68, 0.4);
}

/* Input */
.lens-input-row {
  padding: 8px 10px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
}

.lens-input {
  flex: 1;
  padding: 8px 10px;
  background: rgba(0,0,0,0.06);
  border: 1px solid var(--glass-border);
  font-size: 11px;
  font-family: inherit;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.1s, background 0.1s;
  min-height: 48px;
  resize: vertical;
  line-height: 1.4;
}

.lens-input:focus {
  border-color: var(--accent);
  background: rgba(0,0,0,0.08);
}

.lens-input::placeholder {
  color: var(--text-muted);
}

.lens-enter-btn {
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.06);
  color: var(--text-muted);
  font-size: 11px;
  padding: 6px 8px;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.1s, color 0.1s, background 0.1s, opacity 0.1s;
}

.lens-enter-btn:hover {
  border-color: var(--accent);
  color: var(--text-primary);
  opacity: 0.9;
}

.lens-enter-btn:active {
  background: var(--accent-muted);
  color: var(--text-primary);
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

.lens-user-note {
  margin-top: 6px;
  padding: 6px 8px;
  border: 1px solid var(--glass-border);
  border-radius: 3px;
  font-size: 10px;
  color: var(--text-primary);
  background: rgba(0,0,0,0.05);
  line-height: 1.4;
  word-break: break-word;
}

.lens-followup {
  margin-top: 8px;
  display: flex;
  gap: 6px;
}

.lens-followup-input {
  flex: 1;
  min-height: 48px;
  resize: vertical;
  padding: 6px 8px;
  border: 1px solid var(--glass-border);
  border-radius: 3px;
  font-size: 10px;
  font-family: inherit;
  color: var(--text-primary);
  background: rgba(0,0,0,0.06);
}

.lens-followup-send {
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.06);
  color: var(--text-muted);
  padding: 5px 7px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 2px;
  cursor: pointer;
  height: 100%;
  align-self: flex-start;
  transition: border-color 0.1s, color 0.1s, background 0.1s;
}

.lens-followup-send:hover {
  border-color: var(--accent);
  color: var(--text-primary);
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

/* Activity Feed */
.lens-feed {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--divider);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lens-feed-empty {
  font-size: 10px;
  color: var(--text-muted);
  text-align: center;
}

.lens-feed-item {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 10px;
  line-height: 1.4;
}

.lens-feed-dot {
  width: 6px;
  height: 6px;
  background: var(--text-muted);
  flex-shrink: 0;
}

.lens-feed-dot.skeleton {
  animation: lensPulse 1.2s ease-in-out infinite;
}

.lens-feed-dot.status.pending,
.lens-feed-dot.status.fixing {
  background: #3b82f6;
}

.lens-feed-dot.status.success {
  background: var(--success);
}

.lens-feed-dot.status.failed {
  background: var(--error);
}

.lens-feed-dot.thought {
  background: #60a5fa;
}

.lens-feed-dot.action {
  background: #f97316;
}

.lens-feed-dot.question {
  background: var(--accent);
}

.lens-feed-skeleton {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lens-feed-skeleton-line {
  flex: 1;
  height: 8px;
  border-radius: 2px;
  background: rgba(255,255,255,0.08);
  animation: lensPulse 1.2s ease-in-out infinite;
}

@keyframes lensPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.lens-feed-body {
  flex: 1;
  color: var(--text-primary);
}

.lens-feed-title {
  font-weight: 600;
  color: var(--text-primary);
}

.lens-feed-subtle {
  font-size: 9px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.lens-feed-question {
  font-weight: 600;
  color: var(--text-primary);
}

.lens-feed-answer {
  margin-top: 4px;
  color: var(--accent);
  font-weight: 600;
}

.lens-feed-options {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lens-feed-option {
  padding: 5px 8px;
  background: transparent;
  border: 1px solid var(--glass-border);
  font-size: 10px;
  font-family: inherit;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all 0.1s;
}

.lens-feed-option:hover {
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
  color: var(--text-primary);
  background: rgba(0,0,0,0.04);
}

.lens-schema[data-expanded="true"] .lens-schema-code {
  max-height: 160px;
  padding: 8px 10px;
  overflow-y: auto;
}

/* JSON syntax highlighting */
.lens-schema-code .json-key { color: var(--accent); }
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
