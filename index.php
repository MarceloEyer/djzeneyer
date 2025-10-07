<?php
/**
 * Arquivo de template principal.
 * Carrega o header, o root do React, e o footer.
 */

get_header(); ?>

    <main id="root"></main>

    <noscript>
        <div style="background-color: #1a1a1a; color: white; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; font-family: sans-serif;">
            <h1 style="font-size: 24px; margin-bottom: 20px;">JavaScript é Necessário</h1>
            <p>Para uma experiência completa neste site, é necessário habilitar o JavaScript no seu navegador.</p>
        </div>
    </noscript>

<?php get_footer(); ?>