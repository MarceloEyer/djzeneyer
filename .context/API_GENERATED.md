# API_GENERATED.md

> **Gerado automaticamente** por `scripts/generate-api-inventory.mjs` em 2026-06-07.
> Não edite manualmente. Para o mapa curado, veja [`.context/API.md`](./API.md).

Total de endpoints encontrados: **49**

---

## `djzeneyer/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/ai-context` | `get_context` | `__return_true` | `inc/ai-llm.php` |
| `GET` | `/mcp` | `handle_mcp_get` | `__return_true` | `inc/ai-llm.php` |
| `POST` | `/agent-registration` | `register_public_agent` | `__return_true` | `inc/ai-llm.php` |
| `POST` | `/agent-claim` | `claim_public_agent` | `__return_true` | `inc/ai-llm.php` |
| `POST` | `/agent-revoke` | `revoke_public_agent` | `__return_true` | `inc/ai-llm.php` |
| `GET` | `/menu` | `djz_get_menu` | `__return_true` | `inc/api.php` |
| `POST` | `/subscribe` | `djz_subscribe_newsletter` | `__return_true` | `inc/api.php` |
| `GET` | `/products` | `get_products` | `__return_true` | `plugins/zen-commerce/includes/class-rest-controller.php` |
| `GET` | `/products/collections` | `get_collections` | `__return_true` | `plugins/zen-commerce/includes/class-rest-controller.php` |
| `GET` | `/shop/page` | `get_shop_page` | `__return_true` | `plugins/zen-commerce/includes/class-rest-controller.php` |

## `zen-bit/v2`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/events` | `list_events` | `__return_true` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `/events/schema` | `list_events_schema` | `__return_true` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `/events/(?P<event_id>[^/]+)` | `get_event` | `__return_true` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `/events/(?P<event_id>[^/]+)/schema` | `get_event_schema` | `__return_true` | `plugins/zen-bit/zen-bit.php` |
| `POST` | `/admin/fetch-now` | `admin_fetch_now` | `[$api_class], check_admin_auth` | `plugins/zen-bit/zen-bit.php` |
| `POST` | `/admin/clear-cache` | `admin_clear_cache` | `[$api_class], check_admin_auth` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `/admin/health` | `admin_health` | `[$api_class], check_admin_auth` | `plugins/zen-bit/zen-bit.php` |

## `zen-mailer/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/health` | `health` | `[__CLASS__], is_admin` | `plugins/zen-mailer/includes/class-rest-handler.php` |
| `GET` | `/send-test` | `send_test` | `[__CLASS__], is_admin` | `plugins/zen-mailer/includes/class-rest-handler.php` |

## `zen-seo/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/meta` | `get_meta_by_url` | `__return_true` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `/settings` | `get_settings` | `__return_true` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `/profile` | `get_artist_profile` | `__return_true` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `/sitemap` | `get_sitemap_data` | `__return_true` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `POST` | `/cache/clear` | `clear_cache` | — | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |

## `zeneyer-auth/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `POST` | `/login` | `login` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/register` | `register` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/google` | `google_login` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/refresh` | `refresh` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/logout` | `logout` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/session` | `session` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/login` | `login` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/auth/session` | `session` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/register` | `register` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/google` | `google_login` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/validate` | `validate` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/refresh` | `refresh` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/auth/me` | `get_current_user` | `[__CLASS__], check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/logout` | `logout` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/settings` | `get_settings` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/profile` | `get_profile` | `[__CLASS__], check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/profile` | `update_profile` | `[__CLASS__], check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/newsletter` | `get_newsletter_status` | `[__CLASS__], check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/newsletter` | `toggle_newsletter` | `[__CLASS__], check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/orders` | `get_orders` | `[__CLASS__], check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/password/reset` | `request_reset` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/password/set` | `set_password` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |

## `zengame/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/me` | `get_dashboard` | `[__CLASS__], check_auth` | `plugins/zengame/includes/API/class-rest-handler.php` |
| `GET` | `/leaderboard` | `get_leaderboard` | `__return_true` | `plugins/zengame/includes/API/class-rest-handler.php` |
| `POST` | `/track` | `track_interaction` | `[__CLASS__], check_auth` | `plugins/zengame/includes/API/class-rest-handler.php` |

---

## Rotas consideradas inseguras

Endpoints com `permission_callback => __return_true` que merecem revisão:

| Método | Namespace | Rota | Arquivo |
|--------|-----------|------|---------|
| `GET` | `djzeneyer/v1` | `/ai-context` | `inc/ai-llm.php` |
| `GET` | `djzeneyer/v1` | `/mcp` | `inc/ai-llm.php` |
| `POST` | `djzeneyer/v1` | `/agent-registration` | `inc/ai-llm.php` |
| `POST` | `djzeneyer/v1` | `/agent-claim` | `inc/ai-llm.php` |
| `POST` | `djzeneyer/v1` | `/agent-revoke` | `inc/ai-llm.php` |
| `GET` | `djzeneyer/v1` | `/menu` | `inc/api.php` |
| `POST` | `djzeneyer/v1` | `/subscribe` | `inc/api.php` |
| `GET` | `zen-bit/v2 ⚠` | `/events` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `zen-bit/v2 ⚠` | `/events/schema` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `zen-bit/v2 ⚠` | `/events/(?P<event_id>[^/]+)` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `zen-bit/v2 ⚠` | `/events/(?P<event_id>[^/]+)/schema` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `djzeneyer/v1` | `/products` | `plugins/zen-commerce/includes/class-rest-controller.php` |
| `GET` | `djzeneyer/v1` | `/products/collections` | `plugins/zen-commerce/includes/class-rest-controller.php` |
| `GET` | `djzeneyer/v1` | `/shop/page` | `plugins/zen-commerce/includes/class-rest-controller.php` |
| `GET` | `zen-seo/v1` | `/meta` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `zen-seo/v1` | `/settings` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `zen-seo/v1` | `/profile` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `zen-seo/v1` | `/sitemap` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `POST` | `zen-seo/v1` | `/cache/clear` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `POST` | `zeneyer-auth/v1` | `/login` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/register` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/google` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/refresh` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/logout` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `zeneyer-auth/v1` | `/session` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/auth/login` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `zeneyer-auth/v1` | `/auth/session` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/auth/register` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/auth/google` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/auth/validate` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/auth/refresh` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/auth/logout` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `zeneyer-auth/v1` | `/settings` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/auth/password/reset` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `zeneyer-auth/v1` | `/auth/password/set` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `zengame/v1` | `/leaderboard` | `plugins/zengame/includes/API/class-rest-handler.php` |
