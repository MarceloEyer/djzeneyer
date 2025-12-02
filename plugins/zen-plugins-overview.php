<?php
/**
 * Plugin Name: Zen Plugins Overview
 * Description: Mission Control for DJ Zen Eyer's Headless Architecture.
 * Version: 2.0.0
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
        add_action('admin_menu', array($this, 'add_overview_page'), 5);
        add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));
    }

    public function enqueue_styles() {
        // Carrega CSS apenas na nossa página
        if (isset($_GET['page']) && $_GET['page'] === 'zen-plugins') {
            wp_enqueue_style('dashicons');
        }
    }
    
    public function add_overview_page() {
        add_menu_page(
            __('Zen Control', 'zen-plugins'),
            __('Zen Control', 'zen-plugins'),
            'manage_options',
            'zen-plugins',
            array($this, 'render_overview_page'),
            'dashicons-superhero', // Ícone mais legal
            2
        );
    }

    /**
     * Verifica se o plugin está ativo pelo caminho do arquivo (Mais seguro que class_exists)
     */
    private function check_active($path) {
        if (!function_exists('is_plugin_active')) {
            include_once(ABSPATH . 'wp-admin/includes/plugin.php');
        }
        return is_plugin_active($path);
    }
    
    public function render_overview_page() {
        // Dados do Sistema para o Header
        $php_version = phpversion();
        $wp_version = get_bloginfo('version');
        $memory =  size_format(wp_convert_hr_to_bytes(WP_MEMORY_LIMIT));
        
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
                // LISTA DE PLUGINS (Ajuste os caminhos dos arquivos .php se necessário)
                $plugins = array(
                    array(
                        'name' => 'Zen SEO Lite Pro',
                        'path' => 'zen-seo-lite/zen-seo-lite.php', // Caminho pasta/arquivo
                        'version' => '8.0.0',
                        'desc' => 'Schema.org JSON-LD generator & Meta tags optimized for React Headless frontend.',
                        'icon' => 'dashicons-chart-line',
                        'menu' => 'zen-seo-settings'
                    ),
                    array(
                        'name' => 'ZenEyer Auth Pro',
                        'path' => 'zeneyer-auth/zeneyer-auth.php', // Verifique se o nome do arquivo é este mesmo
                        'version' => '2.0.0',
                        'desc' => 'Secure JWT Authentication provider with Google OAuth 2.0 handling.',
                        'icon' => 'dashicons-shield', // Ícone de segurança
                        'menu' => 'zeneyer-auth'
                    ),
                    array(
                        'name' => 'Zen BIT (Events)',
                        'path' => 'zen-bit/zen-bit.php',
                        'version' => '1.0.0',
                        'desc' => 'Bandsintown API Sync. Manages Tour Dates and Ticket Links automatically.',
                        'icon' => 'dashicons-tickets-alt',
                        'menu' => 'zen-bit-settings'
                    ),
                    array(
                        'name' => 'Zen-RA (Activity)',
                        'path' => 'zen-ra/zen-ra.php',
                        'version' => '1.0.0',
                        'desc' => 'Recent Activity API. Gamification logic connecting WooCommerce & GamiPress.',
                        'icon' => 'dashicons-performance',
                        'menu' => 'zen-ra-settings'
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
                <p>Developed by <strong>DJ Zen Eyer</strong> // Running on <strong>Hostinger Cloud</strong> + <strong>Cloudflare</strong></p>
            </div>
        </div>
        
        <style>
            /* Reset básico para isolar o estilo */
            .zen-wrap {
                background: #0A0E27; /* Cor do seu site */
                color: #e0e0e0;
                padding: 40px;
                margin: -20px 0 0 -20px; /* Quebra as margens do WP */
                min-height: 100vh;
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
            }

            /* Header */
            .zen-header {
                display: flex;
                justify-content: space-between;
                align-items: end;
                margin-bottom: 50px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 20px;
            }
            .zen-title {
                font-size: 2.5rem;
                font-weight: 700;
                color: #fff;
                margin: 0;
                letter-spacing: -1px;
            }
            .zen-title span { color: #9D4EDD; } /* Seu Roxo */
            .zen-subtitle { color: #888; margin: 5px 0 0 0; font-size: 1rem; }

            /* Status Badges no Header */
            .zen-stats { display: flex; gap: 10px; }
            .stat-badge {
                background: rgba(255,255,255,0.05);
                padding: 5px 12px;
                border-radius: 4px;
                font-size: 0.8rem;
                border: 1px solid rgba(255,255,255,0.1);
                font-family: monospace;
            }
            .stat-badge span { color: #9D4EDD; font-weight: bold; margin-right: 5px; }

            /* Grid */
            .zen-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 25px;
            }

            /* Cards */
            .zen-card {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 25px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .zen-card:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(157, 78, 221, 0.3);
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }

            /* Card Header */
            .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
            .icon-box {
                background: linear-gradient(135deg, #9D4EDD, #5a189a);
                width: 48px; height: 48px;
                border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 4px 15px rgba(157, 78, 221, 0.3);
            }
            .icon-box .dashicons { color: white; font-size: 24px; width: 24px; height: 24px; }

            /* Status Indicator */
            .status-indicator { font-size: 0.7rem; font-weight: bold; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; }
            .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
            
            /* Cores de Status */
            .zen-card.active .status-indicator { color: #00ff88; }
            .zen-card.active .dot { background: #00ff88; box-shadow: 0 0 10px #00ff88; }
            .zen-card.inactive .status-indicator { color: #ff4444; }
            .zen-card.inactive .dot { background: #ff4444; }
            .zen-card.inactive .icon-box { background: #333; filter: grayscale(100%); }

            /* Typography */
            .zen-card h2 { color: white; margin: 0 0 10px 0; font-size: 1.2rem; }
            .zen-card p { color: #aaa; font-size: 0.9rem; line-height: 1.6; margin: 0 0 20px 0; min-height: 45px; }

            /* Footer & Buttons */
            .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; }
            .version { font-family: monospace; color: #666; font-size: 0.8rem; }

            .zen-btn {
                padding: 8px 16px;
                border-radius: 6px;
                text-decoration: none;
                font-size: 0.85rem;
                font-weight: 600;
                transition: all 0.2s;
                display: flex; align-items: center; gap: 5px;
            }
            .zen-btn.primary { background: rgba(157, 78, 221, 0.15); color: #c77dff; border: 1px solid rgba(157, 78, 221, 0.3); }
            .zen-btn.primary:hover { background: #9D4EDD; color: white; }
            .zen-btn.danger { background: rgba(255, 68, 68, 0.1); color: #ff4444; border: 1px solid rgba(255, 68, 68, 0.3); }
            .zen-btn.danger:hover { background: #ff4444; color: white; }

            .zen-footer { margin-top: 50px; text-align: center; color: #555; font-size: 0.8rem; }
            .zen-footer strong { color: #777; }
        </style>
        <?php
    }
}

function zen_plugins_overview_init() {
    return Zen_Plugins_Overview::get_instance();
}

zen_plugins_overview_init();