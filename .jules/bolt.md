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
## 2026-04-04 - Cached Intl.DateTimeFormat

**Learning:** Instantiating `new Intl.DateTimeFormat()` or calling `Date.prototype.toLocaleDateString()` inside React render bodies or array `.map()` iterations causes significant CPU overhead and memory allocation (e.g., ~20x slower than a cached formatter).
**Action:** Always extract `Intl.DateTimeFormat` into a module-level `Map` cache (e.g., `getDateTimeFormatter` in `src/utils/date.ts`) and reuse the cached formatter instances for formatting dates and times across the application.
## 2026-04-06 - Extract Framer Motion Variants from Render Body

**Learning:** Declaring static `framer-motion` variant objects (like `cardVariants` or `itemVariants`) inside React functional components causes unnecessary object reallocation on every render. This defeats the purpose of wrapping components in `React.memo` since the objects inside the component are continually recreated.
**Action:** Always extract static animation configuration objects (like `framer-motion` variants) to the module scope (outside the component) to preserve reference equality and eliminate reallocation overhead during React rendering cycles.
## 2026-04-12 - Prevent static array search in React render cycles

**Learning:** Declaring a static array and searching it via `.find()` or `.filter()` inside a `useMemo` hook (e.g., `streamingPlatforms.find()`) evaluates repeatedly with every dependency change, adding unnecessary CPU overhead for values that never change during runtime. Array operations have O(N) complexity compared to O(1) for direct definitions or object lookups.
**Action:** Extract specific subset data directly as discrete objects or arrays wrapped in `useMemo` with an empty dependency array `[]`. This bypasses the need for runtime list filtering entirely, improving performance significantly (approx 23x faster execution).
## 2026-05-15 - Unnecessary Micro-optimizations on Small Arrays

**Learning:** Replacing declarative array operations (like chained `.reduce()`, `.map()`, `.filter()`) with a single imperative `for` loop on tiny arrays (e.g., rendering small lists of requirements or quests) is an unmeasurable micro-optimization that needlessly sacrifices code readability.
**Action:** Only apply this O(N) single-pass consolidation pattern to demonstrably large datasets where the bottleneck can be measured.
## 2026-05-18 - N+1 Query in REST API Batch Processing

**Learning:** Calling functions that query the database (like `get_items()`) inside a `foreach` loop for multiple objects (e.g., iterating through multiple WooCommerce orders) causes severe N+1 performance bottlenecks.
**Action:** Always extract the necessary IDs from the object list, construct a single database query (often using a `WHERE IN` clause) to fetch all related items simultaneously, group them in memory, and map them back to the respective items.

## 2026-05-18 - Optimize WP_Query for Metadata Filtering

**Learning:** Iterating through WordPress query results in PHP using `get_post_meta()` inside a loop to conditionally skip items based on metadata flags (like `noindex`) causes extreme N+1 performance issues, dramatically slowing down sitemap or data collection generation on large databases.
**Action:** Always filter metadata directly in the database layer by adding a `meta_query` clause to the `WP_Query` `$args`. Utilizing conditional `NOT EXISTS` or `NOT LIKE` logic directly inside `$args['meta_query']` prevents fetching undesired posts entirely, improving execution time enormously (e.g. 99% faster).
## 2026-06-25 - Avoid new Date() inside large array iterations and useMemo

**Learning:** Instantiating `new Date()` inside loops (like `forEach` or `map`) and `useMemo` hooks for parsing ISO 8601 date strings to extract parts (e.g., year, month, day) adds massive memory allocation overhead and CPU time compared to O(1) string slicing operations. In a benchmark of 10,000 items, `new Date()` took ~112ms versus ~4ms for `substring()`.
**Action:** Always prefer string slicing (`substring(0, 7)`) when grouping or extracting static parts from guaranteed format date strings like ISO 8601 within large datasets, `useMemo` iterations, and component render cycles.
## 2026-04-09 - Avoid string split for static prefix extraction

**Learning:** Using `String.prototype.split` (e.g., `path.split('/:')[0]`) in high-frequency rendering paths (like routing and URL mapping loops) causes unnecessary garbage collection due to array allocation. Micro-benchmarks show that using `String.prototype.indexOf` combined with `String.prototype.slice` is around 45x faster.
**Action:** Always prefer native non-allocating string operations like `indexOf`, `startsWith`, `endsWith`, and `slice` over methods that allocate new objects or arrays (`split`, `replace` with regex) in performance-critical code paths.

## 2026-06-25 - Cached Intl.NumberFormat via toLocaleString

**Learning:** Calling `Number.prototype.toLocaleString()` implicitly instantiates an `Intl.NumberFormat` object on every call. In benchmarks, this causes ~8x more CPU overhead and memory allocations compared to reusing a cached formatter instance, which is especially noticeable during React renders and inside `.map()` array iterations (like leaderboard rendering).
**Action:** Always replace `toLocaleString()` with a cached formatter instance from a module-level cache (like `getCurrencyFormatter(locale, currency, true).format(value)`) to prevent redundant object allocations and improve render performance.

## 2026-06-26 - Prevent redundant function calls during render cycles

**Learning:** Repeatedly calling a deterministic function like `getLocalizedRoute` with the same dynamic arguments multiple times within a component's render body (e.g. passing it to multiple `<Link to={...}>` elements) leads to redundant O(N) calculations on every React reconciliation cycle.
**Action:** Consolidate these multiple calls into a single object map wrapped in `useMemo` with the dynamic argument as its dependency. This evaluates the localized paths only once when the language changes, rather than recalculating them on every unrelated state or context update.

## 2026-06-27 - Inline Spread of Arrays in React Render Cycles
**Learning:** Using the spread operator (e.g., `[...array1, ...array2]`) inline directly within a component's render body (like for `.map()` iteration) forces JavaScript to allocate a completely new array object on *every single render cycle*, regardless of whether the source arrays have changed. In highly re-rendered components, this causes significant garbage collection overhead and potential performance stutters.
**Action:** Always extract dynamic array combinations/spreads into a `useMemo` hook, using the source arrays (or their parent objects) as the dependency array, to preserve reference equality and eliminate O(N) reallocation overhead.

## 2026-06-28 - Render Loop Overhead via Inline Array Allocation and Split

**Learning:** Allocating a static array (`['jan', 'feb', ...]`) and performing string splitting (`key.split('-')`) inside the callback of a `.map()` iteration forces continuous garbage collection overhead on every React rendering cycle, significantly impacting performance on large lists.
**Action:** Always extract static array configurations to the module scope (outside the component) and replace allocating string operations like `split()` with non-allocating alternatives like `slice()` when iterating over datasets in render loops.
