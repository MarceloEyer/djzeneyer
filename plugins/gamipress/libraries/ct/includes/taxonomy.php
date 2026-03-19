<?php
/**
 * CT Taxonomy Functions
 *
 * @since 1.0.0
 */
// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

/**
 * Register a taxonomy custom table and its relationship table
 *
 * @since 1.0.0
 *
 * @param string        $name
 * @param string|array  $tables
 * @param array         $args
 */
function ct_register_taxonomy_table( $name, $tables, $args ) {

    global $ct_registered_tables, $ct_registered_taxonomies;

    // Init registered taxonomies
    if ( ! is_array( $ct_registered_taxonomies ) ) {
        $ct_registered_taxonomies = array();
    }

    $name = sanitize_key( $name );

    if( ! isset( $ct_registered_tables[ $name ] ) ) {
        $ct_table = ct_register_table( $name, $args );

        $ct_registered_taxonomies[$name] = $ct_table;
    }

    // Bail here if no tables provided
    if( empty( $tables ) ) {
        return;
    }

    if( ! is_array( $tables ) ) {
        $tables = array( $tables );
    }

    foreach( $tables as $table ) {

        // TODO: notice user here
        if( ! isset( $ct_registered_tables[$table] ) ) {
            continue;
        }

        ct_register_relationship_table( $name, $table, $args );

    }

}

/**
 * Register a relationship custom table
 *
 * @since 1.0.0
 *
 * @param string        $table_a
 * @param string        $table_b
 * @param array         $args
 */
function ct_register_relationship_table( $table_a, $table_b, $args ) {

    global $ct_registered_tables, $ct_relationships;

    // Init relationships global
    if ( ! is_array( $ct_relationships ) ) {
        $ct_relationships = array();
    }

    // Relationship table: ct_category . _relationships
    $table_name = $table_a . '_relationships';

    $args['show_ui'] = false;
    $args['supports'] = array();

    $term_id = $table_a . '_' . $ct_registered_tables[$table_a]->db->primary_key;
    $object_id = $table_b . '_' . $ct_registered_tables[$table_b]->db->primary_key;

    if( isset( $args['relationship'] ) ) {

        if( isset( $args['relationship']['term_id'] ) ) {
            $term_id = $args['relationship']['term_id'];
        }

        if( isset( $args['relationship']['object_id'] ) ) {
            $object_id = $args['relationship']['object_id'];
        }

    } else {
        $args['relationship'] = array(
            'type' => 'single',
            'term_id' => $term_id,
            'object_id' => $object_id,
        );
    }

    // Override schema
    $args['schema'] = array(
        'id' => array(
            'type' => 'bigint',
            'length' => '20',
            'auto_increment' => true,
            'primary_key' => true,
        ),
        $term_id => array(
            'type' => 'bigint',
            'length' => '20',
            'key' => true,
        ),
        $object_id => array(
            'type' => 'bigint',
            'length' => '20',
            'key' => true,
        ),
    );

    $ct_table = ct_register_table( $table_name, $args );

    $ct_relationships[$table_name] = (object) $args['relationship'];

    return $ct_relationships[$table_name];

}

/**
 * Find object relationship
 *
 * @since 1.0.0
 *
 * @param integer           $object_id
 * @param integer           $term_id
 *
 * @return bool
 */
function ct_get_relationship_id( $object_id, $term_id ) {

    global $ct_table, $ct_relationships, $wpdb;

    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return false;
    }

    $r = $ct_relationships[$ct_table->name];

    $object_id_field = $r->object_id;
    $term_id_field = $r->term_id;

    $found = absint( $wpdb->get_var( $wpdb->prepare(
        "SELECT {$ct_table->db->primary_key}
                FROM {$ct_table->db->table_name} 
                WHERE 1=1
                AND {$object_id_field} = %d
                AND {$term_id_field} = %d",
        absint( $object_id ),
        absint( $term_id ),
    ) ) );

    return $found;
}

/**
 * Add object relationships (without remove old ones)
 *
 * @since 1.0.0
 *
 * @param integer           $object_id
 * @param integer|array     $term_id
 *
 * @return bool
 */
function ct_add_object_relationship( $object_id, $term_id ) {

    return ct_update_object_relationships( $object_id, $term_id, false );
}

/**
 * Update object relationships
 *
 * @since 1.0.0
 *
 * @param integer           $object_id
 * @param integer|array     $term_id
 * @param bool              $remove_old
 *
 * @return bool
 */
function ct_update_object_relationships( $object_id, $term_id, $remove_old = true ) {

    global $ct_table, $ct_relationships, $wpdb;

    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return false;
    }

    $r = $ct_relationships[$ct_table->name];

    // Remove all old relationships
    if( $remove_old ) {
        ct_delete_object_relationships( $object_id );
    }

    if( ! is_array( $term_id ) ) {
        $term_id = array( $term_id );
    }

    $object_id_field = $r->object_id;
    $term_id_field = $r->term_id;

    if( $r->type === 'single' ) {
        // Adds the relationship
        ct_insert_object( array(
            $object_id_field => $object_id,
            $term_id_field => $term_id[0],
        ) );

    } else if( $r->type === 'multiple' ) {

        foreach( $term_id as $id ) {

            // Adds the relationship
            ct_insert_object( array(
                $object_id_field => $object_id,
                $term_id_field => $id,
            ) );

        }

    }

    return true;
}

/**
 * Delete object relationships
 *
 * @since 1.0.0
 *
 * @param integer           $object_id
 *
 * @return bool
 */
function ct_delete_object_relationships( $object_id ) {

    global $ct_table, $ct_relationships, $wpdb;

    // Checks if relationship table exists
    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return false;
    }

    $r = $ct_relationships[$ct_table->name];

    // Delete all object relationships
    $wpdb->query( $wpdb->prepare(
        "DELETE FROM {$ct_table->db->table_name} WHERE {$r->object_id} = %d",
        $object_id
    ) );

    return true;

}

/**
 * Get object relationships
 *
 * @since 1.0.0
 *
 * @param int|stdClass|null $object_id Object primary key.
 * @param string $output Optional. The required return type. One of OBJECT, ARRAY_A, or ARRAY_N, which correspond to
 *                                  a WP_Post object, an associative array, or a numeric array, respectively. Default OBJECT.
 *
 * @return stdClass|array|null
 */
function ct_get_object_relationships( $object_id, $output = OBJECT ) {
    global $ct_table, $ct_relationships, $wpdb;

    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return null;
    }

    $r = $ct_relationships[$ct_table->name];

    // Get all relationships of the given object
    $relationships = $wpdb->get_results( $wpdb->prepare(
        "SELECT * FROM {$ct_table->db->table_name} WHERE {$r->object_id} = %d",
        $object_id
    ), $output );

    return $relationships;
}

/**
 * Get object relationships
 *
 * @since 1.0.0
 *
 * @param int|stdClass|null $object_id Object primary key.
 *
 * @return stdClass|array|null
 */
function ct_get_object_relationships_count( $object_id ) {
    global $ct_table, $ct_relationships, $wpdb;

    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return 0;
    }

    $r = $ct_relationships[$ct_table->name];

    // Get all relationships of the given object
    $count = absint( $wpdb->get_var( $wpdb->prepare(
        "SELECT COUNT({$ct_table->db->primary_key}) FROM {$ct_table->db->table_name} WHERE {$r->object_id} = %d",
        $object_id
    ) ) );

    return $count;
}

/**
 * Get term relationships
 *
 * @since 1.0.0
 *
 * @param int|stdClass|null $object_id Object primary key.
 * @param string $output Optional. The required return type. One of OBJECT, ARRAY_A, or ARRAY_N, which correspond to
 *                                  a WP_Post object, an associative array, or a numeric array, respectively. Default OBJECT.
 *
 * @return stdClass|array|null
 */
function ct_get_term_relationships( $term_id, $output = OBJECT ) {
    global $ct_table, $ct_relationships, $wpdb;

    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return null;
    }

    $r = $ct_relationships[$ct_table->name];

    // Get all relationships of the given object
    $relationships = $wpdb->get_results( $wpdb->prepare(
        "SELECT * FROM {$ct_table->db->table_name} WHERE {$r->term_id} = %d",
        $term_id
    ), $output );

    return $relationships;
}

/**
 * Get term relationships
 *
 * @since 1.0.0
 *
 * @param int|stdClass|null $object_id Object primary key.
 *
 * @return stdClass|array|null
 */
function ct_get_term_relationships_count( $term_id ) {
    global $ct_table, $ct_relationships, $wpdb;

    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return 0;
    }

    $r = $ct_relationships[$ct_table->name];

    // Get all relationships of the given object
    $count = absint( $wpdb->get_var( $wpdb->prepare(
        "SELECT COUNT({$ct_table->db->primary_key}) FROM {$ct_table->db->table_name} WHERE {$r->term_id} = %d",
        $term_id
    ) ) );

    return $count;
}

/**
 * Get object relationships
 *
 * @since 1.0.0
 *
 * @param int|stdClass|null $object_id Object primary key.
 * @param string $output Optional. The required return type. One of OBJECT, ARRAY_A, or ARRAY_N, which correspond to
 *                                  a WP_Post object, an associative array, or a numeric array, respectively. Default OBJECT.
 *
 * @return stdClass|array|null
 */
function ct_get_object_terms_ids( $object_id, $output = OBJECT ) {
    global $ct_table, $ct_relationships, $wpdb;

    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return null;
    }

    $r = $ct_relationships[$ct_table->name];

    $limit = '';

    if( $r->type === 'single' ) {
        $limit = 'LIMIT 1';
    }

    // Get all terms ids from the relationship table
    $terms_ids = $wpdb->get_col( $wpdb->prepare(
        "SELECT {$r->term_id} FROM {$ct_table->db->table_name} WHERE {$r->object_id} = %d {$limit}",
        $object_id
    ) );

    return $terms_ids;
}

/**
 * Get object terms
 *
 * @since 1.0.0
 *
 * @param int|stdClass|null $object_id Object primary key.
 * @param string $output Optional. The required return type. One of OBJECT, ARRAY_A, or ARRAY_N, which correspond to
 *                                  a WP_Post object, an associative array, or a numeric array, respectively. Default OBJECT.
 *
 * @return stdClass|array|null
 */
function ct_get_object_terms( $object_id, $output = OBJECT ) {
    global $ct_table, $ct_registered_tables, $ct_relationships, $wpdb;

    if( ! isset( $ct_relationships[$ct_table->name] ) ) {
        return null;
    }

    $r = $ct_relationships[$ct_table->name];

    $terms_ids = ct_get_object_terms_ids( $object_id, ARRAY_N );

    if( ! count( $terms_ids ) ) {
        return null;
    }

    $table_name = str_replace( '_relationships', '', $ct_table->name );

    $term_table = $ct_registered_tables[$table_name];
    $in_pattern = implode(', ', array_fill( 0, count($terms_ids), '%d' ) );

    $limit = '';

    if( $r->type === 'single' ) {
        $limit = 'LIMIT 1';
    }

    // Get all relationships of the given object
    $terms = $wpdb->get_results( $wpdb->prepare(
        "SELECT * FROM {$term_table->db->table_name} WHERE {$term_table->db->primary_key} IN ({$in_pattern}) {$limit}",
        $terms_ids
    ), $output );

    return $terms;
}