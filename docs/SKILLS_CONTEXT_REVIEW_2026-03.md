<<<<<<< ours
# Skills & Context Review — DJ Zen Eyer (2026-03)

## Objetivo

Consolidar melhorias para arquivos de contexto/instrução (`AGENTS.md`, `GEMINI.md` e `src/**/CONTEXT.md`) e aumentar previsibilidade de entrega para agentes de IA com foco em qualidade.

---

## Diagnóstico rápido

### Pontos fortes

- Contexto de produto e stack está bem definido.
- Regras críticas do projeto aparecem repetidas (i18n, SEO, React Query, lazy loading), reduzindo ambiguidade.
- Há separação por domínio (`hooks`, `pages`, `components`, `config`, `locales`), útil para execução por escopo.

### Gaps observados

- Sobreposição de regras entre `AGENTS.md` e `GEMINI.md`, sem prioridade explícita por tópico.
- Ausência de checklist operacional mínimo por tipo de tarefa (docs-only, refactor frontend, alteração PHP).
- Ausência de matriz "Regra -> Arquivo fonte" para troubleshooting quando bots divergem.
- Falta de critérios mensuráveis de "done" por mudança (payload, requests, cobertura de traduções).
=======
# Skills & Context Review â€” DJ Zen Eyer (2026-03)

## Objetivo
Consolidar melhorias para os arquivos de contexto/instruÃ§Ã£o (`AGENTS.md`, `GEMINI.md` e `src/**/CONTEXT.md`) e aumentar previsibilidade de entrega para agentes de IA com foco em qualidade enterprise.

---

## DiagnÃ³stico rÃ¡pido

### Pontos fortes âœ…
- Contexto de produto e stack estÃ¡ bem definido.
- Regras crÃ­ticas do projeto aparecem repetidas (i18n, SEO, React Query, lazy loading), o que reduz ambiguidade.
- HÃ¡ separaÃ§Ã£o por domÃ­nio (`hooks`, `pages`, `components`, `config`, `locales`), Ãºtil para execuÃ§Ã£o por escopo.

### Gaps observados âš ï¸
- HÃ¡ sobreposiÃ§Ã£o de regras entre `AGENTS.md` e `GEMINI.md`, sem um identificador de prioridade por tÃ³pico.
- NÃ£o existe um checklist operacional mÃ­nimo por tipo de tarefa (ex: docs-only, refactor frontend, alteraÃ§Ã£o PHP).
- NÃ£o existe uma matriz "Regra -> Arquivo fonte" para troubleshooting rÃ¡pido quando bots divergem.
- AusÃªncia de critÃ©rios mensurÃ¡veis de "done" por mudanÃ§a (ex: budget de bundle, nÃºmero mÃ¡ximo de requests, cobertura de traduÃ§Ãµes).
>>>>>>> theirs

---

## Propostas de melhoria (priorizadas)

<<<<<<< ours
| Prioridade | Melhoria | Impacto esperado | Esforço |
|---|---|---:|---:|
| P0 | Criar `docs/AI_GOVERNANCE.md` como fonte canônica e apontar `AGENTS.md`/`GEMINI.md` para ele | Redução de conflito de instruções em ~60–80% | Baixo |
| P0 | Adicionar checklist padrão por task type (frontend, backend, docs, tradução) | Menos retrabalho/revisões em ~30–50% | Baixo |
| P1 | Definir orçamentos de performance (bundle inicial, TTFB API, tamanho de payload) | Disciplina de performance e redução de 10–25% no tempo de carregamento percebido | Médio |
| P1 | Padronizar template de PR com seção fixa de avaliação de sugestões de outros bots | Melhor rastreabilidade e revisão cruzada | Baixo |
| P2 | Criar scorecard de conformidade para IA (i18n, SEO, lazy loading, queries centralizadas) | Aumento de previsibilidade da qualidade em ~20–40% | Médio |

---

## Estimativas de melhoria de performance (auditáveis)

> Premissa: ambiente de medição local de referência + staging de produção.

| Ação | Métrica | Baseline atual | Meta | Como medir |
|---|---|---:|---:|---|
| Uso estrito de `_fields` + paginação API | Tamanho médio de payload REST | Medir endpoints `wp/v2/posts` e `wp/v2/remixes` | 25–45% menor | DevTools Network (HAR) + comparação por endpoint |
| `staleTime`/cache mais agressivo | Requests repetidas por sessão | Medir navegação Home -> News -> Home -> News | 30–70% menor | DevTools Network com cache limpo e script de navegação fixo |
| Prefetch em hover para rotas de alta intenção | Tempo até conteúdo visível na navegação interna | Medir rotas `/music`, `/events`, `/news` | 15–35% melhor | Lighthouse Navigation + trace de transição entre rotas |
| Orçamento de bundle por rota lazy | JS carregado na primeira visita por rota | Levantar bytes iniciais por rota | 10–30% menor | `vite build` + analyzer por chunk/rota |
| Auditoria de chaves i18n não usadas | Tamanho de dicionários i18n | Medir `src/locales/en/translation.json` e `pt/translation.json` | 5–15% menor | Script de inventário de chaves + diff de arquivos |

Checklist de medição reproduzível:

1. Limpar cache do navegador e rodar em rede estável.
2. Executar 3 medições por cenário e usar mediana.
3. Registrar commit, data e ambiente em planilha do time.
4. Anexar evidência (HAR, Lighthouse JSON ou print) no PR.

---

## Modelo recomendado de governança de instruções

### 1) Hierarquia explícita

1. `docs/AI_GOVERNANCE.md` (fonte canônica de regras, procedimentos e critérios).
2. `src/**/CONTEXT.md` (regras locais por domínio, com escopo explícito).
3. `AGENTS.md` e `GEMINI.md` (ponte de persona/ferramenta referenciando a fonte canônica).

### 2) Contrato mínimo por entrega

- Build/lint executados quando houver alteração de código.
- Paridade i18n PT/EN para texto novo visível.
- Evidência de SEO (`HeadlessSEO`) quando a alteração envolver página.
- Descrição objetiva de risco e rollback no PR.
- Comentário obrigatório de avaliação de sugestões de outros bots no PR.

### 3) Rubrica de qualidade para bots

- Conformidade técnica (40%): arquitetura e padrões do projeto.
- Confiabilidade (25%): validações e ausência de regressão.
- Performance (20%): payload/query/bundle/cache.
- Manutenibilidade (15%): legibilidade, documentação, rastreabilidade.

---

## Plano de adoção em 2 semanas

| Semana | Entrega | Dono sugerido | Critério de aceite |
|---|---|---|---|
| 1 | Criar `docs/AI_GOVERNANCE.md` + template de PR unificado | Tech Lead | Documento publicado e referenciado por `AGENTS.md` e `GEMINI.md` |
| 1 | Publicar checklist de task types | Frontend Lead | Checklist incorporado ao fluxo de PR |
| 2 | Definir metas iniciais de desempenho por rota/API | Frontend + WP Lead | Baseline e meta por rota/endpoint documentados |
| 2 | Rodar primeira auditoria de conformidade IA e ajustar lacunas | Equipe completa | Relatório com não conformidades e plano de ação |

---

## Comentário sugerido para PRs (padrão)

```md
### Avaliação de sugestões de outros bots
- Sugestões aproveitadas: [listar]
- Sugestões rejeitadas: [listar + justificativa técnica]
- Risco residual: [baixo/médio/alto]
- Próximos passos: [curto e objetivo]
=======
| Prioridade | Melhoria | Impacto esperado | EsforÃ§o |
|---|---|---:|---:|
| P0 | Criar `docs/AI_GOVERNANCE.md` com polÃ­tica Ãºnica (fonte canÃ´nica) e apontar `AGENTS.md`/`GEMINI.md` para ele | ðŸ”’ ReduÃ§Ã£o de conflito de instruÃ§Ãµes em ~60â€“80% | Baixo |
| P0 | Adicionar checklist padrÃ£o por task type (frontend, backend, docs, traduÃ§Ã£o) | ðŸ§­ Menos retrabalho/revisÃµes em ~30â€“50% | Baixo |
| P1 | Definir budgets de performance (bundle inicial, TTFB API, tamanho de payload) | âš¡ Ganho de disciplina de performance; reduÃ§Ã£o estimada de 10â€“25% no tempo de carregamento percebido | MÃ©dio |
| P1 | Padronizar template de PR com seÃ§Ã£o fixa â€œavaliaÃ§Ã£o de sugestÃµes de outros botsâ€ | ðŸ¤ Melhora qualidade de revisÃ£o cruzada e rastreabilidade | Baixo |
| P2 | Criar scorecard de conformidade para IA (i18n, SEO, lazy, queries centralizadas) | ðŸ“Š Aumento de previsibilidade da qualidade em ~20â€“40% | MÃ©dio |

---

## Estimativas de melhoria de performance

> Estimativas baseadas em prÃ¡ticas tÃ­picas para SPA + WP Headless em trÃ¡fego baixo/mÃ©dio, sem alterar arquitetura principal.

| AÃ§Ã£o | MÃ©trica alvo | Faixa de ganho estimada |
|---|---|---:|
| Uso estrito de `_fields` + paginaÃ§Ã£o API | Tamanho mÃ©dio de payload REST | 25â€“45% menor |
| `staleTime`/cache mais agressivo para dados estÃ¡veis | Requests repetidas por sessÃ£o | 30â€“70% menor |
| Prefetch em hover para rotas de alta intenÃ§Ã£o | TTI percebido na navegaÃ§Ã£o interna | 15â€“35% melhor |
| DefiniÃ§Ã£o de budget de bundle por rota lazy | JS carregado na primeira visita | 10â€“30% menor |
| Auditoria periÃ³dica de chaves i18n nÃ£o utilizadas | Tamanho de dicionÃ¡rios e parse i18n | 5â€“15% menor |

---

## Modelo recomendado de governanÃ§a de instruÃ§Ãµes

### 1) Hierarquia explÃ­cita
1. `AGENTS.md` (regras globais e mandatÃ³rias)
2. `docs/AI_GOVERNANCE.md` (procedimentos operacionais e critÃ©rios de qualidade)
3. `src/**/CONTEXT.md` (regras locais por domÃ­nio)
4. `GEMINI.md` e outros guias de assistentes (adaptaÃ§Ã£o de persona/ferramenta)

### 2) Contrato mÃ­nimo por entrega
- âœ… Build/lint executados quando houver alteraÃ§Ã£o de cÃ³digo.
- âœ… i18n parity PT/EN para texto novo visÃ­vel.
- âœ… EvidÃªncia de SEO (`HeadlessSEO`) quando alteraÃ§Ã£o envolver pÃ¡gina.
- âœ… DescriÃ§Ã£o objetiva de risco e rollback no PR.
- âœ… ComentÃ¡rio obrigatÃ³rio de â€œavaliaÃ§Ã£o de sugestÃµes de outros botsâ€ no PR.

### 3) Rubrica de qualidade para bots
- **Conformidade tÃ©cnica (40%)**: arquitetura e padrÃµes do projeto.
- **Confiabilidade (25%)**: validaÃ§Ãµes, ausÃªncia de regressÃ£o.
- **Performance (20%)**: payload/query/bundle/caching.
- **Manutenibilidade (15%)**: legibilidade, documentaÃ§Ã£o, rastreabilidade.

---

## Plano de adoÃ§Ã£o em 2 semanas

| Semana | Entrega | Dono sugerido |
|---|---|---|
| 1 | Criar `docs/AI_GOVERNANCE.md` + template de PR unificado | Tech Lead |
| 1 | Publicar checklist de task types | Frontend Lead |
| 2 | Definir budgets iniciais de performance por rota/API | Frontend + WP Lead |
| 2 | Rodar primeira auditoria de conformidade IA e ajustar lacunas | Equipe completa |

---

## ComentÃ¡rio sugerido para PRs (padrÃ£o)

```md
### ðŸ¤– AvaliaÃ§Ã£o de sugestÃµes de outros bots
- SugestÃµes aproveitadas: [listar]
- SugestÃµes rejeitadas: [listar + justificativa tÃ©cnica]
- Risco residual: [baixo/mÃ©dio/alto]
- PrÃ³ximos passos: [curto e objetivo]
>>>>>>> theirs
```

---

<<<<<<< ours
## Conclusão

A base atual é forte, mas está pronta para um salto de maturidade com governança unificada, checklists operacionais e metas mensuráveis de performance. Isso reduz conflito entre agentes e eleva a consistência de entrega.
=======

## MemÃ³ria operacional para prÃ³ximas tarefas ðŸ§ 

Para garantir continuidade entre tarefas, este review deve ser usado junto com `docs/AI_LEARNINGS_LOG.md` como base de contexto persistida em repositÃ³rio.

### O que jÃ¡ foi aprendido e deve ser reaproveitado
- Regras crÃ­ticas de i18n, SEO e centralizaÃ§Ã£o de queries sÃ£o os maiores fatores de consistÃªncia.
- A maior fonte de divergÃªncia entre bots estÃ¡ na sobreposiÃ§Ã£o de documentos de instruÃ§Ã£o sem prioridade explÃ­cita.
- PRs ficam mais auditÃ¡veis quando incluem avaliaÃ§Ã£o explÃ­cita de sugestÃµes de outros bots.

### Impacto estimado na prÃ³xima sprint
| Indicador | Antes | Depois (estimado) |
|---|---:|---:|
| Retrabalho por conflito de instruÃ§Ãµes | Alto | MÃ©dio/Baixo (-40% a -60%) |
| Tempo de alinhamento no inÃ­cio da task | 100% baseline | 70% a 80% (-20% a -30%) |
| Clareza de decisÃ£o tÃ©cnica no PR | MÃ©dia | Alta (+30% a +50%) |

---
## ConclusÃ£o
A base atual jÃ¡ Ã© forte, mas estÃ¡ pronta para um salto de maturidade com governanÃ§a unificada, checklists operacionais e metas mensurÃ¡veis de performance. Isso deve reduzir conflitos entre agentes e elevar consistÃªncia de entrega sem aumentar complexidade arquitetural.


## RevalidaÃ§Ã£o do que jÃ¡ foi implementado (estado atual) ðŸ”Ž

### EvidÃªncias verificadas no cÃ³digo
- `useQueries.ts` segue como fonte central de queries e mantÃ©m uso de `_fields` em mÃºltiplos endpoints.
- `HeadlessSEO` segue ativo e amplamente usado nas pÃ¡ginas.
- `usePrefetchOnHover` estÃ¡ integrado na Navbar para navegaÃ§Ã£o percebida mais rÃ¡pida.
- Rotas seguem arquitetura com lazy loading em `AppRoutes.tsx`.

### AvaliaÃ§Ã£o de aderÃªncia (hoje)

| Item proposto no PR anterior | SituaÃ§Ã£o atual | Veredito |
|---|---|---|
| MemÃ³ria operacional (`AI_LEARNINGS_LOG`) | Implementado e Ãºtil para onboarding de agentes | âœ… Manter |
| Review estruturado de contexto/skills | Implementado; ainda relevante | âœ… Manter |
| Criar `AI_GOVERNANCE.md` (P0) | Ainda nÃ£o implementado | âš ï¸ Priorizar |
| Checklist por tipo de tarefa | Parcial (conceitual, nÃ£o operacional) | âš ï¸ Evoluir |
| Budgets de performance | Ainda sem nÃºmeros canÃ´nicos no repositÃ³rio | âš ï¸ Definir baseline |

### Estimativa de impacto se executar os itens pendentes

| Item pendente | Ganho tÃ©cnico estimado | Ganho operacional estimado |
|---|---:|---:|
| `AI_GOVERNANCE.md` canÃ´nico | - | 40â€“60% menos conflito de instruÃ§Ã£o |
| Checklist operacional por task type | - | 30â€“50% menos retrabalho em revisÃ£o |
| Budgets de payload/bundle/TTFB | 10â€“25% melhor tempo percebido | 20â€“35% mais previsibilidade de entrega |

### RecomendaÃ§Ã£o final
As alteraÃ§Ãµes anteriores **continuam boas e vÃ¡lidas** para o projeto no estado atual. O ponto de melhoria nÃ£o Ã© remover o que foi feito, e sim **operacionalizar**: transformar diretrizes em artefatos executÃ¡veis de governanÃ§a (arquivo canÃ´nico + checklist + budget baseline).
>>>>>>> theirs
