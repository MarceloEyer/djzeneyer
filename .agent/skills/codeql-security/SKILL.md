---
name: codeql-security
description: Padrões de segurança CodeQL e como corrigi-los no projeto djzeneyer. Leia este arquivo SEMPRE antes de escrever código de sanitização HTML, escaping de output PHP ou abrir alertas de segurança no GitHub.
---

# 🛡️ Segurança CodeQL — djzeneyer

## ⚙️ Como verificar alertas CodeQL localmente

**SEMPRE use este comando (PowerShell):**
```powershell
gh api "/repos/MarceloEyer/djzeneyer/code-scanning/alerts?state=open&per_page=100" | ConvertFrom-Json | ForEach-Object { "$($_.number) [$($_.rule.id)] $($_.most_recent_instance.location.path):$($_.most_recent_instance.location.start_line) -- $($_.rule.description)" }
```

> Repo: `MarceloEyer/djzeneyer`  
> CLI: `gh api` (GitHub CLI instalado)  
> **NÃO** abre o browser para ver os alertas — use sempre o comando acima.

---

## 🐚 PowerShell — Regras Críticas

- **`&&` NÃO é válido no PowerShell local.** Use `;` para encadear comandos:
  ```powershell
  # ❌ ERRADO
  git add . && git commit -m "msg" && git push

  # ✅ CORRETO
  git add .; git commit -m "msg"; git push
  ```
- Para condicional real (só executa se anterior sucedeu), use:
  ```powershell
  if ($?) { git push }
  ```

---

## 📋 Regras CodeQL Conhecidas e Como Corrigi-las

### 1. `js/incomplete-multi-character-sanitization`
**Causa:** regex que substitui strings multi-caractere (como `<script`, `<!--`) pode ser bypassada com nesting.

**❌ PADRÃO PROBLEMÁTICO:**
```typescript
result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
```

**✅ CORREÇÃO: loop atômico + sweep final**
```typescript
// Loop recursivo para cada padrão multi-char
let previous: string;
do {
  previous = result;
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  result = result.replace(/<[^>]*>/g, '');
} while (result !== previous);

// Sweep final absoluto
result = result.replace(/[<>]/g, '');
```

---

### 2. `js/bad-tag-filter`
**Causa:** regexes que filtram tags específicas como `<script\b...>` ou `<style\b...>` são consideradas bypassáveis pelo CodeQL porque o tag pode ser fragmentado ou ter atributos inesperados.

**❌ PADRÃO PROBLEMÁTICO (em qualquer loop ou replace):**
```typescript
result.replace(/<script\b[\s\S]*?<\/script\s*>/gi, '');
result.replace(/<style\b[\s\S]*?<\/style\s*>/gi, '');
```

**✅ CORREÇÃO: usar loop GENÉRICO em vez de específico por tag**
```typescript
// Remove todos os comentários HTML
while (result.includes('<!--')) {
  const next = result.replace(/<!--[\s\S]*?-->/g, '');
  if (next === result) break;
  result = next;
}
// Remove TODAS as tags genericamente (cobre script, style, qualquer outra)
while (result.includes('<')) {
  const next = result.replace(/<[^>]*>/g, '');
  if (next === result) break;
  result = next;
}
// Sweep final absoluto — garante que nada escapa
result = result.replace(/[<>]/g, '');
```

> **Motivo:** `<[^>]*>` é tão eficaz quanto os loops específicos, sem ser flagrado pelo CodeQL.
> O sweep final `replace(/[<>]/g, '')` remove qualquer `<` ou `>` remanescente.

**Arquivos afetados historicamente:**
- `src/utils/text.ts` — função `stripHtml()`
- `zen-zouk-plugin/src/utils/storage.ts` — função `exportJournal()`
- `src/pages/FAQPage.tsx`
- `zen-zouk-plugin/src/utils/storage.ts`

---

### 3. `php/reflected-xss` / escaping de output PHP

**Regra geral:** Todo output de variáveis em PHP deve usar funções de escaping do WordPress.

| Contexto | Função correta |
|----------|---------------|
| HTML simples (texto) | `esc_html($var)` |
| Atributo HTML | `esc_attr($var)` |
| URL em `href` ou `src` | `esc_url($var)` |
| URL em redirect/header | `esc_url_raw($var)` |
| Textarea | `esc_textarea($var)` |
| HTML com tags permitidas | `wp_kses($var, $allowed_html)` |
| Integer/ID | `absint($var)` |
| Sanitização de input | `sanitize_text_field()`, `sanitize_email()`, etc. |

**❌ PROBLEMÁTICO — echo de variáveis sem escaping:**
```php
echo '<p>' . $args['desc'] . '</p>';          // desc pode ter HTML arbitrário
echo '<p>' . $_GET['msg'] . '</p>';            // XSS direto
```

**✅ CORRETO:**
```php
// Para desc que intencionalmente contém <a> e <strong>:
$allowed_html = [
    'a'      => ['href' => [], 'target' => [], 'rel' => []],
    'strong' => [],
    'em'     => [],
    'code'   => [],
];
echo '<p class="description">' . wp_kses($args['desc'], $allowed_html) . '</p>';

// Para inteiros de $_GET (ex: contadores):
echo absint($_GET['count']);

// Para comparação (sem echo), sanitize antes:
$error = sanitize_key($_GET['error'] ?? '');
if ($error === 'db_error') { ... }
```

---

### 4. `php/sql-injection`

**✅ Sempre use `$wpdb->prepare()`:**
```php
// ❌ ERRADO
$wpdb->query("SELECT * FROM $wpdb->options WHERE option_name = '$name'");

// ✅ CORRETO
$wpdb->query($wpdb->prepare(
    "SELECT * FROM $wpdb->options WHERE option_name = %s",
    $name
));
```

---

## 🗂️ Arquivos de Sanitização do Projeto

### TypeScript / React

| Arquivo | Função | Uso |
|---------|--------|-----|
| `src/utils/sanitize.ts` | `sanitizeHtml()` | HTML para `dangerouslySetInnerHTML` — permite tags seguras via DOMPurify-like allowlist |
| `src/utils/sanitize.ts` | `sanitizeTitleHtml()` | Títulos com possível HTML mínimo |
| `src/utils/sanitize.ts` | `safeUrl()` | URLs para `href`/`src` — valida protocolo |
| `src/utils/text.ts` | `stripHtml()` | Remove TODO HTML, retorna texto puro |
| `zen-zouk-plugin/src/utils/storage.ts` | `exportJournal()` | Sanitiza dados antes de export JSON |

### PHP

| Plugin | Mecanismo |
|--------|-----------|
| `zengame` | `esc_html()`, `esc_attr()`, `$wpdb->prepare()` |
| `zen-seo-lite` | `esc_attr()`, `esc_textarea()`, `esc_url()`, `sanitize_text_field()` |
| `zen-bit` | `esc_url()`, `esc_html()`, `wp_kses()` |
| `zeneyer-auth` | `wp_kses()`, `absint()`, `sanitize_text_field()`, `wp_nonce_field()` |

---

## 🔧 Configuração CodeQL (`.github/codeql/codeql-config.yml`)

Diretórios **excluídos** do scan (para evitar ruído):
```yaml
paths-ignore:
  - '**/dist/**'
  - '**/dist-debug/**'
  - '**/build/**'
  - '**/node_modules/**'
  - '**/vendor/**'
  - '**/*.min.js'
  - 'gamipress/**'
  - 'scripts/**'
  - 'en_old.json'
  - 'pt_old.json'
  - 'debug-*.php'       # scripts de debug devem ser excluídos OU deletados
  - 'benchmark_*.php'
  - '**/audit.md'
  - '**/pr_comments*.json'
  - '**/*.json.tmp'
```

> **IMPORTANTE:** Scripts de debug (`debug-bit.php`, `debug-routes.php`) devem ser **deletados** do repositório, não apenas excluídos do scan. Scripts de debug com acesso direto ao banco de dados sem autenticação são uma vulnerabilidade real.

---

## ✅ Checklist de Segurança para PRs

Antes de criar um PR com código novo:

- [ ] Todo `echo` PHP usa `esc_html()`, `esc_attr()`, `esc_url()` ou `wp_kses()`
- [ ] Queries SQL usam `$wpdb->prepare()`
- [ ] Formulários têm `wp_nonce_field()` e `check_admin_referer()`
- [ ] Todo `dangerouslySetInnerHTML` em React usa `sanitizeHtml()` de `src/utils/sanitize.ts`
- [ ] Funções de strip de HTML não usam regex específica de tag (`<script\b`, `<style\b`)
- [ ] Loops de sanitização são atômicos (while + break quando não muda) + sweep final `replace(/[<>]/g, '')`
- [ ] Scripts de debug não estão commitados em `main`
- [ ] CodeQL alerts verificados com o comando `gh api` acima
