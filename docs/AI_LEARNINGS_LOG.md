# AI Learnings Log — DJ Zen Eyer

> Memória operacional persistida no repositório para acelerar tarefas futuras de agentes de IA.

## 2026-03 — Aprendizados consolidados

### 1) Arquitetura e fluxo
- O frontend é SPA React (Vite) e o backend é WordPress Headless via REST.
- A estratégia de dados privilegia **React Query centralizado** em `src/hooks/useQueries.ts`.
- A experiência depende de equilíbrio entre SEO técnico (`HeadlessSEO`) e performance percebida (lazy loading/prefetch).

### 2) Regras mandatórias que evitam regressão
- Não hardcodar strings visíveis; sempre manter paridade PT/EN.
- Não mover Navbar para `common/` (fonte correta: `components/Layout/Navbar.tsx`).
- Não atualizar ESLint para v10.
- Evitar lógica de negócio complexa no frontend quando deve estar no backend/plugin.

### 3) Padrões de qualidade para próximas tasks
- Incluir checklist de conformidade no PR (i18n, SEO, lazy, queries centralizadas).
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
