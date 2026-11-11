# Zen SEO Lite

Headless SEO plugin for the WordPress + React architecture used by DJ Zen Eyer.

## Purpose

- Generate meta tags for the React SPA
- Provide canonical, robots, Open Graph, and Twitter card data
- Generate schema and sitemap payloads
- Expose a small REST surface for SEO settings and cache control
- Keep route configuration aligned with the frontend

## Namespace

`zen-seo/v1`

## Main routes

- `GET /meta`
- `GET /settings`
- `GET /profile`
- `GET /sitemap`
- `POST /cache/clear`

## Rules that matter

- Keep SEO output in sync with `HeadlessSEO` and the route config.
- Keep schema generation defensive.
- Keep cache clear behavior explicit and admin-only.
- Do not add marketing copy here; this file is a technical reference.

## Integration points

- React reads SEO data from the frontend layer.
- Polylang provides content translation for WordPress pages.
- Sitemap output must stay aligned with public routes.
- Structured data must stay compatible with the current schema rules in `AI_CONTEXT_INDEX.md`.

## See also

- `CONTEXT.md`
- `docs/API.md`
- `docs/api-endpoints.md`
- `docs/ARCHITECTURE.md`
