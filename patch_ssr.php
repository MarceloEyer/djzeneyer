<?php
$content = file_get_contents('inc/ssr-handler.php');

$search = "<?php\n/**";
$replace = "<?php\nnamespace DjZenEyer\Theme;\n\n/**";
$content = str_replace($search, $replace, $content);

$replacements = [
    'add_action' => '\add_action',
    'get_theme_file_path' => '\get_theme_file_path',
    'file_exists' => '\file_exists',
    'file_get_contents' => '\file_get_contents',
    'header' => '\header',
    'exit' => '\exit',
    'json_decode' => '\json_decode',
    'json_encode' => '\json_encode',
    'get_query_var' => '\get_query_var',
    'is_404' => '\is_404',
    'status_header' => '\status_header',
    'get_permalink' => '\get_permalink',
    'home_url' => '\home_url',
    'add_filter' => '\add_filter',
];

foreach ($replacements as $search_func => $replace_func) {
    $pattern = '/(?<!function |function_|\\\\|>|\$|\w)' . preg_quote($search_func, '/') . '\s*\(/';
    $content = preg_replace($pattern, $replace_func . '(', $content);
}

$content = str_replace("'djz_serve_ssr'", "__NAMESPACE__ . '\\\djz_serve_ssr'", $content);

// The specific issue: $pattern = '/(googlebot...)/i';
// The bash grep -oP "\$pattern = '\K[^']+" expects SINGLE quotes around the regex string.
// Let's ensure the regex is single-quoted exactly as the original.
// Actually, earlier we replaced $pattern = '(.*)'; with $pattern = '$1'; which removed the single quotes if we didn't escape them!
// We can just rely on the original single quotes. We just did `git checkout main inc/ssr-handler.php`, so we have the original.
// We just added the namespace back.

file_put_contents('inc/ssr-handler.php', $content);
