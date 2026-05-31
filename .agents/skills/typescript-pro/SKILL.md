---
name: typescript-pro
description: TypeScript type safety for djzeneyer.com: React 19, Vite 8, API contracts, schemas, React Query data, route types and safe public/private boundaries. Use for complex types and contracts, not routine UI copy.
risk: low
source: community-adapted
updated: "2026-05-30"
---

# TypeScript Pro — djzeneyer.com

## When to use

Use this skill when:

- Designing shared types or API contracts.
- Hardening data returned from WordPress REST APIs.
- Typing React Query hooks and route/page props.
- Creating or updating schema validation.
- Removing `any` or unsafe casts from important surfaces.
- Modeling public/private data boundaries.

Do not use this skill for simple styling, copywriting or routine component edits with obvious types.

## Project context

- React 19.
- Vite 8.
- TypeScript 6.
- React Router 7.
- React Query v5.
- WordPress REST backend.
- Public routes are pre-rendered and hydrated.

Check `package.json` before assuming exact versions.

## Principles

- Model runtime data honestly.
- Prefer small explicit types over large clever abstractions.
- Avoid `any` unless isolated and justified.
- Prefer inference when it is clear.
- Use unions for finite states.
- Use runtime validation when data crosses trust boundaries.
- Keep public and private response types separate.

## High-value type surfaces

| Surface | Why it matters |
|---|---|
| WordPress REST responses | Backend can return missing/null/false fields |
| `artistData.ts` | Public entity graph and site identity |
| `HeadlessSEO` props | Metadata/schema correctness |
| Events | MusicEvent schema, dates, offers, locations |
| Auth/session | Private user state and route guards |
| Payment/support fields | Public artist support data, not user payment data |
| i18n keys | Prevent missing visible strings |
| Route config | Canonical/hreflang/sitemap stability |

## Approach

1. Identify the runtime source of data.
2. Define the minimal useful type.
3. Represent nullable/optional/false-returning WordPress values explicitly.
4. Add runtime guards or schema validation when needed.
5. Keep conversion/normalization close to the boundary.
6. Validate with `npm run type-check` and relevant tests/build.

## WordPress false/null patterns

WordPress/PHP APIs may return `false`, empty string, missing keys or `null`. Do not type them as guaranteed strings unless normalized.

Example:

```ts
type MaybeString = string | null | false | undefined;

function normalizeString(value: MaybeString): string {
  return typeof value === 'string' ? value : '';
}
```

## React Query contracts

- Query functions should return normalized domain types.
- Query keys should follow `src/config/queryClient.ts`.
- Avoid duplicating response normalization inside components.
- Use clear loading/error/empty states.

## Public/private boundary

- Public artist/site data can be typed separately from authenticated user data.
- Never reuse a private `User`/`Order` type for public AI/search endpoints.
- Payment/support data for the artist can be public by design, but customer/order/payment data cannot.

## Output

When asked for type work, provide:

```text
Type surface:
Runtime source:
Risks:
Proposed types:
Normalization/validation:
Validation command:
```

For code, include only the relevant type definitions and usage changes.

## Validation

- `npm run type-check`.
- `npm run build` when route/schema/frontend behavior changes.
- Tests when the PR adds or changes test coverage.

## Anti-patterns

- Over-engineered generic types for one-off values.
- Abstract classes/decorators unless already used and justified.
- `as any` to silence real contract mismatch.
- Treating WordPress false/null returns as guaranteed strings.
- Mixing public and private response shapes.
- Adding new type libraries without checking bundle/tooling impact.
