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
- `GET /stats`
- `POST /subscribe`
- `POST /user/update-profile`

## Auth (`zeneyer-auth/v1`)
Aliases:
- `POST /login`
- `POST /register`
- `POST /google`
- `POST /refresh`
- `POST /logout`
- `GET /session`

Rotas completas tambem suportadas:
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

## Eventos (`zen-bit/v2`)
- `GET /events`
- `GET /events/schema`
- `GET /events/{event_id}`
- `GET /events/{event_id}/schema`
- `POST /admin/fetch-now` (admin)
- `POST /admin/clear-cache` (admin)
- `GET /admin/health` (admin)

## Gamificacao (`zengame/v1`)
- `GET /me`
- `GET /leaderboard`

## SEO (`zen-seo/v1`)
- `GET /meta`
- `GET /settings`
- `GET /sitemap`
- `POST /cache/clear`

## Regras de consumo
1. Priorizar parametros de filtro no backend
2. Evitar over-fetch; usar campos necessarios sempre que houver suporte
3. `zen-ra` foi removido do projeto e nao deve aparecer em rotas, exemplos ou integracoes
4. Em caso de duvida, validar no codigo com `register_rest_route`
