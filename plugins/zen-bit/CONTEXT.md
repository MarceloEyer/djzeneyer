# BandsInTown Plugin Context - /plugins/zen-bit

> Contexto local do plugin de eventos e schema.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Responsabilidade

Eventos, schema MusicEvent, sitemap de eventos, cache e integracao Bandsintown.

## Regras centrais

- Namespace atual: `zen-bit/v2`.
- A SPA consome a API; nao faz fetch direto do provider externo.
- URL canonica de evento vem do normalizer, nao de alias curto.
- Schema precisa manter os campos obrigatorios do MusicEvent quando a pagina for publica.

## Cache

- Upcoming: 6h
- Detail: 24h
- Past: 7d

## Pontos de cuidado

- Evitar double-fetch.
- Usar cache e lock para impedir stampede.
- `build_event_schema()` e a fonte da verdade para JSON-LD do evento.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
