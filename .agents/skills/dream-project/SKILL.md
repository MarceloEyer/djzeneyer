---
name: dream-project
description: >
  Consolidates and updates project AI context files after a significant work
  session. Equivalent to Claude Code's /dream, but aligned to this repository's
  current context architecture: AI_CONTEXT_INDEX.md, AGENTS.md, .agents/,
  .context/, .human/ and LEARNINGS.md. Use after meaningful code changes, bug
  fixes, architectural decisions, SEO/AI discovery changes, or when context files
  feel stale.
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
version: '1.1.0'
author: Marcelo Eyer Fernandes (DJ Zen Eyer) & Claude
updated: '2026-05-30'
---

# dream-project — Consolidação de Contexto

> Voce e o guardiao da memoria tecnica deste projeto.
> Execute este skill apos qualquer sessao de trabalho relevante.
> Responda sempre em Portugues Brasileiro. Seja preciso e conciso.

---

## O que este skill faz

Executa um ciclo de 4 fases que mantem arquivos de contexto sincronizados com a realidade do codigo e com as decisoes de produto do projeto, sem redundancias desnecessarias, sem informacoes obsoletas e sem divergencias entre arquivos.

```text
Fase 1: RECON    -> le o estado real do repositorio
Fase 2: ANALISE  -> detecta divergencias, novidades e stale content
Fase 3: UPDATE   -> atualiza os arquivos owner corretos
Fase 4: COMMIT   -> persiste as mudancas no git/PR
```

---

## Fase 1 — RECON

Antes de editar qualquer arquivo, colete somente o contexto necessario para a tarefa.

### 1.1 Git — o que mudou

```bash
git log --oneline -20
git diff HEAD~5..HEAD --stat
```

### 1.2 Stack — versoes reais

```bash
node -e "const p=require('./package.json'); console.log(JSON.stringify({
  react: p.dependencies.react,
  vite: p.devDependencies.vite,
  tailwind: p.devDependencies.tailwindcss,
  typescript: p.devDependencies.typescript,
  'react-router': p.dependencies['react-router-dom'],
  'react-query': p.dependencies['@tanstack/react-query'],
  eslint: p.devDependencies.eslint,
  engines: p.engines
}, null, 2))"
```

### 1.3 PHP/WP — versoes dos plugins

```bash
grep -h "Version:" plugins/*/*.php 2>/dev/null
grep -R "CACHE_VERSION" plugins/ -n 2>/dev/null
```

### 1.4 Arquivos de contexto a considerar

Leia o minimo necessario, seguindo a hierarquia:

- `AI_CONTEXT_INDEX.md`
- `AGENTS.md`
- `.agents/GUIDELINES.md`
- `.context/IDENTITY.md`
- `.context/PROJECT.md`
- `.context/ARCHITECTURE.md`
- `.context/SITE_RESOURCES.md`
- `.context/SITE_PAGES_STRATEGY.md`
- `.context/API.md`
- `.context/OPERATIONS.md`
- `LEARNINGS.md`
- `.agents/personas/*.md` apenas quando a tarefa tocar comportamento local de agente
- `.agents/skills/*/SKILL.md` apenas quando a tarefa tocar aquela habilidade
- `.human/*.md` apenas quando a tarefa tocar backlog, auditoria, handoff ou acao humana

Nao use caminhos legados como `CONTEXT.md`, `GEMINI.md`, `LEARNINGS.md` ou `.agents/GUIDELINES.md` como fonte atual, salvo se eles voltarem a existir e forem registrados no indice canonico.

---

## Fase 2 — ANALISE

Compare o que foi coletado com o conteudo dos arquivos owner.

### Checklist de divergencias

**Stack & versoes**
- [ ] Versoes e engines nos docs batem com `package.json`?
- [ ] Versoes de plugins PHP batem com headers reais?
- [ ] Lockfiles acompanham mudancas de dependencia?

**Regras & pitfalls**
- [ ] Houve bug novo descoberto nesta sessao?
- [ ] Alguma armadilha conhecida precisa ser adicionada?
- [ ] Alguma regra documentada e agora obsoleta?

**Endpoints & API**
- [ ] Novos endpoints foram criados/removidos?
- [ ] Algum namespace mudou?
- [ ] Contratos de resposta mudaram?
- [ ] `.context/API.md` continua fiel ao codigo?

**CI/CD & deploy**
- [ ] Workflows mudaram?
- [ ] Cache, rsync, build, prerender, sitemap, IndexNow ou DNS-AID mudaram?

**AI discovery e recursos publicos**
- [ ] `llms.txt`, `llms-full.txt`, `.well-known/*`, `robots.txt`, schema ou headers `Link` mudaram?
- [ ] A politica de `ai-train=yes`, `search=yes`, `ai-input=yes` foi preservada?
- [ ] Algum novo recurso publico deve entrar em `.context/SITE_RESOURCES.md`?

**Arquivos de contexto entre si**
- [ ] Algum arquivo contradiz outro?
- [ ] Ha duplicacao ruim ou apenas reforco controlado?
- [ ] Algum arquivo aponta para caminho inexistente?

**Regras de SEO/rotas**
- [ ] Novas rotas privadas continuam `noindex`?
- [ ] Rotas publicas usam `HeadlessSEO`?
- [ ] Sitemap/prerender/rotas estao alinhados?

---

## Fase 3 — UPDATE

### Ordem recomendada

Atualize do mais canonico para o mais especifico:

```text
1. Codigo real, se houver bug ou drift de runtime
2. AI_CONTEXT_INDEX.md, se mudou mapa/hierarquia
3. AGENTS.md ou .agents/GUIDELINES.md, se mudou regra global
4. .context/IDENTITY.md, se mudou identidade/branding
5. .context/*.md owner, se mudou dominio tecnico/produto
6. LEARNINGS.md, se e anti-erro consolidado
7. .agents/personas/*.md, se e overlay local de agente
8. .agents/skills/*/SKILL.md, se e procedimento de skill
9. .human/*.md, se e backlog, auditoria, handoff ou acao humana
```

### Regras de edicao

**Preservar sempre:**
- Proibicoes absolutas e decisoes de produto.
- Exemplos de codigo funcionais.
- Armadilhas tecnicas que previnem regressao.
- Hierarquia de contexto.
- Politica publica de IA/training do site.

**Atualizar quando necessario:**
- Versoes e datas.
- Novas armadilhas derivadas de bug real.
- Mudancas em endpoints, rotas, plugins, scripts, CI/CD, schema ou AI discovery.
- Novos recursos que merecem aparecer em `.context/SITE_RESOURCES.md`.

**Remover apenas se:**
- A informacao e factualmente errada com base no codigo atual.
- E um TODO concluido.
- E duplicata exata dentro do mesmo arquivo.
- O arquivo referenciado nao existe mais e nao e um ponteiro intencional.

**Nunca fazer:**
- Resumir/comprimir secoes tecnicas por economia de espaco quando isso remove armadilhas.
- Reordenar hierarquia sem justificativa.
- Trocar idioma sem motivo.
- Criar novo arquivo de contexto sem atualizar `AI_CONTEXT_INDEX.md`.
- Transformar uma decisao de produto em suposta correcao de seguranca sem perguntar.

---

## Fase 4 — COMMIT

Depois das edicoes:

```bash
git diff --check
npm run i18n:check
npm run utf8:check
npm run type-check
```

Quando aplicavel, rode tambem:

```bash
npm run lint
npm run build
npm run build:full
npm run perf:budget
```

Mensagem sugerida:

```bash
git commit -m "docs(context): consolidate project context — YYYY-MM-DD"
```

---

## Guia rapido de decisao

```text
Bug novo descoberto e corrigido?
  -> LEARNINGS.md + arquivo owner em .context/ ou .agents/GUIDELINES.md

Versao de dependencia mudou?
  -> package.json/package-lock.json + README/.context quando necessario

Novo endpoint criado?
  -> codigo + .context/API.md + .context/SITE_RESOURCES.md se for recurso relevante

Deploy/CI mudou?
  -> .context/OPERATIONS.md + LEARNINGS.md se for anti-erro

Nova rota publica ou privada?
  -> routes config + .context/SITE_PAGES_STRATEGY.md + sitemap/prerender se aplicavel

Novo recurso .well-known, llms, MCP, Agent Skills ou AI discovery?
  -> .context/SITE_RESOURCES.md + AI_CONTEXT_INDEX.md se mudar a arquitetura mental

Arquivo de contexto ficou stale?
  -> corrigir divergencia no arquivo owner, sem reescrever tudo sem motivo
```

---

## Anti-padroes

- Nao fazer "resumao executivo" que apaga contexto tecnico critico.
- Nao adicionar emojis em massa.
- Nao trocar idioma do arquivo sem motivo.
- Nao commitar sem ler o diff.
- Nao atualizar o que nao mudou.
- Nao criar novos arquivos de contexto sem atualizar `AI_CONTEXT_INDEX.md`.
- Nao usar `CLAUDE.md`, `GEMINI.md`, `CONTEXT.md` ou `LEARNINGS.md` como caminhos atuais se eles nao existirem ou forem apenas ponteiros.