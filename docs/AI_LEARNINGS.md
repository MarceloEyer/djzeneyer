# AI_LEARNINGS.md - Aprendizados consolidados

> Memoria operacional para bots de IA que trabalham neste repositorio.
> Objetivo: evitar repeticao de erros, manter padroes canonicamente aceitos e reutilizar decisoes ja validadas em PRs fechados, reviews e portagens manuais.

## Como usar

- Leia este arquivo depois de `AI_CONTEXT_INDEX.md` e `AGENTS.md`.
- Antes de sugerir novas abordagens, verifique se o padrao ja foi consolidado aqui.
- Se um PR novo contrariar estes aprendizados, trate como excecao documentada e nao como padrao novo.

## Aprendizados por tema

### Schema e SEO

- Para a entidade publica do artista, mantenha uma unica entidade `Person` em `ARTIST_SCHEMA_BASE`.
- Nao crie um no `MusicGroup` separado para a pessoa fisica.
- Nao use ORCID no grafo do artista; use apenas identificadores aprovados e verificaveis.
- Em `sameAs`, prefira anchors fortes e oficiais: Wikidata, MusicBrainz, Discogs e perfis principais de streaming/social. Evite LinkedIn, Mixcloud e perfis fracos sem utilidade clara.
- Quando uma entrada em `subjectOf` comprovar a presenca do artista, a URL deve apontar para a pagina exata de evidencia, nao para o root do site.
- Em paginas com FAQ expansivel, `q4` e `q5` so entram quando a chave existir no locale atual.
- Quando o texto for visivel ao usuario, use `t('chave')` e nao string hardcoded.

### i18n e UI

- `About`, `FAQ` e `PressKit` devem continuar resilientes a keys faltantes e falhas de clipboard.
- Se um handler de copia usar `navigator.clipboard`, sempre trate erro e restaure o estado visual.
- Nao introduza copia canonica fora dos arquivos de locale quando ja houver estrutura i18n para isso.

### Dependencias e seguranca

- PRs de seguranca em dependencias so contam quando `package-lock.json` tambem e atualizado.
- Se o deploy usa `npm ci`, package.json e lockfile precisam ficar sincronizados.
- Overrides de dependencia devem ser limitados ao major esperado, nunca com faixa aberta que permita upgrade futuro acidental.

### Infra, cache e auth

- Em producao single-site, nao definir `DOMAIN_CURRENT_SITE`.
- O JWT canonico do `zeneyer-auth` usa `ZENEYER_JWT_SECRET`; `JWT_AUTH_SECRET_KEY` e `SIMPLE_JWT_PRIVATE_KEY` ficam apenas como compatibilidade legada.
- O registro protegido do `zeneyer-auth` depende de `ZEN_TURNSTILE_SITE_KEY` e `ZEN_TURNSTILE_SECRET_KEY` no `wp-config.php`.
- Em LiteSpeed Cache, manter conservador o caminho de SPA: `optm-js_min=false`, `optm-css_min=false`, `optm-js_defer=1`, exclusoes de `react`, `react-dom`, `framer-motion` e bundles do tema.
- Quando a configuracao do LiteSpeed ja estiver estável em producao, nao ligar minificacao/combinacao por impulso; teste antes de mudar.
- Se o plano de hospedagem nao oferece Redis ou Memcached, manter `object=false` e documentar isso como limitacao da plataforma, nao como omissao de configuracao.

### Performance e SEO tecnico

- Em sitemaps, listas e transformacoes de schema, prefira single-pass e priming de cache para evitar N+1.
- Em loops de render, reduza alocacoes e preserve estabilidade de referencia quando houver memoizacao.
- Em otimizacoes de SEO tecnico, mantenha o comportamento existente e melhore o custo de execucao, nao so a legibilidade.

### Fluxo de PR

- Quando existir uma PR canonica para o mesmo tema, portagem manual e fechamento da duplicada e preferivel a manter branches paralelos.
- PRs automatizados de bots devem ser tratados como sinais, nao como verdade final.
- Em bursts de PR, espere rate limit de review e reduza duplicacao de triggers.
- Antes de classificar um PR, ler descricao, diff, comments, review threads e reviews automatizados.

### Workflow de bots

- PRs abertos, reabertos ou atualizados devem acionar `@coderabbitai review`, `@codex review` e `@jules`.
- Se o review mostrar apenas rate limit, isso indica saturacao de pipeline e nao feedback tecnico sobre o codigo.
- Comentarios de bots que apenas resumem ou repetem o contexto devem ser usados como triagem, nao como validacao final.

## Regras derivadas de PRs recentes

- `#317`: centralizar dados pessoais do artista em `artistData.ts` e usar a SSOT em paginas, pagamento e footer; nao deixar strings/contatos espalhados.
- `#317`: em `ZenLinkPage`, toda string visivel ainda precisa vir de i18n, inclusive subtitulos, titulos e mensagens de WhatsApp.
- `#317`: em `paymentMethods`, os campos financeiros devem refletir exatamente o significado da SSOT. Nao trocar `swiftCode`, `achRouting` e `wireRouting`.
- `#379` e `#412`: validar keys de FAQ com `i18n.exists()` antes de renderizar.
- `#412` e `#413`: manter `@type: 'Person'` para Zen Eyer e remover `ORCID` do schema.
- `#371`: nao aceitar remediacao de dependencia sem lockfile sincronizado.
- `#399`, `#400`, `#401`, `#366`: preferir batch priming, single-pass loops e referencias estaveis.
- `#407`: quando um documento de especificacao virar redundante, consolidar o que e util em arquivos canonicos e encerrar a duplicata.
- `#404`: workflow de review de bots deve ser automatico e consistente em todos os eventos relevantes do PR.

## Checklist por tema

### Antes de mexer em SEO / Schema

- [ ] Conferir se a entidade continua como `Person` unica.
- [ ] Confirmar se o identificador usado ja foi validado no `sameAs` ou no grafo canonico.
- [ ] Validar se a pagina privada continua `noindex` e sem avatar do usuario em OG.
- [ ] Verificar se `llms.txt`, `llms-full.txt` e `ai-plugin.json` continuam descritivos, nao imperativos.

### Antes de mexer em i18n / UI

- [ ] Toda string visivel veio de `t('chave')`.
- [ ] PT e EN possuem a mesma chave quando a mudanca afeta interface.
- [ ] `i18n.exists()` foi considerado para campos opcionais ou expansivos.
- [ ] Se houver clipboard, loading ou erro local, existe fallback visual.

### Antes de mexer em dependencia / seguranca

- [ ] `package-lock.json` foi atualizado junto com `package.json`.
- [ ] O override nao abre faixa para major futuro involuntario.
- [ ] O impacto no deploy via `npm ci` foi considerado.
- [ ] A mudanca realmente fecha a vulnerabilidade, nao apenas aponta para ela.

### Antes de mexer em performance / sitemap / schema

- [ ] O processamento e single-pass quando possivel.
- [ ] Caches e caches priming estao coerentes com a origem dos dados.
- [ ] A referencia dos objetos fica estavel quando houver `memo`.
- [ ] Nao foi introduzido N+1 novo por conveniencia de leitura.

### Antes de fechar PRs duplicados

- [ ] Existe um PR canonico para o mesmo tema?
- [ ] As mudancas validas ja foram portadas para o branch escolhido?
- [ ] O branch duplicado pode ser fechado sem perda de informacao?
- [ ] O aprendizado precisa virar regra no `AI_LEARNINGS.md` ou no `AI_CONTEXT_INDEX.md`?

## Resumo pratico

Se a sugestao:

- repete um erro ja corrigido,
- adiciona nova abstracao sem ganho real,
- cria duplicacao de PR ou de schema,
- ou deixa lockfile / locale / cache fora de sincronia,

entao a resposta padrao deve ser: corrigir pelo padrao consolidado, nao abrir um novo padrao.

