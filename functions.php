<?php
/**
 * DJ Zen Eyer Theme Functions
 */

// Enqueue scripts and styles
function djzeneyer_enqueue_scripts() {
    // Enqueue main stylesheet
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri());

    // Enqueue React built assets (JavaScript and CSS)
    // The 'index.js' should be inside the 'dist/assets' folder of your React build.
    // Added 'crossorigin' attribute for better preload handling (Rocket Loader)
    wp_enqueue_script('djzeneyer-react', get_template_directory_uri() . '/dist/assets/index.js', array(), '1.0.0', true);
    wp_enqueue_style('djzeneyer-react-styles', get_template_directory_uri() . '/dist/assets/index.css');

    // Pass important WordPress data to the React JavaScript (global 'wpData' object)
    wp_localize_script('djzeneyer-react', 'wpData', array(
        'siteUrl' => get_site_url(), // Base URL of your site
        'restUrl' => get_rest_url(), // Base URL of the WordPress REST API
        'nonce' => wp_create_nonce('wp_rest') // Security nonce for REST API requests
    ));
}
add_action('wp_enqueue_scripts', 'djzeneyer_enqueue_scripts');

/**
 * Adds the 'type="module"' attribute AND 'crossorigin="use-credentials"' to the React script tag.
 * This is essential for modern browsers to correctly interpret ES Modules (ESM) and for better preload handling.
 */
function djzeneyer_add_type_attribute_to_react_script( $tag, $handle, $src ) {
    // Check if it's our React script's handle
    if ( 'djzeneyer-react' === $handle ) {
        // Reconstruct the script tag adding type="module" AND crossorigin="use-credentials"
        $tag = '<script type="module" src="' . esc_url( $src ) . '" id="' . $handle . '-js" crossorigin="use-credentials"></script>';
    }
    return $tag;
}
add_filter( 'script_loader_tag', 'djzeneyer_add_type_attribute_to_react_script', 10, 3 );

// Enable CORS for frontend requests and allow credentials
add_action('init', 'handle_cors');
function handle_cors() {
    // ESSENTIAL: Use get_site_url() for Access-Control-Allow-Origin when Allow-Credentials is true
    header("Access-Control-Allow-Origin: " . get_site_url()); 
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-WP-Nonce"); // Ensure X-WP-Nonce is allowed
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }
}

// Add theme support
function djzeneyer_theme_support() {
    add_theme_support('title-tag'); 
    add_theme_support('post-thumbnails'); 
    add_theme_support('woocommerce'); 
}
add_action('after_setup_theme', 'djzeneyer_theme_support');

// Register REST API endpoints
function djzeneyer_register_rest_routes() {
    // Custom endpoint for menu items
    register_rest_route('djzeneyer/v1', '/menu', array(
        'methods' => 'GET',
        'callback' => 'djzeneyer_get_menu_items',
        'permission_callback' => '__return_true'
    ));

    // Custom endpoint for newsletter subscription
    register_rest_route('djzeneyer/v1', '/subscribe', array(
        'methods' => 'POST',
        'callback' => 'djzeneyer_handle_newsletter_subscription',
        'permission_callback' => '__return_true', // Allow public access without authentication
        'args' => array(
            'email' => array(
                'required' => true,
                'validate_callback' => function($param, $request, $key) {
                    return is_email($param);
                }
            ),
        ),
    ));

    // Custom Endpoint to Get a Fresh Nonce
    register_rest_route('djzeneyer/v1', '/nonce', array(
        'methods' => 'GET',
        'callback' => 'djzeneyer_get_fresh_nonce',
        'permission_callback' => '__return_true' // Publicly accessible to get nonce
    ));

    // Endpoint personalizado para adicionar ao carrinho
    // Este endpoint NÃO requer Nonce e usa a sessão do WooCommerce diretamente.
    register_rest_route('djzeneyer/v1', '/add-to-cart', array(
        'methods' => 'POST',
        'callback' => 'djzeneyer_add_to_cart',
        'permission_callback' => '__return_true', // Permitir acesso público (para convidados)
        'args' => array(
            'product_id' => array(
                'required' => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                }
            ),
            'quantity' => array(
                'default' => 1,
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0;
                }
            ),
        ),
    ));
}
add_action('rest_api_init', 'djzeneyer_register_rest_routes'); 

// Get menu items for the REST API
function djzeneyer_get_menu_items() {
    $menu_items = wp_get_nav_menu_items('primary-menu'); 
    return rest_ensure_response($menu_items);
}

// Callback function to handle newsletter subscription using MailPoet
function djzeneyer_handle_newsletter_subscription(WP_REST_Request $request) {
    $email = sanitize_email($request['email']);

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email.', array('status' => 400));
    }

    if (!function_exists('mailpoet_api_get') || !class_exists(\MailPoet\API\API::class)) {
        return new WP_Error('mailpoet_not_ready', 'Newsletter service not available. Please install and activate MailPoet.', array('status' => 500));
    }

    try {
        $mailpoet_api = \MailPoet\API\API::getInstance();
        
        // !!! IMPORTANT: REPLACE 'YOUR_MAILPOET_LIST_ID' with the actual ID of your MailPoet subscriber list.
        // You can find the list ID in the URL when editing a list in MailPoet (e.g., ...&list_id=X)
        $list_id = 1; // <--- REPLACE THIS VALUE WITH THE ACTUAL ID OF YOUR MAILPOET LIST (e.g., 1, 2, etc.)

        // Check if subscriber already exists
        $subscriber = $mailpoet_api->getSubscriber($email);

        if ($subscriber) {
            // If subscriber exists, check if already subscribed to the list
            $subscriber_status = $mailpoet_api->getSubscriberStatus($subscriber['id'], $list_id);

            if ($subscriber_status['status'] === 'subscribed') {
                return new WP_REST_Response(array('message' => 'This email is already subscribed. Thank you!'), 200);
            } else {
                $mailpoet_api->subscribeToList($subscriber['id'], $list_id);
                return new WP_REST_Response(array('message' => 'Successfully subscribed to the newsletter!'), 200);
            }
        } else {
            // Subscriber does not exist, create a new one and subscribe them to the list
            $mailpoet_api->addSubscriber([
                'email' => $email,
                'status' => \MailPoet\API\API::STATUS_SUBSCRIBED
            ], [$list_id]);

            return new WP_REST_Response(array('message' => 'Thanks for subscribing! Keep an eye on your inbox.'), 200);
        }
    } catch (\Exception $e) {
        error_log('MailPoet API error: ' . $e->getMessage()); 
        return new WP_Error('mailpoet_error', 'Error processing subscription: ' . $e->getMessage(), array('status' => 500));
    }
}

/**
 * Custom Callback function to generate and return a fresh nonce.
 */
function djzeneyer_get_fresh_nonce( WP_REST_Request $request ) {
    return rest_ensure_response( array(
        'nonce' => wp_create_nonce( 'wp_rest' ),
    ) );
}

/**
 * Callback function to add products to cart via custom API endpoint.
 * This function bypasses the default wc/store/v1/cart/add-item nonce validation issues.
 * It manually adds the product to the WooCommerce cart using WC()->cart->add_to_cart().
 */
function djzeneyer_add_to_cart( WP_REST_Request $request ) {
    $product_id = absint( $request['product_id'] );
    $quantity = absint( $request['quantity'] );

    if ( empty( $product_id ) ) {
        return new WP_Error( 'invalid_product', 'Invalid product ID.', array( 'status' => 400 ) );
    }
    // Check if WooCommerce is active
    if ( !class_exists( 'WooCommerce' ) ) {
        return new WP_Error( 'woocommerce_not_active', 'WooCommerce is not active.', array( 'status' => 500 ) );
    }

    // Rely on WooCommerce to initialize cart and session when WC()->cart is accessed.
    // Removed explicit session_start() and set_customer_session_cookie() calls here.
    if ( null === WC()->cart ) {
        wc_load_cart();
    }
    
    // Add product to cart
    $cart_item_key = WC()->cart->add_to_cart( $product_id, $quantity );

    if ( $cart_item_key ) {
        return rest_ensure_response( array(
            'success' => true,
            'message' => 'Product added to cart successfully!',
            'cart_item_key' => $cart_item_key,
            'cart_url' => wc_get_cart_url(),
            'checkout_url' => wc_get_checkout_url()
        ) );
    } else {
        return new WP_Error( 'add_to_cart_failed', 'Failed to add product to cart. Product ID: ' . $product_id, array( 'status' => 400 ) ); // Added product ID to error
    }
}

/**
 * Redirects users to the "My Account" page after successful login.
 * This is useful when the frontend is a React application and login occurs via wp-login.php.
 */
function custom_login_redirect( $redirect_to, $request, $user ) {
    if ( ! is_wp_error( $user ) ) {
        if ( ! empty( $request ) && ( strpos( $request, 'wp-login.php' ) !== false ) ) {
            return home_url( '/my-account' ); 
        }
    }
    return $redirect_to; 
}
add_filter( 'login_redirect', 'custom_login_redirect', 10, 3 );