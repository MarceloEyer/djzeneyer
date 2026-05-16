# I18n & Content Architecture

Este arquivo define onde cada tipo de texto deve viver para manter o projeto escalável, revisável e claro para agentes.

## Frontend i18n

O frontend usa `i18next` com namespaces carregados sob demanda.

### Regra prática de tamanho

- Ate 20 KB: ok em `translation.json`.
- 20-60 KB: aceitavel, mas observar crescimento.
- 60-100 KB: considerar separação se o bloco for de uma pagina especifica.
- Acima de 100 KB: separar em namespace proprio quando possivel.

### O que deve sair do `translation.json`

Conteudo longo, enciclopedico ou altamente especifico de pagina deve ir para namespace proprio:

- `encyclopedia.json`: verbetes da Zouk Encyclopedia.
- `faq.json`: perguntas e respostas.
- `legal.json`: termos, politica de retorno e textos legais.
- `conduct.json`: codigo de conduta.
- `privacy.json`: politica de privacidade.
- `about.json`: historia, timeline e copy longa do About.
- `zentribe.json`: copy da pagina Zen Tribe.
- `quiz.json`: ja separado.

### O que deve ficar em `translation.json`

Textos curtos e compartilhados:

- Navegacao.
- Footer.
- Labels comuns.
- Mensagens reutilizadas.
- Pequenos blocos de paginas que nao tendem a crescer.

Ao criar uma pagina com bastante texto, adicione um namespace dedicado e carregue-o no componente com `useTranslation(['translation', 'nome-do-namespace'])`.

## Releases

Releases nao sao conteudo estatico do frontend.

### Fonte de verdade

- Releases de musica e eventos devem ser publicados como posts no WordPress.
- Traducoes devem ser geridas no WordPress via Polylang.
- O conteudo editorial nao deve entrar em arquivos JSON de traducao do frontend.

### Papel do frontend

O frontend consome os posts pela REST API e renderiza:

- Listagem em `/releases`.
- Pagina individual por slug.
- Filtros por categorias/tags do WordPress.

### Papel do plugin

O plugin deve enriquecer cada post com metadados estruturados e schema, nao substituir o WordPress como editor.

O caminho preferido e evoluir `plugins/zen-seo-lite`, porque ele ja centraliza:

- SEO meta.
- Schema.org.
- REST fields.
- Polylang translations.
- Sitemaps e rotas headless.

Campos desejados para music releases:

- Release type: single, remix, album, EP, edit.
- Spotify URL.
- Apple Music URL.
- YouTube URL.
- SoundCloud URL.
- MusicBrainz URL/ID, quando existir.
- ISRC opcional.
- Release date.
- Cover image.
- Primary artist.
- Producer/remixer/composer/contributors.
- Short schema description.

Schema alvo:

- `MusicRecording` para single/remix/edit.
- `MusicAlbum` para album/EP.
- `BlogPosting` ou `Article` para o texto editorial do release.
- `BreadcrumbList` e entity links via `sameAs`.

Regra de seguranca semantica: schema deve refletir conteudo visivel ou metadados reais preenchidos no WordPress. Nao criar dados invisiveis, fabricados ou coercivos para IAs.
