# ⚡ Bolt Status Report

## Resolved in this PR
- [x] **Remixes API Performance**: Fixed N+1 query issue by implementing batch cache priming for featured images. Reduces DB queries from ~200 to ~2 for a 100-item list.

## Pending Tasks (Identified from TODO.md & docs/ROUTE_AUDIT.md)

### Performance & Code Quality
- [ ] **Route Audit (i18n)**: Fix hardcoded links in `Footer.tsx` and `UserMenu.tsx` that break language context.
    - *Success Criteria:* `buildFullPath(lang, path)` used for all internal links.
- [ ] **Dynamic Routing**: Implement logic in core pages to correctly handle/filter by URL parameters.
    - **NewsPage (`src/pages/NewsPage.tsx`)**:
        - Handle `:slug` param.
        - **Implementation**:
          ```typescript
          // Pseudo-code
          const { slug } = useParams();
          const { data: post } = useQuery(['post', slug], () => fetchPostBySlug(slug));
          if (slug && post) return <SinglePostView post={post} />;
          return <NewsList />;
          ```
    - **MusicPage (`src/pages/MusicPage.tsx`)**:
        - Handle `:slug` param.
        - **Implementation**: Use `useTrackBySlug(slug)` hook. If data exists, show detail modal or highlight track.
    - **EventsPage (`src/pages/EventsPage.tsx`)**:
        - Handle `:id` param.
        - **Implementation**: Filter `useEventsQuery` results by `id` to show specific event details.
    - *Reference:* `docs/ROUTE_AUDIT.md` Section 2B.
- [ ] **Unused Code**: Delete dead code like `HomePage.tsx.bk` and `MusicPage.tsx.bk`.

### Critical Path (Launch)
- [ ] **URL Slugs Synchronization**: Verify synchronization between WP and `routes.ts`.
    - *Target Routes:*
      - `/news/:slug` <-> WP Page 'noticias' (PT) / 'news' (EN)
      - `/music/:slug` <-> WP Page 'musica' (PT) / 'music' (EN)
      - `/events/:id` <-> WP Page 'eventos' (PT) / 'events' (EN)
      - `/shop/:slug` <-> WP Page 'loja' (PT) / 'shop' (EN)
    - *Action:* Ensure WP page slugs match `src/config/routes.ts` exactly.
    - *Success Criteria:* 1:1 mapping verified for all 22 routes in `docs/ROUTE_AUDIT.md`.
- [ ] **WP Cleanup**: Delete unused pages in WP Admin (e.g., "Apoie o Artista", "Compra de Ingressos").
- [ ] **Assets**: Replace placeholder SVGs with production images in `/public/images/`.
- [ ] **E2E Testing**: Verify Registration, Checkout, and Gamification flows manually.

### Infrastructure & Config
- [ ] **Caching**: Configure LiteSpeed Cache to exclude REST API endpoints specific to user data (`/zeneyer-auth`, `/cart`).
- [ ] **Cloudflare**: Setup Page Rules and WAF.
- [ ] **MailPoet**: Verify SPF/DKIM and Welcome Emails.

*Bolt focuses on one performance optimization at a time to ensure stability and measurability.*
