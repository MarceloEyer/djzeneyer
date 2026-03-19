<?php
/**
 * Deafault Badge
 *
 * @package     GamiPress\Admin\Default_Badge
 * @author      GamiPress <contact@gamipress.com>, Ruben Garcia <rubengcdev@gmail.com>
 * @since       7.6.3
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Default badges images
 *
 * @since 7.6.3
 *
 * @return array
 */
function gamipress_default_badges_images() {

    return apply_filters( 'gamipress_default_badges_images', array(
        'gamipress-material-1' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-material-1.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-material-1.png'
        ),
        'gamipress-material-2' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-material-2.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-material-2.png'
        ),
        'gamipress-material-3' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-material-3.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-material-3.png'
        ),
        'gamipress-material-4' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-material-4.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-material-4.png'
        ),
        'gamipress-pastel-1' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-pastel-1.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-pastel-1.png'
        ),
        'gamipress-pastel-2' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-pastel-2.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-pastel-2.png'
        ),
        'gamipress-pastel-3' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-pastel-3.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-pastel-3.png'
        ),
        'gamipress-pastel-4' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-pastel-4.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-pastel-4.png'
        ),
        'gamipress-vintage-1' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-vintage-1.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-vintage-1.png'
        ),
        'gamipress-vintage-2' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-vintage-2.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-vintage-2.png'
        ),
        'gamipress-vintage-3' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-vintage-3.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-vintage-3.png'
        ),
        'gamipress-vintage-4' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/gamipress-vintage-4.png',
            'url' => GAMIPRESS_URL . 'assets/badges/gamipress-vintage-4.png'
        ),
    ) );

}

/**
 * Default points images
 *
 * @since 7.6.3
 *
 * @return array
 */
function gamipress_default_points_images() {

    return apply_filters( 'gamipress_default_points_images', array(
        'gamipress-heart' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-heart.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-heart.png'
        ),
        'gamipress-star' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-star.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-star.png'
        ),
        'gamipress-brain' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-brain.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-brain.png'
        ),
        'gamipress-8-ball' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-8-ball.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-8-ball.png'
        ),
        'gamipress-credit' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-credit.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-credit.png'
        ),
        'gamipress-energy' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-energy.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-energy.png'
        ),
        'gamipress-game-coin' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-game-coin.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-game-coin.png'
        ),
        'gamipress-chest' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-chest.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-chest.png'
        ),
        'gamipress-ticket' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-ticket.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-ticket.png'
        ),
        'gamipress-step' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-step.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-step.png'
        ),
        'gamipress-sun' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-sun.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-sun.png'
        ),
        'gamipress-star-coin' => array(
            'file' => GAMIPRESS_DIR . 'assets/badges/points/gamipress-star-coin.png',
            'url' => GAMIPRESS_URL . 'assets/badges/points/gamipress-star-coin.png'
        ),
    ) );

}

/**
 * Text at top
 *
 * @since 7.6.3
 *
 * @return string
 */
function gamipress_default_badges_text_top() {
    return esc_html__( 'or choose an image from this list:', 'gamipress' );
}

/**
 * Text at bottom
 *
 * @since 7.6.3
 *
 * @return string
 */
function gamipress_default_badges_text_bottom() {
    return esc_html__( 'Design your own images!', 'gamipress' );
}

/**
 * Display default badges images
 *
 * @since 7.6.3
 *
 * @param string    $content    Featured image section
 * @param int       $post_id    The post ID
 *
 * @return string
 */
function gamipress_default_badges_images_meta_box( $content, $post_id ) {

    $achievement_types = gamipress_get_achievement_types_slugs();
    $point_types = gamipress_get_points_types_slugs();
    $rank_types = gamipress_get_rank_types_slugs();
    $general_types = array( 'points-type', 'achievement-type', 'rank-type' );

    // All GamiPress post types
    $allowed_post_types = array_merge( $achievement_types, $point_types, $rank_types, $general_types );
    $post_type = get_post_type( $post_id );

    if ( ! in_array( $post_type, $allowed_post_types, true ) ) {
        return $content;
    }

    // Get default badges
    if( $post_type === 'points-type' ) {
        $images = gamipress_default_points_images();
    } else {
        $images = gamipress_default_badges_images();
    }

    if ( empty( $images ) ) {
        return $content;
    }

    $content .= '<div class="gamipress-badge-builder-default-badges">';

    $content .= '<p class="gamipress-badge-builder-default-badges-description-top">' . gamipress_default_badges_text_top() . '</p>';

    $content .= '<div class="gamipress-badge-builder-default-badges-list">';
    foreach ( $images as $img => $data ) {
        $content .= sprintf(
            '<img 
                src="%1$s"
                class="gamipress-badge-builder-default-badge-thumb"
                data-image="%2$s"
                data-post="%3$d"
            />',
            esc_url( $data['url'] ),
            esc_attr( $img ),
            esc_attr( $post_id )
        );
    }

    $content .= '<p class="gamipress-badge-builder-default-badges-description-bottom">'
        . '<a href="' . esc_attr( admin_url( 'admin.php?page=gamipress_badge_builder' ) ) . '" target="_blank">' . gamipress_default_badges_text_bottom() . '</a>'
        . '</p>';


    $content .= '</div>';
    $content .= '</div>';

    return $content;
}
add_filter( 'admin_post_thumbnail_html', 'gamipress_default_badges_images_meta_box', 10, 2 );

/**
 * Ajax function to set a default badge as featured image
 *
 * @since   7.6.3
 *
 */
function gamipress_ajax_badge_builder_set_featured_image() {

    check_ajax_referer( 'gamipress_admin', 'nonce' );

    if( ! current_user_can( gamipress_get_manager_capability() ) ) {
        return;
    }

    $post_id = absint( $_POST['post_id'] );

    // Bail if post does not exist
    if( $post_id === 0 ) {
        wp_send_json_error( 'post_not_found' );
    }

    $post_type = get_post_type( $post_id );

    // Bail if post does not have a post type
    if( $post_type === '' ) {
        wp_send_json_error( 'post_type_not_found' );
    }

    $image = sanitize_text_field( $_POST['image'] );


    // Get default badges
    if( $post_type === 'points-type' ) {
        $images = gamipress_default_points_images();
    } else {
        $images = gamipress_default_badges_images();
    }

    // Bail if image not found
    if( ! isset( $images[$image] ) ) {
        wp_send_json_error( 'file_not_found' );
    }

    $source_path = $images[$image]['file'];

    // Bail if image file does not exist
    if ( ! file_exists( $source_path ) ) {
        wp_send_json_error( 'file_not_found' );
    }

    $filename = basename( $source_path );

    $upload_dir = wp_upload_dir();

    // Copy image to uploads
    $destination = trailingslashit( $upload_dir['path'] ) . $filename;

    if ( ! file_exists( $destination ) ) {
        copy( $source_path, $destination );
    }

    // Search attachment
    $relative_path = str_replace(
        trailingslashit( $upload_dir['basedir'] ),
        '',
        $destination
    );

    global $wpdb;

    $attachment_id = $wpdb->get_var( $wpdb->prepare(
        "SELECT post_id
        FROM {$wpdb->postmeta}
        WHERE meta_key = '_wp_attached_file'
        AND meta_value = %s
        LIMIT 1",
        $relative_path
    ) );

    // Insert new attachment if no exist
    if ( ! $attachment_id ) {
        $filetype = wp_check_filetype( $filename, null );

        $attachment_id = wp_insert_attachment( array(
            'post_mime_type' => $filetype['type'],
            'post_title'     => pathinfo( $filename, PATHINFO_FILENAME ),
            'post_content'   => '',
            'post_status'    => 'inherit',
        ),
            $destination, 0
        );

        if ( is_wp_error( $attachment_id ) ) {
            wp_send_json_error( 'attachment_error' );
        }

        if( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }

        $attach_data = wp_generate_attachment_metadata(
            $attachment_id,
            $destination
        );

        wp_update_attachment_metadata( $attachment_id, $attach_data );
    }

    set_post_thumbnail( $post_id, $attachment_id );

    wp_send_json_success( $attachment_id );
}
add_action( 'wp_ajax_gamipress_badge_builder_set_featured_image', 'gamipress_ajax_badge_builder_set_featured_image' );

/**
 * Function to enqueue the script for default badges.
 *
 * @since   7.6.3
 *
 */
function gamipress_enqueue_block_default_badges() {

    $achievement_types = gamipress_get_achievement_types_slugs();
    $point_types       = gamipress_get_points_types_slugs();
    $rank_types        = gamipress_get_rank_types_slugs();

    // All GamiPress post types
    $allowed_post_types = array_merge( $achievement_types, $point_types, $rank_types );

    wp_enqueue_script(
        'gamipress-default-badges-block',
        GAMIPRESS_URL . 'assets/js/gamipress-default-badges-block.js',
        array( 'wp-hooks', 'wp-element', 'wp-components', 'wp-data', 'wp-edit-post' ),
        '1.0',
        true
    );

    wp_localize_script(
        'gamipress-default-badges-block',
        'gamipress_default_badges',
        array(
            'nonce'                 => wp_create_nonce( 'gamipress_admin' ),
            'images'                => gamipress_default_badges_images(),
            'allowed_post_types'    => $allowed_post_types,
            'text_top'              => gamipress_default_badges_text_top(),
            'text_bottom'           => gamipress_default_badges_text_bottom(),
            'text_bottom_link'      => admin_url( 'admin.php?page=gamipress_badge_builder' ),
        )
    );
}
add_action( 'enqueue_block_editor_assets', 'gamipress_enqueue_block_default_badges');
