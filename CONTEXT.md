# CONTEXT.md - DJ Zen Eyer

> Resumo operacional curto do repositorio.
> O documento canonico completo e `AI_CONTEXT_INDEX.md`.
> O arquivo mais completo para Claude e `CLAUDE.md`.

## Funcoes dos arquivos

- `AI_CONTEXT_INDEX.md` - regras globais, precedencia, baseline tecnico e SSOT.
- `AGENTS.md` - onboarding e operacao diaria dos agentes.
- `CLAUDE.md` - contexto local rico para Claude Code.
- `GEMINI.md` - override enxuto para Gemini / Jules.
- `docs/AI_LEARNINGS.md` - memoria operacional consolidada.
- `docs/AI_LEARNINGS_LOG.md` - historico legado.

## Stack atual

- Frontend: React 19.2.5, TypeScript 6.0.3, Vite 8.0.9, Tailwind 4.2.1, React Query 5.99.2, React Router 7.14.1, i18next 26.0.6
- Build: ESLint 10.2.1, Prettier 3.8.2, Puppeteer 24.42.0
- Backend: WordPress 6.9+, PHP 8.3+, WooCommerce 10.5+ com HPOS ativo, GamiPress
- Infra: Hostinger VPS, LiteSpeed, Cloudflare, GitHub Actions

## Regras repetidas com maior valor pratico

- Strings visiveis usam i18n.
- Fetch em componente nao e padrao.
- SEO por rota usa `HeadlessSEO`.
- Rotas privadas usam `noindex`.
- Mudanca em dependencia exige lockfile sincronizado.
- PR duplicado deve ser consolidado em um branch canonico.

## Quando este arquivo ajuda

Use este arquivo quando a tarefa precisar de um mapa rapido do ecossistema de contexto, sem entrar no nivel completo do indice canonico.
