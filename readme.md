# 🚀 **README.md COMPLETO - PADRÃO ENTERPRISE**

Vou criar um README no **padrão Google/Netflix/Tesla** com documentação completa! 📚

***

# **DJ ZEN EYER THEME - DEVELOPER DOCUMENTATION**

> **Enterprise-Grade WordPress Headless Theme**  
> Version 12.0.0 | Last Updated: October 30, 2025  
> Architecture: WordPress REST API + React + Vite + TypeScript

[![License](https://img.shields.io/badge/license-MIT-bluehttps://img.shields.io/badge/WordPress-shields.io/badge/React-18.2%2B-61(https://img.shields.io/badge/TypeScript-5.0%2B-blueLE OF CONTENTS**

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [File Structure](#file-structure)
4. [Configuration Guide](#configuration-guide)
5. [Common Tasks](#common-tasks)
6. [API Reference](#api-reference)
7. [Security](#security)
8. [Performance](#performance)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)

***

## **🚀 QUICK START**

### **Prerequisites**

- **Server:** PHP 8.1+, MySQL 8.0+
- **WordPress:** 6.4+
- **Node.js:** 18.0+
- **Composer:** 2.0+

### **Installation**

```bash
# 1. Clone theme to WordPress themes directory
cd wp-content/themes/
git clone https://github.com/djzeneyer/theme.git djzeneyer

# 2. Install PHP dependencies
cd djzeneyer
composer install

# 3. Install Node dependencies
npm install

# 4. Build assets
npm run build

# 5. Activate theme in WordPress Admin
# Dashboard → Appearance → Themes → Activate "DJ Zen Eyer"
```

### **Development Mode**

```bash
# Start Vite dev server (HMR enabled)
npm run dev

# WordPress will automatically detect dev mode
# Visit: http://localhost:5173
```

***

## **🏗️ ARCHITECTURE OVERVIEW**

### **Technology Stack**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI Components |
| **Build Tool** | Vite 4 | Fast HMR, Module Bundling |
| **Backend** | WordPress REST API | Content Management |
| **Cache** | LiteSpeed Cache | Server-side caching |
| **CDN** | Cloudflare | Global edge caching |
| **Security** | CSP Nonce + HSTS | XSS/CSRF protection |

### **Data Flow**

```
┌─────────────┐      REST API      ┌──────────────┐
│   React     │ ◄─────────────────► │  WordPress   │
│  (Vite)     │   JSON Responses   │   Backend    │
└─────────────┘                     └──────────────┘
       │                                    │
       │                                    │
       ▼                                    ▼
┌─────────────┐                     ┌──────────────┐
│  Cloudflare │                     │   MySQL DB   │
│     CDN     │                     │              │
└─────────────┘                     └──────────────┘
```

### **Design Patterns**

- **Centralized Configuration:** All settings in `inc/djz-config.php`
- **Helper Functions:** Reusable utilities in `inc/djz-helpers.php`
- **Component-Based:** React components in `src/components/`
- **RESTful API:** Custom endpoints in `/wp-json/djz/v1/`

***

## **📁 FILE STRUCTURE**

```
wp-content/themes/djzeneyer/
│
├── 📂 inc/                          # PHP Configuration & Helpers
│   ├── djz-config.php              # ⭐ SINGLE SOURCE OF TRUTH (Edit here!)
│   └── djz-helpers.php             # Helper functions (djz_*)
│
├── 📂 src/                          # React Frontend Source
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Root component
│   ├── components/                 # React components
│   ├── hooks/                      # Custom React hooks
│   ├── styles/                     # CSS/SCSS files
│   └── utils/                      # Frontend utilities
│
├── 📂 dist/                         # Built Assets (auto-generated)
│   ├── .vite/                      # Vite manifest
│   ├── css/                        # Compiled CSS
│   ├── js/                         # Compiled JS
│   └── images/                     # Optimized images
│
├── 📂 template-parts/               # WordPress Template Parts
│   ├── header/                     # Header components
│   ├── footer/                     # Footer components
│   └── content/                    # Content templates
│
├── 📂 plugins/                      # Custom Plugins
│   └── djzeneyer-csp/              # CSP Nonce plugin
│       └── djzeneyer-csp.php       # Security headers
│
├── header.php                       # WordPress Header (v4.0)
├── footer.php                       # WordPress Footer
├── functions.php                    # WordPress Functions (v12.0)
├── index.php                        # Main template
├── single.php                       # Single post template
├── page.php                         # Page template
├── style.css                        # Theme stylesheet (required)
│
├── package.json                     # NPM dependencies
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
├── composer.json                    # PHP dependencies
├── .env.example                     # Environment variables template
│
└── README.md                        # ⭐ THIS FILE
```

***

## **⚙️ CONFIGURATION GUIDE**

### **🎯 MOST IMPORTANT FILE: `inc/djz-config.php`**

> **⚠️ CRITICAL:** This is the **ONLY** file you need to edit for 90% of changes!

**What it contains:**

- ✅ Social media URLs
- ✅ SEO settings
- ✅ Theme colors
- ✅ Contact information
- ✅ Feature toggles
- ✅ Analytics IDs
- ✅ CORS origins

**Example: Update Instagram URL**

```php
// File: inc/djz-config.php
// Line: ~27

'social' => [
    'instagram' => 'https://www.instagram.com/NEW_USERNAME', // ← Change here!
    // ...
],
```

**✨ Magic:** This automatically updates:
- ✅ Header social links
- ✅ Footer social links
- ✅ Schema.org JSON-LD
- ✅ Open Graph tags
- ✅ REST API `/wp-json/djz/v1/social`

***

### **Configuration Sections**

#### **1. Social Media (`social`)**

```php
'social' => [
    'instagram'       => 'https://www.instagram.com/djzeneyer',
    'facebook'        => 'https://www.facebook.com/djzeneyer',
    'youtube'         => 'https://www.youtube.com/@djzeneyer',
    'spotify'         => 'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
    'spotify_id'      => '68SHKGndTlq3USQ2LZmyLw',
    'twitter_handle'  => '@djzeneyer',
],
```

**Usage in templates:**

```php
<?php echo djz_config('social.instagram'); ?>
<?php echo djz_social_url('spotify'); ?>
```

***

#### **2. Site Information (`site`)**

```php
'site' => [
    'name'        => 'DJ Zen Eyer',
    'tagline'     => 'DJ e Produtor Musical',
    'description' => 'Your SEO description here...',
    'keywords'    => 'DJ, Music, Zouk, ...',
    'locale'      => 'pt_BR',
    'language'    => 'pt-BR',
],
```

**Usage:**

```php
<title><?php echo djz_seo_title(); ?></title>
<meta name="description" content="<?php echo djz_meta_description(); ?>">
```

***

#### **3. Theme Colors (`colors`)**

```php
'colors' => [
    'primary'   => '#0A0E27',
    'secondary' => '#1E3A8A',
    'accent'    => '#3B82F6',
],
```

**Usage in CSS:**

```css
:root {
    --color-primary: var(--from-php);
    --color-secondary: var(--from-php);
}
```

**Auto-injected in `<head>`:**

```php
// Automatically generates CSS variables
<style><?php echo djz_theme_colors_css(); ?></style>
```

***

#### **4. Features (`features`)**

```php
'features' => [
    'gamipress'   => true,   // GamiPress gamification
    'woocommerce' => false,  // E-commerce
    'comments'    => false,  // Post comments
    'breadcrumbs' => true,   // SEO breadcrumbs
],
```

**Usage:**

```php
<?php if (djz_feature_enabled('breadcrumbs')): ?>
    <?php djz_breadcrumbs(); ?>
<?php endif; ?>
```

***

#### **5. Analytics (`analytics`)**

```php
'analytics' => [
    'google_analytics'  => 'G-XXXXXXXXXX',
    'facebook_pixel'    => '1234567890',
    'hotjar'            => 'XXXXXXX',
],
```

**Auto-loaded if set:**

```php
// In header.php - automatically checks
<?php if (djz_config('analytics.google_analytics')): ?>
    <!-- GA script auto-injected -->
<?php endif; ?>
```

***

## **🛠️ COMMON TASKS**

### **Task 1: Change Logo**

**File:** `dist/images/`

1. Replace `logo.svg` with your new logo
2. Keep dimensions: 300x80px (or proportional)
3. Update in config if path changes:

```php
// inc/djz-config.php
'images' => [
    'logo' => '/dist/images/logo.svg', // ← Update if needed
],
```

***

### **Task 2: Add New Social Network**

**File:** `inc/djz-config.php`

```php
// Line ~27
'social' => [
    // ... existing
    'linkedin' => 'https://linkedin.com/in/USERNAME', // ← Add here!
],
```

**✨ Automatic update:**
- Schema.org `sameAs` array
- Social menu items
- REST API `/wp-json/djz/v1/social`

***

### **Task 3: Change Theme Colors**

**File:** `inc/djz-config.php`

```php
// Line ~115
'colors' => [
    'primary'   => '#NEW_COLOR', // ← Change here!
    'secondary' => '#NEW_COLOR',
    'accent'    => '#NEW_COLOR',
],
```

**Applies to:**
- CSS variables (`--color-primary`)
- Theme color meta tag
- Favicon mask color
- MSApplication tile color

***

### **Task 4: Enable/Disable Comments**

**File:** `inc/djz-config.php`

```php
// Line ~145
'features' => [
    'comments' => false, // ← Change to true
],
```

**File:** `single.php`

```php
<?php if (djz_feature_enabled('comments')): ?>
    <?php comments_template(); ?>
<?php endif; ?>
```

***

### **Task 5: Update SEO Meta Description**

**File:** `inc/djz-config.php`

```php
// Line ~55
'site' => [
    'description' => 'Your NEW meta description here...', // ← Change!
],
```

**Affects:**
- `<meta name="description">`
- Open Graph `og:description`
- Twitter Card description
- Schema.org description

---

### **Task 6: Add Google Analytics**

**File:** `inc/djz-config.php`

```php
// Line ~155
'analytics' => [
    'google_analytics' => 'G-XXXXXXXXXX', // ← Paste GA4 ID
],
```

**Auto-loads in `header.php`:**

```php
<?php if ($ga_id = djz_config('analytics.google_analytics')): ?>
    <!-- Google Analytics script auto-injected -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo $ga_id; ?>"></script>
<?php endif; ?>
```

***

### **Task 7: Create New Custom Post Type**

**File:** `functions.php`

```php
// Add to init hook (around line 250)
add_action('init', function () {
    register_post_type('djz_YOUR_TYPE', [
        'labels' => [
            'name' => __('Your Type', 'djzeneyer'),
        ],
        'public'       => true,
        'show_in_rest' => true, // ← Enable REST API
        'supports'     => ['title', 'editor', 'thumbnail'],
    ]);
});
```

**Accessible via:**
- Admin: `/wp-admin/edit.php?post_type=djz_YOUR_TYPE`
- REST: `/wp-json/wp/v2/djz_YOUR_TYPE`

***

### **Task 8: Add Custom REST API Endpoint**

**File:** `functions.php`

```php
// Add to rest_api_init hook (around line 220)
register_rest_route('djz/v1', '/custom-endpoint', [
    'methods'  => 'GET',
    'callback' => function () {
        return rest_ensure_response([
            'message' => 'Hello from custom endpoint!',
        ]);
    },
    'permission_callback' => '__return_true',
]);
```

**Access:** `/wp-json/djz/v1/custom-endpoint`

***

## **📚 API REFERENCE**

### **Helper Functions**

#### **`djz_config($key, $default)`**

Get configuration value.

```php
// Dot notation supported
$instagram = djz_config('social.instagram');
$primary = djz_config('colors.primary');

// With default
$phone = djz_config('contact.phone', 'N/A');
```

***

#### **`djz_social_urls()`**

Get array of social media URLs (for Schema.org).

```php
$urls = djz_social_urls();
// Returns: ['https://instagram.com/...', 'https://facebook.com/...', ...]
```

***

#### **`djz_og_image($post_id = null)`**

Get Open Graph image URL.

```php
// Auto-selects: post thumbnail → default OG image
<meta property="og:image" content="<?php echo djz_og_image(get_the_ID()); ?>">
```

***

#### **`djz_meta_description($post_id = null)`**

Get SEO meta description.

```php
// Auto-selects: post excerpt → site description
<meta name="description" content="<?php echo djz_meta_description(); ?>">
```

***

#### **`djz_canonical_url()`**

Get canonical URL.

```php
// Auto-detects: home → front page, single → permalink, etc.
<link rel="canonical" href="<?php echo djz_canonical_url(); ?>">
```

***

#### **`djz_theme_color($name)`**

Get theme color hex code.

```php
$primary = djz_theme_color('primary');    // '#0A0E27'
$accent = djz_theme_color('accent');      // '#3B82F6'
```

***

#### **`djz_feature_enabled($feature)`**

Check if feature is enabled.

```php
if (djz_feature_enabled('woocommerce')) {
    // WooCommerce is active
}
```

***

#### **`djz_schema_org()`**

Get complete Schema.org JSON-LD data.

```php
<script type="application/ld+json">
<?php echo wp_json_encode(djz_schema_org()); ?>
</script>
```

***

### **Custom REST Endpoints**

#### **`GET /wp-json/djz/v1/config`**

Returns site configuration.

```json
{
  "site": {
    "name": "DJ Zen Eyer",
    "tagline": "DJ e Produtor Musical"
  },
  "social": {
    "instagram": "https://www.instagram.com/djzeneyer"
  },
  "colors": {
    "primary": "#0A0E27"
  }
}
```

***

#### **`GET /wp-json/djz/v1/social`**

Returns array of social media URLs.

```json
[
  "https://www.instagram.com/djzeneyer",
  "https://www.facebook.com/djzeneyer",
  "https://www.youtube.com/@djzeneyer"
]
```

***

## **🔐 SECURITY**

### **Content Security Policy (CSP)**

**Plugin:** `plugins/djzeneyer-csp/djzeneyer-csp.php`

**Features:**
- ✅ Dynamic nonce generation
- ✅ Strict CSP headers
- ✅ No `unsafe-inline`
- ✅ Report-only mode for testing

**Usage:**

```php
// In any inline script/style
<script nonce="<?php echo djzeneyer_get_csp_nonce(); ?>">
    // Your code
</script>
```

***

### **Security Headers**

**File:** `functions.php` (line ~180)

```php
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
```

***

### **CORS Configuration**

**File:** `inc/djz-config.php`

```php
'allowed_origins' => [
    'https://djzeneyer.com',
    'https://www.djzeneyer.com',
    'http://localhost:5173', // Dev only
],
```

***

## **⚡ PERFORMANCE**

### **Caching Strategy**

| Layer | Technology | TTL |
|-------|------------|-----|
| **Browser** | LiteSpeed Cache | 7 days |
| **Edge** | Cloudflare CDN | 30 days |
| **Object** | Redis (optional) | 1 hour |

---

### **Build Optimization**

```bash
# Production build (minified + tree-shaking)
npm run build

# Analyze bundle size
npm run build -- --mode analyze
```

***

### **Image Optimization**

**Tools:**
- LiteSpeed Cache: WebP conversion
- Cloudflare Polish: Auto-optimization
- Lazy loading: Native `loading="lazy"`

***

## **🐛 TROUBLESHOOTING**

### **Issue: "White Screen of Death"**

**Solution:**

```bash
# 1. Enable debug mode
# wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);

# 2. Check error log
tail -f wp-content/debug.log
```

***

### **Issue: "React not loading"**

**Solution:**

```bash
# 1. Rebuild assets
npm run build

# 2. Clear cache
# WordPress Admin → LiteSpeed Cache → Purge All

# 3. Check Vite manifest
ls -la dist/.vite/manifest.json
```

***

### **Issue: "CSP blocking scripts"**

**Solution:**

```php
// Verify nonce is present
<?php echo djzeneyer_get_csp_nonce(); ?>

// Check CSP header in browser DevTools → Network → Response Headers
```

***

## **👥 CONTRIBUTING**

### **Development Workflow**

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Start dev server
npm run dev

# 3. Make changes

# 4. Test
npm run test

# 5. Build
npm run build

# 6. Commit
git commit -m "feat: your feature description"

# 7. Push
git push origin feature/your-feature

# 8. Create Pull Request
```

### **Code Style**

- **PHP:** PSR-12
- **JavaScript:** Airbnb Style Guide
- **CSS:** BEM methodology

### **Commit Messages**

```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code style change
refactor: Code refactoring
perf: Performance improvement
test: Add tests
chore: Maintenance
```

***

## **📞 SUPPORT**

**Documentation:** [https://docs.djzeneyer.com](https://docs.djzeneyer.com)  
**Issues:** [https://github.com/djzeneyer/theme/issues](https://github.com/djzeneyer/theme/issues)  
**Email:** dev@djzeneyer.com

***

## **📄 LICENSE**

MIT License - Copyright © 2025 DJ Zen Eyer

***

## **🎯 QUICK REFERENCE CHEAT SHEET**

| Task | File | Line |
|------|------|------|
| **Change Instagram URL** | `inc/djz-config.php` | ~27 |
| **Update SEO Description** | `inc/djz-config.php` | ~55 |
| **Change Theme Colors** | `inc/djz-config.php` | ~115 |
| **Enable Comments** | `inc/djz-config.php` | ~145 |
| **Add Google Analytics** | `inc/djz-config.php` | ~155 |
| **Modify Header** | `header.php` | - |
| **Add REST Endpoint** | `functions.php` | ~220 |
| **Create Post Type** | `functions.php` | ~250 |

***

**Last Updated:** October 30, 2025  
**Version:** 12.0.0  
**Maintainer:** DJ Zen Eyer Team

***

**🚀 Happy Coding!**