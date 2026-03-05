---
name: wp-rest-api
description: "Use when creating or updating WordPress REST API routes/endpoints, debugging 401/403/404 errors, adding custom fields/meta to REST responses, exposing CPTs via REST, implementing schema + argument validation, or adjusting response links/pagination."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+)."
---

# WP REST API

## When to use

Use this skill when you need to:

- Create or update REST routes/endpoints
- Debug 401/403/404 errors or permission/nonce issues
- Add custom fields/meta to REST responses
- Expose custom post types or taxonomies via REST
- Implement schema + argument validation
- Adjust response links/embedding/pagination

## Inputs required

- Repo root + target plugin/theme/mu-plugin (path to entrypoint).
- Desired namespace + version (e.g. `zen-bit/v2`) and routes.
- Authentication mode (cookie + nonce vs JWT vs application passwords).
- Target WordPress version constraints.

## Procedure

### 0) Triage and locate REST usage

Search for existing REST usage:
- `register_rest_route`
- `WP_REST_Controller`
- `rest_api_init`
- `show_in_rest`, `rest_base`, `rest_controller_class`

**For djzeneyer.com, current namespaces:**
| Plugin | Namespace |
|--------|-----------|
| Zen BIT | `zen-bit/v2` |
| ZenGame | `zengame/v1` |
| ZenEyer Auth | `zeneyer-auth/v1` |
| Zen SEO | `zen-seo/v1` |
| WordPress core | `wp/v2` |
| DjZenEyer theme | `djzeneyer/v1` |

### 1) Choose the right approach

- **Expose CPT/taxonomy in `wp/v2`:** Use `show_in_rest => true` + `rest_base`.
- **Custom endpoints:** Use `register_rest_route()` on `rest_api_init`. Prefer a controller class (`WP_REST_Controller` subclass) for anything non-trivial.

### 2) Register routes safely

```php
add_action('rest_api_init', function() {
    register_rest_route('zen-bit/v2', '/events', [
        'methods'             => 'GET',
        'callback'            => [Zen_BIT_API_V2::class, 'list_events'],
        'permission_callback' => '__return_true', // public endpoint
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
- ✅ Use a **unique namespace** `vendor/v1`; avoid `wp/*` unless core
- ✅ Always provide `permission_callback` (use `__return_true` for public endpoints)
- ✅ Use `WP_REST_Server::READABLE/CREATABLE` constants for methods
- ✅ Return data via `rest_ensure_response()` or `WP_REST_Response`
- ✅ Return errors via `WP_Error` with explicit `status`

### 3) Validate/sanitize request args

```php
// Define args with type, default, required, sanitize_callback
'args' => [
    'user_id' => [
        'required'          => true,
        'type'              => 'integer',
        'sanitize_callback' => 'absint',
        'minimum'           => 1,
    ],
],

// Never read $_GET/$_POST directly inside endpoints
$user_id = (int) $request->get_param('user_id'); // ✅
$user_id = (int) $_GET['user_id'];               // ❌
```

### 4) Responses, fields, and links

```php
// Use rest_ensure_response()
return rest_ensure_response([
    'id'    => $user_id,
    'name'  => $user->display_name,
    'email' => $user->user_email,
]);

// Register additional fields on existing endpoints
register_rest_field('post', 'zen_custom_field', [
    'get_callback'    => fn($post) => get_post_meta($post['id'], '_zen_field', true),
    'update_callback' => null,
    'schema'          => ['type' => 'string'],
]);
```

- ✅ Use `_fields` param support (built-in) to reduce payload
- ✅ Do NOT remove core fields from default endpoints; add fields instead

### 5) Authentication and authorization

For this project (djzeneyer.com), two auth modes are used:
- **JWT (ZenEyer Auth Pro):** `Authorization: Bearer <token>` for client-side user auth
- **WP nonce:** `X-WP-Nonce` header for admin AJAX calls

```php
// JWT auth check pattern (used in ZenGame)
private function check_auth(WP_REST_Request $request): bool {
    $user_id = get_current_user_id(); // Works if JWT is in request
    return $user_id > 0;
}

// Capability check for admin endpoints
'permission_callback' => fn() => current_user_can('manage_options'),
```

### 6) Client-facing behavior

- Support `_fields` to limit response payload: `/wp-json/zen-bit/v2/events?_fields=id,title,date`
- Remember `per_page` is capped at 100
- Add pagination headers: `X-WP-Total`, `X-WP-TotalPages`

## Verification

- `/wp-json/` index includes your namespace
- `OPTIONS` on your route returns schema (when provided)
- Endpoint returns expected data; permission failures return 401/403 as appropriate
- `curl -I https://djzeneyer.com/wp-json/zen-bit/v2/events` returns `200 OK`

## Failure modes / debugging

- **404:** `rest_api_init` not firing, route typo, or permalinks off (try `?rest_route=`)
- **401/403:** missing nonce/auth, or `permission_callback` too strict
- **`_doing_it_wrong` for missing `permission_callback`:** add it (use `__return_true` if public)
- **Invalid params:** missing/incorrect `args` schema or validation callbacks
- **Fields missing:** `show_in_rest` false, meta not registered, or CPT lacks `custom-fields` support

## Escalation

If version support or behavior is unclear, consult the [REST API Handbook](https://developer.wordpress.org/rest-api/) and core docs before inventing patterns.
