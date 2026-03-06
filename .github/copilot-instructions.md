# Instrucoes para GitHub Copilot - DJ Zen Eyer

## Idioma
Responda em Portugues Brasileiro.

## Precedencia
- Seguir `AI_CONTEXT_INDEX.md`.
- Em conflito, o codigo do repositorio prevalece.

## Contexto Tecnico
- Frontend: React 18 + TypeScript + Vite 7 + Tailwind 3
- Backend: WordPress Headless + PHP 8.1+
- Estado/dados: React Query v5 + Context API
- i18n: i18next (PT/EN)
- Routing: React Router 7
- Node: 20+

## Convencoes
- Data fetching centralizado em `src/hooks/useQueries.ts`
- i18n para strings visiveis
- Paginas lazy-loaded
- `<HeadlessSEO />` por pagina
- Navbar em `src/components/Layout/Navbar.tsx`
- SQL com prepare + sanitizacao

## Plugins/Namespaces canonicos
- `zeneyer-auth` -> `zeneyer-auth/v1`
- `zen-seo-lite` -> `zen-seo/v1`
- `zen-bit` -> `zen-bit/v2`
- `zengame` -> `zengame/v1`

## Restricoes
- Nao atualizar ESLint para v10
- Nao commitar `.env`/credenciais
- WordPress e API headless (sem frontend server-side WordPress)
