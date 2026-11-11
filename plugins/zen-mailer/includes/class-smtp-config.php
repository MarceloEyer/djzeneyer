<?php
/**
 * Configura wp_mail() para usar SMTP via PHPMailer.
 * Credenciais lidas de constantes em wp-config.php — sem armazenamento em banco.
 *
 * Constantes obrigatórias em wp-config.php:
 *
 *   define( 'ZEN_SMTP_HOST',       'smtp.resend.com' );
 *   define( 'ZEN_SMTP_PORT',       587 );
 *   define( 'ZEN_SMTP_USER',       'resend' );
 *   define( 'ZEN_SMTP_PASS',       're_xxxxxxxxxxxx' );
 *   define( 'ZEN_SMTP_FROM_EMAIL', 'noreply@djzeneyer.com' );
 *   define( 'ZEN_SMTP_FROM_NAME',  'DJ Zen Eyer' );
 *
 * Constantes opcionais:
 *
 *   define( 'ZEN_SMTP_ENCRYPTION', 'tls' );   // 'tls' (porta 587) ou 'ssl' (porta 465). Default: 'tls'
 *   define( 'ZEN_SMTP_ENABLED',    true );    // false desativa sem remover o plugin. Default: true
 *   define( 'ZEN_SMTP_DEBUG',      false );   // true ativa debug SMTP no log. NUNCA em produção.
 *
 * @package Zen_Mailer
 */

namespace Zen\Mailer;

if ( ! defined( 'ABSPATH' ) ) exit;

class SmtpConfig {

    public static function init(): void {
        if ( ! self::is_enabled() ) return;
        if ( ! self::has_required_constants() ) return;

        add_action( 'phpmailer_init',    [ __CLASS__, 'configure_phpmailer' ] );
        add_filter( 'wp_mail_from',      [ __CLASS__, 'set_from_email' ] );
        add_filter( 'wp_mail_from_name', [ __CLASS__, 'set_from_name' ] );
    }

    // -------------------------------------------------------------------------

    /**
     * Injeta configuração SMTP no PHPMailer antes de cada envio.
     *
     * @param \PHPMailer\PHPMailer\PHPMailer $mailer
     */
    public static function configure_phpmailer( \PHPMailer\PHPMailer\PHPMailer $mailer ): void {
        $mailer->isSMTP();
        $mailer->Host       = ZEN_SMTP_HOST;
        $mailer->SMTPAuth   = true;
        $mailer->Port       = (int) ZEN_SMTP_PORT;
        $mailer->Username   = ZEN_SMTP_USER;
        $mailer->Password   = ZEN_SMTP_PASS;
        $mailer->SMTPSecure = defined( 'ZEN_SMTP_ENCRYPTION' ) ? ZEN_SMTP_ENCRYPTION : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mailer->CharSet    = 'UTF-8';

        // Debug: apenas quando explicitamente ativado (nunca em produção)
        if ( defined( 'ZEN_SMTP_DEBUG' ) && ZEN_SMTP_DEBUG ) {
            $mailer->SMTPDebug = 2;
            $mailer->Debugoutput = function ( string $str ) {
                error_log( '[zen-mailer debug] ' . $str );
            };
        }
    }

    public static function set_from_email( string $email ): string {
        return defined( 'ZEN_SMTP_FROM_EMAIL' ) ? ZEN_SMTP_FROM_EMAIL : $email;
    }

    public static function set_from_name( string $name ): string {
        return defined( 'ZEN_SMTP_FROM_NAME' ) ? ZEN_SMTP_FROM_NAME : $name;
    }

    // -------------------------------------------------------------------------

    public static function is_enabled(): bool {
        return ! defined( 'ZEN_SMTP_ENABLED' ) || (bool) ZEN_SMTP_ENABLED;
    }

    /**
     * Verifica se as constantes obrigatórias estão definidas.
     * Loga um aviso (sem expor valores) se alguma estiver ausente.
     */
    public static function has_required_constants(): bool {
        $required = [ 'ZEN_SMTP_HOST', 'ZEN_SMTP_PORT', 'ZEN_SMTP_USER', 'ZEN_SMTP_PASS', 'ZEN_SMTP_FROM_EMAIL' ];
        $missing  = array_filter( $required, fn( $c ) => ! defined( $c ) );

        if ( ! empty( $missing ) ) {
            error_log( '[zen-mailer] Constantes ausentes em wp-config.php: ' . implode( ', ', $missing ) );
            return false;
        }

        return true;
    }

    /**
     * Retorna configuração sanitizada (sem a senha) para diagnóstico.
     */
    public static function get_config_summary(): array {
        if ( ! self::has_required_constants() ) {
            return [ 'configured' => false, 'error' => 'Constantes ausentes em wp-config.php' ];
        }

        return [
            'configured'  => true,
            'enabled'     => self::is_enabled(),
            'host'        => ZEN_SMTP_HOST,
            'port'        => ZEN_SMTP_PORT,
            'user'        => ZEN_SMTP_USER,
            'from_email'  => ZEN_SMTP_FROM_EMAIL,
            'from_name'   => defined( 'ZEN_SMTP_FROM_NAME' ) ? ZEN_SMTP_FROM_NAME : '(padrão WP)',
            'encryption'  => defined( 'ZEN_SMTP_ENCRYPTION' ) ? ZEN_SMTP_ENCRYPTION : 'tls (padrão)',
            'debug'       => defined( 'ZEN_SMTP_DEBUG' ) && ZEN_SMTP_DEBUG,
        ];
    }
}
