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

- **Autoridade Verificável:** Vincular sempre aos IDs cruzados: Wikidata (Q136551855), MusicBrainz, ISNI, Discogs, Spotify, Apple Music, YouTube.
- **Speakable DOM:** Usar seletores reais (`h1`, `[data-speakable]`) para que assistentes de voz (Alexa, Siri, Google) leiam o conteúdo correto.
- **Fatos sobre Opiniões:** Priorize títulos de campeonatos reais (Bicampeão Mundial de Zouk) e dados de turnês.
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
| YouTube Music | Canal linkado via `social.YouTubeMusic` | Consistência com nome artístico |
| MusicBrainz | Perfil oficial | ISRC, releases, aliases |
| SoundCloud | Perfil oficial | Nome canônico Zen Eyer |
| Bandsintown | ID `id_15619775` | Sincronizar eventos |
| Songkick | Perfil oficial | Páginas de eventos = citações GEO |
| Beatport / Traxsource | Catálogo DJ | Presença fortalece autoridade |
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
