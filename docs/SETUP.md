# 🏗️ Setup Guide

Complete installation instructions for the DJ Zen Eyer Headless WordPress project.

---

## 📋 Prerequisites

- **Server**: LiteSpeed (Hostinger) or Apache/Nginx.
- **PHP**: 8.0+
- **Node.js**: 18+ (for local development)
- **Database**: MySQL 5.7+

---

## 1. WordPress Installation

1.  Install WordPress on your server.
2.  Edit `wp-config.php` to define the frontend URL:
    ```php
    define('WP_HOME', 'https://djzeneyer.com');
    define('WP_SITEURL', 'https://djzeneyer.com');
    ```
3.  Set Permalinks to **Post name** (`/%postname%/`).

---

## 2. Plugin Installation

The system relies on specific plugins. Install via WP Admin or WP-CLI:

### Essential
- **WooCommerce**: E-commerce functionality.
- **GamiPress**: Gamification engine.
- **Polylang**: Multilingual support (EN/PT).
- **MailPoet**: Newsletter.
- **LiteSpeed Cache**: Performance.

### Custom (In this repo)
Upload these from the `plugins/` directory:
- `zen-ra`: Recent Activity & Gamification Engine.
- `zen-seo-lite`: Headless SEO.
- `zeneyer-auth`: JWT Authentication.
- `zen-bit`: Bandsintown Integration.

---

## 3. Theme Installation

1.  Navigate to `wp-content/themes/`.
2.  Create a folder `djzeneyer`.
3.  Upload the contents of the `inc/` folder and the root PHP files (`functions.php`, `index.php`, `header.php`, `footer.php`) to this folder.
4.  Activate the theme in WordPress.

---

## 4. Frontend Setup (React)

1.  **Clone & Install**:
    ```bash
    git clone <repo_url>
    npm install
    ```

2.  **Environment Variables**:
    Create `.env`:
    ```env
    VITE_WP_REST_URL=https://djzeneyer.com/wp-json
    VITE_SITE_URL=https://djzeneyer.com
    ```

3.  **Run Locally**:
    ```bash
    npm run dev
    ```

4.  **Build**:
    ```bash
    npm run build
    ```
    This generates the `dist/` folder.

---

## 5. Deployment

1.  **Build** the React app (`npm run build`).
2.  **Upload** the `dist/` folder to `wp-content/themes/djzeneyer/dist/`.
3.  Ensure `.htaccess` handles routing (see `docs/CONFIGURATION.md`).

For automated deployment, see `.github/workflows/deploy.yml`.

---

**Next Steps:**
- Configure the server: [Configuration Guide](CONFIGURATION.md)
- Check API Docs: [API Reference](API.md)
