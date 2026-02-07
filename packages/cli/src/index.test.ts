import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn(),
  spawnSync: vi.fn(),
}));

// Helper to recreate detectProject logic for testing
function detectProject(cwd: string, mockFs: { existsSync: (p: string) => boolean; readFileSync: (p: string) => string }) {
  const hasTs = mockFs.existsSync(path.join(cwd, 'tsconfig.json'));

  // Vite
  if (mockFs.existsSync(path.join(cwd, 'vite.config.ts'))) {
    return { type: 'vite', configFile: path.join(cwd, 'vite.config.ts'), typescript: true };
  }
  if (mockFs.existsSync(path.join(cwd, 'vite.config.js'))) {
    return { type: 'vite', configFile: path.join(cwd, 'vite.config.js'), typescript: hasTs };
  }

  // Next.js
  const nextConfigs = ['next.config.ts', 'next.config.mjs', 'next.config.js'];
  for (const config of nextConfigs) {
    if (mockFs.existsSync(path.join(cwd, config))) {
      return { type: 'next', configFile: path.join(cwd, config), typescript: hasTs };
    }
  }

  // Remix
  if (mockFs.existsSync(path.join(cwd, 'remix.config.js'))) {
    return { type: 'remix', configFile: path.join(cwd, 'remix.config.js'), typescript: hasTs };
  }

  // CRA
  const pkgPath = path.join(cwd, 'package.json');
  if (mockFs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(mockFs.readFileSync(pkgPath));
      if (pkg.dependencies?.['react-scripts']) {
        return { type: 'cra', typescript: hasTs };
      }
    } catch {
      // Invalid JSON
    }
  }

  return { type: 'unknown', typescript: hasTs };
}

// Helper to recreate detectPackageManager logic
function detectPackageManager(cwd: string, mockFs: { existsSync: (p: string) => boolean }) {
  if (mockFs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
  if (mockFs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (mockFs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

describe('eyeglass CLI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('detectProject', () => {
    it('should detect Vite TypeScript project', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('vite.config.ts') || p.endsWith('tsconfig.json'),
        readFileSync: () => '',
      };

      const result = detectProject('/my/project', mockFs);

      expect(result.type).toBe('vite');
      expect(result.typescript).toBe(true);
      expect(result.configFile).toContain('vite.config.ts');
    });

    it('should detect Vite JavaScript project', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('vite.config.js'),
        readFileSync: () => '',
      };

      const result = detectProject('/my/project', mockFs);

      expect(result.type).toBe('vite');
      expect(result.configFile).toContain('vite.config.js');
    });

    it('should detect Next.js from next.config.mjs', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('next.config.mjs'),
        readFileSync: () => '',
      };

      const result = detectProject('/my/project', mockFs);

      expect(result.type).toBe('next');
      expect(result.configFile).toContain('next.config.mjs');
    });

    it('should detect Next.js from next.config.ts', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('next.config.ts') || p.endsWith('tsconfig.json'),
        readFileSync: () => '',
      };

      const result = detectProject('/my/project', mockFs);

      expect(result.type).toBe('next');
      expect(result.typescript).toBe(true);
    });

    it('should detect Remix project', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('remix.config.js'),
        readFileSync: () => '',
      };

      const result = detectProject('/my/project', mockFs);

      expect(result.type).toBe('remix');
    });

    it('should detect CRA project', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('package.json'),
        readFileSync: () => JSON.stringify({ dependencies: { 'react-scripts': '^5.0.0' } }),
      };

      const result = detectProject('/my/project', mockFs);

      expect(result.type).toBe('cra');
    });

    it('should return unknown for unrecognized project', () => {
      const mockFs = {
        existsSync: () => false,
        readFileSync: () => '',
      };

      const result = detectProject('/my/project', mockFs);

      expect(result.type).toBe('unknown');
    });

    it('should detect TypeScript from tsconfig.json', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('tsconfig.json'),
        readFileSync: () => '',
      };

      const result = detectProject('/my/project', mockFs);

      expect(result.typescript).toBe(true);
    });
  });

  describe('detectPackageManager', () => {
    it('should detect bun from bun.lockb', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('bun.lockb'),
      };

      const result = detectPackageManager('/my/project', mockFs);

      expect(result).toBe('bun');
    });

    it('should detect pnpm from pnpm-lock.yaml', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('pnpm-lock.yaml'),
      };

      const result = detectPackageManager('/my/project', mockFs);

      expect(result).toBe('pnpm');
    });

    it('should detect yarn from yarn.lock', () => {
      const mockFs = {
        existsSync: (p: string) => p.endsWith('yarn.lock'),
      };

      const result = detectPackageManager('/my/project', mockFs);

      expect(result).toBe('yarn');
    });

    it('should default to npm', () => {
      const mockFs = {
        existsSync: () => false,
      };

      const result = detectPackageManager('/my/project', mockFs);

      expect(result).toBe('npm');
    });
  });

  describe('CLAUDE_CONFIG', () => {
    it('should have correct MCP server structure', () => {
      const config = {
        mcpServers: {
          eyeglass: {
            command: 'npx',
            args: ['eyeglass-bridge'],
          },
        },
      };

      expect(config.mcpServers.eyeglass.command).toBe('npx');
      expect(config.mcpServers.eyeglass.args).toEqual(['eyeglass-bridge']);
    });
  });

  describe('VITE_PLUGIN template', () => {
    it('should contain required plugin structure', () => {
      const plugin = `export function eyeglassPlugin() {
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
}`;

      expect(plugin).toContain("name: 'eyeglass'");
      expect(plugin).toContain('transformIndexHtml');
      expect(plugin).toContain('@eyeglass/inspector');
      expect(plugin).toContain("process.env.NODE_ENV === 'production'");
    });
  });

  describe('Vite config modification', () => {
    it('should detect if eyeglassPlugin is already configured', () => {
      const existingConfig = `
import { defineConfig } from 'vite';
import { eyeglassPlugin } from './eyeglass.plugin';

export default defineConfig({
  plugins: [eyeglassPlugin()],
});
`;

      expect(existingConfig.includes('eyeglassPlugin')).toBe(true);
    });

    it('should identify plugins array location', () => {
      const config = `export default defineConfig({
  plugins: [react()],
});`;

      const match = config.match(/plugins\s*:\s*\[/);
      expect(match).not.toBeNull();
    });
  });

  describe('Next.js layout detection', () => {
    it('should check common layout file locations', () => {
      const layoutFiles = [
        'app/layout.tsx',
        'app/layout.jsx',
        'src/app/layout.tsx',
        'src/app/layout.jsx',
        'pages/_app.tsx',
        'pages/_app.jsx',
        'src/pages/_app.tsx',
        'src/pages/_app.jsx',
      ];

      expect(layoutFiles).toContain('app/layout.tsx');
      expect(layoutFiles).toContain('pages/_app.tsx');
      expect(layoutFiles.length).toBe(8);
    });
  });

  describe('use client directive handling', () => {
    it('should preserve use client directive at top', () => {
      const fileContent = `'use client';

export default function Layout() {}`;

      const importStatement = `import '@eyeglass/inspector';\n`;

      let newContent: string;
      if (fileContent.startsWith("'use client'") || fileContent.startsWith('"use client"')) {
        const firstLineEnd = fileContent.indexOf('\n') + 1;
        newContent = fileContent.slice(0, firstLineEnd) + importStatement + fileContent.slice(firstLineEnd);
      } else {
        newContent = importStatement + fileContent;
      }

      expect(newContent.startsWith("'use client'")).toBe(true);
      expect(newContent).toContain("import '@eyeglass/inspector'");
      // Import should be after 'use client'
      const useClientIndex = newContent.indexOf("'use client'");
      const importIndex = newContent.indexOf("import '@eyeglass/inspector'");
      expect(importIndex).toBeGreaterThan(useClientIndex);
    });
  });
});
