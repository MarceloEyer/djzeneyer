import sys

with open('inc/api.php', 'r') as f:
    lines = f.readlines()

found = False
for i, line in enumerate(lines):
    # Check if this is the target line
    if 'if ($orders) {' in line and 'foreach' not in line:
        # Check context: verify we are in the right function (djz_get_user_events_attended)
        # We can check previous lines for target_slugs definition which is unique enough here
        context_check = False
        for offset in range(1, 5):
            if i - offset >= 0 and 'target_slugs' in lines[i - offset]:
                context_check = True
                break

        if context_check:
            print(f"Found target at line {i+1}")
            indent = line[:line.find('if')]

            optimization_code = [
                f"{indent}    // OPTIMIZATION: Batch prime term cache to avoid N+1 queries\n",
                f"{indent}    $product_ids = [];\n",
                f"{indent}    foreach ($orders as $order) {{\n",
                f"{indent}        foreach ($order->get_items() as $item) {{\n",
                f"{indent}            if ($pid = $item->get_product_id()) {{\n",
                f"{indent}                $product_ids[] = $pid;\n",
                f"{indent}            }}\n",
                f"{indent}        }}\n",
                f"{indent}    }}\n",
                f"{indent}    if (!empty($product_ids)) {{\n",
                f"{indent}        $product_ids = array_unique($product_ids);\n",
                f"{indent}        update_object_term_cache($product_ids, 'product');\n",
                f"{indent}    }}\n",
                f"\n"
            ]

            # Insert AFTER the if ($orders) { line
            # So insert at i + 1
            for code in reversed(optimization_code):
                lines.insert(i + 1, code)

            found = True
            break

if found:
    with open('inc/api.php', 'w') as f:
        f.writelines(lines)
    print("Successfully optimized inc/api.php")
else:
    print("Could not find the target code block in inc/api.php")
    sys.exit(1)
