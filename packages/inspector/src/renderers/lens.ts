/**
 * Lens Card Renderer for Eyeglass v2.0
 * Sharp, minimal, editorial design - no rounded corners, clean lines
 */

import type { ActivityEvent, InteractionStatus, SemanticSnapshot } from '@eyeglass/types';
import { getPulseColor, HealthIssue } from '../utils/health.js';
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
          ${issue.details ? `
            <span class="issue-info">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span class="issue-tooltip">${escapeHtml(issue.details)}</span>
            </span>
          ` : ''}
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

/**
 * Render a Figma-style organized schema view with collapsible sections
 */
export function renderOrganizedSchema(snapshot: SemanticSnapshot): string {
  const sections: { title: string; id: string; rows: { label: string; value: string }[] }[] = [];

  // Identity section
  const identityRows: { label: string; value: string }[] = [];
  if (snapshot.role) identityRows.push({ label: 'Role', value: snapshot.role });
  if (snapshot.name) identityRows.push({ label: 'Name', value: snapshot.name });
  if (snapshot.tagName) identityRows.push({ label: 'Tag', value: `<${snapshot.tagName}>` });
  if (identityRows.length) sections.push({ title: 'Identity', id: 'identity', rows: identityRows });

  // Framework section
  const fw = snapshot.framework;
  if (fw) {
    const fwRows: { label: string; value: string }[] = [];
    if (fw.type) fwRows.push({ label: 'Framework', value: fw.type });
    if (fw.displayName || fw.componentName) fwRows.push({ label: 'Component', value: fw.displayName || fw.componentName || '' });
    if (fw.filePath) fwRows.push({ label: 'File', value: fw.filePath + (fw.lineNumber ? `:${fw.lineNumber}` : '') });
    if (fwRows.length) sections.push({ title: 'Framework', id: 'framework', rows: fwRows });
  }

  // Geometry section
  const geo = snapshot.geometry;
  if (geo) {
    const geoRows: { label: string; value: string }[] = [];
    geoRows.push({ label: 'Position', value: `${Math.round(geo.x)}, ${Math.round(geo.y)}` });
    geoRows.push({ label: 'Size', value: `${Math.round(geo.width)} × ${Math.round(geo.height)}` });
    if (geo.visible !== undefined) geoRows.push({ label: 'Visible', value: geo.visible ? 'Yes' : 'No' });
    sections.push({ title: 'Geometry', id: 'geometry', rows: geoRows });
  }

  // Styles section
  const styles = snapshot.styles;
  if (styles) {
    const styleRows: { label: string; value: string }[] = [];
    if (styles.display) styleRows.push({ label: 'Display', value: styles.display });
    if (styles.position) styleRows.push({ label: 'Position', value: styles.position });
    if (styles.flexDirection) styleRows.push({ label: 'Flex Dir', value: styles.flexDirection });
    if (styles.color) styleRows.push({ label: 'Color', value: styles.color });
    if (styles.backgroundColor) styleRows.push({ label: 'Background', value: styles.backgroundColor });
    if (styles.padding && styles.padding !== '0px') styleRows.push({ label: 'Padding', value: styles.padding });
    if (styles.margin && styles.margin !== '0px') styleRows.push({ label: 'Margin', value: styles.margin });
    if (styleRows.length) sections.push({ title: 'Styles', id: 'styles', rows: styleRows });
  }

  // Accessibility section
  const a11y = snapshot.a11y;
  if (a11y) {
    const a11yRows: { label: string; value: string }[] = [];
    if (a11y.label) a11yRows.push({ label: 'Label', value: a11y.label });
    if (a11y.description) a11yRows.push({ label: 'Description', value: a11y.description });
    if (a11y.disabled) a11yRows.push({ label: 'Disabled', value: 'Yes' });
    if (a11y.expanded !== undefined) a11yRows.push({ label: 'Expanded', value: a11y.expanded ? 'Yes' : 'No' });
    if (a11y.checked !== undefined) a11yRows.push({ label: 'Checked', value: String(a11y.checked) });
    if (a11y.hidden) a11yRows.push({ label: 'Hidden', value: 'Yes' });
    if (a11yRows.length) sections.push({ title: 'Accessibility', id: 'a11y', rows: a11yRows });
  }

  // Perception section
  const perc = snapshot.perception;
  if (perc) {
    const percRows: { label: string; value: string }[] = [];
    if (perc.affordance) {
      percRows.push({ label: 'Looks Interactive', value: perc.affordance.looksInteractable ? 'Yes' : 'No' });
      percRows.push({ label: 'Is Interactive', value: perc.affordance.isInteractable ? 'Yes' : 'No' });
      if (perc.affordance.dissonanceScore > 0) {
        percRows.push({ label: 'Dissonance', value: perc.affordance.dissonanceScore.toFixed(1) });
      }
    }
    if (perc.legibility?.contrastRatio) {
      percRows.push({ label: 'Contrast', value: `${perc.legibility.contrastRatio.toFixed(1)}:1` });
    }
    if (perc.visibility?.isOccluded) {
      percRows.push({ label: 'Occluded', value: perc.visibility.occludedBy || 'Yes' });
    }
    if (percRows.length) sections.push({ title: 'Perception', id: 'perception', rows: percRows });
  }

  // Causality (Events) section
  const causality = snapshot.causality;
  if (causality?.events) {
    const eventRows: { label: string; value: string }[] = [];
    const listeners = causality.events.listeners || [];
    if (listeners.length) {
      eventRows.push({ label: 'Listeners', value: listeners.map(l => l.type).join(', ') });
    }
    const blockers = causality.events.blockingHandlers || [];
    if (blockers.length) {
      eventRows.push({ label: 'Blocked By', value: blockers.map(b => b.reason).join(', ') });
    }
    if (eventRows.length) sections.push({ title: 'Events', id: 'events', rows: eventRows });
  }

  // Metal (Performance) section
  const metal = snapshot.metal;
  if (metal) {
    const metalRows: { label: string; value: string }[] = [];
    if (metal.performance?.renderCount !== undefined) {
      metalRows.push({ label: 'Render Count', value: String(metal.performance.renderCount) });
    }
    if (metal.performance?.lastRenderReason) {
      metalRows.push({ label: 'Last Render', value: metal.performance.lastRenderReason });
    }
    if (metal.pipeline?.layerPromoted) {
      metalRows.push({ label: 'GPU Layer', value: 'Yes' });
    }
    if (metalRows.length) sections.push({ title: 'Performance', id: 'metal', rows: metalRows });
  }

  // Render sections
  return sections.map(section => `
    <div class="schema-section" data-section="${section.id}" data-collapsed="false">
      <button class="schema-section-header" data-action="toggle-section" data-section="${section.id}">
        <svg class="schema-section-chevron" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        <span>${section.title}</span>
      </button>
      <div class="schema-section-content">
        ${section.rows.map(row => `
          <div class="schema-row">
            <span class="schema-label">${escapeHtml(row.label)}</span>
            <span class="schema-value">${escapeHtml(row.value)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderStateControls(state: InspectorState): string {
  if (state.multiSelectMode) return '';
  const stateLabel = escapeHtml(state.interactionStateLabel);
  return `
    <div class="lens-state-toolbar">
      <div class="lens-state-label">State <span>${stateLabel}</span>${state.domPaused ? ' · DOM paused' : ''}</div>
      <div class="lens-state-actions">
        <button class="state-btn icon-btn" data-action="rotate-state" title="Cycle state (⌘/Ctrl + Shift + K)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 12 3 4 11 4"/><path d="M21 12a9 9 0 0 0-9-9H3"/><polyline points="21 12 21 20 13 20"/><path d="M3 12a9 9 0 0 0 9 9h9"/></svg>
        </button>
        <button class="state-btn icon-btn" data-action="capture-capsule" title="Save state capsule (⌘/Ctrl + Shift + L)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M3 7l5-5h8l5 5"/></svg>
        </button>
      </div>
    </div>
    ${renderStateCapsules(state)}
  `;
}

function renderStateCapsules(state: InspectorState): string {
  if (!state.stateCapsules.length) return '';
  return `
    <div class="lens-capsules" role="list">
      ${state.stateCapsules.map((capsule) => `
        <button
          class="lens-capsule ${state.activeCapsuleId === capsule.id ? 'active' : ''}"
          data-action="select-capsule"
          data-capsule-id="${capsule.id}"
          role="listitem"
        >
          <span class="capsule-label">${escapeHtml(capsule.label)}</span>
          <span class="capsule-meta">${new Date(capsule.capturedAt).toLocaleTimeString()}</span>
          <span class="capsule-remove" data-action="delete-capsule" data-capsule-id="${capsule.id}" title="Remove capsule" aria-label="Remove capsule">×</span>
        </button>
      `).join('')}
    </div>
  `;
}

function renderPauseBanner(domPaused: boolean): string {
  if (!domPaused) return '';
  return `<div class="lens-pause-banner">DOM paused during capture</div>`;
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
  // Use frozen health issues (element-level, not state-based)
  const issues = state.frozenHealthIssues;
  // Derive pulse level from frozen issues
  const pulseLevel = issues.some(i => i.level === 'critical') ? 'critical'
    : issues.some(i => i.level === 'warning') ? 'warning' : 'healthy';
  const pulseColor = getPulseColor(pulseLevel);
  const systemicImpact = renderSystemicImpact(currentSnapshot);
  const stateControls = renderStateControls(state);

  if (mode === 'activity') {
    return renderActivityLens(state, displayName, filePath);
  }

  return `
    <div class="lens-bar">
      <span class="lens-tag">&lt;${escapeHtml(displayName)} /&gt;</span>
      ${pulseLevel !== 'healthy' ? `<span class="lens-dot" style="background:${pulseColor}"></span>` : ''}
      <div class="lens-tools">
        <button class="lens-tool" data-action="toggle-context" title="Context (⌘/Ctrl + Shift + C)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button class="lens-tool" data-action="multi-select" title="Multi-select (⌘/Ctrl + Shift + M)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg></button>
        <button class="lens-tool lens-close" data-action="close" title="Close (Esc)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${filePath ? `<div class="lens-path">${escapeHtml(filePath)}</div>` : ''}
    ${stateControls}
    ${renderHealthIssues(issues)}
    ${systemicImpact}
    <div class="lens-input-row">
      <textarea
        class="lens-input"
        placeholder="Ask Eyeglass..."
        data-action="input"
        rows="2"
      >${escapeHtml(state._userNote || '')}</textarea>
      <button class="lens-enter-btn" data-action="submit-note" aria-label="Send request" title="Send (⌘/Ctrl + Enter)">↵</button>
    </div>
    <div class="lens-schema" data-expanded="false" data-view="organized">
      <div class="lens-schema-header">
        <button class="lens-schema-toggle" data-action="toggle-schema">
          <span>Schema</span>
          <svg class="lens-schema-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <button class="lens-schema-json-toggle" data-action="toggle-json-view" title="View raw JSON">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1"/>
            <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1"/>
          </svg>
        </button>
      </div>
      <div class="lens-schema-content">
        <div class="lens-schema-organized"></div>
        <pre class="lens-schema-code"></pre>
      </div>
    </div>
  `;
}

function renderActivityLens(state: InspectorState, displayName: string, filePath: string | null): string {
  const { currentStatus, currentStatusMessage, activityEvents, _userNote, autoCommitEnabled } = state;
  const requiresManualCommit = currentStatus === 'success' && !autoCommitEnabled;
  const lastThought = [...activityEvents].reverse().find(e => e.type === 'thought');
  const lastAction = [...activityEvents].reverse().find(e => e.type === 'action');
  const activityFeed = renderLensActivityFeed(activityEvents, currentStatus);
  const pauseBanner = renderPauseBanner(state.domPaused);

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
        <button class="lens-tool lens-close" data-action="close" title="Close (Esc)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${filePath ? `<div class="lens-path">${escapeHtml(filePath)}</div>` : ''}
    ${pauseBanner}
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
  const pauseBanner = renderPauseBanner(state.domPaused);
  return `
    <div class="lens-bar">
      <span class="lens-tag">${selectedSnapshots.length} selected</span>
      <div class="lens-tools">
        <button class="lens-tool lens-close" data-action="exit-multi" title="Exit (Esc)"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
    </div>
    ${pauseBanner}
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
      <button class="lens-enter-btn" data-action="submit-note" aria-label="Send request" title="Send (⌘/Ctrl + Enter)">↵</button>
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

.lens-state-toolbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 10px 4px;
  border-bottom: 1px solid var(--divider);
}

.lens-state-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  display: flex;
  gap: 4px;
  align-items: center;
}

.lens-state-label span {
  color: var(--text-primary);
  font-weight: 600;
}

.lens-state-actions {
  display: flex;
  gap: 6px;
}

.state-btn {
  flex: 1;
  border: 1px solid var(--glass-border);
  background: rgba(0,0,0,0.04);
  color: var(--text-secondary);
  font-size: 10px;
  padding: 4px 6px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.state-btn.icon-btn {
  flex: 0;
  min-width: 56px;
  width: 56px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.state-btn.icon-btn svg {
  width: 14px;
  height: 14px;
}

.state-btn.active {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
}

.state-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.lens-capsules {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 10px;
}

.lens-capsule {
  border: 1px solid var(--glass-border);
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 9px;
  cursor: pointer;
  min-width: 80px;
  position: relative;
  background: rgba(255,255,255,0.03);
  color: var(--text-primary);
  transition: border-color 0.15s ease, background 0.15s ease;
}

.lens-capsule.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}

.capsule-label {
  font-family: 'SF Mono', monospace;
  color: inherit;
}

.capsule-meta {
  color: var(--text-muted);
  font-size: 8px;
}

.capsule-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  padding: 0;
}

.capsule-remove:hover {
  color: var(--error);
}

.lens-pause-banner {
  padding: 6px 10px;
  font-size: 10px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--divider);
  background: rgba(249,115,22,0.08);
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

.issue-info {
  position: relative;
  display: flex;
  align-items: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.issue-info svg {
  width: 12px;
  height: 12px;
  opacity: 0.6;
  transition: opacity 0.1s;
}

.issue-info:hover svg {
  opacity: 1;
}

.issue-tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  transform: translateX(-50%);
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  padding: 6px 8px;
  font-size: 10px;
  color: var(--text-primary);
  white-space: nowrap;
  max-width: 200px;
  white-space: normal;
  line-height: 1.3;
  z-index: 2147483646;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, visibility 0.15s;
}

.issue-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--glass-border);
}

.issue-info:hover .issue-tooltip {
  opacity: 1;
  visibility: visible;
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

.lens-schema-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lens-schema-toggle {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
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

.lens-schema-json-toggle {
  padding: 4px 8px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.1s, color 0.1s;
}

.lens-schema[data-expanded="true"] .lens-schema-json-toggle {
  opacity: 1;
}

.lens-schema-json-toggle:hover {
  color: var(--accent);
}

.lens-schema[data-view="json"] .lens-schema-json-toggle {
  color: var(--accent);
}

.lens-schema-chevron {
  transition: transform 0.15s;
}

.lens-schema[data-expanded="true"] .lens-schema-chevron {
  transform: rotate(180deg);
}

.lens-schema-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.15s ease-out;
}

.lens-schema[data-expanded="true"] .lens-schema-content {
  max-height: 240px;
  overflow-y: auto;
}

/* Organized view (Figma-style) */
.lens-schema-organized {
  display: block;
}

.lens-schema[data-view="json"] .lens-schema-organized {
  display: none;
}

.schema-section {
  border-bottom: 1px solid var(--divider);
}

.schema-section:last-child {
  border-bottom: none;
}

.schema-section-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  font-size: 9px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.1s;
}

.schema-section-header:hover {
  color: var(--text-primary);
}

.schema-section-chevron {
  transition: transform 0.15s;
  flex-shrink: 0;
}

.schema-section[data-collapsed="true"] .schema-section-chevron {
  transform: rotate(-90deg);
}

.schema-section-content {
  padding: 0 10px 6px 22px;
}

.schema-section[data-collapsed="true"] .schema-section-content {
  display: none;
}

.schema-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 2px 0;
  gap: 8px;
}

.schema-label {
  font-size: 9px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.schema-value {
  font-size: 9px;
  font-family: 'SF Mono', monospace;
  color: var(--text-primary);
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 120px;
}

/* JSON view */
.lens-schema-code {
  display: none;
  margin: 0;
  padding: 0;
  font-family: 'SF Mono', monospace;
  font-size: 9px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-primary);
  background: rgba(0,0,0,0.04);
}

.lens-schema[data-view="json"] .lens-schema-code {
  display: block;
  padding: 8px 10px;
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
