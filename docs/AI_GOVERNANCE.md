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
- [ ] Data fetching via `src/hooks/useQueries.ts` (sem `fetch` solto).
- [ ] i18n obrigatório (`t('key')`) — locales PT/EN em UTF-8.
- [ ] Não usar `minify: 'esbuild'` (Vite 8 usa OXC nativo).
- [ ] Página com `HeadlessSEO` e lazy loading.
- [ ] Executar `npm run lint` e `npm run build` (validação de build total).

### B) Backend (PHP 8.3 / WP 6.9+)
- [ ] Sanitização e prepared statements (SQL).
- [ ] WP Hooks (`add_action`, `add_filter`) — sem lógica solta em arquivos.
- [ ] WooCommerce HPOS: Usar `wc_get_orders()`. Jamais SQL em `wp_posts`.
- [ ] ZenGame: `array_values(gamipress_get_rank_types())` para indexação.

### C) Documentação
- [ ] Sem duplicidade com `AI_CONTEXT_INDEX.md`.
- [ ] Eliminar mojibake (`Ã§`, `Â©`). Salvar sempre em UTF-8 limpo.

### D) CI/CD
- [ ] GitHub Actions: `fetch-depth: 2`.
- [ ] Verificação de mudanças em `plugins/` via `git diff`.

---

## ⚡ 3) Definition of Done (DoD)

Uma mudança é considerada pronta quando:
- Todos os gates técnicos foram atendidos.
- Build local foi verificado (`npm run build`).
- **Nenhuma regra do `AI_CONTEXT_INDEX.md` foi violada.**
- PR possui descrição clara do impacto.
- Arquivos de tradução e documentação estão sem erros de encoding.

---
*Revisado em 2026-03-26 por DJ Zen Eyer & Antigravity.*
