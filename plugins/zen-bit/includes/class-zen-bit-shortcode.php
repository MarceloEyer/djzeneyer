title
        $event_title = !empty($event['title']) 
            ? $event['title']
            : sprintf('DJ Zen Eyer at %s', $venue['name'] ?? 'Event');
        
        ob_start();
        ?>
        <article class="zen-bit-event-card" itemscope itemtype="https://schema.org/MusicEvent">
            <!-- ✅ Campos obrigatórios -->
            <meta itemprop="eventStatus" content="https://schema.org/EventScheduled">
            <meta itemprop="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode">
            <meta itemprop="name" content="<?php echo esc_attr($event_title); ?>">
            <meta itemprop="description" content="<?php echo esc_attr($event_description); ?>">
            <meta itemprop="image" content="<?php echo esc_url($event_image); ?>">
            
            <div class="zen-bit-event-date">
                <time itemprop="startDate" datetime="<?php echo esc_attr($datetime); ?>">
                    <span class="zen-bit-date-day"><?php echo date('d', strtotime($datetime)); ?></span>
                    <span class="zen-bit-date-month"><?php echo date('M', strtotime($datetime)); ?></span>
                </time>
            </div>
            
            <div class="zen-bit-event-content">
                <h3 class="zen-bit-event-title">
                    <?php echo esc_html($event_title); ?>
                </h3>
                
                <!-- ✅ Location com address (obrigatório) -->
                <div class="zen-bit-event-venue" itemprop="location" itemscope itemtype="https://schema.org/Place">
                    <meta itemprop="name" content="<?php echo esc_attr($venue['name'] ?? 'Venue'); ?>">
                    <span class="zen-bit-venue-icon">📍</span>
                    <span class="zen-bit-venue-name"><?php echo esc_html($venue['name'] ?? ''); ?></span>
                    
                    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                        <meta itemprop="addressLocality" content="<?php echo esc_attr($venue['city'] ?? 'Unknown'); ?>">
                        <meta itemprop="addressRegion" content="<?php echo esc_attr($venue['region'] ?? ''); ?>">
                        <meta itemprop="addressCountry" content="<?php echo esc_attr($venue['country'] ?? 'BR'); ?>">
                        <span class="zen-bit-venue-location">
                            <?php echo esc_html($venue['city'] ?? ''); ?><?php if (!empty($venue['country'])) echo ', ' . esc_html($venue['country']); ?>
                        </span>
                    </div>
                </div>
                
                <div class="zen-bit-event-time">
                    <span class="zen-bit-time-icon">🕐</span>
                    <span><?php echo esc_html($time_formatted); ?></span>
                </div>
                
                <!-- ✅ Performer (obrigatório) -->
                <div itemprop="performer" itemscope itemtype="https://schema.org/MusicGroup">
                    <meta itemprop="name" content="DJ Zen Eyer">
                    <meta itemprop="genre" content="Brazilian Zouk">
                    <link itemprop="url" href="https://djzeneyer.com">
                </div>
                
                <!-- ✅ Organizer (obrigatório) -->
                <div itemprop="organizer" itemscope itemtype="https://schema.org/Organization">
                    <meta itemprop="name" content="<?php echo esc_attr($venue['name'] ?? 'Event Organizer'); ?>">
                    <link itemprop="url" href="<?php echo esc_url($event['url'] ?? 'https://djzeneyer.com'); ?>">
                </div>
                
                <!-- ✅ Offers (obrigatório) -->
                <?php if (!empty($event['offers']) || !empty($event['url'])): ?>
                    <div class="zen-bit-event-tickets" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                        <meta itemprop="availability" content="https://schema.org/InStock">
                        <meta itemprop="url" content="<?php echo esc_url($event['offers'][0]['url'] ?? $event['url']); ?>">
                        <meta itemprop="price" content="0">
                        <meta itemprop="priceCurrency" content="BRL">
                        <meta itemprop="validFrom" content="<?php echo date('c'); ?>">
                        
                        <a href="<?php echo esc_url($event['offers'][0]['url'] ?? $event['url']); ?>" 
                           class="zen-bit-ticket-button" 
                           target="_blank" 
                           rel="noopener">
                            🎫 <?php _e('Get Tickets', 'zen-bit'); ?>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </article>
        <?php
        return ob_get_clean();
    }
    
    private function render_json_ld($events) {
        $json_ld = array(
            '@context' => 'https://schema.org',
            '@type' => 'EventSeries',
            'name' => 'DJ Zen Eyer Events',
            'description' => 'Upcoming events and performances by DJ Zen Eyer - Two-time World Champion Brazilian Zouk DJ',
            'url' => 'https://djzeneyer.com/events',
            'image' => 'https://djzeneyer.com/images/events-og.jpg',
            'performer' => array(
                '@type' => 'MusicGroup',
                'name' => 'DJ Zen Eyer',
                'genre' => 'Brazilian Zouk',
                'url' => 'https://djzeneyer.com',
                'image' => 'https://djzeneyer.com/images/zen-eyer-profile.jpg',
                'description' => 'Two-time World Champion Brazilian Zouk DJ',
                'sameAs' => array(
                    'https://www.instagram.com/djzeneyer/',
                    'https://www.facebook.com/djzeneyer',
                    'https://soundcloud.com/djzeneyer',
                    'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
                    'https://www.bandsintown.com/a/15552355'
                )
            ),
            'subEvent' => array()
        );
        
        foreach ($events as $event) {
            $venue = $event['venue'] ?? array();
            
            // ✅ FIX: Garantir startDate (OBRIGATÓRIO)
            $datetime = isset($event['datetime']) && !empty($event['datetime']) 
                ? $event['datetime'] 
                : date('c', strtotime('+7 days'));
            
            // ✅ FIX: Garantir image
            $event_image = !empty($event['image']) 
                ? $event['image'] 
                : 'https://djzeneyer.com/images/event-default.jpg';
            
            // ✅ FIX: Garantir description
            $event_description = !empty($event['description']) 
                ? $event['description'] 
                : sprintf('DJ Zen Eyer performing live at %s in %s', 
                    $venue['name'] ?? 'venue', 
                    $venue['city'] ?? 'city'
                );
            
            // ✅ FIX: Garantir title
            $event_title = !empty($event['title']) 
                ? $event['title']
                : sprintf('DJ Zen Eyer at %s', $venue['name'] ?? 'Event');
            
            $event_schema = array(
                '@type' => 'MusicEvent',
                
                // ✅ OBRIGATÓRIO: name
                'name' => $event_title,
                
                // ✅ OBRIGATÓRIO: description
                'description' => $event_description,
                
                // ✅ OBRIGATÓRIO: startDate
                'startDate' => $datetime,
                
                // ✅ RECOMENDADO: endDate
                'endDate' => date('c', strtotime($datetime) + (4 * 3600)), // +4 horas
                
                // ✅ OBRIGATÓRIO: eventStatus
                'eventStatus' => 'https://schema.org/EventScheduled',
                
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                
                // ✅ OBRIGATÓRIO: image
                'image' => $event_image,
                
                // ✅ OBRIGATÓRIO: location com address
                'location' => array(
                    '@type' => 'Place',
                    'name' => $venue['name'] ?? 'Venue',
                    'address' => array(
                        '@type' => 'PostalAddress',
                        'addressLocality' => $venue['city'] ?? 'Unknown',
                        'addressRegion' => $venue['region'] ?? '',
                        'addressCountry' => $venue['country'] ?? 'BR'
                    )
                ),
                
                // ✅ OBRIGATÓRIO: performer
                'performer' => array(
                    '@type' => 'MusicGroup',
                    'name' => 'DJ Zen Eyer',
                    'genre' => 'Brazilian Zouk',
                    'url' => 'https://djzeneyer.com'
                ),
                
                // ✅ OBRIGATÓRIO: organizer
                'organizer' => array(
                    '@type' => 'Organization',
                    'name' => $venue['name'] ?? 'Event Organizer',
                    'url' => $event['url'] ?? 'https://djzeneyer.com'
                ),
                
                // ✅ OBRIGATÓRIO: offers com price e priceCurrency
                'offers' => array(
                    '@type' => 'Offer',
                    'url' => $event['url'] ?? 'https://djzeneyer.com',
                    'availability' => 'https://schema.org/InStock',
                    'price' => '0',
                    'priceCurrency' => 'BRL',
                    'validFrom' => date('c')
                )
            );
            
            $json_ld['subEvent'][] = $event_schema;
        }
        
        return '<script type="application/ld+json">' . wp_json_encode($json_ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . '</script>';
    }
}

new Zen_BIT_Shortcode();