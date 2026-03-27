<?php
/**
 * @package      RGC\CMB2\Conditional_Fields
 * @author       Ruben Garcia (RubenGC) <rubengcdev@gmail.com>, GamiPress <contact@gamipress.com>
 * @copyright    Copyright (c) Tsunoa
 *
 * Plugin Name: CMB2 Conditional Fields
 * Plugin URI: https://github.com/rubengc/cmb2-field-conditional-fields
 * GitHub Plugin URI: https://github.com/rubengc/cmb2-field-conditional-fields
 * Description: Able to show/hide conditional fields.
 * Version: 1.0.2
 * Author: Tsunoa
 * Author URI: https://tsunoa.com/
 * License: GPLv2+
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// Prevent CMB2 autoload adding "RGC_" at start
if( !class_exists( 'RGC_CMB2_Conditional_Fields' ) ) {

    /**
     * Class RGC_CMB2_Conditional_Fields
     */
    class RGC_CMB2_Conditional_Fields {

        /**
         * Current version number
         */
        const VERSION = '1.0.2';

        function conditions_sample() {
            // NOTE: DO NOT use the 'classes' parameter, use 'custom_classes' instead

            $field_args['show_if'] = array(
                // Text field
                'text-field' => 'empty',
                'text-field' => 'not empty',
                'text-field' => '! empty',
                // Checkbox
                'checkbox-field' => 'checked',
                'checkbox-field' => 'not checked',
                'checkbox-field' => '! checked',
                // Multicheck
                'multicheck-field' => 'option_1',
            );

            $field_args['hide_if'] = array(
                // Text field
                'text-field' => 'empty',
                'text-field' => 'not empty',
                'text-field' => '! empty',
                // Checkbox
                'checkbox-field' => 'checked',
                'checkbox-field' => '! checked',
                'checkbox-field' => 'not checked',
                // Multicheck
                'multicheck-field' => 'option_1',
            );
        }

        /**
         * Initialize the plugin by hooking into CMB2
         */
        public function __construct() {
            add_action( 'admin_enqueue_scripts', array( $this, 'setup_admin_scripts' ) );

            add_filter( 'cmb2_row_classes', array( $this, 'row_classes' ), 10, 2 );
        }

        /**
         * @param  string       $classes        Current field classes
         * @param  CMB2_Field   $field          Current field object
         * @return string
         */
        public function row_classes( $classes, $field ) {

            $field_args = $field->args();

            if( isset( $field_args['custom_classes'] ) ) {
                $classes .= ' ' . $field_args['custom_classes'];
            }

            if( ! isset( $field_args['show_if'] ) && ! isset( $field_args['hide_if'] ) ) {
                return $classes;
            }

            $classes .= ' cmb-conditional-fields';

            if( isset( $field_args['show_if'] ) && is_array( $field_args['show_if'] ) ) {
                foreach( $field_args['show_if'] as $field => $condition ) {

                    $classes .= ' cmb-show-if-field-' . esc_attr( $field );

                    if( is_array( $condition ) ) {
                        foreach( $condition as $condition_value ) {
                            $condition_value = $this->parse_condition( $condition_value );

                            $classes .= ' cmb-show-if-field-' . esc_attr( $field ) . '-condition-' . esc_attr( $condition_value );
                        }
                    } else {
                        $condition = $this->parse_condition( $condition );
                        $classes .= ' cmb-show-if-field-' . esc_attr( $field ) . '-condition-' . esc_attr( $condition );
                    }


                }
            }

            if( isset( $field_args['hide_if'] ) && is_array( $field_args['hide_if'] ) ) {
                foreach( $field_args['hide_if'] as $field => $condition ) {

                    $classes .= ' cmb-hide-if-field-' . esc_attr( $field );

                    if( is_array( $condition ) ) {
                        foreach( $condition as $condition_value ) {
                            $condition_value = $this->parse_condition( $condition_value );

                            $classes .= ' cmb-hide-if-field-' . esc_attr( $field ) . '-condition-' . esc_attr( $condition_value );
                        }
                    } else {
                        $condition = $this->parse_condition( $condition );
                        $classes .= ' cmb-hide-if-field-' . esc_attr( $field ) . '-condition-' . esc_attr( $condition );
                    }

                }
            }

            return $classes;
        }

        private function parse_condition( $condition ) {

            // ! checked to not-checked
            $condition = str_replace( '! ', 'not-', $condition );

            // !checked to not-checked
            $condition = str_replace( '!', 'not-', $condition );

            // not checked to not-checked
            $condition = str_replace( ' ', '-', $condition );

            return $condition;

        }

        /**
         * Enqueue scripts and styles
         */
        public function setup_admin_scripts() {
            wp_register_script( 'cmb-conditional-fields', plugins_url( 'js/conditional-fields.js', __FILE__ ), array( 'jquery' ), self::VERSION, true );

            wp_enqueue_script( 'cmb-conditional-fields' );
        }

    }

$cmb2_conditional_fields = new RGC_CMB2_Conditional_Fields();
}