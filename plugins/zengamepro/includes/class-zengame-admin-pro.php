<?php
/**
 * Admin logic for ZenGame Pro
 *
 * @package ZenGamePro
 */

namespace ZenEyer\GamePro;

if (!defined('ABSPATH')) {
    die;
}

class Admin {

    public function __construct() {
        \add_action('admin_menu', [$this, 'add_plugin_page']);
        \add_action('admin_enqueue_scripts', [$this, 'enqueue_styles']);

        // CPT Meta Boxes
        \add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        \add_action('save_post', [$this, 'save_meta_boxes']);

        // User Profile Fields
        \add_action('show_user_profile', [$this, 'user_profile_fields']);
        \add_action('edit_user_profile', [$this, 'user_profile_fields']);
        \add_action('personal_options_update', [$this, 'save_user_profile_fields']);
        \add_action('edit_user_profile_update', [$this, 'save_user_profile_fields']);
    }

    public function enqueue_styles() {
        \wp_enqueue_style(
            'zengamepro-admin',
            ZENGAMEPRO_URL . 'assets/css/admin.css',
            [],
            ZENGAMEPRO_VERSION,
            'all'
        );
    }

    public function add_plugin_page() {
        \add_menu_page(
            'ZenGame Pro',
            'ZenGame Pro',
            'manage_options',
            'zengamepro',
            [$this, 'create_admin_page'],
            'dashicons-games',
            55
        );

        // Add submenu pages for settings and logs
        \add_submenu_page(
            'zengamepro',
            'Configurações',
            'Configurações',
            'manage_options',
            'zengamepro',
            [$this, 'create_admin_page']
        );

        \add_submenu_page(
            'zengamepro',
            'Logs de Pontos',
            'Logs',
            'manage_options',
            'zengame-logs',
            [$this, 'create_logs_page']
        );
    }

    public function create_admin_page() {
        echo '<div class="wrap"><h1>ZenGame Pro</h1><p>Motor de Gamificação e Fidelidade (Standalone).</p></div>';
    }

    public function create_logs_page() {
        echo '<div class="wrap"><h1>Logs de Gamificação</h1><p>Histórico completo de pontos dos usuários.</p></div>';
        // TODO: Render WP_List_Table with logs from wp_zengamepro_logs
    }

    // =========================================================================
    // META BOXES FOR CPTs
    // =========================================================================
    public function add_meta_boxes() {
        // Rank Meta Box (Points Required)
        \add_meta_box('zengame_rank_meta', 'Requisitos do Nível', [$this, 'render_rank_meta'], 'zengame_rank', 'normal', 'high');

        // Mission Meta Box (Points Reward)
        \add_meta_box('zengame_mission_meta', 'Configuração da Missão', [$this, 'render_mission_meta'], 'zengame_mission', 'normal', 'high');
    }

    public function render_rank_meta($post) {
        \wp_nonce_field('zengame_save_meta', 'zengame_meta_nonce');
        $points = \get_post_meta($post->ID, '_zengame_points_required', true) ?: 0;
        ?>
        <p>
            <label for="zengame_points_required"><strong>Pontos Necessários para Alcançar:</strong></label><br>
            <input type="number" id="zengame_points_required" name="zengame_points_required" value="<?php echo \esc_attr($points); ?>">
        </p>
        <?php
    }

    public function render_mission_meta($post) {
        \wp_nonce_field('zengame_save_meta', 'zengame_meta_nonce');
        $points = \get_post_meta($post->ID, '_zengame_points_reward', true) ?: 10;
        ?>
        <p>
            <label for="zengame_points_reward"><strong>Recompensa em Pontos:</strong></label><br>
            <input type="number" id="zengame_points_reward" name="zengame_points_reward" value="<?php echo \esc_attr($points); ?>">
            <p class="description">Quantos pontos o usuário ganha ao completar esta missão.</p>
        </p>
        <?php
    }

    public function save_meta_boxes($post_id) {
        if (!isset($_POST['zengame_meta_nonce']) || !\wp_verify_nonce(\sanitize_text_field($_POST['zengame_meta_nonce']), 'zengame_save_meta')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (isset($_POST['post_type']) && 'zengame_rank' === $_POST['post_type']) {
            if (!\current_user_can('edit_post', $post_id)) {
                return;
            }
            if (isset($_POST['zengame_points_required'])) {
                \update_post_meta($post_id, '_zengame_points_required', \absint($_POST['zengame_points_required']));
            }
        }

        if (isset($_POST['post_type']) && 'zengame_mission' === $_POST['post_type']) {
            if (!\current_user_can('edit_post', $post_id)) {
                return;
            }
            if (isset($_POST['zengame_points_reward'])) {
                \update_post_meta($post_id, '_zengame_points_reward', \absint($_POST['zengame_points_reward']));
            }
        }
    }

    // =========================================================================
    // USER PROFILE (ADMIN)
    // =========================================================================
    public function user_profile_fields($user) {
        if (!\current_user_can('manage_options')) {
            return;
        }

        $points = (int) \get_user_meta($user->ID, 'zengame_points_balance', true);
        ?>
        <h3>ZenGame Pro - Gestão de Pontos</h3>
        <table class="form-table">
            <tr>
                <th><label for="zengame_add_points">Adicionar/Remover Pontos</label></th>
                <td>
                    <p><strong>Saldo Atual:</strong> <?php echo \esc_html($points); ?> pontos</p>
                    <input type="number" name="zengame_manual_points" id="zengame_manual_points" value="0" class="regular-text">
                    <p class="description">Use valores negativos para remover pontos (ex: -50).</p>
                    <br>
                    <input type="text" name="zengame_manual_points_desc" id="zengame_manual_points_desc" value="" placeholder="Motivo/Descrição (Opcional)" class="regular-text">
                    <?php \wp_nonce_field('zengame_manual_points_nonce', 'zengame_manual_points_nonce_field'); ?>
                </td>
            </tr>
        </table>
        <?php
    }

    public function save_user_profile_fields($user_id) {
        if (!\current_user_can('manage_options')) {
            return false;
        }

        if (!isset($_POST['zengame_manual_points_nonce_field']) || !\wp_verify_nonce(\sanitize_text_field($_POST['zengame_manual_points_nonce_field']), 'zengame_manual_points_nonce')) {
            return false;
        }

        $points_to_add = isset($_POST['zengame_manual_points']) ? (int) $_POST['zengame_manual_points'] : 0;
        $description = isset($_POST['zengame_manual_points_desc']) ? \sanitize_text_field($_POST['zengame_manual_points_desc']) : 'Ajuste manual do administrador';

        if ($points_to_add !== 0) {
            // Include Engine for point manipulation
            require_once ZENGAMEPRO_PATH . 'includes/Core/class-zengame-engine.php';
            Core\Engine::award_points($user_id, $points_to_add, 'admin_adjustment', 0, 'admin', $description);
        }
    }
}
