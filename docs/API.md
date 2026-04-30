# API.md - Curated API map

> Short map for AI agents and contributors.
> The exhaustive route inventory lives in `docs/api-endpoints.md`.
> If there is any conflict, the real code and `register_rest_route()` win first.

Base REST: `https://djzeneyer.com/wp-json`

## Scope

Only the project-owned namespaces and the theme routes that AI agents need most often are listed here.
Theme REST routes live in `inc/api.php` and `inc/ai-llm.php`.

## Project namespaces

- `djzeneyer/v1` - theme and AI context
- `zeneyer-auth/v1` - JWT auth
- `zen-bit/v2` - events and schema
- `zengame/v1` - gamification
- `zen-seo/v1` - headless SEO

## Theme routes (`djzeneyer/v1`)

- `GET /ai-context`
- `GET /menu?lang=pt|en`
- `GET /shop/page`
- `GET /products`
- `GET /products/collections`
- `POST /subscribe`
- `POST /user/update-profile`

## Auth (`zeneyer-auth/v1`)

- `POST /login`
- `POST /register`
- `POST /google`
- `POST /refresh`
- `POST /logout`
- `GET /session`

Alias endpoints also exist under `/auth/*`:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/google`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/session`
- `POST /auth/validate`
- `GET /auth/me`
- `GET|POST /profile`
- `GET|POST /newsletter`
- `GET /orders`
- `POST /auth/password/reset`
- `POST /auth/password/set`

## Events (`zen-bit/v2`)

- `GET /events`
- `GET /events/schema`
- `GET /events/{event_id}`
- `GET /events/{event_id}/schema`
- `POST /admin/fetch-now` (admin)
- `POST /admin/clear-cache` (admin)
- `GET /admin/health` (admin)

## Gamification (`zengame/v1`)

- `GET /me`
- `GET /leaderboard`
- `POST /track`

## SEO (`zen-seo/v1`)

- `GET /meta`
- `GET /settings`
- `GET /profile`
- `GET /sitemap`
- `POST /cache/clear`

## Divergences resolved

- `theme-config` and `/stats` were removed from this summary because they are not registered in the current code.
- `GET /ai-context` was added because it exists in `inc/ai-llm.php`.

## Consumption rules

1. Prefer backend filtering.
2. Avoid over-fetch when a route supports fields or filters.
3. `docs/api-endpoints.md` is the exhaustive inventory.
4. Use `register_rest_route()` in code to verify anything that looks stale.
