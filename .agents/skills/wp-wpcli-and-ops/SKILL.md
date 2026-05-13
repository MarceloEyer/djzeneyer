---
name: wp-wpcli-and-ops
description: "Use when working with WP-CLI (wp) for WordPress operations: safe search-replace, db export/import, plugin/theme/user/content management, cron, cache flushing, multisite, and scripting/automation with wp-cli.yml."
risk: safe
source: "https://github.com/WordPress/agent-skills"
date_added: "2026-03-05"
compatibility: "Targets WordPress 6.9+ (PHP 7.2.24+). Requires WP-CLI in the execution environment."
---

# WP-CLI and Ops

## When to use

Use this skill when the task involves WordPress operational work via WP-CLI, including:

- `wp search-replace` (URL changes, domain migrations, protocol switch)
- DB export/import, resets, and inspections (`wp db *`)
- Plugin/theme install/activate/update, language packs
- Cron event listing/running
- Cache/rewrite flushing
- Building repeatable scripts (`wp-cli.yml`, shell scripts, CI jobs)

## Inputs required

- Where WP-CLI will run: local dev, staging, or **production** (Hostinger VPS for this project).
- WordPress root path: `--path=/home/u790739895/domains/djzeneyer/public_html`
- Whether commands should run network-wide (this project is single-site).

## Infrastructure Context (djzeneyer.com)

- **WP Root:** `/home/u790739895/domains/djzeneyer/public_html`
- **Site URL:** `https://djzeneyer.com`
- **Hosting:** Hostinger VPS (LiteSpeed)
- **Access:** SSH with `SSH_PRIVATE_KEY` (GitHub Secrets)

## Procedure

### 0) Guardrails: confirm environment and blast radius

WP-CLI commands can be destructive. Before running anything that writes:

1. Confirm environment (dev/staging/prod) — **assume production unless told otherwise**
2. Confirm `--path` is correct
3. Make a backup for risky operations: `wp db export backup-$(date +%Y%m%d).sql`

### 1) Common commands for this project

```bash
# Always target with explicit path
wp --path=/home/u790739895/domains/djzeneyer/public_html <command>

# Check WP status
wp core version
wp core verify-checksums

# Plugin management
wp plugin list
wp plugin activate zen-bit
wp plugin deactivate zen-bit --uninstall

# Cache management
wp cache flush
wp transient delete --all
wp litespeed-purge all  # LiteSpeed Cache CLI (if available)

# Rewrite rules (after slug changes)
wp rewrite flush --hard

# Cron
wp cron event list
wp cron event run <hook>

# DB
wp db export /tmp/backup-$(date +%Y%m%d).sql
wp db check

# Search-replace (always dry-run first)
wp search-replace 'old-domain.com' 'djzeneyer.com' --dry-run --all-tables
wp search-replace 'old-domain.com' 'djzeneyer.com' --all-tables
```

### 2) Safe URL/domain migration (`search-replace`)

Follow this safe sequence:

1. `wp db export` (backup)
2. `wp search-replace --dry-run` (review impact)
3. Run the real replace
4. `wp rewrite flush --hard`
5. `wp cache flush`

### 3) After slug changes (relevant for this project)

When WordPress page slugs are updated (like the EN/PT slug migration):

```bash
# Flush rewrite rules after slug changes
wp rewrite flush --hard --path=/home/u790739895/domains/djzeneyer/public_html

# Clear all caches
wp cache flush --path=/home/u790739895/domains/djzeneyer/public_html

# Clear transients (ZenGame, ZenBIT caches)
wp transient delete --all --path=/home/u790739895/domains/djzeneyer/public_html

# Verify Polylang has correct language associations
wp post list --post_type=page --fields=ID,post_title,post_name --path=/home/u790739895/domains/djzeneyer/public_html
```

### 4) Automation patterns (CI/CD)

For the GitHub Actions deploy pipeline:

```yaml
# .github/workflows/deploy.yml pattern
- name: Flush WP Cache after deploy
  run: |
    ssh $SERVER "wp --path=$WP_ROOT rewrite flush --hard"
    ssh $SERVER "wp --path=$WP_ROOT cache flush"
    ssh $SERVER "wp --path=$WP_ROOT transient delete --expired"
```

## Verification

- Confirm intended side effects: correct URLs updated, plugins in expected state, caches flushed
- Run `wp core verify-checksums` to confirm core files are intact
- Check `wp doctor check` (if available) for common issues

## Failure modes / debugging

- **"Error: This does not seem to be a WordPress installation."** → wrong `--path`
- **Search-replace causes unexpected serialization issues** → use `--precise` flag for serialized data
- **Commands fail via SSH** → check that WP-CLI is in `$PATH` on the server

## Escalation

- If you cannot confirm environment safety, do not run write operations.
- If the WP-CLI command affects Polylang language settings, verify in the WordPress admin after running.
