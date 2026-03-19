(function( $ ) {

    $(  '.cmb2-id-asgaros-forum-points-types .cmb2-list,' +
        ' .cmb2-id-asgaros-forum-achievement-types .cmb2-list,' +
        ' .cmb2-id-asgaros-forum-rank-types .cmb2-list'
    ).sortable({
        handle: 'label',
        placeholder: 'ui-state-highlight',
        forcePlaceholderSize: true,
    });
    
    // Helper function to show/hide/init Forums Select2
    function gamipress_asgaros_forum_init_forums_select( trigger_type, asgaros_forum_select ) {
        
        // Lets to check if there is a specific activity trigger
        if ( trigger_type === 'gamipress_asgaros_forum_specific_forum_like_post'
            || trigger_type === 'gamipress_asgaros_forum_specific_forum_new_post'
            || trigger_type === 'gamipress_asgaros_forum_specific_forum_new_topic'
            || trigger_type === 'gamipress_asgaros_forum_specific_forum_dislike_post' ) {
            // Show select post
            asgaros_forum_select
                .show()
                .data( 'trigger-type', trigger_type )
                .data( 'post-type', 'asgaros_forum' )
            ;

            // Check if post selector Select2 has been initialized
            if( asgaros_forum_select.hasClass('select2-hidden-accessible') ) {
                asgaros_forum_select
                    .val('').trigger('change')   // Reset value
                    .next().show();     // Show Select2 container
            } else {
                asgaros_forum_select.gamipress_select2({
                    ajax: {
                        url: ajaxurl,
                        dataType: 'json',
                        delay: 250,
                        type: 'POST',
                        data: function( params ) {
                            return {
                                q: params.term,
                                page: params.page || 1,
                                action: 'gamipress_asgaros_forum_get_posts',
                                nonce: gamipress_requirements_ui.nonce,
                                post_type: $(this).data('post-type').split(','),
                                trigger_type: $(this).data('trigger-type'),
                            };
                        },
                        processResults: gamipress_select2_posts_process_results
                    },
                    escapeMarkup: function ( markup ) { return markup; }, // Let our custom formatter work
                    templateResult: gamipress_select2_posts_template_result,
                    theme: 'default gamipress-select2',
                    placeholder: gamipress_requirements_ui.post_placeholder,
                    allowClear: true,
                    multiple: false,
                });

                asgaros_forum_select.on('select2:select', function (e) {
                    var item = e.params.data;

                    // If site ID is defined, then update the hidden field
                    if( item.site_id !== undefined ) {
                        $(this).siblings('.select-post-site-id').val( item.site_id );
                    }
                });
            }
        } else {
            // Hide select post
            asgaros_forum_select.hide();

            if( asgaros_forum_select.hasClass('select2-hidden-accessible') ) {
                asgaros_forum_select.next().hide(); // Hide select2 container
            }
        }

    }

    // Helper function to show/hide/init Topics Select2
    function gamipress_asgaros_forum_init_topics_select( trigger_type, asgaros_topic_select ) {
        
         // Lets to check if there is a specific activity trigger
        if ( trigger_type === 'gamipress_asgaros_forum_specific_topic_new_post'
        || trigger_type === 'gamipress_asgaros_forum_specific_topic_like_post'
        || trigger_type === 'gamipress_asgaros_forum_specific_topic_dislike_post' ) {
            // Show select post
            asgaros_topic_select
                .show()
                .data( 'trigger-type', trigger_type )
                .data( 'post-type', 'asgaros_topic' )
            ;

            // Check if post selector Select2 has been initialized
            if( asgaros_topic_select.hasClass('select2-hidden-accessible') ) {
                asgaros_topic_select
                    .val('').trigger('change')   // Reset value
                    .next().show();     // Show Select2 container
            } else {
                asgaros_topic_select.gamipress_select2({
                    ajax: {
                        url: ajaxurl,
                        dataType: 'json',
                        delay: 250,
                        type: 'POST',
                        data: function( params ) {
                            return {
                                q: params.term,
                                page: params.page || 1,
                                action: 'gamipress_asgaros_forum_get_posts',
                                nonce: gamipress_requirements_ui.nonce,
                                post_type: $(this).data('post-type').split(','),
                                trigger_type: $(this).data('trigger-type'),
                            };
                        },
                        processResults: gamipress_select2_posts_process_results
                    },
                    escapeMarkup: function ( markup ) { return markup; }, // Let our custom formatter work
                    templateResult: gamipress_select2_posts_template_result,
                    theme: 'default gamipress-select2',
                    placeholder: gamipress_requirements_ui.post_placeholder,
                    allowClear: true,
                    multiple: false,
                });

                asgaros_topic_select.on('select2:select', function (e) {
                    var item = e.params.data;

                    // If site ID is defined, then update the hidden field
                    if( item.site_id !== undefined ) {
                        $(this).siblings('.select-post-site-id').val( item.site_id );
                    }
                });
            }
        } else {
            // Hide select post
            asgaros_topic_select.hide();

            if( asgaros_topic_select.hasClass('select2-hidden-accessible') ) {
                asgaros_topic_select.next().hide(); // Hide select2 container
            }
        }

    }

    // Listen for our change to our trigger type selectors
    $('.requirements-list').on( 'change', '.select-trigger-type', function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).val();
        var asgaros_forum_select = $(this).siblings('.asgaros-forum');
        var asgaros_topic_select = $(this).siblings('.asgaros-topic');

        gamipress_asgaros_forum_init_forums_select( trigger_type, asgaros_forum_select );
        gamipress_asgaros_forum_init_topics_select( trigger_type, asgaros_topic_select );

    });

    // Loop requirement list items to show/hide amount input on initial load
    $('.requirements-list li').each(function() {

        // Grab our selected trigger type and achievement selector
        var trigger_type = $(this).find('.select-trigger-type').val();
        var asgaros_forum_select = $(this).find('.asgaros-forum');
        var asgaros_topic_select = $(this).find('.asgaros-topic');

        gamipress_asgaros_forum_init_forums_select( trigger_type, asgaros_forum_select );
        gamipress_asgaros_forum_init_topics_select( trigger_type, asgaros_topic_select );

    });

    $('.requirements-list').on( 'update_requirement_data', '.requirement-row', function(e, requirement_details, requirement) {
        
        if( requirement_details.trigger_type === 'gamipress_asgaros_forum_specific_forum_like_post'
            || requirement_details.trigger_type === 'gamipress_asgaros_forum_specific_forum_new_post'
            || requirement_details.trigger_type === 'gamipress_asgaros_forum_specific_forum_new_topic'
            || requirement_details.trigger_type === 'gamipress_asgaros_forum_specific_forum_dislike_post' ) {
            requirement_details.asgaros_forum = requirement.find( '.asgaros-forum' ).val();
        }

        if( requirement_details.trigger_type === 'gamipress_asgaros_forum_specific_topic_new_post'
        || requirement_details.trigger_type === 'gamipress_asgaros_forum_specific_topic_like_post'
        || requirement_details.trigger_type === 'gamipress_asgaros_forum_specific_topic_dislike_post' ) {
            requirement_details.asgaros_topic = requirement.find( '.asgaros-topic' ).val();
        }

        
    });
})( jQuery );