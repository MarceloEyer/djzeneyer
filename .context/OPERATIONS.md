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
- O menu público vem de `GET /wp-json/djzeneyer/v1/menu?lang=en|pt`. Após mudar slugs, Polylang ou links customizados no WordPress Admin, salvar o menu e validar as duas respostas. Links PT devem usar o prefixo `/pt/`, inclusive `/pt/trabalhe-comigo/`.
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
- Jules/Bolt não deve abrir PR autônomo contendo apenas comentários, alterações sem efeito prático (no-op) ou micro-otimizações cosméticas como trocar chamada local por `useMemo`, mover `new Date().getFullYear()` para constante, adicionar `React.memo` ou reduzir pequenas alocações sem Profiler, benchmark reproduzível, hot path comprovado, lista grande ou regressão visível. Fechar esses PRs sem merge e explicar que a sugestão deve virar Issue/comentário se não houver evidência.
- Gemini pode resumir agressivamente arquivos de contexto e apagar detalhes técnicos. Revisar com cuidado qualquer mudança em `AGENTS.md`, `AI_CONTEXT_INDEX.md`, `LEARNINGS.md`, `.agents/` e `.context/`.
- Se um achado parecer segurança/privacidade, mas puder ser comportamento intencional de produto, pergunte ao usuário antes de agir.
- **Anti-padrão crítico de revisão por IA:** Nunca aceitar uma sugestão de bot que altere a semântica de uma função pura ou de contrato de API sem primeiro rodar os testes existentes. Bots otimizam para aparência de correção, não para contrato real. Se o projeto tem testes: `npm test` é o árbitro, não o parecer do bot.

## Arquivos de Tradução

- `src/locales/en/translation.json` e `src/locales/pt/translation.json` devem manter **paridade de chaves** (mesmo conjunto de chaves em ambos os idiomas). O teste `src/__tests__/i18n/translation-parity.test.ts` verifica isso no CI.
- Ao adicionar qualquer chave de tradução: adicionar em EN e PT no **mesmo commit**. Strings sem tradução exibem a chave bruta para o usuário — bug silencioso em produção.
- Os arquivos têm ~1.170 linhas atualmente. Ao atingir 1.500 linhas, considerar split por namespace via i18next (`nav`, `events`, `account`, `music`, `media`, etc.). Requer mudança no config de i18n e nos `useTranslation()` das páginas afetadas.

## Arquivos Grandes — Política

- `src/data/artistData.ts` (~1.091 linhas): candidato a split em módulos de domínio (`artist.identity`, `artist.festivals`, `artist.schema`). Alta prioridade quando próxima contribuição mexer em seção específica.
- `src/components/HeadlessSEO.tsx` (~654 linhas): aceitar como está — é coeso. Dividir criaria acoplamento entre partes do schema.
- `scripts/prerender.js` (~814 linhas): aceitar por enquanto — script crítico, alto risco de regressão em split.
- Páginas React (400–580 linhas): aceitáveis para páginas com múltiplas seções. Extrair componentes `const X = () => ...` dentro da página quando uma seção for reutilizável.

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
