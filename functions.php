<?php
/**
 * DJ Zen Eyer Theme Functions
 */

// Enqueue scripts and styles
function djzeneyer_enqueue_scripts() {
    // Enqueue main stylesheet
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri());
    
    // Enqueue React built assets
    wp_enqueue_script('djzeneyer-react', get_template_directory_uri() . '/dist/assets/index.js', array(), '1.0.0', true);
    wp_enqueue_style('djzeneyer-react-styles', get_template_directory_uri() . '/dist/assets/index.css');
    
    // Pass WordPress data to React
    wp_localize_script('djzeneyer-react', 'wpData', array(
        'siteUrl' => get_site_url(),
        'restUrl' => get_rest_url(),
        'nonce' => wp_create_nonce('wp_rest')
    ));
}
add_action('wp_enqueue_scripts', 'djzeneyer_enqueue_scripts');

// Add theme support
function djzeneyer_theme_support() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
}
add_action('after_setup_theme', 'djzeneyer_theme_support');

// Register REST API endpoints for newsletter subscription
function djzeneyer_register_rest_routes() {
    // Menu endpoint
    register_rest_route('djzeneyer/v1', '/menu', array(
        'methods' => 'GET',
        'callback' => 'djzeneyer_get_menu_items',
        'permission_callback' => '__return_true'
    ));
    
    // Newsletter subscription endpoint
    register_rest_route('djzeneyer/v1', '/subscribe', array(
        'methods' => 'POST',
        'callback' => 'djzeneyer_subscribe_newsletter',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'djzeneyer_register_rest_routes');

// Get menu items for the REST API
function djzeneyer_get_menu_items() {
    $menu_items = wp_get_nav_menu_items('primary-menu');
    return rest_ensure_response($menu_items);
}

// Newsletter subscription handler
function djzeneyer_subscribe_newsletter($request) {
    global $wpdb;
    
    $email = sanitize_email($request->get_param('email'));
    
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Please provide a valid email address.', array('status' => 400));
    }
    
    // Check if email already exists
    $table_name = $wpdb->prefix . 'subscribers';
    $existing = $wpdb->get_var($wpdb->prepare("SELECT email FROM $table_name WHERE email = %s", $email));
    
    if ($existing) {
        return new WP_Error('email_exists', 'This email is already subscribed to our newsletter.', array('status' => 409));
    }
    
    // Insert new subscriber
    $result = $wpdb->insert(
        $table_name,
        array(
            'email' => $email,
            'subscribed_at' => current_time('mysql'),
            'is_confirmed' => false,
            'confirmation_token' => wp_generate_uuid4()
        ),
        array('%s', '%s', '%d', '%s')
    );
    
    if ($result === false) {
        return new WP_Error('database_error', 'Failed to subscribe. Please try again.', array('status' => 500));
    }
    
    return rest_ensure_response(array(
        'success' => true,
        'message' => 'Successfully subscribed! Check your email for confirmation.'
    ));
}

// Configurações adicionais para JWT e CoCart
function djzeneyer_jwt_cors_setup() {
    // Permitir CORS para requests de autenticação
    add_action('rest_api_init', function() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function($value) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
            return $value;
        });
    }, 15);
}
add_action('init', 'djzeneyer_jwt_cors_setup');

// Configurar headers para JWT
function djzeneyer_jwt_headers($headers) {
    if (!isset($headers['Authorization'])) {
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
    }
    return $headers;
}
add_filter('apache_request_headers', 'djzeneyer_jwt_headers');

// Configurações específicas para Simple JWT Login
function djzeneyer_simple_jwt_config() {
    // Garantir que os endpoints estejam disponíveis
    add_filter('simple_jwt_login_jwt_payload', function($payload, $user) {
        // Adicionar informações extras ao payload JWT se necessário
        $payload['user_display_name'] = $user->display_name;
        $payload['user_avatar'] = get_avatar_url($user->ID);
        return $payload;
    }, 10, 2);
}
add_action('init', 'djzeneyer_simple_jwt_config');

// Configurações para CoCart
function djzeneyer_cocart_config() {
    // Permitir que CoCart funcione com JWT
    add_filter('cocart_disable_load_cart', '__return_false');
    add_filter('cocart_merge_cart_content', '__return_true');
}
add_action('init', 'djzeneyer_cocart_config');