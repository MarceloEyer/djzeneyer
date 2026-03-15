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

    public static function activate(): void
    {
        // Placeholder for activation logic.
    }

    public static function deactivate(): void
    {
        // Placeholder for deactivation logic.
    }

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
                'version' => '8.1.1',
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
                'version' => '1.3.7',
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
                    'GET ' . $rest_base . 'zeneyer-auth/v1/session' => 'Check estado da sessão JWT',
                ),
                'docs_url' => \admin_url('admin.php?page=zeneyer-auth'),
            ),
            array(
                'name' => 'Zen BIT (Events)',
                'path' => 'zen-bit/zen-bit.php',
                'version' => '3.1.0',
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
        $memory_limit = \WP_MEMORY_LIMIT;
        $memory_usage = \function_exists('memory_get_usage') ? \size_format(\memory_get_usage(true)) : 'N/A';
        $db_version = $GLOBALS['wpdb']->db_version();
        $plugins = $this->get_plugins_data();
        $active_count = 0;
        foreach ($plugins as $p) {
            if ($this->check_active($p['path']))
                $active_count++;
        }
        $integrity = \round(($active_count / \count($plugins)) * 100);
        ?>
        <div class="zc-hud">
            <!-- BACKGROUND FX -->
            <div class="zc-scanlines"></div>
            <div class="zc-digital-grid"></div>

            <!-- TOP NAVIGATION / HUD HEADER -->
            <header class="zc-header">
                <div class="zc-branding">
                    <div class="zc-orb-container">
                        <div class="zc-orb" style="--integrity: <?php echo $integrity; ?>%">
                            <span class="dashicons dashicons-superhero"></span>
                        </div>
                        <svg class="zc-integrity-svg">
                            <circle class="zc-integrity-bg" cx="40" cy="40" r="36"></circle>
                            <circle class="zc-integrity-fill" cx="40" cy="40" r="36" style="stroke-dashoffset: <?php echo 226 - (226 * $integrity / 100); ?>"></circle>
                        </svg>
                    </div>
                    <div>
                        <h1 class="zc-main-title">ZEN<span>CORE</span></h1>
                        <p class="zc-mission-status">MISSION STATUS: <span class="<?php echo $integrity === 100 ? 'status-nominal' : 'status-warning'; ?>"><?php echo $integrity === 100 ? 'OPERATIONAL' : 'DEGRADED'; ?></span></p>
                    </div>
                </div>

                <!-- CHARACTER STATS (System Info) -->
                <div class="zc-stats-hud">
                    <div class="zc-stat-item" title="Memory Stability">
                        <span class="zc-stat-label">STR</span>
                        <span class="zc-stat-value"><?php echo \esc_html($memory_limit); ?></span>
                        <div class="zc-stat-bar"><div style="width: 85%"></div></div>
                    </div>
                    <div class="zc-stat-item" title="Logic Integrity (Versions)">
                        <span class="zc-stat-label">INT</span>
                        <span class="zc-stat-value">v<?php echo \esc_html($php_version); ?></span>
                        <div class="zc-stat-bar"><div style="width: 92%"></div></div>
                    </div>
                    <div class="zc-stat-item" title="Execution Precision">
                        <span class="zc-stat-label">DEX</span>
                        <span class="zc-stat-value">WP <?php echo \esc_html($wp_version); ?></span>
                        <div class="zc-stat-bar"><div style="width: 78%"></div></div>
                    </div>
                    <div class="zc-stat-item" title="Plugin Synergy">
                        <span class="zc-stat-label">LUK</span>
                        <span class="zc-stat-value"><?php echo $active_count; ?>/<?php echo \count($plugins); ?></span>
                        <div class="zc-stat-bar"><div style="width: <?php echo $integrity; ?>%"></div></div>
                    </div>
                </div>
            </header>

            <!-- MAIN GRID / SKILL TREE -->
            <div class="zc-skill-tree">
                <?php foreach ($plugins as $plugin):
                    $is_active = $this->check_active($plugin['path']);
                    $rarity = \strpos(\strtolower($plugin['name']), 'pro') !== false ? 'legendary' : 'rare';
                    $accent = $plugin['color'];
                    ?>
                    <article class="zc-skill-card <?php echo $is_active ? 'active' : 'inactive'; ?> rarity-<?php echo $rarity; ?>" style="--accent: <?php echo \esc_attr($accent); ?>">
                        <div class="zc-card-glow"></div>
                        <div class="zc-card-inner">
                            <div class="zc-card-header">
                                <div class="zc-skill-icon">
                                    <span class="dashicons <?php echo \esc_attr($plugin['icon']); ?>"></span>
                                    <div class="zc-icon-pulse"></div>
                                </div>
                                <div class="zc-rarity-badge"><?php echo \strtoupper($rarity); ?></div>
                            </div>

                            <h2 class="zc-skill-name"><?php echo \esc_html($plugin['name']); ?></h2>
                            <p class="zc-skill-desc"><?php echo \esc_html($plugin['desc']); ?></p>

                            <!-- TERMINAL ENDPOINTS -->
                            <div class="zc-terminal">
                                <div class="zc-terminal-header">
                                    <span class="zc-terminal-dot red"></span>
                                    <span class="zc-terminal-dot yellow"></span>
                                    <span class="zc-terminal-dot green"></span>
                                    <span class="zc-terminal-title">active_endpoints.sh</span>
                                </div>
                                <div class="zc-terminal-body">
                                    <?php foreach ($plugin['endpoints'] as $endpoint => $label): 
                                        $method = \strtok($endpoint, ' ');
                                        $url = \trim(\substr($endpoint, \strlen($method)));
                                        ?>
                                        <div class="zc-terminal-line">
                                            <span class="zc-m-badge m-<?php echo \strtolower($method); ?>"><?php echo $method; ?></span>
                                            <span class="zc-line-path"><?php echo \esc_html($url); ?></span>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </div>

                            <div class="zc-card-footer">
                                <div class="zc-version-tag">VER <?php echo \esc_html($plugin['version']); ?></div>
                                <div class="zc-actions">
                                    <?php if ($is_active): ?>
                                        <a href="<?php echo \esc_url($plugin['docs_url']); ?>" class="zc-action-btn primary">
                                            <span>EXECUTE</span>
                                        </a>
                                    <?php else: ?>
                                        <a href="<?php echo \esc_url(\admin_url('plugins.php')); ?>" class="zc-action-btn danger">
                                            <span>ACTIVATE</span>
                                        </a>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>

            <!-- FOOTER HUD -->
            <footer class="zc-footer-hud">
                <div class="zc-quick-launch">
                    <h3 class="zc-ql-label">QUICK LAUNCH</h3>
                    <div class="zc-ql-grid">
                        <a href="<?php echo \rest_url('zen-bit/v2/events?mode=upcoming&limit=3'); ?>" target="_blank" class="zc-ql-item">LIVE EVENTS</a>
                        <a href="<?php echo \rest_url('zen-seo/v1/settings'); ?>" target="_blank" class="zc-ql-item">SEO ENGINE</a>
                        <a href="<?php echo \rest_url('zengame/v1/leaderboard'); ?>" target="_blank" class="zc-ql-item">LEADERBOARD</a>
                        <a href="https://github.com/MarceloEyer/djzeneyer" target="_blank" class="zc-ql-item">SOURCE_CODE</a>
                    </div>
                </div>
                <div class="zc-copyright">
                    <p>ZEN_CORE_SYSTEM [READY] &copy; <?php echo \date('Y'); ?> // DESIGNED BY <a href="https://djzeneyer.com" target="_blank">DJ_ZEN_EYER</a></p>
                </div>
            </footer>
        </div>

        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@500;800&display=swap');

            :root {
                --zc-bg: #06080f;
                --zc-surface: rgba(13, 16, 32, 0.7);
                --zc-border: rgba(255, 255, 255, 0.08);
                --zc-text: #e0e0e0;
                --zc-accent: #9d4edd;
                --zc-neon-purple: #9d4edd;
                --zc-neon-cyan: #00d4ff;
                --zc-neon-green: #00ff88;
                --zc-neon-red: #ff5555;
                --zc-font: 'Inter', sans-serif;
                --zc-mono: 'JetBrains Mono', monospace;
            }

            .zc-hud {
                background: var(--zc-bg);
                color: var(--zc-text);
                min-height: 100vh;
                padding: 40px;
                margin-left: -20px;
                margin-top: -20px;
                font-family: var(--zc-font);
                position: relative;
                overflow: hidden;
                box-sizing: border-box;
            }

            .zc-hud * { box-sizing: border-box; }

            /* FX ELEMENTS */
            .zc-scanlines {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%), 
                            linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02));
                background-size: 100% 4px, 3px 100%;
                pointer-events: none;
                z-index: 10;
            }

            .zc-digital-grid {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background-image: 
                    linear-gradient(var(--zc-border) 1px, transparent 1px),
                    linear-gradient(90deg, var(--zc-border) 1px, transparent 1px);
                background-size: 50px 50px;
                background-position: center;
                mask-image: radial-gradient(circle at center, black, transparent 80%);
                pointer-events: none;
                opacity: 0.4;
            }

            /* HEADER */
            .zc-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 60px;
                position: relative;
                z-index: 20;
                padding-bottom: 30px;
                border-bottom: 2px solid var(--zc-border);
            }

            .zc-branding {
                display: flex;
                align-items: center;
                gap: 25px;
            }

            .zc-orb-container {
                position: relative;
                width: 80px;
                height: 80px;
            }

            .zc-orb {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, rgba(157, 78, 221, 0.4), transparent);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 0 30px rgba(157, 78, 221, 0.2);
            }

            .zc-orb .dashicons {
                font-size: 32px;
                width: 32px;
                height: 32px;
                color: #fff;
                filter: drop-shadow(0 0 10px var(--zc-neon-purple));
                animation: breath 3s infinite ease-in-out;
            }

            .zc-integrity-svg {
                position: absolute;
                top: 0; left: 0; width: 80px; height: 80px;
                transform: rotate(-90deg);
            }

            .zc-integrity-bg { fill: none; stroke: var(--zc-border); stroke-width: 4; }
            .zc-integrity-fill {
                fill: none;
                stroke: var(--zc-neon-green);
                stroke-width: 4;
                stroke-linecap: round;
                stroke-dasharray: 226;
                transition: stroke-dashoffset 1s ease-out;
            }

            .zc-main-title {
                font-size: 3.5rem;
                font-weight: 900;
                margin: 0;
                letter-spacing: -4px;
                line-height: 0.9;
                color: #fff;
                text-shadow: 0 0 20px rgba(157, 78, 221, 0.4);
            }

            .zc-main-title span {
                background: linear-gradient(to right, var(--zc-neon-purple), #fff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .zc-mission-status {
                margin: 5px 0 0;
                font-family: var(--zc-mono);
                font-size: 0.7rem;
                letter-spacing: 2px;
                color: var(--zc-muted);
            }

            .status-nominal { color: var(--zc-neon-green); text-shadow: 0 0 10px var(--zc-neon-green); }
            .status-warning { color: gold; text-shadow: 0 0 10px gold; }

            /* STATS HUD */
            .zc-stats-hud {
                display: flex;
                gap: 30px;
            }

            .zc-stat-item {
                width: 140px;
                padding: 15px;
                background: var(--zc-surface);
                border: 1px solid var(--zc-border);
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }

            .zc-stat-label {
                display: block;
                font-family: var(--zc-mono);
                font-weight: 800;
                font-size: 0.65rem;
                color: var(--zc-neon-purple);
                margin-bottom: 5px;
            }

            .zc-stat-value {
                display: block;
                font-size: 1.1rem;
                font-weight: 900;
                color: #fff;
                margin-bottom: 10px;
            }

            .zc-stat-bar {
                height: 4px;
                background: rgba(255,255,255,0.05);
                border-radius: 2px;
                overflow: hidden;
            }

            .zc-stat-bar div {
                height: 100%;
                background: linear-gradient(90deg, var(--zc-neon-purple), var(--zc-neon-cyan));
                box-shadow: 0 0 10px var(--zc-neon-purple);
            }

            /* SKILL TREE / CARDS */
            .zc-skill-tree {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                gap: 25px;
                position: relative;
                z-index: 20;
            }

            .zc-skill-card {
                position: relative;
                border-radius: 24px;
                padding: 2px;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                background: var(--zc-border);
            }

            .zc-skill-card.active {
                background: linear-gradient(135deg, var(--accent), transparent 50%);
            }

            .zc-skill-card:hover {
                transform: translateY(-10px) scale(1.02);
                z-index: 30;
            }

            .zc-card-glow {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at center, var(--accent), transparent 70%);
                opacity: 0;
                transition: opacity 0.4s;
                pointer-events: none;
                filter: blur(40px);
            }

            .zc-skill-card:hover .zc-card-glow { opacity: 0.15; }

            .zc-card-inner {
                background: var(--zc-bg);
                border-radius: 23px;
                padding: 30px;
                height: 100%;
                display: flex;
                flex-direction: column;
                position: relative;
                overflow: hidden;
            }

            .zc-card-inner::after {
                content: '';
                position: absolute;
                top: 0; left: -100%; width: 100%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
                transition: left 0.6s;
            }

            .zc-skill-card:hover .zc-card-inner::after { left: 100%; }

            .zc-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 25px;
            }

            .zc-skill-icon {
                width: 60px;
                height: 60px;
                background: rgba(0,0,0,0.4);
                border: 2px solid var(--accent);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.3);
            }

            .zc-skill-icon .dashicons {
                font-size: 30px;
                width: 30px;
                height: 30px;
                color: var(--accent);
            }

            .zc-icon-pulse {
                position: absolute;
                top: -2px; left: -2px; right: -2px; bottom: -2px;
                border: 2px solid var(--accent);
                border-radius: 16px;
                opacity: 0;
                animation: icon-pulse 2s infinite;
            }

            @keyframes icon-pulse {
                0% { transform: scale(1); opacity: 0.8; }
                100% { transform: scale(1.3); opacity: 0; }
            }

            .zc-rarity-badge {
                font-family: var(--zc-mono);
                font-size: 0.6rem;
                font-weight: 800;
                padding: 4px 12px;
                border-radius: 20px;
                background: rgba(var(--accent-rgb), 0.1);
                color: var(--accent);
                border: 1px solid var(--accent);
            }

            .rarity-legendary { --accent-rgb: 157, 78, 221; }
            .rarity-rare { --accent-rgb: 0, 212, 255; }

            .zc-skill-name {
                font-size: 1.6rem;
                font-weight: 900;
                color: #fff;
                margin: 0 0 10px;
                letter-spacing: -0.5px;
            }

            .zc-skill-desc {
                font-size: 0.9rem;
                line-height: 1.6;
                color: var(--zc-muted);
                margin-bottom: 25px;
                min-height: 80px;
            }

            /* TERMINAL */
            .zc-terminal {
                background: #000;
                border-radius: 10px;
                border: 1px solid var(--zc-border);
                margin-bottom: 25px;
                overflow: hidden;
            }

            .zc-terminal-header {
                background: #1a1a1a;
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .zc-terminal-dot { width: 6px; height: 6px; border-radius: 50%; }
            .red { background: #ff5555; }
            .yellow { background: #f1fa8c; }
            .green { background: #50fa7b; }

            .zc-terminal-title {
                margin-left: 6px;
                font-family: var(--zc-mono);
                font-size: 0.6rem;
                color: var(--zc-muted);
            }

            .zc-terminal-body {
                padding: 15px;
                font-family: var(--zc-mono);
                font-size: 0.7rem;
            }

            .zc-terminal-line {
                display: flex;
                gap: 10px;
                margin-bottom: 6px;
                opacity: 0.8;
            }

            .zc-m-badge {
                font-weight: 800;
                flex-shrink: 0;
            }
            .m-get { color: var(--zc-neon-cyan); }
            .m-post { color: var(--zc-neon-purple); }
            .zc-line-path { color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

            /* CARD FOOTER */
            .zc-card-footer {
                margin-top: auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid var(--zc-border);
                padding-top: 20px;
            }

            .zc-version-tag {
                font-family: var(--zc-mono);
                font-size: 0.7rem;
                color: #555;
            }

            .zc-action-btn {
                background: var(--accent);
                color: #fff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 10px;
                font-weight: 800;
                font-size: 0.75rem;
                letter-spacing: 1px;
                transition: all 0.3s;
                box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.3);
            }

            .zc-action-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 0 30px var(--accent);
            }

            .zc-action-btn.danger { background: var(--zc-neon-red); }

            /* FOOTER HUD */
            .zc-footer-hud {
                margin-top: 80px;
                border-top: 2px solid var(--zc-border);
                padding-top: 40px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                z-index: 20;
                position: relative;
            }

            .zc-ql-label {
                font-family: var(--zc-mono);
                font-size: 0.7rem;
                letter-spacing: 3px;
                color: var(--zc-muted);
                margin-bottom: 20px;
            }

            .zc-ql-grid {
                display: flex;
                gap: 20px;
            }

            .zc-ql-item {
                color: var(--zc-muted);
                text-decoration: none;
                font-weight: 800;
                font-size: 0.75rem;
                padding-bottom: 5px;
                border-bottom: 1px solid transparent;
                transition: all 0.3s;
            }

            .zc-ql-item:hover {
                color: var(--zc-neon-purple);
                border-color: var(--zc-neon-purple);
            }

            .zc-copyright {
                font-family: var(--zc-mono);
                font-size: 0.65rem;
                color: #444;
            }
            .zc-copyright a { color: var(--zc-neon-purple); text-decoration: none; }

            @keyframes breath {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
            }
        </style>
        <?php
    }
}

function djzeneyer_zen_plugins_overview_init()
{
    if (\is_admin()) {
        return \ZenEyer\Overview\Zen_Plugins_Overview::get_instance();
    }
    return null;
}

djzeneyer_zen_plugins_overview_init();

\register_activation_hook(__FILE__, [Zen_Plugins_Overview::class, 'activate']);
\register_deactivation_hook(__FILE__, [Zen_Plugins_Overview::class, 'deactivate']);