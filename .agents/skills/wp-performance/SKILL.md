---
name: wp-performance
description: "Use when a WordPress site/page/endpoint is slow (TTFB, admin, REST, WP-Cron), when you need profiling recommendations (WP-CLI profile/doctor, Query Monitor), or when optimizing DB queries, autoloaded options, object caching, cron tasks, or remote HTTP calls."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+). Some workflows require WP-CLI."
---

# WP Performance (backend-only)

## When to use

Use this skill when:

- A WordPress site/page/endpoint is slow (frontend TTFB, admin, REST, WP-Cron)
- You need a profiling plan and tooling recommendations
- You're optimizing DB queries, autoloaded options, object caching, cron tasks, or remote HTTP calls

**For djzeneyer.com:** Low-traffic site on Hostinger VPS (LiteSpeed). Priority is cache persistence and CPU economy, not raw throughput.

## Inputs required

- Environment and safety: dev/staging/prod, any restrictions.
- The performance symptom and scope: which URL/REST route/admin screen; when it happens (always vs sporadic; logged-in vs logged-out).

## Infrastructure Context (djzeneyer.com)

- **Server:** Hostinger VPS, LiteSpeed
- **Cache:** LiteSpeed Cache plugin + OPcache active. Redis inaccessible.
- **PHP:** 8.3.30 (LiteSpeed), `memory_limit: 1536M`
- **DB:** MariaDB 11.8.3
- **Strategy:** Long-lived transients (24h+) to minimize DB pressure

## Procedure

### 0) Guardrails: measure first

1. Confirm whether you may run write operations (plugin installs, config changes, cache flush).
2. Pick a reproducible target (URL or REST route) and capture a baseline with `curl`:
   ```bash
   curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\n" https://djzeneyer.com/wp-json/zen-bit/v2/events
   ```

### 1) Fast wins: run diagnostics before deep profiling

Common production foot-guns to check:
- **Autoload bloat:** large values stored as autoloaded options slow every WP bootstrap
- **Plugin count:** too many plugins with `plugins_loaded` hooks add overhead
- `WP_DEBUG` or `SAVEQUERIES` left on in production
- Missing persistent object cache (OPcache ≠ object cache)

### 2) Fix by category

Choose the **dominant bottleneck**:

#### DB queries — N+1 patterns

```php
// ❌ N+1 — 50 SELECT queries for 50 users
foreach ($user_ids as $id) {
    $user = get_user_by('id', $id); // SELECT per iteration
}

// ✅ Batch — 1 SELECT for all users
$users = get_users(['include' => $user_ids]);
$users_by_id = array_column($users, null, 'ID');
```

#### Object cache / transients

Pattern used in this project (ZenGame, Zen BIT):
```php
$cache_key = 'zen_data_v9_' . $scope; // Include version for safe invalidation

$data = get_transient($cache_key);
if ($data === false) {
    $data = expensive_db_or_api_call();
    set_transient($cache_key, $data, DAY_IN_SECONDS); // 24h+ for low-traffic site
}

// Invalidate on relevant events
add_action('gamipress_award_points_to_user', function($user_id) use ($cache_key) {
    delete_transient('zen_data_v9_' . $user_id);
});
```

#### Remote HTTP calls

```php
// Always add timeout + cache remote API responses
$response = wp_remote_get($url, ['timeout' => 10]);
if (is_wp_error($response)) {
    return []; // Fail gracefully
}
```

#### Autoloaded options

```php
// Store large data as NON-autoloaded option
add_option('zen_large_data', $value, '', 'no'); // 'no' = don't autoload
update_option('zen_large_data', $value, false);  // false = don't autoload
```

### 3) LiteSpeed Cache specific (djzeneyer.com)

- LiteSpeed Cache handles full-page caching — don't add additional page caches
- Use `do_action('litespeed_purge_post', $post_id)` to purge specific pages
- REST API responses can be cached with `Cache-Control: public, max-age=3600` headers
- Avoid `nocache_headers()` on public endpoints unless content is truly dynamic

## Verification

- Re-run the same `curl` measurement and compare TTFB before/after
- Confirm cache is being hit: check for `X-Cache: HIT` header in LiteSpeed responses
- No new PHP errors in debug log

## Failure modes / debugging

- **"No change" after code changes:** caches masked results, or OPcache is stale (may need `opcache_reset()`)
- **Transient not expiring:** TTL set to 0 (never expires) instead of intended value
- **`SAVEQUERIES`/Query Monitor causes overhead:** don't run in production unless explicitly approved

## Escalation

- If this is production and you don't have explicit approval, do not install plugins, enable `SAVEQUERIES`, or flush all caches during traffic.
- Reference: https://make.wordpress.org/core/2025/11/18/wordpress-6-9-frontend-performance-field-guide/
