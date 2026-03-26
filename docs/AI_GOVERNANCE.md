# AI Governance — DJ Zen Eyer

> Fonte canônica para execução de tarefas por agentes de IA neste repositório.
> Objetivo: reduzir ambiguidade entre instruções e aumentar previsibilidade de entrega.

## 1) Hierarquia oficial de instruções 🧭

Em caso de conflito, aplicar nesta ordem:
1. Instruções do usuário/sistema na tarefa atual.
2. `AI_CONTEXT_INDEX.md` — fonte canônica de stack, regras globais e endpoints.
3. `AGENTS.md` — regras operacionais para agentes.
4. Este documento (`docs/AI_GOVERNANCE.md`) — gates por tipo de tarefa.
5. Contextos locais (`plugins/*/CONTEXT.md`, `src/**/CONTEXT.md`).
6. Guias específicos de assistente (`GEMINI.md`, `CLAUDE.md`).

---

## 2) Gates obrigatórios por tipo de tarefa ✅

### A) Frontend (React/TS)
- [ ] Data fetching via `src/hooks/useQueries.ts` (sem `fetch` solto em componente).
- [ ] Textos visíveis internacionalizados (`pt` + `en`).
- [ ] Página com `HeadlessSEO` quando alteração envolver rota/página.
- [ ] Rotas novas seguindo lazy loading.
- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build` para mudanças de código em runtime.

### B) Backend (PHP/WordPress)
- [ ] Sanitização e escaping (`sanitize_text_field`, `esc_html`, etc.).
- [ ] SQL com prepared statements.
- [ ] Hooks preferenciais (`add_action`, `add_filter`).
- [ ] Validar namespace REST e autenticação quando aplicável.

### C) Docs/Processo
- [ ] Atualização objetiva, sem divergência com instruções canônicas.
- [ ] Se mudar processo de PR, refletir em `.github/pull_request_template.md`.
- [ ] Incluir tabela de impacto/benefício quando houver proposta de governança.

### D) Tradução/i18n
- [ ] Paridade de chaves `src/locales/pt/translation.json` ↔ `src/locales/en/translation.json`.
- [ ] Nomes de chave hierárquicos (evitar colisão).

---

## 3) Baseline de performance (inicial) ⚡

> Para este projeto (WP Headless + SPA), priorizar consistência e payload enxuto.

| Métrica | Baseline inicial (meta) | Observação |
|---|---:|---|
| Payload REST por listagem | <= 80 KB gzip | Usar `_fields`, paginação e filtros no backend |
| Requests repetidas por sessão (dados estáveis) | -30% a -70% | Ajustar `staleTime` por domínio |
| JS inicial por rota principal | <= 250 KB gzip | Forçar lazy loading + split por rota |
| TTFB API cacheável | <= 500 ms | Preferir cache/transients em endpoints estáveis |
| Chaves i18n órfãs | 0 novas por PR | Evitar inflação de dicionário |

---

## 4) Template mínimo de avaliação em PR 🤖

Todo PR deve incluir:

```md
### 🤖 Avaliação de sugestões de outros bots
- Sugestões aproveitadas: [...]
- Sugestões rejeitadas: [... + justificativa]
- Risco residual: [baixo/médio/alto]
- Próximos passos: [...]
```

---

## 5) Critério de pronto (Definition of Done)

Uma mudança é considerada pronta quando:
- Gates do tipo de tarefa foram atendidos.
- Não há conflito com `AGENTS.md`/contextos locais.
- PR contém avaliação de sugestões de outros bots.
- Evidência de validação técnica está listada (lint/build/tests pertinentes).

---

## 6) Cadência de revisão
- Revisar este documento a cada 30 dias ou após mudança arquitetural relevante.
- Em caso de divergência recorrente entre agentes, atualizar primeiro este arquivo e referenciar nos demais guias.
