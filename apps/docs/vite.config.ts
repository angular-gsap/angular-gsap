/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

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
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      port: 4300,
      fs: {
        allow: ['.'],
      },
    },
    plugins: [
      analog({
        // vite now runs from the project dir (inferred targets); keep nitro
        // and the router globs anchored to the workspace root
        workspaceRoot: resolve(__dirname, '../..'),
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
            '/radial',
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
            '/es/radial',
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
    ],
    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
  };
});
