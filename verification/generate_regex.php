<?php
/**
 * SSR Bot Detection Regex Generator
 *
 * Este script gera um regex otimizado a partir de uma lista de nomes de bots.
 */

if (php_sapi_name() !== 'cli') {
    header('HTTP/1.1 403 Forbidden');
    die('This script can only be run from the CLI.');
}

$bots = [
    'googlebot',
    'bingbot',
    'slurp', // Yahoo
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    // AI Bots
    'claudebot', // Anthropic
    'claude-web',
    'anthropic-ai',
    'gptbot', // OpenAI
    'oai-searchbot',
    'chatgpt-user',
    'google-extended',
    'perplexitybot',
    'youbot',
    // SEO tools
    'ahrefsbot',
    'semrushbot',
    'mj12bot',
    'dotbot',
];

$pattern = '/' . implode('|', array_map(function ($bot) {
    return preg_quote($bot, '/'); }, $bots)) . '/i';

echo $pattern;
