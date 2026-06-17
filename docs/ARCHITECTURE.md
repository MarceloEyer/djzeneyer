# Architecture (human overview)

This document gives a human-friendly overview of how the DJ Zen Eyer site is put together.
For the canonical context hierarchy, always follow `AI_CONTEXT_INDEX.md`.

## High-level model

- **Product**: Official web presence for DJ Zen Eyer — authority hub for search and AI, fan community, and e-commerce surface.
- **Runtime split**:
  - WordPress + custom plugins provide content, events, gamification, SEO metadata, and APIs.
  - React SPA (Vite + React Router) renders the public and authenticated UX.
- **Rendering**:
  - Public routes are pre-rendered at build time for SEO, GEO, AEO, and Knowledge Panel signals.
  - Client-side routing handles navigation and interactive experiences.

## Code layout

| Path | Role |
|---|---|
| `src/` | React SPA — routes, hooks, i18n, components, SEO helpers, schemas, types, utils |
| `public/` | Static assets and machine-readable surfaces (`robots.txt`, sitemaps, `llms.txt`, `.well-known/*`) |
| `inc/` | WordPress theme bootstrap, REST routes, AI discovery endpoints, CSP wiring |
| `plugins/` | Custom WordPress plugins for auth, events, SEO, and gamification |
| `gamipress/` | GamiPress template overrides for DJ-branded emails and UI |
| `scripts/` | Build, prerender, sitemap, markdown generation, IndexNow, DNS-AID, validation utilities |
| `.agents/` | AI agent personas and reusable skills |
| `.context/` | Shared technical and product context documents (canonical source for AI and contributors) |
| `.human/` | Human-facing backlog, audits, and off-repo action plans |
| `docs/` | Human-facing documentation like this file |

## Key plugins

- `zeneyer-auth` — login, session, JWT, Google OAuth, newsletter, orders.
- `zen-bit` — events, schema, and event cache (single source of truth for events).
- `zen-seo-lite` — metadata, canonical, sitemap, and schema.
- `zengame` — points, ranking, achievements, and dashboard.

## Headless WordPress contract

- The frontend talks to WordPress via REST/JSON configured in `src/config/` and environment variables.
- Types in `src/types/` and schemas in `src/schemas/` define expected shapes of WordPress data.
- SEO helpers in `src/seo/` and i18n in `src/i18n.ts` + `src/locales/` keep metadata and content consistent across locales.
- Hooks in `src/hooks/` centralise all data fetching — components do not call APIs directly.

## Sources of truth

- Context hierarchy: `AI_CONTEXT_INDEX.md`
- Technical rules: `.agents/GUIDELINES.md`
- Public identity: `.context/IDENTITY.md` and `src/data/artistData.ts`
- Routes: `src/config/routes-slugs.json` and `src/config/routes.ts`
- Operations and deploy: `.context/OPERATIONS.md`
- Page strategy: `.context/SITE_PAGES_STRATEGY.md`
- Consolidated learnings: `LEARNINGS.md`

> If docs and code disagree, the code wins. For the full architectural detail, see `.context/ARCHITECTURE.md`.
