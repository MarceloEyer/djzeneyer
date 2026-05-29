# Operational Memory & Agent Coordination

Version: 1.0.0

Este arquivo consolida decisoes operacionais que antes estavam apenas em memorias locais de agentes. Ele deve ser tratado como contexto versionado para Claude, Codex, Jules, Gemini, Copilot e qualquer outro agente trabalhando no repositorio.

## Prioridade do Projeto

- SEO, AEO, GEO e Knowledge Panel sao prioridade central do site.
- Decisoes de conteudo, schema, rotas, APIs publicas e arquivos `.well-known` devem ser avaliadas pela lente de descoberta, autoridade verificavel e grounding por IA.
- `/verified-facts/`, `llms.txt`, `llms-full.txt`, dados estruturados, Wikidata, MusicBrainz e identificadores oficiais sao ativos estrategicos, nao decoracao.
- A politica de produto permite IA treinando, buscando e usando o conteudo publico: `ai-train=yes`, `search=yes`, `ai-input=yes`.

## Cache e Deploy

- O site e WordPress headless + React/Vite com SSG. O frontend e pre-renderizado em build time; visitas publicas nao dependem de fetch REST ao vivo.
- `/wp-json/`, `/feed/` e `/api/` podem e devem ser cacheados. Nao adicionar regras NOCACHE para essas rotas.
- Conteudo publico pode levar horas para propagar. Cache agressivo e uma escolha consciente para performance e SEO.
- Os blocos `# BEGIN LSCACHE` / `# END LSCACHE` e `# BEGIN NON_LSCACHE` / `# END NON_LSCACHE` do `.htaccess` pertencem ao LiteSpeed WP Cache. Nao editar manualmente.
- HSTS e gerenciado pelo Cloudflare. Nao definir `Strict-Transport-Security` no `.htaccess`.
- CSP e gerada por `inc/csp.php`. Nunca adicionar `Header unset Content-Security-Policy` ou `Header always unset Content-Security-Policy` no `.htaccess`.

## IndexNow

- IndexNow esta configurado via GitHub Secret `INDEXNOW_KEY`.
- O deploy publica o key file na raiz do site, limpa cache LiteSpeed e executa `npm run indexnow`.
- O script `scripts/submit-indexnow.mjs` deve aguardar o key file estar acessivel antes de submeter URLs.
- Armadilha conhecida: LiteSpeed pode servir 404/cache antigo logo apos o deploy e causar 403 na API do IndexNow. O fluxo correto e purgar cache e esperar o key file responder com conteudo exato.

## Validacao Local

- PHP local disponivel para lint rapido:

```powershell
& "C:\Users\eyerm\.codex\tools\php-8.4.21\php.exe" -l path\to\file.php
```

- Esse PHP e apenas ferramenta local de desenvolvimento. O CI/servidor usam o ambiente remoto.
- Depois de edicoes em JSX/TSX, especialmente substituicoes automatizadas, validar o arquivo inteiro com TypeScript/build antes de commitar.
- Para mudancas frontend relevantes, prefira `npm run lint` e `npm run build:full` quando o escopo justificar.

## PRs e Revisores de IA

Antes de alterar, fechar, mergear ou recomendar merge de PR, ler:

```bash
gh pr view <number> --json body,comments,reviews,reviewThreads,reviewRequests,mergeStateStatus,mergeable,files
```

- CodeRabbit, CodeQL, Gemini, Copilot e outros bots podem postar em `reviews` e `reviewThreads`, nao apenas em `comments`.
- CodeRabbit costuma ser o revisor de IA mais acionavel.
- CodeQL deve ser tratado como sinal forte de seguranca.
- Qodo pode ser util para bugs de logica.
- Jules pode gerar PRs bons, mas tende a duplicar PRs; verificar duplicidade antes de mergear.
- Gemini pode resumir agressivamente arquivos de contexto e apagar detalhes tecnicos. Revisar com cuidado qualquer mudanca em `AGENTS.md`, `AI_CONTEXT_INDEX.md`, `LEARNINGS.md`, `.agents/` e `.context/`.
- Se um achado parecer seguranca/privacidade, mas puder ser comportamento intencional de produto, pergunte ao usuario antes de agir.

## Google Sign-In e COOP

- O Google Identity Services pode emitir warning de `Cross-Origin-Opener-Policy` no console.
- O fluxo atual funciona via FedCM.
- Se houver warning isolado, nao assumir quebra de login. Validar o POST de auth e o comportamento real antes de alterar headers.

## Fonte de Verdade

- Este arquivo nao substitui o codigo real, `AI_CONTEXT_INDEX.md`, `.agents/GUIDELINES.md`, `.context/IDENTITY.md` ou `LEARNINGS.md`.
- Quando uma decisao operacional nova for descoberta em ferramenta local de agente, promover para este arquivo ou para `LEARNINGS.md` em PR, para que nao fique presa a um unico agente.
