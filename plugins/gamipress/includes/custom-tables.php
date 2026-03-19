<?php
/**
 * Custom Tables
 *
 * @package     GamiPress\Custom_Tables
 * @author      GamiPress <contact@gamipress.com>, Ruben Garcia <rubengcdev@gmail.com>
 * @since       1.2.8
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

// Custom Tables
require_once GAMIPRESS_DIR . 'includes/custom-tables/logs.php';
require_once GAMIPRESS_DIR . 'includes/custom-tables/user-earnings.php';
// Rest API
require_once GAMIPRESS_DIR . 'includes/api/logs.php';
require_once GAMIPRESS_DIR . 'includes/api/user-earnings.php';


/**
 * Register all GamiPress Custom DB Tables
 *
 * @since   1.2.8
 * @updated 1.4.3 User Earnings v2: Added the field title
 * @updated 1.4.7 Logs v2: Added the field trigger_type
 * @updated 1.5.1 Logs v3: Removed the field description and make type and trigger_type indexes
 *
 * @return void
 */
function gamipress_register_custom_tables() {

    // User Earnings Table
    ct_register_table( 'gamipress_user_earnings', array(
        'show_ui' => true,
        'show_in_rest' => true,
        'rest_base' => 'gamipress-user-earnings',
        'version' => 4,
        'global' => gamipress_is_network_wide_active(),
        'capability' => gamipress_get_manager_capability(),
        'supports' => array( 'meta' ),
        'views' => array(
            'list' => array(
                'parent_slug' => 'gamipress',
                'priority' => 10,
            ),
            'add' => false,
            'edit' => array(
                'show_in_menu' => false,
            ),
        ),
        'schema' => array(
            'user_earning_id' => array(
                'type' => 'bigint',
                'length' => '20',
                'auto_increment' => true,
                'primary_key' => true,
            ),
            'title' => array(
                'type' => 'text',
            ),
            'user_id' => array(
                'type' => 'bigint',
                'length' => '20',
                'key' => true,
            ),
            'post_id' => array(
                'type' => 'bigint',
                'length' => '20',
                'key' => true,
            ),
            'post_type' => array(
                'type' => 'varchar',
                'length' => '50',
            ),
            'points' => array(
                'type' => 'bigint',
            ),
            'points_type' => array(
                'type' => 'varchar',
                'length' => '50',
            ),
            'date' => array(
                'type' => 'datetime',
                'default' => '0000-00-00 00:00:00'
            )
        ),
    ) );

    // Logs Table
    ct_register_table( 'gamipress_logs', array(
        'show_ui' => true,
        'show_in_rest' => true,
        'rest_base' => 'gamipress-logs',
        'version' => 6,
        'global' => gamipress_is_network_wide_active(),
        'capability' => gamipress_get_manager_capability(),
        'supports' => array( 'meta' ),
        'views' => array(
            'list' => array(
                'parent_slug' => 'gamipress',
                'priority' => 10,
            ),
            'add' => false,
            'edit' => array(
                'show_in_menu' => false,
            ),
        ),
        'schema' => array(
            'log_id' => array(
                'type' => 'bigint',
                'length' => '20',
                'auto_increment' => true,
                'primary_key' => true,
            ),
            'title' => array(
                'type' => 'text',
            ),
            'type' => array(
                'type' => 'varchar',
                'length' => '50',
                'key' => true,
            ),
            'trigger_type' => array(
                'type' => 'varchar',
                'length' => '255',
                'key' => true,
            ),
            'access' => array(
                'type' => 'varchar',
                'length' => '50',
            ),
            'user_id' => array(
                'type' => 'bigint',
                'length' => '20',
                'key' => true,
            ),
            'points' => array(
                'type' => 'bigint',
                'length' => '20',
                'key' => true,
            ),
            'points_type' => array(
                'type' => 'varchar',
                'length' => '255',
                'key' => true,
            ),
            'date' => array(
                'type' => 'datetime',
                'default' => '0000-00-00 00:00:00',
            )
        ),
    ) );

}
add_action( 'ct_init', 'gamipress_register_custom_tables' );

/**
 * Helper function to generate a where from a CT Query
 *
 * @since 1.0.0
 *
 * @param array     $query_vars         The query vars
 * @param string    $field_id           The field id
 * @param string    $table_field        The table field key
 * @param string    $field_type         The field type (string|integer)
 * @param string    $single_operator    The single operator (=|!=)
 * @param string    $array_operator     The array operator (IN|NOT IN)
 *
 * @return string
 */
function gamipress_custom_table_where( $query_vars, $field_id, $table_field, $field_type, $single_operator = '=', $array_operator = 'IN' ) {

    global $ct_table;

    $table_name = $ct_table->db->table_name;

    $where = '';

    // Shorthand
    $qv = $query_vars;

    // Type
    if( isset( $qv[$field_id] ) && ! empty( $qv[$field_id] ) ) {

        if( is_array( $qv[$field_id] ) ) {
            // Array values

            if( $field_type === 'string' || $field_type === 'text' ) {

                // Sanitize
                $value = array_map( 'esc_sql', $qv[$field_id] );
                
                // Join values by a comma-separated list of strings
                $value = "'" . implode( "', '", $value ) . "'";

                $where .= " AND {$table_name}.{$table_field} {$array_operator} ( {$value} )";

            } else if( $field_type === 'integer' || $field_type === 'int' ) {

                // Sanitize
                $value = array_map( 'absint', $qv[$field_id] );

                // Join values by a comma-separated list of integers
                $value =  implode( ", ", $value );

                $where .= " AND {$table_name}.{$table_field} {$array_operator} ( {$value} )";

            }
        } else {
            // Single value

            if( $field_type === 'string' || $field_type === 'text' ) {

                $value = esc_sql( $qv[$field_id] );

                $where .= " AND {$table_name}.{$table_field} {$single_operator} '{$value}'";

            } else if( $field_type === 'integer' || $field_type === 'int' ) {

                $value = absint( $qv[$field_id] );

                $where .= " AND {$table_name}.{$table_field} {$single_operator} {$value}";

            }
        }

    }

    return $where;

}

/**
 * Helper function to sanitize a query args array
 *
 * @since 1.0.0
 *
 * @param array     $query_args         The query args
 * @param array     $rules              The rules applied to each query arg entry
 *
 * @return array
 */
function gamipress_sanitize_query_args( $query_args, $rules ) {

    $sanitized_query_args = array();

    foreach( $rules as $field => $rule ) {

        if( ! isset( $query_args[$field] ) ) {
            continue;
        }

        // Parse type
        switch ( $rule['type'] ) {
            case 'string':
                $query_args[$field] = sanitize_text_field( $query_args[$field] );
                break;
            case 'integer':
            case 'int':
                $query_args[$field] = absint( $query_args[$field] );
                break;
            case 'bool':
            case 'boolean':
                $query_args[$field] = (bool)( $query_args[$field] );
                break;
            case 'array':
                if( ! is_array( $query_args[$field] ) ) {
                    $query_args[$field] = array( $query_args[$field] );
                }
                break;
        }

        // Parse sanitize
        if( isset( $rule['sanitize'] ) ) {

            switch ( $rule['sanitize'] ) {
                case 'sanitize_text_field':
                case 'text':
                    if( $rule['type'] === 'array' ) {
                        $query_args[$field] = array_map( 'sanitize_text_field', $query_args[$field] );
                    } else {
                        $query_args[$field] = sanitize_text_field( $query_args[$field] );
                    }
                    break;
                case 'integer':
                case 'int':
                case 'absint':
                    if( $rule['type'] === 'array' ) {
                        $query_args[$field] = array_map( 'absint', $query_args[$field] );
                    } else {
                        $query_args[$field] = absint( $query_args[$field] );
                    }
                    break;
                case 'uppercase':
                case 'strtoupper':
                    if( $rule['type'] === 'array' ) {
                        $query_args[$field] = array_map( 'strtoupper', $query_args[$field] );
                    } else {
                        $query_args[$field] = strtoupper( $query_args[$field] );
                    }
                    break;
                case 'lowercase':
                case 'strtolower':
                    if( $rule['type'] === 'array' ) {
                        $query_args[$field] = array_map( 'strtolower', $query_args[$field] );
                    } else {
                        $query_args[$field] = strtolower( $query_args[$field] );
                    }
                    break;
            }

        }

        // Parse allowed values
        if( isset( $rule['allowed_values'] ) ) {

            if( ! is_array( $rule['allowed_values'] ) ) {
                $rule['allowed_values'] = array( $rule['allowed_values'] );
            }

            if( $field === 'orderby' ) {
                $rule['allowed_values'][] = 'rand';
                $rule['allowed_values'][] = 'none';
            }

            switch ( $rule['type'] ) {
                case 'string':
                case 'integer':
                case 'int':
                    if( ! in_array( $query_args[$field], $rule['allowed_values'] ) ) {
                        $query_args[$field] = $rule['allowed_values'][0];
                    };
                    break;
                case 'array':
                    $only_allowed = array();
                    foreach( $query_args[$field] as $k => $v ) {

                        if( in_array( $v, $rule['allowed_values'] ) ) {
                            $only_allowed[$k] = $v;
                        };

                    }

                    $query_args[$field] = $only_allowed;
                    break;
            }

        }

        $sanitized_query_args[$field] = $query_args[$field];

    }

    return $sanitized_query_args;

}
