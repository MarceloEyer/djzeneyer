(function( $ ) {

    // Initial check
    $('.cmb2-metabox input, .cmb2-metabox select, .cmb2-metabox textarea').each(function() {

        cmb_conditional_fields_check_field_change( $(this), true );

    });

    // Change field
    $('.cmb2-metabox input, .cmb2-metabox select, .cmb2-metabox textarea').on( 'change', function( e ) {

        cmb_conditional_fields_check_field_change( $(this), false );

    });

    // Change field
    $('.cmb2-metabox input[type="text"], .cmb2-metabox input[type="number"]').on( 'keyup', function( e ) {

        cmb_conditional_fields_check_field_change( $(this), false );

    });

})(jQuery);

function cmb_conditional_fields_check_field_change( field, first_check ) {

    var $ = jQuery || $;

    var field_id = field.attr('id');
    var field_type = field.attr('type');

    if( field_type === 'radio' ) {
        if( ! field.prop('checked') ) {
            return;
        }

        field_id = field.attr('name');
    }

    var form = field.closest('.cmb2-metabox');

    form.find( '.cmb-conditional-fields.cmb-show-if-field-' + field_id ).each(function() {
        var target = $(this);

        cmb_conditional_fields_check_conditions( field, target, first_check, 'show' );

    });

    form.find( '.cmb-conditional-fields.cmb-hide-if-field-' + field_id ).each(function() {
        var target = $(this);

        cmb_conditional_fields_check_conditions( field, target, first_check, 'hide' );

    });

}

function cmb_conditional_fields_check_conditions( field, target, instant, action ) {

    var $ = jQuery || $;
    var meet_conditions = null;

    var field_id = field.attr('id');
    var field_type = field.attr('type');

    if( field_type === 'radio' ) {
        field_id = field.attr('name');
    }

    var conditions = target.attr('class').split(' ');

    conditions.forEach(function(condition) {

        if( condition.startsWith('cmb-' + action + '-if-field-' + field_id + '-condition') ) {
            condition = condition.replace('cmb-' + action + '-if-field-' + field_id + '-condition-', '');

            if( meet_conditions === null ) {
                // First check
                meet_conditions = cmb_conditional_fields_meet_condition( condition, field );
            } else {
                // Multiples values as check (OR)
                meet_conditions = cmb_conditional_fields_meet_condition( condition, field ) || meet_conditions;

                // TODO: Support for AND
            }

        }

    });

    if( action === 'show' ) {
        if( meet_conditions ) {
            cmb_conditional_fields_show( field, target, instant );
        } else {
            cmb_conditional_fields_hide( field, target, instant );
        }
    } else {
        if( meet_conditions ) {
            cmb_conditional_fields_hide( field, target, instant );
        } else {
            cmb_conditional_fields_show( field, target, instant );
        }
    }


}

function cmb_conditional_fields_meet_condition( condition, field ) {

    var meet_conditions = null;

    switch ( condition ) {
        case 'empty':
            if( field.val().length ) {
                meet_conditions = false;
            } else {
                meet_conditions = true;
            }
            break;
        case 'not-empty':
            if( ! field.val().length ) {
                meet_conditions = false;
            } else {
                meet_conditions = true;
            }
            break;
        case 'checked':
            if( ! field.prop('checked') ) {
                meet_conditions = false;
            } else {
                meet_conditions = true;
            }
            break;
        case 'not-checked':
            if( field.prop('checked') ) {
                meet_conditions = false;
            } else {
                meet_conditions = true;
            }
            break;
        default:
            if( field.val() !== condition ) {
                meet_conditions = false;
            } else {
                meet_conditions = true;
            }
            break;
    }

    return meet_conditions;

}

function cmb_conditional_fields_show( field, target, instant ) {

    var $ = jQuery || $;

    if( instant ) {

        if( cmb_conditional_fields_is_tab_active( field ) ) {
            target.show();
        }

        // Support for cmb2 tabs
        target.removeClass('cmb2-tab-ignore');
    } else {
        if( cmb_conditional_fields_is_tab_active( field ) ) {
            target.slideDown('fast');

            target.addClass('cmb-tab-active-item');
        }

        // Support for cmb2 tabs
        target.removeClass('cmb2-tab-ignore');
    }

}

function cmb_conditional_fields_hide( field, target, instant ) {

    var $ = jQuery || $;

    if( instant ) {
        target.hide();

        // Support for cmb2 tabs
        target.addClass('cmb2-tab-ignore');
    } else {
        target.slideUp('fast');

        if( cmb_conditional_fields_is_tab_active( field ) ) {
            target.removeClass('cmb-tab-active-item');
        }

        // Support for cmb2 tabs
        target.addClass('cmb2-tab-ignore');
    }

}

function cmb_conditional_fields_is_tab_active( field ) {
    if( field.closest('.cmb-tabs-wrap').length ) {
        return field.closest('.cmb-row').hasClass('cmb-tab-active-item');
    }

    return true;

}