/**
 * Lens Card Renderer for Eyeglass v2.0
 * An expanded card that shows detailed component info after clicking
 */

import type { SemanticSnapshot, PulseLevel } from '@eyeglass/types';
import { analyzeHealth, calculatePulseLevel, getPulseColor, getPulseEmoji, HealthIssue } from '../utils/health.js';
import type { InspectorState, InspectorCallbacks } from '../types.js';

/**
 * Get the display name for the component
 */
function getDisplayName(snapshot: SemanticSnapshot): string {
  const fw = snapshot.framework;
  return fw.displayName || fw.componentName || snapshot.tagName;
}

/**
 * Get the file path for display
 */
function getFilePath(snapshot: SemanticSnapshot): string | null {
  const fw = snapshot.framework;
  if (!fw.filePath) return null;

  // Shorten the path
  const parts = fw.filePath.split('/');
  const shortPath = parts.slice(-2).join('/');
  return fw.lineNumber ? `${shortPath}:${fw.lineNumber}` : shortPath;
}

/**
 * Render health issue cards
 */
function renderHealthCards(issues: HealthIssue[]): string {
  if (issues.length === 0) return '';

  return `
    <div class="lens-health">
      ${issues.map(issue => `
        <div class="health-card ${issue.level}">
          <span class="health-icon">${issue.level === 'critical' ? '🛑' : '⚠️'}</span>
          <div class="health-content">
            <div class="health-message">${escapeHtml(issue.message)}</div>
            ${issue.details ? `<div class="health-details">${escapeHtml(issue.details)}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render the Lens Card content
 */
export function renderLensCard(
  state: InspectorState,
  callbacks: InspectorCallbacks
): string {
  const { currentSnapshot, currentStatus, mode, activityEvents, multiSelectMode, selectedSnapshots } = state;

  if (multiSelectMode && selectedSnapshots.length > 0) {
    return renderMultiSelectLens(state, callbacks);
  }

  if (!currentSnapshot) {
    return '<div class="lens-empty">No element selected</div>';
  }

  const displayName = getDisplayName(currentSnapshot);
  const filePath = getFilePath(currentSnapshot);
  const pulseLevel = calculatePulseLevel(currentSnapshot);
  const pulseColor = getPulseColor(pulseLevel);
  const issues = analyzeHealth(currentSnapshot);

  // Check if we're in activity mode
  if (mode === 'activity') {
    return renderActivityLens(state, callbacks, displayName, filePath);
  }

  // Return content only - the container is created by the inspector
  return `
    <div class="lens-header">
      <div class="lens-title">
        <span class="lens-component">${escapeHtml(`<${displayName} />`)}</span>
        ${pulseLevel !== 'healthy' ? `<span class="lens-pulse" style="background: ${pulseColor};"></span>` : ''}
      </div>
      ${filePath ? `<div class="lens-path">${escapeHtml(filePath)}</div>` : ''}
      <button class="lens-close" data-action="close" aria-label="Close">&times;</button>
    </div>

    ${renderHealthCards(issues)}

    <div class="lens-input-area">
      <input
        type="text"
        class="lens-input"
        placeholder="Ask Eyeglass..."
        value="${escapeHtml(state._userNote || '')}"
        data-action="input"
      />
      <button class="lens-submit" data-action="submit">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </div>

    <div class="lens-actions">
      <button class="lens-action" data-action="multi-select" title="Select multiple elements">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      </button>
      <button class="lens-action" data-action="toggle-context" title="Show relationships">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
      </button>
      <button class="lens-action" data-action="peek-schema" title="View raw schema">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
        </svg>
      </button>
    </div>
  `;
}

/**
 * Render the Lens Card in activity mode
 */
function renderActivityLens(
  state: InspectorState,
  callbacks: InspectorCallbacks,
  displayName: string,
  filePath: string | null
): string {
  const { currentStatus, activityEvents, interactionId } = state;

  const lastThought = [...activityEvents]
    .reverse()
    .find(e => e.type === 'thought');

  const lastAction = [...activityEvents]
    .reverse()
    .find(e => e.type === 'action');

  const lastQuestion = [...activityEvents]
    .reverse()
    .find(e => e.type === 'question' && (e as any).questionId);

  const statusMessage = getStatusMessage(currentStatus, lastThought, lastAction);

  // Return content only - the container is created by the inspector
  return `
    <div class="lens-header">
      <div class="lens-title">
        <span class="lens-component">${escapeHtml(`<${displayName} />`)}</span>
        <span class="lens-status ${currentStatus}">${escapeHtml(currentStatus)}</span>
      </div>
      ${filePath ? `<div class="lens-path">${escapeHtml(filePath)}</div>` : ''}
      <button class="lens-close" data-action="close" aria-label="Close">&times;</button>
    </div>

    <div class="lens-activity">
      <div class="activity-message">${escapeHtml(statusMessage)}</div>
      ${currentStatus === 'fixing' ? '<div class="activity-spinner"></div>' : ''}
    </div>

    ${lastQuestion ? renderQuestion(lastQuestion as any) : ''}

    ${currentStatus === 'success' || currentStatus === 'failed' ? `
      <div class="lens-done">
        <button class="lens-action-btn" data-action="new-request">New Request</button>
      </div>
    ` : ''}
  `;
}

/**
 * Render multi-select lens
 */
function renderMultiSelectLens(
  state: InspectorState,
  callbacks: InspectorCallbacks
): string {
  const { selectedSnapshots, _userNote } = state;

  // Return content only - the container is created by the inspector
  return `
    <div class="lens-header">
      <div class="lens-title">
        <span class="lens-component">${selectedSnapshots.length} elements selected</span>
      </div>
      <button class="lens-close" data-action="exit-multi" aria-label="Exit multi-select">&times;</button>
    </div>

    <div class="lens-selected-list">
      ${selectedSnapshots.map((s, i) => `
        <div class="selected-item">
          <span class="selected-name">${escapeHtml(getDisplayName(s))}</span>
          <button class="selected-remove" data-action="remove-selection" data-index="${i}">&times;</button>
        </div>
      `).join('')}
    </div>

    <div class="lens-input-area">
      <input
        type="text"
        class="lens-input"
        placeholder="What do you want to do with these elements?"
        value="${escapeHtml(_userNote || '')}"
        data-action="input"
      />
      <button class="lens-submit" data-action="submit">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </div>
  `;
}

/**
 * Render a question from the agent
 */
function renderQuestion(question: { questionId: string; question: string; options: Array<{ id: string; label: string }> }): string {
  return `
    <div class="lens-question">
      <div class="question-text">${escapeHtml(question.question)}</div>
      <div class="question-options">
        ${question.options.map(opt => `
          <button class="question-option" data-action="answer" data-question-id="${question.questionId}" data-answer-id="${opt.id}" data-answer-label="${escapeHtml(opt.label)}">
            ${escapeHtml(opt.label)}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Get status message based on current state
 */
function getStatusMessage(
  status: string,
  lastThought: any,
  lastAction: any
): string {
  if (status === 'pending') {
    return 'Waiting for agent...';
  }

  if (status === 'success') {
    return 'Done!';
  }

  if (status === 'failed') {
    return 'Something went wrong';
  }

  if (lastThought) {
    return lastThought.content;
  }

  if (lastAction) {
    return `${lastAction.action} ${lastAction.target}`;
  }

  return 'Working...';
}

/**
 * Calculate position for Lens Card
 */
export function calculateLensPosition(
  elementRect: DOMRect,
  lensRect: { width: number; height: number }
): { x: number; y: number } {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 12;

  let x: number;
  let y: number;

  // Try to position to the right of the element
  if (elementRect.right + padding + lensRect.width < viewportWidth) {
    x = elementRect.right + padding;
  }
  // Try to position to the left
  else if (elementRect.left - padding - lensRect.width > 0) {
    x = elementRect.left - padding - lensRect.width;
  }
  // Center horizontally
  else {
    x = Math.max(padding, (viewportWidth - lensRect.width) / 2);
  }

  // Try to align top with element
  y = elementRect.top;

  // Ensure it fits in viewport
  if (y + lensRect.height > viewportHeight - padding) {
    y = viewportHeight - lensRect.height - padding;
  }
  if (y < padding) {
    y = padding;
  }

  return { x: Math.round(x), y: Math.round(y) };
}

/**
 * Escape HTML
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Lens Card CSS styles
 */
export const LENS_STYLES = `
.lens-card {
  position: fixed;
  width: 320px;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius);
  box-shadow: var(--glass-shadow);
  pointer-events: auto;
  overflow: hidden;
  animation: lens-appear 0.2s ease-out;
}

@keyframes lens-appear {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.lens-header {
  position: relative;
  padding: 14px 16px;
  border-bottom: 1px solid var(--divider);
}

.lens-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lens-component {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}

.lens-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.lens-status {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lens-status.fixing {
  background: var(--accent-soft);
  color: var(--accent);
}

.lens-status.success {
  background: rgba(16, 185, 129, 0.15);
  color: var(--success);
}

.lens-status.failed {
  background: rgba(239, 68, 68, 0.15);
  color: var(--error);
}

.lens-status.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.lens-path {
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-muted);
}

.lens-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.15s;
}

.lens-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
}

.lens-health {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid var(--divider);
}

.health-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
}

.health-card.warning {
  background: rgba(245, 158, 11, 0.1);
}

.health-card.critical {
  background: rgba(239, 68, 68, 0.1);
}

.health-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.health-message {
  font-weight: 500;
  color: var(--text-primary);
}

.health-details {
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 11px;
}

.lens-input-area {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}

.lens-input {
  flex: 1;
  padding: 10px 14px;
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s;
}

.lens-input:focus {
  border-color: var(--accent);
}

.lens-input::placeholder {
  color: var(--text-muted);
}

.lens-submit {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: transform 0.15s, background 0.15s;
}

.lens-submit:hover {
  transform: scale(1.05);
}

.lens-submit:active {
  transform: scale(0.95);
}

.lens-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid var(--divider);
}

.lens-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.lens-action:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.lens-activity {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-message {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
}

.activity-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--glass-border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.lens-question {
  padding: 12px 16px;
  border-top: 1px solid var(--divider);
}

.question-text {
  font-size: 13px;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.question-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.question-option {
  padding: 10px 14px;
  background: none;
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
}

.question-option:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.lens-done {
  padding: 12px 16px;
  border-top: 1px solid var(--divider);
}

.lens-action-btn {
  width: 100%;
  padding: 10px;
  background: var(--accent);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background 0.15s;
}

.lens-action-btn:hover {
  background: var(--accent);
  filter: brightness(1.1);
}

.lens-selected-list {
  padding: 8px 16px;
  max-height: 150px;
  overflow-y: auto;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: var(--accent-soft);
  border-radius: 8px;
  margin-bottom: 6px;
}

.selected-name {
  font-family: 'SF Mono', monospace;
  font-size: 12px;
  color: var(--text-primary);
}

.selected-remove {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
}

.selected-remove:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--error);
}

.lens-empty {
  padding: 24px;
  text-align: center;
  color: var(--text-muted);
}
`;
