<?php
/**
 * Plugin Name: DJ Zen Eyer - GamiPress API Lite
 * Description: API REST leve e funcional para GamiPress — obtenha pontos, conquistas e ranks via JSON. Otimizado para WordPress Headless com React/Next.js.
 * Version: 1.1.0
 * Author: DJ Zen Eyer
 * Author URI: https://djzeneyer.com
 * License: GPL2+
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: djz-gamipress-api-lite
 *
 * 📌 DOCUMENTAÇÃO RÁPIDA:
 * Endpoint principal: /wp-json/djzeneyer/v1/gamipress/{user_id}
 * Retorna: pontos, conquistas, ranks e estatísticas em JSON.
 * Cache: 5 minutos (auto-flush em eventos do GamiPress).
 * Uso: Ideal para WordPress Headless com React/Next.js.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Adiciona página de administração com documentação mínima
 */
add_action('admin_menu', function() {
    add_menu_page(
        'GamiPress API Lite',
        'GamiPress API',
        'manage_options',
        'djz-gamipress-api-lite',
        'djz_gamipress_api_lite_admin_page',
        'dashicons-rest-api',
        58
    );
});

/**
 * Página de administração com documentação
 */
function djz_gamipress_api_lite_admin_page() {
    $base_url = rest_url('djzeneyer/v1/gamipress/');
    ?>
    <div class="wrap">
        <h1>🎮 GamiPress API Lite</h1>
        <p class="description">API REST leve para GamiPress. Ideal para WordPress Headless com React/Next.js.</p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0;">
            <div class="card" style="padding: 20px; background: #d1ecf1; border-left: 4px solid #0c5460;">
                <h3 style="margin: 0 0 10px 0;">Endpoint Principal</h3>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 12px;">GET <?php echo esc_html($base_url); ?>{user_id}</pre>
            </div>
            <div class="card" style="padding: 20px; background: #fff3cd; border-left: 4px solid #856404;">
                <h3 style="margin: 0 0 10px 0;">Cache</h3>
                <p style="margin: 0; font-size: 16px;">5 minutos (auto-flush em eventos do GamiPress).</p>
            </div>
        </div>

        <h2 class="nav-tab-wrapper">
            <a href="#documentation" class="nav-tab nav-tab-active">📚 Documentação</a>
            <a href="#examples" class="nav-tab">💻 Exemplos</a>
        </h2>

        <div id="documentation" class="tab-content" style="display: block;">
            <div class="card" style="margin-top: 20px; padding: 20px;">
                <h2>📖 Documentação Rápida</h2>
                <h3>🔗 Endpoint</h3>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;"><code>GET <?php echo esc_html($base_url); ?>{user_id}</code></pre>

                <h3>📥 Response Example</h3>
                <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>{
  "success": true,
  "user": 1,
  "points_total": 450,
  "points_detail": [
    { "type": "default", "name": "Points", "points": 450 }
  ],
  "achievements": [
    { "id": 1, "title": "First Achievement", "type": "achievement", "points": 10, "date": "2025-10-26 12:00:00" }
  ],
  "rank": "Zen Apprentice",
  "ranks": [
    { "id": 1, "title": "Novice", "current": false },
    { "id": 2, "title": "Zen Apprentice", "current": true }
  ],
  "stats": {
    "total_achievements": 1,
    "total_ranks": 2
  }
}</code></pre>

                <h3>⚡ Features</h3>
                <ul>
                    <li>✅ <strong>Leve e rápido</strong> - Otimizado para WordPress Headless.</li>
                    <li>✅ <strong>Cache inteligente</strong> - 5 minutos com auto-flush.</li>
                    <li>✅ <strong>Dados completos</strong> - Pontos, conquistas, ranks e estatísticas.</li>
                    <li>✅ <strong>Sem hardcode</strong> - 100% dinâmico.</li>
                </ul>
            </div>
        </div>

        <div id="examples" class="tab-content" style="display: none;">
            <div class="card" style="margin-top: 20px; padding: 20px;">
                <h2>💻 Exemplos de Uso</h2>

                <h3>React Hook</h3>
                <pre style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>import { useState, useEffect } from 'react';

const useGamiPress = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/wp-json/djzeneyer/v1/gamipress/${userId}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      });
  }, [userId]);

  return { data, loading };
};

export default useGamiPress;</code></pre>

                <h3>JavaScript (Fetch)</h3>
                <pre style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px;"><code>const fetchGamiPressData = async (userId) => {
  const response = await fetch(`/wp-json/djzeneyer/v1/gamipress/${userId}`);
  const data = await response.json();
  return data;
};

// Uso
fetchGamiPressData(1).then(data => console.log(data));</code></pre>
            </div>
        </div>
    </div>

    <style>
        .nav-tab-wrapper { margin-bottom: 0; }
        .tab-content { background: #fff; padding: 20px; border: 1px solid #ccc; border-top: 0; }
        .card { background: #fff; border: 1px solid #ccc; box-shadow: 0 1px 1px rgba(0,0,0,.04); }
    </style>

    <script>
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('nav-tab-active'));
                document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
                this.classList.add('nav-tab-active');
                document.querySelector(this.getAttribute('href')).style.display = 'block';
            });
        });
    </script>
    <?php
}

/**
 * Endpoint principal: /wp-json/djzeneyer/v1/gamipress/{user_id}
 */
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/gamipress/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_gamipress_get_user_data',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Função principal: busca dados do usuário no GamiPress
 */
function djz_gamipress_get_user_data($request) {
    $user_id = intval($request['user_id']);
    if ($user_id <= 0) {
        return new WP_Error('invalid_user', 'ID de usuário inválido.', ['status' => 400]);
    }
    if (!function_exists('gamipress_get_user_points')) {
        return ['success' => false, 'message' => 'GamiPress não está ativo.'];
    }

    // CACHE: guarda resultado por 5 minutos
    $cache_key = 'djz_gp_user_' . $user_id;
    $cached = get_transient($cache_key);
    if ($cached) {
        return $cached;
    }

    // Busca tipos de pontos e soma
    $points_types = gamipress_get_points_types();
    $points_total = 0;
    $points_detail = [];
    foreach ($points_types as $slug => $data) {
        $points = (int) gamipress_get_user_points($user_id, $slug);
        $points_total += $points;
        $points_detail[] = [
            'type' => $slug,
            'name' => $data['plural_name'],
            'points' => $points,
        ];
    }

    // Conquistas
    $achievements = [];
    $achievement_types = gamipress_get_achievement_types();
    foreach ($achievement_types as $slug => $data) {
        $user_achievements = gamipress_get_user_achievements([
            'user_id' => $user_id,
            'achievement_type' => $slug,
        ]);
        foreach ((array) $user_achievements as $ach) {
            if (isset($ach->ID)) {
                $achievements[] = [
                    'id' => $ach->ID,
                    'title' => $ach->post_title,
                    'type' => $slug,
                    'points' => (int) get_post_meta($ach->ID, '_gamipress_points', true),
                    'date' => get_post_time('Y-m-d H:i:s', false, $ach->ID),
                ];
            }
        }
    }

    // Ranks
    $ranks = [];
    $current_rank = 'Novato';
    $rank_types = gamipress_get_rank_types();
    foreach ($rank_types as $slug => $data) {
        $user_rank = gamipress_get_user_rank($user_id, $slug);
        if ($user_rank) {
            $current_rank = $user_rank->post_title;
        }
        $query = new WP_Query([
            'post_type' => $slug,
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);
        while ($query->have_posts()) {
            $query->the_post();
            $ranks[] = [
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'current' => ($user_rank && $user_rank->ID === get_the_ID()),
            ];
        }
        wp_reset_postdata();
        break; // apenas um tipo de rank
    }

    // Monta resposta
    $response = [
        'success' => true,
        'user' => $user_id,
        'points_total' => $points_total,
        'points_detail' => $points_detail,
        'achievements' => $achievements,
        'rank' => $current_rank,
        'ranks' => $ranks,
        'stats' => [
            'total_achievements' => count($achievements),
            'total_ranks' => count($ranks),
        ],
    ];

    // Armazena cache temporário
    set_transient($cache_key, $response, 5 * MINUTE_IN_SECONDS);
    return $response;
}

/**
 * Endpoint para limpar cache manualmente
 */
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/gamipress/cache/(?P<user_id>\d+)', [
        'methods' => 'DELETE',
        'callback' => function($request) {
            $user_id = intval($request['user_id']);
            delete_transient('djz_gp_user_' . $user_id);
            return ['success' => true, 'message' => "Cache limpo para usuário $user_id"];
        },
        'permission_callback' => function() {
            return current_user_can('manage_options');
        },
    ]);
});

/**
 * Limpa cache automaticamente quando algo muda no GamiPress
 */
add_action('gamipress_update_user_points', 'djz_gp_flush_cache_auto');
add_action('gamipress_award_achievement', 'djz_gp_flush_cache_auto');
add_action('gamipress_update_user_rank', 'djz_gp_flush_cache_auto');
function djz_gp_flush_cache_auto($user_id) {
    delete_transient('djz_gp_user_' . $user_id);
}
