# @eyeglass/bridge

Server that connects the browser inspector to AI coding agents for [Eyeglass](https://github.com/donutboyband/eyeglass).

**Supported agents:** Claude Code, GitHub Copilot CLI, OpenAI Codex CLI

## Installation

Automatically configured by `npx @eyeglass/cli init`, or manually:

```bash
npm install @eyeglass/bridge
```

## Usage

The bridge runs as an MCP server (Claude, Copilot) or HTTP server (Codex).

**MCP config** (`.claude/settings.json` or `.copilot/mcp-config.json`):

```json
{
  "mcpServers": {
    "eyeglass": {
      "command": "npx",
      "args": ["eyeglass-bridge"]
    }
  }
}
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `get_focused_element` | Get current element context as markdown |
| `update_status` | Update browser UI with progress |
| `send_thought` | Share reasoning with the user |
| `report_action` | Report file operations |
| `ask_question` | Ask user a clarifying question |
| `wait_for_request` | Long-poll for new requests |
| `get_focus_history` | Get previously focused elements |

## HTTP API (for Codex)

| Endpoint | Description |
|----------|-------------|
| `GET /api/focus` | Get current focus as markdown |
| `GET /api/wait` | Long-poll for new requests |
| `POST /api/status` | Update status |
| `POST /api/thought` | Send thought |
| `POST /api/action` | Report action |

## Features

- **Rich context** - element info, accessibility, styles, and DOM neighborhood (parent layout context)
- **Auto-commits** changes on success with `[eyeglass:<id>]` tags
- **One-click undo** via `git revert`
- **Real-time updates** via Server-Sent Events

See the [main repo](https://github.com/donutboyband/eyeglass) for full documentation.
