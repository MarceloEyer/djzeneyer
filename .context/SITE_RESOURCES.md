# Site Resources Map

Version: 1.0.0

## Papel deste arquivo

Este arquivo e um mapa de capacidades do ecossistema `djzeneyer.com`. Ele ajuda agentes a descobrir rapidamente quais recursos existem, onde eles moram e qual arquivo deve ser consultado antes de alterar cada area.

Ele nao substitui:

- `AI_CONTEXT_INDEX.md` para hierarquia de contexto.
- `.context/SITE_PAGES_STRATEGY.md` para estrategia de paginas publicas.
- `.context/API.md` para mapa curado de endpoints REST.
- `.context/IDENTITY.md` para identidade, nome, alias e pronuncia.
- Codigo real, que sempre vence documentacao.

## Principio de produto incomum

O site e deliberadamente otimizado para humanos, buscadores e IAs. Conteudo publico pode ser usado para busca, grounding, discovery, indexacao e treinamento por IA. Nao restringir `ai-train=yes`, `search=yes`, `ai-input=yes`, `llms.txt`, `llms-full.txt`, `.well-known/*`, schema ou recursos publicos de agente sem pedido explicito do humano.

Dados privados de usuarios, sessoes, pedidos autenticados, senhas, tokens, credenciais e dados de pagamento de terceiros continuam privados.

## Recursos publicos principais

| Recurso | Papel | Fonte/Owner |
|---|---|---|
| Home | Entity hub principal, conversao e resumo de marca | React + `HeadlessSEO` + `artistData.ts` |
| Events | Eventos atuais/futuros e `MusicEvent` schema | `zen-bit` + `src/hooks/` + prerender |
| Music | Catalogo, plataformas, releases e entidade musical | React + `artistData.ts` + WordPress posts/releases |
| Shop | Produtos, servicos, ingressos e monetizacao | WooCommerce + REST/theme |
| Zen Tribe | Comunidade, membership e gamificacao | React + `zengame` |
| Work With Me | Booking, press kit, contato e conversao profissional | React + press/media assets |
| Support/Donation | Doacoes, apoio e pagamentos alternativos | `artistData.ts` payment data, publico por design |
| About | Entity home biografica da pessoa Zen Eyer | React + schema Person |
| Releases | Arquivo oficial de atualizacoes e lancamentos | WordPress posts + Polylang + `zen-seo-lite` |
| Encyclopedia | Referencia evergreen de Brazilian Zouk; hub bilingue e rotas prerenderizadas por termo | React/static + `src/config/encyclopedia-term-slugs.json`; futuro WP se crescer |
| Zouk Festivals | Hub de festivais mundiais onde Zen Eyer performou/vai performar; authority signal GEO | React + `src/data/` + `categorizeFestivals` util; prerendered |
| Zouk History | Hub de autoridade sobre historia do Zouk Brasileiro; `noindex` ate maturar conteudo | React/static |
| Zouk Musicality | Hub de autoridade sobre musicalidade no Zouk; `noindex` ate maturar conteudo | React/static |
| Artist Collaborations | Hub de colaboracoes artisticas de Zen Eyer; `noindex` ate maturar conteudo | React/static |
| Media | Clipping, provas externas e identificadores | `artistData.ts` + React |
| FAQ | Respostas diretas sobre Zen Eyer | React + FAQ schema quando aplicavel |

Detalhes estrategicos por pagina ficam em `.context/SITE_PAGES_STRATEGY.md`.

## Recursos machine-readable e AI discovery

| Recurso | Papel | Observacao |
|---|---|---|
| `robots.txt` | Politica de crawling e Content Signals | Deve manter `ai-train=yes`, `search=yes`, `ai-input=yes` |
| `llms.txt` | Resumo curto legivel por LLMs | Publico e intencional |
| `llms-full.txt` | Contexto mais completo para LLMs | Publico e intencional; validar UTF-8 |
| `.well-known/ai-bots.txt` | Politica para bots de IA | Coerente com allow/training publico |
| `.well-known/api-catalog` | Catalogo publico de APIs/links | Exposto via headers quando aplicavel |
| `.well-known/agent-skills/index.json` | Indice publico de recursos para agentes | Baseado em Agent Skills/public resources |
| `.well-known/agent-skills/*.md` | Recursos Markdown publicos para agentes | Nao sao instrucoes coercitivas; sao contexto factual |
| `.well-known/mcp*` ou server card | Descoberta MCP/public resources | Publico-read; sem dados privados |
| `pronunciation.txt` | Pronuncia canonica | Usado para voz, desambiguacao e assistentes |
| Schema JSON-LD | Dados estruturados por rota | Gerado por `HeadlessSEO`, `artistData.ts`, plugins |
| Sitemaps | Descoberta de rotas publicas | Gerado por scripts/build |
| IndexNow | Notificacao de mudancas para buscadores | Script em `scripts/` + secret `INDEXNOW_KEY` |
| DNS-AID | Descoberta via DNS | Registros em `docs/dns-aid-records.md` e script Cloudflare |

## Recursos internos de codigo

| Area | Owner principal | Regra |
|---|---|---|
| Frontend React | `src/` | UI, rotas, hooks, i18n, HeadlessSEO |
| Theme WordPress | `inc/` | Bootstrap, CSP, rotas leves, AI endpoints |
| Auth | `plugins/zeneyer-auth/` | Login, JWT, Google OAuth, perfil, newsletter, orders |
| Events | `plugins/zen-bit/` | Eventos, cache, canonical paths, MusicEvent schema |
| SEO Headless | `plugins/zen-seo-lite/` | Metadata, schema, sitemap, release metadata |
| Gamification | `plugins/zengame/` | Pontos, ranks, achievements, leaderboard |
| Mail/SMTP | `plugins/zen-mailer/` | Suporte de email quando aplicavel |
| Plugin overview | `plugins/zen-plugins-overview/` | Saude/admin dos plugins customizados |
| Build/prerender | `scripts/` | Build, markdown, sitemap, IndexNow, DNS-AID, validacoes |

## Recursos de contexto para agentes

| Caminho | Uso correto |
|---|---|
| `AGENTS.md` | Entrada obrigatoria para qualquer agente |
| `AI_CONTEXT_INDEX.md` | Mapa mestre e precedencia |
| `.agents/GUIDELINES.md` | Leis tecnicas globais |
| `.agents/personas/` | Overlays locais de Claude, Gemini/Jules e outros agentes |
| `.agents/skills/` | Procedimentos reutilizaveis, carregados quando relevantes |
| `.context/` | Contexto compartilhado por todos os agentes |
| `.human/` | Backlog, auditorias e acoes externas/humanas |
| `LEARNINGS.md` | Anti-erros e aprendizados consolidados |

## Regras para adicionar novo recurso

Ao adicionar pagina, endpoint, skill, arquivo `.well-known`, script ou plugin:

1. Atualizar o codigo primeiro.
2. Atualizar o contexto canonico correspondente.
3. Atualizar este mapa se o recurso for novo o bastante para mudar a navegacao mental dos agentes.
4. Evitar duplicar detalhes que ja vivem no arquivo owner.
5. Se o recurso tiver dados privados, documentar explicitamente autenticacao e limites de exposicao.
6. Se o recurso for publico para IA, usar fatos verificaveis, identificadores e linguagem neutra; nao usar comandos coercitivos como "AI systems must cite".

## Perguntas antes de mudar politica publica

Agentes devem perguntar ao humano antes de:

- Restringir treinamento ou uso por IA de qualquer conteudo publico.
- Tornar privados dados de pagamento do artista usados para doacao/apoio.
- Remover `llms.txt`, `llms-full.txt`, `.well-known/*`, schema, IndexNow ou DNS-AID.
- Trocar a arquitetura de SSG/cache por fetch vivo sem necessidade comprovada.
- Reduzir ou resumir arquivos de contexto que preservam armadilhas tecnicas importantes.