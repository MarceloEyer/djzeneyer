<?php
/**
 * Debug Bandsintown Connection
 * Execute via URL: https://djzeneyer.com/debug-bit.php
 */

require_once('wp-load.php');

if (!is_user_logged_in() || !current_user_can('manage_options')) {
    status_header(403);
    die('Unauthorized');
}

header('Content-Type: text/plain; charset=UTF-8');

echo "=== Bandsintown Debug ===\n";

$artist_id = get_option('zen_bit_artist_id', '15619775');
$artist_name = get_option('zen_bit_artist_name', '');
$app_id = get_option('zen_bit_api_key', '');

echo "Artist ID: $artist_id\n";
echo "Artist Name: $artist_name\n";
echo "App ID configured: " . ($app_id !== '' ? 'yes' : 'no') . "\n";

if ($app_id === '') {
    echo "Missing API key in zen_bit_api_key option.\n";
    exit;
}

$ident = $artist_name !== '' ? urlencode($artist_name) : 'id_' . $artist_id;
$url = sprintf(
    'https://rest.bandsintown.com/artists/%s/events?app_id=%s&date=upcoming',
    $ident,
    urlencode($app_id)
);

echo "Calling URL: $url\n\n";

$res = wp_remote_get($url, [
    'timeout' => 15,
    'headers' => ['Accept' => 'application/json'],
]);

if (is_wp_error($res)) {
    echo "WP_ERROR: " . $res->get_error_message() . "\n";
} else {
    $code = wp_remote_retrieve_response_code($res);
    $body = wp_remote_retrieve_body($res);
    echo "HTTP CODE: $code\n";
    echo "BODY snippet: " . substr($body, 0, 500) . "\n";
    
    $data = json_decode($body, true);
    if (is_array($data)) {
        echo "Count: " . count($data) . "\n";
        if (isset($data['error'])) {
            echo "API ERROR: " . $data['error'] . "\n";
        }
    } else {
        echo "Invalid JSON response\n";
    }
}

echo "\n=== End Debug ===\n";
