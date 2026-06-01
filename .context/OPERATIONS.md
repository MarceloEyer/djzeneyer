# Operational Memory & Agent Coordination

Version: 1.1.0

Este arquivo consolida decisões operacionais que antes estavam apenas em memórias locais de agentes. Ele deve ser tratado como contexto versionado para Claude, Codex, Jules, Gemini, Copilot e qualquer outro agente trabalhando no repositório.

## Prioridade do Projeto

- SEO, AEO, GEO e Knowledge Panel são prioridade central do site.
- Decisões de conteúdo, schema, rotas, APIs públicas e arquivos `.well-known` devem ser avaliadas pela lente de descoberta, autoridade verificável e grounding por IA.
- `/verified-facts/`, `llms.txt`, `llms-full.txt`, dados estruturados, Wikidata, MusicBrainz e identificadores oficiais são ativos estratégicos, não decoração.
- A política de produto permite IA treinando, buscando e usando o conteúdo público: `ai-train=yes`, `search=yes`, `ai-input=yes`.

## Cache e Deploy

- O site é WordPress headless + React/Vite com SSG. O frontend é pré-renderizado em build time; visitas públicas não dependem de fetch REST ao vivo.
- `/wp-json/`, `/feed/` e `/api/` podem e devem ser cacheados. Não adicionar regras NOCACHE para essas rotas.
- Conteúdo público pode levar horas para propagar. Cache agressivo é uma escolha consciente para desempenho e SEO.
- Os blocos `# BEGIN LSCACHE` / `# END LSCACHE` e `# BEGIN NON_LSCACHE` / `# END NON_LSCACHE` do `.htaccess` pertencem ao LiteSpeed WP Cache. Não editar manualmente.
- HSTS é gerenciado pelo Cloudflare. Não definir `Strict-Transport-Security` no `.htaccess`.
- CSP é gerada por `inc/csp.php`. Nunca adicionar `Header unset Content-Security-Policy` ou `Header always unset Content-Security-Policy` no `.htaccess`.

## IndexNow

- IndexNow está configurado via GitHub Secret `INDEXNOW_KEY`.
- O deploy publica o key file na raiz do site, limpa cache LiteSpeed e executa `npm run indexnow`.
- O script `scripts/submit-indexnow.mjs` deve aguardar o key file estar acessível antes de submeter URLs.
- Armadilha conhecida: LiteSpeed pode servir 404/cache antigo logo após o deploy e causar 403 na API do IndexNow. O fluxo correto é purgar cache e esperar o key file responder com conteúdo exato.

## Validação Local

- PHP local disponível para lint rápido:

```powershell
& "$env:USERPROFILE\.codex\tools\php-8.4.21\php.exe" -l path\to\file.php
```

- Esse PHP é apenas ferramenta local de desenvolvimento. O CI/servidor usam o ambiente remoto.
- Depois de edições em JSX/TSX, especialmente substituições automatizadas, validar o arquivo inteiro com TypeScript/build antes de commitar.
- Para mudanças frontend relevantes, prefira `npm run lint` e `npm run build:full` quando o escopo justificar.

## PRs e Revisores de IA

Antes de alterar, fechar, mergear ou recomendar merge de PR, ler:

```bash
gh pr view <number> --json body,comments,reviews,reviewThreads,reviewRequests,mergeStateStatus,mergeable,files
```

- CodeRabbit, CodeQL, Gemini, Copilot e outros bots podem postar em `reviews` e `reviewThreads`, não apenas em `comments`.
- CodeRabbit costuma ser o revisor de IA mais acionável.
- CodeQL deve ser tratado como sinal forte de segurança.
- Qodo pode ser útil para bugs de lógica.
- Jules pode gerar PRs bons, mas tende a duplicar PRs; verificar duplicidade antes de mergear.
- Gemini pode resumir agressivamente arquivos de contexto e apagar detalhes técnicos. Revisar com cuidado qualquer mudança em `AGENTS.md`, `AI_CONTEXT_INDEX.md`, `LEARNINGS.md`, `.agents/` e `.context/`.
- Se um achado parecer segurança/privacidade, mas puder ser comportamento intencional de produto, pergunte ao usuário antes de agir.

## Google Sign-In e COOP

- O Google Identity Services pode emitir warning de `Cross-Origin-Opener-Policy` no console.
- O fluxo atual funciona via FedCM.
- Se houver warning isolado, não assumir quebra de login. Validar o POST de auth e o comportamento real antes de alterar headers.

## Contexto de Agentes

- O repositório já possui `.agents/personas/CLAUDE.md` como contexto local completo para Claude Code.
- Não criar outro `CLAUDE.md` na raiz como fonte paralela enquanto a arquitetura de contexto vigente usar `.agents/personas/`.
- Conteúdo útil para todos os agentes deve ser promovido para `AGENTS.md`, `.agents/GUIDELINES.md`, `.context/OPERATIONS.md` ou `LEARNINGS.md`, conforme a natureza da regra.
- Arquivos de persona podem resumir e direcionar uso local, mas não devem redefinir hierarquia, stack ou regras globais em conflito com `AI_CONTEXT_INDEX.md`.

## Separação Frontend / Backend

**Backend**: WordPress + WooCommerce em `https://djzeneyer.com/wp-json/` (REST API). Dados dinâmicos (pedidos, membros, WooCommerce, GamiPress) vivem aqui. Nunca mockar dados de backend no frontend — usar os hooks de `src/hooks/useQueries.ts`.

**Frontend**: React SPA (Vite). `src/data/artistData.ts` é dados **estáticos do frontend** — SSOT para identidade do artista, festivais, discografia, links sociais. Esses dados não vêm do WordPress e são mantidos diretamente no TypeScript.

### Regras para `ARTIST.festivals[]`

- `upcoming` é campo **opcional** e pode ficar stale. **Não é fonte de verdade** para categorização.
- Categorização correta deriva de comparação de `f.date` com a data atual em runtime: `new Date(f.date) >= today`.
- Ordenação correta: **upcoming → crescente** (mais próximo primeiro); **past → decrescente** (mais recente primeiro).
- Ao adicionar evento passado: atualizar `date`, omitir `upcoming` ou setar `upcoming: false`. `ZoukFestivalsPage` categoriza automaticamente pela data.

## Fonte de Verdade

- Este arquivo não substitui o código real, `AI_CONTEXT_INDEX.md`, `.agents/GUIDELINES.md`, `.context/IDENTITY.md` ou `LEARNINGS.md`.
- Quando uma decisão operacional nova for descoberta em ferramenta local de agente, promover para este arquivo, `.agents/GUIDELINES.md` ou `LEARNINGS.md` em PR, para que não fique presa a um único agente.