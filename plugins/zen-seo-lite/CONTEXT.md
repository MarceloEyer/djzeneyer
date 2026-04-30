# SEO Plugin Context - /plugins/zen-seo-lite

> Contexto local do plugin de SEO headless.
> Base canonica: `AI_CONTEXT_INDEX.md`.

## Responsabilidade

Metadados, canonical URLs, schema, sitemap e rotas de SEO do site headless.

## Regras centrais

- Namespace atual: `zen-seo/v1`.
- A entidade publica do artista fica como `Person`.
- Rotas privadas usam `noindex`.
- URLs canonicas sao geradas via `get_frontend_url()` (em `class-zen-seo-helpers.php`), que usa `str_replace()` substituindo `home_url('/')` por uma URL frontend hardcoded (`https://djzeneyer.com/`). Nao resolve rotas localizadas dinamicamente.
- O frontend continua renderizando `HeadlessSEO` a partir dos dados preparados pelo plugin.

## Pontos de cuidado

- Canonical URL precisa refletir a SPA publica.
- `sameAs` e `identifier` devem seguir a SSOT do artista.
- Sitemap e cache precisam ser coerentes com `routes-data.json`.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o indice canonico.
