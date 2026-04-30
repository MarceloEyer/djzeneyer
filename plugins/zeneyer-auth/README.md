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
