<?php
// Mock WP Environment
class WP_Query {
    public $query;
    public function __construct($args = []) {
        $this->query = $args;
    }
    public function get($key) {
        return $this->query[$key] ?? null;
    }
}

class WP_Post {
    public $ID;
    public function __construct($id) {
        $this->ID = $id;
    }
}

$mock_meta = [
    101 => 201, // Post 101 has thumb 201
    102 => 202, // Post 102 has thumb 202
    103 => 0,   // Post 103 has no thumb
];

function get_post_thumbnail_id($post_id) {
    global $mock_meta;
    return $mock_meta[$post_id] ?? 0;
}

$primed_caches = [];
function update_meta_cache($type, $ids) {
    global $primed_caches;
    $primed_caches['meta'] = $ids;
}

function _prime_post_caches($ids, $update_term_cache = false, $update_meta_cache = false) {
    global $primed_caches;
    $primed_caches['posts'] = $ids;
}

// Global mock for REST request
if (!defined('REST_REQUEST')) {
    define('REST_REQUEST', true);
}

// The logic to test (Mirrors inc/cpt.php implementation)
function prime_remix_attachments($posts, $query) {
    // 1. Validate inputs and ensure we are in a REST request context
    if (empty($posts) || !is_object($query) || !method_exists($query, 'get')) {
        return $posts;
    }

    // 2. Only target REST requests (fail fast)
    if (!defined('REST_REQUEST') || !REST_REQUEST) {
        return $posts;
    }

    // 3. Ensure we are modifying the main query for 'remixes'
    if ($query->get('post_type') !== 'remixes') {
        return $posts;
    }

    $attachment_ids = [];
    foreach ($posts as $post) {
        $thumb_id = get_post_thumbnail_id($post->ID);
        if ($thumb_id) {
            $attachment_ids[] = $thumb_id;
        }
    }

    if (!empty($attachment_ids)) {
        $attachment_ids = array_unique($attachment_ids);
        update_meta_cache('post', $attachment_ids);
        if (function_exists('_prime_post_caches')) {
            _prime_post_caches($attachment_ids, false, false);
        }
    }

    return $posts;
}

// Test Case
echo "Running Test...\n";

$posts = [new WP_Post(101), new WP_Post(102), new WP_Post(103)];
$query = new WP_Query(['post_type' => 'remixes']);

$result = prime_remix_attachments($posts, $query);

global $primed_caches;

if (!isset($primed_caches['meta']) || !isset($primed_caches['posts'])) {
    echo "FAILED: Caches not primed.\n";
    exit(1);
}

$expected = [201, 202];
sort($expected);
sort($primed_caches['meta']);
sort($primed_caches['posts']);

if ($primed_caches['meta'] === $expected && $primed_caches['posts'] === $expected) {
    echo "SUCCESS: Attachment IDs [201, 202] primed correctly.\n";
} else {
    echo "FAILED: Incorrect IDs primed.\n";
    echo "Expected: " . implode(',', $expected) . "\n";
    echo "Got Meta: " . implode(',', $primed_caches['meta']) . "\n";
    echo "Got Posts: " . implode(',', $primed_caches['posts']) . "\n";
    exit(1);
}
