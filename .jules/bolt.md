## 2025-02-19 - WP REST API _embed Performance

**Learning:** Using `_embed` in WP REST API requests triggers significant overhead due to multiple internal queries (N+1) for fetching related objects like authors, terms, media, and comments. For list endpoints returning many items (e.g., 100 tracks), this causes a major performance bottleneck on the backend.
**Action:** Always prefer registering lightweight custom REST fields (e.g., `featured_image_src`) using `register_rest_field` to expose only the necessary data. This allows the frontend to remove the `_embed` parameter, drastically reducing response time and payload size.

## 2025-02-20 - Optimize WP REST API Payloads with _fields

**Learning:** Default WP REST API endpoints return full objects (content, excerpts, etc.) which is wasteful for lists. Using `_fields` allows precise selection of data, reducing payload size by >80% for collections.
**Action:** When using `wp/v2` endpoints, always specify `_fields` for the data actually needed by the component.

## 2025-02-21 - Batch Cache Priming for Attachments

**Learning:** Functions like `wp_get_attachment_url()` inside loops trigger N+1 queries because they require the attachment post object and its meta, which aren't automatically primed by the parent query.
**Action:** When iterating over posts to get their thumbnails, collect all attachment IDs first and use `update_meta_cache('post', $ids)` and `_prime_post_caches($ids)` to batch fetch the data in constant time.

## 2025-02-22 - Eager Loading Vite Manifest in WordPress

**Learning:** Instantiating classes that perform file I/O in `__construct` (like loading a Vite manifest) adds overhead to every WordPress request, including REST API and Admin AJAX. This is especially impactful for high-frequency endpoints.
**Action:** Always lazy-load resource-intensive configuration files. Only load them when the specific action (like `wp_enqueue_scripts`) is actually fired.

## 2025-02-23 - Conditional Image Processing in REST API

**Learning:** Iterating through all images and sizes in a list view API response adds significant CPU overhead and payload size, even when the frontend only displays a single thumbnail. For 100 items, this can result in thousands of unnecessary function calls.
**Action:** Implement conditional logic in API endpoints to detect "list view" vs "detail view" contexts. In list views, restrict image processing to only the primary image and essential sizes.

## 2025-02-24 - GamiPress Achievement Earning Checks (N+1)

**Learning:** Calling `gamipress_has_user_earned_achievement()` inside a loop of achievements causes one database query per item. For sites with dozens of achievements, this becomes the primary bottleneck of the user data endpoint.
**Action:** Always fetch all user earnings at once using `gamipress_get_user_earnings($user_id, 'achievement')` before entering the loop. Build a local lookup map (ID -> data) to perform O(1) checks during iteration.

## 2025-03-04 - Memoize static data in React functional components
**Learning:** `AboutPage.tsx` re-created the complex static arrays `ABOUT_SCHEMA`, `MILESTONES`, and `ACHIEVEMENTS_DATA` on every render cycle. Because they needed the `t` function from `useTranslation`, they could not be easily moved outside the component.
**Action:** Use `useMemo(() => [...], [t])` to keep them within the component so they can access hooks while preventing unnecessary allocations and downstream re-renders on unrelated state changes.

## 2026-03-06 - [Context API Re-renders Optimization]

**Learning:** Found that CartContext in `src/contexts/CartContext.tsx` was creating a new object literal `{ cart, getCart, removeItem, clearCart, loading }` on every render. Because this object is passed to `CartContext.Provider value={value}`, any state update within the Provider (e.g. `loading` changes) would cause *all* components consuming `useCart` to re-render, even if the relevant parts of the state hadn't changed.
**Action:** When implementing Context API in React, always wrap the provider value in a `useMemo` hook, making sure to include all pieces of context state as dependencies. This ensures consumer components only re-render when the specific context state changes, not simply because the Provider component re-rendered.
