<?php
/**
 * Validate that inc/ssr-handler.php contains the generated bot regex.
 */

$generated = shell_exec(PHP_BINARY . ' ' . escapeshellarg(__DIR__ . '/generate_regex.php'));
$generated = trim((string)$generated);

$handler = file_get_contents(__DIR__ . '/../inc/ssr-handler.php');
if ($handler === false) {
    fwrite(STDERR, "Unable to read inc/ssr-handler.php\n");
    exit(1);
}

if (!preg_match("/\\\$pattern\\s*=\\s*'([^']+)'/", $handler, $matches)) {
    fwrite(STDERR, "Unable to locate static bot regex in inc/ssr-handler.php\n");
    exit(1);
}

$static = trim($matches[1]);

if ($generated !== $static) {
    fwrite(STDERR, "Static regex in inc/ssr-handler.php does not match generator output.\n");
    fwrite(STDERR, "Generated: {$generated}\n");
    fwrite(STDERR, "Static:    {$static}\n");
    exit(1);
}

echo "Bot regex validation OK\n";
