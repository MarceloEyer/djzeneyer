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
            $image = 'https://djzeneyer.com/images/event-default.jpg';

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
     * Campos opcionais só são incluídos quando presentes.
     */
    public static function build_event_schema(array $event): array
    {
        if (empty($event['starts_at']))
            return [];

        $loc = $event['location'] ?? [];
        $schema = [
            '@type' => 'MusicEvent',
            'name' => $event['title'] ?? '',
            'startDate' => $event['starts_at'],
            'eventStatus' => 'https://schema.org/EventScheduled',
            'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
            'url' => $event['canonical_url'] ?? '',
            'location' => [
                '@type' => 'Place',
                'name' => $loc['venue'] ?? '',
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressLocality' => $loc['city'] ?? '',
                    'addressRegion' => $loc['region'] ?? '',
                    'addressCountry' => $loc['country'] ?? '',
                ],
            ],
        ];

        // Campos do detalhe
        if (!empty($event['ends_at']))
            $schema['endDate'] = $event['ends_at'];
        if (!empty($event['description']))
            $schema['description'] = $event['description'];
        if (!empty($event['image']))
            $schema['image'] = $event['image'];
        if (!empty($event['source_url']))
            $schema['sameAs'] = $event['source_url'];

        if (!empty($event['offers'])) {
            $offer = $event['offers'][0];
            $schema['offers'] = [
                '@type' => 'Offer',
                'url' => $offer['url'],
                'availability' => 'https://schema.org/InStock',
            ];
        }

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
