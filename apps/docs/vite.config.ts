/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    root: __dirname,
    cacheDir: `../../node_modules/.vite`,
    base: process.env['DOCS_BASE'] ?? '/',
    build: {
      outDir: '../../dist/apps/docs/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
    plugins: [
      analog({
        static: true,
        prerender: {
          routes: [
            '/',
            '/basics',
            '/directives',
            '/timeline',
            '/scroll',
            '/text',
            '/flip',
          ],
        },
        content: {
          highlighter: 'shiki',
          shikiOptions: {
            highlight: { theme: 'github-dark' },
          },
        },
        vite: {
          inlineStylesExtension: 'scss',
        },
      }),
      nxViteTsPaths(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
  };
});
