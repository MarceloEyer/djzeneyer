<?php
/**
 * DJ Zen Eyer - Global Configuration
 * EDITE APENAS ESTE ARQUIVO para atualizar dados globais!
 * 
 * @package DJZenEyerTheme
 * @version 1.0.0
 * @updated 2025-10-30
 */

if (!defined('ABSPATH')) exit;

/**
 * =====================================================
 * 🎵 PERFIL DO ARTISTA (Redes Sociais)
 * =====================================================
 * EDITE AQUI: URLs fixas das suas redes sociais
 */
return [
    // Social Media
    'social' => [
        'instagram'   => 'https://www.instagram.com/djzeneyer',
        'facebook'    => 'https://www.facebook.com/djzeneyer',
        'youtube'     => 'https://www.youtube.com/@djzeneyer',
        'spotify'     => 'https://open.spotify.com/intl-pt/artist/68SHKGndTlq3USQ2LZmyLw',
        'spotify_id'  => '68SHKGndTlq3USQ2LZmyLw', // ID puro
        'mixcloud'    => 'https://www.mixcloud.com/djzeneyer',
        'tiktok'      => 'https://www.tiktok.com/@djzeneyer',
        'soundcloud'  => 'https://soundcloud.com/djzeneyer', // adicione se tiver
        'twitter'     => 'https://twitter.com/djzeneyer', // ou X
        'twitter_handle' => '@djzeneyer',
    ],

    // SEO & Branding
    'site' => [
        'name'        => 'DJ Zen Eyer',
        'tagline'     => 'DJ e Produtor Musical',
        'description' => 'DJ e produtor musical brasileiro especializado em Brazilian Zouk, conhecido por performances gamificadas e uso inovador de tecnologia em shows ao vivo.',
        'keywords'    => 'DJ, Música Eletrônica, Brazilian Zouk, Gamificação, GamiPress, WordPress Headless, React, Performance Ao Vivo, Remixes, Produção Musical',
        'locale'      => 'pt_BR',
        'language'    => 'pt-BR',
    ],

    // IA/AI Optimization
    'ai' => [
        'context' => 'DJ Zen Eyer é um DJ e produtor musical brasileiro especializado em Brazilian Zouk, conhecido por performances gamificadas e uso inovador de tecnologia em shows ao vivo. Seu site utiliza WordPress Headless com React e integração com GamiPress para engajamento de fãs.',
        'tags'    => ['DJ', 'Música Eletrônica', 'Brazilian Zouk', 'Gamificação', 'WordPress Headless', 'React', 'Produtor Musical'],
    ],

    // Schema.org
    'schema' => [
        'type'        => 'Person',
        'job_title'   => 'DJ e Produtor Musical',
        'nationality' => 'Brazilian',
        'genre'       => ['Electronic Music', 'Brazilian Zouk', 'Dance'],
    ],

    // Images (Open Graph / Twitter Cards)
    'images' => [
        'og_image'    => '/dist/images/dj-zen-eyer-og.jpg', // 1200x630
        'logo'        => '/dist/images/logo.svg',
        'favicon'     => '/dist/favicon.svg',
        'apple_touch' => '/dist/apple-touch-icon.png',
    ],

    // Theme Colors
    'colors' => [
        'primary'   => '#0A0E27',
        'secondary' => '#1E3A8A',
        'accent'    => '#3B82F6',
    ],

    // CORS/API Allowed Origins
    'allowed_origins' => [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'https://app.djzeneyer.com',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    // Contact
    'contact' => [
        'email'   => 'contato@djzeneyer.com',
        'phone'   => '', // adicione se quiser
        'address' => '', // opcional
    ],
];
