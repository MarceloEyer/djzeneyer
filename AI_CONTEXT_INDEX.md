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

## Baseline tecnico canonico (2026-03-06)
- Arquitetura: WordPress Headless (REST API) + React SPA
- Frontend: React 18 + TypeScript + Vite 7 + Tailwind 3 + React Query v5 + React Router 7 + i18next
- Backend: WordPress 6.0+ (recomendado 6.9+), PHP **8.1+** (zengame exige 8.1), WooCommerce, GamiPress
- Node: 20+
- Identidade Canonica: DJ Zen Eyer (Marcelo Eyer Fernandes), 2x World Champion Brazilian Zouk DJ. Birth Date: 1989-08-30.
- Infra: Hostinger VPS + LiteSpeed + Cloudflare + GitHub Actions

## Regras globais (SSOT)
1. Strings visiveis: sempre i18n (`t('chave')`) PT/EN
2. Data fetching no frontend: hooks centralizados em `src/hooks/useQueries.ts`
3. Nao usar `fetch()` diretamente em componentes de pagina; usar hooks React Query
4. Paginas lazy-loaded com `React.lazy()` + `Suspense`
5. SEO por pagina com `<HeadlessSEO />`
6. Filtragem pesada no backend (query params/endpoint agregador), frontend apenas renderiza
7. SQL sempre preparado e inputs sanitizados no PHP
8. Nao atualizar ESLint para v10 (manter v9)
9. Nao commitar `.env`, segredos ou credenciais
10. `UserContext.logout` e **sincrona**; nao usar `async/await` ao chama-la.
11. `ProfileUpdatePayload` (`useQueries.ts`) deve incluir campos customizados (`real_name`, `gender`, etc.) para sync com o plugin `zeneyer-auth`.

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
- Tailwind canonico do projeto: v3; nao aplicar convencoes exclusivas de v4 sem migracao explicita
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

## Checklist de atualizacao de contexto
- Atualizou versoes? sincronizar `AI_CONTEXT_INDEX.md`, `AGENTS.md`, `GEMINI.md`
- Mudou endpoint/namespace? sincronizar `docs/API.md` e skills relacionadas
- Mudou regra de arquitetura? sincronizar `CONTEXT.md` + skill `djzeneyer-context`


## Politica de Atualizacao de Contexto e Skills (Obrigatoria)
- Toda mudanca importante de comportamento, arquitetura, endpoint, contrato de API, fluxo de negocio, seguranca ou deploy DEVE atualizar a documentacao canonica no mesmo PR/commit.
- Ordem minima de atualizacao:
  1. Codigo real (fonte final)
  2. `AI_CONTEXT_INDEX.md` (se impacta regra global, baseline, endpoint ou fluxo)
  3. Documento tecnico especifico (`docs/ARCHITECTURE.md`, `docs/API.md`, `docs/CONFIGURATION.md`, etc.)
  4. Skill relacionada em `.agents/skills/*` quando instrucoes da skill ficarem desatualizadas
- Nao concluir tarefa estrutural sem sincronizar contexto.
- Se nao houver mudanca relevante de comportamento, registrar explicitamente que "nenhuma atualizacao de contexto foi necessaria".

## Regra operacional adicional (2026-03)
10. Build de frontend deve passar em `npm run perf:budget` para evitar regressao de bundle.
11. **CSP Strict Alignment**: Evitar JavaScript inline em tags (`onload`, `onclick`) e blocos `<script>` no `index.html` para permitir políticas de segurança sem `'unsafe-inline'`.
