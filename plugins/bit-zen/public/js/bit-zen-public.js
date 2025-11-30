/**
 * BIT-Zen Public JavaScript
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Add smooth scroll to ticket buttons
        $('.bit-zen-ticket-button, .bit-zen-info-button').on('click', function(e) {
            // Track click event (if analytics available)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'BIT-Zen Events',
                    'event_label': 'Ticket Button Click'
                });
            }
        });

        // Add loading state for dynamic content
        $('.bit-zen-events-container').addClass('bit-zen-loaded');

        // Lazy load images if any
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('.bit-zen-event-card img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    });

})(jQuery);
