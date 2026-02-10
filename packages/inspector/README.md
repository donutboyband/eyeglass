# @eyeglass/inspector

Browser-side Web Component for [Eyeglass](https://github.com/donutboyband/eyeglass) visual debugging.

## Installation

Automatically configured by `npx @eyeglass/cli init`, or manually:

```bash
npm install -D @eyeglass/inspector
```

## Usage

Import in your app's entry file:

```typescript
// src/main.tsx (Vite) or app/layout.tsx (Next.js)
import '@eyeglass/inspector';
```

The inspector auto-initializes when imported and only runs in development mode.

## Features

- **Click any element** to select it for inspection
- **Multi-select** up to 5 elements
- **Framework detection** - React, Vue, Svelte component names and file paths
- **Semantic capture** - accessibility tree, computed styles, geometry
- **DOM neighborhood** - captures parent layout context (flex/grid) and children
- **Real-time feedback** - see Claude's progress in the browser
- **One-click undo** - revert changes from the hub
- **Keyboard shortcuts** - toggle inspector with `Cmd/Ctrl + Shift + E`

## How It Works

1. Hover over elements to highlight them
2. Click to select and open the request panel
3. Type what you want to change
4. Submit - your AI agent receives full context and makes the change
5. HMR updates your browser automatically

**Supported agents:** Claude Code, GitHub Copilot CLI, OpenAI Codex CLI

See the [main repo](https://github.com/donutboyband/eyeglass) for full documentation.
