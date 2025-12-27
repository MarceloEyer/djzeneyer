<?php
/**
 * Main Template File
 *
 * This file is required by WordPress correctly.
 * However, all the rendering is handled by React via 'inc/vite.php'.
 */

// Se não houver build do React, mostra erro (segurança)
if (!defined('ABSPATH')) exit;

get_header(); 
?>

<div id="root">
    </div>

<?php 
get_footer();