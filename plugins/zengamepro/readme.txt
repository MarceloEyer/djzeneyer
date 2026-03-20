=== ZenGame Pro ===
Contributors: eyerm, djzeneyer
Tags: gamification, woocommerce, headless, react, api, standalone
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 8.0
Stable tag: 1.4.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

ZenGame Pro is a standalone high-performance gamification engine for WordPress. Unlike the standard ZenGame (which acts as a GamiPress addon), ZenGame Pro is completely independent, featuring its own point economy, rank system, and mission management. Designed for modern React frontends, it provides optimized JSON endpoints and is built for maximum speed and scalability.

== Features ==

* **Standalone Economy**: Independent point system without GamiPress dependencies.
* **Custom Ranks & Missions**: New post types for managing levels and objectives directly in ZenGame Pro.
* **Immutable Ledger**: High-performance logging system for every point transaction.
* **Headless Ready**: Secure, JWT-compatible REST API endpoints specifically for React/Next.js.
* **Direct SQL Optimization**: Blazing fast queries for user stats and leaderboard.
* **Automated Triggers**: Native hooks for Daily Logins and WooCommerce purchases.

== Installation ==

1. Upload the `zengamepro` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Define your Ranks and Missions in the 'ZenGame Pro' menu.
4. Integrate your React frontend using the `/wp-json/zengame/v1/` endpoints.

== FAQ ==

= How is this different from ZenGame? =
ZenGame (classic) is a bridge/addon for GamiPress. ZenGame Pro is its own independent engine that does not require GamiPress to function.

= Can I use both? =
Yes, but they use different point balances. ZenGame Pro is intended for users who want a custom, high-performance solution without the overhead of GamiPress.

== Changelog ==

= 1.4.0 =
* Initial Release of ZenGame Pro (Standalone).
* Integrated standalone engine logic from PR 258.
* Added custom database schema for point logs.
* Added standalone CPTs for Ranks and Missions.
* Optimized REST API for headless environments.
