# 🎧 DJ ZEN EYER - SETUP COMPLETO

> **Arquitetura:** WordPress Headless + React SPA com SSG (Static Site Generation)
> **Stack:** LiteSpeed + Cloudflare + WooCommerce + GamiPress + Vite 5 + React 18

---

## 📋 ÍNDICE

1. [Pré-Requisitos](#1-pré-requisitos)
2. [Configuração do Servidor (WordPress)](#2-configuração-do-servidor-wordpress)
3. [Configuração do Frontend (React)](#3-configuração-do-frontend-react)
4. [Plugins WordPress Necessários](#4-plugins-wordpress-necessários)
5. [Deploy em Produção](#5-deploy-em-produção)
6. [Configuração do Cloudflare](#6-configuração-do-cloudflare)
7. [Troubleshooting](#7-troubleshooting)
8. [Checklist Final](#8-checklist-final)

---

## 1. PRÉ-REQUISITOS

### Servidor
- **LiteSpeed Server** (Apache compatível com fallback)
- **PHP 8.0+** com extensões:
  - `php-curl`, `php-mbstring`, `php-xml`, `php-zip`, `php-gd`, `php-imagick`
- **MySQL 5.7+** ou **MariaDB 10.3+**
- **SSL Certificado** (via Cloudflare ou Let's Encrypt)
- **Node.js 18+** (para build do React localmente)

### Domínio
- **Primário:** `djzeneyer.com`
- **Alternativas:** `www.djzeneyer.com` (redirect para não-www)
- **Subdomínio (opcional):** `app.djzeneyer.com` (para frontend separado)

---

## 2. CONFIGURAÇÃO DO SERVIDOR (WORDPRESS)

### 2.1 Instalar WordPress

```bash
# Download WordPress
wget https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
mv wordpress/* /var/www/html/

# Configurar permissões
chown -R www-data:www-data /var/www/html/
chmod -R 755 /var/www/html/
```

### 2.2 Configurar wp-config.php

Edite `/var/www/html/wp-config.php` e adicione:

```php
<?php
// Database
define('DB_NAME', 'seu_banco_de_dados');
define('DB_USER', 'seu_usuario');
define('DB_PASSWORD', 'sua_senha');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

// Security Keys (gere em: https://api.wordpress.org/secret-key/1.1/salt/)
define('AUTH_KEY',         'cole-sua-chave-aqui');
define('SECURE_AUTH_KEY',  'cole-sua-chave-aqui');
define('LOGGED_IN_KEY',    'cole-sua-chave-aqui');
define('NONCE_KEY',        'cole-sua-chave-aqui');
// ... (complete com as 8 chaves)

// WordPress URL (CRÍTICO para Headless)
define('WP_HOME', 'https://djzeneyer.com');
define('WP_SITEURL', 'https://djzeneyer.com');

// Debug (desative em produção)
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// Memory Limit
define('WP_MEMORY_LIMIT', '256M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// HTTPS
define('FORCE_SSL_ADMIN', true);
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

// Disable File Editing
define('DISALLOW_FILE_EDIT', true);

// Auto-updates
define('WP_AUTO_UPDATE_CORE', 'minor');
```

### 2.3 Upload do Tema Headless

```bash
# Copie os arquivos PHP do projeto
cd /var/www/html/wp-content/themes/
mkdir djzeneyer-headless
cd djzeneyer-headless

# Upload dos arquivos necessários:
# - functions.php
# - style.css
# - index.php
# - /inc/ (toda a pasta)
```

**IMPORTANTE:** O tema WordPress **não renderiza** o frontend. Ele apenas:
- Registra APIs REST customizadas
- Configura CORS
- Gerencia CPTs (Custom Post Types)
- Serve o HTML estático do React (via index.php)

### 2.4 Ativar o Tema

No **WordPress Admin** (`/wp-admin`):
1. Vá em **Aparência > Temas**
2. Ative o tema **DJ Zen Eyer Headless**

---

## 3. CONFIGURAÇÃO DO FRONTEND (REACT)

### 3.1 Instalar Dependências

```bash
cd /caminho/para/o/projeto
npm install
```

### 3.2 Configurar Variáveis de Ambiente

Crie um arquivo `.env.production`:

```env
VITE_WP_URL=https://djzeneyer.com
VITE_API_URL=https://djzeneyer.com/wp-json/djzeneyer/v1
VITE_WC_API_URL=https://djzeneyer.com/wp-json/wc/v3
VITE_GOOGLE_CLIENT_ID=seu-google-oauth-client-id
```

### 3.3 Build do Projeto

```bash
# Build de produção com SSG
npm run build

# Isso gera:
# - /dist/ (pasta completa com HTML estático)
# - 16 arquivos index.html (8 EN + 8 PT)
# - Assets otimizados em /dist/assets/
```

### 3.4 Deploy do Frontend

**Opção 1: Raiz do Servidor (Recomendado)**

```bash
# Suba a pasta /dist para o servidor
rsync -avz dist/ usuario@servidor:/var/www/html/

# Ou via FTP/SFTP:
# Suba todo o conteúdo de /dist/ para o diretório raiz do site
```

**Opção 2: Subdomínio Separado**

```bash
# Para app.djzeneyer.com
rsync -avz dist/ usuario@servidor:/var/www/app/
```

**ATENÇÃO:** O `.htaccess` já está configurado para redirecionar rotas React corretamente!

---

## 4. PLUGINS WORDPRESS NECESSÁRIOS

### 4.1 Plugins Obrigatórios

Instale via **Plugins > Adicionar Novo** ou WP-CLI:

```bash
wp plugin install woocommerce --activate
wp plugin install gamipress --activate
wp plugin install polylang --activate
wp plugin install mailpoet --activate
wp plugin install litespeed-cache --activate
```

| Plugin | Versão Mínima | Função |
|--------|---------------|--------|
| **WooCommerce** | 8.0+ | E-commerce (produtos, carrinho, checkout) |
| **GamiPress** | 3.0+ | Gamificação (pontos, ranks, conquistas) |
| **Polylang** | 3.5+ | Multilíngue (EN/PT) |
| **MailPoet** | 4.0+ | Newsletter |
| **LiteSpeed Cache** | 6.0+ | Cache do servidor |

### 4.2 Plugins Recomendados

```bash
wp plugin install wordfence --activate          # Segurança
wp plugin install wp-mail-smtp --activate       # Email transacional
wp plugin install rank-math --activate          # SEO (opcional, já temos seo.php)
```

### 4.3 Configurações dos Plugins

#### WooCommerce
1. **Moeda:** BRL (R$) ou USD ($) dependendo do público
2. **Pagamento:** Integre Stripe/PayPal/PagSeguro
3. **Envio:** Configure zonas e taxas
4. **REST API:** Habilite em `WooCommerce > Configurações > Avançado > REST API`
   - Crie chave de API (Consumer Key + Consumer Secret)
   - Salve em `.env.production` (se necessário)

#### GamiPress
1. **Tipos de Pontos:** Crie "Zen Points"
2. **Ranks:** Configure níveis (Novice, Intermediate, Expert, Master)
3. **Conquistas:** Crie badges (First Download, Event Attendee, etc.)
4. **Triggers:** Conecte com ações WooCommerce (compra = pontos)

#### Polylang
1. **Idiomas:** Adicione **Inglês (EN)** e **Português (PT-BR)**
2. **Idioma Padrão:** Inglês
3. **Estrutura de URL:** Prefixo `/pt` para português
4. **Traduções:**
   - Traduza **menus** (Produtos, Eventos, etc.)
   - Traduza **páginas** criadas no WP (se houver)
   - Traduza **produtos** WooCommerce

#### LiteSpeed Cache
1. **Ativar Cache:** Sim
2. **Excluir URLs:**
   - `/checkout`
   - `/cart`
   - `/my-account`
   - `/minha-conta`
3. **Purge Rules:**
   - Limpar ao atualizar produto
   - Limpar ao publicar post
4. **CDN:** Configure Cloudflare (ver seção 6)

---

## 5. DEPLOY EM PRODUÇÃO

### 5.1 Checklist Pré-Deploy

- [ ] WordPress instalado e configurado
- [ ] Todos os plugins ativados
- [ ] Tema ativado
- [ ] Produtos criados no WooCommerce
- [ ] Menus configurados (EN + PT)
- [ ] Frontend buildado (`npm run build`)
- [ ] `.htaccess` no servidor
- [ ] SSL ativado (HTTPS)

### 5.2 Upload do Frontend

```bash
# Via SSH
scp -r dist/* usuario@servidor:/var/www/html/

# Ou via SFTP (FileZilla, Cyberduck, etc.)
# Conecte em: djzeneyer.com:22
# Upload: /dist/* -> /public_html/ (ou /var/www/html/)
```

### 5.3 Verificar Permissões

```bash
# No servidor
cd /var/www/html/
chown -R www-data:www-data .
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 600 wp-config.php
```

### 5.4 Configurar .htaccess

O arquivo `.htaccess` já está criado no projeto. **Garanta que está no root:**

```bash
# Deve estar em:
/var/www/html/.htaccess
```

**Teste se mod_rewrite está ativo:**

```bash
apache2ctl -M | grep rewrite
# Deve retornar: rewrite_module (shared)
```

---

## 6. CONFIGURAÇÃO DO CLOUDFLARE

### 6.1 Adicionar Site ao Cloudflare

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Add Site** > Digite `djzeneyer.com`
3. Escolha plano **Free** (ou Pro se quiser WAF avançado)
4. **Update Nameservers** no seu registrador de domínio

### 6.2 DNS Records

Configure os seguintes registros:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | @ | IP_DO_SERVIDOR | ✅ Proxied |
| CNAME | www | djzeneyer.com | ✅ Proxied |
| CNAME | app | djzeneyer.com | ✅ Proxied (se usar subdomínio) |

### 6.3 SSL/TLS

1. **SSL/TLS > Overview**
   - Modo: **Full (strict)**
2. **Edge Certificates**
   - ✅ Always Use HTTPS
   - ✅ Automatic HTTPS Rewrites
   - ✅ Minimum TLS Version: 1.2

### 6.4 Page Rules (Otimização)

Crie as seguintes regras (ordem importa):

#### Regra 1: API Bypass
- **URL:** `djzeneyer.com/wp-json/*`
- **Settings:**
  - Cache Level: Bypass
  - Disable Apps

#### Regra 2: Admin Bypass
- **URL:** `djzeneyer.com/wp-admin/*`
- **Settings:**
  - Cache Level: Bypass
  - Disable Security

#### Regra 3: Checkout/Cart
- **URL:** `djzeneyer.com/*checkout*`
- **Settings:**
  - Cache Level: Bypass

#### Regra 4: Static Assets
- **URL:** `djzeneyer.com/assets/*`
- **Settings:**
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 year

#### Regra 5: Homepage
- **URL:** `djzeneyer.com/`
- **Settings:**
  - Cache Level: Cache Everything
  - Edge Cache TTL: 4 hours

### 6.5 Speed Optimizations

**Speed > Optimization:**
- ✅ Auto Minify: JavaScript, CSS, HTML
- ✅ Brotli Compression
- ✅ Early Hints
- ✅ Rocket Loader: **OFF** (quebra React)
- ✅ Mirage: ON (lazy load images)

**Caching:**
- Browser Cache TTL: **4 hours**
- Always Online: **ON**

---

## 7. TROUBLESHOOTING

### 7.1 Erro 404 nas Rotas React

**Sintoma:** `/about`, `/shop` retornam 404.

**Solução:**

```bash
# WordPress Admin > Configurações > Links Permanentes
# Escolha: "Nome do Post"
# Salve para gerar .htaccess correto

# Se persistir, verifique mod_rewrite:
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 7.2 CORS Error no Console

**Sintoma:** `Access-Control-Allow-Origin missing`

**Solução:**

1. Verifique `/inc/setup.php`:
   ```php
   function djz_allowed_origins(): array {
       return [
           'https://djzeneyer.com',
           'https://www.djzeneyer.com'
       ];
   }
   ```

2. Teste no terminal:
   ```bash
   curl -H "Origin: https://djzeneyer.com" \
        -I https://djzeneyer.com/wp-json/djzeneyer/v1/menu
   ```

   Deve retornar:
   ```
   Access-Control-Allow-Origin: https://djzeneyer.com
   ```

### 7.3 Produtos não Aparecem no Frontend

**Checklist:**

- [ ] Produtos publicados no WooCommerce?
- [ ] API REST habilitada? (`/wp-json/wc/v3/products`)
- [ ] Polylang configurado? (tradução de produtos)
- [ ] Endpoint funciona? Teste:
  ```bash
  curl https://djzeneyer.com/wp-json/djzeneyer/v1/products?lang=pt
  ```

### 7.4 LiteSpeed Cache Não Funciona

**Diagnóstico:**

```bash
# Verifique header X-LiteSpeed-Cache
curl -I https://djzeneyer.com/
```

Deve retornar:
```
X-LiteSpeed-Cache: hit
```

**Se não:**

1. **LiteSpeed Cache Plugin:**
   - Cache > Settings > Enable Cache: **ON**
   - Purge > Purge All on Save: **ON**

2. **.htaccess:**
   - Verifique se `<IfModule LiteSpeed>` está presente

### 7.5 Traduções Não Funcionam

**Checklist:**

- [ ] Polylang ativado?
- [ ] Idiomas configurados (EN + PT)?
- [ ] Produtos traduzidos manualmente?
- [ ] Menu traduzido?
- [ ] Frontend passa `?lang=pt` na API?

**Teste:**

```javascript
// No console do navegador
fetch('https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=pt')
  .then(r => r.json())
  .then(console.log);
```

---

## 8. CHECKLIST FINAL

### ✅ WordPress

- [ ] WordPress instalado e atualizado
- [ ] SSL configurado (HTTPS)
- [ ] Tema DJ Zen Eyer ativado
- [ ] Plugins instalados e configurados
- [ ] Produtos criados (EN + PT)
- [ ] Menus configurados
- [ ] GamiPress com pontos/ranks/conquistas
- [ ] REST API testada e funcionando
- [ ] CORS configurado corretamente

### ✅ Frontend

- [ ] `npm run build` executado com sucesso
- [ ] 16 arquivos HTML gerados em `/dist`
- [ ] Meta tags verificadas (View Source)
- [ ] Imagens otimizadas (WebP, dimensões explícitas)
- [ ] Traduções completas (EN + PT)
- [ ] Bundle size < 200 KB
- [ ] Lazy loading funcionando

### ✅ Servidor

- [ ] `.htaccess` configurado
- [ ] Permissões corretas (755/644)
- [ ] PHP 8.0+ ativo
- [ ] mod_rewrite habilitado
- [ ] LiteSpeed Cache ativo
- [ ] Backups configurados

### ✅ Cloudflare

- [ ] DNS apontando para servidor
- [ ] SSL em modo **Full (strict)**
- [ ] Page Rules configuradas
- [ ] Cache funcionando (X-LiteSpeed-Cache: hit)
- [ ] Auto Minify ativado
- [ ] Rocket Loader desabilitado

### ✅ SEO & Performance

- [ ] Sitemap acessível (`/sitemap.xml`)
- [ ] robots.txt configurado
- [ ] Schema.org presente (View Source)
- [ ] Lighthouse Score > 90
- [ ] LCP < 1.8s
- [ ] CLS < 0.05
- [ ] Google Search Console configurado

### ✅ Funcionalidades

- [ ] Navegação bilíngue (EN/PT) funciona
- [ ] Login/Logout funciona
- [ ] Carrinho WooCommerce funciona
- [ ] Checkout funciona
- [ ] GamiPress conta pontos corretamente
- [ ] Newsletter MailPoet funciona
- [ ] Music Player reproduz áudio
- [ ] Formulários enviam corretamente

---

## 🚀 DEPLOY AUTOMATIZADO (OPCIONAL)

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy via SFTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
```

---

## 📞 SUPORTE

Se encontrar problemas:

1. **Check logs:**
   - WordPress: `/wp-content/debug.log`
   - LiteSpeed: `/usr/local/lsws/logs/error.log`
   - Browser Console: F12 > Console

2. **Test API:**
   ```bash
   curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu
   ```

3. **Clear all caches:**
   - LiteSpeed Cache: **Purge All**
   - Cloudflare: **Purge Everything**
   - Browser: Hard Refresh (Ctrl+Shift+R)

4. **Rollback:**
   ```bash
   git log --oneline
   git checkout <commit-anterior>
   npm run build
   # Re-deploy
   ```

---

## 📚 RECURSOS ADICIONAIS

- [React Router Docs](https://reactrouter.com/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [WooCommerce API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [GamiPress Docs](https://gamipress.com/docs/)
- [LiteSpeed Cache](https://docs.litespeedtech.com/lscache/)
- [Cloudflare Speed](https://developers.cloudflare.com/speed/)

---

**Desenvolvido por:** Bolt.new AI Assistant
**Versão:** 2.0.0
**Última Atualização:** 2025-11-24
