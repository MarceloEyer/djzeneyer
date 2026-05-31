---
name: clean-code
description: Practical clean code and refactoring guidance for djzeneyer.com. Use for code review/refactor quality while respecting project architecture, tests, i18n, SEO/AI surfaces and public/private data boundaries.
risk: safe
source: community-adapted
updated: "2026-05-30"
---

# Clean Code — djzeneyer.com

## Purpose

Improve readability, maintainability and correctness without breaking project-specific architecture or product decisions.

Clean code in this repo means code that is:

- easy to read and modify;
- aligned with `AI_CONTEXT_INDEX.md`, `.agents/GUIDELINES.md` and `.context/*`;
- safe for WordPress/PHP and React/TypeScript boundaries;
- compatible with i18n, SEO, prerender and public AI/search resources;
- conservative around public/private data boundaries.

## When to use

Use this skill when:

- Reviewing PRs.
- Refactoring legacy code.
- Splitting large components/functions.
- Removing duplication.
- Improving naming and module boundaries.
- Turning ad-hoc fixes into maintainable patterns.

Do not use it to override specialized skills. For security use `codeql-security`/`backend-security-coder`; for schema use `schema-markup`; for WordPress plugin work use `wp-plugin-development`; for React performance use `react-best-practices`/`web-performance-optimization`.

## Project-specific constraints

- Visible text must use i18n.
- Public pages must preserve `HeadlessSEO` and schema behavior.
- Private pages remain `noindex`.
- Data fetching belongs in centralized hooks.
- WordPress REST endpoints need explicit permissions.
- Public AI/search resources must not be removed as “cleanup”.
- Artist payment/support fields can be public by design.
- User/session/order/customer data stays private.
- Avoid large rewrites when small targeted changes solve the issue.

## Naming

Use intention-revealing, searchable names.

Good names answer:

- What is this?
- Who owns it?
- Is it public/private?
- Is it raw or normalized?
- Is it frontend/backend/schema/i18n data?

Avoid vague names like `data`, `info`, `manager`, `helper` when a domain name exists.

## Functions

Prefer functions that:

- do one thing;
- operate at one abstraction level;
- have clear inputs/outputs;
- avoid hidden side effects;
- are easy to test or reason about.

Do not force an arbitrary line limit if splitting would make the code less clear. Use domain boundaries as the primary guide.

## Components

For React:

- Keep route pages readable.
- Extract repeated sections into components.
- Keep data fetching out of visual components.
- Avoid hardcoded visible strings.
- Keep SEO/schema props visible and reviewable.
- Prefer module-scope constants for static arrays/objects.

## WordPress/PHP

For PHP:

- Keep plugin ownership clear.
- Avoid side effects at file load time.
- Use hooks intentionally.
- Sanitize input and escape output.
- Use `$wpdb->prepare()` or WP/Woo APIs.
- Do not mix admin-only code into frontend execution without need.

## Comments

Prefer code clarity over comments, but comments are useful for:

- security rationale;
- cache invalidation rationale;
- schema/SEO decisions;
- non-obvious WordPress or CodeQL constraints;
- intentional product decisions that might look strange to a future agent.

Do not delete comments that document traps unless the trap no longer exists.

## Error handling

- Fail safely.
- Avoid leaking secrets/tokens/private data.
- Return clear `WP_Error` with status in REST endpoints.
- Preserve useful frontend error/empty/loading states.
- Do not swallow errors silently when they affect SEO/prerender/build output.

## Tests and validation

Use the strongest practical validation for the change:

- `npm run type-check` for TypeScript.
- `npm run build` for frontend changes.
- `npm run build:full` for prerender/SEO/AI resources.
- `npm run i18n:check` for visible text.
- `npm run utf8:check` for docs/locales/LLM files.
- PHP lint/PHPStan when plugin code changes.

## Refactor rules

Before refactoring:

1. Identify the behavior to preserve.
2. Identify the owner file/module/plugin.
3. Make the smallest useful change.
4. Avoid mixing refactor with unrelated feature changes.
5. Validate after changes.
6. Document learned traps in `LEARNINGS.md` or `.context/OPERATIONS.md` if useful.

## Anti-patterns

- Big rewrite without measurable gain.
- Deleting context/SEO/AI files as “unused”.
- Moving WordPress-owned release content into frontend locale JSON.
- Replacing explicit product decisions with generic best practices.
- Creating new abstractions before duplication actually hurts.
- Hiding business/domain logic inside unnamed helpers.
- Overfitting to a bot review without checking code and product intent.

## Checklist

- [ ] Names reveal intent.
- [ ] Ownership boundary is clear.
- [ ] No accidental public/private regression.
- [ ] i18n respected.
- [ ] SEO/schema/prerender preserved when relevant.
- [ ] Security basics respected.
- [ ] Validation command identified or run.
- [ ] No unrelated changes bundled in.
