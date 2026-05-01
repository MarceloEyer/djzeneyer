# Architecture - DJ Zen Eyer

> Visao operacional da arquitetura do projeto para IA e contribuidores.
> Base canonica de regras: `AI_CONTEXT_INDEX.md`.
> Contexto local mais rico: `CLAUDE.md`.

## Papel deste arquivo

Este documento existe para explicar como o sistema funciona na pratica e onde cada responsabilidade mora. Ele nao substitui o indice canonico nem a documentacao especifica de configuracao ou endpoints.

## Estrutura da raiz do repositório

A raiz mistura responsabilidades de tema WordPress, app React e arquivos operacionais. Isso é intencional no modelo atual do projeto.

| Caminho | Papel |
|---|---|
| `src/` | Frontend React SPA, rotas, hooks, i18n e componentes |
| `public/` | Assets e arquivos públicos copiados para o build |
| `inc/` | Bootstrap do tema WordPress, CSP, integrações leves e rotas do tema |
| `plugins/` | Plugins customizados do WordPress |
| `gamipress/` | Override de templates de email do GamiPress quando necessário |
| `scripts/` | Build, prerender, sitemap e validações |
| `docs/` | Documentação técnica, operativa e histórica |
| `tmp/` | Saída temporária de trabalho local; nao deve ser versionada |

Arquivos temporários de trabalho, como `comments_200.txt`, nao fazem parte da arquitetura da aplicação e devem permanecer fora do Git.
Arquivos que precisam ficar na raiz do site em produção devem ter origem em `public/`; a raiz do repositório não deve manter cópias paralelas desses assets.

## Resumo do sistema

- Frontend: React SPA em Vite.
- Backend: WordPress headless via REST.
- Theme REST: `inc/api.php` e `inc/ai-llm.php` para rotas do tema e o endpoint de contexto de IA.
- SEO: `HeadlessSEO`, prerender e sitemap gerado.
- Auth: plugin `zeneyer-auth`.
- Eventos: plugin `zen-bit`.
- SEO headless: plugin `zen-seo-lite`.
- Gamificacao: plugin `zengame`.

## Fluxo operacional

1. O usuario acessa a SPA.
2. Cloudflare serve cache quando disponivel.
3. O build entrega HTML prerenderizado de rotas publicas.
4. React hidrata o HTML.
5. A aplicacao usa `src/hooks/useQueries.ts` para buscar dados.
6. O WordPress e os plugins entregam JSON pronto para render.
7. O frontend mapeia os dados e evita recalcular regra de dominio.

## Fronteiras de responsabilidade

### `src/`
- Rotas, componentes, hooks, contextos e i18n do frontend.
- `useQueries.ts` centraliza data fetching.
- `HeadlessSEO.tsx` centraliza SEO por rota.

### `inc/`
- Bootstrap do tema WordPress.
- REST do tema, configuracao tecnica e integracoes leves.
- Nao e o lugar da logica de gamificacao pesada.

### `plugins/`
- `zeneyer-auth`: login, session, JWT, Google OAuth, newsletter e orders.
- `zen-bit`: eventos, schema e cache de eventos.
- `zen-seo-lite`: metadados, canonical, sitemap e schema.
- `zengame`: pontos, ranking, conquistas e dashboard.

### `scripts/`
- Build, prerender, sitemap e verificacoes auxiliares.
- Mudancas aqui afetam deploy e SEO.

## Fontes de verdade mais importantes

- Identidade publica: `src/data/artistData.ts`.
- Rotas: `scripts/routes-data.json` e `src/config/routes.ts`.
- Fetching: `src/hooks/useQueries.ts`.
- Configuracao de deploy e infraestrutura: `docs/CONFIGURATION.md`.
- Lista resumida de endpoints: `docs/API.md`.
- Lista detalhada de endpoints: `docs/api-endpoints.md`.

## Regras que evitam regressao

- Texto visivel usa i18n.
- Rotas publicas usam `HeadlessSEO`.
- Rotas privadas usam `noindex`.
- HPOS implica `wc_get_orders()`, nunca SQL em `wp_posts`.
- `Person` e a entidade canônica do artista no grafo.
- `q4` e `q5` em FAQ só aparecem quando a chave existe no locale.
- `safeUrl(null)` não deve ser tratado como erro de fallback já que retorna `#`.
- `loadingInitial` e o guard correto para rota privada.
- `prerender.js` e `generate-sitemap.js` devem continuar alinhados com as rotas atuais.

## Divergencias que merecem atencao

- Se um documento local repetir uma regra canonica com outra versao, seguir `AI_CONTEXT_INDEX.md`.
- Se um README ou contexto interno ainda falar em stack antiga, tratar como legado e corrigir ou remover.
- Se um fluxo precisar de excecao real, essa excecao deve ser documentada no arquivo especifico, nao apenas aqui.

## Quando atualizar este arquivo

- Mudanca de fronteira entre `src/`, `inc/`, `plugins/` ou `scripts/`.
- Mudanca de fluxo de SEO, prerender, rotas ou data fetching.
- Mudanca de responsabilidade de um plugin.
- Mudanca estrutural que afete bots ou contribuidores.

## Arquivos relacionados

- `AI_CONTEXT_INDEX.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
- `CONTEXT.md`
- `docs/CONFIGURATION.md`
- `docs/API.md`
- `docs/AI_LEARNINGS.md`
