# ZenGame Pro — /plugins/zengame/

> **Responsabilidade:** Gaming & Activity Bridge (GamiPress + WooCommerce).
> **Versão:** 1.4.1 | **Namespace REST:** `zengame/v1`

## 🔗 Contratos de API (REST)

1. **SSOT de Gamificação:** Este plugin é o **único** lugar onde lógica de pontuação, níveis e conquistas é processada.
2. **REST Endpoints (`/wp-json/zengame/v1/`):**
   - `GET /me` — Dashboard completo do usuário autenticado (cookie ou Bearer JWT). Inclui: `points`, `rank` (com `menu_order`), `achievements_earned`, `achievements_locked`, `logs`, `stats`, `main_points_slug`.
   - `GET /leaderboard?limit=10` — Ranking público cacheado, agrupado por tipo de pontos.
   - `POST /track` — Registra interação (download, share, listen, click) e dispara hooks do GamiPress.
3. **Agregação:** Cruza GamiPress com WooCommerce (`eventsAttended` via categorias de pedido — HPOS-safe via `wc_get_orders()`).

## 🚀 Cache & Performance

| Chave | Recurso | TTL | Invalidação |
|---|---|---|---|
| `djz_gamipress_dashboard_v15_{user_id}` | Dashboard do Usuário | 24h | Award, Rank, Order |
| `djz_gamipress_leaderboard_v15_{limit}` | Ranking Público | 1h | Toda premiação de pontos |
| `djz_stats_events_{user_id}` | Analytics de Eventos | 6h | Novo pedido concluído |

> **Invalidação:** `clear_user_cache($uid)` apaga dashboard, stats E leaderboard (limits 10, 25, 50) a cada premiação, novo pedido ou troca de rank.
> **Deploy:** transients limpos via `wp transient delete --search="djz_gamipress"` no step "Purge caches" do CI.

## ⚠️ GamiPress API — Realidades Verificadas

| Assunto | ✅ Correto | ❌ Errado (não usar) |
|---|---|---|
| Array de tipos de rank | `array_values(gamipress_get_rank_types())` para indexar com `[0]` | `gamipress_get_rank_types()[0]` diretamente (array associativo) |
| Hook de pontos | `gamipress_award_points_to_user` + compat `gamipress_update_user_points` | usar apenas um sem compatibilidade |
| Achievements | `achievement_type` (singular) | `achievement_types` (plural) |
| Próximo rank | `get_posts()` ordenado por `menu_order ASC` | `gamipress_get_next_rank_id()` (não existe) |
| Balance do usuário | `gamipress_get_user_points($uid, $slug)` | somar `gamipress_user_earnings` |
| Data de conquista | `$item->date_earned` do objeto user-achievement | `get_post_meta($id, '_gamipress_earned_at')` |
| Pedidos WooCommerce | `wc_get_orders(['customer_id' => $uid])` | SQL direto em `wp_posts` (quebra com HPOS) |

## Funções Principais

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
  "stats": { "eventsAttended": 3, "streak": 7, "streakFire": true }
}
```

## Regras

1. **Brain Principle:** `DashboardPage.tsx` nunca calcula progresso ou filtra conquistas. Consome diretamente o que este plugin entrega.
2. **Exclusividade:** Este plugin é o **único** dono da lógica de jogo.
3. **Bootstrap resiliente:** Falha de include/classe não pode derrubar o site. Degradar API/admin; nunca causar fatal no frontend público.

---
*Não duplique cálculos de GamiPress no React. Se o cálculo mudar, mude aqui.*
