<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Mode: React SPA with Server-Side SEO
 * @package DJZenEyer
 */
if (!defined('ABSPATH')) exit;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#0A0E27">
    
    <!-- Preconnect -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <style>
        body { 
            background-color: #0A0E27; 
            margin: 0; 
            font-family: 'Inter', sans-serif; 
            color: white;
        }
        #root { 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column; 
        }
        
        /* 🔥 Conteúdo SSR para bots */
        .ssr-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .ssr-content h1 {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .ssr-content p {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .ssr-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .ssr-links a {
            background: rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 8px;
            color: white;
            text-decoration: none;
            transition: all 0.3s;
        }
        
        .ssr-links a:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        
        /* Ocultar quando React carregar */
        .react-loaded .ssr-content {
            display: none;
        }
    </style>
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="root">
        <!-- 
        🔥 CONTEÚDO SERVER-SIDE PARA BOTS 
        Este conteúdo é visível para Googlebot, mas oculto quando o React carrega
        -->
        <div class="ssr-content">
            <h1>DJ Zen Eyer - Brazilian Zouk DJ & Music Producer</h1>
            
            <p>
                Welcome to the official website of <strong>DJ Zen Eyer</strong>, 
                international Brazilian Zouk DJ, music producer, and Mensa International member. 
                Specializing in Zouk, Kizomba, and Latin dance music for festivals, 
                workshops, and exclusive events worldwide.
            </p>
            
            <h2>What You'll Find Here</h2>
            <p>
                Explore my music remixes, upcoming events, dance community (ZenTribe), 
                merchandise store, and booking information. Experience the world of Brazilian Zouk 
                through curated playlists, DJ sets, and educational content.
            </p>
            
            <!-- Links internos para bots -->
            <nav class="ssr-links">
                <a href="<?php echo home_url('/'); ?>">
                    <strong>Home</strong>
                    <br>Main page
                </a>
                <a href="<?php echo home_url('/events'); ?>">
                    <strong>Events</strong>
                    <br>Upcoming shows & festivals
                </a>
                <a href="<?php echo home_url('/music'); ?>">
                    <strong>Music</strong>
                    <br>Remixes & DJ sets
                </a>
                <a href="<?php echo home_url('/shop'); ?>">
                    <strong>Shop</strong>
                    <br>Merchandise & digital content
                </a>
                <a href="<?php echo home_url('/zentribe'); ?>">
                    <strong>ZenTribe</strong>
                    <br>Dance community
                </a>
                <a href="<?php echo home_url('/work-with-me'); ?>">
                    <strong>Book DJ</strong>
                    <br>Hire for events
                </a>
                <a href="<?php echo home_url('/faq'); ?>">
                    <strong>FAQ</strong>
                    <br>Frequently asked questions
                </a>
            </nav>
            
            <h2>About DJ Zen Eyer</h2>
            <p>
                As a Brazilian Zouk specialist and Mensa member, I combine technical 
                precision with artistic creativity to deliver unforgettable dance experiences. 
                My sets blend contemporary Zouk with Kizomba, Tarraxo, and Latin rhythms, 
                creating a unique sonic journey for dancers worldwide.
            </p>
            
            <h2>Connect & Follow</h2>
            <p>
                Follow my journey on Instagram, Spotify, Apple Music, SoundCloud, 
                and YouTube. Join the ZenTribe community for exclusive content, 
                early access to new music, and special event announcements.
            </p>
        </div>
    </div>
    
    <noscript>
        <div style="padding: 20px; text-align: center; background: rgba(255,0,0,0.1); border: 2px solid red; margin: 20px;">
            <h2>⚠️ JavaScript Required</h2>
            <p>This website requires JavaScript to display its full interactive experience.</p>
            <p>Please enable JavaScript in your browser settings to continue.</p>
        </div>
    </noscript>
    
    <script>
        // Marca quando React carregar (oculta conteúdo SSR)
        document.addEventListener('DOMContentLoaded', function() {
            // Aguarda React montar
            setTimeout(function() {
                if (document.querySelector('#root > div > *')) {
                    document.body.classList.add('react-loaded');
                }
            }, 500);
        });
    </script>
    
    <?php wp_footer(); ?>
</body>
</html>