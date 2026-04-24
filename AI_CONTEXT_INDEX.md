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
4. `docs/AI_GOVERNANCE.md` e `docs/*` (referência operacional e governance)
5. `GEMINI.md`
6. `CONTEXT.md` e demais `*CONTEXT.md`
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
17. **Rotas Autenticadas Privadas**: `dashboard` e `my-account` devem permanecer `noindex`, fora do sitemap público e fora do prerender, sempre usando OG image genérica do site em vez de avatar do usuário.
18. **Lint Scope Guard**: `eslint.config.js` deve ignorar diretórios de infraestrutura de agentes/worktrees (`.claude`, `.agents`, `.bolt`, `.gemini`, `.jules`, `.devcontainer`) para evitar conflito de múltiplos `tsconfig` e manter o lint focado no app principal.
19. **Framer Motion variants**: objetos `variants` (e equivalentes estáticos como `whileHover/whileTap`) DEVEM ser declarados no escopo de módulo (fora de qualquer função/componente), especialmente quando o componente usa `React.memo`. Declarar dentro do componente cria nova referência por render → `React.memo` torna-se ineficaz. Objetos state-dependentes (ex: `animate={{ height: isOpen ? 'auto' : 0 }}`) são a única exceção válida para inline.
20. **Bot Auto-Review**: o workflow `.github/workflows/trigger-bot-reviews.yml` deve comentar automaticamente `@coderabbitai review`, `@codex review` e `@jules` em todo PR aberto/reaberto/synchronize, inclusive PRs criados por bots. Se isso parar de acontecer, primeiro valide se o workflow existe na branch default e se `issues: write` / `pull-requests: write` estão disponíveis.
21. **Person Schema Alias**: o grafo JSON-LD canônico deve manter `ARTIST_SCHEMA_BASE` e também publicar o alias `ARTIST_SCHEMA_ALIAS` com `name: 'Zen Eyer'`, `alternateName: 'DJ Zen Eyer'`, `jobTitle: 'DJ'` e `genre: 'Brazilian Zouk'` quando montar páginas de SEO e homepage/about.

## ZenGame / GamiPress — Contratos e Armadilhas

### ⚠️ Bugs críticos já corrigidos (março/2026) — NÃO reverter

O dashboard mostrava pontuação 0 e rank "Zen Guest" para todos os usuários.
Causa raiz: **`gamipress_get_points_types()` e `gamipress_get_rank_types()` retornam
arrays associativos cuja CHAVE é o slug** (ex: `['zen-points' => [...]]`).
O código antigo tentava ler o sub-campo `$type['slug']` que frequentemente não existe.

**Commits que corrigiram (em ordem):**

| Commit | O que corrigiu |
|--------|---------------|
| `32ec16e8` | `get_main_points_slug()`: trocou `wp_list_pluck($types,'slug')` por `array_keys($types)` — o método antigo retornava array vazio → slug caía para `'points'` em vez de `'zen-points'` |
| `32ec16e8` | `get_user_points()`: loop `foreach($types as $type)` trocado por `foreach($types as $type_key => $type)` com `$slug = $type['slug'] ?? $type_key` |
| `32ec16e8` | `get_user_rank_data()`: `array_values(gamipress_get_rank_types())[0]['slug']` trocado por `reset() + key()` — `array_values()` descarta as chaves, tornando `[0]['slug']` sempre vazio |
| `32ec16e8` | Removido fallback espúrio `$points['points'] = ['amount'=>0]` que injetava chave `'points'` falsa quando o slug real era `'zen-points'` |
| `f270a721` | `gamipress_get_user_requirement_status()` só aceita 2 args; código passava 3 → PHP fatal |
| `f270a721` | `gamipress_get_user_rank_type_progress_percent()` não existe no GamiPress free → substituído por média dos `percent` dos requirements |
| `f270a721` | `gamipress_get_user_logs()` não existe → substituído por `gamipress_get_logs()` |
| `1faf5c2e` | `rankProgress` fallback: ternário `($a > $b) ? 0.0 : 0.0` (sempre 0) substituído por cálculo real via pontos vs `_gamipress_points` meta do próximo rank |
| `2e2e652e` | `CACHE_VERSION` v15 → v16: invalida transients stale que cacheavam dados errados por 24h |

### Regras fixas sobre arrays do GamiPress

- `gamipress_get_points_types()` → `array<slug, data>` — usar `array_keys()`, nunca `wp_list_pluck($arr, 'slug')`
- `gamipress_get_rank_types()` → `array<slug, data>` — usar `reset() + key()` para pegar o primeiro, nunca `array_values()[0]`
- `gamipress_get_user_requirement_status($user_id, $req_id)` → **2 argumentos apenas**
- `gamipress_get_user_logs()` → **não existe** no GamiPress free; usar `gamipress_get_logs(['user_id'=>$uid])`
- `gamipress_get_user_rank_type_progress_percent()` → **não existe** no GamiPress free

### Cache

- Dashboard: 24h, chave `djz_gamipress_dashboard_v16_{user_id}` (`CACHE_VERSION = 'v16'` em `class-zengame.php`)
- Leaderboard: 1h, chave `djz_gamipress_leaderboard_v16_{limit}` — invalidado em qualquer premiação via `clear_user_cache()`
- Stats: 6h, chaves `djz_stats_tracks_{uid}` e `djz_stats_events_{uid}`
- **Ao corrigir bugs que afetam dados cached: sempre bumpar `CACHE_VERSION`** — sem isso o WordPress serve o cache errado por horas mesmo após o deploy

### Outros

- `date_earned` de conquistas vem do objeto de user-achievement (tabela `gamipress_user_achievements`), não de post meta
- Pedidos WooCommerce: usar exclusivamente `wc_get_orders()` — nunca SQL direto em `wp_posts` (HPOS ativo)
- Deploy CI: transients ZenGame são limpos via `wp transient delete --search="djz_gamipress"` após cada deploy
- **`WP_DEBUG` em produção**: `WP_DEBUG_DISPLAY: true` emite HTML antes do JSON → `res.json()` falha. Fix: `define('WP_DEBUG', false); define('WP_DEBUG_DISPLAY', false); @ini_set('display_errors', 0);`
- **Zod schema**: campos `main_points_slug`, `lastUpdate`, `version` usam `.catch('')` para não quebrar o parse quando o PHP retorna null

## SEO / Bots de IA — Padrões Canônicos

- **Sitemap**: rotas privadas (`cart`, `checkout`, `tickets-checkout`, `reset-password`, `quiz`, `dashboard`, `my-account`) têm `excludeFromSitemap: true` em `routes-slugs.json` e são excluídas pelo `generate-sitemap.js`
- **hreflang**: toda entrada de sitemap inclui `x-default` apontando para a versão EN
- **robots.txt**: bots SEO (AhrefsBot, SemrushBot) têm `Allow: /` + `Crawl-delay` — nunca `Disallow: /` sem `Allow: /` correspondente; RFC 9309 resolve conflitos pelo **match mais específico** (maior número de octets no path), e em empate perfeito prefere `Allow`
- **llms.txt / llms-full.txt**: arquivos em `public/` para crawlers de IA; devem ser UTF-8 limpo (sem mojibake)
- **`.well-known/ai-plugin.json`**: metadados estruturados para ChatGPT Plugins e crawlers de IA; inclui identificadores Wikidata, MusicBrainz, ISNI
- **Schema.org**: `AboutPage` usa `@type: ProfilePage` com `mainEntity` apontando para `#artist`; `MusicPage` (listagem) usa `CollectionPage` + `MusicGroup`; `PhilosophyPage` usa `Article` com `about` descrevendo Cremosidade
- **URL canônica**: nunca hardcodar paths — usar `getLocalizedRoute()` para garantir slugs corretos em EN e PT
