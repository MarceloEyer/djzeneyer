# DJ Zen Eyer — Central Context

> Resumo operacional rápido. Documento canônico completo: `AI_CONTEXT_INDEX.md`.
> Idioma padrão: Português Brasileiro.

## Arquitetura

```
WordPress Headless (REST API) ←→ React 19 SPA ←→ Cloudflare CDN
         ↑                              ↑
    4 plugins custom               Hostinger VPS
  (auth, seo, events, game)       (LiteSpeed + PHP 8.3)
```

## Stack (2026-03-26)

- **Frontend:** React 19, TypeScript strict, Vite 8 (OXC), Tailwind 4, React Query v5, React Router 7, i18next
- **Backend:** WordPress 6.9+, PHP 8.3, WooCommerce (HPOS), GamiPress
- **Deploy:** GitHub Actions → rsync SSH → Hostinger

## Regras de Ouro

1. `t('chave')` para toda string visível — PT e EN obrigatórios
2. Data fetching apenas via hooks em `src/hooks/useQueries.ts`
3. SEO por página via `<HeadlessSEO />`
4. TypeScript strict — build deve passar sem erros
5. Backend filtra; frontend renderiza
6. Não atualizar ESLint para v11+ (manter v10)

## Endpoints Canônicos

| Plugin | Namespace | Função |
|---|---|---|
| Tema | `djzeneyer/v1` | Menu, config, newsletter |
| Auth | `zeneyer-auth/v1` | JWT, Google OAuth, perfil |
| Eventos | `zen-bit/v2` | Bandsintown (SWR cached) |
| Gamificação | `zengame/v1` | Dashboard, leaderboard, tracking |
| SEO | `zen-seo/v1` | Metadata dinâmica |

## ZenGame — Resumo Técnico

- **`GET /zengame/v1/me`** — retorna: `points`, `rank` (com `menu_order`), `achievements`, `logs`, `stats`
- **`GET /zengame/v1/leaderboard`** — ranking público por tipo de pontos
- **`POST /zengame/v1/track`** — registra interação (download, share, listen, click)
- Cache dashboard: 24h por `user_id` | Cache leaderboard: 1h por `limit`
- Invalidação automática: a cada premiação de pontos, novo pedido WC ou troca de rank
- HPOS-safe: usa `wc_get_orders()` para totalTracks e eventsAttended

## Arquivos-chave

| Arquivo | Responsabilidade |
|---|---|
| `src/hooks/useQueries.ts` | SSOT de todas as queries React |
| `src/pages/DashboardPage.tsx` | Interface de gamificação do usuário |
| `src/types/gamification.ts` | Tipos TypeScript do ZenGame |
| `src/contexts/GamiPressContext.tsx` | Provider singleton do ZenGame |
| `plugins/zengame/` | Plugin PHP completo (engine + REST + admin) |
| `plugins/zeneyer-auth/` | Auth JWT + Google OAuth |
| `src/locales/pt/translation.json` | Traduções PT |
| `src/locales/en/translation.json` | Traduções EN |
| `.github/workflows/deploy.yml` | CI/CD completo |
