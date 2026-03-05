# File Structure — DJ Zen Eyer

## 🎨 Frontend (React SPA)
- `src/assets/`: Imagens, SVGs (`pattern.svg`), fontes.
- `src/components/`: Componentes reutilizaveis.
  - `Layout/`: `Navbar`, `Footer`.
  - `auth/`: `AuthModal`.
- `src/config/`: Fontes de verdade (`api.ts`, `routes.ts`, `siteConfig.ts`).
- `src/hooks/`: Hooks customizados (especialmente `useQueries.ts`).
- `src/layouts/`: `MainLayout.tsx`.
- `src/pages/`: Paginas lazy-loaded (Quiz, Events, Checkout, etc).
- `src/locales/`: JSONs de traducao (`en`, `pt`).

## ⚙️ Backend (WP Headless)
- `inc/`: Logica core do tema.
- `plugins/`: Plugins customizados (`zeneyer-auth`, `zen-bit`, `zen-ra`, `zen-seo-lite`).
- `scripts/`: Scripts de automacao (`prerender.js`, `generate-sitemaps.js`).

## 🛡️ DevOps & CI/CD
- `.github/workflows/`: Pipeline `deploy.yml`.
- `dist/`: Output do build (alvo do rsync para a VPS).
