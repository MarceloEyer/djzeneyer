# DJ Zen Eyer - Central Context

> Resumo operacional rapido.
> Documento canonico: `AI_CONTEXT_INDEX.md`.

## Arquitetura
- Backend: WordPress REST API
- Frontend: React SPA
- Infra: Hostinger + Cloudflare

## Regras de Ouro
1. i18n obrigatorio (sem hardcode)
2. Fetch de dados via hooks em `src/hooks/useQueries.ts`
3. SEO via `HeadlessSEO.tsx`
4. TypeScript strict (build deve passar)
5. Backend filtra, frontend renderiza

## Endpoints Base
- `djzeneyer/v1`
- `zeneyer-auth/v1`
- `zen-bit/v2`
- `zengame/v1`
- `zen-seo/v1`
