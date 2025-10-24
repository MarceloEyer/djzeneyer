<?php
/**
 * Footer do Tema DJ Zen Eyer
 * Inclui scripts, fechamento de body e compatibilidade com WordPress
 */
?>

<!-- Scripts do WordPress (obrigatório para plugins funcionarem) -->
<?php wp_footer(); ?>

<!-- Scripts do seu app React (se não estiver enfileirado via functions.php) -->
<?php if (is_file(get_template_directory() . '/dist/assets/index.js')): ?>
  <script type="module" src="<?php echo get_template_directory_uri(); ?>/dist/assets/index.js"></script>
<?php endif; ?>
</body>
</html>