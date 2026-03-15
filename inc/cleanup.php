<?php
/**
 * Global Cleanup (Admin/REST/Frontend)
 */

if (!defined('ABSPATH')) exit;

/**
 * Reduce Heartbeat Frequency
 */
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60;
    return $settings;
});

/**
 * Disable Translation Updates
 */
add_filter('auto_update_translation', '__return_false');

/**
 * Remove REST Endpoints (security)
 */
add_action('rest_api_init', function() {
    if (!is_user_logged_in()) {
        add_filter('rest_endpoints', function($endpoints) {
            unset($endpoints['/wp/v2/users']);
            unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
            return $endpoints;
        });
    }
}, 99);
