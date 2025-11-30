<?php
if (!defined('ABSPATH')) exit;

class BIT_Zen_Shortcode {
    
    public function __construct() {
        add_shortcode('bit_zen_events', array($this, 'render_events'));
    }
    
    public function render_events($atts) {
        $atts = shortcode_atts(array(
            'limit' => 50,
            'layout' => 'grid'
        ), $atts);
        
        $events = BIT_Zen_API::get_events($atts['limit']);
        
        if (empty($events)) {
            return '<div class="bit-zen-no-events"><p>' . __('No upcoming events at the moment.', 'bit-zen') . '</p></div>';
        }
        
        ob_start();
        ?>
        <div class="bit-zen-events-container" itemscope itemtype="https://schema.org/EventSeries">
            <meta itemprop="name" content="Zen Eyer Events">
            <meta itemprop="description" content="Upcoming events and performances by DJ Zen Eyer">
            
            <div class="bit-zen-events-grid bit-zen-layout-<?php echo esc_attr($atts['layout']); ?>">
                <?php foreach ($events as $event): ?>
                    <?php echo $this->render_event_card($event); ?>
                <?php endforeach; ?>
            </div>
            
            <?php echo $this->render_json_ld($events); ?>
        </div>
        <?php
        return ob_get_clean();
    }
    
    private function render_event_card($event) {
        $venue = $event['venue'] ?? array();
        $datetime = isset($event['datetime']) ? $event['datetime'] : '';
        $date_formatted = $datetime ? date('F j, Y', strtotime($datetime)) : '';
        $time_formatted = $datetime ? date('g:i A', strtotime($datetime)) : '';
        
        ob_start();
        ?>
        <article class="bit-zen-event-card" itemscope itemtype="https://schema.org/MusicEvent">
            <meta itemprop="eventStatus" content="https://schema.org/EventScheduled">
            
            <div class="bit-zen-event-date">
                <time itemprop="startDate" datetime="<?php echo esc_attr($datetime); ?>">
                    <span class="bit-zen-date-day"><?php echo date('d', strtotime($datetime)); ?></span>
                    <span class="bit-zen-date-month"><?php echo date('M', strtotime($datetime)); ?></span>
                </time>
            </div>
            
            <div class="bit-zen-event-content">
                <h3 class="bit-zen-event-title" itemprop="name">
                    <?php echo esc_html($event['title'] ?? 'Event'); ?>
                </h3>
                
                <div class="bit-zen-event-venue" itemprop="location" itemscope itemtype="https://schema.org/Place">
                    <meta itemprop="name" content="<?php echo esc_attr($venue['name'] ?? ''); ?>">
                    <span class="bit-zen-venue-icon">📍</span>
                    <span class="bit-zen-venue-name"><?php echo esc_html($venue['name'] ?? ''); ?></span>
                    
                    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                        <meta itemprop="addressLocality" content="<?php echo esc_attr($venue['city'] ?? ''); ?>">
                        <meta itemprop="addressRegion" content="<?php echo esc_attr($venue['region'] ?? ''); ?>">
                        <meta itemprop="addressCountry" content="<?php echo esc_attr($venue['country'] ?? ''); ?>">
                        <span class="bit-zen-venue-location">
                            <?php echo esc_html($venue['city'] ?? ''); ?>, <?php echo esc_html($venue['country'] ?? ''); ?>
                        </span>
                    </div>
                </div>
                
                <div class="bit-zen-event-time">
                    <span class="bit-zen-time-icon">🕐</span>
                    <span><?php echo esc_html($time_formatted); ?></span>
                </div>
                
                <div itemprop="performer" itemscope itemtype="https://schema.org/MusicGroup">
                    <meta itemprop="name" content="Zen Eyer">
                    <meta itemprop="genre" content="Brazilian Zouk">
                </div>
                
                <?php if (!empty($event['offers'])): ?>
                    <div class="bit-zen-event-tickets" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                        <meta itemprop="availability" content="https://schema.org/InStock">
                        <meta itemprop="url" content="<?php echo esc_url($event['offers'][0]['url'] ?? $event['url']); ?>">
                        <a href="<?php echo esc_url($event['offers'][0]['url'] ?? $event['url']); ?>" 
                           class="bit-zen-ticket-button" 
                           target="_blank" 
                           rel="noopener">
                            🎫 <?php _e('Get Tickets', 'bit-zen'); ?>
                        </a>
                    </div>
                <?php elseif (!empty($event['url'])): ?>
                    <div class="bit-zen-event-info">
                        <a href="<?php echo esc_url($event['url']); ?>" 
                           class="bit-zen-info-button" 
                           target="_blank" 
                           rel="noopener">
                            ℹ️ <?php _e('More Info', 'bit-zen'); ?>
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
            'name' => 'Zen Eyer Events',
            'description' => 'Upcoming events and performances by DJ Zen Eyer - Two-time World Champion Brazilian Zouk DJ',
            'performer' => array(
                '@type' => 'MusicGroup',
                'name' => 'Zen Eyer',
                'genre' => 'Brazilian Zouk',
                'url' => 'https://djzeneyer.com',
                'sameAs' => array(
                    'https://www.instagram.com/djzeneyer/',
                    'https://www.facebook.com/djzeneyer',
                    'https://soundcloud.com/djzeneyer',
                    'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw'
                )
            ),
            'subEvent' => array()
        );
        
        foreach ($events as $event) {
            $venue = $event['venue'] ?? array();
            $json_ld['subEvent'][] = array(
                '@type' => 'MusicEvent',
                'name' => $event['title'] ?? 'Event',
                'startDate' => $event['datetime'] ?? '',
                'eventStatus' => 'https://schema.org/EventScheduled',
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                'location' => array(
                    '@type' => 'Place',
                    'name' => $venue['name'] ?? '',
                    'address' => array(
                        '@type' => 'PostalAddress',
                        'addressLocality' => $venue['city'] ?? '',
                        'addressRegion' => $venue['region'] ?? '',
                        'addressCountry' => $venue['country'] ?? ''
                    )
                ),
                'performer' => array(
                    '@type' => 'MusicGroup',
                    'name' => 'Zen Eyer'
                ),
                'offers' => array(
                    '@type' => 'Offer',
                    'url' => $event['url'] ?? '',
                    'availability' => 'https://schema.org/InStock'
                )
            );
        }
        
        return '<script type="application/ld+json">' . wp_json_encode($json_ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . '</script>';
    }
}

new BIT_Zen_Shortcode();
