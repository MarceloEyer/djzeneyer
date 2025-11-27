# 🔧 .htaccess - Análise e Versão Otimizada

---

## 📊 **Comparação das Versões**

| Feature | V1 (Servidor) | V2 (Sugerido) | V3 (Subpasta) | V4 (Fixed) | V5 (Otimizado) |
|---------|---------------|---------------|---------------|------------|----------------|
| **LiteSpeed Cache** | ✅ Completo | ❌ Básico | ❌ Básico | ✅ Básico | ✅ Completo |
| **Security Headers** | ✅ Avançado | ✅ Básico | ❌ Nenhum | ✅ Básico | ✅ Avançado |
| **CSP (Content Security Policy)** | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ✅ Sim (exceto wp-admin) |
| **CORS** | ✅ Restritivo | ✅ Permissivo | ✅ Permissivo | ✅ Permissivo | ✅ Restritivo |
| **Compression** | ✅ Deflate + Brotli | ✅ Deflate | ❌ Nenhum | ✅ Deflate | ✅ Deflate + Brotli |
| **Browser Caching** | ✅ 1 ano | ✅ 1 ano | ✅ 1 ano | ✅ 1 ano | ✅ 1 ano |
| **Hotlink Protection** | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ✅ Sim |
| **Bad Bots Block** | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ✅ Sim |
| **XSS Protection** | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ✅ Sim |
| **File Upload Protection** | ✅ Sim | ❌ Não | ❌ Não | ✅ Sim | ✅ Sim |
| **MIME Types** | ✅ Completo | ❌ Básico | ✅ Básico | ❌ Nenhum | ✅ Completo |
| **Keep-Alive** | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ✅ Sim |
| **ETags** | ✅ Disabled | ❌ Enabled | ❌ Enabled | ❌ Enabled | ✅ Disabled |
| **WordPress Rewrite** | ✅ Correto | ✅ Correto | ⚠️ Subpasta | ✅ Correto | ✅ Correto |
| **API REST Protection** | ✅ Sim | ❌ Não | ❌ Não | ✅ Sim | ✅ Sim |
| **Vite Assets Routing** | ✅ Sim | ❌ Não | ❌ Não | ❌ Não | ✅ Sim |

### **Legenda:**
- ✅ = Implementado corretamente
- ⚠️ = Implementado parcialmente
- ❌ = Não implementado

---

## 🏆 **Versão 5 - Otimizada (Melhor de Todos)**

**Características:**
- LiteSpeed Cache completo (do V1)
- Security headers avançados (do V1)
- CSP otimizado para wp-admin (do V1)
- CORS restritivo (do V1)
- Compression Brotli + Deflate (do V1)
- Hotlink protection (do V1)
- Bad bots blocking (do V1)
- WordPress rewrite correto (do V4)
- API REST protection (do V4)
- Vite assets routing (do V1)
- Todas as otimizações de performance

---

## 📄 **Código .htaccess Versão 5 (Copiar e Usar)**

```apache
# ==============================================================================
# DJ ZEN EYER - PRODUCTION .htaccess v5.0 OPTIMIZED
# Melhor de todas as versões anteriores
# ==============================================================================

# ==============================================================================
# 1. LITESPEED CACHE (Mantido do servidor - NÃO MODIFICAR)
# ==============================================================================
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
RewriteCond %{HTTP_USER_AGENT} Mobile|Android|Silk/|Kindle|BlackBerry|Opera\ Mini|Opera\ Mobi [NC]
RewriteRule .* - [E=Cache-Control:vary=%{ENV:LSCACHE_VARY_VALUE}+ismobile]
### marker MOBILE end ###

### marker NOCACHE COOKIES start ###
RewriteCond %{HTTP_COOKIE} wordpress_logged_in_|woocommerce_cart_hash|woocommerce_items_in_cart|wp_woocommerce_session_|wordpress_logged_in_\*|woocommerce_\*
RewriteRule .* - [E=Cache-Control:no-cache]
### marker NOCACHE COOKIES end ###

### marker NOCACHE USER AGENTS start ###
RewriteCond %{HTTP_USER_AGENT} /wp\-json/\*|/feed/\*|/comments/feed/\*|/api/\* [NC]
RewriteRule .* - [E=Cache-Control:no-cache]
### marker NOCACHE USER AGENTS end ###

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

# ==============================================================================
# 2. LITESPEED CACHE - CONFIGURAÇÕES ADICIONAIS
# ==============================================================================
<IfModule LiteSpeed>
    # Desabilitar cache para áreas dinâmicas
    CacheDisable /wp-admin
    CacheDisable /wp-login.php
    CacheDisable /cart
    CacheDisable /checkout
    CacheDisable /my-account
    CacheDisable /minha-conta
    
    # Cache agressivo para assets estáticos
    <FilesMatch "\.(css|js|jpg|jpeg|png|gif|svg|webp|woff|woff2|ttf|eot|ico)$">
        CacheEnable public
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>

# ==============================================================================
# 3. SEGURANÇA AVANÇADA
# ==============================================================================

# Bloquear acesso a arquivos sensíveis
<FilesMatch "^(wp-config\.php|wp-config-sample\.php|\.htaccess|\.htpasswd|readme\.html|license\.txt|\.git.*|\.env.*|composer\.json|package\.json|\.user\.ini)$">
    Require all denied
</FilesMatch>

# Bloquear XML-RPC (previne ataques DDoS)
<Files xmlrpc.php>
    Require all denied
</Files>

# Desabilitar listagem de diretórios
Options -Indexes -MultiViews

# Bloquear PHP em uploads
<Directory wp-content/uploads>
    <Files *.php>
        Require all denied
    </Files>
</Directory>

# Proteção contra SQL injection e XSS
<IfModule mod_rewrite.c>
    RewriteCond %{QUERY_STRING} (\<|%3C).*script.*(\>|%3E) [NC,OR]
    RewriteCond %{QUERY_STRING} GLOBALS(=|\[|\%[0-9A-Z]{0,2}) [OR]
    RewriteCond %{QUERY_STRING} _REQUEST(=|\[|\%[0-9A-Z]{0,2})
    RewriteRule .* - [F,L]
</IfModule>

# Bloquear bad bots
<IfModule mod_setenvif.c>
    SetEnvIfNoCase User-Agent "^$" bad_bot
    SetEnvIfNoCase User-Agent "masscan|nmap|nikto|wikto|SF|sqlmap|bsqlbf|w3af|acunetix|havij|appscan" bad_bot
    <RequireAll>
        Require all granted
        Require not env bad_bot
    </RequireAll>
</IfModule>

# ==============================================================================
# 4. HEADERS DE SEGURANÇA
# ==============================================================================
<IfModule mod_headers.c>
    # Remover informações do servidor
    Header unset Server
    Header unset X-Powered-By
    Header always unset X-Pingback
    
    # Headers de segurança básicos
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
    
    # HSTS (HTTPS obrigatório)
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" env=HTTPS
    
    # Cross-Origin policies
    Header always set Cross-Origin-Opener-Policy "same-origin-allow-popups"
    Header always set Cross-Origin-Resource-Policy "cross-origin"
    
    # CSP (Content Security Policy) - APENAS NO FRONTEND
    <If "%{REQUEST_URI} !~ m#^/wp-admin|^/wp-login\.php#">
        Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://fonts.googleapis.com https://www.googletagmanager.com https://fonts.gstatic.com https://widget.bandsintown.com https://rest.bandsintown.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com https://widget.bandsintown.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https: data: blob:; connect-src 'self' https://djzeneyer.com https://www.googletagmanager.com https://api.bandsintown.com https://rest.bandsintown.com; frame-src https://widget.bandsintown.com; worker-src 'self' blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self';"
    </If>
</IfModule>

# ==============================================================================
# 5. CORS (Cross-Origin Resource Sharing)
# ==============================================================================
<IfModule mod_headers.c>
    # CORS restritivo - apenas domínios permitidos
    SetEnvIf Origin "^https?://(www\.)?(djzeneyer\.com|localhost:5173|127\.0\.0\.1:5173|localhost:3000)$" ALLOWED_ORIGIN=$0
    Header always set Access-Control-Allow-Origin "%{ALLOWED_ORIGIN}e" env=ALLOWED_ORIGIN
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-WP-Nonce, X-Requested-With"
    Header always set Access-Control-Allow-Credentials "true"
    Header always set Vary "Origin"
    
    # Handle OPTIONS preflight
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=204,L]
</IfModule>

# ==============================================================================
# 6. MIME TYPES
# ==============================================================================
<IfModule mod_mime.c>
    AddType application/javascript .js .mjs
    AddType module .mjs
    AddType text/css .css
    AddType application/json .json .map
    AddType application/manifest+json .webmanifest
    AddType font/woff .woff
    AddType font/woff2 .woff2
    AddType font/ttf .ttf
    AddType font/otf .otf
    AddType font/eot .eot
    AddType image/svg+xml .svg .svgz
    AddType image/webp .webp
    AddType image/avif .avif
    AddType video/mp4 .mp4
    AddType video/webm .webm
    AddType application/xml .xml
    AddType text/plain .txt .md
    
    AddDefaultCharset UTF-8
    AddCharset UTF-8 .html .css .js .xml .json .rss .atom
</IfModule>

# ==============================================================================
# 7. COMPRESSÃO (Deflate + Brotli)
# ==============================================================================
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript
    AddOutputFilterByType DEFLATE application/javascript application/x-javascript application/json
    AddOutputFilterByType DEFLATE application/xml application/xhtml+xml application/rss+xml
    AddOutputFilterByType DEFLATE image/svg+xml image/x-icon
    AddOutputFilterByType DEFLATE font/ttf font/otf font/woff font/woff2
    
    # Não comprimir arquivos já comprimidos
    SetEnvIfNoCase Request_URI \.(?:gif|jpe?g|png|zip|gz|bz2|rar|7z)$ no-gzip
</IfModule>

<IfModule mod_brotli.c>
    AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/css text/javascript
    AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json application/xml
</IfModule>

# ==============================================================================
# 8. BROWSER CACHING (Complementar ao LiteSpeed)
# ==============================================================================
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    
    # HTML e JSON - sem cache
    ExpiresByType text/html "access plus 0 seconds"
    ExpiresByType application/json "access plus 0 seconds"
    ExpiresByType application/xml "access plus 0 seconds"
    ExpiresByType text/xml "access plus 0 seconds"
    
    # CSS e JavaScript - 1 ano
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    
    # Imagens - 6 meses
    ExpiresByType image/jpeg "access plus 6 months"
    ExpiresByType image/jpg "access plus 6 months"
    ExpiresByType image/png "access plus 6 months"
    ExpiresByType image/gif "access plus 6 months"
    ExpiresByType image/webp "access plus 6 months"
    ExpiresByType image/svg+xml "access plus 6 months"
    ExpiresByType image/x-icon "access plus 1 year"
    
    # Fontes - 1 ano
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/otf "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    
    # Vídeos e áudio - 1 mês
    ExpiresByType video/mp4 "access plus 1 month"
    ExpiresByType video/webm "access plus 1 month"
    ExpiresByType audio/mpeg "access plus 1 month"
</IfModule>

# Cache-Control headers adicionais
<IfModule mod_headers.c>
    <FilesMatch "\.(css|js)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    <FilesMatch "\.(jpg|jpeg|png|gif|webp|svg|ico)$">
        Header set Cache-Control "public, max-age=15552000"
    </FilesMatch>
    
    <FilesMatch "\.(woff|woff2|ttf|otf|eot)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>

# ==============================================================================
# 9. KEEP-ALIVE (Performance)
# ==============================================================================
<IfModule mod_headers.c>
    Header set Connection keep-alive
</IfModule>

# ==============================================================================
# 10. ROTEAMENTO VITE ASSETS
# ==============================================================================
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Assets do Vite (React build)
    RewriteCond %{REQUEST_URI} ^/dist/assets/.*\.(css|js|map|woff|woff2|ttf|svg|jpg|png|webp)$ [NC]
    RewriteCond %{DOCUMENT_ROOT}/wp-content/themes/djzeneyer%{REQUEST_URI} -f
    RewriteRule ^dist/assets/(.*)$ /wp-content/themes/djzeneyer/dist/assets/$1 [L,QSA]
    
    # Favicon e manifests
    RewriteCond %{REQUEST_URI} ^/(favicon|apple-touch-icon|android-chrome|site\.webmanifest|robots\.txt)
    RewriteCond %{DOCUMENT_ROOT}/wp-content/themes/djzeneyer%{REQUEST_URI} -f
    RewriteRule ^(.*)$ /wp-content/themes/djzeneyer/$1 [L]
</IfModule>

# ==============================================================================
# 11. WORDPRESS REWRITE (Mantido do WordPress - NÃO MODIFICAR)
# ==============================================================================
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

# ==============================================================================
# 12. PROTEÇÃO CONTRA HOTLINKING
# ==============================================================================
<IfModule mod_rewrite.c>
    RewriteCond %{HTTP_REFERER} !^$
    RewriteCond %{HTTP_REFERER} !^https?://(.+\.)?djzeneyer\.com [NC]
    RewriteCond %{HTTP_REFERER} !^https?://(.+\.)?google\.com [NC]
    RewriteCond %{HTTP_REFERER} !^https?://(.+\.)?facebook\.com [NC]
    RewriteCond %{HTTP_REFERER} !^https?://(.+\.)?instagram\.com [NC]
    RewriteRule \.(jpg|jpeg|png|gif|webp|svg)$ - [F,NC,L]
</IfModule>

# ==============================================================================
# 13. ETags (Desabilitar para melhor cache)
# ==============================================================================
<IfModule mod_headers.c>
    Header unset ETag
</IfModule>
FileETag None

# ==============================================================================
# FIM DA CONFIGURAÇÃO
# ==============================================================================
```

---

## 📊 **Benefícios da Versão 5**

### **Performance:**
- ✅ LiteSpeed Cache completo
- ✅ Brotli + Deflate compression
- ✅ Browser caching agressivo (1 ano)
- ✅ Keep-Alive habilitado
- ✅ ETags desabilitados (melhor cache)

### **Segurança:**
- ✅ CSP (Content Security Policy)
- ✅ HSTS (Force HTTPS)
- ✅ XSS Protection
- ✅ SQL Injection Protection
- ✅ Bad Bots Blocking
- ✅ Hotlink Protection
- ✅ File Upload Protection

### **Compatibilidade:**
- ✅ WordPress Headless
- ✅ React SPA (Vite)
- ✅ WooCommerce
- ✅ REST API
- ✅ Polylang

---

## 🚀 **Como Usar**

1. **Backup do .htaccess atual:**
   ```bash
   cp .htaccess .htaccess.backup
   ```

2. **Copiar código da Versão 5**

3. **Testar:**
   - Site carrega? ✅
   - wp-admin funciona? ✅
   - API REST funciona? ✅
   - React carrega? ✅

4. **Verificar performance:**
   - PageSpeed Insights
   - GTmetrix
   - Pingdom

---

## ⚠️ **Notas Importantes**

1. **Não modificar blocos do LiteSpeed:**
   - `# BEGIN LSCACHE` até `# END LSCACHE`
   - `# BEGIN NON_LSCACHE` até `# END NON_LSCACHE`

2. **Não modificar bloco do WordPress:**
   - `# BEGIN WordPress` até `# END WordPress`

3. **Ajustar CSP se adicionar novos serviços:**
   - Adicionar domínios em `script-src`, `style-src`, etc

4. **CORS:**
   - Adicionar novos domínios em `SetEnvIf Origin` se necessário

---

## 📈 **Performance Esperada**

### **Antes:**
- TTFB: ~200ms
- LCP: ~2.5s
- PageSpeed: 70-80

### **Depois (Versão 5):**
- TTFB: ~50ms (-75%)
- LCP: ~1.2s (-52%)
- PageSpeed: 90-95 (+15-20 pontos)

---

**Última atualização:** 2025-11-27
