# Styleguide — DJ Zen Eyer
# Instruções de revisão para o Gemini Code Assist
# Responda SEMPRE em Português Brasileiro.

## Stack do Projeto

React 19 + TypeScript 6 strict + Vite 8 (OXC) + Tailwind 4 + React Query v5 + React Router 7 + i18next.
Backend: WordPress 6.9 Headless + PHP 8.3 + WooCommerce 10.5+ (HPOS ativo) + GamiPress.

## Regras Críticas — Bugs Confirmados

### Frontend (src/**/*.tsx)

1. **i18n obrigatório**: Toda string visível ao usuário deve usar `t('chave')` de react-i18next.
   Strings hardcoded em português ou inglês são BUG — severidade HIGH.

2. **React Query SSOT**: Nunca usar `fetch()` diretamente em componentes.
   Data fetching centralizado em `src/hooks/useQueries.ts`.

3. **`safeUrl()` armadilha**: `safeUrl(null)` retorna `'#'` (string truthy).
   `safeUrl(url) || fallback` nunca executa o fallback. Usar `safeUrl(url, '/fallback.svg')`.

4. **Guards de rota privada**: Usar `loadingInitial` (não `loading`) do UserContext.
   `loading` é para ações (login/register), default `false`.
   `loadingInitial` é para restauração de sessão, default `true`.
   Usar `loading` em guards causa tela branca no F5.

5. **Ícones de marca**: Facebook, Instagram, Youtube NÃO existem no lucide-react 1.x.
   Usar `src/components/icons/BrandIcons.tsx`.

6. **Framer Motion variants**: Objetos `variants`, `whileHover`, `whileTap` NUNCA inline no
   corpo do componente — extrair para escopo de módulo (antes do componente).
   Inline cria nova referência a cada render e anula React.memo.

7. **Aspas tipográficas**: Aspas `"` `"` (U+201C/U+201D) em JSX quebram o parser OXC.
   Usar `&ldquo;`/`&rdquo;` ou aspas retas `"`.

8. **SEO em rotas privadas**: `DashboardPage` e `MyAccountPage` devem ter `noindex=true`
   no `<HeadlessSEO>`. Avatar do usuário nunca pode aparecer em OG tags.

9. **Intl formatters**: `Intl.DateTimeFormat` e `Intl.NumberFormat` NUNCA em render ou
   `.map()` sem cache. Usar `getDateTimeFormatter()` e `getNumberFormatter()` de `src/utils/`.

### Backend PHP (plugins/**/*.php)

10. **WooCommerce HPOS**: Nunca SQL direto em `wp_posts` para pedidos.
    Usar `wc_get_orders()` (HPOS ativo).

11. **GamiPress**: `gamipress_get_rank_types()` retorna array associativo (chave = slug).
    Sempre `array_values()` antes de `[0]`.

12. **Retornos falsos PHP**: `get_avatar_url()` e `get_the_post_thumbnail_url()` podem
    retornar `false` (boolean). Coerção obrigatória antes de JSON: `$avatar = $result ?: ''`.

### Schemas Zod (src/schemas/**/*.ts)

13. **PHP retorna `false`** (boolean) quando não há imagem — `z.union([z.string(), z.literal(false)])`
    quebra em `null`/`undefined`. Padrão correto: `z.string().catch('')`.

### Build / CI (.github/workflows/**, vite.config.ts)

14. **Vite 8 OXC**: Nunca adicionar `minify: 'esbuild'` — Vite 8 usa OXC por padrão.
15. **Prerender**: Nunca remover `scripts/prerender.js` — evita tela branca em produção.
16. **fetch-depth CI**: Manter `fetch-depth: 2`, nunca `0`.
17. **ESLint ignores**: `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules`, `.devcontainer`
    devem estar no `ignores` do `eslint.config.js`. Remover qualquer um causa crash.

## Tom de Voz

- Responda sempre em Português Brasileiro.
- Seja direto e técnico. Foque em problemas reais — bugs, riscos de segurança, violações das regras acima.
- Evite comentários de style sem impacto funcional.
- Evite resumir o que o PR faz — foque em problemas e sugestões concretas.
