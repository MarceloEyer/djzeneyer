/**
 * Admin JavaScript for Zen SEO Lite Pro
 */
(function($) {
    'use strict';
    
    $(document).ready(function() {
        
        /**
         * Media uploader for image fields
         */
        $('.zen-seo-upload-image').on('click', function(e) {
            e.preventDefault();
            
            const button = $(this);
            const inputField = button.siblings('.zen-seo-image-url');
            const previewContainer = button.siblings('.zen-seo-image-preview');
            
            // Create media frame
            const frame = wp.media({
                title: 'Select or Upload Image',
                button: {
                    text: 'Use this image'
                },
                multiple: false
            });
            
            // When image is selected
            frame.on('select', function() {
                const attachment = frame.state().get('selection').first().toJSON();
                
                // Set URL in input field
                inputField.val(attachment.url);
                
                // Update preview
                if (previewContainer.length) {
                    previewContainer.html('<img src="' + attachment.url + '" style="max-width: 300px; height: auto; border: 1px solid #ddd;">');
                } else {
                    button.after('<div class="zen-seo-image-preview" style="margin-top: 10px;"><img src="' + attachment.url + '" style="max-width: 300px; height: auto; border: 1px solid #ddd;"></div>');
                }
            });
            
            // Open media frame
            frame.open();
        });
        
        /**
         * Validate ISNI format on blur
         */
        $('input[name="zen_seo_global[isni_code]"]').on('blur', function() {
            const value = $(this).val().trim();
            if (value && !value.match(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/)) {
                $(this).css('border-color', '#dc3232');
                if (!$(this).next('.validation-error').length) {
                    $(this).after('<p class="validation-error" style="color: #dc3232; margin-top: 5px;">Invalid ISNI format. Expected: 0000 0001 2345 6789</p>');
                }
            } else {
                $(this).css('border-color', '');
                $(this).next('.validation-error').remove();
            }
        });
        
        /**
         * Validate CNPJ format on blur
         */
        $('input[name="zen_seo_global[cnpj]"]').on('blur', function() {
            const value = $(this).val().trim();
            if (value && !value.match(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)) {
                $(this).css('border-color', '#dc3232');
                if (!$(this).next('.validation-error').length) {
                    $(this).after('<p class="validation-error" style="color: #dc3232; margin-top: 5px;">Invalid CNPJ format. Expected: 00.000.000/0000-00</p>');
                }
            } else {
                $(this).css('border-color', '');
                $(this).next('.validation-error').remove();
            }
        });
        
        /**
         * Character counter for meta description
         */
        $('textarea[name*="[desc]"]').each(function() {
            const textarea = $(this);
            const maxLength = 160;
            
            // Add counter
            textarea.after('<p class="char-counter" style="color: #666; font-size: 12px; margin-top: 5px;">0 / ' + maxLength + ' characters</p>');
            
            const counter = textarea.next('.char-counter');
            
            // Update counter on input
            textarea.on('input', function() {
                const length = $(this).val().length;
                counter.text(length + ' / ' + maxLength + ' characters');
                
                if (length > maxLength) {
                    counter.css('color', '#dc3232');
                } else if (length > maxLength * 0.9) {
                    counter.css('color', '#f0b849');
                } else {
                    counter.css('color', '#46b450');
                }
            });
            
            // Trigger initial count
            textarea.trigger('input');
        });
        
    });
    
})(jQuery);
