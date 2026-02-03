<?php

// Mocks
function add_action($hook, $callback, $priority = 10, $accepted_args = 1) {}
function get_stylesheet_directory() { return '/tmp'; }

// Include the file
require_once __DIR__ . '/../inc/ssr-handler.php';

$bots = [
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
];

$users = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
];

echo "Testing Bots:\n";
foreach ($bots as $ua) {
    $_SERVER['HTTP_USER_AGENT'] = $ua;
    $is_bot = djz_is_bot();
    echo "UA: $ua\nResult: " . ($is_bot ? 'BOT' : 'USER') . "\n";
    if (!$is_bot) {
        echo "FAIL: Should be identified as BOT\n";
        exit(1);
    }
}

echo "\nTesting Users:\n";
foreach ($users as $ua) {
    $_SERVER['HTTP_USER_AGENT'] = $ua;
    $is_bot = djz_is_bot();
    echo "UA: $ua\nResult: " . ($is_bot ? 'BOT' : 'USER') . "\n";
    if ($is_bot) {
        echo "FAIL: Should be identified as USER\n";
        exit(1);
    }
}

echo "\nSUCCESS: All tests passed.\n";
