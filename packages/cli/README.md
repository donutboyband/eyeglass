# @eyeglass/cli

CLI for initializing [Eyeglass](https://github.com/donutboyband/eyeglass) in your project.

## Usage

```bash
npx @eyeglass/cli init
```

This will interactively prompt you to select which AI coding agents to configure:
- **Claude Code** - stdio MCP (`.claude/settings.json`)
- **GitHub Copilot CLI** - local MCP (`.copilot/mcp-config.json`)
- **OpenAI Codex CLI** - HTTP API (`.codex/eyeglass.md`)

## Options

```bash
# Interactive setup (prompts for agent selection)
npx @eyeglass/cli init

# Configure specific agents
npx @eyeglass/cli init --claude           # Claude Code only
npx @eyeglass/cli init --copilot          # GitHub Copilot CLI only
npx @eyeglass/cli init --codex            # OpenAI Codex only
npx @eyeglass/cli init --claude --copilot # Multiple agents

# Other options
npx @eyeglass/cli init --dry-run      # Preview changes without making them
npx @eyeglass/cli init --skip-install # Skip installing @eyeglass/inspector
npx @eyeglass/cli help                # Show help
```

## What It Does

1. **Installs** `@eyeglass/inspector` as a dev dependency
2. **Creates** agent-specific config files:
   - Claude: `.claude/settings.json` + `.claude/skills/eyeglass.md`
   - Copilot CLI: `.copilot/mcp-config.json`
   - Codex: `.codex/eyeglass.md` (HTTP API instructions)
3. **Configures** your bundler (Vite, Next.js, CRA, or Remix) with tree-shakeable dynamic imports

The inspector is automatically excluded from production builds—no extra configuration needed.

## Supported Frameworks

| Framework | Auto-Detection | Component Names | File Paths |
|-----------|:--------------:|:---------------:|:----------:|
| Vite      | ✓              | ✓               | ✓          |
| Next.js   | ✓              | ✓               | ✓          |
| CRA       | ✓              | ✓               | ✓          |
| Remix     | ✓              | ✓               | ✓          |

## After Setup

1. Start your dev server (`npm run dev`)
2. Start the Eyeglass bridge: `npx eyeglass-bridge`
3. Start your AI coding agent:
   - **Claude Code**: Run `claude` and say "watch eyeglass" or "/eyeglass"
   - **Copilot CLI**: Run `gh copilot` in your project directory
   - **Codex**: See `.codex/eyeglass.md` for HTTP API usage
4. Select elements in your browser and submit requests!

See the [main repo](https://github.com/donutboyband/eyeglass) for full documentation.
