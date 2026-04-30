# Frontend Context - /src

> Contexto rapido para o frontend React.
> Regras globais: `AI_CONTEXT_INDEX.md`.
> Aprendizados de PRs: `docs/AI_LEARNINGS.md`.

## Stack do frontend

- React 19.2.5
- TypeScript 6.0.3
- Vite 8.0.9
- Tailwind 4.2.1
- React Query 5.99.2
- React Router 7.14.1
- i18next 26.0.6
- Framer Motion 12.38.0

## Regras de maior valor pratico

- Strings visiveis usam `t('chave')`.
- Fetching centralizado em `src/hooks/useQueries.ts`.
- Paginas usam `React.lazy()` + `Suspense`.
- Providers usam `useMemo` quando a estabilidade importa.
- Rotas publicas usam `<HeadlessSEO />`.
- Rotas privadas usam `noindex` e imagem OG generica.

## Estrutura relevante

- `components/` - UI e SEO.
- `config/` - rotas e configuracoes.
- `hooks/` - acesso a dados e queries.
- `pages/` - paginas lazy loaded.
- `locales/` - JSONs PT/EN.
- `utils/` - funcoes puras.

## Regras curtas que evitam regressao

- `safeUrl(url, fallback)` precisa de fallback explicito.
- `loadingInitial` e o estado certo para guardas de rota privada.
- `lucide-react` 1.x nao cobre todos os icones de marca; `BrandIcons.tsx` segue como fonte local.
- Campos de imagem/URL em schemas usam `.catch('')`.

## Observacao

O nivel de detalhe maior deve ficar em `src/hooks/CONTEXT.md`, `src/pages/CONTEXT.md` e `src/components/CONTEXT.md` quando necessario.
