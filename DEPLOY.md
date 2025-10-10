# 🚀 DEPLOY - djzeneyer.com

Instruções completas para deploy do site React + WordPress Headless.

---

## 📋 PRÉ-REQUISITOS

### Backend (WordPress)
- [ ] WordPress instalado em `https://djzeneyer.com`
- [ ] PHP 7.4+ com `mod_rewrite` habilitado
- [ ] MySQL 5.7+ ou MariaDB 10.3+
- [ ] SSL/HTTPS configurado (Let's Encrypt)

### Plugins Obrigatórios
- [ ] **Simple JWT Login v3.6.4** (by Nicu Micle)
- [ ] **Polylang** ou **WPML** (multilíngue)
- [ ] **WooCommerce** (loja)
- [ ] **MailPoet** (newsletter)
- [ ] **LiteSpeed Cache** (opcional, performance)

### Frontend
- [ ] Node.js 18+ instalado localmente
- [ ] npm ou yarn
- [ ] Acesso FTP/SFTP ou painel de hospedagem

---

## 🔧 PASSO 1: CONFIGURAR BACKEND (WordPress)

### 1.1. Configurar Simple JWT Login

**Local:** WordPress Admin → Settings → Simple JWT Login

```
GENERAL SETTINGS
├── JWT Decryption Key: gere_chave_32_caracteres_minimo
├── JWT Time to Live: 604800 (7 dias)
└── Allow CORS: ✅ Enabled

AUTHENTICATION
├── ✅ Allow Authentication
├── ✅ Allow Authentication with Email
└── Auth Codes: (deixe vazio)

LOGIN
├── ✅ Enable Login Endpoint
├── JWT Payload:
│   {
│     "id": "{{user_id}}",
│     "email": "{{user_email}}",
│     "display_name": "{{display_name}}",
│     "roles": "{{user_roles}}"
│   }
└── Login Custom Endpoint: /auth

REGISTER
├── ✅ Allow Register
├── ✅ Require Password on Register
├── New User Profile: subscriber
└── Random Password Length: 12

CORS
├── Allow Origins: https://djzeneyer.com
└── ✅ Allow Credentials
```

---

### 1.2. Configurar .htaccess (WordPress Root)

**Arquivo:** `/public_html/.htaccess` ou `/var/www/html/.htaccess`

**Adicione ANTES de `# BEGIN WordPress`:**

```apache
# =====================================================
# CONFIGURAÇÃO PARA REACT SPA + WORDPRESS HEADLESS
# =====================================================

# Habilita mod_rewrite
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# CORS Headers para API REST
<FilesMatch "\.(json|xml)$">
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-WP-Nonce"
    Header set Access-Control-Allow-Credentials "true"
</FilesMatch>

# Handle OPTIONS requests
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Protege wp-config.php
<Files wp-config.php>
    Order allow,deny
    Deny from all
</Files>

# Protege .env
<Files .env>
    Order allow,deny
    Deny from all
</Files>

# Cache para arquivos estáticos (JS, CSS, imagens)
<IfModule mod_expires.c>
    ExpiresActive On

    # Imagens
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"

    # CSS e JavaScript
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"

    # Fontes
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/eot "access plus 1 year"

    # Outros
    ExpiresByType application/pdf "access plus 1 month"
    ExpiresByType application/json "access plus 0 seconds"
</IfModule>

# Compressão Gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Redirecionar HTTP para HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirecionar www para non-www (ou vice-versa)
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

</IfModule>

# =====================================================
# NÃO REMOVER: WordPress original abaixo
# =====================================================
# BEGIN WordPress
# (seu código WordPress original aqui)
# END WordPress
```

---

### 1.3. Adicionar ao functions.php

**Arquivo:** `/wp-content/themes/seu-tema/functions.php`

**Adicione no final do arquivo:**

```php
<?php
/**
 * ============================================
 * CONFIGURAÇÃO PARA REACT SPA + WOOCOMMERCE
 * ============================================
 */

// CORS Headers para REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($served) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        return $served;
    });
});

// Handle OPTIONS requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        status_header(200);
        exit;
    }
});

// Endpoint customizado para menu multilíngue
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/menu', [
        'methods' => 'GET',
        'callback' => 'get_multilang_menu',
        'permission_callback' => '__return_true'
    ]);
});

function get_multilang_menu($request) {
    $lang = sanitize_text_field($request->get_param('lang')) ?: 'en';

    // Polylang integration
    if (function_exists('pll_set_language')) {
        pll_set_language($lang);
    }

    // WPML integration
    if (defined('ICL_LANGUAGE_CODE')) {
        do_action('wpml_switch_language', $lang);
    }

    $menu_locations = get_nav_menu_locations();
    $menu_id = $menu_locations['primary'] ?? null;

    if (!$menu_id) {
        return [];
    }

    $menu_items = wp_get_nav_menu_items($menu_id);
    $formatted_items = [];

    foreach ($menu_items as $item) {
        if ($item->menu_item_parent == 0) {
            $formatted_items[] = [
                'ID' => $item->ID,
                'title' => $item->title,
                'url' => str_replace(home_url(), '', $item->url),
                'target' => $item->target ?: '_self'
            ];
        }
    }

    return $formatted_items;
}

// Endpoint para Google OAuth
add_action('rest_api_init', function() {
    register_rest_route('simple-jwt-login/v1', '/auth/google', [
        'methods' => 'POST',
        'callback' => 'handle_google_oauth',
        'permission_callback' => '__return_true'
    ]);
});

function handle_google_oauth($request) {
    $token = $request->get_param('token');

    if (!$token) {
        return new WP_Error('no_token', 'Token is required', ['status' => 400]);
    }

    // Verificar token com Google
    $response = wp_remote_get('https://oauth2.googleapis.com/tokeninfo?id_token=' . $token);

    if (is_wp_error($response)) {
        return new WP_Error('invalid_token', 'Failed to verify token', ['status' => 401]);
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (!isset($body['email'])) {
        return new WP_Error('invalid_token', 'Invalid token', ['status' => 401]);
    }

    $email = sanitize_email($body['email']);
    $name = sanitize_text_field($body['name'] ?? '');

    // Buscar ou criar usuário
    $user = get_user_by('email', $email);

    if (!$user) {
        $user_id = wp_create_user($email, wp_generate_password(), $email);
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        wp_update_user([
            'ID' => $user_id,
            'display_name' => $name,
            'first_name' => $name
        ]);
        $user = get_user_by('id', $user_id);
    }

    // Gerar JWT
    if (class_exists('SimpleJwtLoginJWT')) {
        $jwt_instance = new SimpleJwtLoginJWT();
        $jwt = $jwt_instance->encode([
            'id' => $user->ID,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'roles' => $user->roles
        ]);

        return [
            'jwt' => $jwt,
            'user' => [
                'id' => $user->ID,
                'email' => $user->user_email,
                'name' => $user->display_name
            ]
        ];
    }

    return new WP_Error('jwt_failed', 'Failed to generate JWT', ['status' => 500]);
}

// WooCommerce: Fix URLs para Polylang
add_filter('woocommerce_get_checkout_url', function($url) {
    if (function_exists('pll_current_language')) {
        $lang = pll_current_language();
        if ($lang === 'pt') {
            $url = home_url('/pt/finalizar-compra/');
        }
    }
    return $url;
});

add_filter('woocommerce_get_cart_url', function($url) {
    if (function_exists('pll_current_language')) {
        $lang = pll_current_language();
        if ($lang === 'pt') {
            $url = home_url('/pt/carrinho/');
        }
    }
    return $url;
});

// Newsletter subscription (MailPoet)
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/subscribe', [
        'methods' => 'POST',
        'callback' => 'mailpoet_subscribe',
        'permission_callback' => '__return_true'
    ]);
});

function mailpoet_subscribe($request) {
    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email', ['status' => 400]);
    }

    if (!class_exists(\MailPoet\API\API::class)) {
        return new WP_Error('mailpoet_inactive', 'MailPoet inactive', ['status' => 500]);
    }

    try {
        $mailpoet_api = \MailPoet\API\API::MP('v1');
        $lists = $mailpoet_api->getLists();
        $list_id = !empty($lists) ? $lists[0]['id'] : 1;

        $mailpoet_api->addSubscriber([
            'email' => $email,
            'status' => 'subscribed'
        ], [$list_id]);

        return ['success' => true, 'message' => 'Subscribed!'];
    } catch (\Exception $e) {
        if (strpos($e->getMessage(), 'already exists') !== false) {
            return ['success' => true, 'message' => 'Already subscribed!'];
        }
        return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
    }
}

// Purge LiteSpeed cache on critical actions
if (class_exists('LiteSpeed\Purge')) {
    add_action('woocommerce_new_product', function() {
        do_action('litespeed_purge_all');
    });

    add_action('woocommerce_thankyou', function() {
        do_action('litespeed_purge_all');
    });

    add_action('wp_login', function() {
        do_action('litespeed_purge_all');
    });
}
?>
```

---

## 🎨 PASSO 2: CONFIGURAR FRONTEND (React)

### 2.1. Configurar .env

**Arquivo:** `.env` (raiz do projeto React)

```env
# WordPress Backend
VITE_WP_SITE_URL=https://djzeneyer.com
VITE_WP_REST_URL=https://djzeneyer.com/wp-json/

# WooCommerce API (obtenha em WP Admin → WooCommerce → Settings → Advanced → REST API)
VITE_WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google OAuth (obtenha em https://console.cloud.google.com/)
VITE_GOOGLE_CLIENT_ID=123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

---

### 2.2. Build do Projeto

```bash
# Instalar dependências
npm install

# Build para produção
npm run build

# Verificar se build foi bem-sucedido
ls -la dist/
```

**Saída esperada:**
```
dist/
├── index.html
├── assets/
│   ├── index.css
│   └── index.js
├── favicon.svg
└── _redirects (se usar Netlify)
```

---

### 2.3. Upload dos Arquivos

#### Opção A: Via FTP/SFTP

1. Conecte ao servidor via FileZilla ou similar
2. Navegue até `/public_html/` ou `/var/www/html/`
3. **NÃO SOBRESCREVA** a pasta `wp-admin`, `wp-content`, `wp-includes`
4. Upload apenas arquivos do `dist/`:
   - `index.html` → raiz
   - `assets/*` → raiz/assets/
   - `favicon.svg` → raiz

#### Opção B: Via SSH

```bash
# Comprimir dist/
tar -czf dist.tar.gz dist/

# Enviar para servidor
scp dist.tar.gz user@djzeneyer.com:/home/user/

# No servidor, extrair
ssh user@djzeneyer.com
cd /var/www/html/
tar -xzf ~/dist.tar.gz --strip-components=1
rm ~/dist.tar.gz
```

---

### 2.4. Configurar .htaccess (React SPA)

**Arquivo:** `/public_html/.htaccess` (adicione DEPOIS do bloco WordPress)

```apache
# =====================================================
# REACT SPA: Redirecionar tudo para index.html
# =====================================================

<IfModule mod_rewrite.c>
    RewriteEngine On

    # Se não for arquivo ou diretório existente
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d

    # E não for rota WordPress (/wp-admin, /wp-json, etc)
    RewriteCond %{REQUEST_URI} !^/wp-admin
    RewriteCond %{REQUEST_URI} !^/wp-json
    RewriteCond %{REQUEST_URI} !^/wp-content
    RewriteCond %{REQUEST_URI} !^/wp-includes

    # Redireciona para index.html (React Router)
    RewriteRule ^ index.html [L]
</IfModule>
```

---

## 🔑 PASSO 3: CONFIGURAR GOOGLE OAUTH

### 3.1. Criar Projeto Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Criar novo projeto: "DJ Zen Eyer Site"
3. Vá em **APIs & Services** → **Credentials**
4. Clique **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**

### 3.2. Configurar OAuth Consent Screen

1. User Type: **External**
2. App name: `DJ Zen Eyer`
3. User support email: `seu@email.com`
4. Developer contact: `seu@email.com`
5. Scopes: `email`, `profile`
6. Test users: Adicione seu email

### 3.3. Criar OAuth Client ID

1. Application type: **Web application**
2. Name: `DJ Zen Eyer Website`
3. **Authorized JavaScript origins:**
   ```
   https://djzeneyer.com
   http://localhost:5173
   ```
4. **Authorized redirect URIs:**
   ```
   https://djzeneyer.com
   https://djzeneyer.com/auth/callback
   http://localhost:5173
   ```
5. Clique **CREATE**
6. Copie **Client ID** e cole no `.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789012-xxxxxxxx.apps.googleusercontent.com
   ```

---

## ✅ PASSO 4: TESTAR DEPLOY

### 4.1. Checklist Backend

Abra o navegador e teste:

- [ ] `https://djzeneyer.com/wp-json/` → Deve retornar JSON
- [ ] `https://djzeneyer.com/wp-json/wc/v3/products?consumer_key=...` → Lista produtos
- [ ] `https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en` → Retorna menu
- [ ] `https://djzeneyer.com/wp-json/simple-jwt-login/v1/auth` → Status 405 (OK)

### 4.2. Checklist Frontend

- [ ] `https://djzeneyer.com/` → Carrega página inicial (EN)
- [ ] `https://djzeneyer.com/pt` → Carrega página inicial (PT)
- [ ] `https://djzeneyer.com/shop` → Lista produtos em inglês
- [ ] `https://djzeneyer.com/pt/loja` → Lista produtos em português
- [ ] Abrir console (F12) → Verificar logs `[LanguageWrapper]` e `[ShopPage]`

### 4.3. Testar Login

1. Clique em "Login" no menu
2. Verifique console: `[AuthModal] Renderizado`
3. Tente login com Google → Deve aparecer botão Google
4. Tente login com email/senha → Deve autenticar

### 4.4. Testar Loja

1. Vá em `/shop`
2. Abra console (F12)
3. Procure por: `[ShopPage] ✅ Produtos recebidos: X`
4. Troque para `/pt/loja`
5. Verifique se produtos mudam conforme idioma

---

## 🐛 TROUBLESHOOTING

### Problema: "CORS error" no console

**Solução:**
1. Verifique se `functions.php` tem CORS headers
2. Verifique se Simple JWT Login tem CORS habilitado
3. Teste endpoint diretamente: `curl -I https://djzeneyer.com/wp-json/`

### Problema: Produtos não aparecem

**Solução:**
1. Verifique `.env`: `VITE_WC_CONSUMER_KEY` e `VITE_WC_CONSUMER_SECRET`
2. Teste API manualmente:
   ```
   https://djzeneyer.com/wp-json/wc/v3/products?consumer_key=ck_xxx&consumer_secret=cs_xxx
   ```
3. Verifique console: `[ShopPage] ❌` para ver erro específico

### Problema: Login Google não aparece

**Solução:**
1. Verifique `.env`: `VITE_GOOGLE_CLIENT_ID`
2. Verifique console: `[GoogleAuthService] Client ID: AUSENTE`
3. Confirme que domínio está autorizado no Google Cloud Console

### Problema: Idioma não muda

**Solução:**
1. Verifique console: `[LanguageWrapper] Idioma determinado: X`
2. Confirme que Polylang está ativo
3. Verifique se menus estão criados para ambos idiomas

### Problema: React Router não funciona (404)

**Solução:**
1. Verifique `.htaccess`: deve ter bloco "REACT SPA"
2. Teste `mod_rewrite`: crie arquivo `test.php` com `<?php echo 'OK'; ?>`
3. Se não funcionar, habilite `mod_rewrite`:
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

---

## 📊 PERFORMANCE

### Cache LiteSpeed (Recomendado)

**WordPress Admin → LiteSpeed Cache → Settings**

```
Cache:
✅ Enable Cache
❌ Cache Logged-in Users

Excludes:
URIs: /cart/*, /checkout/*, /my-account/*, /wp-admin/*
Query Strings: jwt, token, oauth
Cookies: woocommerce_cart_hash, woocommerce_items_in_cart

Optimization:
✅ CSS Minify
✅ CSS Combine
✅ JS Minify
❌ JS Combine (pode quebrar)
✅ Image Lazy Load

CDN:
Use Quic.cloud (gratuito)
```

### PageSpeed Insights

Alvo: 90+ Mobile, 95+ Desktop

1. Acesse: https://pagespeed.web.dev/
2. Teste: `https://djzeneyer.com`
3. Corrija sugestões (lazy load, preload fonts, etc)

---

## 📝 LOGS E DEBUG

### Console do Navegador (F12)

Procure por:
- `[LanguageWrapper]` → Sincronização de idioma
- `[ShopPage]` → Busca de produtos
- `[AuthModal]` → Login/registro
- `[GoogleAuthService]` → OAuth Google

### WordPress Debug

**Arquivo:** `wp-config.php`

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Logs salvos em: `/wp-content/debug.log`

---

## 🚀 PRÓXIMOS PASSOS

1. **Analytics**: Adicione Google Analytics 4
2. **SEO**: Configure Yoast SEO ou Rank Math
3. **Backup**: Configure backup automático (UpdraftPlus)
4. **Segurança**: Instale Wordfence ou iThemes Security
5. **Monitoramento**: Configure Uptime Robot para alertas

---

## 📞 SUPORTE

Se precisar de ajuda:
1. Verifique logs do console (F12)
2. Verifique `debug.log` do WordPress
3. Teste endpoints manualmente com `curl` ou Postman
4. Documente erro específico com screenshot

---

**Última atualização:** 2025-10-10
**Versão:** 1.0.0

🎵 **DJ Zen Eyer - Keep the vibe alive!** ✨
