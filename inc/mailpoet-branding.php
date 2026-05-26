<?php
/**
 * MailPoet branding and transactional email copy overrides.
 *
 * Keeps plugin-generated newsletter emails aligned with the Zen Eyer brand without
 * editing vendor plugin files directly.
 */

if (!defined('ABSPATH')) exit;

function djz_mailpoet_normalize_mail_message($message): string
{
    if (is_array($message)) {
        return implode("\n", array_map('strval', $message));
    }

    return (string) $message;
}

function djz_mailpoet_headers_contain_html($headers): bool
{
    $header_lines = is_array($headers) ? $headers : explode("\n", (string) $headers);

    foreach ($header_lines as $header) {
        if (stripos((string) $header, 'content-type:') !== false && stripos((string) $header, 'text/html') !== false) {
            return true;
        }
    }

    return false;
}

function djz_mailpoet_is_html_message(string $message, $headers): bool
{
    if (djz_mailpoet_headers_contain_html($headers)) {
        return true;
    }

    return $message !== wp_strip_all_tags($message);
}

function djz_mailpoet_extract_first_url(string $message): string
{
    $decoded = html_entity_decode($message, ENT_QUOTES | ENT_HTML5, 'UTF-8');

    if (!preg_match('#https?://[^\s<>")]+#i', $decoded, $matches)) {
        return '';
    }

    return rtrim($matches[0], '.,!?)\'"');
}

function djz_mailpoet_extract_subscriber_email(string $message): string
{
    if (!preg_match('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', $message, $matches)) {
        return '';
    }

    return sanitize_email($matches[0]);
}

function djz_mailpoet_extract_confirmation_name(string $message): string
{
    if (!preg_match('/\bHello\s+([^,\n]+),/i', wp_strip_all_tags($message), $matches)) {
        return '';
    }

    return trim(sanitize_text_field($matches[1]));
}

function djz_mailpoet_extract_list_name(string $message): string
{
    $plain = preg_replace('/\s+/', ' ', wp_strip_all_tags($message));
    if (!is_string($plain)) {
        return '';
    }

    if (!preg_match('/has just subscribed to your list\s+(.+?)(?:!|\.| Cheers| You can disable)/i', $plain, $matches)) {
        return '';
    }

    return trim(sanitize_text_field($matches[1]));
}

function djz_mailpoet_render_text_email(array $paragraphs): string
{
    return implode("\n\n", array_filter(array_map('trim', $paragraphs)));
}

function djz_mailpoet_render_html_email(array $paragraphs, string $button_url = '', string $button_label = ''): string
{
    $html = '<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#111827;">';

    foreach ($paragraphs as $paragraph) {
        $paragraph = trim((string) $paragraph);
        if ($paragraph === '') {
            continue;
        }

        $html .= '<p style="margin:0 0 16px;">' . esc_html($paragraph) . '</p>';
    }

    if ($button_url !== '' && $button_label !== '') {
        $html .= '<p style="margin:24px 0;">';
        $html .= '<a href="' . esc_url($button_url) . '" style="display:inline-block;background:#d7ff3f;color:#111827;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:999px;">' . esc_html($button_label) . '</a>';
        $html .= '</p>';
    }

    $html .= '</div>';

    return $html;
}

function djz_mailpoet_build_confirmation_email(string $message, $headers): string
{
    $confirm_url = djz_mailpoet_extract_first_url($message);
    $first_name = djz_mailpoet_extract_confirmation_name($message);
    $greeting = $first_name !== '' ? sprintf('Olá, %s.', $first_name) : 'Olá.';
    $is_html = djz_mailpoet_is_html_message($message, $headers);

    $paragraphs = [
        $greeting,
        'Você pediu para receber novidades do Zen Eyer.',
        'Para confirmar sua inscrição na newsletter Zen Tribe, clique no botão abaixo.',
    ];

    if (!$is_html && $confirm_url !== '') {
        $paragraphs[] = sprintf('Confirmar inscrição: %s', $confirm_url);
    }

    $paragraphs[] = 'Se você não pediu isso, pode ignorar este e-mail com segurança. Nenhum outro e-mail será enviado se a inscrição não for confirmada.';
    $paragraphs[] = 'Com carinho,';
    $paragraphs[] = 'Zen Eyer';

    return $is_html
        ? djz_mailpoet_render_html_email($paragraphs, $confirm_url, 'Confirmar inscrição')
        : djz_mailpoet_render_text_email($paragraphs);
}

function djz_mailpoet_build_admin_notification_email(string $message, $headers): string
{
    $subscriber_email = djz_mailpoet_extract_subscriber_email($message);
    $list_name = djz_mailpoet_extract_list_name($message);
    $settings_url = djz_mailpoet_extract_first_url($message);
    $is_html = djz_mailpoet_is_html_message($message, $headers);

    $paragraphs = [
        'Olá, Zen Eyer.',
        'Uma nova pessoa se inscreveu na newsletter do site.',
        $subscriber_email !== '' ? sprintf('Assinante: %s', $subscriber_email) : '',
        $list_name !== '' ? sprintf('Lista: %s', $list_name) : '',
    ];

    if (!$is_html && $settings_url !== '') {
        $paragraphs[] = sprintf('Configurações da newsletter: %s', $settings_url);
    }

    $paragraphs[] = 'Zen Eyer Website';

    return $is_html
        ? djz_mailpoet_render_html_email($paragraphs, $settings_url, 'Abrir configurações')
        : djz_mailpoet_render_text_email($paragraphs);
}

add_filter('wp_mail', function (array $args): array {
    $subject = isset($args['subject']) ? (string) $args['subject'] : '';
    $message = djz_mailpoet_normalize_mail_message($args['message'] ?? '');
    $headers = $args['headers'] ?? [];
    $message_lc = strtolower($message);
    $subject_lc = strtolower($subject);

    $is_mailpoet_admin_notification = (
        str_starts_with($subject, 'New subscriber to') ||
        str_contains($message_lc, 'the mailpoet plugin') ||
        str_contains($message_lc, 'has just subscribed to your list')
    );

    if ($is_mailpoet_admin_notification) {
        $args['subject'] = 'Novo inscrito na newsletter Zen Eyer';
        $args['message'] = djz_mailpoet_build_admin_notification_email($message, $headers);
        return $args;
    }

    $is_mailpoet_confirmation = (
        str_contains($message_lc, 'please confirm your subscription') &&
        str_contains($message_lc, 'mailpoet_router') &&
        str_contains($message_lc, 'action=confirm')
    ) || str_contains($subject_lc, 'confirme sua assinatura em zen eyer');

    if ($is_mailpoet_confirmation) {
        $args['subject'] = 'Confirme sua inscrição na newsletter Zen Eyer';
        $args['message'] = djz_mailpoet_build_confirmation_email($message, $headers);
    }

    return $args;
}, 20);
