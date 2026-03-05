<?php
/**
 * Plugin Name: Zen Plugins Overview
 * Plugin URI:  https://djzeneyer.com
 * Description: Mission Control for DJ Zen Eyer's Headless Architecture. Unified dashboard with status, endpoints and quick links for all Zen plugins.
 * Version: 3.0.0
 * Author: DJ Zen Eyer
 * Author URI: https://djzeneyer.com
 */
namespace ZenEyer\Overview;

if (!defined('ABSPATH'))
    exit;

class Zen_Plugins_Overview
{

    private static $instance = null;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        \add_action('admin_menu', array($this, 'add_overview_page'), 2);
        \add_action('admin_enqueue_scripts', array($this, 'enqueue_assets'));
    }

    public function enqueue_assets($hook)
    {
        if (\strpos($hook, 'zen-control') === false)
            return;
        \wp_enqueue_style('dashicons');
    }

    public function add_overview_page()
    {
        \add_menu_page(
            \__('Zen Control', 'zen-plugins'),
            \__('Zen Control', 'zen-plugins'),
            'manage_options',
            'zen-control',
            array($this, 'render_overview_page'),
            'dashicons-superhero',
            2
        );
    }

    private function check_active($path)
    {
        if (!\function_exists('is_plugin_active')) {
            include_once(\ABSPATH . 'wp-admin/includes/plugin.php');
        }
        return \is_plugin_active($path);
    }

    private function get_plugins_data()
    {
        $rest_base = \rest_url();

        return array(
            array(
                'name' => 'Zen SEO Lite Pro',
                'path' => 'zen-seo-lite/zen-seo-lite.php',
                'version' => '8.0.0',
                'desc' => 'SEO profissional para WordPress Headless. Schema.org avançado, Sitemap multilíngue PT/EN e REST API completa para o React SPA.',
                'icon' => 'dashicons-chart-line',
                'color' => '#00d4ff',
                'menu' => 'zen-seo-settings',
                'endpoints' => array(
                    'GET ' . $rest_base . 'zen-seo/v1/settings' => 'Config global SEO (nome, OG image)',
                    'GET ' . $rest_base . 'zen-seo/v1/meta?url=/' => 'Meta tags para rota React',
                ),
                'docs_url' => \admin_url('admin.php?page=zen-seo-settings'),
            ),
            array(
                'name' => 'ZenGame',
                'path' => 'zengame/zengame.php',
                'version' => '1.2.1',
                'desc' => 'Bridge GamiPress para arquitetura headless. Agrega pontos, ranks, conquistas e atividades em um único endpoint com cache. Leaderboard público otimizado com JOIN.',
                'icon' => 'dashicons-games',
                'color' => '#ff6b35',
                'menu' => 'zengame-settings',
                'endpoints' => array(
                    'GET ' . $rest_base . 'zengame/v1/me' => 'Dashboard do usuário (JWT)',
                    'GET ' . $rest_base . 'zengame/v1/leaderboard' => 'Leaderboard público (Otimizado)',
                ),
                'docs_url' => \admin_url('admin.php?page=zengame-settings'),
            ),
            array(
                'name' => 'ZenEyer Auth Pro',
                'path' => 'zeneyer-auth/zeneyer-auth.php',
                'version' => '2.3.0',
                'desc' => 'JWT Authentication enterprise para headless React. Login com Google OAuth 2.0, Rate Limiter, Anti-Bot Shield e CORS configurável.',
                'icon' => 'dashicons-shield',
                'color' => '#9d4edd',
                'menu' => 'zeneyer-auth',
                'endpoints' => array(
                    'POST ' . $rest_base . 'zeneyer-auth/v1/login' => 'Login usuário/senha → JWT',
                    'POST ' . $rest_base . 'zeneyer-auth/v1/google' => 'Login Google OAuth → JWT',
                    'POST ' . $rest_base . 'zeneyer-auth/v1/refresh' => 'Renovar token JWT',
                    'GET ' . $rest_base . 'zeneyer-auth/v1/user' => 'Dados do user autenticado',
                ),
                'docs_url' => \admin_url('admin.php?page=zeneyer-auth'),
            ),
            array(
                'name' => 'Zen BIT (Events)',
                'path' => 'zen-bit/zen-bit.php',
                'version' => '3.0.0',
                'desc' => 'Proxy inteligente da API Bandsintown com cache SWR, canonical paths e geração automática de Schema.org MusicEvent para SEO.',
                'icon' => 'dashicons-tickets-alt',
                'color' => '#00ff88',
                'menu' => 'zen-bit-settings',
                'endpoints' => array(
                    'GET ' . $rest_base . 'zen-bit/v2/events' => 'Lista de eventos (limit, lang, mode)',
                    'GET ' . $rest_base . 'zen-bit/v2/events/{id}' => 'Evento único por ID',
                    'GET ' . $rest_base . 'zen-bit/v2/events/schema' => 'JSON-LD MusicEvent para Google',
                ),
                'docs_url' => \admin_url('admin.php?page=zen-bit-settings'),
            ),
        );
    }

    public function render_overview_page()
    {
        $php_version = \phpversion();
        $wp_version = \get_bloginfo('version');
        $memory = \size_format(\wp_convert_hr_to_bytes(\WP_MEMORY_LIMIT));
        $db_version = $GLOBALS['wpdb']->db_version();
        $plugins = $this->get_plugins_data();
        $active_count = 0;
        foreach ($plugins as $p) {
            if ($this->check_active($p['path']))
                $active_count++;
        }
        ?>
        <div class="zc-wrap">

            <!-- HEADER -->
            <header class="zc-header">
                <div class="zc-logo">
                    <div class="zc-logo-icon">
                        <span class="dashicons dashicons-superhero"></span>
                    </div>
                    <div>
                        <h1 class="zc-title">Zen<span>Core</span></h1>
                        <p class="zc-subtitle">Headless Architecture Mission Control</p>
                    </div>
                </div>
                <div class="zc-header-right">
                    <div class="zc-system-badge">
                        <span class="zc-pulse"></span>
                        <?php echo $active_count; ?>/<?php echo count($plugins); ?> SISTEMAS ONLINE
                    </div>
                    <div class="zc-sys-info">
                        <div class="zc-sys-item"><span>PHP</span> <?php echo \esc_html($php_version); ?></div>
                        <div class="zc-sys-item"><span>WP</span> <?php echo \esc_html($wp_version); ?></div>
                        <div class="zc-sys-item"><span>DB</span> <?php echo \esc_html($db_version); ?></div>
                        <div class="zc-sys-item"><span>MEM</span> <?php echo \esc_html($memory); ?></div>
                    </div>
                </div>
            </header>

            <!-- GRID DE PLUGINS -->
            <div class="zc-grid">
                <?php foreach ($plugins as $plugin):
                    $is_active = $this->check_active($plugin['path']);
                    $status_class = $is_active ? 'online' : 'offline';
                    $status_label = $is_active ? 'ONLINE' : 'OFFLINE';
                    $color = $plugin['color'];
                    ?>
                    <article class="zc-card <?php echo $status_class; ?>" style="--accent: <?php echo \esc_attr($color); ?>">

                        <div class="zc-card-header">
                            <div class="zc-icon"
                                style="background: <?php echo \esc_attr($color); ?>18; border-color: <?php echo \esc_attr($color); ?>30;">
                                <span class="dashicons <?php echo \esc_attr($plugin['icon']); ?>"
                                    style="color: <?php echo \esc_attr($color); ?>;"></span>
                            </div>
                            <div class="zc-status <?php echo $status_class; ?>">
                                <span class="zc-dot"></span>
                                <?php echo $status_label; ?>
                            </div>
                        </div>

                        <h2 class="zc-card-title"><?php echo \esc_html($plugin['name']); ?></h2>
                        <p class="zc-card-desc"><?php echo \esc_html($plugin['desc']); ?></p>

                        <!-- ENDPOINTS -->
                        <div class="zc-endpoints">
                            <div class="zc-endpoints-label">
                                <span class="dashicons dashicons-rest-api"></span> REST Endpoints
                            </div>
                            <?php foreach ($plugin['endpoints'] as $endpoint => $label):
                                $method = \strtok($endpoint, ' ');
                                $url = \trim(\substr($endpoint, \strlen($method)));
                                $method_class = \strtolower($method);
                                ?>
                                <div class="zc-endpoint-row">
                                    <span
                                        class="zc-method <?php echo \esc_attr($method_class); ?>"><?php echo \esc_html($method); ?></span>
                                    <code class="zc-url" title="<?php echo \esc_attr($label); ?>"><?php echo \esc_html($url); ?></code>
                                </div>
                            <?php endforeach; ?>
                        </div>

                        <div class="zc-card-footer">
                            <span class="zc-version">v<?php echo \esc_html($plugin['version']); ?></span>
                            <div class="zc-actions">
                                <?php if ($is_active): ?>
                                    <a href="<?php echo \esc_url($plugin['docs_url']); ?>" class="zc-btn primary"
                                        style="--accent: <?php echo \esc_attr($color); ?>">
                                        <span class="dashicons dashicons-admin-settings"></span> Configurar
                                    </a>
                                <?php else: ?>
                                    <a href="<?php echo \esc_url(\admin_url('plugins.php')); ?>" class="zc-btn danger">
                                        <span class="dashicons dashicons-warning"></span> Ativar
                                    </a>
                                <?php endif; ?>
                                <a href="<?php echo \esc_url(\rest_url()); ?>" target="_blank" class="zc-btn ghost"
                                    title="REST API Root">
                                    <span class="dashicons dashicons-external"></span>
                                </a>
                            </div>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>

            <!-- REST API QUICK TEST -->
            <section class="zc-section">
                <h2 class="zc-section-title"><span class="dashicons dashicons-rest-api"></span> Quick Links</h2>
                <div class="zc-quick-grid">
                    <a href="<?php echo \esc_url(\rest_url('zen-bit/v2/events?mode=upcoming&limit=3')); ?>" target="_blank"
                        class="zc-quick-card">
                        <span class="dashicons dashicons-tickets-alt"></span>
                        <span>Próximos Eventos (v2)</span>
                        <span class="dashicons dashicons-external"></span>
                    </a>
                    <a href="<?php echo \esc_url(\rest_url('zen-bit/v2/events/schema')); ?>" target="_blank"
                        class="zc-quick-card">
                        <span class="dashicons dashicons-search"></span>
                        <span>MusicEvent Schema (v2)</span>
                        <span class="dashicons dashicons-external"></span>
                    </a>
                    <a href="<?php echo \esc_url(\rest_url('zen-seo/v1/settings')); ?>" target="_blank" class="zc-quick-card">
                        <span class="dashicons dashicons-chart-line"></span>
                        <span>SEO Settings</span>
                        <span class="dashicons dashicons-external"></span>
                    </a>
                    <a href="<?php echo \esc_url(\rest_url('zengame/v1/leaderboard')); ?>" target="_blank" class="zc-quick-card">
                        <span class="dashicons dashicons-games"></span>
                        <span>Leaderboard</span>
                        <span class="dashicons dashicons-external"></span>
                    </a>
                    <a href="<?php echo \esc_url(\admin_url('plugins.php')); ?>" class="zc-quick-card">
                        <span class="dashicons dashicons-admin-plugins"></span>
                        <span>Todos os Plugins</span>
                        <span class="dashicons dashicons-arrow-right-alt2"></span>
                    </a>
                    <a href="https://github.com/MarceloEyer/djzeneyer" target="_blank" class="zc-quick-card">
                        <span class="dashicons dashicons-admin-generic"></span>
                        <span>GitHub Repo</span>
                        <span class="dashicons dashicons-external"></span>
                    </a>
                </div>
            </section>

            <footer class="zc-footer">
                <p>
                    <strong>Zen Control</strong> v3.0.0 &nbsp;·&nbsp;
                    Desenvolvido por \u003ca href=\"https://djzeneyer.com\" target=\"_blank\"\u003eDJ Zen Eyer\u003c/a\u003e
                    \u0026nbsp;\u00b7\u0026nbsp; \u003c?php echo \\date('Y'); ?\u003e
                \u003c/p\u003e
            </footer>
        </div>

        <style>
            /* ============================================================
                                           ZEN CONTROL v3.0 — Mission Control Dashboard
                                        ============================================================ */
            :root {
                --zc-bg: #06080f;
                --zc-surface: #0d1020;
                --zc-border: rgba(255, 255, 255, 0.06);
                --zc-text: rgba(255, 255, 255, 0.85);
                --zc-muted: rgba(255, 255, 255, 0.35);
                --zc-accent: #9d4edd;
                --zc-radius: 20px;
                --zc-font: 'Inter', 'SF Pro Display', system-ui, sans-serif;
                --zc-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
            }

            .zc-wrap {
                background: var(--zc-bg);
                color: var(--zc-text);
                padding: 48px 48px 48px 40px;
                margin: -20px 0 0 -20px;
                min-height: 100vh;
                font-family: var(--zc-font);
                box-sizing: border-box;
            }

            .zc-wrap * {
                box-sizing: border-box;
            }

            .zc-wrap a {
                text-decoration: none;
            }

            /* ---- HEADER ---- */
            .zc-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 56px;
                padding-bottom: 32px;
                border-bottom: 1px solid var(--zc-border);
                flex-wrap: wrap;
                gap: 20px;
            }

            .zc-logo {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .zc-logo-icon {
                width: 64px;
                height: 64px;
                background: rgba(157, 78, 221, 0.15);
                border: 1px solid rgba(157, 78, 221, 0.3);
                border-radius: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .zc-logo-icon .dashicons {
                color: #9d4edd;
                font-size: 34px;
                width: 34px;
                height: 34px;
            }

            .zc-title {
                font-size: 2.8rem;
                font-weight: 900;
                letter-spacing: -2px;
                color: #fff;
                margin: 0;
                line-height: 1;
            }

            .zc-title span {
                background: linear-gradient(135deg, #9d4edd, #c77dff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .zc-subtitle {
                color: var(--zc-muted);
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 2px;
                font-weight: 600;
                margin: 8px 0 0 0;
            }

            .zc-header-right {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 12px;
            }

            .zc-system-badge {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(0, 255, 136, 0.08);
                border: 1px solid rgba(0, 255, 136, 0.2);
                padding: 8px 16px;
                border-radius: 30px;
                font-size: 0.7rem;
                font-weight: 800;
                letter-spacing: 1.5px;
                color: #00ff88;
                text-transform: uppercase;
            }

            .zc-pulse {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #00ff88;
                display: inline-block;
                animation: zcPulse 2s infinite;
            }

            @keyframes zcPulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.5);
                }

                70% {
                    box-shadow: 0 0 0 8px rgba(0, 255, 136, 0);
                }

                100% {
                    box-shadow: 0 0 0 0 rgba(0, 255, 136, 0);
                }
            }

            .zc-sys-info {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .zc-sys-item {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid var(--zc-border);
                padding: 6px 14px;
                border-radius: 10px;
                font-size: 0.75rem;
                font-family: var(--zc-mono);
                color: var(--zc-muted);
            }

            .zc-sys-item span {
                color: var(--zc-accent);
                font-weight: 800;
                margin-right: 6px;
            }

            /* ---- GRID ---- */
            .zc-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                gap: 24px;
                margin-bottom: 48px;
            }

            /* ---- CARD ---- */
            .zc-card {
                background: var(--zc-surface);
                border: 1px solid var(--zc-border);
                border-radius: var(--zc-radius);
                padding: 32px;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
            }

            .zc-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, var(--accent, #9d4edd), transparent);
                opacity: 0;
                transition: opacity 0.3s;
            }

            .zc-card:hover {
                transform: translateY(-6px);
                border-color: rgba(255, 255, 255, 0.12);
            }

            .zc-card:hover::before {
                opacity: 1;
            }

            .zc-card:hover {
                box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
            }

            .zc-card.offline {
                opacity: 0.55;
            }

            /* ---- CARD HEADER ---- */
            .zc-card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }

            .zc-icon {
                width: 56px;
                height: 56px;
                border-radius: 16px;
                border: 1px solid;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s;
            }

            .zc-card:hover .zc-icon {
                transform: scale(1.08) rotate(-3deg);
            }

            .zc-icon .dashicons {
                font-size: 28px;
                width: 28px;
                height: 28px;
            }

            /* ---- STATUS ---- */
            .zc-status {
                font-size: 0.65rem;
                font-weight: 800;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                padding: 5px 12px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 7px;
                background: rgba(0, 0, 0, 0.3);
            }

            .zc-status.online {
                color: #00ff88;
                border: 1px solid rgba(0, 255, 136, 0.2);
            }

            .zc-status.offline {
                color: #ff5555;
                border: 1px solid rgba(255, 85, 85, 0.2);
            }

            .zc-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: currentColor;
                flex-shrink: 0;
            }

            .zc-status.online .zc-dot {
                animation: zcPulse 2s infinite;
            }

            /* ---- CARD TITLE & DESC ---- */
            .zc-card-title {
                font-size: 1.4rem;
                font-weight: 800;
                color: #fff;
                margin: 0 0 10px;
            }

            .zc-card-desc {
                font-size: 0.875rem;
                color: var(--zc-muted);
                line-height: 1.7;
                margin: 0 0 24px;
                flex-grow: 0;
            }

            /* ---- ENDPOINTS ---- */
            .zc-endpoints {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--zc-border);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 24px;
                flex-grow: 1;
            }

            .zc-endpoints-label {
                font-size: 0.65rem;
                font-weight: 800;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                color: var(--zc-muted);
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 12px;
            }

            .zc-endpoints-label .dashicons {
                font-size: 14px;
                width: 14px;
                height: 14px;
            }

            .zc-endpoint-row {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-bottom: 8px;
                font-size: 0.72rem;
            }

            .zc-endpoint-row:last-child {
                margin-bottom: 0;
            }

            .zc-method {
                font-family: var(--zc-mono);
                font-weight: 800;
                font-size: 0.6rem;
                padding: 2px 7px;
                border-radius: 5px;
                flex-shrink: 0;
                margin-top: 1px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .zc-method.get {
                background: rgba(0, 212, 255, 0.12);
                color: #00d4ff;
            }

            .zc-method.post {
                background: rgba(255, 107, 53, 0.12);
                color: #ff6b35;
            }

            .zc-url {
                font-family: var(--zc-mono);
                color: var(--zc-muted);
                font-size: 0.68rem;
                word-break: break-all;
                line-height: 1.5;
                background: none;
                border: none;
                padding: 0;
            }

            /* ---- CARD FOOTER ---- */
            .zc-card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid var(--zc-border);
                padding-top: 20px;
                margin-top: 8px;
            }

            .zc-version {
                font-family: var(--zc-mono);
                font-size: 0.7rem;
                color: var(--zc-muted);
                background: rgba(255, 255, 255, 0.04);
                padding: 4px 10px;
                border-radius: 8px;
            }

            .zc-actions {
                display: flex;
                gap: 8px;
            }

            /* ---- BUTTONS ---- */
            .zc-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 9px 16px;
                border-radius: 10px;
                font-size: 0.78rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                transition: all 0.25s ease;
                border: 1px solid transparent;
            }

            .zc-btn .dashicons {
                font-size: 14px;
                width: 14px;
                height: 14px;
            }

            .zc-btn.primary {
                background: rgba(157, 78, 221, 0.1);
                color: #c77dff;
                border-color: rgba(157, 78, 221, 0.25);
            }

            .zc-btn.primary:hover {
                background: var(--accent, #9d4edd);
                color: #fff;
                border-color: var(--accent, #9d4edd);
                box-shadow: 0 8px 20px rgba(157, 78, 221, 0.3);
            }

            .zc-btn.danger {
                background: rgba(255, 85, 85, 0.08);
                color: #ff5555;
                border-color: rgba(255, 85, 85, 0.2);
            }

            .zc-btn.danger:hover {
                background: #ff5555;
                color: #fff;
                border-color: #ff5555;
            }

            .zc-btn.ghost {
                background: rgba(255, 255, 255, 0.03);
                color: var(--zc-muted);
                border-color: var(--zc-border);
                padding: 9px 12px;
            }

            .zc-btn.ghost:hover {
                background: rgba(255, 255, 255, 0.08);
                color: #fff;
            }

            /* ---- QUICK LINKS SECTION ---- */
            .zc-section {
                margin-bottom: 48px;
            }

            .zc-section-title {
                font-size: 0.75rem;
                font-weight: 800;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: var(--zc-muted);
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 16px;
            }

            .zc-section-title .dashicons {
                font-size: 16px;
                width: 16px;
                height: 16px;
            }

            .zc-quick-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 12px;
            }

            .zc-quick-card {
                display: flex;
                align-items: center;
                gap: 12px;
                background: var(--zc-surface);
                border: 1px solid var(--zc-border);
                border-radius: 14px;
                padding: 16px 20px;
                color: var(--zc-muted);
                font-size: 0.85rem;
                font-weight: 600;
                transition: all 0.25s ease;
            }

            .zc-quick-card:hover {
                border-color: rgba(157, 78, 221, 0.4);
                color: #fff;
                background: rgba(157, 78, 221, 0.08);
                transform: translateY(-2px);
            }

            .zc-quick-card .dashicons {
                font-size: 18px;
                width: 18px;
                height: 18px;
            }

            .zc-quick-card .dashicons:last-child {
                margin-left: auto;
                opacity: 0.4;
                font-size: 14px;
            }

            /* ---- FOOTER ---- */
            .zc-footer {
                margin-top: 64px;
                text-align: center;
                border-top: 1px solid var(--zc-border);
                padding-top: 32px;
                color: var(--zc-muted);
                font-size: 0.8rem;
                letter-spacing: 0.5px;
            }

            .zc-footer strong {
                color: rgba(255, 255, 255, 0.5);
            }

            .zc-footer a {
                color: #c77dff;
            }

            .zc-footer a:hover {
                color: #fff;
            }
        </style>
        <?php
    }
}

function zen_plugins_overview_init()
{
    return \ZenEyer\Overview\Zen_Plugins_Overview::get_instance();
}

zen_plugins_overview_init();