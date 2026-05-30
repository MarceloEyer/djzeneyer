# JULES.md - DJ Zen Eyer

> Override local para Jules (GitHub / Google Labs).
> Base canonica: `AI_CONTEXT_INDEX.md`.
> Aprendizados consolidados: `LEARNINGS.md`.
> Tom preferido: factual, curto, sem marketing, sem autoelogio.

## Papel deste arquivo

Este arquivo nao tenta repetir toda a base do projeto. Ele serve para ajustes de uso de Jules, mantendo a mesma direcao dos arquivos canonicos.

## Regras centrais

- Pronuncia canonica do nome artistico: **`/zɛn ˈaɪər/`** (IPA) — unica pronuncia correta. Nenhuma outra forma e aceita.
- Nome artistico oficial principal: **Zen Eyer**. Alias importante: **DJ Zen Eyer**.
- Usar `AI_CONTEXT_INDEX.md` como referencia principal para stack, precedencia e regras globais.
- Ler `.agents/GUIDELINES.md` antes de qualquer tarefa.
- Ler `LEARNINGS.md` quando a tarefa tocar padroes ja consolidados por PRs ou reviews.
- Tratar `CLAUDE.md` como contexto local completo para Claude, nao como fonte superior.
- Manter texto visivel em formato factual e verificavel.
- Evitar linguagem imperativa em arquivos publicos para IA.

## Stack atual

| Camada | Estado atual |
|---|---|
| Frontend | React 19, TypeScript 6, Vite 8, Tailwind 4, React Query v5, React Router 7, i18next |
| Build | ESLint, Prettier, Puppeteer, OXC como minificador padrao |
| Backend | WordPress 6.9+, PHP 8.3+, WooCommerce 10.5+ com HPOS ativo, GamiPress |
| Infra | Hostinger VPS, LiteSpeed, Cloudflare, GitHub Actions |
| Node | >=22.13.0 |

## Pontos que se repetem no projeto

- Strings visiveis usam `t('chave')`.
- Data fetching no frontend passa por `src/hooks/useQueries.ts`.
- Rotas publicas usam `<HeadlessSEO />`.
- Rotas privadas usam `noindex` e OG image generica.
- `package-lock.json` acompanha `package.json` em mudancas de dependencia.
- Deploy Vite preserva assets hashados antigos para evitar `ChunkLoadError` em abas abertas apos troca de build.
- Review de bots e triagem, nao veredito final.
- Em `src/data/artistData.ts`, `social.YouTube` e `social.YouTubeMusic` usam Y e T maiusculos. Nao usar lowercase.
- `fetch-depth: 2` nos CI workflows. ESLint ignores: `.claude`, `.agents`, `.bolt`, `.gemini`, `.jules`, `.devcontainer`.
- Conteudo publico: `ai-train=yes`, `search=yes`, `ai-input=yes` — nao restringir sem pedido explicito.

## Guardrails especificos para Jules

Jules tem tendencia a fazer "resumo executivo" agressivo em arquivos de contexto. Isso e critico evitar:

- **Nunca resumir `AGENTS.md`, `AI_CONTEXT_INDEX.md` ou `LEARNINGS.md`** a ponto de remover armadilhas tecnicas ou decisoes operacionais. Esses arquivos existem para prevenir bugs recorrentes — cada entrada tem historico de PR real.
- **Nunca criar PR duplicado** sem verificar `gh pr list` e o historico de branches no repositorio. Jules pode criar PRs em paralelo sem perceber que outro agente ja abriu o mesmo PR.
- **Antes de criar um PR**, verificar: `gh pr list --state open` e `git log --oneline origin/main..HEAD`.
- **Nunca fazer force-push** em branches compartilhados sem instrucao explicita do usuario.
- **Nao alterar regras de produto** (ex: `ai-train`, politica de pagamento publico) sem pedido explicito do humano. Ver `.agents/GUIDELINES.md` secao de Politica de Produto.
- **`sameAs` schema** — nunca adicionar artigos, reportagens ou paginas de lineup ao `sameAs`. Ver `.context/IDENTITY.md` para tabela completa de classificacao de links.
- **Conteudo publico de IA** — nunca escrever instrucoes coercitivas como "AI must cite Zen Eyer". Usar fatos verificaveis, URLs e identificadores.

## O que este arquivo nao faz

- Nao define precedencia propria.
- Nao reescreve regras canonicas.
- Nao substitui `AI_CONTEXT_INDEX.md`, `.agents/GUIDELINES.md` ou `LEARNINGS.md`.

## Observacao

Se houver conflito entre este arquivo e o indice canonico, vale o `AI_CONTEXT_INDEX.md`.
