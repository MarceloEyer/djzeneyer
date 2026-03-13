<?php
/**
 * Debug Zen Bit Routes
 */
require_once('wp-load.php');

if (!current_user_can('manage_options') && !isset($_GET['force'])) {
    die('Unauthorized');
}

header('Content-Type: text/plain; charset=UTF-8');

echo "=== Zen Bit REST Routes Debug ===\n";

$server = rest_get_server();
$routes = $server->get_routes();
$namespace = 'zen-bit/v2';

echo "Routes for namespace: $namespace\n\n";

foreach ($routes as $route => $config) {
    if (strpos($route, $namespace) === 0) {
        echo "Route: $route\n";
        foreach ($config as $handler) {
            $methods = implode(', ', (array)$handler['methods']);
            echo "  Methods: $methods\n";
            if (isset($handler['callback'])) {
                $cb = $handler['callback'];
                if (is_array($cb)) {
                    $cb_str = (is_string($cb[0]) ? $cb[0] : get_class($cb[0])) . '::' . $cb[1];
                } else {
                    $cb_str = is_string($cb) ? $cb : 'Closure';
                }
                echo "  Callback: $cb_str\n";
            }
        }
        echo "\n";
    }
}

echo "=== End Debug ===\n";
