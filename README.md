# DJ Zen Eyer - Official Website

[![Deploy](https://github.com/MarceloEyer/djzeneyer/actions/workflows/deploy.yml/badge.svg)](https://github.com/MarceloEyer/djzeneyer/actions/workflows/deploy.yml)

Official website for DJ Zen Eyer - Two-time World Champion Brazilian Zouk DJ.

🌐 **Live:** [djzeneyer.com](https://djzeneyer.com)

## 🏗️ Architecture

**Headless WordPress + React SPA**

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** WordPress REST API
- **Authentication:** JWT + Google OAuth
- **Hosting:** Hostinger + Cloudflare CDN
- **Deployment:** GitHub Actions CI/CD

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### WordPress Setup

1. Install WordPress 6.0+
2. Activate required plugins:
   - Zen SEO Lite Pro
   - ZenEyer Auth Pro
   - Zen BIT
   - Zen-RA
   - WooCommerce
   - GamiPress
   - Polylang

3. Configure plugins (see [docs/](docs/))

## 📁 Project Structure

```
djzeneyer/
├── src/                    # React frontend
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   └── hooks/            # Custom hooks
├── plugins/              # Custom WordPress plugins
│   ├── zen-seo-lite/    # SEO optimization
│   ├── zeneyer-auth/    # Authentication
│   ├── zen-bit/         # Bandsintown events
│   └── zen-ra/          # Recent activity
├── inc/                  # WordPress theme functions
├── docs/                 # Documentation
└── .github/workflows/    # CI/CD
```

## 🔌 Custom Plugins

### Zen SEO Lite Pro v8.0.0
SEO optimization with schema.org, sitemap, and meta tags for headless WordPress.

### ZenEyer Auth Pro v2.0.0
JWT authentication with Google OAuth and password auth for headless architecture.

### Zen BIT v1.0.0
Bandsintown events integration with beautiful design and SEO optimization.

### Zen-RA v1.0.0
Recent Activity API - Gamified user history from WooCommerce and GamiPress.

## 📚 Documentation

Complete documentation available in [docs/](docs/):

- [Setup Guide](docs/setup/SETUP.md)
- [Architecture Overview](docs/setup/COMPLETE.md)
- [Plugin Management](docs/plugins/PLUGINS-GUIDE.md)
- [Configuration Guides](docs/guides/)
- [Troubleshooting](docs/troubleshooting/)

## 🛠️ Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript 5.6.2
- Vite 5.4.21
- Tailwind CSS 3.4.17
- Framer Motion 11.15.0
- i18next (multilingual)

**Backend:**
- WordPress 6.0+
- PHP 7.4+
- MySQL 5.7+

**Integrations:**
- WooCommerce (e-commerce)
- GamiPress (gamification)
- Polylang (multilingual)
- Bandsintown (events)
- Google OAuth (authentication)

## 🚢 Deployment

Automatic deployment via GitHub Actions:

1. Push to `main` branch
2. GitHub Actions builds React app
3. Deploys to Hostinger via rsync
4. Purges LiteSpeed Cache

## 🔐 Environment Variables

Create `.env` file:

```env
VITE_WP_REST_URL=https://djzeneyer.com/wp-json
VITE_SITE_URL=https://djzeneyer.com
```

## 📝 License

GPL v2 or later

## 👨‍💻 Author

**DJ Zen Eyer**
- Website: [djzeneyer.com](https://djzeneyer.com)
- Instagram: [@djzeneyer](https://instagram.com/djzeneyer)
- SoundCloud: [djzeneyer](https://soundcloud.com/djzeneyer)

Two-time World Champion Brazilian Zouk DJ
