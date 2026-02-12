import {
  FocusPayload,
  InteractionStatus,
  ActivityEvent,
  AnswerPayload,
} from '@eyeglass/types';
import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

const MAX_HISTORY = 5;
const CONTEXT_FILE = '.eyeglass_context.md';

interface PendingQuestion {
  questionId: string;
  resolve: (answer: AnswerPayload) => void;
}

interface PendingWait {
  resolve: (payload: FocusPayload) => void;
  reject: (error: Error) => void;
  timeoutId?: NodeJS.Timeout;
}

export class ContextStore extends EventEmitter {
  private active: FocusPayload | null = null;
  private history: FocusPayload[] = [];
  private currentStatus: InteractionStatus = 'idle';
  private pendingQuestion: PendingQuestion | null = null;
  private pendingWait: PendingWait | null = null;
  private commitMap: Map<string, string> = new Map(); // interactionId -> commitHash
  private pendingCommitMessage: Map<string, string> = new Map(); // interactionId -> message (for manual commits)

  setFocus(payload: FocusPayload): void {
    if (this.active) {
      this.history.unshift(this.active);
      if (this.history.length > MAX_HISTORY) {
        this.history.pop();
      }
    }

    this.active = payload;

    // If an agent is waiting for a request, resolve immediately and set status to "fixing"
    if (this.pendingWait) {
      const { resolve, timeoutId } = this.pendingWait;
      if (timeoutId) clearTimeout(timeoutId);
      this.pendingWait = null;

      this.currentStatus = 'fixing';
      this.emitActivity({
        type: 'status',
        interactionId: payload.interactionId,
        status: 'fixing',
        message: 'Agent is working...',
        timestamp: Date.now(),
      });
      this.writeContextFile();
      resolve(payload);
      return;
    }

    // Otherwise, set status to "pending" (waiting for agent to pick it up)
    this.currentStatus = 'pending';
    this.emitActivity({
      type: 'status',
      interactionId: payload.interactionId,
      status: 'pending',
      message: 'Waiting for agent...',
      timestamp: Date.now(),
    });
    this.writeContextFile();
  }

  /**
   * Wait for a new focus request from the browser.
   * If there's already an active pending request, resolves immediately.
   * @param timeoutMs - Optional timeout in milliseconds (default: no timeout)
   */
  waitForFocus(timeoutMs?: number): Promise<FocusPayload> {
    // If there's already a pending request waiting for an agent, return it immediately
    if (this.active && this.currentStatus === 'pending') {
      // Update status to fixing since agent is now handling it
      this.currentStatus = 'fixing';
      this.emitActivity({
        type: 'status',
        interactionId: this.active.interactionId,
        status: 'fixing',
        message: 'Agent is working...',
        timestamp: Date.now(),
      });
      return Promise.resolve(this.active);
    }

    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined;

      if (timeoutMs) {
        timeoutId = setTimeout(() => {
          if (this.pendingWait) {
            this.pendingWait = null;
            reject(new Error('Timeout waiting for focus request'));
          }
        }, timeoutMs);
      }

      this.pendingWait = { resolve, reject, timeoutId };
    });
  }

  /**
   * Check if an agent is currently waiting for a request
   */
  isWaitingForFocus(): boolean {
    return this.pendingWait !== null;
  }

  getActive(): FocusPayload | null {
    return this.active;
  }

  getHistory(): FocusPayload[] {
    return this.history;
  }

  // Status update
  updateStatus(interactionId: string, status: InteractionStatus, message?: string): void {
    if (this.active?.interactionId !== interactionId) return;
    this.currentStatus = status;

    // Auto-commit changes when marked as success (if autoCommit is enabled)
    if (status === 'success') {
      const shouldAutoCommit = this.active.autoCommit !== false; // Default to true
      if (shouldAutoCommit) {
        this.commitChanges(interactionId, message);
      } else {
        // Store message for potential manual commit later
        this.pendingCommitMessage.set(interactionId, message || 'Eyeglass change');
      }
    }

    this.emitActivity({
      type: 'status',
      interactionId,
      status,
      message,
      timestamp: Date.now(),
    });
  }

  /**
   * Commit all staged and unstaged changes with the interaction ID
   */
  private commitChanges(interactionId: string, message?: string): void {
    try {
      const cwd = process.cwd();

      // Check if we're in a git repo
      try {
        execFileSync('git', ['rev-parse', '--git-dir'], { cwd, stdio: 'pipe' });
      } catch {
        // Not a git repo, skip committing
        return;
      }

      // Check if there are any changes to commit
      const status = execFileSync('git', ['status', '--porcelain'], { cwd, encoding: 'utf-8' });
      if (!status.trim()) {
        // No changes to commit
        return;
      }

      // Stage all changes
      execFileSync('git', ['add', '-A'], { cwd, stdio: 'pipe' });

      // Commit with eyeglass marker
      const commitMessage = `[eyeglass:${interactionId}] ${message || 'Eyeglass change'}`;
      execFileSync('git', ['commit', '-m', commitMessage], { cwd, stdio: 'pipe' });

      // Get the commit hash
      const commitHash = execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf-8' }).trim();
      this.commitMap.set(interactionId, commitHash);
    } catch (err) {
      // Silently fail git operations
      console.error('[eyeglass] Failed to commit changes:', err);
    }
  }

  /**
   * Undo changes for a specific interaction by reverting its commit
   */
  async undoInteraction(interactionId: string): Promise<{ success: boolean; message: string }> {
    const commitHash = this.commitMap.get(interactionId);

    if (!commitHash) {
      // Try to find the commit by searching git log
      try {
        const cwd = process.cwd();
        const log = execFileSync(
          'git',
          ['log', '--oneline', `--grep=[eyeglass:${interactionId}]`, '-n', '1'],
          { cwd, encoding: 'utf-8' }
        ).trim();

        if (!log) {
          return { success: false, message: 'No commit found for this interaction' };
        }

        const foundHash = log.split(' ')[0];
        if (foundHash) {
          this.commitMap.set(interactionId, foundHash);
          return this.revertCommit(interactionId, foundHash);
        }
      } catch {
        return { success: false, message: 'Could not find commit for this interaction' };
      }
    }

    return this.revertCommit(interactionId, commitHash!);
  }

  private revertCommit(interactionId: string, commitHash: string): { success: boolean; message: string } {
    try {
      const cwd = process.cwd();

      // Revert the commit (creates a new commit that undoes the changes)
      execFileSync('git', ['revert', '--no-edit', commitHash], { cwd, stdio: 'pipe' });

      // Remove from commit map
      this.commitMap.delete(interactionId);

      // Emit status update
      this.emitActivity({
        type: 'status',
        interactionId,
        status: 'idle',
        message: 'Changes reverted',
        timestamp: Date.now(),
      });

      return { success: true, message: 'Changes reverted successfully' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, message: `Failed to revert: ${errorMessage}` };
    }
  }

  /**
   * Manually commit changes for an interaction (when autoCommit is disabled)
   */
  manualCommit(interactionId: string): { success: boolean; message: string } {
    // Check if already committed
    if (this.commitMap.has(interactionId)) {
      return { success: false, message: 'Changes already committed' };
    }

    const commitMessage = this.pendingCommitMessage.get(interactionId) || 'Eyeglass change';
    this.pendingCommitMessage.delete(interactionId);

    try {
      this.commitChanges(interactionId, commitMessage);

      // Check if commit was successful
      if (this.commitMap.has(interactionId)) {
        return { success: true, message: 'Changes committed successfully' };
      } else {
        return { success: false, message: 'No changes to commit' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, message: `Failed to commit: ${errorMessage}` };
    }
  }

  /**
   * Discard uncommitted changes for an interaction (when autoCommit is disabled)
   */
  async discardChanges(interactionId: string): Promise<{ success: boolean; message: string }> {
    // If already committed, use revert
    if (this.commitMap.has(interactionId)) {
      return this.undoInteraction(interactionId);
    }

    try {
      const cwd = process.cwd();

      // Check if we're in a git repo
      try {
        execFileSync('git', ['rev-parse', '--git-dir'], { cwd, stdio: 'pipe' });
      } catch {
        return { success: false, message: 'Not a git repository' };
      }

      // Discard all uncommitted changes
      execFileSync('git', ['checkout', '.'], { cwd, stdio: 'pipe' });
      execFileSync('git', ['clean', '-fd'], { cwd, stdio: 'pipe' });

      // Clean up pending commit message
      this.pendingCommitMessage.delete(interactionId);

      return { success: true, message: 'Changes discarded' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, message: `Failed to discard: ${errorMessage}` };
    }
  }

  // Send a thought/reasoning to the user
  sendThought(interactionId: string, content: string): void {
    if (this.active?.interactionId !== interactionId) return;
    this.emitActivity({
      type: 'thought',
      interactionId,
      content,
      timestamp: Date.now(),
    });
  }

  // Report an action being taken
  reportAction(
    interactionId: string,
    action: 'reading' | 'writing' | 'searching' | 'thinking',
    target: string,
    complete = false
  ): void {
    if (this.active?.interactionId !== interactionId) return;
    this.emitActivity({
      type: 'action',
      interactionId,
      action,
      target,
      complete,
      timestamp: Date.now(),
    });
  }

  // Ask a question and wait for answer
  async askQuestion(
    interactionId: string,
    questionId: string,
    question: string,
    options: Array<{ id: string; label: string }>
  ): Promise<AnswerPayload> {
    if (this.active?.interactionId !== interactionId) {
      throw new Error('No active interaction');
    }

    // Emit the question event
    this.emitActivity({
      type: 'question',
      interactionId,
      questionId,
      question,
      options,
      timestamp: Date.now(),
    });

    // Wait for the answer
    return new Promise((resolve) => {
      this.pendingQuestion = { questionId, resolve };
    });
  }

  // Receive answer from the browser
  receiveAnswer(answer: AnswerPayload): boolean {
    if (!this.pendingQuestion || this.pendingQuestion.questionId !== answer.questionId) {
      return false;
    }

    this.pendingQuestion.resolve(answer);
    this.pendingQuestion = null;
    return true;
  }

  hasPendingQuestion(): boolean {
    return this.pendingQuestion !== null;
  }

  private emitActivity(event: ActivityEvent): void {
    this.emit('activity', event);
  }

  formatAsMarkdown(): string {
    if (!this.active) {
      return '# No Active Focus\n\nNo element is currently focused.';
    }

    const { snapshot, snapshots, userNote, interactionId } = this.active;

    // Handle both single and multi-select payloads
    const allSnapshots = snapshots || (snapshot ? [snapshot] : []);

    if (allSnapshots.length === 0) {
      return '# No Active Focus\n\nNo element is currently focused.';
    }

    // Single element - use original format
    if (allSnapshots.length === 1) {
      return this.formatSingleSnapshot(allSnapshots[0], userNote, interactionId);
    }

    // Multiple elements - new format
    return this.formatMultipleSnapshots(allSnapshots, userNote, interactionId);
  }

  private formatSingleSnapshot(snapshot: import('@eyeglass/types').SemanticSnapshot, userNote: string, interactionId: string): string {
    const { framework, a11y, geometry, styles } = snapshot;

    const displayName = framework.displayName || framework.componentName;
    const componentInfo = displayName
      ? `\`<${displayName} />\` (${framework.filePath || 'unknown file'}${framework.lineNumber ? `:${framework.lineNumber}` : ''})`
      : `\`<${snapshot.tagName}>\` (vanilla element)`;

    // Format props from new state or legacy location
    const props = framework.state?.props || framework.props;
    const propsStr = props && Object.keys(props).length > 0 ? JSON.stringify(props, null, 2) : null;

    // Format hooks if present
    const hooksStr = framework.state?.hooks?.length
      ? framework.state.hooks.map(h => `${h.name}${h.label ? `(${h.label})` : ''}${h.value !== undefined ? ` = ${JSON.stringify(h.value)}` : ''}`).join(', ')
      : null;

    // Format context if present
    const contextStr = framework.state?.context?.length
      ? framework.state.context.map(c => c.name).join(', ')
      : null;

    // Analyze health issues
    const healthIssues: string[] = [];
    if (snapshot.perception?.legibility?.wcagStatus === 'fail') {
      healthIssues.push(`🛑 Low contrast (${snapshot.perception.legibility.contrastRatio}:1)`);
    }
    if (snapshot.perception?.affordance?.dissonanceScore && snapshot.perception.affordance.dissonanceScore > 0.5) {
      healthIssues.push('⚠️ Affordance mismatch');
    }
    if (snapshot.causality?.events?.blockingHandlers?.length) {
      healthIssues.push(`🛑 Events blocked (${snapshot.causality.events.blockingHandlers.length})`);
    }
    if (snapshot.metal?.performance?.renderCount && snapshot.metal.performance.renderCount > 10) {
      healthIssues.push(`⚠️ High render count (${snapshot.metal.performance.renderCount})`);
    }
    if (snapshot.perception?.visibility?.isOccluded) {
      healthIssues.push('⚠️ Element occluded');
    }

    const healthSummary = healthIssues.length > 0
      ? `\n**⚠️ Health Issues:** ${healthIssues.join(', ')}\n`
      : '';

    return `## User Focus Request
**Interaction ID:** ${interactionId}
**User Note:** "${userNote}"
**Component:** ${componentInfo}
${healthSummary}
### Element Info
- Tag: \`<${snapshot.tagName}>\`
- Role: ${snapshot.role}
- Name: "${snapshot.name}"
${snapshot.id ? `- ID: \`#${snapshot.id}\`` : ''}
${snapshot.className ? `- Classes: \`${snapshot.className}\`` : ''}
${snapshot.dataAttributes ? `- Data attrs: ${Object.entries(snapshot.dataAttributes).map(([k, v]) => `\`${k}="${v}"\``).join(', ')}` : ''}
${a11y ? `
### Accessibility Tree
- Label: ${a11y.label ?? 'none'}
- Description: ${a11y.description ?? 'none'}
- Disabled: ${a11y.disabled}
- Hidden: ${a11y.hidden}
${a11y.expanded !== undefined ? `- Expanded: ${a11y.expanded}` : ''}
${a11y.checked !== undefined ? `- Checked: ${a11y.checked}` : ''}` : ''}

### Geometry
- Box: ${geometry.width}x${geometry.height} at (${geometry.x}, ${geometry.y})
- Visible: ${geometry.visible}

### Computed Styles
- Display: ${styles.display}
- Position: ${styles.position}
${styles.flexDirection ? `- Flex Direction: ${styles.flexDirection}` : ''}
${styles.gridTemplate ? `- Grid Template: ${styles.gridTemplate}` : ''}
- Padding: ${styles.padding}
- Margin: ${styles.margin}
- Color: ${styles.color}
- Background: ${styles.backgroundColor}
- Font: ${styles.fontFamily}
- Z-Index: ${styles.zIndex}

### Framework
- Detected: ${framework.type || framework.name || 'vanilla'}
${framework.ancestry ? `- Component Tree: ${framework.ancestry.join(' > ')}` : ''}
${propsStr ? `- Props: ${propsStr}` : ''}
${hooksStr ? `- Hooks: ${hooksStr}` : ''}
${contextStr ? `- Context: ${contextStr}` : ''}
${snapshot.causality ? `
### Causality (Event Flow)
- Event Listeners: ${snapshot.causality.events.listeners.length > 0 ? snapshot.causality.events.listeners.map(l => l.type).join(', ') : 'none'}
${snapshot.causality.events.blockingHandlers.length > 0 ? `- **Blocked Events:** ${snapshot.causality.events.blockingHandlers.map(b => `${b.event} (${b.reason} on ${b.element})`).join(', ')}` : ''}
- Stacking Context: ${snapshot.causality.stackingContext.isStackingContext ? `Yes (${snapshot.causality.stackingContext.reason})` : 'No'}
${snapshot.causality.stackingContext.parentContext ? `- Parent Context: ${snapshot.causality.stackingContext.parentContext}` : ''}
${snapshot.causality.layoutConstraints.length > 0 ? `- Layout Constraints: ${snapshot.causality.layoutConstraints.join('; ')}` : ''}` : ''}
${snapshot.perception ? `
### Perception (User Experience)
- **Affordance:** ${snapshot.perception.affordance.looksInteractable ? 'Looks clickable' : 'Does not look clickable'} / ${snapshot.perception.affordance.isInteractable ? 'Is interactive' : 'Not interactive'}${snapshot.perception.affordance.dissonanceScore > 0 ? ` ⚠️ Dissonance: ${Math.round(snapshot.perception.affordance.dissonanceScore * 100)}%` : ''}
- **Contrast:** ${snapshot.perception.legibility.contrastRatio}:1 (WCAG ${snapshot.perception.legibility.wcagStatus})
- **Touch Target:** ${snapshot.perception.usability.touchTargetSize} ${snapshot.perception.usability.isTouchTargetValid ? '✓' : '⚠️ Too small'}
${snapshot.perception.visibility.isOccluded ? `- **⚠️ Occluded by:** ${snapshot.perception.visibility.occludedBy}` : ''}` : ''}
${snapshot.metal ? `
### Performance
- Render Count: ${snapshot.metal.performance.renderCount}${snapshot.metal.performance.lastRenderReason ? ` (${snapshot.metal.performance.lastRenderReason})` : ''}
- GPU Layer: ${snapshot.metal.pipeline.layerPromoted ? 'Yes' : 'No'}
${snapshot.metal.pipeline.layoutThrashingRisk !== 'none' ? `- **⚠️ Layout Thrashing Risk:** ${snapshot.metal.pipeline.layoutThrashingRisk}` : ''}
- Event Listeners: ${snapshot.metal.memory.listenerCount}` : ''}
${snapshot.neighborhood ? `
### DOM Neighborhood
**Parents (layout context):**
${snapshot.neighborhood.parents.length > 0 ? snapshot.neighborhood.parents.map((p, i) => {
  const styleInfo = [
    p.styles.display,
    p.styles.position !== 'static' ? p.styles.position : null,
    p.styles.flexDirection,
    p.styles.alignItems ? `align: ${p.styles.alignItems}` : null,
    p.styles.justifyContent ? `justify: ${p.styles.justifyContent}` : null,
    p.styles.gap ? `gap: ${p.styles.gap}` : null,
    p.styles.gridTemplate ? `grid: ${p.styles.gridTemplate}` : null,
  ].filter(Boolean).join(', ');
  return `${i + 1}. \`<${p.tagName}>\`${p.className ? ` .${p.className.split(' ')[0]}` : ''} — ${styleInfo}`;
}).join('\n') : '(none)'}

**Children:**
${snapshot.neighborhood.children.length > 0 ? snapshot.neighborhood.children.map(c => {
  const countStr = c.count && c.count > 1 ? ` x${c.count}` : '';
  return `- \`<${c.tagName}>\`${c.className ? ` .${c.className.split(' ')[0]}` : ''}${countStr}`;
}).join('\n') : '(none)'}
` : ''}
### Page Context
- URL: ${snapshot.url}
- Timestamp: ${new Date(snapshot.timestamp).toISOString()}
`;
  }

  private formatMultipleSnapshots(snapshots: import('@eyeglass/types').SemanticSnapshot[], userNote: string, interactionId: string): string {
    const elementSections = snapshots.map((snapshot, index) => {
      const { framework, a11y, geometry, styles } = snapshot;

      const displayName = framework.displayName || framework.componentName;
      const componentInfo = displayName
        ? `\`<${displayName} />\` (${framework.filePath || 'unknown file'}${framework.lineNumber ? `:${framework.lineNumber}` : ''})`
        : `\`<${snapshot.tagName}>\` (vanilla element)`;

      const props = framework.state?.props || framework.props;
      const propsStr = props && Object.keys(props).length > 0 ? JSON.stringify(props, null, 2) : null;

      return `## Element ${index + 1}: ${componentInfo}

### Element Info
- Tag: \`<${snapshot.tagName}>\`
- Role: ${snapshot.role}
- Name: "${snapshot.name}"
${snapshot.id ? `- ID: \`#${snapshot.id}\`` : ''}
${snapshot.className ? `- Classes: \`${snapshot.className}\`` : ''}
${snapshot.dataAttributes ? `- Data attrs: ${Object.entries(snapshot.dataAttributes).map(([k, v]) => `\`${k}="${v}"\``).join(', ')}` : ''}
${a11y ? `
### Accessibility Tree
- Label: ${a11y.label ?? 'none'}
- Description: ${a11y.description ?? 'none'}
- Disabled: ${a11y.disabled}
- Hidden: ${a11y.hidden}
${a11y.expanded !== undefined ? `- Expanded: ${a11y.expanded}` : ''}
${a11y.checked !== undefined ? `- Checked: ${a11y.checked}` : ''}` : ''}

### Geometry
- Box: ${geometry.width}x${geometry.height} at (${geometry.x}, ${geometry.y})
- Visible: ${geometry.visible}

### Computed Styles
- Display: ${styles.display}
- Position: ${styles.position}
${styles.flexDirection ? `- Flex Direction: ${styles.flexDirection}` : ''}
${styles.gridTemplate ? `- Grid Template: ${styles.gridTemplate}` : ''}
- Padding: ${styles.padding}
- Margin: ${styles.margin}
- Color: ${styles.color}
- Background: ${styles.backgroundColor}
- Font: ${styles.fontFamily}
- Z-Index: ${styles.zIndex}

### Framework
- Detected: ${framework.type || framework.name || 'vanilla'}
${framework.ancestry ? `- Component Tree: ${framework.ancestry.join(' > ')}` : ''}
${propsStr ? `- Props: ${propsStr}` : ''}
${snapshot.neighborhood ? `
### DOM Neighborhood
**Parents:** ${snapshot.neighborhood.parents.length > 0 ? snapshot.neighborhood.parents.map(p => {
  const styleInfo = [p.styles.display, p.styles.flexDirection, p.styles.gap].filter(Boolean).join(', ');
  return `\`<${p.tagName}>\` (${styleInfo})`;
}).join(' > ') : '(none)'}
**Children:** ${snapshot.neighborhood.children.length > 0 ? snapshot.neighborhood.children.map(c => {
  const countStr = c.count && c.count > 1 ? ` x${c.count}` : '';
  return `\`<${c.tagName}>\`${countStr}`;
}).join(', ') : '(none)'}
` : ''}`;
    }).join('\n---\n\n');

    return `# User Focus Request (${snapshots.length} Elements)
**Interaction ID:** ${interactionId}
**User Note:** "${userNote}"

---

${elementSections}
### Page Context
- URL: ${snapshots[0].url}
- Timestamp: ${new Date(snapshots[0].timestamp).toISOString()}
`;
  }

  private writeContextFile(): void {
    try {
      const content = this.formatAsMarkdown();
      fs.writeFileSync(path.resolve(process.cwd(), CONTEXT_FILE), content, 'utf-8');
    } catch (err) {
      // Silently fail file writes
    }
  }
}

export const store = new ContextStore();
