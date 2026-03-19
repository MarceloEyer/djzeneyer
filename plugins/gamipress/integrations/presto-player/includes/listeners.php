<?php
/**
 * Listeners
 *
 * @package GamiPress\Presto_Player\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Video progress listener
 *
 * @since 1.0.0
 *
 * @param int $video_id
 * @param int $percent
 */
function gamipress_presto_player_progress_listener( $video_id, $percent ) {

    $user_id = get_current_user_id();

    // Bail if user is not logged in
    if( $user_id === 0 ) {
        return;
    }

    // Trigger event for watch a min of a video
    do_action( 'gamipress_presto_player_watch_video_min_percent', $video_id, $user_id, $percent );
    
    // Trigger event for watch a min of a specific video
    do_action( 'gamipress_presto_player_watch_specific_video_min_percent', $video_id, $user_id, $percent );

    // Trigger event for watch a percent between of a video
    do_action( 'gamipress_presto_player_watch_video_between_percent', $video_id, $user_id, $percent );

    // Trigger event for watch a percent between of a specific video
    do_action( 'gamipress_presto_player_watch_specific_video_between_percent', $video_id, $user_id, $percent );

    // User fully watched the video
    if( $percent >= 100 ) {
        // Trigger event for watch a video
        do_action( 'gamipress_presto_player_watch_video', $video_id, $user_id, $percent );

        // Trigger event for watch a specific video
        do_action( 'gamipress_presto_player_watch_specific_video', $video_id, $user_id, $percent );

        // Get the platform
        $model = new \PrestoPlayer\Models\Video();
        $video = $model->get( $video_id );
        $platform = $video->__get( 'type' );

        // Trigger event for watch a video from a specific platform
        do_action( 'gamipress_presto_player_watch_video_platform', $video_id, $user_id, $percent, $platform );
    }

}
add_action( 'presto_player_progress', 'gamipress_presto_player_progress_listener', 10, 2 );

