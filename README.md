# ðŸŽ§ DJ Zen Eyer â€” ExperiÃªncia Digital Headless

![Status](https://img.shields.io/badge/status-ativo-success.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![WordPress](https://img.shields.io/badge/WordPress-Headless-21759b)
![LicenÃ§a](https://img.shields.io/badge/licenÃ§a-GPLv2-green)

> **A experiÃªncia digital oficial do DJ Zen Eyer â€” BicampeÃ£o Mundial de Brazilian Zouk.**
>
> Uma SPA de alto desempenho, bilÃ­ngue, alimentada por um backend WordPress Headless, com gamificaÃ§Ã£o, e-commerce e streaming de Ã¡udio contÃ­nuo.

ðŸŒ **Site:** [djzeneyer.com](https://djzeneyer.com)

---

## âœ¨ Funcionalidades

- **ðŸš€ Ultra RÃ¡pido:** React 18 + Vite 7, navegaÃ§Ã£o quase instantÃ¢nea.
- **ðŸŒ BilÃ­ngue:** Suporte nativo a **InglÃªs** e **PortuguÃªs** via `i18next`.
- **ðŸ›ï¸ E-Commerce:** IntegraÃ§Ã£o completa com **WooCommerce** para venda de mÃºsicas e ingressos.
- **ðŸŽ® GamificaÃ§Ã£o:** XP, Ranks e Conquistas (via **ZenGame**) ao ouvir mÃºsicas e comprar.
- **ðŸŽ§ Player Global:** Player persistente com reproduÃ§Ã£o contÃ­nua entre rotas.
- **ðŸ§  SEO Otimizado:** Sitemaps dinÃ¢micos, tags canÃ´nicas, Open Graph e SSG.

---

## ðŸ› ï¸ Stack TÃ©cnica

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
  - **ZenGame** (GamificaÃ§Ã£o)
- WooCommerce, GamiPress, Polylang

### Infraestrutura
- **Hospedagem:** Hostinger VPS (LiteSpeed)
- **CDN:** Cloudflare
- **CI/CD:** GitHub Actions (deploy automÃ¡tico no push)
- **Node:** 20 | **PHP:** 8.0+

---

## ðŸ”„ Workflow de Deploy

```
Seu Computador â†’ [git push] â†’ GitHub â†’ [Actions] â†’ djzeneyer.com
     â†“                           â†“                        â†“
  Edita cÃ³digo            Build + Deploy           Servidor ProduÃ§Ã£o
                          (2-3 minutos)
```

### O que acontece automaticamente no push:

1. âœ… Build TypeScript + Vite
2. âœ… GeraÃ§Ã£o de sitemaps
3. âœ… Prerender de pÃ¡ginas (SSG)
4. âœ… Deploy via SSH para o servidor
5. âœ… Limpeza de cache LiteSpeed + OPcache
6. âœ… Health check do site

### Deploy rÃ¡pido

```bash
git add .
git commit -m "descriÃ§Ã£o da alteraÃ§Ã£o"
git push origin main
```

### Acompanhe

- **GitHub Actions:** https://github.com/MarceloEyer/djzeneyer/actions
- **Site:** https://djzeneyer.com

---

## ðŸš€ Quick Start

```bash
# 1. Clonar o repositÃ³rio
git clone https://github.com/MarceloEyer/djzeneyer.git

# 2. Instalar dependÃªncias
npm install

# 3. Iniciar servidor de desenvolvimento
npm run dev
```
> Abra http://localhost:5173 no navegador.

---

## ðŸ“š DocumentaÃ§Ã£o

| Documento | DescriÃ§Ã£o |
|-----------|-----------|
| [ðŸ“ Arquitetura](docs/ARCHITECTURE.md) | Arquitetura tÃ©cnica e fluxo de dados |
| [ðŸ“¡ API](docs/API.md) | ReferÃªncia de endpoints REST |
| [ðŸ—ï¸ Setup](docs/SETUP.md) | Guia de instalaÃ§Ã£o |
| [âš™ï¸ ConfiguraÃ§Ã£o](docs/CONFIGURATION.md) | WordPress, Cloudflare, LiteSpeed |
| [ðŸ‘¨â€ðŸ’» Guia Dev](docs/DEV_GUIDE.md) | Guia para desenvolvedores |
| [ðŸ“‹ Roadmap](TODO.md) | Tarefas e melhorias pendentes |

---

## ðŸ“‚ Estrutura do Projeto

```
djzeneyer/
â”œâ”€â”€ src/                    # Frontend React
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Layout/         # Navbar
â”‚   â”‚   â”œâ”€â”€ common/         # Footer, elementos reutilizÃ¡veis
â”‚   â”‚   â”œâ”€â”€ auth/           # AuthModal
â”‚   â”‚   â””â”€â”€ account/        # Dashboard, perfil
â”‚   â”œâ”€â”€ pages/              # PÃ¡ginas (lazy-loaded)
â”‚   â”œâ”€â”€ hooks/              # Hooks centralizados (useQueries.ts)
â”‚   â”œâ”€â”€ contexts/           # UserContext, CartContext, MusicPlayer
â”‚   â”œâ”€â”€ locales/            # TraduÃ§Ãµes i18n (en/, pt/)
â”‚   â”œâ”€â”€ config/             # api.ts, routes.ts
â”‚   â””â”€â”€ layouts/            # MainLayout.tsx
â”œâ”€â”€ inc/                    # PHP do tema WordPress
â”œâ”€â”€ plugins/                # Plugins customizados
â”‚   â”œâ”€â”€ zeneyer-auth/       # AutenticaÃ§Ã£o JWT
â”‚   â”œâ”€â”€ zen-seo-lite/       # SEO Headless
â”‚   â”œâ”€â”€ zen-bit/            # Bandsintown
â”‚   â””â”€â”€ ZenGame/             # GamificaÃ§Ã£o
â”œâ”€â”€ scripts/                # Scripts de build
â”œâ”€â”€ docs/                   # DocumentaÃ§Ã£o
â””â”€â”€ .github/workflows/      # CI/CD
```

---

## ðŸ¤– ConfiguraÃ§Ã£o de Bots AI

Este repositÃ³rio inclui instruÃ§Ãµes para os seguintes bots de IA:

| Bot | Arquivo |
|-----|---------|
| CodeRabbit | `.coderabbit.yaml` |
| OpenAI Codex | `AGENTS.md` |
| Gemini / Jules | `GEMINI.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |

---

## ðŸ‘¨â€ðŸ’» Autor

**DJ Zen Eyer (Marcelo Eyer Fernandes)**
- ðŸ“¸ [Instagram](https://instagram.com/djzeneyer)
- â˜ï¸ [SoundCloud](https://soundcloud.com/djzeneyer)
- ðŸ’¼ [Website](https://djzeneyer.com)

---

*Feito com â¤ï¸ e ðŸŽ¶ pela Tribo Zen.*
