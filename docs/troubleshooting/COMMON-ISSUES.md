# Common Issues & Solutions

## Google Login 403 Error

**Problem:** Cloudflare blocking POST requests to `/wp-json/zeneyer-auth/v1/auth/google`

**Solution:** See [CLOUDFLARE-FIX-GOOGLE-LOGIN.md](CLOUDFLARE-FIX-GOOGLE-LOGIN.md)

## Events Not Showing

**Problem:** Zen BIT cache has old data

**Solution:**
1. Go to Zen Plugins → Zen BIT Events
2. Click "Clear Events Cache"
3. Refresh page

## Plugin Not Working

**Problem:** Plugin not activated or rewrite rules not flushed

**Solution:**
1. Go to Plugins → Installed Plugins
2. Activate the plugin
3. Go to Settings → Permalinks
4. Click "Save Changes" (flushes rewrite rules)

## CSP Blocking Scripts

**Problem:** Content Security Policy blocking external scripts

**Solution:** Update .htaccess CSP headers (see [HTACCESS.md](../guides/HTACCESS.md))

## Build Errors

**Problem:** Vite build failing

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## WordPress REST API 404

**Problem:** REST API endpoints returning 404

**Solution:**
1. Check .htaccess has WordPress rewrite rules
2. Flush permalinks (Settings → Permalinks → Save)
3. Verify plugin is activated

## Slow Performance

**Problem:** Site loading slowly

**Solution:**
1. Enable LiteSpeed Cache
2. Configure Cloudflare CDN
3. Optimize images
4. Check cache hit rate

## Database Connection Error

**Problem:** "Error establishing database connection"

**Solution:**
1. Check wp-config.php credentials
2. Verify MySQL service is running
3. Check database user permissions

## White Screen of Death

**Problem:** Blank white page

**Solution:**
1. Enable WP_DEBUG in wp-config.php
2. Check error logs
3. Disable plugins one by one
4. Switch to default theme

## Memory Limit Exceeded

**Problem:** "Allowed memory size exhausted"

**Solution:**
Add to wp-config.php:
```php
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

## CORS Errors

**Problem:** Cross-origin requests blocked

**Solution:** Check .htaccess CORS configuration (see [HTACCESS.md](../guides/HTACCESS.md))
