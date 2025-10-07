# 🎵 Configuração WordPress para DJ Zen Eyer

Este guia detalha todas as configurações necessárias no WordPress para seu site funcionar perfeitamente com gamificação, multilíngue e e-commerce.

---

## 📦 Plugins Necessários

### 1. **Simple JWT Login** (Autenticação)
- **Versão**: Mais recente
- **URL**: https://wordpress.org/plugins/simple-jwt-login/

#### Configurações:
1. Vá em `Settings` → `Simple JWT Login`
2. **General Settings**:
   - JWT Decryption Key: Gere uma chave segura (mínimo 32 caracteres)
   - JWT Time to Live: 604800 (7 dias)

3. **Authentication**:
   - ✅ Enable Authentication
   - ✅ Allow Authentication with Email
   - ✅ Allow Authentication with Username
   - Auth Codes: Deixe vazio para permitir todos

4. **Register**:
   - ✅ Allow Register
   - ✅ Require Password on Register
   - New User Profile: `subscriber`
   - Random Password Length: 12

5. **Login**:
   - ✅ Enable Login Endpoint
   - JWT Payload: Adicione:
     ```json
     {
       "id": "{{user_id}}",
       "email": "{{user_email}}",
       "display_name": "{{display_name}}",
       "roles": "{{user_roles}}"
     }
     ```

6. **Delete & Revoke**:
   - Configure conforme necessário

7. **CORS**:
   - Allow Origins: `https://seu-dominio.com` (adicione seu domínio do Bolt.new também)
   - ✅ Allow Credentials

---

### 2. **Polylang** (Multilíngue)
- **Versão**: Mais recente
- **URL**: https://wordpress.org/plugins/polylang/

#### Configurações:
1. Vá em `Languages` → `Settings`
2. **Languages**:
   - Add Languages:
     - 🇺🇸 English (en_US) - DEFAULT
     - 🇧🇷 Português (pt_BR)

3. **URL Modifications**:
   - The language is set from: `The directory name in URL`
   - URL format: ✅ `The language code is added to all URLs`
   - Hide URL language information for default language: ❌ (deixe desmarcado)

4. **Media**:
   - ✅ Synchronize media across languages

5. **Custom Post Types**:
   - ✅ Products (WooCommerce)
   - ✅ Posts
   - ✅ Pages

#### Criar Menu Multilíngue:
1. Vá em `Appearance` → `Menus`
2. Crie dois menus:
   - **Main Menu (English)**: Assign to "Primary Menu"
   - **Menu Principal (Português)**: Assign to "Primary Menu"

3. **Estrutura sugerida para ambos os menus**:
   ```
   Home / Início
   Music / Música
   Events / Eventos
   Shop / Loja
   Zen Tribe
   Work With Me / Trabalhe Comigo
   ```

4. Em cada item do menu, selecione o idioma correto no painel da direita

---

### 3. **GamiPress** (Gamificação)
- **Versão**: Mais recente
- **URL**: https://wordpress.org/plugins/gamipress/

#### Configurações Iniciais:
1. Vá em `GamiPress` → `Settings`
2. **General**:
   - ✅ Enable logging
   - Minimum Role to Administer GamiPress: `Administrator`

#### Criar Sistema de Pontos:
1. Vá em `GamiPress` → `Points Types`
2. Clique em `Add New`
3. Configure:
   - **Name**: `Zen Points` / `Pontos Zen`
   - **Slug**: `zen-points`
   - **Image**: Upload um ícone de estrela/zen
   - **Award Format**: `{points} XP`

#### Criar Achievements (Conquistas):
1. Vá em `GamiPress` → `Achievement Types`
2. Use os tipos padrão ou crie customizados:

**Conquistas Sugeridas**:

1. **First Beat** (Primeira Batida)
   - Type: `Achievement`
   - Points: 50 Zen Points
   - Trigger: User account registered

2. **Music Explorer** (Explorador Musical)
   - Type: `Achievement`
   - Points: 100 Zen Points
   - Trigger: Visit specific post X times (configure para 5 visitas na página Music)

3. **Social Butterfly** (Borboleta Social)
   - Type: `Achievement`
   - Points: 150 Zen Points
   - Trigger: Comment on a post (5 comentários)

4. **Event Attendee** (Participante de Evento)
   - Type: `Achievement`
   - Points: 200 Zen Points
   - Trigger: Purchase specific product (ingressos)

5. **Zen Master** (Mestre Zen)
   - Type: `Achievement`
   - Points: 500 Zen Points
   - Trigger: Reach a specific number of points (1000 Zen Points)

#### Criar Ranks (Níveis):
1. Vá em `GamiPress` → `Rank Types`
2. Crie `Zen Level`
3. Adicione ranks:
   - **Zen Novice**: 0-99 XP
   - **Zen Apprentice**: 100-299 XP
   - **Zen Voyager**: 300-599 XP
   - **Zen Master**: 600-999 XP
   - **Zen Legend**: 1000+ XP

#### Atividades que Dão Pontos:
Configure em `GamiPress` → `Points Awards`:
- Visit any post: 5 XP
- Comment on post: 10 XP
- Share on social media: 15 XP (use plugin de social share)
- Purchase product: 50 XP
- Daily login: 10 XP
- Complete profile: 25 XP

---

### 4. **WooCommerce** (E-commerce)
- **Versão**: Mais recente
- **URL**: https://wordpress.org/plugins/woocommerce/

#### Configurações Básicas:
1. Execute o Setup Wizard
2. **General**:
   - Store Address: Seu endereço
   - Currency: BRL (R$) ou USD ($)
   - ✅ Enable tax rates and calculations (se aplicável)

3. **Products**:
   - Shop Page: Selecione a página "Shop"
   - Weight Unit: kg
   - Dimensions Unit: cm

4. **Shipping**:
   - Configure suas zonas de envio
   - Para ingressos digitais: Crie um método "Digital Ticket" com custo R$ 0,00

5. **Payments**:
   - Configure MercadoPago, PayPal ou Stripe
   - ✅ Enable Cash on Delivery (para vendas presenciais)

#### Criar Produtos de Exemplo:
1. **VIP Event Ticket** (Ingresso VIP)
   - Type: Simple Product
   - Price: R$ 150,00
   - Virtual: ✅ Yes
   - Downloadable: ✅ Yes (se enviar PDF)
   - Categories: Events, Tickets

2. **Zen Tribe Monthly** (Assinatura Mensal)
   - Type: Simple Product
   - Price: R$ 29,90/month
   - Virtual: ✅ Yes
   - Categories: Membership

3. **DJ Zen Eyer T-Shirt**
   - Type: Variable Product
   - Attributes: Size (P, M, G, GG)
   - Price: R$ 79,90
   - Shipping: Required

---

### 5. **MailPoet** (Email Marketing)
- **Versão**: Mais recente
- **URL**: https://wordpress.org/plugins/mailpoet/

#### Configurações:
1. Vá em `MailPoet` → `Settings`
2. **Send With**: Configure seu SMTP ou use MailPoet Sending Service
3. **Subscribe on Checkout**: ✅ Enable
4. **Subscribe on Comment**: ✅ Enable

#### Criar Lista:
1. Vá em `MailPoet` → `Lists`
2. Crie: `Zen Tribe Newsletter`
3. Description: `Exclusive updates, new releases, and event access`

#### Criar Welcome Email:
1. Vá em `MailPoet` → `Emails` → `New Email`
2. Type: `Welcome Email`
3. Subject: `Welcome to the Zen Tribe! 🎵`
4. Template sugerido:
   ```
   Hi [subscriber:firstname],

   Welcome to the Zen Tribe! 🙏

   You're now part of an exclusive community of Brazilian Zouk lovers.

   Here's what you can expect:
   ✨ Early access to new tracks
   🎫 VIP event invitations
   🎁 Exclusive merchandise discounts

   Start exploring: [link]Visit My Site[/link]

   Keep the vibe alive,
   DJ Zen Eyer
   ```

---

## 🔧 Configuração do functions.php

Adicione este código ao `functions.php` do seu tema WordPress:

```php
<?php
// Habilitar CORS para requisições do frontend
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($served) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey');
        header('Access-Control-Allow-Credentials: true');
        return $served;
    });
});

// Endpoint customizado para menu multilíngue
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/menu', [
        'methods' => 'GET',
        'callback' => 'get_custom_menu',
        'permission_callback' => '__return_true'
    ]);
});

function get_custom_menu($request) {
    $lang = $request->get_param('lang') ?: 'en';

    // Se usar Polylang
    if (function_exists('pll_current_language')) {
        pll_set_language($lang);
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
                'url' => $item->url,
                'target' => $item->target ?: '_self'
            ];
        }
    }

    return $formatted_items;
}

// Endpoint para newsletter (MailPoet)
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/subscribe', [
        'methods' => 'POST',
        'callback' => 'subscribe_to_newsletter',
        'permission_callback' => '__return_true'
    ]);
});

function subscribe_to_newsletter($request) {
    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address', ['status' => 400]);
    }

    // MailPoet integration
    if (class_exists(\MailPoet\API\API::class)) {
        try {
            $mailpoet_api = \MailPoet\API\API::MP('v1');

            $subscriber = $mailpoet_api->addSubscriber([
                'email' => $email,
                'lists' => [1], // ID da sua lista "Zen Tribe Newsletter"
            ]);

            return [
                'success' => true,
                'message' => 'Successfully subscribed! Check your inbox.',
            ];
        } catch (\Exception $e) {
            return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
        }
    }

    return new WP_Error('mailpoet_not_found', 'MailPoet plugin not active', ['status' => 500]);
}

// Adicionar dados do GamiPress ao perfil do usuário via REST API
add_action('rest_api_init', function() {
    register_rest_field('user', 'gamipress_data', [
        'get_callback' => function($user) {
            if (!function_exists('gamipress_get_user_points')) {
                return null;
            }

            $user_id = $user['id'];

            return [
                'points' => gamipress_get_user_points($user_id, 'zen-points'),
                'rank' => gamipress_get_user_rank($user_id, 'zen-level'),
                'achievements' => gamipress_get_user_achievements($user_id),
            ];
        },
        'schema' => null,
    ]);
});

// Aumentar limite de caracteres para o Simple JWT Login payload
add_filter('simple_jwt_login_jwt_payload', function($payload, $user) {
    if (function_exists('gamipress_get_user_points')) {
        $payload['gamipress_points'] = gamipress_get_user_points($user->ID, 'zen-points');
        $payload['gamipress_rank'] = gamipress_get_user_rank($user->ID, 'zen-level');
    }
    return $payload;
}, 10, 2);
?>
```

---

## 🎨 Páginas Necessárias

Crie estas páginas no WordPress (em ambos os idiomas):

### English (en):
1. **Home** - `/`
2. **Music** - `/music`
3. **Events** - `/events`
4. **Shop** - `/shop` (WooCommerce)
5. **Zen Tribe** - `/tribe`
6. **Work With Me** - `/press-kit`
7. **My Account** - `/my-account` (WooCommerce)
8. **Cart** - `/cart` (WooCommerce)
9. **Checkout** - `/checkout` (WooCommerce)

### Português (pt):
1. **Início** - `/pt/`
2. **Música** - `/pt/music`
3. **Eventos** - `/pt/events`
4. **Loja** - `/pt/shop`
5. **Zen Tribe** - `/pt/tribe`
6. **Trabalhe Comigo** - `/pt/press-kit`
7. **Minha Conta** - `/pt/my-account`
8. **Carrinho** - `/pt/cart`
9. **Finalizar Compra** - `/pt/checkout`

---

## ✅ Checklist Final

- [ ] Simple JWT Login configurado com CORS
- [ ] Polylang ativo com EN e PT configurados
- [ ] GamiPress com Zen Points e achievements criados
- [ ] WooCommerce com produtos de teste
- [ ] MailPoet com lista "Zen Tribe Newsletter"
- [ ] Functions.php atualizado com endpoints customizados
- [ ] Menus criados em ambos os idiomas
- [ ] Todas as páginas criadas e traduzidas
- [ ] Testar login no frontend
- [ ] Testar troca de idiomas
- [ ] Testar inscrição newsletter
- [ ] Testar compra de produto

---

## 🐛 Troubleshooting

### Login não funciona:
1. Verifique se Simple JWT Login está ativo
2. Confirme que a chave JWT está configurada
3. Verifique CORS no console do navegador
4. Teste o endpoint: `https://djzeneyer.com/wp-json/simple-jwt-login/v1/auth`

### Menu não aparece:
1. Verifique se o menu está assigned to "Primary Menu"
2. Confirme que o endpoint `/djzeneyer/v1/menu` retorna dados
3. Teste: `https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en`

### GamiPress não rastreia:
1. Vá em `GamiPress` → `Settings` → `Logs` e verifique erros
2. Confirme que os triggers estão corretamente configurados
3. Teste manualmente em `Users` → Edit User → GamiPress

### Polylang não troca idiomas:
1. Verifique Settings → URL Modifications
2. Confirme que as páginas estão linkadas entre idiomas
3. Use o painel `Languages` → `Strings translation` para traduzir textos

---

## 📞 Suporte

Se precisar de ajuda, me avise! Posso ajustar qualquer parte do código frontend para se integrar melhor com suas configurações.

**DJ Zen Eyer** - Keep the vibe alive! 🎵✨
