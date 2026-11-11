<?php
/**
 * Generate the bot user-agent regex used by inc/ssr-handler.php.
 *
 * Keep this list in sync with the static pattern in djz_is_bot().
 * The CI workflow compares this output with the checked-in handler.
 */

$bots = [
    'googlebot',
    'bingbot',
    'slurp',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    'claudebot',
    'claude-web',
    'anthropic-ai',
    'gptbot',
    'oai-searchbot',
    'chatgpt-user',
    'google-extended',
    'perplexitybot',
    'youbot',
    'ahrefsbot',
    'semrushbot',
    'mj12bot',
    'dotbot',
];

echo '/(' . implode('|', $bots) . ')/i';
