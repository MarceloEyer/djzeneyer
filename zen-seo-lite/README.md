# Zen SEO Lite Pro

Professional SEO plugin for WordPress Headless + React SPA architecture.

## Version 8.0.0

Complete rewrite with modular architecture, improved performance, and enterprise-grade features.

---

## 🚀 Features

### Core SEO
- ✅ **Meta Tags**: Title, description, canonical, robots
- ✅ **Open Graph**: Full OG protocol support
- ✅ **Twitter Cards**: Summary large image cards
- ✅ **Hreflang**: Multilingual support with Polylang
- ✅ **Schema.org**: Rich structured data (Person, Event, Product, Music)

### Performance
- ✅ **Smart Caching**: Transient-based caching system
- ✅ **Lazy Loading**: On-demand schema generation
- ✅ **Optimized Queries**: Efficient database operations
- ✅ **Memory Safe**: Handles large sites without issues

### Integration
- ✅ **REST API**: Full API exposure for headless architecture
- ✅ **Polylang**: Native multilingual support
- ✅ **WooCommerce**: Product schema integration
- ✅ **Custom Post Types**: Flyers, Remixes support

### Developer Friendly
- ✅ **Modular Architecture**: Separated concerns
- ✅ **Hooks & Filters**: Extensible via WordPress hooks
- ✅ **PSR Standards**: Clean, readable code
- ✅ **Debug Logging**: Built-in logging system

---

## 📁 File Structure

```
zen-seo-lite/
├── zen-seo-lite.php          # Main plugin file
├── README.md                  # This file
├── includes/                  # Core functionality
│   ├── class-zen-seo-helpers.php
│   ├── class-zen-seo-cache.php
│   ├── class-zen-seo-meta-tags.php
│   ├── class-zen-seo-schema.php
│   ├── class-zen-seo-sitemap.php
│   └── class-zen-seo-rest-api.php
└── admin/                     # Admin interface
    ├── class-zen-seo-admin.php
    ├── class-zen-seo-meta-box.php
    └── js/
        └── admin.js
```

---

## 🔧 Installation

### Method 1: Upload via WordPress Admin
1. Download the `zen-seo-lite` folder
2. Zip the folder: `zen-seo-lite.zip`
3. Go to WordPress Admin → Plugins → Add New → Upload Plugin
4. Upload the zip file and activate

### Method 2: FTP/SFTP
1. Upload the `zen-seo-lite` folder to `/wp-content/plugins/`
2. Go to WordPress Admin → Plugins
3. Activate "Zen SEO Lite Pro"

### Method 3: WP-CLI
```bash
cd /path/to/wordpress
wp plugin activate zen-seo-lite
```

---

## ⚙️ Configuration

### 1. Basic Setup

Go to **WordPress Admin → Zen SEO → Settings**

#### Identity & Business
- **Full Legal Name**: Your real name (for Schema.org)
- **Booking Email**: Contact email for bookings
- **CNPJ**: Brazilian tax ID (format: 00.000.000/0000-00)
- **Birth Place**: Example: Rio de Janeiro, Brazil
- **Home Location**: Example: São Paulo, Brazil

#### Musical Authority
- **ISNI Code**: International Standard Name Identifier
- **MusicBrainz URL**: Your MusicBrainz profile
- **Wikidata URL**: Your Wikidata entry
- **Google Knowledge Graph ID**: Your Google KG identifier
- **Mensa URL**: Mensa International profile (optional)

#### Digital Ecosystem
Add URLs for all your social and music platforms:
- Beatport, Spotify, Apple Music, Shazam
- SoundCloud, Mixcloud, Bandcamp
- Songkick, Bandsintown
- Instagram, YouTube, Facebook
- Ranker List

#### Technical Settings
- **Awards List**: One award per line
- **Default OG Image**: Fallback image (1200x630px recommended)
- **React Routes**: Configure SPA routes for sitemap

### 2. Per-Post SEO

Each post/page has a **Zen SEO** meta box with:
- **SEO Title**: Custom title (leave empty to use post title)
- **Meta Description**: 150-160 characters recommended
- **OG Image**: Custom image URL
- **No Index**: Hide from search engines
- **Event Fields** (for Flyers): Date, location, ticket URL

### 3. React Routes Configuration

Format: `/en-route, /pt-route` (one per line)

Example:
```
/, /pt/
/about, /pt/sobre
/events, /pt/eventos
/music, /pt/musica
/shop, /pt/loja
```

---

## 🔌 REST API Endpoints

### Get SEO Data
```
GET /wp-json/wp/v2/posts/{id}
```
Response includes `zen_seo`, `zen_schema`, `zen_translations` fields.

### Get Global Settings
```
GET /wp-json/zen-seo/v1/settings
```

### Get Sitemap Data
```
GET /wp-json/zen-seo/v1/sitemap
```

### Clear Cache (Admin Only)
```
POST /wp-json/zen-seo/v1/cache/clear
Authorization: Bearer {token}
```

---

## 🎯 React Integration

### Consuming SEO Data

```javascript
// Fetch post with SEO data
const response = await fetch('/wp-json/wp/v2/posts/123');
const post = await response.json();

// Access SEO fields
const seoTitle = post.zen_seo.title || post.title.rendered;
const seoDesc = post.zen_seo.desc;
const ogImage = post.zen_seo.image;
const schema = post.zen_schema;
const translations = post.zen_translations;
```

### Using in React Helmet

```jsx
import { Helmet } from 'react-helmet-async';

function PostPage({ post }) {
  const seo = post.zen_seo;
  
  return (
    <>
      <Helmet>
        <title>{seo.title || post.title.rendered}</title>
        <meta name="description" content={seo.desc} />
        <meta property="og:image" content={seo.image} />
        <script type="application/ld+json">
          {JSON.stringify(post.zen_schema)}
        </script>
      </Helmet>
      
      {/* Your content */}
    </>
  );
}
```

---

## 🗺️ Sitemap

### Access
```
https://yoursite.com/sitemap.xml
```

### Features
- ✅ Automatic generation
- ✅ Multilingual support (hreflang)
- ✅ React routes included
- ✅ WordPress posts included
- ✅ Cached for 48 hours
- ✅ Auto-added to robots.txt

### Manual Regeneration
1. Go to **Zen SEO → Cache**
2. Click "Clear All Caches"
3. Visit `/sitemap.xml` to regenerate

---

## 🧹 Cache Management

### Cache Durations
- **Sitemap**: 48 hours
- **Schema**: 24 hours
- **Meta Tags**: 12 hours

### Auto-Clear Triggers
- Post save/update
- Settings update
- Manual clear via admin

### Manual Clear
1. **Admin UI**: Zen SEO → Cache → Clear All Caches
2. **REST API**: `POST /wp-json/zen-seo/v1/cache/clear`
3. **Code**: `Zen_SEO_Cache::clear_all();`

---

## 🐛 Debugging

### Enable Debug Mode

Add to `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Logs will appear in `/wp-content/debug.log`

### Common Issues

#### Sitemap returns 404
```bash
# Solution: Flush rewrite rules
wp rewrite flush
```

#### Meta tags not appearing
```bash
# Check for conflicts with other SEO plugins
wp plugin list --status=active | grep -i seo
```

#### Schema not generating
```bash
# Clear cache and check logs
wp transient delete --all
tail -f /wp-content/debug.log
```

---

## 🔒 Security

### Best Practices
- ✅ Nonce verification on all forms
- ✅ Capability checks (`manage_options`)
- ✅ Input sanitization
- ✅ Output escaping
- ✅ SQL injection prevention
- ✅ XSS protection

### Sensitive Data
The plugin **never exposes**:
- Booking email (via REST API)
- CNPJ (via REST API)
- Admin-only settings

---

## 🚀 Performance

### Benchmarks
- **Page Load**: +0ms (cached)
- **First Load**: +50ms (schema generation)
- **Memory**: ~2MB
- **Database Queries**: 0 (when cached)

### Optimization Tips
1. Use a caching plugin (LiteSpeed, WP Rocket)
2. Enable object caching (Redis, Memcached)
3. Use a CDN for images
4. Keep awards list under 20 items

---

## 🔄 Migration from v7.5.6

### Breaking Changes
- File structure completely changed
- Settings remain compatible
- Meta data remains compatible
- Cache keys changed (auto-cleared on activation)

### Migration Steps
1. Deactivate old version
2. Delete old plugin file
3. Install new version
4. Activate
5. Verify settings at Zen SEO → Settings
6. Clear all caches

---

## 🛠️ Developer Hooks

### Filters

```php
// Modify supported post types
add_filter('zen_seo_supported_post_types', function($types) {
    $types[] = 'my_custom_type';
    return $types;
});

// Modify page data before rendering
add_filter('zen_seo_page_data', function($data) {
    $data['title'] .= ' - Custom Suffix';
    return $data;
});

// Modify schema output
add_filter('zen_seo_schema', function($schema) {
    // Add custom schema
    return $schema;
});
```

### Actions

```php
// After cache clear
add_action('zen_seo_cache_cleared', function() {
    // Your code
});
```

---

## 📊 Requirements

- **WordPress**: 5.8+
- **PHP**: 7.4+
- **MySQL**: 5.7+
- **Recommended**: Polylang for multilingual

---

## 📝 Changelog

### 8.0.0 (2025-11-27)
- ✅ Complete rewrite with modular architecture
- ✅ Fixed critical sitemap XML typo
- ✅ Added proper post type support (flyers, remixes)
- ✅ Improved caching system
- ✅ Added REST API endpoints
- ✅ Enhanced security
- ✅ Better error handling
- ✅ Performance optimizations
- ✅ Added cache management UI
- ✅ Improved admin interface
- ✅ Added live preview in meta box
- ✅ Better Polylang integration

### 7.5.6 (Previous)
- Initial monolithic version

---

## 🤝 Support

For issues or questions:
1. Check the [Debugging](#-debugging) section
2. Review [Common Issues](#common-issues)
3. Contact: booking@djzeneyer.com

---

## 📄 License

GPL v2 or later

---

## 👨‍💻 Author

**DJ Zen Eyer**
- Website: [djzeneyer.com](https://djzeneyer.com)
- Email: booking@djzeneyer.com

---

**Made with ❤️ for the WordPress + React community**
