# Human Action Items & Strategy (Marcelo / Zen Eyer)

Version: 2.0.0

Este diretório contém tarefas que exigem acesso humano a plataformas externas, credenciais ou decisões de produto. Agentes de IA não conseguem executar estes itens diretamente.

---

## ✅ Concluídos (não remover — servem como memória)

- [x] **Google Knowledge Panel:** Entidade reivindicada via Google Search Console.
- [x] **Zoukology article:** Publicado com link de retorno para djzeneyer.com.
- [x] **14 países presenciais:** Contagem confirmada como correta para todos os documentos.
- [x] **Wikidata Q136551855:** Dados completados — website oficial (P856), championship claim com referência, MusicBrainz ID, nationalidade, data de nascimento e gênero verificados.
- [x] **MusicBrainz:** Perfil de artista criado/verificado com nome, sort name, releases, aliases (DJ Zen Eyer), links para Wikidata e djzeneyer.com. URL/ID adicionado ao `src/data/artistData.ts` e ao `sameAs`.
- [x] **Bandsintown:** Eventos sincronizados, nome canônico "Zen Eyer" e website `djzeneyer.com` conferidos (manager ID: `id_15619775`).
- [x] **Songkick:** Perfil verificado — nome, website e histórico de eventos conferidos. URL do perfil presente em `src/data/artistData.ts`.

---

## 🔴 Alta Prioridade — Plataformas de Identidade (impacto direto no Knowledge Panel e GEO)

### Spotify for Artists — Atualizar bio

**Por quê:** A bio do Spotify é uma das fontes primárias que o Google e LLMs usam para confirmar fatos da entidade "Zen Eyer". Bio desatualizada ou com linguagem promocional enfraquece o sinal.

**Passos:**
1. Acesse `artists.spotify.com` com sua conta de artista.
2. Vá em **Profile** → **Edit profile**.
3. Campo **Bio (PT):** substitua pelo texto:
   > Zen Eyer é DJ e produtor de Brazilian Zouk. Vencedor de Best DJ Performance e Best Remix no Campeonato Mundial de DJs de Zouk Brasileiro de 2022 / I Campeonato Internacional de DJs. Criador do conceito Cremosidade — a filosofia sonora que faz a música abraçar o dançarino. Presença em 14 países.
4. Campo **Bio (EN):**
   > Zen Eyer is a Brazilian Zouk DJ and producer. Winner of Best DJ Performance and Best Remix at the 2022 Brazilian Zouk DJ World Championship / I Campeonato Internacional de DJs. Creator of the Cremosidade concept: the art of making music embrace the dancer. Active in 14 countries.
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
   > Zen Eyer — DJ e produtor de Brazilian Zouk. Criador do conceito Cremosidade. Vencedor de Best DJ Performance e Best Remix no Campeonato Mundial de DJs de Zouk Brasileiro de 2022. Música, sets e remixes de Brazilian Zouk. Pronunciação: /zɛn ˈaɪər/ (Zen rima com "Zen Buddhism"; Eyer soa como "Eye-er"). Website: djzeneyer.com
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
1. Pesquisar no Wikipedia em inglês e português: "Brazilian Zouk DJ World Championship", "I Campeonato Internacional de DJs", "Campeonato Mundial de DJs de Zouk Brasileiro".
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

### Auditorias pendentes das páginas públicas e área logada

- [ ] Fazer análise detalhada da página **Work With Me / Trabalhe Comigo** em uma rodada própria.
- [ ] Auditar **Enciclopédia**, **FAQ**, **About Me**, **Lançamentos** e **Notas** depois da revisão específica dessas páginas.
- [ ] Auditar a **área logada**: dashboard, conta, pedidos, badges, newsletter e fluxos de autenticação.
- [ ] Conferir o **botão de newsletter do rodapé**: destino, inscrição, lista correta, copy, consentimento e feedback visual.
- [ ] Revisar manualmente o PR atual de ajustes de loja, Zen Tribe, imprensa e apoio depois dos reviews dos agentes e checks do GitHub.
- [ ] Decidir o modelo do WhatsApp da Zen Tribe antes de publicar link aberto: grupo, comunidade, canal de avisos ou lista de espera, com regras claras contra spam.
- [ ] Confirmar dados de pagamento nos apps oficiais do Inter, Wise e PayPal antes de depender deles para pagamentos maiores.

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

### /labs — Página de Experimentos de IA

**O que é:** Uma rota `/labs` (e `/pt/labs`) no site com cards de mini-ferramentas interativas temáticas do universo Zouk/DJ Zen Eyer. Cada card tem título, descrição curta e abre o experimento.

**Por que vale fazer:** Dois benefícios diretos —
1. **Branding técnico:** reforça a identidade de DJ que pensa em inovação e IA, alinha com a pegada futurista do Zen Eyer.
2. **SEO de cauda longa:** páginas indexáveis com conteúdo original sobre Zouk (BPM, musicalidade, setlist) que ninguém mais tem.

**Só faz sentido quando tiver ≥ 2 experimentos com substância.** Um card só fica vazio.

**Experimentos sugeridos (a decidir quais implementar primeiro):**
- **Setlist Builder** — escolhe duração (1h/2h/4h), horário (abertura/pico/fechamento) e mood (cremoso/progressivo/energético). Monta sequência lógica com a discografia + lógica editorial do Zen. Sem IA externa — lógica determinística.
- **BPM Trainer** — digita um BPM, vê metrônomo visual animado. Útil para professores e dançarinos. SEO em "Zouk BPM guide", "Brazilian Zouk tempo".
- **Quiz de Personagem Zouk** — já existe em `/quiz`. Poderia ser card no /labs também.
- **Gerador de capa de EP** — playground visual com fontes e paletas da identidade do Zen.

**Decisão pendente (humano):**
- Qual nav item ou link vai apontar para /labs? (Não tem posição decidida ainda.)
- Quais experimentos implementar na v1?
- O /labs fica dentro do site principal ou num subdomínio (`labs.djzeneyer.com`)?

**Para agentes:** quando a decisão de produto for tomada, implementar como rota nova em `src/pages/LabsPage.tsx`, registrar em `routes-slugs.json` (key: `labs`, en: `labs`, pt: `labs`) e em `src/config/routes.ts`. Seguir o padrão de `EncyclopediaPage` para estrutura de hub com cards.

---

---

## ⚙️ Configurações Externas Pontuais

- **WordPress / Polylang menu PT:** Em **Aparência → Menus**, selecionar o menu português e alterar o item customizado "Trabalhe Comigo" de `/work-with-me/` para `/pt/trabalhe-comigo/`. Depois salvar o menu e validar `GET /wp-json/djzeneyer/v1/menu?lang=pt`. O backend localiza links via `routes-slugs.json`, mas o cadastro no WordPress também deve refletir a URL canônica.
- **LiteSpeed Plugin:** Revisar regras de exclusão de cache se o login via JWT apresentar instabilidade.
- **MailPoet:** Validar se os novos inscritos via `/subscribe` estão entrando na lista correta.
- **Estratégia completa:** Consultar [ZEN_EYER_ZOUK_AUTHORITY_ACTION_PLAN.md](ZEN_EYER_ZOUK_AUTHORITY_ACTION_PLAN.md) para ações de longo prazo.
