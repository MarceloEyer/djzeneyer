# 🤖 AI ENGINEERING MANIFEST & ARCHITECTURE RULES

**PROJECT IDENTITY:**
- **Stack:** Headless WordPress (Hostinger) + React/Vite (GitHub Actions Build).
- **Theme:** "zentheme" (Custom PHP wrapper).
- **Deploy Strategy:** Offline Build -> Rsync to Hostinger.

**🛑 THE 4 GOLDEN RULES (NON-NEGOTIABLE):**

1.  **OFFLINE BUILD PRINCIPLE (The "No-API" Rule):**
    - The build runs in an isolated GitHub Actions container.
    - **CRITICAL:** There is NO access to the live database or `wp-json` API during `npm run build` or `prerender.js`.
    - **Action:** Never write build scripts that fetch external data. Mock it or use App Shell architecture.

2.  **PRERENDER STRATEGY (Shell Only):**
    - We use a custom `scripts/prerender.js`.
    - **Goal:** Create directory structure (`/about/index.html`) to prevent 404s.
    - **Constraint:** Since API is offline, save the **APP SHELL** (Header/Footer/Loading) instantly.
    - **Do NOT** wait for content hydration (h1, article text). Wait for `#root` or `nav`.

3.  **ROUTE SSOT (Single Source of Truth):**
    - Routes are defined ONLY in: `scripts/routes-config.json`.
    - React Router, Prerender, Sitemap, and CI Validation MUST read from this JSON.
    - Never hardcode route arrays in JS files.

4.  **DIRECTORY STRUCTURE:**
    - `src/` = Frontend React (UI/UX).
    - `scripts/` = Build & Prerender logic (Node.js).
    - `inc/` & `functions.php` = Backend Logic (PHP).

**INSTRUCTION FOR AI AGENTS:**
- When analyzing build errors, check Rule #1 first.
- When modifying routes, update `scripts/routes-config.json` first.
