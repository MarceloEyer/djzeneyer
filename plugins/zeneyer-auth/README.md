# ZenEyer Auth Pro

Enterprise-grade JWT Authentication for Headless WordPress + React. Secure, fast, and production-ready.

## Version 2.2.0 - NEW: WordPress REST API Integration

JWT authentication now works with **ALL WordPress REST API endpoints**, not just plugin-specific endpoints.

## Quick Start

```typescript
// Login
const response = await fetch('/wp-json/zeneyer-auth/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
const { token } = data;

// Use token in ANY WordPress endpoint
fetch('/wp-json/wp/v2/users/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## What's New in 2.2.0

- JWT tokens now work with native WordPress endpoints (`/wp/v2/*`)
- Dashboard loads correctly with user data
- GamiPress integration works seamlessly
- No more 401 errors on authenticated requests

## Features

- **JWT Authentication** with WordPress integration
- **Google OAuth** one-click sign-in
- **Email/Password** traditional authentication
- **Anti-Bot Protection** via Cloudflare Turnstile
- **Rate Limiting** against brute-force attacks
- **CORS Support** for headless architecture
- **Refresh Tokens** for long-lived sessions

## Installation

1. Upload plugin to `/wp-content/plugins/`
2. Install dependencies: `composer install --no-dev`
3. Activate via WordPress admin
4. Configure in **Settings → ZenEyer Auth**

## Documentation

For full documentation, see [CHANGELOG.md](CHANGELOG.md)

## License

GPL v2 or later

---

**Developed by**: [DJ Zen Eyer](https://djzeneyer.com)
**Version**: 2.2.0
**Last Updated**: January 22, 2026
