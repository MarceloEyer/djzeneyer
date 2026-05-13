# Engineering Guidelines & Technical Laws

Este arquivo contém as regras técnicas inegociáveis para todos os agentes de IA e colaboradores humanos. O descumprimento destas regras é considerado um BUG de alta prioridade.

## ⚛️ React & Frontend (TSX)

1. **Internacionalização (i18next):**
   - TODA string visível ao usuário deve usar `t('chave')`. Strings hardcoded são proibidas.
   - Componentes de classe devem usar o HOC `withTranslation()`.

2. **Data Fetching:**
   - NUNCA use `fetch()` ou `axios` diretamente em componentes. Use os hooks centralizados em `src/hooks/useQueries.ts`.
   - Erros devem ser lançados (`throw`), não retornados silenciosamente.

3. **Sanitização de URLs (`safeUrl`):**
   - `safeUrl(url)` retorna `'#'` (truthy) por padrão.
   - **REGRA:** Nunca use `safeUrl(url) || fallback`. Use sempre o segundo argumento: `safeUrl(url, '/fallback')`.

4. **Estado de Carregamento & Guards:**
   - Guards de rota privada DEVEM usar `loadingInitial` (não `loading`) do `UserContext`.
   - `loadingInitial` (default true) é para restauração de sessão. `loading` (default false) é para ações de clique.

5. **Performance & Memoização:**
   - **Framer Motion:** Objetos `variants`, `whileHover`, `whileTap` NUNCA devem ser inline. Extraia para o escopo de módulo (ex: `const VARIANTS = {...}`).
   - **Intl Formatters:** NUNCA instancie `Intl.DateTimeFormat` ou `Intl.NumberFormat` dentro de renders ou `.map()`. Use `getDateTimeFormatter()` e `getNumberFormatter()` de `src/utils/`.
   - **Arrays Vazios:** Para evitar re-renders infinitos em dependências, use a constante `EMPTY_ARRAY = []` do escopo de módulo em vez de `|| []` inline.

6. **Segurança & SEO:**
   - `DashboardPage` e `MyAccountPage` devem ter `noindex=true` no `HeadlessSEO`.
   - Avatar do usuário nunca deve aparecer em OG tags (privacidade).

## 🐘 PHP & WordPress

1. **GamiPress SSOT:**
   - `gamipress_get_rank_types()` retorna um array associativo onde a chave é o slug.
   - **LEI:** Sempre use `array_values()` antes de acessar o índice `[0]` ou use `reset()`. Acesso direto por `[0]` causará erro fatal se a chave não for numérica.
   - Cache keys devem seguir o padrão: `djz_gamipress_{feature}_CACHE_VERSION_{user_id}`.

2. **WooCommerce (HPOS):**
   - NUNCA faça queries SQL diretas em `wp_posts` para pedidos. Use sempre `wc_get_orders()`.
   - Use `$product->get_permalink()` em vez do core `get_permalink($id)` para evitar overhead de filtros desnecessários.

3. **Imagens & Media:**
   - `get_avatar_url()` e `get_the_post_thumbnail_url()` podem retornar `false`. Garanta coerção para string vazia ou fallback antes do encode JSON.

## 🛠️ Tooling & CI/CD

1. **Vite & Build:**
   - O minificador padrão é o **OXC**. Nunca force `esbuild` no `vite.config.ts`.
   - Aspas tipográficas (“ ”) em JSX quebram o parser OXC. Use aspas retas (" ") ou entidades HTML (`&ldquo;`).

2. **Git & Workflows:**
   - `fetch-depth` nos workflows deve ser `2`.
   - NUNCA use `--no-security-blocking` no Composer sem uma justificativa crítica documentada em `LEARNINGS.md`.

---
*Assinado: Orquestrador de Engenharia (Zen Eyer)*
