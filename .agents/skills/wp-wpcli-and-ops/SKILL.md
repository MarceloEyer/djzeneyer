---
name: wp-wpcli-and-ops
description: "Use when working with WP-CLI or WordPress operations for djzeneyer.com: safe search-replace, DB export/import, plugin/theme management, cron, cache/rewrite flushing, LiteSpeed/Cloudflare-aware ops and automation."
risk: medium
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
updated: "2026-05-30"
compatibility: "Targets WordPress 6.9+ and PHP 8.3+ for this project. Requires WP-CLI in the execution environment."
---

# WP-CLI and Ops — djzeneyer.com

## When to use

Use this skill when the task involves WordPress operational work via WP-CLI or SSH:

- URL/domain/protocol search-replace.
- DB export/import/checks.
- Plugin/theme/user/content management.
- Cron event listing/running.
- Cache and rewrite flushing.
- LiteSpeed/Cloudflare-aware operational steps.
- Repeatable scripts or CI jobs.

Do not use this skill to change product policy, SEO strategy, public AI resources or code architecture by itself.

## Inputs required

- Environment: local, staging or production.
- Exact WordPress root path.
- Whether write operations are approved.
- Whether a backup is required.
- Whether the operation affects cache, redirects, Polylang, public AI/search resources or user data.

## Infrastructure context

- WP root: `/home/u790739895/domains/djzeneyer/public_html`.
- Site URL: `https://djzeneyer.com`.
- Hosting: Hostinger VPS + LiteSpeed.
- CDN/security layer: Cloudflare.
- Project is single-site unless code/admin confirms otherwise.

## Production guardrails

Assume production unless proven otherwise.

Before running any write/destructive operation:

1. Confirm environment.
2. Confirm `--path`.
3. Confirm blast radius.
4. Create backup for risky DB operations.
5. Prefer dry-run where available.
6. Avoid full cache purges during traffic unless necessary.
7. Do not change public AI/search policy via ops commands.

## Common commands

```bash
# Always target explicit path
wp --path=/home/u790739895/domains/djzeneyer/public_html <command>

# Check WP status
wp core version
wp core verify-checksums

# Plugin management
wp plugin list
wp plugin activate zen-bit

# Cache management
wp cache flush
wp transient delete --expired
wp litespeed-purge all  # only if available and approved

# Rewrite rules after slug/rewrite changes
wp rewrite flush --hard

# Cron
wp cron event list
wp cron event run <hook>

# DB
wp db export /tmp/backup-$(date +%Y%m%d).sql
wp db check

# Search-replace: always dry-run first
wp search-replace 'old-domain.com' 'djzeneyer.com' --dry-run --all-tables
wp search-replace 'old-domain.com' 'djzeneyer.com' --all-tables
```

Avoid examples that deactivate a plugin with `--uninstall` unless the user explicitly wants uninstall behavior.

## Safe search-replace

1. `wp db export`.
2. `wp search-replace --dry-run`.
3. Review affected tables/counts.
4. Run real command only if expected.
5. `wp rewrite flush --hard` if URLs/slugs/routes changed.
6. Clear relevant caches.
7. Verify front-end, REST and canonical URLs.

Use `--precise` if serialized data safety matters.

## After slug/route changes

```bash
wp rewrite flush --hard --path=/home/u790739895/domains/djzeneyer/public_html
wp cache flush --path=/home/u790739895/domains/djzeneyer/public_html
wp transient delete --expired --path=/home/u790739895/domains/djzeneyer/public_html
wp post list --post_type=page --fields=ID,post_title,post_name --path=/home/u790739895/domains/djzeneyer/public_html
```

Also verify:

- `src/config/routes-slugs.json` if frontend routes changed.
- sitemap/prerender output if public route behavior changed.
- Polylang associations if translated slugs changed.

## Cache notes

- Do not add NOCACHE for `/wp-json/`, `/feed/` or `/api/` by default.
- Public stable REST responses can be cached.
- Prefer targeted purge when possible.
- HSTS belongs to Cloudflare; CSP belongs to `inc/csp.php`.

## CI/CD pattern

```yaml
- name: Flush WP Cache after deploy
  run: |
    ssh $SERVER "wp --path=$WP_ROOT rewrite flush --hard"
    ssh $SERVER "wp --path=$WP_ROOT cache flush"
    ssh $SERVER "wp --path=$WP_ROOT transient delete --expired"
```

Only use broad purges when the deployment actually changes routes/cache-sensitive public output.

## Verification

- Intended side effects happened.
- No unexpected plugin state changes.
- Caches/rewrite rules behave as expected.
- REST endpoints still respond.
- Public AI/search resources remain reachable.
- Private/authenticated data remains protected.

## Failure modes

- Wrong `--path`.
- Search-replace affects serialized data unexpectedly.
- Commands fail because WP-CLI missing from `$PATH`.
- Full cache flush hides a bug temporarily.
- Rewrite flush not run after slug/CPT changes.
- Polylang associations broken after slug operations.

## Escalation

If you cannot confirm environment safety, do not run write operations. If operation affects Polylang, auth, payment/support info, AI/search public resources or production DB, ask first.