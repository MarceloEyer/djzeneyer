<?php
/**
 * Zen BIT - Shortcode Renderer (Premium SEO)
 * File: wp-content/plugins/zen-bit/includes/class-zen-bit-shortcode.php
 *
 * - Cards SSR com microdata
 * - Link interno de cada evento: /events/?bit_event=ID
 * - JSON-LD @graph para lista (somente eventos com startDate real)
 *
 * @version 2.1.0
 */

if (!defined('ABSPATH')) exit;

class Zen_BIT_Shortcode {

    public function __construct() {
        add_shortcode('zen_bit_events', [$this, 'render_shortcode']);
    }

    private function sanitize_url($url) {
        if (empty($url) || !is_string($url)) return '';
        $url = trim($url);

        if (strpos($url, '/') === 0) return $url;

        $parsed = wp_parse_url($url);
        if (!$parsed || empty($parsed['scheme'])) return '';

        $scheme = strtolower($parsed['scheme']);
        if (!in_array($scheme, ['http', 'https'], true)) return '';

        return esc_url_raw($url);
    }

    private function compute_internal_event_id($event) {
        if (!is_array($event)) return '';
        if (!empty($event['id'])) return (string)$event['id'];

        $seed = (string)($event['url'] ?? '') . '|' . (string)($event['datetime'] ?? '');
        return md5($seed);
    }

    private function get_internal_event_url($event) {
        $id = $this->compute_internal_event_id($event);
        return add_query_arg(['bit_event' => $id], home_url('/events/'));
    }

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
            <?php echo $this->render_json_ld_list($events); ?>
        </section>
        <?php
        return ob_get_clean();
    }

    private function render_event_card($event) {
        if (!is_array($event)) return '';

        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : [];

        $event_title = !empty($event['title']) && is_string($event['title'])
            ? $event['title']
            : sprintf('DJ Zen Eyer at %s', $venue['name'] ?? 'Event');

        $event_description = !empty($event['description']) && is_string($event['description'])
            ? $event['description']
            : sprintf('DJ Zen Eyer performing live at %s in %s.',
                $venue['name'] ?? 'venue',
                $venue['city'] ?? 'city'
            );

        $event_image = !empty($event['image']) && is_string($event['image'])
            ? $this->sanitize_url($event['image'])
            : 'https://djzeneyer.com/images/event-default.jpg';

        $external_url = !empty($event['url']) && is_string($event['url'])
            ? $this->sanitize_url($event['url'])
            : '';

        $ticket_url = '';
        if (!empty($event['offers'][0]['url']) && is_string($event['offers'][0]['url'])) {
            $ticket_url = $this->sanitize_url($event['offers'][0]['url']);
        } elseif ($external_url) {
            $ticket_url = $external_url;
        }

        $internal_url = $this->get_internal_event_url($event);

        $datetime = !empty($event['datetime']) && is_string($event['datetime']) ? $event['datetime'] : '';
        $datetime_attr = '';
        $day = '--';
        $mon = '---';
        $time_formatted = '';

        if ($datetime) {
            $ts = strtotime($datetime);
            if ($ts) {
                $datetime_attr = wp_date('c', $ts);
                $day = wp_date('d', $ts);
                $mon = wp_date('M', $ts);
                $time_formatted = wp_date('H:i', $ts);
            }
        }

        ob_start();
        ?>
        <article class="zen-bit-event-card" itemscope itemtype="https://schema.org/MusicEvent">
            <meta itemprop="eventStatus" content="https://schema.org/EventScheduled">
            <meta itemprop="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode">

            <meta itemprop="name" content="<?php echo esc_attr($event_title); ?>">
            <meta itemprop="description" content="<?php echo esc_attr(wp_strip_all_tags($event_description)); ?>">
            <meta itemprop="image" content="<?php echo esc_url($event_image); ?>">
            <meta itemprop="url" content="<?php echo esc_url($internal_url); ?>">

            <?php if (!empty($external_url)): ?>
                <meta itemprop="sameAs" content="<?php echo esc_url($external_url); ?>">
            <?php endif; ?>

            <a href="<?php echo esc_url($internal_url); ?>" style="text-decoration:none;color:inherit;display:block;">
                <div class="zen-bit-event-date">
                    <?php if (!empty($datetime_attr)): ?>
                        <time itemprop="startDate" datetime="<?php echo esc_attr($datetime_attr); ?>">
                            <span class="zen-bit-date-day"><?php echo esc_html($day); ?></span>
                            <span class="zen-bit-date-month"><?php echo esc_html($mon); ?></span>
                        </time>
                    <?php else: ?>
                        <div class="zen-bit-date-unknown">
                            <span class="zen-bit-date-day"><?php echo esc_html($day); ?></span>
                            <span class="zen-bit-date-month"><?php echo esc_html($mon); ?></span>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="zen-bit-event-content">
                    <h3 class="zen-bit-event-title"><?php echo esc_html($event_title); ?></h3>

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

                    <div itemprop="performer" itemscope itemtype="https://schema.org/MusicGroup">
                        <meta itemprop="name" content="DJ Zen Eyer">
                        <meta itemprop="genre" content="Brazilian Zouk">
                        <link itemprop="url" href="<?php echo esc_url(home_url('/')); ?>">
                    </div>
                </div>
            </a>

            <?php if (!empty($ticket_url)): ?>
                <div class="zen-bit-event-tickets" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <meta itemprop="availability" content="https://schema.org/InStock">
                    <meta itemprop="url" content="<?php echo esc_url($ticket_url); ?>">

                    <a href="<?php echo esc_url($ticket_url); ?>"
                       class="zen-bit-ticket-button"
                       target="_blank"
                       rel="noopener noreferrer">
                        🎫 <?php echo esc_html__('Get Tickets', 'zen-bit'); ?>
                    </a>
                </div>
            <?php endif; ?>
        </article>
        <?php
        return ob_get_clean();
    }

    private function render_json_ld_list($events) {
        $graph = [];

        foreach ((array) $events as $event) {
            if (!is_array($event)) continue;

            $datetime = !empty($event['datetime']) && is_string($event['datetime']) ? $event['datetime'] : '';
            if (!$datetime) continue;

            $ts = strtotime($datetime);
            if (!$ts) continue;

            $venue = is_array($event['venue'] ?? null) ? $event['venue'] : [];

            $title = !empty($event['title']) && is_string($event['title'])
                ? $event['title']
                : sprintf('DJ Zen Eyer at %s', $venue['name'] ?? 'Event');

            $desc = !empty($event['description']) && is_string($event['description'])
                ? $event['description']
                : sprintf('DJ Zen Eyer performing live at %s in %s.',
                    $venue['name'] ?? 'venue',
                    $venue['city'] ?? 'city'
                );

            $img = !empty($event['image']) && is_string($event['image'])
                ? $this->sanitize_url($event['image'])
                : 'https://djzeneyer.com/images/event-default.jpg';

            $external = !empty($event['url']) && is_string($event['url']) ? $this->sanitize_url($event['url']) : '';
            $internal = $this->get_internal_event_url($event);

            $tickets = '';
            if (!empty($event['offers'][0]['url']) && is_string($event['offers'][0]['url'])) {
                $tickets = $this->sanitize_url($event['offers'][0]['url']);
            } elseif ($external) {
                $tickets = $external;
            }

            $schema = [
                '@type' => 'MusicEvent',
                '@id'   => $internal . '#event',
                'name'  => wp_strip_all_tags($title),
                'description' => wp_strip_all_tags($desc),
                'startDate' => wp_date('c', $ts),
                'eventStatus' => 'https://schema.org/EventScheduled',
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                'url' => $internal,
                'image' => $img,
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
                ],
            ];

            if (!empty($external)) $schema['sameAs'] = $external;
            if (!empty($tickets)) {
                $schema['offers'] = [
                    '@type' => 'Offer',
                    'url' => $tickets,
                    'availability' => 'https://schema.org/InStock',
                ];
            }

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
