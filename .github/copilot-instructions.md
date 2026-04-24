# Instruções para IA do repositório DJ Zen Eyer

## Idioma
Responda em Português Brasileiro.

## Fonte de verdade
- `AI_CONTEXT_INDEX.md` é o contexto canônico do projeto.
- `AGENTS.md` define regras operacionais.
- Em conflito, o código real do repositório prevalece.

## Stack atual
- Frontend: React 19 + TypeScript 6 strict + Vite 8 + Tailwind 4
- Estado/dados: React Query v5
- Roteamento: React Router 7 + i18next
- Backend: WordPress 6.9+ + PHP 8.3 + WooCommerce 10.5+ + GamiPress
- Infra: Hostinger VPS + LiteSpeed + Cloudflare + GitHub Actions

## Regras importantes
- Strings visíveis devem usar `t('chave')`.
- Data fetching no frontend deve passar por `src/hooks/useQueries.ts`.
- Não usar `fetch()` diretamente em componentes quando houver hook disponível.
- Toda página pública deve usar `<HeadlessSEO />`.
- Rotas privadas devem permanecer `noindex`.
- Não editar pedidos WooCommerce com SQL direto em `wp_posts`.
- `public/` e `scripts/` devem respeitar o pipeline de prerender e sitemap.

## Contexto adicional
- Consultar `AGENTS.md` e `AI_CONTEXT_INDEX.md` antes de propor mudanças estruturais.
- PRs do repositório podem receber comentário automático de `@codex review` via workflow dedicado.
