# ZenGame Pro — /plugins/zengame/

> **Responsabilidade:** Gaming & Activity Bridge (GamiPress + WooCommerce).
> **Versão:** 1.4.1 | **Namespace REST:** `zengame/v1`

## 🔗 Contratos de API (REST)

- `GET /me` — Dashboard completo (Bearer JWT). Inclui: `points`, `rank`, `achievements`, `stats`, `logs`.
- `GET /leaderboard` — Ranking público por tipo de pontos (Cached 1h).
- `POST /track` — Registro de interações (Download, Click, Share, Listen).

## 🚀 Cache & Performance

| Chave | Recurso | TTL | Invalidação |
|---|---|---|---|
| `djz_gamipress_dashboard_v14_*` | Dashboard do Usuário | 24h | Award, Rank, Order |
| `djz_gamipress_leaderboard_v14_*` | Ranking Público | 1h | Toda premiação de pontos |
| `djz_stats_tracks_*` | Analytics de Download | 6h | Novo pedido concluído |
| `djz_stats_events_*` | Analytics de Eventos | 6h | Novo pedido concluído |

## ⚠️ Armadilhas & Regras (Pitfalls)

1. **GamiPress Rank Type Bug:** `gamipress_get_rank_types()` retorna array associativo. **Sempre usar `array_values()`** antes de indexar com `[0]`.
2. **Achievement Date:** `date_earned` vem do objeto user-achievement, não do post meta.
3. **WooCommerce HPOS:** Nunca use SQL direto em `wp_posts` para contar pedidos. Use `wc_get_orders()`.
4. **Deploy:** Transients ZenGame são limpos automaticamente no CI via `wp transient delete --search="djz_"`.
5. **Fallback:** Se o usuário não tiver rank, o sistema retorna **"Zen Guest"** como título padrão.

---
*Dono da lógica de jogo: Engine PHP. Frontend apenas consome.*
