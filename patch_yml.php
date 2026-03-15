<?php
$content = file_get_contents('.github/workflows/validate-bot-regex.yml');
$content = str_replace(
    'STATIC=$(grep -oP "\$pattern = \'\K[^\']+" inc/ssr-handler.php)',
    'STATIC=$(grep -oP "\\\$pattern = \'\K[^\']+" inc/ssr-handler.php)',
    $content
);
file_put_contents('.github/workflows/validate-bot-regex.yml', $content);
