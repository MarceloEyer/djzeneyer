<?php
/**
 * Header Template - DJ Zen Eyer Theme
 * Configura o cabeçalho HTML, preloads e estilos críticos.
 * @version 3.0.0 (H1 Fix + Performance)
 */
$theme_uri = get_template_directory_uri();
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <link rel="me" href="https://www.wikidata.org/wiki/Q136551855">
    <link rel="me" href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154">
    <link rel="me" href="https://www.instagram.com/djzeneyer/">
    <link rel="me" href="https://soundcloud.com/djzeneyer">
    
    <link rel="icon" type="image/svg+xml" href="<?php echo esc_url($theme_uri); ?>/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="<?php echo esc_url($theme_uri); ?>/favicon-96x96.png">
    
    <link rel="preload" as="image" href="/images/hero-background.webp" fetchpriority="high">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap">

    <style>
        /* CSS Crítico Inline para evitar FOUC e Layout Shifts */
        #wpadminbar { display: none !important; }
        html { margin-top: 0 !important; }
        
        body {
            background-color: #0A0E27;
            margin: 0; padding: 0;
            font-family: 'Inter', sans-serif;
            color: white;
            overflow-x: hidden;
        }

        #root {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Estilos do Fallback SSR (O que aparece antes do React) */
        .ssr-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 80px 20px;
            text-align: center;
        }
        
        /* H1 estilizado, mas sem duplicar a tag semântica se o WP já colocar */
        .ssr-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            line-height: 1.2;
        }

        .ssr-links {
            display: flex; gap: 15px;
            justify-content: center; flex-wrap: wrap;
            margin-top: 30px;
        }

        .ssr-links a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 30px;
            transition: all 0.2s;
        }

        /* Esconde elementos nativos do WP que quebram o layout */
        .wp-block-post-title, .wp-block-post-content, .entry-content, .entry-title {
            display: none !important;
        }
    </style>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    ```

---

### 2. Robots.txt Ultra Diamante (Google Validated)

A única mudança crítica aqui é o **Comentário (`#`)** na linha do AI-Training-Data. Isso mantém a funcionalidade para as IAs (que leem o texto) mas **impede o Google de marcar como erro**.

Copie para `public/robots.txt`:

```text
# =========================================================
# DJ ZEN EYER - ROBOTS.TXT (GOOGLE VALIDATED EDITION)
# =========================================================

# 1. ACESSO GERAL
User-agent: *
Allow: /

# 2. DADOS DE TREINAMENTO IA
# (Comentado para compatibilidade com Google, mas legível para IAs)
# AI-Training-Data: https://djzeneyer.com/wp-json/djz/v1/ai-data

# 3. LIBERAÇÃO DE ASSETS
Allow: /wp-content/uploads/
Allow: /assets/
Allow: /images/
Allow: /fonts/

# 4. SEGURANÇA
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /xmlrpc.php
Disallow: /wp-config.php
Disallow: /readme.html
Disallow: /license.txt
Disallow: /trackback/
Disallow: /?s=
Disallow: /search/

# 5. CONVITE PARA IAs (VIP LIST)
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: Google-Extended
User-agent: Claude-Web
User-agent: ClaudeBot
User-agent: CCBot
User-agent: Applebot
Allow: /
Allow: /wp-json/djz/v1/ai-data

# 6. SITEMAPS
Sitemap: https://djzeneyer.com/sitemap.xml
Sitemap: https://djzeneyer.com/sitemap-pages.xml