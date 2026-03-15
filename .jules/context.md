# Contexto Arquitetural: DJ Zen Eyer

Este documento serve como a base de entendimento do ecossistema e arquitetura do DJ Zen Eyer, permitindo o alinhamento rápido em tarefas futuras.

## 1. Visão Geral (A Experiência)
- **O que é:** Plataforma web oficial do DJ Zen Eyer, Bicampeão Mundial de Brazilian Zouk.
- **A Essência:** Uma interface "SPA" inspirada em MMORPG contemporâneo (Tribo Zen, XP, Ranks, Azul Elétrico), unindo estética premium e navegação instantânea.
- **Produção:** `djzeneyer.com`

## 2. A Stack Canônica
- **Frontend:** React 18, TypeScript strict, Vite 7, Tailwind 3. React Router 7 gerencia navegação, React Query v5 lida com estado/fetch de dados, i18next (Inglês e Português).
- **Backend (Headless CMS):** WordPress 6.0+ (recomendado 6.9+) e PHP 8.1+ (necessário para o pacote `zengame`). As funcionalidades incluem WooCommerce (ingressos e músicas) e GamiPress.
- **Plugins Ativos e Exclusivos do Projeto:**
  - `zeneyer-auth`: Autenticação via JWT + Google OAuth (Namespace: `zeneyer-auth/v1`).
  - `zen-seo-lite`: Solução completa SEO para o modo headless. (Namespace: `zen-seo/v1`).
  - `zen-bit`: Integração e cache Bandsintown para os Eventos. (Namespace: `zen-bit/v2`).
  - `zengame`: Gamificação centralizada e SSOT do leaderboard/progresso. (Namespace: `zengame/v1`).
- **Infraestrutura:** Hostinger VPS (porta SSH 65002), LiteSpeed (Server Cache), Cloudflare (Edge Cache), GitHub Actions (Automação de Build & Deploy).
- **Ambiente Dev:** Node.js 20+.

## 3. As Quatro Regras de Ouro do Build e Deploy
Para garantir performance impecável e indexação orgânica, este repositório segue a rigor uma filosofia "Build Offline" + SSG (Static Site Generation).

1. **O Princípio do Build Offline ("Sem API"):**
   - O processo de build (`npm run build`, `npm run build:full`) é executado **isolado** no GitHub Actions.
   - **NUNCA** há acesso ao banco de dados ou a API REST de produção do WordPress nesse momento.
   - Logo, os arquivos ou scripts de build (ex: geração de sitemap e rotas no Node.js) não devem tentar realizar `fetch` externos na API de produção, a menos que haja um mock robusto em falhas ou fallback local pré-definido.
   - Os metadados SEO estáticos dependem do App Shell do HTML, que deve ser montado antes de qualquer hidratação assíncrona profunda do React.

2. **A Estratégia de Prerender (Shell Only):**
   - Utilizamos um script customizado (`scripts/prerender.js`) via Puppeteer.
   - **Objetivo:** Pré-renderizar o roteamento gerando as pastas (ex: `/dist/about/index.html`) e prevenindo erros 404 em acessos diretos no CDN.
   - O Prerender deve focar em salvar instantaneamente a base estrutural (`Header`, `Footer`, `HeadlessSEO`). O SPA React e React Query cuidarão do restante quando o cliente carregar e injetar em `window.__PRERENDER_DATA__`.

3. **A Única Fonte de Verdade de Rotas (SSOT):**
   - As rotas só existem se estiverem declaradas no **`scripts/routes-config.json`**.
   - O React Router (Frontend), o Sitemap (`scripts/generate-sitemap.js`) e a verificação do pipeline no CI leem este JSON. **Nunca deixe de atualizá-lo ao criar uma nova página.**

4. **Hierarquia de Diretórios (Fronteiras Arquiteturais):**
   - `src/`: Lógica front-end, UIs React, Contextos, hooks (`useQueries.ts`) e UX.
   - `scripts/`: Scripts do ecossistema NodeJS de build, teste de performance e SSR.
   - `inc/` e `functions.php`: A orquestração no tema Headless do WordPress (Configuração de CORS, Vite SPA Injection, sanitização e limpeza).
   - `plugins/`: Lógica pesada e modularizada de regras de negócio (SEO, Gamificação, Auth).
   - `public/`: Assets globais intocáveis (favicon, bots de SEO, ai-bots.txt). O arquivo `index.html` não é estático final, mas um "Vite Template" dinâmico para build e injeção do Prerender.

## 4. O Cérebro: useQueries.ts e Performance de Contexto
- `src/hooks/useQueries.ts` atua como o **cubo central** de chamadas de dados do repositório, garantindo estabilidade e cache global via React Query. Nunca declare `fetch` manual.
- **Problema clássico:** Contextos (User, GamiPress, Cart) não devem disparar renderizações da árvore inteira quando recebem um payload instável de funções ou dados imutáveis. Como base do DJ Zen Eyer, você deve **envolver todos os valores de Provider em hooks de memoização do React (`useMemo`)**, definindo o array de dependências corretamente para os provedores (`CartContext`, `UserContext`). Otimizar pequenas iterações de laços (arrays pequenos com map) é um erro de engenharia se isso afetar dependências sensíveis e causar renders artificiais.
- **N+1 Queries:** Não cause regressão e latência na API REST utilizando lógicas encadeadas e objetos aninhados padrão do WordPress (o infame `_embed` e busca recursiva de metas em loops). **Prefira customizar campos enxutos ou buscar blocos `_fields` precisos**, assim como buscar e hidratar metas/caches na pré-query.

## 5. SEO / Inteligência Artificial (GEO e AEO)
O repositório aposta no ranqueamento E-E-A-T. Você usará o `HeadlessSEO` e seus Schemas JSON-LD. Além disso, existe em `/public/ai-bots.txt` orientações de Crawler. Qualquer nova funcionalidade visual deve levar em consideração o Google Knowledge Graph. Em SEO, Marcelo Eyer Fernandes deve ser mapeado como `@type: 'Person'` combinando `'MusicGroup'` em dados semânticos complexos quando pertinente (MusicEvent, Track, Order).
