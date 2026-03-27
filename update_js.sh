cat << 'INNER_EOF' > /tmp/update.js
const fs = require('fs');
const content = fs.readFileSync('plugins/gamipress/libraries/ct-ajax-list-table/assets/js/ct-ajax-list-table.js', 'utf8');

const updatedContent = content.replace(
  '// TODO: Add support for search box and views',
  `// Support for search box
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
    });`
);

// We need to update the paginate function signature as well
const updatedContent2 = updatedContent.replace(
    'function ct_ajax_list_table_paginate_table( table, paged ) {',
    'function ct_ajax_list_table_paginate_table( table, paged, search, status ) {'
);

const updatedContent3 = updatedContent2.replace(
    /data: {\s+action: 'ct_ajax_list_table_request',\s+nonce: ct_ajax_list_table\.nonce,\s+object: object,\s+query_args: query_args,\s+paged: paged\s+}/,
    `data: {
            action: 'ct_ajax_list_table_request',
            nonce: ct_ajax_list_table.nonce,
            object: object,
            query_args: query_args,
            paged: paged,
            s: search || '',
            status: status || ''
        }`
);

fs.writeFileSync('plugins/gamipress/libraries/ct-ajax-list-table/assets/js/ct-ajax-list-table.js', updatedContent3);
INNER_EOF
node /tmp/update.js
