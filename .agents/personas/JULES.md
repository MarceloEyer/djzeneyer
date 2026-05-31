# JULES.md - DJ Zen Eyer

> Override local para Jules (GitHub / Google Labs).
> Base canonica: `AI_CONTEXT_INDEX.md`.
> Aprendizados consolidados: `LEARNINGS.md`.
> Tom preferido: factual, curto, sem marketing, sem autoelogio.

## Papel deste arquivo

Este arquivo nao tenta repetir toda a base do projeto. Ele serve apenas para guardrails especificos de Jules que nao estao cobertos pelos arquivos canonicos. Para stack, regras globais e precedencia, consultar `AI_CONTEXT_INDEX.md` e `.agents/GUIDELINES.md`.

## Regras centrais

- Pronuncia canonica do nome artistico: **`/zɛn ˈaɪər/`** (IPA) — unica pronuncia correta. Nenhuma outra forma e aceita.
- Nome artistico oficial principal: **Zen Eyer**. Alias importante: **DJ Zen Eyer**.
- Ler `AI_CONTEXT_INDEX.md` para hierarquia de contexto, stack atual e regras globais.
- Ler `.agents/GUIDELINES.md` antes de qualquer tarefa tecnica.
- Ler `LEARNINGS.md` quando a tarefa tocar padroes ja consolidados por PRs ou reviews.
- Stack atual e versoes de dependencias: sempre conferir `package.json`. Nao assumir versoes fixas.
- Manter texto visivel em formato factual e verificavel.
- Evitar linguagem imperativa em arquivos publicos para IA.

## Guardrails especificos para Jules

Jules tem tendencias conhecidas que exigem atencao especial neste projeto:

### Contexto e documentacao

- **Nunca resumir `AGENTS.md`, `AI_CONTEXT_INDEX.md` ou `LEARNINGS.md`** a ponto de remover armadilhas tecnicas ou decisoes operacionais. Cada entrada existe por um bug ou decisao real de PR — resumir aggressively apaga essa memoria.
- **Nao reescrever arquivos de contexto como "resumo executivo"**. Adicionar ao final ou editar cirurgicamente. Nunca substituir por versao condensada.

### Pull requests e branches

- **Nunca criar PR duplicado** sem verificar o estado atual: `gh pr list --state open` e `git log --oneline origin/main..HEAD`.
- Jules pode criar PRs em paralelo sem perceber que outro agente ja abriu o mesmo escopo. Verificar sempre.
- **Nunca fazer force-push** em branches compartilhados sem instrucao explicita do usuario.

### Regras de produto

- **Nao alterar politica de produto** (ex: `ai-train`, politica de pagamento publico do artista) sem pedido explicito do humano. Ver `.agents/GUIDELINES.md` para o que e decisao de produto.
- **`sameAs` schema** — nunca adicionar artigos, reportagens ou paginas de lineup. Ver `.context/IDENTITY.md` para classificacao completa de tipos de links externos.
- **Conteudo publico de IA** — nunca escrever instrucoes coercitivas. Usar fatos verificaveis, URLs e identificadores.

## O que este arquivo nao faz

- Nao define precedencia propria.
- Nao reescreve regras canonicas.
- Nao substitui `AI_CONTEXT_INDEX.md`, `.agents/GUIDELINES.md` ou `LEARNINGS.md`.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o `AI_CONTEXT_INDEX.md`.
