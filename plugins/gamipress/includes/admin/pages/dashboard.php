<?php
/**
 * Admin Dashboard Page
 *
 * @package     GamiPress\Admin\Dashboard
 * @author      GamiPress <contact@gamipress.com>, Ruben Garcia <rubengcdev@gmail.com>
 * @since       2.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Dashboard page
 *
 * @since  2.0.0
 */
function gamipress_dashboard_page() {
    ?>
    <div class="wrap gamipress-dashboard">

        <div id="icon-options-general" class="icon32"></div>
        <h1 class="wp-heading-inline"><?php esc_html_e( 'Dashboard', 'gamipress' ); ?></h1>
        <hr class="wp-header-end">

        <div id="dashboard-widgets-wrap">
            <div id="dashboard-widgets" class="metabox-holder">

                <?php // Logo ?>
                <div class="gamipress-dashboard-logo">
                    <img src="<?php echo GAMIPRESS_URL . 'assets/img/gamipress-brand-logo.svg' ?>" alt="GamiPress">
                    <strong class="gamipress-dashboard-version">v<?php echo GAMIPRESS_VER; ?></strong>
                </div>

                <?php // Dashboard ?>
                <h1><?php echo esc_html_e( 'Dashboard', 'gamipress' ); ?></h1>

                <div id="postbox-container-1" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Points Types ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'points',
                            'title' => gamipress_dashicon( 'star-filled' ) . __( 'Points Types', 'gamipress' ) . '<a href="' . admin_url( 'edit.php?post_type=points-type' ) . '" class="button button-primary">' . esc_html__( 'Edit', 'gamipress' ) . '</a>',
                            'content_cb' => 'gamipress_dashboard_points_types_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-2" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Achievement Types ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'achievements',
                            'title' => gamipress_dashicon( 'awards' ) . __( 'Achievement Types', 'gamipress' ) . '<a href="' . admin_url( 'edit.php?post_type=achievement-type' ) . '" class="button button-primary">' . esc_html__( 'Edit', 'gamipress' ) . '</a>',
                            'content_cb' => 'gamipress_dashboard_achievement_types_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-3" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Rank Types ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'ranks',
                            'title' => gamipress_dashicon( 'rank' ) . __( 'Rank Types', 'gamipress' ) . '<a href="' . admin_url( 'edit.php?post_type=rank-type' ) . '" class="button button-primary">' . esc_html__( 'Edit', 'gamipress' ) . '</a>',
                            'content_cb' => 'gamipress_dashboard_rank_types_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-4" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // User Earnings ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'user-earnings',
                            'title' => gamipress_dashicon( 'flag' ) . __( 'Latest User Earnings', 'gamipress' ) . '<a href="' . admin_url( 'admin.php?page=gamipress_user_earnings' ) . '" class="button button-primary">' . esc_html__( 'View All', 'gamipress' ) . '</a>',
                            'content_cb' => 'gamipress_dashboard_user_earnings_box',
                        ) ); ?>

                    </div>
                </div>

                <?php // Videos ?>
                <h1><?php echo esc_html_e( 'Videos', 'gamipress' ); ?></h1>

                <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                    <?php // Videos ?>
                    <?php gamipress_dashboard_box( array(
                        'id' => 'videos',
                        'title' => '',
                        'content_cb' => 'gamipress_dashboard_videos_box',
                    ) ); ?>

                </div>

                <?php // Add-ons ?>
                <?php gamipress_dashboard_add_ons_section(); ?>

                <?php // Assets ?>
                <?php gamipress_dashboard_assets_section(); ?>

                <?php // Documentation ?>
                <h1><?php echo esc_html_e( 'Documentation', 'gamipress' ); ?></h1>

                <div id="postbox-container-1" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Getting Started ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'getting-started',
                            'title' => __( 'Getting Started', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_getting_started_docs_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-2" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Tutorials ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'tutorials-docs',
                            'title' => __( 'Tutorials', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_tutorials_docs_box',
                        ) ); ?>

                        <?php // Advanced ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'advanced-docs',
                            'title' => __( 'Advanced', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_advanced_docs_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-3" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Blocks ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'blocks',
                            'title' => __( 'Blocks, Shortcodes and Widgets', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_blocks_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-4" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Support ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'support',
                            'title' => __( 'Support', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_support_box',
                        ) ); ?>

                    </div>
                </div>

                <?php // About ?>
                <h1><?php echo esc_html_e( 'About', 'gamipress' ); ?></h1>

                <div id="postbox-container-1" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Plugins ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'plugins',
                            'title' => __( 'Our Plugins', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_plugins_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-2" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Team ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'team',
                            'title' => __( 'Meet the team', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_team_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-3" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Get involved ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'involved',
                            'title' => __( 'Get involved', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_involved_box',
                        ) ); ?>

                    </div>
                </div>

                <div id="postbox-container-4" class="postbox-container">
                    <div id="normal-sortables" class="meta-box-sortables ui-sortable">

                        <?php // Social ?>
                        <?php gamipress_dashboard_box( array(
                            'id' => 'social',
                            'title' => __( 'Follow us', 'gamipress' ),
                            'content_cb' => 'gamipress_dashboard_social_box',
                        ) ); ?>

                    </div>
                </div>

            </div>
        </div>

    </div>
    <?php
}

/**
 * Dashboard page
 *
 * @since  2.0.0
 */
function gamipress_dashboard_box( $args ) {

    $args = wp_parse_args( $args, array(
        'id' => '',
        'title' => '',
        'content' => '',
        'content_cb' => '',
    ) );

    ?>
        <div id="gamipress-dashboard-<?php echo $args['id']; ?>" class="gamipress-dashboard-box postbox">

            <div class="postbox-header">
                <h2 class="hndle"><?php echo $args['title']; ?></h2>
            </div>

            <div class="inside">

                <?php if( is_callable( $args['content_cb'] ) ) {
                    call_user_func( $args['content_cb'] );
                } else {
                    echo $args['content'];
                } ?>

            </div>

        </div>
    <?php

}

/**
 * Dashboard points types box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_points_types_box() {
    $types = gamipress_get_points_types();
    $count = count( $types );

    if( $count === 0 ) : ?>

        <p><?php esc_html_e( 'Points acts as a digital wallet for users. They can collect points while interacting with your site, then use them in different ways.', 'gamipress' ); ?></p>

        <br>

        <div class="center">
            <a href="<?php echo admin_url( 'post-new.php?post_type=points-type' ); ?>" class="button button-primary button-large"><?php esc_html_e( 'Create your first points type', 'gamipress' ); ?></a>
        </div>

    <?php else : ?>

        <div id="gamipress-registered-points" class="gamipress-registered-points">
            <ul>
                <?php foreach( $types as $slug => $args ) : ?>
                    <li>
                        <a href="<?php echo get_edit_post_link( $args['ID'] ); ?>">
                            <span><?php echo esc_html( $args['plural_name'] ); ?></span>
                            <span><?php printf( esc_html__( '%d Awarded', 'gamipress' ), gamipress_get_earnings_points_sum( array( 'points_type' => $slug, 'points' => 0, 'points_compare' => '>' ) ) ); ?></span>
                            <span><?php printf( esc_html__( '%d Deducted', 'gamipress' ), gamipress_get_earnings_points_sum( array( 'points_type' => $slug, 'points' => 0, 'points_compare' => '<' ) ) ); ?></span>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

    <?php endif;
}

/**
 * Dashboard achievement types box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_achievement_types_box() {

    $types = gamipress_get_achievement_types();
    $count = count( $types );

    if( $count === 0 ) : ?>

        <p><?php esc_html_e( 'Users can acquire achievements by completing the configured requirements. This reward often takes the form of "badges" or "stickers" that users can display on their profiles.', 'gamipress' ); ?></p>

        <br>

        <div class="center">
            <a href="<?php echo admin_url( 'post-new.php?post_type=achievement-type' ); ?>" class="button button-primary button-large"><?php esc_html_e( 'Create your first achievement type', 'gamipress' ); ?></a>
        </div>

    <?php else : ?>

        <div id="gamipress-registered-achievements" class="gamipress-registered-achievements">
            <ul>
                <?php foreach( $types as $slug => $args ) : ?>
                    <?php $type_count = wp_count_posts( $slug ); ?>
                    <li>
                        <a href="<?php echo admin_url( 'edit.php?post_type=' . $slug ); ?>">
                            <span><?php printf( _n( '%d ' . $args['singular_name'], '%d ' . $args['plural_name'], $type_count->publish ), $type_count->publish ); ?></span>
                            <span><?php printf( esc_html__( '%d Awarded', 'gamipress' ), gamipress_get_earnings_count( array( 'post_type' => $slug ) ) ); ?></span>
                            <span></span>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif;
}

/**
 * Dashboard rank types box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_rank_types_box() {

    $types = gamipress_get_rank_types();
    $count = count( $types );

    if( $count === 0 ) : ?>

        <p><?php esc_html_e( 'Similar to achievements, ranks are awarded when users complete certain tasks. However, in this case, the criteria must be met in a specific order.', 'gamipress' ); ?></p>

        <br>

        <div class="center">
            <a href="<?php echo admin_url( 'post-new.php?post_type=rank-type' ); ?>" class="button button-primary button-large"><?php esc_html_e( 'Create your first rank type', 'gamipress' ); ?></a>
        </div>

    <?php else : ?>

        <div id="gamipress-registered-ranks" class="gamipress-registered-ranks">
            <ul>
                <?php foreach( $types as $slug => $args ) : ?>
                    <?php $type_count = wp_count_posts( $slug ); ?>
                    <li>
                        <a href="<?php echo admin_url( 'edit.php?post_type=' . $slug ); ?>">
                            <span><?php printf( _n( '%d ' . $args['singular_name'], '%d ' . $args['plural_name'], $type_count->publish ), $type_count->publish ); ?></span>
                            <span><?php printf( esc_html__( '%d Awarded', 'gamipress' ), gamipress_get_earnings_count( array( 'post_type' => $slug ) ) ); ?></span>
                            <span></span>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif;

}


/**
 * Dashboard earnings box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_user_earnings_box() {
    // Setup table
    ct_setup_table( 'gamipress_user_earnings' );

    $query = new CT_Query( array(
        'orderby'        => 'date',
        'order'          => 'DESC',
        'items_per_page' => 5,
        'no_found_rows'  => true,
        'cache_results'  => false,
    ) );

    $user_earnings = $query->get_results();

    if ( count( $user_earnings ) > 0 ) {

        echo '<div id="gamipress-latest-earnings" class="gamipress-latest-earnings">';

        echo '<ul>';

        $today    = date( 'Y-m-d', current_time( 'timestamp' ) );
        $yesterday = date( 'Y-m-d', strtotime( '-1 day', current_time( 'timestamp' ) ) );

        foreach ( $user_earnings as $user_earning ) {

            $time = strtotime( $user_earning->date );

            if ( date( 'Y-m-d', $time ) === $today ) {
                $relative = __( 'Today', 'gamipress' );
            } elseif ( date( 'Y-m-d', $time ) === $yesterday ) {
                $relative = __( 'Yesterday', 'gamipress' );
            } elseif ( date( 'Y', $time ) !== date( 'Y', current_time( 'timestamp' ) ) ) {
                /* translators: date and time format for recent posts on the dashboard, from a different calendar year, see https://secure.php.net/date */
                $relative = date_i18n( __( 'M jS Y' ), $time );
            } else {
                /* translators: date and time format for recent posts on the dashboard, see https://secure.php.net/date */
                $relative = date_i18n( __( 'M jS' ), $time );
            }

            $user = get_userdata( $user_earning->user_id );

            $user_display_name = $user->display_name;

            if( current_user_can( 'edit_users' ) ) {
                $user_display_name = '<a href="' . get_edit_user_link( $user_earning->user_id ) . '">' . $user_display_name . '</a>';
            }

            $user_earning_title = '<strong>' . $user_earning->title . '</strong>';

            $date = sprintf( _x( '%1$s, %2$s', 'dashboard' ), $relative, mysql2date( get_option( 'time_format' ), $user_earning->date ) );

            // translators: %1$s: Username %2$s: Reward
            $label = sprintf( __( '%1$s got %2$s', 'gamipress' ),
                $user_display_name,
                $user_earning_title
            );

            echo '<li>' . $label . '<span>' . $date . '</span>' . '</li>';
        }

        echo '</ul>';
        echo '</div>';

    } else {
        echo '<p>' . __( 'Nothing to show :)', 'gamipress' ) .'</p>';
    }
}

/**
 * Dashboard welcome box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_videos_box() {
    ?>
    <div class="gamipress-dashboard-columns">

        <div class="gamipress-dashboard-column gamipress-dashboard-main-video">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/sinW2JjxsdA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <div class="gamipress-dashboard-column gamipress-dashboard-videos-list">
            <div class="gamipress-dashboard-videos">
                <?php
                $videos = array(
                    array(
                        'id' => '-UdktkgGfaU',
                        'title' => __( 'Creating a points type', 'gamipress' ),
                        'duration' => '2:14',
                    ),
                    array(
                        'id' => 'W52HxozyN5g',
                        'title' => __( 'Creating an achievement type', 'gamipress' ),
                        'duration' => '3:32',
                    ),
                    array(
                        'id' => 'oh3MFdAy_xc',
                        'title' => __( 'Creating a rank type', 'gamipress' ),
                        'duration' => '3:58',
                    ),
                    array(
                        'id' => 'JInrhMLQ7aw',
                        'title' => __( 'Unlock achievements and ranks by expending points', 'gamipress' ),
                        'duration' => '1:51',
                    ),
                    array(
                        'id' => 'IW9ZcGaWDBM',
                        'title' => __( 'Award your users through button clicks', 'gamipress' ),
                        'duration' => '1:48',
                    ),
                );

                foreach( $videos as $video ) { ?>
                    <div class="gamipress-dashboard-video">
                        <a href="https://www.youtube.com/watch?v=<?php echo $video['id']; ?>" target="_blank">
                            <div class="gamipress-dashboard-video-image">
                                <img src="https://img.youtube.com/vi/<?php echo $video['id']; ?>/default.jpg" alt="">
                            </div>
                            <div class="gamipress-dashboard-video-details">
                                <strong class="gamipress-dashboard-video-title"><?php echo $video['title']; ?></strong>
                                <div class="gamipress-dashboard-video-duration"><?php echo $video['duration']; ?></div>
                            </div>
                        </a>
                    </div>
                <?php }

                ?>
            </div>
            <div class="gamipress-dashboard-more-videos">
                <a href="https://www.youtube.com/channel/UC292zdjiKv6C2u3sBOdSNhg/videos" target="_blank"><?php esc_html_e( 'View all videos', 'gamipress' ); ?></a>
            </div>
        </div>

        <div class="gamipress-dashboard-column gamipress-dashboard-videos-list">
            <div class="gamipress-dashboard-videos">
                <?php
                $videos = array(
                    array(
                        'id' => 'BQFBHpGZkmw',
                        'title' => __( 'Manually update user points balance', 'gamipress' ),
                        'duration' => '0:43',
                    ),
                    array(
                        'id' => 'MDQGiK3CT0w',
                        'title' => __( 'Manually award or revoke user achievements', 'gamipress' ),
                        'duration' => '0:52',
                    ),
                    array(
                        'id' => '3_SZfSyE2_E',
                        'title' => __( 'Manually set user rank', 'gamipress' ),
                        'duration' => '0:47',
                    ),
                    array(
                        'id' => 'AG-f0Uv5_WM',
                        'title' => __( 'Award your users through YouTube videos', 'gamipress' ),
                        'duration' => '1:22',
                    ),
                    array(
                        'id' => 'pijaOYc9nLo',
                        'title' => __( 'Award your users through Vimeo videos', 'gamipress' ),
                        'duration' => '1:17',
                    ),
                );

                foreach( $videos as $video ) { ?>
                    <div class="gamipress-dashboard-video">
                        <a href="https://www.youtube.com/watch?v=<?php echo $video['id']; ?>" target="_blank">
                            <div class="gamipress-dashboard-video-image">
                                <img src="https://img.youtube.com/vi/<?php echo $video['id']; ?>/default.jpg" alt="">
                            </div>
                            <div class="gamipress-dashboard-video-details">
                                <strong class="gamipress-dashboard-video-title"><?php echo $video['title']; ?></strong>
                                <div class="gamipress-dashboard-video-duration"><?php echo $video['duration']; ?></div>
                            </div>
                        </a>
                    </div>
                <?php }

                ?>
            </div>
        </div>

    </div>
    <?php
}

/**
 * Dashboard plugin card
 *
 * @since  2.0.0
 */
function gamipress_dashboard_render_plugin_card( $plugin ) {

    $details_link = 'https://gamipress.com/add-ons/' . $plugin->info->slug;

    $action_label = ( gamipress_is_plugin_asset( $plugin ) ) ? esc_html__( 'Get this asset', 'gamipress' ) : esc_html__( 'Get this add-on', 'gamipress' );

    ?>

    <div class="gamipress-plugin-card plugin-card plugin-card-<?php echo sanitize_html_class( $plugin->info->slug ); ?>">

        <div class="plugin-card-top cmb-tooltip">

            <div class="thumbnail column-thumbnail">
                <a href="<?php echo esc_url( $details_link ); ?>" class="open-plugin-details-modal" target="_blank">
                    <img src="<?php echo esc_attr( $plugin->info->thumbnail ) ?>" class="plugin-thumbnail" alt="">
                </a>
            </div>

            <div class="name column-name">
                <h3>
                    <a href="<?php echo esc_url( $details_link ); ?>" class="open-plugin-details-modal" target="_blank">
                        <?php echo $plugin->info->title; ?>
                    </a>
                </h3>
            </div>

            <div class="desc column-description cmb-tooltip-desc cmb-tooltip-top">
                <p><?php echo gamipress_esc_plugin_excerpt( $plugin->info->excerpt ); ?></p>
            </div>

        </div>

    </div>

    <?php

}

/**
 * Dashboard add-ons section
 *
 * @since  2.0.0
 */
function gamipress_dashboard_add_ons_section() {

    $plugins = gamipress_plugins_api();

    if ( is_wp_error( $plugins ) ) {
        return;
    }

    $add_ons_to_display = array(
      'gamipress-leaderboards',
      'gamipress-notifications',
      'gamipress-referrals',
      'gamipress-progress',
      'gamipress-restrict-content',
      'gamipress-points-cards',
      'gamipress-birthdays',
    );

    $add_ons = array();

    foreach( $plugins as $plugin ) {

        if( in_array( $plugin->info->slug, $add_ons_to_display ) ) {
            $add_ons[] = $plugin;
        }

    }

    ?>

    <?php // Add-ons ?>
    <h1><?php echo esc_html_e( 'Add-ons', 'gamipress' ); ?></h1>
    <p class="gamipress-section-desc"><?php esc_html_e( 'Pro add-ons help to maintain GamiPress and offer the most advanced features.', 'gamipress' ); ?></p>

    <div id="normal-sortables" class="meta-box-sortables ui-sortable gamipress-dashboard-add-ons-section">
        <?php foreach( $add_ons as $add_on )
            gamipress_dashboard_render_plugin_card( $add_on ); ?>

        <div class="gamipress-dashboard-more-add-ons">
            <a href="<?php echo admin_url( 'admin.php?page=gamipress_add_ons' ); ?>" target="_blank"><?php esc_html_e( 'View all add-ons', 'gamipress' ); ?></a>
        </div>
    </div>

    <?php

}

/**
 * Dashboard assets section
 *
 * @since  2.0.0
 */
function gamipress_dashboard_assets_section() {

    $plugins = gamipress_plugins_api();

    if ( is_wp_error( $plugins ) ) {
        return;
    }

    $add_ons_to_display = array(
        'gradient-shields',
        'star-badges',
        'trophy-icons',
        'sticker-icons',
        'flat-badges',
        'learning-icons',
        'points-types-icons',
    );

    $add_ons = array();

    foreach( $plugins as $plugin ) {

        if( in_array( $plugin->info->slug, $add_ons_to_display ) ) {
            $add_ons[] = $plugin;
        }

    }

    ?>

    <?php // Add-ons ?>
    <h1><?php echo esc_html_e( 'Assets', 'gamipress' ); ?></h1>
    <p class="gamipress-section-desc"><?php esc_html_e( 'Resources to decorate your gamification elements and take their design to the next level!', 'gamipress' ); ?></p>

    <div id="normal-sortables" class="meta-box-sortables ui-sortable gamipress-dashboard-assets-section">
        <?php foreach( $add_ons as $add_on )
            gamipress_dashboard_render_plugin_card( $add_on ); ?>

        <div class="gamipress-dashboard-more-add-ons">
            <a href="<?php echo admin_url( 'admin.php?page=gamipress_assets' ); ?>" target="_blank"><?php esc_html_e( 'View all assets', 'gamipress' ); ?></a>
        </div>
    </div>

    <?php

}

/**
 * Dashboard getting started docs box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_getting_started_docs_box() {
    ?>
    <ul>
        <li><a href="https://gamipress.com/docs/getting-started/what-is-gamipress/" target="_blank"><?php esc_html_e( 'What is GamiPress?', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/glossary/" target="_blank"><?php esc_html_e( 'Glossary', 'gamipress' ); ?></a></li>
        <hr>
        <li><a href="https://gamipress.com/docs/getting-started/points-types/" target="_blank"><?php esc_html_e( 'Points Types', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/points-awards-and-deducts/" target="_blank"><?php esc_html_e( 'Points Awards and Deducts', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/manually-update-user-points-balance/" target="_blank"><?php esc_html_e( 'Manually update user points balance', 'gamipress' ); ?></a></li>
        <hr>
        <li><a href="https://gamipress.com/docs/getting-started/achievement-types/" target="_blank"><?php esc_html_e( 'Achievement Types', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/achievements/" target="_blank"><?php esc_html_e( 'Achievements', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/steps/" target="_blank"><?php esc_html_e( 'Steps', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/manually-award-or-revoke-user-achievements/" target="_blank"><?php esc_html_e( 'Manually award or revoke user achievements', 'gamipress' ); ?></a></li>
        <hr>
        <li><a href="https://gamipress.com/docs/getting-started/rank-types/" target="_blank"><?php esc_html_e( 'Rank Types', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/ranks/" target="_blank"><?php esc_html_e( 'Ranks', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/rank-requirements/" target="_blank"><?php esc_html_e( 'Rank Requirements', 'gamipress' ); ?></a></li><li><a href="https://gamipress.com/docs/getting-started/manually-set-user-rank/" target="_blank"><?php esc_html_e( 'Manually set user rank', 'gamipress' ); ?></a></li>
        <hr>
        <li><a href="https://gamipress.com/docs/getting-started/requirements-ui/" target="_blank"><?php esc_html_e( 'Requirements UI', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/events/" target="_blank"><?php esc_html_e( 'Events', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/getting-started/badge-builder/" target="_blank"><?php esc_html_e( 'Badge Builder', 'gamipress' ); ?></a></li>
    </ul>
    <?php
}

/**
 * Dashboard tutorials docs box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_tutorials_docs_box() {
    ?>
    <ul>
        <li><a href="https://gamipress.com/docs/tutorials/creating-a-points-type/" target="_blank"><?php esc_html_e( 'Creating a Points Type', 'gamiress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/tutorials/creating-an-achievement-type/" target="_blank"><?php esc_html_e( 'Creating an Achievement Type', 'gamiress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/tutorials/creating-a-rank-type/" target="_blank"><?php esc_html_e( 'Creating a Rank Type', 'gamiress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/tutorials/unlock-achievements-and-ranks-by-expending-points/" target="_blank"><?php esc_html_e( 'Unlock achievements and ranks by expending points', 'gamiress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/tutorials/how-the-awards-engine-works/" target="_blank"><?php esc_html_e( 'How the awards engine works', 'gamiress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/tutorials/create-your-custom-badges-images/" target="_blank"><?php esc_html_e( 'Create your custom badges images', 'gamiress' ); ?></a></li>
    </ul>
    <?php
}

/**
 * Dashboard advanced docs box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_advanced_docs_box() {
    ?>
    <ul>
        <li><a href="https://gamipress.com/docs/advanced/template-files/" target="_blank"><?php esc_html_e( 'Template Files', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/advanced/gdpr-compliance/" target="_blank"><?php esc_html_e( 'GDPR Compliance', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/advanced/multisite/" target="_blank"><?php esc_html_e( 'Multisite', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/advanced/rest-api/" target="_blank"><?php esc_html_e( 'Rest API', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/advanced/date-fields/" target="_blank"><?php esc_html_e( 'Date Fields', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/advanced/database-performance/" target="_blank"><?php esc_html_e( 'Database Performance', 'gamipress' ); ?></a></li>
    </ul>
    <?php
}

/**
 * Dashboard support box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_support_box() {
    ?>
    <ul>
        <li><a href="https://gamipress.com/contact-us/" target="_blank"><?php esc_html_e( 'Contact us', 'gamipress' ); ?></a></li>
        <li><a href="https://wordpress.org/support/plugin/gamipress" target="_blank"><?php esc_html_e( 'Support Forums', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/faq/" target="_blank"><?php esc_html_e( 'FAQ', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/docs/troubleshooting/" target="_blank"><?php esc_html_e( 'Troubleshooting', 'gamipress' ); ?></a></li>
        <li><a href="https://gamipress.com/feature-requests/" target="_blank"><?php esc_html_e( 'Feature Requests', 'gamipress' ); ?></a></li>
    </ul>
    <?php
}

/**
 * Dashboard blocks box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_blocks_box() {
    $shortcodes = array(
        'achievement' => __( 'Single Achievement', 'gamipress' ),
        'achievements' => __( 'Achievements', 'gamipress' ),
        'last_achievements_earned' => __( 'Last Achievements Earned', 'gamipress' ),
        'user_points' => __( 'User Points', 'gamipress' ),
        'site_points' => __( 'Site Points', 'gamipress' ),
        'points_types' => __( 'Points Types', 'gamipress' ),
        'rank' => __( 'Single Rank', 'gamipress' ),
        'ranks' => __( 'Ranks', 'gamipress' ),
        'user_rank' => __( 'User Rank', 'gamipress' ),
        'inline_achievement' => __( 'Inline Achievement', 'gamipress' ),
        'inline_last_achievements_earned' => __( 'Inline Last Achievements Earned', 'gamipress' ),
        'inline_rank' => __( 'Inline Rank', 'gamipress' ),
        'inline_user_rank' => __( 'Inline User Rank', 'gamipress' ),
        'logs' => __( 'Logs', 'gamipress' ),
        'user_earnings' => __( 'User Earnings', 'gamipress' ),
        'email_settings' => __( 'Email Settings', 'gamipress' ),
    );
    ?>
    <ul class="gamipress-dashboard-blocks-list">
        <?php foreach( $shortcodes as $slug => $label ) : ?>
            <li><?php echo $label; ?>: <span>
                    <a href="https://gamipress.com/docs/blocks/<?php echo str_replace( '_', '-', $slug ); ?>/" target="_blank"><?php esc_html_e( 'Block', 'gamipress' ); ?></a>
                    | <a href="https://gamipress.com/docs/shortcodes/gamipress_<?php echo $slug; ?>/" target="_blank"><?php esc_html_e( 'Shortcode', 'gamipress' ); ?></a>
                    | <a href="https://gamipress.com/docs/widgets/<?php echo str_replace( '_', '-', $slug ); ?>/" target="_blank"><?php esc_html_e( 'Widget', 'gamipress' ); ?></a>
                </span></li>
        <?php endforeach; ?>
    </ul>
    <?php
}

/**
 * Dashboard plugins box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_plugins_box() {
    $url = GAMIPRESS_URL . 'assets/img/logos/';
    ?>
    <ul id="our-plugins-list" class="our-plugins-list">
        <li>
            <a href="https://wordpress.org/plugins/gamipress/" target="_blank">
                <img src="<?php echo esc_attr( $url . 'gamipress.svg' ); ?>" class="our-plugins-img our-plugins-gamipress" loading="lazy">
                <span>GamiPress</span>
            </a>
        </li>
        <li>
            <a href="https://wordpress.org/plugins/automatorwp/" target="_blank">
                <img src="<?php echo esc_attr( $url . 'automatorwp.svg' ); ?>" class="our-plugins-img our-plugins-automatorwp" loading="lazy">
                <span>AutomatorWP</span>
            </a>
        </li>
        <li>
            <a href="https://wordpress.org/plugins/shortlinkspro/" target="_blank">
                <img src="<?php echo esc_attr( $url . 'shortlinkspro.svg' ); ?>" class="our-plugins-img our-plugins-shortlinkspro" loading="lazy">
                <span>ShortLinks Pro</span>
            </a>
        </li>
        <li>
            <a href="https://wordpress.org/plugins/bbforms/" target="_blank">
                <img src="<?php echo esc_attr( $url . 'bbforms.svg' ); ?>" class="our-plugins-img our-plugins-bbforms" loading="lazy">
                <span>BBForms</span>
            </a>
        </li>
    </ul>
    <?php
}

/**
 * Dashboard team box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_team_box() {
    ?>
    <ul id="contributors-list" class="contributors-list">
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://profiles.wordpress.org/rubengc/" target="_blank">
                <img src="https://secure.gravatar.com/avatar/103d0ec19ade3804009f105974fd4d05?s=64&amp;d=mm&amp;r=g" class="avatar avatar-32 photo" loading="lazy">
                <span class="cmb-tooltip-desc cmb-tooltip-top center">Ruben Garcia</span>
            </a>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://profiles.wordpress.org/eneribs/" target="_blank">
                <img src="https://secure.gravatar.com/avatar/7103ea44d40111ab67a22efe7ebd6f71?s=64&amp;d=mm&amp;r=g" class="avatar avatar-32 photo" loading="lazy">
                <span class="cmb-tooltip-desc cmb-tooltip-top center">Irene Berna</span>
            </a>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://profiles.wordpress.org/dioni00/" target="_blank">
                <img src="https://secure.gravatar.com/avatar/6de68ad3863fdf3c92a194ba16546571?s=64&amp;d=mm&amp;r=g" class="avatar avatar-32 photo" loading="lazy">
                <span class="cmb-tooltip-desc cmb-tooltip-top center">Dionisio Sanchez</span>
            </a>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://profiles.wordpress.org/tinocalvo/" target="_blank">
                <img src="https://secure.gravatar.com/avatar/a438aa12efcfb007f3db145d6ad37def?s=64&amp;d=retro&amp;r=g" class="avatar avatar-32 photo" loading="lazy">
                <span class="cmb-tooltip-desc cmb-tooltip-top center">Tino Calvo</span>
            </a>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://profiles.wordpress.org/pacogon/" target="_blank">
                <img src="https://secure.gravatar.com/avatar/348f374779e7433ad6bf3930cb2a492e?s=64&amp;d=mm&amp;r=g" class="avatar avatar-32 photo" loading="lazy">
                <span class="cmb-tooltip-desc cmb-tooltip-top center">Paco González</span>
            </a>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://profiles.wordpress.org/flabernardez/" target="_blank">
                <img src="https://secure.gravatar.com/avatar/fd626d9a8463260894f0f6f07a5cc71a?s=64&amp;d=mm&amp;r=g" class="avatar avatar-32 photo" loading="lazy">
                <span class="cmb-tooltip-desc cmb-tooltip-top center">Flavia Bernardez</span>
            </a>
        </li>
    </ul>
    <?php
}

/**
 * Dashboard social box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_social_box() {
    ?>
    <ul class="gamipress-dashboard-social-list">
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://www.youtube.com/channel/UC292zdjiKv6C2u3sBOdSNhg" target="_blank"><i class="dashicons dashicons-youtube"></i></a>
            <span class="cmb-tooltip-desc cmb-tooltip-top center"><?php esc_html_e( 'Subscribe to our YouTube channel', 'gamipress' ); ?></span>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://www.facebook.com/GamiPress/" target="_blank"><i class="dashicons dashicons-facebook-alt"></i></a>
            <span class="cmb-tooltip-desc cmb-tooltip-top center"><?php esc_html_e( 'Follow us on Facebook', 'gamipress' ); ?></span>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://www.facebook.com/groups/gamipress" target="_blank"><i class="dashicons dashicons-groups"></i></a>
            <span class="cmb-tooltip-desc cmb-tooltip-top center"><?php esc_html_e( 'Join our Facebook community', 'gamipress' ); ?></span>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://twitter.com/GamiPress" target="_blank"><i class="dashicons dashicons-twitter"></i></a>
            <span class="cmb-tooltip-desc cmb-tooltip-top center"><?php esc_html_e( 'Follow @GamiPress on Twitter', 'gamipress' ); ?></span>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://www.linkedin.com/company/28389774/" target="_blank"><i class="dashicons dashicons-linkedin"></i></a>
            <span class="cmb-tooltip-desc cmb-tooltip-top center"><?php esc_html_e( 'Follow us on LinkedIn', 'gamipress' ); ?></span>
        </li>
    </ul>

    <h3><?php esc_html_e( 'Contact us', 'gamipress' ); ?></h3>
    <ul class="gamipress-dashboard-social-list">
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://wordpress.org/support/plugin/gamipress/" target="_blank"><i class="dashicons dashicons-wordpress"></i></a>
            <span class="cmb-tooltip-desc cmb-tooltip-top center"><?php esc_html_e( 'Support Forums', 'gamipress' ); ?></span>
        </li>
        <li class="cmb-tooltip cmb-tooltip-no-opacity">
            <a href="https://gamipress.com/contact-us/" target="_blank"><i class="dashicons dashicons-email-alt"></i></a>
            <span class="cmb-tooltip-desc cmb-tooltip-top center"><?php esc_html_e( 'Open a support ticket', 'gamipress' ); ?></span>
        </li>
    </ul>
    <?php
}

/**
 * Dashboard involved box
 *
 * @since  2.0.0
 */
function gamipress_dashboard_involved_box() {
    ?>
    <p><?php esc_html_e( 'GamiPress is a free and open-source plugin accessible to everyone just like WordPress. There are many ways you can help support GamiPress', 'gamipress' ); ?></p>
    <ul>
        <li><a href="https://translate.wordpress.org/projects/wp-plugins/gamipress/" target="_blank"><i class="dashicons dashicons-translation"></i> <?php esc_html_e( 'Translate GamiPress into your language.', 'gamipress' ); ?></a></li>
        <li><a href="https://wordpress.org/plugins/gamipress/#reviews" target="_blank"><i class="dashicons dashicons-wordpress"></i> <?php esc_html_e( 'Review GamiPress on WordPress.org.', 'gamipress' ); ?></a></li>
    </ul>
    <?php
}