# Architecture Diagram

Visual representation of the DJ Zen Eyer system architecture.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLOUDFLARE CDN                          │
│                    (Cache + WAF + DDoS)                         │
└────────────────┬────────────────────────────────┬───────────────┘
                 │                                │
                 ▼                                ▼
    ┌────────────────────┐              ┌────────────────────┐
    │   Static Assets    │              │   API Requests     │
    │   (React SPA)      │              │   (WordPress)      │
    └────────────────────┘              └────────────────────┘
                 │                                │
                 ▼                                ▼
    ┌────────────────────────────────────────────────────────┐
    │              HOSTINGER VPS (LiteSpeed)                 │
    ├────────────────────────────────────────────────────────┤
    │                                                        │
    │  ┌──────────────────┐      ┌──────────────────┐      │
    │  │  /dist/ folder   │      │  WordPress Core  │      │
    │  │  (Static HTML)   │      │  (Headless CMS)  │      │
    │  └──────────────────┘      └─────────┬────────┘      │
    │                                      │               │
    │                             ┌────────▼────────┐      │
    │                             │   REST API      │      │
    │                             │ /wp-json/       │      │
    │                             └────────┬────────┘      │
    │                                      │               │
    │          ┌───────────────────────────┼───────┐       │
    │          │                           │       │       │
    │   ┌──────▼───────┐    ┌──────────────▼───┐  │       │
    │   │  WooCommerce │    │  Custom Plugins  │  │       │
    │   │  (Products)  │    │  - ZenEyer Auth  │  │       │
    │   └──────────────┘    │  - Zen SEO Lite  │  │       │
    │                       │  - Zen BIT       │  │       │
    │   ┌──────────────┐    └──────────────────┘  │       │
    │   │  GamiPress   │                          │       │
    │   │ (Gamification)│                         │       │
    │   └──────────────┘                          │       │
    │                                             │       │
    │   ┌──────────────┐    ┌──────────────┐     │       │
    │   │  Polylang    │    │   MailPoet   │     │       │
    │   │  (i18n)      │    │ (Newsletter) │     │       │
    │   └──────────────┘    └──────────────┘     │       │
    │                                             │       │
    │          ┌──────────────────────────────────┘       │
    │          │                                          │
    │   ┌──────▼──────┐                                   │
    │   │  MySQL DB   │                                   │
    │   │  (Data)     │                                   │
    │   └─────────────┘                                   │
    │                                                     │
    └─────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────┐     │
│  │              React Router v7                   │     │
│  │  (Client-side routing + Lazy loading)         │     │
│  └───────────────────┬───────────────────────────┘     │
│                      │                                 │
│          ┌───────────┼────────────┐                    │
│          │           │            │                    │
│   ┌──────▼─────┐ ┌───▼────┐ ┌────▼──────┐             │
│   │  Contexts  │ │ Pages  │ │Components │             │
│   ├────────────┤ ├────────┤ ├───────────┤             │
│   │ • User     │ │ • Home │ │ • Navbar  │             │
│   │ • Cart     │ │ • Shop │ │ • Footer  │             │
│   │ • Music    │ │ • Music│ │ • Auth    │             │
│   │   Player   │ │ • About│ │ • Events  │             │
│   └────────────┘ └────────┘ └───────────┘             │
│                                                         │
│  ┌───────────────────────────────────────────────┐     │
│  │        TanStack Query (React Query)           │     │
│  │  (API state management + caching)             │     │
│  └───────────────────┬───────────────────────────┘     │
│                      │                                 │
│                      ▼                                 │
│  ┌───────────────────────────────────────────────┐     │
│  │           i18next (Internationalization)      │     │
│  │           • English (default)                 │     │
│  │           • Portuguese (pt)                   │     │
│  └───────────────────────────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action
    │
    ▼
┌─────────────────┐
│ React Component │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Query    │
│  (useQuery)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Fetch API                  │
│  → /wp-json/djzeneyer/v1/   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  WordPress REST API         │
│  (inc/api.php)              │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  WordPress Plugins          │
│  • WooCommerce              │
│  • GamiPress                │
│  • Custom Plugins           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  MySQL Database             │
└─────────────────────────────┘
         │
         │ (Response)
         ▼
┌─────────────────────────────┐
│  JSON Response              │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  React Query Cache          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  React Component            │
│  (Re-render with data)      │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  User sees updated UI       │
└─────────────────────────────┘
```

## Build & Deployment Flow

```
Developer
    │
    ├─► Write Code (VSCode)
    │
    ├─► npm run build
    │       │
    │       ├─► TypeScript Compilation
    │       ├─► Vite Build
    │       ├─► Code Splitting
    │       ├─► Minification
    │       ├─► Compression (gzip)
    │       └─► Prerender HTML (Puppeteer)
    │
    ├─► git commit & push
    │
    ▼
┌─────────────────────────────┐
│  GitHub Repository          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  GitHub Actions CI/CD       │
│  (.github/workflows/)       │
└────────┬────────────────────┘
         │
         ├─► Run Tests
         ├─► Build Project
         └─► Deploy to Hostinger
                  │
                  ▼
         ┌─────────────────────┐
         │  Hostinger VPS      │
         │  /dist/ folder      │
         └─────────────────────┘
                  │
                  ▼
         ┌─────────────────────┐
         │  Clear Caches       │
         │  • LiteSpeed        │
         │  • Cloudflare       │
         └─────────────────────┘
                  │
                  ▼
         ┌─────────────────────┐
         │  Live Production    │
         │  djzeneyer.com      │
         └─────────────────────┘
```

## Security Layers

```
┌──────────────────────────────────────────────┐
│  Layer 1: Cloudflare                         │
│  • DDoS Protection                           │
│  • WAF (Web Application Firewall)            │
│  • Rate Limiting                             │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  Layer 2: Server (.htaccess)                 │
│  • CSP Headers                               │
│  • HSTS                                      │
│  • X-Frame-Options                           │
│  • X-Content-Type-Options                    │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  Layer 3: CORS (inc/setup.php)               │
│  • Allowed Origins                           │
│  • Preflight Handling                        │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  Layer 4: Authentication                     │
│  • JWT Tokens (ZenEyer Auth)                 │
│  • OAuth (Google)                            │
│  • WordPress Nonces                          │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  Layer 5: WordPress Security                 │
│  • User Permissions                          │
│  • Capability Checks                         │
│  • Data Sanitization                         │
└──────────────────────────────────────────────┘
```

## Performance Optimization Stack

```
┌─────────────────────────────────────────┐
│  CDN (Cloudflare)                       │
│  • Global edge network                  │
│  • Static asset caching                 │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Server Cache (LiteSpeed)               │
│  • Full page cache                      │
│  • Object cache                         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Application Optimizations              │
│  • Code splitting (React lazy)          │
│  • Tree shaking (Vite)                  │
│  • Compression (gzip/brotli)            │
│  • Image optimization                   │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  API Caching (Transients)               │
│  • Menu: 6 hours                        │
│  • Products: 1 hour                     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  Client Cache (React Query)             │
│  • In-memory cache                      │
│  • Stale-while-revalidate               │
└─────────────────────────────────────────┘
```

---

**Last Updated:** January 2026
