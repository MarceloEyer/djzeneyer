=== ZenGame Pro ===
Contributors: eyerm, djzeneyer
Tags: gamipress, gamification, woocommerce, headless, react, api
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 8.0
Stable tag: 1.4.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

The High-Performance Bridge for GamiPress + Headless WordPress. ZenGame Pro transforms your standard GamiPress installation into a lightning-fast, API-driven gamification engine. Built specifically for modern React frontends, it replaces heavy shortcodes with optimized JSON endpoints and enterprise-grade caching.

== Features ==

* **Elite Performance**: Direct SQL optimization for WooCommerce stats (tracks purchased, events attended).
* **Smart Caching**: Smart transient management that invalidates only when points or ranks change.
* **Headless Ready**: Clean, secure REST API endpoints designed for React/Next.js integrations.
* **Login Streaks**: Native daily login streak tracking for better user retention.
* **BFF Architecture**: Acts as a Backend-for-Frontend, unifying points, ranks, and achievements in a single payload.

== Installation ==

1. Upload the `zengame` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Ensure GamiPress is installed and active.
4. Enjoy the performance boost under the 'ZenGame' admin menu.

== FAQ ==

= Why is this faster than standard GamiPress? =
Standard GamiPress queries can be heavy on large sites. ZenGame uses optimized direct SQL and a multi-layer caching system to ensure your dashboard loads in milliseconds.

= Does it work with any React framework? =
Yes, it provides standard REST API endpoints. You can use it with React, Vue, Next.js, or even mobile apps.

== Changelog ==

= 1.4.0 =
* Major structural refactor to Professional Standards.
* Separated Core Engine, REST API, and Admin logic.
* Added proper uninstall cleanup logic.
* Added filter for event category slugs.
