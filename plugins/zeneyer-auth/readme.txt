=== ZenEyer Auth Pro ===
Contributors: eyerm, djzeneyer
Tags: authentication, jwt, headless, react, security, oauth, google
Requires at least: 5.8
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 2.3.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

Secure JWT authentication and user management for headless WordPress applications. Built specifically for high-performance React/Next.js frontends.

== Features ==

* **JWT Authentication**: Secure, stateless token-based auth.
* **Google OAuth**: One-tap login with Google.
* **Rate Limiting**: Protection against brute-force attacks.
* **Audit Logging**: Track all security events in the dashboard.
* **WooCommerce Integration**: Access user orders via headless API.
* **Profile Management**: Custom fields for dance roles and social links.
* **MailPoet Integration**: Sync newsletter subscriptions effortlessly.

== Installation ==

1. Upload the `zeneyer-auth` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Configure your Google Client ID and Token settings in the ZenEyer Auth menu.
4. **Important**: Add your Turnstile keys to `wp-config.php`.

== Frequently Asked Questions ==

= Is this plugin secure? =
Yes, it follows WordPress security best practices, including input sanitization, output escaping, and rate limiting.

= Do I need a specific theme? =
No, this plugin is theme-agnostic as it focuses on providing a REST API layer.

== Changelog ==

= 2.3.0 =
* Hardened security posture for official directory submission.
* Added ABSPATH checks to all files.
* Improved CORS origin whitelisting.
* Standardized readme.txt format.
