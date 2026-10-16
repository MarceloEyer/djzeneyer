# ZenEyer Auth

JWT authentication plugin for the headless WordPress + React stack.

## Purpose

- Login, logout, refresh, and session validation
- Email/password auth and Google OAuth
- Bearer auth for native WordPress REST endpoints
- Turnstile-backed registration protection
- Newsletter state sync with MailPoet
- Profile and account data for the authenticated frontend

## Namespace

`zeneyer-auth/v1`

## Main routes

- `POST /login`
- `POST /register`
- `POST /google`
- `POST /refresh`
- `POST /logout`
- `GET /session`
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

## Behavior that matters

- Native WordPress endpoints can accept `Authorization: Bearer` when the auth bridge is active.
- The frontend should treat `GET /session` as the source of truth for login state.
- Registration flows must keep the server-side validation path in place.
- Profile and newsletter state need to stay in sync with user meta and MailPoet.

## See also

- `CONTEXT.md`
- `docs/API.md`
- `docs/api-endpoints.md`
- `docs/ARCHITECTURE.md`

## Security notes

- **JWT secret**: defina `ZENEYER_JWT_SECRET` no `wp-config.php`. Sem a constante o plugin gera um segredo no banco (sem autoload) e mostra um aviso no admin.
- **JWT scope**: o token autentica em `zeneyer-auth/v1`, `zengame/v1`, `wc/v3` e `mailpoet/v1`. Em `wc/v3` e `mailpoet/v1`, contas com `manage_options`, `manage_woocommerce`, `edit_others_posts` ou `promote_users` não são autenticadas por JWT. Ajuste com os filtros `zeneyer_auth_jwt_first_party_namespaces` e `zeneyer_auth_jwt_privileged_caps`.
- **CORS**: use apenas origens exatas em "Specific Allowed Origins", como `https://app.exemplo.com`, além das origens locais de desenvolvimento. `allow_all_origins` não tem mais efeito.
- **Client IP**: `Core/Client_IP` confia em headers de proxy apenas para Cloudflare, loopback e IPs adicionados via `zeneyer_auth_trusted_proxies`. Revisar as faixas em https://www.cloudflare.com/ips/ quando a Cloudflare publicar mudanças.
- **Rate limit** (por IP e ação): `login`, `register`, `google_login`, `refresh`, `password_reset`, `password_set`. Limites em Settings (`rate_limit_attempts`, `rate_limit_duration`).
- **Registro**: `Security_Shield` remove usuários criados fora dos fluxos validados (Turnstile/Google). Integrações legítimas usam o filtro `zeneyer_auth_allow_user_registration`.
