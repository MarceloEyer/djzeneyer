# 🧾 Auditoria de PRs recentes — 2026-05-23 a 2026-06-02

> **Status do relatório:** inventário operacional para desenvolvedores humanos e agentes.
> **Data de consolidação:** 2026-06-17.
> **Janela analisada:** PRs atualizados/fechados/mergeados a partir de 2026-05-23, com foco na leva de PRs #548–#658.
> **Fonte primária:** listagem pública de PRs do GitHub e histórico local de commits disponível no repositório.

## 🎯 Objetivo

Registrar, em um único artefato rastreável, o que foi analisado sobre os PRs recentes, incluindo:

- ✅ O que parece resolvido.
- 🟡 O que foi fechado sem merge e provavelmente substituído por outro PR.
- 🔴 O que ainda precisa de atenção.
- 💬 Avaliação das sugestões deixadas por outros revisores/agentes.
- ⚡ Estimativas qualitativas de impacto de performance.

Este arquivo **não implementa as correções**. A intenção é deixar o diagnóstico claro para que os outros desenvolvedores possam priorizar e resolver.

---

## 🧭 Escopo e contexto do projeto

A análise deve ser lida sob as regras do projeto:

- `safeUrl(url)` retorna `'#'` por padrão e exige fallback explícito quando houver fallback de imagem/link.
- Guards de rota privada devem usar `loadingInitial`, não `loading`.
- `MusicEvent` em JSON-LD precisa manter os campos obrigatórios aceitos pelo Google Search Console.
- Dados de pagamento/apoio do artista são públicos por decisão de produto, não vazamento.
- Conteúdo público do site é deliberadamente aberto para busca, grounding, discovery, indexação e treinamento por IA.
- `sameAs` deve conter apenas perfis oficiais de identidade, nunca artigos, imprensa, lineups ou playlists de terceiros.
- Não adicionar NOCACHE para `/wp-json/`, `/feed/` ou `/api/`; o frontend é SSG e cachear essas rotas faz parte da estratégia de performance.
- Não remover CSP dinâmica com `Header unset Content-Security-Policy` no `.htaccess`.

---

## 🚦 Veredito executivo

| Métrica | Resultado | Leitura |
|---:|---:|---|
| PRs na leva observada | **#548–#658** | Janela de alta atividade técnica, SEO, CI/CD, performance e segurança. |
| PRs abertos no filtro público em 2026-06-17 | **1** | O PR #658 continuava sendo o ponto de atenção visível. |
| PRs fechados/mergeados no filtro público | **110** | Maioria resolvida por merge ou encerramento/supersession. |
| Risco residual principal | **#658** | Acessibilidade, preload responsivo e robustez de invariantes SEO. |

### ✅ Conclusão direta

Quase tudo parece ter sido resolvido, substituído por PR posterior ou incorporado por PR maior. Porém, **não dá para considerar a leva 100% encerrada** enquanto as pendências documentadas do **#658 — Fix Lighthouse SEO and accessibility issues** não forem triadas.

---

## 🔴 Pendências reais / ainda não totalmente resolvidas

| PR | Status | Problema | Sugestão dos outros | Avaliação | Prioridade |
|---:|---|---|---|---|---|
| **#658** | 🔴 Aberto | Preload do hero pode causar download duplicado em telas High-DPI. | Gemini recomendou usar `imagesrcset`/`imagesizes` no preload em vez de múltiplos preloads por media query. | **Válido.** Pode afetar LCP em MacBooks/iPads Retina. Não é bug funcional, mas é melhoria real de performance. | 🟡 Média |
| **#658** | 🔴 Aberto | `check-seo-invariants.mjs` pode ter falso negativo. | Gemini apontou que regex muito restrita pode só pegar `<HeadlessSEO />` inline e não detectar variável externa com `window.location.origin`. | **Válido.** Para padrão enterprise, o check deveria escanear qualquer arquivo que usa/importa `HeadlessSEO` ou migrar para AST/ESLint custom. | 🟠 Alta |
| **#658** | 🔴 Aberto | Deduplicação de media clipping resolve tradução, mas ainda pode colapsar itens sem URL. | Gemini sugeriu chave fallback para itens sem URL. | **Parcialmente válido.** Preservar a primeira ocorrência melhora i18n, mas múltiplos itens sem URL ainda precisam chave determinística. | 🟡 Média |
| **#658** | 🔴 Aberto | Botão de share no detalhe do evento sem `aria-label`. | CodeRabbit marcou issue crítica de acessibilidade no detalhe do evento. | **Válido.** Se a lista foi corrigida, o detalhe não deve ficar fora. | 🟠 Alta |
| **#658** | 🔴 Aberto | `AddCalendarMenu` com label genérico em variantes/listas. | CodeRabbit pediu incluir título do evento no `aria-label`/`title`. | **Válido.** Melhora acessibilidade contextual e reduz ambiguidade para leitores de tela. | 🟡 Média |
| **#658** | 🟡 Aberto | Template de descrição do PR não seguido. | CodeRabbit marcou warning de descrição. | **Baixa prioridade técnica**, mas útil para disciplina enterprise de PRs. | 🟢 Baixa |
| **#658** | 🟡 Aberto | ESLint do CodeRabbit falhou por conflito/ambiente de dependências. | CodeRabbit reportou falha de instalação/check. | Provável limitação do bot. Validar localmente com `npm run lint` antes do merge. | 🟢 Baixa |

---

## ✅ O que já parece resolvido dentro do #658

| Item | Evidência operacional | Status |
|---|---|---|
| Deduplicação mantendo item traduzido de `PUBLISHED_WORKS` | Houve commit posterior indicando que `MediaPage` preserva a primeira ocorrência e mantém título/descrição traduzidos. | ✅ Resolvido parcialmente |
| Share button na lista de eventos com título do evento | Houve commit posterior adicionando tradução contextual com título do evento. | ✅ Resolvido na lista |
| Segunda rodada de review automatizado | CodeRabbit apareceu posteriormente como aprovado. | ✅ Parcialmente OK |
| PR ainda aberto | Listagem pública continuava mostrando #658 aberto na consulta de 2026-06-17. | 🔴 Ainda não finalizado |

---

## 📋 Lista comparativa por faixa de PRs

### #634–#658

| PRs | Status geral | Observação |
|---|---|---|
| **#658** | 🔴 Aberto | Único PR aberto no filtro público; pendências de review ainda merecem triagem. |
| **#657–#652** | ✅ Mergeados | Segurança CodeQL, Lighthouse budget, i18n e dependências agrupadas. |
| **#651–#650** | 🟡 Fechados sem merge | Dependabot individual `setup-node`/`checkout`; parecem superseded por upgrade agrupado/workflow maior. |
| **#649–#634** | ✅ Mergeados | CSP/sameAs, docs, eventos, catálogo, analytics, sitemap, Ahrefs, budget e PR grande #634. |

### #609–#633

| PRs | Status geral | Observação |
|---|---|---|
| **#633** | ✅ Mergeado | N+1 em `_thumbnail_id`. |
| **#632–#630** | 🟡 Fechados sem merge | PRs Bolt de performance/documentação N+1 fechados; parecem substituídos por solução equivalente/maior. |
| **#629–#628** | 🟡 Fechados sem merge | React Query/prerender cache age fechados; provavelmente superseded por #626/#627/#620. |
| **#627–#626** | ✅ Mergeados | SEO/routing/sitemap e Breadcrumb/logger/stale-time. |
| **#625** | 🟡 Fechado sem merge | Dependabot Vitest; provavelmente incluído em bump agrupado posterior. |
| **#624–#610** | ✅ Mergeados | Plugin load order, gitignore, encyclopedia routes, prerender hydration, split schema, i18n parity, sitemap performance, docs/context. |
| **#609** | 🟡 Fechado sem merge | Zoukology article fechado; conteúdo parece ter entrado depois em #608/#653. |

### #584–#608

| PRs | Status geral | Observação |
|---|---|---|
| **#608–#599** | ✅ Mergeados | Zoukology, CodeQL scripts, MCP, soft 404/noindex, memoizações e IndexNow. |
| **#598–#584** | ✅ Mergeados | Agent discovery, Content Signals, canonical fixes, DNS-AID, titles, sitemap/performance, prerender, SEO hub, YouTube permissions, OG metadata, `.htaccess` security. |

### #559–#583

| PRs | Status geral | Observação |
|---|---|---|
| **#583** | 🟡 Fechado sem merge | Bing audit crawl issues; aparentemente substituído pelo PR mergeado #584. |
| **#582–#577** | ✅ Mergeados | i18n parity, APCu cache, JWT hardening, prerender optimization, newsletter pages. |
| **#580** | 🟡 Fechado sem merge | Cache API/AEO fechado; coberto provavelmente por #581/#567. |
| **#576–#572** | ✅ Mergeados | CI/deploy/composer/node/security health endpoint. |
| **#571–#568** | 🟡 Fechados sem merge | Sugestões Bolt pequenas/performance; algumas reaparecem em PRs mergeados. |
| **#567–#565** | ✅ Mergeados | Encyclopedia AEO, Knowledge Panel API, hreflang/robots. |
| **#566** | 🟡 Fechado sem merge | Dependabot grande; superseded por bumps menores/posteriores. |
| **#564–#563** | 🟡 Fechados sem merge | `safeUrl`/N+1 pedidos fechados; precisam ser considerados "não mergeados diretamente". |
| **#562** | ✅ Mergeado | Redução de ruído no Search Console. |
| **#561, #559** | 🟡 Fechados sem merge | Sugestões SEO/encyclopedia de bot; parecem superseded por #560/#562/#567. |
| **#560** | ✅ Mergeado | Restore encyclopedia changes for review. |

### #548–#558

| PRs | Status geral | Observação |
|---|---|---|
| **#558–#556** | ✅ Mergeados | Encyclopedia AEO, MediaPage render allocation, UserMenu memoization. |
| **#555** | 🟡 Fechado sem merge | Rich artist profile REST API fechado; não está claro se foi totalmente substituído. Rastrear se ainda houver desejo de profile enriquecido. |
| **#554–#549** | ✅ Mergeados | Auditoria Markdown, N+1 user meta, requests públicos, event prerender, thumbnail cache, footer routes. |
| **#548** | 🟡 Fechado sem merge | Micro-otimização `split()` → `indexOf/slice` em `HeadlessSEO`; baixo impacto e não crítico. |

---

## 🧠 Fechados sem merge: resolvidos ou não?

| Categoria | PRs | Leitura recomendada |
|---|---|---|
| ✅ Provavelmente resolvidos por PR posterior | #650, #651, #625, #566 | Dependabot individual/grande superseded por bump agrupado #652/#653. |
| ✅ Provavelmente resolvidos por PR maior | #628, #629, #583, #580, #561, #559 | Temas reaparecem em PRs mergeados de SEO, prerender, cache e encyclopedia. |
| 🟡 Parcialmente resolvidos / verificar se ainda desejados | #555, #564, #563 | Temas de produto/segurança/performance que podem ter sido fechados por escopo, mas não dá para afirmar 100% sem timeline autenticada completa. |
| 🟢 Baixo risco / micro-otimização opcional | #548, #568–#571, #630–#632 | Sugestões pequenas; várias foram cobertas por outras otimizações, mas não são bloqueadoras. |

---

## ⚡ Estimativas qualitativas de melhoria de performance

> Estimativas qualitativas baseadas nos títulos/escopo dos PRs e padrões do projeto. Não substituem benchmark em produção.

| Área | PRs principais | Melhoria estimada | Impacto esperado |
|---|---|---:|---|
| N+1 em REST / thumbnails / user meta | #550, #553, #567, #633 | **20–70% menos queries** em endpoints afetados | TTFB menor em páginas com cards/imagens e dashboard/perfil. |
| APCu L1 cache / API cache | #581, #580 fechado | **30–80% menos recomputação** em requests repetidos | Melhor TTFB no WordPress, especialmente endpoints públicos. |
| Prerender batching/memory | #578, #589, #613, #620 | **10–40% build/prerender mais estável** | Menos falhas CI e SSG mais previsível. |
| Sitemap loops `array_merge` → `array_push` | #590, #615 | **2–20% melhor em geração grande** | Menor overhead em sitemap amplo. |
| React memoization / render allocations | #556, #557, #599, #602, #623 fechado | **1–8% menos garbage/re-render local** | Pequeno ganho UX; útil, mas não transformador. |
| Hero responsive image/preload | #658 | **Potencial +2–8 pontos em Lighthouse Performance/LCP** se corrigir High-DPI preload | Ainda pendente; pode evitar download duplicado. |
| Budget gzip robusto | #656, #658 | **Melhor governança, sem ganho runtime direto** | Evita regressão de bundle e falsos positivos/falsos negativos. |

---

## 💬 Comentário sugerido para o PR #658

> 👀 Revisão geral dos últimos PRs: a maior parte dos itens recentes foi resolvida ou superseded, mas o #658 ainda merece uma rodada antes do merge.
>
> Eu manteria como pendentes:
>
> 1. `aria-label` no botão de share do detalhe do evento.
> 2. Robustez do `check-seo-invariants.mjs` para evitar falso negativo com `window.location.origin` fora de `<HeadlessSEO />` inline.
> 3. Estratégia de preload do hero com `imageSrcSet`/`imageSizes` para evitar download duplicado em telas High-DPI.
> 4. Chave fallback na deduplicação de media clipping sem URL.
> 5. `AddCalendarMenu` com título do evento no `aria-label`/`title`.
>
> ✅ A deduplicação de `MediaPage` melhorou ao preservar a primeira ocorrência, e o share da lista parece corrigido. Ainda assim, eu não trataria o #658 como 100% fechado até esses pontos serem validados.

---

## ✅ Próxima ação recomendada

1. **Não mergear #658 sem triagem final.**
2. Resolver ou justificar explicitamente cada item pendente.
3. Rodar validações locais antes do merge:
   - `npm test -- --run`
   - `npm run i18n:check`
   - `npm run type-check`
   - `npm run lint`
   - `npm run perf:budget`
   - `npm run build`
4. Se algum PR fechado sem merge voltar a ser relevante, abrir issue/PR novo com escopo menor em vez de reabrir mudanças grandes antigas.

---

## 🧪 Checks usados durante a análise original

| Comando | Resultado observado | Nota |
|---|---|---|
| `npm test -- --run && npm run i18n:check && npm run type-check` | ✅ Passou | 21 arquivos de teste, 285 testes, i18n OK com 946 keys e TypeScript OK na rodada original. |
| `git status --short --branch` | ✅ Limpo | Working tree estava limpo antes deste relatório. |
| `gh repo view --json nameWithOwner,url,defaultBranchRef && gh auth status` | ⚠️ Limitado | `gh` não estava instalado no ambiente original. |
| `git ls-remote https://github.com/MarceloEyer/djzeneyer.git 'refs/pull/658/head' 'refs/heads/main'` | ⚠️ Limitado | Acesso Git HTTPS estava bloqueado por túnel/proxy `403` no ambiente original. |
| `git log --date=iso --pretty=format:'%h %ad %s' --since='2026-05-23' --all` | ✅ Passou | Confirmou localmente a sequência recente de merges/commits dos PRs principais no período. |

---

## 🏁 Critério de encerramento da auditoria

A auditoria pode ser considerada encerrada quando:

- #658 estiver mergeado, fechado com justificativa clara ou substituído por PR menor.
- Cada pendência de acessibilidade/SEO/preload/documentação listada acima tiver sido resolvida ou conscientemente rejeitada.
- Os PRs fechados sem merge de médio risco (#555, #563, #564) tiverem uma anotação explícita dizendo se foram superseded, rejeitados por produto ou ainda backlog.
