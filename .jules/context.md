# Contexto Arquitetural: DJ Zen Eyer
# Última revisão: 2026-03-27

Este documento é a base de contexto para o Jules. Leia antes de qualquer tarefa.

---

## 1. Visão Geral

Plataforma web oficial do DJ Zen Eyer (Marcelo Eyer Fernandes) — Bicampeão Mundial de Brazilian Zouk.
Interface SPA com estética MMORPG (Tribo Zen, XP, Ranks, azul elétrico).
Produção: `djzeneyer.com`

---

## 2. Stack Real (verificar sempre com package.json)

| Camada | Tecnologia atual |
|---|---|
| Frontend | React **19** + TypeScript **6** strict + Vite **8** + Tailwind **4** |
| State/Fetch | React Query **v5** (`@tanstack/react-query`) |
| Roteamento | React Router **7** + i18next (PT e EN) |
| Backend | WordPress 6.9+, PHP **8.3**, WooCommerce 10.5+ (**HPOS ativo**), GamiPress |
| Infra | Hostinger VPS + LiteSpeed + Cloudflare + GitHub Actions |
| Node | 20+ |

**Plugins exclusivos do projeto:**
- `zeneyer-auth` → JWT + Google OAuth (`zeneyer-auth/v1`)
- `zen-seo-lite` → SEO headless dinâmico (`zen-seo/v1`)
- `zen-bit` → Eventos + Bandsintown (`zen-bit/v2`)
- `zengame` → Gamificação, leaderboard, XP (`zengame/v1`)

---

## 3. Regras de Build e Deploy

1. **Build isolado no CI** — sem acesso à API de produção durante o build. Scripts de geração (sitemap, prerender) usam dados locais ou mocks.
2. **Prerender obrigatório** — `scripts/prerender.js` via Puppeteer. Nunca remover. Gera HTML estático de cada rota para evitar 404 em CDN.
3. **SSOT de rotas** — `scripts/routes-config.json`. React Router, sitemap e CI leem este arquivo. Ao criar nova rota, atualizar aqui primeiro.
4. **Vite base path em produção** — `/wp-content/themes/zentheme/dist/`. Assets de `public/` ficam neste caminho, não na raiz do servidor. Para assets que precisam ficar na raiz (favicons, avatares padrão), usar `public/images/` — o CI deploya esta pasta para o webroot.

**Minificador:** OXC (padrão Vite 8). **Nunca usar `minify: 'esbuild'`** — não vem bundled no Vite 8.

---

## 4. SSOT de Data Fetching

`src/hooks/useQueries.ts` é o hub central. **Nunca declarar `fetch()` solto em componentes.**
Toda query usa `useQuery` / `useMutation` do React Query v5 com keys de `QUERY_KEYS` em `src/config/queryClient.ts`.

---

## 5. Armadilhas conhecidas — ler antes de qualquer fix

### Frontend
- **`safeUrl(null)`** retorna `'#'` (string truthy) — `safeUrl(url) || fallback` nunca executa. Sempre: `safeUrl(url, '/fallback.svg')`.
- **`loading` vs `loadingInitial`** no UserContext: `loading` é estado de ação (login/register), default `false`. `loadingInitial` é restauração de sessão, default `true`. Guards de rota privada **devem usar `loadingInitial`** — usar `loading` causa tela branca no CTRL+F5.
- **Vite base path** — assets SVG/PNG em `public/` raiz NÃO chegam ao webroot. Usar `public/images/`.
- **Contextos** — valores de Provider e retornos de hooks globais obrigatoriamente em `useMemo`. Funções expostas em `useCallback`.
- **Classe components** — não podem usar hooks (`useTranslation`). Usar `withTranslation()` HOC da react-i18next.
- **lucide-react 1.x** — ícones de marca (Facebook, Instagram, Youtube) foram **removidos**. Usar `src/components/icons/BrandIcons.tsx` (FacebookIcon, InstagramIcon, YoutubeIcon).

### Backend PHP
- **`gamipress_get_rank_types()`** retorna array **associativo** (chave = slug). Sempre `array_values()` antes de `[0]`.
- **WooCommerce HPOS** — nunca SQL direto em `wp_posts` para pedidos. Usar `wc_get_orders()`.
- **`get_avatar_url()`** e **`get_the_post_thumbnail_url()`** podem retornar `false` (boolean), `null` ou `undefined`.
  Em Zod v4: `z.string().catch('')` (campo obrigatório) ou `z.string().catch('').optional()` (campo opcional).
  ❌ Padrão antigo quebrado: `z.union([z.string(), z.literal(false)])` — falha em null/undefined.

### Cache (ZenGame)
- `CACHE_VERSION = 'v15'` em `ZenGame::CACHE_VERSION`
- Leaderboard: `djz_gamipress_leaderboard_v15_{limit}` — TTL 1h
- Dashboard: `djz_gamipress_dashboard_v15_{user_id}` — TTL 24h
- Stats: `djz_stats_tracks_{uid}` e `djz_stats_events_{uid}` — TTL 6h

---

## 6. SEO / Rotas privadas

- `DashboardPage` e `MyAccountPage` → `<HeadlessSEO noindex />` com OG image genérica.
- Essas rotas ficam **fora do sitemap e do prerender**.
- Avatar do usuário **nunca** deve aparecer em OG tags.

---

## 7. ESLint — escopo obrigatório

`eslint.config.js` deve ignorar: `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules`, `.devcontainer`.
Remover qualquer um causa crash por múltiplos `tsconfigRootDir`.

---

## 8. Hierarquia de contexto (em caso de conflito)

1. Código real (`package.json`, `src/`, `plugins/`) — fonte final
2. `AI_CONTEXT_INDEX.md` — regras globais canônicas
3. `AGENTS.md` — regras operacionais para agentes
4. Este arquivo (`context.md`)
