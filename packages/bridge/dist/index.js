#!/usr/bin/env node
import { startHttpServer } from './http.js';
import { startMcpServer } from './mcp.js';
async function main() {
    // Start MCP server first (stdio) so health checks succeed immediately
    await startMcpServer();
    // Then start HTTP server for browser communication
    startHttpServer();
}
main().catch((err) => {
    console.error('[eyeglass] Fatal error:', err);
    process.exit(1);
});
