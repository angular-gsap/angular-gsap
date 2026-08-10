/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    root: __dirname,
    cacheDir: process.env['DOCS_VITE_CACHE'] ?? `../../node_modules/.vite`,
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
            '/start',
            '/directives',
            '/timeline',
            '/scroll',
            '/text',
            '/flip',
            '/pointer',
            '/drag',
            '/loop',
            '/sections',
            '/svg',
            '/webgl',
            '/reference',
            '/es',
            '/es/start',
            '/es/directives',
            '/es/timeline',
            '/es/scroll',
            '/es/text',
            '/es/flip',
            '/es/pointer',
            '/es/drag',
            '/es/loop',
            '/es/sections',
            '/es/svg',
            '/es/webgl',
            '/es/reference',
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
