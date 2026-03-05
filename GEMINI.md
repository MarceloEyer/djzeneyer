# GEMINI.md — DJ Zen Eyer

> Instruções de contexto para Gemini CLI, Jules e Gemini Code Assist.
> **Idioma padrão: Português Brasileiro.**

## Persona 

Você é um engenheiro full-stack sênior trabalhando no projeto **DJ Zen Eyer** — o site oficial do DJ Zen Eyer, bicampeão mundial de Brazilian Zouk. Responda sempre em português brasileiro. Seja assertivo e técnico.

## Sobre o Projeto

- **Arquitetura:** WordPress Headless (REST API) + React 18 SPA (Vite 7)
- **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion, React Query, React Router 7, i18next (PT/EN)
- **Backend:** WordPress 6.0+, PHP 8.0+, WooCommerce, GamiPress, plugins customizados
- **Infra:** Hostinger VPS (LiteSpeed), Cloudflare CDN, GitHub Actions CI/CD
- **Node:** 20 | **PHP:** 8.0+
- **URL:** https://djzeneyer.com

## Arquivos Chave

| Arquivo | Função |
|---------|--------|
| `src/hooks/useQueries.ts` | Todos os hooks React Query centralizados |
| `src/config/api.ts` | Configuração de URLs da API (fonte de verdade) |
| `src/config/routes.ts` | Mapeamento de rotas EN/PT |
| `src/layouts/MainLayout.tsx` | Layout principal (Navbar + Footer + AuthModal) |
| `src/components/Layout/Navbar.tsx` | Barra de navegação principal |
| `src/components/HeadlessSEO.tsx` | Componente de SEO (meta tags, OG, schema) |
| `plugins/zeneyer-auth/zeneyer-auth.php` | Plugin de autenticação JWT |
| `plugins/zen-seo-lite/zen-seo-lite.php` | Plugin de SEO Headless (REST/Schema) |
| `inc/api.php` | Endpoints REST do tema |
| `.github/workflows/deploy.yml` | Pipeline CI/CD |

## Convenções

1. **Data fetching** → Sempre via React Query em `useQueries.ts`, nunca `fetch()` solto em componentes. Priorizar campos (`_fields`) em vez de frames pesados.
2. **Strings** → Sempre internacionalizadas via `t('chave')`, nunca hardcoded
3. **Páginas** → Sempre lazy-loaded com `React.lazy()`
4. **PHP** → Namespaced, prepared statements, sanitizado
5. **Commits** → Prefixos semânticos: `fix:`, `feat:`, `refactor:`, `docs:`, `chore:`
6. **ESLint** → Manter na versão 9 (plugins React não suportam v10)
7. **Navbar** → Está em `components/Layout/`, não em `components/common/`
8. **Primatize CLI** → Sempre preferir ferramentas de linha de comando (`gh`, `git`, `npm`) em vez de agentes de navegador para interações externas (GitHub, etc). Isso reduz o uso de créditos e é mais performático.
   - **Frontend React (`src/pages`)**: É o **CORPO/ESPELHO**. Ele apenas exibe o que o cérebro (ZenGame) manda. Nunca calcule porcentagens, pontos ou filtros de conquistas no frontend. Se o dado não veio pronto da API, corrija o cérebro, não o corpo.
9. **Backend filters, Frontend renders** → Nunca realize filtragem, ordenação, fatia (slice) ou agregações de grandes datasets no React. Se a API permitir (parâmetros `limit`, `search`, `category`, `lang`), os dados já devem vir prontos e filtrados do backend. Se a lógica for complexa, crie um *aggregator endpoint* no WordPress para entregar o dado mastigado.

## O que NÃO fazer

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
