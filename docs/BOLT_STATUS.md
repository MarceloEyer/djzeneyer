# ⚡ Bolt Status Report

## Resolved in this PR
- [x] **Remixes API Performance**: Fixed N+1 query issue by implementing batch cache priming for featured images. Reduces DB queries from ~200 to ~2 for a 100-item list.

## Pending Tasks (Identified from TODO.md & docs/ROUTE_AUDIT.md)

### Performance & Code Quality
- [ ] **Route Audit (i18n)**: Fix hardcoded links in `Footer.tsx` and `UserMenu.tsx` that break language context.
    - *Success Criteria:* `buildFullPath(lang, path)` used for all internal links.
- [ ] **Dynamic Routing**: Implement logic in core pages to correctly handle/filter by URL parameters.
    - **NewsPage**: Handle `:slug` param. Implement `fetchPostBySlug(slug)` and render single view instead of list.
    - **MusicPage**: Handle `:slug` param. Implement `fetchTrackBySlug(slug)` to load detail view or highlight track.
    - **EventsPage**: Handle `:id` param. Implement `filterById(id)` to show specific event details.
    - *Reference:* `docs/ROUTE_AUDIT.md` Section 2B.
- [ ] **Unused Code**: Delete dead code like `HomePage.tsx.bk` and `MusicPage.tsx.bk`.

### Critical Path (Launch)
- [ ] **URL Slugs Synchronization**: Verify synchronization between WP and `routes.ts`.
    - *Target Routes:* `/news/:slug`, `/music/:slug`, `/events/:id`, `/shop/:slug`.
    - *Action:* Ensure WP page slugs match `src/config/routes.ts` (e.g., WP page 'noticias' matches PT route `/noticias`).
    - *Success Criteria:* 1:1 mapping verified for all 22 routes in `docs/ROUTE_AUDIT.md`.
- [ ] **WP Cleanup**: Delete unused pages in WP Admin (e.g., "Apoie o Artista", "Compra de Ingressos").
- [ ] **Assets**: Replace placeholder SVGs with production images in `/public/images/`.
- [ ] **E2E Testing**: Verify Registration, Checkout, and Gamification flows manually.

### Infrastructure & Config
- [ ] **Caching**: Configure LiteSpeed Cache to exclude REST API endpoints specific to user data (`/zeneyer-auth`, `/cart`).
- [ ] **Cloudflare**: Setup Page Rules and WAF.
- [ ] **MailPoet**: Verify SPF/DKIM and Welcome Emails.

*Bolt focuses on one performance optimization at a time to ensure stability and measurability.*
