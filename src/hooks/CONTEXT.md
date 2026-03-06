# Hooks Context - /src/hooks

> **Primary Hook:** `useQueries.ts`

## Rules
1. **Single Source of Truth:** toda query/mutation de dados deve estar em `useQueries.ts`.
2. **No Direct Fetch:** componentes/páginas não podem fazer `fetch` direto.
3. **Backend Filters, Frontend Renders:** filtros e agregações devem vir do plugin/BFF.
4. **Types First:** tipar payload/resposta (ex.: `WCOrder`, `ZenGameUserData`).
5. **Cache Discipline:** usar `QUERY_KEYS` e `STALE_TIME` centralizados.

## Endpoints privados atuais (SPA)
- `zeneyer-auth/v1/profile`
- `zeneyer-auth/v1/newsletter`
- `zengame/v1/me`
- `zeneyer-auth/v1/orders` (via `useUserOrdersQuery`)

---
*Se um endpoint novo aparecer na UI, o hook correspondente deve nascer aqui primeiro.*


