<?php
// verification/verify_auth_class.php

// -----------------------------------------------------------------------------
// Mock WordPress Environment
// -----------------------------------------------------------------------------

if (!class_exists('WP_Error')) {
    class WP_Error {
        public $code;
        public $message;
        public $data;
        public function __construct($code = '', $message = '', $data = '') {
            $this->code = $code;
            $this->message = $message;
            $this->data = $data;
        }
    }
}

function sanitize_user($username) {
    return preg_replace('/[^a-zA-Z0-9 _.-]/', '', $username);
}

function sanitize_email($email) { return $email; }
function sanitize_text_field($str) { return trim($str); }
function is_email($email) { return filter_var($email, FILTER_VALIDATE_EMAIL); }
function apply_filters($tag, $value) { return $value; }
function __($text, $domain) { return $text; }

// Mock username_exists with global state
$existing_users = ['john'];
// Create 100 collisions: john, john1, ... john100
for ($i = 1; $i <= 100; $i++) {
    $existing_users[] = 'john' . $i;
}

function username_exists($username) {
    global $existing_users;
    return in_array($username, $existing_users);
}

class MockWPDB {
    public $users = 'wp_users';
    public $queries = 0;

    public function esc_like($text) {
        return addcslashes($text, '_%\\');
    }

    public function prepare($query, ...$args) {
        $query = str_replace('%s', "'%s'", $query);
        return vsprintf($query, $args);
    }

    public function get_col($query) {
        global $existing_users;
        $this->queries++;

        // Return all existing users that start with 'john'
        // Simulating: SELECT user_login ... WHERE user_login LIKE 'john%'
        // In this mock environment, we just return the full list if the query looks like it's asking for it
        if (strpos($query, 'john') !== false) {
             return $existing_users;
        }
        return [];
    }
}

$wpdb = new MockWPDB();

// -----------------------------------------------------------------------------
// Load the Class
// -----------------------------------------------------------------------------

require_once __DIR__ . '/../plugins/zeneyer-auth/includes/Auth/class-password-auth.php';

use ZenEyer\Auth\Auth\Password_Auth;

// -----------------------------------------------------------------------------
// Verification Test
// -----------------------------------------------------------------------------

echo "Verifying ZenEyer\Auth\Auth\Password_Auth::generate_username optimization...\n";

try {
    // Access private method via Reflection
    $reflection = new ReflectionClass('ZenEyer\Auth\Auth\Password_Auth');
    $method = $reflection->getMethod('generate_username');
    $method->setAccessible(true);

    $email = 'john@example.com';
    $expected = 'john101';

    echo "Input Email: $email\n";
    echo "Existing Users: john, john1 ... john100\n";

    $start_queries = $wpdb->queries;
    $result = $method->invoke(null, $email);
    $end_queries = $wpdb->queries;

    echo "Result: $result\n";

    if ($result === $expected) {
        echo "✅ SUCCESS: Generated correct username '$result'.\n";
    } else {
        echo "❌ FAILURE: Expected '$expected', got '$result'.\n";
        exit(1);
    }

    $queries_made = $end_queries - $start_queries;
    echo "DB Queries made: $queries_made\n";

    if ($queries_made === 1) {
        echo "✅ PERFORMANCE: Only 1 batch query was made (excluding 'username_exists').\n";
    } else {
        echo "⚠️ WARNING: Queries made: $queries_made. Expected 1 query via \$wpdb.\n";
        // Note: username_exists checks cache, not counting as DB query in our mock unless we instrument it.
        // But our $wpdb mock counts calls to get_col.
    }

} catch (Exception $e) {
    echo "❌ EXCEPTION: " . $e->getMessage() . "\n";
    exit(1);
}
