<?php
namespace ZenEyer\Auth\Admin;

class Settings_Page {
    
    private $option_name = 'zeneyer_auth_settings';
    
    public function init() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }
    
    public function add_admin_menu() {
        add_options_page(
            'ZenEyer Auth Pro',
            'ZenEyer Auth',
            'manage_options',
            'zeneyer-auth',
            [$this, 'render_page']
        );
    }
    
    public function register_settings() {
        register_setting($this->option_name, $this->option_name, [
            'sanitize_callback' => [$this, 'sanitize_settings']
        ]);
        
        add_settings_section('zeneyer_auth_general', 'General Settings', null, 'zeneyer-auth');
        
        add_settings_field('google_client_id', 'Google Client ID', [$this, 'render_input'], 'zeneyer-auth', 'zeneyer_auth_general', [
            'id' => 'google_client_id',
            'desc' => 'Get this from <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Google Cloud Console</a>'
        ]);
        
        add_settings_field('token_expiration', 'Token Expiration (days)', [$this, 'render_input'], 'zeneyer-auth', 'zeneyer_auth_general', [
            'id' => 'token_expiration',
            'type' => 'number',
            'default' => 7
        ]);
    }
    
    public function render_input($args) {
        $options = get_option($this->option_name, []);
        $value = isset($options[$args['id']]) ? $options[$args['id']] : ($args['default'] ?? '');
        $type = $args['type'] ?? 'text';
        
        echo '<input type="' . esc_attr($type) . '" name="' . $this->option_name . '[' . $args['id'] . ']" value="' . esc_attr($value) . '" class="regular-text">';
        
        if (!empty($args['desc'])) {
            echo '<p class="description">' . $args['desc'] . '</p>';
        }
    }
    
    public function sanitize_settings($input) {
        $sanitized = [];
        
        if (isset($input['google_client_id'])) {
            $sanitized['google_client_id'] = sanitize_text_field($input['google_client_id']);
        }
        
        if (isset($input['token_expiration'])) {
            $sanitized['token_expiration'] = absint($input['token_expiration']);
        }
        
        return $sanitized;
    }
    
    public function render_page() {
        ?>
        <div class="wrap">
            <h1>🔐 ZenEyer Auth Pro <span style="font-size: 12px; background: #e5e7eb; padding: 2px 8px; border-radius: 10px;">v2.0.0</span></h1>
            <p>Secure JWT authentication for your headless WordPress + React application.</p>
            
            <form method="post" action="options.php">
                <?php
                settings_fields($this->option_name);
                do_settings_sections('zeneyer-auth');
                submit_button();
                ?>
            </form>
            
            <div style="margin-top: 30px; padding: 20px; background: #f0f0f1; border-left: 4px solid #2271b1;">
                <h2>📡 API Endpoints</h2>
                <p><strong>Base URL:</strong> <code><?php echo get_rest_url(null, 'zeneyer-auth/v1'); ?></code></p>
                <ul>
                    <li><code>POST /auth/login</code> - Login with email/password</li>
                    <li><code>POST /auth/register</code> - Register new user</li>
                    <li><code>POST /auth/google</code> - Login with Google</li>
                    <li><code>POST /auth/validate</code> - Validate JWT token</li>
                    <li><code>POST /auth/refresh</code> - Refresh JWT token</li>
                    <li><code>GET /auth/me</code> - Get current user</li>
                    <li><code>POST /auth/logout</code> - Logout user</li>
                    <li><code>GET /settings</code> - Get public settings</li>
                </ul>
            </div>
        </div>
        <?php
    }
}
