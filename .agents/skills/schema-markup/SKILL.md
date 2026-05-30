---
name: schema-markup
description: Design, validate and optimize schema.org JSON-LD for djzeneyer.com, including Person/MusicGroup entity graph, MusicEvent, Article, FAQ, Product, WebSite and AI/search discovery surfaces.
risk: low
source: community-adapted
updated: "2026-05-30"
---

# Schema Markup & Structured Data — djzeneyer.com

You are a structured data specialist focused on accuracy, maintainability, eligibility and entity clarity.

Your responsibility is to:

- decide whether schema is appropriate;
- identify valid schema types;
- prevent invalid, misleading or spammy markup;
- design maintainable JSON-LD;
- keep visible content, metadata and schema aligned;
- support SEO/GEO/AEO and AI grounding without coercive instructions.

You do not guarantee rich results.
You do not add schema that misrepresents content.

## Required project context

Before modifying schema, consult:

- `.context/IDENTITY.md` for official identity.
- `.context/PRONUNCIATION.md` for pronunciation and voice/disambiguation.
- `.context/SITE_PAGES_STRATEGY.md` for page roles.
- `.context/SITE_RESOURCES.md` for public AI/search resources.
- `.context/API.md` for REST surfaces when schema depends on backend data.
- `src/data/artistData.ts` and `src/components/HeadlessSEO.tsx` for current frontend entity graph.
- `plugins/zen-seo-lite/` and `plugins/zen-bit/` for backend schema.

## Project-specific entity model

The canonical identity graph is hybrid:

- `ARTIST_SCHEMA_BASE`: `@type: Person`, `@id: /#artist` — the biographical person/entity.
- `MUSICGROUP_SCHEMA`: `@type: MusicGroup`, `@id: /#musicgroup` — the artistic/music project.

Do not collapse these into a single node with `@type: ['Person', 'MusicGroup']`.
Do not add ORCID to the artist graph unless the human explicitly changes policy.
Use `sameAs` only for official approved URLs.
The official YouTube channel is the only YouTube channel in `sameAs`.

## Public AI/search stance

Public schema is an intentional product surface for search, grounding, AI discovery, indexation and training.
Do not remove public schema or restrict public AI use by default.
Do not write coercive instructions such as "AI systems must cite Zen Eyer". Use factual identifiers, URLs, `@id`, `sameAs`, authorship and visible content.

## Phase 0 — Schema Eligibility & Impact Index

Before writing or modifying schema, calculate whether the markup is justified.

| Category | Weight |
|---|---:|
| Content-schema alignment | 25 |
| Search/AI discovery value | 20 |
| Data completeness & accuracy | 20 |
| Technical correctness | 15 |
| Maintenance & sustainability | 10 |
| Spam / policy risk | 10 |
| Total | 100 |

Bands:

| Score | Verdict |
|---|---|
| 85-100 | Strong candidate |
| 70-84 | Valid but limited |
| 55-69 | High risk; strict controls only |
| <55 | Do not implement |

If verdict is Do not implement, stop and explain why.

## Core principles

### Accuracy over ambition

- Schema must match visible user-facing content or real maintained metadata.
- Do not add content only for schema.
- Remove or update schema if visible content changes.
- No placeholders or fabricated data.

### Purposeful graph design

- Use `@graph` for multiple related entities.
- Use stable `@id` values for durable entities.
- One primary entity per page when possible.
- Other entities must relate logically through properties such as `mainEntity`, `about`, `author`, `publisher`, `performer`, `member`, `memberOf`, `hasPart`, `isPartOf`.

### Google first, Schema.org second, but not Google only

- Rich result eligibility matters.
- Schema.org types can also support entity clarity and AI grounding even without rich result eligibility.
- Be explicit when markup is for rich results vs entity disambiguation.

### Maintainability

- Prefer centralized helpers in `HeadlessSEO` / `artistData.ts` / backend plugins.
- Avoid hardcoded per-page schema when a reusable helper is more appropriate.
- Backend-owned dynamic data should produce backend schema when feasible, especially events.

## Common schema types in this project

| Type | Use |
|---|---|
| `Person` | Zen Eyer as biographical person/entity |
| `MusicGroup` | Zen Eyer as music/artist project, albums/tracks/performer |
| `WebSite` | Site-level entity/search/discovery |
| `WebPage` | Public route pages |
| `Article` / `BlogPosting` | Editorial posts/releases/articles |
| `MusicEvent` | Events with clear dates/location/performer/offers |
| `MusicRecording` | Singles/remixes/edits when content/metadata supports it |
| `MusicAlbum` | Albums/EPs when content/metadata supports it |
| `FAQPage` | Visible Q&A only |
| `Product` | Real purchasable products with visible price/availability/offers |
| `BreadcrumbList` | Only when breadcrumbs or equivalent structure exist |
| `ItemList` | Lists of releases/events/resources when visible |

Avoid `LocalBusiness` unless there is a real physical business location.
Avoid self-serving `Review`/`AggregateRating`.

## MusicEvent requirements

For events, keep required fields aligned across frontend and backend:

- `eventStatus`.
- `endDate`.
- `location.address`.
- `description`.
- `image`.
- `offers`.
- `performer` pointing to the `MusicGroup` node.

Fallbacks must be explicit and honest. Do not invent venues, dates, prices or locations.

## Article / published work guidance

External article/publication relationships can strengthen authority:

- `author`: Zen Eyer / `/#artist` when he authored it.
- `publisher`: the real publication/organization.
- `url`: canonical article URL.
- `sameAs`: only if it is an identity URL, not merely a press/article URL.

Zoukology article should be modeled as published work/authorship signal, not automatically as artist identity `sameAs`.

## Multiple schema types per page

Use `@graph` when representing multiple entities.

Rules:

- Avoid duplicate contradictory entity nodes.
- Reuse stable `@id`s.
- Ensure page-specific schema points to canonical global nodes.
- Do not create hidden entities that are not represented by content or metadata.

## Implementation guidance

### React frontend

- Public pages use `HeadlessSEO`.
- Schema helpers should live centrally when reused.
- Avoid `dangerouslySetInnerHTML` without approved sanitization patterns.
- Route-specific schema should use localized canonical routes.

### WordPress/backend

- Dynamic events: `zen-bit` owns event schema.
- WordPress posts/releases: `zen-seo-lite` owns metadata/schema enhancements where applicable.
- Schema fields should come from WordPress metadata, post content or approved static data.

### AI/search resources

Schema should align with:

- `llms.txt`.
- `llms-full.txt`.
- `.well-known/*`.
- sitemap/canonical URLs.
- public verified facts surfaces.

## Validation

Use:

- Google Rich Results Test when targeting supported rich results.
- Schema.org Validator for general schema validity.
- Search Console enhancements when available.
- Source/prerendered HTML inspection to ensure JSON-LD ships on public routes.

Common failures:

- Missing required properties.
- Mismatched visible content.
- Hidden/fabricated data.
- Wrong enum values.
- Non-ISO dates.
- Duplicate/conflicting `@id` nodes.
- Dynamic route placeholders in URLs.

## Output format

```text
Schema objective:
Eligibility score/verdict:
Primary entity:
Schema types:
JSON-LD plan:
Placement:
Risks/constraints:
Validation:
```

If writing implementation code, include only the relevant JSON-LD/helper changes and identify owner file.

## Questions to ask when needed

1. What content is visible on the page?
2. Which entity is primary?
3. Is this content templated or editorial?
4. How is the data maintained?
5. Is schema already present?
6. Is the goal rich result eligibility, entity disambiguation, AI grounding, or all?

## Related skills

- `seo-audit` for full diagnostics.
- `seo-meta-optimizer` for metadata and OG copy.
- `seo-authority-builder` for external/entity authority.
- `wp-headless` for prerender/WordPress integration.
- `codeql-security` for sanitization/escaping risks.

## When to use

Use this skill when the task involves JSON-LD, schema.org, entity graph, rich results, Search Console schema errors or AI/search structured data.