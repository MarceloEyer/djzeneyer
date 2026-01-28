# 🎧 DJ Zen Eyer - Headless Experience

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![WordPress](https://img.shields.io/badge/WordPress-Headless-21759b)
![License](https://img.shields.io/badge/license-GPLv2-green)

> **The official digital experience for DJ Zen Eyer - Two-time World Champion Brazilian Zouk DJ.**
>
> A high-performance, bilingual Single Page Application (SPA) powered by a Headless WordPress backend, featuring gamification, e-commerce, and seamless audio streaming.

🌐 **Live Demo:** [djzeneyer.com](https://djzeneyer.com)

---

## ✨ Features

This project pushes the boundaries of what a DJ portfolio can be:

- **🚀 Blazing Fast:** Built with **React 18** & **Vite 5**, achieving near-instant navigation.
- **🌍 Bilingual Core:** Native support for **English** and **Portuguese** via `i18next`.
- **🛍️ E-Commerce:** Full **WooCommerce** integration for selling tracks and event tickets.
- **🎮 Gamification:** Users earn **XP, Ranks, and Achievements** (via **Zen-RA v3.2.0**) by listening to music and buying merch.
- **🎧 Audio Experience:** Global persistence music player with continuous playback across routes.
- **🧠 SEO Optimized:** Dynamic sitemaps, canonical tags, and Open Graph support for social sharing.

---

## 🛠️ Tech Stack

### Frontend (The Head)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS + Framer Motion
- **State:** React Query (TanStack Query) + Context API
- **Routing:** React Router 7

### Backend (The Body)
- **CMS:** WordPress (Headless Mode)
- **API:** REST API with custom endpoints (`/djzeneyer/v1`)
- **Plugins:**
  - **Zen-RA v3.2.0** (Gamification Engine)
  - **Zen SEO Lite** (SEO Optimization)
  - WooCommerce, GamiPress, Polylang

### Infrastructure
- **Hosting:** Hostinger VPS (PHP/MySQL)
- **CDN:** Cloudflare + LiteSpeed Cache
- **CI/CD:** GitHub Actions (Auto-deploy on push)

---

## 🚀 Quick Start

Get the frontend running locally in minutes:

```bash
# 1. Clone the repository
git clone https://github.com/MarceloEyer/djzeneyer.git

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
> Open http://localhost:5173 to view it in the browser.

---

## 📚 Documentation

We believe in clean, accessible documentation. Check out the guides below:

| Document | Description |
|----------|-------------|
| [**📡 API Reference**](docs/API.md) | Endpoints for Activity, Gamification, and Products. |
| [**🗺️ Roadmap & Tasks**](TODO.md) | Current project status and pending tasks. |
| [**📂 Plugin: Zen-RA**](plugins/zen-ra/README.md) | Documentation for the Gamification Engine. |
| [**🏗️ Architecture**](docs/ARCHITECTURE.md) | Deep dive into the system design. |

---

## 📂 Project Structure

```bash
djzeneyer/
├── src/               # React Source Code
│   ├── components/    # UI Building Blocks
│   ├── pages/         # Route Components
│   ├── hooks/         # Custom Logic (useMusicPlayer, etc.)
│   └── locales/       # i18n JSON files
├── inc/               # WordPress PHP Theme Includes
│   ├── api.php        # REST API Registrations
│   └── spa.php        # SPA Routing Logic
├── plugins/           # Custom WordPress Plugins
│   └── zen-ra/        # Zen Recent Activity Engine
└── docs/              # Documentation
```

---

## 👨‍💻 Author

**DJ Zen Eyer (Marcelo Eyer Fernandes)**
- 📸 [Instagram](https://instagram.com/djzeneyer)
- ☁️ [SoundCloud](https://soundcloud.com/djzeneyer)
- 💼 [Website](https://djzeneyer.com)

---

*Built with ❤️ and 🎶 by the Zen Tribe.*