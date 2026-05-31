---
name: react-patterns
description: "React composition, hooks, component boundaries and state patterns for the djzeneyer.com React SPA. Use for component design, not for Next.js, Server Components, SSR or data-fetching architecture decisions."
risk: low
source: community-adapted
updated: "2026-05-30"
---

# React Patterns — djzeneyer.com

## Scope

This skill covers React component structure and client-side UI patterns for the current project:

- React 19.
- Vite 8.
- React Router 7.
- React Query v5.
- i18next/react-i18next.
- Tailwind 4.
- Public routes pre-rendered at build time, then hydrated.

This project is not Next.js, not React Server Components, not App Router, not SSR and not ISR. Do not recommend Server Components, `getStaticProps`, `next/dynamic`, App Router patterns or server-only hooks.

For performance-specific refactors, prefer `react-best-practices` and `web-performance-optimization`.
For type-system decisions, use `typescript-pro`.

## Component types

| Type | Use | Notes |
|---|---|---|
| Presentational | UI display from props | Prefer pure, small components |
| Container/feature | Coordinates local feature state | Keep page logic readable |
| Route page | Route-level composition and SEO | Must use i18n and `HeadlessSEO` when public |
| Provider/context | Cross-cutting client state | Memoize provider values |
| Hook | Reusable logic/data access | Fetching belongs in centralized hooks |

## Design rules

- One responsibility per component.
- Composition over inheritance.
- Props down, events up.
- Keep route pages readable; extract repeated UI sections.
- Avoid hardcoded visible strings; use `t('key')`.
- Public pages should include correct `HeadlessSEO`.
- Private pages should remain `noindex`.

## Hooks

### When to extract hooks

| Pattern | Extract when |
|---|---|
| Data access | API/server state repeats or belongs to shared domain |
| Local UI behavior | Same state/effect pattern appears multiple times |
| Browser APIs | localStorage, media queries, scroll, resize, clipboard |
| Forms | Complex validation/submission state |

### Project rules

- Hooks at top level only.
- Custom hooks start with `use`.
- Clean up effects on unmount.
- Do not call `fetch()` directly in components.
- Server state should use React Query through centralized hooks in `src/hooks/`.
- Query keys should follow `src/config/queryClient.ts`.
- Avoid suspense data fetching unless explicitly validated with the prerender pipeline.

## State management

| Need | Preferred solution |
|---|---|
| Single component | `useState` / `useReducer` |
| Parent-child | Lift state up |
| Subtree/global client state | Context |
| Server state | React Query v5 |
| Complex global store | Ask before adding a new library |

Rules:

- Provider values should use `useMemo` when they include objects/functions.
- Stable callbacks use `useCallback` only when identity matters.
- Avoid duplicating server state into local state unless necessary for UX.

## React 19 notes

- `useActionState` and `useOptimistic` may be useful for forms and optimistic UI.
- The `use` API and Server Component patterns are not defaults for this SPA.
- Do not assume React Compiler removes the need for project-specific profiling or memoization.

## Composition patterns

Useful patterns:

- Compound components for tabs, accordions, menus.
- Slot-like props for flexible layouts.
- Render props only when hooks are insufficient.
- Higher-order components mainly for legacy/class compatibility, such as i18n class components.

## Performance principles

Optimize only after a signal:

| Signal | Action |
|---|---|
| Slow route/page | Profile and inspect bundle/prerender output |
| Large optional UI | `React.lazy()` + `Suspense` |
| Repeated expensive calculation | `useMemo` or module-scope cache |
| Callback identity matters | `useCallback` |
| Large static data inside render | Move to module scope |

Avoid blanket memoization. Prefer targeted fixes that are measurable.

## Error handling

- Use route-level or feature-level error boundaries for risky sections.
- Show useful fallback UI.
- Preserve user input where possible.
- Log errors without exposing secrets/tokens/private data.

## TypeScript patterns

- Use interfaces for component props when simple.
- Use union types for finite UI states.
- Avoid `any` unless isolated and justified.
- Prefer precise API response types with runtime validation where data crosses trust boundaries.

## Testing principles

When tests exist or are being added:

- Test user-visible behavior.
- Test hooks and pure functions where regressions are likely.
- Test error/empty/loading states.
- Avoid tests that only snapshot implementation details.

## Anti-patterns

| Do not | Prefer |
|---|---|
| Server Components advice | SPA/client-side patterns |
| `fetch()` inside components | Centralized hooks + React Query |
| Visible hardcoded strings | i18n keys |
| Giant route files | Extract feature sections |
| Index as key for dynamic lists | Stable unique IDs |
| `useEffect` for derived render data | derive during render or memoize |
| Local state copy of server data | React Query cache/derived selectors |
| Suspense data fetching without validation | standard React Query flow |

## When to use

Use this skill when designing or refactoring React components, hooks, UI boundaries and local state. For performance audits, security, WordPress integration or SEO/schema, use the relevant specialized skill.
