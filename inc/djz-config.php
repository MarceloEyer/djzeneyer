<?php
/**
 * DJ Zen Eyer - Global Configuration
 * 🎯 CENTRALIZE TODAS as configurações do site AQUI!
 * 
 * @package DJZenEyerTheme
 * @version 1.1.0
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
 * 🔒 SECURITY UPDATES (v1.1.0):
 * =====================================================
 * - Fixed: Localhost URLs removed from production CORS
 * - Fixed: Auto-detection of environment (dev vs production)
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
        'spotify_id'      => '68SHKGndTlq3USQ2LZmyLw', // ID puro (para API)
        'mixcloud'        => 'https://www.mixcloud.com/djzeneyer',
        'tiktok'          => 'https://www.tiktok.com/@djzeneyer',
        'soundcloud'      => '', // Adicione se tiver
        'twitter'         => 'https://twitter.com/djzeneyer', // ou X
        'twitter_handle'  => '@djzeneyer',
        'linkedin'        => '', // Opcional
        'beatport'        => '', // Opcional
        'apple_music'     => '', // Opcional
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
        'bot_policy' => 'all', // 'all', 'noindex', 'nofollow'
    ],

    /* =====================================================
     * 📊 SCHEMA.ORG (Structured Data)
     * ===================================================== */
    'schema' => [
        'type'        => 'Person', // Person, MusicGroup, Organization
        'job_title'   => 'DJ e Produtor Musical',
        'nationality' => 'Brazilian',
        'genre'       => ['Electronic Music', 'Brazilian Zouk', 'Dance', 'Tech House'],
        'skills'      => ['DJ Performance', 'Music Production', 'Audio Engineering', 'React Development'],
    ],

    /* =====================================================
     * 🖼️ IMAGENS (Images & Assets)
     * ===================================================== */
    'images' => [
        'og_image'      => '/dist/images/dj-zen-eyer-og.jpg',    // Open Graph 1200x630
        'logo'          => '/dist/images/logo.svg',               // Logo principal
        'logo_dark'     => '/dist/images/logo-dark.svg',          // Logo versão escura
        'favicon'       => '/dist/favicon.svg',                   // Favicon SVG
        'favicon_png'   => '/dist/favicon-32x32.png',            // Favicon PNG 32x32
        'apple_touch'   => '/dist/apple-touch-icon.png',         // Apple Touch Icon 180x180
        'mstile'        => '/dist/mstile-144x144.png',           // Microsoft Tile
    ],

    /* =====================================================
     * 🎨 CORES DO TEMA (Theme Colors)
     * ===================================================== */
    'colors' => [
        'primary'     => '#0A0E27',  // Azul escuro principal
        'secondary'   => '#1E3A8A',  // Azul médio
        'accent'      => '#3B82F6',  // Azul claro (highlights)
        'success'     => '#10B981',  // Verde
        'warning'     => '#F59E0B',  // Laranja
        'danger'      => '#EF4444',  // Vermelho
        'dark'        => '#111827',  // Preto
        'light'       => '#F3F4F6',  // Branco off
    ],

    /* =====================================================
     * 📧 CONTATO (Contact Info)
     * ===================================================== */
    'contact' => [
        'email'       => 'contato@djzeneyer.com',
        'booking'     => 'booking@djzeneyer.com',     // Email de booking
        'phone'       => '',                           // Telefone (opcional)
        'whatsapp'    => '',                           // WhatsApp (apenas números)
        'address'     => '',                           // Endereço (opcional)
        'city'        => 'São Paulo',
        'country'     => 'Brasil',
    ],

    /* =====================================================
     * 🔐 CORS & API (Allowed Origins)
     * 🔒 FIXED: Auto-detect environment (localhost only in dev)
     * ===================================================== */
    'allowed_origins' => array_merge(
        // Production URLs (always allowed)
        [
            'https://djzeneyer.com',
            'https://www.djzeneyer.com',
            'https://app.djzeneyer.com',
        ],
        // Development URLs (only if WP_DEBUG is enabled)
        (defined('WP_DEBUG') && WP_DEBUG) || wp_get_environment_type() === 'development'
            ? [
                'http://localhost:5173',      // Vite dev
                'http://localhost:3000',      // React dev alternativo
                'http://127.0.0.1:5173',      // Localhost alternativo
              ]
            : []
    ),

    /* =====================================================
     * ⚙️ FEATURES & PLUGINS (Habilitados/Desabilitados)
     * ===================================================== */
    'features' => [
        'gamipress'       => true,   // Sistema de gamificação
        'woocommerce'     => false,  // E-commerce
        'bbpress'         => false,  // Fórum
        'buddypress'      => false,  // Rede social
        'newsletter'      => true,   // Newsletter (MailPoet)
        'comments'        => false,  // Comentários de posts
        'breadcrumbs'     => true,   // Breadcrumbs SEO
        'reading_time'    => true,   // Tempo de leitura
        'related_posts'   => true,   // Posts relacionados
    ],

    /* =====================================================
     * 📈 ANALYTICS & TRACKING (Google, Meta, etc.)
     * ===================================================== */
    'analytics' => [
        'google_analytics'  => '',   // UA-XXXXXXXXX-X ou G-XXXXXXXXXX
        'google_tag_manager' => '',  // GTM-XXXXXXX
        'facebook_pixel'    => '',   // Meta Pixel ID
        'hotjar'            => '',   // Hotjar Site ID
        'clarity'           => '',   // Microsoft Clarity ID
    ],

    /* =====================================================
     * 🎵 PLAYER DE MÚSICA (Music Player Config)
     * ===================================================== */
    'player' => [
        'spotify_embed'   => true,
        'soundcloud_embed' => true,
        'mixcloud_embed'  => true,
        'youtube_embed'   => true,
        'autoplay'        => false,
        'default_volume'  => 70,      // 0-100
    ],

    /* =====================================================
     * 📅 EVENTOS & SHOWS (Events Config)
     * ===================================================== */
    'events' => [
        'show_upcoming'   => true,
        'show_past'       => true,
        'timezone'        => 'America/Sao_Paulo',
        'date_format'     => 'd/m/Y',
        'time_format'     => 'H:i',
    ],
];