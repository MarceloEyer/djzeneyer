# Quick Reference Guide

Fast reference for common operations and troubleshooting.

## 🚀 Common Commands

```bash
# Development
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Full production build with prerendering
npm run preview               # Preview production build locally

# Utilities
npm run generate-sitemaps     # Generate sitemap
npm run lint                  # Run ESLint
npm run format                # Format code with Prettier
```

## 📁 Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main React app entry point |
| `src/components/AppRoutes.tsx` | Route definitions |
| `inc/api.php` | WordPress REST API endpoints |
| `inc/setup.php` | WordPress theme setup & CORS |
| `vite.config.ts` | Vite + Tailwind 4 config (sem tailwind.config.js — Tailwind 4 é CSS-first) |
| `scripts/prerender.js` | SSG prerendering script |

## 🔌 API Quick Test

```bash
# Test menu endpoint
curl "https://djzeneyer.com/wp-json/djzeneyer/v1/menu?lang=en"

# Test products endpoint
curl "https://djzeneyer.com/wp-json/djzeneyer/v1/products?lang=pt"

# Check WordPress API health
curl -I "https://djzeneyer.com/wp-json/"

# Test CORS
curl -H "Origin: https://djzeneyer.com" "https://djzeneyer.com/wp-json/"
```

## 🐛 Common Issues & Fixes

### Issue: 404 on API endpoints
**Fix:** Flush WordPress permalinks
```bash
wp rewrite flush
# Or: WP Admin > Settings > Permalinks > Save
```

### Issue: CORS errors
**Fix:** Check allowed origins in `inc/setup.php`
```php
function djz_allowed_origins(): array {
    return ['https://djzeneyer.com', 'http://localhost:5173'];
}
```

### Issue: Build fails with Puppeteer error
**Fix:** Puppeteer is optional for prerendering. Build will succeed anyway.
```bash
# The error is informational - static HTML generation skipped but build works
```

### Issue: Translations not showing
**Fix:**
1. Add translations to `src/locales/pt/translation.json`
2. Rebuild: `npm run build`
3. Clear browser cache

### Issue: Images not loading
**Fix:** Check image paths in `public/images/`
```bash
# Correct: /images/hero-background.webp
# Wrong: /public/images/hero-background.webp
```

## 📊 Performance Checklist

- [ ] LCP < 1.8s (use Lighthouse)
- [ ] Bundle < 200KB gzipped (check `dist/`)
- [ ] All images have dimensions
- [ ] Lazy loading enabled for routes
- [ ] CSS is minified
- [ ] JavaScript is code-split

## 🎨 Design System

### Colors
```js
// Primary: azul elétrico
'blue-500': '#3B82F6'   // primary
// Secondary: violeta/roxo claro  (secondary É violet — não evitar)
// Accent: ciano/turquesa

// Dark theme base
background: '#0a0a0f'   // região

// EVITAR: gradientes chamativos em títulos, paleta flat sem profundidade
// Estética: MMORPG contemporâneo, premium, imersivo
// Referências de qualidade: Dashboard e Zen Tribe pages
```

### Spacing
```js
// Use 8px grid system
space-2  // 8px
space-4  // 16px
space-6  // 24px
space-8  // 32px
```

## 🔐 Security Checklist

- [ ] CORS restricted to allowed origins
- [ ] CSP headers in `.htaccess`
- [ ] JWT tokens validated
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] No secrets in client code

## 🌍 Bilingual Routes

| English | Portuguese |
|---------|-----------|
| `/` | `/pt/` |
| `/about-dj-zen-eyer/` | `/pt/sobre-dj-zen-eyer/` |
| `/zouk-events/` | `/pt/eventos-zouk/` |
| `/zouk-music/` | `/pt/musica-zouk/` |
| `/shop/` | `/pt/loja/` |
| `/zen-tribe/` | `/pt/zen-tribo/` |
| `/events/{slug}` | `/pt/eventos/{slug}` |

Regra: idioma EN não tem prefixo `/en/` — apenas `/slug`. PT sempre `/pt/slug`.

## 📱 Responsive Breakpoints

```js
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
```

## 🔄 Deployment Flow

1. **Commit changes:** `git add . && git commit -m "message"`
2. **Push to GitHub:** `git push origin main`
3. **Auto-deploy:** GitHub Actions builds and deploys to Hostinger
4. **Clear cache:** LiteSpeed Cache + Cloudflare
5. **Test:** Verify changes on production

## 📞 Support Contacts

- **Developer:** Marcelo Eyer Fernandes
- **Website:** [djzeneyer.com](https://djzeneyer.com)
- **Email:** contato@djzeneyer.com

---

**Last Updated:** January 2026
