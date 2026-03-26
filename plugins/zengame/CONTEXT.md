# ZenGame Plugin Context — /plugins/zengame

> **Responsabilidade:** Gaming & Activity Bridge (GamiPress + WooCommerce).
> **Versão do plugin:** 1.4.1
> **Namespace REST:** `zengame/v1`

## Fluxo de Dados

1. **SSOT de Gamificação:** Este plugin é o **único** lugar onde lógica de pontuação, níveis e conquistas é processada.
2. **REST Endpoints (`/wp-json/zengame/v1/`):**
   - `GET /me` — Dashboard completo do usuário autenticado (cookie ou Bearer JWT). Inclui: `points`, `rank` (com `menu_order`), `achievements_earned`, `achievements_locked`, `logs`, `stats`, `main_points_slug`.
   - `GET /leaderboard?limit=10` — Ranking público cacheado, agrupado por tipo de pontos.
   - `POST /track` — Registra interação (download, share, listen, click) e dispara hooks do GamiPress.
3. **Agregação de Dados:** Cruza GamiPress com WooCommerce (`totalTracks` via `is_downloadable()`, `eventsAttended` via categorias de pedido — HPOS-safe via `wc_get_orders()`).

## Regras

1. **Brain Principle:** `DashboardPage.tsx` nunca calcula progresso ou filtra conquistas. Consome diretamente o que este plugin entrega.
2. **Exclusividade:** Este plugin é o **único** dono da lógica de jogo. Rotas GamiPress em `inc/` estão erradas.
3. **Caching:** Transients com chave `djz_gamipress_v14_{user_id}`. TTL configurável via Admin (padrão 24h, mínimo 60s). Invalidado automaticamente em novos pedidos, premiações e troca de rank.
4. **Leaderboard:** Lê de `wp_usermeta` (chave `_gamipress_{slug}_points`) — **não** da tabela `gamipress_user_earnings` (contém transações individuais, produziria totais errados).
5. **Bootstrap resiliente:** Falha de include/classe não pode derrubar o site. Degradar API/admin; nunca causar fatal no frontend público.

## GamiPress API — Realidades Verificadas

| Assunto | Correto | Errado (não usar) |
|---|---|---|
| Array de tipos de rank | `array_values(gamipress_get_rank_types())` para indexar com `[0]` | `gamipress_get_rank_types()[0]` diretamente (array associativo) |
| Hook de pontos | `gamipress_award_points_to_user` + compat `gamipress_update_user_points` | usar apenas um sem compatibilidade |
| Achievements | `achievement_type` (singular) | `achievement_types` (plural) |
| Próximo rank | `get_posts()` ordenado por `menu_order ASC` | `gamipress_get_next_rank_id()` (não existe) |
| Balance do usuário | `gamipress_get_user_points($uid, $slug)` | somar `gamipress_user_earnings` |
| Data de conquista | `$item->date_earned` do objeto user-achievement | `get_post_meta($id, '_gamipress_earned_at')` |
| Pedidos WooCommerce | `wc_get_orders(['customer_id' => $uid])` | SQL direto em `wp_posts` (quebra com HPOS) |

## Cache Keys

| Chave | Conteúdo | TTL |
|---|---|---|
| `djz_gamipress_dashboard_v14_{user_id}` | Dashboard completo do usuário | 24h (padrão) |
| `djz_gamipress_leaderboard_v14_{limit}` | Leaderboard público (por limit) | 1h |
| `djz_stats_tracks_{user_id}` | Total de tracks baixados | 6h |
| `djz_stats_events_{user_id}` | Total de eventos frequentados | 6h |

> **Invalidação:** `clear_user_cache($uid)` apaga dashboard, stats E o leaderboard (todos os limits comuns: 10, 25, 50) a cada premiação de pontos, novo pedido ou troca de rank.
> **Deploy:** transients são limpos via `wp transient delete --search="djz_gamipress"` no step "Purge caches" do CI.

## Funções Principais

- `Engine::get_user_total_tracks()` — conta tracks baixáveis via `wc_get_orders()` (HPOS-safe)
- `Engine::get_user_events_attended()` — filtra pedidos por categoria de produto (HPOS-safe)
- `Engine::clear_user_cache()` — invalida dashboard + stats + leaderboard do usuário
- `Engine::track_interaction()` — dispara `do_action('zengame_{action}')` para GamiPress
- `REST_Handler::get_user_rank_data()` — usa `array_values(gamipress_get_rank_types())` para rank type; retorna `menu_order` no `current` e `next`

## Contrato de Resposta `/me` (campos relevantes para o frontend)

```json
{
  "user_id": 1,
  "points": { "zen-point": { "name": "Zen Points", "amount": 1330, "image": "" } },
  "main_points_slug": "zen-point",
  "rank": {
    "current": { "id": 42, "menu_order": 1, "title": "Zen Explorer", "image": "..." },
    "next":    { "id": 55, "menu_order": 2, "title": "Zen Warrior",  "image": "..." },
    "progress": 45.5,
    "requirements": [{ "title": "...", "current": 45, "required": 100, "percent": 45.0 }]
  },
  "stats": { "totalTracks": 12, "eventsAttended": 3, "streak": 7, "streakFire": true }
}
```

---

*Não duplique cálculos de GamiPress no React. Se o cálculo mudar, mude aqui.*
