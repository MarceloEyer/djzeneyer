# ðŸ“– DocumentaÃ§Ã£o â€” DJ Zen Eyer

DocumentaÃ§Ã£o tÃ©cnica completa do projeto DJ Zen Eyer.

---

## Ãndice

### InÃ­cio RÃ¡pido
- **[Arquitetura](ARCHITECTURE.md)** â€” VisÃ£o geral da arquitetura e fluxo de dados
- **[Setup](SETUP.md)** â€” Guia de instalaÃ§Ã£o e configuraÃ§Ã£o

### ReferÃªncia TÃ©cnica
- **[API](API.md)** â€” Endpoints REST do tema e plugins
- **[ConfiguraÃ§Ã£o](CONFIGURATION.md)** â€” WordPress, .htaccess, LiteSpeed, Cloudflare
- **[Guia do Desenvolvedor](DEV_GUIDE.md)** â€” Como estender o projeto

### AnÃ¡lises e Auditorias
- **[Auditoria de Rotas](ROUTE_AUDIT.md)** â€” SincronizaÃ§Ã£o de rotas Frontend â†” WordPress
- **[AnÃ¡lise ESLint](ESLINT_ANALYSIS.md)** â€” Por que ficar no ESLint 9
- **[Marketing](MARKETING.md)** â€” EstratÃ©gias de crescimento

---

## ReferÃªncia RÃ¡pida

### Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite 7, Tailwind CSS, React Query 5, i18next |
| **Backend** | WordPress 6.0+ (Headless), PHP 8.1+, WooCommerce, GamiPress |
| **Infra** | Hostinger VPS (LiteSpeed), Cloudflare CDN, GitHub Actions |

### Estrutura Principal

```
djzeneyer/
â”œâ”€â”€ src/                   # Frontend React
â”œâ”€â”€ inc/                   # PHP do tema WordPress
â”œâ”€â”€ plugins/               # Plugins customizados
â”œâ”€â”€ scripts/               # Scripts de build
â”œâ”€â”€ docs/                  # DocumentaÃ§Ã£o (vocÃª estÃ¡ aqui)
â””â”€â”€ .github/workflows/     # CI/CD
```

### Conceitos-Chave

**WordPress Headless:** WordPress serve apenas como REST API. React renderiza 100% do frontend.

**SSG (Static Site Generation):** HTML prÃ©-renderizado no build para SEO perfeito.

**Roteamento BilÃ­ngue:** InglÃªs: `/about`, `/shop` | PortuguÃªs: `/pt/sobre`, `/pt/loja`

---

## InÃ­cio RÃ¡pido

```bash
npm install        # Instalar dependÃªncias
npm run dev        # Desenvolvimento
npm run build      # Build de produÃ§Ã£o
git push origin main   # Deploy automÃ¡tico
```

---

## Suporte

**Desenvolvedor:** Marcelo Eyer Fernandes  
**Site:** [djzeneyer.com](https://djzeneyer.com)  
**Email:** contato@djzeneyer.com

---

**Atualizado:** Fevereiro 2026

