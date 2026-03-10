<?php
// Mock functions to test logic and overhead
function wc_get_orders($args) {
    if ($args['return'] ?? '' === 'ids') {
        return range(1, 100);
    }

    $orders = [];
    for ($i = 1; $i <= 100; $i++) {
        $orders[] = new MockOrder($i);
    }
    return $orders;
}

function wc_get_order($id) {
    return new MockOrder($id);
}

class MockOrder {
    public $id;
    public function __construct($id) { $this->id = $id; }
    public function get_items() {
        return [new MockItem(), new MockItem()];
    }
}

class MockItem {
    public function get_product() {
        return new MockProduct();
    }
    public function get_quantity() {
        return 1;
    }
}

class MockProduct {
    public function is_downloadable() {
        return true;
    }
}

// SIMULATE CURRENT N+1 LOGIC
$start = microtime(true);
$order_ids = wc_get_orders([
    'customer' => 1,
    'status' => ['completed'],
    'limit' => -1,
    'return' => 'ids',
]);

$total = 0;
foreach ($order_ids as $oid) {
    // Simulate DB query overhead for getting a single order
    usleep(500);
    $order = wc_get_order($oid);
    if (!$order) {
        continue;
    }
    foreach ($order->get_items() as $item) {
        $product = $item->get_product();
        if ($product && $product->is_downloadable()) {
            $total += $item->get_quantity();
        }
    }
}
$time_ids = microtime(true) - $start;


// SIMULATE OPTIMIZED LOGIC
$start = microtime(true);
// Simulate DB query overhead for getting all orders at once
usleep(2000);
$orders = wc_get_orders([
    'customer' => 1,
    'status' => ['completed'],
    'limit' => -1,
]);

$total2 = 0;
foreach ($orders as $order) {
    if (!$order) {
        continue;
    }
    foreach ($order->get_items() as $item) {
        $product = $item->get_product();
        if ($product && $product->is_downloadable()) {
            $total2 += $item->get_quantity();
        }
    }
}
$time_objs = microtime(true) - $start;

echo "Total 1: $total, Total 2: $total2\n";
echo "Time with IDs + wc_get_order: " . round($time_ids * 1000, 2) . "ms\n";
echo "Time with wc_get_orders(objects): " . round($time_objs * 1000, 2) . "ms\n";
echo "Improvement: " . round((($time_ids - $time_objs) / $time_ids) * 100, 2) . "%\n";
