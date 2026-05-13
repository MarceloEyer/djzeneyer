# Project Context: Zen Eyer Ecosystem

Version: 1.1.0

## 🎯 Objetivo

Plataforma oficial de Zen Eyer, unindo site institucional, e-commerce (WooCommerce), gamificação (GamiPress) e central de fãs (Zen Tribe) com uma estética premium inspirada em MMORPGs contemporâneos.

---

## 💻 Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind 4.
- **Backend:** WordPress 6.9+ (Headless), PHP 8.3.
- **Integrações:** GamiPress, WooCommerce, MailPoet.
- **SEO/Render:** Prerender via Puppeteer + HeadlessSEO (React).
- **Infra:** Hostinger VPS (Ubuntu), LiteSpeed Cache, Cloudflare, GitHub Actions.

---

## 📂 Organização de Contexto para Agentes

- **Regras Globais:** `.context/ENGINEERING.md`.
- **Identidade:** `.context/IDENTITY.md`.
- **Habilidades:** `.agents/skills/`.
- **Ações Humanas:** `.human/`.

---

## 🏗️ Fronteiras de Responsabilidade

- **WordPress:** Gerencia conteúdo (Polylang), auth (JWT) e gamificação (ZenGame).
- **React:** Gerencia a experiência do usuário (UX), roteamento dinâmico e SEO on-page.
- **CI/CD:** Automatiza o build do frontend e o deploy dos plugins de backend.
