# djzeneyer — Contexto do Projeto para Agentes

## 📦 Repositório
- **GitHub:** `MarceloEyer/djzeneyer`
- **Stack:** WordPress (PHP 8+) + React (TypeScript) + Vite
- **Ambiente local:** Windows, PowerShell

---

## 🐚 PowerShell — Regras Obrigatórias

- **`&&` NÃO é válido no PowerShell.** Use `;` para encadear comandos.
  ```powershell
  # ❌ ERRADO — causa erro de parser
  git add . && git commit -m "msg" && git push

  # ✅ CORRETO
  git add .; git commit -m "msg"; git push
  ```
- Para scripts complexos, use múltiplas linhas separadas.

---

## 🔒 Segurança — Como Verificar Alertas CodeQL

```powershell
gh api "/repos/MarceloEyer/djzeneyer/code-scanning/alerts?state=open&per_page=100" | ConvertFrom-Json | ForEach-Object { "$($_.number) [$($_.rule.id)] $($_.most_recent_instance.location.path):$($_.most_recent_instance.location.start_line)" }
```

> Veja `.agent/skills/codeql-security/SKILL.md` para padrões completos de correção.

---

## 🛠️ Arquitetura

### Frontend (React + TypeScript)
- **Entry:** `src/main.tsx`
- **Páginas:** `src/pages/`
- **Componentes:** `src/components/`
- **Utils de segurança:** `src/utils/sanitize.ts`, `src/utils/text.ts`
- **i18n:** `src/locales/en/translation.json`, `src/locales/pt/translation.json`
- **Hooks:** `src/hooks/useQueries.ts` (React Query)
- **Rotas:** `src/config/routes.ts`
- **Build:** Vite (`vite.config.ts`)

### Backend (WordPress + PHP)
- **Tema:** raiz do repo (headless — só serve o `index.html`)
- **API REST:** `inc/api.php` — endpoints em `/wp-json/djzeneyer/v1/`
- **Setup/Hooks:** `inc/setup.php`, `inc/vite.php`, `inc/metaboxes.php`
- **SSR para bots:** `inc/ssr-handler.php`
- **Plugins internos:**
  - `plugins/zengame/` — gamificação (GamiPress + WooCommerce)
  - `plugins/zen-seo-lite/` — meta tags e sitemap
  - `plugins/zen-bit/` — eventos Bandsintown
  - `plugins/zeneyer-auth/` — autenticação JWT + Google OAuth
  - `plugins/zen-plugins-overview.php` — dashboard admin unificado
- **Zouk Plugin:** `zen-zouk-plugin/` — aplicação standalone de diário de dança

### CI/CD
- **Deploy:** `.github/workflows/deploy.yml`
- **CodeQL:** `.github/codeql/codeql-config.yml`

---

## 🎨 Convenções de Código

### React / TypeScript
- `dangerouslySetInnerHTML` SEMPRE usa `sanitizeHtml()` de `src/utils/sanitize.ts`
- Para strip de HTML puro (texto limpo), usar `stripHtml()` de `src/utils/text.ts`
- Traduções via `useTranslation()` — chaves em dot notation: `t('page.section.key')`
- Animações via `framer-motion`; respeitar `useReducedMotion()`
- React Query para fetching — não usar `fetch()` diretamente em componentes
- Imports de lucide-react para ícones

### PHP / WordPress
- Output SEMPRE escapado: `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses()`
- Input SEMPRE sanitizado: `sanitize_text_field()`, `sanitize_email()`, `absint()`
- SQL SEMPRE via `$wpdb->prepare()`
- Formulários admin com `wp_nonce_field()` + `check_admin_referer()`
- Cache via WordPress transients (`set_transient`/`get_transient`)
- Plugins usam namespaces PHP (`namespace ZenEyer\Auth;` etc.)

---

## ⚠️ Armadilhas Conhecidas

1. **`&&` no PowerShell local** — não funciona. Usar `;`.
2. **Regex de tag específica** (`<script\b`, `<style\b`) — flagrado pelo CodeQL como `js/bad-tag-filter`. Usar loop genérico `<[^>]*>`.
3. **Chained `.replace()` para sanitização HTML** — gera `js/incomplete-multi-character-sanitization`. Usar loops atômicos `while` + sweep final `replace(/[<>]/g, '')`.
4. **Echo de `$args['desc']` em settings PHP** — contém HTML, deve usar `wp_kses()`.
5. **Scripts de debug na raiz** (`debug-*.php`, `benchmark_*.php`) — devem ser DELETADOS, não commitados.
6. **`function_exists()` necessário** para GamiPress e WooCommerce — plugins opcionais.
7. **WooCommerce HPOS** — usar runtime check para evitar parse-time errors quando WC inativo.
8. **Intelephense falsos positivos** — "Undefined function" em arquivos PHP com namespace dentro de plugins. São falsos — o WordPress resolve globalmente em runtime.

---

## 📁 Estrutura de Exclusões no CodeQL

Arquivos/pastas que **não devem** ser escaneados:
- `dist/`, `dist-debug/`, `build/` — bundles compilados
- `node_modules/`, `vendor/` — dependências
- `*.min.js` — código minificado
- `gamipress/` — plugin de terceiros
- `scripts/` — scripts utilitários internos
- `en_old.json`, `pt_old.json` — traduções legadas
- `debug-*.php`, `benchmark_*.php` — devem ser deletados

---

## 🌐 Variáveis de Ambiente / Constantes Importantes

```
DJZ_CACHE_MENU = 6 horas
DJZ_CACHE_PRODUCTS = 24 horas
DJZ_CACHE_GAMIPRESS = 48 horas
STATS_CACHE_TTL = 3600 (1 hora, configurável no admin)
CACHE_VERSION = string para invalidação de cache
```

Site de produção: `https://djzeneyer.com`
