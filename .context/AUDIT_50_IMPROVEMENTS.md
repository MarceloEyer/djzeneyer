# Auditoria: 50 Melhorias — djzeneyer

> **Status:** Rascunho para análise de IAs  
> **Gerado em:** 2026-06-07  
> **Escopo:** Repositório `MarceloEyer/djzeneyer` — PRs #692–#711 + estrutura geral do projeto

Este documento é um **roadmap estruturado** para agentes de IA e colaboradores. Cada item tem um diagnóstico, ação concreta e prioridade. Os itens estão agrupados por categoria e ordenados por impacto.

---

## Como usar este documento

Cada item abaixo pode ser executado como um PR isolado. Ao implementar:
1. Referencie o número do item (ex: `fix(A1): ...`)
2. Atualize o checkbox `[x]` neste arquivo no mesmo PR
3. Se o item exigir decisão do owner, abra uma issue antes do PR

---

## 🔴 Grupo A — Segurança (Crítico)

- [ ] **A1 · Merge PR #711** — Contém dois bugs de segurança ativos em produção: (1) `register_meta` com `auth_callback => __return_true` permite qualquer usuário alterar o meta `zen_login_streak`/`zen_last_login` de outro usuário via REST API; (2) `DJZ_CACHE_MENU` nunca foi definida, logo o menu nunca foi cacheado. **Ação:** Revisar o PR e fazer merge. Nenhuma mudança de código é necessária — o fix já está no PR.

- [ ] **A2 · Auditar todos os endpoints com `__return_true`** — O script `scripts/generate-api-inventory.mjs` (PR #711) já lista endpoints com `__return_true` na coluna de permissão. **Ação:** Rodar `node scripts/generate-api-inventory.mjs`, identificar cada ocorrência e substituir por `current_user_can('edit_user', $object_id)` ou `is_user_logged_in()` conforme o contexto de cada endpoint.

- [ ] **A3 · Adicionar alerta de falha de CI** — Os deploys falharam silenciosamente por horas (PR #703, PR #704). O servidor ficou com conteúdo desatualizado sem que ninguém percebesse. **Ação:** Em `.github/workflows/deploy-frontend.yml`, adicionar step final com `if: failure()` que envia notificação via webhook do Discord ou email (usando `actions/github-script` ou `dawidd6/action-send-mail`).

- [ ] **A4 · Verificar histórico do repositório por material de chave privada** — O PR #693 menciona que a chave Ed25519 privada foi exposta em um commit anterior e a branch foi reescrita. **Ação:** Rodar `git log --all --oneline | head -50` localmente e `git show <sha> --stat` nos commits suspeitos para confirmar que nenhum conteúdo da chave privada persiste no histórico acessível. Se houver, usar `git filter-repo --path .env --invert-paths`.

- [ ] **A5 · Adicionar rate limiting nos endpoints de agente** — Os endpoints `/wp-json/djzeneyer/v1/agent-registration` e `/wp-json/djzeneyer/v1/agent-claim` são públicos e não têm throttling visível. **Ação:** Adicionar em `inc/api.php` (ou no plugin separado) um check de transient do WordPress para limitar por IP: máximo de 10 requisições por minuto por endpoint. Alternativa via Cloudflare Rate Limiting Rules no dashboard.

- [ ] **A6 · Revisar CORS `Access-Control-Allow-Origin: *` no JWKS endpoint** — O PR #693 define wildcard CORS no `/.well-known/http-message-signatures-directory`. **Ação:** Documentar em `.context/CONFIGURATION.md` que essa decisão foi intencional (JWKS público por natureza) para evitar que uma IA futura tente "corrigir" isso sem contexto.

---

## 🟠 Grupo B — Arquitetura & Qualidade de Código (Alta Prioridade)

- [ ] **B1 · Merge PR #709 ou fechar** — O PR de padronização de `PageHeader` está aberto há mais de 24h em paralelo com o PR #711. Com ambos abertos há risco crescente de conflito. **Ação:** Fazer merge do PR #709 antes de mergear o #711, ou fechar e reabrir após o #711 ser mergeado.

- [ ] **B2 · Configurar branch protection no `main`** — Atualmente não há proteção: PRs são mergeados pelo próprio autor sem CI obrigatório. **Ação:** Em Settings → Branches → Add rule para `main`: habilitar "Require status checks to pass before merging" e selecionar os jobs de build/lint existentes.

- [ ] **B3 · Padronizar nomes de branches geradas por IA** — Branches como `claude/sleepy-pascal-qhb9d` e `claude/bold-ride-tOnnI` não comunicam propósito. **Ação:** Adicionar em `.context/ENGINEERING.md` (seção de workflow) a convenção: branches geradas por IA devem seguir o padrão `feat/`, `fix/`, `chore/` + slug descritivo. Configurar no prompt padrão do Claude Code.

- [ ] **B4 · Adicionar testes E2E para o fluxo de carrinho e checkout** — O PR #711 remove o `CartProvider` e migra para React Query. Uma regressão no checkout = perda direta de receita. **Ação:** Criar testes com Playwright ou Cypress cobrindo: adicionar item ao carrinho → visualizar carrinho → checkout → submeter pedido → confirmar `isPending` e estado de erro.

- [ ] **B5 · Quebrar `inc/api.php` em módulos** — Mesmo após o PR #711 reduzir de 889 para ~220 linhas, o arquivo ainda centraliza responsabilidades distintas. **Ação:** Criar `inc/menu.php`, `inc/subscribe.php`, `inc/register-meta.php` e usar `require_once` no `api.php` para manter a estrutura. Cada arquivo deve ter um cabeçalho PHPDoc com responsabilidade declarada.

- [ ] **B6 · Auditar overlaps entre `djzeneyer/v1` e `zeneyer-auth/v1`** — O PR #711 remove um endpoint duplicado. Podem existir outros. **Ação:** Rodar `node scripts/generate-api-inventory.mjs` após o merge do #711, exportar o resultado e comparar namespaces, identificando endpoints com funcionalidade equivalente entre `djzeneyer/v1` e `zeneyer-auth/v1`.

- [ ] **B7 · Isolar o plugin `zen-commerce` com ciclo de versão próprio** — O plugin PHP está misturado no mesmo repo que o frontend React/TypeScript. **Ação:** Criar `plugins/zen-commerce/CHANGELOG.md` e adicionar o campo `Version: 1.0.0` no cabeçalho do arquivo principal PHP (`plugins/zen-commerce/zen-commerce.php`). Isso permite rastrear a versão em produção via `wp plugin list`.

- [ ] **B8 · Implementar sistema de rastreamento de migrations** — Não há evidência de migrations para campos customizados ou tabelas do WooCommerce. **Ação:** Criar `plugins/zen-commerce/migrations/` com arquivos numerados (ex: `001-add-zen-login-streak.php`) e um runner que verifica a versão atual via `get_option('zen_db_version')` no `register_activation_hook`.

---

## 🟡 Grupo C — CI/CD & Workflow

- [ ] **C1 · Adicionar retry automático no step de SSH do Hostinger** — O PR #708 foi criado exclusivamente por causa de um SSH timeout transitório. **Ação:** No workflow de deploy, usar `appleboy/ssh-action` com `timeout` e `command_timeout` configurados, ou adicionar um step de retry com loop bash: `for i in 1 2 3; do rsync ... && break || sleep 15; done`.

- [ ] **C2 · Adicionar cache de `node_modules` no CI** — Cada deploy reinstala todas as dependências do zero. **Ação:** Adicionar em `deploy-frontend.yml` o step `actions/cache@v4` com `key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}` antes do `npm ci`. Reduz tempo de CI em 60-80%.

- [ ] **C3 · Fixar versão de Node.js no CI** — A versão de Node não está explícita nos workflows. **Ação:** Adicionar `node-version: '20'` no step `actions/setup-node` em todos os workflows. Criar `.nvmrc` na raiz com conteúdo `20` para uso local.

- [ ] **C4 · Criar job de validação de arquivos de configuração** — O Lighthouse estava auditando URL errada (PR #694) e o `.env.example` tinha `THEME_NAME` errado (PR #692). **Ação:** Adicionar job `validate-config` no CI que: (1) valida JSON dos arquivos `lighthouserc.json`, `tsconfig.json`, `vite.config.*`; (2) verifica se todas as chaves do `.env.example` têm descrição no `CONFIGURATION.md`.

- [ ] **C5 · Converter notificação do step de markdown de agentes** — Atualmente tem `continue-on-error: true` (PR #692), o que significa que falhas passam despercebidas. **Ação:** Manter o `continue-on-error: true` mas adicionar um step subsequente `if: steps.generate_markdown.outcome == 'failure'` que faz `echo "::warning::Agent markdown generation failed — llms.txt may be stale"` para aparecer como warning no resumo do workflow.

- [ ] **C6 · Adicionar `CONTRIBUTING.md`** — Não há guia de contribuição documentando o modelo de branching, setup local e secrets necessários. **Ação:** Criar `CONTRIBUTING.md` na raiz cobrindo: (1) requisitos de ambiente (Node 20, PHP 8.1+, WP local); (2) convenção de branches e commits; (3) lista de secrets necessários (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID`, `WEB_BOT_AUTH_PRIVATE_KEY_D`, etc.); (4) como rodar os scripts de verificação (`check-architecture-boundaries.mjs`, `check-dns-aid.mjs`).

- [ ] **C7 · Adicionar CHANGELOG automatizado** — Com 711+ PRs, rastrear o histórico manualmente é inviável. **Ação:** Adotar Conventional Commits (já parcialmente em uso nos títulos dos PRs) + instalar `semantic-release` ou `changesets`. Configurar para gerar `CHANGELOG.md` automaticamente a cada merge em `main`.

- [ ] **C8 · Adicionar labels em todos os PRs futuros** — Nenhum dos PRs analisados tem labels. **Ação:** Criar labels no repositório: `security`, `bug`, `feature`, `ci`, `documentation`, `refactor`, `performance`. Configurar `actions/labeler` com um `.github/labeler.yml` que aplica labels automaticamente baseado nos paths alterados.

---

## 🟡 Grupo D — SEO, AEO & Discoverabilidade

- [ ] **D1 · Criar script de validação local do `isitagentready.com`** — Múltiplos PRs (#699–#703) foram criados em loop tentando resolver o mesmo erro, sem validação local prévia. **Ação:** Criar `scripts/check-agent-ready.mjs` que simula localmente as verificações do checker: (1) fetch de `/auth.md` e verifica primeira linha; (2) fetch de `/.well-known/oauth-authorization-server` e verifica campos `agent_auth`; (3) verifica `Content-Type: application/json` nos endpoints `.well-known`.

- [ ] **D2 · Expandir ferramentas WebMCP** — O PR #705 expõe apenas 3 ferramentas (`get_agenda`, `get_bio`, `get_music_links`). Para um artista internacional, ferramentas adicionais aumentam a discoverabilidade por agentes de IA. **Ação:** Adicionar em `src/hooks/useWebMCP.ts`: `get_press_kit` (retorna PDF/link do press kit), `get_booking_info` (retorna contato para booking e mercados atendidos), `get_social_links` (lista todas as redes sociais com URLs).

- [ ] **D3 · Adicionar debug de registro WebMCP em desenvolvimento** — O hook `useWebMCP.ts` falha silenciosamente se `navigator.modelContext` não existir. **Ação:** Adicionar no hook: `if (import.meta.env.DEV) { console.log('[WebMCP] Tools registered:', toolNames) }` para confirmar o registro durante desenvolvimento.

- [ ] **D4 · Criar/atualizar `robots.txt` com diretivas para crawlers de IA** — O site está se posicionando como "agent-ready" mas pode não ter um `robots.txt` explícito para bots de IA. **Ação:** Verificar/criar `public/robots.txt` com seções para `User-agent: GPTBot`, `User-agent: ClaudeBot`, `User-agent: PerplexityBot` permitindo crawl. Adicionar referência ao `llms.txt` no arquivo.

- [ ] **D5 · Auditar e atualizar Schema.org / JSON-LD** — Para SEO de buscadores tradicionais (independente do WebMCP), as páginas precisam de dados estruturados. **Ação:** Verificar se as páginas exportam Schema.org dos tipos `MusicArtist` (homepage), `Event` (página de eventos), `Product` (página da loja). Usar o teste de dados estruturados do Google para validar: https://search.google.com/test/rich-results.

---

## 🟡 Grupo E — Frontend & UX

- [ ] **E1 · Completar migração para `PageHeader` em todas as páginas** — O PR #709 implementou o componente em apenas `AboutPage` e `EventsPage` como PoC. Sem completar a migração, o componente não entrega valor. **Ação:** Após merge do PR #709, criar um PR que migra todas as páginas restantes para usar `<PageHeader>`. Lista das páginas a migrar: verificar `src/pages/` no repo.

- [ ] **E2 · Auditar contraste dos breadcrumbs (`opacity-60`)** — A decisão de usar `opacity-60` no PR #709 pode gerar contraste insuficiente para WCAG AA (mínimo 4.5:1 para texto pequeno). **Ação:** Usar a ferramenta axe DevTools ou Lighthouse Accessibility na página e verificar o contraste real dos breadcrumbs. Se falhar, ajustar para `opacity-80` ou usar `--color-text-muted` em vez de opacity.

- [ ] **E3 · Criar sistema de loading/error states para React Query** — A migração do carrinho/checkout para React Query (PR #711) precisa de um sistema visual padronizado. Sem isso, cada novo `useMutation` terá seu próprio spinner ad-hoc. **Ação:** Criar `src/components/ui/QueryState.tsx` com componentes `<QueryLoading>`, `<QueryError>`, e `<QueryEmpty>` que consumam tokens de design do projeto.

- [ ] **E4 · Adicionar proteção contra múltiplos cliques no checkout** — O `isProcessing` local foi substituído por `submitOrder.isPending` (PR #711). **Ação:** Verificar que o botão de submit do checkout tem `disabled={submitOrder.isPending}` e um estado visual de loading. Testar clicando rapidamente múltiplas vezes para confirmar que apenas uma requisição é enviada.

- [ ] **E5 · Implementar i18n (PT/EN)** — Como DJ internacional com shows na Europa, o site provavelmente precisa de suporte a inglês. A estrutura `I18N_CONTENT_ARCHITECTURE.md` já existe em `.context/`. **Ação:** Verificar o documento `.context/I18N_CONTENT_ARCHITECTURE.md` para entender o plano atual e implementar com `react-i18next` + Vite. Começar pelas páginas de maior tráfego (home, events, music).

---

## 🟢 Grupo F — Documentação & Organização

- [ ] **F1 · Reduzir `ENGINEERING_PRINCIPLES.md` para 15 princípios ativos** — Um documento com 50 princípios tem alto risco de ficar desatualizado rapidamente em um projeto solo. **Ação:** Revisar o documento do PR #711, selecionar os 15 princípios mais importantes e mover os demais para uma seção `## Aspiracionais` no mesmo arquivo.

- [ ] **F2 · Adicionar descrições nos repositórios privados** — Repositórios privados sem descrição são difíceis de identificar ao revistar meses depois. **Ação:** Adicionar uma description em `jornada-zen-app` e `cintura70` via Settings → General.

- [ ] **F3 · Criar job de validação do `.env.example`** — O `.env.example` tinha `THEME_NAME` errado por muito tempo. **Ação:** Criar `scripts/validate-env-example.mjs` que verifica se todas as variáveis documentadas em `.context/CONFIGURATION.md` existem no `.env.example`. Adicionar ao CI como job `validate-config`.

- [ ] **F4 · Adicionar labels e milestones às issues abertas** — As 2 issues abertas no repositório não têm labels ou assignees. **Ação:** Aplicar labels às issues existentes e configurar GitHub Projects para rastrear o backlog.

- [ ] **F5 · Documentar política de TTL para PRs** — PRs como #709 ficam abertos em paralelo com PRs grandes (#711) sem critério claro de resolução. **Ação:** Adicionar em `CONTRIBUTING.md` (item C6): "PRs abertos por mais de 48h sem merge ou feedback devem receber um comentário de status ou ser fechados".

---

## 🔵 Grupo G — Performance & Escalabilidade

- [ ] **G1 · Reduzir TTL do cache de menu ou implementar invalidação** — O PR #711 define cache de 6h para o menu. Se o menu mudar, usuários veem conteúdo antigo por até 6 horas. **Ação:** Opção A — Reduzir para 30min. Opção B — Implementar `delete_transient('djz_menu_cache')` em um hook `wp_update_nav_menu` para invalidação automática quando o menu for atualizado no WP Admin.

- [ ] **G2 · Implementar paginação no endpoint de produtos** — O PR #711 menciona batch de thumbnails na query de produtos, mas sem paginação server-side uma loja com muitos produtos pode retornar responses muito grandes. **Ação:** Adicionar parâmetros `per_page` e `page` ao endpoint `/wp-json/djzeneyer/v1/products` em `class-rest-controller.php`.

- [ ] **G3 · Adicionar `semantic-release` com versão semântica** — O plugin `zen-commerce` não tem versão rastreada. **Ação:** Adicionar `Version: 1.0.0` no header PHP e criar `CHANGELOG.md` no diretório do plugin. Para o repo principal, configurar `semantic-release` ou tags manuais na convenção `vYYYY.MM.DD`.

- [ ] **G4 · Implementar error tracking (Sentry)** — Não há evidência de error tracking no frontend React. Erros em produção (especialmente no checkout) passam despercebidos. **Ação:** Integrar `@sentry/react` com o DSN do projeto. O free tier do Sentry suporta 5k erros/mês, suficiente para um projeto deste tamanho. Configurar `Sentry.init` em `src/main.tsx`.

- [ ] **G5 · Auditar e configurar pré-renderização de rotas** — O PR #692 menciona prerender como crítico, mas não está claro quais rotas são pré-renderizadas. **Ação:** Verificar `vite.config.ts` e `package.json` para identificar o plugin de prerender em uso. Garantir que todas as rotas estáticas (home, about, events, music, releases) estão listadas para pré-renderização.

- [ ] **G6 · Monitorar Core Web Vitals em produção** — O Lighthouse CI roda no deploy mas não há monitoramento contínuo com usuários reais. **Ação:** Configurar Google Search Console (gratuito) para monitorar CWV do site em produção. Complementar com o dashboard de Analytics do Cloudflare para Web Vitals.

- [ ] **G7 · Adicionar compressão Brotli nos assets do Vite** — O Hostinger suporta Brotli mas pode não estar sendo aproveitado. **Ação:** Adicionar `vite-plugin-compression` ao `vite.config.ts` para gerar `.gz` e `.br` dos assets estáticos. Verificar no `.htaccess` se `AddEncoding` está configurado para servir `.br` quando disponível.

---

## 🔵 Grupo H — Estratégico

- [ ] **H1 · Criar GitHub Profile README** — A conta `MarceloEyer` não tem um repositório `MarceloEyer/MarceloEyer` com README. Para um artista/desenvolvedor público, esse é o cartão de visita mais simples e impactante do GitHub. **Ação:** Criar repositório `MarceloEyer/MarceloEyer` com um `README.md` apresentando o trabalho como DJ Zen Eyer, links para `djzeneyer.com`, e os projetos públicos relevantes.

- [ ] **H2 · Publicar releases v1.0.0 nos plugins públicos** — `zeneyer-auth` e `zen-seo` são plugins públicos sem releases formais. **Ação:** Para cada repo, criar uma tag `v1.0.0` e uma GitHub Release com release notes descrevendo o propósito do plugin.

- [ ] **H3 · Adicionar `get_press_kit` e `get_booking_info` ao WebMCP** — (Relacionado a D2, mas estratégico.) Booking é a principal conversão de um DJ. **Ação:** A ferramenta `get_booking_info` deve retornar: mercados atendidos (BR, EU), contato de booking, rider técnico (link ou descrição), e languages do artista (PT, EN, ES).

---

## Resumo por Prioridade

| Grupo | Items | Prioridade | Impacto |
|-------|-------|-----------|--------|
| A — Segurança | A1–A6 | 🔴 Crítico | Vulnerabilidades ativas em produção |
| B — Arquitetura | B1–B8 | 🟠 Alta | Qualidade e manutenibilidade |
| C — CI/CD | C1–C8 | 🟡 Média | Confiabilidade do deploy |
| D — SEO/AEO | D1–D5 | 🟡 Média | Discoverabilidade |
| E — Frontend | E1–E5 | 🟡 Média | Experiência do usuário |
| F — Docs | F1–F5 | 🟢 Baixa | Organização |
| G — Performance | G1–G7 | 🔵 Técnico | Escalabilidade |
| H — Estratégico | H1–H3 | 🔵 Estratégico | Posicionamento do artista |

**Total: 50 itens rastreáveis**

---

## Notas para agentes de IA

- Antes de implementar qualquer item, leia `.context/ENGINEERING.md` e `.context/ARCHITECTURE.md`
- Respeite os princípios do `ENGINEERING_PRINCIPLES.md` (PR #711): boundary checks, SSOT, React Query como única fonte de verdade do carrinho
- Itens do Grupo A são os únicos que **não precisam de aprovação** antes de serem implementados — são correções de segurança já aprovadas pelo owner
- Para itens que alteram comportamento de produção (G1, G2, B4), abra uma issue para discussão antes de criar o PR
- Ao completar um item, marque o checkbox `[x]` e adicione uma referência ao PR no mesmo commit
