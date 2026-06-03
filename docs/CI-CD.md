# CI/CD and quality gates (human overview)

This project uses GitHub Actions to keep the site healthy, fast, and safe across every push and pull request.
For deep operational details, see `.context/OPERATIONS.md`.

## Pipelines at a glance

| Workflow file | When it runs | What it does |
|---|---|---|
| `ci-tests.yml` | PR and push to `main` | Installs deps, runs unit/integration tests and lint |
| `contract-tests.yml` | PR and push to `main` | Validates integration and API contract assumptions |
| `quality-gate.yml` | PR and push to `main` | Full quality check (see below) |
| `lighthouse-ci.yml` | PR and push to `main` | Lighthouse performance and accessibility checks |
| `deploy-frontend.yml` | Push to `main` | Builds React app and deploys to VPS via rsync |
| `deploy-backend.yml` | Push to `main` | Deploys WordPress theme, plugins, and backend assets to VPS |

## Quality gate in detail

The `quality-gate.yml` workflow is the main quality check. It runs:

1. `npm run type-check` — TypeScript type verification
2. `npm run i18n:check` — i18n parity between locales
3. `npm run utf8:check` — UTF-8 content validation
4. `npm run generate-sitemaps` — generates sitemaps before build
5. `npm run build` — production Vite build
6. `npm run perf:budget` — validates bundle performance budget
7. Build artifact validation — ensures `dist/index.html`, `.vite/manifest.json`, sitemaps, and `robots.txt` exist and reference `https://djzeneyer.com`

If it fails, a `dist/` artifact is uploaded for debugging.

## Daily deploy

Daily prerender is the intended cadence for the current content model. Events are refreshed by the BIT plugin, WordPress content is low-volume, and most authority pages are evergreen. Improve freshness with monitoring and invariant checks, not by increasing deploy frequency without a concrete freshness problem.

`deploy-frontend.yml` runs every day at 04:00 UTC via cron. This triggers a full prerender and deploy, which refreshes event data, sitemaps, and all pre-rendered pages automatically. The quality gate runs only on code changes (push/PR) — it does not run daily, since the daily deploy already handles freshness.

## Developer workflow

1. Create a branch from `main` — use prefixes `feature/*`, `fix/*`, or `chore/*`.
2. Push commits and open a pull request.
3. All CI pipelines must pass before merging.
4. After merge to `main`, deploy pipelines publish frontend and backend automatically.

## Environment and secrets

- Secrets (SSH keys, VPS credentials) are stored in GitHub Secrets, never in code.
- The quality gate uses public env vars (`SITE_BASE_URL`, `VITE_WP_SITE_URL`, `VITE_WP_REST_URL`) since it only builds and validates — no deploy credentials needed.
