# MusicEvent Production Audit Playbook

## Objective

Validate that event pages ship valid, useful `MusicEvent` structured data in production and that Search Console does not report avoidable event enhancement errors.

This is an audit playbook, not a schema rewrite. The project already has MusicEvent ownership split between:

- `plugins/zen-bit/` for backend event data, normalization, cache and schema.
- `src/components/HeadlessSEO.tsx` and `src/seo/buildDynamicGraph.ts` for frontend schema graph composition.

## Required project rules

Every public `MusicEvent` must preserve:

- `eventStatus`
- `endDate`
- `location.address`
- `description`
- `image`
- `offers`
- `performer` pointing to the `MusicGroup` node

Do not invent venues, dates, prices or locations. Use explicit honest fallbacks only.

## Production audit checklist

### 1. Pick sample URLs

Audit at minimum:

- the English events index: `https://djzeneyer.com/zouk-events/`
- the Portuguese events index: `https://djzeneyer.com/pt/eventos-zouk/`
- one future event detail URL
- one past event detail URL, if public and indexable
- one event with ticket URL
- one event without ticket URL, to test fallback `Offer`
- one event with weak or partial location data, to test address fallback behavior

### 2. Inspect prerendered HTML

For each URL:

- Confirm JSON-LD is present in the initial HTML, not only after client hydration.
- Confirm there are no dynamic placeholders such as `:id`, `:slug`, `localhost`, or empty canonical fragments.
- Confirm `@id` URLs use stable trailing-slash patterns when they build graph nodes.
- Confirm the visible event content matches the schema content.

### 3. Validate required fields

For each `MusicEvent`, confirm:

| Field | Expected behavior |
|---|---|
| `name` | Visible event title, sanitized. |
| `startDate` | ISO-compatible date from event source. |
| `endDate` | Source end date or honest fallback from start date. |
| `eventStatus` | `https://schema.org/EventScheduled` unless explicit cancellation/postponement data exists. |
| `eventAttendanceMode` | Online only if event source clearly indicates online. |
| `location.name` | Venue/location label or honest fallback. |
| `location.address.addressLocality` | City when available. |
| `location.address.addressCountry` | Country when available. |
| `image` | Event image or route-aware OG fallback. |
| `description` | Visible/source description or fallback live-set description. |
| `offers.url` | Ticket URL, event URL, or canonical URL fallback. |
| `performer.@id` | `https://djzeneyer.com/#musicgroup`. |

### 4. Validate with external tools

Use:

- Google Rich Results Test for event rich-result eligibility.
- Schema.org Validator for general JSON-LD graph validity.
- Google Search Console Event enhancement report after deploy and recrawl.

### 5. Record findings

For each issue, use this format:

```text
URL:
Issue:
Source field:
Visible content:
Schema value:
Severity: Critical / High / Medium / Low
Owner: zen-bit / HeadlessSEO / buildDynamicGraph / content source
Recommendation:
```

## Severity guide

| Severity | Meaning |
|---|---|
| Critical | Invalid JSON-LD, broken canonical URL, missing required event field, private data leak. |
| High | Search Console enhancement error, mismatched visible/schema data, wrong performer node. |
| Medium | Weak fallback, incomplete address, missing event-specific image when available. |
| Low | Copy/format refinement, optional field missing, non-blocking warning. |

## What not to do

- Do not add schema-only data that is not visible or maintained.
- Do not mark article/press URLs as `sameAs`.
- Do not move dynamic event schema ownership away from `zen-bit` unless the backend source cannot provide the required data.
- Do not create a new plugin for event schema.
- Do not use fake prices or fabricated venue addresses to silence validators.

## Recommended follow-up PR types

- `fix(zen-bit): normalize missing event address fields`
- `fix(seo): repair MusicEvent canonical URL in prerendered HTML`
- `fix(events): pass ticket URLs through event detail payload`
- `docs(schema): record Search Console MusicEvent audit findings`
