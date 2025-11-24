<?php
/**
 * ZENEYER HEADLESS EXTENSIONS (API)
 * Funcionalidades de Auth, Loja, Gamificação e Menu.
 */

if (!defined('ABSPATH')) exit;

// ==========================================
// 1. AUTENTICAÇÃO (CRÍTICO PARA LOGIN)
// ==========================================

// Registra as rotas de Auth que o Frontend espera
add_action('rest_api_init', function () {
    // Settings (URL de login, etc)
    register_rest_route('zeneyer-auth/v1', '/settings', array(
        'methods' => 'GET',
        'callback' => 'djz_get_auth_settings',
        'permission_callback' => '__return_true',
    ));
    
    // Validação de Token/Sessão
    register_rest_route('zeneyer-auth/v1', '/auth/validate', array(
        'methods' => 'POST',
        'callback' => 'djz_validate_token',
        'permission_callback' => '__return_true',
    ));
});

function djz_get_auth_settings() {
    return array(
        'login_url' => home_url('/wp-login.php'),
        'register_allowed' => get_option('users_can_register'),
        'site_name' => get_bloginfo('name'),
    );
}

function djz_validate_token($request) {
    // Se o usuário já tem o cookie do WP, ele está validado
    if (is_user_logged_in()) {
        $user = wp_get_current_user();
        return array(
            'code' => 'jwt_auth_valid_token',
            'data' => array(
                'status' => 200,
                'user' => array(
                    'id' => $user->ID,
                    'email' => $user->user_email,
                    'nicename' => $user->user_nicename,
                    'display_name' => $user->display_name,
                    // Adicione roles se necessário para controle de acesso
                    'roles' => $user->roles
                )
            )
        );
    }
    return new WP_Error('jwt_auth_invalid_token', 'Token inválido ou expirado', array('status' => 403));
}


// ==========================================
// 2. GAMIPRESS (Gamificação)
// ==========================================

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
            'success' => false, 'message' => 'GamiPress not active',
            'data' => ['points' => 0, 'rank' => 'Novice', 'achievements' => [], 'allRanks' => [], 'allAchievements' => []]
        ]);
    }
    
    // Pontos
    $points_types = gamipress_get_points_types();
    $user_points = [];
    $total_points = 0;
    foreach ($points_types as $slug => $data) {
        $points = (int) gamipress_get_user_points($user_id, $slug);
        $user_points[] = ['slug' => $slug, 'name' => $data['plural_name'], 'points' => $points];
        $total_points += $points;
    }
    
    // Ranks
    $rank_types = gamipress_get_rank_types();
    $current_rank = 'Novice';
    $rank_id = 0;
    $rank_type_slug = '';
    
    foreach ($rank_types as $slug => $data) {
        $user_rank = gamipress_get_user_rank($user_id, $slug);
        if ($user_rank && is_object($user_rank)) {
            $rank_id = $user_rank->ID;
            $current_rank = $user_rank->post_title;
            $rank_type_slug = $slug;
            break;
        }
    }
    
    $all_ranks = [];
    if (!empty($rank_type_slug)) {
        $ranks_query = new WP_Query(['post_type' => $rank_type_slug, 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order', 'order' => 'ASC']);
        if ($ranks_query->have_posts()) {
            while ($ranks_query->have_posts()) {
                $ranks_query->the_post();
                $r_id = get_the_ID();
                $all_ranks[] = [
                    'id' => $r_id, 'title' => get_the_title(), 'description' => get_the_content(), 'excerpt' => get_the_excerpt(),
                    'image' => get_the_post_thumbnail_url($r_id, 'medium') ?: '', 'current' => ($r_id === $rank_id),
                    'requirements' => djz_format_requirements($r_id)
                ];
            }
            wp_reset_postdata();
        }
    }

    // Conquistas
    $achievement_types = gamipress_get_achievement_types();
    $earned_achievements = [];
    $all_achievements = [];
    
    foreach ($achievement_types as $type_slug => $type_data) {
        $ach_query = new WP_Query(['post_type' => $type_slug, 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'menu_order', 'order' => 'ASC']);
        if ($ach_query->have_posts()) {
            while ($ach_query->have_posts()) {
                $ach_query->the_post();
                $a_id = get_the_ID();
                $earned = gamipress_has_user_earned_achievement($a_id, $user_id);
                $ach_data = [
                    'id' => $a_id, 'type' => $type_slug, 'title' => get_the_title(), 'description' => get_the_content(),
                    'image' => get_the_post_thumbnail_url($a_id, 'medium') ?: '', 'earned' => $earned,
                    'points' => (int) get_post_meta($a_id, '_gamipress_points', true), 'requirements' => djz_format_requirements($a_id)
                ];
                $all_achievements[] = $ach_data;
                if ($earned) $earned_achievements[] = $ach_data;
            }
            wp_reset_postdata();
        }
    }
    
    $level = 1;
    foreach ($all_ranks as $index => $rank) { if ($rank['current']) { $level = $index + 1; break; } }
    
    return rest_ensure_response(['success' => true, 'data' => [
        'points' => $total_points, 'pointsBreakdown' => $user_points, 'level' => $level, 'rank' => $current_rank,
        'rankId' => $rank_id, 'earnedAchievements' => $earned_achievements, 'allRanks' => $all_ranks, 'allAchievements' => $all_achievements
    ]]);
}

// ==========================================
// 3. UTILS (Menu & Newsletter)
// ==========================================

function djz_get_multilang_menu_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    if (function_exists('pll_set_language')) pll_set_language($lang);
    
    $locations = get_nav_menu_locations();
    // IMPORTANTE: Verifique se o slug do menu no seu tema é 'primary' ou 'primary_menu'
    $menu_id = $locations['primary'] ?? $locations['primary_menu'] ?? null;
    
    if (!$menu_id) return rest_ensure_response([]);
    
    $items = wp_get_nav_menu_items($menu_id);
    if (!is_array($items)) return rest_ensure_response([]);
    
    $formatted = [];
    foreach ($items as $item) {
        if (empty($item->ID) || (int)$item->menu_item_parent !== 0) continue;
        $formatted[] = ['ID' => (int)$item->ID, 'title' => $item->title ?? '', 'url' => wp_make_link_relative($item->url ?? '#'), 'target' => $item->target ?: '_self'];
    }
    return rest_ensure_response($formatted);
}

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

// ==========================================
// 4. WOOCOMMERCE (Headless Products)
// ==========================================

function djz_get_products_with_lang_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? '');
    if (empty($lang) && function_exists('pll_default_language')) $lang = pll_default_language();
    if (empty($lang)) $lang = 'en';
    
    $args = ['post_type' => 'product', 'posts_per_page' => -1, 'post_status' => 'publish', 'orderby' => 'date', 'order' => 'DESC'];
    if (function_exists('pll_get_post_language')) $args['lang'] = $lang;
    
    $query = new WP_Query($args);
    $products = [];
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $p_id = get_the_ID();
            $product = wc_get_product($p_id);
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
    return new WP_Rest_Response($products, 200);
}

// ==========================================
// 5. REGISTRO DAS ROTAS PRINCIPAIS
// ==========================================

add_action('rest_api_init', function () {
    $ns = 'djzeneyer/v1';
    
    register_rest_route($ns, '/menu', ['methods' => 'GET', 'callback' => 'djz_get_multilang_menu_handler', 'permission_callback' => '__return_true']);
    register_rest_route($ns, '/subscribe', ['methods' => 'POST', 'callback' => 'djz_mailpoet_subscribe_handler', 'permission_callback' => '__return_true']);
    register_rest_route($ns, '/products', ['methods' => 'GET', 'callback' => 'djz_get_products_with_lang_handler', 'permission_callback' => '__return_true', 'args' => ['lang' => ['required' => false, 'type' => 'string']]]);
    register_rest_route($ns, '/gamipress/(?P<user_id>\d+)', ['methods' => 'GET', 'callback' => 'djz_get_gamipress_handler', 'permission_callback' => '__return_true', 'args' => ['user_id' => ['required' => true, 'type' => 'integer']]]);
    
    // Perfil
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

    // --- ENDPOINTS DE DASHBOARD (MOCK) ---
    register_rest_route($ns, '/tracks/(?P<user_id>\d+)', [
        'methods' => 'GET', 'callback' => function() { return rest_ensure_response(['count' => 12]); }, 'permission_callback' => '__return_true'
    ]);
    register_rest_route($ns, '/streak/(?P<user_id>\d+)', [
        'methods' => 'GET', 'callback' => function() { return rest_ensure_response(['days' => 5, 'fire' => true]); }, 'permission_callback' => '__return_true'
    ]);
    register_rest_route($ns, '/events/(?P<user_id>\d+)', [
        'methods' => 'GET', 'callback' => function() { return rest_ensure_response(['attended' => 3, 'next' => 'Zouk Night SP']); }, 'permission_callback' => '__return_true'
    ]);
});

// ==========================================
// 6. CORREÇÃO DE CORS (GLOBAL)
// ==========================================
add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
});