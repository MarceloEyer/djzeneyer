---
name: web-performance-optimization
description: Optimize djzeneyer.com web performance across Core Web Vitals, Vite bundles, prerender output, images, caching, runtime React cost and WordPress/API TTFB. Use for performance audits and implementation planning.
risk: low
source: community-adapted
updated: "2026-05-30"
---

# Web Performance Optimization — djzeneyer.com

## Purpose

Optimize website and web application performance while respecting the real architecture:

- React 19 + Vite 8 + React Router 7 SPA.
- WordPress headless backend.
- Public routes pre-rendered at build time.
- LiteSpeed + Cloudflare cache.
- Public AI/search surfaces are product-critical.

Do not apply Next.js, App Router, Server Components, ISR or webpack-specific advice unless the project explicitly adopts those tools.

## When to use

Use this skill when:

- Core Web Vitals, Lighthouse, PageSpeed, TTFB or bundle size need diagnosis.
- A public page, REST endpoint or prerender route is slow.
- A PR changes heavy components, images, scripts, assets, prerender, cache, or third-party embeds.
- Search/AI visibility could be harmed by performance regressions.

For WordPress backend/database issues, combine with `wp-performance`.
For React-specific rendering issues, combine with `react-best-practices`.
For SEO implications, combine with `seo-audit`.

## Measurement first

Always establish a baseline before optimizing.

Recommended checks:

```bash
npm run build
npm run build:full
npm run perf:budget
```

For live routes:

```bash
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://djzeneyer.com/
curl -I https://djzeneyer.com/
```

Use Lighthouse/PageSpeed/WebPageTest when browser metrics matter. Prefer real mobile constraints for user-facing decisions.

## Project-specific priorities

### 1. Preserve prerender and static discovery

- Do not remove `scripts/prerender.js` or static Markdown generation without explicit approval.
- Public routes should ship meaningful prerendered HTML.
- Machine-readable resources such as `llms.txt`, `llms-full.txt`, `.well-known/*`, `robots.txt`, sitemaps and schema are performance-sensitive product surfaces.

### 2. Avoid routine public fetches

- The site is intentionally low-update and cache-friendly.
- Prefer prerender/static data for stable public information.
- Use React Query for runtime data when needed.
- Do not fetch inside components directly.

### 3. Optimize what is real

High-value areas:

- Vite bundle size.
- Route-level lazy loading via `React.lazy()` and `Suspense` where appropriate.
- Avoid re-allocating arrays/objects/functions on hot renders.
- Image size, dimensions, OG assets and responsive loading.
- Third-party embeds, especially YouTube.
- WordPress REST TTFB and cache headers.
- Prerender route count, payload size and memory usage.

## Common patterns

### React/Vite code splitting

```tsx
import { lazy, Suspense } from 'react';

const HeavyPage = lazy(() => import('./pages/HeavyPage'));

export function RouteWrapper() {
  return (
    <Suspense fallback={null}>
      <HeavyPage />
    </Suspense>
  );
}
```

Use this for routes or heavy optional components, not for tiny components.

### Stable render data

- Move static arrays to module scope.
- Use `useMemo` only when values depend on translations, language, user state or expensive computation.
- Use `useCallback` only when callback identity matters.
- Do not over-memoize everything blindly.

### Images

- Use correct dimensions to avoid CLS.
- Use responsive assets where available.
- Keep above-the-fold images eager/high priority when they are actual LCP candidates.
- Lazy-load below-the-fold media.
- OG images should stay 1200x630 and route-aware.

### Third-party scripts and embeds

- Avoid loading heavy third-party scripts on every page.
- Use dynamic loading or user-triggered embed loading when possible.
- YouTube iframe permissions and CSP belong in `inc/csp.php`, not ad-hoc page code.

### WordPress/API performance

- Prefer backend filtering and `_fields` to reduce payload.
- Avoid N+1 queries; prime caches when looping posts/users/thumbnails.
- Use long-lived transients for stable public data.
- REST responses can be cached when public and stable.
- Do not add NOCACHE for `/wp-json/`, `/feed/` or `/api/` by default.

## Anti-patterns

- Next.js `dynamic()`, `getStaticProps()`, App Router or Server Components guidance in this Vite SPA.
- webpack-only tooling as default advice.
- Blindly adding service workers, analytics or monitoring packages.
- Flushing all production caches without approval.
- Optimizing cosmetic micro-allocations before fixing TTFB, LCP, bundle weight or invalid prerender output.
- Removing public AI/search files to reduce output size.

## Output format

```text
Performance scope:
Baseline/evidence:
Likely bottleneck:
Recommended fixes:
Expected impact:
Validation commands:
Risks:
```

## Checklist

- [ ] Baseline measured.
- [ ] Stack-specific recommendation, no Next.js/webpack-only default.
- [ ] Prerender and AI/search resources preserved.
- [ ] Cache strategy respected.
- [ ] Validation command included.
- [ ] No speculative performance claims without evidence.