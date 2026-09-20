<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$plugin_root = $root . DIRECTORY_SEPARATOR . 'plugins';
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($plugin_root, FilesystemIterator::SKIP_DOTS)
);

$files = [];
foreach ($iterator as $file) {
    if (
        $file->isFile()
        && 'php' === strtolower($file->getExtension())
        && !str_contains($file->getPathname(), DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR)
    ) {
        $files[] = $file->getPathname();
    }
}

sort($files);
$failed = [];

foreach ($files as $file) {
    $command = escapeshellarg(PHP_BINARY) . ' -l ' . escapeshellarg($file);
    exec($command, $output, $exit_code);
    if (0 !== $exit_code) {
        $failed[] = $file;
        fwrite(STDERR, implode(PHP_EOL, $output) . PHP_EOL);
    }
    $output = [];
}

if ([] !== $failed) {
    fwrite(STDERR, sprintf("PHP lint failed for %d file(s).%s", count($failed), PHP_EOL));
    exit(1);
}

fwrite(STDOUT, sprintf("PHP lint passed for %d plugin file(s).%s", count($files), PHP_EOL));
