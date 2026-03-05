---
name: wp-phpstan
description: "Use when configuring, running, or fixing PHPStan static analysis in WordPress projects (plugins/themes/sites): phpstan.neon setup, baselines, WordPress-specific typing, and handling third-party plugin classes."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+). Requires Composer-based PHPStan."
---

# WP PHPStan

## When to use

Use this skill when working on PHPStan in a WordPress codebase, for example:

- Setting up or updating `phpstan.neon` / `phpstan.neon.dist`
- Generating or updating `phpstan-baseline.neon`
- Fixing PHPStan errors via WordPress-friendly PHPDoc (REST requests, hooks, query results)
- Handling third-party plugin/theme classes safely (stubs/autoload/targeted ignores)
- **For djzeneyer.com:** Use this to ensure the custom plugins (`zen-bit`, `zengame`, `zeneyer-auth`, `zen-seo-lite`) are free of silent PHP bugs and adhere to strict typing.

## Inputs required

- `wp-project-triage` output (current plugins and structure)
- Whether adding/updating Composer dev dependencies is allowed (stubs).
- Whether changing the baseline is allowed for this task.

## Procedure

### 0) Discover PHPStan entrypoints (deterministic)
1. Inspect PHPStan setup (config, baseline, scripts):
   - Check for `phpstan.neon` or `phpstan.neon.dist` in the repo root or plugin directories.
   - Check `composer.json` for `phpstan/phpstan` and `szepeviktor/phpstan-wordpress`.

### 1) Ensure WordPress core stubs are loaded

`szepeviktor/phpstan-wordpress` or `php-stubs/wordpress-stubs` are effectively required. Without it, expect a high volume of errors about unknown WordPress core functions.

- Confirm the package is installed in `composer.json`.
- Ensure the PHPStan config references the stubs.

### 2) Ensure a sane `phpstan.neon` for WordPress projects

- Keep `paths` focused on first-party code:
  - `plugins/zen-bit/`
  - `plugins/zengame/`
  - `plugins/zeneyer-auth/`
  - `plugins/zen-seo-lite/`
- Exclude generated and vendored code (`vendor/`, `node_modules/`, `dist/`).
- Keep `ignoreErrors` entries narrow and documented.

### 3) Fix errors with WordPress-specific typing (preferred)

Prefer correcting types over ignoring errors. Common WP patterns that need help:

- **REST endpoints:** Type request parameters using `WP_REST_Request`.
- **Hook callbacks:** Add accurate `@param` types for callback args in `add_action` / `add_filter`.
- **Database results:** Use array shapes or object shapes for `$wpdb->get_results()` calls.
- **GamiPress/WooCommerce:** Use appropriate stubs if available to type-check bridge logic.

### 4) Handle third-party plugin/theme classes (only when needed)

When integrating with plugins not present in the analysis environment (e.g., GamiPress, WooCommerce):

- Prefer plugin-specific stubs: `php-stubs/woocommerce-stubs`.
- If PHPStan still cannot resolve classes, add targeted `ignoreErrors` patterns for the vendor prefix.

### 5) Baseline management

- Generate a baseline once for legacy code, then reduce it over time.
- Do not “baseline” newly introduced errors in the custom plugins.

## Verification

- Run PHPStan: `vendor/bin/phpstan analyse` or `composer run phpstan`.
- Confirm the baseline file (if used) is included and didn’t grow unexpectedly.
- No "Class not found" errors for core WP functions or first-party plugins.

## Failure modes / debugging

- **“Class not found”:** Confirm autoloading/stubs, or add a narrow ignore pattern.
- **Huge error counts:** Reduce `paths`, add `excludePaths`, start at level 0, then ratchet up.
- **Inconsistent types around hooks:** Add explicit PHPDoc rather than runtime guards.

## Escalation

- If a type depends on a third-party plugin API you can’t confirm, ask for the dependency version or source.
- If fixing requires adding new Composer dependencies (stubs/extensions), confirm it with the user first.
