# ZenEyer Auth Pro - Changelog

## [2.2.0] - 2026-01-22

### Added
- **WordPress REST API Integration**: JWT authentication now works with ALL WordPress REST API endpoints, not just plugin-specific endpoints
- New `class-wp-auth-integration.php` for seamless integration with WordPress core authentication system
- `determine_current_user` filter to validate JWT tokens across all REST requests
- `rest_authentication_errors` filter to handle authentication errors properly

### Fixed
- **Critical**: Fixed 401 Unauthorized errors when accessing native WordPress endpoints (e.g., `/wp-json/wp/v2/users/6`)
- Dashboard now loads successfully with JWT authentication
- GamiPress data fetching now works correctly
- User metadata endpoints are now accessible with JWT tokens

### Changed
- JWT tokens are now recognized globally by WordPress, not just in plugin namespaces
- Authentication system respects existing cookie/nonce authentication (doesn't override)

### Security
- JWT validation uses same secure `JWT_Manager` class
- Only applies to REST API requests (doesn't affect frontend)
- Validates user existence before setting current user
- Doesn't block requests with invalid tokens (fail-safe)

---

## [2.1.5] - 2026-01-20

### Added
- Anti-Bot Security Shield
- Cloudflare Turnstile integration
- Enhanced rate limiting
- Security headers management

### Fixed
- CORS configuration improvements
- Google OAuth stability enhancements

---

## [2.1.0] - 2026-01-15

### Added
- Google OAuth authentication
- JWT refresh token system
- Enhanced logging system

### Changed
- Improved error messages
- Better CORS handling

---

## [2.0.0] - 2026-01-10

### Added
- Initial release with JWT authentication
- Email/password authentication
- CORS support
- Rate limiting
- Admin settings page

---

**Maintainer:** DJ Zen Eyer
**License:** GPL v2 or later
**Repository:** https://github.com/djzeneyer/zeneyer-auth
