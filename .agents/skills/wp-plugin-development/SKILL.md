---
name: wp-plugin-development
description: "Use when developing WordPress plugins: architecture and hooks, activation/deactivation/uninstall, admin UI and Settings API, data storage, cron/tasks, security (nonces/capabilities/sanitization/escaping), and release packaging."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+)."
---

# WP Plugin Development

## When to use

Use this skill for plugin work such as:

- creating or refactoring plugin structure (bootstrap, includes, namespaces/classes)
- adding hooks/actions/filters
- activation/deactivation/uninstall behavior and migrations
- adding settings pages / options / admin UI (Settings API)
- security fixes (nonces, capabilities, sanitization/escaping, SQL safety)
- packaging a release (build artifacts, readme, assets)

## Inputs required

- Repo root + target plugin(s) (path to plugin main file if known).
- Where this plugin runs: single site vs multisite.
- Target WordPress + PHP versions (affects available APIs and placeholder support in `$wpdb->prepare()`).

## Procedure

### 0) Triage and locate plugin entrypoints

1. Identify the plugin main file (the one with the `Plugin Name:` header).
2. Map the file structure: `includes/`, `admin/`, `public/`, etc.
3. Find existing hook registrations (`add_action`, `add_filter`).

### 1) Follow a predictable architecture

Guidelines:

- Keep a **single bootstrap** (main plugin file with header).
- Avoid heavy side effects at file load time; load on hooks.
- Prefer a dedicated loader/class to register hooks.
- Keep admin-only code behind `is_admin()` to reduce frontend overhead.
- Use **Singleton pattern** for the main class (pattern used in this project).
- Use **namespaces** for all classes (PSR-4 style): `namespace ZenEyer\Auth\Core;`

**For this project (djzeneyer.com):**
```
plugins/
  zen-bit/          → namespace ZenBit\  ✅
  zengame/          → no namespace ⚠️ (should be ZenEyer\Game\)
  zeneyer-auth/     → namespace ZenEyer\Auth\  ✅
  zen-seo-lite/     → namespace ZenEyer\SEO\  ✅
```

### 2) Hooks and lifecycle (activation/deactivation/uninstall)

Activation hooks are fragile; follow guardrails:

- Register activation/deactivation hooks **at top-level**, not inside other hooks
- `flush_rewrite_rules()` only when needed and only after registering CPTs/rules
- `uninstall.php` or `register_uninstall_hook` for cleanup

```php
// ✅ Correct — top level of main file
register_activation_hook(__FILE__, [MyPlugin::class, 'activate']);
register_deactivation_hook(__FILE__, [MyPlugin::class, 'deactivate']);

// ❌ Wrong — inside another hook
add_action('plugins_loaded', function() {
    register_activation_hook(__FILE__, ...); // Too late, won't fire
});
```

### 3) Settings and admin UI (Settings API)

Prefer Settings API for options:

```php
register_setting('my_plugin_group', 'my_plugin_option', [
    'sanitize_callback' => 'sanitize_text_field',
    'default'           => '',
]);
add_settings_section('main', 'Main Settings', $callback, 'my-plugin');
add_settings_field('my_field', 'Label', $field_callback, 'my-plugin', 'main');
```

### 4) Security baseline (always)

Before shipping any plugin feature:

- ✅ Validate/sanitize input **early**; escape output **late**
- ✅ Use nonces to prevent CSRF **AND** capability checks for authorization
- ✅ Avoid directly trusting `$_POST` / `$_GET`; use `wp_unslash()` and specific keys
- ✅ Use `$wpdb->prepare()` for SQL; never string concatenation
- ❌ Never use `echo $_GET['param']` without escaping

```php
// Input
$value = sanitize_text_field(wp_unslash($_POST['field'] ?? ''));

// Output
echo esc_html($value);
echo esc_attr($value);
echo esc_url($url);
echo wp_kses_post($html);

// SQL
$wpdb->get_results($wpdb->prepare(
    "SELECT * FROM {$wpdb->prefix}my_table WHERE id = %d",
    $id
));
```

### 5) Data storage and transients

- Prefer **options** for small config.
- Use **transients** for cached remote data (pattern used in ZenGame and Zen BIT).
- Write upgrade routines and store schema version for DB migrations.

```php
// Transient pattern (used in ZenGame/ZenBIT)
$cache_key = 'my_plugin_v2_data_' . $user_id;
$data = get_transient($cache_key);
if ($data === false) {
    $data = expensive_function();
    set_transient($cache_key, $data, DAY_IN_SECONDS);
}
```

## Verification

- Plugin activates with no fatals/notices (check `debug.log`)
- Settings save and read correctly (capability + nonce enforced)
- Uninstall removes intended data (and nothing else)
- No `PHP_EOL` output before headers
- PHPCS/PHPStan passes if configured

## Failure modes / debugging

- **Activation hook not firing:** hook registered incorrectly (not in main file scope), wrong main file path
- **Settings not saving:** settings not registered, wrong option group, missing capability, nonce failure
- **Fatal on activation:** syntax error, missing `require_once`, PHP version mismatch
- **Security regressions:** nonce present but missing capability checks; or sanitized input not escaped on output

## Escalation

For canonical detail, consult the [Plugin Handbook](https://developer.wordpress.org/plugins/) and [Security section](https://developer.wordpress.org/plugins/security/) before inventing patterns.
