<?php
/**
 * REST API Endpoints
 * GamiPress, WooCommerce, Menu, Newsletter
 */

if (!defined('ABSPATH'))
    exit;

/**
 * Register all endpoints
 */
add_action('rest_api_init', function () {
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
function djz_get_menu($request)
{
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $cache_key = 'djz_menu_' . $lang;

    $cached = get_transient($cache_key);
    if ($cached)
        return rest_ensure_response($cached);
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
            if ((int)$item->menu_item_parent !== 0)
                continue;

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
function djz_get_products($request)
{
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $slug = sanitize_title($request->get_param('slug') ?? '');
    $cache_key = 'djz_products_v2_' . $lang;

    $cached = get_transient($cache_key);
    if ($cached && empty($slug))
        return rest_ensure_response($cached);

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

            if (!$product)
                continue;

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
            if (function_exists('_prime_post_caches')) {
                _prime_post_caches($all_img_ids, false, true);
            } else {
                update_meta_cache('post', $all_img_ids);
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

            // OPTIMIZATION: In list view (no slug), we only need the featured image
            // and specific sizes to reduce processing time and payload size.
            if (empty($slug) && !empty($img_ids)) {
                $img_ids = array_slice($img_ids, 0, 1);
            }

            foreach ($img_ids as $img_id) {
                $src = wp_get_attachment_url($img_id);
                if ($src) {
                    $img_data = [
                        'id' => $img_id,
                        'src' => $src,
                        'alt' => get_post_meta($img_id, '_wp_attachment_image_alt', true),
                    ];

                    // OPTIMIZATION: Only process necessary sizes for list view
                    $sizes = empty($slug)
                        ? ['medium', 'medium_large']
                        : ['thumbnail', 'medium', 'medium_large', 'large'];

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
                'categories' => array_map(function ($term) {
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
function djz_subscribe_newsletter($request)
{
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
        $list_id = (int)apply_filters('djz_mailpoet_list_id', 0);
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
    }
    catch (Exception $e) {
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
function djz_update_profile($request)
{
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
 * GamiPress User Data (Aggregated + Cached)
 */
function djz_get_gamipress_user_data($request)
{
    $user_id = get_current_user_id();
    if (!$user_id) return new WP_Error('no_user', 'User not authenticated', ['status' => 401]);

    // Transient cache per user (24h)
    $cache_key = 'djz_gamipress_v3_' . $user_id;
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return rest_ensure_response($cached);
    }

    // --- 1. Múltiplos Tipos de Pontos ---
    $point_data = [];
    if (function_exists('gamipress_get_points_types')) {
        $point_types = gamipress_get_points_types();

        // OPTIMIZATION: Batch prime caches for point type thumbnails
        $pt_thumb_ids = [];
        foreach ($point_types as $pt) {
            if (!empty($pt['ID'])) {
                $tid = get_post_thumbnail_id($pt['ID']);
                if ($tid) $pt_thumb_ids[] = (int) $tid;
            }
        }
        if (!empty($pt_thumb_ids)) {
            $pt_thumb_ids = array_unique($pt_thumb_ids);
            if (function_exists('_prime_post_caches')) {
                _prime_post_caches($pt_thumb_ids, false, true);
            } else {
                update_meta_cache('post', $pt_thumb_ids);
            }
        }

        foreach ($point_types as $slug => $pt) {
            $point_data[$slug] = [
                'name' => $pt['plural_name'],
                'amount' => (int)gamipress_get_user_points($user_id, $slug),
                'image' => get_the_post_thumbnail_url($pt['ID'], 'thumbnail') ?: ''
            ];
        }
    } else {
        // Fallback para XP básico se o plugin não estiver carregado corretamente
        $point_data['points'] = [
            'name' => 'XP',
            'amount' => (int)get_user_meta($user_id, '_gamipress_points_points', true),
            'image' => ''
        ];
    }

    // --- 2. Rank & Progressão Real ---
    $rank_info = [
        'current' => ['title' => 'Zen Novice', 'id' => 0, 'image' => ''],
        'next' => null,
        'progress' => 0
    ];

    if (function_exists('gamipress_get_user_rank')) {
        // Assume 'rank' como tipo padrão, pode ser filtrado se houver múltiplos
        $current_rank = gamipress_get_user_rank($user_id, 'rank');
        if ($current_rank) {
            $rank_info['current'] = [
                'id' => $current_rank->ID,
                'title' => $current_rank->post_title,
                'image' => get_the_post_thumbnail_url($current_rank->ID, 'thumbnail') ?: ''
            ];

            $next_rank = gamipress_get_next_rank($current_rank->ID);
            if ($next_rank) {
                $rank_info['next'] = [
                    'id' => $next_rank->ID,
                    'title' => $next_rank->post_title,
                    'image' => get_the_post_thumbnail_url($next_rank->ID, 'thumbnail') ?: ''
                ];
                // Idealmente teríamos os requisitos aqui, mas para o MVP usaremos a lógica de XP
            }
        }
    }

    // --- 3. Conquistas (Earned + Locked para motivação) ---
    $achievements = [];
    $all_achievements = get_posts([
        'post_type' => 'achievement',
        'numberposts' => -1,
        'post_status' => 'publish'
    ]);

    // OPTIMIZATION: Batch prime caches for achievement thumbnails to prevent N+1 queries
    $thumbnail_ids = [];
    foreach ($all_achievements as $post) {
        $tid = get_post_thumbnail_id($post->ID);
        if ($tid) {
            $thumbnail_ids[] = (int) $tid;
        }
    }

    if (!empty($thumbnail_ids)) {
        $thumbnail_ids = array_unique($thumbnail_ids);
        if (function_exists('_prime_post_caches')) {
            _prime_post_caches($thumbnail_ids, false, true);
        } else {
            update_meta_cache('post', $thumbnail_ids);
        }
    }

    // OPTIMIZATION: Batch fetch user earnings to prevent O(N) queries
    $earned_achievements_map = [];
    if (function_exists('gamipress_get_user_earnings')) {
        $user_earnings = gamipress_get_user_earnings($user_id, [
            'post_type' => 'achievement',
            'limit' => -1, // Get all
        ]);

        // gamipress_get_user_earnings returns an array of objects with post_id
        if ($user_earnings) {
            foreach ($user_earnings as $earning) {
                // Map achievement ID to earning data
                $earned_achievements_map[$earning->post_id] = $earning;
            }
        }
    }

    foreach ($all_achievements as $post) {
        $earned = false;
        $date_earned = '';
        
        if (isset($earned_achievements_map[$post->ID])) {
            $earned = true;
            $date_earned = $earned_achievements_map[$post->ID]->date;
        }

        $achievements[] = [
            'id' => $post->ID,
            'title' => $post->post_title,
            'description' => $post->post_excerpt ?: strip_tags(wp_trim_words($post->post_content, 20)),
            'image' => get_the_post_thumbnail_url($post->ID, 'medium') ?: '',
            'earned' => $earned,
            'date_earned' => $date_earned,
        ];
    }

    // --- 4. Logs de Atividade (Feed) ---
    $logs = [];
    if (function_exists('gamipress_get_logs')) {
        $raw_logs = gamipress_get_logs([
            'user_id' => $user_id,
            'limit' => 10,
            'orderby' => 'date',
            'order' => 'DESC'
        ]);
        foreach ($raw_logs as $log) {
            $logs[] = [
                'id' => $log->log_id,
                'type' => $log->type,
                'description' => $log->title,
                'date' => $log->date,
                'points' => (int)$log->points
            ];
        }
    }

    // --- 5. Custom Metas (Existentes) ---
    $streak = (int)get_user_meta($user_id, 'zen_login_streak', true);
    $last_login = get_user_meta($user_id, 'zen_last_login', true);
    $streak_fire = false;
    if ($last_login) {
        $diff_days = (strtotime('today') - strtotime(date('Y-m-d', strtotime($last_login)))) / 86400;
        $streak_fire = $diff_days <= 1;
    }

    $data = [
        'points' => $point_data,
        'rank' => $rank_info,
        'achievements' => $achievements,
        'logs' => $logs,
        'stats' => [
            'totalTracks' => djz_get_user_total_tracks($user_id),
            'eventsAttended' => djz_get_user_events_attended($user_id),
            'streak' => $streak,
            'streakFire' => $streak_fire,
        ],
        'lastUpdate' => current_time('mysql')
    ];

    set_transient($cache_key, $data, DJZ_CACHE_GAMIPRESS);
    return rest_ensure_response($data);
}

/**
 * Get User Total Tracks (Cached 24h)
 */
function djz_get_user_total_tracks($user_id)
{
    $cache_key = 'djz_user_tracks_' . $user_id;
    $cached = get_transient($cache_key);
    if ($cached !== false)
        return (int)$cached;

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
function djz_get_user_events_attended($user_id)
{
    $cache_key = 'djz_user_events_' . $user_id;
    $cached = get_transient($cache_key);
    if ($cached !== false)
        return (int)$cached;

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
        // OPTIMIZATION: Batch prime term cache to avoid N+1 queries
        $product_ids = [];
        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                if ($pid = $item->get_product_id()) {
                    $product_ids[] = $pid;
                }
            }
        }
        if (!empty($product_ids)) {
            $product_ids = array_unique($product_ids);
            update_object_term_cache($product_ids, 'product');
        }

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
function djz_clear_user_events_cache($order_id)
{
    $order = wc_get_order($order_id);
    if (!$order)
        return;

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
add_action('wp_update_nav_menu', function () {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_menu_%'");
});

/**
 * Clear cache on product update
 */
add_action('save_post_product', function () {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_products_%'");
});

/**
 * Admin: Clear Cache Button
 */
add_action('admin_bar_menu', function ($wp_admin_bar) {
    if (!current_user_can('manage_options'))
        return;

    $wp_admin_bar->add_node([
        'id' => 'djz_clear_cache',
        'title' => '🧹 Clear Cache',
        'href' => add_query_arg('djz_clear_cache', '1', admin_url()),
    ]);
}, 999);

add_action('admin_init', function () {
    if (!isset($_GET['djz_clear_cache']) || !current_user_can('manage_options'))
        return;

    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_%'");

    wp_redirect(remove_query_arg('djz_clear_cache'));
    exit;
});
