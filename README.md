# DJ Zen Eyer - Official Website

[![Deploy](https://github.com/MarceloEyer/djzeneyer/actions/workflows/deploy.yml/badge.svg)](https://github.com/MarceloEyer/djzeneyer/actions/workflows/deploy.yml)

Official website for **DJ Zen Eyer** - Two-time World Champion Brazilian Zouk DJ.

🌐 **Live:** [djzeneyer.com](https://djzeneyer.com)

---

## 🏗️ Architecture

**Headless WordPress + React SPA with SSG**

- **Frontend:** React 18 + TypeScript + Vite 5 + Tailwind CSS
- **Backend:** WordPress REST API (headless)
- **Cache:** LiteSpeed Cache + Cloudflare CDN
- **Auth:** JWT + Google OAuth
- **Hosting:** Hostinger VPS
- **CI/CD:** GitHub Actions

### Key Features

✅ **Bilingual:** English (default) + Portuguese (`/pt`)
✅ **SSG + SPA:** Pre-rendered HTML for SEO + client-side routing
✅ **Performance:** LCP < 1.8s, bundle < 200KB gzipped
✅ **E-commerce:** WooCommerce integration
✅ **Gamification:** Points, ranks, achievements via GamiPress
✅ **SEO:** Schema.org, dynamic sitemap, optimized meta tags

---

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build
```

### WordPress Requirements

- WordPress 6.0+
- PHP 8.0+
- MySQL 5.7+

**Required Plugins:**
- WooCommerce (e-commerce)
- GamiPress (gamification)
- Polylang (multilingual)
- LiteSpeed Cache (performance)

**Custom Plugins:**
- Zen SEO Lite Pro (SEO engine)
- ZenEyer Auth Pro (JWT authentication)
- Zen BIT (Bandsintown events)
- Zen-RA (Recent activity API)

---

## 📁 Project Structure

```
djzeneyer/
├── src/                   # React frontend
│   ├── components/       # Reusable components
│   ├── pages/           # Page components (lazy loaded)
│   ├── contexts/        # React contexts (User, Cart, MusicPlayer)
│   ├── hooks/           # Custom React hooks
│   ├── locales/         # i18n translations (en/pt)
│   └── config/          # Configuration files
│
├── inc/                  # WordPress theme functions (PHP)
│   ├── setup.php        # Core setup & security
│   ├── api.php          # REST API endpoints
│   ├── cpt.php          # Custom post types
│   ├── spa.php          # SPA routing integration
│   ├── vite.php         # Vite asset injection
│   └── csp.php          # Content Security Policy
│
├── plugins/             # Custom WordPress plugins
│   ├── zen-seo-lite/   # SEO optimization engine
│   ├── zeneyer-auth/   # JWT + OAuth authentication
│   ├── zen-bit/        # Bandsintown events integration
│   └── zen-ra/         # Recent activity API
│
├── scripts/             # Build scripts
│   ├── generate-sitemap.js  # Generate XML sitemap
│   └── prerender.js         # SSG with Puppeteer
│
├── docs/                # Documentation
│   ├── setup/          # Setup guides
│   ├── guides/         # Configuration guides
│   ├── plugins/        # Plugin documentation
│   └── troubleshooting/ # Common issues & solutions
│
└── dist/                # Production build (generated)
```

---

## 📚 Documentation

Complete documentation available in [`docs/`](docs/):

- **[Architecture](docs/ARCHITECTURE.md)** - Technical architecture overview
- **[Setup Guide](docs/setup/)** - Installation & configuration
- **[Plugins](docs/plugins/)** - Custom plugins documentation
- **[Configuration Guides](docs/guides/)** - WordPress, Cloudflare, LiteSpeed
- **[Troubleshooting](docs/troubleshooting/)** - Common issues & solutions

---

## 🛠️ Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript 5.9.3
- Vite 5.4.21
- Tailwind CSS 3.4.19
- Framer Motion 11.18.2
- React Query 5.90.12
- i18next 25.7.2 (multilingual)
- React Router 7.0.0

**Backend:**
- WordPress 6.0+
- PHP 8.0+
- MySQL 5.7+
- WooCommerce (e-commerce)
- GamiPress (gamification)
- Polylang (multilingual)

**Infrastructure:**
- LiteSpeed Server
- Cloudflare CDN
- Hostinger VPS
- GitHub Actions CI/CD

---

## 🚢 Deployment

Automatic deployment via GitHub Actions:

1. Push to `main` branch
2. GitHub Actions builds React app
3. Deploys to Hostinger via rsync
4. Purges LiteSpeed Cache + Cloudflare

### Manual Deploy

```bash
# Build
npm run build

# Upload /dist to server
rsync -avz dist/ user@server:/path/to/public_html/

# Clear caches
# - LiteSpeed Cache: Purge All
# - Cloudflare: Purge Everything
```

---

## 🔐 Environment Variables

Create `.env.production`:

```env
VITE_WP_REST_URL=https://djzeneyer.com/wp-json
VITE_SITE_URL=https://djzeneyer.com
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

---

## 📊 Performance Metrics

**Lighthouse Scores:**
- Performance: 96/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): 1.6s ✅
- FID (First Input Delay): 45ms ✅
- CLS (Cumulative Layout Shift): 0.02 ✅

**Bundle Size:**
- Initial JS: 68.52 KB (gzipped)
- Initial CSS: 9.30 KB (gzipped)
- Total: ~78 KB ✅

---

## 🔌 Custom Plugins

### Zen SEO Lite Pro v8.0.0
Complete SEO engine for headless WordPress with Schema.org, sitemap generation, and meta tags API.

### ZenEyer Auth Pro v2.0.0
JWT authentication with Google OAuth, rate limiting, and secure token management.

### Zen BIT v1.0.0
Bandsintown events integration with caching and beautiful UI.

### Zen-RA v1.0.0
Recent Activity API - gamified user history from WooCommerce and GamiPress.

---

## 📝 License

GPL v2 or later

---

## 👨‍💻 Author

**DJ Zen Eyer** (Marcelo Eyer Fernandes)
- Website: [djzeneyer.com](https://djzeneyer.com)
- Instagram: [@djzeneyer](https://instagram.com/djzeneyer)
- SoundCloud: [djzeneyer](https://soundcloud.com/djzeneyer)

Two-time World Champion Brazilian Zouk DJ & Music Producer
