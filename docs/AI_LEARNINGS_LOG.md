<<<<<<< ours
# AI Learnings Log — DJ Zen Eyer

> Memória operacional persistida no repositório para acelerar tarefas futuras de agentes de IA.

## 2026-03 — Aprendizados consolidados

### 1) Arquitetura e fluxo

- O frontend é SPA React (Vite) e o backend é WordPress Headless via REST.
- A estratégia de dados privilegia React Query centralizado em `src/hooks/useQueries.ts`.
- A experiência depende de equilíbrio entre SEO técnico (`HeadlessSEO`) e performance percebida (lazy loading/prefetch).

### 2) Regras mandatórias que evitam regressão

- Não hardcodar strings visíveis; sempre manter paridade PT/EN.
- Não mover Navbar para `components/common/` (fonte correta: `components/Layout/Navbar.tsx`).
- Não atualizar ESLint para v10.
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
=======
# AI Learnings Log â€” DJ Zen Eyer

> MemÃ³ria operacional persistida no repositÃ³rio para acelerar tarefas futuras de agentes de IA.

## 2026-03 â€” Aprendizados consolidados

### 1) Arquitetura e fluxo
- O frontend Ã© SPA React (Vite) e o backend Ã© WordPress Headless via REST.
- A estratÃ©gia de dados privilegia **React Query centralizado** em `src/hooks/useQueries.ts`.
- A experiÃªncia depende de equilÃ­brio entre SEO tÃ©cnico (`HeadlessSEO`) e performance percebida (lazy loading/prefetch).

### 2) Regras mandatÃ³rias que evitam regressÃ£o
- NÃ£o hardcodar strings visÃ­veis; sempre manter paridade PT/EN.
- NÃ£o mover Navbar para `common/` (fonte correta: `components/Layout/Navbar.tsx`).
- NÃ£o atualizar ESLint para v10.
- Evitar lÃ³gica de negÃ³cio complexa no frontend quando deve estar no backend/plugin.

### 3) PadrÃµes de qualidade para prÃ³ximas tasks
- Incluir checklist de conformidade no PR (i18n, SEO, lazy, queries centralizadas).
- Sempre avaliar e registrar sugestÃµes de outros bots em bloco explÃ­cito no PR.
- Priorizar ganhos reais de payload/cache antes de micro-otimizaÃ§Ãµes cosmÃ©ticas.

### 4) Ganhos esperados ao reutilizar este aprendizado

| Alavanca | Efeito prÃ¡tico | Ganho estimado |
|---|---|---:|
| Reuso de checklist por task type | Menos retrabalho em revisÃ£o | 30â€“50% |
| `_fields` + payload enxuto nas APIs | Menos bytes por request | 25â€“45% |
| `staleTime` adequado para dados estÃ¡veis | Menos refetch desnecessÃ¡rio | 30â€“70% |
| Template de PR com avaliaÃ§Ã£o de bots | Melhor rastreabilidade de decisÃ£o | 20â€“40% |

### 5) Como isso ajuda nas prÃ³ximas tarefas
- Acelera diagnÃ³stico inicial (menos tempo para descobrir "como o projeto pensa").
- Reduz conflito entre instruÃ§Ãµes globais e locais.
- Melhora previsibilidade de entrega em tarefas de frontend, docs e integraÃ§Ãµes WP.


## Status de validade do aprendizado (2026-03) âœ…

| Bloco de aprendizado | Validade hoje | AÃ§Ã£o recomendada |
|---|---|---|
| Regras mandatÃ³rias (i18n/SEO/lazy/query SSOT) | Alta | Manter como gate de revisÃ£o |
| Ganhos estimados de performance | MÃ©dia/Alta | Confirmar com baseline trimestral |
| Processo de avaliaÃ§Ã£o de outros bots | Alta | Tornar obrigatÃ³rio no template de PR |

### PrÃ³xima atualizaÃ§Ã£o sugerida
- Revisar este log a cada 30 dias ou apÃ³s mudanÃ§as arquiteturais relevantes.
>>>>>>> theirs
