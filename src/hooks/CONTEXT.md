# Hooks Context - /src/hooks

> Contexto local dos hooks do frontend.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Regra principal

`useQueries.ts` e o ponto central de data fetching do frontend.

## Regras centrais

- Nenhum componente faz `fetch()` direto quando existe hook apropriado.
- Queries e mutations usam chaves centralizadas.
- Novos endpoints usados pela UI devem nascer como hook aqui antes de espalhar consumo pela tela.
- Tipos de resposta precisam acompanhar o contrato real do backend.

## Pontos de cuidado

- `QUERY_KEYS` e `STALE_TIME` ficam centralizados.
- Dados estaveis devem respeitar cache e invalidacao coerentes.
- Hook novo sem SSOT costuma virar duplicacao de logica.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
