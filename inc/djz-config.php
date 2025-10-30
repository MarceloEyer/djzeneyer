<?php
/**
 * DJ Zen Eyer - Global Configuration
 * v1.2.1 - SCHEMA.ORG FIXED (Award → AwardNomination)
 * @updated 2025-10-30 @ 12:05 AM
 */

if (!defined('ABSPATH')) exit;

return [
    /* ===== REDES SOCIAIS ===== */
    'social' => [
        'instagram'       => 'https://www.instagram.com/djzeneyer',
        'facebook'        => 'https://www.facebook.com/djzeneyer',
        'youtube'         => 'https://www.youtube.com/@djzeneyer',
        'spotify'         => 'https://open.spotify.com/intl-pt/artist/68SHKGndTlq3USQ2LZmyLw',
        'spotify_id'      => '68SHKGndTlq3USQ2LZmyLw',
        'mixcloud'        => 'https://www.mixcloud.com/djzeneyer',
        'tiktok'          => 'https://www.tiktok.com/@djzeneyer',
        'soundcloud'      => '',
        'twitter'         => 'https://twitter.com/djzeneyer',
        'twitter_handle'  => '@djzeneyer',
        'linkedin'        => '',
        'beatport'        => '',
        'apple_music'     => '',
    ],

    /* ===== INFORMAÇÕES DO SITE ===== */
    'site' => [
        'name'        => 'DJ Zen Eyer',
        'tagline'     => 'DJ e Produtor Musical',
        'description' => 'DJ e produtor musical brasileiro especializado em Brazilian Zouk, conhecido por performances gamificadas e uso inovador de tecnologia em shows ao vivo.',
        'keywords'    => 'DJ, Música Eletrônica, Brazilian Zouk, Gamificação, GamiPress, WordPress Headless, React, Performance Ao Vivo, Remixes, Produção Musical',
        'locale'      => 'pt_BR',
        'language'    => 'pt-BR',
        'timezone'    => 'America/Sao_Paulo',
    ],

    /* ===== OTIMIZAÇÃO PARA IA ===== */
    'ai' => [
        'context' => 'DJ Zen Eyer é um DJ e produtor musical brasileiro especializado em Brazilian Zouk, conhecido por performances gamificadas e uso inovador de tecnologia em shows ao vivo. Seu site utiliza WordPress Headless com React e integração com GamiPress para engajamento de fãs.',
        'tags'    => [
            'DJ',
            'Música Eletrônica',
            'Brazilian Zouk',
            'Gamificação',
            'WordPress Headless',
            'React',
            'Produtor Musical',
            'Zouk Bass',
            'Tech House',
            'Performance Ao Vivo',
        ],
        'bot_policy' => 'all',
    ],

    /* ===== SCHEMA.ORG (Structured Data - FIXED v12.1.1) ===== */
    'schema' => [
        'type'        => 'Person',
        'job_title'   => 'DJ e Produtor Musical',
        'nationality' => 'Brazilian',
        'genre'       => ['Electronic Music', 'Brazilian Zouk', 'Dance', 'Tech House'],
        'skills'      => ['DJ Performance', 'Music Production', 'Audio Engineering', 'React Development'],
        
        // ✅ FIXED: Award removido, usando AwardNomination em lugar disso
        'award_nominations' => [
            'Best Emerging DJ Brazil 2024',
            'Top Tech House Producer 2024',
        ],
        
        // ✅ NOVO: WorkExamples (tracks/mixes notáveis)
        'work_examples' => [
            [
                'name' => 'Brazilian Zouk Mix Collection',
                'url'  => 'https://open.spotify.com/intl-pt/artist/68SHKGndTlq3USQ2LZmyLw',
            ],
            [
                'name' => 'Tech House Sessions',
                'url'  => 'https://www.mixcloud.com/djzeneyer',
            ],
        ],
    ],

    /* ===== IMAGENS ===== */
    'images' => [
        'og_image'      => '/dist/images/dj-zen-eyer-og.jpg',
        'logo'          => '/dist/images/logo.svg',
        'logo_dark'     => '/dist/images/logo-dark.svg',
        'favicon'       => '/dist/favicon.svg',
        'favicon_png'   => '/dist/favicon-32x32.png',
        'apple_touch'   => '/dist/apple-touch-icon.png',
        'mstile'        => '/dist/mstile-144x144.png',
    ],

    /* ===== CORES DO TEMA ===== */
    'colors' => [
        'primary'     => '#0A0E27',
        'secondary'   => '#1E3A8A',
        'accent'      => '#3B82F6',
        'success'     => '#10B981',
        'warning'     => '#F59E0B',
        'danger'      => '#EF4444',
        'dark'        => '#111827',
        'light'       => '#F3F4F6',
    ],

    /* ===== CONTATO ===== */
    'contact' => [
        'email'       => 'contato@djzeneyer.com',
        'booking'     => 'booking@djzeneyer.com',
        'phone'       => '',
        'whatsapp'    => '',
        'address'     => '',
        'city'        => 'São Paulo',
        'country'     => 'Brasil',
    ],

    /* ===== CORS & API (Production Only) ===== */
    'allowed_origins' => [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'https://app.djzeneyer.com',
    ],

    /* ===== FEATURES ===== */
    'features' => [
        'gamipress'       => true,
        'woocommerce'     => false,
        'bbpress'         => false,
        'buddypress'      => false,
        'newsletter'      => true,
        'comments'        => false,
        'breadcrumbs'     => true,
        'reading_time'    => true,
        'related_posts'   => true,
    ],

    /* ===== ANALYTICS & TRACKING ===== */
    'analytics' => [
        'google_analytics'      => '',
        'google_tag_manager'    => '',
        'facebook_pixel'        => '',
        'hotjar'                => '',
        'clarity'               => '',
    ],

    /* ===== MUSIC PLAYER ===== */
    'player' => [
        'spotify_embed'         => true,
        'soundcloud_embed'      => true,
        'mixcloud_embed'        => true,
        'youtube_embed'         => true,
        'autoplay'              => false,
        'default_volume'        => 70,
    ],

    /* ===== EVENTOS & SHOWS ===== */
    'events' => [
        'show_upcoming'     => true,
        'show_past'         => true,
        'timezone'          => 'America/Sao_Paulo',
        'date_format'       => 'd/m/Y',
        'time_format'       => 'H:i',
    ],
];
