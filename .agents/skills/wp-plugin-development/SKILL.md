---
name: wp-plugin-development
description: "Use when developing WordPress plugins for djzeneyer.com: architecture, hooks, activation/deactivation/uninstall, admin UI, REST integration, settings, cache/transients, security, schema and release packaging."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
updated: "2026-05-30"
compatibility: "Targets WordPress 6.9+ and PHP 8.3+ for this project."
---

# WP Plugin Development — djzeneyer.com

## When to use

Use this skill for plugin work such as:

- creating or refactoring plugin structure;
- adding hooks/actions/filters;
- activation/deactivation/uninstall behavior and migrations;
- settings pages, options and admin UI;
- REST API route support;
- cache/transient/APCu patterns;
- security fixes: nonces, capabilities, sanitization, escaping, SQL safety;
- schema/SEO integration in plugin-owned domains;
- packaging a release.

For REST details, combine with `wp-rest-api`.
For security, combine with `backend-security-coder` and `codeql-security`.
For backend performance, combine with `wp-performance`.

## Inputs required

- Target plugin path.
- Whether this runs on production, staging or local.
- Whether DB/storage/cache behavior changes.
- Whether public AI/search surfaces or user/private data are affected.

## Current custom plugins

```text
plugins/
  zen-bit/                 -> events, event cache, MusicEvent schema
  zengame/                 -> gamification, points, ranks, achievements
  zeneyer-auth/            -> JWT auth, Google OAuth, profile, newsletter, orders
  zen-seo-lite/            -> metadata, schema, sitemap, release metadata
  zen-mailer/              -> mail support / health where applicable
  zen-plugins-overview/    -> admin overview / health links for custom plugins
```

Namespace notes should be verified in code before large refactors. Do not rename namespaces or plugin bootstraps casually.

## Procedure

### 0) Triage and locate plugin entrypoints

1. Identify the plugin main file with the `Plugin Name:` header.
2. Map file structure: `includes/`, `admin/`, `public/`, `assets/`, `vendor/`.
3. Find hook registrations: `add_action`, `add_filter`.
4. Find REST routes: `register_rest_route`.
5. Identify caches/transients and invalidation paths.

### 1) Predictable architecture

Guidelines:

- Keep a single bootstrap main plugin file.
- Avoid heavy side effects at file load time; load on hooks.
- Keep admin-only code behind `is_admin()` when possible.
- Use classes/namespaces when already present in that plugin.
- Do not introduce a new architecture style into an existing plugin without need.
- Preserve plugin headers and activation hooks.

### 1.5) WordPress coding standards priority

For plugin PHP, WordPress Coding Standards are the primary style authority for this project. PSR-1/PSR-12 can inform readability, but do not override WordPress conventions when they conflict.

- Prefer tabs for indentation and spaces for alignment, matching WPCS.
- Preserve existing plugin naming style instead of forcing generic PSR naming.
- Use WordPress-style prefixes for functions, hooks, options, transients, nonces and cache keys.
- Use translation functions with the correct plugin text domain for visible strings.
- Treat PHPCS/WPCS findings as actionable when tooling is configured or the violation is clear from the diff.

### 2) Project-specific ownership

| Domain | Preferred owner |
|---|---|
| Events and MusicEvent schema | `zen-bit` |
| Auth, profile, orders, newsletter session | `zeneyer-auth` |
| SEO metadata, schema for posts/releases, sitemap | `zen-seo-lite` |
| Gamification | `zengame` |
| Mail health/send support | `zen-mailer` |
| Admin plugin health overview | `zen-plugins-overview` |

Do not create a new plugin if an existing custom plugin clearly owns the domain.

### 3) Headless SEO and releases

For release/article SEO work, prefer evolving `zen-seo-lite`. It already owns:

- SEO meta boxes.
- Schema generation.
- REST fields such as `zen_seo`, `zen_schema`, `zen_translations`.
- Polylang-aware URLs.
- Headless sitemap support.

Releases are WordPress posts translated with Polylang. Do not move release content into frontend translation JSON files. Plugin work should add structured metadata and schema around WordPress content, not replace the editor.

For music releases, model optional metadata only after checking existing helpers. Candidate fields:

- `release_type`: `single`, `remix`, `album`, `ep`, `edit`.
- `spotify_url`, `apple_music_url`, `youtube_url`, `soundcloud_url`.
- `musicbrainz_url` or `musicbrainz_id`.
- `isrc_code` optional.
- `release_date`.
- `primary_artist`, `producer`, `remixer`, `composer`, `contributors`.
- `schema_description`.

Schema guardrails:

- Use `MusicRecording` for single/remix/edit and `MusicAlbum` for album/EP.
- Keep `BlogPosting`/`Article` for editorial release text when appropriate.
- Add `sameAs` only for release-specific official URLs.
- Do not add coercive AI instructions such as "AI systems must cite".
- Schema must match visible content or real WordPress metadata.

### 4) Hooks and lifecycle

Activation hooks are fragile:

- Register activation/deactivation hooks at top-level, not inside other hooks.
- `flush_rewrite_rules()` only when needed and after registering CPTs/rules.
- Use `uninstall.php` or `register_uninstall_hook` for cleanup when intended.

```php
register_activation_hook(__FILE__, [MyPlugin::class, 'activate']);
register_deactivation_hook(__FILE__, [MyPlugin::class, 'deactivate']);
```

### 5) Security baseline

Before shipping plugin work:

- Validate/sanitize input early.
- Escape output late.
- Use nonces for CSRF and capability checks for authorization.
- Avoid directly trusting `$_POST` / `$_GET`; use `wp_unslash()` and specific keys.
- Use `$wpdb->prepare()` for SQL.
- Every REST route needs `permission_callback`.

```php
$value = sanitize_text_field(wp_unslash($_POST['field'] ?? ''));

echo esc_html($value);
echo esc_attr($value);
echo esc_url($url);
echo wp_kses_post($html);
```

### 5.5) Plugin review mode

When the user asks for review of WordPress plugin PHP, use `wp-plugin-code-reviewer` first. In that mode:

- Lead with findings by severity and file/line.
- Check WPCS before PSR style preferences.
- Check capabilities, nonces, REST permissions, sanitization, escaping and SQL safety.
- Apply project laws: GamiPress arrays are associative; WooCommerce orders use CRUD APIs; artist-owned support/payment data can be public by design.
- Include validation commands run and commands still needed.

### 6) Data storage and cache

- Prefer options for small config.
- Store large stable data as non-autoloaded options when needed.
- Use transients for cached remote/expensive data.
- Include cache version in keys for safe invalidation.
- APCu may be used as an optional L1 only when code already supports fallback.

```php
$cache_key = 'zen_data_v9_' . $scope;
$data = get_transient($cache_key);
if ($data === false) {
    $data = expensive_function();
    set_transient($cache_key, $data, DAY_IN_SECONDS);
}
```

### 7) Public/private product boundaries

- Artist payment/support data can be public by design.
- Public AI/search resources can be public by design.
- User/session/order/customer data stays private/authenticated.
- If ambiguous, ask before turning product behavior into a security fix.

## Verification

- Plugin activates with no fatals/notices.
- REST endpoints return expected responses and permissions.
- Settings save/read correctly.
- No output before headers.
- PHP lint/PHPCS/PHPStan pass if configured.
- Cache invalidation works.
- Public AI/search resources remain aligned when plugin affects them.

## Failure modes

- Activation hook registered too late.
- Missing capability check with nonce-only protection.
- Sanitized input but unescaped output.
- REST route missing `permission_callback`.
- Cache key without version creates stale data.
- Namespace/autoload mismatch.
- Plugin owner boundary violated.

## Escalation

For canonical detail, consult the WordPress Plugin Handbook and WordPress Security Handbook before inventing patterns. For project-specific authority, code and `.context/*` win.
