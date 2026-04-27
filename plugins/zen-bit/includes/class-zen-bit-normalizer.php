<?php
/**
 * Zen BIT — Normalizer v2
 * Responsabilidade única: transformar dados brutos da Bandsintown em formatos
 * estáveis para o React e para Schema.org.
 *
 * BREAKING CHANGES vs v1:
 *  - ID do evento agora exposto como `event_id` (string numérica)
 *  - Campo `starts_at` substitui `datetime`
 *  - Campo `location` (objeto) substitui `venue` (objeto flat)
 *  - Lista NÃO inclui description/image/offers/lineup/raw
 *  - Detalhe inclui `ends_at`, `artists`, `tickets`
 */

namespace ZenBit;

if (!defined('ABSPATH'))
    exit;

class Zen_BIT_Normalizer
{
    // Versão — mudar invalida todos os caches de payload
    const VERSION = 'v2.1';

    // =========================================================================
    // CANONICAL PATH
    // =========================================================================

    /**
     * Gera slug URL-safe (translitera, lowercase, apenas a-z/0-9/hífen).
     */
    public static function slugify(string $text, int $max = 55): string
    {
        if ($text === '')
            return '';

        $text = wp_strip_all_tags(html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        if (function_exists('transliterator_transliterate')) {
            $text = (string) transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $text);
        } else {
            $text = mb_strtolower($text, 'UTF-8');
        }

        $text = preg_replace('/[^a-z0-9]+/', '-', $text);
        $text = trim($text, '-');

        if (mb_strlen($text) > $max) {
            $text = rtrim(mb_substr($text, 0, $max), '-');
        }

        return $text;
    }

    /**
     * Canonical path: /events/{yyyy-mm-dd}-{slug}-{event_id}
     * Fallback: /events/{event_id}
     */
    public static function build_canonical_path(string $event_id, string $datetime, string $title): string
    {
        if ($event_id === '')
            return '/events/unknown';

        $date_part = '';
        if ($datetime !== '') {
            $ts = strtotime($datetime);
            if ($ts)
                $date_part = gmdate('Y-m-d', $ts);
        }

        $slug = self::slugify($title, 55);

        if ($date_part !== '' && $slug !== '') {
            return '/events/' . $date_part . '-' . $slug . '-' . $event_id;
        }

        return '/events/' . $event_id;
    }

    // =========================================================================
    // HELPERS
    // =========================================================================

    private static function safe_text(string $text, int $max = 0): string
    {
        $text = trim(preg_replace('/\s+/', ' ', wp_strip_all_tags($text)));
        if ($max > 0 && mb_strlen($text) > $max) {
            $text = mb_substr($text, 0, $max) . '…';
        }
        return $text;
    }

    private static function safe_url(string $url): string
    {
        if ($url === '')
            return '';
        $url = trim($url);
        $parsed = wp_parse_url($url);
        if (!$parsed || empty($parsed['scheme']))
            return '';
        if (!in_array(strtolower((string) $parsed['scheme']), ['http', 'https'], true))
            return '';
        return esc_url_raw($url);
    }

    private static function normalize_location(array $raw): array
    {
        $venue = is_array($raw['venue'] ?? null) ? $raw['venue'] : [];
        return [
            'venue' => self::safe_text((string) ($venue['name'] ?? ''), 140),
            'city' => self::safe_text((string) ($venue['city'] ?? ''), 80),
            'region' => self::safe_text((string) ($venue['region'] ?? ''), 80),
            'country' => self::safe_text((string) ($venue['country'] ?? ''), 80),
            'latitude' => isset($venue['latitude']) ? (string) $venue['latitude'] : '',
            'longitude' => isset($venue['longitude']) ? (string) $venue['longitude'] : '',
        ];
    }

    /**
     * ISO 8601 com timezone
     */
    private static function parse_iso(string $datetime): string
    {
        if ($datetime === '')
            return '';
        $ts = strtotime($datetime);
        return $ts ? date('c', $ts) : $datetime;
    }

    // =========================================================================
    // LISTA — payload enxuto
    // =========================================================================

    /**
     * @return array{event_id,title,starts_at,timezone,location,canonical_path,source_url}
     */
    public static function normalize_list_item(array $raw): array
    {
        $event_id = (string) ($raw['id'] ?? '');
        $datetime = (string) ($raw['datetime'] ?? '');
        $title = self::safe_text((string) ($raw['title'] ?? ''), 180);
        $starts_at = self::parse_iso($datetime);
        $timezone = (string) ($raw['venue']['timezone'] ?? $raw['timezone'] ?? '');

        $canonical_path = self::build_canonical_path($event_id, $datetime, $title);

        return [
            'event_id' => $event_id,
            'title' => $title,
            'starts_at' => $starts_at,
            'timezone' => $timezone,
            'location' => self::normalize_location($raw),
            'canonical_path' => $canonical_path,
            'canonical_url' => home_url($canonical_path),
            'source_url' => self::safe_url((string) ($raw['url'] ?? '')),
        ];
    }

    // =========================================================================
    // DETALHE — payload completo
    // =========================================================================

    /**
     * @return array Inclui tudo de list_item + description, ends_at, image, artists, offers, tickets
     */
    public static function normalize_detail(array $raw, bool $include_raw = false): array
    {
        $base = self::normalize_list_item($raw);

        // ends_at
        $ends_at_raw = (string) ($raw['ends_at'] ?? $raw['on_sale_datetime'] ?? '');
        $ends_at = $ends_at_raw !== '' ? self::parse_iso($ends_at_raw) : '';

        // image
        $image = self::safe_url((string) ($raw['image'] ?? ''));
        if ($image === '')
            $image = 'https://djzeneyer.com/images/event-default.svg';

        // artists
        $artists = [];
        if (!empty($raw['artists']) && is_array($raw['artists'])) {
            foreach ($raw['artists'] as $a) {
                if (!is_array($a))
                    continue;
                $artists[] = [
                    'name' => self::safe_text((string) ($a['name'] ?? ''), 120),
                    'image' => self::safe_url((string) ($a['image_url'] ?? '')),
                    'source_url' => self::safe_url((string) ($a['url'] ?? '')),
                ];
            }
        }
        // fallback: lineup como strings
        if (empty($artists) && !empty($raw['lineup'])) {
            foreach ((array) $raw['lineup'] as $name) {
                $artists[] = ['name' => self::safe_text((string) $name, 120), 'image' => '', 'source_url' => ''];
            }
        }

        // offers / tickets
        $offers = [];
        $tickets = [];
        if (!empty($raw['offers']) && is_array($raw['offers'])) {
            foreach ($raw['offers'] as $offer) {
                if (!is_array($offer))
                    continue;
                $url = self::safe_url((string) ($offer['url'] ?? ''));
                $type = self::safe_text((string) ($offer['type'] ?? ''), 80);
                $status = self::safe_text((string) ($offer['status'] ?? ''), 40);
                if ($url) {
                    $offers[] = ['url' => $url, 'type' => $type, 'status' => $status];
                    $tickets[] = $url; // lista plana de URLs de tickets
                }
            }
        }

        $detail = array_merge($base, [
            'ends_at' => $ends_at,
            'description' => self::safe_text((string) ($raw['description'] ?? ''), 2000),
            'image' => $image,
            'artists' => $artists,
            'offers' => $offers,
            'tickets' => $tickets,
        ]);

        if ($include_raw) {
            $detail['raw'] = $raw;
        }

        return $detail;
    }

    // =========================================================================
    // SCHEMA JSON-LD — MusicEvent
    // =========================================================================

    /**
     * Gera schema MusicEvent para um evento (list_item OU detail já normalizado).
     *
     * REGRA PERMANENTE (Google Search Console):
     * Os campos abaixo são OBRIGATÓRIOS em todo MusicEvent — nunca omitir:
     *   - eventStatus    : sempre EventScheduled (salvo cancelamento/adiamento explícito)
     *   - location.address : omitir sub-campos vazios, nunca emitir string vazia
     *   - endDate        : fallback = startDate + 4 horas
     *   - description    : fallback = texto padrão "Live Brazilian Zouk DJ set by..."
     *   - image          : fallback = OG image padrão do site
     *   - offers         : fallback = Offer com url = canonical_url + availability correta
     *   - performer      : sempre presente (entidade DJ Zen Eyer)
     */
    public static function build_event_schema(array $event): array
    {
        if (empty($event['starts_at']))
            return [];

        $loc        = $event['location'] ?? [];
        $venue_name = $loc['venue'] ?? '';
        $city       = $loc['city'] ?? '';
        $region     = $loc['region'] ?? '';
        $country    = $loc['country'] ?? '';
        $is_online  = stripos($venue_name, 'online') !== false;

        // Endereço — emitir apenas sub-campos não-vazios para evitar erros do Google
        $address = ['@type' => 'PostalAddress'];
        if (!$is_online && $venue_name && $venue_name !== 'TBA')
            $address['streetAddress'] = $venue_name;
        if ($city)    $address['addressLocality'] = $city;
        if ($region)  $address['addressRegion']   = $region;
        if ($country) $address['addressCountry']  = $country;

        // endDate: fallback startDate + 4h quando não fornecido
        $start_ts = strtotime($event['starts_at']);
        $end_date = !empty($event['ends_at'])
            ? $event['ends_at']
            : gmdate('c', $start_ts + 4 * 3600);

        $is_past = $start_ts < time();

        // description: fallback descritivo quando vazio
        $description = !empty($event['description'])
            ? wp_strip_all_tags($event['description'])
            : sprintf(
                'Live Brazilian Zouk DJ set by DJ Zen Eyer%s.',
                $venue_name && $venue_name !== 'TBA' ? ' at ' . $venue_name : ''
            );
        $description = substr($description, 0, 300);

        // image: fallback OG padrão do site
        $default_image = home_url('/og-image.jpg');
        $image = !empty($event['image']) ? $event['image'] : $default_image;

        // canonical url para offers
        $canonical_url = !empty($event['canonical_url']) ? $event['canonical_url'] : home_url('/eventos/');

        // offers: usar dados reais quando disponíveis, senão fallback
        if (!empty($event['offers']) && is_array($event['offers'])) {
            $offer    = $event['offers'][0];
            $offers = [
                '@type'        => 'Offer',
                'url'          => $offer['url'] ?? $canonical_url,
                'availability' => $is_past
                    ? 'https://schema.org/Discontinued'
                    : 'https://schema.org/InStock',
            ];
            if (!empty($offer['price']))       $offers['price']         = $offer['price'];
            if (!empty($offer['priceCurrency'])) $offers['priceCurrency'] = $offer['priceCurrency'];
        } elseif (!empty($event['event_ticket'])) {
            $offers = [
                '@type'        => 'Offer',
                'url'          => $event['event_ticket'],
                'availability' => $is_past
                    ? 'https://schema.org/Discontinued'
                    : 'https://schema.org/InStock',
            ];
        } else {
            $offers = [
                '@type'        => 'Offer',
                'url'          => $canonical_url,
                'availability' => $is_past
                    ? 'https://schema.org/Discontinued'
                    : 'https://schema.org/LimitedAvailability',
            ];
        }

        $schema = [
            '@type'               => 'MusicEvent',
            'name'                => $event['title'] ?? '',
            'startDate'           => $event['starts_at'],
            'endDate'             => $end_date,
            // eventStatus SEMPRE presente — passado ou futuro
            // Só alterar para EventCancelled/EventPostponed quando a API retornar esse dado
            'eventStatus'         => 'https://schema.org/EventScheduled',
            'eventAttendanceMode' => $is_online
                ? 'https://schema.org/OnlineEventAttendanceMode'
                : 'https://schema.org/OfflineEventAttendanceMode',
            'url'                 => $canonical_url,
            'description'         => $description,
            'image'               => $image,
            'location'            => [
                '@type'   => 'Place',
                'name'    => $venue_name ?: 'TBA',
                'address' => $address,
            ],
            'performer'           => self::build_performer_entity(),
            'offers'              => $offers,
        ];

        if (!empty($event['source_url']))
            $schema['sameAs'] = $event['source_url'];

        return $schema;
    }

    /**
     * @return array Performer entity reutilizável com @id para ligação semântica no @graph
     */
    public static function build_performer_entity(): array
    {
        return [
            '@type' => 'MusicGroup',
            '@id' => home_url('/') . '#djzeneyer',
            'name' => 'DJ Zen Eyer',
            'genre' => 'Brazilian Zouk',
            'url' => home_url('/'),
            'sameAs' => [
                'https://www.instagram.com/djzeneyer/',
                'https://soundcloud.com/djzeneyer',
                'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
            ],
        ];
    }
}
