# DJ Zen Eyer

Official repository for `https://djzeneyer.com`.

Headless WordPress + React SPA. The repository is organized for both humans and AI agents, with explicit context layers to reduce drift, duplicate instructions, and accidental product-rule changes.

## Project view

- Public site: DJ Zen Eyer official web presence, authority hub, e-commerce surface, and fan/community platform.
- Runtime split: WordPress and custom plugins provide content, auth, events, gamification, SEO metadata, and APIs; React renders the public and authenticated user experience.
- Rendering model: public routes are pre-rendered at build time for SEO, GEO, AEO, Knowledge Panel signals, and fast first paint.
- AI/product stance: public content is intentionally available for search, grounding, discovery, and AI training unless a specific page or asset says otherwise.

## Context architecture

Canonical context follows this order:

1. Real code and runtime behavior.
2. `AI_CONTEXT_INDEX.md` for context hierarchy and map.
3. `.agents/GUIDELINES.md` for technical laws.
4. `.context/IDENTITY.md` for public identity, naming, and pronunciation.
5. `.context/*.md` for technical/domain context.
6. `LEARNINGS.md` for consolidated operational learnings.
7. `.human/*.md` for human backlog and non-automated action plans.

Agent-specific files are entry points or local overlays, not higher sources of truth.

## Repository shape

This repository is a hybrid WordPress theme + React SPA workspace:

- `src/` contains the React application.
- `public/` contains public assets, AI discovery files, SEO files, and static files copied into the final build.
- `inc/` contains theme bootstrap, CSP, AI discovery endpoints, and lightweight theme routes.
- `plugins/` contains custom WordPress plugins.
- `gamipress/` contains GamiPress template overrides when email branding needs to be customized.
- `scripts/` contains build, prerender, sitemap, markdown generation, IndexNow, DNS-AID, and validation scripts.
- `.agents/` contains agent personas and reusable skills.
- `.context/` contains shared technical and product context for agents.
- `.human/` contains human-facing backlog, audits, and off-repo action plans.
- `docs/` contains supporting operational documentation.
- `tmp/` and temporary root files are working artifacts and should stay out of Git.
- Files that must be served from the site root in production should originate in `public/` and be published from there, not duplicated at the repository root.

## Stack

Check `package.json`, lockfiles, and deployment workflows before assuming exact versions.

| Layer | Current family |
|---|---|
| Frontend | React 19, TypeScript 6, Vite 8, Tailwind 4, React Query v5, React Router 7, i18next |
| Build | ESLint, Prettier, Puppeteer prerender, OXC via Vite 8 |
| Backend | WordPress 6.9+, PHP 8.3+, WooCommerce with HPOS, GamiPress |
| Infra | Hostinger VPS, LiteSpeed, Cloudflare, GitHub Actions |

## Main areas

- `src/` - React frontend
- `inc/` - theme bootstrap and theme REST routes
- `plugins/` - custom WordPress plugins
- `scripts/` - build, prerender, sitemap, markdown, AI discovery, and validation scripts
- `.agents/` - agent personas and skills
- `.context/` - shared context and domain documentation
- `.human/` - human backlog and audits
- `docs/` - supporting operational documentation

## Key docs

- [AI_CONTEXT_INDEX.md](AI_CONTEXT_INDEX.md)
- [AGENTS.md](AGENTS.md)
- [.agents/GUIDELINES.md](.agents/GUIDELINES.md)
- [.agents/personas/CLAUDE.md](.agents/personas/CLAUDE.md)
- [.agents/personas/GEMINI.md](.agents/personas/GEMINI.md)
- [.context/PROJECT.md](.context/PROJECT.md)
- [.context/ARCHITECTURE.md](.context/ARCHITECTURE.md)
- [.context/OPERATIONS.md](.context/OPERATIONS.md)
- [.context/SITE_PAGES_STRATEGY.md](.context/SITE_PAGES_STRATEGY.md)
- [LEARNINGS.md](LEARNINGS.md)
- [SECURITY.md](SECURITY.md)

## Local validation

```bash
npm install
npm run dev
npm run lint
npm run type-check
npm run build
```

For SEO, prerender, markdown, and sitemap validation, prefer:

```bash
npm run build:full
npm run i18n:check
npm run utf8:check
npm run perf:budget
```

## Delivery

- `npm run build:full` produces sitemaps, the Vite build, prerendered HTML, and generated Markdown assets.
- GitHub Actions publishes the generated frontend and relevant public assets to the VPS deployment target.
- Public machine-readable resources such as `llms.txt`, `llms-full.txt`, `.well-known/*`, and `robots.txt` are intentional product surfaces for AI/search discovery.

## Rule

If docs and code disagree, the code wins. If two docs disagree, follow `AI_CONTEXT_INDEX.md` and then promote the correction to the appropriate context file.