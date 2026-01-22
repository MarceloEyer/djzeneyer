# ⚙️ Master Configuration Guide

This document consolidates all technical configurations for the DJ Zen Eyer project, including WordPress, Server (.htaccess), LiteSpeed Cache, and Cloudflare.

---

## 1. WordPress Configuration

### General Settings
- **Permalinks**: Must be set to **Post name** (`/%postname%/`).
- **Discussion**: Disable comments (Headless site).
- **Reading**: Search Engine Visibility OFF (Allow indexing).

### `wp-config.php` Optimization
Add these lines to `wp-config.php`:

```php
// Headless URLs
define('WP_HOME', 'https://djzeneyer.com');
define('WP_SITEURL', 'https://djzeneyer.com');

// Performance & Security
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
define('DISALLOW_FILE_EDIT', true);
define('WP_POST_REVISIONS', 5);
define('AUTOSAVE_INTERVAL', 300);

// JWT Secret (for ZenEyer Auth)
define('ZENEYER_JWT_SECRET', 'your-long-secure-secret-key');
```

---

## 2. Server Configuration (.htaccess)

Use this **Version 5 Optimized** `.htaccess` for LiteSpeed servers. It includes security headers, CORS for the headless app, and cache rules.

```apache
# ==============================================================================
# DJ ZEN EYER - PRODUCTION .htaccess v5.0 OPTIMIZED
# ==============================================================================

# 1. LITESPEED CACHE START
<IfModule LiteSpeed>
RewriteEngine on
CacheLookup on
RewriteRule .* - [E=Cache-Control:no-autoflush]
RewriteRule litespeed/debug/.*\.log$ - [F,L]
RewriteRule \.litespeed_conf\.dat - [F,L]

# Cache Exclusions for Dynamic Headless Routes
CacheDisable /wp-admin
CacheDisable /wp-login.php
CacheDisable /cart
CacheDisable /checkout
CacheDisable /my-account
CacheDisable /wp-json/zeneyer-auth/

# Mobile & WebP Support
RewriteCond %{HTTP_USER_AGENT} Mobile|Android|Silk/|Kindle|BlackBerry|Opera\ Mini|Opera\ Mobi [NC]
RewriteRule .* - [E=Cache-Control:vary=%{ENV:LSCACHE_VARY_VALUE}+ismobile]

RewriteCond %{HTTP_ACCEPT} image/webp [OR]
RewriteCond %{HTTP_USER_AGENT} iPhone\ OS\ (1[4-9]|[2-9][0-9]) [OR]
RewriteCond %{HTTP_USER_AGENT} Firefox/([6-9][0-9]|[1-9][0-9]{2,})
RewriteRule .* - [E=Cache-Control:vary=%{ENV:LSCACHE_VARY_VALUE}+webp]
</IfModule>
# LITESPEED CACHE END

# 2. SECURITY HEADERS & CORS
<IfModule mod_headers.c>
    # Security Headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

    # CORS (Allow Frontend)
    SetEnvIf Origin "^https?://(www\.)?(djzeneyer\.com|localhost:5173)$" ALLOWED_ORIGIN=$0
    Header always set Access-Control-Allow-Origin "%{ALLOWED_ORIGIN}e" env=ALLOWED_ORIGIN
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-WP-Nonce"
    Header always set Access-Control-Allow-Credentials "true"
</IfModule>

# 3. WORDPRESS REWRITES
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
```

---

## 3. LiteSpeed Cache Settings

Configure in **WP Admin > LiteSpeed Cache > Settings**:

### General
- **Enable Cache**: ON
- **Cache Logged-in Users**: OFF (Critical for headless!)
- **Cache REST API**: ON (TTL: 3600s)

### Excludes (Do Not Cache)
- `/wp-json/zeneyer-auth/*`
- `/cart/`
- `/checkout/`
- `/my-account/`

### Optimization
- **CSS/JS Minify**: OFF (Let Vite handle this)
- **Image Optimization**: OFF (Let Vite/NextGen tools handle this)
- **HTML Minify**: ON

---

## 4. Cloudflare Configuration

**Plan**: Free is sufficient.

### DNS
- Proxy status: **Proxied (Orange Cloud)** for `A` and `CNAME` records.

### SSL/TLS
- Mode: **Full (Strict)**

### Page Rules (Limit 3 on Free)
1. **Cache Everything (Assets)**:
   - URL: `djzeneyer.com/wp-content/themes/djzeneyer/dist/*`
   - Setting: Cache Level: Cache Everything, Edge Cache TTL: 1 month.
2. **Bypass Cache (API)**:
   - URL: `djzeneyer.com/wp-json/*`
   - Setting: Cache Level: Bypass.
3. **Security (Admin)**:
   - URL: `djzeneyer.com/wp-admin/*`
   - Setting: Cache Level: Bypass, Security Level: High.

### Speed
- **Auto Minify**: HTML, CSS, JS (Checked).
- **Rocket Loader**: **OFF** (Breaks React hydration).
- **Brotli**: ON.

---

**Last Updated:** January 2026
