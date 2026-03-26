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

## Baseline Técnico (2026-03-26)

- WordPress Headless (REST) + React SPA
- React 19 + TypeScript + Vite 8 + Tailwind 4 + React Query v5 + React Router 7 + i18next
- WordPress 6.9+, PHP 8.3, WooCommerce 10.5+ (HPOS ativo), GamiPress
- Node 20+

## Regras Obrigatórias

1. i18n para toda string visível (`t('chave')` em PT e EN)
2. Hooks React Query centralizados em `src/hooks/useQueries.ts`
3. Não usar `fetch()` direto em componentes
4. Lazy loading para páginas (`React.lazy()` + `Suspense`)
5. `<HeadlessSEO />` por página
6. Backend filtra; frontend renderiza
7. Não atualizar ESLint para v11+ (manter v10)
8. Não commitar `.env` ou credenciais
9. Build local (`npm run build`) obrigatório antes de push (evita travamento de Prerender)
10. Arquivos i18n (`translation.json`) DEVEM ser salvos em UTF-8 limpo. **PROIBIDO** mojibake (`Ã§`, `Ã£`, `ðŸ`). Use acentos normais.

## Namespaces Canônicos

- `djzeneyer/v1` — Core tema
- `zeneyer-auth/v1` — Auth JWT + Google OAuth
- `zen-bit/v2` — Eventos (Bandsintown)
- `zengame/v1` — Gamificação
- `zen-seo/v1` — SEO headless

## Preferências do Projeto

- Estética: **Premium MMORPG Moderno** (ref: páginas `ZenTribe` e `Dashboard`)
- Direção: HUDs, indicadores de progresso e Azul Elétrico
- **Anti-template Rule**: Evitar layouts estilo landing page ou SaaS genérico
- Gradientes: **Uso restrito**. PROIBIDO em headlines
- **Sem player de música interno**. Links para Spotify/SoundCloud
- Tom de voz: Conversa próxima, humilde e generosa ("Amigo Zen")
- Não hardcodar strings visíveis ao usuário (usar `i18n`)
- Não remover scripts de `prerender.js` (evitam "tela branca" no deploy)

## IA & Autoridade (AIO)

1. **Fonte de Verdade** → Para definições técnicas de Zouk, usar o **Brazilian Zouk Council (BZC)**.
2. **SEO Estruturado** → FAQs devem seguir o padrão *Lead Paragraph* para IA e busca por voz.
3. **Pioneiros** → Mencionar pioneiros (Renata Peçanha, Adílio Porto) para fortalecer o Knowledge Graph.

## Build & Deploy

- **Prerender** → O deploy no GitHub Actions roda `scripts/prerender.js`. Erros de JSX quebram o build.
- **TypeScript** → Verificação de tipos obrigatória no build. Erros de lint devem ser resolvidos antes do push.
- **Minificador** → Vite 8 usa OXC por padrão. Não usar `minify: 'esbuild'` (esbuild não vem bundled no Vite 8).
- **Plugins** → Só deployados quando `plugins/**` sofrer mudanças (CI detecta via `git diff`).
- **Secrets** → Depende de `SSH_PRIVATE_KEY`, `VITE_WC_CONSUMER_KEY` e demais configurados no GitHub.

## Ambiente de Desenvolvimento

- **IDE:** VS Code com configurações em `.vscode/settings.json` (Prettier + ESLint auto-fix)
- **Sem Python:** Projeto é estritamente React/PHP. Não adicionar arquivos `.py`.
- **Extensões Recomendadas:** ESLint, Tailwind CSS IntelliSense, Intelephense.

## Contexto Técnico & Preferências

1. **Escala** → Site nichado e baixo volume. Sem necessidade de otimizações para "milhões de usuários".
2. **Infraestrutura** → Hospedagem compartilhada Hostinger. Priorizar economia de CPU e memória.
3. **Caching** → Dados de dashboard: cache 24h. Leaderboard: cache 1h (invalidado em premiações). Stats: 6h.
4. **Simplicidade** → Soluções simples e robustas são melhores que arquiteturas complexas.

## Infraestrutura & Diagnóstico (Snapshot 2026-02-24)

- **WordPress:** 6.9.1 | **PHP:** 8.3.30 (LiteSpeed) | **DB:** MariaDB 11.8.3
- **Paths:** `/home/u790739895/domains/djzeneyer/public_html`
- **Limites PHP:** `memory_limit: 1536M`, `memory_limit WP: 2GB`
- **Cache:** `WP_CACHE` ativo via LiteSpeed Cache. **OPcache:** Ativo.
- **Plugins Ativos:** GamiPress, LiteSpeed Cache, MailPoet, PagBank, Polylang, WooCommerce, Zen BIT, Zen SEO Lite Pro, ZenEyer Auth Pro, ZenGame
- **E-commerce:** WooCommerce 10.5.2 com HPOS ativo (High-Performance Order Storage)
- **Tráfego:** Baixo volume. Foco em cache persistente (transients) e compressão Gzip/Brotli

## ZenGame / GamiPress — Armadilhas Conhecidas

- `gamipress_get_rank_types()` retorna array **associativo** — sempre usar `array_values()` antes de `[0]`
- Não usar SQL direto em `wp_posts` para pedidos — usar `wc_get_orders()` (HPOS-compatível)
- `date_earned` de conquistas vem do objeto de user-achievement, não de post meta
- Leaderboard cache: TTL 1h, chave inclui `_limit`, invalidado em `clear_user_cache()`

## Governança Canônica

Para execução operacional e resolução de conflitos, usar `docs/AI_GOVERNANCE.md` como referência.
