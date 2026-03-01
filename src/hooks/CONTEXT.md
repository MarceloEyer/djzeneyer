# Hooks Context - /src/hooks

> **Primary Hook:** `useQueries.ts`

## Rules
1. **Single Source of Truth:** Todas as requisições `useQuery` devem ser definidas em `useQueries.ts`.
2. **No Direct Fetch:** Nunca usar `fetch` ou `axios` dentro de componentes ou outros hooks.
3. **No Business Logic:** Hooks de dados são apenas "pass-through". Se o dado precisa de filtro ou limpeza, isso deve ser feito no Plugin/Backend PHP.
4. **Prefetch:** Usar `usePrefetchOnHover.ts` para otimizar navegação.
4. **Cache:** Configurar `staleTime` generoso (~24h) para dados de baixo volume/mudança.

## Guidelines
- Separar hooks de UI (ex: `useDisclosure`) de hooks de dados.
- Tipar rigorosamente os retornos da API WordPress.

---
*Centralize ou Morra: O `useQueries.ts` é o coração das comunicações.*
