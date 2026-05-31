---
name: wp-rest-api
description: "Use when creating/updating WordPress REST API routes for djzeneyer.com, debugging auth/permissions, exposing public artist/AI resources, validating schemas, or changing response shape/pagination/cache."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
updated: "2026-05-30"
compatibility: "Targets WordPress 6.9+ and PHP 8.3+ for this project."
---

# WP REST API — djzeneyer.com

## When to use

Use this skill when you need to:

- Create or update REST routes/endpoints.
- Debug 401/403/404 errors or permission/nonce issues.
- Add custom fields/meta to REST responses.
- Expose CPTs or taxonomies via REST.
- Implement schema and argument validation.
- Adjust response links, pagination, caching or `_fields` behavior.
- Expose intentionally public artist/site/AI-search resources.

## Inputs required

- Target plugin/theme path.
- Desired namespace and route.
- Authentication mode: public, JWT, admin capability, nonce, application password.
- Data classification: public artist/site data, private user/order/session data, admin-only data.
- Cache/freshness requirements.

## Current namespaces

| Owner | Namespace |
|---|---|
| WordPress core | `wp/v2` |
| Theme | `djzeneyer/v1` |
| Zen BIT | `zen-bit/v2` |
| ZenGame | `zengame/v1` |
| ZenEyer Auth | `zeneyer-auth/v1` |
| Zen SEO Lite | `zen-seo/v1` |

Verify with `register_rest_route()` before changing consumers.

## Data boundary rules

- Public endpoints may expose public artist/site data by design.
- Public AI/search resources may be public by design.
- Artist payment/support data can be public by product decision.
- User profile/order/session/customer data must require auth and ownership/admin checks.
- Admin health/config endpoints must require capability checks.
- If ambiguous, ask before changing visibility.

## Procedure

### 0) Locate REST usage

Search for:

- `register_rest_route`.
- `WP_REST_Controller`.
- `rest_api_init`.
- `show_in_rest`, `rest_base`, `rest_controller_class`.

### 1) Choose route approach

- Expose CPT/taxonomy in `wp/v2`: use `show_in_rest => true` + `rest_base`.
- Custom endpoints: use `register_rest_route()` on `rest_api_init`.
- Prefer controller classes for non-trivial routes.
- Keep namespace owner clear.

### 2) Register routes safely

```php
add_action('rest_api_init', function() {
    register_rest_route('zen-bit/v2', '/events', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => [Zen_BIT_API_V2::class, 'list_events'],
        'permission_callback' => '__return_true', // Only because events are public.
        'args'                => [
            'limit' => [
                'type'              => 'integer',
                'default'           => 50,
                'minimum'           => 1,
                'maximum'           => 200,
                'sanitize_callback' => 'absint',
            ],
            'mode' => [
                'type'    => 'string',
                'default' => 'upcoming',
                'enum'    => ['upcoming', 'past', 'all'],
            ],
        ],
    ]);
});
```

Rules:

- Always provide `permission_callback`.
- Use `__return_true` only for intentionally public data.
- Use `WP_REST_Server` method constants where possible.
- Return data via `rest_ensure_response()` or `WP_REST_Response`.
- Return errors via `WP_Error` with explicit `status`.

### 3) Validate/sanitize request args

```php
'args' => [
    'user_id' => [
        'required'          => true,
        'type'              => 'integer',
        'sanitize_callback' => 'absint',
        'minimum'           => 1,
    ],
],
```

Do not read `$_GET`/`$_POST` directly inside endpoints. Use `WP_REST_Request`.

### 4) Responses and fields

```php
return rest_ensure_response([
    'id'   => $resource_id,
    'name' => $display_name,
]);
```

- Support `_fields` to reduce payload.
- Do not remove core fields from default endpoints unless there is a strong reason.
- Add custom REST fields when extending existing resources.
- Avoid exposing private fields in public endpoints.

### 5) Authentication and authorization

For this project:

- JWT via `zeneyer-auth` for user-facing authenticated endpoints.
- WP nonce for admin/ajax contexts.
- Capability checks for admin endpoints.
- Resource ownership checks for user-owned data.

```php
'permission_callback' => fn() => current_user_can('manage_options'),
```

For user-owned data, verify the current user owns the resource, not only that they are logged in.

### 6) Cache and public endpoints

- Public stable endpoints can send cache headers.
- Avoid `nocache_headers()` on public stable data.
- Use transients/APCu patterns when expensive.
- Events: `zen-bit` owns selection, sorting, canonical paths, cache headers and MusicEvent schema.
- SEO profile/settings: `zen-seo-lite` owns public profile/metadata where applicable.

### 7) Client-facing behavior

- Frontend data access should go through centralized hooks in `src/hooks/`.
- Frontend should not duplicate backend selection rules.
- Prerender can inline route-scoped data as initial cache data.

## Verification

- `/wp-json/` index includes namespace.
- `OPTIONS` on route returns schema when provided.
- Public endpoint returns only intentionally public data.
- Anonymous request rejected for protected endpoint.
- Ownership/auth checks work.
- `curl -I` shows expected cache/security headers.
- Frontend/prerender consumers still build.

## Failure modes

- 404: `rest_api_init` not firing, route typo or permalinks issue.
- 401/403: missing nonce/auth, wrong capability or overly strict callback.
- `_doing_it_wrong`: missing `permission_callback`.
- Invalid params: missing/incorrect args schema.
- Private data leak: response includes user/order/session fields on public route.
- Product regression: intentional public artist/AI resource was made private by assumption.

## Escalation

If WordPress behavior is unclear, consult the REST API Handbook and core docs. If visibility is a product decision, ask the human before changing it.
