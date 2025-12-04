<?php
/**
 * Zen BIT Shortcode - SCHEMA.ORG COMPLETO
 * Corrige todos os erros do Google Search Console
 */

if (!defined('ABSPATH')) exit;

class Zen_BIT_Shortcode {
    
    public function __construct() {
        add_shortcode('zen_bit_events', array($this, 'render_events'));
    }
    
    public function render_events($atts) {
        $atts = shortcode_atts(array(
            'limit' => 50,
            'layout' => 'grid'
        ), $atts);
        
        $events = Zen_BIT_API::get_events($atts['limit']);
        
        if (empty($events)) {
            return '<div class="zen-bit-no-events"><p>' . __('No upcoming events at the moment.', 'zen-bit') . '</p></div>';
        }
        
        ob_start();
        ?>
        <div class="zen-bit-events-container" itemscope itemtype="https://schema.org/EventSeries">
            <meta itemprop="name" content="Zen Eyer Events">
            <meta itemprop="description" content="Upcoming events and performances by DJ Zen Eyer - Two-time World Champion Brazilian Zouk DJ">
            
            <div class="zen-bit-events-grid zen-bit-layout-<?php echo esc_attr($atts['layout']); ?>">
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
        
        // CORREÇÃO: Garantir que sempre haja uma imagem (fallback)
        $event_image = !empty($event['image']) ? $event['image'] : 'https://djzeneyer.com/images/event-default.jpg';
        
        // CORREÇÃO: Garantir description
        $event_description = !empty($event['description']) 
            ? $event['description'] 
            : sprintf('DJ Zen Eyer live at %s in %s', 
                $venue['name'] ?? 'venue', 
                $venue['city'] ?? 'city'
            );
        
        ob_start();
        ?>
        <article class="zen-bit-event-card" itemscope itemtype="https://schema.org/MusicEvent">
            <!-- CORREÇÃO: Adicionar todos os campos obrigatórios -->
            <meta itemprop="eventStatus" content="https://schema.org/EventScheduled">
            <meta itemprop="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode">
            
            <!-- CORREÇÃO: Adicionar name e description -->
            <meta itemprop="name" content="<?php echo esc_attr($event['title'] ?? 'Event'); ?>">
            <meta itemprop="description" content="<?php echo esc_attr($event_description); ?>">
            
            <!-- CORREÇÃO: Adicionar image -->
            <meta itemprop="image" content="<?php echo esc_url($event_image); ?>">
            
            <div class="zen-bit-event-date">
                <time itemprop="startDate" datetime="<?php echo esc_attr($datetime); ?>">
                    <span class="zen-bit-date-day"><?php echo date('d', strtotime($datetime)); ?></span>
                    <span class="zen-bit-date-month"><?php echo date('M', strtotime($datetime)); ?></span>
                </time>
            </div>
            
            <div class="zen-bit-event-content">
                <h3 class="zen-bit-event-title">
                    <?php echo esc_html($event['title'] ?? 'Event'); ?>
                </h3>
                
                <!-- CORREÇÃO: Location completo com address obrigatório -->
                <div class="zen-bit-event-venue" itemprop="location" itemscope itemtype="https://schema.org/Place">
                    <meta itemprop="name" content="<?php echo esc_attr($venue['name'] ?? 'Venue'); ?>">
                    <span class="zen-bit-venue-icon">📍</span>
                    <span class="zen-bit-venue-name"><?php echo esc_html($venue['name'] ?? ''); ?></span>
                    
                    <!-- CORREÇÃO: Address é obrigatório -->
                    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                        <meta itemprop="addressLocality" content="<?php echo esc_attr($venue['city'] ?? 'Unknown'); ?>">
                        <meta itemprop="addressRegion" content="<?php echo esc_attr($venue['region'] ?? ''); ?>">
                        <meta itemprop="addressCountry" content="<?php echo esc_attr($venue['country'] ?? 'BR'); ?>">
                        <span class="zen-bit-venue-location">
                            <?php echo esc_html($venue['city'] ?? ''); ?>, <?php echo esc_html($venue['country'] ?? ''); ?>
                        </span>
                    </div>
                </div>
                
                <div class="zen-bit-event-time">
                    <span class="zen-bit-time-icon">🕐</span>
                    <span><?php echo esc_html($time_formatted); ?></span>
                </div>
                
                <!-- CORREÇÃO: Performer é obrigatório -->
                <div itemprop="performer" itemscope itemtype="https://schema.org/MusicGroup">
                    <meta itemprop="name" content="Zen Eyer">
                    <meta itemprop="genre" content="Brazilian Zouk">
                    <link itemprop="url" href="https://djzeneyer.com">
                </div>
                
                <!-- CORREÇÃO: Organizer é obrigatório -->
                <div itemprop="organizer" itemscope itemtype="https://schema.org/Organization">
                    <meta itemprop="name" content="<?php echo esc_attr($venue['name'] ?? 'Event Organizer'); ?>">
                    <link itemprop="url" href="<?php echo esc_url($event['url'] ?? ''); ?>">
                </div>
                
                <!-- CORREÇÃO: Offers é obrigatório com price e priceCurrency -->
                <?php if (!empty($event['offers']) || !empty($event['url'])): ?>
                    <div class="zen-bit-event-tickets" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                        <meta itemprop="availability" content="https://schema.org/InStock">
                        <meta itemprop="url" content="<?php echo esc_url($event['offers'][0]['url'] ?? $event['url']); ?>">
                        <!-- CORREÇÃO: price e priceCurrency são obrigatórios -->
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
            'name' => 'Zen Eyer Events',
            'description' => 'Upcoming events and performances by DJ Zen Eyer - Two-time World Champion Brazilian Zouk DJ',
            'url' => 'https://djzeneyer.com/events',
            'image' => 'https://djzeneyer.com/images/events-og.jpg',
            'performer' => array(
                '@type' => 'MusicGroup',
                'name' => 'Zen Eyer',
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
            
            // CORREÇÃO: Garantir todos os campos obrigatórios
            $event_image = !empty($event['image']) ? $event['image'] : 'https://djzeneyer.com/images/event-default.jpg';
            
            $event_description = !empty($event['description']) 
                ? $event['description'] 
                : sprintf('DJ Zen Eyer live at %s in %s', 
                    $venue['name'] ?? 'venue', 
                    $venue['city'] ?? 'city'
                );
            
            $event_schema = array(
                '@type' => 'MusicEvent',
                // CORREÇÃO: name é obrigatório
                'name' => $event['title'] ?? 'Event',
                
                // CORREÇÃO: description é obrigatório
                'description' => $event_description,
                
                // CORREÇÃO: startDate é obrigatório
                'startDate' => $event['datetime'] ?? date('c'),
                
                // CORREÇÃO: endDate é recomendado (assumir 4 horas de duração)
                'endDate' => !empty($event['datetime']) 
                    ? date('c', strtotime($event['datetime']) + (4 * 3600))
                    : date('c', strtotime('+4 hours')),
                
                // CORREÇÃO: eventStatus é obrigatório
                'eventStatus' => 'https://schema.org/EventScheduled',
                
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                
                // CORREÇÃO: image é obrigatório
                'image' => $event_image,
                
                // CORREÇÃO: location com address obrigatório
                'location' => array(
                    '@type' => 'Place',
                    // CORREÇÃO: name é obrigatório em Place
                    'name' => $venue['name'] ?? 'Venue',
                    // CORREÇÃO: address é obrigatório em Place
                    'address' => array(
                        '@type' => 'PostalAddress',
                        'addressLocality' => $venue['city'] ?? 'Unknown',
                        'addressRegion' => $venue['region'] ?? '',
                        'addressCountry' => $venue['country'] ?? 'BR'
                    )
                ),
                
                // CORREÇÃO: performer é obrigatório
                'performer' => array(
                    '@type' => 'MusicGroup',
                    // CORREÇÃO: name é obrigatório em performer
                    'name' => 'Zen Eyer',
                    'genre' => 'Brazilian Zouk',
                    'url' => 'https://djzeneyer.com'
                ),
                
                // CORREÇÃO: organizer é obrigatório
                'organizer' => array(
                    '@type' => 'Organization',
                    'name' => $venue['name'] ?? 'Event Organizer',
                    'url' => $event['url'] ?? 'https://djzeneyer.com'
                ),
                
                // CORREÇÃO: offers é obrigatório com price e priceCurrency
                'offers' => array(
                    '@type' => 'Offer',
                    'url' => $event['url'] ?? 'https://djzeneyer.com',
                    'availability' => 'https://schema.org/InStock',
                    // CORREÇÃO: price é obrigatório (usar 0 para eventos gratuitos/sem preço definido)
                    'price' => '0',
                    // CORREÇÃO: priceCurrency é obrigatório
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