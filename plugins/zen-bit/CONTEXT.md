# BandsInTown Plugin Context - /plugins/zen-bit

> Contexto local do plugin de eventos e schema.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Responsabilidade

Eventos, schema MusicEvent, sitemap de eventos, cache e integracao Bandsintown.

## Regras centrais

- Namespace atual: `zen-bit/v2`.
- A SPA consome a API; nao faz fetch direto do provider externo.
- O plugin nao enfileira assets publicos automaticamente no frontend; o uso publico deve ficar restrito a chamadas REST e, se existir shortcode legado, ele nao deve puxar CSS/JS do plugin por padrao.
- URL canonica de evento vem do normalizer, nao de alias curto.
- Schema precisa manter os campos obrigatorios do MusicEvent quando a pagina for publica.
- A interface administrativa do plugin deve usar apenas estilos internos/sistema, sem dependencias de Google Fonts ou otimizacoes visuais para usuario final.

## Contratos principais

- `GET /events`
- `GET /events/schema`
- `GET /events/{event_id}`
- `GET /events/{event_id}/schema`
- `POST /admin/fetch-now`
- `POST /admin/clear-cache`
- `GET /admin/health`

## Cache

- Upcoming: 6h
- Detail: 24h
- Past: 7d
- O sitemap usa fetch direto para eventos futuros e nao depende do pool SWR.
- `Zen_BIT_Cache::clear_all()` e o ponto de invalidacao central para cache, sitemap e estado derivado.

## Pontos de cuidado

- Evitar double-fetch.
- Usar cache e lock para impedir stampede.
- `build_event_schema()` e a fonte da verdade para JSON-LD do evento.
- Os campos obrigatorios de MusicEvent devem permanecer presentes em qualquer pagina publica.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
