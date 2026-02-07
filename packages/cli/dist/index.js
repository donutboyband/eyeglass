#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
const INJECTOR_SCRIPT = `// Eyeglass Inspector Injector
// Add this script to your HTML or import in your entry file

(function() {
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = "import '@eyeglass/inspector';";
  document.head.appendChild(script);
})();
`;
const VITE_PLUGIN = `// Eyeglass Vite Plugin
// Add to your vite.config.ts plugins array

export function eyeglassPlugin() {
  return {
    name: 'eyeglass',
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === 'production') return html;
      return html.replace(
        '</body>',
        '<script type="module">import "@eyeglass/inspector";</script></body>'
      );
    },
  };
}
`;
const CLAUDE_CONFIG = `{
  "mcpServers": {
    "eyeglass": {
      "command": "npx",
      "args": ["eyeglass-bridge"]
    }
  }
}
`;
function detectProjectType() {
    const cwd = process.cwd();
    if (fs.existsSync(path.join(cwd, 'vite.config.ts')) ||
        fs.existsSync(path.join(cwd, 'vite.config.js'))) {
        return 'vite';
    }
    if (fs.existsSync(path.join(cwd, 'next.config.js')) ||
        fs.existsSync(path.join(cwd, 'next.config.mjs')) ||
        fs.existsSync(path.join(cwd, 'next.config.ts'))) {
        return 'next';
    }
    const pkgPath = path.join(cwd, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.dependencies?.['react-scripts']) {
            return 'cra';
        }
    }
    return 'unknown';
}
function init() {
    const cwd = process.cwd();
    const projectType = detectProjectType();
    console.log('\nEyeglass Init\n');
    console.log('Detected project type: ' + projectType + '\n');
    // Create .claude directory if needed
    const claudeDir = path.join(cwd, '.claude');
    if (!fs.existsSync(claudeDir)) {
        fs.mkdirSync(claudeDir, { recursive: true });
    }
    // Write MCP config
    const mcpConfigPath = path.join(claudeDir, 'settings.json');
    if (!fs.existsSync(mcpConfigPath)) {
        fs.writeFileSync(mcpConfigPath, CLAUDE_CONFIG);
        console.log('Created .claude/settings.json with MCP server config');
    }
    else {
        console.log('.claude/settings.json already exists, skipping');
    }
    // Write injector based on project type
    if (projectType === 'vite') {
        const pluginPath = path.join(cwd, 'eyeglass.plugin.ts');
        if (!fs.existsSync(pluginPath)) {
            fs.writeFileSync(pluginPath, VITE_PLUGIN);
            console.log('Created eyeglass.plugin.ts');
            console.log('\nAdd to your vite.config.ts:');
            console.log('');
            console.log('  import { eyeglassPlugin } from "./eyeglass.plugin";');
            console.log('');
            console.log('  export default defineConfig({');
            console.log('    plugins: [eyeglassPlugin(), ...otherPlugins],');
            console.log('  });');
            console.log('');
        }
    }
    else {
        const injectorPath = path.join(cwd, 'eyeglass-init.js');
        if (!fs.existsSync(injectorPath)) {
            fs.writeFileSync(injectorPath, INJECTOR_SCRIPT);
            console.log('Created eyeglass-init.js');
            console.log('\nImport in your entry file:');
            console.log('  import "./eyeglass-init";\n');
        }
    }
    console.log('\nNext steps:');
    console.log('1. Install the inspector: npm install @eyeglass/inspector');
    console.log('2. Start the bridge server: npx eyeglass-bridge');
    console.log('3. Run your dev server and hover over elements!');
    console.log('');
}
function help() {
    console.log(`
Eyeglass CLI - Visual debugging for AI agents

Commands:
  eyeglass init     Initialize Eyeglass in your project
  eyeglass help     Show this help message

For more info: https://github.com/your-org/eyeglass
`);
}
// Main
const args = process.argv.slice(2);
const command = args[0];
switch (command) {
    case 'init':
        init();
        break;
    case 'help':
    case '--help':
    case '-h':
        help();
        break;
    default:
        if (command) {
            console.error('Unknown command: ' + command + '\n');
        }
        help();
        process.exit(command ? 1 : 0);
}
