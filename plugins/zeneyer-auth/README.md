# ZenEyer Auth Pro v2.0.0

Enterprise-grade JWT Authentication for Headless WordPress + React applications.

## 🚀 Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Google OAuth** - One-click login with Google
- ✅ **Password Auth** - Traditional email/password
- ✅ **Refresh Tokens** - Auto-renewal without re-login
- ✅ **Rate Limiting** - Brute force protection
- ✅ **CORS Handling** - Proper cross-origin support
- ✅ **REST API** - Complete headless API
- ✅ **Password Reset** - Email-based recovery
- ✅ **Logging** - Debug and audit trails

## 📋 Requirements

- WordPress 6.0+
- PHP 7.4+
- OpenSSL extension
- Composer (for dependencies)

## 🔧 Installation

### 1. Install Dependencies

```bash
cd wp-content/plugins/zeneyer-auth
composer install
```

### 2. Activate Plugin

WordPress Admin → Plugins → Activate "ZenEyer Auth Pro"

### 3. Configure Settings

WordPress Admin → Settings → ZenEyer Auth

- Add Google Client ID (optional)
- Set token expiration (default: 7 days)

## 📡 API Endpoints

Base URL: `https://yoursite.com/wp-json/zeneyer-auth/v1`

### Authentication

```bash
# Login
POST /auth/login
Body: { "email": "user@example.com", "password": "password" }

# Register
POST /auth/register
Body: { "email": "user@example.com", "password": "password", "name": "John Doe" }

# Google Login
POST /auth/google
Body: { "id_token": "google_id_token_here" }

# Validate Token
POST /auth/validate
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }

# Refresh Token
POST /auth/refresh
Body: { "refresh_token": "...", "user_id": 123 }

# Get Current User
GET /auth/me
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }

# Logout
POST /auth/logout
Headers: { "Authorization": "Bearer YOUR_JWT_TOKEN" }
```

### Password Reset

```bash
# Request Reset
POST /auth/password/reset
Body: { "email": "user@example.com" }

# Set New Password
POST /auth/password/set
Body: { "key": "reset_key", "login": "username", "password": "new_password" }
```

### Public

```bash
# Get Settings
GET /settings
Response: { "google_client_id": "...", "registration_enabled": true }
```

## 🔐 Security Features

- **Rate Limiting** - 5 attempts per 10 minutes
- **Secure Secrets** - 64-character random keys
- **Token Expiration** - Configurable (default 7 days)
- **Refresh Tokens** - 30-day validity
- **Password Strength** - Minimum 8 characters
- **Email Verification** - Google OAuth only accepts verified emails

## 🎯 React Integration

```javascript
// Login
const response = await fetch('/wp-json/zeneyer-auth/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
localStorage.setItem('token', data.token);
localStorage.setItem('refresh_token', data.refresh_token);

// Use Token
const response = await fetch('/wp-json/zeneyer-auth/v1/auth/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});
```

## 🛠️ Configuration

### wp-config.php (Recommended)

```php
// Custom JWT secret (more secure than database)
define('ZENEYER_JWT_SECRET', 'your-64-character-secret-here');
```

### Filters

```php
// Customize token expiration
add_filter('zeneyer_auth_token_expiration_days', function($days) {
    return 30; // 30 days instead of 7
});

// Customize CORS origins
add_filter('zeneyer_auth_cors_origins', function($origins) {
    $origins[] = 'https://app.example.com';
    return $origins;
});

// Customize rate limiting
add_filter('zeneyer_auth_max_attempts', function($max, $action) {
    return 10; // Allow 10 attempts instead of 5
}, 10, 2);
```

### Actions

```php
// After successful login
add_action('zeneyer_auth_successful_login', function($user_id) {
    // Your code here
});

// After user registration
add_action('zeneyer_auth_user_registered', function($user_id, $email) {
    // Send welcome email, etc.
}, 10, 2);

// After token creation
add_action('zeneyer_auth_token_created', function($user_id, $expiration) {
    // Log token creation
}, 10, 2);
```

## 🐛 Debugging

Enable WordPress debug mode:

```php
// wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check logs at: `wp-content/debug.log`

## 📊 Changelog

### v2.0.0 (2025-11-27)
- Complete rewrite with modular architecture
- Added refresh token support
- Improved rate limiting
- Better error handling
- Enhanced security
- CORS handler improvements
- Comprehensive logging
- Better documentation

### v1.1.0 (Previous)
- Initial release

## 📄 License

GPL v2 or later

## 👨‍💻 Author

**DJ Zen Eyer**
- Website: [djzeneyer.com](https://djzeneyer.com)
- Email: booking@djzeneyer.com

## 🤝 Support

For issues or questions, please contact booking@djzeneyer.com
