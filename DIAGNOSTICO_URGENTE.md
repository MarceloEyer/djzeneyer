# 🚨 DIAGNÓSTICO - WP-JSON 404

## ❌ PROBLEMA ATUAL

```
1. https://djzeneyer.com/wp-json/ → 404
2. https://djzeneyer.com/wp-admin/ → Redireciona para home
3. Site carrega mas sem menu (API quebrada)
```

---

## 🔍 CAUSA PROVÁVEL

O **WordPress não está respondendo** porque:

### Hipótese 1: Build do React Sobrescreveu WordPress
Quando você subiu `/dist`, pode ter **substituído** o `index.php` do WordPress pelo `index.html` do React.

### Hipótese 2: .htaccess Redirecionando Tudo
O `.htaccess` está redirecionando **todas** as requisições (incluindo `/wp-json/` e `/wp-admin/`) para o React.

### Hipótese 3: WordPress em Local Diferente
O WordPress pode estar em uma **subpasta** ou configurado com URL diferente no `wp-config.php`.

---

## 📋 CHECKLIST DE DIAGNÓSTICO

Execute esses passos **NO SERVIDOR** (via FTP/SSH):

### 1. Verificar Estrutura de Arquivos

Acesse a **raiz do site** e me diga o que tem:

```
/public_html/  (ou /var/www/html/)
  ├── .htaccess          ← Tem?
  ├── index.php          ← Tem? (WordPress ou React?)
  ├── index.html         ← Tem? (React)
  ├── wp-admin/          ← Tem?
  ├── wp-content/        ← Tem?
  ├── wp-includes/       ← Tem?
  ├── wp-config.php      ← Tem?
  ├── /dist/             ← Tem? (dentro da raiz?)
  └── /wordpress/        ← Tem? (WP em subpasta?)
```

**Me envie a lista de arquivos da raiz!**

---

### 2. Verificar index.php

**Abra o `index.php` da raiz e me diga as primeiras 5 linhas.**

**Opção A - WordPress (CORRETO):**
```php
<?php
/**
 * Front to the WordPress application...
 */
define( 'WP_USE_THEMES', true );
require __DIR__ . '/wp-blog-header.php';
```

**Opção B - React (ERRADO - foi sobrescrito!):**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
```

Se for a **Opção B**, você **deletou acidentalmente** o `index.php` do WordPress!

---

### 3. Verificar wp-config.php

Abra `wp-config.php` e procure por:

```php
define('WP_HOME', '???');
define('WP_SITEURL', '???');
```

**Me diga qual URL está configurada!** Deve ser:
```php
define('WP_HOME', 'https://djzeneyer.com');
define('WP_SITEURL', 'https://djzeneyer.com');
```

Se estiver diferente, **corrija** para a URL correta.

---

### 4. Testar Acesso Direto

Tente acessar no navegador:

```
https://djzeneyer.com/wp-admin/admin-ajax.php
```

**Resultado?**
- ✅ **Página em branco ou 400**: WordPress está funcionando!
- ❌ **404**: WordPress não está na raiz ou .htaccess está bloqueando
- ❌ **HTML do React**: .htaccess redirecionando tudo

---

## 🛠️ SOLUÇÕES POR CENÁRIO

### CENÁRIO 1: WordPress na Raiz (mais comum)

**Estrutura correta:**
```
/public_html/
  ├── .htaccess         ← Use: .htaccess.wordpress-raiz
  ├── index.php         ← DEVE SER DO WORDPRESS
  ├── wp-admin/
  ├── wp-content/
  │   └── themes/
  │       └── djzeneyer/  ← Seu tema com React
  │           ├── functions.php
  │           ├── /inc/
  │           └── /dist/  ← Build do React
  └── wp-config.php
```

**Ações:**
1. ✅ Verifique se `index.php` é do WordPress (não HTML!)
2. ✅ Use o arquivo `.htaccess.wordpress-raiz` (já criei)
3. ✅ O build do React deve estar em `/wp-content/themes/djzeneyer/dist/`
4. ✅ **NÃO suba** o build do React para a raiz!

---

### CENÁRIO 2: WordPress em Subpasta

**Estrutura:**
```
/public_html/
  ├── .htaccess         ← Use: .htaccess.wordpress-subpasta
  ├── index.html        ← Build do React
  ├── /assets/          ← Assets do React
  └── /wordpress/       ← WordPress aqui
      ├── wp-admin/
      ├── wp-config.php
      └── ...
```

**Ações:**
1. ✅ Use o arquivo `.htaccess.wordpress-subpasta` (já criei)
2. ✅ No `wp-config.php`:
   ```php
   define('WP_HOME', 'https://djzeneyer.com');
   define('WP_SITEURL', 'https://djzeneyer.com/wordpress');
   ```
3. ✅ No React, configure:
   ```env
   VITE_WP_URL=https://djzeneyer.com/wordpress
   VITE_API_URL=https://djzeneyer.com/wp-json
   ```

---

### CENÁRIO 3: index.php Foi Sobrescrito

Se você **deletou acidentalmente** o `index.php` do WordPress:

**Recupere o arquivo:**

```php
<?php
/**
 * Front to the WordPress application. This file doesn't do anything, but loads
 * wp-blog-header.php which does and tells WordPress to load the theme.
 *
 * @package WordPress
 */

/**
 * Tells WordPress to load the WordPress theme and output it.
 *
 * @var bool
 */
define( 'WP_USE_THEMES', true );

/** Loads the WordPress Environment and Template */
require __DIR__ . '/wp-blog-header.php';
```

Salve isso como `index.php` e suba para a raiz.

---

## 🔄 PASSO A PASSO PARA CORRIGIR

### Se WordPress está NA RAIZ:

1. **Renomeie/delete** o `index.html` do React (se estiver na raiz)
2. **Restaure** o `index.php` do WordPress (código acima)
3. **Substitua** `.htaccess` pelo `.htaccess.wordpress-raiz`
4. **Recarregue** permalinks:
   - Acesse: `https://djzeneyer.com/wp-admin/options-permalink.php`
   - Clique em "Salvar" (sem mudar nada)
5. **Teste**: `https://djzeneyer.com/wp-json/`

### Se WordPress está EM SUBPASTA:

1. **Use** `.htaccess.wordpress-subpasta` na raiz
2. **Configure** `wp-config.php` com URLs corretas
3. **Atualize** `.env` do React com URL do WP
4. **Rebuild** React: `npm run build`
5. **Teste**: `https://djzeneyer.com/wp-json/`

---

## 📞 PRÓXIMOS PASSOS

**Me responda:**

1. Qual a **estrutura atual** do servidor? (lista de arquivos)
2. O que tem no **`index.php`** da raiz? (WordPress ou HTML?)
3. O que tem no **`wp-config.php`**? (WP_HOME e WP_SITEURL)
4. O que acontece ao acessar: `https://djzeneyer.com/wp-admin/admin-ajax.php`?

Com essas informações, posso criar uma **solução exata** para o seu caso! 🎯

---

## 🚨 AÇÃO IMEDIATA

**Se você quer voltar a funcionar AGORA:**

1. **Renomeie** `.htaccess` atual para `.htaccess.backup`
2. **Crie** um novo `.htaccess` só com isso:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

3. **Acesse**: `https://djzeneyer.com/wp-admin/`
4. **Vá em**: Configurações > Links Permanentes > Salvar

Isso deve fazer o WordPress voltar a funcionar!
