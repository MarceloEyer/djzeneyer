<?php
/**
 * Public facing functionality of the plugin.
 *
 * @package ZenBit
 */

namespace ZenBit;

if (!defined('ABSPATH')) {
    die;
}

class Zen_BIT_Public
{
    /**
     * Register hooks with the loader.
     *
     * @param Zen_BIT_Loader $loader Hook loader.
     */
    public function define_hooks($loader): void
    {
        $loader->add_action('init', $this, 'load_textdomain');
        $loader->add_action('wp_enqueue_scripts', $this, 'register_public_assets');
        $loader->add_shortcode('zen_bit_events', $this, 'render_shortcode');
    }

    /**
     * Load the plugin text domain for translation.
     */
    public function load_textdomain(): void
    {
        \load_plugin_textdomain('zen-bit', false, dirname(\plugin_basename(ZEN_BIT_PLUGIN_DIR . 'zen-bit.php')) . '/languages');
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     */
    public function register_public_assets(): void
    {
        \wp_register_style(
            'zen-bit-public',
            ZEN_BIT_PLUGIN_URL . 'public/css/zen-bit-public.css',
            [],
            ZEN_BIT_VERSION
        );
    }

    /**
     * Render the shortcode.
     */
    public function render_shortcode($atts): string
    {
        \wp_enqueue_style('zen-bit-public');
        return '<div id="zen-bit-events-root" class="zen-bit-events-container"></div>';
    }
}
