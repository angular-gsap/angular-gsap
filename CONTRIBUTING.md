# Contributing to angular-gsap

Thanks for helping out! This is an Nx monorepo managed with pnpm.

## Setup

```sh
corepack enable        # or install pnpm 11 yourself
pnpm install
```

## Layout

| Path        | What it is                                      |
| ----------- | ----------------------------------------------- |
| `libs/core` | The published package, `@angular-gsap/core`     |
| `apps/demo` | The example/showcase app (`pnpm nx serve demo`) |

## Everyday commands

```sh
pnpm nx serve demo              # run the example app
pnpm nx test core               # unit tests (vitest)
pnpm nx build core              # build the publishable package
pnpm nx run-many -t lint test build   # what CI runs
```

## Guidelines

- The core principle of this library: **own lifecycle, never wrap GSAP's API.**
  PRs that re-expose `gsap.to`/`from`/`timeline` as directives or wrappers will
  be declined — that pattern goes stale against GSAP's release cadence.
- Keep `libs/core` free of dependencies beyond `@angular/*`, `gsap`, and `tslib`.
- Every behavior change needs a spec in `libs/core/src/lib/*.spec.ts`.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)
  (`feat(core): …`, `fix(demo): …`) — releases and changelogs are generated from them.

## Releasing (maintainers)

Versioning, changelog, and publishing are handled by [`nx release`](https://nx.dev/docs/features/manage-releases):

```sh
pnpm nx release --dry-run   # preview version bump + changelog
pnpm nx release             # version, changelog, tag, publish to npm
```

Publishing requires an npm token with access to the `@angular-gsap` scope.
