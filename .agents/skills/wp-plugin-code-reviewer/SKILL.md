---
name: wp-plugin-code-reviewer
description: "Review WordPress plugin PHP code for djzeneyer.com. Use when asked to review PRs, diffs, files or snippets touching plugins/, WordPress PHP, hooks, REST routes, settings, admin screens, SQL, sanitization, escaping, capabilities, nonces, PHPCS/WPCS, PHPStan or plugin security."
risk: safe
source: "project-local"
date_added: "2026-06-30"
compatibility: "WordPress-first review for custom plugins on PHP 8.3+."
---

# WP Plugin Code Reviewer

## Purpose

Review custom WordPress plugin PHP with WordPress Coding Standards as the primary style authority. PSR-1/PSR-12 are secondary references only where they do not conflict with WordPress conventions.

Use alongside:

- `wp-plugin-development` for plugin ownership, lifecycle and architecture.
- `backend-security-coder` for sanitization, escaping, SQL, capabilities and public/private boundaries.
- `wp-rest-api` when `register_rest_route`, REST args or permissions are touched.
- `codeql-security` before changing sanitization, HTML stripping or risky sink/source patterns.
- `wp-phpstan` when static analysis config or PHPStan findings are involved.

## Review Stance

Lead with actionable findings, ordered by severity. Do not summarize first. Each finding should include file/line, risk, and a concrete fix direction.

Verify every automated or checklist finding against the actual runtime semantics before recommending a change. Do not manufacture a code change merely to satisfy a scanner or style rule; a defensive-looking rewrite can still introduce a regression.

Severity guide:

- **P0**: exploitable security issue, fatal error, data loss, broken auth/permissions.
- **P1**: likely production regression, missing REST permission, unsafe SQL, persistent XSS, broken plugin activation.
- **P2**: correctness, maintainability, WPCS violations with real impact, missing escaping on low-risk output.
- **P3**: style/naming/documentation issues that are worth fixing but not blockers.

## WordPress-First Checklist

### Plugin structure

- Main plugin file has a valid plugin header and no accidental output.
- Direct access is blocked where appropriate: `defined('ABSPATH') || exit;`.
- Functions, hooks, options, transients, nonces and cache keys are project-prefixed.
- Activation/deactivation hooks are registered at top level and do not depend on late hooks.
- Existing plugin ownership is respected:
  - `zen-bit`: events, event cache, MusicEvent schema.
  - `zengame`: gamification, points, ranks, achievements.
  - `zeneyer-auth`: JWT, Google OAuth, profile, newsletter, orders.
  - `zen-seo-lite`: metadata, schema, sitemap, release metadata.
  - `zen-mailer`: mail support/health.

### WordPress Coding Standards

- Prefer WPCS over PSR-12 when indentation or naming conflicts: tabs for indentation, spaces for alignment.
- Use Yoda conditions where project style expects them.
- Use snake_case for WordPress-style functions and methods when matching existing plugin style; do not force camelCase into WordPress plugin code.
- Use class/file naming consistent with the existing plugin rather than introducing a parallel convention.
- Keep text domains aligned with the plugin.

### Security and data handling

- Validate/sanitize input early; escape output late.
- Use `wp_unslash()` before sanitizing values read from request superglobals.
- Presence checks such as `isset($_POST['submit'])` do not read the value and do not require unslashing or sanitization. Preserve presence semantics for valueless submit buttons.
- Validate input shape before sanitizing. Functions such as `sanitize_text_field()` can throw a `TypeError` when given arrays on PHP 8+.
- Do not sanitize PHP-generated `$_FILES['tmp_name']` paths. Check the upload error and validate with `is_uploaded_file()` before reading, or use the appropriate WordPress upload API.
- Use context-specific escaping: `esc_html`, `esc_attr`, `esc_url`, `esc_textarea`, `wp_kses`.
- Admin actions need capability checks and nonces; nonce-only is not authorization.
- REST routes need explicit `permission_callback`.
- Public REST endpoints using `__return_true` must expose intentionally public data only.
- Do not mark artist-owned payment/support data as a leak; it is public by product design.
- Never expose secrets, tokens, SMTP/API keys, reset tokens, private customer/order data or third-party payment data.

### SQL and WordPress APIs

- Prefer WordPress, WooCommerce and GamiPress APIs over SQL.
- Raw SQL must use `$wpdb->prepare()` unless there are no placeholders.
- WooCommerce orders must use `wc_get_orders()` and CRUD APIs, not SQL over `wp_posts`.
- GamiPress type helpers return associative arrays keyed by slug. Use `array_values($array)[0]` or `reset($array)`, never `$array[0]`.
- For post/user meta loops, prefer cache priming APIs before considering custom SQL.

### REST and headless behavior

- REST callbacks should return arrays/objects, `WP_REST_Response`, or `WP_Error` with explicit status.
- Use route `args` schemas for validation/sanitization where practical.
- Keep authenticated endpoints aligned with `zeneyer-auth` JWT/user patterns.
- Do not make intentional public AI/search resources private without explicit human request.

## Output Format

```text
Findings
- [P1] Title - file:line
  Why it matters:
  Suggested fix:

Open questions
- ...

Validation
- Ran:
- Still needed:
```

If there are no findings, say so clearly and list residual risks or checks not run.

## Verification Commands

Use what exists in the repo; do not invent mandatory tooling.

```shell
# Use PHP from PATH or the PHP executable configured by the project toolchain.
php -l path/to/file.php

# Project checks when relevant.
npm run utf8:check
```

If `php` is not on PATH, use the PHP executable exposed by the existing project or workspace toolchain without hardcoding a user-specific path in the skill. When PHPCS/PHPStan are configured for the touched plugin, run the local configured command. If tooling or dependencies are unavailable, report that limitation instead of pretending compliance was machine-verified.
