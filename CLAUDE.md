# CLAUDE.md — DJ Zen Eyer

> Contexto primário para Claude Code. Idioma padrão: Português Brasileiro.
> Consulte `AI_CONTEXT_INDEX.md` para a governança completa.

## Projeto
Site/plataforma oficial do DJ Zen Eyer. Arquitetura WordPress Headless + React 19 SPA.

## Stack (2026-03-26) 🛠️
| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite 8 (OXC) + Tailwind 4 + React Query v5 + React Router 7 |
| Backend | WP 6.9+ (PHP 8.3) + WooCommerce (HPOS) + GamiPress (ZenGame Pro 1.4.1) |
| Infra | Hostinger VPS + LiteSpeed + GitHub Actions (CI/CD) |

## 🔗 Namespaces de API
- `djzeneyer/v1` (Core)
- `zeneyer-auth/v1` (Auth Master)
- `zengame/v1` (Gamificação)
- `zen-bit/v2` (Bandsintown)
- `zen-seo/v1` (SEO)

## 🧱 Regras Críticas
1. **i18n Obrigatório:** `t('chave')` com arquivos locales em UTF-8 limpo.
2. **Data Fetching:** Centralizado em `src/hooks/useQueries.ts`.
3. **Build:** Vite 8 usa minificador OXC (padrão). Não adicionar `minify: 'esbuild'`.
4. **Deploy:** `fetch-depth: 2` no CI. Plugins só deployam se houver `plugins/**` mudado.
5. **ZenGame:** 
   - `gamipress_get_rank_types()` retorna associativo; use `array_values()` para indexar.
   - Leaderboard TTL 1h. Invalidar cache em cada premiação via `clear_user_cache()`.
   - Pedidos: Usar `wc_get_orders()` (HPOS-safe). Nunca SQL em `wp_posts`.

---

## COMANDOS (Dev)
```bash
npm run dev   # Start preview local
npm run lint  # Validar código
npm run build # Build + Prerender (Obrigatório antes de push)
```
