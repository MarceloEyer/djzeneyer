<?php
/**
 * ZENEYER HEADLESS EXTENSIONS (API)
 * Auth, Loja, GamiPress, Menu multilíngue, cache e fixes REST.
 */

if (!defined('ABSPATH')) exit;

// ============================================================================
// 1. AUTENTICAÇÃO (JWT auxiliar, mantém seu plugin ativo)
// ============================================================================
add_action('rest_api_init', function () {
    register_rest_route('zeneyer-auth/v1', '/settings', [
        'methods' => 'GET',
        'callback' => 'djz_get_auth_settings',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route('zeneyer-auth/v1', '/auth/validate', [
        'methods' => 'POST',
        'callback' => 'djz_validate_token',
        'permission_callback' => '__return_true',
    ]);
});
function djz_get_auth_settings() {
    return [
        'login_url' => home_url('/wp-login.php'),
        'register_allowed' => get_option('users_can_register'),
        'site_name' => get_bloginfo('name'),
    ];
}
function djz_validate_token($request) {
    if (is_user_logged_in()) {
        $user = wp_get_current_user();
        return [
            'code' => 'jwt_auth_valid_token',
            'data' => [
                'status' => 200,
                'user' => [
                    'id' => $user->ID,
                    'email' => $user->user_email,
                    'nicename' => $user->user_nicename,
                    'display_name' => $user->display_name,
                    'roles' => $user->roles
                ]
            ]
        ];
    }
    return new WP_Error('jwt_auth_invalid_token', 'Token inválido ou expirado', ['status' => 403]);
}

// ============================================================================
// 2. GAMIPRESS (Zen Points, Níveis, Insignias, Streak real, Actions)
// ============================================================================
function djz_format_requirements($post_id) {
    if (!function_exists('gamipress_get_post_requirements')) return [];
    $requirements = gamipress_get_post_requirements($post_id);
    $formatted = [];
    if (is_array($requirements)) {
        foreach ($requirements as $req) {
            $formatted[] = [
                'id' => $req->ID ?? 0,
                'title' => $req->post_title ?? '',
                'type' => get_post_meta($req->ID, '_gamipress_trigger_type', true),
                'count' => (int) get_post_meta($req->ID, '_gamipress_count', true),
            ];
        }
    }
    return $formatted;
}
function djz_get_gamipress_handler($request) {
    $user_id = intval($request->get_param('user_id'));
    if ($user_id <= 0) return new WP_Error('invalid_user_id', 'Invalid user ID', ['status' => 400]);
    if (!function_exists('gamipress_get_user_points')) {
        return rest_ensure_response([
            'success' => false, 
            'message' => 'GamiPress not active',
            'data' => [
                'points' => 0, 
                'level' => 1, 
                'rank' => 'Zen Novice', 
                'nextLevelPoints' => 100, 
                'achievements' => [], 
                'allRanks' => [], 
                'streak' => 0, 
                'actions' => []
            ]
        ]);
    }
    // Configurações: Slugs e níveis futuros
    $points_slug = 'zen-points';
    $rank_slug = 'zen-level';
    $achievement_slug = 'insigna';
    $rank_tiers = [
        1 => ['name' => 'Zen Novice',      'min' => 0,    'priority' => 1],
        2 => ['name' => 'Zen Apprentice',  'min' => 100,  'priority' => 2],
        3 => ['name' => 'Zen Voyager',     'min' => 500,  'priority' => 3],
        4 => ['name' => 'Zen Master',      'min' => 1500, 'priority' => 4],
        // 5 => ['name' => 'Zen Legend',  'min' => 4000, 'priority' => 5],
    ];
    $zen_points = (int) gamipress_get_user_points($user_id, $points_slug);
    $user_level = 1;
    $rank_title = $rank_tiers[1]['name'];
    $next_level_points = 100;
    foreach ($rank_tiers as $level => $r) {
        if ($zen_points >= $r['min']) {
            $user_level = $level;
            $rank_title = $r['name'];
            $next_level_points = $rank_tiers[$level + 1]['min'] ?? $zen_points + 100;
        }
    }
    $progress_to_next = min(100, ($next_level_points > 0 ? round(100 * ($zen_points - $rank_tiers[$user_level]['min']) / max(1, $next_level_points - $rank_tiers[$user_level]['min']) : 100));
    // BADGES (Insignias dinâmico)
    $all_achievements = [];
    $earned_achievements = [];
    $query = new WP_Query([
        'post_type'      => $achievement_slug,
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    ]);
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $a_id = get_the_ID();
            $earned = gamipress_has_user_earned_achievement($a_id, $user_id);
            $img = get_the_post_thumbnail_url($a_id, 'medium') ?: '';
            $ach = [
                'id' => $a_id,
                'title' => get_the_title(),
                'description' => get_the_excerpt() ?: '',
                'image' => $img,
                'earned' => !!$earned
            ];
            $all_achievements[] = $ach;
            if ($earned) $earned_achievements[] = $ach;
        }
        wp_reset_postdata();
    }
    // STREAK (usando login diário verdadeiro GamiPress)
    $streak_days = function_exists('gamipress_get_user_streak') ? (int) gamipress_get_user_streak($user_id, 'daily-visit-the-website') : 0;
    // Próximas ações baseadas em badges/ranks
    $actions = [];
    if ($streak_days < 7) {
        $actions[] = [
            'description' => "Faça login diariamente para conquistar um streak de 7 dias!",
            'points' => 10,
            'type' => 'streak'
        ];
    }
    if ($zen_points < ($next_level_points)) {
        $actions[] = [
            'description' => "Conquiste mais Zen Points participando de eventos, ouvindo músicas e coletando badges.",
            'points' => ($next_level_points - $zen_points),
            'type' => 'points'
        ];
    }
    foreach ($all_achievements as $ach) {
        if (!$ach['earned']) {
            $actions[] = [
                'description' => "Conquiste a insígnia: " . $ach['title'],
                'type' => 'achievement'
            ];
        }
    }
    return rest_ensure_response([
        'success' => true,
        'data' => [
            'points'      => $zen_points,
            'level'       => $user_level,
            'rank'        => $rank_title,
            'nextLevel'   => $user_level + 1,
            'nextLevelPoints' => $next_level_points,
            'progressToNextLevel' => $progress_to_next,
            'achievements' => $all_achievements,
            'earnedAchievements' => $earned_achievements,
            'streak'      => $streak_days,
            'actions'     => $actions
        ]
    ]);
}
// Streak extra/multiversão, caso precise
function djz_streak_handler($request) {
    $user_id = intval($request->get_param('user_id'));
    $days = 0;
    if (function_exists('gamipress_get_user_streak')) {
        $days = (int) gamipress_get_user_streak($user_id, 'login');
    }
    return rest_ensure_response(['days' => $days]);
}

// ============================================================================
// 3. MENU MULTILÍNGUE (Polylang) COM CACHE
// ============================================================================
function djz_get_multilang_menu_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $cache_key = 'djz_menu_' . $lang;
    $cached = get_transient($cache_key);
    if ($cached !== false) return rest_ensure_response($cached);
    if (function_exists('pll_set_language')) pll_set_language($lang);
    $locations = get_nav_menu_locations();
    $menu_id = $locations['primary'] ?? $locations['primary_menu'] ?? $locations['header_menu'] ?? false;
    if (!$menu_id) {
        $menu_obj = wp_get_nav_menu_object('Primary') ?? wp_get_nav_menu_object('Menu Principal') ?? current(wp_get_nav_menus());
        $menu_id = $menu_obj && isset($menu_obj->term_id) ? $menu_obj->term_id : 0;
    }
    if (!$menu_id) return rest_ensure_response([]);
    $items = wp_get_nav_menu_items($menu_id);
    if (!is_array($items)) return rest_ensure_response([]);
    $formatted = [];
    $home_url = home_url();
    foreach ($items as $item) {
        if (empty($item->ID) || (int)$item->menu_item_parent !== 0) continue;
        $url = $item->url;
        if (strpos($url, $home_url) !== false) {
            $url = str_replace($home_url, '', $url);
            if (empty($url)) $url = '/';
            elseif ($url[0] !== '/') $url = '/' . $url;
        }
        $formatted[] = [
            'ID' => (int)$item->ID,
            'title' => $item->title ?? $item->post_title,
            'url' => $url,
            'target' => $item->target ?: '_self'
        ];
    }
    set_transient($cache_key, $formatted, HOUR_IN_SECONDS);
    return rest_ensure_response($formatted);
}
// Limpa cache ao atualizar menu
add_action('wp_update_nav_menu', function() {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_menu_%'");
});

// ============================================================================
// 4. NEWSLETTER via MailPoet (sem alterações; seguro)
// ============================================================================
function djz_mailpoet_subscribe_handler($request) {
    $email = sanitize_email($request->get_param('email') ?? '');
    if (!is_email($email)) return new WP_Error('invalid_email', 'Invalid email', ['status' => 400]);
    if (!class_exists('\MailPoet\API\API')) return new WP_Error('mailpoet_inactive', 'MailPoet inactive', ['status' => 500]);
    try {
        $mailpoet_api = \MailPoet\API\API::MP('v1');
        $lists = $mailpoet_api->getLists();
        $list_id = !empty($lists) ? $lists[0]['id'] : 1;
        $mailpoet_api->addSubscriber(['email' => $email, 'status' => 'subscribed'], [$list_id]);
        return rest_ensure_response(['success' => true, 'message' => 'Subscribed!']);
    } catch (Exception $e) {
        if (stripos($e->getMessage(), 'already exists') !== false) return rest_ensure_response(['success' => true, 'message' => 'Already subscribed!']);
        return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
    }
}

// ============================================================================
// 5. WOOCOMMERCE PRODUCTS - CACHE POR IDIOMA
// ============================================================================
function djz_get_products_with_lang_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $cache_key = 'djz_products_' . $lang;
    $cached = get_transient($cache_key);
    if ($cached !== false) return new WP_Rest_Response($cached, 200);
    $args = ['post_type' => 'product', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'date', 'order' => 'DESC'];
    if (function_exists('pll_get_post_language')) $args['lang'] = $lang;
    $query = new WP_Query($args);
    $products = [];
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $p_id = get_the_ID();
            $product = function_exists('wc_get_product') ? wc_get_product($p_id) : null;
            if (!$product) continue;
            $p_lang = (function_exists('pll_get_post_language')) ? pll_get_post_language($p_id) ?: $lang : $lang;
            $translations = (function_exists('pll_get_post_translations')) ? pll_get_post_translations($p_id) : [];
            $images = [];
            $img_ids = $product->get_gallery_image_ids();
            if ($product->get_image_id()) array_unshift($img_ids, $product->get_image_id());
            foreach ($img_ids as $iid) $images[] = ['id' => $iid, 'src' => wp_get_attachment_url($iid), 'alt' => get_post_meta($iid, '_wp_attachment_image_alt', true)];
            if (empty($images)) $images[] = ['id' => 0, 'src' => 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer', 'alt' => $product->get_name()];
            $products[] = [
                'id' => $p_id, 'name' => $product->get_name(), 'slug' => $product->get_slug(),
                'price' => $product->get_price(), 'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(), 'on_sale' => $product->is_on_sale(),
                'stock_status' => $product->get_stock_status(), 'images' => $images,
                'lang' => $p_lang, 'translations' => $translations
            ];
        }
    }
    wp_reset_postdata();
    set_transient($cache_key, $products, 30 * MINUTE_IN_SECONDS);
    return new WP_Rest_Response($products, 200);
}
// Limpa cache ao salvar produto
add_action('save_post_product', function() {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_products_%'");
});

// ============================================================================
// 6. REGISTRA ROTAS REST
// ============================================================================
add_action('rest_api_init', function () {
    $ns = 'djzeneyer/v1';
    register_rest_route($ns, '/menu', ['methods' => 'GET', 'callback' => 'djz_get_multilang_menu_handler', 'permission_callback' => '__return_true']);
    register_rest_route($ns, '/subscribe', ['methods' => 'POST', 'callback' => 'djz_mailpoet_subscribe_handler', 'permission_callback' => '__return_true']);
    register_rest_route($ns, '/products', ['methods' => 'GET', 'callback' => 'djz_get_products_with_lang_handler', 'permission_callback' => '__return_true', 'args' => ['lang' => ['required' => false, 'type' => 'string']]]);
    register_rest_route($ns, '/gamipress/(?P<user_id>\d+)', ['methods' => 'GET', 'callback' => 'djz_get_gamipress_handler', 'permission_callback' => '__return_true', 'args' => ['user_id' => ['required' => true, 'type' => 'integer']]]);
    register_rest_route($ns, '/streak/(?P<user_id>\d+)', [
        'methods' => 'GET', 'callback' => 'djz_streak_handler', 'permission_callback' => '__return_true'
    ]);
    register_rest_route($ns, '/user/update-profile', [
        'methods' => 'POST',
        'permission_callback' => function() { return is_user_logged_in(); },
        'callback' => function($request) {
            $uid = get_current_user_id();
            if (!$uid) return new WP_Error('not_logged_in', 'User not authenticated', ['status' => 401]);
            $params = $request->get_json_params();
            $data = ['ID' => $uid];
            if (isset($params['displayName'])) $data['display_name'] = sanitize_text_field($params['displayName']);
            $res = wp_update_user($data);
            if (is_wp_error($res)) return new WP_Error('update_failed', 'Failed', ['status' => 400]);
            return rest_ensure_response(['success' => true, 'message' => 'Updated!']);
        }
    ]);
    register_rest_route($ns, '/tracks/(?P<user_id>\d+)', [
        'methods' => 'GET', 'callback' => function() { return rest_ensure_response(['count' => 12]); }, 'permission_callback' => '__return_true'
    ]);
    register_rest_route($ns, '/events/(?P<user_id>\d+)', [
        'methods' => 'GET', 'callback' => function() { return rest_ensure_response(['attended' => 3, 'next' => 'Zouk Night SP']); }, 'permission_callback' => '__return_true'
    ]);
});

// ============================================================================
// 7. CORS HEADERS — SÓ NAS REQUESTS REST
// ============================================================================
add_action('rest_api_init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
});

// ============================================================================
// 8. FIX CRÍTICO: Permitir acesso público a imagens destacadas na REST API
// ============================================================================
add_filter('rest_prepare_attachment', function($response, $post, $request) {
    if (!empty($response->data['id'])) {
        $attachment_id = $response->data['id'];
        $response->data['source_url'] = wp_get_attachment_url($attachment_id);
        $response->data['media_details'] = wp_get_attachment_metadata($attachment_id);
    }
    return $response;
}, 10, 3);

add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    global $wp;
    if (strpos($wp->request, 'wp/v2/media') !== false) {
        return true;
    }
    return $result;
});

// ============================================================================
// 9. SEGURANÇA: Otimiza REST API, remove endpoints não-usados
// ============================================================================
add_filter('rest_endpoints', function($endpoints) {
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users']);
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    unset($endpoints['/wp/v2/comments']);
    unset($endpoints['/wp/v2/comments/(?P<id>[\d]+)']);
    return $endpoints;
});
