(function( $ ) {

    // Listen for our change to our trigger type selection
    $('.requirements-list').on( 'change', '.select-trigger-type', function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).val();
        var points_input = $(this).siblings('.qsm-quiz-points');
        var min_points_input = $(this).siblings('.qsm-quiz-min-points');
        var max_points_input = $(this).siblings('.qsm-quiz-max-points');
        
        // Toggle points field visibility
        if(
            trigger_type === 'gamipress_qsm_complete_quiz_points'
            || trigger_type === 'gamipress_qsm_complete_specific_quiz_points'
            || trigger_type === 'gamipress_qsm_complete_quiz_max_points'
            || trigger_type === 'gamipress_qsm_complete_specific_quiz_max_points'
        ) {
            points_input.show();
        }else {
            points_input.hide();
        }

        // Toggle min and max points fields visibility
        if(
            trigger_type === 'gamipress_qsm_complete_quiz_between_points'
            || trigger_type === 'gamipress_qsm_complete_specifc_quiz_between_points'
        ) {
            min_points_input.show();
            max_points_input.show();
        }else {
            min_points_input.hide();
            max_points_input.hide();
        }

    } );

    // Loop requirement list items to show/hide points input on initial load
    $('.requirements-list li').each(function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).find('.select-trigger-type').val();
        var points_input = $(this).find('.qsm-quiz-points');
        var min_points_input = $(this).find('.qsm-quiz-min-points');
        var max_points_input = $(this).find('.qsm-quiz-max-points');

        // Toggle points fields visibility
        if(
            trigger_type === 'gamipress_qsm_complete_quiz_points'
            || trigger_type === 'gamipress_qsm_complete_specific_quiz_points'
            || trigger_type === 'gamipress_qsm_complete_quiz_max_points'
            || trigger_type === 'gamipress_qsm_complete_specific_quiz_max_points'
        ) { 
            points_input.show();
        }else{
            points_input.hide();
        }

        // Toggle min and max points fields visibility
        if(
            trigger_type === 'gamipress_qsm_complete_quiz_between_points'
            || trigger_type === 'gamipress_qsm_complete_specifc_quiz_between_points'
        ) {
            min_points_input.show();
            max_points_input.show();
        }else {
            min_points_input.hide();
            max_points_input.hide();
        }

    });

    $('.requirements-list').on( 'update_requirement_data', '.requirement-row', function(e, requirement_details, requirement) {
        
        // Add points field
        if(
            requirement_details.trigger_type === 'gamipress_qsm_complete_quiz_points'
            || requirement_details.trigger_type === 'gamipress_qsm_complete_specific_quiz_points'
            || requirement_details.trigger_type === 'gamipress_qsm_complete_quiz_max_points'
            || requirement_details.trigger_type === 'gamipress_qsm_complete_specific_quiz_max_points'
        ) {
            requirement_details.qsm_points = requirement.find( '.qsm-quiz-points input' ).val()
        }
        
        // Add min and max points fields
        if(
            requirement_details.trigger_type === 'gamipress_qsm_complete_quiz_between_points'
            || requirement_details.trigger_type === 'gamipress_qsm_complete_specifc_quiz_between_points'
        ) {
            requirement_details.qsm_min_points = requirement.find( '.qsm-quiz-min-points input' ).val();
            requirement_details.qsm_max_points = requirement.find( '.qsm-quiz-max-points input' ).val();   
        }

    } );

})( jQuery );