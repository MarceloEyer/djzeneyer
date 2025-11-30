# Zen BIT - Bandsintown Events Plugin

WordPress plugin to display Bandsintown events with beautiful design and full SEO optimization for search engines and AI bots.

## Features

✅ **Bandsintown API Integration** - Fetches events automatically  
✅ **Beautiful Design** - Modern gradient cards with animations  
✅ **SEO Optimized** - Full Schema.org markup (MusicEvent, EventSeries)  
✅ **AI Bot Friendly** - JSON-LD structured data for Google, ChatGPT, Claude  
✅ **REST API** - Headless WordPress support  
✅ **Caching** - Smart caching to reduce API calls  
✅ **Responsive** - Mobile-first design  
✅ **Easy to Use** - Simple shortcode `[zen_bit_events]`

## Installation

1. Upload `zen-bit` folder to `/wp-content/plugins/`
2. Activate plugin in WordPress admin
3. Go to Settings → Zen BIT Events
4. Configure your Bandsintown Artist ID (default: 15552355)

## Usage

### Shortcode

```
[zen_bit_events]
[zen_bit_events limit="10"]
[zen_bit_events layout="grid"]
```

### REST API

```
GET /wp-json/zen-bit/v1/events
GET /wp-json/zen-bit/v1/events?limit=10
```

### PHP

```php
$events = Zen_BIT_API::get_events(50);
```

## SEO Features

### Schema.org Markup

- `EventSeries` for the entire event list
- `MusicEvent` for each individual event
- `Place` and `PostalAddress` for venues
- `MusicGroup` for performer (Zen Eyer)
- `Offer` for ticket information

### JSON-LD

Complete structured data in JSON-LD format for:
- Google Search (rich snippets)
- Google Events
- AI bots (ChatGPT, Claude, Gemini)
- Social media crawlers

### Microdata

HTML5 microdata attributes (`itemscope`, `itemprop`) for maximum compatibility.

## Configuration

### Settings

- **Artist ID**: Your Bandsintown artist ID (find at bandsintown.com)
- **Cache Duration**: How long to cache events (default: 1 hour)

### Cache Management

Clear cache manually from Settings → Zen BIT Events → Clear Events Cache

## File Structure

```
zen-bit/
├── zen-bit.php                 # Main plugin file
├── includes/
│   ├── class-zen-bit-api.php       # Bandsintown API integration
│   └── class-zen-bit-shortcode.php # Shortcode and display logic
├── admin/
│   └── class-zen-bit-admin.php     # Admin settings page
├── public/
│   ├── css/
│   │   └── zen-bit-public.css      # Frontend styles
│   └── js/
│       └── zen-bit-public.js       # Frontend JavaScript
└── README.md
```

## API Response Example

```json
{
  "success": true,
  "count": 5,
  "events": [
    {
      "id": "123456",
      "title": "Zen Eyer at Club XYZ",
      "datetime": "2025-12-31T22:00:00",
      "venue": {
        "name": "Club XYZ",
        "city": "São Paulo",
        "region": "SP",
        "country": "Brazil"
      },
      "url": "https://bandsintown.com/...",
      "offers": [...]
    }
  ]
}
```

## Customization

### CSS

Override styles by adding to your theme:

```css
.zen-bit-event-card {
    background: your-gradient;
}
```

### Filters

```php
// Modify events before display
add_filter('zen_bit_events', function($events) {
    // Your modifications
    return $events;
});
```

## Requirements

- WordPress 5.0+
- PHP 7.4+
- Active internet connection (for Bandsintown API)

## Support

- Website: https://djzeneyer.com
- Bandsintown: https://www.bandsintown.com/a/15552355

## License

GPL v2 or later

## Author

**Zen Eyer** - Two-time World Champion Brazilian Zouk DJ

## Changelog

### 1.0.0 (2025-11-30)
- Initial release
- Bandsintown API integration
- Schema.org markup
- REST API endpoint
- Beautiful gradient design
- Caching system
- Admin settings page
