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

**Learning:** Iterating through all images and sizes in a list view API response adds significant payload size, even when the frontend only displays a single thumbnail.
**Action:** Implement conditional logic to detect "list view" vs "detail view" contexts. In list views, restrict image processing to only the primary image and essential sizes.

## 2025-02-24 - GamiPress Achievement Earning Checks (N+1)

**Learning:** Calling `gamipress_has_user_earned_achievement()` inside a loop causes one database query per item.
**Action:** Always fetch all user earnings at once using `gamipress_get_user_earnings($user_id, 'achievement')` before entering the loop. Build a local lookup map (ID -> data) to perform O(1) checks during iteration.

## 2026-03-04 - Memoize static data in React functional components
**Learning:** Static arrays inside components that use `t()` are recreated on every render.
**Action:** Use `useMemo(() => [...], [t])` to prevent unnecessary allocations.

## 2026-03-06 - Context API Re-renders Optimization

**Learning:** CartContext was creating a new object literal on every render, causing all consumers to re-render.
**Action:** Always wrap context provider values in `useMemo` to ensure consumer components only re-render when their specific state changes.

## 2026-03-07 - Context API Re-renders Optimization (User & GamiPress)

**Learning:** Both `UserContext.Provider` and `GamiPressContext.Provider` were passing unmemoized objects as their `value` props.
**Action:** Wrap context provider values in `useMemo`. Stabilize any exposed functions with `useCallback`.

## 2026-03-08 - UseMemo on Array Data
**Learning:** Large data object definitions utilizing `t` were being recreated every render cycle.
**Action:** Apply `useMemo` with `t` as a dependency to avoid re-rendering heavy allocations.

## 2026-03-09 - Map pattern to avoid redundant function calls in REST API
**Learning:** `djz_get_product_image_ids` was being called twice for the same products (initial loop + formatting loop).
**Action:** Cache intermediate results in an associative array keyed by item ID for O(1) lookup in subsequent loops.

## 2026-03-10 - Unconditional Array Operations in Render Body
**Learning:** Complex schema generation logic in `HeadlessSEO.tsx` was executed unconditionally on every render.
**Action:** Wrap schema/metadata generation in `useMemo` with inputs as dependencies.

## 2026-03-26 - Prevent memoized component re-renders from unstable function props
**Learning:** In `MainLayout.tsx`, inline functions passed to `Navbar` (wrapped in `React.memo`) caused re-renders because they were recreated on every render of the parent component.
**Action:** When passing callback functions to child components wrapped in `React.memo`, wrap them in `useCallback` to preserve references across renders.

## 2026-03-27 - Extracted Element Mappings in Array Iterators
**Learning:** Re-evaluating inline mappings with function calls inside an array iteration logic (like `useMemo` resolving maps based on dynamic keys inside component renders) leads to unnecessary overhead in UI updates as React element objects are continually regenerated unnecessarily.
**Action:** Always refactor constant visual configuration objects or nested JSX conditionals derived from generic conditions to pure, externalized `const` data stores for reference equality preservation.

## 2026-03-27 - Extracted Date Parsing from Render Loops
**Learning:** Instantiating `new Date()` or calling `Date.now()` inside React render bodies, `useMemo` hooks, or array `.map()` iterations causes unnecessary object allocations and violates React hook purity (triggering ESLint warnings or unexpected re-evaluations).
**Action:** Always extract static dates into global constants (e.g., `CURRENT_YEAR` in `artistData.ts`) and use lightweight operations like `Date.parse()` or string slicing (`String(date).substring(0, 4)`) inside loops to prevent reallocation overhead and maintain pure render cycles.
