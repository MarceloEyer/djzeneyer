# 📋 Project Roadmap & Tasks

This document tracks pending tasks, improvements, and configuration checks for the DJ Zen Eyer project.

## 🔴 Critical Path (Must Do Before Full Launch)

### 1. Verification & Consistency
- [ ] **URL Slugs Synchronization**: Verify that WordPress page slugs match React routes in `src/data/routeMap.json` and `src/config/routes.ts`.
    - *Example*: Ensure `/sobre` (PT) and `/about` (EN) are correctly mapped.
- [ ] **Clean up WordPress**: Delete unused pages in WP Admin (e.g., "Apoie o Artista", "Compra de Ingressos", "Encomenda Completa") if they are handled entirely by WooCommerce/React.

### 2. Assets & Content
- [ ] **Replace Placeholders**: Replace SVG placeholders in `/public/images/` with real production images:
    - `hero-background` (WebP, 1920x1080)
    - `press-photo-*.jpg` (800x800)
    - Event images (`mentoria-dj`, `zouk-experience`)
    - `zen-eyer-og-image.png` (1200x630)

### 3. Testing
- [ ] **End-to-End User Flow**:
    - [ ] Registration (Email & Google)
    - [ ] Login/Logout
    - [ ] Profile Update
    - [ ] Language Switch (EN <-> PT) preservation
- [ ] **E-commerce**:
    - [ ] Add product to cart
    - [ ] Checkout flow (mock payment)
    - [ ] Verify order appears in "My Account"
- [ ] **Gamification**:
    - [ ] Verify XP points increase after purchase
    - [ ] Verify Dashboard reflects new points/ranks

---

## 🟡 Improvements & Features

### Authentication
- [ ] **Email Verification**: Implement email verification flow after registration.
    1. Generate token on register.
    2. Send email with link.
    3. Verify token via API.

### SEO & Marketing
- [ ] **SEO Audit**: Run a full Crawl (Screaming Frog or similar) to verify:
    - Canonical tags
    - Hreflang tags (en/pt reciprocity)
    - Meta descriptions present on all public pages.
- [ ] **Sitemap**: Verify `sitemap.xml` is generated correctly and accessible.
- [ ] **Analytics**: Confirm Google Analytics/GTM is firing correctly on route changes (SPA).

---

## ⚙️ Configuration & DevOps

### WordPress Configuration
- [x] **Enterprise Architecture**: Verified consistency of .bolt/config.json with codebase (CSP, Nonces, Setup). (2026-01-22)
- [ ] **Permalinks**: Ensure set to "Post name" (`/%postname%/`).
- [x] **Cors**: Verify `Access-Control-Allow-Origin` headers allow the production frontend domain.
- [ ] **Caching**:
    - Configure LiteSpeed Cache to exclude REST API endpoints specific to user data (`/zeneyer-auth`, `/cart`).
    - Enable Object Cache if available on hosting.

### Cloudflare
- [ ] **Page Rules**:
    - Cache Level: Standard
    - Edge Cache TTL: Respect Headers
- [ ] **Security**:
    - WAF rules to protect `/wp-login.php` and `/wp-admin`.
    - Rate limiting for API endpoints.

### MailPoet / Email
- [ ] **SPF/DKIM**: Verify DNS records to ensure emails land in Inbox, not Spam.
- [ ] **Welcome Email**: Design and activate the automatic welcome email for the "Zen Tribe".

---

## 🧪 API Verification Checklist

Run these curls to ensure backend health:

```bash
# Health Check
curl -I https://djzeneyer.com/wp-json/

# Menu & Products
curl https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en
curl https://djzeneyer.com/wp-json/djzeneyer/v1/products?lang=en

# Gamification (replace {id} with test user)
curl https://djzeneyer.com/wp-json/djzeneyer/v1/activity/{id}
```
