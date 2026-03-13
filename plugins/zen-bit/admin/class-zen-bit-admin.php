<?php
/**
 * Zen BIT — Admin v2
 */

namespace ZenBit;

if (!defined('ABSPATH')) exit;

class Zen_BIT_Admin
{
    public function __construct()
    {
        add_action('admin_menu',  [$this, 'add_admin_menu']);
        add_action('admin_init',  [$this, 'register_settings']);
        add_action('admin_post_zen_bit_clear_cache', [$this, 'handle_clear_cache']);
        add_action('admin_post_zen_bit_fetch_now',   [$this, 'handle_fetch_now']);
    }

    public function add_admin_menu(): void
    {
        add_submenu_page(
            'zen-plugins',
            'Zen BIT Events',
            'Zen BIT Events',
            'manage_options',
            'zen-bit-settings',
            [$this, 'render_settings_page']
        );
    }

    // =========================================================================
    // SETTINGS
    // =========================================================================

    public function register_settings(): void
    {
        $settings = [
            ['zen_bit_artist_id',         'string',  '15619775'],
            ['zen_bit_artist_name',        'string',  ''],
            ['zen_bit_api_key',            'string',  ''],
            ['zen_bit_default_days',       'integer', 365],
            ['zen_bit_ttl_upcoming',       'integer', 21600],
            ['zen_bit_ttl_detail',         'integer', 86400],
            ['zen_bit_ttl_past',           'integer', 604800],
            ['zen_bit_enable_schema',      'boolean', true],
            ['zen_bit_include_raw_debug',  'boolean', false],
        ];
        foreach ($settings as [$name, $type, $default]) {
            register_setting('zen_bit_settings', $name, [
                'type'              => $type,
                'sanitize_callback' => fn($v) => match($type) {
                    'integer' => (int) $v,
                    'boolean' => (bool) $v,
                    default   => sanitize_text_field((string) $v),
                },
                'default' => $default,
            ]);
        }
    }

    // =========================================================================
    // ACTIONS
    // =========================================================================

    public function handle_clear_cache(): void
    {
        check_admin_referer('zen_bit_clear_cache');
        if (!current_user_can('manage_options')) wp_die('Acesso negado.');
        Zen_BIT_Cache::clear_all();
        wp_safe_redirect(add_query_arg(['page' => 'zen-bit-settings', 'zen_action' => 'cache_cleared'], admin_url('admin.php')));
        exit;
    }

    public function handle_fetch_now(): void
    {
        check_admin_referer('zen_bit_fetch_now');
        if (!current_user_can('manage_options')) wp_die('Acesso negado.');
        Zen_BIT_Cache::clear_all();
        $raws = Zen_BIT_API_V2::fetch_from_bandsintown('upcoming');
        $count = 0;
        foreach ($raws as $raw) { if (is_array($raw)) $count++; }
        wp_safe_redirect(add_query_arg(['page' => 'zen-bit-settings', 'zen_action' => 'fetched', 'count' => $count], admin_url('admin.php')));
        exit;
    }

    // =========================================================================
    // RENDER
    // =========================================================================

    public function render_settings_page(): void
    {
        $health     = Zen_BIT_Cache::health_get();
        $action     = sanitize_text_field($_GET['zen_action'] ?? '');
        $count      = (int)($_GET['count'] ?? 0);
        $ok_at      = $health['last_fetch_ok_at'] ? date_i18n('d/m/Y H:i:s', $health['last_fetch_ok_at']) : '—';
        $fetch_ms   = (int)$health['last_fetch_ms'];
        $last_error = esc_html((string)$health['last_error']);
        $ev_count   = (int)$health['cached_events_count'];
        $ev_bytes   = (int)$health['cache_size_bytes'];
        $rest_base  = esc_url(rest_url('zen-bit/v2/'));
        ?>
        <div class="wrap" id="zen-bit-admin">

            <?php if ($action === 'cache_cleared'): ?>
                <div class="notice notice-success is-dismissible"><p>✅ Cache limpo.</p></div>
            <?php elseif ($action === 'fetched'): ?>
                <div class="notice notice-success is-dismissible"><p>✅ <?php echo esc_html($count); ?> eventos carregados.</p></div>
            <?php endif; ?>

            <h1>🎵 Zen BIT Events <small style="font-size:.55em;opacity:.4;">v<?php echo ZEN_BIT_VERSION; ?> · zen-bit/v2</small></h1>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px;">

                <?php /* Health Card */ ?>
                <div style="background:#1a1a2e;border:1px solid rgba(157,78,221,.25);border-radius:16px;padding:24px;color:#e0e0e0;">
                    <h2 style="color:#fff;margin-top:0;">📡 Health</h2>
                    <table style="width:100%;border-collapse:collapse;font-size:.9em;">
                        <?php $rows = [
                            ['Último fetch OK', $ok_at],
                            ['Duração do fetch', $fetch_ms > 0 ? "{$fetch_ms} ms" : '—'],
                            ['Eventos em cache', $ev_count],
                            ['Tamanho do cache', $ev_bytes > 0 ? size_format($ev_bytes) : '—'],
                        ]; foreach ($rows as [$label, $val]): ?>
                        <tr><td style="padding:5px 0;opacity:.6;"><?php echo esc_html($label); ?></td>
                            <td style="padding:5px 0;text-align:right;font-family:monospace;"><?php echo esc_html($val); ?></td></tr>
                        <?php endforeach; ?>
                        <?php if ($last_error): ?>
                        <tr><td colspan="2" style="padding:8px;background:rgba(255,50,50,.1);border-radius:8px;color:#ff6b6b;">⚠️ <?php echo $last_error; ?></td></tr>
                        <?php endif; ?>
                    </table>

                    <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;">
                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <input type="hidden" name="action" value="zen_bit_fetch_now">
                            <?php wp_nonce_field('zen_bit_fetch_now'); ?>
                            <button type="submit" style="background:#9d4edd;color:#fff;border:none;padding:10px 18px;border-radius:10px;cursor:pointer;font-weight:700;">🔄 Fetch Now</button>
                        </form>
                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <input type="hidden" name="action" value="zen_bit_clear_cache">
                            <?php wp_nonce_field('zen_bit_clear_cache'); ?>
                            <button type="submit" style="background:rgba(255,255,255,.08);color:#e0e0e0;border:1px solid rgba(255,255,255,.15);padding:10px 18px;border-radius:10px;cursor:pointer;">🗑 Clear Cache</button>
                        </form>
                        <a href="<?php echo esc_url(rest_url('zen-bit/v2/events?mode=upcoming&limit=1')); ?>" target="_blank"
                           style="background:rgba(0,212,255,.1);color:#00d4ff;border:1px solid rgba(0,212,255,.2);padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:700;">
                           🔌 Test Connection
                        </a>
                    </div>

                    <hr style="border-color:rgba(255,255,255,.08);margin:18px 0;">
                    <h3 style="color:#fff;margin-top:0;font-size:.9em;">🔗 Endpoints v2</h3>
                    <div style="font-family:monospace;font-size:.75em;line-height:2.2;">
                        <?php $eps = [
                            ['GET', 'events?mode=upcoming&days=365&limit=3', 'Home (3 próximos)'],
                            ['GET', 'events?mode=upcoming&days=365',         '/events (1 ano)'],
                            ['GET', 'events/{event_id}',                     'Detalhe'],
                            ['GET', 'events/schema?mode=upcoming&days=365',  'Schema lista'],
                            ['GET', 'events/{event_id}/schema',              'Schema detalhe'],
                            ['POST','admin/fetch-now',                       'Forçar refresh'],
                        ]; foreach ($eps as [$method, $ep, $label]): ?>
                        <div title="<?php echo esc_attr($label); ?>">
                            <span style="background:rgba(0,212,255,.15);color:#00d4ff;padding:1px 6px;border-radius:3px;font-size:.85em;"><?php echo $method; ?></span>
                            <span style="color:#c77dff;"><?php echo esc_html($rest_base . $ep); ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <?php /* Settings Form */ ?>
                <div style="background:#1a1a2e;border:1px solid rgba(157,78,221,.25);border-radius:16px;padding:24px;color:#e0e0e0;">
                    <h2 style="color:#fff;margin-top:0;">⚙️ Configurações</h2>
                    <form method="post" action="options.php">
                        <?php settings_fields('zen_bit_settings'); ?>
                        <table class="form-table" style="color:#e0e0e0;">
                            <?php $fields = [
                                ['Artist ID',          'zen_bit_artist_id',   'text', '15619775', ''],
                                ['Artist Name',        'zen_bit_artist_name', 'text', '', 'Alternativa ao Artist ID (prioridade)'],
                                ['App ID (api_key)',   'zen_bit_api_key',     'text', '', ''],
                            ]; foreach ($fields as [$label, $opt, $type, $placeholder, $desc]): ?>
                            <tr>
                                <th style="color:#e0e0e0;width:150px;"><?php echo esc_html($label); ?></th>
                                <td>
                                    <input type="<?php echo $type; ?>" name="<?php echo $opt; ?>"
                                           value="<?php echo esc_attr(get_option($opt, $placeholder)); ?>"
                                           placeholder="<?php echo esc_attr($placeholder); ?>" class="regular-text">
                                    <?php if ($desc): ?><p class="description" style="color:rgba(255,255,255,.4);"><?php echo esc_html($desc); ?></p><?php endif; ?>
                                </td>
                            </tr>
                            <?php endforeach; ?>

                            <tr><th colspan="2" style="color:#9d4edd;font-size:.8em;text-transform:uppercase;letter-spacing:1px;padding-top:16px;">Filtros Padrão</th></tr>
                            <tr><th style="color:#e0e0e0;">Default Days</th>
                                <td><input type="number" name="zen_bit_default_days" min="1" max="730"
                                           value="<?php echo (int)get_option('zen_bit_default_days', 365); ?>" class="small-text"> dias</td></tr>

                            <tr><th colspan="2" style="color:#9d4edd;font-size:.8em;text-transform:uppercase;letter-spacing:1px;padding-top:16px;">TTL de Cache</th></tr>
                            <?php $ttls = [
                                ['Upcoming', 'zen_bit_ttl_upcoming', 21600, '6h'],
                                ['Detail',   'zen_bit_ttl_detail',   86400, '24h'],
                                ['Past',     'zen_bit_ttl_past',     604800,'7d'],
                            ]; foreach ($ttls as [$label, $opt, $default, $hint]): ?>
                            <tr><th style="color:#e0e0e0;"><?php echo $label; ?></th>
                                <td><input type="number" name="<?php echo $opt; ?>" min="300"
                                           value="<?php echo (int)get_option($opt, $default); ?>" class="small-text"> s
                                    <span style="opacity:.4;margin-left:8px;">(padrão: <?php echo $hint; ?>)</span></td></tr>
                            <?php endforeach; ?>

                            <tr><th colspan="2" style="color:#9d4edd;font-size:.8em;text-transform:uppercase;letter-spacing:1px;padding-top:16px;">Toggles</th></tr>
                            <tr><th style="color:#e0e0e0;">Schema JSON-LD</th>
                                <td><label><input type="checkbox" name="zen_bit_enable_schema" value="1"
                                           <?php checked((bool)get_option('zen_bit_enable_schema', true)); ?>>
                                    Habilitar endpoint <code>/events/schema</code></label></td></tr>
                            <tr><th style="color:#e0e0e0;">Raw Debug</th>
                                <td><label><input type="checkbox" name="zen_bit_include_raw_debug" value="1"
                                           <?php checked((bool)get_option('zen_bit_include_raw_debug', false)); ?>>
                                    Incluir campo <code>raw</code> no detalhe</label>
                                    <p class="description" style="color:rgba(255,80,80,.7);">⚠️ Não usar em produção.</p></td></tr>
                        </table>
                        <?php submit_button('Salvar'); ?>
                    </form>
                </div>
            </div>

            <style>
                #zen-bit-admin .form-table th,
                #zen-bit-admin .form-table td { padding: 8px 0; }
                #zen-bit-admin input[type=text],
                #zen-bit-admin input[type=number] {
                    background: rgba(255,255,255,.06) !important;
                    border-color: rgba(255,255,255,.12) !important;
                    color: #e0e0e0 !important;
                    border-radius: 8px !important;
                }
                #zen-bit-admin .submit input {
                    background: #9d4edd !important;
                    border-color: #9d4edd !important;
                    border-radius: 10px !important;
                }
            </style>
        </div>
        <?php
    }
}
