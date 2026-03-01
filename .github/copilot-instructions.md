# Instruções para GitHub Copilot — DJ Zen Eyer

## Idioma
Responda sempre em **português brasileiro**. Comentários de código podem ser em inglês ou português.

## Contexto do Projeto
Site headless do DJ Zen Eyer (bicampeão mundial de Brazilian Zouk).

- **Frontend:** React 18 + TypeScript + Vite 5 + Tailwind CSS
- **Backend:** WordPress Headless (REST API) + PHP 8.0+
- **State:** React Query (TanStack Query v5) + Context API
- **i18n:** i18next (PT/EN)
- **Routing:** React Router 7 com slugs bilíngues
- **Node:** 20 | **PHP:** 8.0+

## Convenções de Código

### React / TypeScript
- Use hooks centralizados de `src/hooks/useQueries.ts` para data fetching
- Use `useTranslation()` do i18next para todas as strings visíveis
- Páginas devem ser lazy-loaded com `React.lazy()` e `Suspense`
- Componente `<HeadlessSEO />` para meta tags em cada página
- Navbar está em `src/components/Layout/Navbar.tsx` (não `common/`)
- TypeScript strict: interface para props, tipos explícitos

### PHP / WordPress
- Plugins usam namespaces (ex: `ZenEyer\Auth\Auth`)
- Prepared statements para SQL (`$wpdb->prepare()`)
- Sanitização: `sanitize_text_field()`, `esc_html()`, `esc_url()`
- REST API do tema: namespace `djzeneyer/v1`
- REST API de auth: namespace `zeneyer-auth/v1`

### Commits
- Formato: `tipo: descrição` (ex: `fix: corrigir import do Navbar`)
- Tipos: `fix`, `feat`, `refactor`, `docs`, `chore`, `perf`

## Estrutura Principal

```
src/
├── components/Layout/    # Navbar
├── components/common/    # Footer, elementos reutilizáveis
├── components/auth/      # AuthModal
├── pages/                # Páginas lazy-loaded
├── hooks/useQueries.ts   # TODOS os hooks React Query
├── contexts/             # User, Cart, MusicPlayer
├── locales/{en,pt}/      # Traduções
├── config/api.ts         # URLs da API (fonte de verdade)
└── layouts/              # MainLayout.tsx

plugins/
├── zeneyer-auth/         # JWT + Google OAuth
├── zen-seo-lite/         # SEO headless
├── zen-bit/              # Bandsintown
└── zen-ra/               # Gamificação
```

## Restrições
- ESLint permanece na v9 (plugins React incompatíveis com v10)
- Nunca commitar `.env` ou credenciais
- WordPress serve APENAS como API (sem renderização de HTML)
