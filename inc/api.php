<?php
/**
 * REST API Endpoints - Gold Standard v3.0
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

    register_rest_route($ns, '/shop/page', [
        'methods' => 'GET',
        'callback' => 'djz_get_shop_page',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/products', [
        'methods' => 'GET',
        'callback' => 'djz_get_products',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/products/collections', [
        'methods' => 'GET',
        'callback' => 'djz_get_product_collections',
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
        'permission_callback' => '__return_true', // Token validation handled in callback
    ]);

    // register_rest_route($ns, '/gamipress/user-data', [ ... ]); 
    // Handled by ZenGame plugin

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
            if ((int) $item->menu_item_parent !== 0)
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
    $category = sanitize_title($request->get_param('category') ?? '');
    $exclude_category = sanitize_title($request->get_param('exclude_category') ?? '');
    $on_sale = filter_var($request->get_param('on_sale'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    $limit = max(1, min(100, (int) ($request->get_param('limit') ?: 100)));
    $orderby = sanitize_key($request->get_param('orderby') ?? 'date');
    $order = strtoupper(sanitize_text_field($request->get_param('order') ?? 'DESC'));

    if (!in_array($orderby, ['date', 'title', 'menu_order', 'modified', 'rand'], true)) {
        $orderby = 'date';
    }

    if (!in_array($order, ['ASC', 'DESC'], true)) {
        $order = 'DESC';
    }

    $cache_suffix = md5(wp_json_encode([
        'lang' => $lang,
        'slug' => $slug,
        'category' => $category,
        'exclude_category' => $exclude_category,
        'on_sale' => $on_sale,
        'limit' => $limit,
        'orderby' => $orderby,
        'order' => $order,
    ]));

    $cache_key = 'djz_products_v3_' . $cache_suffix;

    $cached = get_transient($cache_key);
    if ($cached && empty($slug))
        return rest_ensure_response($cached);

    $products = djz_query_products([
        'lang' => $lang,
        'slug' => $slug,
        'category' => $category,
        'exclude_category' => $exclude_category,
        'on_sale' => $on_sale,
        'limit' => $limit,
        'orderby' => $orderby,
        'order' => $order,
    ]);

    if (empty($slug)) {
        set_transient($cache_key, $products, DJZ_CACHE_PRODUCTS);
    }
    return rest_ensure_response($products);
}

function djz_get_product_collections($request)
{
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $limit = max(1, min(20, (int) ($request->get_param('limit') ?: 10)));
    $cache_key = 'djz_products_collections_v1_' . md5($lang . '|' . $limit);

    $cached = get_transient($cache_key);
    if ($cached) {
        return rest_ensure_response($cached);
    }

    $response = [
        'featured' => djz_query_products([
            'lang' => $lang,
            'featured' => true,
            'limit' => 1,
            'orderby' => 'date',
            'order' => 'DESC',
        ]),
        'new_releases' => djz_query_products([
            'lang' => $lang,
            'exclude_category' => 'featured',
            'limit' => $limit,
            'orderby' => 'date',
            'order' => 'DESC',
        ]),
        'best_sellers' => djz_query_products([
            'lang' => $lang,
            'limit' => $limit,
            'meta_key' => 'total_sales',
            'orderby' => 'meta_value_num',
            'order' => 'DESC',
        ]),
        'top_picks' => djz_query_products([
            'lang' => $lang,
            'limit' => $limit,
            'orderby' => 'rand',
            'order' => 'DESC',
        ]),
    ];

    set_transient($cache_key, $response, DJZ_CACHE_PRODUCTS);

    return rest_ensure_response($response);
}

function djz_query_products(array $options = [])
{
    $lang = sanitize_text_field($options['lang'] ?? 'en');
    $slug = sanitize_title($options['slug'] ?? '');
    $category = sanitize_title($options['category'] ?? '');
    $exclude_category = sanitize_title($options['exclude_category'] ?? '');
    $on_sale = $options['on_sale'] ?? null;
    $featured = filter_var($options['featured'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $meta_key = sanitize_key($options['meta_key'] ?? '');

    $args = [
        'post_type' => 'product',
        'posts_per_page' => $options['limit'] ?? 10,
        'post_status' => 'publish',
        'no_found_rows' => true,
        'orderby' => $options['orderby'] ?? 'date',
        'order' => $options['order'] ?? 'DESC',
    ];

    if (!empty($meta_key)) {
        $args['meta_key'] = $meta_key;
    }

    if (!empty($slug)) {
        $args['name'] = $slug;
        $args['posts_per_page'] = 1;
    }

    $tax_query = [];
    if (!empty($category)) {
        $tax_query[] = [
            'taxonomy' => 'product_cat',
            'field' => 'slug',
            'terms' => [$category],
        ];
    }

    if (!empty($exclude_category)) {
        $tax_query[] = [
            'taxonomy' => 'product_cat',
            'field' => 'slug',
            'terms' => [$exclude_category],
            'operator' => 'NOT IN',
        ];
    }

    if ($featured) {
        $tax_query[] = [
            'taxonomy' => 'product_visibility',
            'field' => 'name',
            'terms' => 'featured',
            'operator' => 'IN',
        ];
    }

    if (!empty($tax_query)) {
        $args['tax_query'] = $tax_query;
    }

    if (function_exists('pll_get_post_language')) {
        $args['lang'] = $lang;
    }

    if ($on_sale === true) {
        $args['meta_query'] = [
            [
                'key' => '_sale_price',
                'value' => 0,
                'type' => 'NUMERIC',
                'compare' => '>',
            ]
        ];
    }

    $query = new WP_Query($args);
    $products = [];

    if ($query->have_posts()) {
        $product_objects = [];
        $product_ids = [];
        $all_img_ids = [];

        while ($query->have_posts()) {
            $query->the_post();
            $product = wc_get_product(get_the_ID());

            if (!$product)
                continue;

            if ($on_sale === true && !$product->is_on_sale()) {
                continue;
            }

            $product_objects[] = $product;
            $product_ids[] = $product->get_id();

            $img_ids = djz_get_product_image_ids($product, empty($slug));
            if (!empty($img_ids)) {
                $all_img_ids = array_merge($all_img_ids, $img_ids);
            }
        }

        if (!empty($all_img_ids)) {
            djz_prime_thumbnails_cache($all_img_ids);
        }

        if (!empty($product_ids)) {
            update_object_term_cache($product_ids, 'product');
        }

        foreach ($product_objects as $product) {
            $images = [];
            $img_ids = djz_get_product_image_ids($product, empty($slug));

            foreach ($img_ids as $img_id) {
                $src = wp_get_attachment_url($img_id);
                if ($src) {
                    $img_data = [
                        'id' => $img_id,
                        'src' => $src,
                        'alt' => get_post_meta($img_id, '_wp_attachment_image_alt', true),
                    ];

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
                'description' => !empty($slug) ? $product->get_description() : '',
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

    return $products;
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

        return new WP_Error('subscription_failed', 'Ocorreu um erro na inscrição. Tente novamente mais tarde.', ['status' => 500]);
    }
}

/**
 * Update Profile
 */
function djz_update_profile($request)
{
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error('rest_not_logged_in', __('You must be logged in to update your profile.', 'djzeneyer'), ['status' => 401]);
    }

    $params = $request->get_json_params();
    if (empty($params)) {
        return new WP_Error('invalid_data', __('No data provided.', 'djzeneyer'), ['status' => 400]);
    }

    $data = ['ID' => $user_id];
    $updated = false;

    if (isset($params['displayName'])) {
        $display_name = sanitize_text_field($params['displayName']);
        if (!empty($display_name)) {
            $data['display_name'] = $display_name;
            $updated = true;
        }
    }

    if (!$updated) {
        return new WP_Error('nothing_to_update', __('Nothing to update.', 'djzeneyer'), ['status' => 400]);
    }

    $result = wp_update_user($data);

    if (is_wp_error($result)) {
        return $result;
    }

    return rest_ensure_response([
        'success' => true,
        'message' => __('Profile updated successfully!', 'djzeneyer'),
    ]);
}

/**
 * GamiPress & Achievement logic moved to ZenGame plugin.
 */

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
 * Clear achievements cache on update
 */
add_action('save_post_achievement', function () {
    global $wpdb;
    // Clears gamipress data for all users as it contains achievement titles/descriptions
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_gamipress_%'");
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
        'href' => wp_nonce_url(add_query_arg('djz_clear_cache', '1', admin_url()), 'djz_clear_cache'),
    ]);
}, 999);

add_action('admin_init', function () {
    if (!isset($_GET['djz_clear_cache']) || !current_user_can('manage_options'))
        return;

    // Fix: CSRF protection
    check_admin_referer('djz_clear_cache');

    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_%'");

    wp_redirect(remove_query_arg('djz_clear_cache'));
    exit;
});
/**
 * Get product image IDs with optimization for list views
 * 
 * @param WC_Product $product
 * @param bool $is_list_view
 * @return array
 */
function djz_get_product_image_ids($product, $is_list_view = false)
{
    if (!$product)
        return [];

    $img_ids = $product->get_gallery_image_ids();
    $featured_id = $product->get_image_id();

    if ($featured_id) {
        // Ensure featured image is first and unique
        array_unshift($img_ids, $featured_id);
        $img_ids = array_unique($img_ids);
    }

    // OPTIMIZATION: In list view, only return the first image (usually featured)
    if ($is_list_view && !empty($img_ids)) {
        $img_ids = array_slice($img_ids, 0, 1);
    }

    return $img_ids;
}

/**
 * Helper to prime thumbnail caches efficiently
 */
function djz_prime_thumbnails_cache($ids)
{
    if (empty($ids))
        return;
    $ids = array_unique(array_map('intval', $ids));

    if (function_exists('update_meta_cache')) {
        update_meta_cache('post', $ids);
    }

    // _prime_post_caches is an internal function since WP 6.1
    // We use version_compare or function_exists for safety.
    if (function_exists('_prime_post_caches')) {
        _prime_post_caches($ids, false, true);
    }
}


/**
 * Shop Page View-Model Endpoint (Aggregated & Cached)
 */
function djz_get_shop_page($request)
{
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $cache_key = 'djz_shop_page_v1_' . $lang;

    $cached = get_transient($cache_key);
    if ($cached)
        return rest_ensure_response($cached);

    $format_products = function ($query_args) use ($lang) {
        $args = array_merge([
            'post_type' => 'product',
            'post_status' => 'publish',
            'no_found_rows' => true,
        ], $query_args);

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

                $img_ids = djz_get_product_image_ids($product, true); // true = list view
                if (!empty($img_ids))
                    $all_img_ids = array_merge($all_img_ids, $img_ids);
            }

            if (!empty($all_img_ids))
                djz_prime_thumbnails_cache($all_img_ids);
            if (!empty($product_ids))
                update_object_term_cache($product_ids, 'product');

            foreach ($product_objects as $product) {
                $img_ids = djz_get_product_image_ids($product, true);
                $images = [];
                foreach ($img_ids as $img_id) {
                    $src = wp_get_attachment_url($img_id);
                    if ($src) {
                        $img_data = [
                            'id' => $img_id,
                            'src' => $src,
                            'alt' => get_post_meta($img_id, '_wp_attachment_image_alt', true),
                        ];
                        $sizes = ['medium', 'medium_large'];
                        $img_sizes = [];
                        foreach ($sizes as $size) {
                            $img_src = wp_get_attachment_image_src($img_id, $size);
                            if ($img_src)
                                $img_sizes[$size] = $img_src[0];
                        }
                        if (!empty($img_sizes))
                            $img_data['sizes'] = $img_sizes;
                        $images[] = $img_data;
                    }
                }

                $categories = wp_get_post_terms($product->get_id(), 'product_cat');
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
                    'description' => '',
                    'permalink' => get_permalink($product->get_id()),
                    'categories' => !is_wp_error($categories) ? array_map(function ($term) {
                        return ['id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug];
                    }, $categories) : [],
                ];
            }
        }
        return $products;
    };

    $featured = $format_products([
        'posts_per_page' => 1,
        'tax_query' => [
            [
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms' => 'featured',
            ]
        ]
    ]);

    $new_releases = $format_products([
        'posts_per_page' => 10,
        'orderby' => 'date',
        'order' => 'DESC',
        'tax_query' => [
            [
                'taxonomy' => 'product_cat',
                'field' => 'slug',
                'terms' => 'featured',
                'operator' => 'NOT IN'
            ]
        ]
    ]);

    $best_sellers = $format_products([
        'posts_per_page' => 10,
        'meta_query' => [
            [
                'relation' => 'OR',
                ['key' => '_sale_price', 'value' => 0, 'compare' => '>', 'type' => 'numeric'],
                ['key' => '_min_variation_sale_price', 'value' => 0, 'compare' => '>', 'type' => 'numeric']
            ]
        ]
    ]);

    $curated = $format_products([
        'posts_per_page' => 10,
        'orderby' => 'date',
        'order' => 'ASC',
    ]);

    $data = [
        'featured' => !empty($featured) ? $featured[0] : null,
        'new_releases' => $new_releases,
        'best_sellers' => $best_sellers,
        'curated' => $curated,
    ];

    set_transient($cache_key, $data, DJZ_CACHE_PRODUCTS);
    return rest_ensure_response($data);
}
