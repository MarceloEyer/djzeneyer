# Skills & Context Review — DJ Zen Eyer (2026-03)

## Objetivo
Consolidar melhorias para os arquivos de contexto/instrução (`AGENTS.md`, `GEMINI.md` e `src/**/CONTEXT.md`) e aumentar previsibilidade de entrega para agentes de IA com foco em qualidade enterprise.

---

## Diagnóstico rápido

### Pontos fortes ✅
- Contexto de produto e stack está bem definido.
- Regras críticas do projeto aparecem repetidas (i18n, SEO, React Query, lazy loading), o que reduz ambiguidade.
- Há separação por domínio (`hooks`, `pages`, `components`, `config`, `locales`), útil para execução por escopo.

### Gaps observados ⚠️
- Há sobreposição de regras entre `AGENTS.md` e `GEMINI.md`, sem um identificador de prioridade por tópico.
- Não existe um checklist operacional mínimo por tipo de tarefa (ex: docs-only, refactor frontend, alteração PHP).
- Não existe uma matriz "Regra -> Arquivo fonte" para troubleshooting rápido quando bots divergem.
- Ausência de critérios mensuráveis de "done" por mudança (ex: budget de bundle, número máximo de requests, cobertura de traduções).

---

## Propostas de melhoria (priorizadas)

| Prioridade | Melhoria | Impacto esperado | Esforço |
|---|---|---:|---:|
| P0 | Criar `docs/AI_GOVERNANCE.md` com política única (fonte canônica) e apontar `AGENTS.md`/`GEMINI.md` para ele | 🔒 Redução de conflito de instruções em ~60–80% | Baixo |
| P0 | Adicionar checklist padrão por task type (frontend, backend, docs, tradução) | 🧭 Menos retrabalho/revisões em ~30–50% | Baixo |
| P1 | Definir budgets de performance (bundle inicial, TTFB API, tamanho de payload) | ⚡ Ganho de disciplina de performance; redução estimada de 10–25% no tempo de carregamento percebido | Médio |
| P1 | Padronizar template de PR com seção fixa “avaliação de sugestões de outros bots” | 🤝 Melhora qualidade de revisão cruzada e rastreabilidade | Baixo |
| P2 | Criar scorecard de conformidade para IA (i18n, SEO, lazy, queries centralizadas) | 📊 Aumento de previsibilidade da qualidade em ~20–40% | Médio |

---

## Estimativas de melhoria de performance

> Estimativas baseadas em práticas típicas para SPA + WP Headless em tráfego baixo/médio, sem alterar arquitetura principal.

| Ação | Métrica alvo | Faixa de ganho estimada |
|---|---|---:|
| Uso estrito de `_fields` + paginação API | Tamanho médio de payload REST | 25–45% menor |
| `staleTime`/cache mais agressivo para dados estáveis | Requests repetidas por sessão | 30–70% menor |
| Prefetch em hover para rotas de alta intenção | TTI percebido na navegação interna | 15–35% melhor |
| Definição de budget de bundle por rota lazy | JS carregado na primeira visita | 10–30% menor |
| Auditoria periódica de chaves i18n não utilizadas | Tamanho de dicionários e parse i18n | 5–15% menor |

---

## Modelo recomendado de governança de instruções

### 1) Hierarquia explícita
1. `AGENTS.md` (regras globais e mandatórias)
2. `docs/AI_GOVERNANCE.md` (procedimentos operacionais e critérios de qualidade)
3. `src/**/CONTEXT.md` (regras locais por domínio)
4. `GEMINI.md` e outros guias de assistentes (adaptação de persona/ferramenta)

### 2) Contrato mínimo por entrega
- ✅ Build/lint executados quando houver alteração de código.
- ✅ i18n parity PT/EN para texto novo visível.
- ✅ Evidência de SEO (`HeadlessSEO`) quando alteração envolver página.
- ✅ Descrição objetiva de risco e rollback no PR.
- ✅ Comentário obrigatório de “avaliação de sugestões de outros bots” no PR.

### 3) Rubrica de qualidade para bots
- **Conformidade técnica (40%)**: arquitetura e padrões do projeto.
- **Confiabilidade (25%)**: validações, ausência de regressão.
- **Performance (20%)**: payload/query/bundle/caching.
- **Manutenibilidade (15%)**: legibilidade, documentação, rastreabilidade.

---

## Plano de adoção em 2 semanas

| Semana | Entrega | Dono sugerido |
|---|---|---|
| 1 | Criar `docs/AI_GOVERNANCE.md` + template de PR unificado | Tech Lead |
| 1 | Publicar checklist de task types | Frontend Lead |
| 2 | Definir budgets iniciais de performance por rota/API | Frontend + WP Lead |
| 2 | Rodar primeira auditoria de conformidade IA e ajustar lacunas | Equipe completa |

---

## Comentário sugerido para PRs (padrão)

```md
### 🤖 Avaliação de sugestões de outros bots
- Sugestões aproveitadas: [listar]
- Sugestões rejeitadas: [listar + justificativa técnica]
- Risco residual: [baixo/médio/alto]
- Próximos passos: [curto e objetivo]
```

---

## Conclusão
A base atual já é forte, mas está pronta para um salto de maturidade com governança unificada, checklists operacionais e metas mensuráveis de performance. Isso deve reduzir conflitos entre agentes e elevar consistência de entrega sem aumentar complexidade arquitetural.
