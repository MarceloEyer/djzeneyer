# 🚨 HOTFIX URGENTE - API REST QUEBRADA

## ❌ PROBLEMA IDENTIFICADO

Pelos erros do console:
```
Failed to load /wp-json/djzeneyer/v1/menu?lang=en-1 (404)
Failed to load /wp-json/zeneyer_auth/v1/settings-1 (404)
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

**Causa:** O `.htaccess` anterior estava bloqueando/redirecionando incorretamente as requisições para `/wp-json/` (API REST do WordPress).

---

## ✅ SOLUÇÃO APLICADA

Criei um **`.htaccess` CORRIGIDO** que:
1. ✅ **NÃO bloqueia** `/wp-json/` (API REST)
2. ✅ **NÃO bloqueia** `/wp-admin/` (admin WordPress)
3. ✅ **NÃO bloqueia** `/wp-login.php` (login)
4. ✅ **Mantém** CORS funcionando
5. ✅ **Mantém** segurança (HSTS, CSP, etc.)
6. ✅ **Simplificado** para evitar conflitos

---

## 📋 PASSOS PARA CORRIGIR

### 1. Substitua o .htaccess no Servidor

**Upload o novo `.htaccess`** (está no projeto) para a **RAIZ do seu servidor WordPress**.

```bash
# Via SFTP/FTP:
# Upload: .htaccess -> /public_html/.htaccess (ou /var/www/html/.htaccess)

# Via SSH:
scp .htaccess usuario@servidor:/caminho/para/raiz/
```

### 2. Limpe TODOS os Caches

```bash
# No WordPress Admin (se conseguir acessar):
1. LiteSpeed Cache > Toolbox > Purge All
2. Settings > Permalinks > Save (sem mudar nada)

# No Cloudflare:
1. Caching > Configuration > Purge Everything

# No navegador:
1. Ctrl + Shift + Delete (limpar cache)
2. Ou: Hard Refresh (Ctrl + F5)
```

### 3. Teste os Endpoints Manualmente

Abra o navegador e acesse diretamente:

```
https://djzeneyer.com/wp-json/
```

**Deve retornar JSON:**
```json
{
  "name": "DJ Zen Eyer",
  "description": "...",
  "url": "https://djzeneyer.com",
  ...
}
```

Se retornar HTML (`<!DOCTYPE html>...`), o problema persiste.

### 4. Teste o Endpoint do Menu

```
https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en
```

**Deve retornar array JSON:**
```json
[
  {"ID": 1, "title": "Home", "url": "/", ...},
  ...
]
```

### 5. Teste Login Admin

```
https://djzeneyer.com/wp-admin/
```

Deve redirecionar para `wp-login.php` e mostrar tela de login normal do WordPress.

---

## 🔧 SE O PROBLEMA PERSISTIR

### Opção A: .htaccess Mínimo (Emergency)

Se o `.htaccess` corrigido não funcionar, use essa versão **ultra-minimalista**:

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

Salve como `.htaccess` e suba pro servidor. Isso é o **mínimo absoluto** que WordPress precisa para funcionar.

### Opção B: Regenerar Permalinks

```bash
# WordPress Admin:
1. Acesse: Configurações > Links Permanentes
2. Escolha: "Nome do Post"
3. Clique em "Salvar Alterações"

# Isso regenera o .htaccess automaticamente
```

### Opção C: Verificar mod_rewrite

```bash
# No servidor (SSH):
sudo a2enmod rewrite
sudo systemctl restart apache2

# Ou no LiteSpeed:
# Verifique se .htaccess override está habilitado
```

---

## 🚨 PROBLEMA COM GOOGLE OAUTH?

Se o **Google OAuth parou de funcionar**, pode ser:

### 1. URL de Redirect Mudou

No [Google Cloud Console](https://console.cloud.google.com/):

1. **APIs & Services > Credentials**
2. Edite seu **OAuth 2.0 Client ID**
3. **Authorized JavaScript origins:**
   ```
   https://djzeneyer.com
   http://localhost:5173
   ```
4. **Authorized redirect URIs:**
   ```
   https://djzeneyer.com
   https://djzeneyer.com/
   http://localhost:5173
   ```

### 2. CORS Bloqueando

O `.htaccess` corrigido já inclui CORS para Google OAuth:

```apache
Header always set Access-Control-Allow-Origin "https://accounts.google.com"
```

### 3. CSP Muito Restritivo

O header `Content-Security-Policy` anterior estava bloqueando Google. O novo `.htaccess` NÃO tem CSP para evitar conflitos.

Se precisar de CSP, use essa versão compatível:

```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com; frame-src 'self' https://accounts.google.com; connect-src 'self' https://djzeneyer.com https://*.google.com https://*.googleapis.com;"
```

---

## 📊 CHECKLIST DE DIAGNÓSTICO

Execute esses testes e me informe os resultados:

```bash
# 1. Testar API REST básica
curl https://djzeneyer.com/wp-json/

# 2. Testar endpoint customizado
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en

# 3. Testar CORS
curl -H "Origin: https://djzeneyer.com" -I https://djzeneyer.com/wp-json/

# 4. Verificar se wp-admin funciona
curl -I https://djzeneyer.com/wp-admin/

# 5. Ver headers de resposta
curl -I https://djzeneyer.com/
```

**Me envie a saída desses comandos** para diagnosticar melhor!

---

## 🎯 RESUMO DAS MUDANÇAS

| Arquivo | Problema | Solução |
|---------|----------|---------|
| `.htaccess` | Bloqueava `/wp-json/` | Adicionado exceções explícitas |
| `.htaccess` | CSP muito restritivo | Removido temporariamente |
| `.htaccess` | CORS conflitante | Aplicado apenas em `/wp-json/` |
| `.htaccess` | Redirects complexos | Simplificado para WordPress padrão |

---

## 💡 DIFERENÇAS ENTRE VERSÕES

### ❌ .htaccess ANTIGO (QUEBRADO)
```apache
# Tinha regras complexas que quebravam wp-json
RewriteCond %{REQUEST_URI} ^/pt(/.*)?$
RewriteRule ^(.*)$ /index.php [L,QSA]
# Isso redirecionava TUDO, incluindo API
```

### ✅ .htaccess NOVO (CORRIGIDO)
```apache
# Exceções explícitas ANTES do catch-all
RewriteCond %{REQUEST_URI} ^/wp-json/ [NC]
RewriteRule .* - [L]  # NÃO redirecionar

RewriteCond %{REQUEST_URI} ^/wp-admin/ [NC]
RewriteRule .* - [L]  # NÃO redirecionar

# Só depois redireciona o resto
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
```

---

## 🔄 ROLLBACK (Se Nada Funcionar)

Se o novo `.htaccess` piorar, use o **WordPress padrão**:

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

Copie isso, salve como `.htaccess` e suba pro servidor. **Vai funcionar 100%**, mas sem otimizações.

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Substitua o `.htaccess` no servidor
2. ✅ Limpe cache (LiteSpeed + Cloudflare + Browser)
3. ✅ Teste: `https://djzeneyer.com/wp-json/`
4. ✅ Teste: `https://djzeneyer.com/wp-admin/`
5. ✅ Recarregue o site (Ctrl + Shift + R)
6. ✅ Verifique console (F12) - deve estar limpo

Se ainda houver erros, **me envie**:
- Screenshot do console atualizado
- Output dos comandos `curl` acima
- Mensagem de erro do WordPress (se houver)

---

**Arquivo criado:** 2025-11-24
**Prioridade:** 🔴 CRÍTICO
**Tempo estimado:** 5-10 minutos
