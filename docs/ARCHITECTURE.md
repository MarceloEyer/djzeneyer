# VisÃ£o Geral da Arquitetura

**DJ Zen Eyer â€” Arquitetura TÃ©cnica**

---

## System Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    USER (Browser)                        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚
                     â–¼
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚   CLOUDFLARE CDN      â”‚ â—„â”€â”€ Edge Cache, SSL/TLS
         â”‚   (Cache + Security)   â”‚     DDoS Protection
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â”‚
                     â–¼
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    â”‚   HOSTINGER VPS (LiteSpeed)        â”‚
    â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
    â”‚  â”‚  FRONTEND (React SPA)        â”‚  â”‚
    â”‚  â”‚  /dist/ (Static HTML)        â”‚  â”‚
    â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
    â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
    â”‚  â”‚  BACKEND (WordPress API)     â”‚  â”‚
    â”‚  â”‚  /wp-json/                   â”‚  â”‚
    â”‚  â”‚  â€¢ REST API                  â”‚  â”‚
    â”‚  â”‚  â€¢ Custom Plugins            â”‚  â”‚
    â”‚  â”‚  â€¢ WooCommerce               â”‚  â”‚
    â”‚  â”‚  â€¢ GamiPress                 â”‚  â”‚
    â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
    â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
    â”‚  â”‚  DATABASE (MySQL)            â”‚  â”‚
    â”‚  â”‚  â€¢ wp_posts, wp_users        â”‚  â”‚
    â”‚  â”‚  â€¢ WooCommerce tables        â”‚  â”‚
    â”‚  â”‚  â€¢ GamiPress tables          â”‚  â”‚
    â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â–²
                     â”‚
         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
         â”‚  GITHUB ACTIONS       â”‚ â—„â”€â”€ CI/CD Pipeline
         â”‚  (Build & Deploy)     â”‚     Automatic on push
         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Data Fetching Philosophy: "Backend Filters, Frontend Renders"

To ensure maximum performance and minimize payload sizes, the project follows a strict rule: **The API is responsible for all data processing.**

1. **Filtering & Sorting**: Must always happen server-side via query parameters (e.g., `?limit=10&search=term&lang=pt`).
2. **Data Reduction**: Use the `_fields` parameter in WordPress REST API whenever possible to fetch only required keys.
3. **Aggregator Endpoints**: For complex pages (like the Dashboard or Shop), create specialized WordPress endpoints that return "pre-digested" data ready for rendering.
4. **Client Responsibility**: The React frontend should only receive clean arrays/objects and map them to components. Avoid `.filter()`, `.sort()`, or `.slice()` on large datasets within components.

---

## Request Flow

### 1. First Visit (SSR/SSG)

```
User â†’ Cloudflare (cache) â†’ Serve pre-rendered HTML
                          â†’ React hydrates page
                          â†’ SPA takes control
```

- **HTML pre-rendered** for instant load
- **SEO complete** (meta tags, Schema.org)
- **LCP < 1.8s** (Largest Contentful Paint)

### 2. Client-Side Navigation (SPA)

```
User clicks link â†’ React Router intercepts
                â†’ fetch() data from WordPress API
                â†’ Smooth transition (no page reload)
```

### 3. API Request

```
React Component â†’ fetch() â†’ WordPress REST API â†’ MySQL â†’ JSON Response
```

---

## Data Flow

### Authentication (JWT + Google OAuth)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ FRONTEND (React)                                     â”‚
â”‚  [Login Form] â”€â”€â”€â”€â”€â”€â–º AuthModal.tsx                 â”‚
â”‚        â”‚ POST /wp-json/zeneyer-auth/v1/login        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ BACKEND (zeneyer-auth plugin)                       â”‚
â”‚  â€¢ Validate credentials                             â”‚
â”‚  â€¢ Generate JWT token (Firebase PHP-JWT)            â”‚
â”‚  â€¢ Return: { token, user, expires }                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ FRONTEND (React)                                     â”‚
â”‚  â€¢ Save token to localStorage                       â”‚
â”‚  â€¢ Update UserContext                               â”‚
â”‚  â€¢ Redirect to /dashboard                           â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### WooCommerce Cart

```
React Component (ShopPage)
    â”‚
    â”œâ”€â”€â–º useCart() hook
    â”‚      â”‚
    â”‚      â”œâ”€â”€â–º ADD_TO_CART
    â”‚      â”‚      â””â”€â”€â–º POST /wp-json/wc/store/v1/cart/add-item
    â”‚      â”‚
    â”‚      â”œâ”€â”€â–º GET_CART
    â”‚      â”‚      â””â”€â”€â–º GET /wp-json/wc/store/v1/cart
    â”‚      â”‚
    â”‚      â””â”€â”€â–º REMOVE_ITEM
    â”‚             â””â”€â”€â–º DELETE /wp-json/wc/store/v1/cart/items/:key
    â”‚
    â””â”€â”€â–º CartContext updates global state
```

### Gamification (GamiPress)

```
DashboardPage.tsx
    â”‚
    â”œâ”€â”€â–º useGamiPress() hook
    â”‚      â”‚
    â”‚      â”œâ”€â”€â–º GET /wp-json/gamipress/v1/users/:id/points
    â”‚      â”œâ”€â”€â–º GET /wp-json/gamipress/v1/users/:id/ranks
    â”‚      â””â”€â”€â–º GET /wp-json/gamipress/v1/users/:id/achievements
    â”‚
    â””â”€â”€â–º Render:
         - UserStatsCards (points, rank, achievements)
         - GamificationWidget (progress, badges)
```

---

## Frontend Architecture

### Component Structure

```
src/
â”œâ”€â”€ App.tsx                    # Componente raiz (Rotas)
â”œâ”€â”€ main.tsx                   # Ponto de entrada
â”‚
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ AppRoutes.tsx         # ConfiguraÃ§Ã£o de rotas
â”‚   â”œâ”€â”€ HeadlessSEO.tsx       # Gerenciador de SEO (crÃ­tico!)
â”‚   â”‚
â”‚   â”œâ”€â”€ Layout/
â”‚   â”‚   â””â”€â”€ Navbar.tsx        # NavegaÃ§Ã£o principal
â”‚   â”‚
â”‚   â”œâ”€â”€ common/
â”‚   â”‚   â”œâ”€â”€ Footer.tsx        # RodapÃ©
â”‚   â”‚   â””â”€â”€ UserMenu.tsx      # Menu do usuÃ¡rio
â”‚   â”‚
â”‚   â”œâ”€â”€ auth/
â”‚   â”‚   â””â”€â”€ AuthModal.tsx     # Modal Login/Registro
â”‚   â”‚
â”‚   â””â”€â”€ account/
â”‚       â”œâ”€â”€ UserStatsCards.tsx
â”‚       â”œâ”€â”€ OrdersList.tsx
â”‚       â””â”€â”€ RecentActivity.tsx
â”‚
â”œâ”€â”€ pages/                     # PÃ¡ginas (lazy-loaded)
â”‚   â”œâ”€â”€ HomePage.tsx
â”‚   â”œâ”€â”€ ShopPage.tsx
â”‚   â”œâ”€â”€ EventsPage.tsx
â”‚   â”œâ”€â”€ MusicPage.tsx
â”‚   â”œâ”€â”€ NewsPage.tsx
â”‚   â”œâ”€â”€ DashboardPage.tsx
â”‚   â””â”€â”€ ...
â”‚
â”œâ”€â”€ contexts/                  # Estado global
â”‚   â”œâ”€â”€ UserContext.tsx       # AutenticaÃ§Ã£o
â”‚   â”œâ”€â”€ CartContext.tsx       # Carrinho WooCommerce
â”‚   â””â”€â”€ MusicPlayerContext.tsx
â”‚
â”œâ”€â”€ hooks/                     # Hooks centralizados
â”‚   â””â”€â”€ useQueries.ts         # TODOS os hooks React Query
â”‚
â”œâ”€â”€ layouts/
â”‚   â””â”€â”€ MainLayout.tsx        # Layout principal (Navbar+Footer+Auth)
â”‚
â”œâ”€â”€ locales/                   # TraduÃ§Ãµes i18n
â”‚   â”œâ”€â”€ en/translation.json
â”‚   â””â”€â”€ pt/translation.json
â”‚
â””â”€â”€ config/
    â”œâ”€â”€ api.ts                # URLs da API (fonte de verdade)
    â”œâ”€â”€ routes.ts             # Mapa de rotas EN/PT
    â””â”€â”€ siteConfig.ts         # ConfiguraÃ§Ã£o do site
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
â”œâ”€â”€ functions.php              # Main entry point (loads /inc/)
â”œâ”€â”€ index.php                  # Serves React app
â”œâ”€â”€ header.php                 # HTML <head> injection
â”œâ”€â”€ footer.php                 # Closes HTML
â”‚
â””â”€â”€ inc/                       # Modular PHP functions
    â”œâ”€â”€ setup.php              # Theme support, CORS, performance
    â”œâ”€â”€ api.php                # Custom REST endpoints
    â”œâ”€â”€ cpt.php                # Custom Post Types
    â”œâ”€â”€ spa.php                # SPA routing integration
    â”œâ”€â”€ vite.php               # Vite asset injection
    â”œâ”€â”€ csp.php                # Content Security Policy
    â”œâ”€â”€ cleanup.php            # Remove WP bloat
    â””â”€â”€ metaboxes.php          # Admin UI metaboxes
```

### Custom REST Endpoints

Registered in `inc/api.php`:

```php
// Menu API
GET /wp-json/djzeneyer/v1/menu?lang=pt

// Products API
GET /wp-json/djzeneyer/v1/products?lang=pt

// ZenGame API
GET /wp-json/zengame/v1/me
GET /wp-json/zengame/v1/leaderboard

// Events API (via Zen BIT plugin)
GET /wp-json/zen-bit/v2/events

// Gamificacao API (via ZenGame plugin)
GET /wp-json/zengame/v1/me
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
GET /wp-json/zen-bit/v2/events
```

---

### 4. ZenGame (Gamificacao)

**File:** `plugins/zengame/zengame.php`

**Function:** Gamification brain (SSOT) para dashboard e leaderboard.

**Data Sources:**
- Dados consolidados de GamiPress + WooCommerce

**Endpoint:**
```php
GET /wp-json/zengame/v1/me
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
  â”‚
  â”œâ”€â”€â–º vite build (JS/CSS)
  â”‚
  â””â”€â”€â–º scripts/prerender.js
         â”‚
         â”œâ”€â”€â–º Puppeteer launches local server
         â”œâ”€â”€â–º Navigates to each route:
         â”‚      /about â†’ dist/about/index.html
         â”‚      /events â†’ dist/events/index.html
         â”‚      /pt/about â†’ dist/pt/about/index.html
         â”‚
         â””â”€â”€â–º Final HTML contains:
                â€¢ Complete meta tags
                â€¢ Schema.org JSON-LD
                â€¢ Indexable text content
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
â”œâ”€â”€ en/translation.json
â””â”€â”€ pt/translation.json
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
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ CLOUDFLARE (Edge Cache)                 â”‚
â”‚ â€¢ HTML: 2 hours                         â”‚
â”‚ â€¢ CSS/JS: 30 days (hash busting)       â”‚
â”‚ â€¢ Images: 7 days                        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
               â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ LITESPEED CACHE (Server Cache)          â”‚
â”‚ â€¢ HTML: 1 hour                          â”‚
â”‚ â€¢ API Responses: 10 minutes             â”‚
â”‚ â€¢ Database queries: 30 minutes          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Bundle Optimization

- **Code splitting** (lazy loading)
- **Tree shaking** (Vite)
- **Minification** (Terser)
- **Gzip compression**
- **Image optimization** (WebP, explicit dimensions)

### Web App Install Support

- site.webmanifest e icones PWA sao publicados na raiz da SPA (/site.webmanifest)
- O HTML principal referencia o manifesto para instalacao em Android/Chrome/Edge e melhor integracao mobile
- Nao ha service worker ativo nesta etapa; o site pode ser instalado, mas nao anuncia suporte offline/cache de app

---

## Security

### Implemented Protections

âœ… **HTTPS Only** - All requests via SSL
âœ… **CORS Restrictive** - Only djzeneyer.com authorized
âœ… **Rate Limiting** - Brute force protection
âœ… **JWT Expiration** - 7 days max
âœ… **XSS Protection** - DOMPurify sanitization
âœ… **CSRF Protection** - WordPress nonces
âœ… **SQL Injection** - Prepared statements
âœ… **CSP Headers** - Content Security Policy active

---

## Build & Deploy

### Build Process

```bash
npm run build
  â”‚
  â”œâ”€â”€â–º scripts/generate-sitemap.js  # Generate sitemap.xml
  â”œâ”€â”€â–º tsc                           # TypeScript compilation
  â”œâ”€â”€â–º vite build                    # Bundle React app
  â””â”€â”€â–º scripts/prerender.js          # SSG (16 HTML files)
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
  5. rsync dist/ â†’ Hostinger VPS
  6. Purge LiteSpeed Cache
  7. Ping sitemap to Google
```

---

## Monitoring & Analytics

### Core Web Vitals

- **LCP:** 1.6s âœ… (target: < 2.5s)
- **FID:** 45ms âœ… (target: < 100ms)
- **CLS:** 0.02 âœ… (target: < 0.1)

### Lighthouse Scores

- Performance: 96/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

---

## Future Improvements

- [ ] PWA offline (service worker + cache strategy)
- [ ] Push notifications
- [ ] Dark mode toggle
- [ ] React Native mobile app
- [ ] Spotify API integration
- [ ] Live chat support
- [ ] Event reviews system
- [ ] Affiliate program

---

**Atualizado:** Fevereiro 2026
**VersÃ£o:** 2.2.0



---

## Governanca de Mudancas (Obrigatoria)
- Mudou arquitetura, fluxo critico, endpoint ou regra de negocio: atualizar este arquivo no mesmo PR/commit.
- Mudou contrato de API: atualizar tambem `docs/API.md`.
- Mudou regra global de engenharia/contexto: atualizar `AI_CONTEXT_INDEX.md` e, se necessario, `AGENTS.md`.
- Mudou procedimento operacional recorrente de IA: atualizar skill relacionada em `.agents/skills/*`.

---

## i18n por Namespace (Atualizacao 2026-03)

A carga de traducoes foi segmentada por namespace para reduzir impacto no carregamento inicial.

Namespaces ativos:
- `translation` (geral)
- `quiz` (conteudo exclusivo do quiz)

Arquivos:
- `src/locales/en/translation.json`
- `src/locales/pt/translation.json`
- `src/locales/en/quiz.json`
- `src/locales/pt/quiz.json`

Regra pratica:
- Paginas comuns usam `useTranslation()` (namespace default `translation`).
- Paginas que precisam do quiz carregam `useTranslation(['translation', 'quiz'])`.
