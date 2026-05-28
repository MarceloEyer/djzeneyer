<?php
/**
 * Server-rendered SEO fallbacks for the headless shell.
 */

if (!defined('ABSPATH')) exit;

function djz_frontend_url(string $path = '/'): string
{
    return untrailingslashit(home_url()) . '/' . ltrim($path, '/');
}

add_action('wp_head', function () {
    if (is_admin()) return;

    $base_url = untrailingslashit(home_url());
    $path = strtok($_SERVER['REQUEST_URI'] ?? '/', '?') ?: '/';
    $is_pt = preg_match('#^/pt(?:/|$)#', $path) === 1;
    $canonical = $base_url . rtrim($path, '/');
    if ($canonical === $base_url) {
        $canonical .= '/';
    } elseif (!preg_match('/\.[a-z0-9]{2,5}$/i', $canonical)) {
        $canonical .= '/';
    }

    $website_description = $is_pt
        ? 'Site oficial de Zen Eyer, DJ e produtor musical de Brazilian Zouk, bicampeão mundial no Zouk DJ Championship.'
        : 'Official website of Zen Eyer, Brazilian Zouk DJ and music producer, two-time World Champion at the Zouk DJ Championship.';
    $person_description = $is_pt
        ? 'Zen Eyer é DJ e produtor musical de Brazilian Zouk, bicampeão mundial no Zouk DJ Championship 2022.'
        : 'Zen Eyer is a Brazilian Zouk DJ and music producer, two-time World Champion at the Zouk DJ Championship 2022.';
    $musicgroup_description = $is_pt
        ? 'Zen Eyer é o nome artístico oficial para performances, remixes, edits e lançamentos de Brazilian Zouk.'
        : 'Zen Eyer is the official artist name for Brazilian Zouk DJ performances, remixes, edits, and official releases.';
    $awards = $is_pt
        ? [
            'Campeão mundial de Brazilian Zouk DJ - Best DJ Performance, 2022',
            'Campeão mundial de Brazilian Zouk DJ - Best Remix, 2022',
        ]
        : [
            'World Champion Brazilian Zouk DJ - Best DJ Performance, 2022',
            'World Champion Brazilian Zouk DJ - Best Remix, 2022',
        ];

    $schema = [
        '@context' => 'https://schema.org',
        '@graph' => [
            [
                '@type' => 'WebSite',
                '@id' => $base_url . '/#website',
                'url' => $base_url . '/',
                'name' => 'Zen Eyer',
                'description' => $website_description,
                'publisher' => ['@id' => $base_url . '/#artist'],
                'inLanguage' => ['en', 'pt-BR'],
            ],
            [
                '@type' => 'Person',
                '@id' => $base_url . '/#artist',
                'name' => 'Zen Eyer',
                'alternateName' => ['DJ Zen Eyer'],
                'birthName' => 'Marcelo Eyer Fernandes',
                'description' => $person_description,
                'url' => $base_url . '/',
                'image' => $base_url . '/images/zen-eyer-og-image.png',
                'genre' => ['Brazilian Zouk', 'Zouk', 'Dance Music'],
                'jobTitle' => ['DJ', 'Music Producer'],
                'sameAs' => [
                    'https://www.wikidata.org/wiki/Q136551855',
                    'https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154',
                    'https://www.discogs.com/artist/16872046',
                    'https://isni.org/isni/0000000528931015',
                    'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
                    'https://music.apple.com/us/artist/1439280950',
                    'https://www.youtube.com/@djzeneyer',
                    'https://soundcloud.com/djzeneyer',
                ],
                'identifier' => [
                    ['@type' => 'PropertyValue', 'propertyID' => 'Wikidata', 'value' => 'Q136551855'],
                    ['@type' => 'PropertyValue', 'propertyID' => 'MusicBrainz', 'value' => '13afa63c-8164-4697-9cad-c5100062a154'],
                    ['@type' => 'PropertyValue', 'propertyID' => 'ISNI', 'value' => '0000000528931015'],
                    ['@type' => 'PropertyValue', 'propertyID' => 'Google KG ID', 'value' => '/g/11ff3mhh10'],
                ],
                'mainEntityOfPage' => ['@id' => $base_url . '/about-dj-zen-eyer/#webpage'],
                'award' => $awards,
            ],
            [
                '@type' => 'MusicGroup',
                '@id' => $base_url . '/#musicgroup',
                'name' => 'Zen Eyer',
                'alternateName' => ['DJ Zen Eyer'],
                'description' => $musicgroup_description,
                'url' => $base_url . '/',
                'genre' => ['Brazilian Zouk', 'Zouk', 'Dance Music'],
                'member' => [['@id' => $base_url . '/#artist']],
            ],
            [
                '@type' => 'WebPage',
                '@id' => $canonical . '#webpage',
                'url' => $canonical,
                'name' => 'Zen Eyer',
                'isPartOf' => ['@id' => $base_url . '/#website'],
                'about' => ['@id' => $base_url . '/#artist'],
            ],
        ],
    ];

    echo '<meta name="description" content="' . esc_attr($website_description) . '">' . "\n";
    echo '<link rel="canonical" href="' . esc_url($canonical) . '">' . "\n";
    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>' . "\n";
}, 2);
