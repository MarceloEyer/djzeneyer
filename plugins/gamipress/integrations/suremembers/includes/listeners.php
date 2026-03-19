<?php
/**
 * Listeners
 *
 * @package GamiPress\SureMembers\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// User added to an access group listener
function gamipress_suremembers_user_added_to_access_group( $user_id, $access_group_ids ) {

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger user added to a group
    do_action( 'gamipress_suremembers_user_added_to_access_group', $user_id, $access_group_ids );

    if( is_array( $access_group_ids ) ) {
        
        // Trigger events same times as group quantity
        foreach ( $access_group_ids as $key => $group_id ) {
            
            // Trigger user added to a group
            do_action( 'gamipress_suremembers_user_added_to_any_access_group', $user_id, $group_id );
    
            // Trigger user added to a specific group
            do_action( 'gamipress_suremembers_user_added_to_specific_access_group', $user_id, $group_id );
        }

    }

}
add_action( 'suremembers_after_access_grant', 'gamipress_suremembers_user_added_to_access_group', 10, 2 );

// User removed from an access group listener
function gamipress_suremembers_user_removed_from_access_group( $user_id, $access_group_ids ) {

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger make new purchase
    do_action( 'gamipress_suremembers_user_removed_from_access_group', $user_id, $access_group_ids );

    if( is_array( $access_group_ids ) ) {
        
        // Trigger events same times as group quantity
        foreach ( $access_group_ids as $key => $group_id ) {
            
            // Trigger new product purchase
            do_action( 'gamipress_suremembers_user_removed_from_any_access_group', $user_id, $group_id );
    
            // Trigger specific product purchase
            do_action( 'gamipress_suremembers_user_removed_from_specific_access_group', $user_id, $group_id );
        }

    }

}
add_action( 'suremembers_after_access_revoke', 'gamipress_suremembers_user_removed_from_access_group', 10, 2 );