<?php
// Mock WP functions to simulate database behavior
$queries = 0;
$meta_cache = [];
$post_cache = [];

function get_post_meta($post_id, $key, $single = false) {
    global $queries, $meta_cache;
    // Check if meta is cached for this post
    if (isset($meta_cache[$post_id][$key])) {
        return $meta_cache[$post_id][$key];
    }
    // Simulate DB query
    $queries++;
    // Simulate finding a thumbnail ID
    return 1000 + $post_id;
}

function update_meta_cache($type, $ids) {
    global $queries, $meta_cache;
    $queries++; // Bulk query counts as 1
    foreach ($ids as $id) {
        // Prime metadata for attachment
        $meta_cache[$id]['_wp_attachment_metadata'] = ['width' => 100, 'height' => 100];
        $meta_cache[$id]['_wp_attachment_image_alt'] = 'Alt Text';
    }
}

function _prime_post_caches($ids, $update_term_cache = true, $update_meta_cache = true) {
    global $queries, $post_cache;
    $queries++; // Bulk query counts as 1
    foreach ($ids as $id) {
        $post_cache[$id] = (object)['ID' => $id, 'post_type' => 'attachment'];
    }
}

function wp_get_attachment_image_src($attachment_id, $size) {
    global $queries, $meta_cache;
    // Checks meta cache for attachment metadata
    if (isset($meta_cache[$attachment_id]['_wp_attachment_metadata'])) {
        return ['url', 100, 100];
    }
    // If not cached, triggers DB query
    $queries++;
    // Cache it now
    $meta_cache[$attachment_id]['_wp_attachment_metadata'] = ['width' => 100];
    return ['url', 100, 100];
}

// Scenario Setup
$remixes = [];
for ($i=0; $i<10; $i++) {
    $remixes[] = (object)['ID' => $i, 'post_type' => 'remixes'];
    // Assume remix meta (thumbnail_id) is already primed by main query
    $meta_cache[$i]['_thumbnail_id'] = 1000 + $i;
}

echo "--- Performance Test ---\n";
echo "Scenario 1: Naive Approach (No Priming)\n";

// Reset caches for attachments (simulate cold cache)
for ($i=0; $i<10; $i++) unset($meta_cache[1000+$i]);
$queries = 0;

foreach ($remixes as $remix) {
    // This is what register_rest_field callback does
    $thumb_id = get_post_meta($remix->ID, '_thumbnail_id', true); // Cached
    wp_get_attachment_image_src($thumb_id, 'medium_large'); // Miss -> Query
}
$queries_naive = $queries;
echo "Queries: $queries_naive\n";


echo "\nScenario 2: Optimized Approach (Batch Priming)\n";

// Reset caches for attachments
for ($i=0; $i<10; $i++) unset($meta_cache[1000+$i]);
$queries = 0;

// Step 1: Prime
$thumb_ids = [];
foreach ($remixes as $remix) {
    $tid = get_post_meta($remix->ID, '_thumbnail_id', true);
    if ($tid) $thumb_ids[] = $tid;
}

if (!empty($thumb_ids)) {
    $thumb_ids = array_unique($thumb_ids);
    update_meta_cache('post', $thumb_ids);
    _prime_post_caches($thumb_ids, false, false);
}

// Step 2: Access
foreach ($remixes as $remix) {
    $thumb_id = get_post_meta($remix->ID, '_thumbnail_id', true);
    wp_get_attachment_image_src($thumb_id, 'medium_large'); // Hit -> No Query
}
$queries_optimized = $queries;
echo "Queries: $queries_optimized\n";

$reduction = $queries_naive - $queries_optimized;
echo "\nQuery Reduction: $reduction queries for 10 items.\n";

if ($reduction > 0) {
    echo "SUCCESS: Optimization validated.\n";
    exit(0);
} else {
    echo "FAILURE: Optimization did not reduce queries.\n";
    exit(1);
}
