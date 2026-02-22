# 📖 Documentação — DJ Zen Eyer

Documentação técnica completa do projeto DJ Zen Eyer.

---

## Índice

### Início Rápido
- **[Arquitetura](ARCHITECTURE.md)** — Visão geral da arquitetura e fluxo de dados
- **[Setup](SETUP.md)** — Guia de instalação e configuração

### Referência Técnica
- **[API](API.md)** — Endpoints REST do tema e plugins
- **[Configuração](CONFIGURATION.md)** — WordPress, .htaccess, LiteSpeed, Cloudflare
- **[Guia do Desenvolvedor](DEV_GUIDE.md)** — Como estender o projeto

### Análises e Auditorias
- **[Auditoria de Rotas](ROUTE_AUDIT.md)** — Sincronização de rotas Frontend ↔ WordPress
- **[Análise ESLint](ESLINT_ANALYSIS.md)** — Por que ficar no ESLint 9
- **[Marketing](MARKETING.md)** — Estratégias de crescimento

---

## Referência Rápida

### Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite 5, Tailwind CSS, React Query 5, i18next |
| **Backend** | WordPress 6.0+ (Headless), PHP 8.0+, WooCommerce, GamiPress |
| **Infra** | Hostinger VPS (LiteSpeed), Cloudflare CDN, GitHub Actions |

### Estrutura Principal

```
djzeneyer/
├── src/                   # Frontend React
├── inc/                   # PHP do tema WordPress
├── plugins/               # Plugins customizados
├── scripts/               # Scripts de build
├── docs/                  # Documentação (você está aqui)
└── .github/workflows/     # CI/CD
```

### Conceitos-Chave

**WordPress Headless:** WordPress serve apenas como REST API. React renderiza 100% do frontend.

**SSG (Static Site Generation):** HTML pré-renderizado no build para SEO perfeito.

**Roteamento Bilíngue:** Inglês: `/about`, `/shop` | Português: `/pt/sobre`, `/pt/loja`

---

## Início Rápido

```bash
npm install        # Instalar dependências
npm run dev        # Desenvolvimento
npm run build      # Build de produção
git push origin main   # Deploy automático
```

---

## Suporte

**Desenvolvedor:** Marcelo Eyer Fernandes
**Site:** [djzeneyer.com](https://djzeneyer.com)
**Email:** contato@djzeneyer.com

---

**Atualizado:** Fevereiro 2026
