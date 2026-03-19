<?php
/**
 * Functions
 *
 * @package GamiPress\Pretty-Link\Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_pretty_link_ajax_get_posts() {

    global $wpdb;

    if( isset( $_REQUEST['post_type'] ) && in_array( 'pretty-link', $_REQUEST['post_type'] ) ) {

        $links = array();
        $linksController = new PrliLocalApiController();
        $all_links = $linksController->get_all_links();
    
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
        
                // Check if plugin is active on this site
                if( function_exists( 'prli_plugin_info' ) ) {

                    foreach( $all_links as $link ) {
            
                        // Results should meet the same structure like posts
                        $results[] = array(
                            'id' => $link['id'],
                            'post_title' => $link['name'],
                            'site_id' => $site_id,
                            'site_name' => $site_name
                        );
                    }
        
                }
        
                // Restore current site
                restore_current_blog();
    
            }
    
        } else {

            foreach( $all_links as $link ) {
                $results[] = array(
                    'id' => $link['id'],
                    'text' => $link['name'],
                );
            }

        }

        // Return our results
        wp_send_json_success( $results );

        die;

    }


}
add_action( 'wp_ajax_gamipress_get_posts', 'gamipress_pretty_link_ajax_get_posts', 5 );