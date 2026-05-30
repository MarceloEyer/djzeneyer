---
name: backend-security-coder
description: Secure backend coding for djzeneyer.com, especially WordPress/PHP plugins, REST APIs, auth boundaries, sanitization, escaping, SQL safety, CSP/CORS and public/private data classification.
risk: medium
source: community-adapted
updated: "2026-05-30"
---

# Backend Security Coder — djzeneyer.com

## Purpose

Apply secure backend coding practices to the real project stack:

- WordPress custom plugins.
- PHP 8.3+.
- WordPress REST API.
- JWT/Google OAuth via `zeneyer-auth`.
- LiteSpeed/Cloudflare/CSP/CORS.
- Public AI/search resources by design.

This skill is for secure implementation and review. For CodeQL-specific findings, use `codeql-security` first. For REST endpoint design, use `wp-rest-api`. For auth architecture, use `auth-implementation-patterns` + `wp-headless`.

## Project-specific security posture

Do not treat intentional public product surfaces as leaks:

- Public artist payment/support data such as Pix, PayPal, Wise, IBAN/SWIFT/bank fields are public by design when they are the artist's own support/payment details.
- Public AI/search resources are public by design: `llms*`, `.well-known/*`, API catalog, MCP/server card, Agent Skills public resources, schema and Content Signals.
- Public content may be used for search, grounding, discovery, indexing and AI training.

Still private:

- User data.
- Sessions and JWT secrets.
- Passwords and reset tokens.
- API/SMTP/secrets.
- Private order/customer/payment details.
- Third-party payment data not owned by the artist.

If a finding could be either intentional product behavior or a leak, ask the human before changing behavior.

## When to use

Use this skill when:

- Reviewing or writing PHP plugin code.
- Creating/changing REST endpoints.
- Handling user input/output.
- Touching authentication, authorization, sessions or JWT.
- Handling external requests, webhooks or remote content.
- Changing CSP, CORS, headers or `.htaccess` behavior.
- Fixing security alerts.

## Core rules

### Input and output

- Validate/sanitize input early.
- Escape output late.
- Use context-appropriate WordPress escaping.
- Never echo raw `$_GET`, `$_POST`, DB values or remote API data.
- Use `wp_unslash()` before sanitizing request superglobals.

| Context | Function |
|---|---|
| HTML text | `esc_html()` |
| HTML attribute | `esc_attr()` |
| URL output | `esc_url()` |
| URL storage/redirect | `esc_url_raw()` |
| Textarea | `esc_textarea()` |
| Limited safe HTML | `wp_kses()` |
| Integer/ID | `absint()` |
| Text input | `sanitize_text_field()` |
| Key/slug | `sanitize_key()` |
| Email | `sanitize_email()` |

### SQL

- Always use `$wpdb->prepare()`.
- Prefer WordPress APIs over raw SQL.
- For WooCommerce HPOS, use `wc_get_orders()`, not SQL over `wp_posts`.

### REST API

- Every route needs `permission_callback`.
- Public endpoints use `__return_true` only when data is intentionally public.
- Authenticated endpoints require JWT/user identity/capability checks.
- Admin endpoints require capability checks such as `manage_options`.
- Use `WP_Error` with explicit status for failures.
- Sanitize args via `args` schema and request methods, not raw superglobals.

### Auth and sessions

- Never log tokens, secrets or credentials.
- Validate JWT signature and expiry.
- Keep auth logic aligned with `zeneyer-auth` patterns.
- Avoid broad role assumptions. Check exact capabilities.

### CSP, CORS and headers

- CSP is generated dynamically in `inc/csp.php`. Do not unset it in `.htaccess`.
- HSTS is managed by Cloudflare. Do not create a second source of truth in `.htaccess`.
- Never use wildcard CORS with credentials.
- YouTube/embed header issues should be solved in CSP/iframe allow rules, not by disabling CSP globally.

### External requests

- Validate URLs and protocols.
- Add timeouts to `wp_remote_get()` / `wp_remote_post()`.
- Fail closed or degrade gracefully.
- Avoid SSRF by not fetching arbitrary user-provided URLs unless allowlisted or heavily validated.

## CodeQL alignment

Before writing sanitization or HTML stripping code, read `codeql-security`.

Important patterns:

- Avoid tag-specific regex stripping like `<script\b...>`.
- Prefer generic loop removal and final sweep for plain-text strip use cases.
- Use `sanitizeHtml()` for trusted allowlisted HTML in React.
- Every `dangerouslySetInnerHTML` must have approved sanitization.

## Review checklist

- [ ] Input sanitized.
- [ ] Output escaped.
- [ ] SQL prepared or avoided.
- [ ] REST route has permission callback.
- [ ] Public/private data boundary is intentional.
- [ ] No secrets/tokens in logs.
- [ ] CSP/CORS/header changes respect project owners.
- [ ] External requests have timeout and validation.
- [ ] CodeQL risks considered.
- [ ] Product-intent public data was not made private by assumption.

## Output format

```text
Security scope:
Data classification:
Threat/risk:
Recommended implementation:
Validation:
Open questions:
```

## When not to use

Do not use this skill for pure frontend UI, copy, SEO metadata, non-security performance work or content strategy unless there is a security boundary involved.