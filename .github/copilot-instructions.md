# Instrucoes para GitHub Copilot - DJ Zen Eyer

## Idioma
Responda em Portugues Brasileiro.

## Precedencia
- Seguir `AI_CONTEXT_INDEX.md`.
- Em conflito, o codigo do repositorio prevalece.

## Stack atual (2026-04-14)
- Frontend: React 19 + TypeScript 6 strict + Vite 8 + Tailwind 4
- Backend: WordPress 6.9.4 Headless + PHP 8.3 + WooCommerce 10.6.1 (HPOS ativo)
- Database: MariaDB 11.8.6 (nao MySQL — atencao em queries SQL raw)
- Estado/dados: React Query v5 + Context API
- i18n: i18next (PT/EN)
- Routing: React Router 7
- Node: 20+
- Minificador: OXC (Vite 8 default) — nunca adicionar minify: 'esbuild'

## Convencoes
- Data fetching centralizado em `src/hooks/useQueries.ts` (React Query v5) — NUNCA fetch() solto em componentes
- i18n obrigatorio: toda string visivel usa t('chave') — strings hardcoded sao BUG
- Paginas lazy-loaded
- `<HeadlessSEO />` por pagina; rotas privadas usam `noindex={true}`
- Navbar em `src/components/Layout/Navbar.tsx`
- Guards de rota privada usam `loadingInitial` (nao `loading`) do UserContext

## Plugins/Namespaces canonicos
- `zeneyer-auth` -> `zeneyer-auth/v1`
- `zen-seo-lite` -> `zen-seo/v1`
- `zen-bit` -> `zen-bit/v2`
- `zengame` -> `zengame/v1`
- `djzeneyer/v1` -> Core (menus, config, newsletter)

## Restricoes criticas
- NUNCA SQL direto em `wp_posts` para pedidos WooCommerce — usar `wc_get_orders()` (HPOS-compat)
- Nao atualizar ESLint para v11+ (manter v10 do projeto)
- Nao commitar `.env`/credenciais
- Nao adicionar `minify: 'esbuild'` no vite.config.ts
- Nao remover `scripts/prerender.js` do pipeline de build
- WordPress e API headless (sem frontend server-side WordPress)
- lucide-react 1.x: icones de marca (Facebook/Instagram/Youtube) removidos — usar `src/components/icons/BrandIcons.tsx`
- `safeUrl(null)` retorna '#' truthy — usar `safeUrl(url, '/fallback')` com segundo argumento
- Aspas tipograficas em JSX sao rejeitadas pelo OXC — usar `&ldquo;`/`&rdquo;` ou aspas retas

## WooCommerce / GamiPress
- `gamipress_get_rank_types()` retorna array associativo (slug como chave) — sempre `array_values()` antes de `[0]`
- `get_avatar_url()` pode retornar `false` (boolean) — coercao obrigatoria antes de JSON encode
- Polylang: idioma padrao EN sem prefixo de URL; PT usa `/pt/`; passar `?lang=pt` para conteudo traduzido via REST
