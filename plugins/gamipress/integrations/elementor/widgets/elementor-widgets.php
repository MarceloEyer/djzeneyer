<?php
/**
 * Elementor Widgets
 *
 * @package GamiPress\Elementor_Forms\Widgets\Elementor_Widgets
 * @since 1.0.0
 */

// Exit if accessed directly

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * GamiPress Elementor widgets setup
 *
 * @since       1.0.0
 */
function gamipress_elementor_register_widgets_setup() {

    if ( ! class_exists( '\Elementor\Widget_Base' ) ) {
        return;
    }

    if ( ! class_exists( 'Widget_GamiPress_Elementor' ) ) {

        /**
         * Elementor class for GamiPress widgets
         *
         * @since       1.0.0
         */
        class Widget_GamiPress_Elementor extends \Elementor\Widget_Base {

            private $_widget_name = null;
            private $_widget_instance = null;

            public function hide_on_search() {
                return false;
            }

            public function get_name() {
                // Add prefix to avoid conflict with widgets in WordPress category
                return 'gamipress-elementor-' . $this->get_widget_instance()->id_base;
            }

            public function get_title() {
                return $this->get_widget_instance()->name;
            }

            public function get_categories() {
                // GamiPress category
                return [ 'gamipress-elementor' ]; 
            }

            public function get_icon() {
                $widget_id = $this->get_widget_instance()->id_base;
                
                $icons = array(
                    'gamipress_achievement_widget'                      => 'dashicons dashicons-awards',
                    'gamipress_achievements_widget'                     => 'dashicons dashicons-awards',
                    'gamipress_last_achievements_earned_widget'         => 'dashicons dashicons-awards',
                    'gamipress_earnings_widget'                         => 'dashicons dashicons-gamipress',
                    'gamipress_logs_widget'                             => 'dashicons dashicons-editor-ul',
                    'gamipress_user_points_widget'                      => 'dashicons dashicons-star-filled',
                    'gamipress_site_points_widget'                      => 'dashicons dashicons-star-filled',
                    'gamipress_points_widget'                           => 'dashicons dashicons-star-filled',
                    'gamipress_points_types_widget'                     => 'dashicons dashicons-star-filled',
                    'gamipress_rank_widget'                             => 'dashicons dashicons-rank',
                    'gamipress_ranks_widget'                            => 'dashicons dashicons-rank',
                    'gamipress_user_rank_widget'                        => 'dashicons dashicons-rank',
                    'gamipress_email_settings_widget'                   => 'dashicons dashicons-email',
                    'gamipress_inline_achievement_widget'               => 'dashicons dashicons-awards',
                    'gamipress_inline_last_achievements_earned_widget'  => 'dashicons dashicons-awards',
                    'gamipress_inline_rank_widget'                      => 'dashicons dashicons-rank',
                    'gamipress_inline_user_rank_widget'                 => 'dashicons dashicons-rank',
                    'gamipress_vimeo_widget'                            => 'dashicons dashicons-gamipress',
                    'gamipress_youtube_widget'                          => 'dashicons dashicons-gamipress',
                );

                return isset( $icons[ $widget_id ] ) ? $icons[ $widget_id ] : 'eicon-wordpress';
            }

            public function get_keywords() {
                return [ 'gamipress', 'widget', 'custom' ];
            }

            public function get_style_depends(): array {
                return [ 'e-swiper' ];
            }

            public function get_script_depends(): array {
                return [ 'swiper' ];
            }

            public function is_reload_preview_required() {
                return true;
            }

            public function get_form() {
                $instance = $this->get_widget_instance();
                ob_start();
                echo '<div class="widget-inside media-widget-control"><div class="form wp-core-ui">';
                echo '<input type="hidden" class="id_base" value="' . esc_attr( $instance->id_base ) . '" />';
                echo '<input type="hidden" class="widget-id" value="widget-' . esc_attr( $this->get_id() ) . '" />';
                echo '<div class="widget-content">';
                $widget_data = $this->get_settings( 'wp' );
                $instance->form( $widget_data );
                do_action( 'in_widget_form', $instance, null, $widget_data );
                echo '</div></div></div>';
                return ob_get_clean();
            }

            public function get_widget_instance() {
                if ( is_null( $this->_widget_instance ) ) {
                    global $wp_widget_factory;
                    if ( isset( $wp_widget_factory->widgets[ $this->_widget_name ] ) ) {
                        $this->_widget_instance = $wp_widget_factory->widgets[ $this->_widget_name ];
                        $this->_widget_instance->_set( 'REPLACE_TO_ID' );
                    } elseif ( class_exists( $this->_widget_name ) ) {
                        $this->_widget_instance = new $this->_widget_name();
                        $this->_widget_instance->_set( 'REPLACE_TO_ID' );
                    }
                }
                return $this->_widget_instance;
            }

            protected function get_init_settings() {
                $settings = parent::get_init_settings();
                if ( ! empty( $settings['wp'] ) ) {
                    $widget = $this->get_widget_instance();
                    $instance = $widget->update( $settings['wp'], [] );
                    $settings['wp'] = apply_filters( 'widget_update_callback', $instance, $settings['wp'], [], $widget );
                }
                return $settings;
            }

            protected function register_controls() {
                $this->add_control(
                    'wp',
                    [
                        'label' => esc_html__( 'Form', 'elementor' ),
                        'type' => \Elementor\Controls_Manager::WP_WIDGET,
                        'widget' => $this->get_name(),
                        'id_base' => $this->get_widget_instance()->id_base,
                    ]
                );
            }

            protected function render() {
                $default_widget_args = [
                    'widget_id' => $this->get_name(),
                    'before_widget' => '',
                    'after_widget' => '',
                    'before_title' => '<h5>',
                    'after_title' => '</h5>',
                ];
                $default_widget_args = apply_filters( 'elementor/widgets/wordpress/widget_args', $default_widget_args, $this );
                $this->get_widget_instance()->widget( $default_widget_args, $this->get_settings( 'wp' ) );
            }

            public function __construct( $data = [], $args = null ) {
                $this->_widget_name = $args['widget_name'];
                parent::__construct( $data, $args );
            }
        }

        /**
         * Register GamiPress category
         *
         * @since       1.0.0
         * @return      void
         */
        function gamipress_elementor_register_category( $elements_manager ) {
            
            $elements_manager->add_category(
                'gamipress-elementor',
                [
                    'title' => __( 'GamiPress', 'gamipress' ),
                    'icon'  => 'fa fa-trophy',
                ]
            );
        }
        add_action( 'elementor/elements/categories_registered', 'gamipress_elementor_register_category' );

        /**
         * Register the GamiPress widgets
         *
         * @since       1.0.0
         */
        function gamipress_elementor_register_widgets ( $widgets_manager ) {

            global $wp_widget_factory;

            // We go through all the widgets registered in WordPress
            foreach ( $wp_widget_factory->widgets as $widget_class => $widget_obj ) {
                
                // To get GamiPress widgets
                if ( strpos( $widget_class, 'gamipress' ) === false ) continue;

                $widgets_manager->register( 
                    new Widget_GamiPress_Elementor( [], [ 'widget_name' => $widget_class ] ) 
                );
            }
        }
        add_action( 'elementor/widgets/register', 'gamipress_elementor_register_widgets', 100 );
    }
}
add_action( 'elementor/init', 'gamipress_elementor_register_widgets_setup' );

/**
 * Enqueue GamiPress CSS
 *
 * @since       1.0.0
 */
/**
 * Enqueue GamiPress CSS
 *
 * @since       1.0.0
 */
function gamipress_elementor_enqueue_css_script () {
    // Use minified libraries if SCRIPT_DEBUG is turned off
    $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

    wp_enqueue_style( 'gamipress-admin', GAMIPRESS_URL . 'assets/css/gamipress-admin' . $suffix . '.css' );

    // Custom CSS for descriptions and switch
        $custom_css = "
            .cmb-tooltip-desc.cmb-tooltip-left {
                display: block;
                font-weight: normal;
                line-height: normal;
                opacity: 0.8;
            }
            .gamipress-switch input{
                border: none !important;
            }
            .gamipress-switch input + label:after {
                margin-top: 2px;
            }
            .gamipress-switch input:checked:after {
                margin-top: 7px;
            }
    
        ";
        wp_add_inline_style( 'gamipress-admin', $custom_css );

}
add_action( 'elementor/editor/after_enqueue_scripts', 'gamipress_elementor_enqueue_css_script' );
