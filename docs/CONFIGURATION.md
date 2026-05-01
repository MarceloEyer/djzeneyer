# Configuration.md - Canonical runtime and deployment setup

> Single source for WordPress, `.htaccess`, LiteSpeed Cache, Cloudflare, frontend env vars, and performance budgets.
> `docs/config.md` was merged into this file and deleted.
> If code and this file disagree, code wins.

---

## 1. WordPress (`wp-config.php`)

Use the following values as the project baseline. This is the canonical shape for production and should stay out of version control.

Current production state observed on `djzeneyer.com`:

- WordPress `6.9.4`
- Single-site installation (`multisite: false`)
- Production environment (`WP_ENVIRONMENT_TYPE=production`)
- LiteSpeed server and LiteSpeed Cache active
- Polylang active with EN as default and PT at `/pt/`
- PHP `8.3.30`

```php
<?php
define('WP_CACHE', true);

// Database
define('DB_NAME', 'YOUR_DB_NAME');
define('DB_USER', 'YOUR_DB_USER');
define('DB_PASSWORD', 'YOUR_DB_PASSWORD');
define('DB_HOST', '127.0.0.1');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Security keys and salts
define('AUTH_KEY',         'PUT_YOUR_KEY_HERE');
define('SECURE_AUTH_KEY',   'PUT_YOUR_KEY_HERE');
define('LOGGED_IN_KEY',     'PUT_YOUR_KEY_HERE');
define('NONCE_KEY',         'PUT_YOUR_KEY_HERE');
define('AUTH_SALT',         'PUT_YOUR_KEY_HERE');
define('SECURE_AUTH_SALT',  'PUT_YOUR_KEY_HERE');
define('LOGGED_IN_SALT',    'PUT_YOUR_KEY_HERE');
define('NONCE_SALT',        'PUT_YOUR_KEY_HERE');
define('WP_CACHE_KEY_SALT', 'PUT_YOUR_KEY_HERE');

// Headless auth and bot protection
define('ZENEYER_JWT_SECRET',      'PUT_YOUR_JWT_SECRET_HERE');
define('ZEN_TURNSTILE_SITE_KEY',  'PUT_YOUR_TURNSTILE_SITE_KEY_HERE');
define('ZEN_TURNSTILE_SECRET_KEY', 'PUT_YOUR_TURNSTILE_SECRET_KEY_HERE');

// Canonical URLs
define('WP_HOME', 'https://djzeneyer.com');
define('WP_SITEURL', 'https://djzeneyer.com');
define('WP_CONTENT_URL', 'https://djzeneyer.com/wp-content');

// Environment and cache
define('WP_ENVIRONMENT_TYPE', 'production');
define('LSCACHE_VARY_GROUP', 'desktop,mobile');
define('LSCACHE_EXC_QUERYSTR', 'rest_route,jwt');

// System hardening
define('FS_METHOD', 'direct');
define('FORCE_SSL_ADMIN', true);
define('DISALLOW_FILE_EDIT', true);
define('WP_AUTO_UPDATE_CORE', 'minor');

// Debug
define('WP_DEBUG', false);
define('WP_DEBUG_DISPLAY', false);
define('WP_DEBUG_LOG', true);
define('SCRIPT_DEBUG', false);
define('SAVEQUERIES', false);
@ini_set('display_errors', 0);
error_reporting(E_ALL);

// Cookies and memory
define('COOKIE_DOMAIN', '.djzeneyer.com');
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';
```

Rules:

- Keep secrets out of the repository and never commit real keys.
- Use the real production URL for both `WP_HOME` and `WP_SITEURL`.
- Prefer `ZENEYER_JWT_SECRET` for JWT signing. The plugin accepts `JWT_AUTH_SECRET_KEY` and `SIMPLE_JWT_PRIVATE_KEY` as legacy compatibility fallbacks, but they are not canonical.
- Keep Turnstile keys defined before activating `zeneyer-auth`.
- Keep headless mode behavior and admin lockdown enabled by the actual constants the code uses.
- Do not define `DOMAIN_CURRENT_SITE` unless the installation is truly multisite.
- `COOKIEHASH` should remain WordPress-managed unless a migration requires a pinned value.

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

Observed production values from the exported LiteSpeed configuration:

| Setting | Value |
|---|---|
| Public TTL | `604800` (7 days) |
| Private TTL | `1800` (30 min) |
| REST API cache | Enabled |
| ESI | Disabled |
| HTML minification | Enabled |
| CSS minification | Disabled |
| JS minification | Disabled |
| JS defer | Enabled |
| Object cache | Disabled |
| Crawler | Enabled |
| Image optimization | WebP |

Additional cache behavior currently in place:

- Query-string exclusions: `preview`, `s`, `utm_*`, `fbclid`, `gclid`, `_ga`
- Cookie exclusions: `wordpress_logged_in_`, `woocommerce_cart_hash`, `woocommerce_items_in_cart`, `wp_woocommerce_session_`
- Private URIs: `/cart/`, `/checkout/`, `/my-account/`
- Cache exclusions: `/cart/`, `/checkout/`, `/my-account/`, `/wp-admin/`, `/wp-login.php`, `/dashboard/`, `/painel/`, `/minha-conta/`, `/oauth2callback`
- Vary by mobile and role is configured in LiteSpeed itself; `WP_CACHE` only enables the plugin layer
- `optm-js_exc` excludes `react`, `react-dom`, `framer-motion`, and the theme bundle path
- Object cache remains disabled because the current Hostinger plan does not provide Redis or Memcached. This is intentional and not a missing optimization step.

Note:

- Cloudflare integration is configured in LiteSpeed, but the API credentials are server-side secrets and must not be documented or committed.

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
VITE_WP_SITE_URL=https://djzeneyer.com
VITE_WP_REST_URL=https://djzeneyer.com/wp-json
VITE_TURNSTILE_SITE_KEY=your_public_turnstile_site_key
```

Rules:

- Never commit `.env`.
- Keep the API URL pointed at the canonical production REST base.
- In production the frontend prefers `window.wpData`; the env vars are fallback values for development/local builds.

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
