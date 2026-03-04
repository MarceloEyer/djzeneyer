<?php
/**
 * Zen BIT — Normalizer
 * Responsabilidade única: transformar dados brutos da Bandsintown em formatos
 * estáveis e semânticos para o React e para Schema.org.
 *
 * Regras:
 *  - Para o mesmo evento, sempre produz o mesmo canonical_path (determinístico).
 *  - Lista (normalize_list_item): payload enxuto — sem description/image/offers.
 *  - Detalhe (normalize_detail): payload completo + todos os campos opcionais.
 */

if (!defined('ABSPATH'))
    exit;

class Zen_BIT_Normalizer
{
    // =========================================================================
    // CANONICAL PATH
    // =========================================================================

    /**
     * Gera um slug URL-safe a partir de texto livre.
     * Translitera acentos, converte para minúsculas, troca caracteres não-ASCII
     * por hífen e trunca para $max caracteres.
     *
     * @param string $text
     * @param int    $max  Comprimento máximo do slug (sem truncar no meio de palavra)
     * @return string
     */
    public static function slugify(string $text, int $max = 60): string
    {
        if ($text === '')
            return '';

        // Remove tags e entidades HTML
        $text = wp_strip_all_tags(html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8'));

        // Translitera caracteres unicode para ASCII (ex: ã→a, ç→c, é→e)
        if (function_exists('transliterator_transliterate')) {
            $text = (string) transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $text);
        } else {
            $text = mb_strtolower($text, 'UTF-8');
        }

        // Substitui tudo que não seja letra, dígito ou hífen por hífen
        $text = preg_replace('/[^a-z0-9]+/', '-', $text);

        // Remove hífens nas bordas
        $text = trim($text, '-');

        // Trunca (sem cortar no meio)
        if (mb_strlen($text) > $max) {
            $text = rtrim(mb_substr($text, 0, $max), '-');
        }

        return $text;
    }

    /**
     * Constrói o canonical_path estável para um evento.
     * Padrão: /events/{yyyy-mm-dd}-{slug}-{id}
     * Fallback: /events/{id}
     *
     * @param array $event Evento já normalizado OU raw (precisa de datetime e id)
     * @return string
     */
    public static function build_canonical_path(array $event): string
    {
        $id = (string) ($event['id'] ?? '');
        $datetime = (string) ($event['datetime'] ?? $event['starts_at'] ?? '');
        $title = (string) ($event['title'] ?? '');

        if ($id === '')
            return '/events/unknown';

        // Data do evento (somente a parte YYYY-MM-DD)
        $date_part = '';
        if ($datetime !== '') {
            $ts = strtotime($datetime);
            if ($ts) {
                $date_part = gmdate('Y-m-d', $ts);
            }
        }

        // Slug do título
        $slug = self::slugify($title, 55);

        // Monta o path
        if ($date_part !== '' && $slug !== '') {
            return '/events/' . $date_part . '-' . $slug . '-' . $id;
        }

        return '/events/' . $id;
    }

    // =========================================================================
    // HELPERS INTERNOS
    // =========================================================================

    private static function safe_text(string $text, int $max = 0): string
    {
        $text = wp_strip_all_tags($text);
        $text = trim(preg_replace('/\s+/', ' ', $text));
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
        if (str_starts_with($url, '/'))
            return $url;
        $parsed = wp_parse_url($url);
        if (!$parsed || empty($parsed['scheme']))
            return '';
        $scheme = strtolower((string) $parsed['scheme']);
        if (!in_array($scheme, ['http', 'https'], true))
            return '';
        return esc_url_raw($url);
    }

    private static function parse_timezone(array $event): string
    {
        return (string) ($event['venue']['timezone'] ?? $event['timezone'] ?? '');
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

    private static function parse_starts_at(array $raw): string
    {
        $dt = (string) ($raw['datetime'] ?? '');
        if ($dt === '')
            return '';
        $ts = strtotime($dt);
        return $ts ? wp_date('c', $ts) : $dt;
    }

    private static function build_source_url(array $raw): string
    {
        $url = (string) ($raw['url'] ?? '');
        return self::safe_url($url);
    }

    private static function build_image(array $raw): string
    {
        $img = (string) ($raw['image'] ?? '');
        $safe = $img !== '' ? self::safe_url($img) : '';
        return $safe !== '' ? $safe : 'https://djzeneyer.com/images/event-default.jpg';
    }

    private static function build_offers(array $raw): array
    {
        $out = [];
        if (!empty($raw['offers']) && is_array($raw['offers'])) {
            foreach ($raw['offers'] as $offer) {
                if (!is_array($offer))
                    continue;
                $url = self::safe_url((string) ($offer['url'] ?? ''));
                if ($url) {
                    $out[] = [
                        'url' => $url,
                        'type' => self::safe_text((string) ($offer['type'] ?? ''), 80),
                    ];
                }
            }
        }
        return $out;
    }

    private static function build_lineup(array $raw): array
    {
        $out = [];
        if (!empty($raw['lineup']) && is_array($raw['lineup'])) {
            foreach ($raw['lineup'] as $artist) {
                $out[] = self::safe_text((string) $artist, 120);
            }
        }
        return $out;
    }

    // =========================================================================
    // PAYLOAD LISTA — Enxuto (sem description/image/offers/lineup)
    // =========================================================================

    /**
     * Normaliza um evento bruto da API para o formato de lista (payload enxuto).
     * Não inclui: description, image, offers, lineup.
     *
     * @param array $raw Evento bruto do Bandsintown
     * @return array
     */
    public static function normalize_list_item(array $raw): array
    {
        $starts_at = self::parse_starts_at($raw);
        $canonical_path = self::build_canonical_path(array_merge($raw, ['starts_at' => $starts_at]));
        $canonical_url = home_url($canonical_path);

        return [
            'id' => (string) ($raw['id'] ?? ''),
            'title' => self::safe_text((string) ($raw['title'] ?? ''), 180),
            'starts_at' => $starts_at,
            'timezone' => self::parse_timezone($raw),
            'location' => self::normalize_location($raw),
            'canonical_path' => $canonical_path,
            'canonical_url' => $canonical_url,
        ];
    }

    // =========================================================================
    // PAYLOAD DETALHE — Completo
    // =========================================================================

    /**
     * Normaliza um evento bruto para o formato completo (página de detalhe).
     * Inclui todos os campos: description, image, offers, lineup, source_url.
     * O campo 'raw' é incluído apenas se $include_raw === true.
     *
     * @param array $raw         Evento bruto do Bandsintown
     * @param bool  $include_raw Incluir payload raw para debug
     * @return array
     */
    public static function normalize_detail(array $raw, bool $include_raw = false): array
    {
        $list = self::normalize_list_item($raw);
        $description = self::safe_text((string) ($raw['description'] ?? ''), 1000);
        $image = self::build_image($raw);
        $offers = self::build_offers($raw);
        $lineup = self::build_lineup($raw);
        $source_url = self::build_source_url($raw);

        $detail = array_merge($list, [
            'description' => $description,
            'image' => $image,
            'offers' => $offers,
            'lineup' => $lineup,
            'source_url' => $source_url,
        ]);

        if ($include_raw) {
            $detail['raw'] = $raw;
        }

        return $detail;
    }

    // =========================================================================
    // SCHEMA JSON-LD
    // =========================================================================

    /**
     * Gera um objeto MusicEvent Schema.org para o rich result do Google.
     * Usa canonical_url como url principal e source_url como sameAs.
     *
     * @param array $detail Evento normalizado por normalize_detail()
     * @return array
     */
    public static function build_event_schema(array $detail): array
    {
        if (empty($detail['starts_at']))
            return [];

        $loc = $detail['location'] ?? [];
        $schema = [
            '@type' => 'MusicEvent',
            'name' => $detail['title'] ?? '',
            'startDate' => $detail['starts_at'],
            'eventStatus' => 'https://schema.org/EventScheduled',
            'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
            'url' => $detail['canonical_url'] ?? '',
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
            'performer' => [
                '@type' => 'MusicGroup',
                'name' => 'DJ Zen Eyer',
                'url' => home_url('/'),
                'sameAs' => [
                    'https://www.instagram.com/djzeneyer/',
                    'https://soundcloud.com/djzeneyer',
                    'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
                ],
            ],
        ];

        // Campos opcionais (detalhe)
        if (!empty($detail['description'])) {
            $schema['description'] = $detail['description'];
        }
        if (!empty($detail['image'])) {
            $schema['image'] = $detail['image'];
        }
        if (!empty($detail['source_url'])) {
            $schema['sameAs'] = $detail['source_url'];
        }
        if (!empty($detail['offers'])) {
            $offer = $detail['offers'][0];
            $schema['offers'] = [
                '@type' => 'Offer',
                'url' => $offer['url'],
                'availability' => 'https://schema.org/InStock',
            ];
        }

        return array_filter($schema, fn($v) => $v !== '' && $v !== null && $v !== []);
    }
}
