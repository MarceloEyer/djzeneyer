// Helper to retrieve an URL parameter
function ct_ajax_list_table_get_parameter( sURL, sParam ) {

    var sPageURL = decodeURIComponent(sURL.split('?')[1]),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }

}

function ct_ajax_list_table_add_loader( table ) {
    table.find('#the-list').append('<div class="ct-ajax-list-table-loader"><span class="spinner is-active ct-ajax-list-table-spinner"></span></div>')
}

function ct_ajax_list_table_remove_loader( table ) {
    table.find('#the-list .ct-ajax-list-table-loader').remove();
}

// Initialize table listeners
function ct_ajax_list_table_add_listeners( table ) {

    var $ = $ || jQuery;

    table.find('.pagination-links a').click(function(e) {
        e.preventDefault();

        var url = $(this).attr('href');
        var paged = ct_ajax_list_table_get_parameter( url, 'paged' );

        ct_ajax_list_table_paginate_table( $(this).closest('.ct-ajax-list-table'), paged );
    });

    table.find('.paging-input .current-page').change(function(e) {
        var paged = $(this).val();

        var total_pages = parseInt( $(this).closest('.ct-ajax-list-table').find('.tablenav.top .paging-input .total-pages').text() );

        if( paged > total_pages ) {
            paged = total_pages;
            $(this).val(total_pages);
        }

        ct_ajax_list_table_paginate_table( $(this).closest('.ct-ajax-list-table'), paged );
    });

}

// Ajax pagination
function ct_ajax_list_table_paginate_table( table, paged, search, status ) {

    var $ = $ || jQuery;

    // Setup vars
    var object = table.data('object');
    var query_args = table.data('query-args');

    // Turn query args into an object
    query_args = JSON.parse( query_args.split("'").join('"') );

    // Add the table loader
    ct_ajax_list_table_add_loader( table );

    $.ajax({
        url: ajaxurl,
        data: {
            action: 'ct_ajax_list_table_request',
            nonce: ct_ajax_list_table.nonce,
            object: object,
            query_args: query_args,
            paged: paged,
            s: search || '',
            status: status || ''
        },
        success: function( response ) {

            if( response.data.length ) {
                var parsed_response = $(response.data);

                // Update top and bottom pagination
                table.find('.tablenav.top').html(parsed_response.filter('.tablenav.top').html());
                table.find('.tablenav.bottom').html(parsed_response.filter('.tablenav.bottom').html());

                // Update table content
                table.find('.wp-list-table').html(parsed_response.filter('.wp-list-table').html());

                // Remove the table loader, note: table content has been replaced, so not needle here
                //ct_ajax_list_table_remove_loader( table );

                // Update again pagination links
                ct_ajax_list_table_add_listeners( table );
            }

        }
    });

}

(function( $ ) {

    // Support for search box
    $('.search-box input[type=submit]').click(function(e) {
        e.preventDefault();

        var form = $(this).closest('form');
        var search = form.find('input[type=search]').val();

        var table = form.closest('.wrap').find('.ct-ajax-list-table');
        if(table.length) {
            ct_ajax_list_table_paginate_table(table, 1, search, '');
        } else {
            form.submit();
        }
    });

    // Support for views
    $('.subsubsub a').click(function(e) {
        var href = $(this).attr('href');

        // Only prevent default if it's an AJAX list table
        var wrap = $(this).closest('.wrap');
        var table = wrap.find('.ct-ajax-list-table');

        if(table.length && href.indexOf('?') !== -1) {
            e.preventDefault();

            // Highlight current view
            $('.subsubsub a').removeClass('current');
            $(this).addClass('current');

            var status = ct_ajax_list_table_get_parameter(href, 'status');
            if(!status) status = '';

            // Also get search if exists
            var search = wrap.find('.search-box input[type=search]').val();

            ct_ajax_list_table_paginate_table(table, 1, search, status);
        }
    });

    // Initialize all tables
    $('.ct-ajax-list-table').each(function() {
        ct_ajax_list_table_add_listeners( $(this) );
    });

})( jQuery );