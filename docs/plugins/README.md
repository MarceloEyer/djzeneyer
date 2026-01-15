# Custom Plugins Documentation

Documentation for all custom WordPress plugins developed for DJ Zen Eyer website.

---

## Plugins Overview

### 1. Zen SEO Lite Pro v8.0.0

**Location:** `/plugins/zen-seo-lite/`

**Function:** Complete SEO engine for headless WordPress architecture.

**Features:**
- REST API for meta tags
- Schema.org JSON-LD generation
- Dynamic XML sitemap
- Admin metabox for customization
- Support for events (event_date, event_location, event_ticket)
- Open Graph and Twitter Cards
- Intelligent caching

**Endpoints:**
```
GET /wp-json/zen-seo/v1/meta/{slug}?lang=pt
GET /wp-json/zen-seo/v1/sitemap
GET /wp-json/zen-seo/v1/schema/{type}/{id}
```

**Documentation:** [ZEN-SEO.md](ZEN-SEO.md)

---

### 2. ZenEyer Auth Pro v2.0.0

**Location:** `/plugins/zeneyer-auth/`

**Function:** JWT authentication with Google OAuth for headless WordPress.

**Features:**
- Email/password authentication
- Google OAuth 2.0 integration
- JWT token generation & validation
- Rate limiting (brute force protection)
- CORS configuration
- Automatic token refresh
- Secure logout with token blacklist

**Endpoints:**
```
POST /wp-json/zeneyer-auth/v1/login
POST /wp-json/zeneyer-auth/v1/register
POST /wp-json/zeneyer-auth/v1/google-login
POST /wp-json/zeneyer-auth/v1/refresh
POST /wp-json/zeneyer-auth/v1/logout
GET  /wp-json/zeneyer-auth/v1/validate
```

**Security:**
- Rate limiting: 5 attempts/minute
- JWT expiration: 7 days
- HTTPS only
- CORS restrictions

**Documentation:** [../plugins/zeneyer-auth/README.md](../../plugins/zeneyer-auth/README.md)

---

### 3. Zen BIT v1.0.0

**Location:** `/plugins/zen-bit/`

**Function:** Bandsintown events API integration.

**Features:**
- Event caching (1 hour TTL)
- Automatic date/location formatting
- Responsive event cards UI
- Shortcode: `[zen_bit_events]`
- REST API endpoint

**Endpoint:**
```
GET /wp-json/zen-bit/v1/events
```

**Configuration:**
- Set Bandsintown Artist Name in WordPress admin
- Configure API key (if required)

**Documentation:** [../plugins/zen-bit/README.md](../../plugins/zen-bit/README.md)

---

### 4. Zen-RA v1.0.0

**Location:** `/plugins/zen-ra/`

**Function:** Recent Activity API - gamified user history.

**Features:**
- WooCommerce orders integration
- GamiPress achievements tracking
- User milestones
- Activity timeline
- Streak tracking

**Endpoint:**
```
GET /wp-json/zen-ra/v1/activity/:user_id
```

**Response Example:**
```json
{
  "activities": [
    {
      "type": "purchase",
      "title": "Purchased Zen Zouk Pack Vol. 3",
      "date": "2025-01-15T10:30:00Z",
      "icon": "shopping-bag"
    },
    {
      "type": "achievement",
      "title": "Unlocked: Zouk Master",
      "date": "2025-01-14T18:20:00Z",
      "icon": "trophy"
    }
  ],
  "streak": {
    "current": 7,
    "longest": 14
  }
}
```

**Documentation:** [../plugins/zen-ra/README.md](../../plugins/zen-ra/README.md)

---

## Installation

### All Plugins

```bash
cd /var/www/html/wp-content/plugins/

# Upload plugins from project
rsync -avz /path/to/project/plugins/ ./

# Activate via WP-CLI
wp plugin activate zen-seo-lite
wp plugin activate zeneyer-auth
wp plugin activate zen-bit
wp plugin activate zen-ra
```

### Or via WordPress Admin

1. Go to **Plugins > Add New**
2. Click **Upload Plugin**
3. Choose plugin ZIP file
4. Click **Install Now**
5. Click **Activate**

---

## Configuration

### Zen SEO Lite Pro

1. No configuration needed (works out of the box)
2. Optional: Customize meta tags per post/page via metabox

### ZenEyer Auth Pro

1. Go to **Settings > ZenEyer Auth**
2. Enter **Google Client ID** (for OAuth)
3. Configure **JWT Secret Key** (auto-generated)
4. Set **Token Expiration** (default: 7 days)

### Zen BIT

1. Go to **Settings > Zen BIT**
2. Enter **Bandsintown Artist Name**: `DJ Zen Eyer`
3. Optional: Set custom cache TTL

### Zen-RA

1. No configuration needed
2. Automatically integrates with WooCommerce and GamiPress

---

## Usage in React Frontend

### Zen SEO Lite

```typescript
// Fetch SEO meta tags
const response = await fetch(
  `${wpRestUrl}/zen-seo/v1/meta/about?lang=${currentLang}`
);
const seoData = await response.json();

// Use with HeadlessSEO component
<HeadlessSEO
  title={seoData.title}
  description={seoData.description}
  schema={seoData.schema}
  // ...
/>
```

### ZenEyer Auth

```typescript
// Login
const response = await fetch(`${wpRestUrl}/zeneyer-auth/v1/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const { token, user } = await response.json();
localStorage.setItem('authToken', token);

// Use token in subsequent requests
fetch(apiUrl, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Zen BIT

```typescript
// Fetch events
const response = await fetch(`${wpRestUrl}/zen-bit/v1/events`);
const events = await response.json();

// Render events
events.map(event => (
  <EventCard
    title={event.title}
    date={event.date}
    venue={event.venue}
    ticketUrl={event.url}
  />
));
```

### Zen-RA

```typescript
// Fetch user activity
const response = await fetch(
  `${wpRestUrl}/zen-ra/v1/activity/${userId}`
);
const { activities, streak } = await response.json();

// Render activity timeline
<RecentActivity
  activities={activities}
  currentStreak={streak.current}
  longestStreak={streak.longest}
/>
```

---

## Development

### Adding Custom Endpoints

Example in `inc/api.php`:

```php
add_action('rest_api_init', function() {
  register_rest_route('djzeneyer/v1', '/custom-endpoint', [
    'methods' => 'GET',
    'callback' => 'my_custom_function',
    'permission_callback' => '__return_true'
  ]);
});

function my_custom_function(WP_REST_Request $request) {
  // Your logic here
  return rest_ensure_response([
    'success' => true,
    'data' => []
  ]);
}
```

### Testing Endpoints

```bash
# Test GET endpoint
curl https://djzeneyer.com/wp-json/djzeneyer/v1/custom-endpoint

# Test POST endpoint with auth
curl -X POST https://djzeneyer.com/wp-json/zeneyer-auth/v1/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'
```

---

## Troubleshooting

### Plugin Not Activating

**Solution:**
```bash
# Check PHP errors
tail -f /var/www/html/wp-content/debug.log

# Enable WordPress debug mode
# In wp-config.php:
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

### API Endpoint 404

**Solution:**
```bash
# Flush permalinks
wp rewrite flush

# Or via WordPress Admin:
# Settings > Permalinks > Save Changes
```

### CORS Issues

**Solution:** Check `inc/setup.php`:
```php
function djz_allowed_origins(): array {
    return [
        'https://djzeneyer.com',
        'http://localhost:5173' // for dev
    ];
}
```

---

## License

All custom plugins: GPL v2 or later

---

**Last Updated:** January 2026
