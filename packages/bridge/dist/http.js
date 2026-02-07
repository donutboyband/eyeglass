import express from 'express';
import cors from 'cors';
import { store } from './store.js';
const PORT = 3300;
const KEEPALIVE_INTERVAL = 30000;
export function startHttpServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    const sseClients = new Set();
    // Health check
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', active: store.getActive() !== null });
    });
    // Browser posts focus payload here
    app.post('/focus', (req, res) => {
        const payload = req.body;
        if (!payload.interactionId || !payload.snapshot || !payload.userNote) {
            res.status(400).json({ error: 'Invalid payload' });
            return;
        }
        store.setFocus(payload);
        res.json({ success: true, interactionId: payload.interactionId });
    });
    // Browser posts answer to a question
    app.post('/answer', (req, res) => {
        const answer = req.body;
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
    // SSE endpoint for real-time activity updates
    app.get('/events', (req, res) => {
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
    store.on('activity', (event) => {
        const message = `data: ${JSON.stringify({ type: 'activity', payload: event })}\n\n`;
        for (const client of sseClients) {
            client.write(message);
        }
    });
    app.listen(PORT, () => {
        // Server started silently
    });
}
