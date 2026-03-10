# 🎧 DJ Zen Eyer — Experiência Digital Headless

![Status](https://img.shields.io/badge/status-ativo-success.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![WordPress](https://img.shields.io/badge/WordPress-Headless-21759b)

> **A experiência digital oficial do DJ Zen Eyer — Bicampeão Mundial de Brazilian Zouk.**
>
> Uma SPA de alto desempenho, bilíngue, alimentada por um backend WordPress Headless, com gamificação, e-commerce e streaming de áudio contínuo.

🌐 **Site:** [djzeneyer.com](https://djzeneyer.com)

---

## ✨ Funcionalidades

- **🚀 Ultra Rápido:** React 18 + Vite 7, navegação quase instantânea.
- **🌍 Bilíngue:** Suporte nativo a **Inglês** e **Português** via `i18next`.
- **🛒 E-Commerce:** Integração completa com **WooCommerce** para venda de músicas e ingressos.
- **🎮 Gamificação:** XP, Ranks e Conquistas (via **ZenGame**) ao ouvir músicas e comprar.
- **🎧 Player Global:** Player persistente com reprodução contínua entre rotas.
- **🧠 SEO Otimizado:** Sitemaps dinâmicos, tags canônicas, Open Graph e SSG.

---

## 🛠️ Stack Técnica

### Frontend
- **Framework:** React 18 + TypeScript
- **Build:** Vite 7
- **Estilo:** Tailwind CSS + Framer Motion
- **Estado:** React Query (TanStack Query v5) + Context API
- **Roteamento:** React Router 7

### Backend
- **CMS:** WordPress (Modo Headless)
- **API:** REST API com endpoints customizados (`/djzeneyer/v1`)
- **Plugins Customizados:**
  - **ZenEyer Auth** (JWT + Google OAuth)
  - **Zen-SEO** (SEO Headless)
  - **Zen BIT** (Bandsintown)
  - **ZenGame** (Gamificação)

---

## 🔄 Workflow de Deploy

O deploy é automático via GitHub Actions no push para a branch `main`.

1. ✅ Build TypeScript + Vite
2. ✅ Geração de sitemaps
3. ✅ Prerender de páginas (SSG)
4. ✅ Deploy via SSH para o servidor
5. ✅ Limpeza de cache LiteSpeed + OPcache

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

---

## 📂 Estrutura do Projeto

```
djzeneyer/
├── src/                    # Frontend React
├── inc/                    # PHP do tema WordPress
├── plugins/                # Plugins customizados
├── scripts/                # Scripts de build
└── docs/                   # Documentação
```

---

*Feito com ❤️ e 🎶 pela Tribo Zen.*
