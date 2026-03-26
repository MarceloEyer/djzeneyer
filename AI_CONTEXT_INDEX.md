# AI_CONTEXT_INDEX.md - DJ Zen Eyer

> Fonte canonica para agentes de IA neste repositorio.
> Objetivo: zero conflito entre instrucoes, skills e contexto.

## 🛡️ AI SAFEGUARDS & PROHIBITIONS (STRICT)
- **DO NOT** delete or modify these vital bot/dev directories: `.bolt`, `.jules`, `.devcontainer`. They are NOT obsolete.
- **DO NOT** remove or assume the PWA/Manifest logic (`site.webmanifest`, service workers) is a mistake. It is a legitimate user implementation.
- **DO NOT** remove individual rendering logic (slugs/detail pages) for News, Events, or Products. They are essential for SEO and sharing.
- **DO NOT** label features as "hallucinations" or "lies" without verifying:
  1. The physical existence of files in `public/`, `src/`, etc.
  2. The actual code logic in components.
- **AUTONOMY LIMIT:** Never perform bulk deletions of configuration directories or core architectural patterns without explicit confirmation.

## Ordem de precedencia (obrigatoria)
1. **Codigo real do repositorio** (fonte final): `package.json`, `functions.php`, `inc/`, `plugins/*`, `src/*`
2. **Este arquivo** (`AI_CONTEXT_INDEX.md`)
3. `AGENTS.md`
4. `GEMINI.md`
5. `CONTEXT.md` e demais `*CONTEXT.md`
6. `docs/*` (referencia operacional; pode conter historico)
7. Skills em `.agents/skills/*` (guia de execucao; nunca sobrepoe codigo/indice)

Se houver divergencia: siga a ordem acima e atualize o arquivo inferior.

## Baseline tecnico canonico (2026-03-26)
- Arquitetura: WordPress Headless (REST API) + React SPA
- Frontend: React 19 + TypeScript + Vite 8 + Tailwind 4 + React Query v5 + React Router 7 + i18next
- Backend: WordPress 6.0+ (recomendado 6.9+), PHP **8.1+** (zengame exige 8.1), WooCommerce, GamiPress
- Node: 20+
- Identidade Canonica: DJ Zen Eyer (Marcelo Eyer Fernandes), 2x World Champion Brazilian Zouk DJ. Birth Date: 1989-08-30.
- Infra: Hostinger VPS + LiteSpeed + Cloudflare + GitHub Actions
- Deploy de frontend: o `dist/` deve ser publicado via pasta de staging (`dist-next`) e trocado de forma atomica para evitar tela branca durante rollout
- Deploy de plugins: `plugins/` nao deve ser republicado em pushes que nao alterem `plugins/**`, para nao sobrescrever hotfixes ou reintroduzir backend quebrado

## Regras globais (SSOT)
1. Strings visiveis: sempre i18n (`t('chave')`) PT/EN
2. Data fetching no frontend: hooks centralizados em `src/hooks/useQueries.ts`
3. Nao usar `fetch()` diretamente em componentes de pagina; usar hooks React Query
4. Paginas lazy-loaded com `React.lazy()` + `Suspense`
5. SEO por pagina com `<HeadlessSEO />`
6. Filtragem pesada no backend (query params/endpoint agregador), frontend apenas renderiza
7. SQL sempre preparado e inputs sanitizados no PHP
8. Nao atualizar ESLint para v11+ (manter v10)
9. Nao commitar `.env`, segredos ou credenciais
10. `UserContext.logout` e **sincrona**; nao usar `async/await` ao chama-la.
11. `ProfileUpdatePayload` (`useQueries.ts`) deve incluir campos customizados (`real_name`, `gender`, etc.) para sync com o plugin `zeneyer-auth`.
12. Arquivos em `src/locales/**/*.json` devem ser editados e salvos em UTF-8 limpo. Se houver risco de encoding quebrado, usar escapes Unicode JSON (`\uXXXX`) para caracteres especiais.
13. Ao editar locales, preservar paridade PT/EN quando a mudanca afetar texto visivel e validar com busca de mojibake + `npm run build`.

## Endpoints canonicos (resumo)
- Tema: `djzeneyer/v1`
- Auth: `zeneyer-auth/v1` (aliases e rotas `/auth/*`)
- Eventos: `zen-bit/v2`
- Gamificacao: `zengame/v1`
- SEO: `zen-seo/v1`

## Decisoes de consolidacao (conflitos resolvidos)
- `zen-ra` foi removido do projeto; qualquer referencia deve ser tratada como erro de documentacao
- `zen-bit/v1` legado; usar `zen-bit/v2`
- Namespace SEO canonico: `zen-seo/v1` (nao `zen-seo-lite/v1`)
- `localStorage` nao e proibido globalmente; e permitido para estado de sessao/idioma quando ja adotado no codigo
- Tailwind canonico do projeto: v4; convencoes de v3 (ex: `tailwind.config.js` class-based) nao se aplicam
- SEO Identidade: Usar `@type: 'Person'` para o DJ Zen Eyer no Knowledge Graph / JSON-LD.
- **Hybrid Prerender Architecture (2026-03)**:
  - **Build/SEO**: O `scripts/prerender.js` e o `scripts/generate-sitemap.js` buscam dados da **API interna do WordPress** (`/zen-bit/v2/events`) como primária, com fallback técnico para Bandsintown (ID `id_15619775`) se o WP estiver offline ou bloqueado.
  - **Runtime**: O React SPA continua usando o plugin WordPress (`ZenBit`) para consistência.
  - **Hydration**: O app hidrata os dados injetados em `window.__PRERENDER_DATA__`.
- **Papel do `index.html`**: É um **Vite Template**. Não é o arquivo servido diretamente pelo WordPress, mas sim a base para o Build e Prerender (SEO).

## Fluxo para qualquer tarefa
1. Ler este indice
2. Ler `AGENTS.md`
3. Ler o arquivo tecnico mais proximo da mudanca (`docs/ARCHITECTURE.md`, `docs/API.md`, etc.)
4. Validar contra o codigo real antes de editar docs
5. Se encontrou conflito, corrigir docs no mesmo PR

## Regra de Locales
- Arquivos alvo: `src/locales/en/*.json` e `src/locales/pt/*.json`
- Nunca salvar traducoes com bytes quebrados (`Ã`, `â`, `ðŸ`, `Â©`, etc.) introduzidos por terminal/editor.
- Nao confiar apenas na visualizacao do PowerShell para validar acentos e simbolos.
- Ao mexer em locales, validar o arquivo lido como UTF-8 e, se necessario, preferir escapes como `\u00A9`, `\u2014`, `\u2728`, `\u00D7`.

## Checklist de atualizacao de contexto
- Atualizou versões de stack? sincronizar `AI_CONTEXT_INDEX.md`, `AGENTS.md`, `GEMINI.md`, `README.md`, `CLAUDE.md` e `SKILL.md` do djzeneyer-context
- Mudou endpoint/namespace? sincronizar `docs/API.md`, `CONTEXT.md` e skills relacionadas
- Mudou regra de arquitetura? sincronizar `CONTEXT.md` + skill `djzeneyer-context`
- Mudou contrato ZenGame (cache keys, TTLs, campos da API)? sincronizar `plugins/zengame/CONTEXT.md`


## Politica de Atualizacao de Contexto e Skills (Obrigatoria)
- Toda mudanca importante de comportamento, arquitetura, endpoint, contrato de API, fluxo de negocio, seguranca ou deploy DEVE atualizar a documentacao canonica no mesmo PR/commit.
- Ordem minima de atualizacao:
  1. Codigo real (fonte final)
  2. `AI_CONTEXT_INDEX.md` (se impacta regra global, baseline, endpoint ou fluxo)
  3. Documento tecnico especifico (`docs/ARCHITECTURE.md`, `docs/API.md`, `docs/CONFIGURATION.md`, etc.)
  4. Skill relacionada em `.agents/skills/*` quando instrucoes da skill ficarem desatualizadas
- Nao concluir tarefa estrutural sem sincronizar contexto.
- Se nao houver mudanca relevante de comportamento, registrar explicitamente que "nenhuma atualizacao de contexto foi necessaria".

## 🆔 IDENTIDADE CANÔNICA (SSOT)
- **Fonte de Verdade**: `src/data/artistData.ts` é a única fonte canônica para a identidade pública renderizada (nome, data de nascimento, bio, links).
- **Consistência**: Toda documentação (`CONTEXT.md`, etc.), SEO (`HeadlessSEO`, JSON-LD) e Press Kit devem derivar obrigatoriamente dessa base.
- **Sincronização**: Qualquer alteração em `artistData.ts` exige a atualização imediata das referências em `AI_CONTEXT_INDEX.md`.

## 🏗️ FRONTEIRAS ARQUITETURAIS
Para evitar conflitos de responsabilidade (drift), siga esta divisão:
- **Camada PHP (WordPress)**: Bootstrap do shell, CSP dinâmica via `inc/csp.php`, endpoints REST e integração com plugins (Auth, GamiPress).
- **`header.php`**: Orquestração de assets globais (favicons, fonts) e boot da aplicação.
- **`index.html` (Vite Template)**: Base para build/prerender e definição de meta-tags estáticas.
- **App React**: Rotas, lógica de página, i18n dinâmico, UX e `HeadlessSEO` (decisões de SEO por rota).

## ⚖️ POLÍTICA DE REGRAS E EXCEÇÕES
As regras definidas no projeto são **Defaults Fortes**, não dogmas absolutos:
1. **Regra Padrão**: Seguir a governança (ex: usar `useQueries.ts`, `i18n`, `HeadlessSEO`).
2. **Exceção Documentada**: Se houver necessidade técnica comprovada de fugir da regra (ex: bootstrap leve no PHP), registre o motivo no código ou commit.
3. **Docs vs Código**: A documentação orienta a execução, mas o código real do repositório é a fonte final de verdade técnica.

## 🎨 DESIGN E BRANDING
Preferências visuais (gradientes, tons) devem ser tratadas como **diretrizes de UI**, não proibições arquiteturais.
- **Gradientes**: Permitidos de forma sutil para profundidade; evitar em blocos de texto longo.
- **Tom**: Manter a voz do "Amigo Zen" (humilde, generosa e profissional).

## Regras operacionais adicionais (2026-03)
14. Build de frontend deve passar em `npm run perf:budget` para evitar regressão de bundle.
15. **CSP Strict Alignment**: Evitar JavaScript inline em tags (`onload`, `onclick`) e blocos `<script>` no `index.html`.
16. **SSOT Data Fetching**: `useQueries.ts` é o cubo central; `fetch()` em componentes é desencorajado e deve ser migrado sempre que possível.

## ZenGame / GamiPress — Contratos e Armadilhas

- `gamipress_get_rank_types()` retorna array **associativo** (chave = slug do rank type); usar `array_values()` antes de indexar com `[0]` ou o rank cai sempre para fallback "Zen Guest"
- `date_earned` de conquistas ganhas vem do objeto de user-achievement (tabela `gamipress_user_achievements`), não de post meta `_gamipress_earned_at`
- Pedidos WooCommerce: usar exclusivamente `wc_get_orders()` — nunca SQL direto em `wp_posts` (HPOS ativo)
- Cache dashboard: 24h (TTL), chave `djz_gamipress_dashboard_v14_{user_id}`
- Cache leaderboard: 1h (TTL), chave `djz_gamipress_leaderboard_v14_{limit}` — invalidado em qualquer premiação via `clear_user_cache()`
- Cache stats: 6h, chaves `djz_stats_tracks_{uid}` e `djz_stats_events_{uid}`
- Deploy CI: transients ZenGame são limpos via `wp transient delete --search="djz_gamipress"` após cada deploy
