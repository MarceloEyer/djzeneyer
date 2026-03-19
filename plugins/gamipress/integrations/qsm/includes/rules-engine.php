<?php
/**
 * Rules Engine
 *
 * @package GamiPress\QSM\Rules_Engine
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Checks if given requirement meets the requirements of triggered event
 *
 * @since 1.0.0
 *
 * @param int 	    $requirement_id
 * @param string 	$trigger
 * @param array 	$args
 *
 * @return bool
 */
function gamipress_qsm_check_if_meets_requirements( $requirement_id, $trigger, $args ) {

    // Initialize the return value
    $return = true;

    // If is minimum points trigger, rules engine needs to check the minimum points
    if( $trigger === 'gamipress_qsm_complete_quiz_points'
        || $trigger === 'gamipress_qsm_complete_specific_quiz_points' ) {
            
            $points = absint( $args[2] );
            error_log('$points:');
            error_log(print_r($points, true));

            $required_points = absint( get_post_meta( $requirement_id, '_gamipress_qsm_points', true ) );
            error_log('$required_points:');
            error_log(print_r($required_points, true));

            // True if there is points is bigger than required points
            $return = (bool) ( $points >= $required_points );

    }
    
    // If is maximum points trigger, rules engine needs to check the maximum points
    if( $trigger === 'gamipress_qsm_complete_quiz_max_points'
    || $trigger === 'gamipress_qsm_complete_specific_quiz_max_points' ) {
        
        $points = absint( $args[2] );

        $required_points = absint( get_post_meta( $requirement_id, '_gamipress_qsm_points', true ) );

        // True if there is points is bigger than required points
        $return = (bool) ( $points <= $required_points );
        
    }

    // If is between points trigger, rules engine needs to check the minimum and maximum points allowed
    if( $trigger === 'gamipress_qsm_complete_quiz_between_points'
    || $trigger === 'gamipress_qsm_complete_specifc_quiz_between_points' ) {
        
        $points = absint( $args[2] );

        $min_points = absint( get_post_meta( $requirement_id, '_gamipress_qsm_min_points', true ) );
        $max_points = absint( get_post_meta( $requirement_id, '_gamipress_qsm_max_points', true ) );

        // True if there is points is bigger than required points
        $return = (bool) ( $points >= $min_points && $points <= $max_points );
        
    }

    return $return;
}

/**
 * Filter triggered requirements to reduce the number of requirements to check by the awards engine
 *
 * @since 1.0.0
 *
 * @param array 	$triggered_requirements
 * @param integer 	$user_id
 * @param string 	$trigger
 * @param integer 	$site_id
 * @param array 	$args
 *
 * @return array
 */
function gamipress_qsm_filter_triggered_requirements( $triggered_requirements, $user_id, $trigger, $site_id, $args ) {

    $new_requirements = array();

    foreach( $triggered_requirements as $i => $requirement ) {

        // Skip item
        if( ! gamipress_qsm_check_if_meets_requirements( $requirement->ID, $trigger, $args ) ) {
            continue;
        }

        // Keep the requirement on the list of requirements to check by the awards engine
        $new_requirements[] = $requirement;

    }

    return $new_requirements;

}
add_filter( 'gamipress_get_triggered_requirements', 'gamipress_qsm_filter_triggered_requirements', 20, 5 );

/**
 * Checks if a user is allowed to work on a given requirement related to a minimum of points
 *
 * @since  1.0.0
 *
 * @param bool $return          The default return value
 * @param int $user_id          The given user's ID
 * @param int $requirement_id   The given requirement's post ID
 * @param string $trigger       The trigger triggered
 * @param int $site_id          The site id
 * @param array $args           Arguments of this trigger
 *
 * @return bool True if user has access to the requirement, false otherwise
 */
function gamipress_qsm_user_has_access_to_achievement( $return = false, $user_id = 0, $requirement_id = 0, $trigger = '', $site_id = 0, $args = array() ) {

    // If we're not working with a requirement, bail here
    if( ! in_array( get_post_type( $requirement_id ), gamipress_get_requirement_types_slugs() ) )
        return $return;

    // Check if user has access to the achievement ($return will be false if user has exceed the limit or achievement is not published yet)
    if( ! $return )
        return $return;

    // Send back our eligibility
    return gamipress_qsm_check_if_meets_requirements( $requirement_id, $trigger, $args );

}
add_filter( 'user_has_access_to_achievement', 'gamipress_qsm_user_has_access_to_achievement', 10, 6 );