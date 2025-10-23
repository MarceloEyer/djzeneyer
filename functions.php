<?php
/**
 * DJ Zen Eyer Theme Functions - Versão Dinâmica Final + Streak
 * v12.0.0 - Totalmente Dinâmico do GamiPress + Sistema de Streak
 */

if (!defined('ABSPATH')) {
    exit;
}

/* =========================
 * Configuração Central
 * ========================= */

if (!defined('DJZ_VERSION')) {
    $asset_file = get_theme_file_path('/dist/assets/index.js');
    $version = file_exists($asset_file) ? filemtime($asset_file) : '12.0.0';
    define('DJZ_VERSION', $version);
}

function djz_allowed_origins(): array {
    return [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'https://app.djzeneyer.com',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ];
}

/* =========================
 * Roteamento SPA
 * ========================= */

add_filter('template_include', function ($template) {
    if ( is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || ! is_main_query() || ! is_404() ) {
        return $template;
    }
    status_header(200);
    return get_theme_file_path('/index.php');
});

/* =========================
 * Enqueue Scripts
 * ========================= */

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri(), [], DJZ_VERSION);
    
    $js_src = get_template_directory_uri() . '/dist/assets/index.js';
    $css_src = get_template_directory_uri() . '/dist/assets/index.css';

    if (file_exists(get_theme_file_path('/dist/assets/index.css'))) {
        wp_enqueue_style('djzeneyer-react-styles', $css_src, [], DJZ_VERSION);
    }

    if (file_exists(get_theme_file_path('/dist/assets/index.js'))) {
        wp_register_script('djzeneyer-react', $js_src, [], DJZ_VERSION, true);
        wp_enqueue_script('djzeneyer-react');
        wp_localize_script('djzeneyer-react', 'wpData', [
            'siteUrl' => esc_url(home_url('/')),
            'restUrl' => esc_url_raw(rest_url()),
            'nonce'   => wp_create_nonce('wp_rest'),
        ]);
    }
});

add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        return sprintf('<script type="module" src="%s" id="%s" crossorigin="use-credentials" defer></script>', esc_url($src), esc_attr($handle . '-js'));
    }
    return $tag;
}, 10, 3);

/* =========================
 * Theme Support
 * ========================= */

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    register_nav_menus(['primary_menu' => __('Menu Principal', 'djzeneyer')]);
});

add_action('after_switch_theme', function () {
    if (!get_role('dj')) {
        add_role('dj', 'DJ', ['read' => true]);
    }
});

/* =========================
 * Segurança & CORS
 * ========================= */

add_action('send_headers', function() {
    if ( is_admin() || headers_sent() ) return;
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
});

add_action('rest_api_init', function() {
    add_filter('rest_pre_serve_request', function($served) {
        $allowed_origins = djz_allowed_origins();
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? trim($_SERVER['HTTP_ORIGIN']) : '';
        if (in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin', false);
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey, X-Requested-With');
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
        return $served;
    }, 15);
});

/* =========================
 * Plugin Integrations
 * ========================= */

add_filter('simple_jwt_login_jwt_payload_auth', function($payload, $request) {
    if (!empty($request['email'])) {
        $user = get_user_by('email', sanitize_email($request['email']));
        if ($user) {
            $payload['display_name'] = $user->display_name;
            $payload['roles'] = $user->roles;
        }
    }
    return $payload;
}, 10, 2);

/* =========================
 * 🔥 SISTEMA DE STREAK (Estilo Duolingo)
 * ========================= */

/**
 * Atualizar streak do usuário
 * Chamado automaticamente quando usuário faz login ou ganha pontos
 */
function djz_update_user_streak($user_id) {
    $today = date('Y-m-d');
    $last_login = get_user_meta($user_id, '_djz_last_login_date', true);
    $current_streak = (int) get_user_meta($user_id, '_djz_streak_days', true);
    $longest_streak = (int) get_user_meta($user_id, '_djz_longest_streak', true);
    
    // Primeira visita
    if (empty($last_login)) {
        update_user_meta($user_id, '_djz_last_login_date', $today);
        update_user_meta($user_id, '_djz_streak_days', 1);
        update_user_meta($user_id, '_djz_longest_streak', 1);
        update_user_meta($user_id, '_djz_streak_start_date', $today);
        return 1;
    }
    
    // Já visitou hoje
    if ($last_login === $today) {
        return $current_streak;
    }
    
    // Calcular diferença em dias
    $last_date = strtotime($last_login);
    $today_date = strtotime($today);
    $diff_days = floor(($today_date - $last_date) / (60 * 60 * 24));
    
    if ($diff_days === 1) {
        // ✅ Visita consecutiva - incrementar streak
        $current_streak++;
        update_user_meta($user_id, '_djz_streak_days', $current_streak);
        
        // Atualizar longest streak se necessário
        if ($current_streak > $longest_streak) {
            update_user_meta($user_id, '_djz_longest_streak', $current_streak);
        }
        
        // 🎉 BÔNUS A CADA 7 DIAS (Duolingo style!)
        if ($current_streak % 7 === 0 && function_exists('gamipress_award_points_to_user')) {
            $bonus_points = 50; // 50 pontos bônus
            gamipress_award_points_to_user($user_id, $bonus_points, 'points');
            
            // Registrar achievement se existir
            if (function_exists('gamipress_award_achievement_to_user')) {
                // Você pode criar achievements específicos no GamiPress:
                // - "7 Day Streak"
                // - "14 Day Streak"
                // - "30 Day Streak"
                // etc.
            }
        }
        
    } else {
        // ❌ Streak quebrou - resetar
        $current_streak = 1;
        update_user_meta($user_id, '_djz_streak_days', 1);
        update_user_meta($user_id, '_djz_streak_start_date', $today);
    }
    
    // Atualizar última visita
    update_user_meta($user_id, '_djz_last_login_date', $today);
    
    return $current_streak;
}

// Hook: Atualizar streak no login
add_action('wp_login', function($user_login, $user) {
    djz_update_user_streak($user->ID);
}, 10, 2);

// Hook: Atualizar streak quando ganhar pontos (engajamento)
add_action('gamipress_award_points', function($user_id, $points, $points_type) {
    djz_update_user_streak($user_id);
}, 10, 3);

/* =========================
 * HELPER: Buscar Requirements
 * ========================= */

function djz_format_requirements($post_id) {
    if (!function_exists('gamipress_get_post_requirements')) {
        return [];
    }
    
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

/* =========================
 * ENDPOINT DINÂMICO: GamiPress
 * ========================= */

function djz_get_gamipress_handler($request) {
    $user_id = intval($request->get_param('user_id'));
    
    if ($user_id <= 0) {
        return new WP_Error('invalid_user_id', 'Invalid user ID', ['status' => 400]);
    }
    
    // ✅ VERIFICAR SE GAMIPRESS ESTÁ ATIVO
    if (!function_exists('gamipress_get_user_points')) {
        return rest_ensure_response([
            'success' => false,
            'message' => 'GamiPress not active',
            'data' => [
                'points' => 0,
                'rank' => 'Novice',
                'achievements' => [],
                'allRanks' => [],
                'allAchievements' => [],
                'streak' => 0,
            ],
        ]);
    }
    
    // 🔥 ATUALIZAR STREAK AUTOMATICAMENTE
    djz_update_user_streak($user_id);
    
    // ✅ BUSCAR STREAK DATA
    $streak_days = (int) get_user_meta($user_id, '_djz_streak_days', true);
    $longest_streak = (int) get_user_meta($user_id, '_djz_longest_streak', true);
    $streak_start = get_user_meta($user_id, '_djz_streak_start_date', true);
    $last_login = get_user_meta($user_id, '_djz_last_login_date', true);
    
    // ✅ 1. BUSCAR TODOS OS TIPOS DE PONTOS
    $points_types = gamipress_get_points_types();
    $user_points = [];
    $total_points = 0;
    
    foreach ($points_types as $slug => $data) {
        $points = (int) gamipress_get_user_points($user_id, $slug);
        $user_points[] = [
            'slug' => $slug,
            'name' => $data['plural_name'],
            'singular' => $data['singular_name'],
            'points' => $points,
        ];
        $total_points += $points;
    }
    
    // ✅ 2. BUSCAR RANK ATUAL DO USUÁRIO
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
    
    // ✅ 3. BUSCAR TODOS OS RANKS DISPONÍVEIS (progressão)
    $all_ranks = [];
    
    if (!empty($rank_type_slug)) {
        $ranks_query = new WP_Query([
            'post_type' => $rank_type_slug,
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);
        
        if ($ranks_query->have_posts()) {
            while ($ranks_query->have_posts()) {
                $ranks_query->the_post();
                $r_id = get_the_ID();
                
                $all_ranks[] = [
                    'id' => $r_id,
                    'title' => get_the_title(),
                    'description' => get_the_content(),
                    'excerpt' => get_the_excerpt(),
                    'image' => get_the_post_thumbnail_url($r_id, 'medium') ?: '',
                    'current' => ($r_id === $rank_id),
                    'requirements' => djz_format_requirements($r_id),
                ];
            }
            wp_reset_postdata();
        }
    }
    
    // ✅ 4. BUSCAR ACHIEVEMENTS EARNED
    $achievement_types = gamipress_get_achievement_types();
    $earned_achievements = [];
    
    foreach ($achievement_types as $type_slug => $type_data) {
        $user_achievements = gamipress_get_user_achievements([
            'user_id' => $user_id,
            'achievement_type' => $type_slug,
        ]);
        
        if (is_array($user_achievements)) {
            foreach ($user_achievements as $ach) {
                if (isset($ach->ID)) {
                    $earned_achievements[] = [
                        'id' => $ach->ID,
                        'type' => $type_slug,
                        'title' => $ach->post_title ?? '',
                        'description' => $ach->post_content ?? '',
                        'excerpt' => $ach->post_excerpt ?? '',
                        'image' => get_the_post_thumbnail_url($ach->ID, 'medium') ?: '',
                        'earned' => true,
                        'earnedDate' => get_post_time('Y-m-d H:i:s', false, $ach->ID),
                        'points' => (int) get_post_meta($ach->ID, '_gamipress_points', true),
                    ];
                }
            }
        }
    }
    
    // ✅ 5. BUSCAR TODOS OS ACHIEVEMENTS DISPONÍVEIS
    $all_achievements = [];
    
    foreach ($achievement_types as $type_slug => $type_data) {
        $achievements_query = new WP_Query([
            'post_type' => $type_slug,
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);
        
        if ($achievements_query->have_posts()) {
            while ($achievements_query->have_posts()) {
                $achievements_query->the_post();
                $a_id = get_the_ID();
                
                // Verificar se usuário já ganhou
                $earned = gamipress_has_user_earned_achievement($a_id, $user_id);
                
                $all_achievements[] = [
                    'id' => $a_id,
                    'type' => $type_slug,
                    'typeName' => $type_data['singular_name'],
                    'title' => get_the_title(),
                    'description' => get_the_content(),
                    'excerpt' => get_the_excerpt(),
                    'image' => get_the_post_thumbnail_url($a_id, 'medium') ?: '',
                    'earned' => $earned,
                    'earnedDate' => $earned ? get_post_time('Y-m-d H:i:s', false, $a_id) : null,
                    'points' => (int) get_post_meta($a_id, '_gamipress_points', true),
                    'requirements' => djz_format_requirements($a_id),
                ];
            }
            wp_reset_postdata();
        }
    }
    
    // ✅ 6. CALCULAR LEVEL (baseado na posição do rank)
    $level = 1;
    foreach ($all_ranks as $index => $rank) {
        if ($rank['current']) {
            $level = $index + 1;
            break;
        }
    }
    
    return rest_ensure_response([
        'success' => true,
        'data' => [
            'points' => $total_points,
            'pointsBreakdown' => $user_points,
            'level' => $level,
            'rank' => $current_rank,
            'rankId' => $rank_id,
            'earnedAchievements' => $earned_achievements,
            'allRanks' => $all_ranks,
            'allAchievements' => $all_achievements,
            'streak' => [
                'current' => $streak_days,
                'longest' => $longest_streak,
                'startDate' => $streak_start ?: null,
                'lastLogin' => $last_login ?: null,
                'nextMilestone' => djz_get_next_streak_milestone($streak_days),
                'daysToMilestone' => djz_get_next_streak_milestone($streak_days) - $streak_days,
            ],
            'stats' => [
                'totalAchievements' => count($all_achievements),
                'earnedAchievements' => count($earned_achievements),
                'totalRanks' => count($all_ranks),
                'currentRankIndex' => $level - 1,
            ],
        ],
    ]);
}

/**
 * Calcular próximo marco de streak (7, 14, 30, 60, 90, 180, 365 dias)
 */
function djz_get_next_streak_milestone($current_streak) {
    $milestones = [7, 14, 30, 60, 90, 180, 365, 500, 1000];
    
    foreach ($milestones as $milestone) {
        if ($current_streak < $milestone) {
            return $milestone;
        }
    }
    
    // Se passou de todos, próximo é incremento de 100
    return ceil($current_streak / 100) * 100 + 100;
}

/* =========================
 * 🎨 ENDPOINTS DE PROFILE
 * ========================= */

function djz_update_profile_handler($request) {
    $user_id = get_current_user_id();
    
    if (0 === $user_id) {
        return new WP_Error('not_logged_in', 'User not authenticated', ['status' => 401]);
    }
    
    $params = $request->get_json_params();
    
    // Validação
    $display_name = isset($params['display_name']) ? sanitize_text_field($params['display_name']) : '';
    $email = isset($params['email']) ? sanitize_email($params['email']) : '';
    $description = isset($params['description']) ? sanitize_textarea_field($params['description']) : '';
    
    if (empty($display_name)) {
        return new WP_Error('invalid_name', 'Display name is required', ['status' => 400]);
    }
    
    if (!empty($email) && !is_email($email)) {
        return new WP_Error('invalid_email', 'Valid email is required', ['status' => 400]);
    }
    
    // Verificar se email já existe
    if (!empty($email)) {
        $email_exists = email_exists($email);
        if ($email_exists && $email_exists != $user_id) {
            return new WP_Error('email_taken', 'This email is already in use', ['status' => 400]);
        }
    }
    
    // Atualizar usuário
    $user_data = ['ID' => $user_id];
    
    if (!empty($display_name)) {
        $user_data['display_name'] = $display_name;
    }
    
    if (!empty($email)) {
        $user_data['user_email'] = $email;
    }
    
    if (!empty($description)) {
        $user_data['description'] = $description;
    }
    
    $result = wp_update_user($user_data);
    
    if (is_wp_error($result)) {
        return new WP_Error('profile_update_failed', $result->get_error_message(), ['status' => 400]);
    }
    
    $user = get_userdata($user_id);
    
    return rest_ensure_response([
        'success' => true,
        'message' => 'Profile updated successfully!',
        'display_name' => $user->display_name,
        'email' => $user->user_email,
        'description' => get_user_meta($user_id, 'description', true),
    ]);
}

function djz_upload_avatar_handler($request) {
    $user_id = get_current_user_id();
    
    if (0 === $user_id) {
        return new WP_Error('not_logged_in', 'User not authenticated', ['status' => 401]);
    }
    
    if (!function_exists('wp_handle_upload')) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
    }
    
    $files = $request->get_file_params();
    
    if (empty($files['avatar'])) {
        return new WP_Error('no_file', 'No file uploaded', ['status' => 400]);
    }
    
    $file = $files['avatar'];
    
    // Validar tipo
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowed_types)) {
        return new WP_Error('invalid_type', 'Invalid file type. Only images allowed.', ['status' => 400]);
    }
    
    // Validar tamanho (5MB max)
    if ($file['size'] > 5 * 1024 * 1024) {
        return new WP_Error('file_too_large', 'File size must be less than 5MB', ['status' => 400]);
    }
    
    // Upload
    $upload = wp_handle_upload($file, ['test_form' => false]);
    
    if (isset($upload['error'])) {
        return new WP_Error('upload_failed', $upload['error'], ['status' => 500]);
    }
    
    // Salvar avatar URL no user meta
    update_user_meta($user_id, 'avatar_url', $upload['url']);
    
    return rest_ensure_response([
        'success' => true,
        'message' => 'Avatar uploaded successfully!',
        'avatar_url' => $upload['url'],
    ]);
}

function djz_get_user_orders_handler() {
    if (!function_exists('wc_get_orders')) {
        return rest_ensure_response([]);
    }
    
    $user_id = get_current_user_id();
    
    if (0 === $user_id) {
        return new WP_Error('not_logged_in', 'User not authenticated', ['status' => 401]);
    }
    
    $orders = wc_get_orders([
        'customer' => $user_id,
        'limit' => 10,
        'status' => ['completed', 'processing', 'pending']
    ]);
    
    return rest_ensure_response(array_map(function($order) {
        return [
            'id' => $order->get_id(),
            'status' => $order->get_status(),
            'date_created' => $order->get_date_created()->date('c'),
            'total' => $order->get_total(),
            'line_items' => array_map(function($item) {
                return [
                    'name' => $item->get_name(),
                    'quantity' => $item->get_quantity(),
                    'total' => $item->get_total()
                ];
            }, $order->get_items())
        ];
    }, $orders));
}

/* =========================
 * Endpoint Handlers (Originais)
 * ========================= */

function djz_get_multilang_menu_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    if (function_exists('pll_set_language')) {
        pll_set_language($lang);
    }
    $locations = get_nav_menu_locations();
    $menu_id = $locations['primary_menu'] ?? null;
    if (!$menu_id) return rest_ensure_response([]);
    $items = wp_get_nav_menu_items($menu_id);
    if (!is_array($items)) return rest_ensure_response([]);
    $formatted = [];
    foreach ($items as $item) {
        if (empty($item->ID) || (int)$item->menu_item_parent !== 0) continue;
        $formatted[] = [ 
            'ID' => (int)$item->ID, 
            'title' => $item->title ?? '', 
            'url' => wp_make_link_relative($item->url ?? '#'), 
            'target' => !empty($item->target) ? $item->target : '_self' 
        ];
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
        if (stripos($e->getMessage(), 'already exists') !== false) {
            return rest_ensure_response(['success' => true, 'message' => 'Already subscribed!']);
        }
        return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
    }
}

function djz_google_oauth_handler($request) {
    $token = sanitize_text_field($request->get_param('token') ?? '');
    if (empty($token)) return new WP_Error('no_token', 'Token is required', ['status' => 400]);
    $verify_url = add_query_arg('id_token', rawurlencode($token), 'https://oauth2.googleapis.com/tokeninfo');
    $response = wp_remote_get($verify_url, ['timeout' => 10]);
    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        return new WP_Error('invalid_token', 'Failed to verify Google token', ['status' => 401]);
    }
    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (empty($body) || empty($body['email'])) {
        return new WP_Error('invalid_token', 'Invalid token body from Google', ['status' => 401]);
    }
    $email = sanitize_email($body['email']);
    $name = sanitize_text_field($body['name'] ?? '');
    $user = get_user_by('email', $email);
    if (!$user) {
        $user_id = wp_create_user($email, wp_generate_password(), $email);
        if (is_wp_error($user_id)) return $user_id;
        wp_update_user(['ID' => $user_id, 'display_name' => $name, 'first_name' => current(explode(' ', $name))]);
        $user = get_user_by('id', $user_id);
    }
    if (class_exists('\SimpleJwtLogin\Classes\SimpleJwtLoginJWT')) {
        $jwt_instance = new \SimpleJwtLogin\Classes\SimpleJwtLoginJWT();
        $jwt = $jwt_instance->getJwt($user);
        return rest_ensure_response([
            'jwt' => $jwt, 
            'user' => ['id' => $user->ID, 'email' => $user->user_email, 'name' => $user->display_name]
        ]);
    }
    return new WP_Error('jwt_plugin_missing', 'Simple JWT Login plugin not available', ['status' => 500]);
}

function djz_get_products_with_lang_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? '');
    
    if (empty($lang) && function_exists('pll_default_language')) {
        $lang = pll_default_language();
    }
    
    if (empty($lang)) {
        $lang = 'en';
    }
    
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    );
    
    if (function_exists('pll_get_post_language')) {
        $args['lang'] = $lang;
    }
    
    $query = new WP_Query($args);
    $products = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product_id = get_the_ID();
            $product = wc_get_product($product_id);
            
            if (!$product) continue;
            
            $product_lang = $lang;
            if (function_exists('pll_get_post_language')) {
                $detected_lang = pll_get_post_language($product_id);
                if ($detected_lang) {
                    $product_lang = $detected_lang;
                }
            }
            
            $translations = array();
            if (function_exists('pll_get_post_translations')) {
                $translations = pll_get_post_translations($product_id);
            }
            
            $images = array();
            $image_ids = $product->get_gallery_image_ids();
            
            if ($product->get_image_id()) {
                array_unshift($image_ids, $product->get_image_id());
            }
            
            foreach ($image_ids as $image_id) {
                $images[] = array(
                    'id' => $image_id,
                    'src' => wp_get_attachment_url($image_id),
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                );
            }
            
            if (empty($images)) {
                $images[] = array(
                    'id' => 0,
                    'src' => 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer',
                    'alt' => $product->get_name(),
                );
            }
            
            $products[] = array(
                'id' => $product_id,
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'stock_status' => $product->get_stock_status(),
                'images' => $images,
                'lang' => $product_lang,
                'translations' => $translations,
            );
        }
    }
    
    wp_reset_postdata();
    
    return new WP_Rest_Response($products, 200);
}

/* =========================
 * Registro de Endpoints
 * ========================= */

add_action('rest_api_init', function () {
    $namespace = 'djzeneyer/v1';

    // Menu
    register_rest_route($namespace, '/menu', [
        'methods' => 'GET',
        'callback' => 'djz_get_multilang_menu_handler',
        'permission_callback' => '__return_true'
    ]);

    // Newsletter
    register_rest_route($namespace, '/subscribe', [
        'methods' => 'POST',
        'callback' => 'djz_mailpoet_subscribe_handler',
        'permission_callback' => '__return_true'
    ]);

    // Products
    register_rest_route($namespace, '/products', [
        'methods' => 'GET',
        'callback' => 'djz_get_products_with_lang_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'lang' => [
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);
    
    // ✅ GAMIPRESS DINÂMICO + STREAK
    register_rest_route($namespace, '/gamipress/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_get_gamipress_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'user_id' => [
                'required' => true,
                'type' => 'integer',
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0;
                },
            ],
        ],
    ]);

    // ✅ PROFILE ENDPOINTS
    register_rest_route($namespace, '/update-profile', [
        'methods' => 'POST',
        'callback' => 'djz_update_profile_handler',
        'permission_callback' => 'is_user_logged_in'
    ]);

    register_rest_route($namespace, '/upload-avatar', [
        'methods' => 'POST',
        'callback' => 'djz_upload_avatar_handler',
        'permission_callback' => 'is_user_logged_in'
    ]);

    register_rest_route($namespace, '/my-orders', [
        'methods' => 'GET',
        'callback' => 'djz_get_user_orders_handler',
        'permission_callback' => 'is_user_logged_in'
    ]);

    // Google OAuth
    register_rest_route('simple-jwt-login/v1', '/auth/google', [
        'methods' => 'POST',
        'callback' => 'djz_google_oauth_handler',
        'permission_callback' => '__return_true'
    ]);
});

/* =========================
 * SEO Fixes
 * ========================= */

add_action('template_redirect', function() {
    if (is_404()) {
        status_header(404);
        nocache_headers();
    }
}, 999);

add_action('wp_head', function() {
    remove_action('wp_head', 'rank_math_hreflang', 10);
    
    $base_url = trailingslashit(home_url());
    
    if (is_front_page() || is_home()) {
        echo '<link rel="alternate" hreflang="en" href="' . esc_url($base_url) . '" />' . "\n";
        echo '<link rel="alternate" hreflang="pt-BR" href="' . esc_url($base_url . 'pt/') . '" />' . "\n";
        echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($base_url) . '" />' . "\n";
    }
    
    if (is_page() && get_query_var('pagename') === 'pt') {
        echo '<link rel="alternate" hreflang="en" href="' . esc_url($base_url) . '" />' . "\n";
        echo '<link rel="alternate" hreflang="pt-BR" href="' . esc_url($base_url . 'pt/') . '" />' . "\n";
        echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($base_url) . '" />' . "\n";
    }
}, 1);

add_filter('wp_sitemaps_enabled', '__return_false');

?>
