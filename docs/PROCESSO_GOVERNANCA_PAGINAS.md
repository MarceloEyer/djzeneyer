# 🧭 Governança de Páginas (Frontend + Rotas + i18n + SSG)

> Objetivo: garantir que **toda nova página** siga o mesmo padrão de qualidade usado no exemplo da `PayMePage` (componente + rota + i18n + prerender + build).

## ✅ Checklist obrigatório (Definition of Done)

| Etapa | Arquivo(s) | Obrigatório? | Critério de aceite |
|---|---|---:|---|
| 1. Criar página | `src/pages/<NovaPagina>.tsx` | Sim | Componente exportado e renderizando sem erros |
| 2. Registrar rota | `src/config/routes.ts` (fonte única) + `src/components/AppRoutes.tsx` (consumo) | Sim | Slugs EN/PT definidos e roteamento funcionando |
| 3. Garantir i18n | `src/locales/en/translation.json` e `src/locales/pt/translation.json` | Sim | Chaves usadas na página existem nos dois idiomas |
| 4. Incluir no prerender/SSG | `scripts/routes-config.json` | Sim (rotas estáticas) | Rota canônica EN e PT presente para pré-render |
| 5. Validar build | `npm run build` | Sim | Build final sem erro |

---

## 🔎 Auditoria executada neste ciclo

Escopo auditado:
- `src/pages/*.tsx`
- `src/config/routes.ts`
- `src/components/AppRoutes.tsx`
- `scripts/routes-config.json`
- `src/locales/en/translation.json`
- `src/locales/pt/translation.json`

### Resultado consolidado

| Item auditado | Antes | Depois | Status |
|---|---:|---:|---|
| Componentes de página em `src/pages` | 27 | 27 | ✅ |
| Páginas mapeadas em rotas (exceto 404) | 26/26 | 26/26 | ✅ |
| Rotas estáticas no prerender (`scripts/routes-config.json`) | 26 | 55 | ✅ Melhorado |
| Cobertura de idioma no prerender (EN + PT) | Parcial | Completa para rotas estáticas | ✅ Melhorado |

### Diferença principal aplicada

Foi ampliada a lista de SSG para cobrir as rotas estáticas canônicas em **EN e PT**, incluindo páginas que antes não estavam contempladas em português (ex.: `about/sobre`, `events/eventos`, `shop/loja`, `tickets/ingressos`, etc.) e também aliases oficiais (`zentribe/tribe/zen-tribe`, `links/zenlink`).

---

## 📈 Estimativas de melhoria de performance (SSG)

> Estimativas conservadoras baseadas no aumento de cobertura de prerender e no comportamento padrão de páginas estáticas em CDN.

| Métrica | Antes (cobertura parcial) | Depois (cobertura estática EN/PT) | Estimativa de ganho |
|---|---:|---:|---:|
| Rotas pré-renderizadas | 26 | 55 | **+111,5%** |
| TTFB em rotas recém-prerenderizadas | Dinâmico/CSR inicial | HTML estático em CDN | **~25% a 60%** melhor |
| Tempo até conteúdo útil (FCP percebido) | Dependente de hidratação total | HTML já entregue no primeiro byte | **~15% a 40%** melhor |
| Risco de regressão SEO em páginas PT | Médio | Baixo (rotas PT também no SSG) | **redução material** |

---

## 🛡️ Regra de governança para futuras mudanças

Sempre que uma nova página for criada (ou uma rota for alterada), o PR deve incluir:
1. atualização de `src/config/routes.ts`;
2. atualização de `scripts/routes-config.json` (para rotas estáticas);
3. atualização de traduções EN/PT quando houver textos localizáveis;
4. evidência de build (`npm run build`);
5. atualização desta documentação (ou de auditoria equivalente) quando houver impacto estrutural.

> Sem esse pacote completo, a tarefa não está pronta para produção.
