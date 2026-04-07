# CLAUDE.md — DJ Zen Eyer

> Contexto primário para Claude Code. Leia `AI_CONTEXT_INDEX.md` para regras completas.
> Idioma padrão: Português Brasileiro.

## Projeto

Site/plataforma oficial do DJ Zen Eyer (Marcelo Eyer Fernandes) — Bicampeão Mundial de Brazilian Zouk.
Arquitetura: WordPress Headless + React 19 SPA.
Produção: https://djzeneyer.com

## Stack (2026-03-27) 🛠️

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript 6 strict + Vite 8 + Tailwind 4 + React Query v5 + React Router 7 + i18next |
| Backend | WordPress **6.9.4**, PHP **8.3.30**, WooCommerce **10.6.1** (HPOS ativo), GamiPress **7.8.2** |
| Database | **MariaDB 11.8.6** (não MySQL — atenção em queries SQL raw) |
| Plugins repo | `zeneyer-auth 2.4.0`, `zen-seo-lite 8.1.1`, `zen-bit 3.1.0`, `zengame 1.4.0` |
| Plugins 3rd | Polylang 3.8.1, MailPoet 5.22.2, PagBank Connect 4.53.2, LiteSpeed Cache 7.8.0.1 |
| Infra | Hostinger VPS (Linux/x86_64) + LiteSpeed + Cloudflare + GitHub Actions |
| Node | 20+ |

## 🌍 Polylang — como funciona a tradução de conteúdo

O Polylang gerencia a tradução de **conteúdo WordPress** (posts, produtos, páginas).
O i18next gerencia **strings de UI** do React. São sistemas completamente separados.

- Idioma padrão: **EN** (sem prefixo de URL — `djzeneyer.com/slug`)
- Idioma PT: prefixo `/pt/` — `djzeneyer.com/pt/slug`
- `hide_default: 1` → EN não tem `/en/` na URL (só `/slug`)
- `browser: 0` → detecção automática de idioma do navegador **desativada**
- Para obter conteúdo traduzido via REST: passar `?lang=pt` na query
- CPTs traduzidos: post, page, product, attachment
- Taxonomias traduzidas: category, post_tag, product_cat, product_brand

## ⚠️ Ambiente de Produção — atenção

```
WP_DEBUG: true         ← ATIVO EM PRODUÇÃO (risco: erros PHP viram HTML na API REST)
WP_DEBUG_DISPLAY: true ← erros visíveis para usuários — causa <br><b>Warning no JSON
WP_DEBUG_LOG: true
WP_MEMORY_LIMIT: 256M  (servidor suporta 1536M — pode aumentar se necessário)
```
**Impacto real:** foi a causa raiz do `<br /><b>...` no response de `zengame/v1/me`.
Correção necessária no `wp-config.php`:
```php
define( 'WP_DEBUG', false );
define( 'WP_DEBUG_DISPLAY', false );
@ini_set( 'display_errors', 0 );
```

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
4. **ESLint (v10)** — não atualizar para v11+ (manter versão atual do projeto)
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
- Leaderboard cache: TTL 1h, chave `djz_gamipress_leaderboard_v16_{limit}`, invalidado em toda premiação
- Dashboard cache: TTL 24h, chave `djz_gamipress_dashboard_v16_{user_id}`
- Stats (tracks/events): TTL 6h, keys `djz_stats_tracks_{uid}` e `djz_stats_events_{uid}`
- **`rankProgress` fallback**: quando `gamipress_get_rank_requirements_progress()` não existe (GamiPress free), o progresso é calculado via `gamipress_get_user_points()` vs `_gamipress_points` meta. Bug histórico: ternário retornava `0.0` nos dois lados — corrigido em `class-rest-handler.php`.
- **Zod schema ZenGame**: `main_points_slug`, `lastUpdate`, `version` usam `.catch()` — se o PHP retornar valor inesperado, o parse não quebra o dashboard inteiro.

## SEO — regras de rotas privadas e padrões canônicos

- `DashboardPage` e `MyAccountPage` usam `<HeadlessSEO noindex />` com OG image genérica do site
- Essas rotas são excluídas do sitemap e do prerender
- Avatar do usuário **nunca** deve aparecer como preview social
- Rotas de checkout (`cart`, `checkout`, `tickets-checkout`), `reset-password` e `quiz` têm `excludeFromSitemap: true` em `scripts/routes-data.json`
- **hreflang**: toda entrada de sitemap inclui `x-default` apontando para a versão EN
- **URL canônica**: sempre usar `getLocalizedRoute()` — nunca hardcodar paths como `/about`
- **robots.txt**: bots SEO (AhrefsBot, SemrushBot) devem ter `Allow: /` + `Crawl-delay` — nunca `Disallow: /` seguido de `Allow: /`
- **Schema.org**: `AboutPage` → `ProfilePage`; `MusicPage` listagem → `CollectionPage` + `MusicGroup`; `PhilosophyPage` → `Article` com `about: Cremosidade`
- **`.well-known/ai-plugin.json`**: metadados para ChatGPT Plugins e crawlers de IA — não remover
- **`llms.txt` / `llms-full.txt`**: devem ser UTF-8 limpo — validar após edições

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
