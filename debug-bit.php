<?php
/**
 * Debug Bandsintown Connection
 * Execute via URL: https://djzeneyer.com/debug-bit.php
 */

require_once('wp-load.php');

if (!current_user_can('manage_options') && !isset($_GET['force'])) {
    die('Unauthorized');
}

header('Content-Type: text/plain; charset=UTF-8');

echo "=== Bandsintown Debug ===\n";

$artist_id = get_option('zen_bit_artist_id', '15619775');
$artist_name = get_option('zen_bit_artist_name', '');
$app_id = get_option('zen_bit_api_key', 'f8f1216ea03be95a3ea91c7ebe7117e7');

echo "Artist ID: $artist_id\n";
echo "Artist Name: $artist_name\n";
echo "App ID: $app_id\n";

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
