<?php
/**
 * Endpoints REST para diagnóstico e teste de envio.
 *
 * GET  /wp-json/zen-mailer/v1/health      → status da configuração (público)
 * POST /wp-json/zen-mailer/v1/send-test   → dispara email de teste (admin)
 *
 * @package Zen_Mailer
 */

namespace Zen\Mailer;

if ( ! defined( 'ABSPATH' ) ) exit;

class RestHandler {

    private const NS = 'zen-mailer/v1';

    public static function init(): void {
        add_action( 'rest_api_init', [ __CLASS__, 'register_routes' ] );
    }

    public static function register_routes(): void {
        register_rest_route( self::NS, '/health', [
            'methods'             => \WP_REST_Server::READABLE,
            'callback'            => [ __CLASS__, 'health' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( self::NS, '/send-test', [
            'methods'             => \WP_REST_Server::CREATABLE,
            'callback'            => [ __CLASS__, 'send_test' ],
            'permission_callback' => [ __CLASS__, 'is_admin' ],
            'args'                => [
                'to' => [
                    'required'          => false,
                    'type'              => 'string',
                    'sanitize_callback' => 'sanitize_email',
                ],
            ],
        ] );
    }

    // -------------------------------------------------------------------------

    public static function health( \WP_REST_Request $request ): \WP_REST_Response {
        $config = SmtpConfig::get_config_summary();

        return new \WP_REST_Response( [
            'success' => true,
            'plugin'  => 'zen-mailer',
            'version' => ZEN_MAILER_VERSION,
            'smtp'    => $config,
        ], 200 );
    }

    public static function send_test( \WP_REST_Request $request ): \WP_REST_Response {
        if ( ! SmtpConfig::is_enabled() ) {
            return new \WP_REST_Response( [
                'success' => false,
                'error'   => 'SMTP desativado (ZEN_SMTP_ENABLED = false)',
            ], 400 );
        }

        if ( ! SmtpConfig::has_required_constants() ) {
            return new \WP_REST_Response( [
                'success' => false,
                'error'   => 'Constantes SMTP não configuradas em wp-config.php',
            ], 500 );
        }

        $to      = sanitize_email( $request->get_param( 'to' ) ?: get_option( 'admin_email' ) );
        $subject = '[Zen Mailer] Teste de envio — ' . gmdate( 'Y-m-d H:i:s' );
        $body    = sprintf(
            '<h2>Zen Mailer está funcionando ✅</h2>'
            . '<p>Este é um email de teste enviado em <strong>%s</strong>.</p>'
            . '<p><strong>Host:</strong> %s:%s<br>'
            . '<strong>Remetente:</strong> %s</p>',
            esc_html( gmdate( 'Y-m-d H:i:s T' ) ),
            esc_html( ZEN_SMTP_HOST ),
            esc_html( (string) ZEN_SMTP_PORT ),
            esc_html( defined( 'ZEN_SMTP_FROM_EMAIL' ) ? ZEN_SMTP_FROM_EMAIL : 'não configurado' )
        );

        $headers = [ 'Content-Type: text/html; charset=UTF-8' ];
        $sent    = wp_mail( $to, $subject, $body, $headers );

        if ( $sent ) {
            return new \WP_REST_Response( [
                'success' => true,
                'message' => 'Email enviado para ' . $to,
                'to'      => $to,
            ], 200 );
        }

        // Capturar o erro real do PHPMailer
        global $phpmailer;
        $error = isset( $phpmailer ) && is_object( $phpmailer ) ? $phpmailer->ErrorInfo : 'Erro desconhecido';

        return new \WP_REST_Response( [
            'success' => false,
            'error'   => 'Falha no envio: ' . esc_html( $error ),
            'to'      => $to,
        ], 500 );
    }

    // -------------------------------------------------------------------------

    public static function is_admin(): bool {
        return current_user_can( 'manage_options' );
    }
}
