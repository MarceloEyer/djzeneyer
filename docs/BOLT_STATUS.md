# ⚡ Bolt Status Report

## Resolved in this PR
- [x] **Remixes API Performance**: Fixed N+1 query issue by implementing batch cache priming for featured images. Reduces DB queries from ~200 to ~2 for a 100-item list.

## Pending Tasks (Identified from TODO.md & docs/ROUTE_AUDIT.md)

### Performance & Code Quality
- [ ] **Route Audit (i18n)**: Fix hardcoded links in `Footer.tsx` and `UserMenu.tsx` that break language context.
- [ ] **Dynamic Routing**: Implement logic in `NewsPage`, `MusicPage`, and `EventsPage` to correctly handle/filter by URL slugs/IDs.
- [ ] **Unused Code**: Delete dead code like `HomePage.tsx.bk` and `MusicPage.tsx.bk`.

### Critical Path (Launch)
- [ ] **URL Slugs**: Verify synchronization between WP and `routes.ts`.
- [ ] **WP Cleanup**: Delete unused pages in WP Admin.
- [ ] **Assets**: Replace placeholder SVGs with production images.
- [ ] **E2E Testing**: Verify Registration, Checkout, and Gamification flows.

### Infrastructure & Config
- [ ] **Caching**: Configure LiteSpeed Cache exclusions for user endpoints.
- [ ] **Cloudflare**: Setup Page Rules and WAF.
- [ ] **MailPoet**: Verify SPF/DKIM and Welcome Emails.

*Bolt focuses on one performance optimization at a time to ensure stability and measurability.*
