# GEMINI.md — DJ Zen Eyer

> Contexto para Gemini / Jules / Gemini Code Assist.
> Idioma padrão: Português Brasileiro.
> Fonte canônica de regras: `AI_CONTEXT_INDEX.md`.

## Baseline Técnico (Snapshot 2026-03-26) 🚀

- **Frontend:** React 19 + TypeScript + Vite 8 (OXC) + Tailwind 4 + React Query v5 + React Router 7 + i18next
- **Backend:** WordPress 6.9+ (Headless) + PHP 8.3 + WooCommerce (HPOS ativo) + GamiPress (ZenGame Pro 1.4.1)
- **Node:** 20+

## 🛡️ Regras Críticas (Obrigatórias)

1. **i18n SSOT** — Toda string visível deve usar `t('chave')` (PT/EN obrigatórios).
2. **React Query SSOT** — Fetching apenas em `src/hooks/useQueries.ts`. Jamais usar `fetch()` em componentes.
3. **Vite 8 Default** — Não usar `minify: 'esbuild'`. O Vite 8 já usa OXC (Rolldown) nativamente.
4. **Locales Clean** — Arquivos `translation.json` em UTF-8 real. Proibido mojibake (`Ã§`, `Â©`, `ðŸ`).
5. **Prerender** — Não remover `scripts/prerender.js`. É vital para evitar a tela branca no deploy.
6. **Backend Filters** — Filtrar dados pesados no PHP; React apenas renderiza.

## 🏗️ Namespaces Canônicos

- `djzeneyer/v1` — Core tema (menus, newsletter)
- `zeneyer-auth/v1` — Auth JWT + Google OAuth (v2.3.0 Master)
- `zen-bit/v2` — Eventos & Bandsintown
- `zengame/v1` — Gamificação Pro (Dashboard, Leaderboard)
- `zen-seo/v1` — SEO Headless dinâmico

## 🎨 Design & Tom de Voz

- **Estética:** Premium MMORPG Moderno (Indicator HUDs, Progresso, Azul Elétrico).
- **Gradientes:** Permitidos para profundidade, mas **PROIBIDOS** em headlines.
- **Voz:** "Amigo Zen" (humilde, próximo, generoso). IAs são bem-vindas no site.

---

## 🧭 Referência Rápida

- **Dashboard do Usuário:** `DashboardPage.tsx` consome `useGamiPress()` hook.
- **Cache Leaderboard:** TTL 1h, invalidado em todas as premiações via `clear_user_cache()`.
- **WooCommerce HPOS:** Usar `wc_get_orders()` para queries de pedidos; nunca SQL direto.
