# Booking, Press, Media and Verified Facts Surface Map

## Objective

Keep the professional conversion surfaces clear and non-overlapping.

The site has multiple public surfaces that may look similar to a visitor or agent, but they have different jobs:

| Surface | Primary job | User intent |
|---|---|---|
| Work With Me | Convert organizers into booking conversations | Hire Zen Eyer or request collaboration |
| Press Kit / EPK | Give organizers reusable assets | Copy bio, download PDF/MD/assets, reuse official material |
| Media | Show external proof and identifiers | Verify credibility, sources and public authority |
| Verified Facts | Canonical factual reference | Check stable facts for Wikidata, AI, press, and schema |

## Product rules

- Booking and Press Kit are related, but not the same flow.
- Work With Me should sell the professional fit and reduce friction to contact.
- Press Kit should reduce organizer workload after interest exists.
- Media should not become a dumping ground for every URL. Classify links before adding.
- Verified Facts should be factual, stable, and boring on purpose.
- Do not add press/article URLs to `sameAs` unless they are official identity profiles.
- Keep public copy factual and verifiable; avoid unsupported superlatives.

## Recommended page intent

### Work With Me

Primary CTA:

- WhatsApp booking
- Email booking
- Instagram if useful as secondary social proof/contact

Content blocks:

1. What kind of events Zen Eyer fits.
2. Verifiable credentials.
3. Countries/festivals/experience.
4. Short “why organizers book him” explanation.
5. Contact buttons.
6. Links to Press Kit and Media, not duplicated full content.

Avoid:

- Turning the page into a full archive of every fact.
- Long encyclopedia explanations.
- Too many low-priority outbound links before the contact CTA.

### Press Kit / EPK

Primary CTA:

- Copy canonical bio.
- Download PDF.
- Download Markdown/source text.
- Access photos/logos.

Content blocks:

1. Short bio.
2. Long bio.
3. Pronunciation.
4. Approved social handle and website.
5. Photos/logos/assets.
6. Tech/rider link when available.
7. Contact footer.

Avoid:

- Replacing Work With Me.
- Using subjective claims that an organizer cannot verify.

### Media

Primary CTA:

- Verify external proof.

Content blocks:

1. Official identifiers.
2. Music databases/platforms.
3. Press/features.
4. Event listings/lineup citations.
5. Analytics/directories where valuable.

Avoid:

- Adding all links to schema.
- Treating press mentions as identity `sameAs`.

### Verified Facts

Primary CTA:

- Provide facts that can be copied into Wikidata, press and AI context.

Content blocks:

1. Canonical name and alias.
2. Pronunciation.
3. Championship name and year.
4. Country count.
5. Official identifiers.
6. Source notes.

Avoid:

- Marketing language.
- Mutable facts without a last-reviewed date.

## Implementation checklist

When changing any of these pages:

- Confirm the page role in `.context/SITE_PAGES_STRATEGY.md`.
- Confirm identity/fact claims in `.context/IDENTITY.md` and `src/data/artistData.ts`.
- Use i18n keys for visible UI copy.
- Use `HeadlessSEO` on public routes.
- Do not hardcode canonical paths; use route helpers.
- If adding an external URL, classify it using `.context/IDENTITY.md` link-classification rules.
- If adding conversion CTAs, instrument them through `src/lib/analytics.ts` once analytics foundation is merged.

## Suggested future implementation PRs

- `feat(booking): track WhatsApp and email lead clicks`
- `feat(press): add short/medium/long reusable bio blocks`
- `feat(media): group external proof by source type`
- `feat(facts): expose canonical verified facts as copyable blocks`
