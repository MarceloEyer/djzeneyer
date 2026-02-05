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
define('REST_REQUEST', true);

// The logic to test
function prime_remix_attachments($posts, $query) {
    if (empty($posts)) return $posts;
    if ($query->get('post_type') !== 'remixes') return $posts;

    // Only optimize REST requests
    if (!defined('REST_REQUEST') || !REST_REQUEST) return $posts;

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
$diff1 = array_diff($primed_caches['meta'], $expected);
$diff2 = array_diff($primed_caches['posts'], $expected);

if (empty($diff1) && empty($diff2)) {
    echo "SUCCESS: Attachment IDs [201, 202] primed correctly.\n";
} else {
    echo "FAILED: Incorrect IDs primed.\n";
    print_r($primed_caches);
    exit(1);
}
