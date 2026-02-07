# @eyeglass/cli

CLI for initializing [Eyeglass](https://github.com/donutboyband/eyeglass) in your project.

## Usage

```bash
npx @eyeglass/cli init
```

This single command will:

1. **Install** `@eyeglass/inspector` as a dev dependency
2. **Create** `.claude/settings.json` with MCP server configuration
3. **Configure** your bundler (Vite, Next.js, CRA, or Remix)

## Options

```bash
npx @eyeglass/cli init --dry-run      # Preview changes without making them
npx @eyeglass/cli init --skip-install # Skip installing @eyeglass/inspector
npx @eyeglass/cli help                # Show help
```

## Supported Frameworks

| Framework | Auto-Detection | Component Names | File Paths |
|-----------|:--------------:|:---------------:|:----------:|
| Vite      | ✓              | ✓               | ✓          |
| Next.js   | ✓              | ✓               | ✓          |
| CRA       | ✓              | ✓               | ✓          |
| Remix     | ✓              | ✓               | ✓          |

## After Setup

1. Start your dev server (`npm run dev`)
2. Run `claude` in your project directory
3. Tell Claude: `watch eyeglass` or `eg`
4. Select elements in your browser and submit requests!

See the [main repo](https://github.com/donutboyband/eyeglass) for full documentation.
