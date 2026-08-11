/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/**
 * `vite build` finishes but never exits: sass-embedded's compiler keeps the
 * event loop alive (https://github.com/vitejs/vite/issues/18127). Analog runs
 * its ssr and prerender builds nested inside the client build's closeBundle,
 * and this config (plugin instances included) is reused across them, so the
 * only safe exit signal is the prerendered output existing fresh on disk:
 * that is true exactly once, after the whole pipeline is done.
 */
function exitAfterBuild(): Plugin {
  const started = Date.now();
  const marker = resolve(__dirname, '../../dist/apps/docs/analog/public/index.html');
  return {
    name: 'docs-exit-after-build',
    apply: 'build',
    enforce: 'post',
    buildApp: {
      order: 'post',
      async handler() {
        let fresh = false;
        try {
          fresh = statSync(marker).mtimeMs >= started;
        } catch {
          // prerender output missing: don't exit, something else is going on
        }
        if (fresh) {
          setTimeout(() => process.exit(0), 10);
        }
      },
    },
  };
}

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
      exitAfterBuild(),
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
