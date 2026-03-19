<?php
/**
 * @package      RGC\CMB2\Field_Tooltip
 * @author       Ruben Garcia (RubenGC) <rubengcdev@gmail.com>, GamiPress <contact@gamipress.com>
 * @copyright    Copyright (c) Tsunoa
 *
 * Plugin Name: CMB2 Field Tooltip
 * Plugin URI: https://github.com/rubengc/cmb2-field-tooltip
 * GitHub Plugin URI: https://github.com/rubengc/cmb2-field-tooltip
 * Description: Adds tooltips to CMB2 fields.
 * Version: 1.0.3
 * Author: Tsunoa
 * Author URI: https://tsunoa.com/
 * License: GPLv2+
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// Prevent CMB2 autoload adding "RGC_" at start
if( !class_exists( 'RGC_CMB2_Field_Tooltip' ) ) {

    /**
     * Class RGC_CMB2_Field_Tooltip
     */
    class RGC_CMB2_Field_Tooltip {

        /**
         * Current version number
         */
        const VERSION = '1.0.3';

        /**
         * Initialize the plugin by hooking into CMB2
         */
        public function __construct() {
            add_action( 'admin_enqueue_scripts', array( $this, 'setup_admin_scripts' ) );

            // TODO: Find a way to add this content if field has parameter 'tooltip' => desc
        }

        /**
         * @param  array        $field_args     Current field args
         * @param  CMB2_Field   $field          Current field object
         */
        public function label_cb( $field_args, $field ) {
            $field_args = $this->parse_field_args( $field_args, 'top' );

            if( empty( $field_args['tooltip']['desc'] ) ) {
                if( isset( $field_args['name'] ) ) {
                    ?>
                    <label for="<?php echo esc_attr( $field_args['id'] ); ?>"><?php echo $field_args['name']; ?></label>
                    <?php
                }

                return;
            }

            ?>
            <label for="<?php echo esc_attr( $field_args['id'] ); ?>"><?php echo $field_args['name']; ?>
                <?php $this->tooltip_html( $field_args['tooltip']['desc'], $field_args['tooltip']['icon'], $field_args['tooltip']['position'] ); ?>
            </label>
            <?php
        }

        /**
         * @param  array        $field_args     Current field args
         * @param  CMB2_Field   $field          Current field object
         */
        public function after_field( $field_args, $field ) {
            $field_args = $this->parse_field_args( $field_args, 'top' );

            if( empty( $field_args['tooltip']['desc'] ) ) {
                return;
            }

            $this->tooltip_html( $field_args['tooltip']['desc'], $field_args['tooltip']['icon'], $field_args['tooltip']['position'] );
        }

        public function tooltip_html( $desc, $icon = 'cmb-tooltip', $position = 'top' ) {
            ?>
            <span class="cmb-tooltip">
                <span class="dashicons dashicons-<?php echo esc_attr( $icon ); ?>"></span>
                <span class="cmb-tooltip-desc cmb-tooltip-<?php echo esc_attr( $position ); ?>"><?php echo $desc; ?></span>
            </span>
            <?php
        }

        /**
         * @param   array   $field_args     Current field args
         * @return  array
         */
        private function parse_field_args( $field_args, $position = 'top' ) {

            $defaults = array(
                'icon'          => 'cmb-tooltip',
                'position'      => $position,
                'desc'          => '',
            );

            // Support for 'tooltip' => 'Content'
            if( isset( $field_args['tooltip'] ) && ! is_array( $field_args['tooltip'] ) && ! empty( $field_args['tooltip'] ) ) {
                $defaults['desc'] = $field_args['tooltip'];

                // Turn into array( 'icon', 'desc' )
                $field_args['tooltip'] = $defaults;
            }

            $field_args['tooltip'] = array_merge(
                $defaults,
                ( ( isset( $field_args['tooltip'] ) && is_array( $field_args['tooltip'] ) ) ? $field_args['tooltip'] : array() )
            );

            return $field_args;
        }

        /**
         * Enqueue scripts and styles
         */
        public function setup_admin_scripts() {
            wp_enqueue_style( 'cmb-tooltip', plugins_url( 'tooltip.css', __FILE__ ), array(), self::VERSION );
        }

    }

    // TODO: Temporal solution to output html content
    function cmb_tooltip_label_cb( $field_args, $field ) {
        $cmb2_field_tooltip = new RGC_CMB2_Field_Tooltip();

        $cmb2_field_tooltip->label_cb( $field_args, $field );
    }

    function cmb_tooltip_after_field( $field_args, $field ) {
        $cmb2_field_tooltip = new RGC_CMB2_Field_Tooltip();

        $cmb2_field_tooltip->after_field( $field_args, $field );
    }

    function cmb_tooltip_html( $desc, $icon = 'cmb-tooltip', $position = 'top' ) {

        $cmb2_field_tooltip = new RGC_CMB2_Field_Tooltip();

        $cmb2_field_tooltip->tooltip_html( $desc, $icon, $position );

    }

    function cmb_tooltip_get_html( $desc, $icon = 'cmb-tooltip', $position = 'top' ) {

        $cmb2_field_tooltip = new RGC_CMB2_Field_Tooltip();

        ob_start();
        $cmb2_field_tooltip->tooltip_html( $desc, $icon, $position );
        $output = ob_get_clean();

        return $output;

    }

    $cmb2_field_tooltip = new RGC_CMB2_Field_Tooltip();
}