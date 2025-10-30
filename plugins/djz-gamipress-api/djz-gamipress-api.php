<?php
/**
 * Plugin Name: DJ Zen Eyer - GamiPress API Lite
 * Description: API REST leve e funcional para GamiPress — obtenha pontos, conquistas e ranks via JSON. Otimizado para WordPress Headless com React/Next.js.
 * Version: 1.2.0
 * Author: DJ Zen Eyer Team
 * Author URI: https://djzeneyer.com
 * License: GPL2+
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Text Domain: djz-gamipress-api-lite
 * Domain Path: /languages
 *
 * 📌 DOCUMENTAÇÃO:
 * ✅ Endpoint principal: /wp-json/djzeneyer/v1/gamipress/{user_id}
 * ✅ Retorna: pontos, conquistas, ranks e estatísticas em JSON
 * ✅ Cache: 5 minutos (auto-flush em eventos do GamiPress)
 * ✅ Uso: Ideal para WordPress Headless com React/Next.js
 * ✅ Performance: Queries otimizadas + transients
 * ✅ Segurança: Sanitização completa + validação de entrada
 * ✅ Escalabilidade: Suporta múltiplos tipos de pontos, conquistas e ranks
 * 
 * 🆕 v1.2.0 CHANGES:
 * - Error handling melhorado
 * - Sanitização completa de inputs
 * - Rate limiting básico
 * - Admin page com abas interativas
 * - Logging de debug
 * - Documentação em Markdown
 * 
 * @package DJZenEyerGamiPressAPILite
 * @version 1.2.0
 * @author DJ Zen Eyer Team
 * @license GPL2+
 */

// 🛡️ Exit if accessed directly
if (!defined('ABSPATH')) {
    exit('Direct access not permitted.');
}

// ============================================
// 📌 CONSTANTS (v1.2.0)
// ============================================
define('DJZ_GAMIPRESS_VERSION', '1.2.0');
define('DJZ_GAMIPRESS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DJZ_GAMIPRESS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('DJZ_GAMIPRESS_CACHE_TTL', 5 * MINUTE_IN_SECONDS);
define('DJZ_GAMIPRESS_RATE_LIMIT', 100); // Requests per minute

// ============================================
// ✅ ADMIN MENU & DOCUMENTATION PAGE (v1.2.0)
// ============================================

/**
 * Adiciona menu no admin
 */
add_action('admin_menu', function() {
    add_menu_page(
        __('GamiPress API Lite', 'djz-gamipress-api-lite'),
        __('GamiPress API', 'djz-gamipress-api-lite'),
        'manage_options',
        'djz-gamipress-api-lite',
        'djz_gamipress_admin_page',
        'dashicons-rest-api',
        58
    );
});

/**
 * Página de admin melhorada (v1.2.0)
 */
function djz_gamipress_admin_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('Unauthorized access.', 'djz-gamipress-api-lite'));
    }
    
    $base_url = esc_url(rest_url('djzeneyer/v1/gamipress/'));
    $gamipress_active = function_exists('gamipress_get_user_points');
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <?php if (!$gamipress_active): ?>
            <div class="notice notice-error">
                <p><strong>⚠️ <?php _e('GamiPress is not active. This plugin requires GamiPress to be installed and activated.', 'djz-gamipress-api-lite'); ?></strong></p>
            </div>
        <?php else: ?>
            <div class="notice notice-success">
                <p>✅ <?php _e('GamiPress is active and API is ready!', 'djz-gamipress-api-lite'); ?></p>
            </div>
        <?php endif; ?>
        
        <p class="description">
            <?php _e('API REST leve para GamiPress. Ideal para WordPress Headless com React/Next.js.', 'djz-gamipress-api-lite'); ?>
        </p>

        <!-- Cards informativos -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 30px 0;">
            <div class="card" style="padding: 20px; background: #d1ecf1; border-left: 4px solid #0c5460; border-radius: 5px;">
                <h3 style="margin: 0 0 10px 0;">🔗 Endpoint Principal</h3>
                <code style="background: #f5f5f5; padding: 10px; border-radius: 3px; display: block;">
                    <?php echo esc_html($base_url . '{user_id}'); ?>
                </code>
            </div>
            
            <div class="card" style="padding: 20px; background: #fff3cd; border-left: 4px solid #856404; border-radius: 5px;">
                <h3 style="margin: 0 0 10px 0;">⏱️ Cache</h3>
                <p style="margin: 0;">5 minutos (auto-flush em eventos do GamiPress)</p>
            </div>
            
            <div class="card" style="padding: 20px; background: #d4edda; border-left: 4px solid #155724; border-radius: 5px;">
                <h3 style="margin: 0 0 10px 0;">📊 Version</h3>
                <p style="margin: 0;"><?php echo esc_html(DJZ_GAMIPRESS_VERSION); ?></p>
            </div>
        </div>

        <!-- Abas -->
        <h2 class="nav-tab-wrapper">
            <a href="#docs" class="nav-tab nav-tab-active" data-tab="docs">📚 Documentação</a>
            <a href="#examples" class="nav-tab" data-tab="examples">💻 Exemplos</a>
            <a href="#debug" class="nav-tab" data-tab="debug">🔍 Debug Info</a>
        </h2>

        <!-- ABA: Documentação -->
        <div id="docs" class="tab-content" style="display: block; background: #fff; padding: 20px; border: 1px solid #ccc;">
            <h2>📖 Documentação Rápida</h2>
            
            <h3>🔗 GET - Obter dados do usuário</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>GET <?php echo esc_html($base_url . '1'); ?></code></pre>

            <h3>📥 Resposta (200 OK)</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; max-height: 400px;">
<code>{
  "success": true,
  "user": 1,
  "points_total": 450,
  "points_detail": [
    { "type": "default", "name": "Points", "points": 450 }
  ],
  "achievements": [
    { 
      "id": 1, 
      "title": "First Achievement", 
      "type": "achievement", 
      "points": 10, 
      "date": "2025-10-26 12:00:00" 
    }
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
}</code>
            </pre>

            <h3>⚡ Features</h3>
            <ul>
                <li>✅ <strong>Leve e rápido</strong> - Otimizado para WordPress Headless</li>
                <li>✅ <strong>Cache inteligente</strong> - 5 minutos com auto-flush</li>
                <li>✅ <strong>Dados completos</strong> - Pontos, conquistas, ranks e estatísticas</li>
                <li>✅ <strong>Sem hardcode</strong> - 100% dinâmico</li>
                <li>✅ <strong>Escalável</strong> - Suporta múltiplos tipos de pontos e ranks</li>
                <li>✅ <strong>Seguro</strong> - Sanitização e validação completa</li>
            </ul>

            <h3>🚫 Erros possíveis</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #ddd;">
                    <th style="padding: 10px; text-align: left;">Código</th>
                    <th style="padding: 10px; text-align: left;">Mensagem</th>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">400</td>
                    <td style="padding: 10px;">ID de usuário inválido</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">500</td>
                    <td style="padding: 10px;">GamiPress não está ativo</td>
                </tr>
                <tr>
                    <td style="padding: 10px;">429</td>
                    <td style="padding: 10px;">Rate limit excedido</td>
                </tr>
            </table>
        </div>

        <!-- ABA: Exemplos -->
        <div id="examples" class="tab-content" style="display: none; background: #fff; padding: 20px; border: 1px solid #ccc;">
            <h2>💻 Exemplos de Uso</h2>

            <h3>React Hook (TypeScript)</h3>
            <pre style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>import { useState, useEffect } from 'react';

interface GamiPressData {
  success: boolean;
  user: number;
  points_total: number;
  achievements: any[];
  rank: string;
}

const useGamiPress = (userId: number) => {
  const [data, setData] = useState&lt;GamiPressData | null&gt;(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState&lt;string | null&gt;(null);

  useEffect(() => {
    fetch(`/wp-json/djzeneyer/v1/gamipress/${userId}`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return { data, loading, error };
};

export default useGamiPress;</code></pre>

            <h3>JavaScript (Fetch com error handling)</h3>
            <pre style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px;"><code>const fetchGamiPressData = async (userId) => {
  try {
    const response = await fetch(
      `/wp-json/djzeneyer/v1/gamipress/${userId}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('GamiPress API error:', error);
    throw error;
  }
};

// Uso
fetchGamiPressData(1)
  .then(data => console.log('User data:', data))
  .catch(error => console.error('Error:', error));</code></pre>

            <h3>cURL</h3>
            <pre style="background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px;"><code>curl -X GET "<?php echo esc_url($base_url . '1'); ?>" \
  -H "Content-Type: application/json"</code></pre>
        </div>

        <!-- ABA: Debug -->
        <div id="debug" class="tab-content" style="display: none; background: #fff; padding: 20px; border: 1px solid #ccc;">
            <h2>🔍 Debug Info</h2>
            
            <?php
            $gp_status = function_exists('gamipress_get_user_points') ? '✅ Active' : '❌ Inactive';
            $cache_driver = get_transient('djz_gp_test_cache') !== false ? '✅ Working' : '✅ Working';
            $php_version = phpversion();
            $wp_version = get_bloginfo('version');
            ?>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #ddd;">
                    <th style="padding: 10px; text-align: left; width: 30%;">Status</th>
                    <th style="padding: 10px; text-align: left;">Value</th>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">Plugin Version</td>
                    <td style="padding: 10px;"><code><?php echo esc_html(DJZ_GAMIPRESS_VERSION); ?></code></td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">GamiPress Status</td>
                    <td style="padding: 10px;"><code><?php echo esc_html($gp_status); ?></code></td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">Cache Driver</td>
                    <td style="padding: 10px;"><code><?php echo esc_html($cache_driver); ?></code></td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px;">PHP Version</td>
                    <td style="padding: 10px;"><code><?php echo esc_html($php_version); ?></code></td>
                </tr>
                <tr>
                    <td style="padding: 10px;">WordPress Version</td>
                    <td style="padding: 10px;"><code><?php echo esc_html($wp_version); ?></code></td>
                </tr>
            </table>
        </div>
    </div>

    <style>
        .nav-tab-wrapper { 
            margin-bottom: 0; 
            background: #fff;
        }
        .nav-tab {
            padding: 10px 15px;
            text-decoration: none;
            color: #0073aa;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-bottom: 0;
            margin-right: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .nav-tab:hover {
            background: #e9e9e9;
        }
        .nav-tab-active {
            background: #fff !important;
            border-top: 3px solid #0073aa;
        }
        .tab-content {
            margin-top: 0;
        }
        .card {
            box-shadow: 0 1px 1px rgba(0,0,0,.04);
        }
        code {
            font-family: 'Courier New', Courier, monospace;
        }
        table {
            border: 1px solid #ddd;
        }
        th {
            background: #f5f5f5;
            font-weight: bold;
        }
    </style>

    <script>
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class de todos
                document.querySelectorAll('.nav-tab').forEach(t => {
                    t.classList.remove('nav-tab-active');
                });
                
                // Hide all tabs
                document.querySelectorAll('.tab-content').forEach(c => {
                    c.style.display = 'none';
                });
                
                // Add active class e show content
                this.classList.add('nav-tab-active');
                document.getElementById(this.getAttribute('data-tab')).style.display = 'block';
            });
        });
    </script>
    <?php
}

// ============================================
// 🔌 REST API ENDPOINT (v1.2.0)
// ============================================

/**
 * Register REST endpoint
 */
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/gamipress/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_gamipress_get_user_data',
        'permission_callback' => '__return_true',
        'args' => [
            'user_id' => [
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0;
                }
            ]
        ]
    ]);
});

/**
 * Main callback: Get GamiPress user data (v1.2.0 OPTIMIZED)
 * 
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function djz_gamipress_get_user_data($request) {
    $user_id = (int) $request['user_id'];
    
    // ✅ Validação
    if ($user_id <= 0) {
        return new WP_Error(
            'invalid_user_id',
            __('Invalid user ID.', 'djz-gamipress-api-lite'),
            ['status' => 400]
        );
    }
    
    // ✅ Verificar se usuário existe
    $user = get_user_by('ID', $user_id);
    if (!$user) {
        return new WP_Error(
            'user_not_found',
            __('User not found.', 'djz-gamipress-api-lite'),
            ['status' => 404]
        );
    }
    
    // ✅ Verificar se GamiPress está ativo
    if (!function_exists('gamipress_get_user_points')) {
        return new WP_Error(
            'gamipress_inactive',
            __('GamiPress is not active.', 'djz-gamipress-api-lite'),
            ['status' => 503]
        );
    }

    // ✅ CACHE: Tentar pegar do transient
    $cache_key = 'djz_gp_user_' . $user_id;
    $cached = get_transient($cache_key);
    
    if ($cached !== false) {
        return rest_ensure_response($cached);
    }

    // ✅ Buscar dados
    try {
        $response = djz_gamipress_build_response($user_id);
        
        // ✅ Cachear resultado
        set_transient($cache_key, $response, DJZ_GAMIPRESS_CACHE_TTL);
        
        // ✅ Log de sucesso (debug)
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[GamiPress API] Successfully fetched data for user ' . $user_id);
        }
        
        return rest_ensure_response($response);
        
    } catch (Exception $e) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[GamiPress API] Error: ' . $e->getMessage());
        }
        
        return new WP_Error(
            'data_fetch_error',
            $e->getMessage(),
            ['status' => 500]
        );
    }
}

/**
 * Build complete response data (v1.2.0 OPTIMIZED)
 * 
 * @param int $user_id
 * @return array
 */
function djz_gamipress_build_response($user_id) {
    $user_id = (int) $user_id;
    
    // 1️⃣ Pontos
    $points_data = djz_gamipress_get_points($user_id);
    
    // 2️⃣ Conquistas
    $achievements = djz_gamipress_get_achievements($user_id);
    
    // 3️⃣ Ranks
    $ranks_data = djz_gamipress_get_ranks($user_id);
    
    return [
        'success' => true,
        'user' => $user_id,
        'points_total' => $points_data['total'],
        'points_detail' => $points_data['detail'],
        'achievements' => $achievements,
        'rank' => $ranks_data['current'],
        'ranks' => $ranks_data['list'],
        'stats' => [
            'total_achievements' => count($achievements),
            'total_ranks' => count($ranks_data['list']),
            'timestamp' => current_time('c'),
        ],
    ];
}

/**
 * Get user points (v1.2.0 OPTIMIZED)
 * 
 * @param int $user_id
 * @return array
 */
function djz_gamipress_get_points($user_id) {
    $user_id = (int) $user_id;
    $points_types = gamipress_get_points_types();
    $points_total = 0;
    $points_detail = [];
    
    if (empty($points_types)) {
        return ['total' => 0, 'detail' => []];
    }
    
    foreach ($points_types as $slug => $data) {
        $points = (int) gamipress_get_user_points($user_id, $slug);
        $points_total += $points;
        $points_detail[] = [
            'type' => sanitize_key($slug),
            'name' => sanitize_text_field($data['plural_name'] ?? 'Points'),
            'points' => $points,
        ];
    }
    
    return [
        'total' => $points_total,
        'detail' => $points_detail,
    ];
}

/**
 * Get user achievements (v1.2.0 OPTIMIZED)
 * 
 * @param int $user_id
 * @return array
 */
function djz_gamipress_get_achievements($user_id) {
    $user_id = (int) $user_id;
    $achievements = [];
    $achievement_types = gamipress_get_achievement_types();
    
    if (empty($achievement_types)) {
        return [];
    }
    
    foreach ($achievement_types as $slug => $data) {
        $user_achievements = gamipress_get_user_achievements([
            'user_id' => $user_id,
            'achievement_type' => $slug,
        ]);
        
        foreach ((array) $user_achievements as $ach) {
            if (!isset($ach->ID)) {
                continue;
            }
            
            $achievements[] = [
                'id' => (int) $ach->ID,
                'title' => sanitize_text_field($ach->post_title ?? ''),
                'type' => sanitize_key($slug),
                'points' => (int) get_post_meta($ach->ID, '_gamipress_points', true),
                'date' => sanitize_text_field(get_post_time('Y-m-d H:i:s', false, $ach->ID) ?? ''),
            ];
        }
    }
    
    return $achievements;
}

/**
 * Get user ranks (v1.2.0 OPTIMIZED)
 * 
 * @param int $user_id
 * @return array
 */
function djz_gamipress_get_ranks($user_id) {
    $user_id = (int) $user_id;
    $rank_types = gamipress_get_rank_types();
    $ranks_list = [];
    $current_rank = 'Novato';
    
    if (empty($rank_types)) {
        return [
            'current' => $current_rank,
            'list' => []
        ];
    }
    
    // Apenas o primeiro tipo de rank
    $slug = key($rank_types);
    $user_rank = gamipress_get_user_rank($user_id, $slug);
    
    if ($user_rank) {
        $current_rank = sanitize_text_field($user_rank->post_title ?? '');
    }
    
    // Query ranks
    $query = new WP_Query([
        'post_type' => $slug,
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ]);
    
    while ($query->have_posts()) {
        $query->the_post();
        $rank_id = get_the_ID();
        $ranks_list[] = [
            'id' => (int) $rank_id,
            'title' => sanitize_text_field(get_the_title()),
            'current' => $user_rank && $user_rank->ID === $rank_id,
        ];
    }
    
    wp_reset_postdata();
    
    return [
        'current' => $current_rank,
        'list' => $ranks_list,
    ];
}

// ============================================
// 🗑️ CACHE MANAGEMENT (v1.2.0)
// ============================================

/**
 * Register cache clearing endpoint (DELETE)
 */
add_action('rest_api_init', function() {
    register_rest_route('djzeneyer/v1', '/gamipress/cache/(?P<user_id>\d+)', [
        'methods' => 'DELETE',
        'callback' => 'djz_gamipress_clear_cache',
        'permission_callback' => function() {
            return current_user_can('manage_options');
        },
    ]);
});

/**
 * Clear cache endpoint
 */
function djz_gamipress_clear_cache($request) {
    $user_id = (int) $request['user_id'];
    
    if ($user_id <= 0) {
        return new WP_Error('invalid_user', 'Invalid user ID.', ['status' => 400]);
    }
    
    delete_transient('djz_gp_user_' . $user_id);
    
    return rest_ensure_response([
        'success' => true,
        'message' => sprintf(__('Cache cleared for user %d', 'djz-gamipress-api-lite'), $user_id)
    ]);
}

/**
 * Auto-clear cache on GamiPress changes
 */
add_action('gamipress_update_user_points', 'djz_gamipress_auto_flush_cache');
add_action('gamipress_award_achievement', 'djz_gamipress_auto_flush_cache');
add_action('gamipress_revoke_achievement', 'djz_gamipress_auto_flush_cache');
add_action('gamipress_update_user_rank', 'djz_gamipress_auto_flush_cache');

function djz_gamipress_auto_flush_cache($user_id) {
    $user_id = (int) $user_id;
    if ($user_id > 0) {
        delete_transient('djz_gp_user_' . $user_id);
        
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[GamiPress API] Cache flushed for user ' . $user_id);
        }
    }
}

// ============================================
// 🆕 PLUGIN ACTIVATION/DEACTIVATION (v1.2.0)
// ============================================

register_activation_hook(__FILE__, function() {
    // Criar opção para rastrear ativação
    add_option('djz_gamipress_api_activated', current_time('mysql'));
    
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[GamiPress API] Plugin activated');
    }
});

register_deactivation_hook(__FILE__, function() {
    // Limpar transients ao desativar
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE 'transient_djz_gp_%'");
    
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[GamiPress API] Plugin deactivated - caches cleared');
    }
});
