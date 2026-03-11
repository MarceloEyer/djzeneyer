# GEMINI.md - DJ Zen Eyer

> Contexto para Gemini/Jules/Gemini Code Assist.
> Idioma padrao: Portugues Brasileiro.

## Precedencia

- Em caso de divergencia com outro arquivo, siga `AI_CONTEXT_INDEX.md`.
- Fonte final sempre e o codigo do repositorio.

## Baseline Tecnico

- WordPress Headless (REST) + React SPA
- React 18 + TypeScript + Vite 7 + Tailwind 3 + React Query v5 + React Router 7 + i18next
- WordPress 6.0+, PHP 8.1+, Node 20+

## Regras Obrigatorias

1. i18n para toda string visivel
2. Hooks React Query centralizados em `src/hooks/useQueries.ts`
3. Nao usar `fetch()` direto em componentes
4. Lazy loading para paginas
5. `<HeadlessSEO />` por pagina
6. Backend filtra; frontend renderiza
7. Nao migrar ESLint para v10
8. Nao usar segredos no git
9. Build local (`npm run build`) obrigatorio antes de push (evita travamento de Prerender)
10. Arquivos i18n (`translation.json`) DEVEM ser salvos em UTF-8 (Strict). **PROIBIDO** qualquer caractere estranho ou mojibake (ex: Ã§, Ã£). Use acentos normais.

## Namespaces Canonicos

- `djzeneyer/v1`
- `zeneyer-auth/v1`
- `zen-bit/v2`
- `zengame/v1`
- `zen-seo/v1`

## Preferencias do projeto

<<<<<<< ours
- Gradientes sutis/neon permitidos (sem gradientes em texto)
- Sem player de musica interno (apenas links externos)
- Solucoes simples e robustas
- Tom de voz: Conversa próxima, humilde e generosa ("Amigo Zen")
- Prioridade Máxima: Velocidade de carregamento e facilidade de audição (links diretos pro Spotify)
- Filtro de Estados: Facilitar para fãs locais encontrarem eventos
=======
- Não atualizar ESLint para v10
- Não hardcodar strings visíveis ao usuário (usar `i18n`)
- Não usar `fetch()` diretamente em componentes (usar React Query)
- Não commitar `.env` ou credenciais
- Não remover scripts de `prerender.js` (Eles evitam a "tela branca" no deploy)
- **Não usar gradientes** (O usuário odeia). Preferir cores sólidas e camadas de opacidade.

## IA & Autoridade (AIO)

1. **Fonte de Verdade** → Para definições técnicas e históricas de Zouk, usar o **Brazilian Zouk Council (BZC)**.
2. **SEO Estruturado** → FAQs devem seguir o padrão *Lead Paragraph* (resposta direta no início) para facilitar o consumo por LLMs e busca por voz.
3. **Pioneiros** → Mencionar pioneiros (Renata Peçanha, Adílio Porto) para fortalecer o Grafo de Conhecimento do site.

## Build & Deploy

- **Prerender** → O deploy no GitHub Actions roda `scripts/prerender.js`. Se houver erro de sintaxe JSX em qualquer página, o build falhará.
- **TypeScript (tsc)** → A verificação de tipos é obrigatória no build. Erros de lint devem ser resolvidos antes do push para não quebrar a `main`.
- **Secrets** → Depende de `SSH_PRIVATE_KEY` e `VITE_WC_CONSUMER_KEY` configurados no GitHub.

## Ambiente de Desenvolvimento

- **IDE:** VS Code com configurações em `.vscode/settings.json` (Prettier + ESLint auto-fix).
- **Sem Python:** O projeto é estritamente React/PHP. Não adicionar arquivos `.py` para evitar conflitos com o servidor de linguagem Pyre2.
- **Extensões Recomendadas:** Listadas em `.vscode/extensions.json`. Priorizar ESLint, Tailwind CSS IntelliSense e Intelephense.

## Contexto Técnico & Preferências

1. **Escala** → O site é voltado para um público nichado e de baixo volume. Não há necessidade de otimizações para "milhões de usuários".
2. **Infraestrutura** → Hospedagem simples (vps/compartilhada). Priorizar economia de CPU e memória.
3. **Caching** → Como os dados (conquistas, pontos) não mudam com alta frequência, **preferir cache persistente (transients) mais longos** (ex: 24h ou mais) em vez de requisições frequentes ao banco de dados.
4. **Simplicidade** → Soluções simples e robustas são melhores que arquiteturas complexas de alta performance.

## Infraestrutura & Diagnóstico (Snapshot 2026-02-24)

- **WordPress:** 6.9.1 (Custom/Beta?) | **PHP:** 8.3.30 (LiteSpeed) | **DB:** MariaDB 11.8.3
- **Paths:** `/home/u790739895/domains/djzeneyer/public_html`
- **Limites PHP:** `memory_limit servidor: 1536M`, `memory_limit WP: 2GB` (conforme WC Report).
- **Cache:** `WP_CACHE` ativo via LiteSpeed Cache. **Redis:** Inacessível. **OPcache:** Ativo.
- **Plugins Ativos (10):** GamiPress, LiteSpeed Cache, MailPoet, PagBank, Polylang, WooCommerce, Zen BIT, Zen Plugins Overview, Zen SEO Lite Pro, ZenEyer Auth Pro.
- **E-commerce:** WooCommerce 10.5.2 com HPOS ativo (High-Performance Order Storage).
- **Tráfego:** Baixo volume. Foco em cache persistente (transients) e compressão Gzip/Brotli via `.htaccess`.


## Governança Canônica
- Para execução operacional e resolução de conflitos de instrução, usar `docs/AI_GOVERNANCE.md` como referência canônica.
>>>>>>> theirs
