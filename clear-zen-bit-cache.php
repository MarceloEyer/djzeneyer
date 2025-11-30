<?php
/**
 * Clear Zen BIT Plugin Cache
 * 
 * Run this once to clear the Bandsintown events cache
 * Then DELETE this file
 */

// Load WordPress
require_once __DIR__ . '/wp-load.php';

if (!current_user_can('manage_options')) {
    die('Access denied. You must be logged in as admin.');
}

echo "<h1>Zen BIT Cache Clear</h1>";

// Get artist ID
$artist_id = get_option('zen_bit_artist_id', '15619775');

// Clear transient
$cache_key = 'zen_bit_events_' . $artist_id;
$deleted = delete_transient($cache_key);

if ($deleted) {
    echo "<p style='color: green;'>✅ Cache cleared successfully!</p>";
    echo "<p>Cache key: <code>{$cache_key}</code></p>";
} else {
    echo "<p style='color: orange;'>⚠️ No cache found or already cleared.</p>";
    echo "<p>Cache key: <code>{$cache_key}</code></p>";
}

echo "<hr>";
echo "<h2>Test API Response</h2>";

// Test API call
require_once __DIR__ . '/wp-content/plugins/zen-bit/includes/class-zen-bit-api.php';

$events = Zen_BIT_API::get_events(3);

echo "<p>Events count: <strong>" . count($events) . "</strong></p>";

if (!empty($events)) {
    echo "<h3>First Event:</h3>";
    echo "<pre>";
    print_r($events[0]);
    echo "</pre>";
} else {
    echo "<p style='color: red;'>❌ No events returned from API</p>";
    
    // Debug: Try direct API call
    $api_key = get_option('zen_bit_api_key', 'f8f1216ea03be95a3ea91c7ebe7117e7');
    $url = "https://rest.bandsintown.com/artists/id_{$artist_id}/events?app_id={$api_key}";
    
    echo "<h3>Direct API Test:</h3>";
    echo "<p>URL: <code>{$url}</code></p>";
    
    $response = wp_remote_get($url);
    if (!is_wp_error($response)) {
        $body = wp_remote_retrieve_body($response);
        echo "<h4>Raw Response:</h4>";
        echo "<pre>" . htmlspecialchars(substr($body, 0, 500)) . "</pre>";
        
        $data = json_decode($body, true);
        echo "<h4>Decoded Response Type:</h4>";
        echo "<p>" . gettype($data) . "</p>";
        
        if (is_array($data)) {
            echo "<p>Is indexed array: " . (isset($data[0]) ? 'YES' : 'NO') . "</p>";
            echo "<p>Has 'id' key: " . (isset($data['id']) ? 'YES' : 'NO') . "</p>";
        }
    } else {
        echo "<p style='color: red;'>Error: " . $response->get_error_message() . "</p>";
    }
}

echo "<hr>";
echo "<h2>Next Steps:</h2>";
echo "<ol>";
echo "<li>Refresh your website</li>";
echo "<li>Check HomePage (should show 3 events)</li>";
echo "<li>Check EventsPage (should show 15 events)</li>";
echo "<li><strong>DELETE THIS FILE</strong> after use</li>";
echo "</ol>";
?>
