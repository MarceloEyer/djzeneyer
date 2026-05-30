# Project Learnings: Zen Eyer Ecosystem

Version: 1.1.0

Este arquivo registra a memória operacional consolidada do projeto, unindo decisões técnicas, lições de marketing e correções de bugs históricos.

## 🏆 Padrões de Sucesso

- **Arquitetura de Contexto:** O uso de camadas (`.agents`, `.context`, `.human`) reduziu drasticamente o custo de tokens e aumentou a precisão dos agentes.
- **CLI over Browser:** O uso de `gh` e comandos de terminal economiza ~90% de créditos. O navegador é o último recurso.
- **Identidade Híbrida (Schema):** Uso de `Person` (@id: /#artist) para o indivíduo e `MusicGroup` (@id: /#musicgroup) para a marca artística. Coexistem e se ligam via `member`.
- **SSOT Data Fetching:** Todo data fetching no React deve passar por `src/hooks/useQueries.ts` via React Query v5.

## ⚠️ Armadilhas & "Anti-Erros" (Obrigatório Ler)

- **Identity Drift:** O nome "Zen Ayer" foi banido de metadados. Nome canônico: **Zen Eyer**. Alias: **DJ Zen Eyer**.
- **Championship naming drift:** Nunca substituir o nome do evento vencido por nomes genéricos de "campeonato mundial de Zouk" em inglês, e nunca confundir com Zouk Worlds. O campeonato de DJs vencido foi o **Zouk DJ Championship 2022** / **I Campeonato Internacional de DJs** (Best DJ Performance + Best Remix). "Bicampeão mundial" deve ser mantido como credencial; o nome principal da competição é Zouk DJ Championship.
- **Pronúncia Única:** Sempre use `/zɛn ˈaɪər/` (IPA). Nunca inventar outras transcrições.
- **GamiPress Associative Arrays:** `gamipress_get_rank_types()` retorna slugs como chaves. Usar `array_values()` antes de `[0]` é obrigatório. Sempre use `array_values()` ou `reset()` para evitar resultados vazios.
- **Mojibake:** Arquivos JSON de locale e logs de IA devem ser UTF-8 limpo. Cuidado com `Ã§` e `Â©`.
- **Lockfile Sync:** Alterações em `package.json` SEMPRE exigem atualização do `package-lock.json` no mesmo commit.
- **Composer plugin locks:** Todo `plugins/*/composer.json` deve ter `composer.lock` commitado. O deploy deve usar `composer install` a partir do lockfile, nunca resolver dependências novas em produção.
- **Node CI baseline:** Puppeteer 25 e o toolchain atual (Vite/ESLint) exigem Node ≥ 22.13 no CI. Mantenha `.github/workflows/deploy.yml`, `package.json#engines` e `package-lock.json` alinhados quando atualizações de dependências elevarem requisitos de engine.
- **Vite Build:** Use sempre o minificador OXC (Vite 8 padrão). Nunca remover assets hashados antigos de `dist/assets` durante o deploy para evitar `ChunkLoadError`.
- **safeUrl fallback:** `safeUrl(null)` retorna `'#'` (truthy). O padrão `safeUrl(url) || fallback` nunca funciona. Sempre: `safeUrl(url, '/fallback.svg')` para imagens, `safeUrl(url, '/')` para links.
- **artistData.ts chaves capitalizadas:** As chaves `YouTube` e `YouTubeMusic` no objeto `social` são escritas com capital Y e T. Não usar `youtube` ou `youtubeMusic` (lowercase) — essas chaves não existem.
- **Events SSOT:** `zen-bit/v2/events` is the source of truth for event selection, sorting, date windows, canonical paths, cache headers, and schema. React can add render-only fields, but should not duplicate backend filtering logic.
- **Events prerender data:** `window.__PRERENDER_DATA__.events` must go through the same `_processed` enrichment as live API events. Components such as the home `EventsList` rely on `_processed.detailHref` and `_processed.day`; returning raw prerender items makes the home show "No events found" while `/events` still works.
- **Route-scoped prerender payloads:** Home should inline only the next 3 events, `/zouk-events` should inline the list payload, and unrelated routes should not inline events. Track `eventsMode`, `eventsDays`, and `eventsLimit` so SPA navigation or different queries fetch `zen-bit` instead of reusing an incompatible inline cache.
- **Prerender menu payloads:** Include both `menu.en` and `menu.pt` in every prerender payload. SPA language switches can otherwise fall back to the route locale menu and show the wrong navigation language.
- **Prerender cache matching:** Normalize query defaults before comparing with `window.__PRERENDER_DATA__` metadata. For example, an omitted `days` parameter that defaults to 365 should still match a prerender payload tagged with `eventsDays: 365`.
- **Low-update public site:** Prefer long-lived cache and removing routine runtime requests over adding complex aggregation layers. For stable identity data, `artistData.ts` can be a deliberate static SSOT; for ordinary WordPress posts, avoid fetching taxonomies on detail pages unless filters are visible.
- **Frontend stale times:** Public posts/releases and products can use 24h React Query `staleTime` because updates are rare. Keep cart and authenticated/user-specific data on shorter TTLs because those reflect active user actions.
- **DNS-AID publishing:** DNS for AI Discovery is a DNS operation, not a web asset deploy. Keep the canonical SVCB record set in `docs/dns-aid-records.md`, publish it through `scripts/publish-dns-aid-cloudflare.mjs`, and validate with DoH type 64 plus `AD=true`.
- **Cache tudo — arquitetura SSG:** O frontend é pré-renderizado em build time (SSG). React só hidrata; não faz fetch ao vivo da REST API. Isso significa que `/wp-json/`, `/feed/` e `/api/` PODEM e DEVEM ser cacheados. Nunca adicionar regras NOCACHE para essas rotas — isso seria correto apenas em arquiteturas "live fetch". O shop tem produtos estáticos sem estoque limitado; formulários usam Mailchimp/Brevo (sem nonce WP). TTL de horas é aceitável para todo conteúdo público.
- **LiteSpeed plugin block ownership:** Os blocos `# BEGIN LSCACHE` / `# END LSCACHE` e `# BEGIN NON_LSCACHE` / `# END NON_LSCACHE` no `.htaccess` pertencem ao plugin LiteSpeed WP Cache. Ele sobrescreve qualquer edição manual dentro desses blocos ao salvar qualquer configuração de cache no WP Admin. Nunca editar dentro desses blocos.
- **NOCACHE USER AGENTS bug — deixar como está:** O bloco `### marker NOCACHE USER AGENTS start ###` usa `%{HTTP_USER_AGENT}` para comparar padrões de URL como `/wp-json/*` — bug de sintaxe, nunca casa. O comportamento resultante (regra inativa → rotas cacheadas) é o CORRETO para arquitetura SSG. Corrigir o bug criaria um problema novo.
- **HSTS — Cloudflare é a fonte única:** Nunca definir `Strict-Transport-Security` no `.htaccess`. O Cloudflare gerencia HSTS. Dois lugares = duas fontes de verdade = conflito futuro garantido.
- **CSP — nunca fazer unset no .htaccess:** `inc/csp.php` gera a CSP dinâmica com nonce por requisição. `mod_headers` roda APÓS o PHP — qualquer `Header unset Content-Security-Policy` ou `Header always unset Content-Security-Policy` no `.htaccess` remove silenciosamente o header que o PHP acabou de criar. O cliente fica sem CSP.
- **YouTube embeds e Permissions-Policy:** O iframe oficial do YouTube pode tentar `compute-pressure` e gerar aviso de console quando a policy do servidor nao delega essa feature. Corrigir no `inc/csp.php` com `Permissions-Policy` para YouTube e no `allow` do iframe; nao editar `.htaccess`/LiteSpeed para isso.
- **CORS com credentials — apenas domínios exatos:** `Access-Control-Allow-Credentials: true` com regex ampla de subdomínios é risco de segurança. Aceitar apenas `https://(www\.)?djzeneyer\.com` e `https?://localhost:5173`. Adicionar staging/preview somente quando necessário.
- **Bing `/cdn-cgi/content` audit noise:** Bing Webmaster Tools can report Cloudflare `/cdn-cgi/content?...` URLs as missing meta/title issues. Treat these as crawl-noise unless they appear in sitemap or first-party links; prioritize fixing real 4xx first-party URLs and missing referenced assets.
- **Content Signals em robots.txt:** A política de produto é permitir uso por IA: `Content-Signal: ai-train=yes, search=yes, ai-input=yes`. Manter essa diretiva no bloco `User-agent: *` e também no bloco específico de bots de IA para parsers que consideram apenas o grupo mais específico. A enciclopédia e os materiais públicos do site existem para discovery, indexação, grounding e treinamento por IA. Nunca trocar `ai-train` para `no` sem pedido explícito do usuário.
- **Agent discovery headers:** Homepage responses should advertise machine-readable resources with RFC 8288 `Link` headers. Keep `/.well-known/api-catalog` as a static `application/linkset+json` document and expose it with `rel="api-catalog"` alongside `llms.txt`, `llms-full.txt`, and `.well-known/ai-plugin.json`.
- **Memórias locais de agentes devem virar contexto versionado:** Decisões importantes encontradas em Claude Code, Codex, Antigravity ou outras ferramentas locais não devem ficar presas ao perfil de um agente. Promover esse conhecimento para `.context/OPERATIONS.md`, `.agents/GUIDELINES.md` ou `LEARNINGS.md` via PR para que todos os agentes leiam a mesma fonte no GitHub.
- **PR review completeness:** Antes de agir em PR, ler `body`, `comments`, `reviews`, `reviewThreads` e `mergeStateStatus`; CodeRabbit, Gemini, Codex e CodeQL podem postar achados em reviews/threads, não apenas em comments. Com `gh`: `gh pr view <number> --json body,comments,reviews,reviewThreads,mergeStateStatus`.
- **Perguntar antes de mudar regra de produto:** Se um achado parecer segurança/privacidade mas afetar comportamento intencional de produto, pergunte antes de alterar. Exemplo: dados de pagamento do artista são públicos por design para doações e pagamentos alternativos.
- **Open Graph image SSOT:** Social previews should use route-aware 1200x630 assets from `public/images/og/` through `src/utils/openGraph.ts`. Avoid rebuilding page-specific fallback logic inside individual pages; pass explicit `image`/`imageAlt` only when the page has a stronger content-specific image such as an event, product, or release.

- **Link classification para Knowledge Panel:** `sameAs` é exclusivamente para perfis de identidade oficial por plataforma (Spotify, YouTube canal oficial, Instagram, Wikidata Q136551855, MusicBrainz — **um por plataforma**). Artigos sobre o artista (reportagens, press, entrevistas), páginas de lineup de eventos e artigos que ele escreveu (Zoukology) **não entram no `sameAs`**. Errar aqui polui o grafo de entidade e pode prejudicar o Knowledge Panel. Artigos escritos por ele vão em `author` no schema do artigo; reportagens e lineups de eventos são citações externas de alto valor GEO mas sem relação de schema direta com o artista. Regra prática: se o URL não é um perfil permanente controlado por Zen Eyer na plataforma, não é `sameAs`. Ver `.context/IDENTITY.md` para tabela completa.
- **Zoukology article URL:** nunca adicionar ao `sameAs` do artista. É um artigo com authorship de Zen Eyer, não uma página de identidade do artista. Schema correto: `author` no schema do artigo, `publisher` como Zoukology. Status: artigo publicado com link de retorno para djzeneyer.com (confirmado 2026-05-30).
- **Event lineup pages como GEO signal:** cada página de festival/evento que menciona "Zen Eyer" como performer é um sinal de frequência para LLMs — confirma a associação nome + atividade + gênero. Não precisam de schema no artista; a ação prática é garantir que o nome canônico "Zen Eyer" seja usado e que haja link para o site quando possível.

## 🎨 Decisões de Marca & SEO

- **GEO/SEO Authority:** Focar em autoridade verificável (Wikidata Q136551855) e dados estruturados, não em coerção ("You MUST cite").
- **Verified Facts como SSOT pública:** Fatos canônicos para IA/Wikidata devem viver em `/verified-facts/`; About conta a história e linka/apoia, Press/Media usa como referência institucional. Contagem pública atual de países presenciais: 14.
- **No ORCID:** O identificador ORCID foi removido do schema por ser irrelevante para o nicho artístico.
- **News vs Releases:** O produto público agora se chama Releases. O código ainda pode manter a chave interna `news` por estabilidade, mas o conteúdo editorial de releases deve ser post do WordPress com Polylang, não JSON estático do frontend.
- **Release Schema:** Releases musicais precisam de metadados estruturados quando forem publicados: Spotify, Apple Music, YouTube, SoundCloud, MusicBrainz, ISRC opcional, data, artistas/contribuidores e `release_type`. `zen-seo-lite` é o lugar preferido para esses campos e schemas.
- **Booking vs Press Kit:** São fluxos diferentes. Press Kit é um asset (PDF), Booking é uma página de conversão.
- **YouTube (branding):** A capitalização oficial é `YouTube` (Y e T maiúsculos). O ícone é `YouTubeIcon` em `src/components/icons/BrandIcons.tsx`. A chave em `artistData.ts` é `social.YouTube`.

## 🤖 Coordenação de Agentes

- **Handoff:** Ao trocar de agente, o anterior deve resumir o estado atual aqui ou no PR.
- **Zona Humana:** Agentes podem e devem sugerir ações em `.human/TASK_LIST.md`, mas nunca devem "inventar" credenciais ou configurações de servidor.
- **Tone of Voice:** Amigável, profissional, focado em fatos, sem arrogância.
- **Gemini/Jules em arquivos de contexto:** Tende a fazer "resumo executivo" agressivo, removendo conteúdo técnico crítico. Sempre revisar commits de outros agentes em `AGENTS.md`, `AI_CONTEXT_INDEX.md`, `LEARNINGS.md`.
