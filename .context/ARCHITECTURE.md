# Architecture - DJ Zen Eyer

> Visao operacional da arquitetura do projeto para IA e contribuidores.
> Base canonica de regras: `AI_CONTEXT_INDEX.md`.
> Contexto local de agente: `.agents/personas/`.

## Papel deste arquivo

Este documento existe para explicar como o sistema funciona na pratica e onde cada responsabilidade mora. Ele nao substitui o indice canonico nem a documentacao especifica de configuracao, operacoes ou endpoints.

## Estrutura da raiz do repositorio

A raiz mistura responsabilidades de tema WordPress, app React e arquivos operacionais. Isso e intencional no modelo atual do projeto.

| Caminho | Papel |
|---|---|
| `src/` | Frontend React SPA, rotas, hooks, i18n e componentes |
| `public/` | Assets, arquivos publicos, recursos de AI discovery e SEO copiados para o build |
| `inc/` | Bootstrap do tema WordPress, CSP, integracoes leves, rotas do tema e AI discovery |
| `plugins/` | Plugins customizados do WordPress |
| `gamipress/` | Override de templates de email do GamiPress quando necessario |
| `scripts/` | Build, prerender, sitemap, markdown, IndexNow, DNS-AID e validacoes |
| `.agents/` | Personas e skills de agentes |
| `.context/` | Contexto tecnico, operacional e de produto compartilhado |
| `.human/` | Backlog humano, auditorias e acoes off-repo |
| `docs/` | Documentacao operacional de apoio |
| `tmp/` | Saida temporaria de trabalho local; nao deve ser versionada |

Arquivos temporarios de trabalho, como `comments_200.txt`, nao fazem parte da arquitetura da aplicacao e devem permanecer fora do Git.
Arquivos que precisam ficar na raiz do site em producao devem ter origem em `public/`; a raiz do repositorio nao deve manter copias paralelas desses assets.

## Resumo do sistema

- Frontend: React SPA em Vite.
- Backend: WordPress headless via REST.
- Theme REST: `inc/api.php` e `inc/ai-llm.php` para rotas do tema e endpoints de contexto de IA.
- SEO/GEO/AEO: `HeadlessSEO`, prerender, sitemap gerado, `llms.txt`, `llms-full.txt`, `.well-known/*`, `robots.txt` com Content Signals e dados estruturados.
- Auth: plugin `zeneyer-auth`.
- Eventos: plugin `zen-bit`.
- SEO headless: plugin `zen-seo-lite`.
- Gamificacao: plugin `zengame`.

## Eventos, prerender e consumo de recursos

`zen-bit` e a fonte de verdade para eventos. O plugin decide selecao, modo (`upcoming`, `past`, `all`), janela de dias, limite, ordenacao, canonical path, cache HTTP e schema MusicEvent. O frontend consome `zen-bit/v2/events` via `useEventsQuery` e so adiciona campos de renderizacao, como `detailHref` e datas ja parseadas para os cards.

O prerender existe principalmente para SEO, GEO, AEO, Knowledge Panel e first paint. Ele pode injetar `window.__PRERENDER_DATA__` como cache inicial por rota, mas esse payload deve ser pequeno e escopado:

- Home: apenas os 3 proximos eventos.
- Events: lista publica maior, atualmente limitada a 50 eventos.
- Outras rotas: sem lista de eventos, exceto quando a propria rota dinamica do evento precisar de dados para renderizacao.

Essa divisao evita over-fetch, reduz HTML inutil em paginas sem eventos, preserva dados estruturados para bots e mantem o plugin como SSOT.

## Fluxo operacional

1. O usuario acessa a SPA.
2. Cloudflare serve cache quando disponivel.
3. O build entrega HTML prerenderizado de rotas publicas.
4. React hidrata o HTML.
5. A aplicacao usa hooks centralizados em `src/hooks/` para buscar dados quando necessario.
6. O WordPress e os plugins entregam JSON pronto para render.
7. O frontend mapeia dados e evita recalcular regra de dominio.

## Fronteiras de responsabilidade

### `src/`

- Rotas, componentes, hooks, contextos e i18n do frontend.
- Hooks centralizam data fetching.
- `HeadlessSEO.tsx` centraliza SEO por rota.

### `inc/`

- Bootstrap do tema WordPress.
- REST do tema, configuracao tecnica, CSP, AI discovery e integracoes leves.
- Nao e o lugar da logica de gamificacao pesada.

### `plugins/`

- `zeneyer-auth`: login, session, JWT, Google OAuth, newsletter e orders.
- `zen-bit`: eventos, schema e cache de eventos.
- `zen-seo-lite`: metadados, canonical, sitemap e schema.
- `zengame`: pontos, ranking, conquistas e dashboard.

### `scripts/`

- Build, prerender, sitemap, markdown, IndexNow, DNS-AID e verificacoes auxiliares.
- Mudancas aqui afetam deploy, AI discovery e SEO.

## Fontes de verdade mais importantes

- Hierarquia de contexto: `AI_CONTEXT_INDEX.md`.
- Regras tecnicas: `.agents/GUIDELINES.md`.
- Identidade publica: `.context/IDENTITY.md` e `src/data/artistData.ts`.
- Rotas: `src/config/routes-slugs.json` e `src/config/routes.ts`.
- Fetching: `src/hooks/` e `src/config/queryClient.ts`.
- Operacoes e deploy/contexto de agentes: `.context/OPERATIONS.md`.
- Estrategia de paginas publicas: `.context/SITE_PAGES_STRATEGY.md`.
- Aprendizados consolidados: `LEARNINGS.md`.

## Regras que evitam regressao

- Texto visivel usa i18n.
- Rotas publicas usam `HeadlessSEO`.
- Rotas privadas usam `noindex`.
- HPOS implica `wc_get_orders()`, nunca SQL em `wp_posts`.
- `Person` e `MusicGroup` coexistem no grafo como entidades distintas.
- `q4` e `q5` em FAQ so aparecem quando a chave existe no locale.
- `safeUrl(null)` nao deve ser tratado como erro de fallback ja que retorna `#`.
- `loadingInitial` e o guard correto para rota privada.
- `prerender.js`, `generate-sitemap.js`, markdown generation e arquivos `.well-known/*` devem continuar alinhados com as rotas atuais.
- Conteudo publico do site e deliberadamente exposto para busca, grounding, discovery e treinamento por IA, salvo excecao explicita.

## Divergencias que merecem atencao

- Se um documento local repetir uma regra canonica com outra versao, seguir `AI_CONTEXT_INDEX.md`.
- Se um README ou contexto interno ainda falar em stack antiga, tratar como legado e corrigir ou remover.
- Se um fluxo precisar de excecao real, essa excecao deve ser documentada no arquivo especifico, nao apenas aqui.

## Quando atualizar este arquivo

- Mudanca de fronteira entre `src/`, `inc/`, `plugins/`, `scripts`, `.agents`, `.context` ou `.human`.
- Mudanca de fluxo de SEO, GEO/AEO, AI discovery, prerender, rotas ou data fetching.
- Mudanca de responsabilidade de um plugin.
- Mudanca estrutural que afete bots, agentes ou contribuidores.

## Arquivos relacionados

- `AI_CONTEXT_INDEX.md`
- `AGENTS.md`
- `.agents/GUIDELINES.md`
- `.agents/personas/CLAUDE.md`
- `.agents/personas/GEMINI.md`
- `.context/PROJECT.md`
- `.context/OPERATIONS.md`
- `.context/SITE_PAGES_STRATEGY.md`
- `LEARNINGS.md`
