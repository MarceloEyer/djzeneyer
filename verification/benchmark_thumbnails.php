<?php
if (PHP_SAPI !== 'cli') {
    die('This script can only be run from the command line.');
}

// Mock WP Environment
class Product {
    public $id;
    public $gallery_ids = [];
    public $featured_id = 0;

    public function __construct($id) {
        $this->id = $id;
        // Simulate 4 gallery images + 1 featured image
        $this->gallery_ids = [$id + 100, $id + 200, $id + 300, $id + 400];
        $this->featured_id = $id + 500;
    }

    public function get_id() { return $this->id; }
    public function get_gallery_image_ids() { return $this->gallery_ids; }
    public function get_image_id() { return $this->featured_id; }
}

$products = [];
for ($i=1; $i<=100; $i++) {
    $products[] = new Product($i);
}

// Scenario 1: Original Logic (Over-fetching)
echo "Scenario 1: Original Logic (List View)\n";
$all_img_ids_original = [];
$start = microtime(true);

foreach ($products as $product) {
    $img_ids = $product->get_gallery_image_ids();
    if ($product->get_image_id()) {
        $img_ids[] = $product->get_image_id();
    }

    if (!empty($img_ids)) {
        $all_img_ids_original = array_merge($all_img_ids_original, $img_ids);
    }
}

$count_original = count(array_unique($all_img_ids_original));
$elapsed_original = microtime(true) - $start;
echo "Total Unique IDs Primed: $count_original\n";
echo "Time Elapsed: " . number_format($elapsed_original * 1000, 4) . "ms\n";

// Scenario 2: Optimized Logic (Targeted fetching)
echo "\nScenario 2: Optimized Logic (List View)\n";
$all_img_ids_optimized = [];
$slug = ''; // Empty slug simulates list view

$start = microtime(true);

foreach ($products as $product) {
    $img_ids = $product->get_gallery_image_ids();

    // Use array_unshift to put featured first (matching processing logic)
    if ($product->get_image_id()) {
        array_unshift($img_ids, $product->get_image_id());
    }

    // Optimization: Slice if list view
    if (empty($slug) && !empty($img_ids)) {
        $img_ids = array_slice($img_ids, 0, 1);
    }

    if (!empty($img_ids)) {
        $all_img_ids_optimized = array_merge($all_img_ids_optimized, $img_ids);
    }
}

$count_optimized = count(array_unique($all_img_ids_optimized));
$elapsed_optimized = microtime(true) - $start;
echo "Total Unique IDs Primed: $count_optimized\n";
echo "Time Elapsed: " . number_format($elapsed_optimized * 1000, 4) . "ms\n";

$reduction = $count_original - $count_optimized;
echo "\nReduction in Cached IDs: $reduction (" . round(($reduction / $count_original) * 100, 1) . "%)\n";
