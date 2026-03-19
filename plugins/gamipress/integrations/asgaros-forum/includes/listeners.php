<?php
/**
 * Listeners
 *
 * @package GamiPress\Asgaros_Forum\Listeners
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * New post listener
 *
 * @param int $post_id
 * @param int $topic_id
 * @param string $subject
 * @param string $content
 * @param string $link
 * @param int $author_id
 */
function gamipress_asgaros_forum_new_post( $post_id, $topic_id, $subject, $content, $link, $author_id ) {

    // To get topic parent
    $forum_id = gamipress_asgaros_forum_get_forum_by_topic( $topic_id );

    // Trigger reply a topic
    do_action( 'gamipress_asgaros_forum_new_post', $post_id, $author_id, $topic_id, $forum_id );

    // Trigger reply a specific topic
    do_action( 'gamipress_asgaros_forum_specific_topic_new_post', $post_id, $author_id, $topic_id, $forum_id );

    // Trigger reply a topic on specific forum
    do_action( 'gamipress_asgaros_forum_specific_forum_new_post', $post_id, $author_id, $topic_id, $forum_id );

}
add_action( 'asgarosforum_after_add_post_submit', 'gamipress_asgaros_forum_new_post', 10, 6 );

/**
 * Delete post listener
 *
 * @param array $post
 */
function gamipress_asgaros_forum_delete_post( $post_id ) {

    $data_post = gamipress_asgaros_forum_get_topic_and_forum_by_post( $post_id );
    
    foreach ( $data_post as $data ) {
        $topic_id = $data['topic_id'];
        $forum_id = $data['forum_id'];
    }

    // Get author post
    $author_id = gamipress_asgaros_forum_get_post_author( $post_id );

    // Trigger delete post
    do_action( 'gamipress_asgaros_forum_delete_post', $post_id, $author_id, $topic_id, $forum_id );

}
add_action( 'asgarosforum_before_delete_post', 'gamipress_asgaros_forum_delete_post' );

/**
 * New topic listener
 *
 * @param int $post_id
 * @param int $topic_id
 * @param string $subject
 * @param string $content
 * @param string $link
 * @param int $author_id
 */
function gamipress_asgaros_forum_new_topic( $post_id, $topic_id, $subject, $content, $link, $author_id ) {

    // To get topic parent
    $forum_id = gamipress_asgaros_forum_get_forum_by_topic( $topic_id );

    // Trigger new topic
    do_action( 'gamipress_asgaros_forum_new_topic', $topic_id, $author_id, $forum_id );

    // Trigger new topic on specific forum
    do_action( 'gamipress_asgaros_forum_specific_forum_new_topic', $topic_id, $author_id, $forum_id );

}
add_action( 'asgarosforum_after_add_topic_submit', 'gamipress_asgaros_forum_new_topic', 10, 6 );

/**
 * Delete topic listener
 *
 * @param int $topic_id
 */
function gamipress_asgaros_forum_delete_topic( $topic_id ) {

    // To get topic parent
    $forum_id = gamipress_asgaros_forum_get_forum_by_topic( $topic_id );

    // to get topic author
    $author_id = gamipress_asgaros_forum_get_topic_author( $topic_id );

    // Trigger delete topic
    do_action( 'gamipress_asgaros_forum_delete_topic', $topic_id, $author_id, $forum_id );

}
add_action( 'asgarosforum_before_delete_topic', 'gamipress_asgaros_forum_delete_topic' );

/**
 * Like post listener
 *
 * @param int $post_id
 * @param int $user_id
 * @param array $reaction
 */
function gamipress_asgaros_forum_like( $post_id, $user_id, $reaction ) {

    // Bail if no like
    if ( $reaction !== 'up' )
        return;

    $data_post = gamipress_asgaros_forum_get_topic_and_forum_by_post( $post_id );
    
    foreach ( $data_post as $data ) {
        $topic_id = $data['topic_id'];
        $forum_id = $data['forum_id'];
    }

    // Get author post
    $author_id = gamipress_asgaros_forum_get_post_author( $post_id );

    if ( $reaction === 'up' ) {
        // Trigger like a post
        do_action( 'gamipress_asgaros_forum_like_post', $post_id, $user_id, $topic_id, $forum_id );

        // Trigger like a post on specific topic
        do_action( 'gamipress_asgaros_forum_specific_topic_like_post', $post_id, $user_id, $topic_id, $forum_id );

        // Trigger like a post on specific forum
        do_action( 'gamipress_asgaros_forum_specific_forum_like_post', $post_id, $user_id, $topic_id, $forum_id );

        // Trigger get a like on a post
        do_action( 'gamipress_asgaros_forum_user_like_post', $post_id, $author_id, $topic_id, $forum_id, $user_id );
    }

    if ( $reaction === 'down' ) {
        // Trigger dislike a post
        do_action( 'gamipress_asgaros_forum_dislike_post', $post_id, $user_id, $topic_id, $forum_id );

        // Trigger dislike a post on specific topic
        do_action( 'gamipress_asgaros_forum_specific_topic_dislike_post', $post_id, $user_id, $topic_id, $forum_id );

        // Trigger dislike a post on specific forum
        do_action( 'gamipress_asgaros_forum_specific_forum_dislike_post', $post_id, $user_id, $topic_id, $forum_id );

        // Trigger get a dislike on a post
        do_action( 'gamipress_asgaros_forum_user_dislike_post', $post_id, $author_id, $topic_id, $forum_id, $user_id );
    }
    
}
add_action( 'asgarosforum_after_add_reaction', 'gamipress_asgaros_forum_like', 10, 3 );
