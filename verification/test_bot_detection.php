<?php
// Mock WordPress functions needed by inc/ssr-handler.php
if (!function_exists('add_action')) {
    function add_action($tag, $callback, $priority = 10, $accepted_args = 1) {}
}
if (!function_exists('get_stylesheet_directory')) {
    function get_stylesheet_directory() { return '/tmp'; }
}

// Include the file to test
require_once __DIR__ . '/../inc/ssr-handler.php';

$test_cases = [
    'Googlebot' => [
        'ua' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'expected' => true
    ],
    'ClaudeBot' => [
        'ua' => 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
        'expected' => true
    ],
    'Human Chrome' => [
        'ua' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'expected' => false
    ],
    'BingBot' => [
        'ua' => 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
        'expected' => true
    ],
    'Facebook' => [
        'ua' => 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        'expected' => true
    ],
    'Missing UA' => [
        'ua' => null, // Represents missing header
        'expected' => false
    ],
    'Twitter' => [
        'ua' => 'Twitterbot/1.0',
        'expected' => true
    ],
    'OpenAI Search' => [
        'ua' => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot',
        'expected' => true
    ],
    'ChatGPT User' => [
        'ua' => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
        'expected' => true
    ]
];

$failed = 0;
foreach ($test_cases as $name => $case) {
    if ($case['ua'] === null) {
        unset($_SERVER['HTTP_USER_AGENT']);
    } else {
        $_SERVER['HTTP_USER_AGENT'] = $case['ua'];
    }

    $result = djz_is_bot();

    if ($result !== $case['expected']) {
        echo "FAIL: $name - Expected " . ($case['expected'] ? 'TRUE' : 'FALSE') . ", got " . ($result ? 'TRUE' : 'FALSE') . "\n";
        $failed++;
    } else {
        echo "PASS: $name\n";
    }
}

if ($failed > 0) {
    echo "\nTotal Failures: $failed\n";
    exit(1);
}

echo "\nAll tests passed!\n";
