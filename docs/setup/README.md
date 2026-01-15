# Setup Guide

Complete setup instructions for DJ Zen Eyer website.

---

## Prerequisites

### Server Requirements

- **LiteSpeed Server** (or Apache with mod_rewrite)
- **PHP 8.0+** with extensions:
  - `php-curl`, `php-mbstring`, `php-xml`, `php-zip`, `php-gd`, `php-imagick`
- **MySQL 5.7+** or **MariaDB 10.3+**
- **SSL Certificate** (via Cloudflare or Let's Encrypt)
- **Node.js 18+** (for local build)

### Domain

- **Primary:** `djzeneyer.com`
- **WWW redirect:** `www.djzeneyer.com` → `djzeneyer.com`

---

## 1. WordPress Installation

### Install WordPress

```bash
# Download WordPress
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
mv wordpress/* /var/www/html/

# Set permissions
chown -R www-data:www-data /var/www/html/
chmod -R 755 /var/www/html/
```

### Configure wp-config.php

Edit `/var/www/html/wp-config.php`:

```php
<?php
// Database
define('DB_NAME', 'your_database');
define('DB_USER', 'your_user');
define('DB_PASSWORD', 'your_password');
define('DB_HOST', 'localhost');

// WordPress URLs (CRITICAL for headless)
define('WP_HOME', 'https://djzeneyer.com');
define('WP_SITEURL', 'https://djzeneyer.com');

// Security (generate at https://api.wordpress.org/secret-key/1.1/salt/)
define('AUTH_KEY',         'put your unique phrase here');
// ... (complete all 8 keys)

// Performance
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// HTTPS
define('FORCE_SSL_ADMIN', true);
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

// Disable file editing
define('DISALLOW_FILE_EDIT', true);

// Debug (disable in production)
define('WP_DEBUG', false);
```

---

## 2. Install Required Plugins

### Via WordPress Admin

Go to **Plugins > Add New** and install:

| Plugin | Function |
|--------|----------|
| **WooCommerce** | E-commerce |
| **GamiPress** | Gamification (points, ranks, achievements) |
| **Polylang** | Multilingual (EN/PT) |
| **MailPoet** | Newsletter |
| **LiteSpeed Cache** | Server-side caching |

### Via WP-CLI (faster)

```bash
wp plugin install woocommerce --activate
wp plugin install gamipress --activate
wp plugin install polylang --activate
wp plugin install mailpoet --activate
wp plugin install litespeed-cache --activate
```

---

## 3. Install Custom Plugins

### Upload Custom Plugins

Copy to `/wp-content/plugins/`:

```bash
cd /var/www/html/wp-content/plugins/

# Upload from project:
rsync -avz /path/to/project/plugins/zen-seo-lite/ ./zen-seo-lite/
rsync -avz /path/to/project/plugins/zeneyer-auth/ ./zeneyer-auth/
rsync -avz /path/to/project/plugins/zen-bit/ ./zen-bit/
rsync -avz /path/to/project/plugins/zen-ra/ ./zen-ra/
```

### Activate Plugins

```bash
wp plugin activate zen-seo-lite
wp plugin activate zeneyer-auth
wp plugin activate zen-bit
wp plugin activate zen-ra
```

Or via WordPress Admin > Plugins.

---

## 4. Configure Plugins

### WooCommerce

1. **Currency:** BRL or USD (depending on target audience)
2. **Payment Gateways:** Enable Stripe/PayPal/PagSeguro
3. **Shipping:** Configure zones and rates
4. **REST API:** Enable in WooCommerce > Settings > Advanced > REST API
   - Create API keys (Consumer Key + Consumer Secret)

### GamiPress

1. **Points Type:** Create "Zen Points"
2. **Ranks:** Configure tiers:
   - Zen Novice (0 points)
   - Zen Apprentice (100 points)
   - Zen Voyager (500 points)
   - Zen Master (1500 points)
   - Zen Legend (4000 points)
3. **Achievements:** Create badges (First Download, Event Attendee, etc.)
4. **Triggers:** Connect to WooCommerce (purchase = points)

### Polylang

1. **Languages:** Add English (EN) and Portuguese (PT-BR)
2. **Default Language:** English
3. **URL Structure:** Prefix `/pt` for Portuguese
4. **Translate:**
   - Menus (Products, Events, etc.)
   - Pages
   - WooCommerce products

### LiteSpeed Cache

1. **Enable Cache:** Yes
2. **Exclude URLs:**
   - `/checkout`
   - `/cart`
   - `/my-account`
3. **Purge Rules:**
   - Purge on product update
   - Purge on post publish
4. **CDN:** Configure Cloudflare (see [Cloudflare Guide](../guides/CLOUDFLARE.md))

---

## 5. Install Theme

### Upload Theme

```bash
cd /var/www/html/wp-content/themes/
mkdir djzeneyer-headless

# Upload theme files:
# - functions.php
# - style.css
# - index.php
# - header.php
# - footer.php
# - /inc/ (entire directory)
```

### Activate Theme

WordPress Admin > Appearance > Themes > Activate "DJ Zen Eyer Headless"

---

## 6. Frontend Setup

### Install Dependencies

```bash
cd /path/to/project
npm install
```

### Configure Environment

Create `.env.production`:

```env
VITE_WP_REST_URL=https://djzeneyer.com/wp-json
VITE_SITE_URL=https://djzeneyer.com
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### Build

```bash
npm run build
```

This generates:
- `/dist/` directory with static HTML
- 16 pre-rendered HTML files (8 EN + 8 PT)
- Optimized assets in `/dist/assets/`

---

## 7. Deploy Frontend

### Upload to Server

```bash
# Via rsync (recommended)
rsync -avz dist/ user@server:/var/www/html/

# Or via FTP/SFTP
# Upload entire /dist/ contents to server root
```

### Verify .htaccess

Ensure `.htaccess` is in root:

```bash
ls -la /var/www/html/.htaccess
```

File should contain SPA routing rules. See [.htaccess Guide](../guides/HTACCESS.md).

---

## 8. Cloudflare Setup

See detailed guide: [Cloudflare Configuration](../guides/CLOUDFLARE.md)

**Quick Setup:**

1. Add site to Cloudflare
2. Update nameservers
3. Configure DNS records
4. Set SSL/TLS to **Full (strict)**
5. Create Page Rules for cache optimization
6. Enable Auto Minify (JS, CSS, HTML)
7. **Disable Rocket Loader** (breaks React)

---

## 9. Final Checks

### WordPress Checklist

- [ ] WordPress installed and updated
- [ ] SSL configured (HTTPS)
- [ ] All plugins installed and activated
- [ ] Products created (EN + PT)
- [ ] Menus configured
- [ ] GamiPress points/ranks configured
- [ ] REST API accessible (test: `/wp-json/`)
- [ ] CORS configured correctly

### Frontend Checklist

- [ ] `npm run build` successful
- [ ] 16 HTML files generated in `/dist/`
- [ ] Meta tags present (view source)
- [ ] Images optimized (WebP format)
- [ ] Translations complete (EN + PT)
- [ ] Bundle size < 200 KB
- [ ] Lazy loading working

### Server Checklist

- [ ] `.htaccess` configured
- [ ] Permissions correct (755/644)
- [ ] PHP 8.0+ active
- [ ] mod_rewrite enabled
- [ ] LiteSpeed Cache active
- [ ] Backups configured

### Cloudflare Checklist

- [ ] DNS pointing to server
- [ ] SSL in **Full (strict)** mode
- [ ] Page Rules configured
- [ ] Cache working (check headers)
- [ ] Auto Minify enabled
- [ ] Rocket Loader disabled

---

## 10. Testing

### Test URLs

```bash
# Homepage
curl -I https://djzeneyer.com/

# API
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu

# Portuguese
curl -I https://djzeneyer.com/pt/about/

# Products
curl https://djzeneyer.com/wp-json/wc/v3/products
```

### Test Features

- [ ] Navigation works (EN/PT)
- [ ] Login/Logout functional
- [ ] WooCommerce cart works
- [ ] Checkout process completes
- [ ] GamiPress counts points
- [ ] Newsletter signup works
- [ ] Music player works
- [ ] Forms submit correctly

---

## Troubleshooting

Common issues and solutions:

### 404 Errors on Routes

**Solution:**
```bash
# WordPress Admin > Settings > Permalinks
# Select "Post name" and save

# Enable mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### CORS Errors

**Solution:** Check `inc/setup.php`:
```php
function djz_allowed_origins(): array {
    return [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com'
    ];
}
```

### Products Not Showing

**Checklist:**
- [ ] Products published in WooCommerce?
- [ ] REST API enabled?
- [ ] Polylang configured?
- [ ] Test endpoint: `/wp-json/djzeneyer/v1/products?lang=pt`

For more issues, see [Troubleshooting Guide](../troubleshooting/COMMON-ISSUES.md).

---

## Next Steps

- Configure [WordPress optimization](../guides/WORDPRESS-CONFIG.md)
- Set up [LiteSpeed Cache](../guides/LITESPEED-CACHE.md)
- Review [.htaccess rules](../guides/HTACCESS.md)
- Plan [marketing strategy](../guides/MARKETING.md)

---

**Last Updated:** January 2026
