(function( $ ) {

    // Listen for our change to our trigger type selectors
    $('.requirements-list').on( 'change', '.select-trigger-type', function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).val();

        // Categories
        var category_selector = $(this).siblings('.bbforms-category');

        if( trigger_type === 'gamipress_bbforms_form_specific_category_submission' ) {
            category_selector.show();
        } else {
            category_selector.hide();
        }

        // Tags
        var tag_selector = $(this).siblings('.bbforms-tag');

        if( trigger_type === 'gamipress_bbforms_form_specific_tag_submission' ) {
            tag_selector.show();
        } else {
            tag_selector.hide();
        }

        // Field and value
        var field_name_input = $(this).siblings('.bbforms-field-name');
        var field_value_input = $(this).siblings('.bbforms-field-value');

        if( trigger_type === 'gamipress_bbforms_field_value_submission'
            || trigger_type === 'gamipress_bbforms_specific_field_value_submission' ) {
            field_name_input.show();
            field_value_input.show();
        } else {
            field_name_input.hide();
            field_value_input.hide();
        }

    });

    // Loop requirement list items to show/hide form select on initial load
    $('.requirements-list li').each(function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).find('.select-trigger-type').val();

        // Categories
        var category_selector = $(this).find('.bbforms-category');

        if( trigger_type === 'gamipress_bbforms_form_specific_category_submission' ) {
            category_selector.show();
        } else {
            category_selector.hide();
        }

        // Tags
        var tag_selector = $(this).find('.bbforms-tag');

        if( trigger_type === 'gamipress_bbforms_form_specific_tag_submission' ) {
            tag_selector.show();
        } else {
            tag_selector.hide();
        }

        // Field and value
        var field_name_input = $(this).find('.bbforms-field-name');
        var field_value_input = $(this).find('.bbforms-field-value');

        if( trigger_type === 'gamipress_bbforms_field_value_submission'
            || trigger_type === 'gamipress_bbforms_specific_field_value_submission' ) {
            field_name_input.show();
            field_value_input.show();
        } else {
            field_name_input.hide();
            field_value_input.hide();
        }
        
    });

    $('.requirements-list').on( 'update_requirement_data', '.requirement-row', function(e, requirement_details, requirement) {
        
        // Categories
        if( requirement_details.trigger_type === 'gamipress_bbforms_form_specific_category_submission' ) {
            requirement_details.bbforms_category = requirement.find( '.bbforms-category select' ).val();
        }

        // Tags
        if( requirement_details.trigger_type === 'gamipress_bbforms_form_specific_tag_submission' ) {
            requirement_details.bbforms_tag = requirement.find( '.bbforms-tag select' ).val();
        }

        // Field and value
        if( requirement_details.trigger_type === 'gamipress_bbforms_field_value_submission'
            || requirement_details.trigger_type === 'gamipress_bbforms_specific_field_value_submission' ) {
            requirement_details.bbforms_field_name = requirement.find( '.bbforms-field-name input' ).val();
            requirement_details.bbforms_field_value = requirement.find( '.bbforms-field-value input' ).val();
        }

    });

})( jQuery );