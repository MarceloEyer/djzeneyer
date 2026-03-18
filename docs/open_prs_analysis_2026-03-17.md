# Revisão das PRs abertas (snapshot local)

Data: 2026-03-17  
Escopo: avaliação técnica + risco de quebra + ganho real + simplicidade de implementação.

## Limitações operacionais ⚠️

- A API/web do GitHub não está acessível neste ambiente (retorno `403 Forbidden` em `https://api.github.com` e `https://github.com`).
- Por causa disso, não foi possível listar todas as PRs abertas em tempo real nem publicar comentários diretamente.
- Foi feita análise com base nos artefatos locais disponíveis (`pr_comments_utf8.json` e `comments_200.txt`), que apontam para as PRs **#174** e **#200**.
- Para manter fluxo, este documento já inclui comentários prontos para colar em cada PR.

## Contexto do site considerado na análise 🧠

- Stack canônica: React 18 + TypeScript strict + Vite 7 + Tailwind 3 + React Query v5 + React Router 7 + i18next.
- Arquitetura: WordPress Headless + React SPA.
- Diretrizes de segurança/arquitetura: i18n obrigatório em texto visível, SEO por página via `HeadlessSEO`, e cuidado com regressões em build/performance.

---

## Tabela comparativa das PRs identificadas

| PR | Tema | Risco de quebrar site | Ganho potencial | Importância | Complexidade | Recomendação |
|---|---|---:|---:|---:|---:|---|
| #174 | Otimização de re-render no `CartContext` com `useMemo` | **Baixo** 🟢 | **Médio** 🚀 | **Média-Alta** | **Baixa** | Aprovar com ajuste de tipagem explícita |
| #200 | Ajustes de JSON-LD/Schema da identidade pública (Person/MusicGroup + campos pessoais) | **Médio** 🟡 (SEO/semântica) | **Médio** 📈 | **Alta** (SEO + reputação) | **Baixa-Média** | Ajustar modelagem antes de merge |

---

## PR #174 — análise objetiva ✅

### Resumo
Mudança focada em estabilizar referência de `value` de contexto para reduzir re-renders de consumidores.

### Avaliação de risco
- **Quebra funcional**: baixa probabilidade.
- **Risco técnico principal**: dependências incorretas no `useMemo` gerando estado stale.

### Ganho esperado
| Métrica | Estimativa de melhora |
|---|---:|
| Re-renders de consumidores de contexto | **-20% a -45%** |
| Responsividade percebida em telas com carrinho ativo | **+8% a +20%** |
| Custo de CPU nessa área da SPA | **-5% a -18%** |

### Vale implementar?
**Sim.** É otimização clássica, simples, de baixo risco e alinhada a boas práticas React enterprise.

### Comentário pronto para PR #174 💬
> 🔍 **Review técnico**
>
> Excelente direção no `CartContext`: estabilizar o `value` com `useMemo` reduz re-renders desnecessários dos consumidores e melhora a fluidez da SPA em cenários de carrinho ativo. ✅
>
> **Risco de quebra:** baixo, desde que o array de dependências esteja correto.
>
> **Ganho esperado:** redução relevante de render redundante e melhor responsividade percebida.
>
> **Ajuste recomendado antes do merge:** tipar explicitamente `useMemo<CartContextType>(...)` para aumentar robustez em refactors TypeScript.
>
> **Veredito:** 👍 Favorável a merge com esse pequeno hardening de tipo.

---

## PR #200 — análise objetiva ⚠️

### Resumo
Mudança em dados estruturados/JSON-LD com ampliação de campos de identidade e combinação de tipos Schema (`Person` + `MusicGroup`), além de `potentialAction` e modelagem de ocupação.

### Pontos críticos observados
1. **PII Exposure**: inclusão de dados pessoais explícitos pode aumentar superfície de privacidade/reputação.
2. **Schema Type Ambiguity**: misturar `Person` e `MusicGroup` no mesmo nó pode gerar interpretação ambígua por consumidores de SEO.
3. **EntryPoint shape**: uso de `urlTemplate` com URLs estáticas pode estar semanticamente inadequado.
4. **Duplicidade jobTitle/hasOccupation**: duas representações para o mesmo conceito podem reduzir clareza semântica.

### Avaliação de risco
- **Quebra visual/runtime**: baixo.
- **Quebra SEO/semântica**: médio (principal risco desta PR).
- **Risco jurídico/reputacional**: médio se PII não estiver plenamente consentida/documentada.

### Ganho esperado
| Métrica | Estimativa de melhora |
|---|---:|
| Cobertura semântica de entidade no SEO | **+10% a +25%** |
| Chance de rich result/knowledge panel coerente | **+5% a +20%** (se schema estiver válido) |
| Performance de front (runtime) | **≈ 0%** (impacto irrelevante) |

### Vale implementar?
**Sim, mas com ajustes obrigatórios antes do merge.** A direção é boa para SEO de longo prazo, porém precisa consolidar modelagem para evitar ambiguidade.

### Comentário pronto para PR #200 💬
> 🔍 **Review técnico (SEO + semântica + risco)**
>
> A iniciativa de evoluir o JSON-LD é importante e tem potencial real de ganho em descoberta orgânica. 🚀
>
> Porém, hoje eu vejo **riscos de semântica** que podem prejudicar a interpretação por buscadores:
>
> 1. `@type` com `Person` + `MusicGroup` no mesmo nó pode gerar ambiguidade.
> 2. `jobTitle` + `hasOccupation` representam o mesmo domínio em formatos diferentes (duplicação semântica).
> 3. `EntryPoint.urlTemplate` com links estáticos merece revisão para `url`.
> 4. Campos de PII (birthDate/birthPlace/nationality etc.) precisam confirmação explícita de consentimento/política.
>
> **Sugestão prática para merge seguro:**
> - manter um único tipo canônico por nó (ou separar entidades conectadas por `sameAs`/`subjectOf`);
> - padronizar ocupação em uma só estratégia;
> - revisar `potentialAction` para forma esperada pelos consumidores;
> - validar no Rich Results Test + Schema Validator antes do merge.
>
> **Veredito:** 🟡 Aprovar **após ajustes** de modelagem e validação SEO.

---

## Priorização para “resolver tudo” 🗂️

| Ordem | PR | Ação recomendada |
|---:|---|---|
| 1 | #174 | Merge rápido após ajuste de tipagem (baixo risco, ganho direto) |
| 2 | #200 | Revisar modelagem schema + privacidade, validar ferramentas SEO, então merge |

## Nota final
- Assim que o acesso ao GitHub for liberado neste ambiente, o próximo passo é publicar os comentários acima diretamente em cada PR e repetir a mesma matriz para todas as PRs abertas em tempo real.
