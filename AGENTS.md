# AGENTS.md — DJ Zen Eyer

> Instruções para agentes de IA (OpenAI Codex, etc.) que trabalham neste repositório.
> **Idioma padrão: Português Brasileiro.**

---

## Visão Geral do Projeto

Site e plataforma digital do **DJ Zen Eyer** (Marcelo Eyer Fernandes), bicampeão mundial de Brazilian Zouk.

**Arquitetura:** WordPress Headless + React SPA
**URL de Produção:** https://djzeneyer.com

---

## Stack Técnica

### Frontend
- **React 18** + TypeScript
- **Vite 5** (build tool)
- **Tailwind CSS** + Framer Motion (animações)
- **React Query** (TanStack Query v5) para data fetching
- **React Router 7** para navegação SPA
- **i18next** para internacionalização (PT/EN)

### Backend
- **WordPress 6.0+** em modo Headless (apenas REST API)
- **PHP 8.0+**
- **WooCommerce** (e-commerce)
- **GamiPress** (gamificação)
- Plugins customizados: `zeneyer-auth`, `zen-seo-lite`, `zen-bit`, `zen-ra`

### Infraestrutura
- **Hostinger VPS** + LiteSpeed
- **Cloudflare** CDN
- **GitHub Actions** para CI/CD (deploy automático no push para `main`)
- **Node.js 20**

---

## Estrutura de Diretórios

```
djzeneyer/
├── src/                    # Frontend React
│   ├── components/
│   │   ├── Layout/         # Navbar, menus de navegação
│   │   ├── common/         # Footer, componentes reutilizáveis
│   │   ├── auth/           # AuthModal (login/registro)
│   │   └── account/        # Dashboard, perfil
│   ├── pages/              # Páginas (lazy-loaded)
│   ├── hooks/              # Hooks centralizados (useQueries.ts)
│   ├── contexts/           # UserContext, CartContext, MusicPlayerContext
│   ├── locales/            # Traduções i18n (en/, pt/)
│   ├── config/             # api.ts, routes.ts, siteConfig.ts
│   └── layouts/            # MainLayout.tsx
├── inc/                    # PHP do tema WordPress headless
├── plugins/                # Plugins WordPress customizados
│   ├── zeneyer-auth/       # Autenticação JWT + Google OAuth
│   ├── zen-seo-lite/       # SEO para headless
│   ├── zen-bit/            # Integração Bandsintown
│   └── zen-ra/             # Atividade Recente + Gamificação
├── scripts/                # Scripts de build (prerender, sitemap)
├── docs/                   # Documentação técnica
└── .github/workflows/      # CI/CD (deploy.yml)
```

---

## Convenções de Código

### TypeScript / React
- **Hooks centralizados:** Todo data fetching via `src/hooks/useQueries.ts` usando React Query
- **i18n obrigatório:** Nunca use strings hardcoded — sempre `t('chave')` via `useTranslation()`
- **Lazy loading:** Todas as páginas devem usar `React.lazy()` + `Suspense`
- **SEO:** Cada página usa o componente `<HeadlessSEO />` para meta tags
- **Tipagem:** TypeScript strict — interfaces para props, tipos para API responses

### PHP / WordPress
- **Namespace:** Todos os plugins usam namespaces (ex: `ZenEyer\Auth\Auth`)
- **Segurança:** Prepared statements para SQL, sanitização de inputs (`sanitize_text_field`, `esc_html`)
- **Hooks:** Preferir `add_action` e `add_filter` em vez de código de procedimento
- **REST API:** Namespace do tema: `djzeneyer/v1`, auth: `zeneyer-auth/v1`

### Commits
- Prefixos: `fix:`, `feat:`, `refactor:`, `docs:`, `chore:`, `perf:`
- Mensagens em inglês ou português
- Exemplo: `fix: corrigir import do Navbar em MainLayout.tsx`

---

## Testes e Verificação

### Build
```bash
npm run build   # TypeScript + Vite build
```

### Lint
```bash
npm run lint     # ESLint 9 (não atualizar para 10 — plugins incompatíveis)
```

### Deploy
```bash
git push origin main   # Dispara GitHub Actions automaticamente
```

O pipeline faz: build → prerender (SSG) → rsync para VPS → purge cache.

---

## Regras Importantes

1. **Não modificar ESLint para v10** — plugins React não suportam (ver `docs/ESLINT_ANALYSIS.md`)
2. **Navbar está em `src/components/Layout/Navbar.tsx`** (não em `common/`)
3. **Tradução é obrigatória** em ambos os idiomas (en + pt) para qualquer texto visível
4. **Nunca commitar** `.env`, `secrets`, ou credenciais
5. **O deploy apaga o dist/ antigo** — tudo deve estar no build
6. **PHP mínimo: 8.0**, Node mínimo: 20
