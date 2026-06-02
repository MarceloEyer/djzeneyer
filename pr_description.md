💡 **What:** Added an inline comment in `inc/cpt.php:176` to document and acknowledge a pre-existing performance optimization.

🎯 **Why:** To fulfill the documentation requirement of acknowledging that the `_thumbnail_id` query within the loop is already optimized. The N+1 bottleneck on `get_post_thumbnail_id` is prevented by the call to `_prime_post_caches($post_ids, false, true)` on line 160, which primes the post meta caching for all posts in a single query before entering the thumbnail collection loop.

📊 **Measured Improvement:** No net-new performance gain was achieved, as the N+1 issue for `get_post_thumbnail_id` inside this loop had already been fully resolved by the pre-existing code structure. The change serves solely to verify and document the current optimized state of the codebase.
