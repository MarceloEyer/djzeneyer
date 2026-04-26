# AGENTS-IMPROVEMENT-SPEC.md

> Auditoria e especificação de melhorias para os arquivos de contexto de agentes de IA do projeto djzeneyer.com.
> Idioma: Português Brasileiro.
> Data: 2026-04-26.

---

## 1. O que está bom

### AGENTS.md
- **Stack canônica completa e atualizada**: tabela clara com versões exatas (React 19, Vite 8, WP 6.9+, PHP 8.3, WooCommerce 10.5+, MariaDB 11.8.6).
- **Armadilhas conhecidas documentadas**: seção "Armadilhas conhecidas" cobre bugs reais já corrigidos (`safeUrl`, `loadingInitial`, `lucide-react 1.x`, `Zod v4`, `rankProgress`). Isso evita regressões.
- **Proibições absolutas explícitas**: lista clara de ações destrutivas proibidas (deletar `.bolt`, SQL em `wp_posts`, reintroduzir music player, etc.).
- **Regras de i18n e data fetching**: obrigatoriedade de `t('chave')` e `useQueries.ts` como SSOT estão bem definidas.
- **Hierarquia de precedência**: ordem de 5 níveis (código > AI_CONTEXT_INDEX > AGENTS > docs > skills) está clara.
- **Governança de contexto**: política de atualizar docs no mesmo PR está presente.

### Skills em `.agents/skills/`
- **Cobertura ampla**: 26 skills cobrindo frontend (React, TypeScript, Tailwind), backend (WP, PHP, REST API, WP-CLI), SEO, segurança (CodeQL), conteúdo e gamificação.
- **`djzeneyer-context`**: skill mestre com triggers bem definidos e regras de ouro consolidadas — o melhor ativo do sistema.
- **`dream-project`**: skill de consolidação de contexto pós-sessão é uma prática madura e rara.
- **`wp-project-triage`**: skill de inspeção determinística do repositório WP com saída JSON estruturada.
- **`codeql-security`** (em `.agent/skills/`): documenta padrões CodeQL específicos do projeto com exemplos de código correto/incorreto.

### AI_CONTEXT_INDEX.md
- Fonte canônica bem estruturada com seções de safeguards, baseline técnico, endpoints, decisões de consolidação e contratos ZenGame.
- Histórico de bugs corrigidos com commits referenciados — excelente para evitar regressões.

---

## 2. O que está faltando

### 2.1 AGENTS.md não referencia skills disponíveis
O arquivo não menciona que existem 26+ skills em `.agents/skills/`. Um agente novo lendo apenas `AGENTS.md` não sabe que deve consultar as skills antes de executar tarefas de WP, SEO ou React.

**Correção:** Adicionar seção "Skills disponíveis" com lista e quando usar cada uma.

### 2.2 Ausência de fluxo de onboarding para agentes novos
Não há uma sequência explícita de "leia estes arquivos nesta ordem antes de qualquer tarefa". O `AI_CONTEXT_INDEX.md` tem um "Fluxo para qualquer tarefa" mas o `AGENTS.md` não replica nem referencia isso.

**Correção:** Adicionar seção "Onboarding de agente" com checklist de leitura obrigatória.

### 2.3 Sem documentação de ambiente de desenvolvimento local
Nenhum dos arquivos de contexto descreve como iniciar o ambiente local (comandos, portas, variáveis de ambiente necessárias). Um agente que precisa rodar `npm run dev` ou testar um plugin PHP não tem orientação.

**Correção:** Adicionar seção "Ambiente local" com comandos de setup, portas e variáveis de `.env.example`.

### 2.4 Sem política de testes
Não há menção a como testar mudanças antes de commitar — nem frontend (Vitest? Playwright?) nem backend (PHPUnit?). O `docs/AI_GOVERNANCE.md` menciona `npm run lint` e `npm run build` mas não testes unitários ou de integração.

**Correção:** Documentar se há testes, onde ficam e como rodar. Se não há, registrar explicitamente que o projeto não tem suite de testes automatizados (para que agentes não inventem comandos inexistentes).

### 2.5 Sem guia de criação de nova rota
O projeto tem regras de SEO, i18n e lazy loading para rotas, mas não há um checklist passo-a-passo de "como adicionar uma nova página". Um agente que cria uma rota pode esquecer de: adicionar em `routes-data.json`, criar chaves i18n em PT e EN, adicionar `<HeadlessSEO />`, configurar `excludeFromSitemap`.

**Correção:** Adicionar checklist de nova rota em `AGENTS.md` ou criar skill `new-route`.

### 2.6 Skill `djzeneyer-context` desatualizada em versões de plugins
A skill `djzeneyer-context` (versão 1.2.1) menciona WooCommerce 10.5+ mas o `CLAUDE.md` já registra WooCommerce 10.6.1. Pequena divergência que pode confundir agentes.

**Correção:** Bumpar versão da skill e sincronizar versões de plugins com `CLAUDE.md`.

### 2.7 Sem documentação de WooCommerce/PagBank
O `AGENTS.md` lista PagBank Connect como plugin ativo mas não há nenhuma regra operacional sobre como interagir com ele (endpoints, webhooks, fluxo de checkout). Um agente que toca em e-commerce não tem orientação.

**Correção:** Adicionar seção ou skill `woocommerce-pagbank` com regras de integração.

### 2.8 Sem política de branch e PR
Não há documentação de convenção de branches (feature/, fix/, hotfix/), mensagens de commit ou template de PR além do que está em `.github/pull_request_template.md`. Agentes que criam PRs não sabem o padrão esperado.

**Correção:** Adicionar seção "Git workflow" em `AGENTS.md`.

### 2.9 Skills de conteúdo/marketing sem contexto do projeto
As skills `content-strategy`, `social-content`, `copywriting` e `seo-authority-builder` são genéricas (source: community) e não têm nenhuma referência à identidade do DJ Zen Eyer, ao conceito de Cremosidade, ao público-alvo (dançarinos de Zouk) ou ao tom de voz do projeto. Um agente que usa essas skills produz conteúdo genérico.

**Correção:** Criar skill `zen-content-voice` com identidade de marca, tom de voz, conceitos-chave (Cremosidade, Zouk Brasileiro) e exemplos de copy aprovados.

### 2.10 Sem documentação de Polylang para agentes
O `CLAUDE.md` tem uma seção detalhada sobre Polylang mas o `AGENTS.md` menciona apenas superficialmente. Agentes que trabalham com conteúdo WP podem não entender a separação entre Polylang (conteúdo) e i18next (UI).

**Correção:** Adicionar subseção "Polylang vs i18next" em `AGENTS.md` com exemplos claros.

---

## 3. O que está errado

### 3.1 Hierarquia de precedência inconsistente entre arquivos
- `AI_CONTEXT_INDEX.md` coloca `docs/AI_GOVERNANCE.md` em 4º lugar.
- `docs/AI_GOVERNANCE.md` coloca a si mesmo em 4º lugar mas lista `AGENTS.md` em 3º.
- `AGENTS.md` coloca `AI_CONTEXT_INDEX.md` em 2º e `docs/` em 4º.
- `CLAUDE.md` tem hierarquia diferente dos outros três.

Quatro arquivos, quatro hierarquias ligeiramente diferentes. Um agente em conflito não sabe qual seguir.

**Correção:** Definir UMA hierarquia canônica em `AI_CONTEXT_INDEX.md` e fazer todos os outros arquivos apenas referenciar ela, sem redefinir.

### 3.2 `AGENTS.md` duplica conteúdo de `AI_CONTEXT_INDEX.md`
Seções inteiras de armadilhas, regras de GamiPress, SEO e cache estão em ambos os arquivos com texto quase idêntico. Isso cria risco de divergência quando um é atualizado e o outro não.

**Correção:** `AGENTS.md` deve conter apenas regras operacionais (o "como fazer"). Detalhes técnicos de contratos de API, bugs corrigidos e cache devem viver exclusivamente em `AI_CONTEXT_INDEX.md`, com referência cruzada.

### 3.3 Skill `react-best-practices` é genérica para Next.js/Vercel
A skill menciona "Next.js pages" e "Vercel Engineering" mas o projeto usa Vite 8 + React Router 7, não Next.js. Regras como `server-` prefix e `async-defer-await` para Server Components não se aplicam. Um agente que segue essa skill cegamente pode introduzir padrões incompatíveis.

**Correção:** Adicionar nota de escopo no topo da skill: "Este projeto usa Vite 8 + React Router 7. Ignorar regras específicas de Next.js/Server Components."

### 3.4 `WP_DEBUG: true` em produção documentado mas sem prazo de correção
O `CLAUDE.md` documenta que `WP_DEBUG: true` está ativo em produção e descreve o fix necessário no `wp-config.php`. Mas não há nenhum issue, task ou prazo associado. Isso significa que o bug crítico (erros PHP vazando como HTML na API REST) pode permanecer indefinidamente.

**Correção:** Criar issue no GitHub rastreando essa correção e referenciar o número do issue em `CLAUDE.md`.

### 3.5 `MASTERPLAN_DOMINACAO.md` na raiz do repositório
Arquivo de estratégia de marketing está na raiz do repositório junto com arquivos de configuração técnica. Isso polui o contexto de agentes técnicos que leem a raiz e pode confundir sobre o escopo do projeto.

**Correção:** Mover para `docs/marketing/MASTERPLAN_DOMINACAO.md` ou para um diretório dedicado.

### 3.6 Arquivos temporários/de trabalho na raiz
Arquivos como `PressKitPage_beautiful.tsx`, `check_client_error.mjs`, `comments_200.txt`, `pr_comments.json`, `pr_comments_utf8.json`, `en_old.json`, `pt_old.json`, `footer.php`, `functions.php`, `header.php`, `index.php` estão na raiz do repositório. Alguns parecem ser backups ou artefatos de trabalho, não parte da estrutura do projeto.

**Correção:** Auditar e mover/remover arquivos que não pertencem à raiz. Adicionar ao `.gitignore` padrões para arquivos temporários de trabalho.

### 3.7 Dois diretórios de skills (`.agents/skills/` e `.agent/skills/`)
Existe `.agents/skills/` (26 skills) e `.agent/skills/` (1 skill: codeql-security). A inconsistência de nomenclatura (`.agents` vs `.agent`) pode fazer agentes que procuram skills em apenas um dos diretórios perderem a skill de segurança.

**Correção:** Consolidar em `.agents/skills/` e mover `codeql-security` para lá. Atualizar referências.

---

## 4. Especificação de melhorias concretas

### Prioridade Alta (impacto imediato em qualidade de agentes)

#### M1 — Hierarquia canônica única
**Arquivo:** `AI_CONTEXT_INDEX.md`
**Ação:** Definir a hierarquia de precedência uma única vez, com numeração explícita. Todos os outros arquivos (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `docs/AI_GOVERNANCE.md`) devem remover suas próprias definições de hierarquia e substituir por: `> Hierarquia de precedência: ver AI_CONTEXT_INDEX.md § Ordem de precedência.`

#### M2 — Seção de skills em AGENTS.md
**Arquivo:** `AGENTS.md`
**Ação:** Adicionar seção `## Skills disponíveis` com tabela:

| Skill | Quando usar |
|---|---|
| `djzeneyer-context` | Qualquer tarefa neste repositório |
| `dream-project` | Após sessão de trabalho relevante |
| `wp-project-triage` | Antes de mudanças estruturais em WP |
| `wp-rest-api` | Ao criar/modificar endpoints REST |
| `react-best-practices` | Ao escrever componentes React (ignorar regras Next.js) |
| `codeql-security` | Ao escrever sanitização PHP ou escaping |
| `seo-audit` | Ao criar/modificar rotas públicas |
| `content-strategy` | Ao planejar conteúdo de blog/news |

#### M3 — Checklist de nova rota
**Arquivo:** `AGENTS.md`
**Ação:** Adicionar seção `## Checklist: nova rota pública`:
1. Adicionar entrada em `scripts/routes-data.json` com `excludeFromSitemap: false`
2. Criar chaves i18n em `src/locales/pt/translation.json` E `src/locales/en/translation.json`
3. Adicionar `<HeadlessSEO />` com parâmetros corretos
4. Usar `React.lazy()` + `Suspense` para a página
5. Usar `getLocalizedRoute()` para URLs canônicas — nunca hardcodar paths
6. Verificar hreflang no sitemap gerado

#### M4 — Skill `zen-content-voice`
**Arquivo:** `.agents/skills/zen-content-voice/SKILL.md` (novo)
**Ação:** Criar skill com:
- Identidade: DJ Zen Eyer, Bicampeão Mundial de Brazilian Zouk, Membro Mensa
- Conceito central: Cremosidade (conexão emocional profunda, não apenas técnica)
- Tom de voz: "Amigo Zen" — humilde, generoso, profissional, nunca arrogante
- Público-alvo: dançarinos de Zouk (iniciantes a avançados), organizadores de festivais, DJs
- Proibido: linguagem de "guru", promessas vazias, gradientes em headlines
- Exemplos de copy aprovados (extraídos do site atual)

#### M5 — Consolidar diretórios de skills
**Ação:** `mv .agent/skills/codeql-security .agents/skills/codeql-security` e remover `.agent/skills/` vazio. Atualizar referências em `AGENTS.md` e `AI_CONTEXT_INDEX.md`.

#### M6 — Documentar ausência de testes automatizados
**Arquivo:** `AGENTS.md`
**Ação:** Adicionar em "Verificação local obrigatória":
```
# Nota: este projeto não possui suite de testes automatizados (Vitest/PHPUnit).
# Validação é feita via lint + build + inspeção manual.
# Não inventar comandos de teste que não existem.
```

### Prioridade Média

#### M7 — Git workflow
**Arquivo:** `AGENTS.md`
**Ação:** Adicionar seção `## Git workflow`:
- Branches: `feat/`, `fix/`, `hotfix/`, `docs/`
- Commits: imperativo em PT (`Adiciona`, `Corrige`, `Remove`, `Atualiza`)
- PRs: usar template em `.github/pull_request_template.md`
- Nunca commitar em `main` diretamente

#### M8 — Ambiente local
**Arquivo:** `AGENTS.md`
**Ação:** Adicionar seção `## Ambiente local`:
```bash
cp .env.example .env   # configurar variáveis
npm install
npm run dev            # frontend em localhost:5173
# Backend: WordPress em servidor externo (ver .env para VITE_API_URL)
```

#### M9 — Nota de escopo em `react-best-practices`
**Arquivo:** `.agents/skills/react-best-practices/SKILL.md`
**Ação:** Adicionar no topo após o frontmatter:
```
> ⚠️ ESCOPO: Este projeto usa Vite 8 + React Router 7, não Next.js.
> Ignorar todas as regras prefixadas com `server-` e referências a Server Components, App Router ou Vercel Edge.
```

#### M10 — Mover arquivos de marketing para `docs/`
**Ação:** `mv MASTERPLAN_DOMINACAO.md docs/marketing/` e criar `docs/marketing/` se não existir. Atualizar referências.

### Prioridade Baixa

#### M11 — Bumpar versão da skill `djzeneyer-context`
**Arquivo:** `.agents/skills/djzeneyer-context/SKILL.md`
**Ação:** Atualizar `version: '1.2.2'` e sincronizar versão do WooCommerce para `10.6.1`.

#### M12 — Auditoria de arquivos na raiz
**Ação:** Revisar e mover/remover: `PressKitPage_beautiful.tsx`, `check_client_error.mjs`, `comments_200.txt`, `pr_comments.json`, `pr_comments_utf8.json`, `en_old.json`, `pt_old.json`. Verificar se `footer.php`, `functions.php`, `header.php`, `index.php` na raiz são intencionais ou backups.

---

## 5. Resumo executivo

| Categoria | Status |
|---|---|
| Stack técnica documentada | ✅ Boa |
| Armadilhas e bugs conhecidos | ✅ Boa |
| Hierarquia de precedência | ❌ Inconsistente entre 4 arquivos |
| Cobertura de skills | ✅ Ampla (26 skills) |
| Skills com contexto do projeto | ⚠️ Parcial (skills de conteúdo são genéricas) |
| Checklist de tarefas comuns | ❌ Ausente (nova rota, novo endpoint) |
| Documentação de testes | ❌ Ausente |
| Git workflow | ❌ Ausente |
| Ambiente local | ❌ Ausente |
| Organização de arquivos na raiz | ⚠️ Poluída com artefatos temporários |
| Duplicação de conteúdo entre arquivos | ❌ Alta (AGENTS.md vs AI_CONTEXT_INDEX.md) |

**Melhorias de maior impacto imediato:** M1 (hierarquia única), M2 (skills em AGENTS.md), M3 (checklist nova rota), M4 (skill de voz de marca), M5 (consolidar diretórios de skills).
