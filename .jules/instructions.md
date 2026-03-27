# Instruções Operacionais para Jules — DJ Zen Eyer
# Última revisão: 2026-03-27

---

## ⛔ PAPEL DO JULES NESTE REPOSITÓRIO

**Jules cria PRs. Jules NÃO revisa PRs de outros.**

- Não adicione comentários de revisão em PRs que você não criou.
- Não aprove, solicite mudanças ou faça resumos de PRs de terceiros.
- A revisão de código é responsabilidade do CodeRabbit (configurado em `.coderabbit.yaml`).
- Seu papel: identificar melhorias, criar branches, implementar, abrir PR, aguardar revisão.

---

## 1. Idioma

Comunique-se, pense e documente **sempre em Português Brasileiro**.

---

## 2. Ordem de Precedência

Em caso de divergência, siga esta ordem:
1. Código real do repositório (`package.json`, `src/`, `plugins/`) — fonte final
2. `AI_CONTEXT_INDEX.md` — regras canônicas globais
3. `AGENTS.md` — regras operacionais
4. `.jules/context.md` — contexto arquitetural
5. `.jules/instructions.md` — este arquivo

---

## 3. Antes de criar qualquer PR

- Leia `.jules/context.md` completo.
- Leia `AI_CONTEXT_INDEX.md`.
- Verifique a stack real no `package.json` (nunca assuma versões de cabeça).
- Nunca crie PRs que mexam em mais de um domínio ao mesmo tempo (ex: frontend + PHP juntos). Separe em PRs focados.

---

## 4. Regras de Código Front-end (React/TypeScript)

**i18n — obrigatório:**
- Todo texto visível usa `t('chave')` via `useTranslation()`.
- Strings hardcoded em qualquer idioma são BUG.
- Ao adicionar nova chave, adicionar em AMBOS `src/locales/pt/translation.json` E `src/locales/en/translation.json`.

**Data fetching — centralizado:**
- Nunca usar `fetch()` diretamente em componentes.
- Toda query vai em `src/hooks/useQueries.ts` com React Query v5.
- Keys de query: usar `QUERY_KEYS` de `src/config/queryClient.ts`.

**Contextos — memoização obrigatória:**
- Valores de `Provider value={...}` sempre em `useMemo`.
- Funções expostas em `useCallback`.

**SEO:**
- Toda nova rota usa `<HeadlessSEO />` com parâmetros corretos.
- Rotas privadas (dashboard, my-account) usam `<HeadlessSEO noindex />` com OG image genérica — nunca avatar do usuário.

**Ícones de marca:**
- Facebook, Instagram, Youtube não existem no lucide-react 1.x.
- Usar `src/components/icons/BrandIcons.tsx` (FacebookIcon, InstagramIcon, YoutubeIcon).

**Guards de rota:**
- Usar `loadingInitial` (não `loading`) do UserContext para guards de rota privada.

---

## 5. Regras de Código Back-end (PHP/WordPress)

**Namespaces de API — obrigatório:**
- `djzeneyer/v1`, `zeneyer-auth/v1`, `zengame/v1`, `zen-bit/v2`, `zen-seo/v1`
- Nunca criar endpoint fora dos namespaces existentes sem justificativa.

**WooCommerce HPOS:**
- Nunca SQL direto em `wp_posts` para pedidos. Usar `wc_get_orders()`.

**GamiPress:**
- `gamipress_get_rank_types()` retorna array associativo. Sempre `array_values()` antes de `[0]`.

**Retornos PHP falsos:**
- `get_avatar_url()`, `get_the_post_thumbnail_url()` podem retornar `false`.
- Em JSON responses, coerção obrigatória: `$avatar = $result ?: ''`.

**Performance N+1:**
- Buscar thumbnails/metas dentro de loop: agrupar IDs e usar `_prime_post_caches()` + `update_meta_cache()`.
- Nunca usar `_embed` em endpoints de lista. Usar `register_rest_field()` para campos customizados enxutos.

**Segurança:**
- Todo `$request->get_param()` deve ser sanitizado/validado.
- Prepared statements obrigatórios em queries SQL.

---

## 6. Regras de Build / Deploy

- **Vite 8:** nunca `minify: 'esbuild'` — OXC é o padrão.
- **Prerender:** nunca remover `scripts/prerender.js`.
- **SSOT de rotas:** ao criar nova rota, atualizar `scripts/routes-config.json`.
- **fetch-depth no CI:** manter `2`, nunca `0`.
- **ESLint ignores:** `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules`, `.devcontainer` — nunca remover.

---

## 7. Proibições absolutas

- Nunca commitar `.env`, segredos ou credenciais.
- Nunca remover `.bolt`, `.devcontainer`, `.agents` — usados por outros agentes.
- Nunca remover lógica de renderização por slug em NewsPage/EventsPage — crítico para SEO.
- Nunca remover PWA (`site.webmanifest`, service workers).
- Nunca fazer "resumo executivo" de arquivos de contexto (`CLAUDE.md`, `AI_CONTEXT_INDEX.md`, etc.) — preservar todo conteúdo técnico.
- Nunca alterar ferramentas base (ESLint, Vite, TypeScript) sem aprovação explícita do mantenedor.
- Nunca criar PRs que misturem majors e patches de dependências — separar por categoria.
- Nunca adicionar `pnpm-lock.yaml` ou `plan.md` a PRs — o projeto usa npm.
- **Nunca criar ou modificar arquivos em `plugins/gamipress/`** — o GamiPress foi removido do repositório no commit f9556574 e é gerenciado como plugin WordPress instalado no servidor, fora do controle de versão. Qualquer tarefa que envolva GamiPress no repositório deve ser fechada como "obsoleta".
- **Nunca commitar arquivos de trabalho temporários**: `*.patch`, `*.orig`, `*.sh` de uso único, `update_*.sh` — esses são artefatos de trabalho, não código do projeto.

---

## 8. Quando criar PR vs quando não criar

**Criar PR:**
- Performance: memoização, lazy load, otimização de queries
- Refactor focado: um arquivo ou feature por vez
- Deps: bumps de patch/minor em lotes por categoria (devDeps separado de prodDeps)
- Novas features pedidas explicitamente em issues

**NÃO criar PR sem issue:**
- Mudanças em arquivos de contexto (`.claude/`, `AI_CONTEXT_INDEX.md`, `CLAUDE.md`)
- Mudanças em `deploy.yml` que alterem lógica de SSH ou secrets
- Bumps de versão major sem verificação de compatibilidade
- Qualquer coisa que toque em rotas de autenticação ou JWT
