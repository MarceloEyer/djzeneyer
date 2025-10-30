<?php
/**
 * Footer DJ Zen Eyer - Otimizado para SEO, Acessibilidade e Performance
 * @package DJZenEyerTheme
 * @version 2.0
 *
 * 🔗 ESTRUTURA SEMÂNTICA:
 * - Fechamento de landmarks ARIA iniciados no header.php
 * - Schema.org para rodapé (Organization)
 * - Scripts otimizados (defer/async)
 * - Compatibilidade com WordPress + React
 */
?>

    <!-- =====================================================
         FECHAMENTO DO MAIN CONTENT (iniciado no header.php)
         ===================================================== -->
    </div><!-- #content -->

    <!-- =====================================================
         FOOTER SEMÂNTICO (Landmark ARIA)
         ===================================================== -->
    <footer id="colophon" class="site-footer bg-dark text-light py-12" role="contentinfo" itemscope itemtype="https://schema.org/WPFooter">
      <div class="container mx-auto px-4">
        <!-- =================================================
             SEÇÃO DE LINKS RÁPIDOS
             ================================================= -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <!-- Coluna 1: Sobre -->
          <div class="footer-column">
            <h3 class="text-lg font-semibold mb-4" itemprop="name">DJ Zen Eyer</h3>
            <p class="text-sm text-gray-400" itemprop="description">
              <?php echo esc_html(get_bloginfo('description')); ?>
            </p>
            <div class="mt-4">
              <a href="<?php echo esc_url(home_url('/about')); ?>" class="text-primary hover:underline">
                <?php esc_html_e('Sobre Mim', 'djzeneyer'); ?>
              </a>
            </div>
          </div>

          <!-- Coluna 2: Música -->
          <div class="footer-column">
            <h3 class="text-lg font-semibold mb-4"><?php esc_html_e('Música', 'djzeneyer'); ?></h3>
            <ul class="space-y-2">
              <li><a href="<?php echo esc_url(home_url('/music')); ?>" class="text-gray-400 hover:text-white"><?php esc_html_e('Mix Tapes', 'djzeneyer'); ?></a></li>
              <li><a href="<?php echo esc_url(home_url('/releases')); ?>" class="text-gray-400 hover:text-white"><?php esc_html_e('Lançamentos', 'djzeneyer'); ?></a></li>
              <li><a href="https://soundcloud.com/djzeneyer" rel="noopener noreferrer" target="_blank" class="text-gray-400 hover:text-white"><?php esc_html_e('SoundCloud', 'djzeneyer'); ?></a></li>
              <li><a href="https://mixcloud.com/djzeneyer" rel="noopener noreferrer" target="_blank" class="text-gray-400 hover:text-white"><?php esc_html_e('Mixcloud', 'djzeneyer'); ?></a></li>
            </ul>
          </div>

          <!-- Coluna 3: Eventos -->
          <div class="footer-column">
            <h3 class="text-lg font-semibold mb-4"><?php esc_html_e('Eventos', 'djzeneyer'); ?></h3>
            <ul class="space-y-2">
              <li><a href="<?php echo esc_url(home_url('/events')); ?>" class="text-gray-400 hover:text-white"><?php esc_html_e('Próximos Shows', 'djzeneyer'); ?></a></li>
              <li><a href="<?php echo esc_url(home_url('/workshops')); ?>" class="text-gray-400 hover:text-white"><?php esc_html_e('Workshops', 'djzeneyer'); ?></a></li>
              <li><a href="<?php echo esc_url(home_url('/bookings')); ?>" class="text-gray-400 hover:text-white"><?php esc_html_e('Contrate-me', 'djzeneyer'); ?></a></li>
            </ul>
          </div>

          <!-- Coluna 4: Contato -->
          <div class="footer-column">
            <h3 class="text-lg font-semibold mb-4"><?php esc_html_e('Contato', 'djzeneyer'); ?></h3>
            <address class="not-italic text-gray-400">
              <p><?php esc_html_e('São Paulo, Brasil', 'djzeneyer'); ?></p>
              <p><a href="mailto:contato@djzeneyer.com" class="hover:text-white">contato@djzeneyer.com</a></p>
            </address>
            <div class="mt-4 flex space-x-4">
              <a href="https://instagram.com/djzeneyer" aria-label="Instagram" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.26 10.913h-3.5v3.494h3.5v-3.494zm-4.773-5.227h3.5v12.425h-3.5v-12.425zm7.537 0h3.5v6.06h-3.5v-6.06zm0 6.587h3.5v6.333h-3.5v-6.333z"/>
                </svg>
              </a>
              <a href="https://facebook.com/djzeneyer" aria-label="Facebook" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v2.46h-1.918c-1.504 0-1.795.715-1.795 1.763v1.324h3.587l-.467 3.622h-3.12v9.293h9.753c.732 0 1.325-.593 1.325-1.324v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- =================================================
             COPYRIGHT + SCHEMA.ORG
             ================================================= -->
        <div class="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; <?php echo date('Y'); ?> DJ Zen Eyer.
            <?php esc_html_e('Todos os direitos reservados.', 'djzeneyer'); ?>
          </p>

          <!-- Schema.org para Organization -->
          <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "<?php echo esc_url(home_url()); ?>#organization",
            "name": "DJ Zen Eyer",
            "url": "<?php echo esc_url(home_url()); ?>",
            "logo": "<?php echo esc_url(get_template_directory_uri()); ?>/dist/images/dj-zen-eyer-logo-white.png",
            "sameAs": [
              "https://www.instagram.com/djzeneyer",
              "https://www.facebook.com/djzeneyer",
              "https://www.youtube.com/@djzeneyer",
              "https://soundcloud.com/djzeneyer"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "São Paulo",
              "addressCountry": "BR"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+55-11-99999-9999",
              "contactType": "customer service",
              "email": "contato@djzeneyer.com",
              "availableLanguage": ["Portuguese", "English"]
            }
          }
          </script>
        </div>
      </div>
    </footer>

    <!-- =====================================================
         FECHAMENTO DO SITE (iniciado no header.php)
         ===================================================== -->
  </div><!-- #page -->

  <!-- =====================================================
       SCRIPTS OTIMIZADOS (WordPress + React)
       ===================================================== -->
  <?php wp_footer(); ?>

  <!-- =====================================================
       REACT APP (se não estiver enfileirado via functions.php)
       ===================================================== -->
  <?php if (is_file(get_template_directory() . '/dist/assets/index.js')): ?>
    <script type="module" src="<?php echo esc_url(get_template_directory_uri() . '/dist/assets/index.js'); ?>" defer></script>
  <?php endif; ?>

  <!-- =====================================================
       SCRIPT PARA MELHORAR A11Y (Skip Link Focus)
       ===================================================== -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Melhora visibilidade do skip link quando focado
      const skipLink = document.querySelector('.skip-link');
      if (skipLink) {
        skipLink.addEventListener('focus', function() {
          this.classList.add('focus:not-sr-only', 'focus:translate-y-0', 'focus:opacity-100');
        });
        skipLink.addEventListener('blur', function() {
          this.classList.remove('focus:not-sr-only', 'focus:translate-y-0', 'focus:opacity-100');
        });
      }
    });
  </script>

  <!-- =====================================================
       FECHAMENTO DO HTML
       ===================================================== -->
</body>
</html>
