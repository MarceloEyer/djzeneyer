<?php
/**
 * Email Template: Footer (Gmail-safe, mobile-friendly)
 *
 * This template can be overridden by copying it to yourtheme/gamipress/emails/footer.php
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

$locale = function_exists( 'determine_locale' ) ? determine_locale() : get_locale();
$is_pt  = ( stripos( (string) $locale, 'pt_' ) === 0 );
$year   = gmdate( 'Y' );

$member_text = $is_pt
    ? 'Voce recebeu este email porque sua conta possui atividade de pontuacao no DJ Zen Eyer.'
    : 'You received this email because your account has score activity on DJ Zen Eyer.';

$manage_label = $is_pt ? 'Gerenciar preferencias' : 'Manage preferences';
$unsubscribe_label = $is_pt ? 'Desinscrever destes emails' : 'Unsubscribe from these emails';
$copyright_text = $is_pt
    ? 'Todos os direitos reservados.'
    : 'All rights reserved.';

$default_manage_url = home_url( $is_pt ? '/pt/minha-conta/' : '/my-account/' );
$manage_url = apply_filters( 'gamipress_email_manage_url', $default_manage_url );
$unsubscribe_url = apply_filters( 'gamipress_email_unsubscribe_url', add_query_arg( 'gamipress_unsubscribe', '1', $manage_url ) );
?>
                </td>
            </tr>
            <tr>
                <td style="padding:0 24px 28px 24px; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.55; color:#6b7280; text-align:center; border-top:1px solid #eef2f6;">
                    <p style="margin:18px 0 8px 0;"><?php echo esc_html( $member_text ); ?></p>
                    <p style="margin:0 0 8px 0;">
                        <a href="<?php echo esc_url( $manage_url ); ?>" style="color:#0f62fe; text-decoration:underline;"><?php echo esc_html( $manage_label ); ?></a>
                        &nbsp;|&nbsp;
                        <a href="<?php echo esc_url( $unsubscribe_url ); ?>" style="color:#0f62fe; text-decoration:underline;"><?php echo esc_html( $unsubscribe_label ); ?></a>
                    </p>
                    <p style="margin:0; font-size:12px; color:#9ca3af;">&copy; <?php echo esc_html( $year ); ?> DJ ZEN EYER. <?php echo esc_html( $copyright_text ); ?></p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
