<?php
/**
 * Footer DJ Zen Eyer - v2.1 SECURITY & SEO OPTIMIZED
 * 🔗 Estrutura semântica completa com Schema.org
 * 🔐 Security: Escaping em todos outputs, rel attributes, nonce
 * ♿ Acessibilidade: Landmarks ARIA, semantic HTML, skip links
 * ⚡ Performance: Defer scripts, lazy SVG, otimização de recursos
 * 
 * @package DJZenEyerTheme
 * @version 2.1.0
 * @updated 2025-10-30 @ 15:37 UTC
 * @author DJ Zen Eyer Team
 * 
 * MUDANÇAS v2.0 → v2.1:
 * ✅ Security: rel="noopener noreferrer" em todos external links (LINE 51, 52, 53, 115, 117)
 * ✅ Security: esc_url() + esc_attr() em todos URLs e atributos (FULL)
 * ✅ Schema.org: Organization corrigida com validação (LINE 140-185)
 * ✅ Accessibility: aria-current="page" em links ativos (LINE 69-74)
 * ✅ Accessibility: aria-label em SVG icons (LINE 115, 117, 119, 121)
 * ✅ Performance: SVG inline (eliminado fetch externo)
 * ✅ Performance: defer no script A11y (LINE 225-241)
 * ✅ I18n: Melhorado com ngettext, esc_html_e, sprintf
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

    <!-- =====================================================
         FECHAMENTO DO MAIN CONTENT (iniciado no header.php)
         ===================================================== -->
    </main><!-- #main-content -->
  </div><!-- #page -->

  <!-- =====================================================
       FOOTER SEMÂNTICO (Landmark ARIA + Schema.org)
       ===================================================== -->
  <footer id="colophon" 
          class="site-footer bg-dark text-light py-12" 
          role="contentinfo" 
          itemscope 
          itemtype="https://schema.org/WPFooter">
    
    <div class="container mx-auto px-4">
      
      <!-- =================================================
           SEÇÃO DE LINKS RÁPIDOS (Grid 4 Colunas)
           ================================================= -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        <!-- Coluna 1: Sobre + Descrição -->
        <div class="footer-column" itemscope itemtype="https://schema.org/BreadcrumbList">
          <h3 class="text-lg font-semibold mb-4" itemprop="name">
            <?php echo esc_html(djz_config('site.name')); ?>
          </h3>
          <p class="text-sm text-gray-400" itemprop="description">
            <?php echo esc_html(get_bloginfo('description')); ?>
          </p>
          <div class="mt-4">
            <a href="<?php echo esc_url(home_url('/about')); ?>" 
               class="text-primary hover:underline transition-colors" 
               <?php echo is_page('about') ? 'aria
