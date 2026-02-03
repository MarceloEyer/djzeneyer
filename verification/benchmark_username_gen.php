<?php
namespace ZenEyer\Auth\Auth;

// Mock WP Dependencies
class WP_Error {
    public function __construct($code = '', $message = '', $data = '') {}
}

function is_wp_error($thing) { return false; }
function get_option($name, $default = false) { return $default; }
function update_user_meta($user_id, $meta_key, $meta_value, $prev_value = '') {}
function do_action($tag, ...$arg) {}
function wp_remote_get($url, $args = array()) {}
function wp_remote_retrieve_body($response) {}
function sanitize_email($email) { return $email; }
function get_user_by($field, $value) { return false; }
function wp_generate_password($length = 12, $special_chars = true, $extra_special_chars = false) { return 'password'; }
function wp_create_user($username, $password, $email = '') { return 1; }
function wp_update_user($userdata) {}
function sanitize_user($username, $strict = false) { return $username; }

// Simulation State
$existing_usernames = [];
$query_count = 0;

function username_exists($username) {
    global $existing_usernames, $query_count;
    $query_count++;
    // Case insensitive check
    foreach ($existing_usernames as $u) {
        if (strtolower($u) === strtolower($username)) {
            return true;
        }
    }
    return false;
}

// Mock WPDB
class MockWPDB {
    public $users = 'wp_users';

    public function prepare($query, ...$args) {
        foreach ($args as $arg) {
            $query = preg_replace('/%s/', "'$arg'", $query, 1);
        }
        return $query;
    }

    public function esc_like($text) {
        return addcslashes($text, '_%\\');
    }

    public function get_col($query) {
        global $existing_usernames, $query_count;
        $query_count++;
        // Simulate finding matching usernames (Case Insensitive)
        if (strpos($query, "LIKE 'testuser%'") !== false) {
             $matches = [];
             foreach ($existing_usernames as $u) {
                 if (stripos($u, 'testuser') === 0) {
                     $matches[] = $u;
                 }
             }
             return $matches;
        }
        return [];
    }
}

global $wpdb;
$wpdb = new MockWPDB();

// Load the class file
require_once __DIR__ . '/../plugins/zeneyer-auth/includes/Auth/class-google-provider.php';

// Reflection to access private method
$reflection = new \ReflectionClass('ZenEyer\Auth\Auth\Google_Provider');
$method = $reflection->getMethod('generate_username');
$method->setAccessible(true);

// --- BENCHMARK ---

// Setup: Create 1000 collisions with MIXED CASE
$base = 'testuser';
for ($i = 0; $i < 1000; $i++) {
    $u = $i === 0 ? $base : $base . $i;
    // Every other user is uppercase to test case insensitivity
    if ($i % 2 !== 0) {
        $u = strtoupper($u);
    }
    $existing_usernames[] = $u;
}
// e.g. testuser, TESTUSER1, testuser2, TESTUSER3 ...

echo "Benchmarking generate_username with 1000 mixed-case collisions...\n";

// Measure
$start_time = microtime(true);
$start_queries = $query_count;

// We expect it to generate 'testuser1000' (or verify against existing logic)
$result = $method->invoke(null, 'testuser@example.com');

$end_time = microtime(true);
$end_queries = $query_count;

echo "Result: $result\n";
echo "Time: " . number_format(($end_time - $start_time) * 1000, 2) . " ms\n";
echo "Queries: " . ($end_queries - $start_queries) . "\n";
