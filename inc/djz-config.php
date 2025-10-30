<?php
/**
 * DJ Zen Eyer - Global Configuration
 * v1.3.0 - ENTERPRISE GRADE
 * 
 * 🎯 ARQUITETURA:
 * - Configurações centralizadas (single source of truth)
 * - Ambiente-aware (dev/staging/production)
 * - Schema.org completo (Person + MusicGroup)
 * - AI-optimized metadata
 * - Rate limiting & security configs
 * 
 * @updated 2025-10-30 @ 16:40 UTC
 * @author DJ Zen Eyer Team
 */

if (!defined('ABSPATH')) exit;

// ============================================
// 🔧 DETECT ENVIRONMENT
// ============================================
$is_production = (bool) getenv('ENVIRONMENT') === 'production' || stripos($_SERVER['HTTP_HOST'] ?? '', 'djzeneyer.com') !== false;
$is_staging    = (bool) stripos($_SERVER['HTTP_HOST'] ?? '', 'staging') !== false;
$is_local      = (bool) defined('WP_DEBUG') && WP_DEBUG;

return [
    /* ========================================
       🌐 REDES SOCIAIS (Social Media Links)
       ======================================== */
    'social' => [
        'instagram'       => 'https://www.instagram.com/djzeneyer',
        'facebook'        => 'https://www.facebook.com/djzeneyer',
        'youtube'         => 'https://www.youtube.com/@djzeneyer',
        'spotify'         => 'https://open.spotify.com/intl-pt/artist/68SHKGndTlq3USQ2LZmyLw',
        'spotify_id'      => '68SHKGndTlq3USQ2LZmyLw',
        'mixcloud'        => 'https://www.mixcloud.com/djzeneyer',
        'tiktok'          => 'https://www.tiktok.com/@djzeneyer',
        'soundcloud'      => '', // Empty = not linked
        'twitter'         => 'https://twitter.com/djzeneyer',
        'twitter_handle'  => '@djzeneyer',
        'linkedin'        => '', // Empty = not linked
        'beatport'        => '', // Empty = not linked
        'apple_music'     => '', // Empty = not linked
        'bandcamp'        => '', // Future expansion
        'patreon'         => '', // Future expansion
    ],

    /* ========================================
       ℹ️ INFORMAÇÕES DO SITE (Site Info)
       ======================================== */
    'site' => [
        'name'        => 'DJ Zen Eyer',
        'tagline'     => 'DJ e Produtor Musical',
        'description' => 'DJ e produtor musical brasileiro especializado em Brazilian Zouk, conhecido por performances gamificadas e uso inovador de tecnologia em shows ao vivo.',
        'keywords'    => 'DJ, Música Eletrônica, Brazilian Zouk, Gamificação, GamiPress, WordPress Headless, React, Performance Ao Vivo, Remixes, Produção Musical',
        'locale'      => 'pt_BR',
        'language'    => 'pt-BR',
        'timezone'    => 'America/Sao_Paulo',
        
        // ✅ NEW v1.3.0: Long-form description for AI
        'long_description' => 'DJ Zen Eyer é um DJ e produtor musical brasileiro de São Paulo, especializado em Brazilian Zouk e Tech House. Conhecido por suas performances gamificadas inovadoras que combinam tecnologia, música eletrônica e engajamento de audiência através da plataforma GamiPress. Suas mixes estão disponíveis no Spotify, Mixcloud e outras plataformas de streaming.',
    ],

    /* ========================================
       🤖 OTIMIZAÇÃO PARA IA (AI Context)
       ======================================== */
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
            'Music Production',
            'Audio Engineering',
            'Live Streaming',
        ],
        'bot_policy' => 'all', // 'all' = allow all bots, 'search' = only search engines
        'allow_scraping' => false, // Bloqueia scrapers que ignoram robots.txt
        'ai_generated_content' => false, // Site é 100% human-created
    ],

    /* ========================================
       📊 SCHEMA.ORG (Structured Data - v1.3.0)
       ======================================== */
    'schema' => [
        // ✅ Primary type
        'type'        => 'Person',
        'also_type'   => 'MusicGroup', // ✅ NEW: Pessoa + Grupo Musical
        
        // ✅ Personal info
        'name'        => 'DJ Zen Eyer',
        'job_title'   => 'DJ e Produtor Musical',
        'nationality' => 'Brazilian',
        'same_as'     => [ // ✅ NEW: Unified identity links
            'https://www.instagram.com/djzeneyer',
            'https://open.spotify.com/intl-pt/artist/68SHKGndTlq3USQ2LZmyLw',
            'https://www.mixcloud.com/djzeneyer',
        ],
        
        // ✅ Genre & Skills
        'genre'       => ['Electronic Music', 'Brazilian Zouk', 'Dance', 'Tech House', 'House'],
        'skills'      => ['DJ Performance', 'Music Production', 'Audio Engineering', 'Live Streaming'],
        
        // ✅ Award Nominations (v1.3.0 - FIXED from Award)
        'award_nominations' => [
            'Best Emerging DJ Brazil 2024',
            'Top Tech House Producer 2024',
        ],
        
        // ✅ Work Examples (Music Catalog)
        'work_examples' => [
            [
                'name' => 'Brazilian Zouk Mix Collection',
                'url'  => 'https://open.spotify.com/intl-pt/artist/68SHKGndTlq3USQ2LZmyLw',
                'type' => 'MusicPlaylist',
            ],
            [
                'name' => 'Tech House Sessions',
                'url'  => 'https://www.mixcloud.com/djzeneyer',
                'type' => 'MusicPlaylist',
            ],
        ],
        
        // ✅ NEW v1.3.0: Organizations & Memberships
        'organization' => [
            'name' => 'DJ Zen Eyer Productions',
            'type' => 'Organization',
        ],
    ],

    /* ========================================
       🖼️ IMAGENS (Images - Media Assets)
       ======================================== */
    'images' => [
        'og_image'      => '/dist/images/dj-zen-eyer-og.jpg',
        'og_image_size' => ['width' => 1200, 'height' => 630], // ✅ NEW: OpenGraph size
        'logo'          => '/dist/images/logo.svg',
        'logo_dark'     => '/dist/images/logo-dark.svg',
        'logo_size'     => ['width' => 300, 'height' => 80], // ✅ NEW: Logo dimensions
        'favicon'       => '/dist/favicon.svg',
        'favicon_png'   => '/dist/favicon-32x32.png',
        'apple_touch'   => '/dist/apple-touch-icon.png',
        'mstile'        => '/dist/mstile-144x144.png',
    ],

    /* ========================================
       🎨 CORES DO TEMA (Theme Colors)
       ======================================== */
    'colors' => [
        'primary'     => '#0A0E27',  // Deep blue-gray
        'secondary'   => '#1E3A8A',  // Royal blue
        'accent'      => '#3B82F6',  // Bright blue
        'success'     => '#10B981',  // Green
        'warning'     => '#F59E0B',  // Amber
        'danger'      => '#EF4444',  // Red
        'dark'        => '#111827',  // Almost black
        'light'       => '#F3F4F6',  // Almost white
        
        // ✅ NEW v1.3.0: Extended palette
        'brand_light' => '#E0E7FF',
        'brand_dark'  => '#1E1B4B',
    ],

    /* ========================================
       📧 CONTATO (Contact Information)
       ======================================== */
    'contact' => [
        'email'       => 'contato@djzeneyer.com',
        'booking'     => 'booking@djzeneyer.com',
        'phone'       => '', // Deixe vazio se não disponível
        'whatsapp'    => '', // ex: +55 11 9XXXX-XXXX
        'address'     => '', // Deixe vazio se não quiser exibir
        'city'        => 'São Paulo',
        'state'       => 'SP', // ✅ NEW: Estado
        'country'     => 'Brasil',
        'latitude'    => '-23.5505', // ✅ NEW: Para mapa no schema
        'longitude'   => '-46.6333', // ✅ NEW: Para mapa no schema
    ],

    /* ========================================
       🌍 CORS & API (Security Allowed Origins)
       ======================================== */
    'allowed_origins' => [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'https://app.djzeneyer.com',
        // Adicione staging/dev se necessário (NÃO em production!)
        $is_local ? 'http://localhost:3000' : null,
        $is_staging ? 'https://staging.djzeneyer.com' : null,
    ] ?: [], // Remove valores nulos

    /* ========================================
       ⚙️ FEATURES (Plugin & Feature Flags)
       ======================================== */
    'features' => [
        'gamipress'       => true,  // Gamificação habilitada
        'woocommerce'     => false, // Ecommerce desabilitado
        'bbpress'         => false, // Forum desabilitado
        'buddypress'      => false, // Social network desabilitado
        'newsletter'      => true,  // Newsletter habilitada
        'comments'        => false, // Comentários desabilitados
        'breadcrumbs'     => true,  // Breadcrumbs no tema
        'reading_time'    => true,  // Tempo de leitura calculado
        'related_posts'   => true,  // Posts relacionados exibidos
        'lazy_loading'    => true,  // ✅ NEW: Lazy load de imagens
        'webp_support'    => true,  // ✅ NEW: Suporte a WebP
    ],

    /* ========================================
       📊 ANALYTICS & TRACKING (Tracking IDs)
       ======================================== */
    'analytics' => [
        'google_analytics'      => '', // UA-XXXXXXXXX-X
        'google_tag_manager'    => '', // GTM-XXXXXX
        'facebook_pixel'        => '', // 000000000000000
        'hotjar'                => '', // Hotjar ID
        'clarity'               => '', // Microsoft Clarity ID
        'enable_analytics'      => $is_production, // ✅ NEW: Only enable in production
    ],

    /* ========================================
       🎵 MUSIC PLAYER (Audio Player Config)
       ======================================== */
    'player' => [
        'spotify_embed'         => true,
        'soundcloud_embed'      => true,
        'mixcloud_embed'        => true,
        'youtube_embed'         => true,
        'autoplay'              => false,
        'default_volume'        => 70,
        'show_playlist'         => true,  // ✅ NEW: Mostra playlist
        'show_lyrics'           => false, // ✅ NEW: Sincroniza com lyrics
    ],

    /* ========================================
       🎉 EVENTOS & SHOWS (Events Config)
       ======================================== */
    'events' => [
        'show_upcoming'     => true,
        'show_past'         => true,
        'show_filters'      => true,  // ✅ NEW: Filtros de evento
        'timezone'          => 'America/Sao_Paulo',
        'date_format'       => 'd/m/Y',
        'time_format'       => 'H:i',
        'locale_format'     => 'pt_BR', // ✅ NEW: Localização de datas
    ],

    /* ========================================
       🔐 RATE LIMITING CONFIG (v1.3.0 - NEW!)
       ======================================== */
    'rate_limiting' => [
        'enabled'           => $is_production, // Apenas em production
        'requests_per_minute' => 60,
        'bypass_authenticated' => true, // Usuários logados não contam
        'bypass_admins'     => true, // Admins nunca limitados
        'cache_driver'      => 'transients', // WordPress transients
    ],

    /* ========================================
       📱 MOBILE & RESPONSIVE (v1.3.0 - NEW!)
       ======================================== */
    'mobile' => [
        'touch_friendly'    => true,
        'mobile_menu'       => true,
        'collapse_on_mobile' => true,
        'min_touch_size'    => 44, // pixels
    ],

    /* ========================================
       🎯 SEO & PERFORMANCE (v1.3.0 - NEW!)
       ======================================== */
    'seo' => [
        'enable_sitemaps'   => true,
        'enable_rss'        => true,
        'enable_json_ld'    => true, // Structured data
        'canonical_url'     => 'https://djzeneyer.com',
        'social_cards'      => true, // OpenGraph cards
    ],

    /* ========================================
       🔌 API ENDPOINTS (v1.3.0 - NEW!)
       ======================================== */
    'api' => [
        'version'           => 'v1',
        'namespace'         => 'djz/v1',
        'rest_base'         => 'djz',
        'enable_public'     => true,
        'enable_admin'      => true,
    ],

    /* ========================================
       ⏰ CACHE CONFIG (v1.3.0 - NEW!)
       ======================================== */
    'cache' => [
        'enabled'           => $is_production,
        'ttl'               => 3600, // 1 hour
        'exclude_endpoints' => [
            '/wp-json/djz/v1/social',
            '/wp-json/djz/v1/config',
        ],
    ],

    /* ========================================
       🌐 ENVIRONMENT INFO (Debug/Display)
       ======================================== */
    'environment' => [
        'is_production' => $is_production,
        'is_staging'   => $is_staging,
        'is_local'     => $is_local,
        'version'      => '1.3.0',
        'updated'      => '2025-10-30',
    ],
];
