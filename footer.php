<?php
/**
 * O rodapé (footer.php) para o tema headless.
 */
?>
    </div> <?php 
        // wp_footer() é essencial.
        // É aqui que o WordPress e o nosso functions.php
        // irão injetar o <script> principal do React (index.js).
        wp_footer(); 
    ?>
</body>
</html>