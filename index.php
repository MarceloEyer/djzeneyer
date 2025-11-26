<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Mode: React SPA with Server-Side SEO + Performance Optimizations
 * @package DJZenEyer
 * @version 2.4.1 - CONSOLE LIMPO (Sem preload hero)
 */
if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// 1️⃣ LÓGICA DE CONTEÚDO DINÂMICO PARA SSR
// ═══════════════════════════════════════════════════════════════════════════
$ssr_h1 = 'DJ Zen Eyer - Brazilian Zouk DJ & Music Producer';
$ssr_desc = 'Official website of DJ Zen Eyer. 2x World Champion Brazilian Zouk DJ, music producer, and Mensa International member.';
$is_front_page = is_front_page();

if (have_posts()) {
    the_post();
    $ssr_h1 = get_the_title();
    $ssr_desc = get_the_excerpt() ?: wp_trim_words(get_the_content(), 25);
    rewind_posts();
}

// ═══════════════════════════════════════════════════════════════════════════
// 2️⃣ VITE ASSET DISCOVERY (CORRIGIDO COM URL ABSOLUTA)
// ═══════════════════════════════════════════════════════════════════════════

function get_vite_manifest() {
    static $manifest = null;
    
    if ($manifest !== null) return $manifest;
    
    $possible_paths = [
        get_template_directory() . '/dist/.vite/manifest.json',
        get_template_directory() . '/dist/manifest.json'
    ];
    
    foreach ($possible_paths as $path) {
        if (file_exists($path)) {
            $content = file_get_contents($path);
            $manifest = json_decode($content, true);
            if ($manifest) return $manifest;
        }
    }
    
    $manifest = false;
    return $manifest;
}

$manifest = get_vite_manifest();

// 🔥 FIX: Busca assets de forma robusta
$main_js = null;
$css_files = [];

if ($manifest && isset($manifest['src/main.tsx'])) {
    if (isset($manifest['src/main.tsx']['file'])) {
        $main_js = '/dist/' . $manifest['src/main.tsx']['file'];
    }
    
    if (isset($manifest['src/main.tsx']['css'])) {
        foreach ($manifest['src/main.tsx']['css'] as $css) {
            $css_files[] = '/dist/' . $css;
        }
    }
} else {
    $dist_assets = get_template_directory() . '/dist/assets';
    
    if (is_dir($dist_assets)) {
        $files = scandir($dist_assets);
        
        foreach ($files as $file) {
            if (preg_match('/^index-[a-zA-Z0-9]+\.js$/', $file)) {
                $main_js = '/dist/assets/' . $file;
            }
            if (preg_match('/^index-[a-zA-Z0-9]+\.css$/', $file)) {
                $css_files[] = '/dist/assets/' . $file;
            }
        }
    }
    
    if (!$main_js) {
        $main_js = '/dist/assets/index.js';
    }
    if (empty($css_files)) {
        $css_files[] = '/dist/assets/index.css';
    }
}

// 🎯 URL absoluta do tema WordPress
$theme_uri = get_template_directory_uri();

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- DNS Prefetch (Performance) -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    
    <!-- Favicons (URLs Absolutas) -->
    <link rel="icon" type="image/svg+xml" href="<?php echo esc_url($theme_uri); ?>/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="<?php echo esc_url($theme_uri); ?>/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url($theme_uri); ?>/apple-touch-icon.png">
    <link rel="manifest" href="<?php echo esc_url($theme_uri); ?>/site.webmanifest">
    <meta name="theme-color" content="#0A0E27">
    
    <!-- Preconnect + Preload de Fontes (Melhora FCP) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap">
    </noscript>
    
    <!-- 🔥 VITE CSS (Preload + URLs Absolutas - FIX MIME + Performance) -->
    <?php foreach ($css_files as $css_file): ?>
        <link rel="preload" as="style" href="<?php echo esc_url($theme_uri . $css_file); ?>">
        <link rel="stylesheet" href="<?php echo esc_url($theme_uri . $css_file); ?>">
    <?php endforeach; ?>
    
    <!-- Critical CSS -->
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
        .ssr-content { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 40px 20px; 
        }
        .ssr-content h1 { 
            font-family: 'Orbitron', sans-serif; 
            font-size: clamp(2rem, 5vw, 2.5rem);
            margin-bottom: 1rem; 
            line-height: 1.2;
        }
        .ssr-content p { 
            font-size: 1.1rem; 
            line-height: 1.6; 
            margin-bottom: 1rem; 
            color: rgba(255,255,255,0.8);
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
            border: 1px solid rgba(255,255,255,0.05);
        }
        .ssr-links a:hover { 
            background: rgba(157, 78, 221, 0.2);
            border-color: rgba(157, 78, 221, 0.5);
            transform: translateY(-2px); 
        }
        /* Oculta SSR quando React carrega */
        .react-loaded .ssr-content { 
            display: none; 
        }
    </style>
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <!-- REACT ROOT -->
    <div id="root">
        <div class="ssr-content">
            <!-- H1 DINÂMICO -->
            <h1><?php echo esc_html($ssr_h1); ?></h1>
            
            <!-- DESCRIÇÃO -->
            <p><?php echo esc_html($ssr_desc); ?></p>
            
            <?php if ($is_front_page): ?>
            <h2>About DJ Zen Eyer</h2>
            <p>
                2x World Champion Brazilian Zouk DJ, music producer, and Mensa International member. 
                Specializing in Brazilian Zouk, Kizomba, and Latin dance music for international festivals and events.
            </p>
            
            <!-- LINKS INTERNOS (SEO) -->
            <nav class="ssr-links" aria-label="Main navigation">
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <strong>Home</strong><br><small>Main page</small>
                </a>
                <a href="<?php echo esc_url(home_url('/events')); ?>">
                    <strong>Events</strong><br><small>Tour dates & festivals</small>
                </a>
                <a href="<?php echo esc_url(home_url('/music')); ?>">
                    <strong>Music</strong><br><small>Remixes & DJ sets</small>
                </a>
                <a href="<?php echo esc_url(home_url('/shop')); ?>">
                    <strong>Shop</strong><br><small>Merchandise</small>
                </a>
                <a href="<?php echo esc_url(home_url('/zentribe')); ?>">
                    <strong>ZenTribe</strong><br><small>Dance community</small>
                </a>
                <a href="<?php echo esc_url(home_url('/work-with-me')); ?>">
                    <strong>Book DJ</strong><br><small>Hire for events</small>
                </a>
            </nav>
            <?php endif; ?>
        </div>
    </div>
    
    <!-- NOSCRIPT -->
    <noscript>
        <div style="padding: 20px; text-align: center; background: rgba(255,0,0,0.1); border: 2px solid #ff4444; margin: 20px; border-radius: 8px;">
            <h2>⚠️ JavaScript Required</h2>
            <p>This website requires JavaScript to display its full experience.</p>
            <p>Please enable JavaScript in your browser settings.</p>
        </div>
    </noscript>
    
    <!-- 🔥 VITE REACT (URL Absoluta - FIX MIME TYPE) -->
    <?php if ($main_js): ?>
        <script type="module" src="<?php echo esc_url($theme_uri . $main_js); ?>"></script>
    <?php else: ?>
        <script>
            console.error('[Theme] ❌ No JavaScript bundle found. Check your build.');
            document.body.innerHTML += '<div style="position:fixed;top:0;left:0;right:0;background:#ff4444;color:white;padding:10px;text-align:center;z-index:99999;"><strong>⚠️ Build Error:</strong> JavaScript bundle not found. Run de>npm run build</code></div>';
        </script>
    <?php endif; ?>
    
    <!-- Hide SSR when React loads -->
    <script>
        (function() {
            let attempts = 0;
            const maxAttempts = 20;
            
            const checkReact = setInterval(function() {
                attempts++;
                const rootContent = document.querySelector('#root > div:not(.ssr-content)');
                
                if (rootContent) {
                    document.body.classList.add('react-loaded');
                    console.log('[Theme] ✅ React montado, SSR oculto');
                    clearInterval(checkReact);
                } else if (attempts >= maxAttempts) {
                    console.warn('[Theme] ⚠️ React não montou em 10s');
                    clearInterval(checkReact);
                }
            }, 500);
        })();
    </script>
    
    <?php wp_footer(); ?>
</body>
</html>
