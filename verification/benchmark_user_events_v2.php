<?php

// Mocking the environment
$db_queries = 0;
$term_cache = [];

function get_transient($key) { return false; }
function set_transient($key, $val, $exp) {}
function is_wp_error($thing) { return false; }

function get_the_terms($post_id, $taxonomy) {
    global $db_queries, $term_cache;
    if (isset($term_cache[$post_id])) {
        return $term_cache[$post_id];
    }
    $db_queries++;
    usleep(100); // Simulate DB latency per query
    // Return mock terms
    if ($post_id % 2 == 0) { // Simulate some matching products
        return [(object)['slug' => 'events'], (object)['slug' => 'other']];
    }
    return [(object)['slug' => 'clothing']];
}

function update_object_term_cache($object_ids, $object_type) {
    global $db_queries, $term_cache;
    $db_queries++; // One batch query
    usleep(200); // Slightly heavier but single query
    foreach ($object_ids as $id) {
        if ($id % 2 == 0) {
            $term_cache[$id] = [(object)['slug' => 'events'], (object)['slug' => 'other']];
        } else {
            $term_cache[$id] = [(object)['slug' => 'clothing']];
        }
    }
}

class MockItem {
    public $product_id;
    public $quantity;
    public function __construct($pid, $qty) {
        $this->product_id = $pid;
        $this->quantity = $qty;
    }
    public function get_product_id() { return $this->product_id; }
    public function get_quantity() { return $this->quantity; }
}

class MockOrder {
    public $items = [];
    public function __construct($items) {
        $this->items = $items;
    }
    public function get_items() { return $this->items; }
}

function wc_get_orders($args) {
    // Generate 50 orders
    $orders = [];
    for ($i=0; $i<50; $i++) {
        // Each order has 2 items
        $items = [
            new MockItem($i * 10 + 1, 1),
            new MockItem($i * 10 + 2, 2)
        ];
        $orders[] = new MockOrder($items);
    }
    return $orders;
}

// ---------------------------------------------------------
// Original Logic
// ---------------------------------------------------------
function original_logic() {
    global $db_queries, $term_cache;
    $db_queries = 0;
    $term_cache = []; // Clear cache

    $user_id = 123;
    $args = [
        'customer_id' => $user_id,
        'limit' => -1,
        'status' => ['completed', 'processing'],
        'type' => 'shop_order',
    ];

    $orders = wc_get_orders($args);
    $count = 0;
    $target_slugs = ['events', 'tickets', 'congressos', 'workshops', 'social', 'festivais', 'pass'];

    if ($orders) {
        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();
                if ($product_id) {
                    $terms = get_the_terms($product_id, 'product_cat');
                    if ($terms && !is_wp_error($terms)) {
                        foreach ($terms as $term) {
                            if (in_array($term->slug, $target_slugs)) {
                                $count += $item->get_quantity();
                                break 2;
                            }
                        }
                    }
                }
            }
        }
    }
    return $count;
}

// ---------------------------------------------------------
// Optimized Logic
// ---------------------------------------------------------
function optimized_logic() {
    global $db_queries, $term_cache;
    $db_queries = 0;
    $term_cache = []; // Clear cache

    $user_id = 123;
    $args = [
        'customer_id' => $user_id,
        'limit' => -1,
        'status' => ['completed', 'processing'],
        'type' => 'shop_order',
    ];

    $orders = wc_get_orders($args);
    $count = 0;
    $target_slugs = ['events', 'tickets', 'congressos', 'workshops', 'social', 'festivais', 'pass'];

    if ($orders) {
        // Collect all product IDs first
        $product_ids = [];
        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                $pid = $item->get_product_id();
                if ($pid) {
                    $product_ids[] = $pid;
                }
            }
        }

        // Batch prime cache
        if (!empty($product_ids)) {
            $product_ids = array_unique($product_ids);
            update_object_term_cache($product_ids, 'product');
        }

        // Original loop logic
        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();
                if ($product_id) {
                    $terms = get_the_terms($product_id, 'product_cat'); // Now cached
                    if ($terms && !is_wp_error($terms)) {
                        foreach ($terms as $term) {
                            if (in_array($term->slug, $target_slugs)) {
                                $count += $item->get_quantity();
                                break 2;
                            }
                        }
                    }
                }
            }
        }
    }
    return $count;
}

echo "Running Benchmark...\n";

// Run Original
$start = microtime(true);
$res1 = original_logic();
$time1 = microtime(true) - $start;
$queries1 = $db_queries;
echo "Original: Count=$res1, Queries=$queries1, Time=" . number_format($time1, 4) . "s\n";

// Run Optimized
$start = microtime(true);
$res2 = optimized_logic();
$time2 = microtime(true) - $start;
$queries2 = $db_queries;
echo "Optimized: Count=$res2, Queries=$queries2, Time=" . number_format($time2, 4) . "s\n";

if ($res1 !== $res2) {
    echo "ERROR: Results differ! Original: $res1, Optimized: $res2\n";
    exit(1);
}

echo "Improvement: " . ($queries1 - $queries2) . " fewer queries.\n";

?>
