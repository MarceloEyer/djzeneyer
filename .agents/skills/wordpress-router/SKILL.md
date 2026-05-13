---
name: wordpress-router
description: "Use when the user asks about WordPress codebases and you need to quickly classify the repo and route to the correct workflow/skill (wp-headless, wp-plugin-development, wp-rest-api, wp-performance, wp-wpcli-and-ops, backend-security-coder, etc.)."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+)."
---

# WordPress Router

## When to use

Use this skill **at the start of most WordPress tasks** in the djzeneyer.com repo to:

- Identify what kind of WordPress work this is (plugin, REST API, headless, ops, performance)
- Pick the right skill and guardrails before touching code
- Delegate to the correct domain skill(s)

**This is the "maestro" skill. Always run it first on ambiguous WordPress tasks.**

## Inputs required

- The user's intent (what they want changed)
- Any constraints (WP version targets, production vs staging, release requirements)

## djzeneyer.com Architecture (Pre-classified)

This repo is **already classified** — no triage script needed:

- **Kind:** `wp-headless` + `wp-site` (custom plugins + React SPA frontend)
- **WP Root:** `/home/u790739895/domains/djzeneyer/public_html`
- **PHP:** 8.3.30 | **WP:** 6.9+ | **DB:** MariaDB 11.8.3
- **Frontend:** React 18 + Vite 7 + TypeScript (separate from WordPress)
- **Plugins (custom):** `zen-bit/`, `zengame/`, `zeneyer-auth/`, `zen-seo-lite/`
- **Theme:** Custom (`zentheme/`) with REST endpoints in `inc/api.php`
- **Hosting:** Hostinger VPS (LiteSpeed) + Cloudflare CDN
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`)

## Routing Decision Tree

Read the full tree at: `skills/wordpress-router/references/decision-tree.md`

### Quick routing for this project

| If the task involves... | Use skill |
|-------------------------|-----------|
| Plugins (`zen-bit`, `zengame`, `zeneyer-auth`, `zen-seo-lite`) | `wp-plugin-development` + `backend-security-coder` |
| REST API routes (`zen-bit/v2`, `zengame/v1`, `zeneyer-auth/v1`) | `wp-rest-api` |
| Headless architecture, CORS, JWT, SPA integration | `wp-headless` |
| Performance issues, N+1, transients, LiteSpeed cache | `wp-performance` |
| WP-CLI, SSH ops, cache flush, rewrite rules, DB | `wp-wpcli-and-ops` |
| React SPA, TypeScript, React Query, routing | `react-patterns` + `typescript-pro` |
| SEO, Schema.org, sitemap, meta tags | `seo-audit` + `schema-markup` |
| Security audit on PHP plugins | `backend-security-coder` |
| Code review, refactoring PHP or TS | `clean-code` |
| GamiPress, points, achievements, ranks | `wp-plugin-development` + `wp-rest-api` |
| Authentication, JWT, Google OAuth | `auth-implementation-patterns` + `wp-headless` |

## Procedure

### 1) Classify the task

Ask: **Where is the change happening?**

```
plugin PHP code?        → wp-plugin-development
REST endpoint PHP?      → wp-rest-api
React/TS frontend?      → react-patterns / typescript-pro
headless arch decision? → wp-headless
slow query/endpoint?    → wp-performance
server/SSH operation?   → wp-wpcli-and-ops
SEO/Schema?             → seo-audit / schema-markup
security review?        → backend-security-coder
```

### 2) Apply guardrails before making changes

- ✅ Confirm environment: is this production or dev?
- ✅ Is a PHP Fatal on the server a risk? Check `debug.log` first.
- ✅ Will this need a cache flush after? Plan `wp cache flush` + `wp rewrite flush --hard`
- ✅ Does the change affect WordPress slugs? → Also update `src/config/routes-slugs.json` (the SSOT)
- ✅ Does the change affect REST endpoints? → Update `zen-plugins-overview.php` Quick Links too

### 3) After changes that affect the live site

```bash
# SSH into Hostinger VPS
ssh user@djzeneyer.com

# Flush caches (LiteSpeed + WP object cache + transients)
wp --path=/home/u790739895/domains/djzeneyer/public_html cache flush
wp --path=/home/u790739895/domains/djzeneyer/public_html rewrite flush --hard
wp --path=/home/u790739895/domains/djzeneyer/public_html transient delete --expired
```

## Verification

- Change deployed via GitHub Actions (`deploy.yml`) runs cleanly
- Frontend build (`npm run build`) succeeds without TypeScript errors
- REST endpoints return expected data after changes
- No PHP fatals in `debug.log`

## Failure modes

- If routing is ambiguous, ask: "Is this a backend PHP change, a frontend React change, or both?"
- If a WP plugin change breaks the REST API, check `debug.log` for PHP fatals before debugging the frontend
