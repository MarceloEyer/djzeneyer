---
name: seo-audit
description: Diagnose SEO, GEO, AEO, crawlability, indexation, machine-readable resources and organic visibility issues for djzeneyer.com. Audit only; do not implement fixes unless requested.
risk: low
source: community-adapted
updated: "2026-05-30"
---

# SEO / GEO / AEO Audit — djzeneyer.com

You are an SEO diagnostic specialist. Your role is to identify, explain and prioritize issues affecting organic visibility, AI/search discovery, grounding, indexation and entity authority.

Do not implement fixes unless explicitly requested.

## Project-specific stance

This site is unusual: public content is intentionally available for search, grounding, discovery, indexing and AI training.

Do not recommend restricting public AI/search resources unless the human explicitly asks:

- `Content-Signal: ai-train=yes, search=yes, ai-input=yes`.
- `llms.txt`.
- `llms-full.txt`.
- `.well-known/*` resources.
- API catalog / MCP / Agent Skills public resources.
- Schema JSON-LD and verified facts surfaces.

Private/authenticated user data, credentials, tokens, sessions and third-party payment/user data remain private.

## Scope gate

Before a full audit, clarify or infer explicitly:

1. Business context:
   - Site type: artist/entity hub + WordPress headless + React SPA + e-commerce/community surfaces.
   - Primary goal: authority, discovery, international bookings, Knowledge Panel, AI grounding, music/event discovery.
   - Target markets/languages: EN/PT unless another scope is given.

2. SEO focus:
   - Full site or specific pages?
   - Technical SEO, content, schema, AI discovery/GEO, AEO, authority, or all?
   - Mobile/desktop/both?

3. Data access:
   - Search Console / analytics / PageSpeed / crawl data available?
   - Known recent PRs, migrations or deploy changes?

If context is missing, state assumptions and proceed with evidence available.

## Audit framework

Priority order:

1. Crawlability & Indexation.
2. Machine-readable discovery: `robots.txt`, `llms*`, `.well-known/*`, MCP/API catalog/Agent Skills, sitemap, Link headers.
3. Technical Foundations: performance, prerender, canonical/hreflang, accessibility, HTTPS.
4. On-Page Optimization: titles, descriptions, H1, internal linking, page intent.
5. Content Quality & E-E-A-T: factual claims, citations, authorship, depth.
6. Entity / Authority Signals: Person/MusicGroup graph, external citations, Wikidata/MusicBrainz/platforms, Zoukology/article references.

## Technical SEO checklist

### Crawlability

- `robots.txt` accessible and intentionally permissive for public content.
- Sitemap reference present.
- Important public paths not accidentally blocked.
- Staging/private paths blocked where needed.
- Machine-readable public resources are crawlable when intended.

### Indexation

- Public mature pages are indexable.
- Placeholder/hub pages without real content may remain `noindex`.
- Private pages remain `noindex`.
- Canonicals are self-consistent.
- Hreflang points to real localized URLs.
- No dynamic route placeholders like `:slug` or `:id` in canonicals/hreflang.

### Prerender and SPA

- Public routes have meaningful prerendered HTML.
- `HeadlessSEO` outputs expected metadata/schema.
- React hydration does not erase essential SEO content.
- WordPress/post/event data used by prerender is current enough for the page purpose.

### Performance / Core Web Vitals

- LCP < 2.5s.
- INP < 200ms.
- CLS < 0.1.
- TTFB reasonable for cached public pages.
- Static assets and public machine-readable resources are cacheable.

### AI discovery / GEO / AEO

- `llms.txt` and `llms-full.txt` are UTF-8 clean and factual.
- `.well-known/*` resources are reachable and internally consistent.
- API catalog/MCP/Agent Skills describe public resources only.
- Public content uses facts, identifiers and links, not coercive instructions to AI systems.
- `Content-Signal` policy matches product stance: allow training/input/search for public content.
- RFC 8288 Link headers present on homepage for machine-readable resource discovery.
- DNS-AID records are published and validated (SVCB type 64 with AD=true).
- `SpeakableSpecification` present on About/FAQ pages where voice answers are valuable.
- `VideoObject` schema present on pages with embedded YouTube videos.
- Wikidata Q136551855 is linked from `sameAs` and contains accurate, sourced facts.
- MusicBrainz profile is consistent with official identity.
- FAQ schema answers real user questions in the first sentence without coercive framing.
- Pronunciation file (`pronunciation.txt`) accessible and referenced from `llms.txt`.

### GEO entity consistency audit

Verify cross-platform consistency for AI grounding:

- [ ] Artist name "Zen Eyer" (not "DJ Zen Eyer") as primary name on Spotify, Apple Music, YouTube channel.
- [ ] Wikidata Q136551855: accurate birth date (1985-08-20), nationality, championship facts with sources.
- [ ] MusicBrainz: releases, aliases ("DJ Zen Eyer") and ISRC when available. Wikidata Q136551855 link present.
- [ ] Bandsintown (ID: `id_15619775`): events synced, bio uses canonical name, website links to djzeneyer.com.
- [ ] Songkick: profile uses canonical name, website links to djzeneyer.com, URL added to `sameAs` in `src/data/artistData.ts`.
- [ ] YouTube: channel name, description and about section use canonical identity and link to djzeneyer.com.
- [ ] YouTube Music: separate channel — name and bio consistent with YouTube main channel.
- [ ] `sameAs` in schema matches actual official platform URLs (no articles, lineups or playlists).
- [ ] Championship naming consistent: "Zouk DJ Championship 2022" / "I Campeonato Internacional de DJs" — not "Zouk Worlds".
- [ ] Country count: 14 presencial countries — verify consistency across About, Media, press kit, `src/data/artistData.ts`.
- [ ] Zoukology article: published with return link to djzeneyer.com. Schema on article uses `author: {/@id: /#artist}`.
- [ ] Pronunciation file accessible at `public/pronunciation.txt` and referenced from `llms.txt`.

## On-page audit

### Titles and descriptions

- Unique and page-intent aligned.
- Uses factual identity cues where relevant: Zen Eyer, Brazilian Zouk, music, events, encyclopedia.
- Avoids exaggerated self-praise.

### Headings/content

- One clear H1.
- Content answers the page intent quickly.
- Internal links reinforce entity/topic clusters.
- Visible content matches schema and metadata.

### Images

- Accurate alt text.
- OG image dimensions and route-specific images when relevant.
- No private user/avatar image in public OG tags.

## Content quality and authority

Assess:

- First-hand experience.
- External citations and official links.
- Author attribution.
- Verified awards and event participation.
- Consistency across About, Media, Press Kit, verified facts, `src/data/artistData.ts` and schema.
- Current consolidated public country count: 14 presencial countries, unless factual audit updates it.

## SEO Health Index

The score is diagnostic, not a promise of rankings.

| Category | Weight |
|---|---:|
| Crawlability & Indexation | 25 |
| Machine-readable AI/Search Discovery | 20 |
| Technical Foundations | 20 |
| On-Page Optimization | 15 |
| Content Quality & E-E-A-T | 10 |
| Entity / Authority Signals | 10 |
| Total | 100 |

If a category is out of scope, redistribute weight proportionally and state it.

### Severity deductions

| Issue severity | Deduction |
|---|---:|
| Critical | -15 to -30 |
| High | -10 |
| Medium | -5 |
| Low | -1 to -3 |

Confidence modifier:

- High: 100% of deduction.
- Medium: 50%.
- Low: 25%.

### Bands

| Score | Status |
|---|---|
| 90-100 | Excellent |
| 75-89 | Good |
| 60-74 | Fair |
| 40-59 | Poor |
| <40 | Critical |

A high score with unresolved critical issues is invalid; flag it.

## Finding format

For every issue:

```text
Issue:
Category:
Evidence:
Severity:
Confidence:
Why it matters:
Score impact:
Recommendation:
```

Do not rely on intuition. Evidence can include URLs, headers, Search Console, PageSpeed, crawl output, source code, prerendered HTML or reproducible commands.

## Prioritized action plan

Group actions as:

1. Critical blockers.
2. High-impact improvements.
3. Quick wins.
4. Longer-term authority opportunities.

Actions must reference findings and expected score recovery range. Avoid timelines unless requested.

## Related skills

Use after the audit is complete and findings are accepted:

- `schema-markup` for JSON-LD work.
- `seo-meta-optimizer` for title/description/OG implementation.
- `seo-authority-builder` for entity, citation and external authority work.
- `web-performance-optimization` for performance remediation.
- `wp-headless` for prerender/WordPress integration issues.
- `zen-content-voice` for public copy tone.

## When to use

Use this skill for SEO/GEO/AEO diagnostics. For implementation, route to the relevant specialized skill.