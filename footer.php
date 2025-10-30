<?php
/**
 * Footer DJ Zen Eyer - v4.2.1 SECURITY & SEO OPTIMIZED
 * 🔗 Estrutura semântica completa com Schema.org + i18n
 * 🔐 Security: Escaping em TODOS outputs, rel attributes, nonce CSP
 * ♿ Acessibilidade: Landmarks ARIA, semantic HTML, skip links, a11y scripts
 * ⚡ Performance: Defer scripts, lazy SVG, otimização de recursos
 * 
 * @package DJZenEyerTheme
 * @version 4.2.1
 * @updated 2025-10-30 @ 19:49 UTC
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

    <!-- =====================================================
         FECHAMENTO DO MAIN CONTENT
         ===================================================== -->
    </main><!-- #main-content -->
  </div><!-- #page -->

  <!-- =====================================================
       FOOTER SEMÂNTICO (Schema.org v4.2.1 - FIXED)
       ===================================================== -->
  <footer id="colophon" 
          class="site-footer bg-dark text-light py-12" 
          role="contentinfo" 
          aria-label="<?php esc_attr_e('Rodapé do site', 'djzeneyer'); ?>"
          itemscope 
          itemtype="https://schema.org/WPFooter">
    
    <div class="container mx-auto px-4">
      
      <!-- Grid 4 Colunas v4.2.1 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        <!-- Coluna 1: Sobre -->
        <div class="footer-column" itemscope itemtype="https://schema.org/Thing">
          <h3 class="text-lg font-semibold mb-4" itemprop="name">
            <?php echo esc_html(function_exists('djz_config') ? djz_config('site.name') : get_bloginfo('name')); ?>
          </h3>
          <p class="text-sm text-gray-400" itemprop="description">
            <?php echo esc_html(get_bloginfo('description')); ?>
          </p>
          <div class="mt-4">
            <a href="<?php echo esc_url(home_url('/about')); ?>" 
               class="text-primary hover:underline transition-colors" 
               <?php echo is_page('about') ? 'aria-current="page"' : ''; ?>>
              <?php esc_html_e('Sobre Mim', 'djzeneyer'); ?>
            </a>
          </div>
        </div>

        <!-- Coluna 2: Música -->
        <div class="footer-column" aria-labelledby="music-nav">
          <h3 id="music-nav" class="text-lg font-semibold mb-4">
            <?php esc_html_e('Música', 'djzeneyer'); ?>
          </h3>
          <nav aria-label="<?php esc_attr_e('Navegação de Música', 'djzeneyer'); ?>">
            <ul class="space-y-2">
              <li>
                <a href="<?php echo esc_url(home_url('/music')); ?>" 
                   class="text-gray-400 hover:text-white transition-colors"
                   <?php echo is_page('music') ? 'aria-current="page"' : ''; ?>>
                  <?php esc_html_e('Mix Tapes', 'djzeneyer'); ?>
                </a>
              </li>
              <li>
                <a href="<?php echo esc_url(home_url('/releases')); ?>" 
                   class="text-gray-400 hover:text-white transition-colors"
                   <?php echo is_page('releases') ? 'aria-current="page"' : ''; ?>>
                  <?php esc_html_e('Lançamentos', 'djzeneyer'); ?>
                </a>
              </li>
              <?php if (function_exists('djz_config') && djz_config('social.soundcloud')): ?>
              <li>
                <a href="<?php echo esc_url(djz_config('social.soundcloud')); ?>" 
                   rel="noopener noreferrer external" 
                   target="_blank" 
                   class="text-gray-400 hover:text-white transition-colors"
                   aria-label="<?php esc_attr_e('SoundCloud DJ Zen Eyer', 'djzeneyer'); ?>">
                  <?php esc_html_e('SoundCloud', 'djzeneyer'); ?> ↗
                </a>
              </li>
              <?php endif; ?>
              <?php if (function_exists('djz_config') && djz_config('social.mixcloud')): ?>
              <li>
                <a href="<?php echo esc_url(djz_config('social.mixcloud')); ?>" 
                   rel="noopener noreferrer external" 
                   target="_blank" 
                   class="text-gray-400 hover:text-white transition-colors"
                   aria-label="<?php esc_attr_e('Mixcloud DJ Zen Eyer', 'djzeneyer'); ?>">
                  <?php esc_html_e('Mixcloud', 'djzeneyer'); ?> ↗
                </a>
              </li>
              <?php endif; ?>
            </ul>
          </nav>
        </div>

        <!-- Coluna 3: Eventos -->
        <div class="footer-column" aria-labelledby="events-nav">
          <h3 id="events-nav" class="text-lg font-semibold mb-4">
            <?php esc_html_e('Eventos', 'djzeneyer'); ?>
          </h3>
          <nav aria-label="<?php esc_attr_e('Navegação de Eventos', 'djzeneyer'); ?>">
            <ul class="space-y-2">
              <li>
                <a href="<?php echo esc_url(home_url('/events')); ?>" 
                   class="text-gray-400 hover:text-white transition-colors"
                   <?php echo is_page('events') ? 'aria-current="page"' : ''; ?>>
                  <?php esc_html_e('Próximos Shows', 'djzeneyer'); ?>
                </a>
              </li>
              <li>
                <a href="<?php echo esc_url(home_url('/workshops')); ?>" 
                   class="text-gray-400 hover:text-white transition-colors"
                   <?php echo is_page('workshops') ? 'aria-current="page"' : ''; ?>>
                  <?php esc_html_e('Workshops', 'djzeneyer'); ?>
                </a>
              </li>
              <li>
                <a href="<?php echo esc_url(home_url('/bookings')); ?>" 
                   class="text-gray-400 hover:text-white transition-colors font-semibold"
                   <?php echo is_page('bookings') ? 'aria-current="page"' : ''; ?>>
                  <?php esc_html_e('📩 Contrate-me', 'djzeneyer'); ?>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Coluna 4: Contato + Redes Sociais (FIXED v4.2.1) -->
        <div class="footer-column" aria-labelledby="contact-nav">
          <h3 id="contact-nav" class="text-lg font-semibold mb-4">
            <?php esc_html_e('Contato', 'djzeneyer'); ?>
          </h3>
          
          <!-- Endereço + Email (FIXED - usando mailto:) -->
          <address class="not-italic text-gray-400 mb-4" itemscope itemtype="https://schema.org/PostalAddress">
            <p itemprop="addressLocality">
              <?php 
                $city = function_exists('djz_config') ? djz_config('contact.city', 'São Paulo') : 'São Paulo';
                echo esc_html($city);
              ?>, 
              <?php 
                $country = function_exists('djz_config') ? djz_config('contact.country', 'Brasil') : 'Brasil';
                echo esc_html($country);
              ?>
            </p>
            <?php if (function_exists('djz_config')): 
              $contact_email = djz_config('contact.email');
              if ($contact_email):
            ?>
            <p>
              <a href="<?php echo esc_attr('mailto:' . $contact_email); ?>" 
                 class="hover:text-white transition-colors"
                 itemprop="email">
                <?php echo esc_html($contact_email); ?>
              </a>
            </p>
            <?php endif; endif; ?>
          </address>

          <!-- Redes Sociais (Inline SVG + rel attributes + a11y) -->
          <div class="flex space-x-4" 
               role="list" 
               aria-label="<?php esc_attr_e('Siga nas redes sociais', 'djzeneyer'); ?>">
            
            <!-- Instagram -->
            <?php if (function_exists('djz_config') && djz_config('social.instagram')): ?>
            <a href="<?php echo esc_url(djz_config('social.instagram')); ?>" 
               rel="noopener noreferrer external me" 
               target="_blank" 
               class="text-gray-400 hover:text-white transition-colors transform hover:scale-110 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
               aria-label="<?php esc_attr_e('DJ Zen Eyer no Instagram', 'djzeneyer'); ?>"
               role="listitem">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
              </svg>
            </a>
            <?php endif; ?>

            <!-- Facebook -->
            <?php if (function_exists('djz_config') && djz_config('social.facebook')): ?>
            <a href="<?php echo esc_url(djz_config('social.facebook')); ?>" 
               rel="noopener noreferrer external me" 
               target="_blank" 
               class="text-gray-400 hover:text-white transition-colors transform hover:scale-110 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
               aria-label="<?php esc_attr_e('DJ Zen Eyer no Facebook', 'djzeneyer'); ?>"
               role="listitem">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v2.46h-1.918c-1.504 0-1.795.715-1.795 1.763v1.324h3.587l-.467 3.622h-3.12v9.293h9.753c.732 0 1.325-.593 1.325-1.324v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
              </svg>
            </a>
            <?php endif; ?>

            <!-- YouTube -->
            <?php if (function_exists('djz_config') && djz_config('social.youtube')): ?>
            <a href="<?php echo esc_url(djz_config('social.youtube')); ?>" 
               rel="noopener noreferrer external me" 
               target="_blank" 
               class="text-gray-400 hover:text-white transition-colors transform hover:scale-110 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
               aria-label="<?php esc_attr_e('DJ Zen Eyer no YouTube', 'djzeneyer'); ?>"
               role="listitem">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <?php endif; ?>

            <!-- Spotify -->
            <?php if (function_exists('djz_config') && djz_config('social.spotify')): ?>
            <a href="<?php echo esc_url(djz_config('social.spotify')); ?>" 
               rel="noopener noreferrer external me" 
               target="_blank" 
               class="text-gray-400 hover:text-white transition-colors transform hover:scale-110 focus:outline-2 focus:outline-offset-2 focus:outline-primary"
               aria-label="<?php esc_attr_e('DJ Zen Eyer no Spotify', 'djzeneyer'); ?>"
               role="listitem">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.376-.772.495-1.196.228-3.27-2.009-7.383-2.464-12.251-1.349-.456.074-.916-.156-.99-.619-.075-.463.134-.923.589-.998 5.329-1.199 9.861.557 13.54 1.684.424.159.966.062 1.204-.278.293-.376.216-.961-.424-1.265-2.207-1.272-5.783-1.639-9.532-.798-.41.104-.846-.091-.949-.504-.104-.416.079-.853.492-.957 4.51-1.035 8.48-.713 11.922 1.005.403.213.479.712.257 1.035z"/>
              </svg>
            </a>
            <?php endif; ?>

          </div>
        </div>

      </div><!-- /grid -->

      <!-- COPYRIGHT + SCHEMA.ORG (FIXED v4.2.1 - Com nonce + validação) -->
      <div class="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
        
        <p>
          &copy; <span itemprop="copyrightYear"><?php echo esc_html(date('Y')); ?></span> 
          <span itemprop="copyrightHolder">
            <?php echo esc_html(function_exists('djz_config') ? djz_config('site.name') : get_bloginfo('name')); ?>
          </span>.
          <?php esc_html_e('Todos os direitos reservados.', 'djzeneyer'); ?>
        </p>

        <!-- Schema.org Organization (FIXED v4.2.1 - Com nonce + validação) -->
        <?php 
          // Validação de dados
          if (function_exists('djz_config')):
            $org_name = djz_config('site.name');
            $org_url = home_url();
            $org_description = djz_config('site.description');
            $org_email = djz_config('contact.email');
            
            // Validar campos obrigatórios
            if ($org_name && $org_url && $org_email):
              $org_logo = djz_config('site.logo', '');
              $social_urls = function_exists('djz_social_urls') ? djz_social_urls() : [];
              $org_city = djz_config('contact.city', 'São Paulo');
              $org_country = djz_config('contact.country', 'BR');
              $nonce = function_exists('djzeneyer_get_csp_nonce') ? djzeneyer_get_csp_nonce() : '';
        ?>
        <script type="application/ld+json" <?php echo $nonce ? 'nonce="' . esc_attr($nonce) . '"' : ''; ?>>
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "<?php echo esc_url($org_url . '#organization'); ?>",
  "name": "<?php echo esc_attr($org_name); ?>",
  "url": "<?php echo esc_url($org_url); ?>",
  "description": "<?php echo esc_attr($org_description); ?>",
  <?php if ($org_logo): ?>
  "logo": "<?php echo esc_url($org_logo); ?>",
  <?php endif; ?>
  "email": "<?php echo esc_attr($org_email); ?>",
  "sameAs": <?php echo wp_json_encode(array_filter(array_values($social_urls))); ?>,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "<?php echo esc_attr($org_city); ?>",
    "addressCountry": "<?php echo esc_attr($org_country); ?>"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "<?php echo esc_attr($org_email); ?>",
    "availableLanguage": ["Portuguese", "English"]
  }
}
        </script>
        <?php endif; endif; ?>

      </div>

    </div><!-- /container -->

  </footer><!-- #colophon -->

  <!-- =====================================================
       FECHAMENTO DO HTML
       ===================================================== -->
  </div><!-- #page -->

  <!-- =====================================================
       SCRIPTS OTIMIZADOS (WordPress + React - v4.2.1)
       ===================================================== -->
  <?php wp_footer(); ?>

  <!-- A11Y SCRIPT (Skip Link Focus Management - DEFER) -->
  <script defer>
    (function() {
      'use strict';

      document.addEventListener('DOMContentLoaded', function() {
        const skipLink = document.querySelector('.skip-link');
        if (!skipLink) return;

        // Focus handling
        skipLink.addEventListener('focus', function() {
          this.style.position = 'fixed';
          this.style.top = '10px';
          this.style.left = '10px';
          this.style.zIndex = '999999';
          this.style.outline = '3px solid #fff';
          this.style.outlineOffset = '2px';
        });

        skipLink.addEventListener('blur', function() {
          this.style.position = 'absolute';
          this.style.left = '-999999px';
          this.style.top = '-999999px';
          this.style.zIndex = '-1';
          this.style.outline = 'none';
        });

        // Click handler
        skipLink.addEventListener('click', function(e) {
          e.preventDefault();
          const mainContent = document.querySelector('#main-content');
          if (mainContent) {
            if (mainContent.hasAttribute('tabindex')) {
              mainContent.removeAttribute('tabindex');
            }
            
            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            mainContent.addEventListener('blur', function() {
              this.removeAttribute('tabindex');
            }, { once: true });
          }
        });
      });
    })();
  </script>

</body>
</html>
