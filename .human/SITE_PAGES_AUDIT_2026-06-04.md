# Auditoria de paginas publicas, SEO, GEO, AEO e schemas - djzeneyer.com

Data: 2026-06-04
Escopo: paginas React configuradas em `src/config/routes-slugs.json`, paginas dinamicas principais, sitemaps, recursos publicos para IA e pontos centrais de Knowledge Graph.
Metodo: leitura de contexto canonico, codigo real, rotas, paginas, schemas, locales, sitemaps e checks automatizados. Validacao externa pontual: Wikidata/MusicBrainz/Google KG ID via busca web.

## Sumario executivo

O site esta coerente na arquitetura geral e acima da media em GEO/AEO: possui identidade hibrida `Person` + `MusicGroup`, dados estruturados ricos, recursos `llms.txt`, `llms-full.txt`, `.well-known/*`, sitemap bilingue, rotas localizadas e politica publica de IA consistente com o produto.

O principal problema nao e falta de SEO estrutural. O principal problema e desalinhamento fino entre estrategia, copy e algumas rotas: a area publica deveria falar "Releases", mas ainda ha textos visiveis "Latest Stories", "Trending News" e schema `NewsArticle`; algumas paginas maduras estao no sitemap mesmo com `noindex` no componente; algumas props passadas para `HeadlessSEO` sao ignoradas; e algumas paginas comerciais/sistemicas parecem indexaveis apesar de terem conteudo generico ou duplicado.

Checks executados:

- `npm run seo:check`: passou.
- `npm run type-check`: passou.
- `npm run i18n:check`: passou.
- `npm run facts:check`: passou.
- `vitest` focado em SEO/i18n/paginas centrais: 6 arquivos, 100 testes, passou.
- UTF-8 de `llms-full.txt`: nao validado por Python porque `python`/`py` nao existem no PATH desta maquina.

## Achados prioritarios

### P1 - Rotas `noindex` aparecem no sitemap gerado

Evidencia: `src/config/routes-slugs.json` marca `zouk-history`, `zouk-musicality` e `artist-collaborations` com `noindex: true` e `excludeFromSitemap: true`, mas `public/sitemap-pages.xml` contem:

- `https://djzeneyer.com/brazilian-zouk-history/`
- `https://djzeneyer.com/zouk-musicality-guide/`
- `https://djzeneyer.com/collaborations/`
- equivalentes PT.

Impacto: sinal contraditorio para buscadores. O HTML diz noindex, mas sitemap pede descoberta/indexacao.

Recomendacao: regenerar sitemaps com a config atual e confirmar que `generate-sitemap.js` esta rodando no deploy depois das alteracoes de `routes-slugs.json`.

### P1 - `sameAs` esta amplo demais para a propria regra de Knowledge Panel

Evidencia: `.context/IDENTITY.md` diz que `sameAs` deve ser apenas perfil oficial por plataforma, no maximo um por plataforma. `src/data/artist.schema.ts` inclui em `ARTIST_SCHEMA_SAME_AS` plataformas como Last.fm, Genius, Shazam, Patreon, Medium, Audiomack, Boomplay, Napster e Qobuz. Algumas podem ser perfis validos, mas parte delas tende a ser catalogo gerado, fan/lyrics/third-party ou suporte, nao identidade artistica primaria.

Impacto: risco medio/alto de poluir a entidade no Knowledge Graph. O site esta muito bom em IDs, mas a lista deveria ser mais conservadora.

Recomendacao: classificar cada URL com a tabela de `.context/IDENTITY.md` e manter no `sameAs` apenas Wikidata, MusicBrainz, ISNI, Discogs, RA se tratado como perfil oficial, Spotify, Apple Music, YouTube oficial, Instagram, Facebook, SoundCloud, Deezer/Tidal/Amazon/Bandsintown/Songkick quando confirmados como perfil oficial. Mover o resto para `subjectOf`, links visiveis ou nada.

### P1 - Wikidata/Knowledge Graph tem possivel duplicidade historica

Evidencia externa: a busca encontrou `Q136551855` como item principal, com Google KG ID `/g/11ff3mhh10`, MusicBrainz `13afa63c-8164-4697-9cad-c5100062a154` e ultima edicao em 2026-06-02. Tambem apareceu resultado para `Q137374685`, mas abrindo redireciona/resolve como `Q136551855`. Isso sugere que a consolidacao esta em andamento ou ja foi resolvida, mas deve ser monitorada.

Impacto: baixo se ja redirecionado; alto se o duplicado reaparecer como entidade separada.

Recomendacao: monitorar Wikidata para garantir um unico item canonico e manter `Q136551855` como SSOT.

### P2 - Releases ainda parecem News em copy e schema

Evidencia: `src/pages/NewsPage.tsx` usa `NewsArticle`; copy visivel contem "Latest Stories" e "Trending News"; a estrategia canonica diz que o produto publico deve ser "Releases".

Impacto: desalinha a promessa editorial. Para SEO, "news" sugere jornalismo/frequencia; "releases" sugere arquivo oficial, que e a intencao correta.

Recomendacao: trocar copy visivel para Releases/Updates e usar `Article` ou `BlogPosting`; usar `MusicRecording` complementar somente quando o post for release musical com metadados reais.

### P2 - Props SEO ignoradas

Evidencia:

- `src/pages/ReleaseDetailPage.tsx` passa `canonicalUrl={pageUrl}`, mas `HeadlessSEO` aceita `url`, nao `canonicalUrl`.
- `src/pages/ZenTribePage.tsx` passa `ogType="website"`, mas `HeadlessSEO` aceita `type`.

Impacto: hoje nao quebrou type-check, provavelmente por configuracao/typing permissiva em JSX, mas a intencao SEO fica silenciosamente ignorada.

Recomendacao: trocar para `url={pageUrl}` e `type="website"`. Adicionar check para props desconhecidas em componentes SEO, se viavel.

### P2 - Paginas comerciais com conteudo generico indexavel

Evidencia: `/tickets` esta no sitemap e indexavel, mas renderiza produtos com data/local `TBD` e linka para shop/product. Pode competir com `/shop` e produtos. O quiz esta excluido do sitemap, mas usa `Helmet` direto e nao `HeadlessSEO`.

Impacto: dilui sinais de pagina comercial e cria superficie fraca para busca.

Recomendacao: se tickets nao tiver inventario real/eventos especificos, marcar `noindex` e excluir do sitemap. Para quiz, manter fora do sitemap e trocar para `HeadlessSEO noindex` ou decidir se vira pagina publica indexavel com conteudo de apoio.

## Relatorio por pagina

### Home - `/`, `/pt/`

Funcao: hub principal de marca, conversao e entidade.
Linguagem: forte, visual, coerente com artista/DJ; usa identidade, credenciais e CTAs.
SEO/AEO/GEO: excelente. Tem `WebSite`, `WebPage`, `Person`, `MusicGroup`, speakable e links de autoridade.
Schemas: bom, mas `@id` da home usa `currentUrl` sem trailing slash para EN root, gerando `https://djzeneyer.com/#webpage`, que e aceitavel para homepage.
Performance: hero com preload responsivo e imagem eager; bom para LCP. Framer Motion moderado.
TraduÃ§Ã£o: i18n coberto.
Congruencia: muito coerente com o restante.
Veredito: manter. Ajuste fino: garantir que a copy nao use "DJ Zen Eyer" como nome principal quando "Zen Eyer" bastar.

### About - `/about-dj-zen-eyer`, `/pt/sobre-dj-zen-eyer`

Funcao: entity home biografica da pessoa.
Linguagem: narrativa, emocional e factual. Boa ponte entre historia pessoal, credenciais e fatos verificaveis.
SEO/AEO/GEO: muito forte. `ProfilePage`, `Person`, `MusicGroup`, facts, IDs e speakable.
Schemas: coerente com modelo hibrido.
Performance: visual pesado, mas aceitavel para pagina institucional.
TraduÃ§Ã£o: namespace `about`; boa arquitetura.
Congruencia: coerente com Home, Media e Verified Facts.
Veredito: manter. Ajuste: revisar textos que possam dizer "bicampeao mundial" sem desambiguacao suficiente; a pagina parece bem protegida pelo schema.

### Events - `/zouk-events`, `/pt/eventos-zouk` e detalhe

Funcao: agenda atual/futura e detalhes de eventos.
Linguagem: objetiva, util para dancer/organizer.
SEO/AEO/GEO: uma das superficies mais fortes. Usa eventos do `zen-bit`, canonical e `MusicEvent`.
Schemas: bom. `HeadlessSEO`/`buildDynamicGraph` cobre `eventStatus`, `endDate`, `offers`, `image`, `performer`.
Performance: consulta publica com limite 50; adequado.
TraduÃ§Ã£o: usa rotas localizadas e query por idioma.
Congruencia: forte com Work With Me e Home.
Veredito: manter. Monitorar: detalhe usa `url` com `id` em vez de `event.canonical_url`; se `canonical_path` tiver slug diferente, pode haver canonical menos ideal.

### Music - `/zouk-music`, `/pt/musica-zouk`

Funcao: hub de streaming e catalogo.
Linguagem: clara, comercial e musical.
SEO/AEO/GEO: forte para entidade musical.
Schemas: `CollectionPage`, `MusicGroup`, `ItemList` de discografia. Bom.
Performance: pagina estatica/leve, links externos; boa.
TraduÃ§Ã£o: i18n coberto.
Congruencia: coerente com Releases, Support e plataformas.
Veredito: manter. Ajuste: `discography_schema_name` em EN usa "DJ Zen Eyer Discography"; considerar "Zen Eyer Discography" para reforcar nome canonico.

### Release detail - `/zouk-music/:id`, `/pt/musica-zouk/:id`

Funcao: pagina estatica de cada release da discografia.
Linguagem: boa, factual, com creditos e links.
SEO/AEO/GEO: alta oportunidade para music search.
Schemas: `MusicRecording`/`MusicAlbum`, `BreadcrumbList`, `WebPage`; bom conceito.
Problema: `canonicalUrl={pageUrl}` e ignorado por `HeadlessSEO`; deve ser `url={pageUrl}`.
Performance: embeds lazy, bom.
TraduÃ§Ã£o: parte dos labels vem de i18n, mas alguns textos visiveis estao hardcoded em EN/PT conditional ("Cover of", "Versao de", "Tracks").
Congruencia: boa, mas precisa alinhar canonical e i18n.
Veredito: bom com correcoes pontuais.

### Releases - `/releases`, `/pt/lancamentos` e detalhe WordPress

Funcao: arquivo oficial de posts/releases.
Linguagem: parcialmente desalinhada. Estrategia diz Releases; UI ainda mostra "Latest Stories", "Trending News" e classe mental de news.
SEO/AEO/GEO: bom para conteudo temporal, mas schema `NewsArticle` sugere jornalismo.
Schemas: usar `Article`/`BlogPosting` seria mais honesto para releases e notas; para releases musicais, adicionar grafo musical quando houver metadata real.
Performance: React Query e cache OK; filtros por query string devem ficar fora de sitemap, como ja ocorre por robots.
TraduÃ§Ã£o: i18n OK.
Congruencia: media/llms chamam "Releases & Notes"; pagina ainda parece "News".
Veredito: precisa ajuste de copy e schema.

### Zen Tribe - `/zentribe`, `/pt/tribo-zen`

Funcao: comunidade/membership/gamificacao.
Linguagem: comunidade + beneficios. Ainda promete tiers/achievements com cara de produto definido; isso deve ser conferido com estrategia que diz "open product definition".
SEO/AEO/GEO: medio. Importante para ecossistema, nao para Knowledge Panel primario.
Schemas: `Organization`, mas sem `@context` no objeto passado. `HeadlessSEO` injeta JSON direto quando `schema` existe, entao schema sem `@context` fica mais fraco/possivelmente invalido.
Problema: `ogType` ignorado.
Performance: varios cards e motion; aceitavel.
TraduÃ§Ã£o: namespace proprio, bom.
Congruencia: boa com Dashboard/My Account, mas tom pode overpromise.
Veredito: ajustar schema/contexto e promessas de produto.

### Work With Me / Press Kit - `/work-with-me`, `/pt/trabalhe-comigo`

Funcao: booking, press kit, fotos, bio, contato.
Linguagem: forte e profissional.
SEO/AEO/GEO: alta relevancia comercial e autoridade.
Schemas: atualmente usa SEO basico, sem schema custom de `ProfilePage`, `ContactPage`, `Person`/`MusicGroup` ou `CreativeWork` para press kit.
Performance: imagens muitas, lazy em galeria; aceitavel.
TraduÃ§Ã£o: i18n amplo. Ha um texto hardcoded PT em `+ tour mundial continua...`, mesmo na pagina EN.
Congruencia: muito coerente com About/Media.
Veredito: bom, mas merece schema mais rico e remover hardcoded PT.

### Shop - `/shop`, `/pt/loja`

Funcao: monetizacao por produtos/servicos.
Linguagem: visual estilo Netflix, forte para conversao; menos sobria que o resto, mas pode funcionar para loja.
SEO/AEO/GEO: secundario. Metadata basica OK. Falta `ItemList`/`Product` para produtos visiveis na listagem.
Schemas: sem schema custom de produtos na listagem.
Performance: hero grande, carrosseis e imagens; potencial LCP alto se produto remoto pesado.
TraduÃ§Ã£o: alguns fallbacks hardcoded em PT ("O Bau esta Sendo Preparado", "Estamos organizando...") podem aparecer em EN se chaves faltarem.
Congruencia: comercialmente coerente, visualmente mais agressiva.
Veredito: manter, mas adicionar schema de listagem e revisar fallbacks.

### Product detail - `/shop/product/:slug`, `/pt/loja/produto/:slug`

Funcao: detalhe de produto WooCommerce.
Linguagem: direta.
SEO/AEO/GEO: bom potencial comercial.
Schemas: `type="product"` em OG, mas sem `Product` JSON-LD com `offers`, `price`, `availability`.
Performance: imagem principal eager; OK.
TraduÃ§Ã£o: boa para labels.
Congruencia: coerente com Shop.
Veredito: precisa schema `Product` para SEO de e-commerce.

### Support - `/support-dj-zen-eyer`, `/pt/apoie-dj-zen-eyer`

Funcao: doacoes/apoio/pagamentos alternativos.
Linguagem: clara e emocional.
SEO/AEO/GEO: baixo/medio, mas importante para trust.
Schemas: SEO basico. Nao precisa schema agressivo.
Performance: leve.
TraduÃ§Ã£o: i18n OK.
Congruencia: coerente com regra de produto de pagamentos publicos.
Veredito: manter. Nao tratar dados de pagamento como vazamento.

### Media - `/media-clipping`, `/pt/na-midia`

Funcao: clipping, prova externa, IDs e recursos para imprensa.
Linguagem: factual e boa para autoridade.
SEO/AEO/GEO: muito forte.
Schemas: `CollectionPage`, `VideoObject`, artigos publicados por Zen Eyer com `author`; bom e alinhado com regra de nao por Zoukology em `sameAs`.
Performance: video embed lazy e listas; OK.
TraduÃ§Ã£o: i18n OK.
Congruencia: excelente com About, Verified Facts e KG.
Veredito: manter. Ajuste: asset "press kit PDF" marcado unavailable enquanto existem PDFs em `public/assets/press`; conferir se e intencional.

### FAQ - `/faq`, `/pt/perguntas-frequentes`

Funcao: respostas diretas.
Linguagem: boa para AEO, segmentada por categorias.
SEO/AEO/GEO: forte. `HeadlessSEO` gera `FAQPage`; respostas tambem existem visivelmente no DOM quando abertas/colapsadas, o que e aceitavel pois o conteudo esta no HTML.
Schemas: bom.
Performance: leve.
TraduÃ§Ã£o: namespace `faq`, bom.
Congruencia: boa, sem virar enciclopedia completa.
Veredito: manter.

### Encyclopedia hub - `/zouk-encyclopedia`, `/pt/enciclopedia-zouk`

Funcao: referencia evergreen de Brazilian Zouk.
Linguagem: neutra/factual, adequada a SEO e IA.
SEO/AEO/GEO: excelente e uma das maiores oportunidades organicas.
Schemas: `DefinedTermSet` e `DefinedTerm`; bom.
Performance: muitos termos em uma pagina, mas ainda aceitavel se pre-renderizada.
TraduÃ§Ã£o: namespace proprio, bom.
Congruencia: muito boa.
Veredito: manter e expandir com qualidade.

### Encyclopedia detail - `/zouk-encyclopedia/:term`, `/pt/enciclopedia-zouk/:term`

Funcao: resposta indexavel por termo.
Linguagem: curta, factual, adequada para snippets e LLMs.
SEO/AEO/GEO: excelente.
Schemas: `DefinedTerm`, `FAQPage` com pergunta visivel, `WebPage`, breadcrumbs.
Performance: leve.
TraduÃ§Ã£o: bom, mas os slugs PT sao os mesmos slugs ingleses; isso e aceitavel para estabilidade, mas menos natural para PT.
Congruencia: excelente.
Veredito: manter.

### Verified Facts - `/verified-facts`, `/pt/fatos-verificados`

Funcao: SSOT publica de fatos verificaveis.
Linguagem: factual e util para Wikidata/KG/IA.
SEO/AEO/GEO: muito forte.
Schemas: `ProfilePage` + entidades globais.
Problema de conteudo: lista de awards visual mostra `Best Remix` e `Brazilian Zouk DJ World Championship`, mas deveria mostrar `Best Remix` e `Best DJ Performance`; do jeito atual mistura premio com evento.
Performance: leve.
TraduÃ§Ã£o: i18n OK.
Congruencia: essencial para Knowledge Graph.
Veredito: corrigir awards visiveis.

### Zouk Festivals - `/zouk-festivals-directory`, `/pt/diretorio-festivais-zouk`

Funcao: hub de festivais onde Zen Eyer performou/vai performar.
Linguagem: simples e factual.
SEO/AEO/GEO: boa oportunidade de autoridade, indexavel por estrategia.
Schemas: SEO basico; estrategia menciona `MusicEvent`/`Event` quando houver datas/local, mas pagina ainda nao emite schema custom.
Performance: leve.
TraduÃ§Ã£o: OK.
Congruencia: boa com About/Events/Media.
Veredito: manter e adicionar schema apenas para dados verificados.

### Zouk History - `/brazilian-zouk-history`, `/pt/historia-zouk-brasileiro`

Funcao: hub futuro de autoridade.
Linguagem: placeholder.
SEO/AEO/GEO: corretamente `noindex` no componente.
Problema: aparece em `public/sitemap-pages.xml`.
Schemas: basico; suficiente enquanto noindex.
Performance: leve.
TraduÃ§Ã£o: OK.
Congruencia: estrategicamente certo como draft.
Veredito: remover do sitemap gerado ate maturar.

### Zouk Musicality - `/zouk-musicality-guide`, `/pt/guia-musicalidade-zouk`

Funcao: hub futuro de musicalidade.
Linguagem: placeholder.
SEO/AEO/GEO: `noindex`, correto.
Problema: aparece em sitemap.
Veredito: remover do sitemap gerado ate maturar.

### Artist Collaborations - `/collaborations`, `/pt/colaboracoes`

Funcao: hub futuro de colaboracoes.
Linguagem: placeholder.
SEO/AEO/GEO: `noindex`, correto.
Problema: aparece em sitemap.
Veredito: remover do sitemap gerado ate maturar.

### Tickets - `/tickets`, `/pt/ingressos`

Funcao: listar ingressos/produtos relacionados a eventos.
Linguagem: reaproveita textos de eventos, com `TBD` para data/local.
SEO/AEO/GEO: fraco se nao ha tickets reais com datas/local. Esta indexavel e no sitemap.
Schemas: sem `Product`/`Event`.
Performance: consulta produtos; OK.
TraduÃ§Ã£o: link para produto usa `getLocalizedRoute` com path literal e `i18n.language`; risco de path incorreto.
Congruencia: compete com Shop e Events.
Veredito: marcar `noindex` ate ter inventario real, ou transformar em pagina real de tickets com dados verificaveis.

### Cart - `/cart`, `/pt/carrinho`

Funcao: carrinho.
SEO: `noindex`, excluido de sitemap, correto.
Performance: estado de carrinho; OK.
Veredito: manter.

### Checkout - `/checkout`, `/pt/finalizar-compra`

Funcao: checkout WooCommerce.
SEO: `noindex`, excluido de sitemap, correto.
Performance: faz fetch direto no componente para checkout. Isso e aceitavel para fluxo transacional, embora padrao geral prefira hooks.
Veredito: manter noindex.

### Tickets Checkout - `/tickets-checkout`, `/pt/finalizar-ingressos`

Funcao: wrapper do checkout.
SEO: `noindex`, excluido de sitemap/robots, correto.
Problema: renderiza `HeadlessSEO` e depois `CheckoutPage`, que tambem renderiza `HeadlessSEO`; possivel duplicidade de metas, ainda que ambos sejam noindex.
Veredito: simplificar se virar fluxo real de tickets.

### Dashboard - `/dashboard`, `/pt/painel`

Funcao: area autenticada/gamificacao.
SEO: `noindex`, guard usa `loadingInitial`, correto.
Performance: carregamento autenticado; OK.
Veredito: manter.

### My Account - `/my-account`, `/pt/minha-conta`

Funcao: conta, perfil, pedidos, conquistas.
SEO: `noindex`, correto. Guard usa `loadingInitial`, correto.
Performance: queries condicionais por aba, bom.
Veredito: manter.

### Privacy Policy - `/privacy-policy`, `/pt/privacidade`

Funcao: legal/trust.
SEO: indexavel, correto.
Schemas: basico; suficiente.
Linguagem: juridica clara.
TraduÃ§Ã£o: namespace proprio.
Veredito: manter.

### Terms / Conduct - `/terms`, `/pt/termos`, `/conduct`, `/pt/regras-de-conduta`

Funcao: termos legais; rota `conduct` redireciona semanticamente para o mesmo componente `TermsPage`.
SEO: `/terms` indexavel; `/conduct` excluido do sitemap.
Problema externo: busca ainda encontra `/conduct/` como "Terms of Use" e tambem "Code of Conduct" antigo. Isso pode ser residuo de crawl.
Schemas: basico; suficiente.
Veredito: manter, mas considerar redirect 301 explicito de `/conduct` para `/terms` se a consolidacao for definitiva.

### Return Policy - `/return-policy`, `/pt/reembolso`

Funcao: politica comercial.
SEO: indexavel, correto para e-commerce.
Schemas: basico; suficiente.
Linguagem: clara.
Veredito: manter.

### Newsletter confirmation/preferences

Funcao: paginas de sistema de newsletter.
SEO: `noindex`, excluidas de sitemap, correto.
Linguagem: clara e confiavel.
Problema: placeholder de embed ainda visivel; aceitavel se pagina for operacional incompleta.
Veredito: manter noindex.

### Reset Password - `/reset-password`, `/pt/recuperar-senha`

Funcao: recuperacao de senha.
SEO: `noindex`, correto.
Linguagem: funcional.
Veredito: manter.

### ZenLink - `/zenlink`, `/pt/links-zen`

Funcao: link-in-bio.
SEO: `noindex, follow`, correto.
Linguagem: mista; descricao SEO esta hardcoded em PT mesmo em EN.
Schemas: nao necessario.
Performance: leve.
Veredito: manter noindex; localizar titulo/descricao e usar URL localizada para PT.

### Quiz - `/quiz`, `/pt/perguntas`

Funcao: interacao/social sharing.
SEO: excluido de sitemap/prerender, mas nao usa `HeadlessSEO` nem `noindex`; usa `Helmet` direto.
Linguagem: perguntas e personas sao majoritariamente em ingles nos dados, mas UI usa `quiz.json`; verificar se todos os textos visiveis passam por i18n.
Schemas: nenhum, aceitavel.
Veredito: se continuar fora do sitemap, adicionar `HeadlessSEO noindex`; se quiser indexar, criar conteudo explicativo estavel, schema e PT natural.

### Philosophy legacy - `/zouk-philosophy`, `/pt/filosofia-zouk`

Funcao: legado.
Implementacao real: rota aponta para `AboutPage`, nao para `PhilosophyPage.tsx`.
SEO: excluida de sitemap e prerender.
Congruencia: alinhada com estrategia de redistribuir filosofia para About/FAQ/Music.
Veredito: manter como legado/redirect; remover arquivo `PhilosophyPage.tsx` apenas se confirmado que nao e usado.

### NotFound

Funcao: 404.
SEO: `noindex`, correto.
Veredito: manter.

## Recursos machine-readable

### robots.txt

Coerente com regra de produto: `Content-Signal: ai-train=yes, search=yes, ai-input=yes` aparece no bloco geral e no bloco de bots de IA. Sitemap declarado. Rotas privadas e transacionais bloqueadas. AhrefsBot tem `Allow: /` antes dos disallows, correto.

### llms.txt / llms-full.txt / pronunciation.txt / ai-bots.txt

Conteudo muito bom para GEO/AEO. Inclui identidade, pronuncia, IDs, paginas principais e FAQ. Pontos a revisar:

- `ai-bots.txt` diz "Based in Rio de Janeiro, Brazil"; SSOT do codigo diz based in Niteroi/RJ. Padronizar como "born in Rio de Janeiro, based in Niteroi".
- `llms.txt` inclui `Zen Ayer` como forma nao oficial; isso e permitido como nota de desambiguacao, nao como alias.
- Validacao UTF-8 precisa rodar com Node ou instalar Python no ambiente; o comando Python recomendado nos contextos falhou aqui.

### Sitemap

Boa cobertura bilingue e termos da enciclopedia. Problema principal: sitemap publico esta desatualizado/incoerente com rotas `noindex` de hubs ainda imaturos.

## Plano de acao recomendado

1. Regenerar sitemaps e impedir que rotas `noindex` entrem em `public/sitemap-pages.xml`.
2. Corrigir props ignoradas: `canonicalUrl` -> `url`; `ogType` -> `type`.
3. Alinhar Releases: copy visivel, labels, schema `NewsArticle` e OG para a estrategia "Releases & Notes".
4. Revisar `sameAs` com classificacao conservadora de links externos.
5. Corrigir `VerifiedFactsPage`: awards visiveis devem listar `Best DJ Performance` e `Best Remix`.
6. Decidir destino de `/tickets`: `noindex` ate ter dados reais ou pagina completa com Product/Event schema.
7. Adicionar schema `Product` nos detalhes de produto e `ItemList`/`Product` basico na Shop.
8. Adicionar schema mais rico em Work With Me/Press Kit e remover hardcoded PT.
9. Trocar Quiz de `Helmet` direto para `HeadlessSEO noindex` ou maturar para pagina indexavel.
10. Validar UTF-8 de `llms-full.txt` via script Node, ja que Python nao esta disponivel no ambiente atual.
