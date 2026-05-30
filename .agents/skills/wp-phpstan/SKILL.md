---
name: wp-phpstan
description: "Use when configuring, running, or fixing PHPStan/static analysis for djzeneyer.com WordPress plugins: phpstan.neon, baselines, stubs, WordPress-specific typing and third-party plugin classes."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
updated: "2026-05-30"
compatibility: "Targets WordPress 6.9+ and PHP 8.3+ for this project. Requires Composer-based PHPStan."
---

# WP PHPStan — djzeneyer.com

## When to use

Use this skill when working on PHPStan/static analysis in the custom WordPress plugins, for example:

- Setting up or updating `phpstan.neon` / `phpstan.neon.dist`.
- Generating or updating a baseline.
- Fixing PHPStan errors via WordPress-friendly PHPDoc.
- Typing REST requests, hooks, DB results, GamiPress, WooCommerce and plugin classes.
- Handling third-party plugin/theme classes safely.

## Inputs required

- Current plugin structure, ideally from `wp-project-triage`.
- Whether adding/updating Composer dev dependencies is allowed.
- Whether changing a baseline is allowed.
- Target plugins and analysis scope.

## Current first-party plugin paths

Keep analysis focused on first-party code:

- `plugins/zen-bit/`.
- `plugins/zengame/`.
- `plugins/zeneyer-auth/`.
- `plugins/zen-seo-lite/`.
- `plugins/zen-mailer/` when present in the task.
- `plugins/zen-plugins-overview/` when present in the task.

Exclude generated and vendored code such as `vendor/`, `node_modules/`, `dist/`, `build/`.

## Procedure

### 0) Discover setup

Check for:

- `phpstan.neon` or `phpstan.neon.dist`.
- `composer.json` in root or plugin directories.
- `phpstan/phpstan`.
- `szepeviktor/phpstan-wordpress` or `php-stubs/wordpress-stubs`.
- WooCommerce/GamiPress stubs if needed.

### 1) Load WordPress stubs

WordPress stubs are effectively required. Without them, expect noise around core WP functions/classes.

Confirm the package is installed and referenced.

### 2) Keep config focused

- Start with first-party plugin paths.
- Exclude vendor/generated files.
- Keep `ignoreErrors` narrow, documented and reviewed.
- Do not baseline new errors introduced by the current task.

### 3) Prefer type fixes over ignores

Common WP patterns needing PHPDoc:

- REST callbacks: `WP_REST_Request` and `WP_REST_Response`/`WP_Error` return possibilities.
- Hook callbacks: accurate `@param` types for `add_action` / `add_filter`.
- `$wpdb->get_results()`: array/object shapes.
- `get_post_meta()`: scalar vs array vs empty string.
- `get_option()`: default value and return type.
- GamiPress arrays: associative arrays, not numeric indexes.
- WooCommerce HPOS APIs: use WooCommerce types/stubs when available.

### 4) Third-party plugin classes

When GamiPress/WooCommerce classes are absent from the analysis environment:

- Prefer stubs when available.
- Use targeted `ignoreErrors` only for vendor-specific symbols.
- Do not hide first-party type errors behind broad ignores.

### 5) Baseline management

- Baseline legacy errors once if needed.
- Reduce baseline over time.
- Do not grow baseline in feature/security PRs unless explicitly justified.
- Explain baseline changes in PR body.

## Verification

```bash
vendor/bin/phpstan analyse
composer run phpstan
```

Confirm:

- No unknown WordPress core functions/classes.
- No unexpected baseline growth.
- First-party plugin paths are included.
- New code does not rely on broad ignores.

## Failure modes

- Huge error count: missing stubs or too-broad paths.
- Class not found: autoload/stub issue.
- False positives around hooks: add precise PHPDoc.
- GamiPress/WooCommerce types missing: add stubs or narrow ignores.
- Baseline hides a real newly introduced bug.

## Escalation

If a type depends on a third-party plugin API you cannot confirm, ask for version/source. If fixing requires adding Composer dependencies, confirm before changing dependency files.