---
name: wp-headless
description: "Expert in headless/decoupled WordPress architectures. Use for WordPress REST + React SPA integration, JWT auth, CORS, prerender/SSG, cache strategy, and public AI/search resources. For this project, do not default to Next.js, ISR, WPGraphQL, or SSR."
risk: safe
source: "https://lobehub.com/skills/morrealev-wordpress-manager-wp-headless"
date_added: "2026-03-05"
updated: "2026-05-30"
---

# WP Headless Skill

Practical skill for designing, auditing, and operating a decoupled WordPress CMS with a separate modern frontend.

## When to use

Use this skill when building or maintaining headless WordPress architecture:

- WordPress as CMS/backend with separate frontend.
- React SPA integration with WordPress REST API.
- JWT authentication and Google OAuth flows.
- CORS and credentialed API access.
- Prerender/SSG and cache strategy.
- AI/search discovery surfaces backed by WordPress data.

For djzeneyer.com specifically:

- WordPress REST API + React 19 + Vite 8 SPA.
- Public routes are pre-rendered at build time, then hydrated by React.
- The frontend is not Next.js, not Astro, not SSR, and not ISR.
- REST API is the correct default. WPGraphQL adds complexity without clear benefit for current data volume.

## Inputs required

- Affected surface: WordPress plugin/theme, React frontend, script, workflow, `.well-known/*`, or public page.
- Authentication requirements: public content, authenticated user data, admin-only endpoint, or build-time fetch.
- Freshness requirements: static/prerendered, daily deploy, runtime fetch, or admin-triggered update.
- Privacy boundary: public artist/site data vs private user/session/order data.

---

## Procedure

### 0) Detect current architecture

Inspect:

- REST routes via `register_rest_route()`.
- Frontend fetching hooks in `src/hooks/`.
- Query keys in `src/config/queryClient.ts`.
- Prerender behavior in `scripts/prerender.js`.
- Public AI/search resources in `.context/SITE_RESOURCES.md`.
- Operational cache/deploy notes in `.context/OPERATIONS.md`.

### 1) Choose API layer

| Factor | REST API | WPGraphQL |
|---|---|---|
| Built-in | Yes | Plugin required |
| Existing project support | Strong | Not adopted |
| Complexity | Low | Medium/high |
| Best for this project | Current default | Only if REST becomes insufficient |

Rule: use REST unless the human explicitly approves a new GraphQL dependency and there is a concrete query-shape problem.

### 2) Authentication

Current project modes:

- Public endpoints: `permission_callback => __return_true` only when data is intentionally public.
- Authenticated user endpoints: JWT via `zeneyer-auth`.
- Admin endpoints: capability checks such as `manage_options`.
- WordPress admin operations: WP nonce/capability checks.

JWT guardrails:

- Never log tokens or secrets.
- Include user identity, never passwords.
- Validate signature and expiry.
- Keep refresh/session behavior inside `zeneyer-auth` patterns.
- Do not expose private user/order/session data in public AI/search resources.

### 3) CORS

Use exact origins only when credentials are involved:

```php
add_filter('allowed_http_origins', function($origins) {
    $origins[] = 'https://djzeneyer.com';
    $origins[] = 'https://www.djzeneyer.com';
    return $origins;
});
```

Rules:

- Never use `Access-Control-Allow-Origin: *` with credentials.
- Scope `OPTIONS` preflight intentionally.
- Add staging/preview origins only when they exist and are needed.

### 4) Frontend integration

Pattern used in this project:

```typescript
const { data } = useQuery({
  queryKey: QUERY_KEYS.posts(),
  queryFn: fetchPostsFn,
});
```

Rules:

- Fetching belongs in centralized hooks/modules under `src/hooks/`, not directly in components.
- Use React Query v5 for runtime server state.
- Use `_fields` and backend filtering to avoid over-fetch.
- Public stable data should prefer prerender/static payloads when freshness allows.
- `artistData.ts` remains a crucial static fallback/SSOT for public artist data.

### 5) Prerender and freshness

- `scripts/prerender.js` is required for public SEO/GEO/AEO/AI discovery.
- Public routes should produce meaningful prerendered HTML.
- Daily deploy can refresh WordPress posts/events without manual commits.
- Events and posts may be fetched before Puppeteer runs and inlined into `__PRERENDER_DATA__` when route-scoped.
- Do not convert stable public pages into routine live fetches unless freshness requires it.

### 6) Public AI/search resources

This project intentionally exposes public resources for search, grounding, discovery, indexing and training by AI.

Do not restrict or remove without explicit human request:

- `llms.txt`
- `llms-full.txt`
- `.well-known/*`
- `robots.txt` Content Signals with `ai-train=yes`, `search=yes`, `ai-input=yes`
- MCP server card / agent skills index / API catalog
- schema JSON-LD and verified facts surfaces

## Verification checklist

- [ ] `curl https://djzeneyer.com/wp-json/wp/v2/posts` returns JSON when expected.
- [ ] Custom endpoints appear under `/wp-json/`.
- [ ] Public endpoints expose only intentionally public data.
- [ ] Authenticated endpoints reject anonymous access.
- [ ] CORS is exact and credential-safe.
- [ ] `npm run build` or stronger command passes.
- [ ] `npm run build:full` succeeds when prerender/AI/search resources changed.
- [ ] Prerender generates expected public routes.
- [ ] `llms.txt`, `llms-full.txt`, `.well-known/*`, robots and sitemap remain aligned.

## Failure modes / debugging

- **CORS errors:** inspect browser Network tab and preflight headers; verify exact origin allowlist.
- **Authentication failures:** verify Bearer token format, expiry and server-side user resolution.
- **Stale content:** check LiteSpeed/Cloudflare/transients and daily deploy state before changing API code.
- **PHP fatal on REST:** inspect plugin/theme PHP and `debug.log` before debugging frontend.
- **Build/prerender failure:** check API availability, route count, timeout, mocked/intercepted payloads and `__PRERENDER_DATA__` shape.
- **AI/search regression:** check prerendered HTML, Link headers, `.well-known/*`, `robots.txt`, `llms*`, sitemap and canonical URLs.

## Escalation

- For REST endpoint development: `wp-rest-api`.
- For plugin architecture: `wp-plugin-development`.
- For auth security: `auth-implementation-patterns` plus `codeql-security`.
- For backend performance: `wp-performance`.
- For public AI/search resources: `.context/SITE_RESOURCES.md` and `.context/OPERATIONS.md`.