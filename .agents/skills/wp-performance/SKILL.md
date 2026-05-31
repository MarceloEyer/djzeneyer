---
name: wp-performance
description: "Use when a WordPress/plugin/REST endpoint is slow or cache-heavy in djzeneyer.com: TTFB, admin, REST, WP-Cron, DB queries, autoloaded options, transients, APCu, LiteSpeed, Cloudflare and remote HTTP calls."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
updated: "2026-05-30"
compatibility: "Targets WordPress 6.9+ and PHP 8.3+ for this project. Some workflows require WP-CLI."
---

# WP Performance — djzeneyer.com

## When to use

Use this skill when:

- A WordPress page, REST endpoint, admin screen or cron task is slow.
- You need a profiling plan or performance review.
- You are optimizing DB queries, autoloaded options, object cache/transients/APCu, cron tasks or remote HTTP calls.
- A change could affect LiteSpeed/Cloudflare cache behavior.

For frontend/bundle/Core Web Vitals, use `web-performance-optimization` too.

## Project performance strategy

The site is low-update and cache-friendly. Priority is:

- cache persistence;
- CPU economy;
- stable prerender/static public routes;
- small route-scoped payloads;
- avoiding routine expensive live REST fetches;
- preserving public AI/search resources.

Do not add `NOCACHE` for `/wp-json/`, `/feed/` or `/api/` by default. Public stable REST can be cached.

## Infrastructure context

- Server: Hostinger VPS + LiteSpeed.
- Cache: LiteSpeed Cache plugin + Cloudflare + OPcache.
- Redis: not assumed available.
- APCu: optional L1 only where code supports fallback.
- PHP: 8.3+ production context.
- Strategy: long-lived transients and cache headers for stable public data.

## Inputs required

- Environment: local/staging/prod.
- Target URL/REST route/admin screen.
- Symptom and reproducibility.
- Logged-in vs logged-out.
- Whether write operations/cache flushes are allowed.

## Procedure

### 0) Measure first

Pick a reproducible target:

```bash
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://djzeneyer.com/wp-json/zen-bit/v2/events
curl -I https://djzeneyer.com/wp-json/zen-bit/v2/events
```

Do not optimize blindly.

### 1) Fast diagnostics

Check:

- Autoload bloat.
- Plugin hooks running on every request.
- `WP_DEBUG` or `SAVEQUERIES` left on.
- Expensive remote HTTP calls without cache.
- N+1 queries around posts/users/thumbnails/meta.
- Transient keys without versioning.
- Cache headers missing on public stable endpoints.
- Full cache flushes masking targeted purge opportunities.

### 2) DB queries and cache priming

Avoid N+1 patterns:

```php
$users = get_users(['include' => $user_ids]);
$users_by_id = array_column($users, null, 'ID');
```

For posts/thumbnails/meta, prefer cache priming helpers where applicable, such as `_prime_post_caches()` and `update_meta_cache()`.

### 3) Transients/APCu

Use versioned keys:

```php
$cache_key = 'zen_data_v9_' . $scope;
$data = get_transient($cache_key);
if ($data === false) {
    $data = expensive_db_or_api_call();
    set_transient($cache_key, $data, DAY_IN_SECONDS);
}
```

APCu can be used as optional L1 only if there is fallback to transients or computation when unavailable.

### 4) Remote HTTP

```php
$response = wp_remote_get($url, ['timeout' => 10]);
if (is_wp_error($response)) {
    return [];
}
```

Rules:

- Always set timeout.
- Cache stable remote responses.
- Validate/allowlist user-controlled URLs to avoid SSRF.
- Fail gracefully.

### 5) Autoloaded options

Large data should not autoload:

```php
add_option('zen_large_data', $value, '', 'no');
update_option('zen_large_data', $value, false);
```

### 6) LiteSpeed/Cloudflare

- LiteSpeed handles full-page caching; do not add another page cache layer.
- Use targeted purge when possible.
- Public stable REST endpoints can use `Cache-Control: public, max-age=...`.
- Avoid `nocache_headers()` unless content is truly dynamic/private.
- HSTS belongs to Cloudflare; CSP belongs to `inc/csp.php`.

## Verification

- Re-run the same `curl` measurement.
- Confirm expected cache headers.
- Check no PHP errors in debug log.
- Confirm private/authenticated endpoints are not cached publicly.
- Confirm public AI/search resources remain reachable.

## Failure modes

- Caches mask code changes.
- OPcache stale after deploy.
- Transient TTL set to 0 accidentally.
- Cache key missing version.
- Query Monitor/SAVEQUERIES causes overhead in production.
- Public stable endpoint made private/no-cache by a false security assumption.

## Escalation

If this is production and approval is not explicit, do not install plugins, enable `SAVEQUERIES`, flush all caches during traffic or change server config.