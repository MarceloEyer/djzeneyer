# AGENTS.md — DJ Zen Eyer
# Instruções operacionais para agentes de IA neste repositório.
# Lido por: OpenAI Codex, e qualquer agente sem arquivo de contexto dedicado.
# Idioma padrão: Português Brasileiro.
# Última revisão: 2026-04-26

---

## Precedência (em caso de conflito)

> A hierarquia canônica está definida em `AI_CONTEXT_INDEX.md § Ordem de precedência`.
> Resumo: código real > AI_CONTEXT_INDEX.md > AGENTS.md > docs/ > skills.

---

## Onboarding: leia antes de qualquer tarefa

1. `AI_CONTEXT_INDEX.md` — regras globais, stack canônica, endpoints, bugs conhecidos
2. Este arquivo (`AGENTS.md`) — regras operacionais e checklists
3. Skill `djzeneyer-context` em `.agents/skills/djzeneyer-context/` — contexto completo do projeto
4. Para tarefas de WP/PHP: skill `wp-project-triage` antes de mudanças estruturais
5. Para tarefas de SEO: skill `seo-audit` antes de criar/modificar rotas públicas

---

## Projeto

Site/plataforma oficial do DJ Zen Eyer (Marcelo Eyer Fernandes) — Bicampeão Mundial de Brazilian Zouk.
Arquitetura: WordPress Headless + React SPA com estética MMORPG premium.
Produção: https://djzeneyer.com

---

## Stack canônica (verificar package.json antes de assumir versões)

| Camada | Tecnologia |
|---|---|
| Frontend | React **19** + TypeScript **6** strict + Vite **8** + Tailwind **4** |
| State/Fetch | React Query **v5** (`@tanstack/react-query`) |
| Roteamento | React Router **7** + i18next (EN `/` e PT `/pt`) |
| Backend | WordPress 6.9+, PHP **8.3**, WooCommerce 10.5+ (HPOS ativo), GamiPress |
| Infra | Hostinger VPS + LiteSpeed + Cloudflare + GitHub Actions |
| Node | 20+ |

**Plugins customizados ativos:**
- `zeneyer-auth` → JWT + Google OAuth (`zeneyer-auth/v1`)
- `zen-seo-lite` → SEO headless dinâmico (`zen-seo/v1`)
- `zen-bit` → Eventos + Bandsintown (`zen-bit/v2`)
- `zengame` → Gamificação, leaderboard, XP (`zengame/v1`)

**Plugins WordPress de terceiros ativos:**
- **GamiPress** → Motor de gamificação (pontos, ranks, conquistas)
- **WooCommerce 10.5+** → E-commerce (HPOS ativo — nunca SQL em wp_posts)
- **PagBank Connect** → Gateway de pagamento brasileiro (ex-PagSeguro) para WooCommerce
- **Polylang** → Tradução de conteúdo WP (posts, páginas). A query `?lang=pt` é roteada pelo Polylang no backend. O frontend usa i18next para strings de UI — são sistemas separados.
- **MailPoet** → Email marketing e newsletters. O endpoint `djzeneyer/v1/subscribe` integra com MailPoet.
- **LiteSpeed Cache** → Cache server-side. Limpo no CI via SSH após deploy.

---

## Regras operacionais

### i18n (obrigatório)
- Todo texto visível usa `t('chave')` via `useTranslation()` de react-i18next.
- Strings hardcoded em qualquer idioma são BUG.
- Ao adicionar nova chave: adicionar em AMBOS `src/locales/pt/translation.json` E `src/locales/en/translation.json`.
- Arquivos de locale devem ser UTF-8 limpo — nunca mojibake (`Ã`, `â`, `ðŸ`, `Â©`).

### Data fetching (obrigatório)
- Nunca usar `fetch()` diretamente em componentes.
- Todo data fetching via hooks em `src/hooks/useQueries.ts` (React Query v5).
- Keys de query via `QUERY_KEYS` em `src/config/queryClient.ts`.

### SEO
- Toda nova rota usa `<HeadlessSEO />` com parâmetros corretos.
- Rotas privadas (`dashboard`, `my-account`) usam `<HeadlessSEO noindex />` com OG image genérica.
- Avatar do usuário nunca deve aparecer em OG tags.
- Ao criar nova rota pública: atualizar `scripts/routes-data.json` (SSOT de rotas).

### Performance
- Páginas: lazy loading via `React.lazy()` + `Suspense`.
- Contextos: valores de Provider sempre em `useMemo`. Funções em `useCallback`.
- PHP: evitar N+1 queries — usar `_prime_post_caches()` e `update_meta_cache()` para batch.
- Nunca usar `_embed` em endpoints de lista WP REST API.

### PHP / WordPress
- WooCommerce HPOS ativo: nunca SQL em `wp_posts` para pedidos → usar `wc_get_orders()`.
- `gamipress_get_rank_types()` retorna array associativo → sempre `array_values()` antes de `[0]`.
- `get_avatar_url()` e `get_the_post_thumbnail_url()` podem retornar `false` → coerção: `$val ?: ''`.
- Todo `get_param()` deve ser sanitizado. Queries SQL com prepared statements.

### Armadilhas conhecidas (ler antes de qualquer fix)
- **`safeUrl(null)`** retorna `'#'` (truthy) → `safeUrl(url) || fallback` NUNCA executa. Sempre: `safeUrl(url, '/fallback.svg')`.
- **`loadingInitial` vs `loading`** no UserContext: usar `loadingInitial` em guards de rota privada — `loading` é para ações, default `false`, e causa tela branca no CTRL+F5.
- **lucide-react 1.x**: ícones Facebook, Instagram, Youtube foram removidos → usar `src/components/icons/BrandIcons.tsx`.
- **Vite base path**: assets em `public/` raiz NÃO chegam ao webroot em produção. Usar `public/images/` para assets que precisam ficar na raiz.
- **Class components**: não podem usar `useTranslation()` → usar `withTranslation()` HOC.
- **Zod v4 + PHP false returns**: `z.union([z.string(), z.literal(false)])` quebra em `null`/`undefined`. Padrão correto: `z.string().catch('')` (campos obrigatórios) ou `z.string().catch('').optional()` (campos opcionais). Nunca usar o padrão union+literal para campos de imagem/URL.
- **`rankProgress` ZenGame**: o fallback de progresso por posição de rank retornava `0.0` nos dois lados do ternário — corrigido. Ao alterar lógica de rank, sempre testar o caminho sem `gamipress_get_rank_requirements_progress()`.
- **URL canônica em páginas**: nunca hardcodar paths como `/about` — usar `getLocalizedRoute('about', currentLang)` para garantir o slug correto (`/about-dj-zen-eyer` em EN, `/pt/sobre-dj-zen-eyer` em PT).
- **robots.txt AhrefsBot**: `Disallow: /` seguido de `Allow: /` no mesmo bloco — a primeira regra vence (RFC 9309). Sempre colocar `Allow: /` antes dos `Disallow` específicos.
- **Sitemap**: rotas de checkout/privadas devem ter `excludeFromSitemap: true` em `scripts/routes-data.json`. O `generate-sitemap.js` lê esse campo — não editar o XML manualmente.
- **llms-full.txt**: arquivo deve ser UTF-8 limpo. Double-encoding (latin-1 re-encodado como UTF-8) produz mojibake silencioso — validar com `python3 -c "open('public/llms-full.txt').read()"` após edições.
- **MusicEvent Schema.org — campos OBRIGATÓRIOS** (Google Search Console rejeita eventos sem eles):
  Toda vez que criar ou editar schema MusicEvent — em `HeadlessSEO.tsx`, em `build_event_schema()` (PHP) ou em qualquer outro lugar — os campos abaixo devem estar presentes. Usar fallback, nunca omitir:

  | Campo | Regra |
  |---|---|
  | `eventStatus` | Sempre `EventScheduled` — INCLUSIVE em eventos passados. Só mudar para `EventCancelled`/`EventPostponed` se a API retornar dado explícito. |
  | `endDate` | Obrigatório. Fallback: `startDate` + 4 horas. |
  | `location.address` | `PostalAddress` com sub-campos preenchidos. **Nunca emitir string vazia** — omitir sub-campo se vazio. Não usar nome do venue como `streetAddress`. |
  | `description` | Obrigatório. Fallback: `"Live Brazilian Zouk DJ set by DJ Zen Eyer at {venue}."` |
  | `image` | Obrigatório. Fallback: OG image padrão do site (`/og-image.jpg`). |
  | `offers` | Obrigatório. Fallback: `Offer` com `url = canonical_url`, `availability = InStock` (futuro) ou `Discontinued` (passado). |
  | `performer` | Sempre presente — entidade `MusicGroup` DJ Zen Eyer. |

  Arquivos que implementam essa lógica:
  - **React**: `src/components/HeadlessSEO.tsx` — bloco `musicEvents.push()`
  - **PHP**: `plugins/zen-bit/includes/class-zen-bit-normalizer.php` — `build_event_schema()`

### Build e Deploy
- Minificador: OXC (padrão Vite 8) — nunca `minify: 'esbuild'`.
- Prerender: `scripts/prerender.js` via Puppeteer — nunca remover.
- ESLint ignores obrigatórios: `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules`, `.devcontainer`.
- `fetch-depth: 2` no CI — nunca `0`.

---

## Regras de design e UX

- **Estética:** Premium contemporâneo + imersão MMORPG.
- **Paleta:** Azul elétrico para destaques + tema escuro profundo.
- **Referência de qualidade:** páginas Zen Tribe e Dashboard.
- **PROIBIDO:** gradiente chamativo em títulos principais, layouts estilo "template genérico".

---

## Proibições absolutas

- ❌ Commitar `.env`, segredos ou credenciais.
- ❌ Deletar `.bolt`, `.devcontainer`, `.agents`, `.jules`, `.gemini` — usados por outros agentes.
- ❌ Remover lógica de renderização por slug em NewsPage/EventsPage — crítico para SEO.
- ❌ Remover PWA (`site.webmanifest`, service workers).
- ❌ Fazer "resumo executivo" de arquivos de contexto (`CLAUDE.md`, `AI_CONTEXT_INDEX.md`, `AGENTS.md`, etc.) — preservar todo conteúdo técnico.
- ❌ Alterar ferramentas base (ESLint, TypeScript major, Vite major) sem aprovação explícita.
- ❌ `pnpm-lock.yaml` ou `plan.md` em PRs — o projeto usa npm.
- ❌ SQL direto em `wp_posts` para pedidos WooCommerce.
- ❌ Reintroduzir music player embutido sem decisão explícita.

---

## Governança de contexto

Mudanças relevantes de arquitetura, API, fluxo, SEO estrutural, segurança ou deploy
**devem atualizar os arquivos de contexto no mesmo trabalho**.
Se não exigir atualização, registrar explicitamente que nenhuma foi necessária.

---

## Verificação local obrigatória antes de PR

```bash
npm run lint    # Zero erros (warnings são aceitáveis)
npm run build   # Build completo com prerender deve passar
```

> Nota: este projeto não possui suite de testes automatizados (Vitest/Playwright/PHPUnit).
> Validação é feita via lint + build + inspeção manual. Não inventar comandos de teste que não existem.

---

## Skills disponíveis em `.agents/skills/`

Todas as skills estão em `.agents/skills/` (28 skills). Todas têm um arquivo `SKILL.md`.

### Skills de contexto e governança (ler primeiro)

| Skill | Quando usar |
|---|---|
| `djzeneyer-context` | **Qualquer tarefa** neste repositório — ler **sempre** primeiro |
| `dream-project` | Após sessão de trabalho relevante — consolidar contexto |

### Skills de WordPress / PHP

| Skill | Quando usar |
|---|---|
| `wp-project-triage` | Antes de **qualquer** mudança estrutural em WP (plugins, hooks, endpoints) |
| `wp-rest-api` | Ao criar ou modificar endpoints REST |
| `wp-plugin-development` | Ao criar ou modificar plugins WordPress customizados |
| `wp-headless` | Ao trabalhar com REST API WordPress como headless CMS |
| `wp-performance` | Ao otimizar queries PHP, N+1 queries, cache WordPress |
| `wp-wpcli-and-ops` | Operações via WP-CLI, deploy, manutenção de servidor |
| `wp-phpstan` | Ao fazer análise estática PHP com PHPStan |
| `wp-interactivity-api` | ⚠️ N/A neste projeto (usa React SPA, não WP Interactivity API) |
| `wordpress-router` | Ao configurar rotas WordPress headless |

### Skills de React / Frontend

| Skill | Quando usar |
|---|---|
| `react-best-practices` | Ao escrever/revisar React — **ignorar categorias `server-`** (Next.js only) |
| `react-patterns` | Ao criar componentes com hooks, composition, memoização |
| `tailwind-patterns` | Ao escrever CSS com Tailwind v4 (CSS-first config) |
| `typescript-pro` | Ao resolver tipagem complexa, generics, strict TypeScript |
| `clean-code` | Ao revisar ou refatorar qualquer código |
| `web-quality-skills` | Ao revisar qualidade geral do frontend (acessibilidade, performance) |
| `auth-implementation-patterns` | Ao implementar fluxos JWT / Google OAuth |

### Skills de segurança

| Skill | Quando usar |
|---|---|
| `codeql-security` | Ao escrever sanitização PHP, escaping, prepared statements |
| `backend-security-coder` | Ao implementar endpoints com inputs externos no PHP |

### Skills de SEO

| Skill | Quando usar |
|---|---|
| `seo-audit` | Ao criar ou modificar **qualquer** rota pública |
| `schema-markup` | Ao configurar JSON-LD / Schema.org em páginas |
| `seo-authority-builder` | Ao criar conteúdo para autoridade SEO de longo prazo |
| `seo-meta-optimizer` | Ao otimizar meta tags, títulos, descriptions, OG |

### Skills de conteúdo e marketing (sempre usar em par)

| Skill | Quando usar |
|---|---|
| `zen-content-voice` | Ao criar **qualquer** copy, post, social ou email para DJ Zen Eyer |
| `content-strategy` | Ao planejar calendário de conteúdo, clusters de tópicos |
| `copywriting` | Ao criar copy de landing pages, emails, CTAs |
| `social-content` | Ao criar posts, reels, threads para Instagram/TikTok/YouTube |

---

## Checklist: nova rota pública

1. Adicionar entrada em `scripts/routes-data.json` com `excludeFromSitemap: false`
2. Criar chaves i18n em `src/locales/pt/translation.json` **e** `src/locales/en/translation.json`
3. Adicionar `<HeadlessSEO />` com `title`, `description`, `url` e `schema` corretos
4. Usar `React.lazy()` + `Suspense` para a página (lazy loading obrigatório)
5. Usar `getLocalizedRoute('slug', lang)` para URLs — nunca hardcodar paths
6. Verificar que o hreflang no sitemap gerado está correto

---

## Git workflow

- **Branches:** `feat/`, `fix/`, `hotfix/`, `docs/`, `chore/`
- **Commits:** mensagem no imperativo em PT-BR (`Adiciona`, `Corrige`, `Remove`, `Atualiza`)
- **PRs:** usar template em `.github/pull_request_template.md`; um domínio por PR (frontend OU PHP, nunca misturar)
- **Nunca commitar diretamente em `main`** — usar branch + PR + revisão

---

## Polylang vs i18next

São sistemas completamente separados e não se comunicam:

| Sistema | Gerencia | Como usar |
|---|---|---|
| **Polylang** | Conteúdo WordPress (posts, produtos, páginas) | Passar `?lang=pt` na query REST para obter conteúdo traduzido |
| **i18next** | Strings de UI do React | `t('chave')` via `useTranslation()` |

Nunca misturar: não passar chaves i18next para a API WP, e não exibir conteúdo WP sem passar pelo Polylang.

---

## Ambiente local

```bash
cp .env.example .env      # configurar VITE_API_URL e outras variáveis
npm install               # instalar dependências
npm run dev               # frontend em http://localhost:5173
# Backend: WordPress em servidor externo (configurar VITE_API_URL no .env)
npm run lint              # validar código
npm run build             # build + prerender (obrigatório antes de push)
```
