<?php
/**
 * ZENEYER HEADLESS EXTENSIONS (API)
 * Funcionalidades de Auth, Loja, Gamificação, Menu multilíngue e Cache.
 */

if (!defined('ABSPATH')) exit;

// ============================================================================
// 1. AUTENTICAÇÃO (manter JWT plugin externo, endpoints auxiliares se quiser)
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
// 2. GAMIPRESS & DASHBOARD REAL DATA
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
                'count' => (int)get_post_meta($req->ID, '_gamipress_count', true),
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
        $points = (int)gamipress_get_user_points($user_id, $slug);
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
                    'points' => (int)get_post_meta($a_id, '_gamipress_points', true), 'requirements' => djz_format_requirements($a_id)
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
// Dashboard real: ex. streak
function djz_streak_handler($request) {
    $user_id = intval($request->get_param('user_id'));
    $days = 0;
    if (function_exists('gamipress_get_user_streak')) {
        $days = (int) gamipress_get_user_streak($user_id, 'login'); // ou outro type que quiser
    }
    return rest_ensure_response(['days' => $days]);
}

// ============================================================================
// 3. UTILS: MENU MULTILINGUE + CACHE
// ============================================================================
function djz_get_multilang_menu_handler($request) {
    $lang = sanitize_text_field($
