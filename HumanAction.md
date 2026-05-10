# HumanAction.md - Tarefas manuais para DJ Zen Eyer

> Decisoes do usuario em 2026-05-06/2026-05-07: releases ficam dentro de News como posts comuns; nao existe rota separada `/release`; slugs devem ser traduzidos; categoria principal dos releases sera `Music`; tag obrigatoria sera `release`; filtros devem usar parametros legiveis; Press Kit publico deve baixar PDF direto; Amazon Music deve usar dominio global; Deezer canonico e `52900762`; ORCID nao entra no grafo de artista nem em arquivos publicos de IA; linguagem publica deve ser factual; manter SearchAction para elegibilidade a sitelinks search box.

## 0. Relacionar KGMID secundario no Wikidata/Google

Contexto:

- KGMID principal do artista: `/g/11ff3mhh10`
- KGMID secundario relacionado: `/g/11h6s0lfs5`
- Wikidata principal: `Q136551855`

O que fazer:

1. Abra `https://www.google.com/search?kgmid=/g/11h6s0lfs5`.
2. Confirme visualmente se o painel representa um perfil de negocio/organizacao ligado ao DJ Zen Eyer, e nao uma duplicata exata do artista.
3. Se for duplicata exata do artista, nao crie item novo no Wikidata. Solicite correcao no proprio Google Knowledge Panel/feedback para mesclar ou corrigir.
4. Se for perfil de negocio/organizacao, crie ou use um item Wikidata separado para essa entidade relacionada.
5. No item separado, adicione `Google Knowledge Graph ID (P2671)` com o valor `/g/11h6s0lfs5`.
6. No item principal `Q136551855`, mantenha `Google Knowledge Graph ID (P2671)` com `/g/11ff3mhh10`.
7. Relacione os itens com propriedades coerentes e factuais. Use somente o que for verdadeiro:
   - `founder (P112)` apontando para Marcelo Eyer Fernandes / DJ Zen Eyer, se o item secundario for uma organizacao fundada por voce.
   - `owned by (P127)` apontando para voce, se o item secundario for um negocio de sua propriedade.
   - `employer (P108)` ou `member of (P463)` somente se fizer sentido factual.
8. Nao coloque os dois KGMIDs no mesmo item se eles representarem entidades diferentes.
9. Depois de salvar, rode este prompt aqui no Codex:

```text
Atualizei o Wikidata/Google para relacionar o KGMID secundario /g/11h6s0lfs5. Verifique se o schema local, AI_CONTEXT_INDEX.md, HumanAction.md e docs de marketing continuam consistentes com o que foi feito no Wikidata.
```

## 1. Modelo editorial no WordPress

Use posts comuns do WordPress para noticias, artigos, reviews de eventos e releases musicais.

Padrao para releases:

- Post type: `Post`
- Categoria: `Music`
- Tag obrigatoria: `release`
- Tags opcionais: `dj-zen-eyer`, `zen-eyer`, `brazilian-zouk`, `zouk-music`, `remix`, `cover`, `single`

Motivo: categoria organiza a editoria principal; tag `release` permite filtrar releases dentro de News sem criar mais uma pagina publica. Isso tambem deixa o WordPress simples: se no futuro voce criar outra categoria ou tag, o frontend pode listar automaticamente pelos endpoints REST.

## 2. URLs finais esperadas

As URLs ficam dentro de News:

- EN: `https://djzeneyer.com/zouk-dance-news/{english-slug}`
- PT: `https://djzeneyer.com/pt/noticias-zouk/{slug-em-portugues}`

Slugs recomendados para criar no WordPress:

| Release | Slug EN | Slug PT |
|---|---|---|
| Don't Stop (feat. Zen Eyer) [Zen Eyer Remix] | `dont-stop-zen-eyer-remix-kaysha` | `dont-stop-remix-zen-eyer-kaysha` |
| Na Ponta Ela Fica - Cover | `na-ponta-ela-fica-brazilian-zouk-cover` | `na-ponta-ela-fica-cover-zouk-brasileiro` |
| Still Loving You (feat. Walter Xavier) [Sax Cover] | `still-loving-you-sax-cover-walter-xavier` | `still-loving-you-cover-sax-walter-xavier` |
| Baila Flaquita | `baila-flaquita-original-single` | `baila-flaquita-single-original` |
| Porta Do Sol - Cover | `porta-do-sol-brazilian-zouk-cover` | `porta-do-sol-cover-zouk-brasileiro` |

## 3. Passo a passo para criar cada release com Polylang

1. Entre no WordPress Admin.
2. Va em `Posts > Add New`.
3. Crie primeiro a versao EN.
4. No painel do Polylang, defina o idioma como English.
5. Use o titulo EN indicado na secao de cada release abaixo.
6. Edite o slug manualmente com o slug EN indicado.
7. Se a categoria `Music` nao existir, crie `Music`.
8. Marque a categoria `Music`.
9. Adicione a tag obrigatoria `release`.
10. Adicione tags opcionais coerentes com o release: `brazilian-zouk`, `cover`, `single`, `remix`.
11. Adicione imagem destacada, preferencialmente a capa oficial da plataforma.
12. Cole o texto EN sugerido.
13. Confira links oficiais e remova qualquer link que voce ainda nao tenha confirmado.
14. Publique a versao EN.
15. No box do Polylang, clique no `+` para criar a traducao PT vinculada.
16. Use o titulo PT indicado.
17. Edite o slug manualmente com o slug PT indicado.
18. Marque a categoria PT equivalente a `Music` se o Polylang traduzir taxonomias; se nao traduzir, use `Music`.
19. Adicione a tag `release`.
20. Cole o texto PT sugerido.
21. Publique a versao PT.
22. Abra as duas URLs finais e confirme HTTP 200.
23. Depois me envie o prompt indicado na secao 9.

## 4. Textos-base dos posts

Use os textos abaixo como ponto de partida. Eles evitam "melhor", "top", "mais famoso", "pioneiro" e qualquer afirmacao opinativa.

### 4.1 Don't Stop

Titulo EN:

```text
Don't Stop (feat. Zen Eyer) [Zen Eyer Remix] - Release Notes
```

Titulo PT:

```text
Don't Stop (feat. Zen Eyer) [Zen Eyer Remix] - Notas do Release
```

Texto EN:

```markdown
## About the release

"Don't Stop (feat. Zen Eyer) [Zen Eyer Remix]" is a remix connected to Kaysha's "Don't Stop (Remixes)" release. Kaysha is the main artist and release owner. Zen Eyer is credited on the remix.

For DJ Zen Eyer's public catalog, this track is important because major platforms list it together with Zen Eyer's artist profile and it connects his Brazilian Zouk work with Kaysha's wider Zouk and Kizomba catalog.

## Credits

- Main artist: Kaysha
- Credited artist / remixer: Zen Eyer
- Release: Don't Stop (Remixes) - Single
- Release date: October 25, 2018
- Track duration: 3:39

## Official sources

- Kaysha official release page: https://kaysha.com/releases/kaysha-dont-stop-remixes/
- Apple Music: https://music.apple.com/us/song/1596290116
- MusicBrainz: https://musicbrainz.org/release/4ca05fa2-a3c0-4de3-818c-e64cd147dca3
- Spotify artist profile snapshot: https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw

## Notes

Spotify public artist profile showed 226k+ plays for "Don't Stop - Zen Eyer Remix" when crawled in May 2026. Use this number only with the date and source above.
```

Texto PT:

```markdown
## Sobre o release

"Don't Stop (feat. Zen Eyer) [Zen Eyer Remix]" e um remix conectado ao release "Don't Stop (Remixes)" de Kaysha. Kaysha e o artista principal e dono do release. Zen Eyer aparece creditado no remix.

Para o catalogo publico de DJ Zen Eyer, essa faixa e importante porque plataformas principais listam a musica junto ao perfil artistico de Zen Eyer e conectam seu trabalho de Brazilian Zouk ao catalogo de Zouk e Kizomba de Kaysha.

## Creditos

- Artista principal: Kaysha
- Artista creditado / remixer: Zen Eyer
- Release: Don't Stop (Remixes) - Single
- Data de lancamento: 25 de outubro de 2018
- Duracao: 3:39

## Fontes oficiais

- Pagina oficial de Kaysha: https://kaysha.com/releases/kaysha-dont-stop-remixes/
- Apple Music: https://music.apple.com/us/song/1596290116
- MusicBrainz: https://musicbrainz.org/release/4ca05fa2-a3c0-4de3-818c-e64cd147dca3
- Snapshot do perfil Spotify: https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw

## Observacao

O perfil publico do Spotify mostrava 226k+ plays para "Don't Stop - Zen Eyer Remix" quando consultado em maio de 2026. Use esse numero somente com a data e a fonte acima.
```

### 4.2 Na Ponta Ela Fica

Titulo EN:

```text
Na Ponta Ela Fica (Cover) - Brazilian Zouk Release Notes
```

Titulo PT:

```text
Na Ponta Ela Fica (Cover) - Notas do Release de Zouk Brasileiro
```

Texto EN:

```markdown
## About the release

"Na Ponta Ela Fica (Cover)" is a 2026 Zen Eyer single connected to his Brazilian Zouk music catalog. Apple Music lists the release as "Na Ponta Ela Fica (Cover) - Single" by Zen Eyer.

## Credits

- Artist: Zen Eyer
- Release type: Single / Cover
- Release date: January 9, 2026
- Track duration: 2:22

## Official sources

- Apple Music: https://music.apple.com/us/album/na-ponta-ela-fica-cover-single/1867840116
- MusicBrainz: https://musicbrainz.org/release/7b0c16b2-24a8-4923-b3e1-f3b852e5b064
```

Texto PT:

```markdown
## Sobre o release

"Na Ponta Ela Fica (Cover)" e um single de 2026 de Zen Eyer conectado ao seu catalogo musical de Brazilian Zouk. A Apple Music lista o release como "Na Ponta Ela Fica (Cover) - Single" por Zen Eyer.

## Creditos

- Artista: Zen Eyer
- Tipo de release: Single / Cover
- Data de lancamento: 9 de janeiro de 2026
- Duracao: 2:22

## Fontes oficiais

- Apple Music: https://music.apple.com/us/album/na-ponta-ela-fica-cover-single/1867840116
- MusicBrainz: https://musicbrainz.org/release/7b0c16b2-24a8-4923-b3e1-f3b852e5b064
```

### 4.3 Still Loving You

Titulo EN:

```text
Still Loving You (feat. Walter Xavier) [Sax Cover] - Release Notes
```

Titulo PT:

```text
Still Loving You (feat. Walter Xavier) [Sax Cover] - Notas do Release
```

Texto EN:

```markdown
## About the release

"Still Loving You (feat. Walter Xavier) [Sax Cover]" is a 2026 Zen Eyer single featuring Walter Xavier. Apple Music lists it as a Contemporary Jazz single by Zen Eyer.

## Credits

- Artist: Zen Eyer
- Featured artist: Walter Xavier
- Release type: Single / Sax Cover
- Release date: January 27, 2026
- Track duration: 4:24

## Official sources

- Apple Music: https://music.apple.com/us/album/still-loving-you-feat-walter-xavier-sax-cover-single/1872468504
```

Texto PT:

```markdown
## Sobre o release

"Still Loving You (feat. Walter Xavier) [Sax Cover]" e um single de 2026 de Zen Eyer com participacao de Walter Xavier. A Apple Music lista o release como single de Contemporary Jazz por Zen Eyer.

## Creditos

- Artista: Zen Eyer
- Participacao: Walter Xavier
- Tipo de release: Single / Sax Cover
- Data de lancamento: 27 de janeiro de 2026
- Duracao: 4:24

## Fontes oficiais

- Apple Music: https://music.apple.com/us/album/still-loving-you-feat-walter-xavier-sax-cover-single/1872468504
```

### 4.4 Baila Flaquita

Titulo EN:

```text
Baila Flaquita - Original Single Release Notes
```

Titulo PT:

```text
Baila Flaquita - Notas do Single Original
```

Texto EN:

```markdown
## About the release

"Baila Flaquita" is a 2026 original single by Zen Eyer. MusicBrainz lists it as an official digital single by Zen Eyer, with a length of 1:44.

## Credits

- Artist: Zen Eyer
- Release type: Original single
- Release year: 2026
- Track duration: 1:44

## Official sources

- MusicBrainz: https://musicbrainz.org/release/aaea8061-a317-4743-bf87-fad9dc3ed93c
- Apple Music artist profile: https://music.apple.com/us/artist/zen-eyer/1439280950
```

Texto PT:

```markdown
## Sobre o release

"Baila Flaquita" e um single original de 2026 de Zen Eyer. O MusicBrainz lista o release como single digital oficial de Zen Eyer, com duracao de 1:44.

## Creditos

- Artista: Zen Eyer
- Tipo de release: Single original
- Ano de lancamento: 2026
- Duracao: 1:44

## Fontes oficiais

- MusicBrainz: https://musicbrainz.org/release/aaea8061-a317-4743-bf87-fad9dc3ed93c
- Perfil Apple Music: https://music.apple.com/us/artist/zen-eyer/1439280950
```

### 4.5 Porta Do Sol

Titulo EN:

```text
Porta Do Sol (Cover) - Brazilian Zouk Release Notes
```

Titulo PT:

```text
Porta Do Sol (Cover) - Notas do Release de Zouk Brasileiro
```

Texto EN:

```markdown
## About the release

"Porta Do Sol (Cover)" is a Zen Eyer single connected to his Brazilian Zouk music catalog. Apple Music lists the release as "Porta Do Sol (Cover) - Single" by Zen Eyer.

## Credits

- Artist: Zen Eyer
- Release type: Single / Cover
- Release date: January 6, 2026
- Track duration: 5:07

## Official sources

- Apple Music: https://music.apple.com/us/album/porta-do-sol-cover-single/1867002457
- MusicBrainz: https://musicbrainz.org/release/b1c9f977-3642-4c86-a66d-b7b5a4564064
```

Texto PT:

```markdown
## Sobre o release

"Porta Do Sol (Cover)" e um single de Zen Eyer conectado ao seu catalogo musical de Brazilian Zouk. A Apple Music lista o release como "Porta Do Sol (Cover) - Single" por Zen Eyer.

## Creditos

- Artista: Zen Eyer
- Tipo de release: Single / Cover
- Data de lancamento: 6 de janeiro de 2026
- Duracao: 5:07

## Fontes oficiais

- Apple Music: https://music.apple.com/us/album/porta-do-sol-cover-single/1867002457
- MusicBrainz: https://musicbrainz.org/release/b1c9f977-3642-4c86-a66d-b7b5a4564064
```

## 5. Press Kit

Press Kit deve ser publico e baixar PDF direto.

Destino recomendado no repositorio e no webroot:

- Repositorio: `public/dj-zen-eyer-presskit.pdf`
- Producao/webroot: `/dj-zen-eyer-presskit.pdf`
- URL final: `https://djzeneyer.com/dj-zen-eyer-presskit.pdf`

Se voce quiser gerenciar pelo WordPress puro, o padrao WordPress e subir em `Media > Add New`, que normalmente gera URL em `/wp-content/uploads/{ano}/{mes}/arquivo.pdf`. Isso e normal para WordPress, mas nao e ideal para URL permanente curta. Para Press Kit profissional, prefiro o caminho fixo `/assets/press/` porque e previsivel, facil de linkar e nao depende da estrutura de uploads por data.

PDF unico e suficiente agora. PNG/JPG cria manutencao extra e so vale a pena se um organizador pedir arte pronta para redes sociais.

## 5.1 Busca do site e sitelinks search box

O site deve manter elegibilidade para sitelinks search box de Google/Bing via `WebSite.potentialAction` com `SearchAction`.

Alvo funcional:

- EN: `https://djzeneyer.com/zouk-dance-news?search={search_term_string}`
- PT: `https://djzeneyer.com/pt/noticias-zouk?search={search_term_string}`

Essa busca usa posts do WordPress em News. Filtros visuais tambem devem usar parametros legiveis:

- Categoria: `?category=music`
- Tag: `?tag=release`
- Busca textual: `?search=zouk`

## 6. Metricas verificaveis

Use metricas apenas com fonte e data.

Formato recomendado:

```text
Spotify public artist profile showed 226k+ plays for "Don't Stop - Zen Eyer Remix" when crawled in May 2026.
Source: https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw
```

Melhor ainda: guardar screenshot datado do Spotify for Artists ou Apple Music for Artists. O Google e LLMs confiam mais quando o numero aparece com fonte publica, data e contexto claro. Se o numero vier de dashboard privado, ele pode ser usado em press kit, mas nao deve ser apresentado como dado publico sem screenshot ou export verificavel.

## 7. Cremosidade

Frase aprovada:

```text
Zen Eyer is frequently associated with Cremosidade in his public artist materials.
```

Evitar:

- `pioneer of Cremosidade`
- `creator of Cremosidade`
- `named the Cremosidade style`
- `best Cremosidade DJ`

## 8. Diamond / Diamonds

Nao criar post, release, FAQ, schema ou mencao publica para `Diamond` ou `Diamonds`. O usuario confirmou que nunca trabalhou em musica com esse nome.

## 9. Prompts para me enviar depois das tarefas humanas

Depois de criar os posts dos releases:

```text
Criei os posts dos releases no WordPress com Polylang.
URLs EN:
- Don't Stop: [...]
- Na Ponta Ela Fica: [...]
- Still Loving You: [...]
- Baila Flaquita: [...]
- Porta Do Sol: [...]
URLs PT:
- Don't Stop: [...]
- Na Ponta Ela Fica: [...]
- Still Loving You: [...]
- Baila Flaquita: [...]
- Porta Do Sol: [...]
Categoria usada: Music
Tag obrigatoria usada: release
Valide os links no frontend, sitemap, schema e llms.txt.
```

Depois de subir o PDF do Press Kit:

```text
Subi o PDF do Press Kit em https://djzeneyer.com/dj-zen-eyer-presskit.pdf.
Valide o botao/link de Press Kit no site e confirme se a rota press-kit-dj-zen-eyer baixa o PDF direto.
```

Depois de confirmar links oficiais de streaming que ainda faltarem:

```text
Aqui estao os links oficiais de streaming que faltavam:
- Baila Flaquita Apple Music: [...]
- Spotify tracks/albums: [...]
- Deezer tracks/albums: [...]
- Tidal tracks/albums: [...]
- Amazon Music tracks/albums: [...]
- YouTube Music tracks/albums: [...]
Atualize DISCOGRAPHY, schema e arquivos de IA usando apenas esses links.
```
