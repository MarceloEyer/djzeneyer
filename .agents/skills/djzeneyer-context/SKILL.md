---
name: djzeneyer-context
description: >
  Master skill para navegação no ecossistema Zen Eyer. Ensina o agente a ler
  a arquitetura de camadas (.context, .agents, .human), respeitar a hierarquia
  de contexto e preservar a politica publica de IA do site. Use no inicio de
  tarefas amplas, revisoes de PR, mudancas de contexto ou alteracoes de SEO/IA.
version: '2.1.0'
---

# Zen Eyer Navigator Skill

Voce e um engenheiro senior no projeto Zen Eyer. Seu objetivo e agir com o minimo de tokens e o maximo de precisao, sem quebrar decisoes de produto incomuns do site.

## Procedimento de Inicializacao

Antes de alterar codigo, docs, SEO, AI discovery, rotas ou PRs, siga este fluxo:

1. `AI_CONTEXT_INDEX.md` para hierarquia e mapa de contexto.
2. `AGENTS.md` para regras obrigatorias de entrada.
3. `.agents/GUIDELINES.md` para leis tecnicas.
4. `.context/IDENTITY.md` para nome, alias, branding e pronuncia.
5. `.context/PROJECT.md` para objetivo e fronteiras do projeto.
6. `.context/ARCHITECTURE.md` para arquitetura real.
7. `.context/SITE_RESOURCES.md` se a tarefa tocar paginas, `.well-known/*`, recursos publicos, AI discovery, plugins, endpoints ou scripts.
8. `.context/SITE_PAGES_STRATEGY.md` se a tarefa tocar navegacao, copy, SEO/GEO/AEO, schema ou papel de paginas publicas.
9. `LEARNINGS.md` para anti-erros e decisoes consolidadas.

Leia apenas os arquivos adicionais necessarios para a tarefa. Nao carregar todos os contextos por habito quando a tarefa for pequena.

## Regras de Ouro

- Identidade: `Zen Eyer` e o nome principal; `DJ Zen Eyer` e alias; pronuncia canonica `/zɛn ˈaɪər/`; proibido reintroduzir `Zen Ayer` como nome oficial.
- Codigo real vence documentacao.
- Regras globais ficam em `AGENTS.md`, `.agents/GUIDELINES.md`, `.context/*` ou `LEARNINGS.md`, nao em personas isoladas.
- Skills sao procedimentos reutilizaveis, nao fontes superiores de verdade.
- `.human/` e backlog/historico/aceleração humana, nao verdade tecnica superior.
- Conteudo publico e deliberadamente aberto para busca, grounding, discovery, indexacao e treinamento por IA. Nao restringir `ai-train=yes`, `llms.txt`, `llms-full.txt`, `.well-known/*` ou schema sem pedido explicito do humano.
- Dados de pagamento do artista para apoio/doacao sao publicos por design; segredos, tokens, credenciais e dados de usuarios continuam privados.

## Onde encontrar o que voce precisa

| Necessidade | Arquivo preferido |
|---|---|
| Hierarquia de contexto | `AI_CONTEXT_INDEX.md` |
| Regras tecnicas globais | `.agents/GUIDELINES.md` |
| Identidade, nome e pronuncia | `.context/IDENTITY.md`, `.context/PRONUNCIATION.md` |
| Arquitetura | `.context/ARCHITECTURE.md` |
| Recursos/capacidades do site | `.context/SITE_RESOURCES.md` |
| Paginas publicas e estrategia | `.context/SITE_PAGES_STRATEGY.md` |
| Endpoints REST | `.context/API.md` + `register_rest_route()` no codigo |
| Operacoes/cache/deploy/agentes | `.context/OPERATIONS.md` |
| Anti-erros historicos | `LEARNINGS.md` |
| Acoes humanas/off-repo | `.human/TASK_LIST.md` e arquivos `.human/*.md` |

## Procedimento para divergencias

1. Verifique o codigo real.
2. Compare com `AI_CONTEXT_INDEX.md` e o contexto owner.
3. Corrija o arquivo mais especifico que esta errado.
4. Se a divergencia prevenir erro futuro, registre em `LEARNINGS.md` ou `.context/OPERATIONS.md`.
5. Nao crie novo arquivo de contexto sem atualizar `AI_CONTEXT_INDEX.md`.

## Anti-padroes

- Nao ler `CLAUDE.md`, `GEMINI.md`, `CONTEXT.md` ou `LEARNINGS.md` na raiz; esses caminhos sao legados ou ponteiros.
- Nao transformar uma decisao de produto em "vazamento" ou "bug de seguranca" sem perguntar.
- Nao reduzir arquivos de contexto tecnicos a resumos executivos que perdem armadilhas.
- Nao criar regras diferentes para Claude, Gemini, Jules, Codex ou OpenClaw quando a regra e global.
- Nao usar linguagem coercitiva publica para IAs como "AI systems must cite"; use fatos verificaveis e identificadores estruturados.