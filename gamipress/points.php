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
    'singular_name' => __('Point', 'gamipress'),
    'plural_name' => __('Points', 'gamipress')
);

// Check to meet if points showed comes from current logged in user
$is_current_user = (absint($a['user_id']) === get_current_user_id());

// Setup thumbnail size
$thumbnail_size = absint($a['thumbnail_size']);

if ($thumbnail_size === 0) {
    $thumbnail_size = 'gamipress-points';
} else {
    $thumbnail_size = array($thumbnail_size, $thumbnail_size);
}

// Setup points classes
$classes = array(
    'gamipress-user-points',
    ($is_current_user ? 'gamipress-is-current-user' : ''),
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
$classes = apply_filters('gamipress_points_classes', $classes, $points_types, $a); ?>

<div class="<?php echo esc_attr(implode(' ', $classes)); ?> ssr-content" itemscope
    itemtype="https://schema.org/ItemList">
    <meta itemprop="numberOfItems" content="<?php echo count($a['points']); ?>">

    <?php do_action('gamipress_before_render_points_list', $points_types, $a); ?>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        <?php foreach ($a['points'] as $points_type => $amount):
            $label_position = gamipress_get_points_type_label_position($points_type);
            $pt_data = isset($points_types[$points_type]) ? $points_types[$points_type] : $points_types[''];
            ?>

            <div class="bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 group"
                itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <meta itemprop="position" content="<?php echo array_search($points_type, array_keys($a['points'])) + 1; ?>">

                <?php if ($a['thumbnail'] === 'yes'): ?>
                    <div class="mb-4 flex justify-center">
                        <div class="w-12 h-12 flex items-center justify-center filter drop-shadow-lg">
                            <?php echo gamipress_get_points_type_thumbnail($points_type, $thumbnail_size); ?>
                        </div>
                    </div>
                <?php endif; ?>

                <div class="flex flex-col gap-1">
                    <span
                        class="text-3xl font-black tracking-tight text-white group-hover:scale-110 transition-transform duration-300"
                        itemprop="name">
                        <?php echo gamipress_format_amount($amount, $points_type); ?>
                    </span>

                    <?php if ($a['label'] === 'yes'): ?>
                        <span
                            class="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/40 group-hover:text-white/70 transition-colors">
                            <?php echo gamipress_get_points_amount_label($amount, $points_type); ?>
                        </span>
                    <?php endif; ?>
                </div>

            </div><!-- .zen-point-card -->

        <?php endforeach; ?>
    </div><!-- .zen-points-grid -->

    <?php do_action('gamipress_after_render_points_list', $points_types, $a); ?>

</div><!-- .gamipress-user-points -->