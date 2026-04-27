<?php
/**
 * Página de status no painel WordPress.
 * Ferramentas > Zen Mailer — mostra config ativa e botão de teste.
 *
 * @package Zen_Mailer
 */

namespace Zen\Mailer;

if ( ! defined( 'ABSPATH' ) ) exit;

class Admin {

    public static function init(): void {
        add_action( 'admin_menu', [ __CLASS__, 'add_menu' ] );
        add_action( 'admin_post_zen_mailer_send_test', [ __CLASS__, 'handle_test_form' ] );
    }

    public static function add_menu(): void {
        add_management_page(
            'Zen Mailer',
            'Zen Mailer',
            'manage_options',
            'zen-mailer',
            [ __CLASS__, 'render_page' ]
        );
    }

    public static function handle_test_form(): void {
        if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Sem permissão.' );
        check_admin_referer( 'zen_mailer_test' );

        $to   = sanitize_email( $_POST['test_email'] ?? get_option( 'admin_email' ) );
        $sent = wp_mail(
            $to,
            '[Zen Mailer] Teste de envio — ' . gmdate( 'Y-m-d H:i:s' ),
            '<h2>Zen Mailer está funcionando ✅</h2><p>Enviado em ' . esc_html( gmdate( 'Y-m-d H:i:s T' ) ) . '</p>',
            [ 'Content-Type: text/html; charset=UTF-8' ]
        );

        $status = $sent ? 'success' : 'error';
        wp_safe_redirect( admin_url( 'tools.php?page=zen-mailer&test=' . $status ) );
        exit;
    }

    public static function render_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) return;

        $config  = SmtpConfig::get_config_summary();
        $enabled = SmtpConfig::is_enabled();
        $ok      = $config['configured'] ?? false;
        $test    = sanitize_text_field( $_GET['test'] ?? '' );
        ?>
        <div class="wrap">
            <h1>Zen Mailer <span style="font-size:13px;font-weight:400;color:#666">v<?php echo esc_html( ZEN_MAILER_VERSION ); ?></span></h1>

            <?php if ( $test === 'success' ) : ?>
                <div class="notice notice-success"><p>✅ Email de teste enviado com sucesso!</p></div>
            <?php elseif ( $test === 'error' ) : ?>
                <div class="notice notice-error"><p>❌ Falha ao enviar. Verifique as constantes SMTP e o log de erros do PHP.</p></div>
            <?php endif; ?>

            <h2>Status da configuração</h2>
            <table class="widefat" style="max-width:600px">
                <tbody>
                    <tr>
                        <td><strong>Plugin ativo</strong></td>
                        <td><?php echo $enabled ? '✅ Sim' : '⚠️ Desativado (ZEN_SMTP_ENABLED = false)'; ?></td>
                    </tr>
                    <tr>
                        <td><strong>Constantes configuradas</strong></td>
                        <td><?php echo $ok ? '✅ Sim' : '❌ Não — verifique wp-config.php'; ?></td>
                    </tr>
                    <?php if ( $ok ) : ?>
                    <tr><td><strong>Host</strong></td><td><?php echo esc_html( $config['host'] ); ?>:<?php echo esc_html( (string) $config['port'] ); ?></td></tr>
                    <tr><td><strong>Usuário</strong></td><td><?php echo esc_html( $config['user'] ); ?></td></tr>
                    <tr><td><strong>Remetente</strong></td><td><?php echo esc_html( $config['from_email'] ); ?> (<?php echo esc_html( $config['from_name'] ); ?>)</td></tr>
                    <tr><td><strong>Criptografia</strong></td><td><?php echo esc_html( $config['encryption'] ); ?></td></tr>
                    <tr><td><strong>Debug SMTP</strong></td><td><?php echo $config['debug'] ? '⚠️ Ativado (desativar em produção!)' : 'OFF'; ?></td></tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <h2 style="margin-top:24px">Enviar email de teste</h2>
            <?php if ( ! $ok || ! $enabled ) : ?>
                <p>Configure as constantes SMTP em <code>wp-config.php</code> antes de testar.</p>
            <?php else : ?>
                <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                    <?php wp_nonce_field( 'zen_mailer_test' ); ?>
                    <input type="hidden" name="action" value="zen_mailer_send_test" />
                    <table class="form-table" style="max-width:600px">
                        <tr>
                            <th scope="row"><label for="test_email">Destinatário</label></th>
                            <td>
                                <input type="email" id="test_email" name="test_email"
                                    value="<?php echo esc_attr( get_option( 'admin_email' ) ); ?>"
                                    class="regular-text" />
                                <p class="description">Deixe em branco para usar o email de admin do WordPress.</p>
                            </td>
                        </tr>
                    </table>
                    <?php submit_button( 'Enviar email de teste' ); ?>
                </form>
            <?php endif; ?>

            <h2 style="margin-top:24px">Configuração em wp-config.php</h2>
            <pre style="background:#f0f0f0;padding:16px;border-radius:4px;max-width:600px;overflow-x:auto"><code><?php echo esc_html( self::get_config_example() ); ?></code></pre>

            <h2 style="margin-top:24px">Endpoint de health check</h2>
            <p>
                <a href="<?php echo esc_url( rest_url( 'zen-mailer/v1/health' ) ); ?>" target="_blank">
                    <?php echo esc_html( rest_url( 'zen-mailer/v1/health' ) ); ?>
                </a>
            </p>
        </div>
        <?php
    }

    private static function get_config_example(): string {
        return <<<'PHP'
// Em wp-config.php — adicionar antes de "/* That's all, stop editing! */"

// ---- Zen Mailer: SMTP -------------------------------------------------------
// Provedor recomendado: Resend (resend.com) — 3.000 emails/mês grátis
define( 'ZEN_SMTP_ENABLED',    true );
define( 'ZEN_SMTP_HOST',       'smtp.resend.com' );
define( 'ZEN_SMTP_PORT',       587 );
define( 'ZEN_SMTP_ENCRYPTION', 'tls' );
define( 'ZEN_SMTP_USER',       'resend' );
define( 'ZEN_SMTP_PASS',       're_xxxxxxxxxxxxxxxxxxxx' ); // API key do Resend
define( 'ZEN_SMTP_FROM_EMAIL', 'noreply@djzeneyer.com' );
define( 'ZEN_SMTP_FROM_NAME',  'DJ Zen Eyer' );
// define( 'ZEN_SMTP_DEBUG', false ); // true = debug no log PHP. NUNCA em produção.
// -----------------------------------------------------------------------------

// Alternativa: Brevo (brevo.com) — 300 emails/dia grátis
// define( 'ZEN_SMTP_HOST',       'smtp-relay.brevo.com' );
// define( 'ZEN_SMTP_PORT',       587 );
// define( 'ZEN_SMTP_USER',       'seu-email@djzeneyer.com' );
// define( 'ZEN_SMTP_PASS',       'BREVO_SMTP_KEY' );
PHP;
    }
}
