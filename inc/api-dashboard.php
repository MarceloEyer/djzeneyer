<?php
/**
 * API Dashboard / Gamification
 * Replaces Zen-RA with direct GamiPress integration
 *
 * Logic for reading points, ranks, and levels resides here.
 */

if (!defined('ABSPATH')) exit;

add_action('rest_api_init', function() {
    $ns = 'djzeneyer/v1';

    // 1. User Stats (Points & Rank)
    register_rest_route($ns, '/gamipress/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_get_gamipress_stats',
        'permission_callback' => '__return_true', // Public/Facade
    ]);

    // 2. User Activity
    register_rest_route($ns, '/activity/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_get_user_activity',
        'permission_callback' => '__return_true',
    ]);

    // 3. Login Streak
    register_rest_route($ns, '/streak/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_get_user_streak',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Get User Gamification Stats
 */
function djz_get_gamipress_stats($request) {
    $user_id = (int) $request['id'];

    // Default response structure
    $data = [
        'points' => 0,
        'level' => 1,
        'rank' => 'Beginner',
        'nextLevelPoints' => 100, // Default fallback
        'progressToNextLevel' => 0,
        'achievements' => [],
    ];

    if (!$user_id) {
         return rest_ensure_response(['success' => false, 'message' => 'Invalid User ID', 'data' => $data]);
    }

    // Defensive: Check if GamiPress is active
    if (!function_exists('gamipress_get_user_points')) {
        return rest_ensure_response(['success' => true, 'data' => $data]);
    }

    try {
        // 1. Points
        // gamipress_get_user_points($user_id, $points_type_slug)
        // We use the default/all if no type specified, but usually we need a type.
        // We'll attempt to fetch 'credits' or 'points' or fallback to the first available type.
        // For simplicity in this direct integration, we assume a standard 'points' type or aggregated.
        $points = gamipress_get_user_points($user_id);
        $data['points'] = (int) $points;

        // 2. Rank
        // gamipress_get_user_rank($user_id, $rank_type_slug)
        if (function_exists('gamipress_get_user_rank')) {
             $rank_obj = gamipress_get_user_rank($user_id);
             if ($rank_obj && isset($rank_obj->post_title)) {
                 $data['rank'] = $rank_obj->post_title;
             }
        }

        // 3. Level (Simulated via Rank or mapped)
        // If the rank title contains a number (e.g. "Level 2"), parse it.
        if (preg_match('/(\d+)/', $data['rank'], $matches)) {
            $data['level'] = (int) $matches[1];
        }

        // 4. Achievements (Latest 5)
        if (function_exists('gamipress_get_user_achievements')) {
            $user_achievements = gamipress_get_user_achievements([
                'user_id' => $user_id,
                'limit' => 5,
                'orderby' => 'date',
                'order' => 'DESC'
            ]);

            if (!empty($user_achievements)) {
                foreach ($user_achievements as $ach) {
                    $img_url = get_the_post_thumbnail_url($ach->ID, 'thumbnail');
                    $data['achievements'][] = [
                        'id' => $ach->ID,
                        'title' => $ach->post_title,
                        'image' => $img_url ?: '',
                        'date' => $ach->post_date,
                    ];
                }
            }
        }

        // 5. Next Level / Progress
        // This usually requires knowing the next rank requirements.
        // GamiPress API: gamipress_get_next_rank($user_id, $type)
        if (function_exists('gamipress_get_next_rank')) {
             $next_rank = gamipress_get_next_rank($user_id); // Assumes default type
             if ($next_rank) {
                 // Calculate progress based on requirements is complex without 'Zen-RA'.
                 // We will return 0 or basic calculation if 'gamipress_get_rank_requirements' exists.
                 // For now, we leave it safely at 0 or partial.
             }
        }

    } catch (Exception $e) {
        error_log('[GamiPress API] Error: ' . $e->getMessage());
    }

    return rest_ensure_response(['success' => true, 'data' => $data]);
}

/**
 * Get User Activity
 * Combines GamiPress Logs + Other activity if needed
 */
function djz_get_user_activity($request) {
    $user_id = (int) $request['id'];
    $activities = [];

    if (!$user_id) {
        return rest_ensure_response(['success' => false, 'activities' => []]);
    }

    if (function_exists('gamipress_get_user_logs')) {
        try {
            $logs = gamipress_get_user_logs([
                'user_id' => $user_id,
                'limit' => 10,
                'orderby' => 'date',
                'order' => 'DESC'
            ]);

            if (!empty($logs)) {
                foreach ($logs as $log) {
                     $activities[] = [
                         'id' => 'log_' . $log->ID,
                         'type' => 'gamipress',
                         'description' => $log->post_title,
                         'timestamp' => strtotime($log->post_date),
                         'xp' => 0 // Placeholder
                     ];
                }
            }
        } catch (Exception $e) {
             error_log('[GamiPress API] Activity Error: ' . $e->getMessage());
        }
    }

    return rest_ensure_response(['success' => true, 'activities' => $activities]);
}

/**
 * Get User Streak
 */
function djz_get_user_streak($request) {
    $user_id = (int) $request['id'];
    $streak = (int) get_user_meta($user_id, 'zen_login_streak', true);

    return rest_ensure_response([
        'success' => true,
        'streak' => $streak
    ]);
}
