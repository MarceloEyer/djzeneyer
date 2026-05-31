---
name: react-best-practices
description: React performance and client-side best practices for djzeneyer.com. This project uses Vite 8 + React Router 7, not Next.js/SSR/Server Components. Use for memoization, bundle size, re-renders and client-side data fetching.
risk: low
source: community-adapted
updated: "2026-05-30"
---

# React Best Practices — djzeneyer.com

## Scope

Use this skill for React performance and client-side behavior in the current app:

- React 19.
- Vite 8.
- React Router 7.
- React Query v5.
- Public routes prerendered with Puppeteer, then hydrated.

This project is not Next.js, not SSR, not App Router and not React Server Components. Server-side rules from Next/Vercel guides are not applicable unless the architecture changes.

## Do not apply here

| Pattern | Why not |
|---|---|
| `React.cache()` | Server Components/per-request only |
| LRU cross-request React cache | SSR/server-only |
| App Router / Server Components | Not this architecture |
| `next/dynamic` | Use `React.lazy()` + `Suspense` |
| Streaming Suspense data fetching | Can break prerender/Puppeteer if applied blindly |
| `getStaticProps` / ISR | Next.js only |

## Valid categories

| Area | Project approach |
|---|---|
| Eliminating waterfalls | Start independent promises early; use backend/prerender where appropriate |
| Bundle size | Direct imports, lazy routes/components, defer third-party code |
| Client-side data | React Query v5 in centralized hooks |
| Re-renders | stable providers, memoization when measured/useful |
| Rendering | content visibility, static JSX/arrays, SVG precision where relevant |
| JavaScript perf | Map/Set lookups, early exits, combined iterations when useful |

## Client-side data fetching

Rules:

- Do not `fetch()` directly inside components.
- Use hooks in `src/hooks/`.
- Query keys follow `src/config/queryClient.ts`.
- Treat prerendered route data as initial cache data, not a global store.
- Do not use Suspense data fetching unless explicitly validated with `build:full` and prerender.

## Bundle size

High-value patterns:

- Route-level `React.lazy()` for heavy routes.
- Lazy-load optional media/embed-heavy components.
- Avoid barrel imports when they pull too much.
- Defer third-party code unless critical.
- Keep icons/components tree-shakeable.

## Re-render optimization

Use when there is a signal, not by default.

- Memoize provider values.
- Move static arrays/objects to module scope.
- Use primitive dependencies in effects.
- Use functional setState for stable callbacks.
- Use `startTransition` for non-urgent UI updates when applicable.
- Avoid subscribing to state only used inside callbacks.

## Rendering performance

- Keep expensive below-the-fold sections lazy or static when possible.
- Avoid layout shifts in prerendered routes.
- Use dimensions/aspect-ratio for images/media.
- Animate wrappers instead of heavy SVG internals when needed.
- Respect route SEO and visible content during hydration.

## Project guardrails

- Public pages must keep meaningful prerendered HTML.
- Public pages should keep `HeadlessSEO` and schema behavior.
- Private pages remain `noindex`.
- Visible text uses i18n.
- Public AI/search resources must not be removed as “performance cleanup”.

## Output format

```text
React performance scope:
Evidence/signal:
Likely bottleneck:
Recommended change:
Validation:
Risks:
```

## Validation

Use the strongest practical command:

- `npm run type-check`.
- `npm run build`.
- `npm run build:full` for prerender/SEO/AI-sensitive routes.
- `npm run perf:budget` for performance-budget changes.

## When to use

Use this skill for React performance and client-side data/rendering behavior. For component architecture use `react-patterns`; for web/CWV broader performance use `web-performance-optimization`.