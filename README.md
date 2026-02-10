<p align="center">
  <img src="https://img.shields.io/npm/v/@eyeglass/cli?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs welcome" />
</p>

# 🔍 Eyeglass

**Visual debugging for AI coding agents.** Point at UI elements in your browser and tell your AI assistant what to change—without leaving your browser.

Eyeglass bridges the gap between what you *see* in your browser and what your AI coding assistant can *understand*. Select any element, describe what you want, and your agent automatically receives the context it needs to make the change.

**Supported agents:** Claude Code, GitHub Copilot CLI, OpenAI Codex CLI

---

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Browser     │     │     Bridge      │     │    AI Agent     │
│   (Inspector)   │────▶│  (MCP / HTTP)   │◀────│ Claude/Copilot/ │
└─────────────────┘     └─────────────────┘     │     Codex       │
        │                       │               └─────────────────┘
   1. Select element      2. Stores context             │
      + type request         + emits events       3. Polls for requests
        │                       │                       │
        └───────────────────────┴───────────────────────┘
                    4. Agent receives request,
                       makes changes, HMR updates browser
```

1. **You select an element** in your browser and type a request (e.g., "make this blue")
2. **The Inspector** captures semantic information: component name, file path, accessibility tree, styles
3. **The Bridge** stores this context and exposes it via MCP (Claude, Copilot) or HTTP API (Codex)
4. **Your agent** receives the full context and makes the code changes
5. **Hot reload** updates your browser automatically

---

## Quick Start

### Installation

```bash
npx @eyeglass/cli init
```

This interactive command will:
- Prompt you to select your AI agent(s): Claude Code, GitHub Copilot CLI, or OpenAI Codex CLI
- Install `@eyeglass/inspector` as a dev dependency
- Create agent-specific config files
- Configure your bundler (Vite, Next.js, CRA, or Remix)

### Usage

```bash
# 1. Start your dev server
npm run dev

# 2. Start your AI agent
claude                    # Claude Code
gh copilot               # GitHub Copilot CLI
codex                    # OpenAI Codex CLI

# 3. Tell your agent to watch for requests
> listen for eyeglass    # or "eg" / "watch eyeglass"
```

Then in your browser:
- **Click** any element to select it (multi-select up to 5)
- **Type** your request in the Eyeglass panel
- **Submit**—Claude automatically receives it and starts working

> 💡 **Tip:** You never need to leave your browser. Claude watches for requests via long-polling.

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Shift + E` | Toggle inspector on/off |

---

## Packages

| Package | Description | Size | npm |
|---------|-------------|------|-----|
| `@eyeglass/cli` | CLI for project initialization | — | [![npm](https://img.shields.io/npm/v/@eyeglass/cli?style=flat-square)](https://www.npmjs.com/package/@eyeglass/cli) |
| `@eyeglass/inspector` | Browser-side Web Component | ~57kb | [![npm](https://img.shields.io/npm/v/@eyeglass/inspector?style=flat-square)](https://www.npmjs.com/package/@eyeglass/inspector) |
| `@eyeglass/bridge` | MCP server connecting browser to Claude | — | [![npm](https://img.shields.io/npm/v/@eyeglass/bridge?style=flat-square)](https://www.npmjs.com/package/@eyeglass/bridge) |
| `@eyeglass/types` | Shared TypeScript definitions | — | [![npm](https://img.shields.io/npm/v/@eyeglass/types?style=flat-square)](https://www.npmjs.com/package/@eyeglass/types) |

---

## Supported Frameworks

| Framework | Auto-Detection | Component Names | File Paths |
|-----------|:--------------:|:---------------:|:----------:|
| React     | ✓              | ✓               | ✓ (dev)    |
| Vue 2/3   | ✓              | ✓               | ✓          |
| Svelte    | ✓              | ✓               | —          |
| Vanilla   | ✓              | —               | —          |

Eyeglass works with **any framework**. For React, Vue, and Svelte, it extracts component names and file paths from framework internals. For vanilla JS or unsupported frameworks, it provides element identifiers (id, classes, data attributes) that Claude can use to locate the element.

---

## Agent Integration

### MCP Tools (Claude Code, Copilot CLI)

The bridge exposes these tools via Model Context Protocol:

| Tool | Description |
|------|-------------|
| `get_focused_element` | Get the current element context as markdown |
| `update_status` | Update the browser UI with progress |
| `send_thought` | Share reasoning with the user |
| `report_action` | Report file operations (reading, writing) |
| `ask_question` | Ask the user a clarifying question |
| `wait_for_request` | Long-poll for new requests |
| `get_focus_history` | Get previously focused elements |

### HTTP API (OpenAI Codex CLI)

For agents that don't support MCP, the bridge also exposes a REST API:

| Endpoint | Description |
|----------|-------------|
| `GET /api/focus` | Get current focus as markdown |
| `GET /api/wait` | Long-poll for new requests |
| `POST /api/status` | Update status |
| `POST /api/thought` | Send thought |
| `POST /api/action` | Report action |
| `GET /api/history` | Get focus history |

---

## Git Integration

Eyeglass automatically tracks changes using Git, making it easy to review and undo AI-generated modifications.

### How It Works

1. **Auto-commit on success** — When Claude marks a request as complete (`update_status("success")`), Eyeglass automatically:
   - Stages all changes (`git add -A`)
   - Creates a commit with a tagged message: `[eyeglass:<interaction-id>] <message>`

2. **One-click undo** — In the Eyeglass hub (bottom-left of your browser), completed requests show an undo button (↩). Clicking it:
   - Finds the commit by its interaction ID
   - Runs `git revert --no-edit <commit>` to cleanly undo the changes
   - Creates a new revert commit (preserving history)

3. **Settings** — Click the gear icon (⚙) in the hub to access settings:
   - **Auto-commit toggle** — Enable/disable automatic commits (persisted in localStorage)

### Example Git History

```
* a1b2c3d (HEAD) Revert "[eyeglass:abc123] Made button blue"
* f4e5d6c [eyeglass:abc123] Made button blue
* 9g8h7i6 [eyeglass:xyz789] Fixed header padding
* previous commits...
```

### Requirements

- Your project must be a Git repository
- There must be uncommitted changes when Claude completes a task
- Git must be available in your PATH

### Notes

- Auto-commit is **enabled by default** but can be toggled off in settings
- If you're not in a Git repo, Eyeglass silently skips committing (no errors)
- Empty changes (no files modified) are not committed
- Undo only works for changes that were committed by Eyeglass
- Each interaction gets a unique ID, so you can undo specific changes without affecting others

---

## Configuration

### Agent Config Files

Eyeglass creates agent-specific config files based on your selection:

<details>
<summary><strong>Claude Code</strong> — <code>.claude/settings.json</code></summary>

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

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <code>.copilot/mcp-config.json</code></summary>

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

</details>

<details>
<summary><strong>OpenAI Codex CLI</strong> — <code>.codex/eyeglass.md</code></summary>

Creates a markdown file with HTTP API instructions for Codex to follow.

</details>

### Vite

```typescript
// src/main.tsx (or main.ts)
import '@eyeglass/inspector';
```

### Next.js

```typescript
// app/layout.tsx
import '@eyeglass/inspector';
```

### Manual Setup

<details>
<summary>Click to expand manual setup instructions</summary>

If automatic setup doesn't work for your project:

1. Install the inspector:
   ```bash
   npm install -D @eyeglass/inspector
   ```

2. Import it in your entry file:
   ```typescript
   import '@eyeglass/inspector';
   ```

3. Create `.claude/settings.json`:
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

</details>

---

## Semantic Snapshot

When you select an element, Eyeglass captures comprehensive context:

<details>
<summary>View full TypeScript interface</summary>

```typescript
interface SemanticSnapshot {
  // Element identification
  role: string;           // ARIA role (button, link, textbox, etc.)
  name: string;           // Accessible name
  tagName: string;        // HTML tag
  id?: string;            // Element ID
  className?: string;     // CSS classes
  dataAttributes?: Record<string, string>;

  // Framework context
  framework: {
    name: 'react' | 'vue' | 'svelte' | 'vanilla';
    componentName?: string;   // e.g., "SubmitButton"
    filePath?: string;        // e.g., "src/components/SubmitButton.tsx"
    lineNumber?: number;
    props?: Record<string, unknown>;
    ancestry?: string[];      // Parent component chain
  };

  // Accessibility
  a11y: {
    label: string | null;
    description: string | null;
    disabled: boolean;
    expanded?: boolean;
    checked?: boolean | 'mixed';
    hidden: boolean;
  };

  // Layout
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
  };

  // Styles
  styles: {
    display: string;
    position: string;
    flexDirection?: string;
    gridTemplate?: string;
    padding: string;
    margin: string;
    color: string;
    backgroundColor: string;
    fontFamily: string;
    zIndex: string;
  };

  // DOM Neighborhood (layout context)
  neighborhood?: {
    parents: Array<{
      tagName: string;
      className?: string;
      styles: {
        display: string;
        position: string;
        flexDirection?: string;
        alignItems?: string;
        justifyContent?: string;
        gap?: string;
        gridTemplate?: string;
      };
    }>;
    children: Array<{
      tagName: string;
      className?: string;
      count?: number;
    }>;
  };

  // Metadata
  timestamp: number;
  url: string;
}
```

</details>

---

## Development

### Setup

```bash
git clone https://github.com/donutboyband/eyeglass.git
cd eyeglass
npm install
npm run build
```

### Testing

```bash
npx vitest            # Watch mode
npx vitest run        # Single run
npx vitest --coverage # With coverage
```

### Project Structure

```
eyeglass/
├── packages/
│   ├── bridge/       # MCP server
│   │   └── src/
│   │       ├── index.ts    # Entry point
│   │       ├── mcp.ts      # MCP tool handlers
│   │       ├── http.ts     # Express server (SSE, REST)
│   │       └── store.ts    # State management
│   ├── cli/          # CLI tool
│   │   └── src/
│   │       └── index.ts    # Commands and project detection
│   ├── inspector/    # Browser component
│   │   └── src/
│   │       ├── index.ts        # Entry + auto-init
│   │       ├── inspector.ts    # Web Component UI
│   │       ├── snapshot.ts     # DOM snapshot capture
│   │       └── fiber-walker.ts # React/Vue/Svelte detection
│   └── types/        # Shared types
│       └── src/
│           └── index.ts    # TypeScript interfaces
├── vitest.config.ts  # Test configuration
└── package.json      # Workspace root
```

---

## Troubleshooting

<details>
<summary><strong>Inspector not appearing</strong></summary>

1. Ensure you're in development mode—the inspector automatically disables itself when `NODE_ENV === 'production'`
2. Check that `@eyeglass/inspector` is imported before your app renders
3. Look for console errors related to the inspector

> **Note:** The CLI sets up dynamic imports for optimal tree-shaking in production. If you set up manually with a static import, the inspector code will be in your bundle but won't execute in production.

</details>

<details>
<summary><strong>Agent not receiving requests</strong></summary>

1. Verify the agent config file exists:
   - Claude: `.claude/settings.json`
   - Copilot: `.copilot/mcp-config.json`
   - Codex: `.codex/eyeglass.md`
2. Restart your agent to pick up config changes
3. Run `listen for eyeglass` or `eg` to start listening

</details>

<details>
<summary><strong>Component names not showing</strong></summary>

- **React:** Requires development builds with source maps
- **Vue:** Ensure `__name` or `name` is set on components
- **Svelte:** Detection is limited to class names

</details>

<details>
<summary><strong>File paths not showing</strong></summary>

File paths require framework-specific debug information:
- **React:** `_debugSource` (available in dev mode with certain bundler configs)
- **Vue:** `__file` property on component definitions

</details>

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/*`)
3. Make your changes with tests
4. Commit your changes (`git commit -m 'Hello feature'`)
5. Push to the branch (`git push origin feature/*`)
6. Open a Pull Request

---

## License

MIT © [donutboyband](https://github.com/donutboyband)
