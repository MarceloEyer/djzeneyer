# URL deindex strategy - 2026-06-17

Status: active implementation note for PR review.

## Goal

Refresh public indexation around the current canonical URL set.

The site previously kept many short or legacy aliases alive with 301 redirects.
That was useful during migration, but it also kept old paths visible to crawlers
as valid alternates. This PR switches those retired aliases to `410 Gone` so
search engines can drop them faster.

## Rules

- Canonical URLs live in `src/config/routes-slugs.json`.
- Sitemaps are generated only from canonical route slugs and dynamic canonical
  event/post/release data.
- Retired aliases must not remain as React SPA routes.
- Retired aliases must return `410 Gone` in `public/.htaccess`.
- Unknown URLs that are not explicitly retired continue to fall through to the
  existing real 404 handling.
- Technical duplicates such as `/index.html` still use 301 to the canonical
  homepage because they are equivalent files, not retired content.

## Expected crawler behavior

- Current canonical pages remain indexable and appear in sitemap XML.
- Old route aliases return 410 instead of redirecting.
- Canonical and hreflang tags on live pages continue to point to primary slugs.
- Search engines should gradually replace stale alias URLs with the sitemap and
  canonical URL set.

## Follow-up

After deploy, inspect Search Console for:

- retired aliases moving out of indexed/discovered URL buckets;
- unexpected 410 hits on URLs that should still be live;
- canonical pages remaining indexed;
- sitemap discovery for `/sitemap.xml`, `/sitemap-pages.xml`,
  `/sitemap-events.xml`, and `/sitemap-posts.xml`.
