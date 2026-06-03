# Session Handoff — 2026-05-30

Agent: Claude (claude/pr-610-review-bHVil branch)
Session type: Context architecture review, GEO/AEO strategy documentation, PR review
Working branch: `claude/pr-610-review-bHVil`

---

## O que foi feito nesta sessão e por quê

### Contexto inicial

O PR #610 (`docs(context): consolidate AI context and agent skills`) estava aberto com:
- 41 arquivos de documentação alterados
- 45 commits
- 5 threads de review em aberto (Gemini + Codex), todos marcados como "outdated"
- CI passando (Contract Tests + CodeQL)
- Estado: mergeable, mas com issues não resolvidos

O objetivo da sessão foi analisar o PR, corrigir os gaps identificados, melhorar toda a documentação para GEO/AEO, e tornar o Knowledge Panel e a presença em IAs generativas o mais forte possível.

---

## Passo 1 — Merge do PR #610 no branch de trabalho

**O que:** `git merge origin/claude/claude-md-docs-q4d4R` no branch `claude/pr-610-review-bHVil`.

**Por quê:** O branch de trabalho (`claude/pr-610-review-bHVil`) estava na `main`. Para revisar e melhorar todos os 41 arquivos do PR, precisávamos primeiro ter o conteúdo do PR no branch de trabalho. Merge local, sem criar PR ainda.

---

## Passo 2 — Leitura e análise completa de todos os arquivos

Foram lidos todos os arquivos críticos da hierarquia:
- `AI_CONTEXT_INDEX.md`, `AGENTS.md`, `LEARNINGS.md`
- `.agents/GUIDELINES.md`, `.agents/personas/CLAUDE.md`, `.agents/personas/GEMINI.md`
- `.agents/skills/README.md` e todas as skills principais
- `.context/IDENTITY.md`, `.context/PROJECT.md`, `.context/ARCHITECTURE.md`, `.context/SITE_RESOURCES.md`, `.context/OPERATIONS.md`, `.context/IMPLEMENTATION_STATUS.md`
- `.human/MARKETING_OVERVIEW.md`, `TASK_LIST.md`

**Por quê:** Não é possível fazer melhorias sólidas sem entender o estado completo do sistema. Agentes que editam sem ler primeiro tendem a introduzir contradições ou remover conteúdo crítico.

---

## Passo 3 — Correções de gaps confirmados

### 3.1 `social.YouTubeMusic` ausente em múltiplos arquivos

**Problema:** `LEARNINGS.md` documentava que `social.YouTube` E `social.YouTubeMusic` usam Y e T maiúsculos — mas apenas `social.YouTube` aparecia em `GUIDELINES.md`, `AGENTS.md`, `CLAUDE.md` persona e `AI_CONTEXT_INDEX.md`. Um agente lendo qualquer um desses arquivos sem ler `LEARNINGS.md` cometeria o erro de usar `social.youtubeMusic` lowercase, que não existe no objeto `artistData.ts`.

**Correção:** Adicionado `social.YouTubeMusic` em todos os arquivos que já mencionavam `social.YouTube`:
- `.agents/GUIDELINES.md` — seção "Dados do artista"
- `AGENTS.md` — seção "Armadilhas Conhecidas"
- `.agents/personas/CLAUDE.md` — seção "Decisoes consolidadas"
- `AI_CONTEXT_INDEX.md` — Regras de Ouro
- `.agents/personas/GEMINI.md` — Pontos que se repetem

### 3.2 ESLint ignores não documentados em GUIDELINES

**Problema:** O Gemini Code Assist no PR #610 havia apontado que os diretórios `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules` e `.devcontainer` precisam estar no array `ignores` do `eslint.config.js`. Essa regra existia em prática mas não estava documentada em nenhum arquivo de contexto — agentes futuros poderiam remover esses ignores por "limpeza" e quebrar o build.

**Correção:** Adicionado como item explícito em `.agents/GUIDELINES.md` seção "ESLint", e referenciado em `AI_CONTEXT_INDEX.md`.

### 3.3 Node version incorreta no GEMINI.md

**Problema:** `.agents/personas/GEMINI.md` dizia `Node: 20+` mas o requisito real (documentado em `LEARNINGS.md` e `package.json`) é `>=22.13.0`. Um agente Gemini seguindo essa persona poderia usar Node 20 no CI e ter falhas com Puppeteer 24/25.

**Correção:** Corrigido para `>=22.13.0`.

### 3.4 IMPLEMENTATION_STATUS.md sem aviso de temporário

**Problema:** O arquivo vive em `.context/` ao lado de arquivos permanentes. Um agente lendo `.context/*.md` pode tratar este arquivo como verdade permanente, o que é explicitamente contraindicado pela arquitetura. O aviso de "não é SSOT permanente" estava apenas no `AI_CONTEXT_INDEX.md`, não no próprio arquivo.

**Correção:** Banner de aviso adicionado no topo do arquivo, visível antes de qualquer conteúdo.

### 3.5 5 threads de review em aberto no PR #610

**Problema:** Os 5 threads do Gemini e Codex (todos outdated) apareciam como "open" no PR, dando a impressão de problemas não resolvidos. Na prática, as sugestões foram incorporadas corretamente nas versões posteriores dos arquivos — mas os threads nunca foram marcados como resolvidos.

**Correção:** Todos os 5 threads resolvidos via API GitHub.

---

## Passo 4 — Estratégia GEO/AEO 2025-2026

### 4.1 seo-authority-builder — playbook GEO completo

**O que:** Nova seção "GEO — AI Citation Strategy (2025-2026)" com ~60 linhas.

**Por quê:** A skill existente documentava sinais de autoridade mas não explicava *como* LLMs selecionam fontes, nem dava um playbook operacional para o objetivo do projeto (fazer Zen Eyer famoso com IAs). O gap era entre "ter boa documentação de autoridade" e "entender o mecanismo pelo qual a IA cita fontes".

**O que foi adicionado:**
- Como LLMs selecionam fontes (5 critérios: frequência cross-source, clareza de entidade, fatos verificáveis, autoridade tópica, dados estruturados parseáveis)
- Playbook específico: Enciclopédia de Zouk como topical authority, consistência cross-platform, estratégia de vídeo (YouTube titles, `VideoObject` schema, playlists temáticas), citações externas (Zoukology, festival sites, Wikipedia), machine-readable surfaces
- AEO checklist: FAQ schema, `SpeakableSpecification`, first-paragraph answers, pronunciation file
- Knowledge Panel maintenance
- Anti-padrões GEO (coercive instructions, fabricated proof, sameAs spam)

### 4.2 seo-audit — GEO entity consistency audit

**O que:** Nova seção na checklist de AI discovery com itens de GEO moderno.

**Por quê:** A checklist de AI discovery existente cobria recursos técnicos (llms.txt, .well-known) mas não incluía os checks cross-platform de consistência de entidade que são críticos para Knowledge Panel e GEO.

**O que foi adicionado:** DNS-AID, RFC 8288 Link headers, SpeakableSpecification, VideoObject, Wikidata Q136551855, MusicBrainz consistency, FAQ coercion check, pronunciation file. Mais: GEO entity consistency audit checklist com Spotify, Apple Music, YouTube, Bandsintown, Songkick, MusicBrainz.

### 4.3 schema-markup — VideoObject e SpeakableSpecification

**O que:** Dois novos tipos de schema adicionados à tabela comum + seções de guidance.

**Por quê:**
- `VideoObject`: YouTube é crescentemente importante para GEO. LLMs são treinados em transcrições e metadados de vídeos. Vídeos do YouTube embutidos no site sem `VideoObject` schema perdem sinal de GEO.
- `SpeakableSpecification`: AEO e VSO (Voice Search Optimization). Conteúdo speakable é como assistentes de voz (Google Assistant, Siri, Alexa) escolhem o que ler em resposta a queries de voz.

---

## Passo 5 — IDENTITY.md: presença cross-platform e classificação de links

### 5.1 Seção de presença cross-platform

**O que:** Tabela com 10 plataformas prioritárias, regras de consistência, estratégia de vídeo, o que nunca fazer.

**Por quê:** `.context/IDENTITY.md` é a SSOT de identidade, mas não documentava onde a identidade precisa ser mantida além do site. Agentes trabalhando em schema ou `artistData.ts` precisam saber quais plataformas são prioritárias e como manter consistência — sem isso, cada sessão de agente pode divergir em tratamento.

### 5.2 Seção de classificação de links

**O que:** Documentação completa dos 4 tipos de links externos com tabela de decisão, exemplos, anti-padrões e regras de `sameAs`.

**Por quê (raciocínio completo):**

Este é um dos erros mais comuns e mais prejudiciais que agentes cometem. O mecanismo é:

1. **`sameAs`** no schema.org diz ao Google: "este URL é esta mesma entidade". Quando o Google constrói o Knowledge Panel, ele usa `sameAs` para conectar os dados do site com os dados dessas outras plataformas. Adicionar URLs errados (artigos, lineups, playlist) cria conexões incoerentes na entidade.

2. **Artigos escritos por Zen Eyer** (ex: Zoukology) → schema vai no artigo com `author: {"@id": "/#artist"}`. Isso diz: "Zen Eyer escreveu este artigo". É um sinal de Expertise no E-E-A-T. O Google usa isso para confirmar expertise tópica em Brazilian Zouk. O erro seria colocar o URL do artigo no `sameAs` do artista — o Google não interpreta isso como "este é outro perfil do artista", mas como dado incoerente.

3. **Reportagens sobre ele** (outros escrevem) → não têm relação de schema com o artista. Seu valor é como citação que alimenta LLMs durante treinamento. Cada artigo de imprensa que menciona "Zen Eyer, Brazilian Zouk DJ, winner of Best DJ Performance and Best Remix at the 2022 Brazilian Zouk DJ World Championship" é um token que LLMs aprendem a associar com o nome. Isso não precisa de schema — precisa de consistência de nomenclatura.

4. **Páginas de lineup de eventos** → mesmo caso: não têm relação de schema com o artista. Seu valor é como prova de atividade que o Google usa para confirmar que a entidade é um performer ativo, e como frequência de menção cross-platform para LLMs.

**Fontes do raciocínio:** Google Search Central documentation sobre sameAs, Schema.org specification, Google Knowledge Panel guidelines, e prática estabelecida de entity SEO.

---

## Passo 6 — Documentação humana atualizada

### 6.1 TASK_LIST.md

**O que:** Nova seção "GEO / AEO — Ações de Autoridade com IA" com 5 itens acionáveis. Itens existentes atualizados com contexto estratégico (por que cada ação importa para GEO).

**Por quê:** A lista existente tinha ações corretas mas sem contexto de impacto. Um humano sem contexto profundo de GEO não sabe por que "páginas de festival com nome canônico" é prioritária — ao explicar "páginas de lineup são citações GEO importantes", a ação se torna compreensível e priorizável.

### 6.2 MARKETING_OVERVIEW.md

**O que:** Atualizado com "O caminho mais curto para GEO" (4 pilares), status do Knowledge Panel, referência ao seo-authority-builder skill como fonte estratégica.

**Por quê:** O arquivo existente era um ponteiro correto mas não tinha resumo estratégico suficiente para orientar decisões rápidas. Um humano ou agente lendo este arquivo em 30 segundos deve entender a estratégia central.

---

## Estado dos branches

- Branch de trabalho: `claude/pr-610-review-bHVil`
- Commits desta sessão: 2 commits (merge + melhorias)
- PR #610 (`claude/claude-md-docs-q4d4R` → `main`): threads resolvidos, pronto para merge
- PR de revisão: ainda não criado — este branch pode virar PR novo ou ser usado como base

---

## O que ainda falta (ações humanas)

1. Mergear PR #610 (ou deixar para depois deste branch virar PR)
2. Executar itens de `TASK_LIST.md`: Spotify bio, Apple Music bio, YouTube channel description/titles, Wikidata update com fontes, Bandsintown sync, Zoukology article link
3. Decidir se `VideoObject` schema vira task de código (nova skill ou HeadlessSEO update)
4. Expandir Enciclopédia de Zouk com 10+ termos em tom educacional

---

## Arquivos modificados nesta sessão

```
.agents/GUIDELINES.md              — YouTubeMusic, ESLint ignores, item 3
.agents/personas/CLAUDE.md         — YouTubeMusic em decisoes consolidadas
.agents/personas/GEMINI.md         — Node version, pontos repetidos
.agents/skills/schema-markup/...   — VideoObject, SpeakableSpecification
.agents/skills/seo-audit/...       — GEO entity consistency checklist
.agents/skills/seo-authority-builder/... — Link classification, GEO playbook
.context/IDENTITY.md               — Cross-platform, classificação de links
.context/IMPLEMENTATION_STATUS.md  — Ephemeral warning banner
.human/MARKETING_OVERVIEW.md       — GEO summary, caminhos estratégicos
.human/TASK_LIST.md                — GEO/AEO action items
.human/SESSION_HANDOFF_2026-05-30.md — Este arquivo
AGENTS.md                          — YouTubeMusic, link classification rule
AI_CONTEXT_INDEX.md                — YouTubeMusic, ESLint ignores
LEARNINGS.md                       — Link classification learning
```
