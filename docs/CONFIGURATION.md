# Configuration.md - Canonical runtime and deployment setup

> Single source for WordPress, `.htaccess`, LiteSpeed Cache, Cloudflare, frontend env vars, and performance budgets.
> `docs/config.md` was merged into this file and deleted.
> If code and this file disagree, code wins.

---

## 1. WordPress (`wp-config.php`)

Use the following values as the project baseline:

```php
// Headless mode and admin safety
define('HEADLESS_MODE_ENABLED', true);
define('FORCE_SSL_ADMIN', true);
define('DISALLOW_FILE_EDIT', true);

// Canonical URLs
define('WP_HOME', 'https://djzeneyer.com');
define('WP_SITEURL', 'https://djzeneyer.com');

// Secrets
define('JWT_AUTH_SECRET_KEY', 'YOUR_SECRET_KEY_HERE');
define('AUTH_SALT', '...');

// Memory
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

Rules:

- Keep secrets out of the repository.
- Use the real production URL for both `WP_HOME` and `WP_SITEURL`.
- Keep headless mode and admin lockdown enabled.

---

## 2. `.htaccess`

Use HTTPS redirects, security headers, CORS for the headless app, and the SPA fallback:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"

<IfModule mod_headers.c>
  SetEnvIf Origin "https://djzeneyer\.com$" CORS_ORIGIN=$0
  Header set Access-Control-Allow-Origin "%{CORS_ORIGIN}e" env=CORS_ORIGIN
  Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
  Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-WP-Nonce"
  Header set Access-Control-Allow-Credentials "true"
</IfModule>

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/wp-
RewriteCond %{REQUEST_URI} !^/wp-json/
RewriteRule ^(.*)$ /index.html [L]
```

Rules:

- Keep the SPA fallback in place.
- Do not break `/wp-json/` or the WordPress admin surface.
- Keep CORS narrow to the production origin.

---

## 3. LiteSpeed Cache

| Setting | Value |
|---|---|
| Public TTL | `604800` (7 days) |
| Private TTL | `1800` (30 min) |
| REST API cache | Enabled |
| ESI | Disabled |
| CSS/JS minification | Enabled |
| Image optimization | WebP |

Purge rules:

- Publish or update a post: purge home and feeds.
- Deploy: purge the full cache through the CI/CD flow.

---

## 4. Cloudflare

| Setting | Value |
|---|---|
| SSL | Full (Strict) |
| Minification | JS, CSS, HTML |
| Cache mode | Standard |
| Bypass rules | `wp-admin/*`, `wp-json/*` |
| Firewall | Rate limiting enabled |

DNS baseline:

```text
Type    Name              Value                 Proxy
A       djzeneyer.com     IP_OF_SERVER          Proxied
CNAME   www               djzeneyer.com         Proxied
```

---

## 5. Frontend env vars

```env
VITE_WP_REST_URL=https://djzeneyer.com/wp-json
VITE_SITE_URL=https://djzeneyer.com
```

Rules:

- Never commit `.env`.
- Keep the API URL pointed at the canonical production REST base.

---

## 6. Performance budget

The CI pipeline checks bundle size after build:

```bash
npm run perf:baseline
npm run perf:budget
```

Budget script:

- `scripts/check-performance-budget.mjs`

Default limits:

- `PERF_BUDGET_INITIAL_JS_GZIP` = `181 * 1024`
- `PERF_BUDGET_LARGEST_CHUNK_GZIP` = `120 * 1024`
- `PERF_BUDGET_ENTRY_JS_GZIP` = `130 * 1024`
- `PERF_BUDGET_I18N_GZIP` = `55 * 1024`

All values can be overridden by CI environment variables.
