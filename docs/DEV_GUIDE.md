# Developer Guide

Welcome to the **DJ Zen Eyer** developer guide. This document is intended for new developers joining the project to understand the architecture, communication flow, deployment process, and how to extend the application.

## 1. SPA <-> WordPress Communication

This project follows a **Headless WordPress** architecture. The frontend is a **React Single Page Application (SPA)** that consumes data from the WordPress backend via the REST API.

### Conceptual Overview

- **Frontend (SPA):** React 18 + TypeScript + Vite. It handles routing, UI rendering, and user interaction.
- **Backend (Headless WP):** WordPress serves as the content management system (CMS) and API provider. It does not render HTML pages for the user (except for the initial shell or specific admin pages).

### Communication Mechanism

The SPA needs to know where the WordPress API is located. This is handled differently in Production and Development:

#### Production
In production, WordPress injects a global object `window.wpData` into the HTML shell (via `inc/vite.php`). This object contains essential configuration:
- `rootUrl`: The root URL of the site.
- `restUrl`: The base URL for the WordPress REST API (e.g., `https://djzeneyer.com/wp-json/`).
- `nonce`: A security token for authenticated requests.
- `userId`: The ID of the currently logged-in user.

#### Development
In development (when running `npm run dev`), `window.wpData` is not present. The application falls back to environment variables defined in `.env` (or `.env.local`):
- `VITE_WP_SITE_URL`
- `VITE_WP_REST_URL`

**Central Configuration:**
The file `src/config/api.ts` is the Single Source of Truth. It checks for `window.wpData` first and falls back to environment variables if necessary.

### Data Fetching

Data fetching is primarily handled using **React Query** (TanStack Query) to ensure caching, deduplication, and efficient background updates.

- **Hooks:** Custom hooks in `src/hooks/` (e.g., `useQueries.ts`) encapsulate the fetching logic.
- **URL Building:** The `buildApiUrl` helper from `src/config/api.ts` is used to construct API endpoints.
- **Example:**
  ```typescript
  // src/hooks/useQueries.ts
  export const useMenuQuery = (lang: string) => {
    return useQuery({
      queryKey: QUERY_KEYS.menu.list(lang),
      queryFn: async () => {
        const apiUrl = buildApiUrl('djzeneyer/v1/menu', { lang });
        const res = await fetch(apiUrl);
        return res.json();
      },
      // ...
    });
  };
  ```

---

## 2. Deployment Flow

The project uses **GitHub Actions** for CI/CD, automatically deploying changes to the Hostinger VPS.

### Workflow Overview (`.github/workflows/deploy.yml`)

Triggered on push to `main`.

1.  **Build Phase**
    -   **Dependencies:** Installs NPM packages.
    -   **Sitemaps:** Generates XML sitemaps (`npm run generate-sitemaps`).
    -   **Vite Build:** Compiles the React application into static assets in `dist/`.
    -   **SSG Prerender:** Uses Puppeteer (`scripts/prerender.js`) to generate static HTML for key routes (SEO optimization).
    -   **Validation:** Checks if critical files (`index.html`, `manifest.json`) and prerendered pages exist.
    -   **Plugins:** Installs PHP dependencies for custom plugins using Composer.

2.  **Deploy Phase**
    -   **Artifact Download:** Downloads the built artifacts from the Build phase.
    -   **Backup & Clean:** Backs up the current `dist/` on the server and cleans it to remove old hashed files.
    -   **Rsync:**
        -   Uploads `dist/` to `wp-content/themes/zentheme/dist/`.
        -   Uploads `inc/` to `wp-content/themes/zentheme/inc/`.
        -   Uploads `plugins/` to `wp-content/plugins/`.
        -   Uploads public assets (robots.txt, etc.) to the site root.
    -   **SCP:** Uploads theme PHP files (`functions.php`, `header.php`, etc.) to the theme root.
    -   **AI Metadata:** Deploys `.well-known` directory for AI bots.

3.  **Post-Deploy**
    -   **Cache Purge:**
        -   Purges **LiteSpeed Cache** via WP-CLI.
        -   Resets **PHP OPcache** to ensure new PHP code is loaded.
    -   **Health Check:** Verifies that the site is up, sitemaps are accessible, and the API is responding.

---

## 3. Extension Points

Here is where you should look to add new features to the project.

### New Pages (React)
To add a new page to the SPA:
1.  **Create Component:** Create a new React component in `src/pages/` (e.g., `src/pages/NewPage.tsx`).
2.  **Register Route:** Add the route configuration in `src/config/routes.ts`.
    -   Define the component (lazy loaded).
    -   Add the path configuration for English and Portuguese.
    ```typescript
    // src/config/routes.ts
    const NewPage = lazy(() => import('../pages/NewPage'));

    // ... inside ROUTES_CONFIG
    {
      component: NewPage,
      paths: { en: 'new-page', pt: 'nova-pagina' },
    },
    ```

### New Hooks
To add custom logic or data fetching:
1.  Create a new file in `src/hooks/` (e.g., `src/hooks/useNewFeature.ts`).
2.  If fetching data, use `useQuery` from React Query and `buildApiUrl` from `src/config/api.ts`.
3.  Export the hook for use in components.

### New WordPress Plugins
To add server-side functionality:
1.  Create a new directory in `plugins/` (e.g., `plugins/zen-new-feature/`).
2.  Create the main PHP file with the standard WordPress plugin header.
    ```php
    <?php
    /**
     * Plugin Name: Zen New Feature
     * ...
     */
    ```
3.  The deployment workflow will automatically detect and deploy the new plugin folder to `wp-content/plugins/`.

---

## 4. Troubleshooting & Common Issues

### Build Errors
If `npm run build` fails unexpectedly:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### White Screen (Production)
1. Enable `WP_DEBUG` in `wp-config.php`.
2. Check `wp-content/debug.log`.
3. Verify if `window.wpData` is being correctly injected (View Source).

### CORS Errors
If API requests are blocked:
1. Check Cloudflare "Page Rules" (Ensure `/wp-json/*` is set to Bypass Cache).
2. Check `.htaccess` headers.
3. Verify `inc/setup.php` allows the correct origin.

### REST API 404
1. Go to **Settings > Permalinks** in WP Admin.
2. Click **Save Changes** to flush rewrite rules.
