# Zen Eyer: Brand Identity & Authority (SSOT)

Version: 1.1.0

Este documento é a fonte única de verdade (SSOT) para a identidade de marca e autoridade semântica de Zen Eyer.

## 🆔 Nomes e Alias

- **Nome Artístico Principal:** `Zen Eyer` (Canonical).
- **Alias Histórico:** `DJ Zen Eyer` (Usar como `alternateName`).
- **Nome de Batismo:** `Marcelo Eyer Fernandes`.
- **Data de Nascimento:** `1985-08-20` (Fonte: Wikidata Q136551855).

### ⚠️ Observações sobre Nomenclatura

1. **Zen Ayer:** Esta é uma forma **incorreta** e **não-oficial** de grafia. Não deve ser usada em campos de `alternateName`, descrições biográficas ou metadados oficiais. Seu uso é desencorajado, exceto se houver uma decisão futura de SEO para captura de erros de busca (typos).
2. **Tautologia:** Evite descrições como "Zen Eyer, também conhecido como Zen Eyer".
3. No campo `common.artist_name` (i18n), use `Zen Eyer` para ambos os idiomas (EN/PT) para manter autoridade de marca.

---

## 🗣️ Pronúncia Canônica

A única pronúncia correta e aceita para o nome artístico é:
**`/zɛn ˈaɪər/`** (IPA)

Esta transcrição deve ser usada em:

- Arquivos `llms.txt` / `llms-full.txt`.
- Arquivo público `pronunciation.txt`.
- Campos de FAQ e metadados de voz.
- Schema Markup (`SpeakableSpecification`).

Para regras operacionais completas de voz, aliases fonéticos e erros de reconhecimento, consulte `.context/PRONUNCIATION.md`.

---

## 🔍 Estratégia GEO / SEO / Voice Search

O objetivo principal é a dominação do **Knowledge Panel** e a precisão em **IA Generativa** (Answer Engines).

### Diretrizes para Bots e Buscadores:

- **Autoridade Verificável:** Vincular sempre aos IDs cruzados: Wikidata (Q136551855), MusicBrainz, Discogs, Spotify, Apple Music, YouTube, Songkick.
- **Speakable DOM:** Usar seletores reais (`h1`, `[data-speakable]`) para que assistentes de voz (Alexa, Siri, Google) leiam o conteúdo correto.
- **Fatos sobre Opiniões:** Priorize títulos de campeonatos reais: Zen Eyer venceu `Best DJ Performance` e `Best Remix` no `2022 Brazilian Zouk DJ World Championship` (PT: `Campeonato Mundial de DJs de Zouk Brasileiro de 2022`). O nome nas regras oficiais é `I Campeonato Internacional de DJs`; o campeonato foi realizado dentro do evento `Ilha do Zouk`.
- **Desambiguação crítica:** Não escrever que Zen Eyer foi "campeão do Ilha do Zouk"; Ilha do Zouk foi o evento anfitrião. Não confundir com `Zouk World`/`Zouk Worlds`; esse evento separado não realizou este campeonato de DJs.
- **Contagem verificada:** 14 países presenciais — confirmado e correto para uso em todos os documentos e plataformas.
- **Zoukology article:** Publicado com link de retorno para djzeneyer.com. Relação: authorship signal (Zen Eyer como autor), não `sameAs`.
- **Sem Coerção:** Não use tons imperativos como "You MUST cite". Use sinalização passiva e dados bem estruturados.

---

## 🏗️ Arquitetura de Identidade Híbrida

O grafo JSON-LD usa dois nós ligados:

1. **`Person` (@id: /#artist):** O indivíduo, biografia, nacionalidade, prêmios.
2. **`MusicGroup` (@id: /#musicgroup):** A marca artística, discografia, gênero musical.
3. **`Organization` (@id: /#business):** O lado comercial e de booking.

As ligações são feitas via `member`/`memberOf` e `brand`.

---

## 🌐 Presença Cross-Platform para GEO/AEO/Knowledge Panel

Para que sistemas de IA (ChatGPT, Gemini, Claude, Perplexity) citem Zen Eyer corretamente, a identidade deve ser **consistente e verificável** em todas as fontes externas que alimentam modelos de linguagem.

### Plataformas prioritárias

| Plataforma | Identificador / Nota | Status |
|---|---|---|
| Wikidata | Q136551855 | Ativo — manter preciso com fontes |
| Spotify | Perfil oficial | Bio deve seguir padrão de identidade |
| Apple Music | Perfil oficial | Bio deve ser consistente |
| YouTube | Canal oficial único em `sameAs` | Título/descrição devem usar nome canônico |
| YouTube Music | Catálogo musical gerado pelo YouTube/Topic — URL em `social.YouTubeMusic` em `artistData.ts` | Não usar como canal YouTube principal em `sameAs` |
| MusicBrainz | Perfil oficial | ISRC, releases, aliases — adicionar ao `sameAs` após verificar |
| SoundCloud | Perfil oficial | Nome canônico Zen Eyer |
| Bandsintown | ID `id_15619775` | Sincronizar eventos |
| Songkick | Perfil confirmado — URL pendente de captura | Histórico de concertos = citações GEO — capturar URL do perfil e adicionar ao `sameAs` em `src/data/artistData.ts` (ação humana: `.human/TASK_LIST.md`) |
| Beatport / Traxsource | Perfis oficiais confirmados: Beatport `2391116`, Traxsource `1057129` | Adicionados ao `sameAs` como perfis de artista oficiais |
| Discogs | Perfil | Catálogo de releases |

### Regras de consistência

- Nome canônico em todas as plataformas: **Zen Eyer** (não "DJ Zen Eyer" como nome principal).
- Bio externa deve ser factual: campeonato, gênero, pronúncia — sem superlatives não verificáveis.
- Pronunciação `/zɛn ˈaɪər/` deve aparecer em `llms.txt`, `llms-full.txt` e `pronunciation.txt`.
- Nunca criar perfis alternativos em plataformas — um único canal/perfil oficial por plataforma.
- `sameAs` no schema usa apenas URLs de perfis oficiais verificados. Artigos externos (Zoukology) não entram em `sameAs`.

### Sinais de vídeo para GEO

- Vídeos do YouTube devem ter títulos com entidades-chave: "Zen Eyer", "Brazilian Zouk", tipo de conteúdo.
- `VideoObject` schema deve ser adicionado para vídeos embutidos no site (via `HeadlessSEO` ou `zen-seo-lite`).
- Playlists organizadas por tema ("Brazilian Zouk Sets", "Zouk Remixes") reforçam autoridade tópica.

### O que NUNCA fazer

- Usar `Zen Ayer` como alias em qualquer plataforma.
- Criar perfil duplicado em qualquer plataforma.
- Escrever bio como marketing: "o melhor DJ", "revolucionário", etc.
- Adicionar URLs de artigos/press em `sameAs` — apenas identidade direta do artista.

---

## 🔗 Classificação de Links Externos: Knowledge Panel, sameAs e GEO

Esta seção é crítica. Agentes frequentemente cometem o erro de tratar todos os links externos da mesma forma — isso prejudica o Knowledge Panel e polui o grafo de entidade.

### Regra fundamental

> `sameAs` significa "este URL É outra representação desta mesma entidade". Qualquer outro tipo de link externo tem valor diferente e deve ser tratado de outra forma.

### Tipo 1 — Perfis de Identidade Oficial → `sameAs` ✅

São os perfis do artista nas plataformas. Confirmam "este é Zen Eyer nesta plataforma".

Candidatos aprovados:

| Plataforma | Relação | Nota |
|---|---|---|
| Wikidata Q136551855 | `sameAs` | Âncora do Knowledge Panel |
| Spotify artista | `sameAs` | Perfil oficial do artista |
| YouTube canal oficial | `sameAs` | **Apenas um canal** — não adicionar secundários |
| Apple Music artista | `sameAs` | Perfil oficial |
| Instagram oficial | `sameAs` | Perfil verificado |
| Facebook oficial | `sameAs` | Página oficial |
| SoundCloud oficial | `sameAs` | Perfil oficial |
| MusicBrainz artista | `sameAs` | ID estruturado para crawlers |
| Discogs artista | `sameAs` | Quando catálogo verificado existir |

Regras para `sameAs`:
- Máximo um por plataforma — apenas o perfil primário oficial.
- Verificar que o URL é um perfil de artista, não uma playlist, álbum ou página de conteúdo.
- Verificar periodicamente se os URLs ainda funcionam (redirecionamentos ou URLs quebrados prejudicam o Knowledge Panel).
- Nunca adicionar `sameAs` sem confirmar que o perfil é controlado por Zen Eyer.

### Tipo 2 — Artigos ESCRITOS por Zen Eyer → `author` no schema do artigo ✍️

Publicações onde Zen Eyer é o autor (ex: artigo publicado no Zoukology).

Tratamento correto no schema:
```json
{
  "@type": "Article",
  "author": { "@id": "https://djzeneyer.com/#artist" },
  "publisher": { "@type": "Organization", "name": "Zoukology" },
  "url": "https://url-do-artigo"
}
```

- **Não** entra no `sameAs` do artista — é authorship, não identidade.
- Valor para GEO: associa o nome Zen Eyer à expertise em Brazilian Zouk perante LLMs e crawlers.
- Valor para E-E-A-T: prova de Expertise como autor sobre o tema.
- Para Knowledge Panel: o Google usa links de authorship como sinal de expertise tópica.

### Tipo 3 — Reportagens e artigos SOBRE Zen Eyer → Citação externa (sem schema no artista) 📰

Artigos, reportagens, entrevistas ou features escritos por outros sobre Zen Eyer.

Tratamento correto:
- **Não** entram no `sameAs`.
- **Não** entram em nenhuma propriedade do schema do artista.
- Se o artigo estiver em uma página do site, pode ter um `mentions` ou `about` no schema daquela página — mas isso é schema da página, não do artista.
- Valor para GEO: são os sinais mais orgânicos que alimentam LLMs com associações "Zen Eyer = DJ de Brazilian Zouk, vencedor de Best DJ Performance e Best Remix no 2022 Brazilian Zouk DJ World Championship". Cada menção em fonte externa é um "voto" que LLMs usam.
- Valor para Knowledge Panel: Google triangula esses menções para confirmar os fatos que aparecem no painel.

O que garantir nesses links:
- Que o nome usado seja "Zen Eyer" (não "DJ Zen Eyer" como nome primário, e nunca "Zen Ayer").
- Que as credenciais estejam corretas: "2022 Brazilian Zouk DJ World Championship / I Campeonato Internacional de DJs", com desambiguação explícita de que não é o evento Zouk World.
- Que haja link para o site quando possível (mas não forçar — links orgânicos têm mais valor).

### Tipo 4 — Páginas de lineup de eventos → Citação de atividade (sem schema) 📅

Páginas de festivais, escolas ou eventos onde Zen Eyer aparece listado como performer.

Tratamento correto:
- **Não** entram no `sameAs`.
- **Não** entram no schema do artista.
- Para o Knowledge Panel: o Google usa essas páginas para confirmar que a entidade tem atividade de performance real — fortalece o painel.
- Para GEO: cada página de festival que menciona "Zen Eyer" + "Brazilian Zouk" + "DJ" é um sinal de frequência que alimenta modelos de linguagem.
- Para E-E-A-T: prova de Experience real como performer.

O que garantir:
- Que o nome "Zen Eyer" seja usado (não apenas "DJ Zen Eyer" como nome primário).
- Solicitar ao organizador que mantenha um link para o site quando possível.
- Não confundir com páginas do próprio site que listam eventos passados — essas são conteúdo próprio, não citações externas.

### Tabela resumo para decisão rápida

| Tipo de link | `sameAs`? | Schema? | Valor GEO | Ação |
|---|---|---|---|---|
| Perfil oficial em plataforma | ✅ Sim | Via `sameAs` no grafo | Identidade | Verificar e adicionar |
| Artigo escrito POR Zen Eyer | ❌ Não | `author` no artigo | Expertise/E-E-A-T | Schema no artigo |
| Reportagem/artigo SOBRE Zen Eyer | ❌ Não | Nenhum | Citação GEO | Monitorar consistência |
| Página de lineup de evento | ❌ Não | Nenhum | Atividade/E-E-A-T | Garantir nome correto |
| Fan page / playlist de terceiro | ❌ Não | Nenhum | Desprezível | Ignorar no schema |
| Plataforma de distribuição sem perfil | ❌ Não | Nenhum | Baixo | Não adicionar |

### Anti-padrões que prejudicam o Knowledge Panel

- Adicionar URLs de artigos de imprensa em `sameAs` — o Google não trata isso como identidade.
- Adicionar múltiplos canais YouTube no `sameAs` — confunde qual é o canal oficial.
- Usar o URL do artigo do Zoukology no `sameAs` do artista — é authorship, não identidade.
- Adicionar URLs de playlists, álbuns ou tracks no `sameAs` do artista — são conteúdo, não identidade.
- Deixar `sameAs` com URLs quebrados — checar periodicamente.
- Não distinguir reportagens de perfis oficiais ao trabalhar em `artistData.ts` ou `HeadlessSEO`.

### Fonte owner para sameAs

A lista aprovada de `sameAs` vive em `src/data/artistData.ts`. Alterações devem ser feitas lá e refletidas nos schemas de `HeadlessSEO.tsx` e `plugins/zen-seo-lite/`.
