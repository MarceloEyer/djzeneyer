# 🤖 AI ENGINEERING MANIFEST & ARCHITECTURE RULES

**PROJECT IDENTITY:**
- **Stack:** Headless WordPress (Hostinger) + React/Vite (GitHub Actions Build).
- **Theme:** "zentheme" (Custom PHP wrapper).
- **Deploy Strategy:** Offline Build -> Rsync to Hostinger.

**🛑 THE 4 GOLDEN RULES (NON-NEGOTIABLE):**

1.  **RESILIENT BUILD PRINCIPLE:**
    - The build runs in an isolated GitHub Actions container.
    - Build and prerender scripts may attempt live API reads only when they also have safe fallback behavior.
    - **Action:** Never make `npm run build` depend on a live database or a required external API response.

2.  **PRERENDER STRATEGY (Shell Only):**
    - We use a custom `scripts/prerender.js`.
    - **Goal:** Create directory structure (`/about-dj-zen-eyer/index.html`) to prevent 404s.
    - **Constraint:** Since API is offline, save the **APP SHELL** (Header/Footer/Loading) instantly.
    - **Do NOT** wait for content hydration (h1, article text). Wait for `#root` or `nav`.

3.  **ROUTE SSOT (Single Source of Truth):**
    - Route slugs are defined ONLY in: `src/config/routes-slugs.json`.
    - React Router, Prerender, Sitemap, and CI validation must read from this JSON.
    - Never hardcode duplicated slug arrays in JS files.

4.  **DIRECTORY STRUCTURE:**
    - `src/` = Frontend React (UI/UX).
    - `scripts/` = Build & Prerender logic (Node.js).
    - `inc/` & `functions.php` = Backend Logic (PHP).

**INSTRUCTION FOR AI AGENTS:**
- When analyzing build errors, check Rule #1 first.
- When modifying routes, update `src/config/routes-slugs.json` first.
