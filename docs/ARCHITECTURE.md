# Visão Geral da Arquitetura

**DJ Zen Eyer — Arquitetura Técnica**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   CLOUDFLARE CDN      │ ◄── Edge Cache, SSL/TLS
         │   (Cache + Security)   │     DDoS Protection
         └───────────┬───────────┘
                     │
                     ▼
    ┌────────────────────────────────────┐
    │   HOSTINGER VPS (LiteSpeed)        │
    │  ┌──────────────────────────────┐  │
    │  │  FRONTEND (React SPA)        │  │
    │  │  /dist/ (Static HTML)        │  │
    │  └──────────────────────────────┘  │
    │  ┌──────────────────────────────┐  │
    │  │  BACKEND (WordPress API)     │  │
    │  │  /wp-json/                   │  │
    │  │  • REST API                  │  │
    │  │  • Custom Plugins            │  │
    │  │  • WooCommerce               │  │
    │  │  • GamiPress                 │  │
    │  └──────────────────────────────┘  │
    │  ┌──────────────────────────────┐  │
    │  │  DATABASE (MySQL)            │  │
    │  │  • wp_posts, wp_users        │  │
    │  │  • WooCommerce tables        │  │
    │  │  • GamiPress tables          │  │
    │  └──────────────────────────────┘  │
    └────────────────────────────────────┘
                     ▲
                     │
         ┌───────────────────────┐
         │  GITHUB ACTIONS       │ ◄── CI/CD Pipeline
         │  (Build & Deploy)     │     Automatic on push
         └───────────────────────┘
```

---

## Request Flow

### 1. First Visit (SSR/SSG)

```
User → Cloudflare (cache) → Serve pre-rendered HTML
                          → React hydrates page
                          → SPA takes control
```

- **HTML pre-rendered** for instant load
- **SEO complete** (meta tags, Schema.org)
- **LCP < 1.8s** (Largest Contentful Paint)

### 2. Client-Side Navigation (SPA)

```
User clicks link → React Router intercepts
                → fetch() data from WordPress API
                → Smooth transition (no page reload)
```

### 3. API Request

```
React Component → fetch() → WordPress REST API → MySQL → JSON Response
```

---

## Data Flow

### Authentication (JWT + Google OAuth)

```
┌─────────────────────────────────────────────────────┐
│ FRONTEND (React)                                     │
│  [Login Form] ──────► AuthModal.tsx                 │
│        │ POST /wp-json/zeneyer-auth/v1/login        │
└────────┼──────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────┐
│ BACKEND (zeneyer-auth plugin)                       │
│  • Validate credentials                             │
│  • Generate JWT token (Firebase PHP-JWT)            │
│  • Return: { token, user, expires }                 │
└────────┬──────────────────────────────────────────┘
         ▼
┌─────────────────────────────────────────────────────┐
│ FRONTEND (React)                                     │
│  • Save token to localStorage                       │
│  • Update UserContext                               │
│  • Redirect to /dashboard                           │
└─────────────────────────────────────────────────────┘
```

### WooCommerce Cart

```
React Component (ShopPage)
    │
    ├──► useCart() hook
    │      │
    │      ├──► ADD_TO_CART
    │      │      └──► POST /wp-json/wc/store/v1/cart/add-item
    │      │
    │      ├──► GET_CART
    │      │      └──► GET /wp-json/wc/store/v1/cart
    │      │
    │      └──► REMOVE_ITEM
    │             └──► DELETE /wp-json/wc/store/v1/cart/items/:key
    │
    └──► CartContext updates global state
```

### Gamification (GamiPress)

```
DashboardPage.tsx
    │
    ├──► useGamiPress() hook
    │      │
    │      ├──► GET /wp-json/gamipress/v1/users/:id/points
    │      ├──► GET /wp-json/gamipress/v1/users/:id/ranks
    │      └──► GET /wp-json/gamipress/v1/users/:id/achievements
    │
    └──► Render:
         - UserStatsCards (points, rank, achievements)
         - GamificationWidget (progress, badges)
```

---

## Frontend Architecture

### Component Structure

```
src/
├── App.tsx                    # Componente raiz (Rotas)
├── main.tsx                   # Ponto de entrada
│
├── components/
│   ├── AppRoutes.tsx         # Configuração de rotas
│   ├── HeadlessSEO.tsx       # Gerenciador de SEO (crítico!)
│   │
│   ├── Layout/
│   │   └── Navbar.tsx        # Navegação principal
│   │
│   ├── common/
│   │   ├── Footer.tsx        # Rodapé
│   │   └── UserMenu.tsx      # Menu do usuário
│   │
│   ├── auth/
│   │   └── AuthModal.tsx     # Modal Login/Registro
│   │
│   └── account/
│       ├── UserStatsCards.tsx
│       ├── OrdersList.tsx
│       └── RecentActivity.tsx
│
├── pages/                     # Páginas (lazy-loaded)
│   ├── HomePage.tsx
│   ├── ShopPage.tsx
│   ├── EventsPage.tsx
│   ├── MusicPage.tsx
│   ├── NewsPage.tsx
│   ├── DashboardPage.tsx
│   └── ...
│
├── contexts/                  # Estado global
│   ├── UserContext.tsx       # Autenticação
│   ├── CartContext.tsx       # Carrinho WooCommerce
│   └── MusicPlayerContext.tsx
│
├── hooks/                     # Hooks centralizados
│   └── useQueries.ts         # TODOS os hooks React Query
│
├── layouts/
│   └── MainLayout.tsx        # Layout principal (Navbar+Footer+Auth)
│
├── locales/                   # Traduções i18n
│   ├── en/translation.json
│   └── pt/translation.json
│
└── config/
    ├── api.ts                # URLs da API (fonte de verdade)
    ├── routes.ts             # Mapa de rotas EN/PT
    └── siteConfig.ts         # Configuração do site
```

### Lazy Loading Strategy

```typescript
// App.tsx
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/shop" element={<ShopPage />} />
  </Routes>
</Suspense>
```

**Benefits:**
- Initial bundle: 68.52 KB (gzipped)
- Additional pages load on-demand
- Faster Time to Interactive (TTI)

---

## Backend Architecture

### WordPress Theme Structure

```
wp-content/themes/djzeneyer-headless/
├── functions.php              # Main entry point (loads /inc/)
├── index.php                  # Serves React app
├── header.php                 # HTML <head> injection
├── footer.php                 # Closes HTML
│
└── inc/                       # Modular PHP functions
    ├── setup.php              # Theme support, CORS, performance
    ├── api.php                # Custom REST endpoints
    ├── cpt.php                # Custom Post Types
    ├── spa.php                # SPA routing integration
    ├── vite.php               # Vite asset injection
    ├── csp.php                # Content Security Policy
    ├── cleanup.php            # Remove WP bloat
    └── metaboxes.php          # Admin UI metaboxes
```

### Custom REST Endpoints

Registered in `inc/api.php`:

```php
// Menu API
GET /wp-json/djzeneyer/v1/menu?lang=pt

// Products API
GET /wp-json/djzeneyer/v1/products?lang=pt

// GamiPress API
GET /wp-json/djzeneyer/v1/gamipress/:user_id

// Events API (via Zen BIT plugin)
GET /wp-json/zen-bit/v1/events

// Recent Activity API (via Zen-RA plugin)
GET /wp-json/zen-ra/v1/activity/:user_id
```

---

## Custom Plugins

### 1. Zen SEO Lite Pro

**File:** `plugins/zen-seo-lite/zen-seo-lite.php`

**Function:** Complete SEO engine for headless WordPress.

**Classes:**
- `Zen_SEO_Meta_Tags` - Meta tags generation
- `Zen_SEO_Schema` - Schema.org JSON-LD
- `Zen_SEO_Sitemap` - Dynamic XML sitemap
- `Zen_SEO_REST_API` - REST API endpoints

**Endpoints:**
```php
GET /wp-json/zen-seo/v1/meta/{slug}?lang=pt
GET /wp-json/zen-seo/v1/sitemap
GET /wp-json/zen-seo/v1/schema/{type}/{id}
```

---

### 2. ZenEyer Auth Pro

**File:** `plugins/zeneyer-auth/zeneyer-auth.php`

**Function:** JWT authentication with Google OAuth.

**Classes:**
- `Google_Provider` - Google OAuth integration
- `Password_Auth` - Email/password authentication
- `JWT_Manager` - Token generation & validation
- `CORS_Handler` - CORS configuration
- `Rate_Limiter` - Brute force protection

**Endpoints:**
```php
POST /wp-json/zeneyer-auth/v1/login
POST /wp-json/zeneyer-auth/v1/register
POST /wp-json/zeneyer-auth/v1/google-login
POST /wp-json/zeneyer-auth/v1/refresh
POST /wp-json/zeneyer-auth/v1/logout
GET  /wp-json/zeneyer-auth/v1/validate
```

**Security Features:**
- Rate limiting (5 attempts/minute)
- JWT expiration (7 days)
- Token refresh
- HTTPS only
- CORS restrictions

---

### 3. Zen BIT (Bandsintown)

**File:** `plugins/zen-bit/zen-bit.php`

**Function:** Bandsintown API integration for events.

**Features:**
- Event caching (1 hour TTL)
- Automatic date formatting
- Responsive event cards
- Shortcode: `[zen_bit_events]`

**Endpoint:**
```php
GET /wp-json/zen-bit/v1/events
```

---

### 4. Zen-RA (Recent Activity)

**File:** `plugins/zen-ra/zen-ra.php`

**Function:** Gamified user activity timeline.

**Data Sources:**
- WooCommerce orders
- GamiPress achievements
- User milestones

**Endpoint:**
```php
GET /wp-json/zen-ra/v1/activity/:user_id
```

**Returns:**
```json
{
  "activities": [
    {
      "type": "purchase",
      "title": "Purchased Zen Zouk Pack Vol. 3",
      "date": "2025-01-15T10:30:00Z",
      "icon": "shopping-bag"
    },
    {
      "type": "achievement",
      "title": "Unlocked: Zouk Master",
      "date": "2025-01-14T18:20:00Z",
      "icon": "trophy"
    }
  ],
  "streak": {
    "current": 7,
    "longest": 14
  }
}
```

---

## SEO Strategy

### Static Site Generation (SSG)

**Problem:** SPAs are not well-indexed by crawlers.

**Solution:** Pre-render HTML during build.

```bash
npm run build
  │
  ├──► vite build (JS/CSS)
  │
  └──► scripts/prerender.js
         │
         ├──► Puppeteer launches local server
         ├──► Navigates to each route:
         │      /about → dist/about/index.html
         │      /events → dist/events/index.html
         │      /pt/about → dist/pt/about/index.html
         │
         └──► Final HTML contains:
                • Complete meta tags
                • Schema.org JSON-LD
                • Indexable text content
```

**Result:**
- Google sees complete HTML instantly
- LCP < 1.8s
- Perfect SEO scores

### HeadlessSEO Component

**File:** `src/components/HeadlessSEO.tsx`

**Manages:**
- `<title>` tags
- Meta descriptions
- Canonical URLs
- Open Graph tags
- Twitter Cards
- Hreflang tags (EN/PT)
- Schema.org JSON-LD

**Usage:**
```typescript
<HeadlessSEO
  title="DJ Zen Eyer - About"
  description="Two-time World Champion Brazilian Zouk DJ"
  url="/about"
  image="/images/zen-eyer-og.jpg"
  type="profile"
  hrefLang={[
    { lang: 'en', url: 'https://djzeneyer.com/about/' },
    { lang: 'pt-BR', url: 'https://djzeneyer.com/pt/about/' }
  ]}
  schema={{
    "@type": "Person",
    "name": "Marcelo Eyer Fernandes",
    "jobTitle": "DJ & Music Producer"
  }}
/>
```

---

## Internationalization (i18n)

### Dual-Language Routing

- **English (default):** `/about`, `/events`, `/shop`
- **Portuguese:** `/pt/about`, `/pt/events`, `/pt/shop`

### Language Detection

```typescript
// Auto-detect on first visit
const browserLang = navigator.language; // "pt-BR"
if (browserLang.startsWith('pt')) {
  window.location.href = '/pt';
}

// Persist choice
localStorage.setItem('preferredLanguage', 'pt');
```

### Translation Files

```
src/locales/
├── en/translation.json
└── pt/translation.json
```

**Usage:**
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <h1>{t('welcome')}</h1>;
```

---

## Performance Optimization

### Caching Strategy

```
┌─────────────────────────────────────────┐
│ CLOUDFLARE (Edge Cache)                 │
│ • HTML: 2 hours                         │
│ • CSS/JS: 30 days (hash busting)       │
│ • Images: 7 days                        │
└──────────────┬──────────────────────────┘
               ▼
┌─────────────────────────────────────────┐
│ LITESPEED CACHE (Server Cache)          │
│ • HTML: 1 hour                          │
│ • API Responses: 10 minutes             │
│ • Database queries: 30 minutes          │
└─────────────────────────────────────────┘
```

### Bundle Optimization

- **Code splitting** (lazy loading)
- **Tree shaking** (Vite)
- **Minification** (Terser)
- **Gzip compression**
- **Image optimization** (WebP, explicit dimensions)

---

## Security

### Implemented Protections

✅ **HTTPS Only** - All requests via SSL
✅ **CORS Restrictive** - Only djzeneyer.com authorized
✅ **Rate Limiting** - Brute force protection
✅ **JWT Expiration** - 7 days max
✅ **XSS Protection** - DOMPurify sanitization
✅ **CSRF Protection** - WordPress nonces
✅ **SQL Injection** - Prepared statements
✅ **CSP Headers** - Content Security Policy active

---

## Build & Deploy

### Build Process

```bash
npm run build
  │
  ├──► scripts/generate-sitemap.js  # Generate sitemap.xml
  ├──► tsc                           # TypeScript compilation
  ├──► vite build                    # Bundle React app
  └──► scripts/prerender.js          # SSG (16 HTML files)
```

### CI/CD Pipeline

**File:** `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main]

jobs:
  1. Checkout code
  2. Setup Node.js 20
  3. npm ci (install)
  4. npm run build (compile)
  5. rsync dist/ → Hostinger VPS
  6. Purge LiteSpeed Cache
  7. Ping sitemap to Google
```

---

## Monitoring & Analytics

### Core Web Vitals

- **LCP:** 1.6s ✅ (target: < 2.5s)
- **FID:** 45ms ✅ (target: < 100ms)
- **CLS:** 0.02 ✅ (target: < 0.1)

### Lighthouse Scores

- Performance: 96/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

---

## Future Improvements

- [ ] PWA (Progressive Web App)
- [ ] Push notifications
- [ ] Dark mode toggle
- [ ] React Native mobile app
- [ ] Spotify API integration
- [ ] Live chat support
- [ ] Event reviews system
- [ ] Affiliate program

---

**Atualizado:** Fevereiro 2026
**Versão:** 2.2.0
