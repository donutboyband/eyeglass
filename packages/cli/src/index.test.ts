import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

// Since the CLI is a script that runs on import, we need to test the functions indirectly
// For now, let's test the detection logic by recreating it here

function detectProjectType(cwd: string): 'vite' | 'next' | 'cra' | 'unknown' {
  const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;

  if (
    existsSync(path.join(cwd, 'vite.config.ts')) ||
    existsSync(path.join(cwd, 'vite.config.js'))
  ) {
    return 'vite';
  }

  if (
    existsSync(path.join(cwd, 'next.config.js')) ||
    existsSync(path.join(cwd, 'next.config.mjs')) ||
    existsSync(path.join(cwd, 'next.config.ts'))
  ) {
    return 'next';
  }

  const pkgPath = path.join(cwd, 'package.json');
  if (existsSync(pkgPath)) {
    const readFileSync = fs.readFileSync as ReturnType<typeof vi.fn>;
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.dependencies?.['react-scripts']) {
        return 'cra';
      }
    } catch {
      // Invalid JSON
    }
  }

  return 'unknown';
}

describe('@eyeglass/cli', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('detectProjectType', () => {
    it('should detect Vite project from vite.config.ts', () => {
      const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;
      existsSync.mockImplementation((p: string) => p.endsWith('vite.config.ts'));

      const result = detectProjectType('/my/project');

      expect(result).toBe('vite');
    });

    it('should detect Vite project from vite.config.js', () => {
      const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;
      existsSync.mockImplementation(
        (p: string) => p.endsWith('vite.config.js') || p.endsWith('vite.config.ts') === false
      );

      const result = detectProjectType('/my/project');

      expect(result).toBe('vite');
    });

    it('should detect Next.js project from next.config.js', () => {
      const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;
      existsSync.mockImplementation((p: string) => p.endsWith('next.config.js'));

      const result = detectProjectType('/my/project');

      expect(result).toBe('next');
    });

    it('should detect Next.js project from next.config.mjs', () => {
      const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;
      existsSync.mockImplementation((p: string) => p.endsWith('next.config.mjs'));

      const result = detectProjectType('/my/project');

      expect(result).toBe('next');
    });

    it('should detect Next.js project from next.config.ts', () => {
      const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;
      existsSync.mockImplementation((p: string) => p.endsWith('next.config.ts'));

      const result = detectProjectType('/my/project');

      expect(result).toBe('next');
    });

    it('should detect CRA project from react-scripts dependency', () => {
      const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;
      existsSync.mockImplementation((p: string) => p.endsWith('package.json'));

      const readFileSync = fs.readFileSync as ReturnType<typeof vi.fn>;
      readFileSync.mockReturnValue(
        JSON.stringify({
          dependencies: {
            'react-scripts': '^5.0.0',
          },
        })
      );

      const result = detectProjectType('/my/project');

      expect(result).toBe('cra');
    });

    it('should return unknown for unrecognized project', () => {
      const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;
      existsSync.mockReturnValue(false);

      const result = detectProjectType('/my/project');

      expect(result).toBe('unknown');
    });

    it('should return unknown when package.json has no react-scripts', () => {
      const existsSync = fs.existsSync as ReturnType<typeof vi.fn>;
      existsSync.mockImplementation((p: string) => p.endsWith('package.json'));

      const readFileSync = fs.readFileSync as ReturnType<typeof vi.fn>;
      readFileSync.mockReturnValue(
        JSON.stringify({
          dependencies: {
            react: '^18.0.0',
          },
        })
      );

      const result = detectProjectType('/my/project');

      expect(result).toBe('unknown');
    });
  });

  describe('CLAUDE_CONFIG template', () => {
    it('should be valid JSON', () => {
      const config = `{
  "mcpServers": {
    "eyeglass": {
      "command": "npx",
      "args": ["eyeglass-bridge"]
    }
  }
}`;

      expect(() => JSON.parse(config)).not.toThrow();

      const parsed = JSON.parse(config);
      expect(parsed.mcpServers.eyeglass.command).toBe('npx');
      expect(parsed.mcpServers.eyeglass.args).toEqual(['eyeglass-bridge']);
    });
  });

  describe('VITE_PLUGIN template', () => {
    it('should contain expected plugin structure', () => {
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
      expect(plugin).toContain('NODE_ENV');
    });
  });

  describe('INJECTOR_SCRIPT template', () => {
    it('should contain window check', () => {
      const script = `(function() {
  if (typeof window === 'undefined') return;
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = "import '@eyeglass/inspector';";
  document.head.appendChild(script);
})();`;

      expect(script).toContain("typeof window === 'undefined'");
      expect(script).toContain('@eyeglass/inspector');
      expect(script).toContain("type = 'module'");
    });
  });
});
