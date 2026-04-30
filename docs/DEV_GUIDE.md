# Guia do Desenvolvedor

> Referencia pratica para quem trabalha no projeto.
> Se houver conflito com a implementacao real, vale o codigo real e o `AI_CONTEXT_INDEX.md`.

## Arquitetura

O projeto usa WordPress headless como backend e React SPA como frontend.

## Onde mexer

| Tarefa | Arquivo principal |
|---|---|
| Nova pagina | `src/pages/` + rotas em `src/components/AppRoutes.tsx` |
| Hook de dados | `src/hooks/useQueries.ts` |
| Traducao | `src/locales/en/translation.json` e `src/locales/pt/translation.json` |
| Endpoint REST | `inc/api.php` ou plugin apropriado |
| Plugin customizado | `plugins/` |
| Deploy | `.github/workflows/deploy.yml` |

## Regras centrais

- Paginas usam `React.lazy()` + `Suspense`.
- Data fetching passa por React Query e pelo hook central.
- Texto visivel usa i18n.
- PHP usa namespaces, sanitizacao e queries preparadas.
- ESLint atual do projeto e v10.

## Build e validacao

```bash
npm run lint
npm run build
npm run perf:budget
```

## Nota sobre docs antigas

Esse guia e um resumo operacional. Detalhes de stack e memoria consolidada ficam em `AI_CONTEXT_INDEX.md`, `CLAUDE.md` e `docs/AI_LEARNINGS.md`.
