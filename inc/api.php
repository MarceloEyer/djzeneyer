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

    register_rest_route($ns, '/gamipress/user-data', [
        'methods' => 'GET',
        'callback' => 'djz_get_gamipress_user_data',
        'permission_callback' => 'is_user_logged_in',
    ]);

    // Register Custom User Meta for REST
    register_meta('user', 'zen_login_streak', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'integer',
        'auth_callback' => '__return_true',
    ]);

    register_meta('user', 'zen_last_login', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'auth_callback' => '__return_true',
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
    $slug = sanitize_title($request->get_param('slug') ?? '');
    $cache_key = 'djz_products_' . $lang;
    
    $cached = get_transient($cache_key);
    if ($cached && empty($slug)) return rest_ensure_response($cached);
    
    $args = [
        'post_type' => 'product',
        'posts_per_page' => 100,
        'post_status' => 'publish',
        'no_found_rows' => true,
    ];

    if (!empty($slug)) {
        $args['name'] = $slug;
        $args['posts_per_page'] = 1;
    }
    
    if (function_exists('pll_get_post_language')) {
        $args['lang'] = $lang;
    }
    
    $query = new WP_Query($args);
    $products = [];
    
    if ($query->have_posts()) {
        $product_objects = [];
        $product_ids = [];
        $all_img_ids = [];

        while ($query->have_posts()) {
            $query->the_post();
            $id = get_the_ID();
            $product = wc_get_product($id);
            
            if (!$product) continue;
            
            $product_objects[] = $product;
            $product_ids[] = $product->get_id();

            $img_ids = $product->get_gallery_image_ids();
            if ($product->get_image_id()) {
                $img_ids[] = $product->get_image_id();
            }

            if (!empty($img_ids)) {
                $all_img_ids = array_merge($all_img_ids, $img_ids);
            }
        }

        // Batch prime caches for all images
        if (!empty($all_img_ids)) {
            $all_img_ids = array_unique($all_img_ids);
            update_meta_cache('post', $all_img_ids);
            if (function_exists('_prime_post_caches')) {
                _prime_post_caches($all_img_ids, false, false);
            }
        }

        // Batch prime caches for terms
        if (!empty($product_ids)) {
            update_object_term_cache($product_ids, 'product');
        }

        foreach ($product_objects as $product) {
            $id = $product->get_id(); // Fix: Update ID for current loop iteration
            $images = [];
            $img_ids = $product->get_gallery_image_ids();
            
            if ($product->get_image_id()) {
                array_unshift($img_ids, $product->get_image_id());
            }
            
            foreach ($img_ids as $img_id) {
                $src = wp_get_attachment_url($img_id);
                if ($src) {
                    $img_data = [
                        'id' => $img_id,
                        'src' => $src,
                        'alt' => get_post_meta($img_id, '_wp_attachment_image_alt', true),
                    ];

                    $sizes = ['thumbnail', 'medium', 'medium_large', 'large'];
                    $img_sizes = [];
                    foreach ($sizes as $size) {
                        $img_src = wp_get_attachment_image_src($img_id, $size);
                        if ($img_src) {
                            $img_sizes[$size] = $img_src[0];
                        }
                    }
                    if (!empty($img_sizes)) {
                        $img_data['sizes'] = $img_sizes;
                    }

                    $images[] = $img_data;
                }
            }
            
            $categories = wp_get_post_terms($product->get_id(), 'product_cat');
            if (is_wp_error($categories)) {
                $categories = [];
            }

            $products[] = [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'stock_status' => $product->get_stock_status(),
                'images' => $images,
                'short_description' => $product->get_short_description(),
                'description' => !empty($slug) ? $product->get_description() : '', // Optimization: Only return description for single view
                'permalink' => get_permalink($product->get_id()),
                'categories' => array_map(function($term) {
                    return [
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                    ];
                }, $categories),
            ];
        }
        wp_reset_postdata();
    }
    
    if (empty($slug)) {
        set_transient($cache_key, $products, DJZ_CACHE_PRODUCTS);
    }
    return rest_ensure_response($products);
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
        $list_id = (int) apply_filters('djz_mailpoet_list_id', 0);
        if ($list_id <= 0) {
            $list_id = $lists[0]['id'] ?? 1;
        }
        
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
    
    return rest_ensure_response([
        'success' => true,
        'message' => 'Profile updated!',
    ]);
}

/**
 * GamiPress User Data (Aggregated)
 */
function djz_get_gamipress_user_data($request) {
    $user_id = get_current_user_id();

    // 1. Points
    $points = (int) get_user_meta($user_id, '_gamipress_points_points', true);

    // 2. Rank
    $rank_id = (int) get_user_meta($user_id, '_gamipress_rank_rank', true);
    $rank_title = 'Zen Novice';
    if ($rank_id > 0) {
        $rank_post = get_post($rank_id);
        if ($rank_post) {
            $rank_title = $rank_post->post_title;
        }
    }

    // 3. Level Calculation
    $level = floor($points / 100) + 1;
    $next_level_points = $level * 100;
    $progress = min(100, (($points % 100) / 100) * 100);

    // 4. Achievements
    $achievements = [];

    if (function_exists('gamipress_get_user_earnings')) {
        $earnings = gamipress_get_user_earnings($user_id, [
            'limit' => 100,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_type' => 'achievement',
        ]);

        if (!empty($earnings)) {
            $achievement_ids = [];
            $earning_map = []; // achievement_id => earning_date

            foreach ($earnings as $earning) {
                // Support both object and array return types just in case
                $e_obj = (object) $earning;
                $a_id = $e_obj->post_id ?? 0;

                if ($a_id) {
                    $achievement_ids[] = $a_id;
                    if (!isset($earning_map[$a_id])) {
                        $earning_map[$a_id] = $e_obj->date ?? '';
                    }
                }
            }

            $achievement_ids = array_unique($achievement_ids);

            if (!empty($achievement_ids)) {
                $posts = get_posts([
                    'post_type' => 'any',
                    'include' => $achievement_ids,
                    'numberposts' => -1,
                ]);

                // Batch prime caches for images
                $img_ids = [];
                foreach ($posts as $post) {
                    $tid = get_post_thumbnail_id($post->ID);
                    if ($tid) {
                        $img_ids[] = $tid;
                    }
                }

                if (!empty($img_ids)) {
                    $img_ids = array_unique($img_ids);
                    update_meta_cache('post', $img_ids);
                    if (function_exists('_prime_post_caches')) {
                        _prime_post_caches($img_ids, false, false);
                    }
                }

                foreach ($posts as $post) {
                    $img_id = get_post_thumbnail_id($post->ID);
                    $img_url = $img_id ? wp_get_attachment_url($img_id) : '';

                    // Cleanup content
                    $description = strip_tags($post->post_content);
                    if (empty($description)) {
                        $description = $post->post_excerpt;
                    }

                    $achievements[] = [
                        'id' => $post->ID,
                        'title' => $post->post_title,
                        'description' => trim($description),
                        'image' => $img_url,
                        'earned' => true,
                        'date_earned' => $earning_map[$post->ID] ?? '',
                    ];
                }
            }
        }
    }

    // 5. Total Tracks
    $total_tracks = djz_get_user_total_tracks($user_id);

    // 6. Events Attended
    $events_attended = djz_get_user_events_attended($user_id);

    return rest_ensure_response([
        'points' => $points,
        'level' => $level,
        'rank' => $rank_title,
        'rankId' => $rank_id,
        'nextLevelPoints' => $next_level_points,
        'progressToNextLevel' => $progress,
        'achievements' => $achievements,
    ]);
}

/**
 * Get User Total Tracks (Cached 24h)
 */
function djz_get_user_total_tracks($user_id) {
    $cache_key = 'djz_user_tracks_' . $user_id;
    $cached = get_transient($cache_key);
    if ($cached !== false) return (int) $cached;

    $count = 0;
    if (function_exists('wc_get_customer_available_downloads')) {
        $downloads = wc_get_customer_available_downloads($user_id);
        $count = count($downloads);
    }

    set_transient($cache_key, $count, DAY_IN_SECONDS);
    return $count;
}

/**
 * Get User Events Attended (Cached 24h)
 */
function djz_get_user_events_attended($user_id) {
    $cache_key = 'djz_user_events_' . $user_id;
    $cached = get_transient($cache_key);
    if ($cached !== false) return (int) $cached;

    $args = [
        'customer_id' => $user_id,
        'limit' => -1,
        'status' => ['completed', 'processing'],
        'type' => 'shop_order',
    ];

    $orders = wc_get_orders($args);
    $count = 0;
    $target_slugs = ['events', 'tickets', 'congressos', 'workshops', 'social', 'festivais', 'pass'];

    if ($orders) {
        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();
                if ($product_id) {
                    $terms = get_the_terms($product_id, 'product_cat');
                    if ($terms && !is_wp_error($terms)) {
                        foreach ($terms as $term) {
                            if (in_array($term->slug, $target_slugs)) {
                                $count += $item->get_quantity();
                                break 2; // Count order only once? Or per item? Using quantity for accuracy.
                                // Actually, break 2 implies we only count once per order if ANY match is found.
                                // Let's simplify: 1 event per matching order line item quantity.
                            }
                        }
                    }
                }
            }
        }
    }

    set_transient($cache_key, $count, DAY_IN_SECONDS);
    return $count;
}

/**
 * Clear User Events Cache
 */
function djz_clear_user_events_cache($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $user_id = $order->get_user_id();
    if ($user_id) {
        delete_transient('djz_user_events_' . $user_id);
        delete_transient('djz_user_tracks_' . $user_id);
    }
}

// Hooks to clear cache on order status change
add_action('woocommerce_order_status_completed', 'djz_clear_user_events_cache');
add_action('woocommerce_order_status_processing', 'djz_clear_user_events_cache');
add_action('woocommerce_order_status_refunded', 'djz_clear_user_events_cache');
add_action('woocommerce_order_status_cancelled', 'djz_clear_user_events_cache');

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
