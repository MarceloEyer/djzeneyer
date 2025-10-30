<?php
/**
 * DJ Zen Eyer - Global Configuration
 * 🎯 CENTRALIZE TODAS as configurações do site AQUI!
 * 
 * @package DJZenEyerTheme
 * @version 1.2.0
 * @created 2025-10-30
 * @updated 2025-10-30
 * @author DJ Zen Eyer Team
 * 
 * =====================================================
 * 📝 INSTRUÇÕES DE USO:
 * =====================================================
 * 
 * Para ATUALIZAR redes sociais, SEO tags, etc:
 * → Edite APENAS este arquivo
 * → Salve e pronto! Todas as páginas atualizam automaticamente
 * 
 * Para ACESSAR no código:
 * → Use: djz_config('social.instagram')
 * → Use: djz_config('site.name')
 * → Use: djz_config('ai.context')
 * 
 * =====================================================
 * 🔒 SECURITY UPDATES (v1.2.0):
 * =====================================================
 * - Fixed: Localhost URLs removed (production-only deployment)
 * - Simplified: CORS now supports only production domains
 * - Version: Cleaner & leaner for GitHub/Bolt.new workflow
 */

if (!defined('ABSPATH')) exit; // Segurança

return [
    /* =====================================================
     * 🎵 REDES SOCIAIS (Social Media)
     * ===================================================== */
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

    /* =====================================================
     * 🌐 INFORMAÇÕES DO SITE (Site Info)
     * ===================================================== */
    'site' => [
        'name'        => 'DJ Zen Eyer',
        'tagline'     => 'DJ e Produtor Musical',
        'description' => 'DJ e produtor musical brasileiro especializado em Brazilian Zouk, conhecido por performances gamificadas e uso inovador de tecnologia em shows ao vivo.',
        'keywords'    => 'DJ, Música Eletrônica, Brazilian Zouk, Gamificação, GamiPress, WordPress Headless, React, Performance Ao Vivo, Remixes, Produção Musical',
        'locale'      => 'pt_BR',
        'language'    => 'pt-BR',
        'timezone'    => 'America/Sao_Paulo',
    ],

    /* =====================================================
     * 🤖 OTIMIZAÇÃO PARA IA (AI Optimization)
     * ===================================================== */
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

    /* =====================================================
     * 📊 SCHEMA.ORG (Structured Data)
     * ===================================================== */
    'schema' => [
        'type'        => 'Person',
        'job_title'   => 'DJ e Produtor Musical',
        'nationality' => 'Brazilian',
        'genre'       => ['Electronic Music', 'Brazilian Zouk', 'Dance', 'Tech House'],
        'skills'      => ['DJ Performance', 'Music Production', 'Audio Engineering', 'React Development'],
    ],

    /* =====================================================
     * 🖼️ IMAGENS (Images & Assets)
     * ===================================================== */
    'images' => [
        'og_image'      => '/dist/images/dj-zen-eyer-og.jpg',
        'logo'          => '/dist/images/logo.svg',
        'logo_dark'     => '/dist/images/logo-dark.svg',
        'favicon'       => '/dist/favicon.svg',
        'favicon_png'   => '/dist/favicon-32x32.png',
        'apple_touch'   => '/dist/apple-touch-icon.png',
        'mstile'        => '/dist/mstile-144x144.png',
    ],

    /* =====================================================
     * 🎨 CORES DO TEMA (Theme Colors)
     * ===================================================== */
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

    /* =====================================================
     * 📧 CONTATO (Contact Info)
     * ===================================================== */
    'contact' => [
        'email'       => 'contato@djzeneyer.com',
        'booking'     => 'booking@djzeneyer.com',
        'phone'       => '',
        'whatsapp'    => '',
        'address'     => '',
        'city'        => 'São Paulo',
        'country'     => 'Brasil',
    ],

    /* =====================================================
     * 🔐 CORS & API (Allowed Origins - Production Only)
     * 🔒 FIXED: Simplified for production-only deployment
     * ===================================================== */
    'allowed_origins' => [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'https://app.djzeneyer.com',
    ],

    /* =====================================================
     * ⚙️ FEATURES & PLUGINS (Habilitados/Desabilitados)
     * ===================================================== */
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

    /* =====================================================
     * 📈 ANALYTICS & TRACKING (Google, Meta, etc.)
     * ===================================================== */
    'analytics' => [
        'google_analytics'      => '',
        'google_tag_manager'    => '',
        'facebook_pixel'        => '',
        'hotjar'                => '',
        'clarity'               => '',
    ],

    /* =====================================================
     * 🎵 PLAYER DE MÚSICA (Music Player Config)
     * ===================================================== */
    'player' => [
        'spotify_embed'         => true,
        'soundcloud_embed'      => true,
        'mixcloud_embed'        => true,
        'youtube_embed'         => true,
        'autoplay'              => false,
        'default_volume'        => 70,
    ],

    /* =====================================================
     * 📅 EVENTOS & SHOWS (Events Config)
     * ===================================================== */
    'events' => [
        'show_upcoming'     => true,
        'show_past'         => true,
        'timezone'          => 'America/Sao_Paulo',
        'date_format'       => 'd/m/Y',
        'time_format'       => 'H:i',
    ],
];