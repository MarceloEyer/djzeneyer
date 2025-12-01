# 🔧 WordPress - Configuração Completa para DJ Zen Eyer

**Versão:** 6.0+  
**Ambiente:** Hostinger + LiteSpeed + Cloudflare  
**Arquitetura:** Headless CMS para React SPA

---

## 🎯 Objetivo

Configurar WordPress como backend headless otimizado para performance e segurança.

---

## 📦 Plugins Necessários

### **Essenciais (Já Instalados)**
```
✅ ZenEyer Auth Pro v2.0.0      - Autenticação JWT + OAuth
✅ Zen SEO Lite Pro v8.0.0      - SEO + Schema.org
✅ WooCommerce                  - E-commerce
✅ GamiPress                    - Gamificação
✅ Polylang                     - Multilíngue (EN/PT)
✅ MailPoet                     - Newsletter
✅ LiteSpeed Cache               - Cache + Otimização
```

### **Recomendados**
```
✅ Wordfence Security           - Firewall + Malware scan
✅ UpdraftPlus                  - Backup automático
✅ WP Mail SMTP                 - Email confiável
✅ Query Monitor (dev only)     - Debug de queries
```

---

## ⚙️ Configurações Gerais

### **1. Settings → General**

```
Site Title: DJ Zen Eyer
Tagline: Brazilian Zouk DJ & Music Producer
WordPress Address (URL): https://djzeneyer.com
Site Address (URL): https://djzeneyer.com
Email Address: booking@djzeneyer.com
Timezone: America/Sao_Paulo
Date Format: d/m/Y
Time Format: H:i
Week Starts On: Monday
Site Language: English
```

---

### **2. Settings → Reading**

```
Your homepage displays: A static page
Homepage: (selecionar página Home)
Posts page: (selecionar página Blog)
Blog pages show at most: 10 posts
Syndication feeds show: 10 items
Search Engine Visibility: ❌ OFF (permitir indexação)
```

---

### **3. Settings → Permalinks**

```
⚠️ CRÍTICO: Permalink Structure: Post name
Custom Structure: /%postname%/
```

**Motivo:** React Router precisa de URLs limpas. Após mudar, clicar em "Save Changes" para regenerar `.htaccess`.

---

### **4. Settings → Discussion**

```
❌ Allow people to submit comments: OFF
```

**Motivo:** Site headless não usa comentários nativos do WordPress.

---

## 🔌 Configuração de Plugins

### **ZenEyer Auth Pro**

```
WordPress Admin → Settings → ZenEyer Auth

Google Client ID: [Seu Client ID do Google Console]
Token Expiration: 7 days
```

**Obter Google Client ID:**
1. https://console.cloud.google.com/apis/credentials
2. Create Credentials → OAuth 2.0 Client ID
3. Authorized redirect URIs: `https://djzeneyer.com`

---

### **Zen SEO Lite Pro**

```
WordPress Admin → Zen SEO → Settings

Identity & Business:
  - Full Legal Name: Marcelo Eyer Fernandes
  - Booking Email: booking@djzeneyer.com
  - CNPJ: 44.063.765/0001-46
  - Birth Place: Rio de Janeiro, Brazil
  - Home Location: São Paulo, Brazil

Musical Authority:
  - ISNI Code: 0000 0005 2893 1015
  - MusicBrainz URL: [Seu perfil]
  - Wikidata URL: [Seu perfil]
  - Google KG ID: [Seu ID]

Digital Ecosystem:
  - Spotify: https://open.spotify.com/artist/...
  - Instagram: https://instagram.com/djzeneyer
  - YouTube: https://youtube.com/@djzeneyer
  - SoundCloud: https://soundcloud.com/djzeneyer
  - (adicionar todos os perfis)

Technical Settings:
  - Default OG Image: [Upload 1200x630px]
  - React Routes: (já preenchido automaticamente)
```

---

### **WooCommerce**

```
WooCommerce → Settings → General:
  - Store Address: São Paulo, SP, Brazil
  - Currency: Brazilian Real (R$)
  - Currency Position: Left with space

WooCommerce → Settings → Products:
  - Shop Page: (selecionar página Shop)
  - Add to cart behaviour: Redirect to cart
  - Enable AJAX add to cart: ON

WooCommerce → Settings → Shipping:
  - Shipping Zones: Brazil (configurar correios)

WooCommerce → Settings → Payments:
  - ✅ Stripe
  - ✅ PayPal
  - ✅ Pix (via plugin)

WooCommerce → Settings → Advanced → REST API:
  - Create API Key para React app
  - Permissions: Read/Write
```

---

### **GamiPress**

```
GamiPress → Settings:
  - Points Type: Zen Points
  - Singular: Zen Point
  - Plural: Zen Points

GamiPress → Points Types → Zen Points:
  - Image: [Upload ícone]
  - Decimals: 0

GamiPress → Achievements:
  - Criar badges:
    - Zen Novice (0-99 points)
    - Zen Apprentice (100-499 points)
    - Zen Voyager (500-1499 points)
    - Zen Master (1500-3999 points)
    - Zen Legend (4000+ points)

GamiPress → Requirements:
  - Login diário: +10 points
  - Comprar produto: +50 points
  - Compartilhar nas redes: +20 points
  - Download de track: +5 points
```

---

### **Polylang**

```
Polylang → Languages:
  - English (en) - Default
  - Portuguese (pt-BR)

Polylang → Settings:
  - URL modifications: Different languages in directories
  - Hide URL language for default: ON
  - Detect browser language: ON

Polylang → Strings translations:
  - Traduzir strings do tema
  - Traduzir menu items
```

**Estrutura de URLs:**
```
English:  https://djzeneyer.com/about
Portuguese: https://djzeneyer.com/pt/sobre
```

---

### **MailPoet**

```
MailPoet → Settings → Send With:
  - Method: MailPoet Sending Service (ou SMTP)

MailPoet → Lists:
  - Criar lista: "Newsletter Subscribers"

MailPoet → Forms:
  - Criar form de inscrição
  - Adicionar ao footer via widget
```

---

### **LiteSpeed Cache**

Ver arquivo `LITESPEED-CACHE.md` para configuração completa.

---

## 🗄️ Custom Post Types

### **Flyers (Eventos)**

```
WordPress Admin → Flyers → Add New

Campos:
  - Title: Nome do evento
  - Content: Descrição do evento
  - Featured Image: Flyer (1080x1080px)
  - Zen SEO Meta Box:
    - Event Date: YYYY-MM-DD
    - Event Location: Venue, City
    - Ticket URL: Link para compra
```

### **Remixes (Música)**

```
WordPress Admin → Remixes → Add New

Campos:
  - Title: Nome da track
  - Content: Descrição
  - Featured Image: Cover art (1000x1000px)
  - Custom Fields:
    - audio_url: Link Google Drive/Dropbox
    - soundcloud_url: Link SoundCloud
    - youtube_url: Link YouTube
  - Taxonomies:
    - Music Tags: RnB, Kizomba, Chill, etc
    - Music Type: Set, Track, Remix, EP
```

---

## 🔒 Segurança

### **1. wp-config.php**

Adicionar ao `wp-config.php`:

```php
// Security keys (gerar em https://api.wordpress.org/secret-key/1.1/salt/)
define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');

// JWT Secret (para ZenEyer Auth)
define('ZENEYER_JWT_SECRET', 'your-64-character-secret-here');

// Disable file editing
define('DISALLOW_FILE_EDIT', true);

// Force SSL
define('FORCE_SSL_ADMIN', true);

// Limit post revisions
define('WP_POST_REVISIONS', 5);

// Auto-save interval (5 minutes)
define('AUTOSAVE_INTERVAL', 300);

// Memory limit
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// Debug (apenas em dev)
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);
```

---

### **2. .htaccess**

Adicionar ao `.htaccess` (após regras do WordPress):

```apache
# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Block access to sensitive files
<FilesMatch "^(wp-config\.php|\.htaccess|readme\.html|license\.txt)">
    Order allow,deny
    Deny from all
</FilesMatch>

# Disable directory browsing
Options -Indexes

# Protect wp-includes
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^wp-admin/includes/ - [F,L]
    RewriteRule !^wp-includes/ - [S=3]
    RewriteRule ^wp-includes/[^/]+\.php$ - [F,L]
    RewriteRule ^wp-includes/js/tinymce/langs/.+\.php - [F,L]
    RewriteRule ^wp-includes/theme-compat/ - [F,L]
</IfModule>
```

---

### **3. Wordfence Security**

```
Wordfence → All Options:

Firewall:
  - Protection Level: Extended Protection
  - Rate Limiting: ON (10 requests/minute)
  - Block fake Google crawlers: ON

Scan:
  - Scan Schedule: Daily at 3:00 AM
  - Email alerts: ON

Login Security:
  - Enable 2FA: ON (para admin)
  - Limit login attempts: 5 attempts, 20 min lockout
  - Block admin username: ON
```

---

## 📊 Performance

### **1. Database Optimization**

```bash
# Via SSH (mensal)
wp db optimize

# Via plugin
LiteSpeed Cache → Database → Optimize Tables
```

### **2. Image Optimization**

```
Usar Vite para otimizar imagens antes do upload
Formato: WebP
Tamanho máximo: 1920px width
Compressão: 80%
```

### **3. Cron Jobs**

```
Hostinger → Advanced → Cron Jobs:

# Backup diário (3:00 AM)
0 3 * * * cd /home/u790739895/domains/djzeneyer.com/public_html && wp db export backups/db-$(date +\%Y\%m\%d).sql

# Limpar transients (semanal, domingo 4:00 AM)
0 4 * * 0 cd /home/u790739895/domains/djzeneyer.com/public_html && wp transient delete --expired

# Otimizar database (mensal, dia 1, 5:00 AM)
0 5 1 * * cd /home/u790739895/domains/djzeneyer.com/public_html && wp db optimize
```

---

## 🔄 Backup

### **UpdraftPlus**

```
UpdraftPlus → Settings:

Backup Schedule:
  - Files: Weekly (Sunday 2:00 AM)
  - Database: Daily (3:00 AM)

Remote Storage:
  - Google Drive (recomendado)
  - Ou Dropbox

Retention:
  - Keep 4 weekly backups
  - Keep 30 daily database backups

Include in backup:
  - ✅ Plugins
  - ✅ Themes
  - ✅ Uploads
  - ✅ Database
  - ❌ wp-content/cache
```

---

## 📧 Email

### **WP Mail SMTP**

```
WP Mail SMTP → Settings:

From Email: noreply@djzeneyer.com
From Name: DJ Zen Eyer

Mailer: Gmail (ou SMTP)

Gmail:
  - Client ID: [Google Console]
  - Client Secret: [Google Console]
  - Authorized Redirect URI: https://djzeneyer.com/wp-admin/...

Test Email: Enviar para booking@djzeneyer.com
```

---

## 🐛 Troubleshooting

### **Problema: White Screen of Death**

```bash
# Via SSH
cd /home/u790739895/domains/djzeneyer.com/public_html
wp plugin deactivate --all
wp theme activate twentytwentyfour
wp plugin activate zentheme
```

### **Problema: Database Error**

```bash
# Reparar database
wp db repair
wp db optimize
```

### **Problema: Permalinks não funcionam**

```bash
# Regenerar .htaccess
wp rewrite flush --hard
```

### **Problema: Plugin quebrou o site**

```bash
# Desativar via SSH
wp plugin deactivate nome-do-plugin
```

---

## 📝 Checklist de Configuração

- [ ] Permalinks em "Post name"
- [ ] Timezone configurado
- [ ] ZenEyer Auth configurado (Google Client ID)
- [ ] Zen SEO configurado (dados completos)
- [ ] WooCommerce configurado (pagamentos)
- [ ] GamiPress configurado (badges)
- [ ] Polylang configurado (EN/PT)
- [ ] MailPoet configurado (newsletter)
- [ ] LiteSpeed Cache configurado
- [ ] Wordfence configurado
- [ ] UpdraftPlus configurado (backup)
- [ ] WP Mail SMTP configurado
- [ ] wp-config.php otimizado
- [ ] .htaccess com security headers
- [ ] Cron jobs configurados
- [ ] Custom Post Types testados
- [ ] REST API testada
- [ ] Performance verificada

---

## 🚀 Próximos Passos

1. **Monitorar Performance**
   - Google PageSpeed Insights
   - GTmetrix
   - Pingdom

2. **Monitorar Segurança**
   - Wordfence scan diário
   - Verificar logs de login
   - Atualizar plugins semanalmente

3. **Backup**
   - Verificar backups mensalmente
   - Testar restore em staging

---

## 📞 Suporte

**Problemas com WordPress?**
- Documentação: https://wordpress.org/documentation/
- Suporte Hostinger: https://www.hostinger.com.br/contato
- WP-CLI: https://wp-cli.org/

---

**Última atualização:** 2025-11-27  
**Testado em:** WordPress 6.4 + Hostinger Business
