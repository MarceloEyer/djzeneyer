<?php
/**
 * Functions
 *
 * @package GamiPress\FluentBooking\Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_fluentbooking_ajax_get_posts() {

    global $wpdb;

    $results = array();

    // Pull back the search string
    $search = isset( $_REQUEST['q'] ) ? sanitize_text_field( $_REQUEST['q'] ) : '';
    $search = $wpdb->esc_like( $search );

    if( isset( $_REQUEST['post_type'] ) && in_array( 'single_meeting', $_REQUEST['post_type'] ) ) {

        // Get the single calendars
        $calendars = FluentBooking\App\Models\CalendarSlot::where( 'event_type', 'single' )->get();

        foreach ( $calendars as $calendar ) {

            if( ! empty( $search ) ) {
                if( strpos( strtolower( $calendar->title ), strtolower( $search ) ) === false ) {
                    continue;
                }
            }

            // Results should meet same structure like posts
            $results[] = array(
                'ID' => $calendar->id,
                'post_title' => $calendar->title,
            );

        }

        // Return our results
        wp_send_json_success( $results );
        die;

    } else if( isset( $_REQUEST['post_type'] ) && in_array( 'team_meeting', $_REQUEST['post_type'] ) ) {

        // Get the team calendars
        $calendars = FluentBooking\App\Models\CalendarSlot::whereIn( 'event_type', ['collective', 'round_robin'] )->get();

        foreach ( $calendars as $calendar ) {

            if( ! empty( $search ) ) {
                if( strpos( strtolower( $calendar->title ), strtolower( $search ) ) === false ) {
                    continue;
                }
            }

            // Results should meet same structure like posts
            $results[] = array(
                'ID' => $calendar->id,
                'post_title' => $calendar->title,
            );

        }

        // Return our results
        wp_send_json_success( $results );
        die;
    } else if( isset( $_REQUEST['post_type'] ) && in_array( 'hosts', $_REQUEST['post_type'] ) ) {

        // Get the meeting hosts
        $hosts = FluentBooking\App\Models\Calendar::where( 'type', '!=', 'team' )->get();

        foreach ( $hosts as $host ) {

            if( ! empty( $search ) ) {
                if( strpos( strtolower( $host->title ), strtolower( $search ) ) === false ) {
                    continue;
                }
            }

            // Results should meet same structure like posts
            $results[] = array(
                'ID' => $host->user_id,
                'post_title' => $host->title,
            );

        }

        // Return our results
        wp_send_json_success( $results );
        die;
    }

}
add_action( 'wp_ajax_gamipress_get_posts', 'gamipress_fluentbooking_ajax_get_posts', 5 );

/**
 * Get the meeting title
 *
 * @since 1.0.0
 *
 * @param int   $event_id   ID meeting event
 * 
 * @return string
 * 
 */
function gamipress_fluentbooking_get_meeting_title( $event_id ) {

    // Empty title if no ID provided
    if( absint( $event_id ) === 0 ) {
        return '';
    }

    $result = FluentBooking\App\Models\CalendarSlot::where( 'id', $event_id )->get();
    
    foreach ( $result as $event ){   
        $event_title = $event->title;
    }

    return $event_title;

}

/**
 * Get the host title
 *
 * @since 1.0.0
 *
 * @param int   $host_id   ID host
 * 
 * @return string
 * 
 */
function gamipress_fluentbooking_get_host_title( $host_id ) {

    // Empty title if no ID provided
    if( absint( $host_id ) === 0 ) {
        return '';
    }

    $result = FluentBooking\App\Models\Calendar::where( 'type', '!=', 'team' )->where( 'user_id', $host_id )->get();
    
    foreach ( $result as $host ){   
        $host_title = $host->title;
    }

    return $host_title;

}

