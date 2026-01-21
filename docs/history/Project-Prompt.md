# 🎧 DJ Zen Eyer - Documentation Hub

**Status:** Gold Standard v3.0  
**Architecture:** Headless WordPress + React SPA  
**Docs Version:** 2.0.0

---

## 📁 Documentation Structure

### 🧠 AI & Architecture Context (Crucial)
*Estas são as regras mestras que regem o desenvolvimento do projeto.*
- [PROJECT_PROMPT.md](docs/PROJECT_PROMPT.md) - **As "Regras de Ouro" para o Bolt/Gem.**
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Diagramas e fluxo de dados.

### 🛠️ Setup & Installation
- [SETUP.md](docs/setup/SETUP.md) - Initial project setup (Server/Local).
- [COMPLETE.md](docs/setup/COMPLETE.md) - Complete architecture overview.

### 🧩 Custom Plugins
*Documentação técnica dos plugins proprietários.*
- [Zen SEO Lite Pro](docs/plugins/ZEN-SEO.md) - Custom SEO & Schema engine.
- [ZenEyer Auth Pro](docs/plugins/ZENEYER-AUTH.md) - JWT & Google OAuth handling.
- [Zen BIT](docs/plugins/ZEN-BIT.md) - Bandsintown API integration.
- [Zen-RA](docs/plugins/ZEN-RA.md) - Recent Activity & Gamification logic.
- [PLUGINS-GUIDE.md](docs/plugins/PLUGINS-GUIDE.md) - General plugin management.

### ⚙️ Configuration Guides
- [WordPress Config](docs/guides/WORDPRESS-CONFIG.md) - `wp-config.php` & Constants.
- [LiteSpeed Cache](docs/guides/LITESPEED-CACHE.md) - Rules, Excludes & TTL.
- [Cloudflare](docs/guides/CLOUDFLARE.md) - Page Rules & Security Level.
- [.htaccess](docs/guides/HTACCESS.md) - Rewrite rules & Headers.

### 📈 Marketing & Growth
- [MARKETING.md](docs/guides/MARKETING.md) - Funnels & Strategies.
- [BLACKHAT.md](docs/guides/BLACKHAT.md) - Advanced Growth Tactics.

### 🔧 Troubleshooting
- [Google Login Fix](docs/troubleshooting/CLOUDFLARE-FIX-GOOGLE-LOGIN.md)
- [Common Issues](docs/troubleshooting/COMMON-ISSUES.md) - CORS, 404s, Cache.

---

## 🏗️ Architecture Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 18 + Vite | SSG/SPA Hybrid with TypeScript & Tailwind. |
| **Backend** | WordPress (Headless) | Pure REST API. No theme rendering. |
| **Auth** | JWT + Google OAuth | Custom implementation via ZenEyer Auth. |
| **Hosting** | Hostinger VPS | Running LiteSpeed Web Server. |
| **CDN** | Cloudflare | Edge caching and security rules. |
| **CI/CD** | GitHub Actions | Automated build & deploy pipeline. |

---

## 🚀 Quick Start for Developers

1.  **Clone & Install:**
    ```bash
    git clone repo_url
    npm install
    ```

2.  **Environment Setup:**
    Duplicate `.env.example` to `.env` and fill in API URLs.

3.  **Start Dev Server:**
    ```bash
    npm run dev
    ```

4.  **Production Build:**
    ```bash
    npm run build
    # Output will be in /dist folder
    ```

---

## 📝 Maintenance Notes

- **Language:** All code and docs maintain strict EN/PT compatibility.
- **Clean Up:** Temporary files (`clear-cache.php`, etc.) must be deleted post-use.
- **Strict Rules:** Never bypass the `HeadlessSEO` component for individual schemas.