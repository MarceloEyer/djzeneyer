# API.md - Referencia Canonica de Endpoints

Base REST: `https://djzeneyer.com/wp-json`

## Namespaces oficiais
- `djzeneyer/v1` (tema/headless)
- `zeneyer-auth/v1` (auth JWT)
- `zen-bit/v2` (eventos)
- `zengame/v1` (gamificacao)
- `zen-seo/v1` (SEO headless)

## Tema (`djzeneyer/v1`)
- `GET /menu?lang=pt|en`
- `GET /shop/page`
- `GET /products`
- `GET /products/collections`
- `GET /stats` (Site totals)
- `POST /subscribe`
- `POST /user/update-profile` (LEGACY - use `zeneyer-auth/v1/profile` instead)

## Auth (`zeneyer-auth/v1`)
Aliases (Commonly used):
- `POST /login`
- `POST /register`
- `POST /google`
- `POST /refresh`
- `POST /logout`
- `GET /session`

Full Auth Routes:
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/google`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/session`
- `POST /auth/validate`
- `GET /auth/me`
- `GET|POST /profile` (User Profile)
- `GET|POST /newsletter`
- `GET /orders`
- `POST /auth/password/reset`
- `POST /auth/password/set`
- `GET /settings` (Public Auth Settings)

## Eventos (`zen-bit/v2`)
- `GET /events`
- `GET /events/schema`
- `GET /events/{event_id}`
- `GET /events/{event_id}/schema`
- `POST /admin/fetch-now` (admin)
- `POST /admin/clear-cache` (admin)
- `GET /admin/health` (admin)

## Gamificacao (`zengame/v1`)
- `GET /me` (Authenticated)
- `GET /leaderboard` (Public)
- `POST /track` (Authenticated - Track interaction)

## SEO (`zen-seo/v1`)
- `GET /meta` (Metadata by URL)
- `GET /settings` (Global SEO settings)
- `GET /profile` (Artist Profile - Single Source of Truth)
- `GET /sitemap` (Dynamic sitemap data)
- `POST /cache/clear` (Admin)

## Regras de consumo
1. Priorizar parametros de filtro no backend
2. Evitar over-fetch; usar campos necessarios sempre que houver suporte
3. `zen-ra` foi removido do projeto e nao deve aparecer em rotas, exemplos ou integracoes
4. Em caso de duvida, validar no codigo com `register_rest_route`

