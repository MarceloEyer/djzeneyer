# 🔧 Critical Fixes - djzeneyer.com

Correções essenciais para fazer o site funcionar 100%.

---

## 1️⃣ LOGIN / CADASTRO (Simple-JWT-Login)

### 1.1. Configurar Simple JWT Login

**Arquivo:** WordPress Admin → Settings → Simple JWT Login

**Configuração:**

```
General Settings:
- JWT Decryption Key: gere_uma_chave_segura_aqui_min32chars
- JWT Time to Live: 604800

Authentication:
✅ Allow Authentication
✅ Allow Authentication with Email

Login:
✅ Enable Login Endpoint
JWT Payload:
{
  "id": "{{user_id}}",
  "email": "{{user_email}}",
  "display_name": "{{display_name}}",
  "roles": "{{user_roles}}"
}

Register:
✅ Allow Register
✅ Require Password on Register
New User Profile: subscriber

CORS:
Allow Origins: https://djzeneyer.com
✅ Allow Credentials
```

**Razão:** Permite autenticação via JWT no frontend React.

---

### 1.2. Adicionar CORS Headers

**Arquivo:** `wp-content/themes/seu-tema/functions.php`

**Código:**

```php
<?php
// CORS para React frontend
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
?>
```

**Razão:** Permite requisições do frontend para o backend WordPress.

---

### 1.3. Login Google OAuth (Gratuito)

**Arquivo:** Google Cloud Console + `functions.php`

**Passo 1:** Criar projeto no Google Cloud Console
1. Acesse: https://console.cloud.google.com/
2. Criar novo projeto: "DJ Zen Eyer Site"
3. Vá em "APIs & Services" → "Credentials"
4. Criar "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Authorized redirect URIs: `https://djzeneyer.com/oauth/google/callback`
7. Copie Client ID e Client Secret

**Passo 2:** Adicionar ao functions.php

**Código:**

```php
<?php
// Google OAuth Login
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/auth/google', [
        'methods' => 'POST',
        'callback' => 'handle_google_login',
        'permission_callback' => '__return_true'
    ]);
});

function handle_google_login($request) {
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

    // Gerar JWT usando Simple JWT Login
    if (function_exists('simple_jwt_login_generate_jwt')) {
        $jwt = simple_jwt_login_generate_jwt($user);
        return ['jwt' => $jwt, 'user' => [
            'id' => $user->ID,
            'email' => $user->user_email,
            'name' => $user->display_name
        ]];
    }

    return new WP_Error('jwt_failed', 'Failed to generate JWT', ['status' => 500]);
}
?>
```

**Passo 3:** Adicionar no `.env` do frontend

```
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui.apps.googleusercontent.com
```

**Razão:** Login social aumenta conversão e é gratuito.

---

## 2️⃣ NEWSLETTER (MailPoet)

### 2.1. Endpoint Newsletter

**Arquivo:** `functions.php`

**Código:**

```php
<?php
// Newsletter subscription endpoint
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/subscribe', [
        'methods' => 'POST',
        'callback' => 'mailpoet_subscribe_user',
        'permission_callback' => '__return_true'
    ]);
});

function mailpoet_subscribe_user($request) {
    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', ['status' => 400]);
    }

    // MailPoet integration
    if (!class_exists(\MailPoet\API\API::class)) {
        return new WP_Error('mailpoet_inactive', 'MailPoet is not active', ['status' => 500]);
    }

    try {
        $mailpoet_api = \MailPoet\API\API::MP('v1');

        // Get list ID (use your actual list ID from MailPoet → Lists)
        $lists = $mailpoet_api->getLists();
        $list_id = !empty($lists) ? $lists[0]['id'] : 1;

        $subscriber = $mailpoet_api->addSubscriber([
            'email' => $email,
            'status' => 'subscribed'
        ], [$list_id]);

        return [
            'success' => true,
            'message' => 'Successfully subscribed! Check your inbox.'
        ];
    } catch (\Exception $e) {
        // Subscriber already exists
        if (strpos($e->getMessage(), 'already exists') !== false) {
            return [
                'success' => true,
                'message' => 'You are already subscribed!'
            ];
        }

        return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
    }
}
?>
```

**Razão:** Conecta formulário do footer ao MailPoet sem plugin adicional.

---

### 2.2. Criar Lista no MailPoet

**Arquivo:** WordPress Admin → MailPoet → Lists

**Ação:**
1. Clique em "New List"
2. Nome: "Zen Tribe Newsletter"
3. Description: "Main newsletter list"
4. Salvar

**Razão:** MailPoet precisa de pelo menos 1 lista ativa.

---

### 2.3. Configurar Welcome Email

**Arquivo:** WordPress Admin → MailPoet → Emails

**Ação:**
1. New Email → Welcome Email
2. Trigger: "When someone subscribes to list 'Zen Tribe Newsletter'"
3. Subject: `Welcome to the Zen Tribe! 🎵`
4. Template:

```
Hi [subscriber:firstname|default:Friend],

Welcome to the Zen Tribe! 🙏

You're now part of an exclusive community of Brazilian Zouk lovers.

Here's what you can expect:
✨ Early access to new tracks
🎫 VIP event invitations
🎁 Exclusive merchandise discounts

Keep the vibe alive,
DJ Zen Eyer

[link:unsubscribe]Unsubscribe[/link]
```

**Razão:** Engaja novos inscritos imediatamente.

---

## 3️⃣ LOJA (WooCommerce)

### 3.1. Configurar WooCommerce Básico

**Arquivo:** WordPress Admin → WooCommerce → Settings

**Configuração:**

```
General:
- Currency: Brazilian Real (R$)
- Store Address: Seu endereço

Products:
- Shop page: /shop
- Add to cart behaviour: ✅ Redirect to cart page

Shipping:
- Add shipping zone: Brasil
- Add method: Free shipping (para produtos digitais)

Payments:
✅ Direct bank transfer (BACS)
✅ Cash on delivery
```

**Razão:** Permite vendas sem gateway pago inicialmente.

---

### 3.2. Criar Produto de Exemplo

**Arquivo:** WordPress Admin → Products → Add New

**Configuração:**

```
Product name: Ingresso reZENha - VIP Access
Regular price: R$ 150,00
Sale price: R$ 120,00

Product data:
- Simple product
✅ Virtual (não precisa envio)
✅ Downloadable (opcional: adicionar PDF do ingresso)

Description:
"Acesso VIP ao próximo evento reZENha com DJ Zen Eyer.
Inclui: entrada prioritária, área VIP e meet & greet."

Categories: Events, Tickets
```

**Razão:** Produto de teste funcional para checkout.

---

### 3.3. Corrigir Checkout para Polylang

**Arquivo:** `functions.php`

**Código:**

```php
<?php
// Fix WooCommerce pages for Polylang
add_filter('woocommerce_get_checkout_url', function($url) {
    if (function_exists('pll_current_language')) {
        $lang = pll_current_language();
        if ($lang === 'pt') {
            $url = home_url('/pt/checkout/');
        }
    }
    return $url;
});

add_filter('woocommerce_get_cart_url', function($url) {
    if (function_exists('pll_current_language')) {
        $lang = pll_current_language();
        if ($lang === 'pt') {
            $url = home_url('/pt/cart/');
        }
    }
    return $url;
});

// Add REST API support for WooCommerce
add_filter('woocommerce_rest_is_request_to_rest_api', '__return_true');
?>
```

**Razão:** WooCommerce funciona corretamente em ambos os idiomas.

---

### 3.4. Habilitar REST API WooCommerce

**Arquivo:** WordPress Admin → WooCommerce → Settings → Advanced → REST API

**Ação:**
1. Clique em "Add Key"
2. Description: "Frontend React App"
3. User: Seu admin user
4. Permissions: Read/Write
5. Generate API Key
6. Copie Consumer Key e Consumer Secret

**Adicionar ao `.env`:**

```
VITE_WC_CONSUMER_KEY=ck_xxxxxxxxxxxxx
VITE_WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxx
```

**Razão:** Frontend pode buscar produtos e criar orders via API.

---

## 4️⃣ CACHE / PERFORMANCE (LiteSpeed)

### 4.1. Configuração Básica LiteSpeed

**Arquivo:** WordPress Admin → LiteSpeed Cache → Settings

**Configuração:**

```
General:
✅ Enable LiteSpeed Cache

Cache:
✅ Cache Logged-in Users: OFF
✅ Cache REST API: OFF
✅ Cache Mobile: ON

Excludes:
Add to "Do Not Cache URIs":
/cart/*
/checkout/*
/my-account/*
/wp-admin/*
/wp-login.php

Add to "Do Not Cache Query Strings":
jwt
token
oauth

Add to "Do Not Cache Cookies":
woocommerce_cart_hash
woocommerce_items_in_cart
wp_woocommerce_session_
```

**Razão:** Evita cache em páginas dinâmicas (login, checkout, carrinho).

---

### 4.2. Excluir JS Crítico do Cache

**Arquivo:** LiteSpeed Cache → Settings → Tuning

**Configuração:**

```
JS Excludes:
/wp-content/plugins/woocommerce/assets/js/*
/wp-content/plugins/simple-jwt-login/*
google-analytics.com
googletagmanager.com

CSS Excludes:
/wp-content/plugins/woocommerce/assets/css/*
```

**Razão:** Scripts de checkout e autenticação sempre atualizados.

---

### 4.3. Purge Cache Automático

**Arquivo:** `functions.php`

**Código:**

```php
<?php
// Purge LiteSpeed cache on critical actions
if (class_exists('LiteSpeed\Purge')) {
    // Purge on new product
    add_action('woocommerce_new_product', function() {
        do_action('litespeed_purge_all');
    });

    // Purge on order
    add_action('woocommerce_thankyou', function() {
        do_action('litespeed_purge_all');
    });

    // Purge on login
    add_action('wp_login', function() {
        do_action('litespeed_purge_all');
    });
}
?>
```

**Razão:** Cache atualiza automaticamente após mudanças importantes.

---

### 4.4. Otimização Básica

**Arquivo:** LiteSpeed Cache → Settings → Optimization

**Configuração:**

```
CSS Settings:
✅ CSS Minify
✅ CSS Combine
✅ Generate UCSS (melhor performance)

JS Settings:
✅ JS Minify
✅ JS Combine: OFF (pode quebrar WooCommerce)
✅ Load JS Deferred

Image Optimization:
✅ Image Lazy Load
✅ Responsive Placeholder

CDN:
Use Quic.cloud (gratuito do LiteSpeed)
```

**Razão:** Melhora velocidade sem quebrar funcionalidades.

---

## 5️⃣ INTEGRAÇÃO FRONTEND-BACKEND

### 5.1. Atualizar arquivo `.env`

**Arquivo:** `.env` (raiz do projeto React)

**Código:**

```env
# WordPress
VITE_WP_SITE_URL=https://djzeneyer.com
VITE_WP_REST_URL=https://djzeneyer.com/wp-json/

# WooCommerce
VITE_WC_CONSUMER_KEY=ck_xxxxxxxxxxxxx
VITE_WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxx

# Google OAuth
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# Supabase (se usar)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxxxxxxxxxxxx
```

**Razão:** Frontend sabe onde buscar dados do backend.

---

### 5.2. Testar Endpoints

**Arquivo:** Terminal ou Postman

**Teste 1 - Menu:**
```bash
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en
```

**Teste 2 - Newsletter:**
```bash
curl -X POST https://djzeneyer.com/wp-json/djzeneyer/v1/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Teste 3 - Login:**
```bash
curl -X POST https://djzeneyer.com/wp-json/simple-jwt-login/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@djzeneyer.com","password":"sua_senha"}'
```

**Razão:** Verifica se backend responde corretamente.

---

## 6️⃣ CHECKLIST FINAL

### Backend (WordPress)

- [ ] Simple JWT Login configurado com JWT Key
- [ ] CORS headers adicionados ao functions.php
- [ ] MailPoet ativo com 1 lista criada
- [ ] WooCommerce configurado com método de pagamento
- [ ] 1 produto de teste criado (Ingresso reZENha)
- [ ] LiteSpeed Cache excluindo /cart/, /checkout/, /my-account/
- [ ] Polylang com EN e PT configurados
- [ ] Menus criados em ambos idiomas
- [ ] REST API WooCommerce habilitada com chaves

### Frontend (React)

- [ ] Arquivo `.env` preenchido com URLs corretas
- [ ] Build executado sem erros (`npm run build`)
- [ ] Deploy feito com arquivos do /dist/

### Testes

- [ ] Login funciona e retorna JWT
- [ ] Newsletter inscreve no MailPoet
- [ ] Produto aparece na loja
- [ ] Carrinho → Checkout → Pedido funciona
- [ ] Troca de idioma PT ↔ EN funciona
- [ ] Site carrega em < 3 segundos (PageSpeed)

---

## 🚨 TROUBLESHOOTING RÁPIDO

### Problema: "Login não funciona"
**Solução:**
1. Verificar JWT Key no Simple JWT Login
2. Testar endpoint: `/wp-json/simple-jwt-login/v1/auth`
3. Verificar console do navegador para erros CORS

### Problema: "Newsletter não inscreve"
**Solução:**
1. Verificar se MailPoet está ativo
2. Verificar se lista existe em MailPoet → Lists
3. Testar endpoint: `/wp-json/djzeneyer/v1/subscribe`

### Problema: "Checkout quebrado"
**Solução:**
1. Desativar LiteSpeed Cache temporariamente
2. Verificar se páginas Cart/Checkout existem
3. WooCommerce → Status → Tools → "Clear sessions"

### Problema: "Site lento depois do cache"
**Solução:**
1. LiteSpeed → Toolbox → Purge All
2. Desabilitar "JS Combine"
3. Verificar se CDN está ativo

---

## ✅ RESULTADO ESPERADO

Após aplicar todos os fixes:

✅ Login/cadastro funcional via JWT
✅ Login Google OAuth configurado
✅ Newsletter conectada ao MailPoet
✅ Loja funcional com checkout básico
✅ Site rápido (< 3s load time)
✅ Compatível com Polylang (PT/EN)
✅ Cache otimizado sem quebrar dinâmicas

---

**Tempo estimado de implementação:** 2-3 horas
**Custo:** R$ 0,00 (tudo gratuito)
**Prioridade:** CRÍTICA - Implementar AGORA

🎵 **DJ Zen Eyer - Keep the vibe alive!** ✨
