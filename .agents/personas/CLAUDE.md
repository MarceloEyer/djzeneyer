# CLAUDE.md - DJ Zen Eyer

> Contexto local mais completo para Claude Code neste repositorio.
> Hierarquia canonica: codigo real > `AI_CONTEXT_INDEX.md` > `.agents/GUIDELINES.md` > `.context/IDENTITY.md` > `.context/*.md` > `LEARNINGS.md`.
> Idioma padrao: Portugues Brasileiro.
> Tom de escrita preferido: factual, descritivo, sem autoelogio, sem linguagem promocional, sem imperativos em arquivos publicos de IA.

## Projeto

Site e plataforma oficial de Zen Eyer, nome artistico publico principal de Marcelo Eyer Fernandes, bicampeao mundial de Brazilian Zouk. DJ Zen Eyer e alias importante e historico, mas nao substitui o nome principal.
Pronuncia canonica: **`/zɛn ˈaɪər/`** (IPA) — unica pronuncia correta. Nenhuma outra forma e aceita.
Arquitetura: WordPress headless + React SPA, com frontend pre-renderizado em build time (SSG) e implantado como tema WordPress bilingue EN/PT.
Producao: https://djzeneyer.com

Quando uma afirmacao for publicada em texto visivel, a forma preferida e factual e verificavel: titulo, data, fonte, URL oficial ou numero rastreavel. Linguagem de marketing ou adjetivacao subjetiva tende a ser descartavel por crawlers de IA e nao ajuda o contexto tecnico.

## Stack atual

Versoes exatas em `package.json`. Tecnologias principais:

| Camada | Tecnologia |
|---|---|
| Frontend | React, TypeScript, Vite (OXC minifier padrao), Tailwind, React Query v5, React Router, i18next, react-i18next, Framer Motion |
| Build e qualidade | ESLint, Prettier, Puppeteer |
| Dependencias basicas | dompurify, zod, lucide-react |
| Backend | WordPress / PHP 8.3+ / WooCommerce com HPOS ativo / GamiPress |
| Infra | Hostinger VPS + LiteSpeed + Cloudflare + GitHub Actions |
| Node | ver `package.json#engines` |

## Comandos uteis

```bash
npm run dev                # Vite dev server
npm run build              # TypeScript + Vite build
npm run build:full         # Sitemaps + build + prerender + markdown gen
npm run lint               # ESLint
npm run type-check         # TypeScript sem emitir arquivos
npm run format             # Prettier
npm run i18n:check         # Paridade EN/PT dos locales
npm run utf8:check         # Conteudo UTF-8 limpo
npm run prerender          # SSG via Puppeteer apos build
npm run generate-sitemaps  # Gera sitemap.xml
npm run perf:budget        # Budget de performance
```

Use `npm`, nao `pnpm`. Mudancas de dependencia precisam atualizar `package-lock.json` junto com `package.json`.

## Arquitetura rapida

### Frontend (`src/`)

- Entrada: `src/main.tsx` -> `src/App.tsx` -> `src/components/AppRoutes.tsx`.
- Rotas: `src/config/routes-slugs.json` e helpers como `getLocalizedRoute('key', lang)`. Nao hardcodar paths canonicos como `/about`.
- Data fetching: hooks centralizados em `src/hooks/useQueries.ts` e query keys em `src/config/queryClient.ts`.
- Auth: `UserContext` em `src/contexts/UserContext.tsx`; guards privados usam `loadingInitial`.
- SEO: paginas publicas usam `<HeadlessSEO />`; paginas privadas permanecem `noindex`.
- Icones de marca: `lucide-react` 1.x nao fornece Facebook, Instagram e YouTube; usar `src/components/icons/BrandIcons.tsx`.
- Alias: `@/` resolve para `src/`.

### Backend (`inc/` + `plugins/`)

- `inc/api.php`: rotas REST do tema.
- `inc/spa.php`: rewrites de rotas nao asset para `index.html`.
- `inc/vite.php`: le `dist/manifest.json` e injeta JS/CSS hashados.
- `inc/csp.php`: CSP dinamica com nonce. Nunca remover CSP via `.htaccess`.
- `inc/ai-llm.php`: endpoint de descoberta para IA/LLMs.
- `plugins/zen-bit/`: Events CPT + schema `MusicEvent`.
- `plugins/zeneyer-auth/`: auth, Google OAuth, JWT e newsletter.
- `plugins/zen-seo-lite/`: SEO metadata, schema e sitemap.
- `plugins/zengame/`: gamificacao baseada em GamiPress.

### Build e deploy

- Em producao, assets Vite saem de `/wp-content/themes/zentheme/dist/`.
- Arquivos em `public/` so chegam ao webroot quando o CI os copia explicitamente.
- `scripts/prerender.js` e obrigatorio para SSG e nao deve ser removido.
- Payloads de prerender precisam incluir `menu.en` e `menu.pt`.
- O minificador padrao e OXC. Nunca forcar `minify: 'esbuild'`.

## Relacao com os outros arquivos de contexto

- `AI_CONTEXT_INDEX.md` e o mapa canonico de precedencia e SSOT.
- `AGENTS.md` e o ponto de entrada obrigatorio para agentes.
- `.agents/GUIDELINES.md` e o guia tecnico e operacional do repositorio.
- `.agents/personas/CLAUDE.md` e este arquivo: contexto local completo para Claude Code, sem autoridade superior ao indice canonico.
- `.agents/personas/GEMINI.md` e o override local para Gemini/Jules.
- `.context/ARCHITECTURE.md` e o indice da documentacao tecnica.
- `.context/OPERATIONS.md` guarda decisoes operacionais compartilhadas entre agentes.
- `LEARNINGS.md` concentra aprendizados consolidados por PR, review e portagem.

## Regras factuais e de estilo

- Texto visivel e contexto publico para IA sao melhor tratados como fatos verificaveis, nao como slogan.
- Autoelogio, linguagem promocional e tom de marketing tendem a piorar a qualidade da fonte.
- Claims aceitos: campeonatos, datas, links oficiais, IDs publicos, metricas, fontes externas e SSOTs do repositorio.
- Claims a evitar sem prova: superioridade subjetiva, exageros e adjetivos nao verificaveis.
- Em arquivos publicos rastreados por IA, linguagem imperativa e diretivas de coercao sao contraproducentes.

## Regras operacionais centrais

### i18n

- Toda string visivel usa `t('chave')` via `useTranslation()`.
- Chaves novas entram em `src/locales/pt/translation.json` e `src/locales/en/translation.json`.
- Texto hardcoded em interface e considerado bug quando existe estrutura i18n.
- Arquivos de locale devem permanecer em UTF-8 limpo, sem mojibake.

### Data fetching

- `fetch()` direto em componente nao faz parte do padrao do projeto.
- O fluxo canonico de dados do frontend passa por `src/hooks/useQueries.ts`.
- Query keys devem seguir `QUERY_KEYS` em `src/config/queryClient.ts`.

### SEO e rotas

- Rotas publicas usam `<HeadlessSEO />`.
- Rotas privadas, como `dashboard` e `my-account`, usam `noindex` e OG image generica.
- Avatar do usuario nao aparece em OG tags.
- Nova rota publica exige atualizacao em `src/config/routes-slugs.json` e sincronizacao de locales.
- URLs canonicas usam `getLocalizedRoute()`; paths hardcoded como `/about` viram divida tecnica.

### Performance

- Pagineamento e listas preferem lazy loading com `React.lazy()` + `Suspense` quando o escopo justificar.
- Providers usam `useMemo`; funcoes derivadas usam `useCallback` quando a estabilidade de referencia importa.
- Em PHP, evitar N+1 com `_prime_post_caches()` e `update_meta_cache()`.
- Endpoints de lista nao devem depender de `_embed` como atalho.

### PHP e WordPress

- WooCommerce com HPOS ativo usa `wc_get_orders()`, nao SQL em `wp_posts`.
- `get_param()` precisa de sanitizacao.
- SQL usa prepared statements.
- `gamipress_get_rank_types()` retorna array associativo; `array_values()` antes de acessar `[0]` e um padrao recorrente.
- `get_avatar_url()` e `get_the_post_thumbnail_url()` podem retornar `false`; o fallback precisa ser explicito.

## Decisoes consolidadas

Esses pontos ja aparecem em PRs, reviews, docs ou codigos atuais e nao devem ser re-sugeridos como novidade sem motivo concreto:

- Arquitetura de identidade hibrida: `ARTIST_SCHEMA_BASE` (`@type: Person`, `@id: /#artist`) representa o individuo biografico; `MUSICGROUP_SCHEMA` (`@type: MusicGroup`, `@id: /#musicgroup`) representa a marca artistica/projeto musical. Os dois nos coexistem no grafo, ligados por `member`/`memberOf`. `MusicGroup` suporta `album`/`track`, propriedades ausentes em `Person`. Nunca fundir em um unico no com `@type: ['Person', 'MusicGroup']`.
- ORCID nao entra no grafo do artista.
- `sameAs` usa apenas URLs oficiais aprovadas.
- O canal YouTube oficial e o unico canal de YouTube em `sameAs`.
- Em `src/data/artistData.ts`, as chaves `social.YouTube` e `social.YouTubeMusic` usam Y e T maiusculos. Nao usar `social.youtube` nem `social.youtubeMusic` — essas variantes lowercase nao existem no objeto.
- `q4` e `q5` em FAQ so existem quando a chave do locale atual existe.
- Se um PR duplica outro tema, a portagem valida vai para o branch canonico e o duplicado pode ser fechado.
- PRs de dependencia precisam atualizar `package-lock.json` junto com `package.json`.
- Review de bots deve ser tratado como triagem automatica, nao como verdade final.
- Comentarios de `rate limit exceeded` indicam saturacao, nao validacao tecnica.
- Padroes de performance em SEO e listas devem priorizar single-pass, cache priming e estabilidade de referencia.
- O embedded music player foi removido intencionalmente. Nao reintroduzir sem decisao explicita.

## Armadilhas conhecidas

- `safeUrl(null)` retorna `'#'`; usar fallback explicito evita falso positivo em logica booleana.
- `loadingInitial` e o estado seguro para guardas de rota privada; `loading` nao substitui esse papel.
- `lucide-react` 1.x removeu alguns icones de marca, como Facebook, Instagram e YouTube; o projeto usa `BrandIcons.tsx` quando necessario.
- `localStorage` e `sessionStorage` nao estao proibidos globalmente, mas ficam restritos a sessao e idioma quando ja adotados.
- `ChunkLoadError` ao clicar em links apos deploy normalmente significa aba aberta/HTML cacheado usando bundle anterior; preservar `dist/assets` antigos no deploy e manter recuperacao client-side antes de culpar rota ou React Router.
- `speakable` e intencional em algumas paginas; `cssSelector` so faz sentido para seletores que existem no DOM.
- MusicEvent precisa manter campos obrigatorios, com fallback quando a fonte nao entrega tudo:
  - `eventStatus`
  - `endDate`
  - `location.address`
  - `description`
  - `image`
  - `offers`
  - `performer`

## Aprendizados recentes refletidos em contexto

- `ARTIST_SCHEMA_BASE` (`Person`, `/#artist`) e `MUSICGROUP_SCHEMA` (`MusicGroup`, `/#musicgroup`) sao os dois nos canonicos de identidade, ambos exportados de `artistData.ts`. A `MusicPage` usa `MUSICGROUP_SCHEMA` + `ItemList` gerado de `DISCOGRAPHY`. A homepage injeta os dois no `@graph`.
- FAQ expansivel ficou dependente de `i18n.exists()` para evitar render de chave ausente.
- Copy de clipboard em Press Kit precisa de `catch` e reset de estado.
- Dependencia vulneravel sem lockfile sincronizado nao e remediacao completa.
- Em sitemaps, listas e schema, single-pass e cache priming reduziram retrabalho e N+1.
- O workflow de review automatizado depende de `@coderabbitai review`, `@codex review` e `@jules` nos eventos certos.

## Validacao local

Scripts disponiveis no `package.json`:

- `npm run lint`
- `npm run type-check`
- `npm run build`
- `npm run build:full`
- `npm run i18n:check`
- `npm run utf8:check`
- `npm run perf:budget`

## Observacao final

Se surgir conflito entre este arquivo e `AI_CONTEXT_INDEX.md`, vale a hierarquia definida no indice canonico. Este arquivo existe para concentrar o contexto mais util para Claude Code sem criar uma segunda fonte de verdade na raiz do repositorio.
