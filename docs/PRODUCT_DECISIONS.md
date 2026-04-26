# PRODUCT_DECISIONS.md — DJ Zen Eyer

> Decisões de produto, UX e identidade que não devem ser revertidas sem decisão explícita.
> Serve como referência para agentes de IA e colaboradores para evitar regressões.
> **Fonte canônica:** este arquivo. Versões anteriores arquivadas em `docs/archive/`.
> Última atualização: 2026-04-27

---

## 1. Objetivo e posicionamento do site

- **Propósito principal:** plataforma oficial de DJ Zen Eyer — música, agenda, comunidade (Tribo Zen).
- **CTA primário universal:** levar o usuário da página de música para o Spotify.
- **CTA secundário permitido:** doação/suporte — sem competir com o CTA principal.
- **Identidade canônica:** Zen Eyer não é "mais um DJ de Zouk" — é o criador da filosofia da Cremosidade e 2× Campeão Mundial de Brazilian Zouk.
- **Slogan operacional:** *"A pressa é inimiga da cremosidade."*

---

## 2. Estética e design (não negociáveis)

- **Estética:** premium contemporâneo + imersão MMORPG. Referências internas: Zen Tribe e Dashboard.
- **Paleta:** azul elétrico para destaques + tema escuro profundo.
- ❌ **Proibido:** gradiente chamativo em títulos principais.
- ❌ **Proibido:** layouts estilo "template genérico" — cada página tem identidade própria.
- ❌ **Proibido:** autoproclamação sem substância — credenciais (títulos mundiais) falam por si.
- ❌ **Proibido:** emojis de fogo/raio em excesso — o estilo é elegante, não hype.

---

## 3. Música e plataformas

| Plataforma | Papel | Decisão |
|---|---|---|
| Spotify | **Primário** — streaming de autorais, covers, remixes autorizados | CTA principal |
| SoundCloud | **Secundário** — sets e remixes não-oficiais | CTA secundário |
| YouTube | Apoio válido | Links disponíveis |
| Apple Music | Opção secundária | Links disponíveis |
| Download | Foco para DJs | Acesso especial |

- ❌ **Proibido:** reintroduzir music player embutido sem decisão explícita.
- O player foi removido deliberadamente — não é bug, é decisão de produto.

---

## 4. Página de eventos

- Filtro por estado/região é válido e desejado.
- Foco em agenda futura — social proof de eventos passados em área separada.
- ❌ **Proibido:** publicar datas de eventos não confirmados — a comunidade de Zouk verifica.

---

## 5. Animações e performance

- Animações devem ser sutis, discretas e sem impacto perceptível em performance.
- Micro-animações de baixo custo são preferidas a efeitos visuais que aumentem bundle/CPU.
- `prefers-reduced-motion` deve ser respeitado em todas as animações (Framer Motion `useReducedMotion()`).
- Performance é regra principal — carregamento instantâneo como prioridade.

---

## 6. Identidade canônica (Schema.org / SEO)

- **@type:** `Person` para DJ Zen Eyer no Knowledge Graph / JSON-LD.
- **Name canônico:** `Zen Eyer` (não "DJ Zen Eyer") no byline e Schema.org.
- **Birth date:** 1989-08-30.
- **Wikidata:** Q136551855 (entidade canônica — manter como sameAs).
- **Slug EN:** `/about-dj-zen-eyer` (não `/about`).
- **Slug PT:** `/pt/sobre-dj-zen-eyer` (não `/pt/sobre`).
- Usar sempre `getLocalizedRoute()` — nunca hardcodar paths.

---

## 7. Rotas privadas e SEO

- `DashboardPage` e `MyAccountPage` → `<HeadlessSEO noindex />` + OG image genérica.
- Avatar do usuário nunca aparece em OG tags ou preview social.
- Rotas excluídas de sitemap: `cart`, `checkout`, `tickets-checkout`, `reset-password`, `quiz`.

---

## 8. Decisões de stack (consolidadas de AI_CONTEXT_INDEX.md)

- `zen-ra` foi removido — qualquer referência é erro de documentação.
- `zen-bit/v1` é legado — usar `zen-bit/v2`.
- Namespace SEO canônico: `zen-seo/v1` (não `zen-seo-lite/v1`).
- `localStorage` não é proibido globalmente — permitido para estado de sessão/idioma.
- Tailwind canônico: **v4** — convenções de v3 (tailwind.config.js class-based) não se aplicam.
- Minificador: **OXC** (Vite 8 default) — nunca `minify: 'esbuild'`.
- ESLint: manter **v10** — não atualizar para v11+.

---

## 9. Prerender e PWA

- `scripts/prerender.js` (Puppeteer) — **nunca remover**. É o que evita tela branca no deploy.
- `site.webmanifest` e service workers — **nunca remover**. PWA é decisão intencional.
- Lógica de renderização por slug em `NewsPage` e `EventsPage` — **nunca remover**. Crítico para SEO.

---

## 10. Bots e diretórios de agentes

- `.bolt`, `.jules`, `.devcontainer`, `.agents`, `.gemini` — **nunca deletar**. Usados por outros agentes de IA.
- Diretório canônico de skills: `.agents/skills/` (28 skills). O diretório `.agent/` (singular) foi deletado.

---

## 11. Arquitetura híbrida de prerender (2026-03)

- **Build/SEO:** `scripts/prerender.js` e `scripts/generate-sitemap.js` buscam dados da API interna WP (`/zen-bit/v2/events`) como primária, com fallback para Bandsintown (ID `id_15619775`) se WP estiver offline.
- **Runtime:** React SPA continua usando o plugin WordPress (ZenBit) para consistência.
- **Hydration:** dados injetados em `window.__PRERENDER_DATA__`.
- `index.html` é um **Vite Template** — não é o arquivo servido diretamente pelo WordPress.

---

## 12. Newsletter e gamificação

- MailPoet ativo com endpoint `djzeneyer/v1/subscribe`.
- Sequência de boas-vindas (5 e-mails) a ser configurada — ver `docs/marketing/PLANO_MARKETING.md § Fase 5`.
- Zen Game (GamiPress + `zengame 1.4.0`) existe e está ativo — ativar recompensas conforme Fase 5 do plano de marketing.

---

## Registro de decisões arquivadas

| Data | Decisão | Arquivo original |
|---|---|---|
| 2026-03-07 | Definição de CTAs, plataformas, eventos, animações, performance | `docs/PRODUCT_DECISIONS_2026-03-07.md` |

> Arquivo original mantido em `docs/PRODUCT_DECISIONS_2026-03-07.md` para referência.
