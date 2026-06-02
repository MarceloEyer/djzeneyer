# External Authority Action Queue

## Objective

Strengthen Zen Eyer's external authority signals without polluting the site's entity graph or confusing `sameAs`.

This queue separates actions that require human access to external platforms from code changes inside this repository.

## Core principle

External authority comes from consistent, verifiable third-party surfaces, not self-praise.

High-value signals:

| Signal | Why it matters | Repo action |
|---|---|---|
| Spotify for Artists bio | Music identity source for users, search engines and LLMs | Keep official bio copy in human task list/context |
| Apple Music bio | Cross-platform consistency | Keep wording aligned with Spotify |
| YouTube channel and playlists | Video search, GEO and entity consistency | Add VideoObject only when videos are embedded on site |
| Wikidata Q136551855 | Knowledge Panel anchor | Keep facts sourced and consistent |
| MusicBrainz | Structured music identity and catalog | Keep ID in schema/sameAs only when profile is verified |
| Bandsintown | Event/activity citation | Keep events synced and name canonical |
| Songkick | Event/history citation | Verify artist profile and event history |
| Festival lineup pages | Third-party activity proof | Request canonical name and website link after events |
| Zoukology authorship | Expertise signal | Model as authorship, not sameAs |

## Action status fields

Use this format when turning items into `.human/TASK_LIST.md` tasks or session handoffs:

```text
Platform:
Owner: Human / Agent / Both
Current status:
Desired state:
Blocking access:
Next action:
Evidence URL:
Last checked:
```

## Platform checklist

### Spotify for Artists

Desired state:

- Primary artist name: `Zen Eyer`.
- Bio factual, not promotional.
- Mentions Zouk DJ Championship 2022 / I Campeonato Internacional de DJs.
- Mentions 14 in-person countries only if still confirmed.
- Links or social fields point to `https://djzeneyer.com` when platform allows.

Repo impact:

- If the live Spotify URL changes, update `src/data/artistData.ts` and schema sameAs sources.
- Do not add track/album URLs to artist `sameAs`.

### Apple Music

Desired state:

- Name and bio aligned with Spotify.
- Alias `DJ Zen Eyer` only when the platform has an alias field.
- Official website present where supported.

Repo impact:

- Update `artistData.ts` only if official profile URL changes.

### YouTube / YouTube Music

Desired state:

- Main channel name: `Zen Eyer`.
- Description includes Brazilian Zouk, DJ/producer, championship, site and pronunciation.
- Top videos include `Zen Eyer` + `Brazilian Zouk` + content type in title/description.
- Playlists exist for Brazilian Zouk DJ sets and remixes.

Repo impact:

- Keep only the official YouTube channel in `sameAs`.
- Add `VideoObject` schema only to public pages with embedded videos and complete metadata.

### Wikidata

Desired state:

- Official website property points to `https://djzeneyer.com`.
- Championship claims have external references.
- MusicBrainz ID present when valid.
- Birth date, nationality and occupation facts remain accurate.

Repo impact:

- Keep `src/data/artistData.ts` and `.context/IDENTITY.md` aligned with Wikidata only when facts are verified.

### MusicBrainz

Desired state:

- Artist profile is complete and controlled/verified enough to be treated as official identity surface.
- Releases and aliases are accurate.
- Wikidata and official site relationships are present.

Repo impact:

- Keep MusicBrainz URL/ID in `artistData.ts` only if profile remains correct.

### Bandsintown and Songkick

Desired state:

- Canonical public name: `Zen Eyer`.
- Official website linked.
- Upcoming events are accurate.
- Important historical events are not missing when platform supports history.

Repo impact:

- If event sync changes fields consumed by `zen-bit`, audit event schema and canonical paths.

### Festival and event lineup pages

Desired state:

- Organizer uses `Zen Eyer` as main name.
- Bio mentions Brazilian Zouk DJ/producer factually.
- Site link is present where natural.

Repo impact:

- Do not add lineup pages to `sameAs`.
- Keep notable lineup pages as Media/citation links only when valuable and stable.

## Anti-patterns

- Adding article URLs, lineup URLs, playlists, albums or tracks to artist `sameAs`.
- Treating every external URL as schema data.
- Creating fake or duplicate profiles.
- Asking organizers to use hype claims instead of factual identity.
- Editing Wikipedia/Wikidata like marketing copy.

## Suggested future PRs

- `docs(authority): record Spotify/Apple/YouTube profile audit results`
- `docs(authority): record Wikidata and MusicBrainz verification status`
- `feat(media): classify external proof links by authority type`
- `feat(schema): add VideoObject to pages with complete embedded video metadata`
