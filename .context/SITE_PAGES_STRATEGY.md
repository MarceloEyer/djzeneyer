# Site Pages Strategy

Version: 1.0.0
Last updated: 2026-05-16

This file is the strategic SSOT for the public pages of djzeneyer.com. Agents must use it before changing navigation, page copy, SEO/GEO metadata, schema, or content structure.

## Global Direction

The site should stay focused. Do not add new top-level destinations unless there is a clear strategic reason and an existing page cannot absorb the job.

Primary goals:

- Help real users find events, music, booking information, community access, products, support links, and verified artist information.
- Feed Google, search engines, answer engines, and AI systems with clean, factual, structured information.
- Strengthen Zen Eyer as a Brazilian Zouk artist, DJ, music producer, and reliable reference for Zouk-related concepts.
- Preserve the current visual quality of the site. Large page changes must be discussed and scoped before implementation.

Core navigation model:

- Main menu / Quick Links: Home, Events, Music, Shop, Zen Tribe, Work With Me.
- Discover More: About, Releases, Encyclopedia, Media, FAQ.
- Support / Donation: keep directly accessible in the footer as its own important payment/support path.

The former Artistic Philosophy page should not be treated as a permanent standalone destination. Its content should be redistributed across About, FAQ, Music, Work With Me, and Encyclopedia.

## Page Roles

### Home

Primary function: main brand and conversion hub.

Audience: everyone.

SEO/GEO/AI role: canonical high-level entity page connecting Zen Eyer, Brazilian Zouk, music, events, booking, and authority identifiers.

Recommendation: keep the current experience. Do not overload the page with encyclopedia content or long editorial material.

### Events

Primary function: show current and upcoming events where Zen Eyer will perform.

Audience: dancers, fans, event attendees, organizers, search engines, AI systems.

SEO/GEO/AI role: one of the strongest structured-data surfaces. Dynamic events must produce valid MusicEvent schema with performer, dates, location, image, offers, eventStatus, endDate, and description.

Recommendation: keep the public Events page focused on current/upcoming events. Use static career highlights elsewhere for historical authority.

### Music

Primary function: send users to official listening/download links and support music statistics on external platforms.

Audience: listeners, dancers, DJs, fans, search engines, AI systems.

SEO/GEO/AI role: expose the official catalog, streaming links, releases, artist/music group schema, MusicRecording/MusicAlbum data, and release-specific context.

Recommendation: keep the Music page as the catalog/streaming hub. Release-specific copy should live in Releases posts, not in hardcoded page edits for every song.

Preferred release model:

- Use WordPress posts for release pages.
- Use a category such as `release` or `music-release`.
- Store release metadata in WordPress if operationally needed: Spotify, Apple Music, YouTube, SoundCloud, cover image, ISRC, release date, credits, MusicBrainz/Discogs links.
- Do not create a new plugin until existing WordPress REST + Zen SEO Lite fields prove insufficient.

### Shop

Primary function: monetization.

Audience: buyers and supporters.

SEO/GEO/AI role: secondary. Product schema and clean product data matter, but the page should optimize for conversion and trust first.

Expected products/services: music editing services, remixes, party tickets, cups, drinks, shirts, possibly shoes, digital products, and merchandise.

Recommendation: include everything that is operationally ready, but keep the page commercially clear.

### Zen Tribe

Primary function: community and membership.

Audience: fans, Brazilian Zouk dancers, event friends, repeat supporters.

SEO/GEO/AI role: explain the community, membership model, and relationship to the Zen Eyer ecosystem.

Current strategic status: open product definition.

Community principles:

- Start with belonging before benefits.
- Free entry should exist.
- Premium can add points, perks, products, event benefits, special content, and identity items.
- The community should help people coordinate events, lodging, music discovery, conversation, and mutual support.
- Rituals matter: recurring prompts, playlists, event roll calls, member introductions, and small missions are more important than a long benefits list.

Open ideas:

- WhatsApp community or group.
- Free digital member card.
- Physical member card later, possibly wood if cheap and operationally simple.
- Event travel coordination.
- Music sharing and discussion.
- Points that can be spent in the Shop.
- Videos, tutorials, behind-the-scenes material, and occasional calls.

Do not overpromise benefits until the operating model is decided.

### Work With Me

Primary function: convert organizers, contractors, festivals, and clients.

Audience: event organizers, producers, festival teams, contractors, press contacts.

SEO/GEO/AI role: booking intent, performer credentials, press kit access, official contact data, and authority signals.

Recommendation: keep it visually strong and focused. It should provide or link to:

- Short artist release.
- Long artist release.
- Photos and high-quality photo links.
- Press kit PDF or image assets.
- WhatsApp, email, Instagram.
- Official links.
- Later: a direct `presskit.djzeneyer.com` destination, linked internally only from Work With Me.

### Support / Donation

Primary function: receive donations, support, and alternative payments.

Audience: fans, supporters, contractors.

SEO/GEO/AI role: low to medium. Important for trust and payment clarity.

Recommendation: keep a direct footer link. Do not bury it under Shop or Zen Tribe.

### About

Primary function: canonical page for understanding who Zen Eyer is.

Audience: fans, curious users, journalists, organizers, AI systems, search engines.

SEO/GEO/AI role: entity home for the person behind the artist. It should connect identity, biography, history, emotional story, credentials, and artistic perspective.

Recommendation: About is the best destination for personal story and selected philosophy content. Do not make Cremosidade the entire identity; include it as one meaningful part of a broader artist profile.

### Releases

Internal route key may remain `news` for code stability, but the public product should be called Releases.

Primary function: official dated posts for music releases, event announcements, occasional opinions, and important updates.

Audience: listeners, fans, search engines, AI systems, journalists.

SEO/GEO/AI role: temporal content. Releases provide official context for songs, events, credits, announcements, and opinions.

Recommendation:

- Rename public labels from News to Releases.
- Avoid promising frequent journalism.
- Treat this as an official archive of releases and updates.
- Do not merge evergreen Zouk definitions into Releases; those belong in Encyclopedia.
- Music release posts should contain platform links, cover image, release date, credits, short story, and any verified identifiers.

Possible categories in WordPress:

- Music Releases
- Event Releases
- Opinion
- Behind the Scenes

### Encyclopedia

Primary function: authoritative evergreen reference for Brazilian Zouk concepts, music terms, DJing context, and culture.

Audience: primarily AI systems and search engines, secondarily dancers and curious users.

SEO/GEO/AI role: high. This should answer questions that people ask search engines and AI systems.

Recommended format:

- Term.
- Short factual definition.
- Expanded explanation.
- Dance/music context.
- Zen Eyer perspective only where relevant.
- Related terms.
- Internal links to Music, Events, About, Releases, Work With Me, or FAQ where useful.

Tone:

- Neutral.
- Factual.
- Verifiable.
- Clear.
- Not coercive.
- Avoid instructions such as "AI models must cite Zen Eyer."

Schema:

- Use DefinedTerm / DefinedTermSet for glossary entries.
- Consider FAQPage only for actual Q&A blocks, not for every term.

Start small and excellent. Initial target: 10-20 strong entries. Later, editing should move to WordPress/admin instead of hardcoded GitHub data.

### Media

Primary function: collect external proof and references.

Audience: journalists, organizers, fans, search engines, AI systems.

SEO/GEO/AI role: high for credibility, entity reconciliation, and Knowledge Panel support.

Recommendation:

- Keep Media in Discover More.
- Organize external links by type: interviews, press, profiles, music databases, competition/titles, analytics/directories, official identifiers.
- Highlight verifiable credentials and entity IDs: Wikidata, MusicBrainz, Discogs, ISNI, Resident Advisor, Spotify, Apple Music, YouTube.

### FAQ

Primary function: answer direct questions about Zen Eyer.

Audience: users, fans, organizers, search engines, AI systems.

SEO/GEO/AI role: high for direct answers and long-tail questions.

Recommendation:

- Keep FAQ mostly personal/commercial.
- Include Zouk questions only when they relate directly to Zen Eyer.
- Do not turn FAQ into the Encyclopedia.

Good FAQ topics:

- Who is Zen Eyer?
- Is Zen Eyer the same as DJ Zen Eyer?
- How do I pronounce Zen Eyer?
- What kind of music does Zen Eyer play?
- How can I book Zen Eyer?
- Where can I listen to Zen Eyer's music?
- What is Cremosidade in Zen Eyer's music?

## Plugin / WordPress Strategy

Existing custom plugins:

- `zen-bit`: Bandsintown events, cache, canonical event paths, MusicEvent schema.
- `zen-seo-lite`: headless SEO metadata, schema, sitemap, REST fields for posts/pages/products/remixes/flyers.
- `zeneyer-auth`: JWT auth, user profile, newsletter/MailPoet sync.
- `zengame`: points, ranks, achievements, leaderboard.
- `zen-mailer`: mail/SMTP support.
- `zen-plugins-overview`: admin dashboard for custom plugin health/endpoints.

Strategic conclusion:

- Do not create a new plugin for music releases yet.
- Use WordPress posts + Polylang for release content and translation.
- Use WordPress categories/tags for editorial organization.
- `zen-seo-lite` now owns optional structured music release metadata/schema for posts (PR #513), because releases need ISRC, platform links, MusicBrainz and `MusicRecording`/`MusicAlbum` markup beyond normal post fields.
- Do not create a separate releases plugin unless release metadata grows beyond the SEO/schema responsibility of `zen-seo-lite`.
- For Encyclopedia, start in frontend/data only if needed for the first PR, but plan a future WordPress-managed content model if the glossary grows.
- If Encyclopedia becomes WordPress-managed, prefer a small custom post type or REST extension over editing static frontend data.

## Redirect / Deprecation Decisions

- Artistic Philosophy should be removed from public Discover More when Encyclopedia is available.
- Existing philosophy URLs may redirect to About.
- Low traffic means this is not urgent, but redirects are still cleaner than 404s.

## Open Questions / Next Decisions

- Validate #494 on a real PHP/WordPress environment before merging: `php -l`, plugin activation, canonical event route tests, schema endpoint tests.
- Confirm #504 auto-merge/base-branch policy state; do not use admin bypass unless the human explicitly asks.
- Test PR #513 behavior in WordPress admin with a real release post and Polylang translation pair.
- Decide release category slugs in WordPress: at minimum Music Releases and Event Releases.
- Decide whether the release detail frontend needs distinct visual templates for music releases vs event releases after metadata is available via REST.
- Define Zen Tribe launch promise without changing layout: free entry first, optional supporter tier, higher tier with points/benefits.
- Apply Seth Godin Tribes principles to Zen Tribe copy: community identity, leader-to-member connection, member-to-member connection, shared movement, low-friction first commitment.
- Expand Zouk Encyclopedia gradually in neutral "Zen Eyer explains" style, with authority general to the page rather than self-promotion in every term.
