<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$base = $argv[1] ?? getenv('PHP_QUALITY_BASE') ?: 'HEAD^';
$command = sprintf(
    'git -C %s diff --name-only --diff-filter=ACMR %s...HEAD -- "*.php"',
    escapeshellarg($root),
    escapeshellarg($base)
);

exec($command, $changed_files, $exit_code);
if (0 !== $exit_code) {
    fwrite(STDERR, "Unable to determine changed PHP files.\n");
    exit($exit_code);
}

$plugin_prefix = 'plugins/';
$files = array_values(array_filter(
    $changed_files,
    static fn (string $file): bool => str_starts_with(str_replace('\\', '/', $file), $plugin_prefix)
        && is_file($root . DIRECTORY_SEPARATOR . $file)
));

if ([] === $files) {
    fwrite(STDOUT, "No changed plugin PHP files to check.\n");
    exit(0);
}

$phpcs = $root . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'bin' . DIRECTORY_SEPARATOR . 'phpcs';
$standard = $root . DIRECTORY_SEPARATOR . 'phpcs.xml.dist';
$arguments = array_map(
    static fn (string $file): string => escapeshellarg($root . DIRECTORY_SEPARATOR . $file),
    $files
);
$phpcs_command = sprintf(
    '%s --standard=%s %s',
    escapeshellarg($phpcs),
    escapeshellarg($standard),
    implode(' ', $arguments)
);

passthru($phpcs_command, $phpcs_exit_code);
exit($phpcs_exit_code);
