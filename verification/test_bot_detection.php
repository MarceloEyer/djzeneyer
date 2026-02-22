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
    'Empty UA' => [
        'ua' => '', // Empty string
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
    ],
    'Slurp (Yahoo)' => [
        'ua' => 'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)',
        'expected' => true
    ],
    'DuckDuckBot' => [
        'ua' => 'DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)',
        'expected' => true
    ],
    'BaiduSpider' => [
        'ua' => 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
        'expected' => true
    ],
    'YandexBot' => [
        'ua' => 'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
        'expected' => true
    ],
    'LinkedInBot' => [
        'ua' => 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Jakarta Commons-HttpClient/3.1 +http://www.linkedin.com)',
        'expected' => true
    ],
    'WhatsApp' => [
        'ua' => 'WhatsApp/2.21.12.21 A',
        'expected' => true
    ],
    'TelegramBot' => [
        'ua' => 'TelegramBot (like TwitterBot)',
        'expected' => true
    ],
    'Claude-Web (Legacy)' => [
        'ua' => 'Mozilla/5.0 (compatible; claude-web/1.0; +claudebot@anthropic.com)',
        'expected' => true
    ],
    'Anthropic-AI (Legacy)' => [
        'ua' => 'anthropic-ai/1.0',
        'expected' => true
    ],
    'GPTBot' => [
        'ua' => 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot',
        'expected' => true
    ],
    'Google-Extended' => [
        'ua' => 'Google-Extended',
        'expected' => true
    ],
    'PerplexityBot' => [
        'ua' => 'PerplexityBot/1.0',
        'expected' => true
    ],
    'YouBot' => [
        'ua' => 'Mozilla/5.0 (compatible; YouBot/1.0; +https://about.you.com/bot/)',
        'expected' => true
    ],
    'AhrefsBot' => [
        'ua' => 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
        'expected' => true
    ],
    'SemrushBot' => [
        'ua' => 'Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)',
        'expected' => true
    ],
    'MJ12Bot' => [
        'ua' => 'Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://www.majestic12.co.uk/bot.php?+)',
        'expected' => true
    ],
    'DotBot' => [
        'ua' => 'Mozilla/5.0 (compatible; DotBot/1.1; http://www.opensiteexplorer.org/dotbot, help@moz.com)',
        'expected' => true
    ],
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
