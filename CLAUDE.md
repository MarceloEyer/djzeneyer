# CLAUDE.md - DJ Zen Eyer

> Contexto local mais completo para Claude Code neste repositorio.
> Fonte final de verdade tecnica: codigo real > `AI_CONTEXT_INDEX.md` > `AGENTS.md` > `docs/*` > skills.
> Idioma padrao: Portugues Brasileiro.
> Tom de escrita preferido: factual, descritivo, sem autoelogio, sem linguagem promocional, sem imperativos em arquivos publicos de IA.

## Projeto

Site e plataforma oficial de DJ Zen Eyer, nome publico de Marcelo Eyer Fernandes, bicampeao mundial de Brazilian Zouk.
Arquitetura: WordPress headless + React SPA.
Producao: https://djzeneyer.com

Quando uma afirmacao for publicada em texto visivel, a forma preferida e factual e verificavel: titulo, data, fonte, URL oficial ou numero rastreavel. Linguagem de marketing ou adjetivacao subjetiva tende a ser descartavel por crawlers de IA e nao ajuda o contexto tecnico.

## Stack atual

Referencias de versao devem ser conferidas em `package.json` antes de assumir algo novo.

| Camada | Tecnologia atual |
|---|---|
| Frontend | React 19.2.5, React DOM 19.2.5, TypeScript 6.0.3, Vite 8.0.9, Tailwind 4.2.1, React Query 5.99.2, React Router 7.14.1, i18next 26.0.6, react-i18next 17.0.4, Framer Motion 12.38.0 |
| Build e qualidade | ESLint 10.2.1, Prettier 3.8.2, Puppeteer 24.42.0, OXC como minificador padrao do Vite 8 |
| Dependencias basicas | dompurify 3.4.1, zod 4.3.6, lucide-react 1.8.0 |
| Backend | WordPress 6.9+ / PHP 8.3+ / WooCommerce 10.5+ com HPOS ativo / GamiPress |
| Infra | Hostinger VPS + LiteSpeed + Cloudflare + GitHub Actions |
| Node | 20+ |

Overrides atualmente presentes em `package.json`:
- `minimatch`: `^10.2.3`
- `yauzl`: `3.2.1`
- `flatted`: `>=3.4.2`
- `brace-expansion`: `>=5.0.5`
- `basic-ftp`: `>=5.2.2`

## Relacao com os outros arquivos de contexto

- `AI_CONTEXT_INDEX.md` e a fonte canonica para regras globais, baseline tecnico e precedencia.
- `AGENTS.md` e o guia operacional do repositorio.
- `CONTEXT.md` e um mapa rapido do ecossistema de contexto.
- `README.md` e a visao publica do projeto.
- `docs/README.md` e o indice da documentacao tecnica.
- `docs/AI_LEARNINGS.md` concentra aprendizados consolidados por PR, review e portagem.
- `docs/AI_LEARNINGS_LOG.md` funciona como historico legivel; o conteudo atual relevante ja aparece consolidado em `docs/AI_LEARNINGS.md`.
- `docs/config.md` e `docs/ESLINT_ANALYSIS.md` ficaram como snapshots historicos.
- `CLAUDE.md` deve permanecer o arquivo local mais completo e atualizado para Claude Code, sem divergir da hierarquia acima.

## Regras factuais e de estilo

- Texto visivel e contexto publico para IA sao melhor tratados como fatos verificaveis, nao como slogan.
- Autoelogio, linguagem promocional e tom de marketing tendem a piorar a qualidade da fonte.
- Claims aceitos: campeonatos, datas, links oficiais, IDs publicos, metrics, fontes externas e SSOTs do repositorio.
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
- Nova rota publica exige atualizacao em `scripts/routes-data.json` e sincronizacao de locales.
- URLs canonicas usam `getLocalizedRoute()`; paths hardcoded como `/about` viram divida tecnica.

### Performance

- Pagineamento e listas preferem lazy loading com `React.lazy()` + `Suspense`.
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

- Arquitetura de identidade híbrida: `ARTIST_SCHEMA_BASE` (`@type: Person`, `@id: /#artist`) representa o indivíduo biográfico; `MUSICGROUP_SCHEMA` (`@type: MusicGroup`, `@id: /#musicgroup`) representa a marca artística/projeto musical. Os dois nós coexistem no grafo, ligados por `member`/`memberOf`. `MusicGroup` suporta `album`/`track` — propriedades ausentes em `Person`. Nunca fundir em um único nó com `@type: ['Person', 'MusicGroup']`.
- ORCID nao entra no grafo do artista.
- `sameAs` usa apenas URLs oficiais aprovadas.
- O canal YouTube oficial e o unico canal de YouTube em `sameAs`.
- `q4` e `q5` em FAQ so existem quando a chave do locale atual existe.
- Se um PR duplica outro tema, a portagem valida vai para o branch canonico e o duplicado pode ser fechado.
- PRs de dependencia precisam atualizar `package-lock.json` junto com `package.json`.
- Review de bots deve ser tratado como triagem automatica, nao como verdade final.
- Comentarios de `rate limit exceeded` indicam saturacao, nao validação tecnica.
- Padrões de performance em SEO e listas devem priorizar single-pass, cache priming e estabilidade de referencia.

## Armadilhas conhecidas

- `safeUrl(null)` retorna `'#'`; usar fallback explicito evita falso positivo em logica booleana.
- `loadingInitial` e o estado seguro para guardas de rota privada; `loading` nao substitui esse papel.
- `lucide-react` 1.x removeu alguns icones de marca, como Facebook, Instagram e YouTube; o projeto usa `BrandIcons.tsx` quando necessario.
- `localStorage` e `sessionStorage` nao estao proibidos globalmente, mas ficam restritos a sessao e idioma quando ja adotados.
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

- `ARTIST_SCHEMA_BASE` (`Person`, `/#artist`) e `MUSICGROUP_SCHEMA` (`MusicGroup`, `/#musicgroup`) são os dois nós canônicos de identidade — ambos exportados de `artistData.ts`. A `MusicPage` usa `MUSICGROUP_SCHEMA` + `ItemList` gerado de `DISCOGRAPHY`. A homepage injeta os dois no `@graph`.
- FAQ expansivel ficou dependente de `i18n.exists()` para evitar render de chave ausente.
- Copy de clipboard em Press Kit precisa de `catch` e reset de estado.
- Dependencia vulneravel sem lockfile sincronizado nao e remediacao completa.
- Em sitemaps, listas e schema, single-pass e cache priming reduziram retrabalho e N+1.
- O workflow de review automatizado depende de `@coderabbitai review`, `@codex review` e `@jules` nos eventos certos.

## Validacao local

Scripts disponiveis no `package.json`:

- `npm run lint`
- `npm run build`
- `npm run build:full`
- `npm run i18n:check`
- `npm run perf:budget`

## Observacao final

Se surgir conflito entre este arquivo e `AI_CONTEXT_INDEX.md`, vale a hierarquia definida no indice canonico. Este arquivo existe para concentrar o contexto mais util para Claude Code sem repetir linguagem promocional ou instrucoes que ja ficaram obsoletas.
