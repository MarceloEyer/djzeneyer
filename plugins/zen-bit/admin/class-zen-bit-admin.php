<?php
/**
 * Zen BIT — Admin v2
 * Painel de configurações e health/status.
 */

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
            __('Zen BIT Events', 'zen-bit'),
            __('Zen BIT Events', 'zen-bit'),
            'manage_options',
            'zen-bit-settings',
            [$this, 'render_settings_page']
        );
    }

    // =========================================================================
    // SETTINGS REGISTRATION
    // =========================================================================

    public function register_settings(): void
    {
        $settings = [
            // Conexão com a API
            ['zen_bit_artist_id',         'string',  '15619775'],
            ['zen_bit_artist_name',        'string',  ''],
            ['zen_bit_api_key',            'string',  ''],
            // Filtros padrão
            ['zen_bit_default_days',       'integer', 365],
            // TTLs (segundos)
            ['zen_bit_ttl_upcoming',       'integer', 21600],
            ['zen_bit_ttl_detail',         'integer', 86400],
            ['zen_bit_ttl_past',           'integer', 604800],
            // Throttle entre chamadas externas
            ['zen_bit_throttle_hours',     'integer', 24],
            // Toggles
            ['zen_bit_enable_schema',      'boolean', true],
            ['zen_bit_include_raw_debug',  'boolean', false],
        ];

        foreach ($settings as [$name, $type, $default]) {
            register_setting('zen_bit_settings', $name, [
                'type'              => $type,
                'sanitize_callback' => [$this, "sanitize_{$type}"],
                'default'           => $default,
            ]);
        }
    }

    // Sanitizers genéricos
    public function sanitize_string($v): string  { return sanitize_text_field((string) $v); }
    public function sanitize_integer($v): int    { return (int) $v; }
    public function sanitize_boolean($v): bool   { return (bool) $v; }

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

        // Força um fetch e atualiza o cache
        $request = new \WP_REST_Request('POST', '/wp-json/zen-bit/v1/fetch-now');
        Zen_BIT_API::fetch_now_rest($request);

        wp_safe_redirect(add_query_arg(['page' => 'zen-bit-settings', 'zen_action' => 'fetched'], admin_url('admin.php')));
        exit;
    }

    // =========================================================================
    // RENDER
    // =========================================================================

    public function render_settings_page(): void
    {
        $health     = Zen_BIT_Cache::health_get();
        $action     = sanitize_text_field($_GET['zen_action'] ?? '');
        $ok_at_raw  = (int) $health['last_fetch_ok_at'];
        $ok_at      = $ok_at_raw ? date_i18n('d/m/Y H:i:s', $ok_at_raw) : '—';
        $fetch_ms   = (int) $health['last_fetch_ms'];
        $last_error = esc_html($health['last_error']);
        $ev_count   = (int) $health['cached_events_count'];
        $ev_bytes   = (int) $health['cache_size_bytes'];

        $rest_base = esc_url(rest_url('zen-bit/v1/'));
        ?>
        <div class="wrap" id="zen-bit-admin">
            <?php /* --- NOTIFICAÇÕES --- */ ?>
            <?php if ($action === 'cache_cleared'): ?>
                <div class="notice notice-success is-dismissible"><p>✅ Cache limpo com sucesso.</p></div>
            <?php elseif ($action === 'fetched'): ?>
                <div class="notice notice-success is-dismissible"><p>✅ Eventos atualizados: <?php echo esc_html($ev_count); ?> eventos em cache.</p></div>
            <?php endif; ?>

            <h1 style="display:flex;align-items:center;gap:12px;">
                <span>🎵</span> Zen BIT — Bandsintown Events <small style="font-size:0.55em;opacity:0.5;">v<?php echo ZEN_BIT_VERSION; ?></small>
            </h1>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px;">

                <?php /* ===== HEALTH CARD ===== */ ?>
                <div style="background:#1a1a2e;border:1px solid rgba(157,78,221,.25);border-radius:16px;padding:24px;color:#e0e0e0;">
                    <h2 style="color:#fff;margin-top:0;">📡 Health / Status</h2>
                    <table style="width:100%;border-collapse:collapse;font-size:0.9em;">
                        <tr><td style="padding:6px 0;opacity:.6;">Último fetch OK</td>
                            <td style="padding:6px 0;text-align:right;font-family:monospace;"><?php echo $ok_at; ?></td></tr>
                        <tr><td style="padding:6px 0;opacity:.6;">Duração do fetch</td>
                            <td style="padding:6px 0;text-align:right;font-family:monospace;">
                                <?php echo $fetch_ms > 0 ? "{$fetch_ms} ms" : '—'; ?>
                            </td></tr>
                        <tr><td style="padding:6px 0;opacity:.6;">Eventos em cache</td>
                            <td style="padding:6px 0;text-align:right;font-family:monospace;"><?php echo $ev_count; ?></td></tr>
                        <tr><td style="padding:6px 0;opacity:.6;">Tamanho do cache</td>
                            <td style="padding:6px 0;text-align:right;font-family:monospace;">
                                <?php echo $ev_bytes > 0 ? size_format($ev_bytes) : '—'; ?>
                            </td></tr>
                        <?php if ($last_error): ?>
                        <tr><td colspan="2" style="padding:10px;background:rgba(255,50,50,.1);border-radius:8px;color:#ff6b6b;margin-top:8px;">
                            ⚠️ <?php echo $last_error; ?>
                        </td></tr>
                        <?php endif; ?>
                    </table>

                    <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">
                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <input type="hidden" name="action" value="zen_bit_fetch_now">
                            <?php wp_nonce_field('zen_bit_fetch_now'); ?>
                            <button type="submit" style="background:#9d4edd;color:#fff;border:none;padding:10px 18px;border-radius:10px;cursor:pointer;font-weight:700;">
                                🔄 Fetch Now
                            </button>
                        </form>
                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <input type="hidden" name="action" value="zen_bit_clear_cache">
                            <?php wp_nonce_field('zen_bit_clear_cache'); ?>
                            <button type="submit" style="background:rgba(255,255,255,.08);color:#e0e0e0;border:1px solid rgba(255,255,255,.15);padding:10px 18px;border-radius:10px;cursor:pointer;">
                                🗑 Clear Cache
                            </button>
                        </form>
                    </div>

                    <hr style="border-color:rgba(255,255,255,.08);margin:20px 0;">
                    <h3 style="color:#fff;margin-top:0;">🔗 Endpoints</h3>
                    <div style="font-family:monospace;font-size:0.78em;line-height:2;">
                        <div><span style="background:rgba(0,212,255,.15);color:#00d4ff;padding:2px 6px;border-radius:4px;font-size:.9em;">GET</span>
                             <a href="<?php echo esc_url(rest_url('zen-bit/v1/events?mode=upcoming&days=365&limit=3')); ?>" target="_blank" style="color:#c77dff;">
                                 <?php echo $rest_base; ?>events?mode=upcoming&days=365&limit=3
                             </a></div>
                        <div><span style="background:rgba(0,212,255,.15);color:#00d4ff;padding:2px 6px;border-radius:4px;font-size:.9em;">GET</span>
                             <a href="<?php echo esc_url(rest_url('zen-bit/v1/events-schema?mode=upcoming&days=365')); ?>" target="_blank" style="color:#c77dff;">
                                 <?php echo $rest_base; ?>events-schema?mode=upcoming&days=365
                             </a></div>
                        <div><span style="background:rgba(0,212,255,.15);color:#00d4ff;padding:2px 6px;border-radius:4px;font-size:.9em;">GET</span>
                             <span style="color:rgba(255,255,255,.5);"><?php echo $rest_base; ?>events/{id}/schema</span></div>
                    </div>
                </div>

                <?php /* ===== SETTINGS FORM ===== */ ?>
                <div style="background:#1a1a2e;border:1px solid rgba(157,78,221,.25);border-radius:16px;padding:24px;color:#e0e0e0;">
                    <h2 style="color:#fff;margin-top:0;">⚙️ Configurações</h2>
                    <form method="post" action="options.php">
                        <?php settings_fields('zen_bit_settings'); ?>

                        <table class="form-table" style="color:#e0e0e0;">
                            <tr><th style="color:#e0e0e0;width:160px;">Artist ID</th>
                                <td><input type="text" name="zen_bit_artist_id"
                                           value="<?php echo esc_attr(get_option('zen_bit_artist_id', '15619775')); ?>"
                                           class="regular-text"></td></tr>
                            <tr><th style="color:#e0e0e0;">Artist Name</th>
                                <td><input type="text" name="zen_bit_artist_name"
                                           value="<?php echo esc_attr(get_option('zen_bit_artist_name', '')); ?>"
                                           class="regular-text" placeholder="Alternativa ao Artist ID">
                                    <p class="description" style="color:rgba(255,255,255,.4);">Se preenchido, tem prioridade sobre Artist ID.</p></td></tr>
                            <tr><th style="color:#e0e0e0;">API Key (app_id)</th>
                                <td><input type="text" name="zen_bit_api_key"
                                           value="<?php echo esc_attr(get_option('zen_bit_api_key', '')); ?>"
                                           class="regular-text"></td></tr>

                            <tr><th colspan="2" style="color:#9d4edd;font-size:.85em;text-transform:uppercase;letter-spacing:1px;padding-top:20px;">Filtros Padrão</th></tr>
                            <tr><th style="color:#e0e0e0;">Default Days</th>
                                <td><input type="number" name="zen_bit_default_days" min="1" max="730"
                                           value="<?php echo (int) get_option('zen_bit_default_days', 365); ?>"
                                           class="small-text"> dias
                                    <p class="description" style="color:rgba(255,255,255,.4);">Janela padrão quando <code>days</code> não for passado (1–730).</p></td></tr>

                            <tr><th colspan="2" style="color:#9d4edd;font-size:.85em;text-transform:uppercase;letter-spacing:1px;padding-top:20px;">TTL de Cache</th></tr>
                            <tr><th style="color:#e0e0e0;">Upcoming</th>
                                <td><input type="number" name="zen_bit_ttl_upcoming" min="300"
                                           value="<?php echo (int) get_option('zen_bit_ttl_upcoming', 21600); ?>"
                                           class="small-text"> s
                                    <span style="opacity:.5;margin-left:8px;">(padrão: 21600 = 6h)</span></td></tr>
                            <tr><th style="color:#e0e0e0;">Detail</th>
                                <td><input type="number" name="zen_bit_ttl_detail" min="300"
                                           value="<?php echo (int) get_option('zen_bit_ttl_detail', 86400); ?>"
                                           class="small-text"> s
                                    <span style="opacity:.5;margin-left:8px;">(padrão: 86400 = 24h)</span></td></tr>
                            <tr><th style="color:#e0e0e0;">Past</th>
                                <td><input type="number" name="zen_bit_ttl_past" min="3600"
                                           value="<?php echo (int) get_option('zen_bit_ttl_past', 604800); ?>"
                                           class="small-text"> s
                                    <span style="opacity:.5;margin-left:8px;">(padrão: 604800 = 7d)</span></td></tr>

                            <tr><th colspan="2" style="color:#9d4edd;font-size:.85em;text-transform:uppercase;letter-spacing:1px;padding-top:20px;">Throttle</th></tr>
                            <tr><th style="color:#e0e0e0;">Throttle (horas)</th>
                                <td><input type="number" name="zen_bit_throttle_hours" min="1" max="168"
                                           value="<?php echo (int) get_option('zen_bit_throttle_hours', 24); ?>"
                                           class="small-text"> h
                                    <p class="description" style="color:rgba(255,255,255,.4);">Intervalo mínimo entre chamadas externas.</p></td></tr>

                            <tr><th colspan="2" style="color:#9d4edd;font-size:.85em;text-transform:uppercase;letter-spacing:1px;padding-top:20px;">Toggles</th></tr>
                            <tr><th style="color:#e0e0e0;">Schema JSON-LD</th>
                                <td><label><input type="checkbox" name="zen_bit_enable_schema" value="1"
                                           <?php checked(get_option('zen_bit_enable_schema', true)); ?>>
                                    Habilitar endpoint <code>/events-schema</code></label></td></tr>
                            <tr><th style="color:#e0e0e0;">Raw Debug</th>
                                <td><label><input type="checkbox" name="zen_bit_include_raw_debug" value="1"
                                           <?php checked(get_option('zen_bit_include_raw_debug', false)); ?>>
                                    Incluir campo <code>raw</code> no endpoint de detalhe</label>
                                    <p class="description" style="color:rgba(255,80,80,.7);">⚠️ Não ative em produção.</p></td></tr>
                        </table>

                        <?php submit_button('Salvar Configurações'); ?>
                    </form>
                </div>
            </div>

            <?php /* ===== QUICK REFERENCE ===== */ ?>
            <div style="background:#1a1a2e;border:1px solid rgba(255,255,255,.06);border-radius:16px;padding:24px;margin-top:24px;color:#e0e0e0;">
                <h2 style="color:#fff;margin-top:0;">📖 Quick Reference</h2>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
                    <?php
                    $examples = [
                        ['Home (3 próximos)',      'events?mode=upcoming&days=365&limit=3'],
                        ['Página /events (1 ano)', 'events?mode=upcoming&days=365'],
                        ['Eventos passados',        'events?mode=past&days=180'],
                        ['Range manual',            'events?date=2025-01-01,2025-12-31'],
                        ['Detalhe do evento',       'events/{id}'],
                        ['Schema de detalhe',       'events/{id}/schema'],
                        ['Schema lista',            'events-schema?mode=upcoming&days=365'],
                        ['Forçar refresh',          'POST fetch-now'],
                        ['Limpar cache',            'POST clear-cache'],
                    ];
                    foreach ($examples as [$label, $ep]):
                    ?>
                    <div style="background:rgba(0,0,0,.3);border-radius:10px;padding:12px 16px;">
                        <div style="font-size:.75em;opacity:.5;margin-bottom:4px;"><?php echo esc_html($label); ?></div>
                        <code style="color:#c77dff;font-size:.8em;word-break:break-all;"><?php echo esc_html($ep); ?></code>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <style>
                #zen-bit-admin .form-table th { padding: 10px 0; }
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

new Zen_BIT_Admin();
