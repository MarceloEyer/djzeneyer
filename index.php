<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Mode: React SPA with Server-Side SEO + Security Injection
 */

// Lógica de Conteúdo Dinâmico (SSR)
$ssr_h1 = 'DJ Zen Eyer - Brazilian Zouk DJ & Music Producer';
$ssr_desc = 'Official website of DJ Zen Eyer. 2x World Champion Brazilian Zouk DJ, music producer, and Mensa International member.';

if (have_posts()) {
    the_post();
    $ssr_h1 = get_the_title();
    $ssr_desc = get_the_excerpt() ?: wp_trim_words(get_the_content(), 25);
}

// 1. Carrega o cabeçalho (HTML head, meta tags, estilos)
get_header(); 
?>

<script>
  window.wpData = {
    siteUrl: "<?php echo esc_url(home_url()); ?>",
    themeUrl: "<?php echo esc_url(get_template_directory_uri()); ?>",
    restUrl: "<?php echo esc_url(rest_url()); ?>", // Garante a URL certa da API
    nonce: "<?php echo wp_create_nonce('wp_rest'); ?>", // O "Crachá" de acesso
    isUserLoggedIn: <?php echo is_user_logged_in() ? 'true' : 'false'; ?>,
    userId: <?php echo get_current_user_id(); ?>
  };
</script>

<div id="root">
    <div class="ssr-content">
        <h1><?php echo esc_html($ssr_h1); ?></h1>
        <p><?php echo esc_html($ssr_desc); ?></p>
        
        <?php if (is_front_page()): ?>
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

<?php 
// 2. Carrega o rodapé (Scripts do React, fechamento do body)
get_footer(); 
?>