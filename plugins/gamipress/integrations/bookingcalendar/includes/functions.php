<?php
/**
 * Functions
 *
 * @package GamiPress\BookingCalendar\Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_bookingcalendar_ajax_get_posts() {

    global $wpdb;

    if( isset( $_REQUEST['post_type'] ) && in_array( 'booking', $_REQUEST['post_type'] ) ) {

        // Pull back the search string
        $search = isset( $_REQUEST['q'] ) ? $wpdb->esc_like( $_REQUEST['q'] ) : '';
        $results = array();

        if( gamipress_is_network_wide_active() ) {

            // Look for results on all sites on a multisite install
            foreach( gamipress_get_network_site_ids() as $site_id ) {
                
                // Switch to site
                switch_to_blog( $site_id );

                // Get the current site name to append it to results
                $site_name = get_bloginfo( 'name' );

                if( class_exists( 'Booking_Calendar' ) ) {

                    // Get the bookings
                    $site_bookings = $wpdb->get_results( $wpdb->prepare(
                        "SELECT booking_id, sort_date FROM {$wpdb->prefix}booking WHERE  booking_id LIKE %s",
                        "%{$search}%"
                    ) );

                    foreach ( $site_bookings as $booking ) {

                        // Results should meet same structure like posts
                        $results[] = array(
                            'ID' => $booking->booking_id,
                            'post_title' => 'Booking ' . $booking->booking_id . ': ' . $booking->sort_date,
                            'site_id' => $site_id,
                            'site_name' => $site_name,
                        );
                    }
                }

                // Restore current site
                restore_current_blog();

            }

        }else {
            // Get the bookings
            $site_bookings = $wpdb->get_results( $wpdb->prepare(
                "SELECT booking_id, sort_date FROM {$wpdb->prefix}booking WHERE  booking_id LIKE %s",
                "%{$search}%"
            ) );

            foreach( $site_bookings as $booking ) {
                $results[] = array(
                    'id' => $booking->booking_id,
                    'text' => 'Booking ' . $booking->booking_id . ': ' . $booking->sort_date,
                );
            }

        }

            // Return our results
            wp_send_json_success( $results );
            die;
    }

}
add_action( 'wp_ajax_gamipress_get_posts', 'gamipress_bookingcalendar_ajax_get_posts', 5 );