(function ( $ ) {

    // EDIT

    // On click ct save, show spinner
    $("#publishing-action #ct-save").on("click", function(e) {
        var $this = $(this);

        if( $this.prop('disabled') === true ) {
            return;
        }

        $this.closest('#publishing-action').find('.spinner').addClass('is-active');
        $this.hide();
        $this.closest('#publishing-action').find('#ct-save-disabled').show();
    });

    // On click ct add, show spinner
    $("#ct_add_form #ct-add").on("click", function(e) {
        var $this = $(this);

        if( $this.prop('disabled') === true ) {
            return;
        }

        var any_error = false;

        $this.closest('form').find('input[required="1"]').each(function() {
            var field = $(this);

            if( field.val() === '' ) {
                field.parent().addClass('form-required form-invalid');
                any_error = true;
            }
        })

        if( any_error ) {
            return;
        }

        $this.closest('.submit').find('.spinner').addClass('is-active');
        $this.hide();
        $this.closest('.submit').find('#ct-add-disabled').show();
    });

    $("body").on("keyup", ".form-required.form-invalid input, .form-required.form-invalid textarea", function(e) {
        $(this).parent().removeClass('form-required');
        $(this).parent().removeClass('form-invalid');
    });

})( jQuery );