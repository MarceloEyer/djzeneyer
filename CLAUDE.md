# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DJ Zen Eyer (`djzeneyer.com`) is the official web presence for Brazilian Zouk DJ artist Zen Eyer. It is a **headless WordPress + React SPA** — the React frontend is pre-rendered at build time (SSG) and deployed as a WordPress theme, making it bilingual (EN/PT) and SEO-optimized.

**Identity SSOT:** The artist's name is **Zen Eyer** (canonical) / **DJ Zen Eyer** (alias). Never spell it "Zen Ayer".

## Commands

```bash
npm run dev            # Start Vite dev server
npm run build          # TypeScript check + Vite build
npm run build:full     # Sitemaps + build + prerender + markdown gen (what CI runs)
npm run lint           # ESLint
npm run type-check     # TypeScript validation only
npm run format         # Prettier
npm run i18n:check     # Validate EN/PT translation parity
npm run prerender      # SSG pre-rendering via Puppeteer (run after build)
npm run generate-sitemaps  # Generate sitemap.xml
```

Code must pass `npm run lint` and `npm run build` before any push. Always use `npm` — never `pnpm`.

## Architecture

### Frontend (`src/`)

React 19 + TypeScript 6 (strict) + Vite 8 + Tailwind 4 + React Query v5 + React Router 7 + i18next.

- **Entry:** `src/main.tsx` → `src/App.tsx` → `src/components/AppRoutes.tsx`
- **Routing SSOT:** `src/config/routes-slugs.json` — edit only this file to change routes. Never hardcode paths; use `getLocalizedRoute('key', lang)`.
- **Data fetching SSOT:** `src/hooks/useQueries.ts` — all API calls go through here via React Query. Never use `fetch()` directly in components when a hook is available.
- **API config:** `src/config/api.ts` — endpoint definitions and client config.
- **Auth state:** `UserContext` in `src/contexts/UserContext.tsx`. Use `loadingInitial` (not `loading`) for private route guards. `loadingInitial` is true until session is restored; `loading` is false by default and causes white-screen on hard refresh if used as a guard.
- **i18n:** All visible strings must use `t('key')`. When adding a new key, add it to **both** `src/locales/en/translation.json` and `src/locales/pt/translation.json` simultaneously.
- **SEO:** Every public page must use `<HeadlessSEO />` (`src/components/HeadlessSEO.tsx`). Private routes must remain `noindex`.
- **Icons:** `lucide-react 1.x` removed Facebook, Instagram, and YouTube icons. Use `src/components/icons/BrandIcons.tsx` (inline SVGs) instead.
- **Path alias:** `@/` resolves to `src/`.

### Backend (`inc/` + `plugins/`)

WordPress 6.9+ / PHP 8.3+ theme. Key files:

- `inc/api.php` — theme REST routes (mounted under `/wp-json/`)
- `inc/spa.php` — rewrites all non-asset routes to `index.html` for SPA
- `inc/vite.php` — reads `dist/manifest.json` and injects hashed JS/CSS
- `inc/csp.php` — dynamic Content Security Policy with nonce; **never** `Header unset Content-Security-Policy` in `.htaccess`
- `inc/ai-llm.php` — AI discovery endpoint

Custom plugins:
- `plugins/zen-bit/` — Events CPT + MusicEvent schema (event SSOT)
- `plugins/zeneyer-auth/` — Auth, Google OAuth, JWT, newsletter
- `plugins/zen-seo-lite/` — SEO metadata, schema, sitemap
- `plugins/zengame/` — GamiPress-based gamification

### Build & Deploy

- **Vite base path:** In production, assets are served from `/wp-content/themes/zentheme/dist/`. Files under `public/` are deployed separately to the webroot by the CI `Prepare public assets` step — don't assume arbitrary files in `public/` reach the site root automatically.
- **Minifier:** Vite 8 uses OXC (Rolldown) by default. Never set `minify: 'esbuild'`.
- **Prerender:** `scripts/prerender.js` uses Puppeteer for SSG. Never remove this. Prerender payloads must include both `menu.en` and `menu.pt`.
- **Chunk splitting:** vendor-react, vendor-motion, vendor-i18n, vendor (see `vite.config.ts`).
- **CI workflows** (`.github/workflows/`): `deploy-frontend.yml` triggers on changes to `src/`, `public/`, `scripts/`, `package.json` on `main`. Never push directly to `main` — always use PRs.

## Critical Rules

### `safeUrl` fallback
`safeUrl(url)` returns `'#'` (truthy), so `safeUrl(url) || fallback` **never executes**.

- Images: `safeUrl(url, '/fallback.svg')`
- Links: `safeUrl(url, '/')`

### Zod + PHP `false`
`get_avatar_url()` and `get_the_post_thumbnail_url()` return `false` when no image exists. Use `z.string().catch('')`, not `z.union([z.string(), z.literal(false)])`.

### GamiPress arrays
`gamipress_get_rank_types()` and similar return associative arrays (slug as key). Always use `array_values($arr)[0]` or `reset($arr)` — never `$arr[0]`.

### WooCommerce orders (HPOS)
Never query orders with raw SQL on `wp_posts`. Use `wc_get_orders()`.

### `.htaccess` protected blocks
Never edit inside `# BEGIN LSCACHE` / `# END LSCACHE` or `# BEGIN NON_LSCACHE` / `# END NON_LSCACHE` — overwritten by the LiteSpeed plugin. Never add NOCACHE rules for `/wp-json/`, `/feed/`, or `/api/` — the frontend is SSG and caching these is correct. Never add `Strict-Transport-Security` — managed by Cloudflare only.

### MusicEvent schema (JSON-LD)
For `MusicEvent`, the following fields are required by Google Search Console:
`eventStatus`, `endDate` (fallback: startDate + 4h), `location.address` (PostalAddress sub-fields), `description`, `image`, `offers`, `performer`.

## Context Hierarchy

This repo maintains layered AI context. When in doubt, consult in this order:

1. Actual code (runtime truth)
2. `AI_CONTEXT_INDEX.md` (map of all context files)
3. `AGENTS.md` (master rules — mandatory)
4. `.context/IDENTITY.md` (brand/name SSOT)
5. `.context/*.md` (domain knowledge)
6. `LEARNINGS.md` (operational memory — check before repeating known mistakes)

After completing any non-trivial task, update `LEARNINGS.md` with what worked and what failed.

## Content & Product Conventions

- **Public payment data** (Pix, PayPal, Wise, IBAN, SWIFT) appearing in endpoints is intentional for donations/alternative payments — do not treat as a security leak.
- **AI training signals** in `public/robots.txt` (`Content-Signal: ai-train=yes`) are intentional product decisions — do not change to `no` without explicit user request.
- **Artist identity keys** in `src/data/artistData.ts`: social links use `social.YouTube` (capital Y, T) — not `youtube`.
- Render-by-slug logic in `NewsPage`/`EventsPage` is critical for SEO — never remove it.
- The embedded music player was intentionally removed — do not reintroduce without explicit approval.
