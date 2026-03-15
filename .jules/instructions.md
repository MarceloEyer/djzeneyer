# Instruções Operacionais Estritas para o Jules

Este documento define regras de comportamento não negociáveis com base no `AI_CONTEXT_INDEX.md` e `AGENTS.md` do DJ Zen Eyer.

## 1. Idioma
- **Obrigatório:** Comunique-se, pense e documente **sempre em Português Brasileiro**.

## 2. Ordem de Precedência (Obrigatória)
Em caso de divergência ou dúvida sobre qualquer funcionalidade ou arquitetura, siga estritamente esta ordem para tomar decisões:
1. **Código real do repositório** (fonte final: `package.json`, `functions.php`, `inc/`, `plugins/*`, `src/*`).
2. **`AI_CONTEXT_INDEX.md`** (Fonte Canônica de Arquitetura e Decisões consolidadas).
3. **`AGENTS.md`**.
4. Skills em `.agents/skills/*`.

## 3. Regras de Código Front-end (React/Vite)
- **i18n:** Todo texto visível deve usar o hook de tradução (`t('chave')`) via `i18next`. **Nunca** use hardcode de strings nas UIs.
- **Data Fetching:** **Proibido** usar `fetch()` ou chamadas de API diretamente nos componentes de página.
  - Todo data fetching do React deve ser feito através de hooks customizados centralizados em `src/hooks/useQueries.ts` (React Query v5).
- **SEO por Página:** Toda nova página ou rota deve obrigatoriamente usar o componente `<HeadlessSEO />` passando os parâmetros corretos para metadados e schema.
- **Roteamento:**
  - As rotas são dual-language (Inglês como padrão `/about` e Português em `/pt/about`).
  - Rotas são definidas de forma estática no `scripts/routes-config.json`. Nenhuma rota no Vite/React deve divergir desse arquivo (Single Source of Truth).
- **Memoização de Contextos:** (Referência `bolt.md`) Ao trabalhar com a Context API, o valor do Provider (o prop `value={value}`) e o retorno de hooks costumizados globais (ex: `useGamiPress`, `useCart`) **devem obrigatoriamente** estar dentro de um `useMemo` para evitar que toda a árvore de componentes renderize em cascata quando um pedaço independente do contexto for atualizado.
- **Design:** Não implemente gradientes chamativos em títulos ou blocos; use o padrão "Zen Tribe" (Azul elétrico para destaques, design limpo, premium e imersivo com inspirações MMORPG).

## 4. Regras de Código Back-end (WordPress/PHP)
- **Namespaces:** É obrigatório respeitar os namespaces das APIs REST. Todo novo endpoint precisa ter o respectivo prefixo (`djzeneyer/v1`, `zen-bit/v2`, `zengame/v1`, `zen-seo/v1`, `zeneyer-auth/v1`).
- **Segurança PHP:** Toda interação com banco ou query params deve usar prepared statements e escaping apropriado. Retornos de `$request->get_param()` devem ser validados/sanitizados.
- **Payloads Enxutos:** (Referência `bolt.md`) Nunca faça fetch desnecessário. Ao usar a REST API nativa `wp/v2` ou `wc/store/v1`, sempre inclua `_fields` para minimizar o tamanho da resposta. **Evite** `_embed`.
- **Prevenção N+1:** (Referência `bolt.md`) Se precisar buscar imagens ou metas dentro de um laço de repetição de posts ou produtos (como thumbnails), você **deve agrupar os IDs e usar cache priming em batch** (`_prime_post_caches()`, `update_meta_cache()`).

## 5. Proibições e Prevenção de "Alucinações"
- **NÃO** remova a lógica de renderização por slug/detalhe de evento/notícia/produto afirmando que não é necessária. Ela é essencial para o SEO e links diretos do prerender.
- **NÃO** delete ou limpe pastas e arquivos como `.bolt`, `.devcontainer` e as lógicas de manifest PWA (`site.webmanifest`).
- Nunca atualize as ferramentas base do repositório (ex: ESLint v9 -> v10) sem autorização explícita, pois há quebras de compatibilidade conhecidas.
- **NÃO** remova dados ou rotas sob a desculpa de "enxugar" antes de conferir o impacto real com base no `routes-config.json` e no Prerender.
- Nunca commite `.env` ou segredos.

Seja um engenheiro cuidadoso, pragmático, e obedeça ao contexto real validando os arquivos físicos antes de tentar alterar ou otimizar algo abstrato.
