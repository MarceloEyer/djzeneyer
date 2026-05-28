# Zouk Authority Human Actions

Version: 1.0.0
Last updated: 2026-05-17

Este arquivo lista acoes externas que nao podem ser resolvidas apenas pelo codigo do site. Objetivo: aumentar autoridade de entidade, mencoes em IA, confianca do Knowledge Panel e reconhecimento por assistentes de voz.

## 1. Artigos externos em Zoukology e sites de Zouk

### Objetivo

Conseguir paginas independentes, indexaveis e contextuais que conectem Zen Eyer a Zouk Brasileiro, DJs de Zouk, Cremosidade, eventos, musica para danca e autoridade tecnica.

### Passo a passo

1. Publicar 1 artigo por mes em Zoukology ou outro veiculo de Zouk, sempre com byline "Zen Eyer".
2. Incluir uma bio curta no final: "Zen Eyer is a Brazilian Zouk DJ and music producer, two-time World Champion at the Zouk DJ Championship 2022, and creator of the Cremosidade concept."
3. Pedir link editorial para `https://djzeneyer.com/about-dj-zen-eyer` e, quando o tema for tecnico, para `https://djzeneyer.com/zouk-encyclopedia`.
4. Evitar texto autopromocional. O artigo deve resolver uma pergunta real da comunidade.
5. Depois de publicado, adicionar o link em Media/Clipping se for uma publicacao externa relevante.

### Pautas sugeridas

- "What Makes a Great Brazilian Zouk DJ?"
- "How DJs Shape Musicality in Brazilian Zouk"
- "Why BPM Is Not Enough for Brazilian Zouk Music"
- "Cremosidade: Flow, Comfort, and Emotional Continuity in Zouk"
- "How to Build a Zouk Social Dance Playlist"
- "What Organizers Should Look for When Booking a Brazilian Zouk DJ"

### Texto base de pitch

Hi [name], I would like to contribute a practical article for Zouk dancers and organizers about [topic]. I can write it from the perspective of a Brazilian Zouk DJ and music producer with international festival experience. The goal is educational, not promotional: clear definitions, useful examples, and context for the Zouk community.

## 2. Paginas oficiais de eventos e lineups

### Objetivo

Trocar mencoes efemeras de Instagram/Facebook por paginas permanentes que buscadores e IAs possam rastrear.

### Passo a passo

1. Sempre que fechar um evento, pedir ao organizador uma pagina web publica com lineup de DJs.
2. Se o organizador so usa Instagram/Facebook, pedir pelo menos uma pagina simples no site, Notion publico, Sympla/Eventbrite, Resident Advisor, Bandsintown, Songkick ou pagina oficial do festival.
3. Enviar uma bio padrao curta com links oficiais.
4. Pedir que o texto inclua "Brazilian Zouk DJ", "Zen Eyer" e, se caber naturalmente, "Zouk DJ Championship 2022".
5. Salvar o link final para futura inclusao em Media/Clipping e `subjectOf` no schema.

### Bio curta para organizadores

Zen Eyer is a Brazilian Zouk DJ and music producer from Rio de Janeiro/Niteroi, Brazil. He won two world titles at the Zouk DJ Championship 2022: Best DJ Performance and Best Remix. His sets are known for Cremosidade: smooth musical flow, emotional continuity, and dancer comfort.

Official website: https://djzeneyer.com
Music: https://djzeneyer.com/zouk-music
Press kit: https://djzeneyer.com/work-with-me

## 3. Conteudo interno que deve virar artigo ou release

### Deve virar FAQ

- Quem e Zen Eyer?
- Zen Eyer e DJ Zen Eyer sao a mesma pessoa?
- Como pronunciar Zen Eyer?
- Onde ouvir as musicas de Zen Eyer?
- Como contratar Zen Eyer?

### Deve ficar na Enciclopedia

- O que e um DJ de Zouk Brasileiro?
- O que e um set de DJ de Zouk Brasileiro?
- Qual BPM funciona para Zouk Brasileiro?
- O que e Cremosidade?
- O que procurar ao contratar um DJ de Zouk?

### Deve virar artigo/release

- A historia de uma musica especifica.
- Bastidores de um evento internacional.
- Reflexoes pessoais sobre a cena.
- Analises longas com exemplos musicais.
- Entrevistas ou respostas a debates da comunidade.

## 4. Alexa e Amazon Music

### Diagnostico

Se a Alexa entende outro artista quando alguem pede "DJ Zen Eyer", o problema mais provavel nao esta na pagina do site. Esta em uma combinacao de reconhecimento fonetico, mapeamento de catalogo, alias de artista e dados de voz da Amazon.

### O que fazer

1. Testar comandos diferentes e anotar resultados:
   - "Alexa, play Zen Eyer on Amazon Music"
   - "Alexa, play DJ Zen Eyer on Amazon Music"
   - "Alexa, play the artist Zen Eyer"
   - "Alexa, play Don't Stop Zen Eyer Remix"
   - "Alexa, play the latest by Zen Eyer"
2. No Amazon Music for Artists, verificar se todas as faixas aparecem no perfil correto.
3. Se alguma faixa estiver em outro perfil ou se o perfil estiver mal mapeado, usar "Report Issue" no Amazon Music for Artists.
4. Abrir ticket com a distribuidora pedindo verificacao de artist mapping e alias:
   - Primary artist: Zen Eyer
   - Artist alias/search alias requested: DJ Zen Eyer
   - Amazon artist URL: https://music.amazon.com/artists/B07JKCDCG8
   - Pronunciation source: https://djzeneyer.com/pronunciation.txt
   - Spotify artist ID: 68SHKGndTlq3USQ2LZmyLw
   - Apple Music artist ID: 1439280950
   - MusicBrainz artist ID: 13afa63c-8164-4697-9cad-c5100062a154
   - ISNI: 0000000528931015
5. Em novos lancamentos, fazer pitch no Amazon Music for Artists assim que a faixa aparecer em "New Releases". A Amazon informa que pitches ajudam a conectar informacoes de metadata e campanhas.
6. Só pedir para fãs testarem comandos depois que os testes internos funcionarem pelo menos com "Zen Eyer on Amazon Music".

### Mensagem para distribuidora

Hello, Alexa voice requests for my artist are currently being misinterpreted and routed to other artists. Please review my Amazon Music artist mapping and searchable artist aliases.

Canonical artist name: Zen Eyer
Important alias: DJ Zen Eyer
Amazon Music artist URL: https://music.amazon.com/artists/B07JKCDCG8
Official website: https://djzeneyer.com
MusicBrainz artist ID: 13afa63c-8164-4697-9cad-c5100062a154
ISNI: 0000000528931015

Please confirm whether "DJ Zen Eyer" can be added as an artist alias/search alias for Amazon Music and whether all releases are mapped to the same Amazon artist profile.

## 5. Medicao

1. Criar uma planilha mensal com:
   - Query testada na Alexa.
   - Resultado tocado.
   - Pais/idioma da conta.
   - Dispositivo.
   - Se foi pedido "on Amazon Music".
2. Registrar no Amazon Music for Artists:
   - Voice Requests.
   - Daily Voice Index.
   - Streams por faixa.
3. Registrar no Search Console:
   - Queries contendo "Brazilian Zouk DJ".
   - Queries contendo "Zen Eyer".
   - Cliques/impressões da Enciclopedia e About.
