import express, { Request, Response } from 'express';
import cors from 'cors';
import { FocusPayload, ActivityEvent, AnswerPayload } from '@eyeglass/types';
import { store } from './store.js';

const PORT = 3300;
const KEEPALIVE_INTERVAL = 30000;

export function startHttpServer(): void {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const sseClients: Set<Response> = new Set();

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', active: store.getActive() !== null });
  });

  // Browser posts focus payload here
  app.post('/focus', (req: Request, res: Response) => {
    const payload = req.body as FocusPayload;

    // Validate: must have interactionId, userNote, and either snapshot or snapshots
    // Type validation to prevent crashes from malformed payloads
    if (typeof payload.interactionId !== 'string' || typeof payload.userNote !== 'string') {
      res.status(400).json({ error: 'Invalid payload: interactionId and userNote must be strings' });
      return;
    }

    const hasSnapshot = payload.snapshot || (Array.isArray(payload.snapshots) && payload.snapshots.length > 0);
    if (!payload.interactionId || !hasSnapshot || !payload.userNote) {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }

    store.setFocus(payload);
    res.json({ success: true, interactionId: payload.interactionId });
  });

  // Browser posts answer to a question
  app.post('/answer', (req: Request, res: Response) => {
    const answer = req.body as AnswerPayload;

    // Type validation
    if (typeof answer.interactionId !== 'string' ||
        typeof answer.questionId !== 'string' ||
        typeof answer.answerId !== 'string') {
      res.status(400).json({ error: 'Invalid answer payload: all fields must be strings' });
      return;
    }

    if (!answer.interactionId || !answer.questionId || !answer.answerId) {
      res.status(400).json({ error: 'Invalid answer payload' });
      return;
    }

    const success = store.receiveAnswer(answer);
    if (!success) {
      res.status(404).json({ error: 'No pending question with that ID' });
      return;
    }

    res.json({ success: true });
  });

  // Undo/discard changes for a specific interaction
  app.post('/undo', async (req: Request, res: Response) => {
    const { interactionId } = req.body as { interactionId: string };

    // Type validation
    if (typeof interactionId !== 'string' || !interactionId) {
      res.status(400).json({ error: 'Missing or invalid interactionId' });
      return;
    }

    // Try discard first (for uncommitted changes), then undo (for committed changes)
    let result = await store.discardChanges(interactionId);
    if (!result.success && result.message !== 'Not a git repository') {
      // If discard didn't work, try undo (revert commit)
      result = await store.undoInteraction(interactionId);
    }

    if (!result.success) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.json({ success: true, message: result.message });
  });

  // Commit changes for a specific interaction (when autoCommit is disabled)
  app.post('/commit', (req: Request, res: Response) => {
    const { interactionId } = req.body as { interactionId: string };

    // Type validation
    if (typeof interactionId !== 'string' || !interactionId) {
      res.status(400).json({ error: 'Missing or invalid interactionId' });
      return;
    }

    const result = store.manualCommit(interactionId);
    if (!result.success) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.json({ success: true, message: result.message });
  });

  // ============================================================================
  // REST API for non-MCP agents (Codex CLI, Aider, etc.)
  // These mirror the MCP tools but over HTTP
  // ============================================================================

  // Get current focus as markdown (mirrors get_focused_element)
  app.get('/api/focus', (_req: Request, res: Response) => {
    res.type('text/markdown').send(store.formatAsMarkdown());
  });

  // Wait for a new focus request (mirrors wait_for_request)
  // This is a blocking/long-polling endpoint
  app.get('/api/wait', async (req: Request, res: Response) => {
    const timeout = parseInt(req.query.timeout as string) || 300000; // 5 min default

    try {
      await store.waitForFocus(timeout);
      res.type('text/markdown').send(store.formatAsMarkdown());
    } catch (err) {
      res.status(408).json({ error: 'Timeout waiting for focus request' });
    }
  });

  // Update status (mirrors update_status)
  app.post('/api/status', (req: Request, res: Response) => {
    const { status, message } = req.body as { status: string; message?: string };

    if (!status || !['idle', 'pending', 'fixing', 'success', 'failed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be: idle, pending, fixing, success, or failed' });
      return;
    }

    const active = store.getActive();
    if (!active) {
      res.status(404).json({ error: 'No active focus' });
      return;
    }

    store.updateStatus(active.interactionId, status as any, message);
    res.json({ success: true, status, message });
  });

  // Send a thought (mirrors send_thought)
  app.post('/api/thought', (req: Request, res: Response) => {
    const { content } = req.body as { content: string };

    if (!content || typeof content !== 'string') {
      res.status(400).json({ error: 'Missing or invalid content' });
      return;
    }

    const active = store.getActive();
    if (!active) {
      res.status(404).json({ error: 'No active focus' });
      return;
    }

    store.sendThought(active.interactionId, content);
    res.json({ success: true });
  });

  // Report an action (mirrors report_action)
  app.post('/api/action', (req: Request, res: Response) => {
    const { action, target, complete } = req.body as {
      action: string;
      target: string;
      complete?: boolean;
    };

    if (!action || !['reading', 'writing', 'searching', 'thinking'].includes(action)) {
      res.status(400).json({ error: 'Invalid action. Must be: reading, writing, searching, or thinking' });
      return;
    }

    if (!target || typeof target !== 'string') {
      res.status(400).json({ error: 'Missing or invalid target' });
      return;
    }

    const active = store.getActive();
    if (!active) {
      res.status(404).json({ error: 'No active focus' });
      return;
    }

    store.reportAction(active.interactionId, action as any, target, complete ?? false);
    res.json({ success: true });
  });

  // Get focus history (mirrors get_focus_history)
  app.get('/api/history', (_req: Request, res: Response) => {
    const history = store.getHistory();

    if (history.length === 0) {
      res.type('text/markdown').send('# No Focus History\n\nNo previous focus requests.');
      return;
    }

    const summary = history
      .map((p, i) => {
        const { snapshot, snapshots, userNote } = p;
        const firstSnapshot = snapshot || (snapshots && snapshots[0]);
        if (!firstSnapshot) return `${i + 1}. **unknown** - "${userNote}"`;
        const elementCount = snapshots ? ` (${snapshots.length} elements)` : '';
        return `${i + 1}. **${firstSnapshot.framework.componentName || firstSnapshot.tagName}**${elementCount} - "${userNote}"`;
      })
      .join('\n');

    res.type('text/markdown').send(`## Focus History\n\n${summary}`);
  });

  // ============================================================================
  // SSE and Browser endpoints
  // ============================================================================

  // SSE endpoint for real-time activity updates
  app.get('/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    sseClients.add(res);

    // Send current state if there's an active focus
    const active = store.getActive();
    if (active) {
      res.write(`data: ${JSON.stringify({ type: 'focus', payload: active })}\n\n`);
    }

    const keepAlive = setInterval(() => {
      res.write(': keepalive\n\n');
    }, KEEPALIVE_INTERVAL);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });

  // Broadcast activity events to all SSE clients
  store.on('activity', (event: ActivityEvent) => {
    const message = `data: ${JSON.stringify({ type: 'activity', payload: event })}\n\n`;
    for (const client of sseClients) {
      client.write(message);
    }
  });

  app.listen(PORT, () => {
    // Server started silently
  });
}
