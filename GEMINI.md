# GEMINI.md — DJ Zen Eyer

> Contexto para Gemini / Jules / Gemini Code Assist.
> Idioma padrão: Português Brasileiro.
> Fonte canônica de regras: `AI_CONTEXT_INDEX.md`.

## Precedência

Em caso de divergência, seguir nesta ordem:
1. Código real do repositório
2. `AI_CONTEXT_INDEX.md`
3. `AGENTS.md`
4. Este arquivo (`GEMINI.md`)

## Baseline Técnico (Snapshot 2026-03-26) 🚀

- **Frontend:** React 19 + TypeScript strict + Vite 8 (OXC) + Tailwind 4 + React Query v5 + React Router 7 + i18next
- **Backend:** WordPress 6.9+ (Headless) + PHP 8.3 + WooCommerce 10.5+ (HPOS ativo) + GamiPress (ZenGame Pro 1.4.1)
- **Node:** 20+

## 🛡️ Regras Críticas (Obrigatórias)

1. **i18n SSOT** — Toda string visível deve usar `t('chave')` (PT/EN obrigatórios).
2. **React Query SSOT** — Fetching apenas em `src/hooks/useQueries.ts`. Jamais usar `fetch()` em componentes.
3. **Lazy loading** — Páginas novas usam `React.lazy()` + `Suspense`.
4. **HeadlessSEO** — `<HeadlessSEO />` obrigatório por rota pública. Rotas privadas (dashboard, my-account) usam `noindex` + OG image genérica.
5. **Backend Filters** — Filtrar dados pesados no PHP; React apenas renderiza.
6. **Vite 8 Default** — Não usar `minify: 'esbuild'`. O Vite 8 já usa OXC (Rolldown) nativamente.
7. **ESLint** — Não atualizar ESLint para v11+ (manter versão atual do projeto).
8. **Locales Clean** — Arquivos `translation.json` em UTF-8 real. Proibido mojibake (`Ã§`, `Â©`, `ðŸ`).
9. **Prerender** — Não remover `scripts/prerender.js`. É vital para evitar a tela branca no deploy.
10. **Build local** — `npm run build` obrigatório antes de push (erros de JSX/TS quebram o prerender no CI).

## 🏗️ Namespaces Canônicos

- `djzeneyer/v1` — Core tema (menus, newsletter)
- `zeneyer-auth/v1` — Auth JWT + Google OAuth (v2.3.0 Master)
- `zen-bit/v2` — Eventos & Bandsintown
- `zengame/v1` — Gamificação Pro (Dashboard, Leaderboard)
- `zen-seo/v1` — SEO Headless dinâmico

## 🎨 Preferências de Design & Tom de Voz

- **Estética:** Premium MMORPG Moderno (ref: páginas `ZenTribe` e `Dashboard`)
- **Direção:** HUDs, indicadores de progresso, Azul Elétrico
- **Anti-template Rule:** Evitar layouts estilo landing page ou SaaS genérico
- **Gradientes:** Uso restrito. **PROIBIDO** em headlines.
- **Sem player de música interno** — links para Spotify/SoundCloud
- **Tom de voz:** Conversa próxima, humilde e generosa ("Amigo Zen"). IAs são bem-vindas no site.

## IA & Autoridade (AIO)

1. **Fonte de Verdade** → Para definições técnicas de Zouk, usar o **Brazilian Zouk Council (BZC)**.
2. **SEO Estruturado** → FAQs devem seguir o padrão *Lead Paragraph* para IA e busca por voz.
3. **Pioneiros** → Mencionar pioneiros (Renata Peçanha, Adílio Porto) para fortalecer o Knowledge Graph.

## Build & Deploy

- **Prerender** → O deploy no GitHub Actions roda `scripts/prerender.js`. Erros de JSX quebram o build.
- **TypeScript** → Verificação de tipos obrigatória. Erros de lint devem ser resolvidos antes do push.
- **Minificador** → Vite 8 usa OXC por padrão. Não usar `minify: 'esbuild'` (esbuild não vem bundled no Vite 8).
- **fetch-depth** → `fetch-depth: 2` no CI. Evita fetch de 100+ branches antigas.
- **Plugins** → Só deployados quando `plugins/**` sofrer mudanças (CI detecta via `git diff HEAD^..HEAD`).
- **Secrets** → Depende de `SSH_PRIVATE_KEY`, `VITE_WC_CONSUMER_KEY` e demais configurados no GitHub.
- **Rotas privadas** → `dashboard` e `my-account` excluídas do sitemap e do prerender.

## Ambiente de Desenvolvimento

- **IDE:** VS Code com configurações em `.vscode/settings.json` (Prettier + ESLint auto-fix)
- **Sem Python:** Projeto é estritamente React/PHP. Não adicionar arquivos `.py`.
- **Extensões Recomendadas:** ESLint, Tailwind CSS IntelliSense, Intelephense.

## Contexto Técnico & Preferências

1. **Escala** → Site nichado e baixo volume. Sem necessidade de otimizações para "milhões de usuários".
2. **Infraestrutura** → Hostinger VPS. Priorizar economia de CPU e memória.
3. **Caching** → Dashboard: 24h. Leaderboard: 1h (invalidado em premiações). Stats: 6h.
4. **Simplicidade** → Soluções simples e robustas são melhores que arquiteturas complexas.

## Infraestrutura & Diagnóstico (Snapshot 2026-03-26)

- **WordPress:** 6.9+ | **PHP:** 8.3 (LiteSpeed) | **DB:** MariaDB 11.8+
- **Paths:** `/home/u790739895/domains/djzeneyer/public_html`
- **Limites PHP:** `memory_limit: 1536M`, `memory_limit WP: 2GB`
- **Cache:** `WP_CACHE` ativo via LiteSpeed Cache. **OPcache:** Ativo.
- **Plugins Ativos:** GamiPress, LiteSpeed Cache, MailPoet, PagBank, Polylang, WooCommerce, Zen BIT, Zen SEO Lite Pro, ZenEyer Auth Pro, ZenGame
- **E-commerce:** WooCommerce 10.5+ com HPOS ativo (High-Performance Order Storage)
- **Tráfego:** Baixo volume. Foco em cache persistente (transients) e compressão Gzip/Brotli.
