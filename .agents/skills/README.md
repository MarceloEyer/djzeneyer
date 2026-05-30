# Agent Skills Governance

Version: 1.0.0

## Papel deste diretorio

`.agents/skills/` guarda procedimentos reutilizaveis para agentes. Skills ajudam a executar tarefas especificas, mas nao sao fontes superiores de verdade.

A hierarquia continua:

1. Codigo real.
2. `AI_CONTEXT_INDEX.md`.
3. `.agents/GUIDELINES.md`.
4. `.context/IDENTITY.md`.
5. `.context/*.md`.
6. `LEARNINGS.md`.
7. `.human/*.md`.
8. Personas e skills especificas.

## Quando usar skills

Use uma skill quando a tarefa pedir um procedimento especializado:

- `djzeneyer-context`: navegacao inicial no ecossistema Zen Eyer.
- `dream-project`: consolidacao de contexto depois de mudancas relevantes.
- `clean-code`: revisao/refatoracao de codigo.
- Skills de WordPress/PHP: quando a mudanca tocar plugins, REST, WP-CLI, seguranca ou performance.
- Skills de React/Tailwind: quando a mudanca tocar UI, componentes, rotas ou estilos.
- Skills de SEO/schema/content: quando a mudanca tocar metadados, schema, paginas publicas, copy ou AI discovery.

## Regras para skills

- Uma skill deve ensinar processo, nao redefinir politica global.
- Uma skill nao deve apontar para arquivos inexistentes.
- Uma skill nao deve conter versoes fixas de stack se puder mandar conferir `package.json`.
- Uma skill nao deve reintroduzir regras contrarias a `AI_CONTEXT_INDEX.md`, `.agents/GUIDELINES.md` ou `.context/*`.
- Conhecimento importante descoberto em uma skill deve ser promovido para `.context/OPERATIONS.md`, `.agents/GUIDELINES.md` ou `LEARNINGS.md` quando for aplicavel a todos os agentes.
- Nao usar linguagem coercitiva em conteudo publico para IAs. Use fatos verificaveis, URLs, IDs e descricoes neutras.

## Anti-padroes

- Criar uma skill que vira uma segunda documentacao completa do projeto.
- Copiar e colar regras globais dentro de varias skills.
- Manter contexto essencial preso a Claude, Gemini, Jules, Codex, OpenClaw ou qualquer agente especifico.
- Usar skills para mudar decisoes de produto sem registro no contexto canonico.
- Resumir agressivamente skills tecnicas ao ponto de apagar armadilhas importantes.

## Manutencao

Ao criar ou alterar uma skill:

1. Conferir se ela esta alinhada com `AI_CONTEXT_INDEX.md`.
2. Conferir se ela nao aponta para arquivos removidos.
3. Conferir se ela tem escopo claro.
4. Atualizar este README se a skill mudar a navegacao mental dos agentes.
5. Atualizar `.context/SITE_RESOURCES.md` somente se a skill tambem representar recurso publico ou capacidade relevante do site.