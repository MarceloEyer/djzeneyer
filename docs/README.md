# Documentation

Complete documentation for DJ Zen Eyer website.

---

## 📖 Documentation Index

### Getting Started

- **[Architecture Overview](ARCHITECTURE.md)** - Technical architecture and data flow
- **[Setup Guide](setup/)** - Installation and configuration instructions

### Configuration

- **[WordPress Configuration](guides/WORDPRESS-CONFIG.md)** - WordPress settings and optimization
- **[Cloudflare Setup](guides/CLOUDFLARE.md)** - CDN and security configuration
- **[LiteSpeed Cache](guides/LITESPEED-CACHE.md)** - Server-side caching setup
- **[.htaccess Rules](guides/HTACCESS.md)** - Server configuration and URL rewriting

### Custom Plugins

- **[Plugins Guide](plugins/PLUGINS-GUIDE.md)** - Overview of all custom plugins
- **[Zen SEO Lite](plugins/ZEN-SEO.md)** - SEO optimization plugin
- **[ZenEyer Auth](../plugins/zeneyer-auth/README.md)** - Authentication plugin
- **[Zen BIT](../plugins/zen-bit/README.md)** - Bandsintown events integration
- **[Zen-RA](../plugins/zen-ra/README.md)** - Recent activity API

### Troubleshooting

- **[Common Issues](troubleshooting/COMMON-ISSUES.md)** - Frequently encountered problems and solutions
- **[Cloudflare + Google Login Fix](troubleshooting/CLOUDFLARE-FIX-GOOGLE-LOGIN.md)** - Fix OAuth issues with Cloudflare

### Marketing & Growth

- **[Marketing Strategies](guides/MARKETING.md)** - Growth and promotion tactics
- **[Black Hat SEO](guides/BLACKHAT.md)** - Aggressive growth techniques (use with caution)

---

## 🏗️ Quick Reference

### Tech Stack

**Frontend:**
- React 18 + TypeScript + Vite 5
- Tailwind CSS 3.4
- React Query 5.90
- i18next 25.7 (EN/PT)

**Backend:**
- WordPress 6.0+ (Headless)
- PHP 8.0+
- MySQL 5.7+
- WooCommerce + GamiPress + Polylang

**Infrastructure:**
- LiteSpeed Server
- Cloudflare CDN
- Hostinger VPS
- GitHub Actions CI/CD

### Directory Structure

```
djzeneyer/
├── src/                   # React frontend
├── inc/                   # WordPress theme PHP
├── plugins/               # Custom WP plugins
├── scripts/               # Build scripts
├── docs/                  # Documentation (you are here)
└── dist/                  # Production build
```

### Key Concepts

**Headless WordPress:**
- WordPress serves only as REST API
- No WordPress theme rendering
- React handles 100% of frontend

**Static Site Generation (SSG):**
- HTML pre-rendered during build
- Perfect SEO (Google sees complete HTML)
- Fast initial load (LCP < 1.8s)

**Bilingual Routing:**
- English: `/about`, `/shop`, `/events`
- Portuguese: `/pt/about`, `/pt/shop`, `/pt/events`
- Auto-detection based on browser language

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Deploy (automatic via GitHub Actions)
git push origin main
```

---

## 📞 Support

**Issues?** Check [troubleshooting](troubleshooting/) first.

**Developer:** Marcelo Eyer Fernandes
**Website:** [djzeneyer.com](https://djzeneyer.com)
**Email:** contato@djzeneyer.com

---

**Last Updated:** January 2026
