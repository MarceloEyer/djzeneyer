<?php
/**
 * REST API Endpoints
 * GamiPress, WooCommerce, Menu, Newsletter
 */

if (!defined('ABSPATH')) exit;

/**
 * Register all endpoints
 */
add_action('rest_api_init', function() {
    $ns = 'djzeneyer/v1';
    
    register_rest_route($ns, '/menu', [
        'methods' => 'GET',
        'callback' => 'djz_get_menu',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route($ns, '/products', [
        'methods' => 'GET',
        'callback' => 'djz_get_products',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route($ns, '/gamipress/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_get_gamipress',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route($ns, '/subscribe', [
        'methods' => 'POST',
        'callback' => 'djz_subscribe_newsletter',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route($ns, '/user/update-profile', [
        'methods' => 'POST',
        'callback' => 'djz_update_profile',
        'permission_callback' => 'is_user_logged_in',
    ]);
});

/**
 * Menu Endpoint (Cached 6h)
 */
function djz_get_menu($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $cache_key = 'djz_menu_' . $lang;
    
    $cached = get_transient($cache_key);
    if ($cached) return rest_ensure_response($cached);
    
    if (function_exists('pll_set_language')) {
        pll_set_language($lang);
    }
    
    $locations = get_nav_menu_locations();
    $menu_id = $locations['primary_menu'] ?? 0;
    
    if (!$menu_id) {
        $menus = wp_get_nav_menus();
        $menu_id = $menus[0]->term_id ?? 0;
    }
    
    $items = wp_get_nav_menu_items($menu_id);
    $formatted = [];
    $home = home_url();
    
    if ($items) {
        foreach ($items as $item) {
            if ((int)$item->menu_item_parent !== 0) continue;
            
            $url = $item->url;
            if (strpos($url, $home) !== false) {
                $url = str_replace($home, '', $url);
                $url = '/' . ltrim($url, '/');
            }
            
            $formatted[] = [
                'ID' => $item->ID,
                'title' => $item->title,
                'url' => $url,
                'target' => $item->target ?: '_self',
            ];
        }
    }
    
    set_transient($cache_key, $formatted, DJZ_CACHE_MENU);
    return rest_ensure_response($formatted);
}

/**
 * Products Endpoint (Cached 30min)
 */
function djz_get_products($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $cache_key = 'djz_products_' . $lang;
    
    $cached = get_transient($cache_key);
    if ($cached) return rest_ensure_response($cached);
    
    $args = [
        'post_type' => 'product',
        'posts_per_page' => 100,
        'post_status' => 'publish',
        'no_found_rows' => true,
    ];
    
    if (function_exists('pll_get_post_language')) {
        $args['lang'] = $lang;
    }
    
    $query = new WP_Query($args);
    $products = [];
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $id = get_the_ID();
            $product = wc_get_product($id);
            
            if (!$product) continue;
            
            $images = [];
            $img_ids = $product->get_gallery_image_ids();
            
            if ($product->get_image_id()) {
                array_unshift($img_ids, $product->get_image_id());
            }
            
            foreach ($img_ids as $img_id) {
                $src = wp_get_attachment_url($img_id);
                if ($src) {
                    $images[] = [
                        'id' => $img_id,
                        'src' => $src,
                        'alt' => get_post_meta($img_id, '_wp_attachment_image_alt', true),
                    ];
                }
            }
            
            $products[] = [
                'id' => $id,
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'stock_status' => $product->get_stock_status(),
                'images' => $images,
            ];
        }
        wp_reset_postdata();
    }
    
    set_transient($cache_key, $products, DJZ_CACHE_PRODUCTS);
    return rest_ensure_response($products);
}

/**
 * GamiPress Endpoint (Cached 15min)
 */
function djz_get_gamipress($request) {
    $user_id = (int)$request->get_param('user_id');
    
    if ($user_id <= 0) {
        return new WP_Error('invalid_user', 'Invalid user ID', ['status' => 400]);
    }
    
    $cache_key = 'djz_gamipress_' . $user_id;
    $cached = get_transient($cache_key);
    if ($cached) return rest_ensure_response($cached);
    
    if (!function_exists('gamipress_get_user_points')) {
        $fallback = [
            'success' => false,
            'message' => 'GamiPress not active',
            'data' => [
                'points' => 0,
                'level' => 1,
                'rank' => 'Zen Novice',
                'achievements' => [],
            ],
        ];
        set_transient($cache_key, $fallback, DJZ_CACHE_GAMIPRESS);
        return rest_ensure_response($fallback);
    }
    
    $points = (int)gamipress_get_user_points($user_id, 'zen-points');
    
    $ranks = [
        ['name' => 'Zen Novice', 'min' => 0, 'next' => 100],
        ['name' => 'Zen Apprentice', 'min' => 100, 'next' => 500],
        ['name' => 'Zen Voyager', 'min' => 500, 'next' => 1500],
        ['name' => 'Zen Master', 'min' => 1500, 'next' => 4000],
        ['name' => 'Zen Legend', 'min' => 4000, 'next' => 10000],
    ];
    
    $level = 1;
    $rank = $ranks[0]['name'];
    $next = $ranks[0]['next'];
    
    foreach ($ranks as $i => $tier) {
        if ($points >= $tier['min']) {
            $level = $i + 1;
            $rank = $tier['name'];
            $next = $tier['next'];
        }
    }
    
    $current_min = $ranks[$level - 1]['min'];
    $progress = min(100, round((($points - $current_min) / ($next - $current_min)) * 100));
    
    $achievements = [];
    $query = new WP_Query([
        'post_type' => 'insigna',
        'posts_per_page' => 20,
        'post_status' => 'publish',
    ]);
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $id = get_the_ID();
            
            $achievements[] = [
                'id' => $id,
                'title' => get_the_title(),
                'description' => get_the_excerpt(),
                'image' => get_the_post_thumbnail_url($id, 'medium'),
                'earned' => gamipress_has_user_earned_achievement($id, $user_id),
            ];
        }
        wp_reset_postdata();
    }
    
    $response = [
        'success' => true,
        'data' => [
            'points' => $points,
            'level' => $level,
            'rank' => $rank,
            'nextLevel' => min($level + 1, count($ranks)),
            'nextLevelPoints' => $next,
            'progressToNextLevel' => $progress,
            'achievements' => $achievements,
        ],
    ];
    
    set_transient($cache_key, $response, DJZ_CACHE_GAMIPRESS);
    return rest_ensure_response($response);
}

/**
 * Newsletter Subscription
 */
function djz_subscribe_newsletter($request) {
    $email = sanitize_email($request->get_param('email'));
    
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email', ['status' => 400]);
    }
    
    if (!class_exists('\MailPoet\API\API')) {
        return new WP_Error('mailpoet_inactive', 'MailPoet not active', ['status' => 500]);
    }
    
    try {
        $api = \MailPoet\API\API::MP('v1');
        $lists = $api->getLists();
        $list_id = $lists[0]['id'] ?? 1;
        
        $api->addSubscriber([
            'email' => $email,
            'status' => 'subscribed',
        ], [$list_id]);
        
        return rest_ensure_response([
            'success' => true,
            'message' => 'Subscribed!',
        ]);
    } catch (Exception $e) {
        if (stripos($e->getMessage(), 'already exists') !== false) {
            return rest_ensure_response([
                'success' => true,
                'message' => 'Already subscribed!',
            ]);
        }
        
        return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
    }
}

/**
 * Update Profile
 */
function djz_update_profile($request) {
    $user_id = get_current_user_id();
    $params = $request->get_json_params();
    
    $data = ['ID' => $user_id];
    
    if (isset($params['displayName'])) {
        $data['display_name'] = sanitize_text_field($params['displayName']);
    }
    
    $result = wp_update_user($data);
    
    if (is_wp_error($result)) {
        return new WP_Error('update_failed', 'Update failed', ['status' => 400]);
    }
    
    delete_transient('djz_gamipress_' . $user_id);
    
    return rest_ensure_response([
        'success' => true,
        'message' => 'Profile updated!',
    ]);
}

/**
 * Clear cache on menu update
 */
add_action('wp_update_nav_menu', function() {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_menu_%'");
});

/**
 * Clear cache on product update
 */
add_action('save_post_product', function() {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_products_%'");
});

/**
 * Clear cache on GamiPress update
 */
add_action('gamipress_update_user_points', function($user_id) {
    delete_transient('djz_gamipress_' . $user_id);
});

add_action('gamipress_award_achievement', function($user_id) {
    delete_transient('djz_gamipress_' . $user_id);
});

/**
 * Admin: Clear Cache Button
 */
add_action('admin_bar_menu', function($wp_admin_bar) {
    if (!current_user_can('manage_options')) return;
    
    $wp_admin_bar->add_node([
        'id' => 'djz_clear_cache',
        'title' => '🧹 Clear Cache',
        'href' => add_query_arg('djz_clear_cache', '1', admin_url()),
    ]);
}, 999);

add_action('admin_init', function() {
    if (!isset($_GET['djz_clear_cache']) || !current_user_can('manage_options')) return;
    
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_%'");
    
    wp_redirect(remove_query_arg('djz_clear_cache'));
    exit;
});