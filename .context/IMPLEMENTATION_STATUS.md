# Implementation Status & TODO Map

Version: 1.0.0
Last reviewed from PR history: 2026-05-23 a 2026-05-30

> ⚠️ **Arquivo operacional e temporário.** Resume implementações recentes e TODOs derivados de PRs. Não é SSOT permanente — sempre validar contra o código real. Itens resolvidos devem ser removidos; regras permanentes devem ser promovidas para `.context/OPERATIONS.md`, `.agents/GUIDELINES.md` ou `LEARNINGS.md`.

## Papel deste arquivo

Este arquivo resume recursos implementados recentemente e pendencias operacionais. Ele existe para orientar agentes e humanos sobre o estado do produto sem transformar PRs antigos em fonte permanente de verdade.

Ele nao substitui:

- Codigo real.
- `AI_CONTEXT_INDEX.md` para hierarquia de contexto.
- `.context/SITE_RESOURCES.md` para mapa de capacidades.
- `.context/SITE_PAGES_STRATEGY.md` para estrategia de paginas.
- `.context/OPERATIONS.md` para memoria operacional compartilhada.
- `LEARNINGS.md` para anti-erros consolidados.

Quando uma pendencia virar regra permanente, promover para o arquivo owner correto. Quando um item for resolvido, marcar como done ou remover em uma revisao posterior.

## Recursos implementados recentemente

### Performance e cache

- Footer, UserMenu, MediaPage e ZenLinkPage tiveram arrays/links memoizados para reduzir alocacoes desnecessarias em render.
- APIs de GamiPress e perfil reduziram N+1/fan-out em leituras de meta e thumbnails.
- Public pages de baixo update reduziram fetches rotineiros; `artistData.ts` permanece fallback/SSOT estatico importante.
- APCu L1 cache foi adicionado opcionalmente em Zen BIT e Zen SEO Lite antes de transients/SWR quando disponivel.
- Prerender passou a usar batching/concurrency/memory management e depois posts reais do WordPress.

### Eventos e prerender

- `zen-bit/v2/events` permanece SSOT para selecao, ordenacao, canonical paths, cache headers e MusicEvent schema.
- Home inlinea apenas os 3 proximos eventos.
- Events inlinea lista publica maior, atualmente limitada a 50.
- Rotas irrelevantes nao devem carregar eventos.
- Eventos pre-renderizados passam pelo mesmo enriquecimento `_processed` dos eventos vivos.

### SEO, AEO, GEO e Search Console

- Enciclopedia de Zouk Brasileiro foi expandida e fortalecida para AEO/Knowledge Panel.
- H1/title/copy da Enciclopedia foram ajustados para termos como Brazilian Zouk Encyclopedia & History.
- `llms-full.txt` passou a expor conteudo mais completo da Enciclopedia.
- Crawl noise do Search Console foi mitigado com redirects canonicos, 410 para probes/placeholder e robots/noindex apropriados.
- Hreflang/canonical em rotas dinamicas foram corrigidos para evitar URLs com `:id`/`:slug`.
- Open Graph foi padronizado com helpers route-aware e imagens 1200x630.
- Hub pages de autoridade foram criadas ou preparadas: Zouk History, Musicality, Festivals e Artist Collaborations.
- Hub pages sem conteudo real devem permanecer `noindex` ate terem conteudo suficiente.

### AI discovery, agent resources e machine-readable surfaces

- Markdown estatico para agents foi adicionado como alternativa ao Cloudflare Markdown for Agents.
- Geracao de Markdown a partir do HTML pre-renderizado foi integrada ao pipeline.
- CodeQL encontrou e motivou correcoes no sanitizador/conversor HTML->Markdown.
- MCP Server Card e Agent Skills public index foram adicionados em `.well-known`.
- Endpoint MCP em `inc/ai-llm.php` suporta initialize, resources/list, resources/read, tools/list, prompts/list e ping.
- Homepage passou a expor RFC 8288 Link headers para descoberta de recursos machine-readable.
- `/.well-known/api-catalog` foi publicado como linkset/catalogo publico.
- DNS-AID ganhou registros/documento canonico e script Cloudflare para publicar/validar.
- Content Signals foram adicionados e depois a decisao de produto foi consolidada: conteudo publico permite `ai-train=yes`, `search=yes`, `ai-input=yes`.

### Releases, posts e newsletter

- Prerender passou a buscar posts reais do WordPress e gerar rotas individuais de releases/posts.
- Deploy diario via GitHub Actions foi adicionado para manter HTML pre-renderizado fresco sem commits manuais.
- Paginas de newsletter foram adicionadas em EN/PT para confirmacao e preferencias, fora de sitemap/prerender.
- i18n checker passou a validar todos os namespaces, nao apenas `translation.json`.

### Seguranca e infraestrutura

- Zen Mailer health endpoint foi protegido para admin (`manage_options`).
- JWT/auth recebeu hardening e logging de seguranca.
- `.htaccess` teve HSTS duplicado removido, CORS restringido, OPTIONS escopado e CSP unset corrigido.
- YouTube embed warnings foram tratados em `inc/csp.php` e iframe allow, nao em `.htaccess`.
- Node baseline do CI foi alinhado para Node 22.13+.
- Composer lockfiles de plugins passaram a ser exigidos para installs deterministicos.
- Deploy workflow limpou artifacts inexistentes, ajustou fetch-depth e reduziu ruido de compressao Vite.
- IndexNow ganhou script npm, preflight do key file, polling e purge LiteSpeed para evitar 403 por cache antigo.

### Autoridade, identidade e press/media

- Dados estruturados Person/MusicGroup foram alinhados entre React e Zen SEO Lite.
- MusicEvent performer passou a apontar para o node MusicGroup.
- Campeonato foi normalizado como Zouk DJ Championship / I Campeonato Internacional de DJs, evitando confusao com Zouk Worlds.
- Contagem de paises presenciais: ver `.context/IDENTITY.md` (SSOT).
- Zoukology article foi preparado como published work externo, com relacao `Zen Eyer -> author of -> article -> published by Zoukology`, sem entrar em `sameAs`.

### Contexto de agentes e documentacao

- Auditoria geral dos MDs foi criada em `.human/MD_AUDIT_2026-05-23.md`.
- `.context/OPERATIONS.md` foi criado como memoria operacional compartilhada.
- Regras de cache, IndexNow, PR review completeness, IA publica e validacao local foram promovidas para contexto versionado.
- `CLAUDE.md` raiz foi reduzido a ponteiro, e o contexto local real fica em `.agents/personas/CLAUDE.md`.
- `djzeneyer-context` e `dream-project` foram corrigidas para a arquitetura atual.
- `.context/SITE_RESOURCES.md` foi criado como mapa de capacidades do site.
- `.agents/skills/README.md` foi criado para governanca de skills.

### Revisao e melhoria do PR #610 — 2026-05-30

- `social.YouTubeMusic` (capital Y, T) adicionado a GUIDELINES, AGENTS, CLAUDE persona, GEMINI persona e AI_CONTEXT_INDEX — antes estava apenas em LEARNINGS.md.
- ESLint ignores documentados em GUIDELINES e AI_CONTEXT_INDEX (`.claude`, `.agents`, `.bolt`, `.gemini`, `.jules`, `.devcontainer`).
- Node version do GEMINI.md corrigido (`20+` → `>=22.13.0`).
- Banner de arquivo temporario adicionado ao topo de IMPLEMENTATION_STATUS.md.
- 5 threads de review do PR #610 (Gemini + Codex) resolvidos.
- `seo-authority-builder` ganhou playbook GEO 2025-2026 completo: como LLMs selecionam fontes, topical authority, cross-platform consistency, video strategy, Wikipedia/Wikidata, AEO checklist, Knowledge Panel maintenance.
- `seo-audit` ganhou GEO entity consistency checklist cross-platform e checklist de recursos de AI discovery modernos.
- `schema-markup` ganhou `VideoObject` e `SpeakableSpecification` como tipos documentados com guidance.
- `.context/IDENTITY.md` ganhou secao de presenca cross-platform (tabela de 10 plataformas) e secao de classificacao de links externos para Knowledge Panel.
- Classificacao de links documentada em AGENTS, LEARNINGS e seo-authority-builder: `sameAs` = perfis de identidade oficial apenas; artigos sobre o artista, reportagens e lineups de eventos NAO entram em `sameAs`; artigos escritos por ele usam `author` no schema do artigo.
- `TASK_LIST.md` atualizado com acoes GEO/AEO: Spotify bio, Apple Music, YouTube channel, Wikidata, VideoObject schema, Wikipedia, festival pages.
- `MARKETING_OVERVIEW.md` atualizado com resumo estrategico GEO e caminhos prioritarios.
- `.human/SESSION_HANDOFF_2026-05-30.md` criado com documentacao completa de cada mudanca e seu racionocinio.

## Pendencias / TODOs recomendados

### P0 — antes de mergear PRs abertos relevantes

- Corrigir #611 antes de merge: remover `noindex` se a pagina de festivais ja tiver conteudo real suficiente; revisar logica `upcoming` para nao classificar eventos passados como futuros.
- Corrigir #612 antes de merge: sincronizar `package-lock.json`, garantir `npm ci`, Vitest/MSW e Contract Tests verdes.
- Corrigir #613 antes de merge: investigar falha em `npm run build:full` no Quality Gate; so ativar gate quando passar de forma confiavel.
- Revisar #608 com atencao a schema: published work deve fortalecer autoria externa, mas nao virar `sameAs`.

### P1 — saneamento documental e contexto

- Completar varredura linha a linha das skills especificas em `.agents/skills/*/SKILL.md`.
- Procurar caminhos legados nas skills: `CLAUDE.md`, `GEMINI.md`, `CONTEXT.md`, `docs/AI_LEARNINGS.md`, `docs/AI_GOVERNANCE.md`, `.context/ENGINEERING.md`.
- Atualizar ou arquivar referencias antigas em READMEs de plugins, especialmente se apontarem para `CONTEXT.md` ou `docs/*` inexistentes.
- Marcar auditorias/handoffs em `.human/` como active, resolved ou superseded para evitar que agentes tratem historico como backlog atual.
- Criar ou ajustar um check simples de docs para detectar links internos quebrados em MDs criticos.

### P1 — produto/SEO externo

- Confirmar contagem oficial de paises presenciais e alinhar `artistData.ts`, press kit, Media, About e `/verified-facts/`.
- Atualizar Spotify for Artists com bio alinhada ao padrao de identidade atual.
- Atualizar Wikidata Q136551855 com links/fonte para site e enciclopedia quando apropriado.
- Garantir que Zoukology article publicado tenha link editorial para About ou pagina relevante.
- Conferir Bandsintown e paginas permanentes de eventos para fortalecer entidade externa.

### P2 — evolucao de produto

- Definir se os hub pages de Zouk History, Musicality, Festivals e Artist Collaborations devem virar paginas evergreen indexaveis ou continuar noindex ate maturarem.
- Expandir Encyclopedia com termos de alto valor, mantendo tom neutro, verificavel e nao coercitivo para IA.
- Decidir se Releases precisam de templates visuais distintos para music releases e event releases.
- Decidir modelo de Zen Tribe: free entry, supporter tier, pontos/beneficios e rituais de comunidade.
- Avaliar migrar Encyclopedia para WordPress/CPT se crescer muito alem de conteudo estatico.

## Regras de interpretacao

- PR mergeado indica que o recurso provavelmente existe, mas o codigo real vence este resumo.
- PR fechado sem merge nao e implementacao, salvo quando outro PR explicitamente absorveu a ideia.
- Bot-generated PRs de performance devem ser tratados como melhorias pequenas, nao como mudanca arquitetural, a menos que tenham sido promovidos para `LEARNINGS.md` ou `.context/*`.
- Decisoes incomuns do produto devem ser preservadas: IA publica/training permitido, pagamento publico do artista por design, cache agressivo por SSG, e contexto publico factual para Knowledge Panel/AEO/GEO.
