<?php
$bots = [
    'googlebot',
    'bingbot',
    'slurp',        // Yahoo
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    // AI Bots
    'claudebot',    // Anthropic (atual 2026)
    'claude-web',   // Anthropic (legado, manter para compatibilidade)
    'anthropic-ai', // Anthropic (legado, manter para compatibilidade)
    'gptbot',       // OpenAI (crawler de treinamento)
    'oai-searchbot', // OpenAI (indexação ChatGPT search)
    'chatgpt-user',  // OpenAI (visitas do ChatGPT)
    'google-extended', // Google Bard
    'perplexitybot',
    'youbot',
    // SEO tools
    'ahrefsbot',
    'semrushbot',
    'mj12bot',
    'dotbot',
];
$pattern = '/' . implode('|', array_map(function($bot) { return preg_quote($bot, '/'); }, $bots)) . '/i';
echo $pattern;
