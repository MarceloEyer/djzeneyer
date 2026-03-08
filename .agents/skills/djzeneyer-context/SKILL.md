---
name: djzeneyer-context
description: >
  Use this skill for ANY task in the DJ Zen Eyer project repository. Activates
  automatically when working on React components, TypeScript files, PHP plugins,
  WordPress theme files, GitHub Actions workflows, i18n translations, or
  WooCommerce/GamiPress integrations. This skill encodes the full architecture,
  conventions, forbidden patterns, and deployment rules of djzeneyer.com â€” a
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
version: '1.2.0'
author: Marcelo Eyer Fernandes (DJ Zen Eyer) & Antigravity
---

# DJ Zen Eyer â€” Agentic Skill (Master)

> VocÃª Ã© um engenheiro full-stack sÃªnior especializado neste projeto.
> **Responda sempre em PortuguÃªs Brasileiro. Seja assertivo e tÃ©cnico.**
> Antes de qualquer aÃ§Ã£o, leia este documento completo.

---

## 1. Identidade do Projeto

**Site:** https://djzeneyer.com
**ProprietÃ¡rio:** DJ Zen Eyer (Marcelo Eyer Fernandes) â€” BicampeÃ£o Mundial de Brazilian Zouk
**Arquitetura:** WordPress Headless (REST API only) + React 18 SPA (Vite 7)
**Objetivo:** Ser o DJ de Zouk mais famoso do mundo â€” IAs e buscadores **devem** visitar o site

---

## 2. Stack TÃ©cnica Completa

### Frontend (React 18 SPA)

- **Vite 7**: Build tool principal.
- **TypeScript**: Strict mode obrigatÃ³rio.
- **React Query (TanStack v5)**: Ãšnica forma de data fetching permitida (`useQueries.ts`).
- **Tailwind CSS**: EstilizaÃ§Ã£o baseada em utilitÃ¡rios core. **PROIBIDO GRADIENTES.**
- **Framer Motion**: AnimaÃ§Ãµes suaves (uso moderado por peso do bundle).
- **i18next**: TraduÃ§Ã£o dinÃ¢mica PT/EN.

### Backend (WP 6.9+ / PHP 8.3)

- **Headless**: WP nÃ£o renderiza HTML.
- **WooCommerce 10.5+**: HPOS ativo.
- **GamiPress**: GamificaÃ§Ã£o brain.
- **Security**: Namespaces, Prepared Statements e SanitizaÃ§Ã£o obrigatÃ³rios.

---

## 3. Regras de Ouro (Core Rules)

### 3.1 Frontend

- **Zero Hardcoding**: Use `t('key')` para toda string visÃ­vel.
- **Lazy Loading**: `React.lazy()` obrigatÃ³rio para todas as pÃ¡ginas.
- **useQueries.ts â€” SSOT**: Arquivo Ãºnico em `src/hooks/useQueries.ts` contÃ©m TODOS os hooks de dados. Nunca use `fetch()` solto em componentes.
- **Backend Filters, Frontend Renders**: Backend filtra dados via query params (`?status=published&limit=10`); React renderiza apenas o resultado. Nunca filtre grandes datasets no React.
- **HeadlessSEO**: Importar de `src/components/HeadlessSEO` para meta tags dinÃ¢micas em todas as pÃ¡ginas.

### 3.2 Backend â€” Namespacing ObrigatÃ³rio

**Todos** os plugins devem estar em namespace. PadrÃ£o:

```
plugins/
  zen-bit/          â†’ namespace ZenBit\Core, ZenBit\API, ZenBit\Cache
  zengame/          â†’ namespace ZenEyer\Game\ (DEVE ser adicionado)
  zeneyer-auth/     â†’ namespace ZenEyer\Auth\ âœ…
  zen-seo-lite/     â†’ namespace ZenEyer\SEO\ âœ…
```

**REST API Endpoints â€” Namespaces Precisos:**

- `djzeneyer/v1` â€” Core theme (activity, menu, config)
- `zeneyer-auth/v1` â€” AutenticaÃ§Ã£o JWT (v2.3.0 Master)
- `zen-bit/v2` â€” Bandsintown API (events, cached, SWR)
- `zengame/v1` â€” GamificaÃ§Ã£o (me, leaderboard, levels, achievements)
- `zen-seo/v1` â€” SEO dinÃ¢mico (metadata, sitemap)
- `wc/store/v1` â€” WooCommerce (nativo, usar obrigatoriamente `_fields`)

**PROIBIDO:**

- âŒ Endpoints sem namespace (ex: `/wp-json/meu-endpoint`)
- âŒ **Over-fetch:** Chamadas `wc/store/v1` sem o parÃ¢metro `_fields`.
- âŒ **Cookies puros em SPA:** Dashboards e aÃ§Ãµes de usuÃ¡rio devem usar `Authorization: Bearer`.

### 3.3 Auth Bridge & Security Shield (v2.3.0)

- **Global Auth:** O plugin `zeneyer-auth` v2.3.0 integra JWT ao Core. Endpoints nativos (`/wp/v2/*`) agora aceitam Bearer token.
- **Security Shield:** Registro via REST exige Cloudflare Turnstile (`turnstileToken`). Se `ZEN_TURNSTILE_SECRET_KEY` nÃ£o estiver no `wp-config.php`, o plugin bloqueia ativaÃ§Ã£o.
- **A Guilhotina:** O hook `user_register` remove usuÃ¡rios nÃ£o-validados por `ZEN_AUTH_VALIDATED`. Nunca registre usuÃ¡rios via forms padrÃ£o do WP.
- **Front-end Sync:** Antes de qualquer redirecionamento, valide o estado com `GET /zeneyer-auth/v1/session`.

---

## 4. ReferÃªncias e Scripts

Localizados em `.agents/skills/djzeneyer-context/`:

- `references/api-endpoints.md`: Guia completo com todos os endpoints.
- `references/file-structure.md`: Mapa de pastas do projeto.
- `scripts/pre-deploy-check.sh`: ValidaÃ§Ã£o prÃ©via (lint, tipos, arquivos).
- `scripts/verify-namespaces.sh`: Valida namespacing de todos os plugins.
- `scripts/new-page.sh`: Blueprint para novas pÃ¡ginas React.

### 4.1 Skills Especializadas (Power Pack)

- `@seo-audit`: Crawlability, meta tags, indexaÃ§Ã£o.
- `@schema-markup`: JSON-LD e validaÃ§Ã£o (crucial para `zen-seo-lite`).
- `@ai-seo`: OtimizaÃ§Ã£o para E-E-A-T e respostas de IA (Zen **adora** visitas de IA).
- `@social-content`: ConteÃºdo para redes (Zouk/Eventos).
- `@copywriting`: Copy persuasiva (landing pages, shop).
- `@react-patterns`: UI, loading states, error handling.
- `@tailwind-patterns`: EstilizaÃ§Ã£o avanÃ§ada (sem gradientes!).
- `@auth-implementation-patterns`: JWT e OAuth2 (zeneyer-auth).
- `@web-quality-skills`: Performance, Core Web Vitals.
- `@backend-security-coder`: PHP seguro (Prepared Statements, sanitizaÃ§Ã£o).
- `@typescript-pro`: Tipagem avanÃ§ada.
- `@clean-code`: Qualidade e manutenibilidade.

---

## 5. PadrÃ£o: Backend Filters, Frontend Renders

**Regra crÃ­tica:**

1. **Backend (PHP):** Valida, filtra via query params, retorna JSON limpo
2. **Frontend (React):** Recebe dados filtrados, renderiza apenas

**Exemplo â€” Listagem de Eventos:**

```php
// âœ… Backend â€” filtra por data/status
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
// âœ… Frontend â€” sÃ³ renderiza, nunca filtra
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
- **Prerender**: Via Puppeteer (`scripts/prerender.js`) â€” CRÃTICO para SEO.
- **Deploy**: rsync para Hostinger VPS via GitHub Actions (porta 65002).
- **Health Check**: ValidaÃ§Ã£o automÃ¡tica pÃ³s-deploy (HTTP 200, REST API online).

---

## 7. ProibiÃ§Ãµes Absolutas

- âŒ **Gradientes**: Use cores sÃ³lidas + opacidade.
- âŒ **ESLint v10**: Manter v9.39.2 (incompatibilidade com plugins).
- âŒ **Python**: Conflita com Pylance (quebra IntelliSense TypeScript).
- ⚠️ **localStorage/sessionStorage**: permitido apenas para sessao/idioma e com revisao de seguranca.
- âŒ **Endpoints sem namespace**: SEMPRE `{namespace}/{version}/{resource}`.

---

## 8. Troubleshooting Comum

### Prerender falha (White Screen / Timeout)

**Sintoma:** Build demora 10min e falha no GitHub Actions com "Timeout".
**Causa:** Erro de JavaScript (Referência ou Import) que impede o React de inicializar.
**Solução:**

1. Rodar localmente: `npm run dev` e usar um script de Puppeteer para capturar erros de console ocultos.
2. Comum: Erros de "Cannot access X before initialization" no `UserContext`.
3. Comum: Ícones do `lucide-react` não importados.
4. Solução técnica: Garantir que funções usadas em `useEffect` (como `logout`) sejam definidas ANTES do hook no arquivo.

### Caracteres estranhos nas traduções (Encoding)

**Sintoma:** Acentos aparecendo como símbolos (MÃºsica, NavegaÃ§Ã£o).
**Causa:** Arquivo `translation.json` salvo com encoding errado (UTF-8 bytes interpretados como ISO-8859-1).
**Solução:**

1. Re-salvar arquivo como UTF-8 (Strict) sem BOM.
2. Nunca colar textos de fontes externas sem sanitização de encoding.

### Prerender falha no Windows em execução local

**Sintoma:** `spawn npx ENOENT` ou `EINVAL` ao rodar `npm run prerender`.
**Causa:** Node `spawn` no Windows requer `.cmd` e `shell: true`.
**Solução:** Use `process.platform === 'win32'` para ajustar o comando de `npx` para `npx.cmd` no script `prerender.js`.

### Verificar se WordPress está online: `curl https://djzeneyer.com/wp-json/wp/v2/posts`

### Deploy bem-sucedido, mas 404 no site

**Sintoma:** GitHub Actions passa, mas URLs retornam 404.
**Causa:** rsync nÃ£o sincronizou corretamente ou `dist/` vazio.
**SoluÃ§Ã£o:**

1. Verificar se `dist/` nÃ£o estÃ¡ vazio: `ls -la dist/`
2. Validar rsync path: `THEME_PATH=./wp-content/themes/zentheme` estÃ¡ correto
3. SSH para server: `ssh prod "ls -la ./wp-content/themes/zentheme/dist/"`

### CORS error no Frontend

**Sintoma:** `Access-Control-Allow-Origin` missing no console.
**Causa:** `allowed_http_origins` filter nÃ£o registrado ou origin nÃ£o whitelisted.
**SoluÃ§Ã£o:**

1. Verificar em `inc/cors.php` ou plugin de auth:

```php
add_filter('allowed_http_origins', function($origins) {
    $origins[] = 'https://djzeneyer.com';
    $origins[] = 'https://www.djzeneyer.com';
    return $origins;
});
```

2. Incluir protocol + domain completo (nÃ£o usar `*` com credentials)

### Namespace conflictando

**Sintoma:** Fatal error "cannot declare class X (previously declared)".
**Causa:** Plugin registrando namespace duplicado ou falta de namespace.
**SoluÃ§Ã£o:**

1. Rodar `scripts/verify-namespaces.sh`
2. Verificar em cada `plugin-file.php`:

```php
<?php
namespace ZenBit\Core; // âœ… Sempre primeiro
defined('ABSPATH') || exit;
```

---

## 9. Checklist PrÃ©-Deploy

- [ ] `npm run lint` passa
- [ ] `npm run type-check` passa
- [ ] `npm run build` gera `dist/`
- [ ] `scripts/verify-namespaces.sh` retorna OK
- [ ] `public/robots.txt` e `public/sitemap.xml` existem
- [ ] `scripts/routes-config.json` atualizado com novas pÃ¡ginas
- [ ] TraduÃ§Ã£o em `src/locales/pt/translation.json` e `en/translation.json`
- [ ] Nenhum `console.log()` em cÃ³digo de produÃ§Ã£o
- [ ] Nenhuma secret em `.env` (usar GitHub Secrets)

## ERRATA 2026-03-06 (Canonico)

Se houver conflito entre este skill e `AI_CONTEXT_INDEX.md`, siga `AI_CONTEXT_INDEX.md`.

Correcoes obrigatorias:

- Plugin de gamificacao ativo no repo: `zengame` (`zengame/v1`). `zen-ra` foi removido do projeto e qualquer mencao deve ser corrigida.
- Namespace SEO canonico: `zen-seo/v1`.
- Namespace de eventos canonico: `zen-bit/v2`.
- PHP baseline do projeto: 8.1+ (compativel com `zengame`).
- ⚠️ **localStorage/sessionStorage**: permitido apenas para sessao/idioma e com revisao de seguranca.
- Projeto usa Tailwind v3 no momento; nao aplicar regras exclusivas de v4 sem migracao explicita.
