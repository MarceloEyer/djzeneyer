# Zen BIT

Bandsintown bridge for event data, schema, and cache management.

## Purpose

- Expose upcoming, past, and full event lists
- Serve event detail payloads
- Generate `MusicEvent` JSON-LD for pages and lists
- Keep event data cached with SWR behavior
- Provide admin controls for refresh, cache clear, and health checks

## Namespace

`zen-bit/v2`

## Main routes

- `GET /events`
- `GET /events/schema`
- `GET /events/{event_id}`
- `GET /events/{event_id}/schema`
- `POST /admin/fetch-now`
- `POST /admin/clear-cache`
- `GET /admin/health`

## Response shape

- The list route returns a lean payload for fast rendering.
- The detail route returns the full event object.
- The schema routes return JSON-LD shaped for SEO.

## Rules that matter

- Keep canonical paths deterministic.
- Keep the list payload small.
- Preserve required `MusicEvent` fields in schema output.
- Keep SWR and cache-lock behavior intact.

## Cache

| Context | Default |
|---|---|
| Upcoming | 6h (`21600s`) |
| Detail | 24h (`86400s`) |
| Past | 7d (`604800s`) |

## See also

- `CONTEXT.md`
- `docs/API.md`
- `docs/api-endpoints.md`
- `docs/ARCHITECTURE.md`
