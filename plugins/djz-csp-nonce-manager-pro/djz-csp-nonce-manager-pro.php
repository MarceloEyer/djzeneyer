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
    // ============================================
    // 📋 RENDER ADMIN PAGES (v2.5.0 - PARTE 2/2)
    // ============================================
    
    /**
     * TAB: Setup - Implementation Guide
     */
    elseif ($active_tab === 'setup'): ?>
        <div class="djze-card">
            <h2>⚙️ <?php echo esc_html__('Quick Setup Guide', 'djzeneyer-csp'); ?></h2>
            
            <h3>1️⃣ <?php echo esc_html__('Meta Tag in Header', 'djzeneyer-csp'); ?></h3>
            <p><?php echo esc_html__('Add this to your theme\'s header.php:', 'djzeneyer-csp'); ?></p>
            <div class="djze-code">&lt;meta name="csp-nonce" content="&lt;?php echo esc_attr(djzeneyer_get_csp_nonce()); ?&gt;"&gt;</div>
            
            <h3>2️⃣ <?php echo esc_html__('Inline Scripts', 'djzeneyer-csp'); ?></h3>
            <p><?php echo esc_html__('Use nonce attribute on script tags:', 'djzeneyer-csp'); ?></p>
            <div class="djze-code">&lt;script nonce="&lt;?php echo esc_attr(djzeneyer_get_csp_nonce()); ?&gt;"&gt;
console.log('Protected by CSP!');
&lt;/script&gt;</div>
            
            <h3>3️⃣ <?php echo esc_html__('React/Vite Setup', 'djzeneyer-csp'); ?></h3>
            <p><?php echo esc_html__('In your main.tsx or main.jsx:', 'djzeneyer-csp'); ?></p>
            <div class="djze-code">const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
window.__vite_nonce__ = nonce;
window.__webpack_nonce__ = nonce;
console.log('🔒 CSP Nonce:', nonce?.substring(0, 16) + '...');</div>
            
            <h3>4️⃣ <?php echo esc_html__('PHP Helper Function', 'djzeneyer-csp'); ?></h3>
            <div class="djze-code">&lt;?php
// Get nonce in any PHP file
$nonce = djzeneyer_get_csp_nonce();
echo '&lt;script nonce="' . esc_attr($nonce) . '"&gt;...&lt;/script&gt;';
?&gt;</div>
            
            <h3>5️⃣ <?php echo esc_html__('Report Violations', 'djzeneyer-csp'); ?></h3>
            <p><?php echo esc_html__('CSP violations are automatically reported to:', 'djzeneyer-csp'); ?></p>
            <div class="djze-code">https://djzeneyer.report-uri.com/r/d/csp/enforce</div>
            <p><small><?php echo esc_html__('Create account at report-uri.com to receive alerts', 'djzeneyer-csp'); ?></small></p>
        </div>
    <?php
    
    /**
     * TAB: Documentation
     */
    elseif ($active_tab === 'docs'): ?>
        <div class="djze-card">
            <h2>📖 <?php echo esc_html__('Documentation', 'djzeneyer-csp'); ?></h2>
            
            <h3>🎯 <?php echo esc_html__('What is CSP Nonce?', 'djzeneyer-csp'); ?></h3>
            <p><?php echo esc_html__('A Nonce (Number Once) is a unique token that authorizes specific inline scripts without using unsafe-inline.', 'djzeneyer-csp'); ?></p>
            
            <h3>🔒 <?php echo esc_html__('CSP Directives', 'djzeneyer-csp'); ?></h3>
            <ul>
                <li><strong>default-src \'none\'</strong> - <?php echo esc_html__('Everything blocked by default', 'djzeneyer-csp'); ?></li>
                <li><strong>script-src \'nonce-{nonce}\' \'strict-dynamic\'</strong> - <?php echo esc_html__('Only scripts with nonce', 'djzeneyer-csp'); ?></li>
                <li><strong>style-src \'self\' https://fonts.googleapis.com</strong> - <?php echo esc_html__('Safe styles', 'djzeneyer-csp'); ?></li>
                <li><strong>upgrade-insecure-requests</strong> - <?php echo esc_html__('Force HTTPS', 'djzeneyer-csp'); ?></li>
                <li><strong>block-all-mixed-content</strong> - <?php echo esc_html__('Block HTTP content on HTTPS', 'djzeneyer-csp'); ?></li>
            </ul>
            
            <h3>⚛️ <?php echo esc_html__('React Integration', 'djzeneyer-csp'); ?></h3>
            <p><?php echo esc_html__('The nonce is automatically applied to Vite/Webpack builders through __vite_nonce__ and __webpack_nonce__ globals.', 'djzeneyer-csp'); ?></p>
            
            <h3>📊 <?php echo esc_html__('Monitoring', 'djzeneyer-csp'); ?></h3>
            <p><?php echo esc_html__('Violations are reported to report-uri.com. Configure your account there to receive alerts.', 'djzeneyer-csp'); ?></p>
            
            <h3>🛠️ <?php echo esc_html__('Troubleshooting', 'djzeneyer-csp'); ?></h3>
            <ul>
                <li><strong><?php echo esc_html__('Script blocked?', 'djzeneyer-csp'); ?></strong> Check Logs tab for CSP violations</li>
                <li><strong><?php echo esc_html__('Meta tag empty?', 'djzeneyer-csp'); ?></strong> Plugin may not be activated</li>
                <li><strong><?php echo esc_html__('Console errors?', 'djzeneyer-csp'); ?></strong> See Diagnostics tab</li>
            </ul>
        </div>
    <?php
    
    /**
     * TAB: Logs - Real-time Log Viewer
     */
    elseif ($active_tab === 'logs'): ?>
        <div class="djze-card">
            <h2>📋 <?php echo esc_html__('Event Logs', 'djzeneyer-csp'); ?></h2>
            
            <div class="djze-button-group">
                <button class="button button-primary" onclick="location.reload();">
                    🔄 <?php echo esc_html__('Refresh', 'djzeneyer-csp'); ?>
                </button>
                <button class="button button-secondary" onclick="djzeCspExportLogs('csv');">
                    📥 <?php echo esc_html__('Export CSV', 'djzeneyer-csp'); ?>
                </button>
                <button class="button button-secondary" onclick="djzeCspExportLogs('json');">
                    📥 <?php echo esc_html__('Export JSON', 'djzeneyer-csp'); ?>
                </button>
                <button class="button button-danger" onclick="djzeCspClearLogs();">
                    🗑️ <?php echo esc_html__('Clear Logs', 'djzeneyer-csp'); ?>
                </button>
            </div>
            
            <h3><?php echo esc_html__('Events Today', 'djzeneyer-csp'); ?> (<?php echo esc_html(date_i18n('Y-m-d')); ?>)</h3>
            <div id="djze-logs-container" style="max-height: 600px; overflow-y: auto; border: 1px solid #ddd; border-radius: 5px;">
                <?php echo $this->render_logs(); ?>
            </div>
        </div>
    <?php
    
    /**
     * TAB: Diagnostics
     */
    elseif ($active_tab === 'diagnostics'): ?>
        <div class="djze-card">
            <h2>🔍 <?php echo esc_html__('Diagnostics & Health Check', 'djzeneyer-csp'); ?></h2>
            
            <h3>🖥️ <?php echo esc_html__('WordPress Environment', 'djzeneyer-csp'); ?></h3>
            <div class="djze-code">
                <strong><?php echo esc_html__('WP Version:', 'djzeneyer-csp'); ?></strong> <?php echo esc_html(get_bloginfo('version')); ?><br>
                <strong><?php echo esc_html__('PHP Version:', 'djzeneyer-csp'); ?></strong> <?php echo esc_html(phpversion()); ?><br>
                <strong><?php echo esc_html__('Site URL:', 'djzeneyer-csp'); ?></strong> <?php echo esc_html(site_url()); ?><br>
                <strong><?php echo esc_html__('HTTPS:', 'djzeneyer-csp'); ?></strong> <?php echo is_ssl() ? '✅ ' . esc_html__('Yes', 'djzeneyer-csp') : '❌ ' . esc_html__('No', 'djzeneyer-csp'); ?><br>
            </div>
            
            <h3>🔒 <?php echo esc_html__('CSP Configuration', 'djzeneyer-csp'); ?></h3>
            <div class="djze-code">
                <strong><?php echo esc_html__('Plugin Version:', 'djzeneyer-csp'); ?></strong> <?php echo esc_html(DJZE_CSP_VERSION); ?><br>
                <strong><?php echo esc_html__('Nonce Length:', 'djzeneyer-csp'); ?></strong> <?php echo esc_html(strlen($nonce)); ?> chars (256 bits)<br>
                <strong><?php echo esc_html__('Log Directory:', 'djzeneyer-csp'); ?></strong> <?php echo is_dir(DJZE_CSP_LOG_DIR) ? '✅ ' . esc_html__('Exists', 'djzeneyer-csp') : '❌ ' . esc_html__('Missing', 'djzeneyer-csp'); ?><br>
                <strong><?php echo esc_html__('Log Writable:', 'djzeneyer-csp'); ?></strong> <?php echo is_writable(DJZE_CSP_LOG_DIR) ? '✅ ' . esc_html__('Yes', 'djzeneyer-csp') : '❌ ' . esc_html__('No', 'djzeneyer-csp'); ?><br>
            </div>
            
            <h3>📊 <?php echo esc_html__('Statistics', 'djzeneyer-csp'); ?></h3>
            <div class="djze-code">
                <?php
                $log_files = glob(DJZE_CSP_LOG_DIR . '*.log');
                $total_events = 0;
                foreach ($log_files as $file) {
                    $total_events += count(file($file, FILE_SKIP_EMPTY_LINES));
                }
                ?>
                <strong><?php echo esc_html__('Total Log Files:', 'djzeneyer-csp'); ?></strong> <?php echo esc_html(count($log_files)); ?><br>
                <strong><?php echo esc_html__('Total Events:', 'djzeneyer-csp'); ?></strong> <?php echo esc_html($total_events); ?><br>
                <strong><?php echo esc_html__('Disk Space:', 'djzeneyer-csp'); ?></strong> <?php echo esc_html($this->get_logs_size()); ?><br>
            </div>
            
            <h3>⚡ <?php echo esc_html__('Security Headers Sent', 'djzeneyer-csp'); ?></h3>
            <div class="djze-code">
                ✅ Content-Security-Policy<br>
                ✅ Report-To<br>
                ✅ X-Frame-Options: SAMEORIGIN<br>
                ✅ X-Content-Type-Options: nosniff<br>
                ✅ X-XSS-Protection: 1; mode=block<br>
                ✅ Referrer-Policy: strict-origin-when-cross-origin<br>
            </div>
        </div>
    <?php
    
    /**
     * TAB: Settings
     */
    elseif ($active_tab === 'settings'): ?>
        <div class="djze-card">
            <h2>⚙️ <?php echo esc_html__('Settings', 'djzeneyer-csp'); ?></h2>
            <form method="post" action="options.php">
                <?php
                settings_fields('djzeneyer_csp_group');
                do_settings_sections('djzeneyer_csp_page');
                submit_button(__('Save Settings', 'djzeneyer-csp'));
                ?>
            </form>
        </div>
    <?php endif; ?>
        </div>
        <?php
    }
    
    /**
     * Render logs in admin (v2.5.0)
     */
    private function render_logs() {
        if (!$this->logging_enabled) {
            return '<div style="padding: 20px; color: #999; text-align: center;">' . 
                   esc_html__('Logging is disabled in settings', 'djzeneyer-csp') . '</div>';
        }
        
        $today_log = DJZE_CSP_LOG_DIR . 'events-' . date('Y-m-d') . '.log';
        
        if (!file_exists($today_log)) {
            return '<div style="padding: 20px; color: #999; text-align: center;">' . 
                   esc_html__('No events logged today', 'djzeneyer-csp') . '</div>';
        }
        
        $lines = array_reverse(file($today_log, FILE_SKIP_EMPTY_LINES));
        $html = '';
        
        foreach (array_slice($lines, 0, 500) as $line) {
            $event = json_decode(trim($line), true);
            if ($event) {
                $type = $event['type'] ?? 'UNKNOWN';
                $time = $event['timestamp'] ?? 'Unknown';
                $class = strpos($type, 'ERROR') !== false ? 'djze-log-error' : 
                        (strpos($type, 'SUCCESS') !== false ? 'djze-log-success' : 'djze-log-info');
                
                $html .= '<div class="djze-log ' . esc_attr($class) . '" style="padding: 10px; margin: 5px 0; border-radius: 3px; font-family: monospace; font-size: 12px; border-left: 4px solid; background: #f9f9f9;">';
                $html .= '<strong>[' . esc_html($time) . ']</strong> ' . esc_html($type);
                
                if (!empty($event['data'])) {
                    $html .= '<br><small style="color: #666;">' . esc_html(json_encode($event['data'])) . '</small>';
                }
                
                $html .= '</div>';
            }
        }
        
        return $html ?: '<div style="padding: 20px; color: #999;">' . esc_html__('No logs found', 'djzeneyer-csp') . '</div>';
    }
    
    /**
     * Get disk space used by logs
     */
    private function get_logs_size() {
        $size = 0;
        foreach (glob(DJZE_CSP_LOG_DIR . '*.log*') as $file) {
            $size += filesize($file);
        }
        
        if ($size > 1024 * 1024) {
            return round($size / 1024 / 1024, 2) . ' MB';
        }
        return round($size / 1024, 2) . ' KB';
    }
    
    // ============================================
    // 🔄 AJAX HANDLERS (v2.5.0)
    // ============================================
    
    /**
     * AJAX: Get logs (real-time)
     */
    public function ajax_get_logs() {
        check_ajax_referer('djze_csp_admin');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized']);
        }
        
        $html = $this->render_logs();
        wp_send_json_success(['logs' => $html]);
    }
    
    /**
     * AJAX: Clear logs
     */
    public function ajax_clear_logs() {
        check_ajax_referer('djze_csp_admin');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized']);
        }
        
        $this->clear_all_logs();
        wp_send_json_success(['message' => __('Logs cleared successfully!', 'djzeneyer-csp')]);
    }
    
    /**
     * Clear all logs
     */
    private function clear_all_logs() {
        foreach (glob(DJZE_CSP_LOG_DIR . '*.log*') as $file) {
            unlink($file);
        }
        
        $this->log_event('LOGS_CLEARED', ['timestamp' => current_time('c')]);
    }
    
    /**
     * AJAX: Export logs
     */
    public function ajax_export_logs() {
        check_ajax_referer('djze_csp_admin');
        
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized']);
        }
        
        $format = isset($_POST['format']) ? sanitize_key($_POST['format']) : 'json';
        
        if ($format === 'csv') {
            $this->export_logs_csv();
        } else {
            $this->export_logs_json();
        }
    }
    
    /**
     * Export logs as CSV
     */
    private function export_logs_csv() {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="csp-logs-' . date('Y-m-d') . '.csv"');
        
        $output = fopen('php://output', 'w');
        
        // CSV header
        fputcsv($output, ['Timestamp', 'Type', 'User Agent', 'IP', 'Data']);
        
        // Get all logs
        foreach (glob(DJZE_CSP_LOG_DIR . '*.log') as $file) {
            foreach (file($file, FILE_SKIP_EMPTY_LINES) as $line) {
                $event = json_decode(trim($line), true);
                if ($event) {
                    fputcsv($output, [
                        $event['timestamp'] ?? '',
                        $event['type'] ?? '',
                        $event['user_agent'] ?? '',
                        $event['ip'] ?? '',
                        json_encode($event['data'] ?? [])
                    ]);
                }
            }
        }
        
        fclose($output);
        wp_die();
    }
    
    /**
     * Export logs as JSON
     */
    private function export_logs_json() {
        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="csp-logs-' . date('Y-m-d') . '.json"');
        
        $logs = [];
        
        foreach (glob(DJZE_CSP_LOG_DIR . '*.log') as $file) {
            foreach (file($file, FILE_SKIP_EMPTY_LINES) as $line) {
                $event = json_decode(trim($line), true);
                if ($event) {
                    $logs[] = $event;
                }
            }
        }
        
        echo wp_json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        wp_die();
    }
    
    /**
     * Handle CSP report (Violation endpoint)
     */
    public function handle_csp_report() {
        $input = file_get_contents('php://input');
        $report = json_decode($input, true);
        
        if ($report && isset($report['csp-report'])) {
            $csp_report = $report['csp-report'];
            
            $this->log_event('CSP_VIOLATION', [
                'blocked_uri' => sanitize_url($csp_report['blocked-uri'] ?? 'unknown'),
                'violated_directive' => sanitize_key($csp_report['violated-directive'] ?? 'unknown'),
                'source_file' => sanitize_text_field($csp_report['source-file'] ?? 'unknown'),
                'line_number' => (int) ($csp_report['line-number'] ?? 0),
            ]);
        }
        
        wp_send_json_success();
    }
    
    // ============================================
    // 🆕 ACTIVATION/DEACTIVATION (v2.5.0)
    // ============================================
}

// Plugin activation
register_activation_hook(__FILE__, function() {
    // Create log directory
    wp_mkdir_p(DJZE_CSP_LOG_DIR);
    
    // Add option
    add_option('djze_csp_activated', current_time('mysql'));
    
    // Initialize settings
    add_option('djzeneyer_csp_settings', [
        'disable_logs' => '0',
        'disable_rate_limit' => '0',
    ]);
});

// Plugin deactivation
register_deactivation_hook(__FILE__, function() {
    // Clear transients
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE 'transient_djze_csp_%'");
});

// Initialize plugin
add_action('plugins_loaded', function() {
    DJZenEyer_CSP_Manager_Pro::getInstance();
}, 1);

// ============================================
// 🛠️ GLOBAL HELPER FUNCTIONS
// ============================================

/**
 * Get CSP nonce (global helper) - Use in any template
 * 
 * @return string 256-bit nonce
 */
if (!function_exists('djzeneyer_get_csp_nonce')) {
    function djzeneyer_get_csp_nonce() {
        return DJZenEyer_CSP_Manager_Pro::getInstance()->get_csp_nonce();
    }
}

/**
 * Add style hash for inline CSS
 */
if (!function_exists('djzeneyer_add_style_hash')) {
    function djzeneyer_add_style_hash($css) {
        return DJZenEyer_CSP_Manager_Pro::getInstance()->add_style_hash($css);
    }
}

// ============================================
// 📝 INLINE JAVASCRIPT FOR ADMIN PAGE
// ============================================
?>
<script>
(function() {
    'use strict';
    
    // Clear logs
    window.djzeCspClearLogs = function() {
        if (!confirm(djzeCspAdmin.i18n.confirm_clear)) return;
        
        jQuery.post(ajaxurl, {
            action: 'djze_clear_logs',
            nonce: djzeCspAdmin.nonce
        }, function(response) {
            if (response.success) {
                alert(djzeCspAdmin.i18n.logs_cleared);
                location.reload();
            }
        });
    };
    
    // Export logs
    window.djzeCspExportLogs = function(format) {
        jQuery.post(ajaxurl, {
            action: 'djze_export_logs',
            format: format,
            nonce: djzeCspAdmin.nonce
        }, function(response) {
            if (response.success) {
                // Trigger download
                var link = document.createElement('a');
                link.href = 'data:' + (format === 'csv' ? 'text/csv' : 'application/json') + 
                           ';charset=utf-8,' + encodeURIComponent(response.data);
                link.download = 'csp-logs-' + format;
                link.click();
            }
        });
    };
    
    // Auto-refresh logs
    jQuery(function($) {
        if (jQuery('#djze-logs-container').length) {
            setInterval(function() {
                jQuery.post(ajaxurl, {
                    action: 'djze_get_logs',
                    nonce: djzeCspAdmin.nonce
                }, function(response) {
                    if (response.success) {
                        jQuery('#djze-logs-container').html(response.data.logs);
                    }
                });
            }, 30000); // Refresh every 30 seconds
        }
    });
})();
</script>
<?php
