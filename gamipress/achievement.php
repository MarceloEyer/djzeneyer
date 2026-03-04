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

$user_id = isset($a['user_id']) ? absint($a['user_id']) : get_current_user_id();

// Check if user has earned this achievement
$earned = gamipress_has_user_earned_achievement(get_the_ID(), $user_id);

// Setup thumbnail size
$thumbnail_size = absint($a['thumbnail_size']);

if ($thumbnail_size === 0) {
    $thumbnail_size = 'gamipress-achievement';
} else {
    $thumbnail_size = array($thumbnail_size, $thumbnail_size);
}

// Sanitize title size
$a['title_size'] = gamipress_sanitize_title_size_option($a['title_size']);

// Setup achievement classes
$classes = array(
    'gamipress-achievement',
    ($earned ? 'user-has-earned' : 'user-has-not-earned'),
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
$classes = apply_filters('gamipress_achievement_classes', $classes, get_the_ID(), $a); ?>

<article id="gamipress-achievement-<?php the_ID(); ?>"
    class="<?php echo esc_attr(implode(' ', $classes)); ?> bg-white/5 border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10 group relative overflow-hidden"
    itemscope itemtype="https://schema.org/CreativeWork">
    <meta itemprop="identifier" content="<?php the_ID(); ?>">

    <?php // Efeito de brilho sutil no hover
    if ($earned): ?>
        <div
            class="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100">
        </div>
    <?php endif; ?>

    <?php
    /**
     * Before render achievement
     */
    do_action('gamipress_before_render_achievement', get_the_ID(), $a); ?>

    <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
        <?php // Achievement Image
        if ($a['thumbnail'] === 'yes'): ?>
            <div class="gamipress-achievement-image shrink-0">
                <div
                    class="w-24 h-24 sm:w-20 sm:h-20 flex items-center justify-center bg-black/20 rounded-2xl p-2 group-hover:scale-105 transition-transform duration-500">
                    <?php if ($a['link'] === 'yes'): ?>
                        <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>" class="block w-full h-full">
                            <?php echo gamipress_get_achievement_post_thumbnail(get_the_ID(), $thumbnail_size); ?>
                        </a>
                    <?php else: ?>
                        <?php echo gamipress_get_achievement_post_thumbnail(get_the_ID(), $thumbnail_size); ?>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>

        <div class="gamipress-achievement-description flex-1 text-center sm:text-left">
            <header class="mb-3">
                <?php // Achievement Title
                if ($a['title'] === 'yes'): ?>
                    <<?php echo $a['title_size']; ?> class="text-xl font-bold text-white mb-1 tracking-tight"
                        itemprop="name">
                        <?php if ($a['link'] === 'yes'): ?>
                            <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"
                                class="hover:text-primary transition-colors"><?php the_title(); ?></a>
                        <?php else: ?>
                            <?php the_title(); ?>
                        <?php endif; ?>
                    </<?php echo $a['title_size']; ?>>
                <?php endif; ?>

                <?php // Achievement points
                if ($a['points_awarded'] === 'yes'): ?>
                    <div
                        class="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/80">
                        <?php echo gamipress_achievement_points_markup(get_the_ID(), $a); ?>
                    </div>
                <?php endif; ?>
            </header>

            <?php // Achievement Short Description
            if ($a['excerpt'] === 'yes'): ?>
                <div class="text-sm text-white/60 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300 mb-4"
                    itemprop="description">
                    <?php
                    $excerpt = has_excerpt() ? gamipress_get_post_field('post_excerpt', get_the_ID()) : gamipress_get_post_field('post_content', get_the_ID());
                    echo wpautop(do_blocks(apply_filters('get_the_excerpt', $excerpt, get_post())));
                    ?>
                </div>
            <?php endif; ?>

            <footer class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <?php // Times Earned
                if ($a['times_earned'] === 'yes'): ?>
                    <div class="text-[10px] sm:text-xs font-medium text-white/40 uppercase tracking-widest">
                        <?php echo gamipress_achievement_times_earned_markup(get_the_ID(), $a); ?>
                    </div>
                <?php endif; ?>

                <?php // Achievement Steps / Requirements
                if ($a['steps'] === 'yes' && $steps = gamipress_get_achievement_steps(get_the_ID())): ?>
                    <div class="gamipress-achievement-attached">
                        <?php if ($a['toggle'] === 'yes'): ?>
                            <details
                                class="text-[10px] sm:text-xs text-white/50 cursor-pointer hover:text-white transition-colors">
                                <summary class="list-none focus:outline-none"><?php _e('Details', 'gamipress'); ?></summary>
                                <div class="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 text-xs italic">
                                    <?php echo gamipress_get_required_achievements_for_achievement_list_markup($steps, get_the_ID(), $user_id, $a); ?>
                                </div>
                            </details>
                        <?php else: ?>
                            <div class="text-xs">
                                <?php echo gamipress_get_required_achievements_for_achievement_list_markup($steps, get_the_ID(), $user_id, $a); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </footer>

        </div><!-- .gamipress-achievement-description -->
    </div>

    <?php do_action('gamipress_after_render_achievement', get_the_ID(), $a); ?>

</article><!-- .gamipress-achievement -->