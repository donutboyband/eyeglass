import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable globals for describe, it, expect
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**/*.ts'],
      exclude: ['packages/*/src/**/*.test.ts', 'packages/*/src/index.ts'],
      reporter: ['text', 'html'],
    },

    // Project configuration for different environments
    projects: [
      // Node packages (bridge, cli, types)
      {
        test: {
          name: 'node',
          include: [
            'packages/bridge/src/**/*.test.ts',
            'packages/cli/src/**/*.test.ts',
            'packages/types/src/**/*.test.ts',
          ],
          environment: 'node',
          globals: true,
        },
      },
      // Browser package (inspector)
      {
        test: {
          name: 'browser',
          include: ['packages/inspector/src/**/*.test.ts'],
          environment: 'happy-dom',
          globals: true,
        },
      },
    ],
  },
});
