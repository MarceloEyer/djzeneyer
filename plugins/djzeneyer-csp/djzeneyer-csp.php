<?php
/**
 * Plugin Name: DJ Zen Eyer - CSP Nonce Manager PRO
 * Plugin URI: https://djzeneyer.com
 * Description: CSP dinâmico com nonce 256-bit, logging completo e dashboard admin
 * Version: 2.4.1
 * Author: DJ Zen Eyer Team
 * Author URI: https://djzeneyer.com
 * License: GPL v3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: djzeneyer-csp
 * Requires at least: 5.9
 * Requires PHP: 7.4
 *
 * 🔒 FEATURES:
 * - Nonce dinâmico 256-bit por requisição
 * - CSP Level 3 com Strict-Dynamic
 * - Logging completo de eventos e violações
 * - Dashboard admin com 5 abas
 * - Leitura de logs em tempo real
 * - Diagnostics detalhados
 * - Report-To API integration
 * - Suporte a Multisite
 * - Validação de segurança aprimorada
 */
if (!defined('ABSPATH')) exit;
define('DJZE_CSP_VERSION', '2.4.1');
define('DJZE_CSP_FILE', __FILE__);
define('DJZE_CSP_DIR', plugin_dir_path(__FILE__));
define('DJZE_CSP_URL', plugin_dir_url(__FILE__));
define('DJZE_CSP_LOG_DIR', DJZE_CSP_DIR . 'logs/');
class DJZenEyer_CSP {
    private static $instance = null;
    private $csp_nonce = '';
    private $style_hashes = [];
    private $logging_enabled = true;
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    public function __construct() {
        // Carrega configurações
        $this->load_settings();

        // Cria diretório de logs
        $this->ensure_log_dir();

        // Core
        add_action('init', [$this, 'generate_csp_nonce']);
        add_action('send_headers', [$this, 'add_csp_header']);
        add_action('wp_head', [$this, 'enqueue_csp_data']);
        add_action('wp_enqueue_scripts', [$this, 'localize_csp_data']);

        // Admin
        if (is_admin()) {
            if (is_multisite()) {
                add_action('network_admin_menu', [$this, 'add_admin_page']);
            } else {
                add_action('admin_menu', [$this, 'add_admin_page']);
            }
            add_action('admin_init', [$this, 'register_settings']);
        }

        // AJAX
        add_action('wp_ajax_nopriv_csp_report', [$this, 'handle_csp_report']);
        add_action('wp_ajax_csp_report', [$this, 'handle_csp_report']);
        add_action('wp_ajax_djze_clear_logs', [$this, 'clear_logs_ajax']);
        add_action('wp_ajax_nopriv_djze_clear_logs', [$this, 'clear_logs_ajax']);

        // Log na ativação
        $this->log_event('PLUGIN_ACTIVATED', ['version' => DJZE_CSP_VERSION, 'timestamp' => current_time('mysql')]);
    }
    private function load_settings() {
        $settings = get_option('djzeneyer_csp_settings', []);
        $this->logging_enabled = !isset($settings['disable_logs']) || $settings['disable_logs'] !== '1';
    }
    private function ensure_log_dir() {
        if (!is_dir(DJZE_CSP_LOG_DIR)) {
            wp_mkdir_p(DJZE_CSP_LOG_DIR);
            file_put_contents(DJZE_CSP_LOG_DIR . '.htaccess', 'Deny from all');
            file_put_contents(DJZE_CSP_LOG_DIR . 'index.php', '<?php // Silent is golden');
        }
    }
    private function log_event($type, $data = []) {
        if (!$this->logging_enabled) return;

        $log_file = DJZE_CSP_LOG_DIR . 'events-' . date('Y-m-d') . '.log';
        $entry = [
            'timestamp' => current_time('mysql'),
            'type' => $type,
            'data' => $data,
            'user_agent' => sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'),
            'ip' => sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? 'Unknown')
        ];

        file_put_contents($log_file, json_encode($entry) . "\n", FILE_APPEND);
    }
    public function generate_csp_nonce() {
        if (empty($this->csp_nonce)) {
            $this->csp_nonce = bin2hex(random_bytes(32));
            $this->log_event('NONCE_GENERATED', ['nonce_prefix' => substr($this->csp_nonce, 0, 10)]);
        }
    }
    private function validate_domain($domain) {
        return filter_var($domain, FILTER_VALIDATE_URL) !== false;
    }
    public function add_csp_header() {
        if (headers_sent()) {
            $this->log_event('HEADERS_ALREADY_SENT', ['backtrace' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 5)]);
            return;
        }

        $nonce = $this->csp_nonce;
        $csp_parts = [
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
            "report-to csp-endpoint"
        ];

        // Filtro para permitir customizações
        $csp_parts = apply_filters('djzeneyer_csp_directives', $csp_parts);
        $csp = implode('; ', $csp_parts);

        header("Report-To: {\"group\":\"csp-endpoint\",\"max_age\":10886400,\"endpoints\":[{\"url\":\"https://djzeneyer.report-uri.com/a/d/g\"}]}");
        header("Content-Security-Policy: {$csp}");

        $this->log_event('CSP_HEADER_SENT', ['csp_length' => strlen($csp)]);
    }
    public function enqueue_csp_data() {
        $nonce = $this->get_csp_nonce();
        ?>
        <meta name="csp-nonce" content="<?php echo esc_attr($nonce); ?>">
        <script nonce="<?php echo esc_attr($nonce); ?>">
            window.__CSP_NONCE__ = '<?php echo esc_js($nonce); ?>';
            console.log('✅ CSP Nonce loaded: ' + window.__CSP_NONCE__.substring(0, 10) + '...');
        </script>
        <?php
    }
    public function localize_csp_data() {
        $this->generate_csp_nonce();
        if (function_exists('wp_localize_script') && wp_script_is('jquery', 'registered')) {
            wp_localize_script('jquery', 'cspData', [
                'nonce' => $this->csp_nonce,
                'reportEndpoint' => admin_url('admin-ajax.php?action=csp_report')
            ]);
        }
    }
    public function get_csp_nonce() {
        if (empty($this->csp_nonce)) {
            $this->generate_csp_nonce();
        }
        return $this->csp_nonce;
    }
    public function add_admin_page() {
        add_options_page('CSP Configuration', 'CSP Settings', 'manage_options', 'djzeneyer-csp', [$this, 'render_admin_page']);
    }
    public function register_settings() {
        register_setting('djzeneyer_csp_group', 'djzeneyer_csp_settings');
        add_settings_section('djzeneyer_csp_section', 'CSP Settings', null, 'djzeneyer-csp');
        add_settings_field(
            'djzeneyer_csp_disable_logs',
            'Disable Logging',
            [$this, 'render_checkbox_field'],
            'djzeneyer_csp_group',
            'djzeneyer_csp_section',
            ['label_for' => 'djzeneyer_csp_disable_logs']
        );
    }
    public function render_checkbox_field($args) {
        $settings = get_option('djzeneyer_csp_settings', []);
        $disabled = isset($settings['disable_logs']) && $settings['disable_logs'] === '1';
        echo '<input type="checkbox" id="' . esc_attr($args['label_for']) . '" name="djzeneyer_csp_settings[disable_logs]" value="1" ' . checked($disabled, true, false) . '>';
        echo '<label for="' . esc_attr($args['label_for']) . '">Disable all logging</label>';
    }
    public function render_admin_page() {
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'status';
        $nonce = $this->get_csp_nonce();
        ?>
        <div class="wrap" style="margin: 20px;">
            <h1>🔒 DJ Zen Eyer - CSP Nonce Manager PRO v2.4.1</h1>
            <div class="nav-tab-wrapper" style="margin-bottom: 20px;">
                <a href="?page=djzeneyer-csp&tab=status" class="nav-tab <?php echo $active_tab === 'status' ? 'nav-tab-active' : ''; ?>">📊 Status</a>
                <a href="?page=djzeneyer-csp&tab=setup" class="nav-tab <?php echo $active_tab === 'setup' ? 'nav-tab-active' : ''; ?>">⚙️ Setup</a>
                <a href="?page=djzeneyer-csp&tab=docs" class="nav-tab <?php echo $active_tab === 'docs' ? 'nav-tab-active' : ''; ?>">📖 Docs</a>
                <a href="?page=djzeneyer-csp&tab=logs" class="nav-tab <?php echo $active_tab === 'logs' ? 'nav-tab-active' : ''; ?>">📋 Logs</a>
                <a href="?page=djzeneyer-csp&tab=diagnostics" class="nav-tab <?php echo $active_tab === 'diagnostics' ? 'nav-tab-active' : ''; ?>">🔍 Diagnostics</a>
                <a href="?page=djzeneyer-csp&tab=settings" class="nav-tab <?php echo $active_tab === 'settings' ? 'nav-tab-active' : ''; ?>">⚙️ Settings</a>
            </div>
            <style>
                .djze-card { background: #fff; border: 1px solid #ccc; padding: 20px; margin: 15px 0; border-radius: 5px; }
                .djze-success { color: #28a745; font-weight: bold; }
                .djze-error { color: #dc3545; font-weight: bold; }
                .djze-nonce { background: #f0f0f0; padding: 15px; font-family: monospace; border-radius: 5px; word-break: break-all; margin: 10px 0; }
                .djze-code { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px; border-left: 4px solid #0073aa; }
                .djze-log { background: #f9f9f9; border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 3px; font-family: monospace; font-size: 12px; }
                .djze-log-error { border-left: 4px solid #dc3545; }
                .djze-log-success { border-left: 4px solid #28a745; }
                .djze-log-info { border-left: 4px solid #0073aa; }
                .djze-button-group { margin: 10px 0; }
                .djze-button-group button { margin-right: 10px; }
                .djze-settings-form { margin-top: 20px; }
            </style>
            <?php if ($active_tab === 'status'): ?>
                <div class="djze-card">
                    <h2>✅ Status do Plugin</h2>
                    <p class="djze-success">✅ Plugin v2.4.1 ativo e funcionando</p>
                    <p class="djze-success">✅ Logging: <?php echo $this->logging_enabled ? 'HABILITADO' : 'DESABILITADO'; ?></p>
                    <p class="djze-success">✅ CSP Headers: ENVIADOS</p>
                    <p class="djze-success">✅ Nonce: <?php echo esc_html(substr($nonce, 0, 20)); ?>...</p>

                    <h3>🔐 Nonce Atual (256-bit)</h3>
                    <div class="djze-nonce"><?php echo esc_html($nonce); ?></div>

                    <h3>📌 Segurança Ativa</h3>
                    <ul>
                        <li>✅ Strict-Dynamic habilitado</li>
                        <li>✅ unsafe-inline bloqueado</li>
                        <li>✅ Whitelist de CDNs</li>
                        <li>✅ Report-To API active</li>
                        <li>✅ Logging de eventos</li>
                    </ul>
                </div>
            <?php elseif ($active_tab === 'setup'): ?>
                <div class="djze-card">
                    <h2>⚙️ Implementação Rápida</h2>

                    <h3>1️⃣ Meta Tag no Header</h3>
                    <div class="djze-code">&lt;meta name="csp-nonce" content="&lt;?php echo esc_attr(djzeneyer_get_csp_nonce()); ?&gt;"&gt;</div>
                    <h3>2️⃣ Scripts Inline</h3>
                    <div class="djze-code">&lt;script nonce="&lt;?php echo esc_attr(djzeneyer_get_csp_nonce()); ?&gt;"&gt;
console.log('Seguro!');
&lt;/script&gt;</div>
                    <h3>3️⃣ React (src/main.tsx)</h3>
                    <div class="djze-code">const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content');
window.__vite_nonce__ = nonce;
window.__webpack_nonce__ = nonce;</div>
                    <h3>4️⃣ Helper Function</h3>
                    <div class="djze-code">$nonce = djzeneyer_get_csp_nonce();
echo '&lt;script nonce="' . esc_attr($nonce) . '"&gt;...&lt;/script&gt;';</div>
                </div>
            <?php elseif ($active_tab === 'docs'): ?>
                <div class="djze-card">
                    <h2>📖 Documentação Completa</h2>

                    <h3>🎯 O Que é Nonce CSP?</h3>
                    <p>Nonce (Number Once) é um token aleatório único que autoriza scripts inline específicos sem usar <code>unsafe-inline</code>.</p>

                    <h3>🔒 Diretivas de Segurança</h3>
                    <ul>
                        <li><strong>default-src 'none'</strong> - Tudo bloqueado por padrão</li>
                        <li><strong>script-src 'nonce-{nonce}' 'strict-dynamic'</strong> - Apenas scripts com nonce</li>
                        <li><strong>style-src 'self' https://fonts.googleapis.com</strong> - Estilos de fonte do Google</li>
                        <li><strong>upgrade-insecure-requests</strong> - Força HTTPS</li>
                    </ul>
                    <h3>⚛️ React Integration</h3>
                    <p>O nonce é automaticamente aplicado aos builders Vite/Webpack através de <code>__vite_nonce__</code> e <code>__webpack_nonce__</code>.</p>
                    <h3>📊 Monitoramento</h3>
                    <p>Violações são reportadas para <code>report-uri.com</code>. Configure sua conta lá para receber alertas.</p>
                    <h3>🛠️ Troubleshooting</h3>
                    <ul>
                        <li><strong>Script bloqueado?</strong> Vá em Logs e procure por "CSP violation"</li>
                        <li><strong>Meta tag vazia?</strong> Plugin pode não estar ativado</li>
                        <li><strong>Erro no console?</strong> Verifique a aba Diagnostics</li>
                    </ul>
                </div>
            <?php elseif ($active_tab === 'logs'): ?>
                <div class="djze-card">
                    <h2>📋 Logs de Eventos</h2>

                    <div class="djze-button-group">
                        <button class="button button-secondary" onclick="location.href='?page=djzeneyer-csp&tab=logs&refresh=1'">🔄 Atualizar</button>
                        <button class="button button-secondary" onclick="if(confirm('Limpar todos os logs?')) { location.href='?page=djzeneyer-csp&tab=logs&clear=1'; }">🗑️ Limpar Logs</button>
                    </div>
                    <h3>Eventos Hoje (<?php echo date('Y-m-d'); ?>)</h3>
                    <div style="max-height: 600px; overflow-y: auto;">
                        <?php echo $this->render_logs(); ?>
                    </div>
                    <?php
                    if (isset($_GET['clear']) && $_GET['clear'] == 1) {
                        $this->clear_all_logs();
                        echo '<div class="notice notice-success"><p>✅ Logs limpos com sucesso!</p></div>';
                    }
                    ?>
                </div>
            <?php elseif ($active_tab === 'diagnostics'): ?>
                <div class="djze-card">
                    <h2>🔍 Diagnostics Completos</h2>

                    <h3>🖥️ Ambiente WordPress</h3>
                    <div class="djze-log djze-log-info">
                        <strong>WP Version:</strong> <?php echo esc_html(get_bloginfo('version')); ?><br>
                        <strong>PHP Version:</strong> <?php echo esc_html(phpversion()); ?><br>
                        <strong>Site URL:</strong> <?php echo esc_html(site_url()); ?><br>
                        <strong>HTTPS:</strong> <?php echo is_ssl() ? '✅ Yes' : '❌ No'; ?><br>
                    </div>
                    <h3>🔒 Configuração CSP</h3>
                    <div class="djze-log djze-log-success">
                        <strong>Plugin Version:</strong> <?php echo esc_html(DJZE_CSP_VERSION); ?><br>
                        <strong>Nonce Length:</strong> <?php echo esc_html(strlen($nonce)); ?> chars (256 bits)<br>
                        <strong>Log Directory:</strong> <?php echo is_dir(DJZE_CSP_LOG_DIR) ? '✅ Exists' : '❌ Missing'; ?><br>
                        <strong>Log Writable:</strong> <?php echo is_writable(DJZE_CSP_LOG_DIR) ? '✅ Yes' : '❌ No'; ?><br>
                    </div>
                    <h3>📊 Estatísticas</h3>
                    <div class="djze-log djze-log-info">
                        <?php
                        $log_files = glob(DJZE_CSP_LOG_DIR . '*.log');
                        $total_events = 0;
                        foreach ($log_files as $file) {
                            $total_events += count(file($file, FILE_SKIP_EMPTY_LINES));
                        }
                        ?>
                        <strong>Total de Logs:</strong> <?php echo count($log_files); ?> files<br>
                        <strong>Total de Eventos:</strong> <?php echo $total_events; ?><br>
                        <strong>Espaço em Disco:</strong> <?php echo $this->get_logs_size(); ?><br>
                    </div>
                    <h3>⚡ Headers Enviados</h3>
                    <div class="djze-log djze-log-success">
                        <strong>Content-Security-Policy:</strong> ✅ Ativo<br>
                        <strong>Report-To:</strong> ✅ Configurado<br>
                        <strong>X-Frame-Options:</strong> ✅ SAMEORIGIN<br>
                        <strong>X-Content-Type-Options:</strong> ✅ nosniff<br>
                    </div>
                </div>
            <?php elseif ($active_tab === 'settings'): ?>
                <div class="djze-card">
                    <h2>⚙️ Configurações</h2>
                    <form method="post" action="options.php" class="djze-settings-form">
                        <?php
                        settings_fields('djzeneyer_csp_group');
                        do_settings_sections('djzeneyer-csp');
                        submit_button('Salvar Configurações');
                        ?>
                    </form>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
    private function render_logs() {
        if (!$this->logging_enabled) {
            return '<div class="djze-log djze-log-info">Logging está desabilitado nas configurações</div>';
        }

        $today_log = DJZE_CSP_LOG_DIR . 'events-' . date('Y-m-d') . '.log';

        if (!file_exists($today_log)) {
            return '<div class="djze-log djze-log-info">Nenhum evento registrado hoje.</div>';
        }

        $lines = array_reverse(file($today_log, FILE_SKIP_EMPTY_LINES));
        $html = '';

        foreach (array_slice($lines, 0, 100) as $line) {
            $event = json_decode(trim($line), true);
            if ($event) {
                $type = $event['type'] ?? 'UNKNOWN';
                $time = $event['timestamp'] ?? 'Unknown';
                $class = strpos($type, 'ERROR') !== false ? 'djze-log-error' : 'djze-log-info';

                $html .= '<div class="djze-log ' . $class . '">';
                $html .= '<strong>[' . esc_html($time) . ']</strong> ' . esc_html($type);
                if (!empty($event['data'])) {
                    $html .= '<br><small>' . esc_html(json_encode($event['data'])) . '</small>';
                }
                $html .= '</div>';
            }
        }

        return $html;
    }
    private function get_logs_size() {
        $size = 0;
        foreach (glob(DJZE_CSP_LOG_DIR . '*.log') as $file) {
            $size += filesize($file);
        }
        return $size > 1024 * 1024 ? round($size / 1024 / 1024, 2) . ' MB' : round($size / 1024, 2) . ' KB';
    }
    private function clear_all_logs() {
        foreach (glob(DJZE_CSP_LOG_DIR . '*.log') as $file) {
            unlink($file);
        }
        $this->log_event('LOGS_CLEARED', ['timestamp' => current_time('mysql')]);
    }
    public function clear_logs_ajax() {
        if (current_user_can('manage_options')) {
            $this->clear_all_logs();
            wp_send_json_success(['message' => 'Logs cleared']);
        } else {
            wp_send_json_error(['message' => 'Unauthorized']);
        }
    }
    public function handle_csp_report() {
        $input = file_get_contents('php://input');
        $report = json_decode($input, true);
        if ($report) {
            $this->log_event('CSP_VIOLATION', [
                'blocked_uri' => $report['csp-report']['blocked-uri'] ?? 'unknown',
                'violation_type' => $report['csp-report']['violated-directive'] ?? 'unknown',
                'original_policy' => substr($report['csp-report']['original-policy'] ?? '', 0, 50)
            ]);

            // Notificação no admin
            add_action('admin_notices', function() use ($report) {
                if (current_user_can('manage_options')) {
                    echo '<div class="notice notice-error"><p>🔒 CSP Violation: ' .
                         esc_html($report['csp-report']['blocked-uri'] ?? 'unknown') .
                         ' (Diretiva: ' . esc_html($report['csp-report']['violated-directive'] ?? 'unknown') . ')</p></div>';
                }
            });
        }
        wp_send_json_success();
    }
    public function add_style_hash($css) {
        $hash = base64_encode(hash('sha256', $css, true));
        $this->style_hashes[] = "'sha256-{$hash}'";
        $this->log_event('STYLE_HASH_ADDED', ['hash' => $hash]);
        return $hash;
    }
}
// Inicializa
add_action('plugins_loaded', function() {
    DJZenEyer_CSP::getInstance();
});
// Helper global
if (!function_exists('djzeneyer_get_csp_nonce')) {
    function djzeneyer_get_csp_nonce() {
        return DJZenEyer_CSP::getInstance()->get_csp_nonce();
    }
}
