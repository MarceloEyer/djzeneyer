# ZenGame Context - /plugins/zengame

> Contexto local do plugin de gamificacao.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Responsabilidade

Dashboard, leaderboard, pontos, ranks, conquistas e agregacao de dados de GamiPress e WooCommerce.

## Regras centrais

- Namespace atual: `zengame/v1`.
- O frontend consome dados prontos; nao recalcula rank, progresso ou conquistas.
- Pedidos WooCommerce usam HPOS e `wc_get_orders()`.
- Rank types devem ser tratados como estrutura associativa, nao como array numerico simples.

## Cache

- Dashboard por usuario: `djz_gamipress_dashboard_v16_{user_id}`
- Leaderboard: `djz_gamipress_leaderboard_v16_{limit}`
- Stats tracks/events: `djz_stats_tracks_{uid}` e `djz_stats_events_{uid}`

## Pontos de cuidado

- `logout()` no frontend e sincronizado com o contrato do plugin.
- `main_points_slug`, `lastUpdate` e `version` precisam de parse defensivo no React.
- Qualquer mudanca de contrato precisa aparecer em `docs/AI_LEARNINGS.md` e no indice canonico.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
