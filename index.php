<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Mode: React SPA with Server-Side SEO + Performance Optimizations
 * @package DJZenEyer
 * @version 2.5.0 - FIX ASSET DISCOVERY
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
// 2️⃣ VITE ASSET DISCOVERY (ROBUSTO)
// ═══════════════════════════════════════════════════════════════════════════

function get_vite_assets() {
    $manifest_path = get_template_directory() . '/dist/.vite/manifest.json';
    if (!file_exists($manifest_path)) {
        $manifest_path = get_template_directory() . '/dist/manifest.json';
    }

    $js_file = null;
    $css_files = [];

    // TENTATIVA A: Via Manifest (O ideal)
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
        if (is_array($manifest) && isset($manifest['src/main.tsx'])) {
            $js_file = '/dist/' . $manifest['src/main.tsx']['file'];
            
            if (isset($manifest['src/main.tsx']['css'])) {
                foreach ($manifest['src/main.tsx']['css'] as $css) {
                    $css_files[] = '/dist/' . $css;
                }
            }
            return ['js' => $js_file, 'css' => $css_files];
        }
    }

    // TENTATIVA B: Escaneamento Direto (Fallback Robusto)
    $assets_dir = get_template_directory() . '/dist/assets';
    
    if (is_dir($assets_dir)) {
        $files = scandir($assets_dir);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;
            
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            
            // Pega o primeiro JS que encontrar (Geralmente é o bundle principal)
            if ($ext === 'js' && !$js_file) {
                $js_file = '/dist/assets/' . $file;
            }
            
            // Pega TODOS os CSS que encontrar (Evita o erro de MIME type)
            if ($ext === 'css') {
                $css_files[] = '/dist/assets/' . $file;
            }
        }
    }

    return ['js' => $js_file, 'css' => $css_files];
}

$assets = get_vite_assets();
$main_js = $assets['js'];
$css_files = $assets['css'];

// 🎯 URL absoluta do tema WordPress
$theme_uri = get_template_directory_uri();
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    
    <link rel="icon" type="image/svg+xml" href="<?php echo esc_url($theme_uri); ?>/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="<?php echo esc_url($theme_uri); ?>/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url($theme_uri); ?>/apple-touch-icon.png">
    <link rel="manifest" href="<?php echo esc_url($theme_uri); ?>/site.webmanifest">
    <meta name="theme-color" content="#0A0E27">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" media="print" onload="this.media='all'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap">
    </noscript>
    
    <?php if (!empty($css_files)): ?>
        <?php foreach ($css_files as $css_file): ?>
            <link rel="stylesheet" href="<?php echo esc_url($theme_uri . $css_file); ?>">
        <?php endforeach; ?>
    <?php else: ?>
        <style>body{background:#0A0E27;color:white;font-family:sans-serif;}</style>
        <script>console.warn('[Theme] ⚠️ Nenhum arquivo CSS encontrado em /dist/assets/');</script>
    <?php endif; ?>
    
    <style>
        body { background-color: #0A0E27; margin: 0; font-family: 'Inter', sans-serif; color: white; }
        #root { min-height: 100vh; display: flex; flex-direction: column; }
        .ssr-content { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .ssr-content h1 { font-family: 'Orbitron', sans-serif; font-size: clamp(2rem, 5vw, 2.5rem); margin-bottom: 1rem; line-height: 1.2; }
        .ssr-content p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem; color: rgba(255,255,255,0.8); }
        .ssr-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
        .ssr-links a { background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px; color: white; text-decoration: none; transition: all 0.3s; border: 1px solid rgba(255,255,255,0.05); }
        .ssr-links a:hover { background: rgba(157, 78, 221, 0.2); border-color: rgba(157, 78, 221, 0.5); transform: translateY(-2px); }
        .react-loaded .ssr-content { display: none; }
    </style>
    <script>
        window.wpData = {
            siteUrl: '<?php echo esc_url(home_url('/')); ?>',
            restUrl: '<?php echo esc_url(rest_url()); ?>',
            nonce: '<?php echo wp_create_nonce('wp_rest'); ?>' // Vital para o OAuth/Login funcionar
        };
    </script>
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="root">
        <div class="ssr-content">
            <h1><?php echo esc_html($ssr_h1); ?></h1>
            <p><?php echo esc_html($ssr_desc); ?></p>
            
            <?php if ($is_front_page): ?>
            <h2>About DJ Zen Eyer</h2>
            <p>2x World Champion Brazilian Zouk DJ, music producer, and Mensa International member.</p>
            
            <nav class="ssr-links" aria-label="Main navigation">
                <a href="<?php echo esc_url(home_url('/')); ?>"><strong>Home</strong><br><small>Main page</small></a>
                <a href="<?php echo esc_url(home_url('/events')); ?>"><strong>Events</strong><br><small>Tour dates</small></a>
                <a href="<?php echo esc_url(home_url('/music')); ?>"><strong>Music</strong><br><small>Sets & Remixes</small></a>
                <a href="<?php echo esc_url(home_url('/shop')); ?>"><strong>Shop</strong><br><small>Merch</small></a>
                <a href="<?php echo esc_url(home_url('/zentribe')); ?>"><strong>ZenTribe</strong><br><small>Community</small></a>
                <a href="<?php echo esc_url(home_url('/work-with-me')); ?>"><strong>Book DJ</strong><br><small>Hire me</small></a>
            </nav>
            <?php endif; ?>
        </div>
    </div>
    
    <noscript>
        <div style="padding: 20px; text-align: center; border: 1px solid #ff4444; margin: 20px; border-radius: 8px;">
            <h2>⚠️ JavaScript Required</h2>
            <p>Please enable JavaScript to view this site.</p>
        </div>
    </noscript>
    
    <?php if ($main_js): ?>
        <script type="module" src="<?php echo esc_url($theme_uri . $main_js); ?>"></script>
    <?php else: ?>
        <script>
            console.error('[Theme] ❌ JS Bundle not found. Run "npm run build".');
        </script>
    <?php endif; ?>
    
    <script>
        (function() {
            let attempts = 0;
            const checkReact = setInterval(function() {
                attempts++;
                const rootContent = document.querySelector('#root > div:not(.ssr-content)');
                if (rootContent) {
                    document.body.classList.add('react-loaded');
                    console.log('[Theme] ✅ React montado');
                    clearInterval(checkReact);
                } else if (attempts >= 20) {
                    clearInterval(checkReact);
                }
            }, 500);
        })();
    </script>
    
    <?php wp_footer(); ?>
</body>
</html>