<?php
$content = file_get_contents('inc/ssr-handler.php');
$content = str_replace(
    "\$pattern = '/(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|claudebot|claude-web|anthropic-ai|gptbot|oai-searchbot|chatgpt-user|google-extended|perplexitybot|youbot|ahrefsbot|semrushbot|mj12bot|dotbot)/i';",
    "\$pattern = '/(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|claudebot|claude-web|anthropic-ai|gptbot|oai-searchbot|chatgpt-user|google-extended|perplexitybot|youbot|ahrefsbot|semrushbot|mj12bot|dotbot)/i';",
    $content
);
file_put_contents('inc/ssr-handler.php', $content);
