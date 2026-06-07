# Engineering Principles

Version: 1.0.0

SSOT de governança arquitetural. Este documento define os 50 princípios que guiam o projeto, seu status atual, as fronteiras obrigatórias entre backend e frontend, e o owner de cada domínio.

**Hierarquia de verdade:** código real > `AI_CONTEXT_INDEX.md` > este arquivo > outros docs.

---

## Os 50 Princípios

Legenda: ✅ bem aplicado · 🟡 parcial · ❌ falta · ⚠️ risco ativo

| #  | Princípio                                    | Status | Nota                                                                                                      |
|----|----------------------------------------------|--------|-----------------------------------------------------------------------------------------------------------|
| 1  | KISS                                         | 🟡     | Documentado, mas `inc/api.php`, `UserContext` e `CartContext` cresceram demais.                           |
| 2  | SSOT                                         | 🟡     | Bem documentado; duplicação prática persiste em carrinho, auth, shop e rotas.                             |
| 3  | DRY                                          | 🟡     | Lei técnica formal; formatação de produto ainda repetida entre endpoints de produtos e shop.              |
| 4  | YAGNI                                        | 🟡     | Bom como princípio; verificar se AI discovery, skills e docs têm checks automáticos de relevância.        |
| 5  | Separation of Concerns                       | 🟡     | Fronteiras existem, mas `inc/api.php` e contexts do React acumulam responsabilidades.                     |
| 6  | Single Responsibility Principle              | 🟡     | `zen-bit` está bom. `inc/api.php`, `UserContext` e `CartContext` violam.                                  |
| 7  | Backend owns domain logic                    | 🟡     | Eventos: excelente. Shop/produtos ainda parcialmente presos ao tema.                                      |
| 8  | Frontend owns presentation only              | 🟡     | Eventos respeitam. Auth e cart ainda decidem lógica de domínio no frontend.                               |
| 9  | API Contract First                           | 🟡     | Schemas Zod existem; falta contrato gerado/testado automaticamente.                                       |
| 10 | Schema validation at boundaries              | 🟡     | Zod usado em eventos, auth e gamificação. Produtos e posts aceitam tipos soltos.                          |
| 11 | Typed domain models                          | 🟡     | Interfaces TS existem; algumas respostas REST ainda são `unknown` ou casts.                               |
| 12 | Thin Components                              | 🟡     | Regra existe; contexts ainda fazem trabalho demais.                                                       |
| 13 | Hooks as data layer                          | 🟡     | `usePublicQueries`, `useAuthenticatedQueries`, `useMutations` existem, mas contexts ainda fazem fetch.    |
| 14 | Query key discipline                         | ✅     | `QUERY_KEYS` centralizado e bem separado por domínio.                                                     |
| 15 | Server-side filtering                        | ✅     | Eventos e shop aplicam filtros no backend.                                                                |
| 16 | No backend work in frontend                  | 🟡     | Eventos respeitam. Carrinho e auth têm lógica operacional no frontend.                                    |
| 17 | Plugin encapsulation                         | 🟡     | Auth, eventos, SEO, game pluginizados. Shop, newsletter e profile ainda no tema.                          |
| 18 | Capability-based permissions                 | 🟡     | Plugins principais usam capabilities. Rotas antigas do tema precisam revisão.                             |
| 19 | Least privilege                              | ⚠️     | Revisar `register_meta(... auth_callback => __return_true)` e endpoints com `permission_callback => __return_true`. |
| 20 | Secure by default                            | 🟡     | Auth tem rate limit e JWT. Rotas legadas precisam limpeza.                                                |
| 21 | Rate limiting                                | ✅     | Login, register e google usam `Rate_Limiter`.                                                             |
| 22 | Cache ownership                              | 🟡     | Eventos têm cache bem definido. Shop tem cache no tema; deve mover para plugin.                           |
| 23 | Explicit cache invalidation                  | 🟡     | Existe; algumas invalidações usam SQL direto em transients. Encapsular melhor.                            |
| 24 | Build, release, run separation               | 🟡     | Scripts existem. Pipeline não está documentado como contrato formal.                                      |
| 25 | Environment config                           | ✅     | `window.wpData` tem prioridade; env vars apenas como fallback de dev.                                     |
| 26 | Dev/prod parity                              | 🟡     | Node engine e scripts ajudam. WordPress existe só no servidor (sem local).                                |
| 27 | Self-testing build                           | 🟡     | Scripts de lint/typecheck/test existem; cobertura real e CI completo não auditados.                       |
| 28 | Performance budgets                          | ✅     | Scripts `perf:baseline` e `perf:budget` existem.                                                         |
| 29 | Observability                                | 🟡     | Logger no frontend e health endpoints em plugins. Falta padronizar logging por domínio.                   |
| 30 | Graceful degradation                         | 🟡     | Eventos e cache têm fallback forte. Outras áreas precisam padrão equivalente.                             |
| 31 | Backwards compatibility with deprecation     | 🟡     | Aliases de auth e endpoints legados existem. Sem política formal de deprecação.                           |
| 32 | No legacy without owner                      | 🟡     | TODOs apontam refs antigas. Falta check automático.                                                       |
| 33 | Docs follow code                             | 🟡     | Regra existe. Falta inventário gerado automaticamente.                                                    |
| 34 | Generated API inventory                      | ❌     | Mapa de API é curado, não gerado. Pode ficar obsoleto.                                                    |
| 35 | Broken link checking                         | ❌     | Check de links internos em MDs críticos ainda não existe. (→ script A2)                                   |
| 36 | ADR — Architecture Decision Records          | ❌     | Decisões arquiteturais não têm registro formal. Um `.context/decisions/` simples resolve.                 |
| 37 | Domain boundaries                            | 🟡     | Eventos, auth, game e SEO bem separados. Shop, newsletter e profile misturados no tema.                   |
| 38 | Ports/adapters                               | 🟡     | `zen-bit` funciona como adapter para Bandsintown. Shop mistura query, formatação e cache.                 |
| 39 | External API isolation                       | ✅     | Bandsintown encapsulado em `zen-bit`. Não espalhado no frontend.                                          |
| 40 | Idempotency where possible                   | 🟡     | Cache clear e fetch-now parecem seguros. Mutations de carrinho e newsletter precisam revisão.             |
| 41 | Rollback path                                | ✅     | Script `rollback` existe.                                                                                 |
| 42 | Small public surface                         | 🟡     | O projeto expõe muita coisa por design (SEO/IA). Manter inventário rígido do que é público.              |
| 43 | Privacy by design                            | 🟡     | Docs separam público de privado. Rotas e metas antigas merecem revisão.                                   |
| 44 | Deterministic dependencies                   | 🟡     | `package.json` e lockfiles citados. Não auditados completamente.                                          |
| 45 | i18n by default                              | ✅     | Toda string visível deve usar `t()`. Check automático existe.                                             |
| 46 | SEO/GEO/AEO as domain, not decoration        | ✅     | SEO, schema, llms, sitemap e discovery são parte central da arquitetura.                                  |
| 47 | Route governance                             | 🟡     | `routes-slugs.json` é SSOT de slugs, mas `routes.ts` ainda exige atualização manual.                     |
| 48 | View-model endpoints                         | 🟡     | `/shop/page` entrega view-model — ótimo conceito, mas deve morar em plugin próprio.                       |
| 49 | Continuous cleanup                           | 🟡     | `IMPLEMENTATION_STATUS.md` existe mas precisa poda periódica.                                             |
| 50 | Architecture fitness functions               | ❌     | Falta check automático de violações de fronteira frontend/backend/SSOT. (→ script A3)                     |

---

## Fronteiras obrigatórias: Backend vs Frontend

### Deve ficar no backend (WordPress/plugins)

| Domínio                     | Owner atual / destino                        |
|-----------------------------|----------------------------------------------|
| Auth, JWT, Google login      | `plugins/zeneyer-auth`                       |
| Perfil do usuário            | `plugins/zeneyer-auth`                       |
| Pedidos WooCommerce          | `plugins/zeneyer-auth` ou plugin commerce    |
| Newsletter status/subscribe  | `zen-mailer` ou `zeneyer-auth`               |
| Eventos                      | `plugins/zen-bit` ✅                         |
| Produtos / shop view-model   | `plugins/zen-commerce` (a criar)             |
| Gamificação                  | `plugins/zengame` ✅                         |
| SEO / schema / sitemap       | `plugins/zen-seo-lite` + build scripts ✅    |
| AI / MCP / API catalog       | `inc/ai-llm.php` (mover para plugin se crescer) |
| Cache e invalidação          | plugin dono do domínio                       |

### Deve ficar no frontend (React)

| Domínio                  | Owner                                                         |
|--------------------------|---------------------------------------------------------------|
| UI, layout, páginas      | `src/pages/`, `src/components/`                               |
| i18n visual              | `src/locales/` + `t()`                                        |
| Queries de leitura       | `src/hooks/usePublicQueries.ts`, `useAuthenticatedQueries.ts` |
| Mutations                | `src/hooks/useMutations.ts`                                   |
| Estado visual local      | componentes/hooks locais                                      |
| Campos derivados de render | frontend (ex: `detailHref`, data formatada, label visual)   |
| Cache de cliente         | React Query                                                   |

### Regra de ouro

> `fetch()` e lógica de domínio não pertencem a `src/pages/`, `src/components/` nem `src/contexts/`.  
> Contextos só gerenciam estado de sessão e expõem hooks. Requests ficam em `src/hooks/` ou `src/services/`.

---

## Dívida técnica conhecida e rastreada

Estas são violações reconhecidas da regra acima, com owner e plano de correção:

| Arquivo                          | Violação                                      | Fase de correção |
|----------------------------------|-----------------------------------------------|------------------|
| `src/contexts/CartContext.tsx`   | `fetch()` direto para WooCommerce Store API       | Fase B2          |
| `src/contexts/UserContext.tsx`   | `fetch()` para login, register, Google, reset     | Fase B1          |
| `src/pages/CheckoutPage.tsx`     | `fetch()` para checkout GET e POST de pedido      | Fase B3          |
| `inc/api.php`                    | SRP violado (shop, produtos, newsletter, profile) | Fase D1–D5       |

Nenhuma nova violação deve ser adicionada a esta lista sem decisão explícita do usuário.

---

## Checks automáticos relacionados

| Script                                    | O que verifica                                          |
|-------------------------------------------|---------------------------------------------------------|
| `scripts/check-architecture-boundaries.mjs` | `fetch()` em pages/components/contexts fora da dívida conhecida |
| `scripts/check-broken-docs-links.mjs`     | Links internos quebrados em MDs críticos                |
| `scripts/check-i18n-parity.mjs`           | Paridade de chaves entre pt e en                        |
| `scripts/check-seo-invariants.mjs`        | Invariantes de SEO                                      |
| `scripts/check-public-facts.mjs`          | Fatos públicos do artista                               |
