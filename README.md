# 🎧 DJ Zen Eyer — Experiência Digital Headless

![Status](https://img.shields.io/badge/status-ativo-success.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![WordPress](https://img.shields.io/badge/WordPress-Headless-21759b)
![Licença](https://img.shields.io/badge/licença-GPLv2-green)

> **A experiência digital oficial do DJ Zen Eyer — Bicampeão Mundial de Brazilian Zouk.**
>
> Uma SPA de alto desempenho, bilíngue, alimentada por um backend WordPress Headless, com gamificação, e-commerce e streaming de áudio contínuo.

🌐 **Site:** [djzeneyer.com](https://djzeneyer.com)

---

## ✨ Funcionalidades

- **🚀 Ultra Rápido:** React 18 + Vite 7, navegação quase instantânea.
- **🌍 Bilíngue:** Suporte nativo a **Inglês** e **Português** via `i18next`.
- **🛍️ E-Commerce:** Integração completa com **WooCommerce** para venda de músicas e ingressos.
- **🎮 Gamificação:** XP, Ranks e Conquistas (via **Zen-RA**) ao ouvir músicas e comprar.
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
  - **Zen SEO Lite** (SEO Headless)
  - **Zen BIT** (Bandsintown)
  - **Zen-RA** (Gamificação)
- WooCommerce, GamiPress, Polylang

### Infraestrutura
- **Hospedagem:** Hostinger VPS (LiteSpeed)
- **CDN:** Cloudflare
- **CI/CD:** GitHub Actions (deploy automático no push)
- **Node:** 20 | **PHP:** 8.0+

---

## 🔄 Workflow de Deploy

```
Seu Computador → [git push] → GitHub → [Actions] → djzeneyer.com
     ↓                           ↓                        ↓
  Edita código            Build + Deploy           Servidor Produção
                          (2-3 minutos)
```

### O que acontece automaticamente no push:

1. ✅ Build TypeScript + Vite
2. ✅ Geração de sitemaps
3. ✅ Prerender de páginas (SSG)
4. ✅ Deploy via SSH para o servidor
5. ✅ Limpeza de cache LiteSpeed + OPcache
6. ✅ Health check do site

### Deploy rápido

```bash
git add .
git commit -m "descrição da alteração"
git push origin main
```

### Acompanhe

- **GitHub Actions:** https://github.com/MarceloEyer/djzeneyer/actions
- **Site:** https://djzeneyer.com

---

## 🚀 Quick Start

```bash
# 1. Clonar o repositório
git clone https://github.com/MarceloEyer/djzeneyer.git

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev
```
> Abra http://localhost:5173 no navegador.

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|
| [📐 Arquitetura](docs/ARCHITECTURE.md) | Arquitetura técnica e fluxo de dados |
| [📡 API](docs/API.md) | Referência de endpoints REST |
| [🏗️ Setup](docs/SETUP.md) | Guia de instalação |
| [⚙️ Configuração](docs/CONFIGURATION.md) | WordPress, Cloudflare, LiteSpeed |
| [👨‍💻 Guia Dev](docs/DEV_GUIDE.md) | Guia para desenvolvedores |
| [📋 Roadmap](TODO.md) | Tarefas e melhorias pendentes |

---

## 📂 Estrutura do Projeto

```
djzeneyer/
├── src/                    # Frontend React
│   ├── components/
│   │   ├── Layout/         # Navbar
│   │   ├── common/         # Footer, elementos reutilizáveis
│   │   ├── auth/           # AuthModal
│   │   └── account/        # Dashboard, perfil
│   ├── pages/              # Páginas (lazy-loaded)
│   ├── hooks/              # Hooks centralizados (useQueries.ts)
│   ├── contexts/           # UserContext, CartContext, MusicPlayer
│   ├── locales/            # Traduções i18n (en/, pt/)
│   ├── config/             # api.ts, routes.ts
│   └── layouts/            # MainLayout.tsx
├── inc/                    # PHP do tema WordPress
├── plugins/                # Plugins customizados
│   ├── zeneyer-auth/       # Autenticação JWT
│   ├── zen-seo-lite/       # SEO Headless
│   ├── zen-bit/            # Bandsintown
│   └── zen-ra/             # Gamificação
├── scripts/                # Scripts de build
├── docs/                   # Documentação
└── .github/workflows/      # CI/CD
```

---

## 🤖 Configuração de Bots AI

Este repositório inclui instruções para os seguintes bots de IA:

| Bot | Arquivo |
|-----|---------|
| CodeRabbit | `.coderabbit.yaml` |
| OpenAI Codex | `AGENTS.md` |
| Gemini / Jules | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |

---

## 👨‍💻 Autor

**DJ Zen Eyer (Marcelo Eyer Fernandes)**
- 📸 [Instagram](https://instagram.com/djzeneyer)
- ☁️ [SoundCloud](https://soundcloud.com/djzeneyer)
- 💼 [Website](https://djzeneyer.com)

---

*Feito com ❤️ e 🎶 pela Tribo Zen.*