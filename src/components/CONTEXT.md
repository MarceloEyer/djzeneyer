# Components Context - /src/components

> Contexto local dos componentes de frontend.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Regras centrais

- Estilo visual do projeto usa Tailwind 4 sem depender de convencoes antigas de `tailwind.config.js` class-based.
- Strings visiveis usam i18n.
- `HeadlessSEO.tsx` continua obrigatorio nas paginas publicas.
- `Framer Motion` precisa preservar estabilidade de referencia quando a animacao for reutilizada.
- Icones de marca nao dependem de `lucide-react` quando a biblioteca nao cobre o caso.

## SEO e acessibilidade

- Paginas publicas precisam manter `HeadlessSEO` com metadados consistentes.
- Rotas privadas continuam `noindex` e usam imagem OG generica.
- Componentes devem manter estrutura semantica e texto alternativo quando houver midia ou icone informativo.

## Mobile first

- O layout precisa se adaptar sem depender de largura de desktop.
- Estados de menu, listas e cards devem funcionar em telas pequenas sem quebra de fluxo.

## Estrutura util

- `Layout/` - shell e navegacao.
- `Common/` - componentes reutilizaveis.
- `Auth/` - fluxo de login e conta.
- `BrandIcons.tsx` - icones de marca locais.

## Pontos de cuidado

- Variants estaticos devem viver no escopo de modulo quando a estabilidade importa.
- O componente nao deve carregar texto hardcoded se a chave de i18n ja existe.
- Layout e SEO nao devem puxar dados direto do provider externo.
- Se existir componente memoizado, evite recriar objetos pesados de props por render.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
