# GEMINI.md - DJ Zen Eyer

> Override local para Gemini / Jules.
> Base canonica: `AI_CONTEXT_INDEX.md`.
> Aprendizados consolidados: `docs/AI_LEARNINGS.md`.
> Tom preferido: factual, curto, sem marketing, sem autoelogio.

## Papel deste arquivo

Este arquivo nao tenta repetir toda a base do projeto. Ele serve para ajustes de uso de Gemini e Jules, mantendo a mesma direcao dos arquivos canonicos.

## Regras centrais

- Usar `AI_CONTEXT_INDEX.md` como referencia principal para stack, precedencia e regras globais.
- Ler `AGENTS.md` antes de qualquer tarefa.
- Ler `docs/AI_LEARNINGS.md` quando a tarefa tocar padroes ja consolidados por PRs ou reviews.
- Tratar `CLAUDE.md` como contexto local completo para Claude, nao como fonte superior.
- Manter texto visivel em formato factual e verificavel.
- Evitar linguagem imperativa em arquivos publicos para IA.

## Stack atual

| Camada | Estado atual |
|---|---|
| Frontend | React 19.2.5, TypeScript 6.0.3, Vite 8.0.9, Tailwind 4.2.1, React Query 5.99.2, React Router 7.14.1, i18next 26.0.6 |
| Build | ESLint 10.2.1, Prettier 3.8.2, Puppeteer 24.42.0, OXC como minificador padrao |
| Backend | WordPress 6.9+, PHP 8.3+, WooCommerce 10.5+ com HPOS ativo, GamiPress |
| Infra | Hostinger VPS, LiteSpeed, Cloudflare, GitHub Actions |
| Node | 20+ |

## Pontos que se repetem no projeto

- Strings visiveis usam `t('chave')`.
- Data fetching no frontend passa por `src/hooks/useQueries.ts`.
- Rotas publicas usam `<HeadlessSEO />`.
- Rotas privadas usam `noindex` e OG image generica.
- `package-lock.json` acompanha `package.json` em mudancas de dependencia.
- Review de bots e triagem, nao veredito final.

## O que este arquivo nao faz

- Nao define precedencia propria.
- Nao reescreve regras canonicas.
- Nao substitui `AI_CONTEXT_INDEX.md`, `AGENTS.md` ou `docs/AI_LEARNINGS.md`.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o `AI_CONTEXT_INDEX.md`.
