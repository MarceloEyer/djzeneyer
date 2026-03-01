<?php
/**
 * Plugin Name: Zen Plugins Overview
 * Description: Mission Control for DJ Zen Eyer's Headless Architecture.
 * Version: 2.1.0
 * Author: DJ Zen Eyer
 */

if (!defined('ABSPATH')) exit;

class Zen_Plugins_Overview {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_menu', array($this, 'add_overview_page'), 2); // Prioridade alta para aparecer no topo
        add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));
    }

    public function enqueue_styles() {
        // Carrega CSS apenas na nossa página
        if (isset($_GET['page']) && $_GET['page'] === 'zen-control') {
            wp_enqueue_style('dashicons');
        }
    }
    
    public function add_overview_page() {
        add_menu_page(
            __('Zen Control', 'zen-plugins'),
            __('Zen Control', 'zen-plugins'),
            'manage_options',
            'zen-control',
            array($this, 'render_overview_page'),
            'dashicons-superhero', 
            2
        );
    }

    /**
     * Verifica se o plugin está ativo
     */
    private function check_active($path) {
        if (!function_exists('is_plugin_active')) {
            include_once(ABSPATH . 'wp-admin/includes/plugin.php');
        }
        return is_plugin_active($path);
    }
    
    public function render_overview_page() {
        // Dados do Sistema
        $php_version = phpversion();
        $wp_version = get_bloginfo('version');
        $memory = size_format(wp_convert_hr_to_bytes(WP_MEMORY_LIMIT));
        
        ?>
        <div class="zen-wrap">
            <div class="zen-header">
                <div>
                    <h1 class="zen-title">Zen<span>Core</span> Systems</h1>
                    <p class="zen-subtitle">Headless Architecture Command Center</p>
                </div>
                <div class="zen-stats">
                    <div class="stat-badge"><span>PHP</span> <?php echo $php_version; ?></div>
                    <div class="stat-badge"><span>WP</span> <?php echo $wp_version; ?></div>
                    <div class="stat-badge"><span>MEM</span> <?php echo $memory; ?></div>
                </div>
            </div>

            <div class="zen-grid">
                
                <?php
                // LISTA DE PLUGINS ATUALIZADA
                // Ajuste os caminhos ('path') conforme a estrutura real no seu servidor
                $plugins = array(
                    array(
                        'name' => 'Zen SEO Lite Pro',
                        'path' => 'zen-seo-lite/zen-seo-lite.php', 
                        'version' => '8.0.0',
                        'desc' => 'Schema.org JSON-LD generator & Meta tags optimized for React Headless frontend.',
                        'icon' => 'dashicons-chart-line',
                        'menu' => 'zen-seo-settings'
                    ),
                    array(
                        'name' => 'ZenGame',
                        'path' => 'zengame/zengame.php',
                        'version' => '1.0.0',
                        'desc' => 'Unified Gamification API. Handlers for Points, Ranks, Achievements & Activity Loops.',
                        'icon' => 'dashicons-performance',
                        'menu' => 'zengame-settings'
                    ),
                    array(
                        'name' => 'ZenEyer Auth Pro',
                        'path' => 'zeneyer-auth/zeneyer-auth.php', 
                        'version' => '2.3.0',
                        'desc' => 'Secure JWT Authentication provider with Google OAuth 2.0 implementation.',
                        'icon' => 'dashicons-shield',
                        'menu' => 'zeneyer-auth' 
                    ),
                    array(
                        'name' => 'Zen BIT (Events)',
                        'path' => 'zen-bit/zen-bit.php',
                        'version' => '1.0.0',
                        'desc' => 'Bandsintown API Sync. Manages Tour Dates and Ticket Links automatically.',
                        'icon' => 'dashicons-tickets-alt',
                        'menu' => 'zen-bit-settings'
                    )
                );
                
                foreach ($plugins as $plugin) {
                    $is_active = $this->check_active($plugin['path']);
                    $status_class = $is_active ? 'active' : 'inactive';
                    $status_label = $is_active ? 'SYSTEM ONLINE' : 'OFFLINE';
                    ?>
                    
                    <div class="zen-card <?php echo $status_class; ?>">
                        <div class="card-header">
                            <div class="icon-box">
                                <span class="dashicons <?php echo esc_attr($plugin['icon']); ?>"></span>
                            </div>
                            <div class="status-indicator">
                                <span class="dot"></span> <?php echo $status_label; ?>
                            </div>
                        </div>
                        
                        <h2><?php echo esc_html($plugin['name']); ?></h2>
                        <p><?php echo esc_html($plugin['desc']); ?></p>
                        
                        <div class="card-footer">
                            <span class="version">v<?php echo esc_html($plugin['version']); ?></span>
                            
                            <?php if ($is_active): ?>
                                <a href="<?php echo admin_url('admin.php?page=' . $plugin['menu']); ?>" class="zen-btn primary">
                                    Configure <span class="dashicons dashicons-arrow-right-alt2"></span>
                                </a>
                            <?php else: ?>
                                <a href="<?php echo admin_url('plugins.php'); ?>" class="zen-btn danger">
                                    Activate System
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>

                    <?php
                }
                ?>
            </div>

            <div class="zen-footer">
                <p>Developed by <strong>DJ Zen Eyer</strong> // Mission Control v2.1.0</p>
            </div>
        </div>
        
        <style>
            /* CSS Incorporado para manter tudo em um arquivo */
            .zen-wrap {
                background: #05071a; 
                color: #e0e0e0;
                padding: 40px;
                margin: -20px 0 0 -20px; 
                min-height: 100vh;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                box-sizing: border-box;
                background-image: radial-gradient(circle at 50% 0%, #1a1b3a 0%, #05071a 100%);
            }
            .zen-wrap * { box-sizing: border-box; }

            /* Header */
            .zen-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 60px;
                padding-bottom: 30px;
                position: relative;
            }
            .zen-header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 1px;
                background: linear-gradient(to right, rgba(157, 78, 221, 0.5), transparent);
            }
            .zen-title {
                font-size: 3rem;
                font-weight: 900;
                color: #fff;
                margin: 0;
                letter-spacing: -2px;
                line-height: 1;
                text-transform: uppercase;
            }
            .zen-title span { 
                color: #9D4EDD;
                background: linear-gradient(135deg, #9D4EDD, #c77dff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            } 
            .zen-subtitle { 
                color: rgba(255,255,255,0.4); 
                margin: 10px 0 0 0; 
                font-size: 0.9rem; 
                text-transform: uppercase;
                letter-spacing: 2px;
                font-weight: 600;
            }

            /* Stats */
            .zen-stats { display: flex; gap: 15px; }
            .stat-badge {
                background: rgba(255,255,255,0.03);
                padding: 10px 18px;
                border-radius: 12px;
                font-size: 0.8rem;
                border: 1px solid rgba(255,255,255,0.05);
                font-family: 'JetBrains Mono', monospace;
                color: rgba(255,255,255,0.6);
                backdrop-filter: blur(10px);
            }
            .stat-badge span { color: #9D4EDD; font-weight: 800; margin-right: 8px; }

            /* Grid */
            .zen-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                gap: 30px;
            }

            /* Cards */
            .zen-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 24px;
                padding: 40px;
                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                backdrop-filter: blur(20px);
            }
            .zen-card:hover {
                transform: translateY(-10px);
                background: rgba(255, 255, 255, 0.04);
                border-color: rgba(157, 78, 221, 0.3);
                box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
            }
            .zen-card::before {
                content: '';
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at top right, rgba(157, 78, 221, 0.1), transparent 60%);
                opacity: 0;
                transition: opacity 0.4s;
            }
            .zen-card:hover::before { opacity: 1; }

            /* Card Header */
            .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; z-index: 1; }
            .icon-box {
                background: rgba(157, 78, 221, 0.1);
                width: 64px; height: 64px;
                border-radius: 18px;
                display: flex; align-items: center; justify-content: center;
                border: 1px solid rgba(157, 78, 221, 0.2);
                transition: all 0.3s;
            }
            .zen-card:hover .icon-box {
                background: #9D4EDD;
                border-color: #9D4EDD;
                transform: scale(1.1);
            }
            .icon-box .dashicons { color: #9D4EDD; font-size: 32px; width: 32px; height: 32px; transition: color 0.3s; }
            .zen-card:hover .icon-box .dashicons { color: white; }

            /* Status */
            .status-indicator { 
                font-size: 0.7rem; 
                font-weight: 800; 
                letter-spacing: 1.5px; 
                display: flex; 
                align-items: center; 
                gap: 10px;
                text-transform: uppercase;
                background: rgba(0,0,0,0.3);
                padding: 6px 12px;
                border-radius: 20px;
            }
            .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; position: relative; }
            .dot::after {
                content: '';
                position: absolute;
                top: -4px; left: -4px; right: -4px; bottom: -4px;
                border-radius: 50%;
                border: 1px solid currentColor;
                opacity: 0.3;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.3; }
                100% { transform: scale(2.5); opacity: 0; }
            }
            
            .zen-card.active .status-indicator { color: #00ff88; }
            .zen-card.active .dot { background: #00ff88; }
            .zen-card.inactive .status-indicator { color: #ff3e3e; }
            .zen-card.inactive .dot { background: #ff3e3e; }
            .zen-card.inactive .dot::after { display: none; }
            .zen-card.inactive { opacity: 0.7; }

            /* Text */
            .zen-card h2 { color: white; margin: 0 0 15px 0; font-size: 1.6rem; font-weight: 800; z-index: 1; }
            .zen-card p { color: rgba(255,255,255,0.5); font-size: 1rem; line-height: 1.7; margin: 0 0 35px 0; flex-grow: 1; z-index: 1; }

            /* Footer */
            .card-footer { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                border-top: 1px solid rgba(255,255,255,0.05); 
                padding-top: 30px; 
                margin-top: auto;
                z-index: 1;
            }
            .version { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); padding: 5px 10px; border-radius: 8px; }

            .zen-btn {
                padding: 12px 24px;
                border-radius: 12px;
                text-decoration: none;
                font-size: 0.9rem;
                font-weight: 700;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                display: inline-flex; 
                align-items: center; 
                gap: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .zen-btn.primary { 
                background: rgba(157, 78, 221, 0.1); 
                color: #c77dff; 
                border: 1px solid rgba(157, 78, 221, 0.2); 
            }
            .zen-btn.primary:hover { 
                background: #9D4EDD; 
                color: white; 
                border-color: #9D4EDD;
                box-shadow: 0 10px 20px rgba(157, 78, 221, 0.3);
            }
            .zen-btn.danger { 
                background: rgba(255, 62, 62, 0.05); 
                color: #ff3e3e; 
                border: 1px solid rgba(255, 62, 62, 0.15); 
            }
            .zen-btn.danger:hover { 
                background: #ff3e3e; 
                color: white; 
                box-shadow: 0 10px 20px rgba(255, 62, 62, 0.2);
            }

            .zen-footer { margin-top: 80px; text-align: center; color: rgba(255,255,255,0.2); font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 40px; text-transform: uppercase; letter-spacing: 2px; }
            .zen-footer strong { color: rgba(255,255,255,0.4); font-weight: 800; }
        </style>
        <?php
    }
}

function zen_plugins_overview_init() {
    return Zen_Plugins_Overview::get_instance();
}

zen_plugins_overview_init();