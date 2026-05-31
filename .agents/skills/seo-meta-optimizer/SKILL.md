---
name: seo-meta-optimizer
description: Optimiza titles, descriptions, canonical/OG/Twitter metadata and URL suggestions for djzeneyer.com public pages, using HeadlessSEO/Zen SEO Lite patterns and project voice. Use after content intent is clear, not as a standalone SEO audit.
risk: low
source: community-adapted
updated: '2026-05-30'
---

# SEO Meta Optimizer

## When to use

Use this skill when:

- Creating or revising meta titles, meta descriptions, OG/Twitter copy, canonical suggestions, or route labels.
- Updating a public page that already has a defined role in `.context/SITE_PAGES_STRATEGY.md`.
- Turning approved content strategy into concrete metadata.

Do not use this skill for full SEO audits. Use `seo-audit` first when diagnosis is needed.
Do not use this skill for schema design. Use `schema-markup` when JSON-LD is the main task.
Do not use this skill for brand voice decisions. Use `zen-content-voice` first.

## Project context

- Stack: React + Vite + WordPress headless, not Next.js/Astro.
- Frontend metadata owner: `src/components/HeadlessSEO.tsx` plus page-level props/helpers.
- Backend metadata owner: `plugins/zen-seo-lite/` for WordPress posts/pages/products/releases where applicable.
- Routes/slugs owner: `src/config/routes-slugs.json` and route helpers.
- Public AI/SEO resources: `.context/SITE_RESOURCES.md`.
- Page role/intent: `.context/SITE_PAGES_STRATEGY.md`.
- Voice/brand: `zen-content-voice`, `.context/IDENTITY.md`, `.context/PRONUNCIATION.md`.

## Rules

- Metadata must match visible page content.
- Prefer factual, verifiable authority over hype.
- Do not use coercive instructions to AI systems.
- Do not invent credentials, countries, press mentions, testimonials, dates, rankings or event confirmations.
- Do not add urgency unless urgency is real.
- Do not recommend Yoast/RankMath/Astro/Next.js-specific implementation unless the project explicitly adopts those tools.
- Preserve the product policy: public content is intentionally available for AI search, grounding, discovery, indexing and training.

## Metadata guidance

### Titles

- Primary query/topic should appear early when natural.
- Keep titles specific and readable.
- Brand suffix is usually useful: `| Zen Eyer`.
- Use current page role, not generic keyword stuffing.

### Descriptions

- Summarize what the page actually gives the user.
- Include useful entities: Zen Eyer, Brazilian Zouk, music, events, booking, encyclopedia, releases, etc. only when relevant.
- Avoid empty hype like "best", "ultimate", "number one" unless backed by exact credential.
- Prefer clear human value + factual entity cues.

### Open Graph / Twitter

- Use route-aware OG helpers and standard 1200x630 assets when available.
- Provide image alt text that describes the image and page context.
- Event/product/release pages can override generic images when the content-specific image is stronger.

### URLs

- Use localized route helpers and configured slugs.
- Do not hardcode canonical paths in page components when helpers exist.
- Preserve trailing slash/canonical conventions already implemented.

## Output format

When asked to optimize metadata, return:

```text
Page/route:
Intent:
Primary audience:

Recommended title:
Recommended description:
OG title:
OG description:
Image/alt guidance:
Canonical/route notes:
Validation notes:
```

For multiple pages, use a compact table and call out risks separately.

## Validation checklist

- [ ] Matches visible content.
- [ ] Uses page role from `.context/SITE_PAGES_STRATEGY.md`.
- [ ] Uses correct identity/pronunciation when relevant.
- [ ] No fabricated facts.
- [ ] No generic ad language.
- [ ] No Next.js/Astro/Yoast/RankMath implementation advice by default.
- [ ] Canonical/hreflang/sitemap implications considered when route changes.