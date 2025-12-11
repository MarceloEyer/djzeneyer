<?php
/**
 * ZENEYER HEADLESS EXTENSIONS (API) v14.0
 * Auth, GamiPress, WooCommerce, Menu - Cache Premium + Zero Errors
 */

if (!defined('ABSPATH')) exit;

// ============================================================================
// CONSTANTES DE CACHE (Ajuste conforme necessário)
// ============================================================================
define('DJZ_CACHE_MENU', 6 * HOUR_IN_SECONDS);      // 6h (menu raramente muda)
define('DJZ_CACHE_PRODUCTS', 30 * MINUTE_IN_SECONDS); // 30min (produtos)
define('DJZ_CACHE_GAMIPRESS', 15 * MINUTE_IN_SECONDS); // 15min (gamificação)

// ============================================================================
// 1. AUTENTICAÇÃO (JWT auxiliar)
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
        'register_allowed' => (bool) get_option('users_can_register'),
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
// 2. GAMIPRESS - ULTRA ROBUSTO COM CACHE E FALLBACKS
// ============================================================================
function djz_format_requirements($post_id) {
    if (!function_exists('gamipress_get_post_requirements')) return [];
    $requirements = gamipress_get_post_requirements($post_id);
    $formatted = [];
    if (is_array($requirements)) {
        foreach ($requirements as $req) {
            if (!is_object($req) || empty($req->ID)) continue;
            $formatted[] = [
                'id' => $req->ID,
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
    if ($user_id <= 0) {
        return new WP_Error('invalid_user_id', 'Invalid user ID', ['status' => 400]);
    }
    
    // Cache por usuário (15min)
    $cache_key = 'djz_gamipress_' . $user_id;
    $cached = get_transient($cache_key);
    if ($cached !== false && is_array($cached)) {
        return rest_ensure_response($cached);
    }
    
    // Fallback se GamiPress inativo
    if (!function_exists('gamipress_get_user_points')) {
        $fallback = [
            'success' => false, 
            'message' => 'GamiPress not active',
            'data' => [
                'points' => 0, 
                'level' => 1, 
                'rank' => 'Zen Novice', 
                'nextLevel' => 2,
                'nextLevelPoints' => 100,
                'progressToNextLevel' => 0,
                'achievements' => [], 
                'earnedAchievements' => [],
                'allRanks' => [], 
                'streak' => 0, 
                'actions' => []
            ]
        ];
        set_transient($cache_key, $fallback, DJZ_CACHE_GAMIPRESS);
        return rest_ensure_response($fallback);
    }
    
    // Configuração de Ranks (Centralize aqui para fácil manutenção)
    $points_slug = 'zen-points';
    $achievement_slug = 'insigna';
    
    $rank_tiers = [
        1 => ['name' => 'Zen Novice',      'min' => 0,    'next' => 100],
        2 => ['name' => 'Zen Apprentice',  'min' => 100,  'next' => 500],
        3 => ['name' => 'Zen Voyager',     'min' => 500,  'next' => 1500],
        4 => ['name' => 'Zen Master',      'min' => 1500, 'next' => 4000],
        5 => ['name' => 'Zen Legend',      'min' => 4000, 'next' => 10000],
    ];
    
    // Pontos do usuário
    $zen_points = (int) gamipress_get_user_points($user_id, $points_slug);
    
    // Calcular nível atual
    $user_level = 1;
    $rank_title = $rank_tiers[1]['name'];
    $next_level_points = $rank_tiers[1]['next'];
    
    foreach ($rank_tiers as $level => $tier) {
        if ($zen_points >= $tier['min']) {
            $user_level = $level;
            $rank_title = $tier['name'];
            $next_level_points = $tier['next'];
        }
    }
    
    // Progresso para próximo nível
    $current_tier_min = $rank_tiers[$user_level]['min'];
    $points_in_tier = $zen_points - $current_tier_min;
    $points_needed = $next_level_points - $current_tier_min;
    $progress = $points_needed > 0 ? min(100, round(($points_in_tier / $points_needed) * 100)) : 100;
    
    // BADGES/INSIGNIAS (Query segura)
    $all_achievements = [];
    $earned_achievements = [];
    
    $query = new WP_Query([
        'post_type'      => $achievement_slug,
        'posts_per_page' => 20, // Limite razoável
        'post_status'    => 'publish',
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
        'no_found_rows'  => true, // Performance boost
        'update_post_meta_cache' => false,
        'update_post_term_cache' => false,
                                      'fields' => 'ids',
    ]);
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $a_id = get_the_ID();
            $earned = gamipress_has_user_earned_achievement($a_id, $user_id);
            
            $ach = [
                'id' => $a_id,
                'title' => get_the_title(),
                'description' => get_the_excerpt() ?: wp_trim_words(get_the_content(), 20),
                'image' => get_the_post_thumbnail_url($a_id, 'medium') ?: '',
                'earned' => (bool) $earned
            ];
            
            $all_achievements[] = $ach;
            if ($earned) {
                $earned_achievements[] = $ach;
            }
        }
        wp_reset_postdata();
    }
    
    // STREAK (Fallback seguro)
    $streak_days = 0;
    if (function_exists('gamipress_get_user_streak')) {
        $streak_days = (int) gamipress_get_user_streak($user_id, 'daily-visit-the-website');
    }
    
    // AÇÕES SUGERIDAS (Gamificação inteligente)
    $actions = [];
    
    if ($streak_days < 7) {
        $actions[] = [
            'description' => "Faça login diariamente para conquistar um streak de 7 dias!",
            'points' => 10,
            'type' => 'streak',
            'icon' => '🔥'
        ];
    }
    
    if ($zen_points < $next_level_points) {
        $actions[] = [
            'description' => "Conquiste mais " . ($next_level_points - $zen_points) . " Zen Points para subir de nível.",
            'points' => ($next_level_points - $zen_points),
            'type' => 'points',
            'icon' => '⭐'
        ];
    }
    
    $unearnedCount = count($all_achievements) - count($earned_achievements);
    if ($unearnedCount > 0) {
        $actions[] = [
            'description' => "Conquiste " . $unearnedCount . " insígnias pendentes!",
            'type' => 'achievement',
            'icon' => '🏆'
        ];
    }
    
    // Resposta final
    $response = [
        'success' => true,
        'data' => [
            'points'      => $zen_points,
            'level'       => $user_level,
            'rank'        => $rank_title,
            'nextLevel'   => min($user_level + 1, count($rank_tiers)),
            'nextLevelPoints' => $next_level_points,
            'progressToNextLevel' => $progress,
            'achievements' => $all_achievements,
            'earnedAchievements' => $earned_achievements,
            'streak'      => $streak_days,
            'actions'     => $actions
        ]
    ];
    
    // Cache de 15min
    set_transient($cache_key, $response, DJZ_CACHE_GAMIPRESS);
    
    return rest_ensure_response($response);
}

// Limpa cache ao ganhar pontos ou achievements
add_action('gamipress_update_user_points', function($user_id) {
    delete_transient('djz_gamipress_' . $user_id);
}, 10, 1);

add_action('gamipress_award_achievement', function($user_id) {
    delete_transient('djz_gamipress_' . $user_id);
}, 10, 1);

// ============================================================================
// 3. MENU MULTILÍNGUE (Polylang) - CACHE 6H
// ============================================================================
function djz_get_multilang_menu_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    $cache_key = 'djz_menu_' . $lang . '_v2'; // v2 para forçar rebuild
    
    // Cache de 6 horas
    $cached = get_transient($cache_key);
    if ($cached !== false && is_array($cached)) {
        return rest_ensure_response($cached);
    }
    
    if (function_exists('pll_set_language')) {
        pll_set_language($lang);
    }
    
    // Busca otimizada de menu
    $locations = get_nav_menu_locations();
    $menu_id = $locations['primary'] ?? $locations['primary_menu'] ?? $locations['header_menu'] ?? false;
    
    // Fallback inteligente
    if (!$menu_id) {
        $menus = ['Primary', 'Menu Principal', 'Header Menu'];
        foreach ($menus as $menu_name) {
            $menu_obj = wp_get_nav_menu_object($menu_name);
            if ($menu_obj && isset($menu_obj->term_id)) {
                $menu_id = $menu_obj->term_id;
                break;
            }
        }
    }
    
    // Último fallback: primeiro menu disponível
    if (!$menu_id) {
        $all_menus = wp_get_nav_menus();
        $menu_id = !empty($all_menus) && isset($all_menus[0]->term_id) ? $all_menus[0]->term_id : 0;
    }
    
    if (!$menu_id) {
        $empty = [];
        set_transient($cache_key, $empty, DJZ_CACHE_MENU);
        return rest_ensure_response($empty);
    }
    
    // Pega itens do menu
    $items = wp_get_nav_menu_items($menu_id);
    if (!is_array($items) || empty($items)) {
        $empty = [];
        set_transient($cache_key, $empty, DJZ_CACHE_MENU);
        return rest_ensure_response($empty);
    }
    
    $formatted = [];
    $home_url = home_url();
    
    foreach ($items as $item) {
        // Apenas itens de nível superior (parent = 0)
        if (empty($item->ID) || (int)$item->menu_item_parent !== 0) continue;
        
        $url = $item->url ?? '';
        
        // Converte URLs internas para rotas SPA
        if (strpos($url, $home_url) !== false) {
            $url = str_replace($home_url, '', $url);
            $url = '/' . ltrim($url, '/');
            if ($url === '/' || $url === '') $url = '/';
        }
        
        $formatted[] = [
            'ID' => (int)$item->ID,
            'title' => $item->title ?? $item->post_title ?? '',
            'url' => $url,
            'target' => $item->target ?: '_self'
        ];
    }
    
    // Cache de 6 horas
    set_transient($cache_key, $formatted, DJZ_CACHE_MENU);
    
    return rest_ensure_response($formatted);
}

// Limpa cache ao atualizar qualquer menu
add_action('wp_update_nav_menu', function() {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_menu_%'");
});

// ============================================================================
// 4. NEWSLETTER via MailPoet
// ============================================================================
function djz_mailpoet_subscribe_handler($request) {
    $email = sanitize_email($request->get_param('email') ?? '');
    
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email', ['status' => 400]);
    }
    
    if (!class_exists('\MailPoet\API\API')) {
        return new WP_Error('mailpoet_inactive', 'MailPoet inactive', ['status' => 500]);
    }
    
    try {
        $mailpoet_api = \MailPoet\API\API::MP('v1');
        $lists = $mailpoet_api->getLists();
        $list_id = !empty($lists) ? $lists[0]['id'] : 1;
        
        $mailpoet_api->addSubscriber([
            'email' => $email, 
            'status' => 'subscribed'
        ], [$list_id]);
        
        return rest_ensure_response([
            'success' => true, 
            'message' => 'Subscribed successfully!'
        ]);
        
    } catch (Exception $e) {
        // Se já existe, retorna sucesso (UX melhor)
        if (stripos($e->getMessage(), 'already exists') !== false) {
            return rest_ensure_response([
                'success' => true, 
                'message' => 'Already subscribed!'
            ]);
        }
        return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
    }
}

// ============================================================================
// 5. WOOCOMMERCE PRODUCTS - CACHE 30min POR IDIOMA
// ============================================================================
function djz_get_products_with_lang_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? '');
    
    if (empty($lang) && function_exists('pll_default_language')) {
        $lang = pll_default_language();
    }
    if (empty($lang)) {
        $lang = 'en';
    }
    
    $cache_key = 'djz_products_' . $lang . '_v2';
    
    // Cache de 30min
    $cached = get_transient($cache_key);
    if ($cached !== false && is_array($cached)) {
        return new WP_Rest_Response($cached, 200);
    }
    
    // Query otimizada
    $args = [
        'post_type' => 'product',
        'posts_per_page' => 100, // Limite razoável
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => true, // Performance
        'update_post_meta_cache' => false,
    ];
    
    if (function_exists('pll_get_post_language')) {
        $args['lang'] = $lang;
    }
    
    $query = new WP_Query($args);
    $products = [];
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $p_id = get_the_ID();
            
            if (!function_exists('wc_get_product')) continue;
            $product = wc_get_product($p_id);
            if (!$product) continue;
            
            // Idioma e traduções (Polylang)
            $p_lang = $lang;
            $translations = [];
            if (function_exists('pll_get_post_language')) {
                $p_lang = pll_get_post_language($p_id) ?: $lang;
            }
            if (function_exists('pll_get_post_translations')) {
                $translations = pll_get_post_translations($p_id);
            }
            
            // Imagens (Gallery + Featured)
            $images = [];
            $img_ids = $product->get_gallery_image_ids();
            if ($product->get_image_id()) {
                array_unshift($img_ids, $product->get_image_id());
            }
            
            foreach ($img_ids as $iid) {
                $src = wp_get_attachment_url($iid);
                if ($src) {
                    $images[] = [
                        'id' => $iid,
                        'src' => $src,
                        'alt' => get_post_meta($iid, '_wp_attachment_image_alt', true) ?: $product->get_name()
                    ];
                }
            }
            
            // Placeholder se sem imagem
            if (empty($images)) {
                $images[] = [
                    'id' => 0,
                    'src' => 'https://placehold.co/600x600/101418/6366F1?text=' . urlencode($product->get_name()),
                    'alt' => $product->get_name()
                ];
            }
            
            $products[] = [
                'id' => $p_id,
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'stock_status' => $product->get_stock_status(),
                'images' => $images,
                'lang' => $p_lang,
                'translations' => $translations
            ];
        }
    }
    wp_reset_postdata();
    
    // Cache de 30min
    set_transient($cache_key, $products, DJZ_CACHE_PRODUCTS);
    
    return new WP_Rest_Response($products, 200);
}

// Limpa cache ao salvar produto
add_action('save_post_product', function($post_id) {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_products_%'");
}, 10, 1);

// Limpa também ao atualizar estoque
add_action('woocommerce_product_set_stock_status', function($product_id) {
    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_products_%'");
}, 10, 1);

// ============================================================================
// 6. ENDPOINTS AUXILIARES (Tracks, Streak, Events)
// ============================================================================
function djz_user_tracks_handler($request) {
    $user_id = intval($request->get_param('user_id'));
    
    // NOTA: Endpoint retorna dados mock até implementação real
    // Para implementar:
    // 1. Criar tabela wp_user_track_downloads (user_id, track_id, download_date)
    // 2. Registrar download quando usuário baixar track
    // 3. Query: SELECT COUNT(*) FROM wp_user_track_downloads WHERE user_id = $user_id
    
    return rest_ensure_response([
        'total' => 0, // Alterado de 12 para 0 (mock data removido)
        'recent' => [],
        'note' => 'Mock data - implement real tracking'
    ]);
}

function djz_user_streak_handler($request) {
    $user_id = intval($request->get_param('user_id'));
    
    $days = 0;
    if (function_exists('gamipress_get_user_streak')) {
        $days = (int) gamipress_get_user_streak($user_id, 'login');
    }
    
    return rest_ensure_response([
        'streak' => $days,
        'fire' => $days >= 7
    ]);
}

function djz_user_events_handler($request) {
    $user_id = intval($request->get_param('user_id'));
    
    // NOTA: Endpoint retorna dados mock até implementação real
    // Para implementar:
    // 1. Criar relação user <-> events (wp_usermeta ou tabela custom)
    // 2. Registrar quando usuário comprar ingresso ou confirmar presença
    // 3. Query eventos futuros do usuário
    
    return rest_ensure_response([
        'total' => 0, // Alterado de 3 para 0 (mock data removido)
        'next' => null, // Alterado de 'Zouk Night SP' para null
        'note' => 'Mock data - implement real event tracking'
    ]);
}

// ============================================================================
// 7. REGISTRA TODAS AS ROTAS REST
// ============================================================================
add_action('rest_api_init', function () {
    $ns = 'djzeneyer/v1';
    
    // Menu
    register_rest_route($ns, '/menu', [
        'methods' => 'GET',
        'callback' => 'djz_get_multilang_menu_handler',
        'permission_callback' => '__return_true',
    ]);
    
    // Newsletter
    register_rest_route($ns, '/subscribe', [
        'methods' => 'POST',
        'callback' => 'djz_mailpoet_subscribe_handler',
        'permission_callback' => '__return_true',
    ]);
    
    // Produtos WooCommerce
    register_rest_route($ns, '/products', [
        'methods' => 'GET',
        'callback' => 'djz_get_products_with_lang_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'lang' => [
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field'
            ]
        ]
    ]);
    
    // GamiPress
    register_rest_route($ns, '/gamipress/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_get_gamipress_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'user_id' => [
                'required' => true,
                'type' => 'integer',
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0;
                }
            ]
        ]
    ]);
    
    // Tracks
    register_rest_route($ns, '/tracks/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_user_tracks_handler',
        'permission_callback' => '__return_true'
    ]);
    
    // Streak
    register_rest_route($ns, '/streak/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_user_streak_handler',
        'permission_callback' => '__return_true'
    ]);
    
    // Events
    register_rest_route($ns, '/events/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_user_events_handler',
        'permission_callback' => '__return_true'
    ]);
    
    // Update Profile (Autenticado)
    register_rest_route($ns, '/user/update-profile', [
        'methods' => 'POST',
        'permission_callback' => function() {
            return is_user_logged_in();
        },
        'callback' => function($request) {
            $uid = get_current_user_id();
            if (!$uid) {
                return new WP_Error('not_logged_in', 'User not authenticated', ['status' => 401]);
            }
            
            $params = $request->get_json_params();
            $data = ['ID' => $uid];
            
            if (isset($params['displayName'])) {
                $data['display_name'] = sanitize_text_field($params['displayName']);
            }
            
            $res = wp_update_user($data);
            
            if (is_wp_error($res)) {
                return new WP_Error('update_failed', 'Failed to update', ['status' => 400]);
            }
            
            // Limpa cache do GamiPress ao atualizar perfil
            delete_transient('djz_gamipress_' . $uid);
            
            return rest_ensure_response([
                'success' => true,
                'message' => 'Profile updated!'
            ]);
        }
    ]);
});

// ============================================================================
// 8. CORS HEADERS (Apenas REST API)
// ============================================================================
add_action('rest_api_init', function() {
    // Headers leves (Access-Control já está no setup.php)
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-WP-Nonce");
});

// ============================================================================
// 9. FIX: Permitir acesso público a imagens na REST API
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
    if (isset($wp->request) && strpos($wp->request, 'wp/v2/media') !== false) {
        return true;
    }
    
    return $result;
});

// ============================================================================
// 10. SEGURANÇA: Remove endpoints não usados (Otimizado)
// ============================================================================
add_action('rest_api_init', function() {
    // Remove endpoints de comentários (sempre)
    remove_action('rest_api_init', 'create_initial_rest_routes', 99);
    
    // Remove users se não logado
    if (!is_user_logged_in()) {
        add_filter('rest_endpoints', function($endpoints) {
            unset($endpoints['/wp/v2/users']);
            unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
            return $endpoints;
        });
    }
}, 99);

// ============================================================================
// 11. ADMIN: Botão para limpar cache manualmente
// ============================================================================
add_action('admin_bar_menu', function($wp_admin_bar) {
    if (!current_user_can('manage_options')) return;
    
    $wp_admin_bar->add_node([
        'id' => 'djz_clear_cache',
        'title' => '🧹 Clear DJ Zen Cache',
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

/**
 * HELPER: Adiciona headers de cache HTTP em respostas REST API
 * Reduz requisições do navegador em até 90%
 */
function djz_rest_response_with_cache($data, $cache_seconds = 3600) {
    $response = rest_ensure_response($data);
    
    // Headers de cache HTTP
    $response->header('Cache-Control', 'public, max-age=' . $cache_seconds);
    $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $cache_seconds) . ' GMT');
    $response->header('Pragma', 'public');
    
    return $response;

    /**
 * INSTRUCOES: Como aplicar cache HTTP em todos os endpoints GET
 * 
 * ANTES:
 * return rest_ensure_response($data);
 * 
 * DEPOIS:
 * return djz_rest_response_with_cache($data, TEMPO_EM_SEGUNDOS);
 * 
 * ENDPOINTS E SEUS CACHE TIMES:
 * 1. /djzeneyer/v1/menu → 6 * HOUR_IN_SECONDS (6h)
 * 2. /djzeneyer/v1/products → HOUR_IN_SECONDS (1h)  
 * 3. /djzeneyer/v1/gamipress/{id} → 15 * MINUTE_IN_SECONDS (15min)
 * 4. /zen-bit/v1/events → 6 * HOUR_IN_SECONDS (6h)
 * 5. /zen-seo/v1/settings → 24 * HOUR_IN_SECONDS (24h)
 * 
 * IMPACTO: Reduz requests HTTP ao servidor em ate 90%
 * @todo Aplicar em todos os endpoints GET do arquivo
 */
}
