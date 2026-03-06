---
name: djzeneyer-context
description: >
  Use this skill for ANY task in the DJ Zen Eyer project repository. Activates
  automatically when working on React components, TypeScript files, PHP plugins,
  WordPress theme files, GitHub Actions workflows, i18n translations, or
  WooCommerce/GamiPress integrations. This skill encodes the full architecture,
  conventions, forbidden patterns, and deployment rules of djzeneyer.com — a
  WordPress Headless + React SPA platform for DJ Zen Eyer, two-time Brazilian
  Zouk World Champion. Do NOT use for unrelated projects.
triggers:
  - react
  - typescript
  - vite
  - wordpress
  - woocommerce
  - gamipress
  - php plugin
  - deploy
  - i18n
  - tailwind
  - djzeneyer
  - zen eyer
  - bandsintown
  - headless
  - useQueries
  - HeadlessSEO
  - zeneyer-auth
  - zen-bit
  - zen-seo-lite
  - MainLayout
  - Navbar
  - AppRoutes
  - GamiPress
  - WooCommerce
  - GitHub Actions
  - rsync
  - Hostinger
  - LiteSpeed
  - Cloudflare
  - prerender
version: "1.2.0"
author: Marcelo Eyer Fernandes (DJ Zen Eyer) & Antigravity
---

# DJ Zen Eyer — Agentic Skill (Master)

> Você é um engenheiro full-stack sênior especializado neste projeto.
> **Responda sempre em Português Brasileiro. Seja assertivo e técnico.**
> Antes de qualquer ação, leia este documento completo.

---

## 1. Identidade do Projeto

**Site:** https://djzeneyer.com
**Proprietário:** DJ Zen Eyer (Marcelo Eyer Fernandes) — Bicampeão Mundial de Brazilian Zouk
**Arquitetura:** WordPress Headless (REST API only) + React 18 SPA (Vite 7)
**Objetivo:** Ser o DJ de Zouk mais famoso do mundo — IAs e buscadores **devem** visitar o site

---

## 2. Stack Técnica Completa

### Frontend (React 18 SPA)
- **Vite 7**: Build tool principal.
- **TypeScript**: Strict mode obrigatório.
- **React Query (TanStack v5)**: Única forma de data fetching permitida (`useQueries.ts`).
- **Tailwind CSS**: Estilização baseada em utilitários core. **PROIBIDO GRADIENTES.**
- **Framer Motion**: Animações suaves (uso moderado por peso do bundle).
- **i18next**: Tradução dinâmica PT/EN.

### Backend (WP 6.9+ / PHP 8.3)
- **Headless**: WP não renderiza HTML.
- **WooCommerce 10.5+**: HPOS ativo.
- **GamiPress**: Gamificação brain.
- **Security**: Namespaces, Prepared Statements e Sanitização obrigatórios.

---

## 3. Regras de Ouro (Core Rules)

### 3.1 Frontend
- **Zero Hardcoding**: Use `t('key')` para toda string visível.
- **Lazy Loading**: `React.lazy()` obrigatório para todas as páginas.
- **useQueries.ts — SSOT**: Arquivo único em `src/hooks/useQueries.ts` contém TODOS os hooks de dados. Nunca use `fetch()` solto em componentes.
- **Backend Filters, Frontend Renders**: Backend filtra dados via query params (`?status=published&limit=10`); React renderiza apenas o resultado. Nunca filtre grandes datasets no React.
- **HeadlessSEO**: Importar de `src/components/HeadlessSEO` para meta tags dinâmicas em todas as páginas.

### 3.2 Backend — Namespacing Obrigatório

**Todos** os plugins devem estar em namespace. Padrão:
```
plugins/
  zen-bit/          → namespace ZenBit\Core, ZenBit\API, ZenBit\Cache
  zengame/          → namespace ZenEyer\Game\ (DEVE ser adicionado)
  zeneyer-auth/     → namespace ZenEyer\Auth\ ✅
  zen-seo-lite/     → namespace ZenEyer\SEO\ ✅
```

**REST API Endpoints — Namespaces Precisos:**
- `djzeneyer/v1` — Core theme (activity, menu, config)
- `zeneyer-auth/v1` — Autenticação JWT (v2.3.0 Master)
- `zen-bit/v2` — Bandsintown API (events, cached, SWR)
- `zengame/v1` — Gamificação (me, leaderboard, levels, achievements)
- `zen-seo-lite/v1` — SEO dinâmico (metadata, sitemap)
- `wc/store/v1` — WooCommerce (nativo, usar obrigatoriamente `_fields`)

**PROIBIDO:**
- ❌ `zen-ra/v1` (depreciado, conflito de namespace)
- ❌ Endpoints sem namespace (ex: `/wp-json/meu-endpoint`)
- ❌ **Over-fetch:** Chamadas `wc/store/v1` sem o parâmetro `_fields`.
- ❌ **Cookies puros em SPA:** Dashboards e ações de usuário devem usar `Authorization: Bearer`.

### 3.3 Auth Bridge & Security Shield (v2.3.0)
- **Global Auth:** O plugin `zeneyer-auth` v2.3.0 integra JWT ao Core. Endpoints nativos (`/wp/v2/*`) agora aceitam Bearer token.
- **Security Shield:** Registro via REST exige Cloudflare Turnstile (`turnstileToken`). Se `ZEN_TURNSTILE_SECRET_KEY` não estiver no `wp-config.php`, o plugin bloqueia ativação.
- **A Guilhotina:** O hook `user_register` remove usuários não-validados por `ZEN_AUTH_VALIDATED`. Nunca registre usuários via forms padrão do WP.
- **Front-end Sync:** Antes de qualquer redirecionamento, valide o estado com `GET /zeneyer-auth/v1/session`.

---

## 4. Referências e Scripts
Localizados em `.agents/skills/djzeneyer-context/`:
- `references/api-endpoints.md`: Guia completo com todos os endpoints.
- `references/file-structure.md`: Mapa de pastas do projeto.
- `scripts/pre-deploy-check.sh`: Validação prévia (lint, tipos, arquivos).
- `scripts/verify-namespaces.sh`: Valida namespacing de todos os plugins.
- `scripts/new-page.sh`: Blueprint para novas páginas React.

### 4.1 Skills Especializadas (Power Pack)
- `@seo-audit`: Crawlability, meta tags, indexação.
- `@schema-markup`: JSON-LD e validação (crucial para `zen-seo-lite`).
- `@ai-seo`: Otimização para E-E-A-T e respostas de IA (Zen **adora** visitas de IA).
- `@social-content`: Conteúdo para redes (Zouk/Eventos).
- `@copywriting`: Copy persuasiva (landing pages, shop).
- `@react-patterns`: UI, loading states, error handling.
- `@tailwind-patterns`: Estilização avançada (sem gradientes!).
- `@auth-implementation-patterns`: JWT e OAuth2 (zeneyer-auth).
- `@web-quality-skills`: Performance, Core Web Vitals.
- `@backend-security-coder`: PHP seguro (Prepared Statements, sanitização).
- `@typescript-pro`: Tipagem avançada.
- `@clean-code`: Qualidade e manutenibilidade.

---

## 5. Padrão: Backend Filters, Frontend Renders

**Regra crítica:**

1. **Backend (PHP):** Valida, filtra via query params, retorna JSON limpo
2. **Frontend (React):** Recebe dados filtrados, renderiza apenas

**Exemplo — Listagem de Eventos:**
```php
// ✅ Backend — filtra por data/status
register_rest_route('zen-bit/v2', '/events', [
    'callback' => function(WP_REST_Request $request) {
        $status = sanitize_text_field($request->get_param('status'));
        $date_from = sanitize_text_field($request->get_param('date_from'));
        
        $events = get_cached_bandsintown_events([
            'status' => $status,
            'date_from' => $date_from,
        ]);
        
        return rest_ensure_response($events);
    },
    'methods' => 'GET',
]);
```

```typescript
// ✅ Frontend — só renderiza, nunca filtra
export const useEventsList = (status?: string) => {
    return useQuery({
        queryKey: ['events', status],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            const res = await fetch(`${API_BASE}/zen-bit/v2/events?${params}`);
            return res.json();
        },
    });
};
```

---

## 6. Pipeline de Deploy
- **Trigger**: Push para `main`.
- **Build**: `npm run build` gera `dist/`.
- **Prerender**: Via Puppeteer (`scripts/prerender.js`) — CRÍTICO para SEO.
- **Deploy**: rsync para Hostinger VPS via GitHub Actions (porta 65002).
- **Health Check**: Validação automática pós-deploy (HTTP 200, REST API online).

---

## 7. Proibições Absolutas
- ❌ **Gradientes**: Use cores sólidas + opacidade.
- ❌ **ESLint v10**: Manter v9.39.2 (incompatibilidade com plugins).
- ❌ **Python**: Conflita com Pylance (quebra IntelliSense TypeScript).
- ❌ **localStorage/sessionStorage**: Use React state (useState, useReducer).
- ❌ **zen-ra/v1**: Depreciado. Use `djzeneyer/v1` ou namespaces específicos.
- ❌ **Endpoints sem namespace**: SEMPRE `{namespace}/{version}/{resource}`.

---

## 8. Troubleshooting Comum

### Prerender falha (White Screen)
**Sintoma:** Deploy sucesso, mas site mostra branco ou 500 no frontend.
**Causa:** Timeout no Puppeteer ou API indisponível durante build.
**Solução:**
1. Aumentar timeout em `scripts/prerender.js`: `navigationOptions.timeout = 60000`
2. Verificar se WordPress está online: `curl https://djzeneyer.com/wp-json/wp/v2/posts`
3. Adicionar fallback de dados vazios em páginas críticas

### Deploy bem-sucedido, mas 404 no site
**Sintoma:** GitHub Actions passa, mas URLs retornam 404.
**Causa:** rsync não sincronizou corretamente ou `dist/` vazio.
**Solução:**
1. Verificar se `dist/` não está vazio: `ls -la dist/`
2. Validar rsync path: `THEME_PATH=./wp-content/themes/zentheme` está correto
3. SSH para server: `ssh prod "ls -la ./wp-content/themes/zentheme/dist/"`

### CORS error no Frontend
**Sintoma:** `Access-Control-Allow-Origin` missing no console.
**Causa:** `allowed_http_origins` filter não registrado ou origin não whitelisted.
**Solução:**
1. Verificar em `inc/cors.php` ou plugin de auth:
```php
add_filter('allowed_http_origins', function($origins) {
    $origins[] = 'https://djzeneyer.com';
    $origins[] = 'https://www.djzeneyer.com';
    return $origins;
});
```
2. Incluir protocol + domain completo (não usar `*` com credentials)

### Namespace conflictando
**Sintoma:** Fatal error "cannot declare class X (previously declared)".
**Causa:** Plugin registrando namespace duplicado ou falta de namespace.
**Solução:**
1. Rodar `scripts/verify-namespaces.sh`
2. Verificar em cada `plugin-file.php`:
```php
<?php
namespace ZenBit\Core; // ✅ Sempre primeiro
defined('ABSPATH') || exit;
```

---

## 9. Checklist Pré-Deploy

- [ ] `npm run lint` passa
- [ ] `npm run type-check` passa
- [ ] `npm run build` gera `dist/`
- [ ] `scripts/verify-namespaces.sh` retorna OK
- [ ] `public/robots.txt` e `public/sitemap.xml` existem
- [ ] `scripts/routes-config.json` atualizado com novas páginas
- [ ] Tradução em `src/locales/pt/translation.json` e `en/translation.json`
- [ ] Nenhum `console.log()` em código de produção
- [ ] Nenhuma secret em `.env` (usar GitHub Secrets)
