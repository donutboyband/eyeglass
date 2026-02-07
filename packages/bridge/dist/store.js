import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
const MAX_HISTORY = 5;
const CONTEXT_FILE = '.eyeglass_context.md';
export class ContextStore extends EventEmitter {
    constructor() {
        super(...arguments);
        this.active = null;
        this.history = [];
        this.currentStatus = 'idle';
        this.pendingQuestion = null;
        this.pendingWait = null;
        this.commitMap = new Map(); // interactionId -> commitHash
    }
    setFocus(payload) {
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
            if (timeoutId)
                clearTimeout(timeoutId);
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
    waitForFocus(timeoutMs) {
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
            let timeoutId;
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
    isWaitingForFocus() {
        return this.pendingWait !== null;
    }
    getActive() {
        return this.active;
    }
    getHistory() {
        return this.history;
    }
    // Status update
    updateStatus(interactionId, status, message) {
        if (this.active?.interactionId !== interactionId)
            return;
        this.currentStatus = status;
        // Auto-commit changes when marked as success
        if (status === 'success') {
            this.commitChanges(interactionId, message);
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
    commitChanges(interactionId, message) {
        try {
            const cwd = process.cwd();
            // Check if we're in a git repo
            try {
                execSync('git rev-parse --git-dir', { cwd, stdio: 'pipe' });
            }
            catch {
                // Not a git repo, skip committing
                return;
            }
            // Check if there are any changes to commit
            const status = execSync('git status --porcelain', { cwd, encoding: 'utf-8' });
            if (!status.trim()) {
                // No changes to commit
                return;
            }
            // Stage all changes
            execSync('git add -A', { cwd, stdio: 'pipe' });
            // Commit with eyeglass marker
            const commitMessage = `[eyeglass:${interactionId}] ${message || 'Eyeglass change'}`;
            execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { cwd, stdio: 'pipe' });
            // Get the commit hash
            const commitHash = execSync('git rev-parse HEAD', { cwd, encoding: 'utf-8' }).trim();
            this.commitMap.set(interactionId, commitHash);
        }
        catch (err) {
            // Silently fail git operations
            console.error('[eyeglass] Failed to commit changes:', err);
        }
    }
    /**
     * Undo changes for a specific interaction by reverting its commit
     */
    async undoInteraction(interactionId) {
        const commitHash = this.commitMap.get(interactionId);
        if (!commitHash) {
            // Try to find the commit by searching git log
            try {
                const cwd = process.cwd();
                const log = execSync(`git log --oneline --grep="\\[eyeglass:${interactionId}\\]" -n 1`, { cwd, encoding: 'utf-8' }).trim();
                if (!log) {
                    return { success: false, message: 'No commit found for this interaction' };
                }
                const foundHash = log.split(' ')[0];
                if (foundHash) {
                    this.commitMap.set(interactionId, foundHash);
                    return this.revertCommit(interactionId, foundHash);
                }
            }
            catch {
                return { success: false, message: 'Could not find commit for this interaction' };
            }
        }
        return this.revertCommit(interactionId, commitHash);
    }
    revertCommit(interactionId, commitHash) {
        try {
            const cwd = process.cwd();
            // Revert the commit (creates a new commit that undoes the changes)
            execSync(`git revert --no-edit ${commitHash}`, { cwd, stdio: 'pipe' });
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
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            return { success: false, message: `Failed to revert: ${errorMessage}` };
        }
    }
    // Send a thought/reasoning to the user
    sendThought(interactionId, content) {
        if (this.active?.interactionId !== interactionId)
            return;
        this.emitActivity({
            type: 'thought',
            interactionId,
            content,
            timestamp: Date.now(),
        });
    }
    // Report an action being taken
    reportAction(interactionId, action, target, complete = false) {
        if (this.active?.interactionId !== interactionId)
            return;
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
    async askQuestion(interactionId, questionId, question, options) {
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
    receiveAnswer(answer) {
        if (!this.pendingQuestion || this.pendingQuestion.questionId !== answer.questionId) {
            return false;
        }
        this.pendingQuestion.resolve(answer);
        this.pendingQuestion = null;
        return true;
    }
    hasPendingQuestion() {
        return this.pendingQuestion !== null;
    }
    emitActivity(event) {
        this.emit('activity', event);
    }
    formatAsMarkdown() {
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
    formatSingleSnapshot(snapshot, userNote, interactionId) {
        const { framework, a11y, geometry, styles } = snapshot;
        const componentInfo = framework.componentName
            ? `\`<${framework.componentName} />\` (${framework.filePath || 'unknown file'}${framework.lineNumber ? `:${framework.lineNumber}` : ''})`
            : `\`<${snapshot.tagName}>\` (vanilla element)`;
        return `## User Focus Request
**Interaction ID:** ${interactionId}
**User Note:** "${userNote}"
**Component:** ${componentInfo}

### Element Info
- Tag: \`<${snapshot.tagName}>\`
- Role: ${snapshot.role}
- Name: "${snapshot.name}"

### Accessibility Tree
- Label: ${a11y.label ?? 'none'}
- Description: ${a11y.description ?? 'none'}
- Disabled: ${a11y.disabled}
- Hidden: ${a11y.hidden}
${a11y.expanded !== undefined ? `- Expanded: ${a11y.expanded}` : ''}
${a11y.checked !== undefined ? `- Checked: ${a11y.checked}` : ''}

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
- Detected: ${framework.name}
${framework.ancestry ? `- Component Tree: ${framework.ancestry.join(' > ')}` : ''}
${framework.props ? `- Props: ${JSON.stringify(framework.props, null, 2)}` : ''}

### Page Context
- URL: ${snapshot.url}
- Timestamp: ${new Date(snapshot.timestamp).toISOString()}
`;
    }
    formatMultipleSnapshots(snapshots, userNote, interactionId) {
        const elementSections = snapshots.map((snapshot, index) => {
            const { framework, a11y, geometry, styles } = snapshot;
            const componentInfo = framework.componentName
                ? `\`<${framework.componentName} />\` (${framework.filePath || 'unknown file'}${framework.lineNumber ? `:${framework.lineNumber}` : ''})`
                : `\`<${snapshot.tagName}>\` (vanilla element)`;
            return `## Element ${index + 1}: ${componentInfo}

### Element Info
- Tag: \`<${snapshot.tagName}>\`
- Role: ${snapshot.role}
- Name: "${snapshot.name}"

### Accessibility Tree
- Label: ${a11y.label ?? 'none'}
- Description: ${a11y.description ?? 'none'}
- Disabled: ${a11y.disabled}
- Hidden: ${a11y.hidden}
${a11y.expanded !== undefined ? `- Expanded: ${a11y.expanded}` : ''}
${a11y.checked !== undefined ? `- Checked: ${a11y.checked}` : ''}

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
- Detected: ${framework.name}
${framework.ancestry ? `- Component Tree: ${framework.ancestry.join(' > ')}` : ''}
${framework.props ? `- Props: ${JSON.stringify(framework.props, null, 2)}` : ''}
`;
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
    writeContextFile() {
        try {
            const content = this.formatAsMarkdown();
            fs.writeFileSync(path.resolve(process.cwd(), CONTEXT_FILE), content, 'utf-8');
        }
        catch (err) {
            // Silently fail file writes
        }
    }
}
export const store = new ContextStore();
