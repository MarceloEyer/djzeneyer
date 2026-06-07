# API_GENERATED.md

> **Gerado automaticamente** por `scripts/generate-api-inventory.mjs` em 2026-06-07.
> Não edite manualmente. Para o mapa curado, veja [`.context/API.md`](./API.md).

Total de endpoints encontrados: **46**

---

## `[$ns]`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/events` | `$api_class, list_events` | `__return_true` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `/events/schema` | `$api_class, list_events_schema` | `__return_true` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `/events/(?P<event_id>[^/]+)` | `$api_class, get_event` | `__return_true` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `/events/(?P<event_id>[^/]+)/schema` | `$api_class, get_event_schema` | `__return_true` | `plugins/zen-bit/zen-bit.php` |
| `POST` | `/admin/fetch-now` | `$api_class, admin_fetch_now` | `$api_class, check_admin_auth` | `plugins/zen-bit/zen-bit.php` |
| `POST` | `/admin/clear-cache` | `$api_class, admin_clear_cache` | `$api_class, check_admin_auth` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `/admin/health` | `$api_class, admin_health` | `$api_class, check_admin_auth` | `plugins/zen-bit/zen-bit.php` |

## `djzeneyer/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/ai-context` | `$this, get_context` | `__return_true` | `inc/ai-llm.php` |
| `GET` | `/mcp` | `$this, handle_mcp_get` | `__return_true` | `inc/ai-llm.php` |
| `POST` | `/agent-registration` | `$this, register_public_agent` | `__return_true` | `inc/ai-llm.php` |
| `POST` | `/agent-claim` | `$this, claim_public_agent` | `__return_true` | `inc/ai-llm.php` |
| `POST` | `/agent-revoke` | `$this, revoke_public_agent` | `__return_true` | `inc/ai-llm.php` |
| `GET` | `/menu` | `djz_get_menu` | `__return_true` | `inc/api.php` |
| `GET` | `/shop/page` | `djz_get_shop_page` | `__return_true` | `inc/api.php` |
| `GET` | `/products` | `djz_get_products` | `__return_true` | `inc/api.php` |
| `GET` | `/products/collections` | `djz_get_product_collections` | `__return_true` | `inc/api.php` |
| `POST` | `/subscribe` | `djz_subscribe_newsletter` | `__return_true` | `inc/api.php` |
| `POST` | `/user/update-profile` | `djz_update_profile` | `__return_true` | `inc/api.php` |
| `GET` | `/gamipress/user-data` | — | — | `inc/api.php` |

## `zen-mailer/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/health` | `__CLASS__, health` | `__CLASS__, is_admin` | `plugins/zen-mailer/includes/class-rest-handler.php` |
| `GET` | `/send-test` | `__CLASS__, send_test` | `__CLASS__, is_admin` | `plugins/zen-mailer/includes/class-rest-handler.php` |

## `zen-seo/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/meta` | `$this, get_meta_by_url` | `__return_true` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `/settings` | `$this, get_settings` | `__return_true` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `/profile` | `$this, get_artist_profile` | `__return_true` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `/sitemap` | `$this, get_sitemap_data` | `__return_true` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `POST` | `/cache/clear` | `$this, clear_cache` | — | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |

## `zeneyer-auth/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `[$route]` | `__CLASS__, $callback` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/login` | `__CLASS__, login` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/auth/session` | `__CLASS__, session` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/register` | `__CLASS__, register` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/google` | `__CLASS__, google_login` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/validate` | `__CLASS__, validate` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/refresh` | `__CLASS__, refresh` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/auth/me` | `__CLASS__, get_current_user` | `__CLASS__, check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/logout` | `__CLASS__, logout` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/settings` | `__CLASS__, get_settings` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/profile` | `__CLASS__, get_profile` | `__CLASS__, check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/profile` | `__CLASS__, update_profile` | `__CLASS__, check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/newsletter` | `__CLASS__, get_newsletter_status` | `__CLASS__, check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/newsletter` | `__CLASS__, toggle_newsletter` | `__CLASS__, check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `GET` | `/orders` | `__CLASS__, get_orders` | `__CLASS__, check_auth` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/password/reset` | `__CLASS__, request_reset` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
| `POST` | `/auth/password/set` | `__CLASS__, set_password` | `__return_true` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |

## `zengame/v1`

| Método | Rota | Callback | Permission | Arquivo |
|--------|------|----------|------------|---------|
| `GET` | `/me` | `__CLASS__, get_dashboard` | `__CLASS__, check_auth` | `plugins/zengame/includes/API/class-rest-handler.php` |
| `GET` | `/leaderboard` | `__CLASS__, get_leaderboard` | `__return_true` | `plugins/zengame/includes/API/class-rest-handler.php` |
| `POST` | `/track` | `__CLASS__, track_interaction` | `__CLASS__, check_auth` | `plugins/zengame/includes/API/class-rest-handler.php` |

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
| `GET` | `djzeneyer/v1` | `/shop/page` | `inc/api.php` |
| `GET` | `djzeneyer/v1` | `/products` | `inc/api.php` |
| `GET` | `djzeneyer/v1` | `/products/collections` | `inc/api.php` |
| `POST` | `djzeneyer/v1` | `/subscribe` | `inc/api.php` |
| `POST` | `djzeneyer/v1` | `/user/update-profile` | `inc/api.php` |
| `GET` | `djzeneyer/v1` | `/gamipress/user-data` | `inc/api.php` |
| `GET` | `[$ns]` | `/events` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `[$ns]` | `/events/schema` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `[$ns]` | `/events/(?P<event_id>[^/]+)` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `[$ns]` | `/events/(?P<event_id>[^/]+)/schema` | `plugins/zen-bit/zen-bit.php` |
| `GET` | `zen-seo/v1` | `/meta` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `zen-seo/v1` | `/settings` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `zen-seo/v1` | `/profile` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `zen-seo/v1` | `/sitemap` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `POST` | `zen-seo/v1` | `/cache/clear` | `plugins/zen-seo-lite/includes/class-zen-seo-rest-api.php` |
| `GET` | `zeneyer-auth/v1` | `[$route]` | `plugins/zeneyer-auth/includes/API/class-rest-routes.php` |
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
