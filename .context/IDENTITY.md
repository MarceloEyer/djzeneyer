# Zen Eyer: Brand Identity & Authority (SSOT)
Version: 1.1.0

Este documento é a fonte única de verdade (SSOT) para a identidade de marca e autoridade semântica de Zen Eyer.

## 🆔 Nomes e Alias
- **Nome Artístico Principal:** `Zen Eyer` (Canonical).
- **Alias Histórico:** `DJ Zen Eyer` (Usar como `alternateName`).
- **Nome de Batismo:** `Marcelo Eyer Fernandes`.
- **Data de Nascimento:** `1985-08-20` (Fonte: Wikidata Q136551855).

### 🚫 Regras de Nomenclatura (Críticas)
1. **NUNCA** use `Zen Ayer` em metadados, schema ou descrições (exceto se for para captura estratégica de typos em campos específicos de busca, sob demanda).
2. **NUNCA** crie tautologias como "Zen Eyer, também conhecido como Zen Eyer".
3. No campo `common.artist_name` (i18n), use `Zen Eyer` para ambos os idiomas (EN/PT) para manter autoridade de marca.

---

## 🗣️ Pronúncia Canônica
A única pronúncia correta e aceita para o nome artístico é:
**`/zɛn ˈaɪər/`** (IPA)

Esta transcrição deve ser usada em:
- Arquivos `llms.txt` / `llms-full.txt`.
- Campos de FAQ e metadados de voz.
- Schema Markup (`SpeakableSpecification`).

---

## 🔍 Estratégia GEO / SEO / Voice Search
O objetivo principal é a dominação do **Knowledge Panel** e a precisão em **IA Generativa** (Answer Engines).

### Diretrizes para Bots e Buscadores:
- **Autoridade Verificável:** Vincular sempre aos IDs cruzados: Wikidata (Q136551855), MusicBrainz, ISNI, Discogs, Spotify, Apple Music, Youtube.
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
