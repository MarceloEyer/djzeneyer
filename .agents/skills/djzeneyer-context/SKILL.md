---
name: djzeneyer-context
description: >
  Use this skill for ANY task in the DJ Zen Eyer project repository. Activates
  automatically when working on React components, TypeScript files, PHP plugins,
  WordPress theme files, GitHub Actions workflows, i18n translations, or
  WooCommerce/GamiPress integrations. This skill encodes the full architecture,
  conventions, forbidden patterns, and deployment rules of djzeneyer.com — a
  WordPress Headless + React SPA platform for DJ Zen Eyer, two-time Brazilian
  Zouk World Champion. Do NOT use for unrelated projects.
triggers:
  - react
  - typescript
  - vite
  - wordpress
  - woocommerce
  - gamipress
  - php plugin
  - deploy
  - i18n
  - tailwind
  - djzeneyer
  - zen eyer
  - bandsintown
  - headless
  - useQueries
  - HeadlessSEO
  - zeneyer-auth
  - zen-bit
  - zen-ra
  - zen-seo-lite
  - MainLayout
  - Navbar
  - AppRoutes
  - GamiPress
  - WooCommerce
  - GitHub Actions
  - rsync
  - Hostinger
  - LiteSpeed
  - Cloudflare
  - prerender
version: "1.1.0"
author: Marcelo Eyer Fernandes (DJ Zen Eyer) & Antigravity
---

# DJ Zen Eyer — Agentic Skill (Master)

> Você é um engenheiro full-stack sênior especializado neste projeto.
> **Responda sempre em Português Brasileiro. Seja assertivo e técnico.**
> Antes de qualquer ação, leia este documento completo.

---

## 1. Identidade do Projeto

**Site:** https://djzeneyer.com
**Proprietário:** DJ Zen Eyer (Marcelo Eyer Fernandes) — Bicampeão Mundial de Brazilian Zouk
**Arquitetura:** WordPress Headless (REST API only) + React 18 SPA (Vite 7)

---

## 2. Stack Técnica Completa

### Frontend (React 18 SPA)
- **Vite 7**: Build tool principal.
- **TypeScript**: Strict mode obrigatório.
- **React Query (TanStack v5)**: Única forma de data fetching permitida.
- **Tailwind CSS**: Estilização baseada em utilitários core. **PROIBIDO GRADIENTES.**
- **Framer Motion**: Animações suaves (uso moderado por peso do bundle).
- **i18next**: Tradução dinâmica PT/EN.

### Backend (WP 6.9+ / PHP 8.3)
- **Headless**: WP não renderiza HTML.
- **WooCommerce 10.5+**: HPOS ativo.
- **GamiPress**: Gamificação brain.
- **Security**: Namespaces, Prepared Statements e Sanitização obrigatórios.

---

## 3. Regras de Ouro (Core Rules)

### 3.1 Frontend
- **Zero Hardcoding**: Use `t('key')` para toda string visível.
- **Lazy Loading**: `React.lazy()` obrigatório para todas as páginas.
- **useQueries.ts**: SSOT para hooks de dados. Nunca use `fetch()` solto.
- **Backend Filters, Frontend Renders**: Nunca filtre grandes conjuntos de dados no React.

### 3.2 Backend
- **Namespacing**: Todo código PHP deve estar em namespace (ex: `ZenEyer\Auth`).
- **Cache Transiente**: Preferir durações longas (24h+) para site de baixo volume.
- **REST API**: Use namespaces claros (`djzeneyer/v1`, `zeneyer-auth/v1`). **NUNCA use `zen-ra/v1`.**

---

## 4. Referências e Scripts
Localizados em `.agents/skills/djzeneyer-context/`:
- `references/api-endpoints.md`: Guia de endpoints da API.
- `references/file-structure.md`: Mapa de pastas do projeto.
- `scripts/pre-deploy-check.sh`: Script de validação prévia.
- `scripts/new-page.sh`: Blueprint para novas páginas.

### 4.1 Skills Especializadas (Power Pack Consolidado)
- `@seo-audit`: Audita crawlability, meta tags e indexação.
- `@schema-markup`: Valida e otimiza JSON-LD (ideal para o zen-seo-lite).
- `@ai-seo`: Otimiza para E-E-A-T e respostas de IA/Knowledge Graph.
- `@social-content`: Criação de conteúdo para redes sociais (Zouk/Eventos).
- `@copywriting`: Copy persuasiva para landing pages e shop.
- `@react-patterns`: Padrões de UI, loading states e error handling.
- `@tailwind-mastery`: Estilização avançada e responsiva com Tailwind v4.
- `@auth-implementation-patterns`: Segurança JWT e OAuth2 (zeneyer-auth).
- `@web-quality-skills`: Auditoria de performance, bundle e Core Web Vitals.
- `@backend-security-coder`: Código PHP seguro (Prepared Statements/Sanitização).
- `@content-strategy`: Planejamento de conteúdo e clusters de tópicos.
- `@typescript-pro`: Tipagem avançada e segurança de tipos técnica.
- `@clean-code`: Princípios de qualidade e manutenibilidade de código.

---

## 5. Pipeline de Deploy
- **Trigger**: Push para `main`.
- **SSG**: Prerender via Puppeteer (`scripts/prerender.js`) é crítico para SEO e evitar tela branca.
- **Deploy**: rsync para Hostinger VPS (Porta 65002).

---

## 6. Proibições Absolutas
- ❌ **Gradientes**: O usuário odeia. Use cores sólidas e opacidade.
- ❌ **ESLint v10**: Manter v9.39.2 por incompatibilidade de plugins.
- ❌ **Python**: Não adicionar arquivos `.py` (conflito com servidor de linguagem).
- ❌ **zen-ra/v1**: Endpoint depreciado. Use `djzeneyer/v1`.
