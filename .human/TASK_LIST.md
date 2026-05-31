# Human Action Items & Strategy (Marcelo / Zen Eyer)

Version: 2.0.0

Este diretório contém tarefas que exigem acesso humano a plataformas externas, credenciais ou decisões de produto. Agentes de IA não conseguem executar estes itens diretamente.

---

## ✅ Concluídos (não remover — servem como memória)

- [x] **Google Knowledge Panel:** Entidade reivindicada via Google Search Console.
- [x] **Zoukology article:** Publicado com link de retorno para djzeneyer.com.
- [x] **14 países presenciais:** Contagem confirmada como correta para todos os documentos.

---

## 🔴 Alta Prioridade — Plataformas de Identidade (impacto direto no Knowledge Panel e GEO)

### Spotify for Artists — Atualizar bio

**Por quê:** A bio do Spotify é uma das fontes primárias que o Google e LLMs usam para confirmar fatos da entidade "Zen Eyer". Bio desatualizada ou com linguagem promocional enfraquece o sinal.

**Passos:**
1. Acesse `artists.spotify.com` com sua conta de artista.
2. Vá em **Profile** → **Edit profile**.
3. Campo **Bio (PT):** substitua pelo texto:
   > Zen Eyer é DJ, produtor e bicampeão mundial de Brazilian Zouk. Vencedor do Zouk DJ Championship 2022 / I Campeonato Internacional de DJs nas categorias Best DJ Performance e Best Remix. Criador do conceito Cremosidade — a filosofia sonora que faz a música abraçar o dançarino. Presença em 14 países.
4. Campo **Bio (EN):**
   > Zen Eyer is a Brazilian Zouk DJ, producer, and two-time world champion. Winner of the Zouk DJ Championship 2022 / I Campeonato Internacional de DJs (Best DJ Performance and Best Remix). Creator of the Cremosidade concept: the art of making music embrace the dancer. Active in 14 countries.
5. **Regras para a bio:** não usar "melhor DJ", "revolucionário", "única no mundo" ou qualquer superlativo não verificável. Apenas fatos com fonte.
6. Verificar que o **nome do artista** no campo de identidade está como "Zen Eyer" (não "DJ Zen Eyer").

---

### Apple Music for Artists — Verificar e atualizar bio

**Por quê:** Consistência cross-platform. Quando uma IA compara Spotify com Apple Music e encontra nomes ou fatos diferentes, a confiança na entidade diminui.

**Passos:**
1. Acesse `artists.apple.com` com sua conta Apple Music for Artists.
2. Vá em **Profile** → editar bio.
3. Use bio factual idêntica ao Spotify (adaptar ao limite de caracteres se necessário).
4. Verificar que o **nome principal** está como "Zen Eyer".
5. Se houver campo de "também conhecido como", adicionar "DJ Zen Eyer".
6. Se tiver opção de pronunciação ou notas fonéticas, adicionar `/zɛn ˈaɪər/`.

---

### YouTube — Otimizar canal principal

**Por quê:** YouTube é crescentemente usado por LLMs (incluindo Search Generative Experience do Google) como sinal de identidade e atividade. Títulos e descrições de vídeos são texto indexável.

**Passos — canal principal:**
1. Acesse YouTube Studio → **Customization** → **Basic info**.
2. **Nome do canal:** garantir que está como "Zen Eyer" (não "DJ Zen Eyer").
3. **Descrição do canal:** atualizar para algo como:
   > Zen Eyer — DJ, produtor e bicampeão mundial de Brazilian Zouk. Criador do conceito Cremosidade. Zouk DJ Championship 2022. Música, sets e remixes de Brazilian Zouk. Pronunciação: /zɛn ˈaɪər/ (Zen rima com "Zen Buddhism"; Eyer soa como "Eye-er"). Website: djzeneyer.com
4. Verificar que o **website** linkado é `https://djzeneyer.com`.

**Passos — vídeos principais:**
1. Para os 10 vídeos com mais views: editar **título** para incluir "Zen Eyer" + "Brazilian Zouk" + tipo de conteúdo.
   - Exemplos de padrão: `"[Nome da Música] — Brazilian Zouk Remix — Zen Eyer"` ou `"Brazilian Zouk DJ Set — [Evento/Ano] — Zen Eyer"`.
2. Editar **descrição** de cada vídeo para incluir na primeira linha o nome do artista + credencial + link para o site.

**Passos — playlists:**
1. Criar playlist: `"Brazilian Zouk DJ Sets — Zen Eyer"` — adicionar todos os sets.
2. Criar playlist: `"Zouk Remixes — Zen Eyer"` — adicionar todos os remixes.
3. Criar playlist: `"Brazilian Zouk Music — Zen Eyer"` — mix de curadoria.
4. Cada playlist deve ter descrição com nome canônico + tipo de conteúdo.

---

### YouTube Music — Verificar consistência do canal separado

**Por quê:** O YouTube Music tem um canal separado. O URL já está em `src/data/artistData.ts` na chave `social.YouTubeMusic`. A consistência entre os dois canais é crítica.

**Passos:**
1. Acesse o perfil do artista no YouTube Music.
2. Verificar que o **nome** está como "Zen Eyer" (não "DJ Zen Eyer").
3. Verificar que a **bio** (se editável) está alinhada com a do Spotify.
4. Verificar que os **releases principais** aparecem corretamente.
5. Se possível, verificar que o canal está vinculado ao canal YouTube principal.

---

### Wikidata Q136551855 — Adicionar fontes e completar dados

**Por quê:** Wikidata é a âncora do Knowledge Panel do Google. Fatos sem referência podem ser removidos por editores. Com fontes verificáveis, os fatos ficam estáveis e o painel fica mais robusto.

**Passos:**
1. Acesse `https://www.wikidata.org/wiki/Q136551855` logado com sua conta Wikimedia.
2. **Championship claim:** verificar se o item "vencedor do Zouk DJ Championship 2022" existe e tem uma referência (URL para site oficial do campeonato ou artigo de imprensa que comprove).
3. **Website oficial:** adicionar propriedade P856 (official website) com valor `https://djzeneyer.com` se não existir.
4. **MusicBrainz ID:** adicionar propriedade P434 com o ID do MusicBrainz quando tiver o perfil criado/verificado.
5. **Nationality:** verificar se "Brazilian" / "Brasileiro" está correto.
6. **Date of birth:** `1985-08-20` — verificar se está presente.
7. **Genre:** verificar se "Brazilian Zouk" está listado como gênero musical.
8. **Description:** verificar que a descrição curta é factual (ex: "Brazilian Zouk DJ and music producer").
9. Não adicionar afirmações sem fonte verificável.

---

### MusicBrainz — Criar ou completar perfil de artista

**Por quê:** MusicBrainz é um banco de dados estruturado usado por serviços de descoberta musical, crawlers acadêmicos e referências cruzadas de identidade. Usado como `sameAs` no schema.

**Passos:**
1. Acesse `musicbrainz.org` e crie conta se não tiver.
2. Pesquise "Zen Eyer" — se já existir um rascunho ou entrada incompleta, claim/edite.
3. Se não existir, crie um novo **Artist** com:
   - **Name:** Zen Eyer
   - **Sort name:** Eyer, Zen
   - **Type:** Person
   - **Gender:** Male
   - **Area:** Brazil
   - **Begin date:** 1985-08-20
   - **Aliases:** DJ Zen Eyer (search hint)
4. Adicionar **releases** conhecidos (EPs, singles, remixes) com ISRC quando disponível.
5. Adicionar link para Wikidata Q136551855 (propriedade "Wikidata").
6. Adicionar link para `djzeneyer.com` como site oficial.
7. Após criar/verificar, pegar a **URL do perfil** (ex: `https://musicbrainz.org/artist/[UUID]`) e adicionar a `src/data/artistData.ts` na chave `social.MusicBrainz` (ou similar) e no array `sameAs`.

---

### Bandsintown — Verificar sync de eventos

**Por quê:** Páginas de eventos no Bandsintown são indexadas e aparecem em buscas por "Zen Eyer shows" e "Brazilian Zouk DJ events". São citações de atividade para o Knowledge Panel.

**Passos:**
1. Acesse `manager.bandsintown.com` (ID: `id_15619775`).
2. Verificar que os próximos eventos estão sincronizados e aparecem corretamente.
3. Verificar que a **bio do artista** no Bandsintown usa nome canônico "Zen Eyer".
4. Verificar que o **website** linkado é `https://djzeneyer.com`.
5. Para cada evento listado: confirmar que o nome do artista na lineup é "Zen Eyer" (não "DJ Zen Eyer").

---

### Songkick — Verificar perfil de artista

**Por quê:** Songkick tem perfil oficial. Páginas de histórico de concertos e eventos futuros são citações de atividade valiosas para GEO e Knowledge Panel.

**Passos:**
1. Acesse o perfil no Songkick e faça login com a conta artista (se houver).
2. Verificar que o **nome** está como "Zen Eyer".
3. Verificar que o **website** linkado é `https://djzeneyer.com`.
4. Verificar que eventos históricos importantes estão registrados.
5. Pegar a **URL do perfil** (ex: `https://www.songkick.com/artists/[ID]-zen-eyer`) e verificar se já está em `src/data/artistData.ts` — se não estiver, adicionar ao `sameAs`.
6. Para eventos futuros confirmados: adicionar manualmente no Songkick caso não sincronize automaticamente do Bandsintown.

---

## 🟡 Média Prioridade — GEO e Autoridade

### Festival pages — Protocolo pós-evento

**Por quê:** Cada página de festival que lista "Zen Eyer" como performer é uma citação de atividade que o Google usa para confirmar entidade ativa e LLMs usam como sinal de frequência de menção.

**Protocolo (executar após cada festival):**
1. Após o evento, localizar a página do festival (site, Facebook, Instagram do organizador).
2. Se o nome usado for "DJ Zen Eyer" como nome primário, contactar o organizador e pedir para mudar para "Zen Eyer" (com "DJ Zen Eyer" como subtítulo ou alias, se quiserem).
3. Pedir gentilmente que adicionem um link para `https://djzeneyer.com` na bio ou na página de lineup.
4. **Template de mensagem:**
   > Oi! Obrigado pelo evento. Para fins de SEO e consistência de identidade, você consegue atualizar meu nome na lineup para "Zen Eyer" (ao invés de "DJ Zen Eyer")? O link oficial é djzeneyer.com. Ajuda bastante para que buscas me encontrem corretamente.

---

### Wikipedia — Pesquisar e avaliar oportunidade

**Por quê:** Wikipedia é uma das fontes mais citadas por LLMs e uma das principais âncoras do Knowledge Panel do Google. Um artigo sobre o **campeonato** (não sobre Zen Eyer diretamente) que mencione o vencedor de 2022 seria o sinal GEO mais forte possível.

**Passos:**
1. Pesquisar no Wikipedia em inglês e português: "Zouk DJ Championship", "I Campeonato Internacional de DJs", "Brazilian Zouk Championship".
2. Se **não existir artigo**: avaliar criar um artigo sobre o campeonato em si — focado nos fatos do evento, não em você. Um artigo neutro sobre o campeonato que mencione "o vencedor de 2022, Zen Eyer" tem maior chance de ser aceito do que um artigo biográfico.
3. Se **já existir artigo**: verificar se menciona o resultado de 2022 e se o nome está correto.
4. Qualquer artigo no Wikipedia sobre o campeonato deve citar fontes externas verificáveis (site do campeonato, notícia, etc.) — não pode citar apenas o próprio site do artista.
5. Antes de criar, consultar as políticas de notoriedade do Wikipedia para artistas musicais e eventos.

---

### Enciclopédia de Zouk — Expandir conteúdo

**Por quê:** Ser a fonte mais completa sobre Brazilian Zouk na internet é a estratégia GEO mais poderosa a longo prazo. Quando alguém perguntar a um LLM "o que é Brazilian Zouk?", o objetivo é que a resposta venha (ou cite) a enciclopédia de djzeneyer.com.

**Passos:**
1. Identificar 10+ termos de alto valor relacionados a Brazilian Zouk que têm pouca cobertura online.
   - Sugestões: "Cremosidade", "musicality in zouk", "Brazilian Zouk vs Lambada", "zouk body movement", "zouk DJ technique", "Brazilian Zouk festivals", "zouk musicality", "zouk improvisation".
2. Para cada termo: escrever 300-600 palavras em tom educacional neutro — como um professor ou enciclopedista escreveria, não como marketing.
3. **Tom a evitar:** "Zen Eyer é o melhor em X", "única abordagem correta", autopromocional.
4. **Tom correto:** factual, verificável, rico em contexto histórico e técnico, com referências quando possível.
5. Incluir o conceito de Cremosidade como filosofia musical com contexto, história e explicação técnica — este é o diferencial único do artista.

---

### Cloudflare — Purge cache

**Quando fazer:** após mergear PRs que alterem arquivos públicos (`robots.txt`, `llms.txt`, `llms-full.txt`, `.well-known/*`, `sitemap.xml`, HTML pré-renderizado ou assets de rota pública).

**Passos (purge direcionado — padrão):**
1. Acesse o Cloudflare dashboard.
2. Vá em **Caching** → **Configuration** → **Purge Cache**.
3. Selecione **Custom Purge** e informe as URLs específicas afetadas (ex: `https://djzeneyer.com/`, `https://djzeneyer.com/about-dj-zen-eyer`, `https://djzeneyer.com/robots.txt`).
4. Confirmar que o site está acessível e os arquivos atualizados após o purge.

**Purge Everything** — usar apenas quando o deploy trocar o hash de todos os assets (bundle completo) ou em situação de emergência. Não é o padrão.

---

## 🟢 Baixa Prioridade / Longo Prazo

### VideoObject schema — Tarefa de código (para agentes)

**O que:** Adicionar schema `VideoObject` para vídeos do YouTube embutidos nas páginas do site.
**Por quê:** Vídeos com schema estruturado aparecem em resultados de busca com thumbnail + duração e alimentam GEO com sinal de vídeo.
**Nota para agentes:** implementar em `src/components/HeadlessSEO.tsx` ou `plugins/zen-seo-lite/`. Ver `.agents/skills/schema-markup/SKILL.md` para guidance completo.

---

### Colabs e calendário editorial

- [ ] Identificar parceiros para colabs musicais/remixes de Zouk.
- [ ] Planejar calendário editorial baseado em posts de Releases no WordPress.
- [ ] Revisar a "Cremosidade" da PhilosophyPage para alinhamento com a nova voz.

---

## ⚙️ Configurações Externas Pontuais

- **LiteSpeed Plugin:** Revisar regras de exclusão de cache se o login via JWT apresentar instabilidade.
- **MailPoet:** Validar se os novos inscritos via `/subscribe` estão entrando na lista correta.
- **Estratégia completa:** Consultar [ZEN_EYER_ZOUK_AUTHORITY_ACTION_PLAN.md](ZEN_EYER_ZOUK_AUTHORITY_ACTION_PLAN.md) para ações de longo prazo.
