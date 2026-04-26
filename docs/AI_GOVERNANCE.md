# AI Governance — DJ Zen Eyer

> Fonte canônica para execução de tarefas por agentes de IA neste repositório.
> Objetivo: reduzir ambiguidade entre instruções e aumentar previsibilidade de entrega.

---

## 🧭 1) Hierarquia oficial de instruções

Em caso de conflito, aplicar nesta ordem:
1. **Instruções do usuário** na tarefa atual.
2. `AI_CONTEXT_INDEX.md` — Fonte canônica de stack, regras globais e endpoints.
3. `AGENTS.md` — Regras operacionais para agentes (comportamento).
4. **Este documento** (`docs/AI_GOVERNANCE.md`) — Gates por tipo de tarefa.
5. Contextos locais (`plugins/*/CONTEXT.md`, `src/**/CONTEXT.md`).
6. Guias específicos de assistente (`GEMINI.md`, `CLAUDE.md`).

---

## ✅ 2) Gates obrigatórios por tipo de tarefa

### A) Frontend (React 19 / Vite 8)
- [ ] Data fetching via `src/hooks/useQueries.ts` (sem `fetch` solto em componente).
- [ ] i18n obrigatório (`t('key')`) — locales PT/EN em UTF-8 limpo.
- [ ] Não usar `minify: 'esbuild'` (Vite 8 usa OXC nativo).
- [ ] `<HeadlessSEO />` em rotas públicas; rotas privadas (`/dashboard`, `/my-account`) usam `noindex` + OG image genérica.
- [ ] Lazy loading para páginas (`React.lazy()` + `Suspense`).
- [ ] Executar `npm run lint` e `npm run build` (validação de build total).

### B) Backend (PHP 8.3 / WP 6.9+)
- [ ] Sanitização e escaping (`sanitize_text_field`, `esc_html`, etc.).
- [ ] SQL com prepared statements.
- [ ] WP Hooks (`add_action`, `add_filter`) — sem lógica solta em arquivos.
- [ ] WooCommerce HPOS: Usar `wc_get_orders()`. Jamais SQL direto em `wp_posts`.
- [ ] ZenGame: `array_values(gamipress_get_rank_types())` para indexação de rank type.

### C) Documentação
- [ ] Sem duplicidade com `AI_CONTEXT_INDEX.md`.
- [ ] Eliminar mojibake (`Ã§`, `Â©`). Salvar sempre em UTF-8 limpo.
- [ ] Atualização objetiva, sem divergência com instruções canônicas.
- [ ] Se mudar processo de PR, refletir em `.github/pull_request_template.md`.

### D) Tradução/i18n
- [ ] Paridade de chaves `src/locales/pt/translation.json` ↔ `src/locales/en/translation.json`.
- [ ] Nomes de chave hierárquicos (evitar colisão).

### E) CI/CD
- [ ] GitHub Actions: `fetch-depth: 2`.
- [ ] Plugins: Verificação de mudanças em `plugins/` via `git diff HEAD^..HEAD`.
- [ ] Rotas privadas (`dashboard`, `my-account`) excluídas do sitemap e do prerender.

---

## ⚡ 3) Baseline de performance (meta)

> Para este projeto (WP Headless + SPA), priorizar consistência e payload enxuto.

| Métrica | Meta | Observação |
|---|---:|---|
| Payload REST por listagem | <= 80 KB gzip | Usar `_fields`, paginação e filtros no backend |
| Requests repetidas por sessão (dados estáveis) | -30% a -70% | Ajustar `staleTime` por domínio |
| JS inicial por rota principal | <= 250 KB gzip | Forçar lazy loading + split por rota |
| TTFB API cacheável | <= 500 ms | Preferir cache/transients em endpoints estáveis |
| Chaves i18n órfãs | 0 novas por PR | Evitar inflação de dicionário |

---

## 🤖 4) Template mínimo de avaliação em PR

Todo PR deve incluir:

```md
### 🤖 Avaliação de sugestões de outros bots
- Sugestões aproveitadas: [...]
- Sugestões rejeitadas: [... + justificativa]
- Risco residual: [baixo/médio/alto]
- Próximos passos: [...]
```

---

## 🏁 5) Critério de pronto (Definition of Done)

Uma mudança é considerada pronta quando:
- Gates do tipo de tarefa foram atendidos.
- Build local foi verificado (`npm run build`).
- **Nenhuma regra do `AI_CONTEXT_INDEX.md` foi violada.**
- PR possui descrição clara do impacto.
- Arquivos de tradução e documentação estão em UTF-8 limpo.

---

## 6) Rotina mensal de sincronização (ativa — obrigatória)

Executar a cada 30 dias ou após mudança arquitetural, de endpoint ou de fluxo importante.

### Checklist mensal

- [ ] Rodar checklist de `AI_CONTEXT_INDEX.md § Checklist de atualização de contexto`
- [ ] Verificar versões de stack em `AI_CONTEXT_INDEX.md` e `CLAUDE.md` (npm, WP, WooCommerce, plugins)
- [ ] Atualizar métricas reais em `docs/marketing/PLANO_MARKETING.md § Métricas`
- [ ] Atualizar status de execução no Notion (📊 Marketing — Execução do Plano 2026)
- [ ] Verificar se `docs/PRODUCT_DECISIONS.md` reflete decisões tomadas no período
- [ ] Bump version da skill `djzeneyer-context` se houve mudança relevante de arquitetura
- [ ] Atualizar `public/llms.txt` com novos festivais e lançamentos do período
- [ ] Verificar se `.agents/skills/` tem skills desatualizadas ou novas skills a criar
- [ ] Revisar este documento — atualizar data abaixo

### Quando disparar fora do ciclo mensal

- Mudança de namespace de API → sincronizar `docs/API.md`, `docs/api-endpoints.md`, `CONTEXT.md` e skills relacionadas
- Mudança de stack major (React, Vite, WP, WooCommerce) → sincronizar todos os arquivos de contexto
- Nova decisão de produto irreversível → adicionar em `docs/PRODUCT_DECISIONS.md`
- Novo festival confirmado → atualizar `docs/marketing/PLANO_MARKETING.md` e Notion

---

*Revisado em 2026-04-27 por DJ Zen Eyer & Claude.*
