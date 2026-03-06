# GEMINI.md - DJ Zen Eyer

> Contexto para Gemini/Jules/Gemini Code Assist.
> Idioma padrao: Portugues Brasileiro.

## Precedencia
- Em caso de divergencia com outro arquivo, siga `AI_CONTEXT_INDEX.md`.
- Fonte final sempre e o codigo do repositorio.

## Baseline Tecnico
- WordPress Headless (REST) + React SPA
- React 18 + TypeScript + Vite 7 + Tailwind 3 + React Query v5 + React Router 7 + i18next
- WordPress 6.0+, PHP 8.1+, Node 20+

## Regras Obrigatorias
1. i18n para toda string visivel
2. Hooks React Query centralizados em `src/hooks/useQueries.ts`
3. Nao usar `fetch()` direto em componentes
4. Lazy loading para paginas
5. `<HeadlessSEO />` por pagina
6. Backend filtra; frontend renderiza
7. Nao migrar ESLint para v10
8. Nao usar segredos no git

## Namespaces Canonicos
- `djzeneyer/v1`
- `zeneyer-auth/v1`
- `zen-bit/v2`
- `zengame/v1`
- `zen-seo/v1`

## Preferencias do projeto
- Sem gradientes
- Solucoes simples e robustas
- Cache persistente no backend quando aplicavel
