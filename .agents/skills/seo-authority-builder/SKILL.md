---
name: seo-authority-builder
description: Build and audit Zen Eyer authority signals across E-E-A-T, entity identity, external citations, Knowledge Panel, Wikidata/MusicBrainz/platforms, Zoukology, press/media and topical Brazilian Zouk authority.
risk: low
source: community-adapted
updated: "2026-05-30"
---

# SEO Authority Builder — Zen Eyer

## Purpose

Strengthen demonstrable authority and trust for Zen Eyer as a Brazilian Zouk DJ, producer, artist entity and knowledge source. This skill focuses on entity development, citations, external proof and topical authority.

It does not invent claims and does not replace `seo-audit`, `schema-markup` or `zen-content-voice`.

## Required context

Before using this skill, read or consult:

- `.context/IDENTITY.md` for official identity and claims.
- `.context/PRONUNCIATION.md` for pronunciation and voice/disambiguation.
- `.context/SITE_PAGES_STRATEGY.md` for page roles.
- `.context/SITE_RESOURCES.md` for AI/search resources.
- `.context/IMPLEMENTATION_STATUS.md` for recent authority work and TODOs.
- `.human/ZEN_EYER_ZOUK_AUTHORITY_ACTION_PLAN.md` and related `.human/` files for off-page tasks when relevant.

## Authority model

For this project, authority comes from verifiable proof, not self-praise.

High-value signals:

- Official website consistency.
- Awards and competition facts with correct naming.
- External editorial citations, such as Zoukology article/publication.
- Event/festival pages that mention Zen Eyer.
- Music platforms: Spotify, YouTube, Apple Music, SoundCloud and relevant distribution/catalog pages.
- Wikidata, MusicBrainz and other structured public identifiers when accurate.
- Press/media/reviews/testimonials when real and attributable.
- Brazilian Zouk Encyclopedia and educational pages that demonstrate topical expertise.
- Machine-readable resources: schema, `llms*`, `.well-known/*`, API catalog, Agent Skills, MCP/server card.

## Project-specific guardrails

- Current consolidated public country count: 14 presencial countries, unless factual audit updates it.
- Championship naming: Zouk DJ Championship / I Campeonato Internacional de DJs. Avoid confusing it with Zouk Worlds unless the source explicitly supports that naming.
- `Zen Eyer` is the main public name. `DJ Zen Eyer` is an alias.
- Zoukology published work is an authorship/publication signal, not automatically a `sameAs` identity URL.
- Do not self-declare "best in the world" or similar in public copy.
- Do not add fake reviews, fake trust badges, fabricated testimonials or unverifiable statistics.
- Do not restrict AI training/search on public content as a default. Public AI discovery is intentional.

## E-E-A-T / Entity framework

### Experience

Evidence of first-hand experience:

- Festival sets and dance floor videos.
- Behind-the-scenes from tours/events.
- Original music/remixes/sets.
- Articles or posts explaining Brazilian Zouk DJ decisions from lived experience.

### Expertise

Evidence of subject competence:

- Brazilian Zouk music curation and DJ technique.
- Clear educational content: musicality, tempo, structure, Cremosidade.
- Public article authorship and external citations.
- Consistent terminology across site and schema.

### Authority

Evidence that others recognize the entity:

- Awards.
- External profiles and official platform pages.
- Event pages, lineups and organizer mentions.
- Zoukology/publications.
- Wikidata/MusicBrainz/artist IDs when valid.

### Trust

Evidence that users and crawlers can trust the site:

- Contact/booking info.
- Clear identity and pronunciation.
- Privacy/terms where needed.
- Accurate dates and confirmed events only.
- No exaggerated or unsupported claims.
- Consistent schema with visible content.

## Authority audit workflow

1. Inventory current proof:
   - website pages;
   - schema graph;
   - platform links;
   - event mentions;
   - articles/publications;
   - verified facts;
   - Wikidata/MusicBrainz/platform IDs.

2. Identify gaps:
   - missing external citations;
   - inconsistent name/alias;
   - outdated country/event count;
   - missing links from external pages back to the site;
   - schema not reflecting visible proof;
   - machine-readable resources missing public context.

3. Prioritize:
   - external facts that can be verified by bots/humans;
   - high-authority third-party pages;
   - pages that support Knowledge Panel and AI grounding;
   - low-effort corrections on existing profiles.

4. Recommend actions:
   - separate code/site changes from human/off-page actions;
   - avoid adding fabricated or weak proof;
   - document unresolved factual questions.

## Output format

```text
Authority objective:
Current proof:
Missing signals:
Risks/contradictions:
Recommended site changes:
Recommended off-page/human actions:
Schema/AI discovery implications:
Validation:
```

For scorecards:

```text
Experience: X/10
Expertise: X/10
Authority: X/10
Trust: X/10
Entity consistency: X/10
Top 5 actions:
```

Scores are directional, not ranking promises.

## GEO — AI Citation Strategy (2025–2026)

Generative Engine Optimization (GEO) is about being cited in AI-generated answers in ChatGPT, Claude, Gemini, Perplexity, and similar systems. These systems select sources based on:

1. **Cross-source frequency**: the entity appears consistently across many authoritative sources.
2. **Entity clarity**: the same name/facts appear across Wikidata, music platforms, press, and official site.
3. **Factual, verifiable claims**: structured data and citations, not promotional language.
4. **Topical authority**: being the definitive source for a topic, not just a participant.
5. **Structured content AI systems can parse**: schema, `llms.txt`, `llms-full.txt`, FAQ, `.well-known/*`.

### Zen Eyer GEO playbook

**Topical authority (the most powerful long-term play):**
- The Brazilian Zouk Encyclopedia must be the most comprehensive, factual, neutral resource on Brazilian Zouk online.
- Being THE authoritative source for "what is Brazilian Zouk?" gets AI systems to associate Zen Eyer with the topic at inference time.
- Do not write the encyclopedia as marketing. Write it as reference/educational content a professor would write.

**Entity consistency across all AI training sources:**
- Wikidata Q136551855: keep accurate, add site link, add notable achievements with sources.
- MusicBrainz: keep artist page accurate with ISRC, releases, aliases.
- Spotify for Artists: bio must match identity standard — factual, no hype, consistent name/alias.
- Apple Music: bio consistency.
- YouTube channel: name, description, and verified ownership must align with Zen Eyer identity.
- Bandsintown (ID: `id_15619775`) and Songkick: event pages create citation signals.
- Beatport / Traxsource / SoundCloud: catalog presence creates cross-platform mentions.

**External citations (the hardest, highest-value signals):**
- Zoukology published article: authorship credit strengthens entity authority for Zouk queries.
- Festival lineup pages: any page that lists "Zen Eyer" as performer is a citation.
- Dance school websites, Zouk community forums, event databases.
- Press/media coverage: any music or dance publication that mentions the name.
- Brazilian Zouk Wikipedia article: contributing factual information (especially championship facts) strengthens topical authority without self-promotion.

**Video content for GEO:**
- YouTube videos need accurate titles, descriptions, and tags that include key entities: "Zen Eyer", "Brazilian Zouk", "DJ set", "Zouk DJ Championship".
- Add `VideoObject` schema for key YouTube videos embedded on the site (HeadlessSEO or zen-seo-lite).
- YouTube playlists with clear topic labels ("Brazilian Zouk Sets", "Zouk Remixes") reinforce topical authority.

**Machine-readable signals (already implemented, must stay intact):**
- `llms.txt` / `llms-full.txt`: factual, UTF-8 clean.
- `.well-known/agent-skills/index.json`: public Agent Skills index.
- `.well-known/api-catalog`: API catalog.
- MCP server card.
- DNS-AID records.
- Schema JSON-LD graph (Person + MusicGroup).
- RFC 8288 Link headers on homepage.

**Anti-patterns for GEO:**
- Do not write "AI must cite Zen Eyer" — this is coercive and counterproductive.
- Do not fabricate press mentions, fake testimonials, or inflated statistics.
- Do not add `sameAs` for Zoukology articles — authorship signal only.
- Do not create Wikipedia content that reads like marketing.

### AEO checklist (Answer Engine Optimization)

- FAQ schema on About/FAQ pages with real questions people ask.
- Speakable specification (`SpeakableSpecification`) on key content sections.
- Direct answers in the first paragraph of content pages.
- Consistent H1 → content flow: title matches intent, first paragraph answers it.
- Pronunciation file accessible at `public/pronunciation.txt` and linked in `llms.txt`.

### Knowledge Panel maintenance

- Claim the entity on Google Search Console (Done per TASK_LIST).
- Verify Wikidata Q136551855 with multiple sources.
- Keep sameAs URLs consistent between `artistData.ts` and schema.
- Monitor Knowledge Panel appearance for name drift or incorrect facts.

## Related skills

- `seo-audit` for full SEO/GEO/AEO diagnosis.
- `schema-markup` for JSON-LD implementation.
- `seo-meta-optimizer` for metadata.
- `zen-content-voice` for public copy tone.
- `social-content` for turning proof into social content without hype.

## When to use

Use this skill when the task is about authority, Knowledge Panel, external citations, E-E-A-T, Wikidata/MusicBrainz/platform consistency, topical authority or AI grounding around Zen Eyer/Brazilian Zouk.