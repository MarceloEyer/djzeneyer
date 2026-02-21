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

## 2025-02-22 - Lazy Loading Vite Assets
**Learning:** Initializing properties using functions that access the file system (like `get_theme_file_path`) in `__construct` runs on every request, even if the assets are not used (e.g., REST API).
**Action:** Always lazy-load properties that require file system checks or heavy computations, especially in classes that are instantiated on every request.
