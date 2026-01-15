<?php
/**
 * Zen BIT - Shortcode Renderer
 * File: wp-content/plugins/zen-bit/includes/class-zen-bit-shortcode.php
 *
 * Objetivo:
 * - Renderizar eventos (HTML SSR) + Microdata Schema.org (MusicEvent)
 * - Injetar JSON-LD robusto (Google/IA/SEO) usando @graph
 * - NÃO inventar startDate nem preço (evita schema “enganoso”)
 *
 * @version 2.0.0
 */

if (!defined('ABSPATH')) exit;

class Zen_BIT_Shortcode {

    public function __construct() {
        add_shortcode('zen_bit_events', [$this, 'render_shortcode']);
    }

    /**
     * Segurança: higieniza URL (bloqueia javascript:, data:, etc)
     */
    private function sanitize_url($url) {
        if (empty($url) || !is_string($url)) return '';
        $url = trim($url);

        // permite caminhos relativos internos
        if (strpos($url, '/') === 0) return $url;

        $parsed = wp_parse_url($url);
        if (!$parsed || empty($parsed['scheme'])) return '';

        $scheme = strtolower($parsed['scheme']);
        if (!in_array($scheme, ['http', 'https'], true)) return '';

        return esc_url_raw($url);
    }

    /**
     * Gera uma URL “estável” no seu domínio para amarrar a entidade do evento no schema
     */
    private function get_internal_event_url($event) {
        $event_id = '';

        if (!empty($event['id'])) {
            $event_id = (string) $event['id'];
        } else {
            $seed = (string) ($event['url'] ?? '') . '|' . (string) ($event['datetime'] ?? '');
            $event_id = md5($seed);
        }

        return add_query_arg(
            ['bit_event' => $event_id],
            home_url('/events/')
        );
    }

    /**
     * Renderiza shortcode [zen_bit_events limit="15"]
     */
    public function render_shortcode($atts) {
        $atts = shortcode_atts([
            'limit' => 15,
        ], $atts, 'zen_bit_events');

        $limit = absint($atts['limit']);
        if ($limit <= 0) $limit = 15;

        if (!class_exists('Zen_BIT_API')) {
            return '<div class="zen-bit-error">Zen BIT API not available.</div>';
        }

        $events = Zen_BIT_API::get_events($limit);

        if (!is_array($events) || empty($events)) {
            // SSR-friendly para bots (não deixa “vazio”)
            return '<div class="zen-bit-empty">No upcoming events at the moment.</div>';
        }

        ob_start();
        ?>
        <section class="zen-bit-events-wrap">
            <div class="zen-bit-events-grid">
                <?php foreach ($events as $event): ?>
                    <?php echo $this->render_event_card($event); ?>
                <?php endforeach; ?>
            </div>

            <?php
            // JSON-LD no HTML SSR (bots veem sem depender de JS)
            echo $this->render_json_ld($events);
            ?>
        </section>
        <?php
        return ob_get_clean();
    }

    /**
     * Renderiza card SSR com Microdata (MusicEvent)
     */
    private function render_event_card($event) {
        if (!is_array($event)) return '';

        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : [];

        // datetime: Bandsintown costuma retornar ISO. Se vier vazio, não inventa.
        $datetime = !empty($event['datetime']) && is_string($event['datetime']) ? $event['datetime'] : '';
        $has_datetime = ($datetime !== '');

        // título
        $event_title = !empty($event['title']) && is_string($event['title'])
            ? $event['title']
            : sprintf('DJ Zen Eyer at %s', $venue['name'] ?? 'Event');

        // descrição (não inventa muito; apenas fallback textual)
        $event_description = !empty($event['description']) && is_string($event['description'])
            ? $event['description']
            : sprintf(
                'DJ Zen Eyer performing live at %s in %s.',
                $venue['name'] ?? 'venue',
                $venue['city'] ?? 'city'
            );

        // imagem
        $event_image = !empty($event['image']) && is_string($event['image'])
            ? $this->sanitize_url($event['image'])
            : 'https://djzeneyer.com/images/event-default.jpg';

        // URL externa (Bandsintown)
        $external_url = !empty($event['url']) && is_string($event['url'])
            ? $this->sanitize_url($event['url'])
            : '';

        // ticket URL (prioriza offers[0].url)
        $ticket_url = '';
        if (!empty($event['offers'][0]['url']) && is_string($event['offers'][0]['url'])) {
            $ticket_url = $this->sanitize_url($event['offers'][0]['url']);
        } elseif ($external_url) {
            $ticket_url = $external_url;
        }

        // URL interna estável (seu domínio)
        $internal_url = $this->get_internal_event_url($event);

        // formatação de data/hora (apenas se existir datetime real)
        $day = '';
        $mon = '';
        $time_formatted = '';
        $datetime_attr = '';

        if ($has_datetime) {
            $ts = strtotime($datetime);
            if ($ts) {
                $day = wp_date('d', $ts);
                $mon = wp_date('M', $ts);
                $time_formatted = wp_date('H:i', $ts);
                $datetime_attr = wp_date('c', $ts);
            }
        }

        ob_start();
        ?>
        <article class="zen-bit-event-card" itemscope itemtype="https://schema.org/MusicEvent">
            <!-- Microdata: sempre põe campos “seguros” -->
            <meta itemprop="eventStatus" content="https://schema.org/EventScheduled">
            <meta itemprop="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode">

            <meta itemprop="name" content="<?php echo esc_attr($event_title); ?>">
            <meta itemprop="description" content="<?php echo esc_attr(wp_strip_all_tags($event_description)); ?>">
            <meta itemprop="image" content="<?php echo esc_url($event_image); ?>">

            <!-- URL canônica interna + sameAs externa -->
            <meta itemprop="url" content="<?php echo esc_url($internal_url); ?>">
            <?php if (!empty($external_url)): ?>
                <meta itemprop="sameAs" content="<?php echo esc_url($external_url); ?>">
            <?php endif; ?>

            <div class="zen-bit-event-date">
                <?php if (!empty($datetime_attr)): ?>
                    <time itemprop="startDate" datetime="<?php echo esc_attr($datetime_attr); ?>">
                        <span class="zen-bit-date-day"><?php echo esc_html($day); ?></span>
                        <span class="zen-bit-date-month"><?php echo esc_html($mon); ?></span>
                    </time>
                <?php else: ?>
                    <div class="zen-bit-date-unknown">
                        <span class="zen-bit-date-day">--</span>
                        <span class="zen-bit-date-month">---</span>
                    </div>
                <?php endif; ?>
            </div>

            <div class="zen-bit-event-content">
                <h3 class="zen-bit-event-title"><?php echo esc_html($event_title); ?></h3>

                <!-- Location -->
                <div class="zen-bit-event-venue" itemprop="location" itemscope itemtype="https://schema.org/Place">
                    <meta itemprop="name" content="<?php echo esc_attr($venue['name'] ?? 'Venue'); ?>">

                    <span class="zen-bit-venue-icon">📍</span>
                    <span class="zen-bit-venue-name"><?php echo esc_html($venue['name'] ?? ''); ?></span>

                    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                        <meta itemprop="addressLocality" content="<?php echo esc_attr($venue['city'] ?? ''); ?>">
                        <meta itemprop="addressRegion" content="<?php echo esc_attr($venue['region'] ?? ''); ?>">
                        <meta itemprop="addressCountry" content="<?php echo esc_attr($venue['country'] ?? ''); ?>">

                        <span class="zen-bit-venue-location">
                            <?php
                            $city = $venue['city'] ?? '';
                            $country = $venue['country'] ?? '';
                            echo esc_html($city);
                            if (!empty($city) && !empty($country)) echo esc_html(', ');
                            echo esc_html($country);
                            ?>
                        </span>
                    </div>
                </div>

                <?php if (!empty($time_formatted)): ?>
                    <div class="zen-bit-event-time">
                        <span class="zen-bit-time-icon">🕐</span>
                        <span><?php echo esc_html($time_formatted); ?></span>
                    </div>
                <?php endif; ?>

                <!-- Performer -->
                <div itemprop="performer" itemscope itemtype="https://schema.org/MusicGroup">
                    <meta itemprop="name" content="DJ Zen Eyer">
                    <meta itemprop="genre" content="Brazilian Zouk">
                    <link itemprop="url" href="<?php echo esc_url(home_url('/')); ?>">
                </div>

                <!-- Offers: não inventa preço -->
                <?php if (!empty($ticket_url)): ?>
                    <div class="zen-bit-event-tickets" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                        <meta itemprop="availability" content="https://schema.org/InStock">
                        <meta itemprop="url" content="<?php echo esc_url($ticket_url); ?>">

                        <a
                            href="<?php echo esc_url($ticket_url); ?>"
                            class="zen-bit-ticket-button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🎫 <?php echo esc_html__('Get Tickets', 'zen-bit'); ?>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </article>
        <?php
        return ob_get_clean();
    }

    /**
     * JSON-LD robusto (Google/IA/SEO): @context + @graph de MusicEvent
     * - NÃO inventa startDate
     * - NÃO inventa price
     * - usa url interna + sameAs externa
     */
    private function render_json_ld($events) {
        $graph = [];

        foreach ((array) $events as $event) {
            if (!is_array($event)) continue;

            $venue = is_array($event['venue'] ?? null) ? $event['venue'] : [];

            $datetime = !empty($event['datetime']) && is_string($event['datetime'])
                ? $event['datetime']
                : '';

            // Sem startDate real => não publica schema do evento
            if ($datetime === '') continue;

            $ts = strtotime($datetime);
            if (!$ts) continue;

            $start_iso = wp_date('c', $ts);

            $event_title = !empty($event['title']) && is_string($event['title'])
                ? $event['title']
                : sprintf('DJ Zen Eyer at %s', $venue['name'] ?? 'Event');

            $event_description = !empty($event['description']) && is_string($event['description'])
                ? $event['description']
                : sprintf(
                    'DJ Zen Eyer performing live at %s in %s.',
                    $venue['name'] ?? 'venue',
                    $venue['city'] ?? 'city'
                );

            $event_image = !empty($event['image']) && is_string($event['image'])
                ? $this->sanitize_url($event['image'])
                : 'https://djzeneyer.com/images/event-default.jpg';

            $external_url = !empty($event['url']) && is_string($event['url'])
                ? $this->sanitize_url($event['url'])
                : '';

            $internal_url = $this->get_internal_event_url($event);

            // ticket url
            $ticket_url = '';
            if (!empty($event['offers'][0]['url']) && is_string($event['offers'][0]['url'])) {
                $ticket_url = $this->sanitize_url($event['offers'][0]['url']);
            } elseif (!empty($external_url)) {
                $ticket_url = $external_url;
            }

            $schema = [
                '@type' => 'MusicEvent',
                '@id'   => $internal_url . '#event',
                'name'  => wp_strip_all_tags($event_title),
                'description' => wp_strip_all_tags($event_description),
                'startDate' => $start_iso,
                'eventStatus' => 'https://schema.org/EventScheduled',
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                'url' => $internal_url,
                'image' => $event_image,
                'location' => [
                    '@type' => 'Place',
                    'name' => $venue['name'] ?? 'Venue',
                    'address' => [
                        '@type' => 'PostalAddress',
                        'addressLocality' => $venue['city'] ?? '',
                        'addressRegion'   => $venue['region'] ?? '',
                        'addressCountry'  => $venue['country'] ?? '',
                    ],
                ],
                'performer' => [
                    '@type' => 'MusicGroup',
                    'name' => 'DJ Zen Eyer',
                    'genre' => 'Brazilian Zouk',
                    'url' => home_url('/'),
                    'sameAs' => [
                        'https://www.instagram.com/djzeneyer/',
                        'https://soundcloud.com/djzeneyer',
                        'https://www.bandsintown.com/a/15552355',
                    ],
                ],
            ];

            if (!empty($external_url)) {
                $schema['sameAs'] = $external_url;
            }

            if (!empty($ticket_url)) {
                $schema['offers'] = [
                    '@type' => 'Offer',
                    'url' => $ticket_url,
                    'availability' => 'https://schema.org/InStock',
                ];
            }

            // remove vazios
            $schema = array_filter($schema, function($v) {
                return !($v === '' || $v === null || $v === []);
            });

            $graph[] = $schema;
        }

        if (empty($graph)) return '';

        $json_ld = [
            '@context' => 'https://schema.org',
            '@graph' => $graph,
        ];

        return '<script type="application/ld+json">' .
            wp_json_encode($json_ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) .
            '</script>';
    }
}

new Zen_BIT_Shortcode();
