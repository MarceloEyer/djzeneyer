=== ZenGame Pro ===
Contributors: djzeneyer
Tags: gamification, woocommerce
Requires at least: 6.0
Tested up to: 6.4
Stable tag: 1.3.9
Requires PHP: 8.1
License: GPLv2 or later

Gaming & Activity Bridge for DJ Zen Eyer — SSOT for GamiPress + WooCommerce.

== Description ==

Gaming & Activity Bridge for DJ Zen Eyer — SSOT for GamiPress + WooCommerce
headless gamification. Provides REST endpoints consumed by the React frontend.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/zengame` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.

== Changelog ==

= 1.3.9 =
* Adds compatibility hooks for points/rank cache invalidation.
* Reads both authorization header casings for JWT auth.
* Enforces runtime clamp for leaderboard limit (1..100).
