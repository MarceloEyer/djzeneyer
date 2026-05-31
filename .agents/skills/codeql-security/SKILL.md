---
name: codeql-security
description: CodeQL security patterns for djzeneyer.com. Read before changing HTML sanitization, Markdown generation, React escaping, PHP output escaping, SQL, debug scripts or GitHub security alerts.
risk: medium
source: project
updated: "2026-05-30"
---

# CodeQL Security — djzeneyer.com

## Scope

Use this skill for CodeQL/security alert triage and fixes in this repository, especially:

- TypeScript/React sanitization.
- HTML-to-Markdown generation.
- `dangerouslySetInnerHTML`.
- PHP output escaping.
- SQL injection.
- Debug scripts.
- Public/private data classification.

This skill does not override product policy. Public artist/site/AI-search resources can be public by design. If CodeQL or a bot flags a product-intent public endpoint as a leak, ask before changing behavior.

## GitHub security audit commands

PowerShell examples:

```powershell
gh api "/repos/MarceloEyer/djzeneyer/code-scanning/alerts?state=open&per_page=100" | ConvertFrom-Json | ForEach-Object { "$($_.number) [$($_.rule.id)] $($_.most_recent_instance.location.path):$($_.most_recent_instance.location.start_line) -- $($_.rule.description)" }

gh api "/repos/MarceloEyer/djzeneyer/dependabot/alerts?state=open&per_page=100" | ConvertFrom-Json | ForEach-Object { "$($_.number) [$($_.security_advisory.severity)] $($_.dependency.package.name) - $($_.security_advisory.summary)" }

gh api "/repos/MarceloEyer/djzeneyer/secret-scanning/alerts?state=open&per_page=100" | ConvertFrom-Json | ForEach-Object { "$($_.number) [$($_.secret_type_display_name)] $($_.state)" }

gh api "/repos/MarceloEyer/djzeneyer/actions/permissions" | ConvertFrom-Json | Format-List
```

Expected target state: CodeQL=0 open actionable alerts, Dependabot=0 unresolved high/critical alerts, Secret Scanning=0 real leaked secrets.

## PowerShell rule

`&&` is available only in **PowerShell 7+**. In Windows PowerShell 5.1, use `;` or `$?` conditionals instead.

```powershell
# PowerShell 7+ only
git add . && git commit -m "msg" && git push

# PowerShell 5.1 compatible
git add .; git commit -m "msg"; git push
if ($?) { git push }
```

## Known CodeQL patterns

### `js/incomplete-multi-character-sanitization`

Problem: multi-character pattern replacement can be bypassed with nesting or split tokens.

Avoid tag-specific or one-pass stripping for untrusted plain-text conversion.

Prefer atomic loops and final sweep when converting HTML to plain text:

```ts
let previous: string;
do {
  previous = result;
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  result = result.replace(/<[^>]*>/g, '');
} while (result !== previous);

result = result.replace(/[<>]/g, '');
```

### `js/bad-tag-filter`

Problem: filtering only `<script>` or `<style>` is considered bypassable.

Avoid:

```ts
result.replace(/<script\b[\s\S]*?<\/script\s*>/gi, '');
result.replace(/<style\b[\s\S]*?<\/style\s*>/gi, '');
```

Prefer generic tag removal for plain-text extraction:

```ts
while (result.includes('<')) {
  const next = result.replace(/<[^>]*>/g, '');
  if (next === result) break;
  result = next;
}
result = result.replace(/[<>]/g, '');
```

## React/TypeScript sanitization files

| File | Function | Use |
|---|---|---|
| `src/utils/sanitize.ts` | `sanitizeHtml()` | Allowlisted HTML for `dangerouslySetInnerHTML` |
| `src/utils/sanitize.ts` | `sanitizeTitleHtml()` | Minimal safe title HTML |
| `src/utils/sanitize.ts` | `safeUrl()` | URLs for `href`/`src`; validates protocol |
| `src/utils/text.ts` | `stripHtml()` | Plain-text extraction |
| Markdown generation scripts | HTML to Markdown/plain text | Must avoid CodeQL-bypassable sanitizers |

Rules:

- Every `dangerouslySetInnerHTML` must use approved sanitization.
- Do not use regex-only HTML sanitization for rich HTML rendering.
- For plain-text stripping, generic tag removal + final sweep is acceptable when output is text, not HTML.
- `safeUrl(url)` returns `'#'`; use explicit fallback when needed.

## PHP output escaping

Every variable output in PHP must use context-appropriate escaping.

| Context | Function |
|---|---|
| HTML text | `esc_html()` |
| Attribute | `esc_attr()` |
| URL output | `esc_url()` |
| URL storage/redirect/header | `esc_url_raw()` |
| Textarea | `esc_textarea()` |
| Limited safe HTML | `wp_kses()` |
| Integer/ID | `absint()` |
| Input text | `sanitize_text_field()` |
| Input key | `sanitize_key()` |

Example:

```php
$allowed_html = [
    'a'      => ['href' => [], 'target' => [], 'rel' => []],
    'strong' => [],
    'em'     => [],
    'code'   => [],
];
echo '<p class="description">' . wp_kses($args['desc'], $allowed_html) . '</p>';
```

## SQL injection

Always use `$wpdb->prepare()` or WordPress/WooCommerce APIs.

```php
$wpdb->query($wpdb->prepare(
    "SELECT * FROM {$wpdb->options} WHERE option_name = %s",
    $name
));
```

For WooCommerce HPOS, do not query `wp_posts` for orders; use `wc_get_orders()`.

## Debug scripts

Debug scripts with direct DB access or unauthenticated privileged behavior should not be committed. Excluding them from CodeQL is not enough.

Examples to remove or keep out of Git:

- `debug-*.php`.
- `benchmark_*.php`.
- ad-hoc admin bypass scripts.

## Public/private classification

Do not mark these as leaks by default:

- Public artist payment/support fields owned by the artist.
- Public AI/search resources: `llms*`, `.well-known/*`, API catalog, MCP/server card, Agent Skills public resources, schema, Content Signals.

Do flag:

- Secrets, tokens, API keys, SMTP credentials.
- User/customer/order/session data exposed publicly.
- Password reset tokens.
- Private third-party payment/user data.

## CodeQL config notes

`.github/codeql/codeql-config.yml` may exclude generated/vendor/build artifacts to reduce noise. Do not hide real first-party vulnerabilities by excluding active source code.

Typical generated/noise paths:

```yaml
paths-ignore:
  - '**/dist/**'
  - '**/dist-debug/**'
  - '**/build/**'
  - '**/node_modules/**'
  - '**/vendor/**'
  - '**/*.min.js'
```

## PR checklist

- [ ] PHP output escaped.
- [ ] SQL prepared or avoided.
- [ ] REST permissions explicit.
- [ ] `dangerouslySetInnerHTML` sanitized.
- [ ] HTML stripping avoids tag-specific bad filters.
- [ ] No debug scripts committed.
- [ ] Public/private boundary is intentional.
- [ ] CodeQL/dependabot/secret alerts checked when security is in scope.
