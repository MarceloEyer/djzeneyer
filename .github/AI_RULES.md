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

2.  **PRERENDER STRATEGY (Content-Aware SSG):**
    - We use a custom `scripts/prerender.js`.
    - **Goal:** Create localized, indexable HTML (`/about-dj-zen-eyer/index.html`, `/pt/sobre-dj-zen-eyer/index.html`) with stable head tags and hydrated route content.
    - **Constraint:** Live API reads must have safe fallback behavior so CI can still build when WordPress or third-party APIs are unavailable.
    - **Do:** wait for meaningful route content when possible (`h1`, page text, or route-specific markers) and validate exactly one title, description, and canonical.
    - **Do NOT:** prerender private, dynamic, redirect-only, or non-canonical phantom routes.

3.  **ROUTE SSOT (Single Source of Truth):**
    - Route slugs are defined ONLY in: `src/config/routes-slugs.json`.
    - React Router, Prerender, Sitemap, and CI validation must read from this JSON.
    - Never hardcode duplicated slug arrays in JS files.
    - Removing an invalid public route from this file is the correct way to stop prerender/sitemap/SPAs from treating it as valid.

4.  **DIRECTORY STRUCTURE:**
    - `src/` = Frontend React (UI/UX).
    - `scripts/` = Build & Prerender logic (Node.js).
    - `inc/` & `functions.php` = Backend Logic (PHP).

**INSTRUCTION FOR AI AGENTS:**
- When analyzing build errors, check Rule #1 first.
- When modifying routes, update `src/config/routes-slugs.json` first.
