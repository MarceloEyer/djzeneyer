<?php
/**
 * SPA Loader / Hybrid Headless Engine
 * @package zentheme
 */

if (!defined('ABSPATH')) exit;

// 1. Path Configuration
$theme_dir = get_template_directory();
$dist_dir = $theme_dir . '/dist';
$real_dist_path = realpath($dist_dir);

if (!$real_dist_path) {
    return; // Fallback to WP
}

// Normalize trailing slash
$real_dist_path = rtrim($real_dist_path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

// 2. URI Sanitization
$request_uri = strtok($_SERVER['REQUEST_URI'] ?? '/', '?');
$request_uri = str_replace("\0", '', rawurldecode($request_uri));

// 3. Skip system and theme assets (let Apache/WP handle them)
if (preg_match('/^\/(wp-admin|wp-includes|wp-json|wp-content|wp-login)/', $request_uri)) {
    return;
}

// 4. Resolve clean path for SPA logic
$theme_slug = 'zentheme';
$dist_marker = '/wp-content/themes/' . $theme_slug . '/dist/';
$clean_path = $request_uri;

if (strpos($request_uri, $dist_marker) !== false) {
    $parts = explode($dist_marker, $request_uri);
    $clean_path = '/' . end($parts);
}

// Home mapping
if ($clean_path === '/' || $clean_path === '') {
    $clean_path = '/index.html';
}

$target_file = $real_dist_path . ltrim($clean_path, '/');

// 5. SSG Route Check (/path -> /path/index.html)
if (!file_exists($target_file) || !is_file($target_file)) {
    $url_trimmed = rtrim(ltrim($request_uri, '/'), '/');
    $alt_target = $real_dist_path . ($url_trimmed ? $url_trimmed . '/' : '') . 'index.html';
    
    if (file_exists($alt_target) && is_file($alt_target)) {
        $target_file = $alt_target;
    } else {
        return; // File not found in dist, let WP handle
    }
}

// 6. Security & Delivery
$real_target = realpath($target_file);
if (!$real_target || strpos($real_target, $real_dist_path) !== 0) {
    return; // Path traversal attempt or invalid path
}

$ext = strtolower(pathinfo($real_target, PATHINFO_EXTENSION));
$allowed = ['html', 'xml', 'txt', 'css', 'js', 'json', 'png', 'jpg', 'jpeg', 'svg', 'ico', 'webmanifest'];

if (!in_array($ext, $allowed, true)) {
    http_response_code(403);
    exit;
}

// SPA Shell Handling
if ($ext === 'html') {
    get_header();
    echo '<div id="root">';
    // Note: The closing </div> is in footer.php
    get_footer();
    exit;
}

// Static File Delivery
$mimes = [
    'xml' => 'application/xml',
    'txt' => 'text/plain',
    'css' => 'text/css',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'svg' => 'image/svg+xml',
    'ico' => 'image/x-icon',
    'webmanifest' => 'application/manifest+json'
];

$content_type = $mimes[$ext] ?? 'application/octet-stream';
$charset = in_array($ext, ['xml', 'txt', 'js', 'css', 'json', 'html']) ? '; charset=UTF-8' : '';

header('Content-Type: ' . $content_type . $charset);
readfile($real_target);
exit;
