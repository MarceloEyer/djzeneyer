(function( $ ) {

    // Listen for our change to our trigger type selectors
    $('.requirements-list').on( 'change', '.select-trigger-type', function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).val();

        // Categories
        var category_selector = $(this).siblings('.shortlinkspro-category');

        if( trigger_type === 'gamipress_shortlinkspro_click_specific_category' ) {
            category_selector.show();
        } else {
            category_selector.hide();
        }

        // Tags
        var tag_selector = $(this).siblings('.shortlinkspro-tag');

        if( trigger_type === 'gamipress_shortlinkspro_click_specific_tag' ) {
            tag_selector.show();
        } else {
            tag_selector.hide();
        }

    });

    // Loop requirement list items to show/hide form select on initial load
    $('.requirements-list li').each(function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).find('.select-trigger-type').val();

        // Categories
        var category_selector = $(this).find('.shortlinkspro-category');

        if( trigger_type === 'gamipress_shortlinkspro_click_specific_category' ) {
            category_selector.show();
        } else {
            category_selector.hide();
        }

        // Tags
        var tag_selector = $(this).find('.shortlinkspro-tag');

        if( trigger_type === 'gamipress_shortlinkspro_click_specific_tag' ) {
            tag_selector.show();
        } else {
            tag_selector.hide();
        }

    });

    $('.requirements-list').on( 'update_requirement_data', '.requirement-row', function(e, requirement_details, requirement) {
        
        // Categories
        if( requirement_details.trigger_type === 'gamipress_shortlinkspro_click_specific_category' ) {
            requirement_details.shortlinkspro_category = requirement.find( '.shortlinkspro-category select' ).val();
        }

        // Tags
        if( requirement_details.trigger_type === 'gamipress_shortlinkspro_click_specific_tag' ) {
            requirement_details.shortlinkspro_tag = requirement.find( '.shortlinkspro-tag select' ).val();
        }

    });

})( jQuery );