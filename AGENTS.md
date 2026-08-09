# angular-gsap — agent notes

Nx monorepo, pnpm 11 (corepack). Two projects:

- `libs/core` — the published package `@angular-gsap/core`. Principle: own lifecycle (scope, cleanup, signals, SSR), never wrap the GSAP API itself.
- `apps/demo` — example app: `pnpm nx serve demo`.

Commands: `pnpm nx run-many -t lint test build` (what CI runs), `pnpm nx test core`.

Conventional Commits (`feat(core): …`); releases via `nx release`.
