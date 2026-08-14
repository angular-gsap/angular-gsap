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
| `apps/docs` | Docs & examples app, built with Analog (`pnpm nx serve docs`) |

## Everyday commands

```sh
pnpm nx serve docs              # run the docs/examples app (Analog)
pnpm nx test core               # unit tests (vitest)
pnpm nx build core              # build the publishable package
pnpm nx run-many -t lint test build   # what CI runs
```

## Guidelines

- The core principle of this library: **own lifecycle, never wrap GSAP's API.**
  PRs that re-expose `gsap.to`/`from`/`timeline` as directives or wrappers will
  be declined; that pattern goes stale against GSAP's release cadence.
- Keep `libs/core` free of dependencies beyond `@angular/*`, `gsap`, and `tslib`.
- Every behavior change needs a spec in `libs/core/src/lib/*.spec.ts`.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)
  (`feat(core): …`, `fix(docs): …`). Releases and changelogs are generated from them.

## Releasing (maintainers)

Versioning and changelog are handled by [`nx release`](https://nx.dev/docs/features/manage-releases); publishing to npm happens in CI:

```sh
pnpm nx release --skip-publish --dry-run   # preview version bump + changelog
pnpm nx release --skip-publish             # version, changelog, tag, GitHub release
```

Publishing the GitHub release triggers `.github/workflows/release.yml`, which
publishes to npm via [trusted publishing](https://docs.npmjs.com/trusted-publishers)
(OIDC): no npm token exists anywhere. The trusted publisher is registered on
the package's npm settings (this repo + `release.yml`).

The very first publish can't use this path (npm only lets you register a
trusted publisher on a package that already exists), so release 0.1.0 was
published locally with `pnpm nx release --first-release` and an `npm login`
session.
