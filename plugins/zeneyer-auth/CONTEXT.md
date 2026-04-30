# Auth Plugin Context - /plugins/zeneyer-auth

> Contexto local do plugin de autenticacao headless.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Responsabilidade

Autenticacao JWT, Google OAuth, session, profile, newsletter e reset de senha.

## Regras centrais

- Flows de autenticacao (login, register, google, logout) sao gerenciados por `UserContext.tsx`. Consultas de dados (profile, orders) passam por `src/hooks/useQueries.ts`.
- `logout()` continua sincrona.
- JWT secret nao fica em arquivo versionado.
- Mudanca de contrato precisa refletir em `CLAUDE.md`, `AI_CONTEXT_INDEX.md` e `docs/AI_LEARNINGS.md` quando relevante.

## Endpoints de uso comum

- `POST /login`
- `POST /register`
- `POST /google`
- `POST /refresh`
- `POST /logout`
- `GET /session`
- `GET /auth/me`
- `POST /auth/password/reset`
- `POST /auth/password/set`
- `GET|POST /profile`
- `GET|POST /newsletter`
- `GET /orders`

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
