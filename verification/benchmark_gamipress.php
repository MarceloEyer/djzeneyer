<?php
// Security Guard: Prevent direct browser access
if (php_sapi_name() !== 'cli') {
    die('Direct access not permitted');
}

// Mock GamiPress Environment
$db_queries = 0;
$user_earnings_cache = [];

function get_posts($args) {
    global $db_queries;
    $db_queries++; // Query for posts
    usleep(500); // Simulate DB latency
    $posts = [];
    for ($i=0; $i<100; $i++) {
        $posts[] = (object)[
            'ID' => $i + 1,
            'post_title' => "Achievement $i",
            'post_excerpt' => "Description $i",
            'post_content' => "Content $i",
        ];
    }
    return $posts;
}

function gamipress_has_user_earned_achievement($post_id, $user_id) {
    global $db_queries;
    $db_queries++; // Individual query
    usleep(200); // Simulate slightly faster single row query
    return $post_id % 2 === 0 ? (object)['date' => '2023-01-01'] : false;
}

function gamipress_get_user_earnings($user_id, $type) {
    global $db_queries;
    $db_queries++; // Batch query
    usleep(1000); // Simulate heavier query
    $earnings = [];
    for ($i=1; $i<=100; $i++) {
        if ($i % 2 === 0) {
            $earnings[] = (object)[
                'post_id' => $i,
                'date' => '2023-01-01',
            ];
        }
    }
    return $earnings;
}

// ---------------------------------------------------------
// Scenario 1: Unoptimized (N+1)
// ---------------------------------------------------------
echo "Scenario 1: Unoptimized (N+1 Queries)\n";
$db_queries = 0;
$start_time = microtime(true);

$achievements = get_posts(['post_type' => 'achievement']); // 1 Query
$results = [];

foreach ($achievements as $post) {
    $earned_obj = gamipress_has_user_earned_achievement($post->ID, 123); // N Queries
    $earned = false;
    $date_earned = '';
    if ($earned_obj) {
        $earned = true;
        $date_earned = $earned_obj->date;
    }
    $results[] = compact('earned', 'date_earned');
}

$end_time = microtime(true);
$queries_s1 = $db_queries;
$time_s1 = $end_time - $start_time;

echo "Queries: $queries_s1\n";
echo "Time: " . number_format($time_s1, 4) . "s\n";
echo "---------------------------------------------------------\n";

// ---------------------------------------------------------
// Scenario 2: Optimized (Batch Fetch)
// ---------------------------------------------------------
echo "Scenario 2: Optimized (Batch Fetch)\n";
$db_queries = 0;
$start_time = microtime(true);

$achievements = get_posts(['post_type' => 'achievement']); // 1 Query
$user_earnings_map = [];

// Batch fetch (1 Query)
$earnings_list = gamipress_get_user_earnings(123, 'achievement');
foreach ($earnings_list as $earned_obj) {
    $user_earnings_map[$earned_obj->post_id] = $earned_obj;
}

$results = [];
foreach ($achievements as $post) {
    $earned = isset($user_earnings_map[$post->ID]);
    $date_earned = $earned ? $user_earnings_map[$post->ID]->date : '';
    $results[] = compact('earned', 'date_earned');
}

$end_time = microtime(true);
$queries_s2 = $db_queries;
$time_s2 = $end_time - $start_time;

echo "Queries: $queries_s2\n";
echo "Time: " . number_format($time_s2, 4) . "s\n";
echo "---------------------------------------------------------\n";

// ---------------------------------------------------------
// Summary
// ---------------------------------------------------------
echo "Improvement:\n";
echo "Queries Reduced: " . ($queries_s1 - $queries_s2) . "\n";
echo "Time Speedup: " . number_format($time_s1 / $time_s2, 1) . "x\n";
