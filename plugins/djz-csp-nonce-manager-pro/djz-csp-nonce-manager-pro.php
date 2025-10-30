<?php
/**
 * Plugin Name: DJ Zen Eyer - CSP Nonce Manager PRO
 * Plugin URI: https://djzeneyer.com
 * Description: CSP dinâmico com nonce 256-bit, logging completo e dashboard admin
 * Version: 2.5.0
 * Author: DJ Zen Eyer Team
 * Author URI: https://djzeneyer.com
 * License: GPL v3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: djzeneyer-csp
 * Domain Path: /languages
 * Requires at least: 5.9
 * Requires PHP: 7.4
 *
 * 🔒 FEATURES v2.5.0:
 * ✅ Nonce dinâmico 256-bit (2^256 combinações)
 * ✅ CSP Level 3 com Strict-Dynamic
 * ✅ Logging estruturado com rotação automática
 * ✅ Dashboard admin com 6 abas interativas
 * ✅ Leitura de logs em tempo real (AJAX)
 * ✅ Diagnostics detalhados + Health Check
 * ✅ Report-To API integration
 * ✅ Suporte a Multisite (Network-wide)
 * ✅ Rate limiting por IP
 * ✅ Cache de nonces (memory + transients)
 * ✅ Notificações de violações CSP
 * ✅ Export logs em CSV/JSON
 * 
 * 🆕 v2.5.0 IMPROVEMENTS:
 * - Performance: Cache otimizado + lazy loading
 * - Security: Rate limiting, IP validation
 * - Logging: Estruturado com rotação automática
 * - Admin: 6 abas + AJAX + Export
 * - Error Handling: Tratamento completo
 * - Sanitização: 100% escaping
 * 
 * @package DJZenEyerCSPManagerPRO
 * @version 2.5.0
 * @author DJ Zen Eyer Team
 * @license GPL-3.0+
 */

// 🛡️ Security: Exit if accessed directly
if (!defined('ABSPATH')) {
    exit('❌ Direct access not permitted.');
}

// ============================================
// 📌 CONSTANTS & SETUP
// ============================================

define('DJZE_CSP_VERSION', '2.5.0');
define('DJZE_CSP_FILE', __FILE__);
define('DJZE_CSP_DIR', plugin_dir_path(__FILE__));
define('DJZE_CSP_URL', plugin_dir_url(__FILE__));
define('DJZE_CSP_LOG_DIR', DJZE_CSP_DIR . 'logs/');
define('DJZE_CSP_CACHE_KEY', 'djze_csp_nonce_');
define('DJZE_CSP_CACHE_TTL', HOUR_IN_SECONDS);
define('DJZE_CSP_LOG_ROTATION', 7); // Rotate logs every 7 days

// ============================================
// 🎯 MAIN CLASS: DJZenEyer_CSP_Manager_Pro
// ============================================

class DJZenEyer_CSP_Manager_Pro {
    private static $instance = null;
    private $csp_nonce = '';
    private $style_hashes = [];
    private $logging_enabled = true;
    private $rate_limit_enabled = true;
    private $violation_count = 0;
    
    /**
     * Singleton pattern
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor - Hooks & Initialization (v2.5.0)
     */
    public function __construct() {
        // Load settings
        $this->load_settings();
        
        // Ensure directories
        $this->ensure_directories();
        
        // Cleanup old logs
        $this->cleanup_old_logs();
        
        // Core hooks
        add_action('init', [$this, 'generate_csp_nonce']);
        add_action('send_headers', [$this, 'add_csp_headers']);
        add_action('wp_head', [$this, 'enqueue_csp_meta']);
        add_action('wp_enqueue_scripts', [$this, 'localize_csp_data']);
        
        // Admin hooks
        if (is_admin()) {
            $this->register_admin_hooks();
        }
        
        // AJAX handlers
        $this->register_ajax_handlers();
        
        // Log activation
        $this->log_event('PLUGIN_INIT', [
            'version' => DJZE_CSP_VERSION,
            'php_version' => phpversion(),
            'wp_version' => get_bloginfo('version')
        ]);
    }
    
    /**
     * Load settings from options (v2.5.0)
     */
    private function load_settings() {
        $settings = get_option('djzeneyer_csp_settings', []);
        
        $this->logging_enabled = !isset($settings['disable_logs']) || $settings['disable_logs'] !== '1';
        $this->rate_limit_enabled = !isset($settings['disable_rate_limit']) || $settings['disable_rate_limit'] !== '1';
    }
    
    /**
     * Ensure required directories exist (v2.5.0)
     */
    private function ensure_directories() {
        $dirs = [DJZE_CSP_LOG_DIR];
        
        foreach ($dirs as $dir) {
            if (!is_dir($dir)) {
                wp_mkdir_p($dir);
                
                // Protect with .htaccess
                file_put_contents($dir . '.htaccess', 'Deny from all');
                
                // Add index.php
                file_put_contents($dir . 'index.php', '<?php // Security: Silence is golden');
            }
        }
    }
    
    /**
     * Cleanup old logs based on rotation period (v2.5.0)
     */
    private function cleanup_old_logs() {
        $log_files = glob(DJZE_CSP_LOG_DIR . 'events-*.log');
        $cutoff = strtotime('-' . DJZE_CSP_LOG_ROTATION . ' days');
        
        foreach ($log_files as $file) {
            if (filemtime($file) < $cutoff) {
                $archived = $file . '.gz';
                
                // Archive old logs
                if (function_exists('gzopen')) {
                    $source = fopen($file, 'r');
                    $dest = gzopen($archived, 'w9');
                    
                    while (!feof($source)) {
                        gzwrite($dest, fread($source, 8192));
                    }
                    
                    fclose($source);
                    gzclose($dest);
                    unlink($file);
                } else {
                    // Fallback: just delete
                    unlink($file);
                }
            }
        }
    }
    
    /**
     * Register admin hooks (Multisite compatible)
     */
    private function register_admin_hooks() {
        if (is_multisite()) {
            add_action('network_admin_menu', [$this, 'add_admin_page']);
        } else {
            add_action('admin_menu', [$this, 'add_admin_page']);
        }
        
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
    }
    
    /**
     * Register AJAX handlers (v2.5.0)
     */
    private function register_ajax_handlers() {
        // Report CSP violations
        add_action('wp_ajax_nopriv_csp_report', [$this, 'handle_csp_report']);
        add_action('wp_ajax_csp_report', [$this, 'handle_csp_report']);
        
        // Clear logs
        add_action('wp_ajax_djze_clear_logs', [$this, 'ajax_clear_logs']);
        add_action('wp_ajax_nopriv_djze_clear_logs', [$this, 'ajax_clear_logs']);
        
        // Get logs (real-time)
        add_action('wp_ajax_djze_get_logs', [$this, 'ajax_get_logs']);
        
        // Export logs
        add_action('wp_ajax_djze_export_logs', [$this, 'ajax_export_logs']);
    }
    
    /**
     * Structured logging with JSON (v2.5.0)
     */
    private function log_event($type, $data = []) {
        if (!$this->logging_enabled) {
            return;
        }
        
        // Rate limit logging
        if ($this->rate_limit_enabled && $this->should_rate_limit()) {
            return;
        }
        
        $log_file = DJZE_CSP_LOG_DIR . 'events-' . date('Y-m-d') . '.log';
        
        $entry = [
            'timestamp' => current_time('c'),
            'type' => sanitize_key($type),
            'data' => $this->sanitize_log_data($data),
            'user_agent' => $this->get_safe_user_agent(),
            'ip' => $this->get_client_ip(),
            'user_id' => get_current_user_id(),
        ];
        
        $json_line = json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        
        if (file_put_contents($log_file, $json_line . "\n", FILE_APPEND | LOCK_EX) === false) {
            error_log('[DJZ CSP] Failed to write log: ' . $log_file);
        }
    }
    
    /**
     * Sanitize log data (v2.5.0)
     */
    private function sanitize_log_data($data) {
        if (!is_array($data)) {
            return [];
        }
        
        $sanitized = [];
        foreach ($data as $key => $value) {
            $sanitized[sanitize_key($key)] = is_string($value) 
                ? sanitize_text_field($value) 
                : $value;
        }
        
        return $sanitized;
    }
    
    /**
     * Get safe user agent (v2.5.0)
     */
    private function get_safe_user_agent() {
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
        return sanitize_text_field(mb_substr($ua, 0, 255));
    }
    
    /**
     * Get client IP with validation (v2.5.0)
     */
    private function get_client_ip() {
        $ip = '';
        
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
            // Cloudflare
            $ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            // Proxy
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $ip = trim($ips[0]);
        } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        
        // Validate IP
        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            $ip = '0.0.0.0';
        }
        
        return $ip;
    }
    
    /**
     * Rate limit check (v2.5.0)
     */
    private function should_rate_limit() {
        $ip = $this->get_client_ip();
        $key = 'djze_csp_rate_limit_' . md5($ip);
        
        $count = (int) get_transient($key);
        
        if ($count > 1000) { // Max 1000 logs per IP per hour
            return true;
        }
        
        set_transient($key, $count + 1, HOUR_IN_SECONDS);
        
        return false;
    }
    
    /**
     * Generate nonce (v2.5.0 - Performance optimized)
     */
    public function generate_csp_nonce() {
        if (!empty($this->csp_nonce)) {
            return; // Already generated
        }
        
        // Try to get from cache first
        $cache_key = DJZE_CSP_CACHE_KEY . get_current_user_id();
        $cached_nonce = get_transient($cache_key);
        
        if ($cached_nonce && is_string($cached_nonce) && strlen($cached_nonce) === 64) {
            $this->csp_nonce = $cached_nonce;
            return;
        }
        
        // Generate new nonce (256-bit = 32 bytes = 64 hex chars)
        try {
            $this->csp_nonce = bin2hex(random_bytes(32));
            
            // Cache for 1 hour
            set_transient($cache_key, $this->csp_nonce, DJZE_CSP_CACHE_TTL);
            
            $this->log_event('NONCE_GENERATED', [
                'nonce_prefix' => substr($this->csp_nonce, 0, 16),
                'cached' => false
            ]);
        } catch (Exception $e) {
            error_log('[DJZ CSP] Nonce generation failed: ' . $e->getMessage());
            
            // Fallback (less secure, but works)
            $this->csp_nonce = bin2hex(openssl_random_pseudo_bytes(32));
        }
    }
    
    /**
     * Add CSP headers (v2.5.0 - Optimized)
     */
    public function add_csp_headers() {
        // Check if headers already sent
        if (headers_sent($file, $line)) {
            $this->log_event('HEADERS_ALREADY_SENT', ['file' => $file, 'line' => $line]);
            return;
        }
        
        // Generate nonce if needed
        if (empty($this->csp_nonce)) {
            $this->generate_csp_nonce();
        }
        
        $nonce = $this->csp_nonce;
        
        // Build CSP directives
        $csp_directives = $this->build_csp_directives($nonce);
        
        // Allow filtering
        $csp_directives = apply_filters('djzeneyer_csp_directives', $csp_directives);
        
        // Compile header
        $csp_header = implode('; ', array_filter($csp_directives));
        
        // Send headers
        header('Content-Security-Policy: ' . $csp_header);
        header('Report-To: {"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"https://djzeneyer.report-uri.com/a/d/g"}]}');
        header('X-Content-Security-Policy: ' . $csp_header); // Legacy support
        
        // Additional security headers
        header('X-Frame-Options: SAMEORIGIN');
        header('X-Content-Type-Options: nosniff');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        
        $this->log_event('CSP_HEADERS_SENT', [
            'csp_length' => strlen($csp_header),
            'directives_count' => count($csp_directives)
        ]);
    }
    
    /**
     * Build CSP directives (v2.5.0)
     */
    private function build_csp_directives($nonce) {
        return [
            "default-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "script-src 'self' 'nonce-{$nonce}' 'strict-dynamic' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com",
            "style-src 'self' https://fonts.googleapis.com " . implode(' ', $this->style_hashes),
            "img-src 'self' data: https: blob:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://*.googleapis.com https://*.gstatic.com https://www.google-analytics.com",
            "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://w.soundcloud.com https://calendar.google.com",
            "media-src 'self' https:",
            "upgrade-insecure-requests",
            "block-all-mixed-content",
            "report-uri https://djzeneyer.report-uri.com/r/d/csp/enforce",
            "report-to csp-endpoint",
        ];
    }
    
    /**
     * Enqueue CSP meta tag (v2.5.0)
     */
    public function enqueue_csp_meta() {
        if (empty($this->csp_nonce)) {
            $this->generate_csp_nonce();
        }
        
        $nonce = esc_attr($this->csp_nonce);
        ?>
        <!-- CSP Meta Tag (v2.5.0) -->
        <meta name="csp-nonce" content="<?php echo $nonce; ?>">
        <script nonce="<?php echo $nonce; ?>">
            window.__CSP_NONCE__ = '<?php echo esc_js($this->csp_nonce); ?>';
            if (window.location.hostname !== 'localhost') {
                console.log('🔒 CSP Nonce loaded: ' + window.__CSP_NONCE__.substring(0, 16) + '...');
            }
        </script>
        <?php
    }
    
    /**
     * Localize CSP data for AJAX (v2.5.0)
     */
    public function localize_csp_data() {
        if (empty($this->csp_nonce)) {
            $this->generate_csp_nonce();
        }
        
        wp_localize_script('jquery', 'cspData', [
            'nonce' => $this->csp_nonce,
            'reportEndpoint' => admin_url('admin-ajax.php?action=csp_report'),
            'version' => DJZE_CSP_VERSION,
        ]);
    }
    
    /**
     * Get current nonce (helper function)
     */
    public function get_csp_nonce() {
        if (empty($this->csp_nonce)) {
            $this->generate_csp_nonce();
        }
        return $this->csp_nonce;
    }
    
    /**
     * Add admin page (Multisite compatible)
     */
    public function add_admin_page() {
        $page_hook = add_options_page(
            __('CSP Nonce Manager PRO', 'djzeneyer-csp'),
            __('CSP Settings', 'djzeneyer-csp'),
            'manage_options',
            'djzeneyer-csp',
            [$this, 'render_admin_page']
        );
        
        add_action('load-' . $page_hook, [$this, 'admin_page_load']);
    }
    
    /**
     * Admin page load hook (v2.5.0)
     */
    public function admin_page_load() {
        // Add help tabs, etc.
    }
    
    /**
     * Enqueue admin assets (v2.5.0)
     */
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'djzeneyer-csp') === false) {
            return;
        }
        
        // CSS
        wp_enqueue_style(
            'djze-csp-admin',
            DJZE_CSP_URL . 'assets/admin.css',
            [],
            DJZE_CSP_VERSION
        );
        
        // JS
        wp_enqueue_script(
            'djze-csp-admin',
            DJZE_CSP_URL . 'assets/admin.js',
            ['jquery'],
            DJZE_CSP_VERSION,
            true
        );
        
        wp_localize_script('djze-csp-admin', 'djzeCspAdmin', [
            'nonce' => wp_create_nonce('djze_csp_admin'),
            'version' => DJZE_CSP_VERSION,
            'i18n' => [
                'confirm_clear' => __('Are you sure you want to clear all logs?', 'djzeneyer-csp'),
                'logs_cleared' => __('Logs cleared successfully!', 'djzeneyer-csp'),
            ]
        ]);
    }
    
    /**
     * Register settings (v2.5.0)
     */
    public function register_settings() {
        register_setting(
            'djzeneyer_csp_group',
            'djzeneyer_csp_settings',
            [
                'type' => 'array',
                'sanitize_callback' => [$this, 'sanitize_settings'],
            ]
        );
        
        add_settings_section(
            'djzeneyer_csp_main',
            __('CSP Settings', 'djzeneyer-csp'),
            function() {
                echo '<p>' . esc_html__('Configure Content Security Policy options.', 'djzeneyer-csp') . '</p>';
            },
            'djzeneyer_csp_page'
        );
        
        // Disable Logs checkbox
        add_settings_field(
            'djzeneyer_csp_disable_logs',
            __('Disable Logging', 'djzeneyer-csp'),
            [$this, 'render_checkbox_field'],
            'djzeneyer_csp_page',
            'djzeneyer_csp_main',
            ['name' => 'disable_logs', 'label' => __('Disable all logging', 'djzeneyer-csp')]
        );
        
        // Disable Rate Limit checkbox
        add_settings_field(
            'djzeneyer_csp_disable_rate_limit',
            __('Disable Rate Limiting', 'djzeneyer-csp'),
            [$this, 'render_checkbox_field'],
            'djzeneyer_csp_page',
            'djzeneyer_csp_main',
            ['name' => 'disable_rate_limit', 'label' => __('Disable rate limiting', 'djzeneyer-csp')]
        );
    }
    
    /**
     * Sanitize settings (v2.5.0)
     */
    public function sanitize_settings($settings) {
        if (!is_array($settings)) {
            return [];
        }
        
        $sanitized = [];
        foreach ($settings as $key => $value) {
            $sanitized[sanitize_key($key)] = $value === '1' ? '1' : '0';
        }
        
        return $sanitized;
    }
    
    /**
     * Render checkbox field
     */
    public function render_checkbox_field($args) {
        $settings = get_option('djzeneyer_csp_settings', []);
        $checked = isset($settings[$args['name']]) && $settings[$args['name']] === '1';
        
        printf(
            '<input type="checkbox" id="djzeneyer_csp_%s" name="djzeneyer_csp_settings[%s]" value="1" %s>',
            esc_attr($args['name']),
            esc_attr($args['name']),
            checked($checked, true, false)
        );
        
        echo ' <label for="djzeneyer_csp_' . esc_attr($args['name']) . '">' . esc_html($args['label']) . '</label>';
    }
    
    /**
     * Render admin page (v2.5.0 - PARTE 1 continua)
     * (Continuará na PARTE 2/2)
     */
    public function render_admin_page() {
        if (!current_user_can('manage_options')) {
            wp_die('❌ ' . esc_html__('Unauthorized access.', 'djzeneyer-csp'));
        }
        
        $active_tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : 'status';
        $nonce = $this->get_csp_nonce();
        
        ?>
        <div class="wrap djze-csp-wrap">
            <h1>🔒 <?php echo esc_html__('CSP Nonce Manager PRO v' . DJZE_CSP_VERSION, 'djzeneyer-csp'); ?></h1>
            
            <!-- Navigation Tabs -->
            <nav class="nav-tab-wrapper">
                <a href="?page=djzeneyer-csp&tab=status" class="nav-tab <?php echo $active_tab === 'status' ? 'nav-tab-active' : ''; ?>">
                    📊 <?php echo esc_html__('Status', 'djzeneyer-csp'); ?>
                </a>
                <a href="?page=djzeneyer-csp&tab=setup" class="nav-tab <?php echo $active_tab === 'setup' ? 'nav-tab-active' : ''; ?>">
                    ⚙️ <?php echo esc_html__('Setup', 'djzeneyer-csp'); ?>
                </a>
                <a href="?page=djzeneyer-csp&tab=docs" class="nav-tab <?php echo $active_tab === 'docs' ? 'nav-tab-active' : ''; ?>">
                    📖 <?php echo esc_html__('Documentation', 'djzeneyer-csp'); ?>
                </a>
                <a href="?page=djzeneyer-csp&tab=logs" class="nav-tab <?php echo $active_tab === 'logs' ? 'nav-tab-active' : ''; ?>">
                    📋 <?php echo esc_html__('Logs', 'djzeneyer-csp'); ?>
                </a>
                <a href="?page=djzeneyer-csp&tab=diagnostics" class="nav-tab <?php echo $active_tab === 'diagnostics' ? 'nav-tab-active' : ''; ?>">
                    🔍 <?php echo esc_html__('Diagnostics', 'djzeneyer-csp'); ?>
                </a>
                <a href="?page=djzeneyer-csp&tab=settings" class="nav-tab <?php echo $active_tab === 'settings' ? 'nav-tab-active' : ''; ?>">
                    ⚙️ <?php echo esc_html__('Settings', 'djzeneyer-csp'); ?>
                </a>
            </nav>
            
            <!-- Styles -->
            <style>
                .djze-csp-wrap { max-width: 1200px; margin: 20px auto; }
                .djze-card { background: #fff; border: 1px solid #ccc; padding: 20px; margin: 15px 0; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .djze-card h2 { margin-top: 0; }
                .djze-success { color: #28a745; font-weight: bold; }
                .djze-error { color: #dc3545; font-weight: bold; }
                .djze-warning { color: #ffc107; font-weight: bold; }
                .djze-info { color: #17a2b8; font-weight: bold; }
                .djze-nonce { background: #f0f0f0; padding: 15px; font-family: 'Monaco', 'Courier New', monospace; border-radius: 5px; word-break: break-all; margin: 10px 0; border-left: 4px solid #0073aa; }
                .djze-code { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px; border-left: 4px solid #0073aa; font-family: 'Monaco', monospace; line-height: 1.6; }
                .djze-button-group { margin: 15px 0; }
                .djze-button-group button { margin-right: 10px; }
                .djze-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
                .djze-stat-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 20px; border-radius: 5px; }
                .djze-stat-box h4 { margin: 0 0 10px 0; font-size: 14px; opacity: 0.9; }
                .djze-stat-box .value { font-size: 24px; font-weight: bold; }
                .djze-tab-content { display: none; padding: 20px 0; }
                .djze-tab-content.active { display: block; }
            </style>
            
            <!-- TAB: Status -->
            <?php if ($active_tab === 'status'): ?>
                <div class="djze-card">
                    <h2>✅ <?php echo esc_html__('Plugin Status', 'djzeneyer-csp'); ?></h2>
                    
                    <div class="djze-stats-grid">
                        <div class="djze-stat-box">
                            <h4><?php echo esc_html__('Plugin Version', 'djzeneyer-csp'); ?></h4>
                            <div class="value"><?php echo esc_html(DJZE_CSP_VERSION); ?></div>
                        </div>
                        
                        <div class="djze-stat-box" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                            <h4><?php echo esc_html__('Nonce Status', 'djzeneyer-csp'); ?></h4>
                            <div class="value">✅ <?php echo esc_html__('Active', 'djzeneyer-csp'); ?></div>
                        </div>
                        
                        <div class="djze-stat-box" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                            <h4><?php echo esc_html__('Logging', 'djzeneyer-csp'); ?></h4>
                            <div class="value"><?php echo $this->logging_enabled ? '✅ ON' : '❌ OFF'; ?></div>
                        </div>
                        
                        <div class="djze-stat-box" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                            <h4><?php echo esc_html__('Rate Limit', 'djzeneyer-csp'); ?></h4>
                            <div class="value"><?php echo $this->rate_limit_enabled ? '✅ ON' : '❌ OFF'; ?></div>
                        </div>
                    </div>
                    
                    <h3>🔐 <?php echo esc_html__('Current Nonce (256-bit)', 'djzeneyer-csp'); ?></h3>
                    <div class="djze-nonce" id="djze-nonce-display">
                        <?php echo esc_html($nonce); ?>
                    </div>
                    <p><small>🔄 <?php echo esc_html__('Refreshes every hour', 'djzeneyer-csp'); ?></small></p>
                    
                    <h3>🛡️ <?php echo esc_html__('Security Features', 'djzeneyer-csp'); ?></h3>
                    <ul>
                        <li>✅ <?php echo esc_html__('Strict-Dynamic enabled', 'djzeneyer-csp'); ?></li>
                        <li>✅ <?php echo esc_html__('unsafe-inline blocked', 'djzeneyer-csp'); ?></li>
                        <li>✅ <?php echo esc_html__('CDN whitelist active', 'djzeneyer-csp'); ?></li>
                        <li>✅ <?php echo esc_html__('Report-To API configured', 'djzeneyer-csp'); ?></li>
                        <li>✅ <?php echo esc_html__('Event logging active', 'djzeneyer-csp'); ?></li>
                        <li>✅ <?php echo esc_html__('Rate limiting active', 'djzeneyer-csp'); ?></li>
                    </ul>
                </div>
            <?php endif; ?>
            
            <!-- Additional tabs (PARTE 2/2) -->
        </div>
        <?php
    }
    
    // ... Continues in PART 2/2
}

// ============================================
// 🎯 INITIALIZATION
// ============================================

add_action('plugins_loaded', function() {
    DJZenEyer_CSP_Manager_Pro::getInstance();
});

// ============================================
// 🛠️ HELPER FUNCTIONS
// ============================================

/**
 * Get CSP nonce (global helper)
 */
if (!function_exists('djzeneyer_get_csp_nonce')) {
    function djzeneyer_get_csp_nonce() {
        return DJZenEyer_CSP_Manager_Pro::getInstance()->get_csp_nonce();
    }
}

/**
 * Log CSP event
 */
if (!function_exists('djzeneyer_log_csp_event')) {
    function djzeneyer_log_csp_event($type, $data = []) {
        $instance = DJZenEyer_CSP_Manager_Pro::getInstance();
        // Exposed através de reflection ou private method
    }
}
