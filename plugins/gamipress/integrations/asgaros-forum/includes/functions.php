<?php
/**
 * Functions
 *
 * @package GamiPress\Asgaros_Forum\Functions
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_asgaros_forum_ajax_get_posts() {
    // Security check, forces to die if not security passed
    check_ajax_referer( 'gamipress_admin', 'nonce' );
    global $wpdb;

    $results = array();

    // Pull back the search string
    $search = isset( $_REQUEST['q'] ) ? sanitize_text_field( $_REQUEST['q'] ) : '';
    $search = $wpdb->esc_like( $search );

    if( isset( $_REQUEST['post_type'] ) && in_array( 'asgaros_forum', $_REQUEST['post_type'] ) ) {

        // Get the forums
        $forums = $wpdb->get_results( $wpdb->prepare(
            "SELECT a.id, a.name
            FROM {$wpdb->prefix}forum_forums AS a
            WHERE a.name LIKE %s",
            "%%{$search}%%"
        ) );

        foreach ( $forums as $forum ) {

            // Results should meet same structure like posts
            $results[] = array(
                'ID'            => $forum->id,
                'post_title'    => $forum->name,
            );

        }

        // Return our results
        wp_send_json_success( $results );
        die;

    } else if( isset( $_REQUEST['post_type'] ) && in_array( 'asgaros_topic', $_REQUEST['post_type'] ) ) {

        // Get the topics
        $topics = $wpdb->get_results( $wpdb->prepare(
            "SELECT a.id, a.name, a.parent_id
            FROM {$wpdb->prefix}forum_topics AS a
            WHERE a.name LIKE %s",
            "%%{$search}%%"
        ) );

        foreach ( $topics as $topic ) {

            // Results should meet same structure like posts
            $results[] = array(
                'ID'            => $topic->id,
                'post_title'    => $topic->name,
                'post_type' => gamipress_asgaros_forum_get_forum_title( $topic->parent_id ),
            );

        }

        $response = array(
            'results' => $results,
            'more_results' => false,
        );

        // Return our results
        wp_send_json_success( $results );
        die;
    }

}
add_action( 'wp_ajax_gamipress_asgaros_forum_get_posts', 'gamipress_asgaros_forum_ajax_get_posts', 5 );


function gamipress_asgaros_forum_forum_options(){

}

// Helper function to get the forum title
function gamipress_asgaros_forum_get_forum_title( $forum_id ) {

    global $wpdb;

    // Empty title if no ID provided
    if( absint( $forum_id ) === 0 ) {
        return '';
    }

    $forum_name = $wpdb->get_var( $wpdb->prepare(
        "SELECT name FROM {$wpdb->prefix}forum_forums WHERE id=%d",
        $forum_id ) );

    return $forum_name;  

}

// Helper function to get the topic title
function gamipress_asgaros_forum_get_topic_title( $topic_id ) {

    global $wpdb;

    // Empty title if no ID provided
    if( absint( $topic_id ) === 0 ) {
        return '';
    }

    $topic_name = $wpdb->get_var( $wpdb->prepare(
        "SELECT name FROM {$wpdb->prefix}forum_topics WHERE id=%d",
        $topic_id ) );

    return $topic_name;    

}

/**
 * Get forum by topic
 *
 * @since 1.0.0
 *
 * @return int|false
 */
function gamipress_asgaros_forum_get_forum_by_topic( $topic_id ) {

    global $wpdb;
    // Empty if no ID provided
    if( absint( $topic_id ) === 0 ) {
        return '';
    }

    $forum_id = $wpdb->get_var( $wpdb->prepare(
            "SELECT parent_id FROM {$wpdb->prefix}forum_topics WHERE id=%d",
            $topic_id ) );

    return $forum_id;

}

/**
 * Get topic and forum by post
 *
 * @since 1.0.0
 *
 * @return int|false
 */
function gamipress_asgaros_forum_get_topic_and_forum_by_post( $post_id ) {

    global $wpdb;
    // Empty if no ID provided
    if( absint( $post_id ) === 0 ) {
        return '';
    }

    $data_post = array();

    $results = $wpdb->get_results( $wpdb->prepare(
            "SELECT parent_id, forum_id FROM {$wpdb->prefix}forum_posts WHERE id=%d",
            $post_id ) );

    foreach ( $results as $result ){   

        $data_post[] = array(
            'topic_id'  => $result->parent_id,
            'forum_id'  => $result->forum_id,
        );         

    }

    return $data_post;

}

/**
 * Get post author
 *
 * @since 1.0.0
 *
 * @return int|false
 */
function gamipress_asgaros_forum_get_post_author( $post_id ) {

    global $wpdb;
    // Empty if no ID provided
    if( absint( $post_id ) === 0 ) {
        return '';
    }

    $author_id = $wpdb->get_var( $wpdb->prepare(
            "SELECT author_id FROM {$wpdb->prefix}forum_posts WHERE id=%d",
            $post_id ) );

    return $author_id;

}

/**
 * Get topic author
 *
 * @since 1.0.0
 *
 * @return int|false
 */
function gamipress_asgaros_forum_get_topic_author( $topic_id ) {

    global $wpdb;
    // Empty if no ID provided
    if( absint( $topic_id ) === 0 ) {
        return '';
    }

    $author_id = $wpdb->get_var( $wpdb->prepare(
            "SELECT author_id FROM {$wpdb->prefix}forum_topics WHERE id=%d",
            $topic_id ) );

    return $author_id;

}