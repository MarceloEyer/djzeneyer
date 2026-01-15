# Troubleshooting Guide

Common issues and solutions for DJ Zen Eyer website.

---

## Quick Links

- [Common Issues](COMMON-ISSUES.md) - Frequently encountered problems
- [Cloudflare + Google Login Fix](CLOUDFLARE-FIX-GOOGLE-LOGIN.md) - OAuth issues with Cloudflare

---

## Quick Diagnostics

### 1. Check Logs

```bash
# WordPress debug log
tail -f /var/www/html/wp-content/debug.log

# LiteSpeed error log
tail -f /usr/local/lsws/logs/error.log

# Browser console
# Press F12 > Console tab
```

### 2. Test API

```bash
# Test WordPress REST API
curl https://djzeneyer.com/wp-json/

# Test custom endpoint
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu

# Test with language parameter
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=pt
```

### 3. Clear All Caches

```bash
# LiteSpeed Cache (WordPress Admin)
# LiteSpeed Cache > Purge > Purge All

# Cloudflare (Dashboard)
# Caching > Purge Everything

# Browser
# Ctrl+Shift+R (hard refresh)
```

---

## Common Issues

### React App Not Loading (Blank Screen)

**Symptoms:**
- White/blank screen
- No React content visible
- Console errors: "Failed to load resource"

**Causes:**
1. Assets (JS/CSS) not found
2. `.htaccess` misconfigured
3. Build not uploaded correctly

**Solutions:**

```bash
# 1. Verify build exists
ls -la /var/www/html/dist/assets/

# 2. Check .htaccess
cat /var/www/html/.htaccess
# Should contain SPA routing rules

# 3. Verify mod_rewrite
apache2ctl -M | grep rewrite
# Should return: rewrite_module (shared)

# 4. Enable mod_rewrite if not active
sudo a2enmod rewrite
sudo systemctl restart apache2

# 5. Clear all caches
```

---

### 404 Errors on Routes

**Symptoms:**
- `/about`, `/shop` return 404
- Only homepage works
- Direct URLs fail

**Solutions:**

```bash
# WordPress Admin solution:
# Settings > Permalinks > Select "Post name" > Save

# Terminal solution:
wp rewrite flush

# If still broken, check .htaccess:
cat /var/www/html/.htaccess

# Should contain:
# RewriteCond %{REQUEST_FILENAME} !-f
# RewriteCond %{REQUEST_FILENAME} !-d
# RewriteRule . /index.html [L]
```

---

### CORS Errors

**Symptoms:**
- Console error: "Access-Control-Allow-Origin missing"
- API requests fail from frontend
- Network tab shows CORS error

**Diagnosis:**

```bash
# Test CORS headers
curl -H "Origin: https://djzeneyer.com" \
     -I https://djzeneyer.com/wp-json/djzeneyer/v1/menu

# Should return:
# Access-Control-Allow-Origin: https://djzeneyer.com
```

**Solutions:**

1. **Check allowed origins** in `inc/setup.php`:
```php
function djz_allowed_origins(): array {
    return [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'http://localhost:5173' // for development
    ];
}
```

2. **Verify CORS is enabled:**
```bash
# Check if CORS headers are set
grep -r "Access-Control-Allow-Origin" /var/www/html/wp-content/themes/
```

3. **Clear Cloudflare cache:**
- Cloudflare Dashboard > Caching > Purge Everything

---

### Products Not Showing

**Symptoms:**
- Shop page empty
- Products API returns empty array
- WooCommerce products exist in admin

**Checklist:**

- [ ] Products published in WooCommerce?
- [ ] Products have images?
- [ ] REST API enabled? (WooCommerce > Settings > Advanced > REST API)
- [ ] Polylang configured? (products translated?)

**Test:**

```bash
# Test WooCommerce API
curl https://djzeneyer.com/wp-json/wc/v3/products

# Test custom products endpoint
curl https://djzeneyer.com/wp-json/djzeneyer/v1/products?lang=pt

# Check if products exist
wp post list --post_type=product --post_status=publish
```

**Solutions:**

```bash
# Flush permalinks
wp rewrite flush

# Clear WooCommerce cache
wp cache flush

# Regenerate product cache
wp wc tool run clear_transients
```

---

### Login Not Working

**Symptoms:**
- Login form submits but nothing happens
- "Invalid credentials" error (but credentials are correct)
- Token not saved

**Diagnosis:**

```bash
# Test login endpoint
curl -X POST https://djzeneyer.com/wp-json/zeneyer-auth/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"youruser","password":"yourpass"}'

# Should return:
# {"token":"...","user":{...},"expires":...}
```

**Solutions:**

1. **Check if plugin is active:**
```bash
wp plugin list | grep zeneyer-auth
# Status should be "active"
```

2. **Verify credentials:**
```bash
wp user get youruser
```

3. **Check rate limiting:**
```bash
# Wait 1 minute if you've tried too many times
# Rate limit: 5 attempts per minute
```

4. **Clear browser localStorage:**
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

---

### Translations Not Working

**Symptoms:**
- `/pt` routes show English content
- Language switcher doesn't work
- API returns wrong language

**Checklist:**

- [ ] Polylang activated?
- [ ] Languages configured (EN + PT)?
- [ ] Products translated?
- [ ] Menus translated?

**Test:**

```bash
# Test language parameter
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=pt

# Check Polylang config
wp pll lang list
```

**Solutions:**

1. **Configure Polylang:**
   - WordPress Admin > Languages
   - Add English + Portuguese
   - Set default: English
   - URL structure: `/pt` prefix

2. **Translate content:**
   - Products: WooCommerce > Products > Translate
   - Pages: Pages > Translate
   - Menus: Appearance > Menus > Create for each language

3. **Verify i18n in React:**
```typescript
// Check translation files exist
src/locales/en/translation.json
src/locales/pt/translation.json

// Verify i18n initialization in src/i18n.ts
```

---

### Images Not Loading

**Symptoms:**
- Broken image icons
- 404 errors for images
- Images work locally but not in production

**Causes:**
1. Incorrect paths
2. Images not uploaded
3. Permissions issues

**Solutions:**

```bash
# 1. Check image exists
ls -la /var/www/html/images/logo.png

# 2. Verify permissions
chmod 644 /var/www/html/images/*.png

# 3. Check paths in code
# ❌ Wrong:
<img src="/images/logo.png" />

# ✅ Correct:
<img src={`${import.meta.env.VITE_SITE_URL}/images/logo.png`} />

# Or place in /public/ (Vite copies automatically):
<img src="/logo.png" />
```

---

### LiteSpeed Cache Not Working

**Symptoms:**
- Slow page loads
- No cache headers
- `X-LiteSpeed-Cache: miss` or absent

**Diagnosis:**

```bash
# Check cache headers
curl -I https://djzeneyer.com/ | grep X-LiteSpeed-Cache

# Should return:
# X-LiteSpeed-Cache: hit
```

**Solutions:**

1. **Enable cache in plugin:**
   - LiteSpeed Cache > Cache > Enable Cache: ON

2. **Configure cache rules:**
   - Exclude: `/checkout`, `/cart`, `/my-account`

3. **Test .htaccess:**
```bash
cat /var/www/html/.htaccess | grep LiteSpeed
```

4. **Purge and test:**
   - LiteSpeed Cache > Purge > Purge All
   - Wait 1 minute
   - Refresh page and check headers again

---

### Cloudflare Issues

See detailed guide: [Cloudflare + Google Login Fix](CLOUDFLARE-FIX-GOOGLE-LOGIN.md)

**Common problems:**
- Google OAuth blocked
- Minification breaking React
- SSL/TLS errors

**Quick fixes:**

1. **SSL Mode:** Must be **Full (strict)**
2. **Rocket Loader:** Must be **OFF** (breaks React)
3. **Auto Minify:** Keep ON (but test if breaks anything)
4. **Page Rules:** Bypass cache for `/wp-json/*`

---

### Build Failures

**Symptoms:**
- `npm run build` fails
- TypeScript errors
- Vite errors

**Common Solutions:**

```bash
# 1. Clear node_modules
rm -rf node_modules package-lock.json
npm install

# 2. Clear Vite cache
rm -rf dist .vite

# 3. Fix TypeScript errors
npm run build 2>&1 | grep error

# 4. Check Node version
node -v
# Should be 18+

# 5. Update dependencies (careful!)
npm update
```

---

## Performance Issues

### Slow Page Load

**Checklist:**

- [ ] LiteSpeed Cache enabled?
- [ ] Cloudflare cache working?
- [ ] Images optimized (WebP)?
- [ ] Bundle size < 200KB?
- [ ] Lazy loading active?

**Test:**

```bash
# Check bundle size
ls -lh dist/assets/*.js | sort -k5 -h

# Should be:
# index-*.js ~68 KB (gzipped)
# vendor-*.js ~56 KB (gzipped)
```

**Solutions:**

1. **Enable caching** (see above)
2. **Optimize images:**
   ```bash
   # Convert to WebP
   for img in images/*.{jpg,png}; do
     cwebp -q 80 "$img" -o "${img%.*}.webp"
   done
   ```

3. **Reduce bundle size:**
   - Check for large dependencies
   - Use lazy loading
   - Remove unused code

---

## Getting Help

### Debug Mode

Enable WordPress debug mode in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);
```

Then check `/wp-content/debug.log`

### Health Check

```bash
# WordPress health check
wp doctor check

# Check site status
curl -I https://djzeneyer.com/
```

### Contact Support

If issue persists:

1. Check [Common Issues](COMMON-ISSUES.md) guide
2. Review [Architecture docs](../ARCHITECTURE.md)
3. Search [GitHub Issues](https://github.com/MarceloEyer/djzeneyer/issues)
4. Contact: contato@djzeneyer.com

---

**Last Updated:** January 2026
