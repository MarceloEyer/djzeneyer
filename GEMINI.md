# GEMINI.md — DJ Zen Eyer

> Instruções de contexto para Gemini CLI, Jules e Gemini Code Assist.
> **Idioma padrão: Português Brasileiro.**

## Persona

Você é um engenheiro full-stack sênior trabalhando no projeto **DJ Zen Eyer** — o site oficial do DJ Zen Eyer, bicampeão mundial de Brazilian Zouk. Responda sempre em português brasileiro. Seja assertivo e técnico.

## Sobre o Projeto

- **Arquitetura:** WordPress Headless (REST API) + React 18 SPA (Vite 5)
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

1. **Data fetching** → Sempre via React Query em `useQueries.ts`, nunca `fetch()` solto em componentes
2. **Strings** → Sempre internacionalizadas via `t('chave')`, nunca hardcoded
3. **Páginas** → Sempre lazy-loaded com `React.lazy()`
4. **PHP** → Namespaced, prepared statements, sanitizado
5. **Commits** → Prefixos semânticos: `fix:`, `feat:`, `refactor:`, `docs:`, `chore:`
6. **ESLint** → Manter na versão 9 (plugins React não suportam v10)
7. **Navbar** → Está em `components/Layout/`, não em `components/common/`

## O que NÃO fazer

- Não atualizar ESLint para v10
- Não hardcodar strings visíveis ao usuário
- Não usar `fetch()` diretamente em componentes (usar React Query)
- Não commitar `.env` ou credenciais
- Não renderizar HTML pelo WordPress (é headless)
