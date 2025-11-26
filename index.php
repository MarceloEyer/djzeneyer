<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Mode: React SPA with Server-Side SEO
 * @package DJZenEyer
 */
if (!defined('ABSPATH')) exit;

// --- INÍCIO: LÓGICA DE CONTEÚDO DINÂMICO PARA SSR ---
$ssr_h1 = 'DJ Zen Eyer - Brazilian Zouk DJ & Music Producer';
$ssr_desc = 'Official website of DJ Zen Eyer. Music Producer & World Champion Zouk DJ.';
$is_front_page = is_front_page();

if (have_posts()) {
    the_post();
    // Se for uma página/post/evento, usa o título e resumo reais como H1 e Desc.
    $ssr_h1 = get_the_title();
    $ssr_desc = get_the_excerpt() ?: $ssr_desc; // Usa a descrição resumida, senão volta para o default.
    rewind_posts();
} else {
    // Fallback para 404s ou arquivos que não estão sendo tratados
    $ssr_h1 = 'Página não encontrada ou carregando...';
    $ssr_desc = 'Por favor, aguarde o carregamento do JavaScript.';
}
// --- FIM: LÓGICA DE CONTEÚDO DINÂMICO PARA SSR ---
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#0A0E27">
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <style>
        /* ... (Estilos CSS existentes) ... */
        body { background-color: #0A0E27; margin: 0; font-family: 'Inter', sans-serif; color: white; }
        #root { min-height: 100vh; display: flex; flex-direction: column; }
        .ssr-content { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .ssr-content h1 { font-family: 'Orbitron', sans-serif; font-size: 2.5rem; margin-bottom: 1rem; }
        .ssr-content p { font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem; }
        .ssr-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
        .ssr-links a { background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px; color: white; text-decoration: none; transition: all 0.3s; }
        .ssr-links a:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-2px); }
        .react-loaded .ssr-content { display: none; }
    </style>
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="root">
        <div class="ssr-content">
            
            <h1><?php echo esc_html($ssr_h1); ?></h1> 
            
            <p>
                <?php echo esc_html($ssr_desc); ?>
            </p>
            
            <?php if ($is_front_page): // Rich content e links só na Home ?>
            <h2>What You'll Find Here</h2>
            <p>
                Explore my music remixes, upcoming events, dance community (ZenTribe),
                merchandise store, and booking information.
            </p>
            <nav class="ssr-links">
                <a href="<?php echo home_url('/'); ?>"><strong>Home</strong><br>Main page</a>
                <a href="<?php echo home_url('/events'); ?>"><strong>Events</strong><br>Upcoming shows & festivals</a>
                <a href="<?php echo home_url('/music'); ?>"><strong>Music</strong><br>Remixes & DJ sets</a>
                <a href="<?php echo home_url('/shop'); ?>"><strong>Shop</strong><br>Merchandise & digital content</a>
                <a href="<?php echo home_url('/zentribe'); ?>"><strong>ZenTribe</strong><br>Dance community</a>
                <a href="<?php echo home_url('/work-with-me'); ?>"><strong>Book DJ</strong><br>Hire for events</a>
                <a href="<?php echo home_url('/faq'); ?>"><strong>FAQ</strong><br>Frequently asked questions</a>
            </nav>
            <?php endif; ?>
        </div>
    </div>
    
    <noscript>
        </noscript>
    
    <script>
        // Oculta o conteúdo SSR quando o React carregar
        document.addEventListener('DOMContentLoaded', function() {
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