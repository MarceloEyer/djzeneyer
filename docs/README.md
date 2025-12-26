# DJ Zen Eyer - Documentation

Complete documentation for djzeneyer.com WordPress headless architecture.

## 📁 Documentation Structure

### Setup & Installation
- [SETUP.md](setup/SETUP.md) - Initial project setup
- [COMPLETE.md](setup/COMPLETE.md) - Complete architecture overview

### Plugins
- [Zen SEO Lite](plugins/ZEN-SEO.md) - SEO optimization
- [ZenEyer Auth](plugins/ZENEYER-AUTH.md) - Authentication
- [Zen BIT](plugins/ZEN-BIT.md) - Bandsintown events
- [Zen-RA](plugins/ZEN-RA.md) - Recent activity
- [PLUGINS-GUIDE.md](plugins/PLUGINS-GUIDE.md) - Plugin management

### Configuration Guides
- [WordPress](guides/WORDPRESS-CONFIG.md) - WordPress settings
- [LiteSpeed Cache](guides/LITESPEED-CACHE.md) - Cache optimization
- [Cloudflare](guides/CLOUDFLARE.md) - CDN configuration
- [.htaccess](guides/HTACCESS.md) - Server configuration

### Marketing & Growth
- [MARKETING.md](guides/MARKETING.md) - Marketing strategies
- [BLACKHAT.md](guides/BLACKHAT.md) - Growth hacks

### Troubleshooting
- [Google Login Fix](troubleshooting/CLOUDFLARE-FIX-GOOGLE-LOGIN.md)
- [Common Issues](troubleshooting/COMMON-ISSUES.md)

## 🏗️ Architecture

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** WordPress REST API (Headless)
- **Authentication:** JWT + Google OAuth
- **Hosting:** Hostinger + Cloudflare CDN
- **Deployment:** GitHub Actions CI/CD

## 🔌 Plugins

1. **Zen SEO Lite Pro** - SEO optimization with schema.org
2. **ZenEyer Auth Pro** - JWT authentication
3. **Zen BIT** - Bandsintown events integration
4. **Zen-RA** - Gamified activity tracking

## 🚀 Quick Start

1. Clone repository
2. Install dependencies: `npm install`
3. Configure WordPress plugins
4. Build: `npm run build`
5. Deploy: GitHub Actions automatic

## 📝 Notes

- All documentation is in Portuguese and English
- Plugin-specific docs are in their respective folders
- Temporary files (clear-*.php) should be deleted after use
