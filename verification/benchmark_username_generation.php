<?php
// verification/benchmark_username_generation.php

// -----------------------------------------------------------------------------
// Mock WordPress Environment
// -----------------------------------------------------------------------------

$db_queries = 0;
$base_username = 'john';
$existing_users = [$base_username];

// Create 100 collisions: john, john1, ... john100
for ($i = 1; $i <= 100; $i++) {
    $existing_users[] = $base_username . $i;
}

function sanitize_user($username) {
    return preg_replace('/[^a-zA-Z0-9 _.-]/', '', $username);
}

function username_exists($username) {
    global $existing_users, $db_queries;
    $db_queries++;
    // Simulate DB roundtrip latency (e.g., 1ms)
    usleep(1000);
    return in_array($username, $existing_users);
}

class MockWPDB {
    public $users = 'wp_users';

    public function esc_like($text) {
        return addcslashes($text, '_%\\');
    }

    public function prepare($query, ...$args) {
        // Very basic mock interpolation
        $query = str_replace('%s', "'%s'", $query); // Wrap placeholders
        return vsprintf($query, $args);
    }

    public function get_col($query) {
        global $existing_users, $db_queries;
        $db_queries++;
        // Simulate DB roundtrip latency (e.g., 2ms for a heavier query)
        usleep(2000);

        // For this mock, we assume the query is asking for users like 'john%'
        // so we return the full list of existing users.
        return $existing_users;
    }
}

$wpdb = new MockWPDB();

// -----------------------------------------------------------------------------
// Benchmark Scenarios
// -----------------------------------------------------------------------------

echo "Benchmark: Generating username for 'john@example.com' when 'john'...'john100' exist.\n\n";

// Scenario 1: Original Iterative Approach
$db_queries = 0;
echo "Scenario 1: Original Iterative Approach\n";
$start = microtime(true);

function generate_username_original($email) {
    $username = sanitize_user(substr($email, 0, strpos($email, '@')));
    $original = $username;
    $counter = 1;

    while (username_exists($username)) {
        $username = $original . $counter;
        $counter++;
    }

    return $username;
}

$result1 = generate_username_original('john@example.com');
$time1 = microtime(true) - $start;
$queries1 = $db_queries;

echo "Result: $result1\n";
echo "Queries: $queries1\n";
echo "Time: " . number_format($time1, 4) . "s\n";


// Scenario 2: Optimized Approach
$db_queries = 0;
echo "\nScenario 2: Optimized Approach (Batch Query)\n";
$start = microtime(true);

function generate_username_optimized($email) {
    global $wpdb;
    $username = sanitize_user(substr($email, 0, strpos($email, '@')));

    // 1. Check if the base username is free (optional, but good for common case)
    if (!username_exists($username)) {
        return $username;
    }

    // 2. Fetch all conflicting usernames in one query
    // SELECT user_login FROM wp_users WHERE user_login = 'john' OR user_login LIKE 'john%'
    // In our mock, $wpdb->get_col returns the mocked list.

    // Construct the query (mock-safe)
    $search = $wpdb->esc_like($username) . '%';
    $query = $wpdb->prepare(
        "SELECT user_login FROM {$wpdb->users} WHERE user_login = %s OR user_login LIKE %s",
        $username,
        $search
    );

    $taken_usernames = $wpdb->get_col($query);

    if (empty($taken_usernames)) {
        return $username; // Should not happen if we passed step 1, but safe fallback
    }

    // 3. Find the highest suffix in memory
    $max_suffix = 0;

    foreach ($taken_usernames as $taken) {
        // Check if it matches "john" or "john123"
        // We look for: ^john(\d+)$
        if (preg_match('/^' . preg_quote($username, '/') . '(\d+)$/', $taken, $matches)) {
            $suffix = intval($matches[1]);
            if ($suffix > $max_suffix) {
                $max_suffix = $suffix;
            }
        }
    }

    return $username . ($max_suffix + 1);
}

$result2 = generate_username_optimized('john@example.com');
$time2 = microtime(true) - $start;
$queries2 = $db_queries;

echo "Result: $result2\n";
echo "Queries: $queries2\n";
echo "Time: " . number_format($time2, 4) . "s\n";

// -----------------------------------------------------------------------------
// Results
// -----------------------------------------------------------------------------

echo "\n----------------------------------------------------------------\n";
if ($result1 === $result2) {
    echo "✅ Verification: Both functions produced the same username: $result1\n";
} else {
    echo "❌ Verification Failed: $result1 vs $result2\n";
}

echo "Query Reduction: " . ($queries1 - $queries2) . " queries saved.\n";
echo "Speedup: " . number_format($time1 / $time2, 1) . "x faster\n";
