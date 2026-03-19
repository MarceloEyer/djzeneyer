<?php
/**
 * Badge Builder Page
 *
 * @package     GamiPress\Admin\Badge_Builder
 * @author      GamiPress <contact@gamipress.com>, Ruben Garcia <rubengcdev@gmail.com>
 * @since       1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Badge Builder page
 *
 * @since  1.0.0
 *
 * @return void
 */
function gamipress_badge_builder_page() {

    $icons = gamipress_badge_builder_get_icons();

    $title = esc_html__( 'GamiPress Badge Builder', 'gamipress' );

    $title = str_replace( 'GamiPress', '<span>GamiPress</span>', $title );

    /**
     * Badge Builder page title
     *
     * @since 7.0.0
     *
     * @param string $title
     *
     * @return string $title
     */
    $title = apply_filters( 'gamipress_badge_builder_page_title', $title );

    ?>

    <div class="wrap gamipress-badge-builder">

        <div class="gamipress-badge-builder-top">
            <?php // Logo ?>
            <div class="gamipress-logo">
                <h1 class="wp-heading-inline"><?php echo gamipress_dashicon( 'gamipress' ) . $title; ?></h1>
            </div>

            <div class="gamipress-badge-builder-top-filename">
                <input type="text" id="filename" value="" placeholder="<?php echo esc_attr( __( 'Enter badge name here...', 'gamipress' ) ); ?>">
            </div>

            <?php

            $import_actions = array(
                'upload-gpb' => array(
                    'name' => __( 'Upload Badge', 'gamipress' ),
                    'desc' => __( 'Upload a GPB file', 'gamipress' ),
                    'accept' => '.gpb',
                ),
            );

            /**
             * Badge Builder import actions
             *
             * @since 7.0.0
             *
             * @param array $import_actions
             *
             * @return array $import_actions
             */
            $import_actions = apply_filters( 'gamipress_badge_builder_import_actions', $import_actions );

            ?>

            <div class="gamipress-badge-builder-top-actions">
                <button class="button gamipress-badge-builder-action gamipress-badge-builder-action-upload">
                    <?php esc_html_e( 'Upload', 'gamipress' ); ?>
                    <ul class="gamipress-badge-builder-action-dropdown gamipress-badge-builder-action-upload-dropdown">
                        <?php foreach( $import_actions as $action_id => $action ) : ?>
                            <li class="gamipress-badge-builder-<?php echo esc_attr( $action_id ); ?>">
                                <strong><?php echo esc_html( $action['name'] ); ?></strong>
                                <span><?php echo esc_html( $action['desc'] ); ?></span>
                                <input type="file" accept="<?php echo esc_attr( $action['accept'] ); ?>" id="gamipress-badge-builder-<?php echo esc_attr( $action_id ); ?>-input">
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </button>

                <?php

                $export_actions = array(
                    'save-gpb' => array(
                        'name' => __( 'Download Badge', 'gamipress' ),
                        'desc' => __( 'Download as GPB', 'gamipress' ),
                    ),
                    'save-png' => array(
                        'name' => __( 'Download as PNG', 'gamipress' ),
                        'desc' => __( 'To upload to WordPress', 'gamipress' ),
                    ),
                );

                /**
                 * Badge Builder export actions
                 *
                 * @since 7.0.0
                 *
                 * @param array $export_actions
                 *
                 * @return array $export_actions
                 */
                $export_actions = apply_filters( 'gamipress_badge_builder_export_actions', $export_actions );

                ?>

                <button class="button button-primary gamipress-badge-builder-action gamipress-badge-builder-action-save">
                    <?php esc_html_e( 'Download', 'gamipress' ); ?>
                    <ul class="gamipress-badge-builder-action-dropdown gamipress-badge-builder-action-save-dropdown">
                        <?php foreach( $export_actions as $action_id => $action ) : ?>
                            <li class="gamipress-badge-builder-<?php echo esc_attr( $action_id ); ?>">
                                <strong><?php echo esc_html( $action['name'] ); ?></strong>
                                <span><?php echo esc_html( $action['desc'] ); ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </button>
            </div>
        </div>

        <div class="gamipress-badge-builder-toolbar">

            <?php

            $tools = array(
                'add-icon' => array(
                    'name' => __( 'Add Shape', 'gamipress' ),
                    'icon' => 'insert',
                ),
                'open-generate-badge' => array(
                    'name' => __( 'Generate Badge', 'gamipress' ),
                    'icon' => 'awards',
                ),
                'open-generate-multiple' => array(
                    'name' => __( 'Generate Multiple', 'gamipress' ),
                    'icon' => 'awards',
                ),
            );

            /**
             * Badge Builder toolbar tools
             *
             * @since 7.0.0
             *
             * @param array $tools
             *
             * @return array $tools
             */
            $tools = apply_filters( 'gamipress_badge_builder_toolbar_tools', $tools );

            ?>

            <?php foreach( $tools as $tool_id => $tool ) : ?>
                <span class="gamipress-badge-builder-toolbar-control" data-action="<?php echo esc_attr( $tool_id ); ?>">
                    <?php echo gamipress_dashicon( $tool['icon'] ); ?> <?php echo esc_html( $tool['name'] ); ?>
                </span>
            <?php endforeach; ?>

        </div>

        <div class="gamipress-badge-builder-view">
            <canvas id="gamipress-badge-builder-canvas" width="600" height="600"></canvas>
        </div>

        <div class="gamipress-badge-builder-view-backup">
            <canvas id="gamipress-badge-builder-canvas-backup" width="600" height="600"></canvas>
        </div>

        <div class="gamipress-badge-builder-generate-multiple-view">
            <?php for( $i = 0; $i < 15; $i++ ) : ?>
                <div class="gamipress-badge-builder-preview" data-index="<?php echo esc_attr( $i ); ?>">
                    <canvas id="gamipress-badge-builder-preview-canvas-<?php echo esc_attr( $i ); ?>" width="150" height="150"></canvas>
                    <div class="gamipress-badge-builder-preview-actions">
                        <span class="gamipress-badge-builder-preview-action cmb-tooltip">
                            <?php echo gamipress_dashicon( 'info-outline' ); ?>
                            <span class="cmb-tooltip-desc cmb-tooltip-top">
                                <?php esc_html_e( 'Palette', 'gamipress' ); ?>: <span class="gamipress-badge-builder-preview-palette-name"></span>
                            </span>
                        </span>
                        <span class="gamipress-badge-builder-preview-action cmb-tooltip" data-action="generate-multiple-edit">
                            <?php echo gamipress_dashicon( 'edit' ); ?>
                            <span class="cmb-tooltip-desc cmb-tooltip-top">
                                <?php esc_html_e( 'Edit', 'gamipress' ); ?>
                            </span>
                        </span>
                        <span class="gamipress-badge-builder-preview-action gamipress-badge-builder-preview-save-action cmb-tooltip">
                            <?php echo gamipress_dashicon( 'download' ); ?>
                            <span class="cmb-tooltip-desc cmb-tooltip-top">
                                <?php esc_html_e( 'Download', 'gamipress' ); ?>
                            </span>
                            <ul class="gamipress-badge-builder-preview-action-dropdown gamipress-badge-builder-preview-action-download-dropdown">
                                <?php foreach( $export_actions as $action_id => $action ) : ?>
                                    <li class="gamipress-badge-builder-preview-<?php echo esc_attr( $action_id ); ?>">
                                        <strong><?php echo esc_html( $action['name'] ); ?></strong>
                                        <span><?php echo esc_html( $action['desc'] ); ?></span>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        </span>
                    </div>

                </div>
            <?php endfor; ?>
        </div>

        <div class="gamipress-badge-builder-sidebar">

            <div class="gamipress-badge-builder-generate-badge-options" style="display: none;">
                <?php

                $fields = array(
                    'badge_palette' => array(
                        'name' => __( 'Color Palette', 'gamipress' ),
                        'type' => 'radio',
                        'options' => array(
                            ''          => __( 'Random', 'gamipress' ) . gamipress_badge_builder_colors_sample_html( array(
                                    '#e3574d',
                                    '#88bdab',
                                    '#215E61',
                                ) ),
                            'material'  => __( 'Material', 'gamipress' ) . gamipress_badge_builder_colors_sample_html( array(
                                    '#e3574d',
                                    '#71b243',
                                    '#3ea5d0',
                                ) ),
                            'pastel'    => __( 'Pastel', 'gamipress' ) . gamipress_badge_builder_colors_sample_html( array(
                                    '#f7a3b2',
                                    '#88bdab',
                                    '#bd89c6',
                                ) ),
                            'vintage'   => __( 'Vintage', 'gamipress' ) . gamipress_badge_builder_colors_sample_html( array(
                                    '#FE7F2D',
                                    '#5C6F2B',
                                    '#215E61',
                                ) ),
                        ),
                    ),
                    'generate' => array(
                        'name' => __( 'Generate', 'gamipress' ),
                        'type' => 'text',
                        'render_row_cb' => 'gamipress_badge_builder_generate_badge_field',
                    ),
                );

                /**
                 * Badge Builder generate fields
                 *
                 * @since 7.0.0
                 *
                 * @param array $fields
                 *
                 * @return array $fields
                 */
                $fields = apply_filters( 'gamipress_badge_builder_generate_badge_fields', $fields );

                foreach ($fields as $field_id => $field) {
                    $fields[$field_id]['id'] = $field_id;
                }

                $cmb2 = new CMB2(array(
                    'id' => 'gamipress_badge_builder',
                    'classes' => 'gamipress-form gamipress-box-form',
                    'hookup' => false,
                    'fields' => $fields
                ));

                $cmb2->object_id('gamipress_badge_builder');

                CMB2_Hookup::enqueue_cmb_css();
                CMB2_Hookup::enqueue_cmb_js();

                $cmb2->show_form();

                ?>
            </div>

            <div class="gamipress-badge-builder-generate-multiple-options" style="display: none;">
                <?php

                $fields = array(
                    'multiple_palette' => array(
                        'name' => __( 'Color Palette', 'gamipress' ),
                        'type' => 'radio',
                        'options' => array(
                            ''          => __( 'Random', 'gamipress' ) . gamipress_badge_builder_colors_sample_html( array(
                                    '#e3574d',
                                    '#88bdab',
                                    '#215E61',
                                ) ),
                            'material'  => __( 'Material', 'gamipress' ) . gamipress_badge_builder_colors_sample_html( array(
                                    '#e3574d',
                                    '#71b243',
                                    '#3ea5d0',
                                ) ),
                            'pastel'    => __( 'Pastel', 'gamipress' ) . gamipress_badge_builder_colors_sample_html( array(
                                    '#f7a3b2',
                                    '#88bdab',
                                    '#bd89c6',
                                ) ),
                            'vintage'   => __( 'Vintage', 'gamipress' ) . gamipress_badge_builder_colors_sample_html( array(
                                    '#FE7F2D',
                                    '#5C6F2B',
                                    '#215E61',
                                ) ),
                        ),
                    ),
                    'generate' => array(
                        'name' => __( 'Generate', 'gamipress' ),
                        'type' => 'text',
                        'render_row_cb' => 'gamipress_badge_builder_generate_multiple_field',
                    ),
                );

                /**
                 * Badge Builder generate fields
                 *
                 * @since 7.0.0
                 *
                 * @param array $fields
                 *
                 * @return array $fields
                 */
                $fields = apply_filters( 'gamipress_badge_builder_generate_multiple_fields', $fields );

                foreach ($fields as $field_id => $field) {
                    $fields[$field_id]['id'] = $field_id;
                }

                $cmb2 = new CMB2(array(
                    'id' => 'gamipress_badge_builder',
                    'classes' => 'gamipress-form gamipress-box-form',
                    'hookup' => false,
                    'fields' => $fields
                ));

                $cmb2->object_id('gamipress_badge_builder');

                CMB2_Hookup::enqueue_cmb_css();
                CMB2_Hookup::enqueue_cmb_js();

                $cmb2->show_form();

                ?>
            </div>

            <div class="gamipress-badge-builder-selection-options">
                <?php

                $fields = array(
                    'icon' => array(
                        'name' => __( 'Shape', 'gamipress' ),
                        'type' => 'text',
                        'attributes' => array(
                          'type' => 'hidden'
                        ),
                        'after_field' => 'gamipress_badge_builder_icon_field',
                    ),
                    // FILL
                    'fill_title' => array(
                        'name' => __( 'Color', 'gamipress' ),
                        'type' => 'title',
                    ),
                    'fill_color_type' => array(
                        'name' => __( 'Color Type', 'gamipress' ),
                        'type' => 'select',
                        'options' => array(
                            'single' => __( 'Single', 'gamipress' ),
                            'gradient' => __( 'Gradient', 'gamipress' ),
                        ),
                    ),
                    'fill_color_type_notice' => array(
                        'name' => '&nbsp;',
                        'type' => 'text',
                        'desc' => gamipress_badge_builder_get_pro_notice(),
                        'attributes' => array( 'type' => 'hidden', ),
                        'classes_cb' => 'cmb_conditional_fields_classes_cb',
                        'show_if' => array( 'fill_color_type' => 'gradient' ),
                    ),
                    'fill' => array(
                        'name' => __( 'Color', 'gamipress' ),
                        'type' => 'colorpicker',
                        'default' => '#000000ff',
                    ),
                    // BORDER
                    'stroke_title' => array(
                        'name' => __( 'Border', 'gamipress' ),
                        'type' => 'title',
                    ),
                    'stroke_width' => array(
                        'name' => __( 'Width', 'gamipress' ),
                        'type' => 'text',
                        'attributes' => array(
                            'type' => 'number',
                            'min' => '0',
                            'step' => '1',
                        ),
                        'default' => '0',
                    ),
                    'stroke_color_type' => array(
                        'name' => __( 'Color Type', 'gamipress' ),
                        'type' => 'select',
                        'options' => array(
                            'single' => __( 'Single', 'gamipress' ),
                            'gradient' => __( 'Gradient', 'gamipress' ),
                        ),
                        'classes_cb' => 'cmb_conditional_fields_classes_cb',
                        'hide_if' => array(
                            'stroke_width' => '0'
                        ),
                    ),
                    'stroke_color_type_notice' => array(
                        'name' => '&nbsp;',
                        'type' => 'text',
                        'desc' => gamipress_badge_builder_get_pro_notice(),
                        'attributes' => array( 'type' => 'hidden', ),
                        'classes_cb' => 'cmb_conditional_fields_classes_cb',
                        'show_if' => array( 'stroke_color_type' => 'gradient' ),
                    ),
                    'stroke' => array(
                        'name' => __( 'Color', 'gamipress' ),
                        'type' => 'colorpicker',
                        'default' => '#ff0000',
                        'classes_cb' => 'cmb_conditional_fields_classes_cb',
                        'hide_if' => array(
                            'stroke_width' => '0'
                        ),
                    ),
                    'stroke_type' => array(
                        'name' => __( 'Corner Type', 'gamipress' ),
                        'type' => 'select',
                        'options' => array(
                            'round' => __( 'Round', 'gamipress' ),
                            'miter' => __( 'Square', 'gamipress' ),
                        ),
                        'classes_cb' => 'cmb_conditional_fields_classes_cb',
                        'hide_if' => array(
                            'stroke_width' => '0'
                        ),
                    ),
                    // TOOLS
                    'tools_title' => array(
                        'name' => __( 'Tools', 'gamipress' ),
                        'type' => 'title',
                    ),
                    'tools' => array(
                        'name' => __( 'Tools', 'gamipress' ),
                        'type' => 'text',
                        'render_row_cb' => 'gamipress_badge_builder_tools_field',
                    ),
                    // SHORTCUTS
                    'shortcuts_title' => array(
                        'name' => __( 'Shortcuts', 'gamipress' ) . '<a href="#" class="gamipress-badge-builder-shortcuts-toggle">' . __( 'Show', 'gamipress' ) . '</a>',
                        'type' => 'title',
                    ),
                    'shortcuts' => array(
                        'name' => __( 'Shortcuts', 'gamipress' ),
                        'type' => 'text',
                        'render_row_cb' => 'gamipress_badge_builder_shortcuts_field',
                    ),
                );

                /**
                 * Badge Builder selection fields
                 *
                 * @since 7.0.0
                 *
                 * @param array $fields
                 *
                 * @return array $fields
                 */
                $fields = apply_filters( 'gamipress_badge_builder_selection_fields', $fields );

                foreach ($fields as $field_id => $field) {
                    $fields[$field_id]['id'] = $field_id;
                }

                $cmb2 = new CMB2(array(
                    'id' => 'gamipress_badge_builder',
                    'classes' => 'gamipress-form gamipress-box-form',
                    'hookup' => false,
                    'fields' => $fields
                ));

                $cmb2->object_id('gamipress_badge_builder');

                CMB2_Hookup::enqueue_cmb_css();
                CMB2_Hookup::enqueue_cmb_js();

                $cmb2->show_form();

                ?>
            </div>

            <div class="gamipress-badge-builder-icon-selector">
                <div class="gamipress-badge-builder-icon-selector-filter">
                    <input type="text" placeholder="<?php echo esc_attr( __( 'Type to filter...', 'gamipress' ) ); ?>">
                    <?php echo gamipress_dashicon( 'no' ); ?>
                </div>

                <?php
                foreach( $icons as $group_id => $group ) :
                    if( count( $group['icons'] ) === 0 ) continue; ?>
                    <strong><?php echo $group['name'] ?></strong>
                    <div class="gamipress-badge-builder-icons gamipress-badge-builder-icons-<?php echo esc_attr( $group_id ); ?>">
                        <?php foreach( $group['icons'] as $icon_id => $icon ) : ?>
                            <div class="gamipress-badge-builder-icon gamipress-badge-builder-icon-<?php echo esc_attr( $icon_id ); ?> cmb-tooltip" data-id="<?php echo esc_attr( $icon_id ); ?>">
                                <span class="gamipress-badge-builder-icon-svg"><?php echo $icon['svg']; ?></span>
                                <span class="cmb-tooltip-desc cmb-tooltip-top"><?php echo esc_html( $icon['name'] ); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach;

                ?>
            </div>

        </div>

    </div>

    <?php
}

/**
 * Pro notice
 *
 * @since 1.0.0
 *
 * @return string
 */
function gamipress_badge_builder_get_pro_notice() {
    return sprintf( __( 'Available in %s.', 'gamipress' ),
        '<a href="https://gamipress.com/add-ons/gamipress-badge-builder-pro/" target="_blank">'
            . __( 'Pro version', 'gamipress' )
        . '</a>'
    );
}

/**
 * Color Palettes
 *
 * @since 1.0.0
 *
 * @return string
 */
function gamipress_badge_builder_get_color_palettes() {

    return apply_filters( 'gamipress_badge_builder_color_palettes', array(
        'material'  => array(
                'name' => __( 'Material', 'gamipress' ),
                'colors_sample' => gamipress_badge_builder_colors_sample_html( array( '#e3574d', '#71b243', '#3ea5d0', ) ),
        ),
        'pastel'  => array(
            'name' => __( 'Pastel', 'gamipress' ),
            'colors_sample' => gamipress_badge_builder_colors_sample_html( array( '#f7a3b2', '#88bdab', '#bd89c6', ) ),
        ),
        'vintage'  => array(
            'name' => __( 'Vintage', 'gamipress' ),
            'colors_sample' => gamipress_badge_builder_colors_sample_html( array( '#FE7F2D', '#5C6F2B', '#215E61', ) ),
        ),
    ) );

}

/**
 * Colors sample HTML
 *
 * @since 1.0.0
 *
 * @param array $colors Hex colors
 */
function gamipress_badge_builder_colors_sample_html( $colors ) {
    ob_start(); ?>

    <div class="gamipress-badge-builder-colors-sample">

    <?php foreach( $colors as $color ) : ?>
        <span class="gamipress-badge-builder-color-sample" style="background-color: <?php echo esc_attr( $color ); ?>"></span>
    <?php endforeach; ?>

    </div>

    <?php return ob_get_clean();
}

/**
 * Generate badge field buttons
 *
 * @since 1.0.0
 *
 * @param  object $field_args Current field args
 * @param  object $field      Current field object
 */
function gamipress_badge_builder_generate_badge_field( $field_args, $field ) {
    ?>
    <div class="gamipress-badge-builder-generate-badge-options-actions">
        <button class="button button-primary gamipress-badge-builder-sidebar-control" data-action="generate-badge"><?php esc_html_e( 'Generate', 'gamipress' ); ?></button>
        <button class="button gamipress-badge-builder-sidebar-control" data-action="close-generate-badge"><?php esc_html_e( 'Close', 'gamipress' ); ?></button>
    </div>
    <?php
}

/**
 * Generate multiple field buttons
 *
 * @since 1.0.0
 *
 * @param  object $field_args Current field args
 * @param  object $field      Current field object
 */
function gamipress_badge_builder_generate_multiple_field( $field_args, $field ) {
    ?>
    <div class="gamipress-badge-builder-generate-multiple-options-actions">
        <button class="button button-primary gamipress-badge-builder-sidebar-control" data-action="generate-multiple"><?php esc_html_e( 'Generate', 'gamipress' ); ?></button>
        <button class="button gamipress-badge-builder-sidebar-control" data-action="close-generate-multiple"><?php esc_html_e( 'Close', 'gamipress' ); ?></button>
    </div>
    <?php
}

/**
 * Icon field
 *
 * @since 1.0.0
 *
 * @param  object $field_args Current field args
 * @param  object $field      Current field object
 */
function gamipress_badge_builder_icon_field( $field_args, $field ) {
    ?>
    <div class="gamipress-badge-builder-icon cmb-tooltip" data-id="">
        <span class="gamipress-badge-builder-icon-svg"></span>
        <span class="cmb-tooltip-desc cmb-tooltip-left"></span>
    </div>
    <?php
}

/**
 * Font Style field
 *
 * @since 1.0.0
 *
 * @param  object $field_args Current field args
 * @param  object $field      Current field object
 */
function gamipress_badge_builder_text_align_field( $field_args, $field ) {
    $tools = array(
        'text-align-left' => array(
            'name' => __( 'Left', 'gamipress' ),
            'icon' => 'editor-alignleft',
        ),
        'text-align-center' => array(
            'name' => __( 'Center', 'gamipress' ),
            'icon' => 'editor-aligncenter',
        ),
        'text-align-right' => array(
            'name' => __( 'Right', 'gamipress' ),
            'icon' => 'editor-alignright',
        ),
        'text-align-justify' => array(
            'name' => __( 'Justify', 'gamipress' ),
            'icon' => 'editor-justify',
        ),
    );

    ?>
    <div class="cmb-row gamipress-badge-builder-tools cmb2-id-text-align">
        <div class="cmb-th"><?php esc_html_e( 'Alignment', 'gamipress' ); ?></div>
        <div class="cmb-td">
            <?php foreach( $tools as $tool_id => $tool ) : ?>
                <span class="gamipress-badge-builder-tool cmb-tooltip" data-tool="<?php echo esc_attr( $tool_id ); ?>">
                        <?php echo gamipress_dashicon( $tool['icon'] ); ?>
                        <span class="cmb-tooltip-desc cmb-tooltip-top"><?php echo esc_html( $tool['name'] ); ?></span>
                    </span>
            <?php endforeach; ?>
        </div>
    </div>
    <?php
}

/**
 * Tools field
 *
 * @since 1.0.0
 *
 * @param  object $field_args Current field args
 * @param  object $field      Current field object
 */
function gamipress_badge_builder_tools_field( $field_args, $field ) {

    $tools = array(
        'scale' => array(
            'name' => __( 'Scale', 'gamipress' ),
            'tools' => array(
                'scale-up' => array(
                    'name' => __( 'Scale Up', 'gamipress' ),
                    'icon' => 'plus-alt2',
                ),
                'scale-down' => array(
                    'name' => __( 'Scale Down', 'gamipress' ),
                    'icon' => 'minus',
                ),
                'fit' => array(
                    'name' => __( 'Fit To Canvas', 'gamipress' ),
                    'icon' => 'fullscreen-alt',
                ),
            ),
        ),
        'transform' => array(
                'name' => __( 'Transform', 'gamipress' ),
                'tools' => array(
                    'rotate-left' => array(
                        'name' => __( 'Rotate 5º Left', 'gamipress' ),
                        'icon' => 'image-rotate dashicons-image-rotate-left',
                    ),
                    'rotate-right' => array(
                        'name' => __( 'Rotate 5º Right', 'gamipress' ),
                        'icon' => 'image-rotate dashicons-image-rotate-right',
                    ),
                    'flip-horizontal' => array(
                        'name' => __( 'Flip Horizontal', 'gamipress' ),
                        'icon' => 'image-flip-horizontal',
                    ),
                    'flip-vertical' => array(
                        'name' => __( 'Flip Vertical', 'gamipress' ),
                        'icon' => 'image-flip-vertical',
                    ),
                )
        ),
        'alignment' => array(
            'name' => __( 'Alignment', 'gamipress' ),
            'tools' => array(
                'align-horizontal-left' => array(
                    'name' => __( 'Left', 'gamipress' ),
                    'icon' => 'gamipress-align-horizontal-left',
                ),
                'align-horizontal-center' => array(
                    'name' => __( 'Center', 'gamipress' ),
                    'icon' => 'gamipress-align-horizontal-center',
                ),
                'align-horizontal-right' => array(
                    'name' => __( 'Right', 'gamipress' ),
                    'icon' => 'gamipress-align-horizontal-right',
                ),
                'align-vertical-top' => array(
                    'name' => __( 'Top', 'gamipress' ),
                    'icon' => 'gamipress-align-vertical-top',
                ),
                'align-vertical-center' => array(
                    'name' => __( 'Middle', 'gamipress' ),
                    'icon' => 'gamipress-align-vertical-center',
                ),
                'align-vertical-bottom' => array(
                    'name' => __( 'Bottom', 'gamipress' ),
                    'icon' => 'gamipress-align-vertical-bottom',
                ),
            )
        ),
        'group' => array(
            'name' => __( 'Group', 'gamipress' ),
            'tools' => array(
                'group' => array(
                    'name' => __( 'Group', 'gamipress' ),
                    'icon' => 'gamipress-group',
                ),
                'ungroup' => array(
                    'name' => __( 'Ungroup', 'gamipress' ),
                    'icon' => 'gamipress-ungroup',
                ),
            )
        ),
        'order' => array(
            'name' => __( 'Order', 'gamipress' ),
            'tools' => array(
                'send-back' => array(
                    'name' => __( 'Send To Back', 'gamipress' ),
                    'icon' => 'gamipress-send-back',
                ),
                'send-front' => array(
                    'name' => __( 'Send To Front', 'gamipress' ),
                    'icon' => 'gamipress-send-front',
                ),
            )
        ),
        'actions' => array(
            'name' => __( 'Actions', 'gamipress' ),
            'tools' => array(
                'undo' => array(
                    'name' => __( 'Undo', 'gamipress' ),
                    'icon' => 'undo',
                ),
                'redo' => array(
                    'name' => __( 'Redo', 'gamipress' ),
                    'icon' => 'redo',
                ),
                'duplicate' => array(
                    'name' => __( 'Duplicate', 'gamipress' ),
                    'icon' => 'admin-page',
                ),
                'delete' => array(
                    'name' => __( 'Delete', 'gamipress' ),
                    'icon' => 'trash',
                ),
            )
        ),
    );

    ?>

    <?php foreach( $tools as $tools_group_id => $tools_group ) : ?>
        <div class="cmb-row gamipress-badge-builder-tools gamipress-badge-builder-tools-<?php echo esc_attr( $tools_group_id ); ?>">
            <div class="cmb-th"><?php echo esc_html( $tools_group['name'] ); ?></div>
            <div class="cmb-td">
                <?php foreach( $tools_group['tools'] as $tool_id => $tool ) : ?>
                    <span class="gamipress-badge-builder-tool cmb-tooltip" data-tool="<?php echo esc_attr( $tool_id ); ?>">
                        <?php echo gamipress_dashicon( $tool['icon'] ); ?>
                        <span class="cmb-tooltip-desc cmb-tooltip-top"><?php echo esc_html( $tool['name'] ); ?></span>
                    </span>
                <?php endforeach; ?>
            </div>

        </div>
    <?php endforeach; ?>

    <?php

}

/**
 * Shortcuts field
 *
 * @since 1.0.0
 *
 * @param  object $field_args Current field args
 * @param  object $field      Current field object
 */
function gamipress_badge_builder_shortcuts_field( $field_args, $field ) {

    $shortcuts = array(
        'move' => array(
            'keys' => '<kbd>&#8592;</kbd> <kbd>&#8593;</kbd> <kbd>&#8595;</kbd> <kbd>&#8594;</kbd>',
            'name' => __( 'Move', 'gamipress' ),
        ),
        'scale' => array(
            'keys' => '<kbd>+</kbd> ' . __( 'or', 'gamipress' ) . ' <kbd>-</kbd>',
            'name' => __( 'Scale', 'gamipress' ),
        ),
        'fit' => array(
            'keys' => '<kbd>Shift</kbd> + <kbd>F</kbd>',
            'name' => __( 'Fit To Canvas', 'gamipress' ),
        ),
        'rotate' => array(
            'keys' => '<kbd>Ctrl</kbd> + <kbd>&#8592;</kbd> ' . __( 'or', 'gamipress' ) . ' <kbd>&#8594;</kbd>',
            'name' => __( 'Rotate', 'gamipress' ),
        ),
        'flip_horizontal' => array(
            'keys' => '<kbd>Alt</kbd> + <kbd>&#8592;</kbd> ' . __( 'or', 'gamipress' ) . ' <kbd>&#8594;</kbd>',
            'name' => __( 'Flip Horizontal', 'gamipress' ),
        ),
        'flip_vertical' => array(
            'keys' => '<kbd>Alt</kbd> + <kbd>&#8593;</kbd> ' . __( 'or', 'gamipress' ) . ' <kbd>&#8595;</kbd>',
            'name' => __( 'Flip Vertical', 'gamipress' ),
        ),
        'align_horizontal' => array(
            'keys' => '<kbd>Shift</kbd> + <kbd>&#8592;</kbd> ' . __( 'or', 'gamipress' ) . ' <kbd>&#8594;</kbd>',
            'name' => __( 'Align Horizontal', 'gamipress' ),
        ),
        'align_vertical' => array(
            'keys' => '<kbd>Shift</kbd> + <kbd>&#8593;</kbd> ' . __( 'or', 'gamipress' ) . ' <kbd>&#8595;</kbd>',
            'name' => __( 'Align Vertical', 'gamipress' ),
        ),
        'align_center' => array(
            'keys' => '<kbd>Shift</kbd> + <kbd>C</kbd>',
            'name' => __( 'Align Center', 'gamipress' ),
        ),
        'send_front_back' => array(
            'keys' => '<kbd>Ctrl</kbd> + <kbd>&#8593;</kbd> ' . __( 'or', 'gamipress' ) . ' <kbd>&#8595;</kbd>',
            'name' => __( 'Send To Front/Back', 'gamipress' ),
        ),
        'duplicate' => array(
            'keys' => '<kbd>Shift</kbd> + <kbd>D</kbd>',
            'name' => __( 'Duplicate', 'gamipress' ),
        ),
        'delete' => array(
            'keys' => '<kbd>supr</kbd> ' . __( 'or', 'gamipress' ) . ' <kbd>delete</kbd>',
            'name' => __( 'Delete', 'gamipress' ),
        ),
        'undo' => array(
            'keys' => '<kbd>Ctrl</kbd> + <kbd>Z</kbd>',
            'name' => __( 'Undo', 'gamipress' ),
        ),
        'redo' => array(
            'keys' => '<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>',
            'name' => __( 'Redo', 'gamipress' ),
        ),
        'multiple_selection' => array(
            'keys' => '<kbd>Ctrl</kbd> + <kbd>' . __( 'Left Click', 'gamipress' ) . '</kbd>',
            'name' => __( 'Multiple Selection', 'gamipress' ),
        ),
    ); ?>
    <div class="gamipress-badge-builder-shortcuts-wrapper" style="display: none;">

        <?php foreach( $shortcuts as $shortcut_id => $shortcut ) : ?>
            <div class="cmb-row gamipress-badge-builder-shortcuts gamipress-badge-builder-shortcuts-<?php echo esc_attr( $shortcut_id ); ?>">
                <div class="cmb-th"><?php echo esc_html( $shortcut['name'] ); ?></div>
                <div class="cmb-td"><?php echo $shortcut['keys']; ?></div>
            </div>
        <?php endforeach; ?>

    </div>

    <?php
}