# =====================================================
# DJ ZENEYER — .htaccess (v10.2 - CORREÇÕES SEO)
# LiteSpeed + WordPress + React SPA
# =====================================================

# BEGIN LSCACHE
## LITESPEED WP CACHE PLUGIN - Do not edit the contents of this block! ##
<IfModule LiteSpeed>
RewriteEngine on
CacheLookup on
RewriteRule .* - [E=Cache-Control:no-autoflush]
RewriteRule litespeed/debug/.*\.log$ - [F,L]
RewriteRule \.litespeed_conf\.dat - [F,L]

### marker ASYNC start ###
RewriteCond %{REQUEST_URI} /wp-admin/admin-ajax\.php
RewriteCond %{QUERY_STRING} action=async_litespeed
RewriteRule .* - [E=noabort:1]
### marker ASYNC end ###

### marker MOBILE start ###
RewriteCond %{REQUEST_URI} Mobile|Android|Silk/|Kindle|BlackBerry|Opera\ Mini|Opera\ Mobi [NC]
RewriteRule .* - [E=Cache-Control:vary=%{ENV:LSCACHE_VARY_VALUE}+ismobile]
### marker MOBILE end ###

### marker WEBP start ###
RewriteCond %{HTTP_ACCEPT} image/webp [OR]
RewriteCond %{HTTP_USER_AGENT} iPhone\ OS\ (1[4-9]|[2-9][0-9]) [OR]
RewriteCond %{HTTP_USER_AGENT} Firefox/([6-9][0-9]|[1-9][0-9]{2,})
RewriteRule .* - [E=Cache-Control:vary=%{ENV:LSCACHE_VARY_VALUE}+webp]
### marker WEBP end ###

### marker DROPQS start ###
CacheKeyModify -qs:fbclid
CacheKeyModify -qs:gclid
CacheKeyModify -qs:utm*
CacheKeyModify -qs:_ga
### marker DROPQS end ###

</IfModule>
## LITESPEED WP CACHE PLUGIN - Do not edit the contents of this block! ##
# END LSCACHE

# BEGIN NON_LSCACHE
## LITESPEED WP CACHE PLUGIN - Do not edit the contents of this block! ##
### marker BROWSER CACHE start ###
<IfModule mod_expires.c>
ExpiresActive on
ExpiresByType application/pdf A31557600
ExpiresByType image/x-icon A31557600
ExpiresByType image/vnd.microsoft.icon A31557600
ExpiresByType image/svg+xml A31557600

ExpiresByType image/jpg A31557600
ExpiresByType image/jpeg A31557600
ExpiresByType image/png A31557600
ExpiresByType image/gif A31557600
ExpiresByType image/webp A31557600
ExpiresByType image/avif A31557600

ExpiresByType video/ogg A31557600
ExpiresByType audio/ogg A31557600
ExpiresByType video/mp4 A31557600
ExpiresByType video/webm A31557600

ExpiresByType text/css A31557600
ExpiresByType text/javascript A31557600
ExpiresByType application/javascript A31557600
ExpiresByType application/x-javascript A31557600

ExpiresByType application/x-font-ttf A31557600
ExpiresByType application/x-font-woff A31557600
ExpiresByType application/font-woff A31557600
ExpiresByType application/font-woff2 A31557600
ExpiresByType application/vnd.ms-fontobject A31557600
ExpiresByType font/ttf A31557600
ExpiresByType font/otf A31557600
ExpiresByType font/woff A31557600
ExpiresByType font/woff2 A31557600

</IfModule>
### marker BROWSER CACHE end ###

## LITESPEED WP CACHE PLUGIN - Do not edit the contents of this block! ##
# END NON_LSCACHE

# -------------------------
# Reescrita principal
# -------------------------
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
</IfModule>

# =====================================================
# CORREÇÃO 1: Forçar HTTPS
# =====================================================
<IfModule mod_rewrite.c>
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# =====================================================
# CORREÇÃO 2: Remover index.html e index.php (ANTES de remover WWW)
# =====================================================
<IfModule mod_rewrite.c>
    RewriteCond %{THE_REQUEST} ^.*/index\.(html|php)
    RewriteRule ^(.*)index\.(html|php)$ https://djzeneyer.com/$1 [R=301,L]
</IfModule>

# =====================================================
# CORREÇÃO 3: Remover WWW (Redirect 301)
# =====================================================
<IfModule mod_rewrite.c>
    RewriteCond %{HTTP_HOST} ^www\.djzeneyer\.com [NC]
    RewriteRule ^(.*)$ https://djzeneyer.com/$1 [L,R=301]
</IfModule>

# =====================================================
# CORS controlado
# =====================================================
SetEnvIfNoCase Origin "^https?://(djzeneyer\.com|www\.djzeneyer\.com|app\.djzeneyer\.com)(:[0-9]+)?$" ORIGIN_ALLOWED=$0
SetEnvIfNoCase Origin "^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$" ORIGIN_ALLOWED=$0

<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "%{ORIGIN_ALLOWED}e" env=ORIGIN_ALLOWED
    Header always set Access-Control-Allow-Credentials "true" env=ORIGIN_ALLOWED
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" env=ORIGIN_ALLOWED
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey, X-Requested-With" env=ORIGIN_ALLOWED
    Header always set Access-Control-Expose-Headers "Content-Length, Content-Range" env=ORIGIN_ALLOWED
</IfModule>

# Responder OPTIONS com 200 (pré-flight)
<IfModule mod_rewrite.c>
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^ - [R=200,L]
</IfModule>

# =====================================================
# Proteções de arquivos sensíveis
# =====================================================
<FilesMatch "^(wp-config\.php|\.env|\.git|\.gitignore|composer\.json|composer\.lock|phpunit\.xml)$">
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order allow,deny
        Deny from all
    </IfModule>
</FilesMatch>

<Files ".htaccess">
    <IfModule mod_authz_core.c>
        Require all denied
    </IfModule>
    <IfModule !mod_authz_core.c>
        Order allow,deny
        Deny from all
    </IfModule>
</Files>

# =====================================================
# Cache/Expires para ativos estáticos
# =====================================================
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/eot "access plus 1 year"
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/json "access plus 0 seconds"
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "\.(ico|jpe?g|png|gif|webp|svg|css|js|woff2?|ttf|eot)$">
        Header set Cache-Control "public, max-age=31557600, immutable"
    </FilesMatch>
    <FilesMatch "\.(pdf|json)$">
        Header set Cache-Control "public, max-age=2592000"
    </FilesMatch>
</IfModule>

# =====================================================
# Compressão (gzip/deflate)
# =====================================================
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# =====================================================
# WordPress core (NÃO REMOVER)
# =====================================================
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
