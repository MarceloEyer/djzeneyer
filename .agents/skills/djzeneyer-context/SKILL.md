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
version: '1.2.1'
author: Marcelo Eyer Fernandes (DJ Zen Eyer) & Antigravity (Restored 2026-03-26)
---

# DJ Zen Eyer — Agentic Skill (Master)

> Você é um engenheiro full-stack sênior especializado neste projeto.
> **Responda sempre em Português Brasileiro. Seja assertivo e técnico.**
> Antes de qualquer ação, leia este documento completo.

---

## 1. Identidade do Projeto

**Site:** https://djzeneyer.com
**Proprietário:** DJ Zen Eyer (Marcelo Eyer Fernandes) — Bicampeão Mundial de Brazilian Zouk
**Arquitetura:** WordPress Headless (REST API only) + React 19 SPA (Vite 8)
**Objetivo:** Ser o DJ de Zouk mais famoso do mundo — IAs e buscadores **devem** visitar o site

---

## 2. Stack Técnica Completa

### Frontend (React 19 SPA)

- **Vite 8**: Build tool principal (OXC/Rolldown — não usar `minify: 'esbuild'`).
- **TypeScript**: Strict mode obrigatório.
- **React Query (TanStack v5)**: Única forma de data fetching permitida (`useQueries.ts`).
- **Tailwind 4**: Estilização baseada em utilitários. **PROIBIDO GRADIENTES em headlines.**
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
- **Hybrid Prerender (Bandsintown)**: Durante o build, o `prerender.js` e o `generate-sitemap.js` buscam dados prioritariamente da **API interna do WordPress** (com fallback técnico ao Bandsintown usando credenciais `id_15619775`). Isso garante estabilidade contra limites e bloqueios de API externa.
- **Defensive Coding (News/Events)**: Sempre use optional chaining (`?.`) ao acessar propriedades de objetos vindos da API (ex: `post?.title?.rendered`). Falhas no mock do prerender ou dados incompletos da API não devem causar quebra fatal (White Screen) do build ou runtime.
- **Papel do `index.html`**: É um **Vite Template**. Nunca servido diretamente pelo WordPress. Base para Build/Prerender/Dev.

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
- `zen-seo/v1` — SEO dinâmico (metadata, sitemap)
- `wc/store/v1` — WooCommerce (nativo, usar obrigatoriamente `_fields`)

**PROIBIDO:**

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
- `@ai-seo`: Otimização para E-E-A-T e respostas de IA (Zen adora visitas de IA).
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
- ❌ **ESLint v11+**: Não atualizar além de v10 (incompatibilidade com plugins React).
- ❌ **Python**: Conflita com Pylance (quebra IntelliSense TypeScript).
- ⚠️ **localStorage/sessionStorage**: permitido apenas para sessao/idioma e com revisao de seguranca.
- ❌ **Endpoints sem namespace**: SEMPRE `{namespace}/{version}/{resource}`.
- ❌ **Mojibake / Erros de Encoding**: Proibido caracteres estranhos (Ã§, Ã£) em arquivos `translation.json`. Use acentos normais em UTF-8.
- ❌ **Exclusão de Diretórios Vitalícios**: PROIBIDO deletar `.bolt`, `.jules` ou `.devcontainer`. Não são obsoletos.
- ❌ **Remoção de PWA/Manifest**: PROIBIDO remover lógica de PWA (`site.webmanifest`) ou service workers.
- ❌ **Remoção de Paginas Detalhe**: PROIBIDO remover renderização de slug/evento individual em `NewsPage` e `EventsPage`.
- ❌ **Linguagem de "Alucinação"**: Nunca rotule código funcional como erro de IA sem checar os arquivos físicos.
- ❌ **JS Inline no index.html**: Proibido usar `onload`, `onclick` ou blocos `<script>` (com exceções de analytics com nonce) para permitir CSP estrito.

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
5. **Nota sobre Logout:** No `UserContext`, a função `logout` é **síncrona**. Não usar `async/await` ao chamá-la em componentes (ex: `MyAccountPage`).

### Caracteres estranhos nas traduções (Encoding)

**Sintoma:** Acentos aparecendo como símbolos (Música, Navegação).
**Causa:** Arquivo `translation.json` salvo com encoding errado (UTF-8 bytes interpretados como ISO-8859-1).
**Solução:**

1. Re-salvar arquivo como UTF-8 (Strict) sem BOM.
2. Nunca colar textos de fontes externas sem sanitização de encoding.
3. **Prevenção:** Se você vir `Ã§` ou similar no log do terminal ao ler o arquivo, PARE e corrija antes de qualquer edit.

### Prerender falha no Windows em execução local

**Sintoma:** `spawn npx ENOENT` ou `EINVAL` ao rodar `npm run prerender`.
**Causa:** Node `spawn` no Windows requer `.cmd` e `shell: true`.
**Solução:** Use `process.platform === 'win32'` para ajustar o comando de `npx` para `npx.cmd` no script `prerender.js`.

### Verificar se WordPress está online: `curl https://djzeneyer.com/wp-json/wp/v2/posts`

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

## ERRATA (Canônico — última revisão 2026-03-26)

Se houver conflito entre este skill e `AI_CONTEXT_INDEX.md`, siga `AI_CONTEXT_INDEX.md`.

Correções obrigatórias:

- **Stack atual:** React 19, Vite 8 (OXC), Tailwind 4, PHP 8.3
- Plugin de gamificação ativo: `zengame` (`zengame/v1`). `zen-ra` foi removido.
- Namespace SEO canônico: `zen-seo/v1`
- Namespace de eventos canônico: `zen-bit/v2`
- PHP baseline: 8.1+ (zengame exige 8.1; produção roda 8.3)
- **Tailwind:** Projeto usa v4 (não v3). Não aplicar convenções de v3 (`tailwind.config.js` class-based).
- **ESLint:** Versão atual é v10. Não atualizar para v11+.
- ⚠️ **localStorage/sessionStorage**: permitido apenas para sessão/idioma e com revisão de segurança.
- **Tipagem de Perfil:** `ProfileUpdatePayload` em `useQueries.ts` deve incluir campos customizados (`real_name`, `dance_role`, `gender`, etc.).
- **GamiPress:** `gamipress_get_rank_types()` é associativo — usar `array_values()` antes de `[0]`.
- **WooCommerce HPOS:** Nunca SQL direto em `wp_posts` para pedidos — usar `wc_get_orders()`.
