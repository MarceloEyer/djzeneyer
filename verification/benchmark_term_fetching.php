<?php
// Mock WP Environment
$db_queries = 0;
$term_cache = [];

function wp_get_post_terms($post_id, $taxonomy) {
    global $db_queries, $term_cache;
    if (isset($term_cache[$post_id])) {
        return $term_cache[$post_id];
    }
    $db_queries++;
    // Simulate DB latency
    usleep(100);
    return [(object)['term_id' => 1, 'name' => 'Cat', 'slug' => 'cat']];
}

function update_object_term_cache($object_ids, $object_type) {
    global $db_queries, $term_cache;
    $db_queries++; // Batch query
    usleep(200); // Batch query slightly heavier
    foreach ($object_ids as $id) {
        $term_cache[$id] = [(object)['term_id' => 1, 'name' => 'Cat', 'slug' => 'cat']];
    }
}

class Product {
    public $id;
    public function __construct($id) { $this->id = $id; }
    public function get_id() { return $this->id; }
}

$products = [];
for ($i=0; $i<100; $i++) {
    $products[] = new Product($i);
}

// Scenario 1: Naive Fix (Correct logic, no batching)
$db_queries = 0;
$term_cache = [];
echo "Scenario 1: Naive Fix (No Batching)\n";
$start = microtime(true);
foreach ($products as $product) {
    wp_get_post_terms($product->get_id(), 'product_cat');
}
$time = microtime(true) - $start;
$queries_scenario_1 = $db_queries;
echo "Queries: $db_queries\n";
echo "Time: " . number_format($time, 4) . "s\n";

// Scenario 2: Optimized Fix (Batching)
$db_queries = 0;
$term_cache = [];
echo "\nScenario 2: Optimized Fix (With Batching)\n";
$start = microtime(true);
$ids = array_map(function($p) { return $p->get_id(); }, $products);
update_object_term_cache($ids, 'product'); // Prime cache
foreach ($products as $product) {
    wp_get_post_terms($product->get_id(), 'product_cat');
}
$time = microtime(true) - $start;
$queries_scenario_2 = $db_queries;
echo "Queries: $db_queries\n";
echo "Time: " . number_format($time, 4) . "s\n";

echo "\nReduction in Queries: " . ($queries_scenario_1 - $queries_scenario_2) . "\n";
