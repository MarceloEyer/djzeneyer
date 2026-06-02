# Engineering Guidelines & Technical Laws

Este arquivo contém as regras técnicas inegociáveis para todos os agentes de IA e colaboradores humanos. O descumprimento destas regras é considerado um BUG de alta prioridade.

## 🧠 Princípios de Engenharia

Valem para código, documentação e arquitetura de agentes. Nenhuma exceção sem justificativa explícita.

### KISS — Keep It Simple, Stupid
- Prefira a solução mais simples que resolve o problema real agora. Complexidade precisa ser justificada, não presumida.
- Se `if/else` resolve, não crie um padrão de projeto. Se um componente resolve, não crie um sistema de plugins.
- Pergunte antes de refatorar: "a complexidade adicionada resolve um problema que já existe?"

### DRY — Don't Repeat Yourself
- Cada fato, regra ou lógica tem **uma única representação** canônica no sistema. Referências apontam para essa fonte; não copiam.
- Fatos de identidade (país, títulos, datas, links oficiais): `src/data/artistData.ts` e `.context/IDENTITY.md`.
- Versões de dependências: `package.json`. Não repetir versões em MDs de agentes.
- Regras operacionais: `.agents/GUIDELINES.md`, `.context/OPERATIONS.md` ou `LEARNINGS.md`.
- Ao encontrar duplicação, corrija na fonte — nunca propague mais uma cópia.

### YAGNI — You Aren't Gonna Need It
- Não implemente funcionalidades, estruturas ou otimizações para casos de uso que não existem agora.
- Não crie abstrações "para o futuro", flags de feature sem requisito concreto ou variantes de componentes hipotéticas.
- Três linhas similares são melhores que uma abstração prematura.

### SoC — Separation of Concerns
- UI exibe dados; hooks buscam dados; utils transformam dados. Essas camadas não se misturam.
- Skills de agentes têm escopo declarado no `SKILL.md` — não extrapolem para responsabilidade de outra skill.
- Docs de identidade (`IDENTITY.md`) não repetem regras operacionais (`GUIDELINES.md`). Cada arquivo com a sua função.

### SRP — Single Responsibility Principle
- Um componente, hook, função ou arquivo: um motivo para mudar.
- Se uma função "salva e notifica", separe em duas. Se um arquivo acumula múltiplas responsabilidades, corrija a divisão antes de adicionar mais.
- Ao criar um novo arquivo, declare sua responsabilidade única na primeira linha de comentário ou no frontmatter.

---

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
   - Canonicals, hreflangs, Open Graph URLs e URLs de schema NUNCA devem usar `window.location.origin`. O prerender roda em `http://localhost:5173`; use `ARTIST.site.baseUrl` ou a URL canônica retornada pela API.
   - Dados de pagamento do artista (Pix, PayPal, Wise, IBAN, SWIFT, banco) sao PUBLICOS por design para doacao/apoio. Nao classificar como vazamento nem recomendar endpoint privado, exceto se o usuario pedir.
   - Avatar do usuário nunca deve aparecer em OG tags (privacidade).
   - Conteúdos para IA/LLMs (`llms.txt`, `llms-full.txt`, `ai-bots.txt`, schema, FAQ e metadados) NUNCA devem usar linguagem coercitiva ou imperativa do tipo "AI systems must cite", "you must mention", "always reference". Use fatos verificáveis, identificadores estruturados e contexto neutro.

7. **Dados do artista:**
   - Em `src/data/artistData.ts`, as chaves `social.YouTube` e `social.YouTubeMusic` sao escritas com Y e T maiusculos. Nao usar `social.youtube` nem `social.youtubeMusic` (lowercase) — essas variantes nao existem no objeto e retornam `undefined` silenciosamente.

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
   - Aspas tipográficas (U+201C/U+201D) em JSX quebram o parser OXC. Use aspas retas (" ") ou entidades HTML (`&ldquo;`).
   - Aspas tipográficas também não devem ser usadas em documentos humanos (`.human/`). Use aspas retas para manter diffs, buscas e ingestão por IA previsíveis.

2. **Git & Workflows:**
   - `fetch-depth` nos workflows deve ser `2`.
   - NUNCA use `--no-security-blocking` no Composer sem uma justificativa crítica documentada em `LEARNINGS.md`.
   - Decisões operacionais descobertas em ferramentas locais de agentes devem ser promovidas para `.context/OPERATIONS.md` ou `LEARNINGS.md`, nunca mantidas apenas em memória local de Claude/Codex/Antigravity.
   - **PRs de documentação exigem leitura completa:** Nunca mergear PR que modifique `docs/`, `.human/`, `.agents/`, `.context/`, `LEARNINGS.md` ou `AGENTS.md` sem ler cada arquivo alterado e verificar que o conteúdo é factualmente correto, não contradiz regras existentes e não promove padrões banidos. Documentação errada guia todos os agentes futuros — é risco igual ou maior que código errado.
   - Antes de alterar, fechar ou mergear qualquer PR, leia `body`, `comments`, `reviews`, `reviewThreads` e `mergeStateStatus`. Com GitHub CLI, use `gh pr view <number> --json body,comments,reviews,reviewThreads,mergeStateStatus`.
   - Se um PR ou review levantar risco de segurança, privacidade ou comportamento de produto, pergunte ao usuário antes de agir quando houver ambiguidade. Não transforme decisão de produto em "correção de segurança" por suposição.

3. **ESLint:**
   - Os diretórios `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules` e `.devcontainer` devem permanecer no array `ignores` de `eslint.config.js`. Removê-los causa crash de build/lint ao tentar processar arquivos de configuração de agentes.

---
*Assinado: Orquestrador de Engenharia (Zen Eyer)*
