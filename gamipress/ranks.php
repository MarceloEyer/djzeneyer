<?php
/**
 * Ranks template
 *
 * This template can be overridden by copying it to yourtheme/gamipress/ranks.php
 * To override a specific rank type just copy it as yourtheme/gamipress/ranks-{rank-type}.php
 */
global $gamipress_template_args;

// Shorthand
$a = $gamipress_template_args;

$rank_types = gamipress_get_rank_types();

$user_id = isset($a['user_id']) ? absint($a['user_id']) : get_current_user_id(); ?>

<div id="gamipress-ranks-list"
    class="gamipress-ranks-list <?php echo ($a['is_user_ranks'] ? 'gamipress-user-ranks' : ''); ?>">

    <?php
    /**
     * Before render rank types list
     *
     * @since 1.0.0
     *
     * @param array $rank_types       Array of rank types to be rendered
     * @param array $template_args    Template received arguments
     */
    do_action('gamipress_before_render_rank_types_list', $a['rank-types'], $a); ?>

    <?php foreach ($a['rank-types'] as $rank_type => $rank_ids):
        if (!isset($rank_types[$rank_type])):
            continue;
        endif; ?>


        <div id="gamipress-rank-type-<?php echo esc_attr($rank_type); ?>"
            class="gamipress-rank-type gamipress-rank-type-<?php echo esc_attr($rank_type); ?>">

            <?php
            /**
             * Before render rank type
             *
             * @since 1.0.0
             *
             * @param string  $rank_type        Rank type slug
             * @param array   $rank_types       Array of rank types to be rendered
             * @param array   $template_args    Template received arguments
             */
            do_action('gamipress_before_render_rank_type', $rank_type, $a['rank-types'], $a); ?>

            <h2 class="text-2xl font-black text-white mb-8 tracking-tighter uppercase border-l-4 border-primary pl-4">
                <?php echo $rank_types[$rank_type]['plural_name']; ?></h2>

            <?php
            /**
             * After rank type title
             *
             * @since 1.0.0
             *
             * @param string  $rank_type        Rank type slug
             * @param array   $rank_types       Array of rank types to be rendered
             * @param array   $template_args    Template received arguments
             */
            do_action('gamipress_after_rank_type_title', $rank_type, $a['rank-types'], $a); ?>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

                <?php foreach ($rank_ids as $rank_id): ?>

                    <div class="gamipress-rank-item">
                        <?php echo gamipress_render_rank($rank_id, $a['template_args']); ?>
                    </div>

                <?php endforeach; ?>

            </div><!-- .gamipress-ranks-container -->

            <?php
            /**
             * After render rank type
             *
             * @since 1.0.0
             *
             * @param string  $rank_type        Rank type slug
             * @param array   $rank_types       Array of rank types to be rendered
             * @param array   $template_args    Template received arguments
             */
            do_action('gamipress_after_render_rank_type', $rank_type, $a['rank-types'], $a); ?>

        </div>

    <?php endforeach; ?>

    <?php
    /**
     * After render rank types list
     *
     * @since 1.0.0
     *
     * @param array $rank_types       Array of rank types to be rendered
     * @param array $template_args    Template received arguments
     */
    do_action('gamipress_after_render_rank_types_list', $a['rank-types'], $a); ?>

</div><!-- .gamipress-ranks-list -->