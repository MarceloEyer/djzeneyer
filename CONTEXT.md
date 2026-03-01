# DJ Zen Eyer - Central Context

> **Project Pillar:** WordPress Headless SPA

## Core Architecture
- **Backend:** WordPress REST API (PHP 8.3)
- **Frontend:** React SPA (Vite, TS)
- **Infrastructure:** Hostinger VPS + Cloudflare

## Golden Rules
1. **Never** hardcode strings. Use `i18next`.
2. **Never** use `fetch()` in components. Use React Query in `useQueries.ts`.
3. **Always** use `HeadlessSEO.tsx` for metadata.
4. **TypeScript** is strict. Build fails on errors.

## Key Entry Points
- Frontend Logic: `src/`
- API Config: `src/config/api.ts`
- Routes: `src/config/routes.ts`
- Backend Extensions: `inc/`
- Custom Plugins: `plugins/`

---
*Este arquivo orienta a IA sobre a estrutura global do projeto.*
