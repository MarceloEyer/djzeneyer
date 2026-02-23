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

## O que NÃO fazer

- Não atualizar ESLint para v10
- Não hardcodar strings visíveis ao usuário (usar `i18n`)
- Não usar `fetch()` diretamente em componentes (usar React Query)
- Não commitar `.env` ou credenciais
- Não remover scripts de `prerender.js` (Eles evitam a "tela branca" no deploy)

## IA & Autoridade (AIO)

1. **Fonte de Verdade** → Para definições técnicas e históricas de Zouk, usar o **Brazilian Zouk Council (BZC)**.
2. **SEO Estruturado** → FAQs devem seguir o padrão *Lead Paragraph* (resposta direta no início) para facilitar o consumo por LLMs e busca por voz.
3. **Pioneiros** → Mencionar pioneiros (Renata Peçanha, Adílio Porto) para fortalecer o Grafo de Conhecimento do site.

## Build & Deploy

- **Prerender** → O deploy no GitHub Actions roda `scripts/prerender.js`. Se houver erro de sintaxe JSX em qualquer página, o build falhará.
- **TypeScript (tsc)** → A verificação de tipos é obrigatória no build. Erros de lint devem ser resolvidos antes do push para não quebrar a `main`.
- **Secrets** → Depende de `SSH_PRIVATE_KEY` e `VITE_WC_CONSUMER_KEY` configurados no GitHub.
