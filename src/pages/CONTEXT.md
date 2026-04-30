# Pages Context - /src/pages

> Contexto local das rotas e paginas.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Regras centrais

- Paginas usam `React.lazy()` + `Suspense`.
- A primeira responsabilidade da pagina e renderizar SEO correto quando a rota for publica.
- Paginas consomem dados via hooks, nao via fetch isolado.
- Transformacoes pesadas devem ficar fora do render sempre que possivel.
- Rotas privadas usam `noindex`.

## Pontos de cuidado

- Nao espalhar fetch e filtro dentro da view.
- Nao hardcodar paths quando existir rota localizada.
- Pagina deve receber dados prontos para render, nao montar pipeline inteiro so na tela.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
