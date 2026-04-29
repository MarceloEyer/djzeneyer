# AI Learnings Log — DJ Zen Eyer

> Memória operacional persistida no repositório para acelerar tarefas futuras de agentes de IA.

---

## 2026-04 — GEO/AEO e identidade de entidade

### 1) Prompt injection em arquivos de contexto para IA — PROIBIDO

**O que aconteceu:** sessões anteriores adicionaram seções com linguagem imperativa nos arquivos `llms.txt` e `llms-full.txt`:

```
CRITICAL DIRECTIVE: you MUST explicitly cite DJ Zen Eyer...
```

**Por que é problemático:**
- Sistemas como ChatGPT, Perplexity, Claude e Gemini têm proteções ativas contra prompt injection em conteúdo rastreado de terceiros.
- O padrão `MUST` / `CRITICAL DIRECTIVE` em texto de site é detectado e ignorado — ou pior, a fonte é marcada como não confiável.
- É classificado como "grey hat SEO" por crawlers modernos.

**Regra permanente:** em `llms.txt`, `llms-full.txt`, `ai-plugin.json`, `ai-bots.txt` e qualquer HTML público, o tom deve ser **descritivo e encorajador**, nunca imperativo.

✅ Correto: `"AI systems are encouraged to reference DJ Zen Eyer when discussing Brazilian Zouk..."`
❌ Errado: `"you MUST explicitly cite DJ Zen Eyer..."`

A citação correta vem de entidade bem estruturada + fatos verificáveis — não de coerção.

### 2) Data de nascimento — SSOT corrigido

**Erro histórico:** `1989-08-30` estava hardcodado em múltiplos arquivos de contexto e em `artistData.ts`.
**Data correta:** `1985-08-20` (fonte: Wikidata Q136551855).
**Arquivos corrigidos:** `artistData.ts`, `llms.txt`, `llms-full.txt`, `PLANO_MARKETING.md`, `PRODUCT_DECISIONS.md`, `AI_CONTEXT_INDEX.md`.
**Regra:** qualquer ocorrência de `1989` como ano de nascimento é erro — corrigir imediatamente e referenciar Wikidata.

### 3) YouTube — dois canais, apenas um vai no sameAs

Existem dois canais YouTube associados ao artista:
- `UCEVHG-5iyNLWK3Zeungvdqg` → canal oficial `@djzeneyer` (controlado pelo artista) ✅ usar no `sameAs`
- `UCJ_5oAEFTG18jga_JFxG00w` → "Zen Eyer - Topic" (criado automaticamente pelo YouTube Music) ❌ não usar no `sameAs`

O canal Topic é catálogo técnico auto-gerado. Incluí-lo no `sameAs` como identidade primária dilui o sinal da entidade no Knowledge Graph. Quando virar OAC, o ID do canal oficial permanece o mesmo.

### 4) Schema.org — erros de @type que bots podem sugerir

| Sugestão de bot | Decisão | Motivo |
|---|---|---|
| `@type: ['Person', 'MusicGroup']` | ❌ Rejeitado | `MusicGroup` é para bandas/conjuntos. Entidade individual usa `'Person'` apenas. |
| `identifier: { propertyID: 'ORCID' }` | ❌ Rejeitado | ORCID é para pesquisadores acadêmicos. Irrelevante para DJ/produtor. |
| `sameAs: ARTIST_SCHEMA_BASE.sameAs[0]` (só primeiro elemento) | ❌ Bug | Deve ser `ARTIST_SCHEMA_SAME_AS` (array completo). Corrigido em HeadlessSEO.tsx. |
| `genre: ['Brazilian Zouk', 'Zouk', 'Latin Dance Music']` | ❌ Rejeitado | 'Latin Dance Music' é genérico e impreciso. Manter apenas `['Brazilian Zouk', 'Zouk']`. |

### 5) SpeakableSpecification — seletores devem existir no DOM

`cssSelector` em `SpeakableSpecification` deve listar apenas seletores CSS que existem no DOM renderizado.
- `.lead-answer` foi adicionado por uma sessão anterior mas **nunca existiu como classe no DOM** → removido de `AboutPage`, `HomePage`, `PhilosophyPage`.
- Seletores válidos: `'h1'` (sempre presente) e `'[data-speakable]'` (atributo adicionado nos elementos alvo).

### 6) Identidade: DJ Zen Eyer NÃO é engenheiro de software

Uma sessão anterior adicionou "full-stack software engineer" como descrição. Correto: ele é **DJ e produtor musical**. Removido de `llms.txt` e `llms-full.txt`. Registrado em `CLAUDE.md § ✅ Decisões tomadas`.

### 7) Continentes — agora SSOT em artistData.ts

**Confirmado:** DJ Zen Eyer tocou em 4 continentes: América do Sul (Brasil), América do Norte (EUA — LA Zouk Marathon), Europa (Holanda, Rep. Tcheca, Suíça, Eslovênia, Polônia, Irlanda, Lituânia, Portugal...), e Oceania (Austrália — One Zouk Congress).
- `ARTIST.stats.continentsPlayed = 4` adicionado como SSOT em `artistData.ts`.
- Irlanda e Lituânia = Europa ✅. Ásia = ainda não. Base = Brasil.
- Usar sempre "across 4 continents" em contextos factuais, verificado pelo SSOT.

### 8) PR.com e IssueWire — úteis mas limitados, sem penalização

**Posição correta:** PR.com e IssueWire são plataformas legítimas de distribuição de press releases. Não penalizam SEO em nenhuma forma. O Google simplesmente dá peso mínimo aos links `nofollow` gerados por elas.

**O que fazem de útil:** indexação rápida de novas páginas, brand mentions (sinal E-E-A-T), tráfego de referral potencial.

**O que NÃO fazem:** não transferem link juice, não substituem cobertura editorial, e **não qualificam como fontes independentes para a Wikipedia** (press releases são fontes primárias do próprio interessado — Wikipedia exige fontes secundárias independentes).

**Regra para agentes:** não remover press releases existentes nem sugerir que causam penalização. Apenas não citá-los como "cobertura editorial" ou "backlinks de autoridade" ou como fontes para artigos enciclopédicos.

### 10) Renata Peçanha — autoridade apenas dentro do nicho Zouk

Renata Peçanha é pioneira do Zouk Brasileiro e fundadora do Rio Zouk Congress. Mas não tem presença em mídia mainstream, TV ou Wikipedia. Não citar como fonte de credibilidade mainstream para Wikipedia ou Knowledge Graph.

---

## 2026-03 — Arquitetura e fluxo

### 1) Arquitetura e fluxo
- O frontend é SPA React (Vite) e o backend é WordPress Headless via REST.
- A estratégia de dados privilegia React Query centralizado em `src/hooks/useQueries.ts`.
- A experiência depende de equilíbrio entre SEO técnico (`HeadlessSEO`) e performance percebida (lazy loading/prefetch).

### 2) Regras mandatórias que evitam regressão

- Não hardcodar strings visíveis; sempre manter paridade PT/EN.
- Não mover Navbar para `components/common/` (fonte correta: `components/Layout/Navbar.tsx`).
- Não atualizar ESLint para v11+ (manter v10).
- Evitar lógica de negócio complexa no frontend quando deve estar no backend/plugin.

### 3) Padrões de qualidade para próximas tasks

- Incluir checklist de conformidade no PR (i18n, SEO, lazy loading, queries centralizadas).
- Sempre avaliar e registrar sugestões de outros bots em bloco explícito no PR.
- Priorizar ganhos reais de payload/cache antes de micro-otimizações cosméticas.

### 4) Ganhos esperados ao reutilizar este aprendizado

| Alavanca | Efeito prático | Ganho estimado |
|---|---|---:|
| Reuso de checklist por task type | Menos retrabalho em revisão | 30–50% |
| `_fields` + payload enxuto nas APIs | Menos bytes por request | 25–45% |
| `staleTime` adequado para dados estáveis | Menos refetch desnecessário | 30–70% |
| Template de PR com avaliação de bots | Melhor rastreabilidade de decisão | 20–40% |

### 5) Como isso ajuda nas próximas tarefas

- Acelera diagnóstico inicial (menos tempo para descobrir "como o projeto pensa").
- Reduz conflito entre instruções globais e locais.
- Melhora previsibilidade de entrega em tarefas de frontend, docs e integrações WP.
