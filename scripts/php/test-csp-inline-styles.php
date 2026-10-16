<?php
/**
 * CSP regression cases using WordPress's real HTML parser and a fixture CSS registry.
 * Usage: php scripts/php/test-csp-inline-styles.php /path/to/wordpress
 */
define('ABSPATH', rtrim($argv[1] ?? '', '/\\') . '/');
if (!is_file(ABSPATH . 'wp-includes/html-api/class-wp-html-tag-processor.php')) {
    throw new RuntimeException('Provide an extracted WordPress core directory.');
}
spl_autoload_register(function ($class) {
    if (strpos($class, 'WP_HTML_') !== 0) return;
    $file = ABSPATH . 'wp-includes/html-api/class-' . str_replace('_', '-', strtolower($class)) . '.php';
    if (is_file($file)) require_once $file;
});
function add_action(...$args) {}
function add_filter(...$args) {}
function apply_filters($hook, $value) { return $value; }
function wp_styles() { return $GLOBALS['fixture_styles']; }
function _doing_it_wrong(...$args) { throw new RuntimeException('Unexpected WordPress API misuse'); }
function __($text, $domain = null) { return $text; }
$GLOBALS['DJZ_CSP_NONCE'] = 'fixture-nonce';
$GLOBALS['fixture_styles'] = new class {
    public function print_inline_style($handle, $display = true) {
        return $handle === 'woocommerce-inline' ? ".trusted { color: green; }\n/*# sourceURL=woocommerce-inline-inline-css */" : false;
    }
};
require_once ABSPATH . 'wp-includes/utf8.php';
require_once ABSPATH . 'wp-includes/kses.php';
require dirname(__DIR__, 2) . '/inc/csp.php';

$css = wp_styles()->print_inline_style('woocommerce-inline', false);
$cases = [
    ['registered', '<style id="woocommerce-inline-inline-css">' . "\n" . $css . "\n" . '</style>', true],
    ['copied ID with injected CSS', '<style id="woocommerce-inline-inline-css">body { display:none; }</style>', false],
    ['copied CSS with unlisted ID', '<style id="attacker-inline-css">' . $css . '</style>', false],
    ['allowlisted but unregistered', '<style id="ai_summarization-inline-css">body { display:none; }</style>', false],
    ['line ending normalization', '<style id="woocommerce-inline-inline-css">' . str_replace("\n", "\r\n", $css) . '</style>', true],
    ['script with copied ID', '<script id="woocommerce-inline-inline-css">alert(1)</script>', false],
];
foreach ($cases as [$name, $html, $authorized]) {
    $result = djz_csp_nonce_known_inline_styles($html);
    if (str_contains($result, 'nonce="fixture-nonce"') !== $authorized) {
        throw new RuntimeException("Failed: $name");
    }
    if (!$authorized && $result !== $html) {
        throw new RuntimeException("Unauthorized markup changed: $name");
    }
}
$existing = '<style id="woocommerce-inline-inline-css" nonce="existing">' . $css . '</style>';
if (djz_csp_nonce_known_inline_styles($existing) !== $existing) {
    throw new RuntimeException('Existing nonce was changed.');
}
echo "CSP inline style regression cases passed.\n";
