import re

with open("inc/api.php", "r") as f:
    text = f.read()

search1 = "        foreach ($product_objects as $product) {\n            $images = [];\n            // ⚡ Bolt: Retrieve image IDs from our pre-computed map in O(1) time"
replace1 = "        // ⚡ Bolt: Use template-based permalink generation to prevent N+1 bottleneck on get_permalink()\n        $permalink_template = null;\n\n        foreach ($product_objects as $product) {\n            $images = [];\n            // ⚡ Bolt: Retrieve image IDs from our pre-computed map in O(1) time"
text = text.replace(search1, replace1)

search2 = "            $categories = wp_get_post_terms($product->get_id(), 'product_cat');\n            if (is_wp_error($categories)) {\n                $categories = [];\n            }\n\n            $products[] = [\n                'id' => $product->get_id(),"
replace2 = """            $categories = wp_get_post_terms($product->get_id(), 'product_cat');
            if (is_wp_error($categories)) {
                $categories = [];
            }

            $product_slug = $product->get_slug();
            if ($permalink_template === null) {
                $first_permalink = get_permalink($product->get_id());
                if (!empty($product_slug)) {
                    $pos = strrpos($first_permalink, $product_slug);
                    if ($pos !== false) {
                        $permalink_template = substr_replace($first_permalink, '%slug%', $pos, strlen($product_slug));
                    } else {
                        $permalink_template = false;
                    }
                } else {
                    $permalink_template = false;
                }
                $permalink = $first_permalink;
            } else if ($permalink_template === false) {
                $permalink = get_permalink($product->get_id());
            } else {
                $permalink = str_replace('%slug%', $product_slug, $permalink_template);
            }

            $products[] = [
                'id' => $product->get_id(),"""
text = text.replace(search2, replace2)

search3 = "                'description' => !empty($slug) ? $product->get_description() : '',\n                'permalink' => get_permalink($product->get_id()),"
replace3 = "                'description' => !empty($slug) ? $product->get_description() : '',\n                'permalink' => $permalink,"
text = text.replace(search3, replace3)


search4 = "            foreach ($product_objects as $product) {\n                // ⚡ Bolt: Retrieve image IDs from our pre-computed map in O(1) time"
replace4 = "            // ⚡ Bolt: Use template-based permalink generation to prevent N+1 bottleneck on get_permalink()\n            $permalink_template = null;\n\n            foreach ($product_objects as $product) {\n                // ⚡ Bolt: Retrieve image IDs from our pre-computed map in O(1) time"
text = text.replace(search4, replace4)


search5 = "                $categories = wp_get_post_terms($product->get_id(), 'product_cat');\n                $products[] = [\n                    'id' => $product->get_id(),"
replace5 = """                $categories = wp_get_post_terms($product->get_id(), 'product_cat');

                $product_slug = $product->get_slug();
                if ($permalink_template === null) {
                    $first_permalink = get_permalink($product->get_id());
                    if (!empty($product_slug)) {
                        $pos = strrpos($first_permalink, $product_slug);
                        if ($pos !== false) {
                            $permalink_template = substr_replace($first_permalink, '%slug%', $pos, strlen($product_slug));
                        } else {
                            $permalink_template = false;
                        }
                    } else {
                        $permalink_template = false;
                    }
                    $permalink = $first_permalink;
                } else if ($permalink_template === false) {
                    $permalink = get_permalink($product->get_id());
                } else {
                    $permalink = str_replace('%slug%', $product_slug, $permalink_template);
                }

                $products[] = [
                    'id' => $product->get_id(),"""
text = text.replace(search5, replace5)


search6 = "                    'description' => '',\n                    'permalink' => get_permalink($product->get_id()),"
replace6 = "                    'description' => '',\n                    'permalink' => $permalink,"
text = text.replace(search6, replace6)


with open("inc/api.php", "w") as f:
    f.write(text)
