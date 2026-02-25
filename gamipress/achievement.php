<?php
/**
 * Achievement template
 *
 * This template can be overridden by copying it to yourtheme/gamipress/achievement.php
 * To override a specific achievement type just copy it as yourtheme/gamipress/achievement-{achievement-type}.php
 */
global $gamipress_template_args;

// Shorthand
$a = $gamipress_template_args;

$user_id = isset( $a['user_id'] ) ? absint( $a['user_id'] ) : get_current_user_id();

// Check if user has earned this achievement
$earned = gamipress_has_user_earned_achievement( get_the_ID(), $user_id );

// Setup thumbnail size
$thumbnail_size = absint( $a['thumbnail_size'] );

if( $thumbnail_size === 0 ) {
    $thumbnail_size = 'gamipress-achievement';
} else {
    $thumbnail_size = array( $thumbnail_size, $thumbnail_size );
}

// Sanitize title size
$a['title_size'] = gamipress_sanitize_title_size_option( $a['title_size'] );

// Setup achievement classes
$classes = array(
    'gamipress-achievement',
    ( $earned ? 'user-has-earned' : 'user-has-not-earned' ),
    'gamipress-layout-' . $a['layout'],
    'gamipress-align-' . $a['align']
);

/**
 * Achievement classes
 *
 * @since 1.4.0
 *
 * @param array     $classes            Array of achievement classes
 * @param integer   $achievement_id     The Achievement ID
 * @param array     $template_args      Template received arguments
 */
$classes = apply_filters( 'gamipress_achievement_classes', $classes, get_the_ID(), $a ); ?>

<article id="gamipress-achievement-<?php the_ID(); ?>" class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>" itemscope itemtype="https://schema.org/CreativeWork">
    <meta itemprop="identifier" content="<?php the_ID(); ?>">

    <?php
    /**
     * Before render achievement
     */
    do_action( 'gamipress_before_render_achievement', get_the_ID(), $a ); ?>

    <?php // Achievement Image
    if( $a['thumbnail'] === 'yes' ) : ?>
        <div class="gamipress-achievement-image">
            <?php if( $a['link'] === 'yes' ) : ?>
                <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                    <?php echo gamipress_get_achievement_post_thumbnail( get_the_ID(), $thumbnail_size ); ?>
                </a>
            <?php else : ?>
                <?php echo gamipress_get_achievement_post_thumbnail( get_the_ID(), $thumbnail_size ); ?>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="gamipress-achievement-description">
        <header>
            <?php // Achievement Title
            if( $a['title'] === 'yes' ) : ?>
                <<?php echo $a['title_size']; ?> class="gamipress-achievement-title" itemprop="name">
                    <?php if( $a['link'] === 'yes' ) : ?>
                        <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><?php the_title(); ?></a>
                    <?php else : ?>
                        <?php the_title(); ?>
                    <?php endif; ?>
                </<?php echo $a['title_size']; ?>>
            <?php endif; ?>

            <?php // Achievement points
            if( $a['points_awarded'] === 'yes' ) : ?>
                <div class="achievement-points-badge">
                    <?php echo gamipress_achievement_points_markup( get_the_ID(), $a ); ?>
                </div>
            <?php endif; ?>
        </header>

        <?php // Achievement Short Description (Lead Paragraph for AIO)
        if( $a['excerpt'] === 'yes' ) :  ?>
            <div class="gamipress-achievement-excerpt" itemprop="description">
                <?php
                $excerpt = has_excerpt() ? gamipress_get_post_field( 'post_excerpt', get_the_ID() ) : gamipress_get_post_field( 'post_content', get_the_ID() );
                // SEO Pattern: Response starts directly in the first paragraph
                echo wpautop( do_blocks( apply_filters( 'get_the_excerpt', $excerpt, get_post() ) ) );
                ?>
            </div>
        <?php endif; ?>

        <footer class="gamipress-achievement-footer">
            <?php // Times Earned
            if( $a['times_earned'] === 'yes' ) : ?>
                <div class="earned-count">
                    <?php echo gamipress_achievement_times_earned_markup( get_the_ID(), $a ); ?>
                </div>
            <?php endif; ?>

            <?php // Achievement Steps / Requirements
            if ( $a['steps'] === 'yes' && $steps = gamipress_get_achievement_steps( get_the_ID() ) ) : ?>
                <div class="gamipress-achievement-attached">
                    <?php if ( $a['toggle'] === 'yes' ) : ?>
                        <details class="gamipress-details">
                            <summary><?php _e( 'Details', 'gamipress' ); ?></summary>
                            <div class="gamipress-extras-window">
                                <?php echo gamipress_get_required_achievements_for_achievement_list_markup( $steps, get_the_ID(), $user_id, $a ); ?>
                            </div>
                        </details>
                    <?php else : ?>
                        <?php echo gamipress_get_required_achievements_for_achievement_list_markup( $steps, get_the_ID(), $user_id, $a ); ?>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </footer>

    </div><!-- .gamipress-achievement-description -->

    <?php do_action( 'gamipress_after_render_achievement', get_the_ID(), $a ); ?>

</article><!-- .gamipress-achievement -->
