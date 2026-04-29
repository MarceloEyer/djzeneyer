# DJ Zen Eyer

Official repository for `https://djzeneyer.com`.

Headless WordPress + React SPA. The repository is organized for both humans and AI agents.
Canonical rules live in `AI_CONTEXT_INDEX.md`; task instructions live in `AGENTS.md`; local Claude context lives in `CLAUDE.md`.

## Stack

| Layer | Current |
|---|---|
| Frontend | React 19.2.5, TypeScript 6.0.3, Vite 8.0.9, Tailwind 4.2.1, React Query 5.99.2, React Router 7.14.1, i18next 26.0.6 |
| Build | ESLint 10.2.1, Prettier 3.8.2, Puppeteer 24.42.0 |
| Backend | WordPress 6.9+, PHP 8.3+, WooCommerce 10.5+ with HPOS, GamiPress |
| Infra | Hostinger VPS, LiteSpeed, Cloudflare, GitHub Actions |

## Main areas

- `src/` - React frontend
- `inc/` - theme bootstrap and theme REST routes
- `plugins/` - custom WordPress plugins
- `scripts/` - build, prerender, sitemap, and validation scripts
- `docs/` - technical and operational documentation

## Key docs

- [AI_CONTEXT_INDEX.md](AI_CONTEXT_INDEX.md)
- [AGENTS.md](AGENTS.md)
- [CLAUDE.md](CLAUDE.md)
- [GEMINI.md](GEMINI.md)
- [docs/README.md](docs/README.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/API.md](docs/API.md)
- [docs/api-endpoints.md](docs/api-endpoints.md)
- [docs/CONFIGURATION.md](docs/CONFIGURATION.md)
- [docs/AI_LEARNINGS.md](docs/AI_LEARNINGS.md)

## Local validation

```bash
npm install
npm run lint
npm run build
```

## Rule

If the docs and the code disagree, the code wins.
