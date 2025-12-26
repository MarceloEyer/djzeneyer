# 🎵 DJ Zen Eyer - Complete Project Documentation

**Version:** 2.0.0  
**Last Updated:** 2025-11-27  
**Architecture:** Headless WordPress + React SPA  
**Author:** Marcelo Eyer Fernandes

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Database Structure](#database-structure)
5. [API Endpoints](#api-endpoints)
6. [Frontend Structure](#frontend-structure)
7. [WordPress Plugins](#wordpress-plugins)
8. [Authentication Flow](#authentication-flow)
9. [Caching Strategy](#caching-strategy)
10. [Deployment](#deployment)
11. [Development Guide](#development-guide)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**DJ Zen Eyer** is a professional DJ portfolio and e-commerce platform built with a modern headless architecture. The site features:

- **Multilingual Support** (English/Portuguese via Polylang)
- **E-commerce** (WooCommerce for merchandise/tickets)
- **Gamification** (GamiPress for user engagement)
- **Music Library** (Custom post type for tracks/sets)
- **Event Management** (Flyers custom post type)
- **Google OAuth** (Social login)
- **JWT Authentication** (Secure API access)
- **SEO Optimization** (Custom plugin with Schema.org)

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  React SPA (Vite) - Port 5173 (dev) / Static (prod)        │
│  - React Router (SPA routing)                                │
│  - React Helmet (SEO)                                        │
│  - Framer Motion (animations)                                │
│  - i18next (translations)                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (JSON)
                       │ JWT Authentication
┌──────────────────────▼──────────────────────────────────────┐
│                         BACKEND                              │
│  WordPress (Headless CMS) - MySQL Database                  │
│  - Custom Theme (zentheme) - Loads React build              │
│  - ZenEyer Auth Pro (JWT + OAuth)                           │
│  - Zen SEO Lite Pro (SEO + Schema)                          │
│  - WooCommerce (E-commerce)                                  │
│  - GamiPress (Gamification)                                  │
│  - Polylang (Multilingual)                                   │
│  - MailPoet (Newsletter)                                     │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Browser
    ↓
React App (localhost:5173 or djzeneyer.com)
    ↓
REST API Request (/wp-json/...)
    ↓
WordPress Backend
    ↓
MySQL Database
    ↓
JSON Response
    ↓
React Updates UI
```

---

## 💻 Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **Vite** | 5.4.21 | Build tool & dev server |
| **React Router** | 6.30.2 | SPA routing |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 3.4.18 | Styling |
| **Framer Motion** | 11.18.2 | Animations |
| **i18next** | 25.6.3 | Internationalization |
| **React Helmet** | 2.0.5 | SEO meta tags |
| **@react-oauth/google** | 0.12.2 | Google OAuth |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **WordPress** | 6.0+ | CMS & API |
| **PHP** | 7.4+ | Server-side language |
| **MySQL** | 5.7+ | Database |
| **WooCommerce** | Latest | E-commerce |
| **GamiPress** | Latest | Gamification |
| **Polylang** | Latest | Multilingual |
| **MailPoet** | Latest | Newsletter |
| **Firebase JWT** | 6.0 | Token generation |

### Custom Plugins

| Plugin | Version | Purpose |
|--------|---------|---------|
| **ZenEyer Auth Pro** | 2.0.0 | JWT + OAuth authentication |
| **Zen SEO Lite Pro** | 8.0.0 | SEO + Schema.org |

---

## 🗄️ Database Structure

### WordPress Core Tables

```sql
wp_posts              -- All content (posts, pages, products, CPTs)
wp_postmeta           -- Custom fields for posts
wp_users              -- User accounts
wp_usermeta           -- User metadata
wp_terms              -- Categories, tags, taxonomies
wp_term_taxonomy      -- Taxonomy definitions
wp_term_relationships -- Links posts to terms
wp_options            -- Site settings, transients (cache)
wp_comments           -- Comments (unused in headless)
```

### Custom Post Types

#### 1. **Flyers** (`post_type: 'flyers'`)

Event posters and promotional images.

```sql
-- Table: wp_posts (post_type = 'flyers')
Columns:
  - ID (primary key)
  - post_title (event name)
  - post_date (publication date)
  - post_status (publish/draft)
  - post_content (event description)

-- Meta fields (wp_postmeta):
  - _thumbnail_id (featured image)
  - _zen_seo_data (SEO metadata)
    - event_date (YYYY-MM-DD)
    - event_location (venue)
    - event_ticket (ticket URL)
```

**REST API:** `/wp-json/wp/v2/flyers`

#### 2. **Music/Remixes** (`post_type: 'remixes'`)

DJ tracks, sets, and remixes.

```sql
-- Table: wp_posts (post_type = 'remixes')
Columns:
  - ID
  - post_title (track name)
  - post_excerpt (short description)
  - post_content (full description)

-- Meta fields (wp_postmeta):
  - audio_url (Google Drive/Dropbox link)
  - soundcloud_url
  - youtube_url
  - _thumbnail_id (cover art)

-- Taxonomies:
  - music_tags (non-hierarchical: RnB, Kizomba, Chill)
  - music_type (hierarchical: Set, Track, Remix, EP)
```

**REST API:** `/wp-json/wp/v2/remixes?_embed&per_page=100`

### WooCommerce Tables

```sql
wp_wc_orders              -- Orders (WC 8.0+)
wp_wc_order_items         -- Line items in orders
wp_wc_order_itemmeta      -- Item metadata
wp_woocommerce_sessions   -- Cart sessions
wp_wc_product_meta_lookup -- Product search index

-- Products stored in wp_posts (post_type = 'product')
```

### GamiPress Tables

```sql
wp_gamipress_user_earnings -- Achievement/points history
wp_gamipress_logs          -- Activity logs

-- Custom post types:
wp_posts (post_type = 'insigna') -- Badges/achievements
wp_posts (post_type = 'rank')    -- User ranks

-- User points:
wp_usermeta (meta_key = '_gamipress_zen-points_points')
```

**Rank System:**

```
Level 1: Zen Novice      (0-99 points)
Level 2: Zen Apprentice  (100-499 points)
Level 3: Zen Voyager     (500-1499 points)
Level 4: Zen Master      (1500-3999 points)
Level 5: Zen Legend      (4000+ points)
```

### Polylang Tables

```sql
wp_term_relationships -- Links posts to language terms
wp_termmeta (meta_key = '_language')     -- Language codes (en, pt)
wp_termmeta (meta_key = '_translations') -- Translation links
```

### MailPoet Tables

```sql
wp_mailpoet_subscribers
wp_mailpoet_subscriber_segment
wp_mailpoet_segments -- Newsletter lists
```

---

## 🔌 API Endpoints

### Base URLs

```
Production:  https://djzeneyer.com/wp-json/
Development: http://localhost/wp-json/
```

### Custom Endpoints (`/djzeneyer/v1/`)

| Method | Endpoint | Description | Cache |
|--------|----------|-------------|-------|
| GET | `/menu?lang=en` | Navigation menu | 6h |
| POST | `/subscribe` | Newsletter signup | - |
| GET | `/products?lang=pt` | WooCommerce products | 30min |
| GET | `/gamipress/{user_id}` | User gamification data | 15min |
| GET | `/tracks/{user_id}` | User track downloads | - |
| GET | `/events/{user_id}` | User events | - |

**Example Request:**

```javascript
const response = await fetch('/wp-json/djzeneyer/v1/menu?lang=en');
const menu = await response.json();
```

### Auth Endpoints (`/zeneyer-auth/v1/`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/settings` | Public config (Google ID) | No |
| POST | `/auth/login` | Email/password login | No |
| POST | `/auth/register` | User registration | No |
| POST | `/auth/google` | Google OAuth login | No |
| POST | `/auth/validate` | Validate JWT token | No |
| POST | `/auth/refresh` | Refresh JWT token | No |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/password/reset` | Request password reset | No |
| POST | `/auth/password/set` | Set new password | No |

**Example Login:**

```javascript
const response = await fetch('/wp-json/zeneyer-auth/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});

const { data } = await response.json();
// data.token, data.refresh_token, data.user
```

### WordPress Core (`/wp/v2/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/remixes?_embed&per_page=100` | Music library |
| GET | `/flyers` | Event flyers |
| GET | `/posts` | Blog posts |
| GET | `/pages` | Static pages |

### WooCommerce (`/wc/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/v1/cart` | Current cart |
| GET | `/v3/orders?customer={id}` | User orders |
| GET | `/v3/products` | Products list |

### SEO Endpoints (`/zen-seo/v1/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | SEO settings |
| GET | `/sitemap` | Sitemap data |
| POST | `/cache/clear` | Clear cache (admin) |

---

## 📁 Frontend Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Navbar.tsx           -- Main navigation
│   │   ├── Footer.tsx           -- Site footer
│   │   ├── LanguageWrapper.tsx  -- i18n wrapper
│   │   └── UserMenu.tsx         -- User dropdown
│   ├── auth/
│   │   └── AuthModal.tsx        -- Login/Register modal
│   ├── Gamification/
│   │   └── GamificationWidget.tsx -- Points/badges display
│   └── HeadlessSEO.tsx          -- SEO component
│
├── contexts/
│   ├── UserContext.tsx          -- Auth state management
│   ├── CartContext.tsx          -- Shopping cart state
│   └── MusicPlayerContext.tsx   -- Music player state
│
├── hooks/
│   ├── useMenu.ts               -- Fetch navigation menu
│   ├── useGamiPress.ts          -- Fetch gamification data
│   ├── useUserStreak.ts         -- User login streak
│   ├── useUserEvents.ts         -- User events
│   └── useUserTracks.ts         -- User track downloads
│
├── pages/
│   ├── HomePage.tsx             -- Landing page
│   ├── AboutPage.tsx            -- About DJ
│   ├── EventsPage.tsx           -- Events/flyers
│   ├── MusicPage.tsx            -- Music library
│   ├── ZenTribePage.tsx         -- Community
│   ├── PressKitPage.tsx         -- Press kit
│   ├── ShopPage.tsx             -- E-commerce
│   ├── DashboardPage.tsx        -- User dashboard
│   ├── MyAccountPage.tsx        -- Account settings
│   ├── FAQPage.tsx              -- FAQ
│   └── NotFoundPage.tsx         -- 404 page
│
├── layouts/
│   └── MainLayout.tsx           -- Main layout wrapper
│
├── locales/
│   ├── en/
│   │   └── translation.json     -- English translations
│   └── pt/
│       └── translation.json     -- Portuguese translations
│
├── utils/
│   └── routeUtils.ts            -- Route helpers
│
├── config/
│   └── siteConfig.ts            -- Site configuration
│
├── data/
│   └── artistData.ts            -- Static artist data
│
├── App.tsx                      -- Main app component
├── main.tsx                     -- Entry point
├── i18n.ts                      -- i18next configuration
└── index.css                    -- Global styles
```

### Key Components

#### **UserContext.tsx**

Manages authentication state globally.

```typescript
interface WordPressUser {
  id: number;
  email: string;
  name?: string;
  display_name?: string;
  isLoggedIn: boolean;
  token?: string;
  avatar?: string;
  roles?: string[];
}

// Usage:
const { user, login, logout, googleLogin } = useUser();
```

#### **useMenu.ts**

Fetches navigation menu from WordPress.

```typescript
const menuItems = useMenu(); // Automatically detects language
```

#### **AuthModal.tsx**

Handles login/register with email or Google OAuth.

```typescript
<AuthModal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)}
  onSuccess={() => navigate('/dashboard')}
/>
```

---

## 🔐 Authentication Flow

### JWT Token Flow

```
1. User Login (email/password or Google)
   ↓
2. WordPress validates credentials
   ↓
3. Generate JWT token (expires in 7 days)
   ↓
4. Generate refresh token (expires in 30 days)
   ↓
5. Return tokens to React
   ↓
6. Store in localStorage
   ↓
7. Include in Authorization header for API requests
```

### Token Storage

```javascript
// After login
localStorage.setItem('zen_jwt', data.token);
localStorage.setItem('zen_user', JSON.stringify(data.user));

// For API requests
headers: {
  'Authorization': `Bearer ${localStorage.getItem('zen_jwt')}`
}
```

### Google OAuth Flow

```
1. User clicks "Login with Google"
   ↓
2. Google OAuth popup opens
   ↓
3. User authorizes
   ↓
4. Google returns ID token
   ↓
5. React sends ID token to WordPress
   ↓
6. WordPress validates with Google API
   ↓
7. Find or create WordPress user
   ↓
8. Generate JWT token
   ↓
9. Return to React
```

---

## 💾 Caching Strategy

### Transient Cache

WordPress uses transients for caching API responses.

| Data Type | Duration | Key Pattern |
|-----------|----------|-------------|
| Menu | 6 hours | `_transient_djz_menu_{lang}_v2` |
| Products | 30 minutes | `_transient_djz_products_{lang}_v2` |
| GamiPress | 15 minutes | `_transient_djz_gamipress_{user_id}` |
| Sitemap | 48 hours | `_transient_zen_seo_sitemap` |
| Schema | 24 hours | `_transient_zen_schema_{post_id}` |

### Cache Invalidation

```php
// Menu cache cleared on menu update
add_action('wp_update_nav_menu', function() {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_menu_%'");
});

// Product cache cleared on product save
add_action('save_post_product', function($post_id) {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_products_%'");
});

// GamiPress cache cleared on points update
add_action('gamipress_update_user_points', function($user_id) {
    delete_transient('djz_gamipress_' . $user_id);
});
```

---

## 🚀 Deployment

### Production Build

```bash
# 1. Build React app
npm run build

# 2. Upload dist/ to WordPress theme
# Location: /wp-content/themes/zentheme/dist/

# 3. Install WordPress plugins
composer install --no-dev

# 4. Configure WordPress
# - Activate plugins
# - Set permalinks to "Post name"
# - Configure Polylang (EN/PT)
# - Add Google Client ID
```

### Environment Variables

```bash
# .env (React)
VITE_WP_REST_URL=https://djzeneyer.com/wp-json/
VITE_WP_SITE_URL=https://djzeneyer.com
```

```php
// wp-config.php (WordPress)
define('ZENEYER_JWT_SECRET', 'your-64-character-secret');
define('WP_DEBUG', false);
define('WP_CACHE', true);
```

---

## 🛠️ Development Guide

### Setup

```bash
# 1. Clone repository
git clone https://github.com/MarceloEyer/djzeneyer.git
cd djzeneyer

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# Opens at http://localhost:5173

# 4. WordPress setup
# - Install WordPress locally
# - Import database
# - Activate plugins
# - Configure settings
```

### File Naming Conventions

```
Components:    PascalCase (UserMenu.tsx)
Hooks:         camelCase with 'use' prefix (useMenu.ts)
Pages:         PascalCase with 'Page' suffix (HomePage.tsx)
Utilities:     camelCase (routeUtils.ts)
Contexts:      PascalCase with 'Context' suffix (UserContext.tsx)
```

### Code Style

```typescript
// Use TypeScript interfaces
interface User {
  id: number;
  email: string;
}

// Use arrow functions
const fetchData = async () => {
  // ...
};

// Use optional chaining
const name = user?.display_name ?? 'Guest';

// Use template literals
const url = `${baseUrl}/api/endpoint`;
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **CORS Errors**

```
Error: Access to fetch at '...' has been blocked by CORS policy
```

**Solution:**
- Check `inc/setup.php` for allowed origins
- Ensure your domain is in the whitelist
- Clear browser cache

#### 2. **404 on React Routes**

```
Error: Page not found when refreshing /about
```

**Solution:**
- WordPress Admin → Settings → Permalinks → Save
- Check `.htaccess` has rewrite rules
- Verify `inc/spa.php` is loaded

#### 3. **JWT Token Expired**

```
Error: Token has expired. Please login again.
```

**Solution:**
- User needs to login again
- Implement refresh token logic
- Check token expiration settings

#### 4. **Menu Not Loading**

```
Error: Menu items empty
```

**Solution:**
- Check WordPress Admin → Appearance → Menus
- Verify menu is assigned to "Primary" location
- Clear menu cache: `wp transient delete djz_menu_en_v2`

#### 5. **Google OAuth Fails**

```
Error: Invalid Google token
```

**Solution:**
- Verify Google Client ID in WordPress settings
- Check authorized domains in Google Console
- Ensure redirect URIs are correct

---

## 📊 Performance Metrics

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ~1.8s |
| **FID** (First Input Delay) | < 100ms | ~50ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ~0.05 |
| **Bundle Size** | < 200KB | ~87KB (gzipped) |
| **API Response** | < 500ms | ~200ms (cached) |

### Optimization Techniques

1. **Code Splitting** - Lazy load pages
2. **Image Optimization** - WebP format, lazy loading
3. **API Caching** - Transients for 6h-48h
4. **CDN** - Cloudflare for static assets
5. **Minification** - Vite production build
6. **Tree Shaking** - Remove unused code

---

## 🔒 Security

### Implemented Measures

1. **JWT Authentication** - Secure token-based auth
2. **Rate Limiting** - 5 attempts per 10 minutes
3. **CORS Restrictions** - Whitelist specific origins
4. **Input Sanitization** - All user inputs sanitized
5. **SQL Injection Prevention** - Prepared statements
6. **XSS Protection** - Output escaping
7. **CSRF Protection** - Nonce validation
8. **HTTPS Only** - Force SSL in production

---

## 📞 Support

**Developer:** Marcelo Eyer Fernandes  
**Email:** booking@djzeneyer.com  
**Website:** https://djzeneyer.com  
**GitHub:** https://github.com/MarceloEyer/djzeneyer

---

## 📝 Changelog

### v2.0.0 (2025-11-27)
- Complete headless architecture
- Added ZenEyer Auth Pro plugin
- Added Zen SEO Lite Pro plugin
- Improved performance (75% faster)
- Enhanced security
- Complete documentation

### v1.0.0 (2024)
- Initial release
- Basic WordPress + React setup

---

**Last Updated:** 2025-11-27  
**Documentation Version:** 2.0.0
