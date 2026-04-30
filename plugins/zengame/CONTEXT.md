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

## Contratos principais

- `GET /me`
- `GET /leaderboard`
- `POST /track`

## Resposta do dashboard

- `main_points_slug` precisa continuar consistente com a SSOT usada no frontend.
- `lastUpdate` e `version` sao campos consumidos pela UI e devem permanecer defensivos no parse.
- `cache` indica estado operacional e pode alternar entre `warm` e `running`.

## Cache

- Dashboard por usuario: `djz_gamipress_dashboard_v16_{user_id}`
- Leaderboard: `djz_gamipress_leaderboard_v16_{limit}`
- Stats tracks/events: `djz_stats_tracks_{uid}` e `djz_stats_events_{uid}`
- Cache version atual: `v16`.
- Alteracoes em pontos, ranks ou papel do usuario invalidam cache de dashboard e leaderboard.

## Pontos de cuidado

- `logout()` no frontend e sincronizado com o contrato do plugin.
- `main_points_slug`, `lastUpdate` e `version` precisam de parse defensivo no React.
- Qualquer mudanca de contrato precisa aparecer em `docs/AI_LEARNINGS.md` e no indice canonico.
- `gamipress_get_rank_types()` retorna array associativo; use `array_values()` antes de acessar `[0]`.
- Estatisticas derivadas de pedidos usam `wc_get_orders()` por compatibilidade com HPOS.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
