# CLAUDE.md — DJ Zen Eyer

> Contexto primário para Claude Code. Leia `AI_CONTEXT_INDEX.md` para regras completas.
> Idioma padrão: Português Brasileiro.

## Projeto

Site/plataforma oficial do DJ Zen Eyer (Marcelo Eyer Fernandes) — Bicampeão Mundial de Brazilian Zouk.
Arquitetura: WordPress Headless + React 19 SPA.
Produção: https://djzeneyer.com

## Stack (2026-03-26) 🛠️

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript strict + Vite 8 + Tailwind 4 + React Query v5 + React Router 7 + i18next |
| Backend | WordPress 6.9+, PHP 8.3, WooCommerce 10.5+ (HPOS ativo), GamiPress |
| Plugins repo | `zeneyer-auth`, `zen-seo-lite`, `zen-bit`, `zengame` |
| Infra | Hostinger VPS + LiteSpeed + Cloudflare + GitHub Actions |
| Node | 20+ |

## 🔗 Namespaces de API

- `djzeneyer/v1` — Core (menus, config, newsletter)
- `zeneyer-auth/v1` — Auth JWT + Google OAuth
- `zengame/v1` — Gamificação (Dashboard, Leaderboard, Track)
- `zen-bit/v2` — Eventos & Bandsintown
- `zen-seo/v1` — SEO Headless dinâmico

## Hierarquia de contexto (em caso de conflito)

1. Código real (`package.json`, `src/`, `plugins/`, `inc/`) — fonte final
2. `AI_CONTEXT_INDEX.md` — regras globais, stack, endpoints canônicos
3. `AGENTS.md` — regras operacionais para agentes
4. `docs/AI_GOVERNANCE.md` — gates por tipo de tarefa
5. `GEMINI.md` — overrides para Gemini/Jules
6. Este arquivo (`CLAUDE.md`) — contexto específico para Claude Code

## 🧱 Regras Críticas (não negociáveis)

1. **i18n obrigatório** — toda string visível usa `t('chave')` em PT e EN
2. **React Query SSOT** — data fetching apenas via `src/hooks/useQueries.ts`; nunca `fetch()` solto em componentes
3. **Backend filtra, frontend renderiza** — filtragem pesada sempre no PHP/query params
4. **ESLint v11+** — não atualizar para v11+ (manter versão atual do projeto)
5. **Prerender** — nunca remover `scripts/prerender.js`; é o que evita tela branca no deploy
6. **Locales UTF-8** — arquivos `translation.json` em UTF-8 limpo, sem mojibake (`Ã§`, `Â©`, `ðŸ`)
7. **Plugins CI** — `plugins/` só é republicado quando `plugins/**` muda (detectado por `git diff HEAD^..HEAD`)

## ⛔ DO NOT

- Deletar `.bolt`, `.jules`, `.devcontainer` — usados por outros agentes de IA
- Remover lógica PWA (`site.webmanifest`, service workers)
- Remover renderização de slug/detalhe em `NewsPage`/`EventsPage` — crítico para SEO
- Commitar `.env`, segredos ou credenciais
- Usar `minify: 'esbuild'` no Vite — Vite 8 usa OXC por padrão; esbuild não vem bundled
- SQL direto em `wp_posts` para pedidos WooCommerce — usar `wc_get_orders()` (HPOS-compat)
- Chamar `logout()` com `async/await` — a função é síncrona por design
- Adicionar `HeadlessSEO` com dados do usuário em rotas privadas (dashboard, my-account) — usar `noindex` + OG image genérica

## ZenGame / GamiPress — armadilhas conhecidas

- `gamipress_get_rank_types()` retorna array **associativo** (chave = slug) — sempre usar `array_values()` antes de `[0]`
- `date_earned` de conquistas vem do objeto de user-achievement (`$item->date_earned`), não de post meta
- Leaderboard cache: TTL 1h, chave `djz_gamipress_leaderboard_v15_{limit}`, invalidado em toda premiação
- Dashboard cache: TTL 24h, chave `djz_gamipress_dashboard_v15_{user_id}`
- Stats (tracks/events): TTL 6h, keys `djz_stats_tracks_{uid}` e `djz_stats_events_{uid}`

## SEO — regras de rotas privadas

- `DashboardPage` e `MyAccountPage` usam `<HeadlessSEO noindex />` com OG image genérica do site
- Essas rotas são excluídas do sitemap e do prerender
- Avatar do usuário **nunca** deve aparecer como preview social

## Deploy CI (resumo)

```
push main → build (tsc + vite + prerender N rotas) → artifacts → SSH rsync → cache purge
```

- Minificador: OXC (Vite 8 default) — rápido, sem dependência extra
- `fetch-depth: 2` no checkout — evita fetch de 100+ branches antigas
- Cache pós-deploy: OPcache + LiteSpeed + transients ZenGame limpos via wp-cli

## Comandos (Dev)

```bash
npm run dev   # Start preview local
npm run lint  # Validar código
npm run build # Build + Prerender (obrigatório antes de push)
```
