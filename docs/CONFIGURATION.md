# ⚙️ Configuração do Servidor

Configurações consolidadas para WordPress, .htaccess, LiteSpeed Cache e Cloudflare.

---

## 1. WordPress (`wp-config.php`)

```php
// Modo Headless
define('HEADLESS_MODE_ENABLED', true);
define('FORCE_SSL_ADMIN', true);
define('DISALLOW_FILE_EDIT', true);

// URLs
define('WP_HOME', 'https://djzeneyer.com');
define('WP_SITEURL', 'https://djzeneyer.com');

// Segurança
define('JWT_AUTH_SECRET_KEY', 'SUA_CHAVE_SECRETA_AQUI');
define('AUTH_SALT', '...');

// Performance
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');
```

---

## 2. .htaccess

```apache
# Forçar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# Segurança
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"

# CORS para API headless
<IfModule mod_headers.c>
  SetEnvIf Origin "https://djzeneyer\.com$" CORS_ORIGIN=$0
  Header set Access-Control-Allow-Origin "%{CORS_ORIGIN}e" env=CORS_ORIGIN
  Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
  Header set Access-Control-Allow-Headers "Authorization, Content-Type, X-WP-Nonce"
  Header set Access-Control-Allow-Credentials "true"
</IfModule>

# SPA Fallback (React Router)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/wp-
RewriteCond %{REQUEST_URI} !^/wp-json/
RewriteRule ^(.*)$ /index.html [L]
```

---

## 3. LiteSpeed Cache

| Configuração | Valor |
|-------------|-------|
| TTL Público | 604800 (7 dias) |
| TTL Privado | 1800 (30 min) |
| Cache REST API | ✅ Ativado |
| ESI | ❌ Desativado (SPA) |
| Minificação CSS/JS | ✅ Ativado |
| Otimização de Imagens | ✅ WebP |

### Purge Rules
- **Publicar/atualizar post:** Purge da home + feed
- **Deploy:** Purge total via script CI/CD

---

## 4. Cloudflare

| Configuração | Valor |
|-------------|-------|
| SSL | Full (Strict) |
| Minificação | JS + CSS + HTML |
| Cache | Standard |
| Page Rules | `wp-admin/*` → Bypass Cache |
| Page Rules | `wp-json/*` → Bypass Cache |
| Firewall | Rate limiting ativo |

### DNS
```
Tipo    Nome              Valor                 Proxy
A       djzeneyer.com     IP_DO_SERVIDOR        ☁️ Proxied
CNAME   www               djzeneyer.com         ☁️ Proxied
```

---

## 5. Variáveis de Ambiente (Frontend)

```env
# .env (desenvolvimento local)
VITE_WP_REST_URL=https://djzeneyer.com/wp-json
VITE_SITE_URL=https://djzeneyer.com
```

> ⚠️ **Importante:** `.env` **nunca** deve ser commitado. Está no `.gitignore`.

---

**Atualizado:** Fevereiro 2026

---

## Performance Budget no CI (Atualizacao 2026-03)

O pipeline inclui validacao automatica de performance apos build:

```bash
npm run perf:baseline
npm run perf:budget
```

Script de budget: `scripts/check-performance-budget.mjs`

Limites padrao:
- `PERF_BUDGET_INITIAL_JS_GZIP` default: `181 * 1024`
- `PERF_BUDGET_LARGEST_CHUNK_GZIP` default: `120 * 1024`
- `PERF_BUDGET_ENTRY_JS_GZIP` default: `130 * 1024`
- `PERF_BUDGET_I18N_GZIP` default: `55 * 1024`

Todos podem ser sobrescritos por variaveis de ambiente no CI.
