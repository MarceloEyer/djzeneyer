---
name: wp-headless
description: "Expert in headless/decoupled WordPress architectures. Use when choosing between REST API and WPGraphQL, configuring headless authentication (JWT, application passwords, NextAuth/Auth.js), CORS setup, frontend framework integration (Next.js, Nuxt, Astro), content webhooks, and ISR/SSG/SSR strategies."
risk: safe
source: "https://lobehub.com/skills/morrealev-wordpress-manager-wp-headless"
date_added: "2026-03-05"
---

# WP Headless Skill

Practical skill for designing, auditing, and operating a decoupled WordPress CMS with separate modern frontends.

## When to Use

Use this skill when building or maintaining a decoupled/headless WordPress architecture:
- Building a decoupled site with WordPress as the CMS and a separate frontend
- Choosing between REST API and WPGraphQL for data fetching
- Configuring WordPress as a headless CMS backend
- Integrating with Next.js, Nuxt, Astro, or React SPA (Vite) frontends
- Setting up headless authentication (JWT, application passwords, NextAuth/Auth.js)
- Configuring CORS for cross-origin API access
- Implementing content webhooks for on-demand revalidation (ISR)
- Planning SSG, SSR, or ISR rendering strategies
- **This project (djzeneyer.com):** WordPress REST API + React 18 (Vite) SPA

## Inputs Required

- WordPress site: URL, admin access, hosting type
- Frontend framework: Next.js, Nuxt, Astro, or React SPA
- Authentication requirements: public content only vs authenticated features
- Hosting for frontend: Vercel, Netlify, self-hosted VPS
- Deployment strategy: SSG (static), SSR (server), ISR (incremental), or hybrid

---

## Procedure

### 0) Detect Headless Setup

Inspect the current headless architecture:
- Confirm REST API is available at `/wp-json/wp/v2/`
- Check custom endpoints registered via `register_rest_route()`
- Verify auth method in use (JWT plugin, Application Passwords, nonce)
- Confirm CORS headers are set and correct
- Check if WPGraphQL is installed (optional)

### 1) Choose API Layer

Decide between **REST API** (built-in) and **WPGraphQL** (plugin):

| Factor | REST API | WPGraphQL |
|--------|----------|-----------|
| Built-in | ✅ Yes | ❌ Plugin required |
| Flexibility | Endpoint-per-resource | Single `/graphql` endpoint |
| Over-fetching | Yes | No (request specific fields) |
| Complexity | Low | Medium |
| Best for | Simple CMS, existing WP | Complex queries, nested data |

**For djzeneyer.com:** REST API is the correct choice (already implemented). WPGraphQL would add complexity without benefit given the low data volume.

### 2) WPGraphQL Setup (if needed)

```bash
wp plugin install wp-graphql --activate
```

- Explore schema at `/graphql` with GraphiQL
- Register custom types with `show_in_graphql => true`
- Use cursor-based pagination (`first`/`after`)
- Consider WPGraphQL Smart Cache for performance

### 3) Headless Authentication

Choose the authentication method based on use case:
- **Application Passwords** (built-in): best for server-to-server and build-time fetching
- **JWT (plugin)**: best for client-side authentication flows → **used in djzeneyer.com (ZenEyer Auth Pro)**
- **NextAuth/Auth.js**: best for Next.js projects with WordPress as OAuth provider
- **Preview mode**: special auth for draft content preview

**JWT Security Best Practices:**
- Short-lived access tokens (15min–1h)
- Refresh tokens stored in httpOnly cookies
- Include `user_id` in payload, never passwords
- Validate signature AND expiry on every request
- Rotate secret keys periodically

### 4) CORS Configuration

Configure Cross-Origin Resource Sharing:

```php
add_filter('allowed_http_origins', function($origins) {
    $origins[] = 'https://djzeneyer.com';
    $origins[] = 'https://www.djzeneyer.com';
    return $origins;
});
```

**Key Rules:**
- ❌ Never use `Access-Control-Allow-Origin: *` with credentials
- ✅ Always specify exact origins in production (protocol + domain + port)
- ✅ Handle preflight `OPTIONS` requests
- ✅ Include `Authorization` in allowed headers for JWT

### 5) Frontend Integration

Connect the frontend to WordPress data:

**React SPA (Vite) — pattern used in djzeneyer.com:**
```typescript
// useQueries.ts — via React Query (SSOT for data fetching)
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: () => fetch(`${API_BASE}/wp/v2/posts?_fields=id,title,slug`).then(r => r.json())
});
```

**Rules for this project:**
- All fetching via React Query in `useQueries.ts` — never `fetch()` directly in components
- Use `_fields` param to avoid over-fetching
- Backend filters data; frontend only renders

### 6) Content Webhooks and Revalidation

Trigger frontend cache invalidation when WordPress content changes:

```php
add_action('transition_post_status', function($new, $old, $post) {
    if ($new === 'publish') {
        wp_remote_post('https://djzeneyer.com/api/revalidate', [
            'body'    => json_encode(['path' => '/' . $post->post_name]),
            'headers' => [
                'Content-Type'  => 'application/json',
                'Authorization' => 'Bearer ' . get_option('revalidate_secret'),
            ],
        ]);
    }
}, 10, 3);
```

Strategies: path-based ISR, tag-based revalidation, full rebuild triggers.

---

## Verification Checklist

- [ ] `curl https://djzeneyer.com/wp-json/wp/v2/posts` returns JSON
- [ ] Frontend renders WordPress content correctly
- [ ] JWT auth: protected endpoints require valid token, public ones don't
- [ ] CORS headers correct: `Access-Control-Allow-Origin` present in response
- [ ] No credentials sent to `*` origin
- [ ] GitHub Actions build completes: `npm run build` succeeds
- [ ] Prerender generates HTML for all routes in `routes-slugs.json`

## Failure Modes / Debugging

- **CORS errors**: Check browser DevTools Network tab for preflight failures; verify origin whitelist matches exactly (protocol + domain + port)
- **Authentication failures**: Verify JWT format (Bearer token), check expiry, confirm `Authorization` header forwarded in fetch
- **Stale content**: LiteSpeed Cache TTL too high; check if transients are being cleared on content update
- **PHP Fatal on REST**: Check `register_rest_route` namespace conflicts; ensure `ABSPATH` guard is present in all plugins
- **Build failures**: API unreachable during prerender; increase timeout in `prerender.js`; add fallback for missing data

## Escalation

- WPGraphQL docs: https://www.wpgraphql.com/docs
- Next.js WordPress examples: https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress
- Astro WordPress integration: https://docs.astro.build/en/guides/cms/wordpress/
- For REST endpoint development: use the `backend-security-coder` skill
- For authentication security: use the `auth-implementation-patterns` skill
- For SEO in headless: use the `seo-audit` skill
