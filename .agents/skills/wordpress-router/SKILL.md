---
name: wordpress-router
description: "Use when a WordPress task is ambiguous and you need to route it to the correct workflow/skill: wp-headless, wp-plugin-development, wp-rest-api, wp-performance, wp-wpcli-and-ops, backend-security-coder, codeql-security, auth-implementation-patterns, or frontend skills."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
updated: "2026-05-30"
compatibility: "Targets WordPress 6.9+ and PHP 8.3+ for this project."
---

# WordPress Router

## When to use

Use this skill at the start of ambiguous WordPress tasks in the djzeneyer.com repo to:

- Identify whether the task is plugin, REST API, headless, ops, performance, auth, security, SEO/schema, or frontend integration.
- Pick the right skill and guardrails before touching code.
- Avoid applying generic WordPress/Next.js guidance to this Vite + React SPA + WordPress headless project.

This is a routing skill. It should not redefine global project rules.

## Inputs required

- The user's intent.
- Any constraints: production vs staging, release urgency, security risk, SEO/AI impact.
- Target area if known: plugin, theme/inc, React frontend, scripts, workflows, `.well-known/*`, or WordPress admin.

## djzeneyer.com Architecture (pre-classified)

This repo is already classified; use `wp-project-triage` only when structure/tooling appears to have changed.

- **Kind:** WordPress headless + custom plugins + React SPA frontend.
- **WP Root:** `/home/u790739895/domains/djzeneyer/public_html`.
- **PHP:** 8.3+ in production context.
- **Frontend:** React 19 + Vite 8 + TypeScript + React Router 7.
- **Rendering:** SSG/prerendered public routes, then React hydration.
- **Custom plugins:** `zen-bit/`, `zengame/`, `zeneyer-auth/`, `zen-seo-lite/`, `zen-mailer/`, `zen-plugins-overview/`.
- **Theme:** Custom `zentheme` with REST endpoints in `inc/api.php` and AI endpoints in `inc/ai-llm.php`.
- **Hosting:** Hostinger VPS + LiteSpeed + Cloudflare.
- **CI/CD:** GitHub Actions.
- **AI/product stance:** public content is intentionally exposed for search, grounding, discovery, indexing and training by AI unless explicitly private.

## Routing Decision Tree

Read the detailed tree when necessary at `.agents/skills/wordpress-router/references/decision-tree.md`.

### Quick routing for this project

| If the task involves... | Use skill/context |
|---|---|
| Plugins (`zen-bit`, `zengame`, `zeneyer-auth`, `zen-seo-lite`, `zen-mailer`) | `wp-plugin-development` + `backend-security-coder` |
| REST API routes (`zen-bit/v2`, `zengame/v1`, `zeneyer-auth/v1`, `zen-seo/v1`, `djzeneyer/v1`) | `wp-rest-api` |
| Headless architecture, CORS, JWT, React SPA integration | `wp-headless` |
| Performance issues, N+1, transients, APCu, LiteSpeed cache | `wp-performance` |
| WP-CLI, SSH ops, cache flush, rewrite rules, DB | `wp-wpcli-and-ops` |
| React SPA, TypeScript, React Query, routing | `react-best-practices` + `typescript-pro` |
| General React composition only | `react-patterns` as secondary reference, not as project authority |
| SEO, schema, sitemap, metadata, AI discovery | `seo-audit` + `schema-markup` + `.context/SITE_RESOURCES.md` |
| Security audit on PHP plugins or sanitization | `codeql-security` + `backend-security-coder` |
| GamiPress, points, achievements, ranks | `wp-plugin-development` + `wp-rest-api` |
| Authentication, JWT, Google OAuth | `auth-implementation-patterns` + `wp-headless` |
| `.well-known/*`, MCP, llms, agent skills, API catalog | `.context/SITE_RESOURCES.md` + `.context/OPERATIONS.md` |
| Marketing/copy/public voice | `zen-content-voice` first, then `copywriting` or `social-content` if needed |

## Procedure

### 1) Classify the task

Ask: where is the change happening?

```text
plugin PHP code?        -> wp-plugin-development
REST endpoint PHP?      -> wp-rest-api
React/TS frontend?      -> react-best-practices / typescript-pro
headless arch decision? -> wp-headless
slow query/endpoint?    -> wp-performance
server/SSH operation?   -> wp-wpcli-and-ops
SEO/schema/AI discovery?-> seo-audit / schema-markup / SITE_RESOURCES
security review?        -> codeql-security / backend-security-coder
```

### 2) Apply guardrails before making changes

- Confirm environment: production, staging or local.
- If PHP can fatal, check relevant plugin/theme files with PHP lint when possible.
- If changing slugs or rewrites, plan cache/rewrite flush.
- If changing WordPress slugs or frontend routes, update `src/config/routes-slugs.json` and related i18n/canonical/sitemap logic.
- If changing REST endpoints, update `.context/API.md` and plugin overview/admin quick links when applicable.
- If changing public AI resources, update `.context/SITE_RESOURCES.md` and preserve `ai-train=yes`, `search=yes`, `ai-input=yes` unless the human explicitly changes policy.

### 3) After changes that affect the live site

```bash
# SSH into Hostinger VPS if explicitly approved
ssh user@djzeneyer.com

# Flush caches when needed
wp --path=/home/u790739895/domains/djzeneyer/public_html cache flush
wp --path=/home/u790739895/domains/djzeneyer/public_html rewrite flush --hard
wp --path=/home/u790739895/domains/djzeneyer/public_html transient delete --expired
```

## Verification

- GitHub Actions deploy/build passes.
- Frontend build (`npm run build` or stronger command) succeeds without TypeScript errors.
- REST endpoints return expected data after changes.
- No PHP fatals in logs.
- SEO/AI surfaces remain aligned with `SITE_RESOURCES.md` and `SITE_PAGES_STRATEGY.md`.

## Failure modes

- If routing is ambiguous, ask: "Is this a backend PHP change, a frontend React change, a public AI/SEO resource, or a server operation?"
- If a WP plugin change breaks the REST API, check PHP fatals before debugging the frontend.
- If a crawler/AI issue appears after deploy, check cache, prerender output, headers, `robots.txt`, `.well-known/*`, sitemap and canonical URLs before changing application logic.