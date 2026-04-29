# Config Context - /src/config

> Contexto local de rotas e configuracao da aplicacao.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Responsabilidade

API URLs, rotas localizadas e configuracoes globais do frontend.

## Regras centrais

- `api.ts` continua sendo a base para endpoints.
- `routes.ts` continua sendo a base para mapeamento de rotas.
- `siteConfig.ts` concentra metadados globais.
- `getApiConfig()` deve priorizar dados injetados pelo PHP antes de variaveis de ambiente quando isso existir no projeto.
- Mudanca de rota publica precisa sincronizar `scripts/routes-data.json`.

## Pontos de cuidado

- `getLocalizedRoute()` e a forma segura de compor URLs canonicas.
- `routes.ts` e a SSOT de rotas para a SPA.
- Qualquer alteracao aqui afeta SEO, sitemap e prerender.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
