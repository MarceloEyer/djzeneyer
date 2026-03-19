<?php
/**
 * Listeners
 *
 * @package GamiPress\Pretty-Link\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Redirection listener
 *
 * @since 1.0.0
 *
 * @param array $arrayInfo
 */
function gamipress_pretty_link_submission_listener( $arrayInfo ) {
    
    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }
    
    $link_id = $arrayInfo['link_id'];
    $click_id = $arrayInfo['click_id'];
    $url = $arrayInfo['url'];

    // Trigger event for clicking a pretty link
    do_action( 'gamipress_pretty_link_redirection', $link_id, $url, $user_id );

    // Trigger event for clicking a specific pretty link
    do_action( 'gamipress_pretty_link_specific_redirection', $link_id, $url, $user_id );
}
add_action( 'prli_record_click', 'gamipress_pretty_link_submission_listener', 10, 1 );