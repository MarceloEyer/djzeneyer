<?php
define('ABSPATH', '/tmp');
define('DAY_IN_SECONDS', 86400);
define('HOUR_IN_SECONDS', 3600);
define('DJZ_CACHE_GAMIPRESS', 86400);

// Mocks
$user_meta = [
    1 => [
        '_gamipress_points_points' => 150,
        '_gamipress_rank_rank' => 0,
    ]
];
$transients = [];

function get_current_user_id() { return 1; }
function get_user_meta($uid, $key, $single) { global $user_meta; return $user_meta[$uid][$key] ?? 0; }
function get_post($id) { return (object)['post_title' => 'Rank Name', 'ID' => $id, 'post_content' => '', 'post_excerpt' => '']; }
function get_posts($args) { return [get_post(101), get_post(102)]; }
function get_post_thumbnail_id($id) { return 0; }
function wp_get_attachment_url($id) { return ''; }
function rest_ensure_response($data) { return $data; }
function add_action($hook, $callback, $priority=10, $args=1) {}
function register_rest_route($ns, $route, $args) {}
function register_meta($type, $key, $args) {}
function sanitize_text_field($str) { return $str; }
function sanitize_title($str) { return $str; }
function sanitize_email($str) { return $str; }
function is_email($str) { return true; }
function is_user_logged_in() { return true; }
function update_meta_cache($type, $ids) {}
function wc_get_orders($args) { return []; }

// Cache Mocks
function get_transient($key) {
    global $transients;
    return $transients[$key] ?? false;
}
function set_transient($key, $value, $expiration) {
    global $transients;
    $transients[$key] = $value;
}

// Gamipress Mock (The slow part)
$gamipress_calls = 0;
function gamipress_get_user_earnings($uid, $args) {
    global $gamipress_calls;
    $gamipress_calls++;
    usleep(100000); // 100ms delay to simulate DB load
    return [
        (object)['post_id' => 101, 'date' => '2023-01-01'],
        (object)['post_id' => 102, 'date' => '2023-01-02'],
    ];
}

// Include the file to test
require_once __DIR__ . '/../inc/api.php';

// Test
echo "--- Run 1 (Cold Cache) ---\n";
$start = microtime(true);
$response1 = djz_get_gamipress_user_data(null);
$time1 = microtime(true) - $start;
echo "Time: " . number_format($time1, 4) . "s\n";
echo "Gamipress Calls: $gamipress_calls\n";

echo "\n--- Run 2 (Should be Cached) ---\n";
$start = microtime(true);
$response2 = djz_get_gamipress_user_data(null);
$time2 = microtime(true) - $start;
echo "Time: " . number_format($time2, 4) . "s\n";
echo "Gamipress Calls: $gamipress_calls\n";

if ($gamipress_calls === 1) {
    echo "\nSUCCESS: Cache works (only 1 call).\n";
} else {
    echo "\nFAIL: Cache not working (calls incremented).\n";
}
