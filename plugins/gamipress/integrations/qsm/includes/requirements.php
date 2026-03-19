<?php
/**
 * Requirements
 *
 * @package GamiPress\QSM\Requirements
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Add the points field to the requirement object
 *
 * @param $requirement
 * @param $requirement_id
 *
 * @return array
 */
function gamipress_qsm_requirement_object( $requirement, $requirement_id ) {

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_qsm_complete_quiz_points'
            || $requirement['trigger_type'] === 'gamipress_qsm_complete_specific_quiz_points'
            || $requirement['trigger_type'] === 'gamipress_qsm_complete_quiz_max_points'
            || $requirement['trigger_type'] === 'gamipress_qsm_complete_specific_quiz_max_points' ) ) {

        // Minimum/Maximum points
        $requirement['qsm_points'] = get_post_meta( $requirement_id, '_gamipress_qsm_points', true );

    }

    if( isset( $requirement['trigger_type'] )
    && ( $requirement['trigger_type'] === 'gamipress_qsm_complete_quiz_between_points'
        || $requirement['trigger_type'] === 'gamipress_qsm_complete_specifc_quiz_between_points' ) ) {

            // Between points
            $requirement['qsm_min_points'] = get_post_meta( $requirement_id, '_gamipress_qsm_min_points', true );
            $requirement['qsm_max_points'] = get_post_meta( $requirement_id, '_gamipress_qsm_max_points', true );
    
    }

    return $requirement;

}
add_filter( 'gamipress_requirement_object', 'gamipress_qsm_requirement_object', 10, 2 );

/**
 * Category field on requirements UI
 *
 * @param $requirement_id
 * @param $post_id
 */
function gamipress_qsm_requirement_ui_fields( $requirement_id, $post_id ) {

    $points = absint( get_post_meta( $requirement_id, '_gamipress_qsm_points', true ) );
    $min_points = get_post_meta( $requirement_id, 'gamipress_qsm_min_points', true );
    $max_points = get_post_meta( $requirement_id, 'gamipress_qsm_max_points', true );
    ?>

    <span class="qsm-quiz-points"><input type="text" value="<?php echo $points; ?>" size="3" maxlength="3" placeholder="points" /></span>
    <span class="qsm-quiz-min-points"><input type="text" value="<?php echo ( ! empty( $min_points ) ? absint( $min_points ) : '' ); ?>" size="3" maxlength="3" placeholder="Min" /></span>
    <span class="qsm-quiz-max-points"><input type="text" value="<?php echo ( ! empty( $max_points ) ? absint( $max_points ) : '' ); ?>" size="3" maxlength="3" placeholder="Max" /></span>

    <?php
}
add_action( 'gamipress_requirement_ui_html_after_achievement_post', 'gamipress_qsm_requirement_ui_fields', 10, 2 );

/**
 * Custom handler to save the points on requirements UI
 *
 * @param $requirement_id
 * @param $requirement
 */
function gamipress_qsm_ajax_update_requirement( $requirement_id, $requirement ) {
    
    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_qsm_complete_quiz_points'
            || $requirement['trigger_type'] === 'gamipress_qsm_complete_specific_quiz_points'
            || $requirement['trigger_type'] === 'gamipress_qsm_complete_quiz_max_points'
            || $requirement['trigger_type'] === 'gamipress_qsm_complete_specific_quiz_max_points' ) ) {

        // Save the points field
        update_post_meta( $requirement_id, '_gamipress_qsm_points', $requirement['qsm_points'] );

    }

    if( isset( $requirement['trigger_type'] )
    && ( $requirement['trigger_type'] === 'gamipress_qsm_complete_quiz_between_points'
        || $requirement['trigger_type'] === 'gamipress_qsm_complete_specifc_quiz_between_points' ) ) {

            // Between points
            update_post_meta( $requirement_id, '_gamipress_qsm_min_points', $requirement['qsm_min_points'] );
            update_post_meta( $requirement_id, '_gamipress_qsm_max_points', $requirement['qsm_max_points'] );
    
    }


}
add_action( 'gamipress_ajax_update_requirement', 'gamipress_qsm_ajax_update_requirement', 10, 2 );