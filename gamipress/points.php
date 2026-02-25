<?php
/**
 * Points template
 *
 * This template can be overridden by copying it to yourtheme/gamipress/points.php
 * To override a specific points type just copy it as yourtheme/gamipress/points-{points-type}.php
 */
global $gamipress_template_args;

// Shorthand
$a = $gamipress_template_args;

$points_types = gamipress_get_points_types();

// Default points type
$points_types[''] = array(
    'singular_name' => __( 'Point', 'gamipress' ),
    'plural_name' => __( 'Points', 'gamipress' )
);

// Check to meet if points showed comes from current logged in user
$is_current_user = ( absint( $a['user_id'] ) === get_current_user_id() );

// Setup thumbnail size
$thumbnail_size = absint( $a['thumbnail_size'] );

if( $thumbnail_size === 0 ) {
    $thumbnail_size = 'gamipress-points';
} else {
    $thumbnail_size = array( $thumbnail_size, $thumbnail_size );
}

// Setup points classes
$classes = array(
    'gamipress-user-points',
    ( $is_current_user ? 'gamipress-is-current-user' : '' ),
    'gamipress-columns-' . $a['columns'],
    'gamipress-columns-small-' . $a['columns_small'],
    'gamipress-layout-' . $a['layout'],
    'gamipress-align-' . $a['align']
);

/**
 * Points classes
 *
 * @since 1.4.0
 *
 * @param array     $classes            Array of points classes
 * @param integer   $points_types       Array of points types to be rendered
 * @param array     $template_args      Template received arguments
 */
$classes = apply_filters( 'gamipress_points_classes', $classes, $points_types, $a ); ?>

<div class="<?php echo esc_attr( implode( ' ', $classes ) ); ?> ssr-content" itemscope itemtype="https://schema.org/ItemList">
    <meta itemprop="numberOfItems" content="<?php echo count($a['points']); ?>">
    
    <?php do_action( 'gamipress_before_render_points_list', $points_types, $a ); ?>

    <div class="zen-points-grid">
        <?php foreach( $a['points'] as $points_type => $amount ) :
            $label_position = gamipress_get_points_type_label_position( $points_type );
            $pt_data = isset($points_types[$points_type]) ? $points_types[$points_type] : $points_types[''];
            ?>

            <div class="gamipress-points zen-point-card" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <meta itemprop="position" content="<?php echo array_search($points_type, array_keys($a['points'])) + 1; ?>">
                
                <?php if( $a['thumbnail'] === 'yes' ) : ?>
                    <div class="gamipress-user-points-image">
                        <?php echo gamipress_get_points_type_thumbnail( $points_type, $thumbnail_size ); ?>
                    </div>
                <?php endif; ?>

                <div class="gamipress-user-points-description">
                    <span class="gamipress-user-points-amount font-bold text-2xl" itemprop="name">
                        <?php echo gamipress_format_amount( $amount, $points_type ); ?>
                    </span>

                    <?php if( $a['label'] === 'yes' ) : ?>
                        <span class="gamipress-user-points-label opacity-70 text-sm uppercase tracking-wider">
                            <?php echo gamipress_get_points_amount_label( $amount, $points_type ); ?>
                        </span>
                    <?php endif; ?>
                </div>

            </div><!-- .zen-point-card -->

        <?php endforeach; ?>
    </div><!-- .zen-points-grid -->

    <?php do_action( 'gamipress_after_render_points_list', $points_types, $a ); ?>

</div><!-- .gamipress-user-points -->

<style>
.zen-points-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 2rem;
}
.zen-point-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: transform 0.2s;
}
.zen-point-card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
}
.gamipress-user-points-image img {
    max-width: 48px;
    margin: 0 auto 10px;
}
</style>
