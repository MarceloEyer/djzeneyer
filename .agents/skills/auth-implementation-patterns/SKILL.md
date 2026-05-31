---
name: auth-implementation-patterns
description: Authentication and authorization patterns for djzeneyer.com, especially ZenEyer Auth, JWT, Google OAuth, WordPress REST permissions, route guards and user/session privacy.
risk: medium
source: community-adapted
updated: "2026-05-30"
---

# Authentication & Authorization — djzeneyer.com

## Purpose

Guide secure authentication and authorization work in the current project without replacing the existing `zeneyer-auth` plugin architecture.

Current project context:

- WordPress backend.
- Custom plugin: `plugins/zeneyer-auth/`.
- JWT/client auth flows.
- Google OAuth.
- React frontend with `UserContext` and route guards.
- REST endpoints under `zeneyer-auth/v1` and auth aliases.

## When to use

Use this skill when:

- Implementing or changing login/register/logout/session flows.
- Debugging JWT, Google OAuth or protected REST endpoints.
- Designing role/capability checks.
- Updating user profile, orders, newsletter or account endpoints.
- Reviewing route guards in React.
- Handling password reset/set flows.

Do not use this skill for pure login page styling or UI copy.

## Project-specific guardrails

- Keep auth logic aligned with `zeneyer-auth` patterns.
- Protected React routes must use `loadingInitial`, not `loading`, to avoid redirecting before session restoration.
- Do not expose private user data in public AI/search resources.
- Never log JWTs, refresh tokens, Google tokens, password reset tokens, secrets or credentials.
- Public artist/payment/support data is not user auth data and should not be treated as an auth leak by default.
- Admin endpoints require capability checks, commonly `manage_options`.
- Public endpoints require explicit product justification and `permission_callback`.

## Threat model basics

Classify before changing behavior:

| Data/action | Default boundary |
|---|---|
| Public artist identity/content | Public |
| Public payment/support links for artist | Public by product design |
| `llms*`, `.well-known/*`, schema, API catalog | Public by product design |
| User profile | Authenticated user only |
| Orders/customer data | Authenticated owner/admin only |
| Newsletter preference | Authenticated or tokenized flow depending endpoint |
| Admin health/config | Admin only |
| Secrets/tokens/passwords | Never exposed/logged |

If the boundary is ambiguous, ask the human before changing product behavior.

## Implementation checklist

### Backend REST

- Every route has `permission_callback`.
- Authenticated routes verify current user/JWT before returning data.
- Admin routes check capability.
- Inputs use REST args schema and sanitization.
- Responses omit secrets and internal tokens.
- Errors do not leak sensitive state.

### JWT / session

- Validate signature and expiry.
- Avoid storing tokens in places exposed to XSS when possible.
- Keep refresh/session lifecycle consistent with existing plugin behavior.
- Handle logout/session invalidation intentionally.
- Do not invent a new token format unless required.

### Google OAuth

- Validate token/client constraints according to current plugin behavior.
- Treat OAuth tokens as secrets.
- Log only minimal non-sensitive metadata needed for debugging.
- Gracefully handle failed/expired credentials.

### React route guards

- Use `loadingInitial` for initial session restoration.
- Show a stable loading/fallback state while session is being restored.
- Do not redirect protected pages based only on `loading`.
- Private pages should remain `noindex`.

### Authorization

- Prefer capability checks over role-name checks for admin actions.
- For user-owned resources, verify resource owner or admin capability.
- Avoid assuming `user_id` from request params is trusted.

## Validation

```text
Backend:
- anonymous request rejected for protected endpoint
- authenticated owner can access own resource
- other user cannot access resource
- admin can access admin endpoint
- invalid/expired token fails safely

Frontend:
- refresh on private route does not flash redirect incorrectly
- logout clears user state
- private pages have noindex
```

## Related skills

- `wp-headless` for headless architecture.
- `wp-rest-api` for endpoint implementation.
- `backend-security-coder` for secure coding.
- `codeql-security` for CodeQL-specific patterns.
- `react-patterns` for UI guard behavior.

## Output format

```text
Auth surface:
Users/roles involved:
Data boundary:
Risks:
Implementation plan:
Validation cases:
Open questions:
```

## Safety

Never log secrets, tokens or credentials. Enforce least privilege and keep public/private data boundaries explicit.