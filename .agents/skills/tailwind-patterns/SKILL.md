---
name: tailwind-patterns
description: Tailwind CSS v4 patterns for djzeneyer.com: CSS-first theme, responsive layouts, design tokens, reusable components and performance-safe class usage.
risk: low
source: community-adapted
updated: "2026-05-30"
---

# Tailwind CSS Patterns — djzeneyer.com

## Scope

Use this skill when configuring or refactoring Tailwind CSS v4, design tokens, responsive layouts, reusable UI components or component-level styling.

Project context:

- React 19 + Vite 8.
- Tailwind 4.
- Public routes are prerendered.
- UI should support a polished artist/brand site without sacrificing readability, accessibility or performance.

Do not use this skill to redefine brand voice, content strategy, routing, SEO or schema.

## Tailwind v4 architecture

Tailwind v4 is CSS-first. Prefer CSS variables and `@theme` where the project already uses that approach.

| v3 legacy | v4 pattern |
|---|---|
| `tailwind.config.js` as default source | CSS-based `@theme` where adopted |
| JIT discussion | Native/always-on behavior |
| Heavy `@apply` usage | Prefer components and utilities |
| Dynamic class strings | Prefer static classes or safe maps |

## Project styling principles

- Mobile-first.
- Accessible contrast and tap targets.
- Clear hierarchy over visual noise.
- Reusable components over repeated long class strings.
- Avoid arbitrary values when a token or standard scale works.
- Avoid class generation via unbounded template strings.
- Avoid gradient-heavy headline patterns if current design rules reject them.

## Responsive design

| Prefix | Use |
|---|---|
| none | mobile base |
| `sm:` | large phone/small tablet |
| `md:` | tablet |
| `lg:` | laptop |
| `xl:` | desktop |
| `2xl:` | large desktop |

Rules:

- Write mobile styles first.
- Add larger overrides progressively.
- Use container queries for reusable components when parent width matters more than viewport width.

## Layout patterns

Prefer:

- Flexible grids using `auto-fit/minmax`.
- Asymmetric/Bento layouts where it improves storytelling.
- Section spacing that breathes on mobile.
- Clear cards/sections with consistent padding.

Avoid:

- Symmetric three-column grids everywhere.
- Huge visual sections with little content.
- Repeated class blobs that should become components.

## Design tokens

Use semantic tokens when defining project-specific styles:

```css
@theme {
  --color-primary: ...;
  --color-surface: ...;
  --spacing-section: ...;
}
```

Token layers:

| Layer | Purpose |
|---|---|
| Primitive | raw values |
| Semantic | purpose-based names |
| Component | local component variables |

## Typography

- Use readable line length.
- Body text should prioritize readability over display style.
- Headings should communicate hierarchy, not just decoration.
- Preserve i18n expansion: English and Portuguese text lengths differ.

## Animation and transitions

- Keep motion subtle and purposeful.
- Avoid animations that hurt Core Web Vitals or accessibility.
- Framer Motion objects should not be inline when reused; extract variants to module scope.
- Respect reduced motion when appropriate.

## Component extraction

Extract a component when:

- The same class combination repeats 3+ times.
- Variant logic becomes hard to read.
- The element represents a reusable design system concept.
- Accessibility needs repeated structure.

Prefer React components for dynamic UI. Use CSS utilities for simple static layout.

## Performance rules

- Use static class names when possible.
- Avoid unbounded dynamic classes such as `` `bg-${color}-500` ``.
- Keep large icon/animation/visual components lazy if not critical.
- Do not add heavy UI libraries for one-off layout problems.
- Validate relevant changes with `npm run build` or stronger command.

## Anti-patterns

| Do not | Prefer |
|---|---|
| Arbitrary values everywhere | design scale/token |
| `!important` | fix specificity/layout |
| Inline `style` for normal styling | utilities/components |
| Long duplicated class lists | extract component |
| Heavy `@apply` | component extraction |
| Unbounded dynamic classes | static maps |
| Visual-only headings | semantic heading hierarchy |

## Output format

```text
UI scope:
Current issue:
Tailwind/component recommendation:
Accessibility/performance notes:
Validation:
```

## When to use

Use this skill for Tailwind v4/UI implementation details. For content voice use `zen-content-voice`; for React composition use `react-patterns`; for performance audits use `web-performance-optimization`.
