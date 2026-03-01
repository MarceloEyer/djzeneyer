<?php
// Inject JSON-LD for AIO (AI Optimization)
$title = get_the_title();
$description = has_excerpt() ? get_the_excerpt() : wp_trim_words(get_the_content(), 50);
$image = get_the_post_thumbnail_url(get_the_ID(), 'large');
$points = (int)get_post_meta(get_the_ID(), '_gamipress_points_awarded', true);

$schema = [
    "@context" => "https://schema.org",
    "@type" => "Achievement",
    "name" => $title,
    "description" => $description,
    "image" => $image,
    "identifier" => get_the_ID(),
    "interactionStatistic" => [
        "@type" => "InteractionCounter",
        "interactionType" => "https://schema.org/CheckAction",
        "userInteractionCount" => $points
    ]
];
?>
<script type="application/ld+json">
<?php echo json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); ?>
</script>

<article class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>" itemscope itemtype="https://schema.org/CreativeWork">
    <meta itemprop="identifier" content="<?php the_ID(); ?>">

    <?php
    echo gamipress_render_earned_achievement_text( get_the_ID(), get_current_user_id() ); ?>

    <?php do_action( 'gamipress_before_single_achievement', get_the_ID(), $a ); ?>

    <div class="gamipress-achievement-image">
        <?php echo gamipress_get_achievement_post_thumbnail( get_the_ID() ); ?>
    </div>

    <div class="gamipress-achievement-description">
        <header class="ssr-content">
            <h1 class="ssr-title" itemprop="name"><?php the_title(); ?></h1>
            
            <?php if ($points > 0): ?>
                <div class="achievement-points-highlight">
                    <span class="amount"><?php echo $points; ?></span>
                    <span class="label">Zen Points</span>
                </div>
            <?php endif; ?>
        </header>

        <section class="achievement-body" itemprop="description">
            <?php // Achievement content (Lead Paragraph pattern)
            if( isset( $a['original_content'] ) ) :
                echo wpautop( $a['original_content'] );
            endif; ?>
        </section>

        <section class="achievement-requirements">
            <?php echo gamipress_get_required_achievements_for_achievement_list( get_the_ID() ); ?>
        </section>

        <?php if ( (bool) gamipress_get_post_meta( get_the_ID(), '_gamipress_show_earners' ) ) :
            $maximum_earners = absint( gamipress_get_post_meta( get_the_ID(), '_gamipress_maximum_earners' ) ); ?>
            <section class="achievement-earners">
                <h3 class="font-black uppercase text-xs mb-4">Mural de Conquista</h3>
                <?php echo gamipress_get_achievement_earners_list( get_the_ID(), array( 'limit' => $maximum_earners ) ); ?>
            </section>
        <?php endif; ?>

        <?php do_action( 'gamipress_single_achievement_description_bottom', get_the_ID(), $a ); ?>

    </div><!-- .gamipress-achievement-description -->

    <?php do_action( 'gamipress_after_single_achievement', get_the_ID(), $a ); ?>

</article><!-- .achievement-wrap -->
