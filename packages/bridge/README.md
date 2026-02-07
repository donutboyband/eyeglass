# @eyeglass/bridge

MCP server that connects the browser inspector to Claude Code for [Eyeglass](https://github.com/donutboyband/eyeglass).

## Installation

Automatically configured by `npx @eyeglass/cli init`, or manually:

```bash
npm install @eyeglass/bridge
```

## Usage

The bridge runs as an MCP server. Add to `.claude/settings.json`:

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

## Features

- **Auto-commits** changes on success with `[eyeglass:<id>]` tags
- **One-click undo** via `git revert`
- **Real-time updates** via Server-Sent Events

See the [main repo](https://github.com/donutboyband/eyeglass) for full documentation.
