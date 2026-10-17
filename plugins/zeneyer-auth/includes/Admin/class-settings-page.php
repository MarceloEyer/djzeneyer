<?php
namespace ZenEyer\Auth\Admin;

use ZenEyer\Auth\Core\JWT_Manager;

if (!defined('ABSPATH')) {
    exit;
}

class Settings_Page
{

    private $option_name = 'zeneyer_auth_settings';

    public function init()
    {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_post_zen_invalidate_all_sessions', [$this, 'handle_invalidate_sessions']);
        add_action('admin_notices', [$this, 'maybe_warn_about_jwt_secret']);
        add_action('admin_notices', [$this, 'maybe_warn_about_token_expiration_units']);
    }

    /**
     * One-time-visible guidance for the historical days/minutes ambiguity on
     * this field (it used to be labeled "(days)" with a default of 7, but
     * JWT_Manager always consumed the value as minutes — a saved "7" meant
     * 7-minute access tokens, not 7 days). This never auto-converts the
     * stored value — a heuristic guess ("looks small, must mean days") could
     * just as easily be wrong for an install that genuinely wants a short
     * lifetime. It only tells the admin plainly what unit is in effect and
     * asks them to confirm/re-enter it.
     */
    public function maybe_warn_about_token_expiration_units()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $options = get_option($this->option_name, []);
        $current = isset($options['token_expiration']) ? $options['token_expiration'] : null;

        if (!is_numeric($current)) {
            return;
        }

        // Below ~1 hour is unusual for an access token and matches the
        // known-bad historical default (7) — worth a confirmation prompt,
        // without ever rewriting the stored value automatically.
        if ((int) $current >= 60) {
            return;
        }

        echo '<div class="notice notice-warning"><p><strong>ZenEyer Auth:</strong> '
            . sprintf(
                esc_html__(
                    'Token Expiration is currently set to %d minutes. This field was previously labeled "(days)" by mistake — if this value was entered back then expecting days, it is producing a %d-minute access token today, not %d days. Open the settings page and re-enter the intended lifetime in minutes; it will not be converted automatically.',
                    'zeneyer-auth'
                ),
                (int) $current,
                (int) $current,
                (int) $current
            )
            . '</p></div>';
    }

    /**
     * Warn admins while the JWT signing secret lives only in the database.
     */
    public function maybe_warn_about_jwt_secret()
    {
        if (!current_user_can('manage_options') || \ZenEyer\Auth\Core\JWT_Manager::has_config_secret()) {
            return;
        }

        echo '<div class="notice notice-warning"><p><strong>ZenEyer Auth:</strong> '
            . esc_html__('the JWT signing secret is stored in the database. Define ZENEYER_JWT_SECRET in wp-config.php (64+ random characters) so a database leak cannot be used to forge tokens. Changing it signs everyone out.', 'zeneyer-auth')
            . '</p></div>';
    }

    public function handle_invalidate_sessions()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }
        check_admin_referer('zen_invalidate_action');

        $count = \ZenEyer\Auth\Core\JWT_Manager::revoke_all_system_sessions();

        if (false === $count) {
            \wp_safe_redirect(\admin_url('admin.php?page=zeneyer-auth&error=db_error'));
        } else {
            \wp_safe_redirect(\admin_url('admin.php?page=zeneyer-auth&invalidated=' . \absint($count)));
        }
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

        add_settings_field('token_expiration', 'Token Expiration (minutes)', [$this, 'render_input'], 'zeneyer-auth', 'zeneyer_auth_general', [
            'id' => 'token_expiration',
            'type' => 'number',
            'min' => JWT_Manager::MIN_EXPIRATION_MINUTES,
            'max' => JWT_Manager::MAX_EXPIRATION_MINUTES,
            'default' => JWT_Manager::DEFAULT_EXPIRATION,
            'desc' => sprintf(
                'Access token lifetime in <strong>minutes</strong> — not days. Example: %d = 1 hour. '
                . 'Allowed range: %d–%d minutes. Default: %d. '
                . 'Changing this does <strong>not</strong> change the expiration of tokens already issued — '
                . 'users must sign in again (or renew via a refresh flow, if one is wired up) to pick up the new value. '
                . 'If this still shows an old value saved as a small number of <em>days</em> from before this field '
                . 'was unit-corrected, re-enter it now as minutes — it will not be converted automatically.',
                JWT_Manager::DEFAULT_EXPIRATION,
                JWT_Manager::MIN_EXPIRATION_MINUTES,
                JWT_Manager::MAX_EXPIRATION_MINUTES,
                JWT_Manager::DEFAULT_EXPIRATION
            ),
        ]);

        add_settings_field('allowed_origins_list', 'Specific Allowed Origins', [$this, 'render_textarea'], 'zeneyer-auth', 'zeneyer_auth_general', [
            'id' => 'allowed_origins_list',
            'desc' => 'Enter one URL per line (e.g., <code>https://app.example.com</code>). Wildcards like <code>*.example.com</code> are supported.'
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

        $bounds = '';
        if (isset($args['min'])) {
            $bounds .= ' min="' . esc_attr($args['min']) . '"';
        }
        if (isset($args['max'])) {
            $bounds .= ' max="' . esc_attr($args['max']) . '"';
        }

        echo '<input type="' . esc_attr($type) . '" name="' . $this->option_name . '[' . $args['id'] . ']" value="' . esc_attr($value) . '" class="regular-text"' . $bounds . '>';

        if (!empty($args['desc'])) {
            $allowed_html = [
                'a'      => [ 'href' => [], 'target' => [], 'rel' => [] ],
                'strong' => [],
                'em'     => [],
                'code'   => [],
            ];
            echo '<p class="description">' . wp_kses($args['desc'], $allowed_html) . '</p>';
        }
    }

    public function render_checkbox($args)
    {
        $options = get_option($this->option_name, []);
        $value = !empty($options[$args['id']]);

        echo '<input type="checkbox" name="' . $this->option_name . '[' . $args['id'] . ']" value="1" ' . checked(1, $value, false) . '>';

        if (!empty($args['desc'])) {
            $allowed_html = [
                'a'      => [ 'href' => [], 'target' => [], 'rel' => [] ],
                'strong' => [],
                'em'     => [],
                'code'   => [],
            ];
            echo '<p class="description">' . wp_kses($args['desc'], $allowed_html) . '</p>';
        }
    }

    public function render_textarea($args)
    {
        $options = get_option($this->option_name, []);
        $value = isset($options[$args['id']]) ? $options[$args['id']] : '';

        echo '<textarea name="' . $this->option_name . '[' . $args['id'] . ']" rows="5" class="large-text">' . esc_textarea($value) . '</textarea>';

        if (!empty($args['desc'])) {
            $allowed_html = [
                'a'      => [ 'href' => [], 'target' => [], 'rel' => [] ],
                'strong' => [],
                'em'     => [],
                'code'   => [],
            ];
            echo '<p class="description">' . wp_kses($args['desc'], $allowed_html) . '</p>';
        }
    }

    public function sanitize_settings($input)
    {
        $sanitized = [];

        $sanitized['google_client_id'] = isset($input['google_client_id']) ? sanitize_text_field($input['google_client_id']) : '';
        $sanitized['token_expiration'] = $this->sanitize_token_expiration($input['token_expiration'] ?? null);

        if (isset($input['allowed_origins_list'])) {
            $origins = explode("\n", $input['allowed_origins_list']);
            $origins = array_map('trim', $origins);
            $origins = array_map('esc_url_raw', array_filter($origins));
            $sanitized['allowed_origins_list'] = implode("\n", $origins);
        }

        $sanitized['rate_limit_attempts'] = isset($input['rate_limit_attempts']) ? absint($input['rate_limit_attempts']) : 5;
        $sanitized['rate_limit_duration'] = isset($input['rate_limit_duration']) ? absint($input['rate_limit_duration']) : 300;

        return $sanitized;
    }

    /**
     * Validate the token_expiration input (minutes). Unlike absint(), this
     * never silently turns a negative/invalid value into something that
     * looks valid: anything that isn't a whole number within
     * [JWT_Manager::MIN_EXPIRATION_MINUTES, JWT_Manager::MAX_EXPIRATION_MINUTES]
     * is rejected outright, the admin is told why via add_settings_error(),
     * and the previously-saved valid value is kept (or JWT_Manager's default,
     * for a fresh install with nothing saved yet).
     *
     * @param mixed $raw
     * @return int
     */
    private function sanitize_token_expiration($raw): int
    {
        $existing = get_option($this->option_name, []);
        $previous = (isset($existing['token_expiration']) && is_numeric($existing['token_expiration']))
            ? (int) $existing['token_expiration']
            : JWT_Manager::DEFAULT_EXPIRATION;
        // The previous value only counts as a safe fallback if it was itself valid;
        // JWT_Manager::get_expiration_minutes() applies the same guard at emission
        // time regardless, but we don't want sanitize_settings() to resurrect an
        // old invalid value (e.g. the historical "7" meant as days) as if it were fine.
        $previous = JWT_Manager::sanitize_expiration_minutes($previous, JWT_Manager::DEFAULT_EXPIRATION);

        $is_valid_input = is_numeric($raw) && !is_array($raw) && !is_bool($raw)
            && (float) $raw === (float) (int) $raw;

        if (!$is_valid_input) {
            add_settings_error(
                $this->option_name,
                'token_expiration_invalid',
                sprintf(
                    'Token Expiration must be a whole number of minutes. Kept the previous value (%d).',
                    $previous
                )
            );
            return $previous;
        }

        $value = (int) $raw;

        if ($value < JWT_Manager::MIN_EXPIRATION_MINUTES || $value > JWT_Manager::MAX_EXPIRATION_MINUTES) {
            add_settings_error(
                $this->option_name,
                'token_expiration_out_of_range',
                sprintf(
                    'Token Expiration must be between %d and %d minutes. Kept the previous value (%d).',
                    JWT_Manager::MIN_EXPIRATION_MINUTES,
                    JWT_Manager::MAX_EXPIRATION_MINUTES,
                    $previous
                )
            );
            return $previous;
        }

        return $value;
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

                    <?php if (isset($_GET['error']) && $_GET['error'] === 'db_error'): ?>
                            <div class="notice notice-error is-dismissible">
                                <p>Failed to wipe sessions. There was a database error.</p>
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
                                $user_link = !empty($log['user_id'])
                                    ? '<a href="' . \esc_url(\get_edit_user_link(\absint($log['user_id']))) . '">#' . \absint($log['user_id']) . '</a>'
                                    : '-';
                                if (isset($log['user_id']) && $log['user_id'] === 0) {
                                    $user_link = '<em>System</em>';
                                }
                                echo '<tr>';
                                echo '<td>' . \date('Y-m-d H:i:s', $log['time']) . '</td>';
                                echo '<td><code>' . \esc_html($log['event']) . '</code></td>';
                                echo '<td>' . $user_link . '</td>';
                                echo '<td>' . \esc_html($log['ip']) . '</td>';
                                echo '<td><small>' . \esc_html(\json_encode($log['details'])) . '</small></td>';
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
