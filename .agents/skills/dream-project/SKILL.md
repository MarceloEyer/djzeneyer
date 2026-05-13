---
name: dream-project
description: >
  Consolidates and updates ALL project AI context files after a work session.
  Equivalent to Claude Code's /dream but for the entire repository — works for
  every AI (Claude, Gemini, Jules, Bolt, Codex). Run this after significant
  changes, bug fixes, architectural decisions, or when context files feel stale.
  Reads the real codebase state, cross-references with existing docs, removes
  outdated content, merges new learnings, and commits the result.
triggers:
  - dream
  - dream project
  - consolidate context
  - update context
  - sync docs
  - atualizar contexto
  - consolidar memória
  - consolidar contexto
  - dreaming
  - /dream
version: '1.0.0'
author: Marcelo Eyer Fernandes (DJ Zen Eyer) & Claude
date_added: '2026-03-27'
---

# dream-project — Consolidação de Contexto

> Você é o guardião da memória técnica deste projeto.
> Execute este skill após qualquer sessão de trabalho relevante.
> **Responda sempre em Português Brasileiro. Seja preciso e conciso.**

---

## O que este skill faz

Executa um ciclo de 4 fases que mantém todos os arquivos de contexto do projeto
sincronizados com a realidade do código — sem redundâncias, sem informações obsoletas,
sem divergências entre arquivos.

```
Fase 1: RECON    → lê o estado real do repositório
Fase 2: ANÁLISE  → detecta divergências, novidades, stale content
Fase 3: UPDATE   → atualiza os arquivos alvo
Fase 4: COMMIT   → persiste as mudanças no git
```

---

## Fase 1 — RECON (sempre executar primeiro)

Antes de editar qualquer arquivo, colete as seguintes informações:

### 1.1 Git — o que mudou
```bash
git log --oneline -20                          # últimos 20 commits
git diff HEAD~5..HEAD --stat                   # mudanças recentes por arquivo
```

### 1.2 Stack — versões reais
```bash
node -e "const p=require('./package.json'); console.log(JSON.stringify({
  react: p.dependencies.react,
  vite: p.devDependencies.vite,
  tailwind: p.devDependencies.tailwindcss,
  typescript: p.devDependencies.typescript,
  'react-router': p.dependencies['react-router-dom'],
  'react-query': p.dependencies['@tanstack/react-query'],
  eslint: p.devDependencies.eslint,
  node: process.version
}, null, 2))"
```

### 1.3 PHP/WP — versões dos plugins
```bash
grep -h "Version:" plugins/zengame/*.php plugins/zeneyer-auth/*.php plugins/zen-seo-lite/*.php plugins/zen-bit/*.php 2>/dev/null
grep "CACHE_VERSION" plugins/zengame/includes/class-zengame.php
```

### 1.4 Leia os arquivos alvo (estado atual)
Leia TODOS estes arquivos antes de editar qualquer um:
- `AI_CONTEXT_INDEX.md`
- `CLAUDE.md`
- `GEMINI.md`
- `CONTEXT.md`
- `AGENTS.md`
- `docs/AI_GOVERNANCE.md`
- `plugins/zengame/CONTEXT.md`
- `.agents/skills/djzeneyer-context/SKILL.md` (seção ERRATA)
- `.agents/skills/djzeneyer-context/references/api-endpoints.md`

---

## Fase 2 — ANÁLISE

Compare o que você coletou na Fase 1 com o conteúdo dos arquivos alvo.

### Checklist de divergências a detectar

**Stack & versões:**
- [ ] Versões de React, Vite, Tailwind, TypeScript nos docs batem com `package.json`?
- [ ] CACHE_VERSION do ZenGame está atualizado nos docs?
- [ ] Versão dos plugins PHP bate com os docs?

**Regras & pitfalls:**
- [ ] Houve algum bug novo descoberto nesta sessão? (leia os commits)
- [ ] Alguma armadilha conhecida precisa ser adicionada?
- [ ] Alguma regra documentada é agora obsoleta?

**Endpoints & API:**
- [ ] Novos endpoints foram criados/removidos?
- [ ] Algum namespace mudou?
- [ ] Contratos de resposta mudaram (ex: campo novo no `/me`)?

**CI/CD & Deploy:**
- [ ] Houve mudança no `deploy.yml`?
- [ ] Algum step de cache ou rsync foi alterado?

**Arquivos de contexto entre si:**
- [ ] Algum arquivo contradiz outro?
- [ ] Há informação duplicada que poderia ser removida e apenas referenciada?
- [ ] Algum arquivo está desatualizado (data ou conteúdo)?

**Regras de SEO/rotas:**
- [ ] Novas rotas privadas (noindex)?
- [ ] Rotas excluídas do prerender/sitemap?

---

## Fase 3 — UPDATE

### Ordem obrigatória de atualização

Sempre nesta sequência (do mais canônico para o mais específico):

```
1. AI_CONTEXT_INDEX.md     ← SSOT — atualizar aqui primeiro
2. CONTEXT.md              ← resumo executivo
3. CLAUDE.md               ← override para Claude Code
4. GEMINI.md               ← override para Gemini/Jules
5. docs/AI_GOVERNANCE.md   ← gates de tarefa
6. plugins/zengame/CONTEXT.md ← contexto do plugin
7. .agents/skills/djzeneyer-context/SKILL.md (ERRATA) ← skill master
8. .agents/skills/djzeneyer-context/references/api-endpoints.md
```

### Regras de edição (não violar)

**PRESERVAR sempre:**
- Seções de DO NOT / proibições absolutas
- Exemplos de código funcionais
- Tabelas de armadilhas (pitfalls) — só adicionar, nunca remover sem motivo claro
- Hierarquia de contexto documentada
- Seção ERRATA do SKILL.md

**ATUALIZAR quando necessário:**
- Números de versão (stack, plugins, CACHE_VERSION)
- Datas de revisão
- Novas armadilhas descobertas (adicionar ao topo da seção)
- Cache keys e TTLs se mudaram
- Regras novas derivadas de bugs reais

**REMOVER apenas se:**
- A informação é factualmente errada com base no código atual
- É um TO-DO já concluído
- É duplicata exata de outra seção do mesmo arquivo
- O arquivo referenciado não existe mais

**NUNCA fazer:**
- Resumir/comprimir seções técnicas por "economia de espaço"
- Remover exemplos de código sem substituí-los por algo melhor
- Reordenar hierarquia de arquivos sem justificativa
- Escrever em inglês onde o original estava em PT-BR

### Template de nota de mudança

Ao atualizar um arquivo, adicione ao rodapé (ou atualize a data existente):

```
*Consolidado em YYYY-MM-DD via dream-project skill.*
```

---

## Fase 4 — COMMIT

Após todas as edições, commite com mensagem padronizada:

```bash
git add AI_CONTEXT_INDEX.md CLAUDE.md GEMINI.md CONTEXT.md \
        docs/AI_GOVERNANCE.md plugins/zengame/CONTEXT.md \
        .agents/skills/djzeneyer-context/SKILL.md \
        .agents/skills/djzeneyer-context/references/api-endpoints.md

git commit -m "docs(dream): consolidate AI context — $(date +%Y-%m-%d)

[lista bullet das principais mudanças feitas]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

git push origin main
```

---

## Arquivo de memória pessoal (Claude Code)

Além dos arquivos do repositório, atualize também a memória local do Claude Code
se houver novos aprendizados persistentes:

```
~/.claude/projects/D--DJ-Scripts-djzeneyer/memory/project_pr_state.md
```

Adicione ao bloco **"Armadilhas técnicas conhecidas"** qualquer pitfall novo
descoberto na sessão.

---

## Guia rápido de decisão

```
Bug novo descoberto e corrigido?
  → Adicionar em: CLAUDE.md § ZenGame/armadilhas, GEMINI.md § Regras, zengame/CONTEXT.md § Pitfalls, SKILL.md § ERRATA, memory/project_pr_state.md

Versão de dependência mudou?
  → Atualizar em: AI_CONTEXT_INDEX.md, CONTEXT.md, CLAUDE.md, GEMINI.md, SKILL.md § Stack, README.md

Novo endpoint criado?
  → Atualizar em: AI_CONTEXT_INDEX.md, CONTEXT.md, SKILL.md § Namespaces, api-endpoints.md

Deploy/CI mudou?
  → Atualizar em: CLAUDE.md § Deploy, GEMINI.md § Build & Deploy, AI_GOVERNANCE.md § Gates E (CI/CD)

Nova rota privada (noindex)?
  → Atualizar em: AI_CONTEXT_INDEX.md (regra), CLAUDE.md § SEO, GEMINI.md § Regras, AI_GOVERNANCE.md § Gates A (Frontend)

Arquivo de contexto ficou desatualizado (sem mudança de código)?
  → Apenas atualizar data e corrigir divergências. Não reescrever sem motivo.
```

---

## Anti-padrões (o que NÃO fazer neste skill)

- ❌ **Não fazer "resumão executivo"** — reduzir 800 linhas para 80 destrói contexto técnico crítico
- ❌ **Não adicionar emojis em massa** — use com moderação, só onde já existiam
- ❌ **Não trocar idioma** — se o arquivo está em PT-BR, manter PT-BR
- ❌ **Não commitar sem ler** — leia os diffs antes de commitar
- ❌ **Não atualizar o que não mudou** — preservar estabilidade é tão importante quanto atualizar
- ❌ **Não criar novos arquivos de contexto** sem atualizar o índice (`AI_CONTEXT_INDEX.md`)
