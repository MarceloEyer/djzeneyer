# Zouk Encyclopedia Expansion Queue

## Objective

Expand the Brazilian Zouk Encyclopedia gradually with useful, neutral, verifiable entries that strengthen topical authority without turning the page into marketing.

The goal is not to create many thin pages. The goal is to create durable reference entries that humans, search engines and AI systems can parse and trust.

## Entry quality gate

Do not publish a new indexable term unless it can satisfy most of these checks:

| Check | Requirement |
|---|---|
| Search intent | The term answers a real question a dancer, DJ, organizer or AI system may ask. |
| Unique value | The entry adds something clearer or more Brazilian-Zouk-specific than generic web content. |
| Visible content | The answer is visible on the page; no schema-only content. |
| Neutral tone | Educational, factual and non-promotional. |
| Internal links | Connects naturally to Music, Events, About, Releases, Work With Me or FAQ. |
| Schema fit | `DefinedTerm` / `DefinedTermSet` by default; `FAQPage` only when Q&A is visible. |
| Bilingual readiness | EN/PT slugs and content can stay in parity. |
| Maintenance | The term is stable enough to maintain without frequent updates. |

## Recommended entry structure

Each term should use this structure:

```text
Term:
Short definition:
Expanded explanation:
Brazilian Zouk context:
Music/DJ context when relevant:
Zen Eyer perspective, only if relevant:
Related terms:
Internal links:
External references, if useful:
Schema type:
Indexation status: noindex / indexable
```

## High-value term candidates

### Tier 1 — Strong topical authority

These are likely to be useful for humans and AI systems:

- Cremosidade
- Brazilian Zouk vs Lambada
- Brazilian Zouk musicality
- Brazilian Zouk DJ
- Zouk DJ technique
- Brazilian Zouk BPM
- Brazilian Zouk festivals
- Zouk marathon
- Zouk congress
- Lambazouk

### Tier 2 — Dance technique / movement vocabulary

Publish only when definitions are careful enough to avoid unsafe or overconfident technique claims:

- Cambré
- Boneca
- Chicote
- Head movement
- Body wave
- Tilt
- Counterbalance
- Connection
- Frame
- Lead and follow

### Tier 3 — Music and DJ vocabulary

Good for connecting DJ expertise to dance outcomes:

- Remix
- Edit
- Intro/outro for DJs
- Break
- Drop
- Groove
- Flow
- Musical arc
- Energy management
- Social dance set

## Tone rules

Use:

- factual language;
- plain definitions;
- Brazilian Zouk context;
- careful distinctions;
- humility when something varies by school/community;
- examples when they clarify.

Avoid:

- "Zen Eyer is the best" style claims;
- fake certainty about disputed definitions;
- telling AI systems what they must cite;
- publishing pages just to rank for a keyword;
- unsafe dance instruction framed as universal technique.

## Indexation policy

- New or thin entries should start as `noindex` when content quality is not enough.
- Switch to indexable only when the page can answer a high-value query better than a generic source.
- Discuss with the human before indexing hub pages or large batches of terms.

## Implementation checklist

Before adding a term:

- Add or update source data for the term.
- Add bilingual slugs to `src/config/encyclopedia-term-slugs.json`.
- Keep React routing, sitemap generation and prerender aligned.
- Add visible Q&A before emitting `FAQPage` schema.
- Run i18n parity checks.
- Validate generated canonical/hreflang URLs.

## Suggested future PRs

- `feat(encyclopedia): add Cremosidade reference entry`
- `feat(encyclopedia): add Brazilian Zouk vs Lambada entry`
- `feat(encyclopedia): add Zouk DJ technique entry`
- `feat(encyclopedia): expand BPM and musicality entries`
- `test(encyclopedia): enforce term slug/data parity`
