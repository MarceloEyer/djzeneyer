# 🔌 Guia de Plugins Customizados

**Como funciona o deploy automático de plugins**

---

## 📦 **Como Funciona**

### **1. Estrutura**

```
/plugins/
├── zen-seo-lite/          ✅ Deploy automático
├── zeneyer-auth/          ✅ Deploy automático
└── seu-novo-plugin/       ⚠️ Precisa adicionar no deploy.yml
```

### **2. Fluxo de Deploy**

```
Você edita: plugins/zen-seo-lite/includes/class-algo.php
↓
git add plugins/zen-seo-lite/
git commit -m "feat: nova funcionalidade"
git push origin main
↓
GitHub Actions detecta mudança
↓
Faz rsync APENAS de zen-seo-lite/
↓
Servidor atualizado ✅
↓
Outros plugins intocados ✅
```

---

## 💾 **Onde Ficam as Configurações?**

### **Database (wp_options)**

```sql
-- Zen SEO Lite Pro
option_name: 'zen_seo_global'
option_value: {
  "real_name": "Marcelo Eyer Fernandes",
  "booking_email": "booking@djzeneyer.com",
  "cnpj": "44.063.765/0001-46",
  "google_client_id": "...",
  "awards_list": "...",
  "default_image": "...",
  "react_routes": "..."
}

-- ZenEyer Auth Pro
option_name: 'zeneyer_auth_settings'
option_value: {
  "google_client_id": "...",
  "token_expiration": 7
}

option_name: 'zeneyer_auth_jwt_secret'
option_value: "64-character-random-secret"
```

### **Database (wp_postmeta)**

```sql
-- SEO por post
meta_key: '_zen_seo_data'
meta_value: {
  "title": "Custom SEO Title",
  "desc": "Meta description",
  "image": "https://...",
  "noindex": false,
  "event_date": "2025-12-31",
  "event_location": "São Paulo",
  "event_ticket": "https://..."
}
```

### **Database (wp_usermeta)**

```sql
-- Refresh tokens (ZenEyer Auth)
meta_key: 'zeneyer_refresh_token'
meta_value: {
  "token": "hashed-token",
  "expires": 1234567890
}

-- Google ID
meta_key: 'zeneyer_google_id'
meta_value: "1234567890"
```

---

## ✅ **O Que É Seguro Atualizar**

### **Pode atualizar sem medo:**

```php
// Código PHP
plugins/zen-seo-lite/includes/class-jwt-manager.php
plugins/zen-seo-lite/admin/class-settings-page.php

// JavaScript
plugins/zen-seo-lite/admin/js/admin.js

// CSS (se tiver)
plugins/zen-seo-lite/admin/css/admin.css

// Documentação
plugins/zen-seo-lite/README.md
```

**Resultado:** Código atualiza, configurações preservadas ✅

---

## ❌ **O Que NÃO Fazer**

### **Nunca faça isso:**

```php
// ❌ ERRADO: Hardcoded config
define('GOOGLE_CLIENT_ID', '123456');

// ✅ CERTO: Buscar do database
$options = get_option('zen_seo_global');
$client_id = $options['google_client_id'] ?? '';
```

### **Nunca delete opções do database no código:**

```php
// ❌ ERRADO: Vai apagar configurações do usuário
delete_option('zen_seo_global');

// ✅ CERTO: Só no uninstall.php
// E mesmo assim, avisar o usuário
```

---

## 🆕 **Como Adicionar Novo Plugin**

### **Passo 1: Criar Plugin**

```bash
mkdir plugins/meu-novo-plugin
cd plugins/meu-novo-plugin

# Criar arquivo principal
cat > meu-novo-plugin.php << 'EOF'
<?php
/**
 * Plugin Name: Meu Novo Plugin
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

// Seu código aqui
EOF
```

### **Passo 2: Adicionar no deploy.yml**

Editar `.github/workflows/deploy.yml`:

```yaml
# Adicionar após zeneyer-auth:

- name: 🔌 Deploy Custom Plugins (meu-novo-plugin)
  if: hashFiles('plugins/meu-novo-plugin/**') != ''
  uses: burnett01/rsync-deployments@5.2.1
  with:
    switches: -avzr
    path: plugins/meu-novo-plugin/
    remote_path: ${{ env.REMOTE_ROOT }}/wp-content/plugins/meu-novo-plugin/
    remote_host: ${{ env.SSH_HOST }}
    remote_user: ${{ env.SSH_USER }}
    remote_port: ${{ env.SSH_PORT }}
    remote_key: ${{ secrets.SSH_PRIVATE_KEY }}
```

### **Passo 3: Commit e Push**

```bash
git add plugins/meu-novo-plugin/
git add .github/workflows/deploy.yml
git commit -m "feat: add meu-novo-plugin"
git push origin main
```

### **Passo 4: Ativar no WordPress**

```bash
# Via WordPress Admin
Plugins → Ativar "Meu Novo Plugin"

# Ou via SSH
wp plugin activate meu-novo-plugin
```

---

## 🔄 **Atualizar Plugin Existente**

### **Exemplo: Adicionar nova feature no Zen SEO**

```bash
# 1. Editar arquivo
vim plugins/zen-seo-lite/includes/class-schema.php

# 2. Testar localmente
# (se tiver ambiente local)

# 3. Commit
git add plugins/zen-seo-lite/
git commit -m "feat(zen-seo): add new schema type"
git push origin main

# 4. GitHub Actions faz deploy automático
# 5. Servidor atualizado em ~2 minutos
# 6. Configurações preservadas ✅
```

---

## 🗑️ **Deletar Plugin**

### **Opção 1: Apenas do Repositório**

```bash
# Remove do repo, mas mantém no servidor
git rm -r plugins/meu-plugin/
git commit -m "chore: remove meu-plugin from repo"
git push origin main

# Servidor: plugin continua lá
# Você precisa desativar/deletar manualmente no WordPress
```

### **Opção 2: Do Repositório e Servidor**

```bash
# 1. Desativar no WordPress primeiro
wp plugin deactivate meu-plugin

# 2. Deletar no servidor via SSH
rm -rf /home/u790739895/domains/djzeneyer.com/public_html/wp-content/plugins/meu-plugin/

# 3. Remover do repositório
git rm -r plugins/meu-plugin/
git commit -m "chore: remove meu-plugin"
git push origin main
```

---

## 🔒 **Segurança**

### **O Que o Deploy NÃO Toca**

```
✅ Outros plugins (WooCommerce, GamiPress, etc)
✅ Configurações no database
✅ Uploads (/wp-content/uploads/)
✅ Temas (/wp-content/themes/)
✅ wp-config.php
✅ .htaccess
```

### **O Que o Deploy Atualiza**

```
✅ Código dos plugins customizados
✅ Apenas os plugins em /plugins/ do repo
✅ Nada mais
```

---

## 📊 **Exemplo Real: Atualizar Zen SEO**

### **Cenário:**

Você quer adicionar suporte a um novo tipo de Schema.org.

### **Passos:**

```bash
# 1. Editar o arquivo
vim plugins/zen-seo-lite/includes/class-schema.php

# Adicionar novo método:
private function generate_recipe_schema($post) {
    return [
        '@type' => 'Recipe',
        'name' => get_the_title($post),
        // ...
    ];
}

# 2. Commit
git add plugins/zen-seo-lite/includes/class-schema.php
git commit -m "feat(zen-seo): add Recipe schema support"
git push origin main

# 3. Aguardar deploy (2-3 minutos)

# 4. Verificar no servidor
# O código novo está lá ✅
# Suas configurações (nome, email, etc) intactas ✅
```

---

## 🐛 **Troubleshooting**

### **Problema: Plugin não atualiza no servidor**

```bash
# Verificar GitHub Actions
https://github.com/MarceloEyer/djzeneyer/actions

# Se falhou, ver logs
# Se passou, verificar no servidor:
ssh u790739895@147.79.84.222 -p 65002
ls -la /home/u790739895/domains/djzeneyer.com/public_html/wp-content/plugins/zen-seo-lite/

# Ver data de modificação dos arquivos
```

### **Problema: Configurações sumiram**

```bash
# Verificar no database
wp option get zen_seo_global
wp option get zeneyer_auth_settings

# Se vazio, restaurar do backup
# Hostinger → Backups → Restore Database
```

### **Problema: Plugin quebrou o site**

```bash
# Desativar via SSH
wp plugin deactivate zen-seo-lite

# Ou renomear pasta
mv wp-content/plugins/zen-seo-lite wp-content/plugins/zen-seo-lite.disabled

# Reverter commit no GitHub
git revert HEAD
git push origin main
```

---

## 📝 **Checklist: Adicionar Novo Plugin**

- [ ] Criar pasta em `/plugins/nome-do-plugin/`
- [ ] Criar arquivo principal `nome-do-plugin.php`
- [ ] Adicionar header do plugin (Plugin Name, Version, etc)
- [ ] Testar localmente (se possível)
- [ ] Adicionar deploy no `.github/workflows/deploy.yml`
- [ ] Commit e push
- [ ] Verificar GitHub Actions (passou?)
- [ ] Verificar no servidor (arquivo chegou?)
- [ ] Ativar no WordPress Admin
- [ ] Testar funcionalidade
- [ ] Configurar plugin (se necessário)

---

## 📝 **Checklist: Atualizar Plugin Existente**

- [ ] Editar arquivos em `/plugins/nome-do-plugin/`
- [ ] Testar localmente (se possível)
- [ ] Commit com mensagem descritiva
- [ ] Push para main
- [ ] Aguardar deploy (2-3 min)
- [ ] Verificar GitHub Actions
- [ ] Testar no site de produção
- [ ] Verificar se configurações foram preservadas
- [ ] Verificar logs de erro (se houver)

---

## 💡 **Dicas**

### **1. Versionamento**

```php
// Sempre atualizar versão no header
/**
 * Plugin Name: Zen SEO Lite Pro
 * Version: 8.0.1  ← Incrementar aqui
 */

// WordPress detecta e mostra "Update available"
```

### **2. Migrations**

```php
// Se mudar estrutura de dados, criar migration
function zen_seo_migrate_to_v8() {
    $version = get_option('zen_seo_version', '0');
    
    if (version_compare($version, '8.0.0', '<')) {
        // Migrar dados antigos para novo formato
        $old_data = get_option('zen_seo_old');
        $new_data = transform_data($old_data);
        update_option('zen_seo_global', $new_data);
        update_option('zen_seo_version', '8.0.0');
    }
}
add_action('plugins_loaded', 'zen_seo_migrate_to_v8');
```

### **3. Debug**

```php
// Adicionar logs temporários
if (defined('WP_DEBUG') && WP_DEBUG) {
    error_log('[Zen SEO] Debug info: ' . print_r($data, true));
}

// Ver logs
tail -f /home/u790739895/domains/djzeneyer.com/public_html/wp-content/debug.log
```

---

## 🎯 **Resumo**

| Ação | Configurações | Outros Plugins | Seguro? |
|------|---------------|----------------|---------|
| Atualizar código | ✅ Preservadas | ✅ Intocados | ✅ Sim |
| Adicionar arquivo | ✅ Preservadas | ✅ Intocados | ✅ Sim |
| Deletar arquivo | ✅ Preservadas | ✅ Intocados | ✅ Sim |
| Adicionar plugin | ✅ Preservadas | ✅ Intocados | ✅ Sim |

**Conclusão:** Deploy é seguro! Pode atualizar sem medo. ✅

---

**Última atualização:** 2025-11-27
