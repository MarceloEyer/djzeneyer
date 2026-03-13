# AI Governance — Safe Adoption Plan (2026-03)

> Plano de adoção **não destrutivo** para reduzir risco de alterar conteúdos críticos já consolidados.

## Objetivo 🎯
Implementar governança de IA com o menor risco possível:
- sem reescrever documentos sensíveis;
- sem remover conteúdo existente;
- com estratégia de mudanças incrementais e reversíveis.

---

## Princípios de segurança documental 🛡️
1. **Append-only por padrão:** só adicionar seções novas; evitar edição em massa.
2. **Arquivos críticos estáveis:** `AGENTS.md`, `GEMINI.md`, `.github/pull_request_template.md` só mudam em janela dedicada.
3. **Fonte canônica isolada:** regras novas entram primeiro em `docs/AI_GOVERNANCE.md`.
4. **Rollback simples:** cada ajuste em commit pequeno e temático.

---

## Estratégia recomendada (baixo risco)

| Etapa | Ação | Risco | Benefício |
|---|---|---:|---:|
| 1 | Centralizar novas regras em docs dedicados | Baixo | Alto |
| 2 | Evitar alterar templates globais em paralelo | Baixo | Médio/Alto |
| 3 | Usar snippets reutilizáveis para PR | Baixo | Médio |
| 4 | Revisão mensal dos docs de governança | Baixo | Médio |

---

## O que **não** alterar agora ❌
- Estrutura principal de `AGENTS.md`.
- Blocos históricos de `GEMINI.md`.
- Template de PR global em períodos de alta atividade.

## O que pode ser alterado com segurança ✅
- Novos documentos em `docs/` (guias complementares).
- Seções aditivas em docs de governança.
- Snippets auxiliares de processo para copiar/colar.

---

## Estimativas de impacto (adoção segura)

| Métrica | Estimativa |
|---|---:|
| Redução de conflitos de merge em docs globais | 35–60% |
| Redução de retrabalho por edição concorrente | 20–45% |
| Aumento de previsibilidade de PR documental | 25–50% |

> Essas estimativas assumem manutenção da estratégia append-only e commits pequenos.

---

## Checklist de execução segura
- [ ] Mudança é aditiva (sem apagar conteúdo sensível)
- [ ] Commit pequeno e temático
- [ ] Sem alteração simultânea em múltiplos arquivos globais críticos
- [ ] PR com seção de avaliação de sugestões de bots
- [ ] Validado com `npm run lint` antes de finalizar

---

## Conclusão
Se a prioridade é preservar o trabalho já consolidado, a melhor rota é: **governança por adição, não por substituição**. Isso permite evoluir com segurança e sem perder histórico decisório.
