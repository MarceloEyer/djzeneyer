# Router decision tree — djzeneyer.com (v2)

Adaptado do WordPress/agent-skills para o contexto específico do projeto.

## Step 1: Classify repo kind

Este repo é **wp-headless + wp-site**: WordPress como backend API headless com React SPA como frontend separado.

Não é:
- ❌ `wp-block-theme` (tema clássico, não block theme)
- ❌ `wp-block-plugin` (nenhum bloco Gutenberg customizado)
- ❌ `gutenberg` / `wp-core`

## Step 2: Route by user intent

### Backend WordPress (PHP)

| Intent keywords | Skill |
|-----------------|-------|
| Plugin bug, plugin feature, hooks, `add_action`, `add_filter` | `wp-plugin-development` |
| REST route, `register_rest_route`, `permission_callback`, 401/403/404 | `wp-rest-api` |
| Slow endpoint, N+1, transient, cache, TTFB | `wp-performance` |
| `wp` command, SSH, cache flush, DB export, rewrite | `wp-wpcli-and-ops` |
| JWT, Google OAuth, CORS, auth headers | `wp-headless` + `auth-implementation-patterns` |
| GamiPress, pontos, conquistas, ranks | `wp-plugin-development` + `wp-rest-api` |
| Nonce, sanitize, escape, SQL injection, capability | `backend-security-coder` |
| Sitemap, Schema.org, meta tags, hreflang | `seo-audit` + `schema-markup` |

### Frontend React/TypeScript

| Intent keywords | Skill |
|-----------------|-------|
| React component, hook, `useQuery`, `useQueries.ts` | `react-patterns` + `react-best-practices` |
| TypeScript type, interface, `any`, type error | `typescript-pro` |
| Route, `routes.ts`, slug, `routes-slugs.json` | `djzeneyer-context` |
| Tailwind class, CSS, style | `tailwind-patterns` |
| Performance, bundle, lazy load, LCP, CLS | `web-performance-optimization` |

### Cross-cutting

| Intent keywords | Skill |
|-----------------|-------|
| Code smell, refactor, DRY, SRP | `clean-code` |
| Full stack feature (PHP + React) | `wp-headless` → then route to backend + frontend skills |
| Schema.org, JSON-LD, SEO técnico | `schema-markup` + `seo-audit` |

## Step 3: Guardrails checklist (always)

- [ ] Confirm if change affects production (Hostinger VPS) or only local dev
- [ ] Confirm if PHP change requires `wp cache flush` + `wp rewrite flush --hard` after deploy
- [ ] Confirm if slug change requires update in `src/config/routes-slugs.json` (SSOT)
- [ ] Confirm if REST endpoint change requires update in `zen-plugins-overview.php`
- [ ] Confirm no `$wpdb` SQL without `$wpdb->prepare()`
- [ ] Confirm no `fetch()` directly in React components (use React Query in `useQueries.ts`)

## Step 4: Skills available in this project

```
.agents/skills/
  wordpress-router/       ← YOU ARE HERE (use first)
  wp-headless/            ← REST API + React SPA architecture
  wp-plugin-development/  ← plugin hooks, Settings API, security
  wp-rest-api/            ← register_rest_route, args, auth
  wp-performance/         ← N+1, transients, LiteSpeed
  wp-wpcli-and-ops/       ← SSH, wp commands, CI/CD ops
  backend-security-coder/ ← OWASP, nonces, SQL safety
  clean-code/             ← Uncle Bob, DRY, SRP
  auth-implementation-patterns/
  react-best-practices/
  react-patterns/
  typescript-pro/
  tailwind-patterns/
  djzeneyer-context/      ← convenções específicas do projeto
  schema-markup/
  seo-audit/
  seo-authority-builder/
  seo-meta-optimizer/
  seo-content-planner/
  web-performance-optimization/
  copywriting/
  social-content/
```
