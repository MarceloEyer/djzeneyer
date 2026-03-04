<?php
namespace ZenEyer\Auth\Admin;

class Settings_Page
{

    private $option_name = 'zeneyer_auth_settings';

    public function init()
    {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_post_zen_invalidate_all_sessions', [$this, 'handle_invalidate_sessions']);
    }

    public function handle_invalidate_sessions()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        check_admin_referer('zen_invalidate_action');

        $count = \ZenEyer\Auth\Core\JWT_Manager::revoke_all_system_sessions();

        wp_redirect(admin_url('admin.php?page=zeneyer-auth&invalidated=' . $count));
        exit;
    }

    public function add_admin_menu()
    {
        add_submenu_page(
            'zen-plugins',
            'ZenEyer Auth Pro',
            'ZenEyer Auth',
            'manage_options',
            'zeneyer-auth',
            [$this, 'render_page']
        );
    }

    public function register_settings()
    {
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

        add_settings_field('allow_all_origins', 'Allow All Origins (CORS)', [$this, 'render_checkbox'], 'zeneyer-auth', 'zeneyer_auth_general', [
            'id' => 'allow_all_origins',
            'desc' => '<strong>WARNING:</strong> Check this only for local testing or troubleshooting. Disables origin protection.'
        ]);

        add_settings_section('zeneyer_auth_security', 'Rate Limiting', null, 'zeneyer-auth');

        add_settings_field('rate_limit_attempts', 'Max Attempts', [$this, 'render_input'], 'zeneyer-auth', 'zeneyer_auth_security', [
            'id' => 'rate_limit_attempts',
            'type' => 'number',
            'default' => 5,
            'desc' => 'Default is 5 attempts.'
        ]);

        add_settings_field('rate_limit_duration', 'Lockout Duration (seconds)', [$this, 'render_input'], 'zeneyer-auth', 'zeneyer_auth_security', [
            'id' => 'rate_limit_duration',
            'type' => 'number',
            'default' => 300,
            'desc' => 'Default is 300 (5 minutes).'
        ]);
    }

    public function render_input($args)
    {
        $options = get_option($this->option_name, []);
        $value = isset($options[$args['id']]) ? $options[$args['id']] : ($args['default'] ?? '');
        $type = $args['type'] ?? 'text';

        echo '<input type="' . esc_attr($type) . '" name="' . $this->option_name . '[' . $args['id'] . ']" value="' . esc_attr($value) . '" class="regular-text">';

        if (!empty($args['desc'])) {
            echo '<p class="description">' . $args['desc'] . '</p>';
        }
    }

    public function render_checkbox($args)
    {
        $options = get_option($this->option_name, []);
        $value = !empty($options[$args['id']]);

        echo '<input type="checkbox" name="' . $this->option_name . '[' . $args['id'] . ']" value="1" ' . checked(1, $value, false) . '>';

        if (!empty($args['desc'])) {
            echo '<p class="description">' . $args['desc'] . '</p>';
        }
    }

    public function sanitize_settings($input)
    {
        $sanitized = [];

        $sanitized['google_client_id'] = isset($input['google_client_id']) ? sanitize_text_field($input['google_client_id']) : '';
        $sanitized['token_expiration'] = isset($input['token_expiration']) ? absint($input['token_expiration']) : 7;
        $sanitized['allow_all_origins'] = isset($input['allow_all_origins']) ? 1 : 0;
        $sanitized['rate_limit_attempts'] = isset($input['rate_limit_attempts']) ? absint($input['rate_limit_attempts']) : 5;
        $sanitized['rate_limit_duration'] = isset($input['rate_limit_duration']) ? absint($input['rate_limit_duration']) : 300;

        return $sanitized;
    }

    public function render_page()
    {
        ?>
        <div class="wrap">
            <h1>🔐 ZenEyer Auth Pro <span
                    style="font-size: 12px; background: #e5e7eb; padding: 2px 8px; border-radius: 10px;">v2.3.0</span></h1>

                    <?php if (isset($_GET['invalidated'])): ?>
                            <div class="notice notice-success is-dismissible">
                                <p>Clean sweep complete! <strong><?php echo absint($_GET['invalidated']); ?></strong> session records were
                                    wiped from the system.</p>
                            </div>
                    <?php endif; ?>
            <p>Secure JWT authentication for your headless WordPress + React application.</p>

            <form method="post" action="options.php">
                <?php
                settings_fields($this->option_name);
                do_settings_sections('zeneyer-auth');
                submit_button();
                ?>
            </form>

            <hr>

            <h2>🛡️ Session Management</h2>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="zen_invalidate_all_sessions">
                <?php wp_nonce_field('zen_invalidate_action'); ?>
                <p>Clicking this button will revoke <strong>ALL</strong> active refresh tokens for <strong>ALL</strong> users.
                    Everyone will need to log in again.</p>
                <?php submit_button('Invalidate All Active Sessions', 'delete'); ?>
            </form>

            <hr>

            <h2>📊 Recent Activity (Audit Log)</h2>
            <div style="background: #fff; border: 1px solid #ccd0d4; padding: 0;">
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Event</th>
                            <th>User ID</th>
                            <th>IP</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $logs = get_option('zeneyer_auth_audit_log', []);
                        if (empty($logs)) {
                            echo '<tr><td colspan="5">No logs found yet.</td></tr>';
                        } else {
                            foreach ($logs as $log) {
                                $user_link = $log['user_id'] ? '<a href="' . get_edit_user_link($log['user_id']) . '">#' . $log['user_id'] . '</a>' : '-';
                                echo '<tr>';
                                echo '<td>' . date('Y-m-d H:i:s', $log['time']) . '</td>';
                                echo '<td><code>' . esc_html($log['event']) . '</code></td>';
                                echo '<td>' . $user_link . '</td>';
                                echo '<td>' . esc_html($log['ip']) . '</td>';
                                echo '<td><small>' . esc_html(json_encode($log['details'])) . '</small></td>';
                                echo '</tr>';
                            }
                        }
                        ?>
                            </tbody>
                        </table>
                    </div>

                    <div style="margin-top: 30px; padding: 20px; background: #f0f0f1; border-left: 4px solid #2271b1;">
                        <h2>📡 API Endpoints</h2>
                        <p><strong>Base URL:</strong> <code><?php echo get_rest_url(null, 'zeneyer-auth/v1'); ?></code></p>
                        <ul>
                            <li><code>GET /session</code> (New) - Check current auth state</li>
                            <li><code>POST /login</code> (Alias) - Login with email/password</li>
                            <li><code>POST /google</code> (Alias) - Login with Google</li>
                            <li><code>POST /refresh</code> (Alias) - Refresh JWT token</li>
                            <li><code>POST /logout</code> (Alias) - Logout user</li>
                            <li><code>GET /auth/me</code> - Get current user profile</li>
                        </ul>
                    </div>
                </div>
                <?php
    }
}
