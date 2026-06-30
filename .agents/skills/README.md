# Agent Skills Governance

Version: 1.1.0

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

## Principio de design

Skills devem ser carregadas sob demanda. Uma skill boa tem escopo claro, gatilho claro, procedimento reutilizavel e poucas opinioes globais. Regras globais pertencem ao contexto canonico, nao a uma skill.

O objetivo e reduzir dispersao sem apagar especializacao util.

## Skill clusters atuais

### Navegacao e memoria

| Skill | Papel | Status |
|---|---|---|
| `djzeneyer-context` | Navegacao inicial pelo ecossistema Zen Eyer | Manter |
| `dream-project` | Consolidacao de contexto apos trabalho relevante | Manter |

### WordPress / PHP / backend

| Skill | Papel | Status |
|---|---|---|
| `wordpress-router` | Roteia tarefas WP para a skill certa | Manter como maestro WP |
| `wp-project-triage` | Inspecao deterministica de estrutura WP | Manter, usar quando estrutura mudar |
| `wp-headless` | Arquitetura WordPress headless + SPA | Manter |
| `wp-plugin-development` | Desenvolvimento de plugins | Manter |
| `wp-plugin-code-reviewer` | Review de PHP em plugins WordPress com WPCS/security | Manter como skill fina de review |
| `wp-rest-api` | Endpoints REST | Manter |
| `wp-performance` | Performance backend/WordPress | Manter |
| `wp-wpcli-and-ops` | Operacoes WP-CLI/SSH/cache | Manter com cuidado em producao |
| `wp-phpstan` | PHPStan em WordPress | Manter |
| `wp-interactivity-api` | WordPress Interactivity API | Manter como raro/condicional |

### Frontend / React / TypeScript / UI

| Skill | Papel | Status |
|---|---|---|
| `react-best-practices` | Regras React aplicaveis ao stack Vite/React Router | Preferir para performance React |
| `react-patterns` | Conceitos gerais de composicao React | Secundaria; nao usar para SSR/Server Components |
| `typescript-pro` | Tipagem TypeScript avancada | Manter, usar quando a tarefa for de tipos/contratos |
| `tailwind-patterns` | Tailwind v4 e design tokens | Manter |
| `web-quality-skills` | Performance web do site real | Manter; adaptada para Vite/SSG |
| `clean-code` | Refatoracao e revisao geral | Manter como checklist geral |

### SEO / GEO / AEO / schema / AI discovery

| Skill | Papel | Status |
|---|---|---|
| `seo-audit` | Diagnostico SEO completo | Manter como auditoria, nao implementacao |
| `seo-meta-optimizer` | Titles/descriptions/OG/canonical copy | Manter, agora alinhada a HeadlessSEO/Zen SEO Lite |
| `seo-authority-builder` | E-E-A-T/entity/authority externo | Manter como estrategica; usar com `.human/` e `SITE_PAGES_STRATEGY` |
| `schema-markup` | JSON-LD e schema.org | Manter |

### Conteudo / voz / redes

| Skill | Papel | Status |
|---|---|---|
| `zen-content-voice` | Fonte de voz, tom e identidade publica | Manter como principal |
| `content-strategy` | Clusters de topicos, calendarios e estrategia SEO de conteudo para Zen Eyer | Manter; inclui pilares editoriais e clusters especificos do projeto |
| `copywriting` | Estrutura de landing/copy/conversao | Manter subordinada a `zen-content-voice` |
| `social-content` | Reels/Stories/social content | Manter subordinada a `zen-content-voice` |

### Seguranca

| Skill | Papel | Status |
|---|---|---|
| `codeql-security` | Padrões CodeQL específicos do projeto | Manter; alta prioridade em sanitizacao/escaping |
| `backend-security-coder` | Secure coding backend generico | Manter como checklist, subordinada aos guardrails WP/projeto |
| `auth-implementation-patterns` | Auth/JWT/OAuth/RBAC | Manter como checklist, subordinada a `zeneyer-auth` e `wp-headless` |

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

## Politica de consolidacao

Consolidar ou rebaixar uma skill quando:

- Ela repete outra skill com o mesmo gatilho e mesmo procedimento.
- Ela e generica demais e recomenda stack errado para o projeto.
- Ela redefine regra global ja existente.
- Ela aponta para arquivos removidos.
- Ela incentiva acoes de alto risco sem guardrails.

Preferir adaptar uma skill existente antes de deletar, se ela ainda tiver um procedimento util.

## Anti-padroes

- Criar uma skill que vira uma segunda documentacao completa do projeto.
- Copiar e colar regras globais dentro de varias skills.
- Manter contexto essencial preso a Claude, Gemini, Jules, Codex, OpenClaw ou qualquer agente especifico.
- Usar skills para mudar decisoes de produto sem registro no contexto canonico.
- Resumir agressivamente skills tecnicas ao ponto de apagar armadilhas importantes.
- Carregar muitas skills em tarefas simples.

## Manutencao

Ao criar ou alterar uma skill:

1. Conferir se ela esta alinhada com `AI_CONTEXT_INDEX.md`.
2. Conferir se ela nao aponta para arquivos removidos.
3. Conferir se ela tem escopo claro.
4. Atualizar este README se a skill mudar a navegacao mental dos agentes.
5. Atualizar `.context/SITE_RESOURCES.md` somente se a skill tambem representar recurso publico ou capacidade relevante do site.
6. Atualizar `.context/IMPLEMENTATION_STATUS.md` se a mudanca representar novo recurso ou TODO operacional.
