# ZenEyer Auth Pro - Changelog

## [2.4.1] - 2026-10-16

### Security
- **CORS**: a opção legada `allow_all_origins` é ignorada (refletia qualquer `Origin` com credenciais) e foi removida da tela de configurações. Usar "Specific Allowed Origins". `Vary: Origin` também no preflight.
- **IP do cliente**: novo `Core/Client_IP` (fonte única). `CF-Connecting-IP` e `X-Forwarded-For` só valem quando `REMOTE_ADDR` é Cloudflare, loopback ou está no filtro `zeneyer_auth_trusted_proxies`. Usado por rate limiter, sessões JWT e Turnstile.
- **Rate limit** em `/auth/refresh`, `/auth/password/reset` e `/auth/password/set`.
- **Escopo do JWT**: fora de `zeneyer-auth/v1` e `zengame/v1` (ex.: `wc/v3`, `mailpoet/v1`), o JWT não autentica contas privilegiadas (`manage_options`, `manage_woocommerce`, `edit_others_posts`, `promote_users`). Filtros: `zeneyer_auth_jwt_first_party_namespaces`, `zeneyer_auth_jwt_privileged_caps`.
- **Payload do JWT** reduzido a `data.user_id` (sem e-mail, nome ou roles). Tokens já emitidos continuam válidos.
- **Segredo do JWT**: gravado sem autoload; aviso no admin enquanto `ZENEYER_JWT_SECRET` não estiver no `wp-config.php`.
- **Login Google**: o `sub` da conta Google fica vinculado ao usuário; um `sub` diferente é recusado (`google_account_mismatch`).
- **Security Shield**: a constante global `ZEN_AUTH_VALIDATED` foi substituída por uma janela escopada (`Security_Shield::with_validated_registration()`); novo filtro `zeneyer_auth_allow_user_registration`.
- **zengame**: `?nocache` do dashboard exige `manage_options`.
- **zen-private-music-delivery**: o link de ativação deixa de trafegar na query string; é exibido uma única vez via transient por administrador.


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
