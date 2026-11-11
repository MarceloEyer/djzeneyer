<?php
/**
 * Email Template: Header (Gmail-safe, mobile-friendly)
 *
 * This template can be overridden by copying it to yourtheme/gamipress/emails/header.php
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$locale = function_exists( 'determine_locale' ) ? determine_locale() : get_locale();
$is_pt  = ( stripos( (string) $locale, 'pt_' ) === 0 );
$lang   = $is_pt ? 'pt-BR' : 'en-US';
$site   = get_bloginfo( 'name' );
$title  = $is_pt ? 'Atualizacao da sua pontuacao' : 'Your score update';
$preview_text = $is_pt
    ? 'Voce recebeu uma atualizacao na sua conta DJ Zen Eyer.'
    : 'You have a new update in your DJ Zen Eyer account.';
?>
<!DOCTYPE html>
<html lang="<?php echo esc_attr( $lang ); ?>">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=<?php bloginfo( 'charset' ); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?php echo esc_html( $title ); ?></title>
</head>
<body style="margin:0; padding:0; width:100% !important; background-color:#f5f6f8; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
    <div style="display:none!important; visibility:hidden; opacity:0; color:transparent; height:0; width:0; overflow:hidden; mso-hide:all;">
        <?php echo esc_html( $preview_text ); ?>
    </div>
    <center style="width:100%; background-color:#f5f6f8; padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; margin:0 auto; background-color:#ffffff; border:1px solid #e8ebef; border-radius:14px;">
            <tr>
                <td style="padding:28px 24px 20px 24px; text-align:center; border-bottom:1px solid #eef2f6;">
                    <div style="font-family:Arial,Helvetica,sans-serif; font-size:28px; font-weight:700; line-height:1.2; color:#0f172a; letter-spacing:0.5px;">
                        <?php echo esc_html( $site ); ?>
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding:28px 24px; font-family:Arial,Helvetica,sans-serif; font-size:18px; line-height:1.65; color:#1f2937;">
