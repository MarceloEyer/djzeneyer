<?php
/**
 * Plugin Name:           GamiPress - WP Paid Membership Subscriptions integration
 * Plugin URI:            https://wordpress.org/plugins/gamipress-paid-membership-subscriptions-integration/
 * Description:           Connect GamiPress with Paid Membership Subscriptions.
 * Version:               1.0.0
 * Author:                GamiPress
 * Author URI:            https://gamipress.com/
 * Text Domain:           gamipress-paid-membership-subscriptions
 * Domain Path:           /languages/
 * Requires at least:     4.4
 * Tested up to:          6.7
 * License:               GNU AGPL v3.0 (http://www.gnu.org/licenses/agpl.txt)
 *
 * @package               GamiPress\Paid-Membership-Subscriptions
 * @author                GamiPress
 * @copyright             Copyright (c) GamiPress
 */

final class GamiPress_Integration_Paid_Membership_Subscriptions {

    /**
     * @var         GamiPress_Integration_Paid_Membership_Subscriptions $instance The one true GamiPress_Integration_Paid_Membership_Subscriptions
     * @since       1.0.0
     */
    private static $instance;

    /**
     * Get active instance
     *
     * @access      public
     * @since       1.0.0
     * @return      GamiPress_Integration_Paid_Membership_Subscriptions self::$instance The one true GamiPress_Integration_Paid_Membership_Subscriptions
     */
    public static function instance() {
        if( !self::$instance ) {
            self::$instance = new GamiPress_Integration_Paid_Membership_Subscriptions();
            self::$instance->constants();
            self::$instance->includes();
            self::$instance->hooks();
            
        }

        return self::$instance;
    }

    /**
     * Setup plugin constants
     *
     * @access      private
     * @since       1.0.0
     * @return      void
     */
    private function constants() {
        // Plugin version
        define( 'GAMIPRESS_PMS_VER', '1.0.0' );

        // Plugin path
        define( 'GAMIPRESS_PMS_DIR', plugin_dir_path( __FILE__ ) );

        // Plugin URL
        define( 'GAMIPRESS_PMS_URL', plugin_dir_url( __FILE__ ) );
    }

    /**
     * Include plugin files
     *
     * @access      private
     * @since       1.0.0
     * @return      void
     */
    private function includes() {

        if( $this->meets_requirements() ) {

            require_once GAMIPRESS_PMS_DIR . 'includes/admin.php';
            require_once GAMIPRESS_PMS_DIR . 'includes/functions.php';
            require_once GAMIPRESS_PMS_DIR . 'includes/listeners.php';
            require_once GAMIPRESS_PMS_DIR . 'includes/triggers.php';

        }
    }

    /**
     * Setup plugin hooks
     *
     * @access      private
     * @since       1.0.0
     * @return      void
     */
    private function hooks() {
        // Setup our activation and deactivation hooks
        register_activation_hook( __FILE__, array( $this, 'activate' ) );
        register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );

        
    }

    /**
     * Activation hook for the plugin.
     *
     * @since  1.0.0
     */
    function activate() {

        if( $this->meets_requirements() ) {

        }

    }

    /**
     * Deactivation hook for the plugin.
     *
     * @since  1.0.0
     */
    function deactivate() {

    }

    /**
     * Check if there are all plugin requirements
     *
     * @since  1.0.0
     *
     * @return bool True if installation meets all requirements
     */
    private function meets_requirements() {

        if ( ! class_exists( 'GamiPress' ) ) {
            return false;
        }

        // Requirements on multisite install
        if( is_multisite() && is_main_site() && function_exists('gamipress_is_network_wide_active') && gamipress_is_network_wide_active() ) {

            // On main site, need to check if integrated plugin is installed on any sub site to load all configuration files
            if( gamipress_is_plugin_active_on_network( 'paid-membership-subscriptions/paid-membership-subscriptions.php' ) ) {
                return true;
            }

        }

        if ( ! class_exists('Paid_Member_Subscriptions') ) {
            return false;
        }

        return true;

    }

}

/**
 * The main function responsible for returning the one true GamiPress_Integration_Paid_Membership_Subscriptions instance to functions everywhere
 *
 * @since       1.0.0
 * @return      \GamiPress_Integration_Paid_Membership_Subscriptions The one true GamiPress_Integration_Paid_Membership_Subscriptions
 */
function GamiPress_Integration_Paid_Membership_Subscriptions() {
    return GamiPress_Integration_Paid_Membership_Subscriptions::instance();
}
add_action( 'gamipress_pre_init', 'GamiPress_Integration_Paid_Membership_Subscriptions' );
