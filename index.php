<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Mode: React SPA with Server-Side SEO
 * @package DJZenEyer
 * @version 2.1.0
 */
if (!defined('ABSPATH')) exit;

// ═══════════════════════════════════════════════════════════════════════════
// 1️⃣ LÓGICA DE CONTEÚDO DINÂMICO PARA SSR (H1 + Description)
// ═══════════════════════════════════════════════════════════════════════════
$ssr_h1 = 'DJ Zen Eyer - Brazilian Zouk DJ & Music Producer';
$ssr_desc = 'Official website of DJ Zen Eyer. Music Producer & World Champion Zouk DJ.';
$is_front_page = is_front_page();

if (have_posts()) {
    the_post();
    // Se for uma página/post/evento, usa o título e resumo reais como H1 e Desc.
    $ssr_h1 = get_the_title();
    $ssr_desc = get_the_excerpt() ?: $ssr_desc;
    rewind_posts(); // CRÍTICO: Reseta o loop para não quebrar outras queries
} else {
    // Fallback para 404s ou arquivos que não estão sendo tratados
    $ssr_h1 = 'DJ Zen Eyer - Brazilian Zouk DJ & Music Producer';
    $ssr_desc = 'Official website of DJ Zen Eyer. Music Producer & World Champion Zouk DJ.';
}

// ═══════════════════════════════════════════════════════════════════════════
// 2️⃣ ASSET HASHING DINÂMICO (Vite Manifest.json)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lê o manifest.json gerado pelo Vite e retorna o caminho hashed do asset.
 * 
 * @param string $entry Nome do arquivo de entrada (ex: 'src/main.tsx')
 * @return string|false Caminho do asset hashed ou false se não encontrado
 */
function get_vite_asset($entry) {
    static $manifest = null;
    
    // Carrega o manifest apenas uma vez
    if ($manifest === null) {
        $manifest_path = get_template_directory() . '/dist/.vite/manifest.json';
        
        if (file_exists($manifest_path)) {
            $manifest_content = file_get_contents($manifest_path);
            $manifest = json_decode($manifest_content, true);
        } else {
            // Se não existir, tenta o caminho alternativo (raiz do dist/)
            $manifest_path_alt = get_template_directory() . '/dist/manifest.json';
            if (file_exists($manifest_path_alt)) {
                $manifest_content = file_get_contents($manifest_path_alt);
                $manifest = json_decode($manifest_content, true);
            } else {
                $manifest = false;
            }
        }
    }
    
    // Se o manifest não foi carregado, retorna false
    if ($manifest === false) {
        return false;
    }
    
    // Busca o asset no manifest
    if (isset($manifest[$entry]['file'])) {
        return '/dist/' . $manifest[$entry]['file'];
    }
    
    return false;
}

// Busca os assets do Vite
$main_js = get_vite_asset('src/main.tsx');
$main_css = get_vite_asset('src/main.tsx'); // O CSS geralmente está dentro do mesmo entry

// Fallback para desenvolvimento (caso o manifest não exista)
if (!$main_js) {
    $main_js = '/dist/assets/index.js'; // Ajuste conforme seu build
}

// Se houver CSS explícito no manifest
$css_files = [];
if ($main_css && isset($manifest['src/main.tsx']['css'])) {
    foreach ($manifest['src/main.tsx']['css'] as $css_file) {
        $css_files[] = '/dist/' . $css_file;
    }
}

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- ═════════════════════════════════════════════════════ -->
    <!-- FAVICONS & PWA -->
    <!-- ═════════════════════════════════════════════════════ -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#0A0E27">
    
    <!-- ═════════════════════════════════════════════════════ -->
    <!-- PRECONNECT (Performance) -->
    <!-- ═════════════════════════════════════════════════════ -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <!-- ═════════════════════════════════════════════════════ -->
    <!-- VITE CSS (Hashed) -->
    <!-- ═════════════════════════════════════════════════════ -->
    <?php if (!empty($css_files)): ?>
        <?php foreach ($css_files as $css_file): ?>
            <link rel="stylesheet" href="<?php echo esc_url($css_file); ?>">
        <?php endforeach; ?>
    <?php else: ?>
        <!-- Fallback CSS (caso o manifest não liste o CSS separado) -->
        <link rel="stylesheet" href="/dist/assets/index.css">
    <?php endif; ?>
    
    <!-- ═════════════════════════════════════════════════════ -->
    <!-- SSR CRITICAL CSS (Inline para LCP) -->
    <!-- ═════════════════════════════════════════════════════ -->
    <style>
        /* Critical CSS para o SSR/Fallback */
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
            font-size: 2.5rem; 
            margin-bottom: 1rem; 
            line-height: 1.2;
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
        /* Oculta SSR quando React carrega */
        .react-loaded .ssr-content { 
            display: none; 
        }
    </style>
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <!-- ═════════════════════════════════════════════════════ -->
    <!-- REACT ROOT -->
    <!-- ═════════════════════════════════════════════════════ -->
    <div id="root">
        <!-- SSR FALLBACK CONTENT (Crawlers veem isso antes do JS) -->
        <div class="ssr-content">
            <!-- H1 DINÂMICO (CRÍTICO PARA SEO) -->
            <h1><?php echo esc_html($ssr_h1); ?></h1>
            
            <!-- DESCRIÇÃO DINÂMICA -->
            <p><?php echo esc_html($ssr_desc); ?></p>
            
            <?php if ($is_front_page): ?>
            <!-- RICH CONTENT APENAS NA HOME -->
            <h2>What You'll Find Here</h2>
            <p>
                Explore my music remixes, upcoming events, dance community (ZenTribe),
                merchandise store, and booking information.
            </p>
            
            <!-- NAVIGATION LINKS (SEO + UX) -->
            <nav class="ssr-links" aria-label="Main navigation">
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <strong>Home</strong><br>Main page
                </a>
                <a href="<?php echo esc_url(home_url('/events')); ?>">
                    <strong>Events</strong><br>Upcoming shows & festivals
                </a>
                <a href="<?php echo esc_url(home_url('/music')); ?>">
                    <strong>Music</strong><br>Remixes & DJ sets
                </a>
                <a href="<?php echo esc_url(home_url('/shop')); ?>">
                    <strong>Shop</strong><br>Merchandise & digital content
                </a>
                <a href="<?php echo esc_url(home_url('/zentribe')); ?>">
                    <strong>ZenTribe</strong><br>Dance community
                </a>
                <a href="<?php echo esc_url(home_url('/work-with-me')); ?>">
                    <strong>Book DJ</strong><br>Hire for events
                </a>
                <a href="<?php echo esc_url(home_url('/faq')); ?>">
                    <strong>FAQ</strong><br>Frequently asked questions
                </a>
            </nav>
            <?php endif; ?>
        </div>
    </div>
    
    <!-- ═════════════════════════════════════════════════════ -->
    <!-- NOSCRIPT WARNING -->
    <!-- ═════════════════════════════════════════════════════ -->
    <noscript>
        <div style="padding: 20px; text-align: center; background: rgba(255,0,0,0.1); border: 2px solid red; margin: 20px; border-radius: 8px;">
            <h2>⚠️ JavaScript Required</h2>
            <p>This website requires JavaScript to display its full interactive experience.</p>
            <p>Please enable JavaScript in your browser settings to continue.</p>
        </div>
    </noscript>
    
    <!-- ═════════════════════════════════════════════════════ -->
    <!-- VITE REACT APP (Hashed JS) -->
    <!-- ═════════════════════════════════════════════════════ -->
    <script type="module" src="<?php echo esc_url($main_js); ?>"></script>
    
    <!-- ═════════════════════════════════════════════════════ -->
    <!-- HIDE SSR WHEN REACT LOADS -->
    <!-- ═════════════════════════════════════════════════════ -->
    <script>
        // Oculta o conteúdo SSR quando o React carregar
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                // Verifica se o React montou algum conteúdo dentro do #root
                const rootContent = document.querySelector('#root > div:not(.ssr-content)');
                if (rootContent) {
                    document.body.classList.add('react-loaded');
                    console.log('[Theme] ✅ React hidratado, SSR oculto');
                }
            }, 500);
        });
    </script>
    
    <?php wp_footer(); ?>
</body>
</html>