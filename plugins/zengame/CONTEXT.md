# ZenGame Plugin Context — /plugins/zengame

> **Responsibility:** Gaming & Activity Bridge (GamiPress + WooCommerce).
> **Plugin version:** 1.3.7

## Logic Flow

1. **SSOT for Gamification:** Este plugin é o **único** lugar onde a lógica de pontuação, níveis e conquistas deve ser processada.
2. **REST Endpoints (`/wp-json/zengame/v1/`):**
   - `GET /me`: Agrega pontos, ranks, conquistas e logs do usuário autenticado (cookie ou Bearer JWT).
   - `GET /leaderboard`: Ranking público cacheado, agrupado por tipo de pontos.
3. **Data Aggregation:** Cruza dados do GamiPress com o WooCommerce (`totalTracks` via `is_downloadable()`, `eventsAttended` via categorias de pedido HPOS-safe).

## Rules

1. **Brain Principle:** O frontend (**DashboardPage.tsx**) nunca deve calcular progresso ou filtrar conquistas. Ele apenas consome o que este plugin entrega.
2. **Exclusividade:** Este plugin é o **único** dono da lógica de jogo. Se a IA tentar criar rotas de GamiPress em `inc/`, ela está errada.
3. **Caching:** Usa transients com chave `djz_gamipress_{CACHE_VERSION}_{user_id}`. TTL configurável via Admin (padrão 24 h, mínimo 60 s). Invalida automaticamente em novos pedidos ou premiações.
4. **Leaderboard:** Lê de `wp_usermeta` (chave `_gamipress_{slug}_points`) — **não** da tabela `gamipress_user_earnings`, que contém transações individuais e produziria totais errados.

## GamiPress API — Realidades Verificadas

| Assunto | Correto | Errado (não usar) |
|---------|---------|-------------------|
| Hook de pontos | `gamipress_award_points_to_user` | `gamipress_update_user_points` |
| Arg do hook | closure wrapper, `accepted_args=3` | `[$this, 'method']` direto com 4 args |
| Achievements | `achievement_type` (singular) | `achievement_types` (plural) |
| Próximo rank | `get_posts()` ordenado por `menu_order` | `gamipress_get_next_rank_id()` (não existe) |
| Balance do usuário | `gamipress_get_user_points($uid, $slug)` | somar `gamipress_user_earnings` |

## Key Functions

- `get_user_dashboard()`: O "faz-tudo" para o dashboard do usuário.
- `get_user_events_attended()`: Filtra pedidos por categoria de produto (HPOS-safe, sem `_downloadable` meta).
- `get_rank_info()`: Cálculo de progresso e requisitos para o próximo nível via `menu_order`.
- `clear_all_gamipress_cache()`: Purga 3 padrões LIKE: `djz_gamipress_*`, `djz_stats_*`, `timeout_djz_*`.

## Cache Keys

| Padrão | Conteúdo |
|--------|----------|
| `djz_gamipress_dashboard_v13_{user_id}` | Dashboard completo do usuário |
| `djz_gamipress_leaderboard_v13_{limit}_{type}` | Leaderboard público |
| `djz_stats_tracks_{user_id}` | Total de tracks baixados (TTL 6 h) |
| `djz_stats_events_{user_id}` | Total de eventos frequentados (TTL 6 h) |

---

*Não duplique cálculos de GamiPress no React. Se o cálculo mudar, mude aqui.*
