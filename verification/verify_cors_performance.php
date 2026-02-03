<?php

class CorsVerification {
    public static function run() {
        echo "Running CORS Verification...\n\n";

        // 1. Correctness Check
        echo "1. Correctness Check:\n";
        $patterns = [
            '*.example.com',
            'http://*.example.com'
        ];

        $tests = [
            'foo.example.com' => ['*.example.com' => true],
            'bar.foo.example.com' => ['*.example.com' => true],
            'example.com' => ['*.example.com' => false], // fnmatch behavior for *.domain is usually matching "something.domain"
            'http://sub.example.com' => ['http://*.example.com' => true],
            'http://example.com' => ['http://*.example.com' => false]
        ];

        foreach ($tests as $origin => $expectations) {
            foreach ($expectations as $allowed => $should_match) {
                // Original Logic
                $original_result = self::original_logic($origin, $allowed);
                // Optimized Logic
                $optimized_result = self::optimized_logic($origin, $allowed);

                echo "  Origin: $origin | Pattern: $allowed\n";
                echo "    Original: " . ($original_result ? 'MATCH' : 'NO') . "\n";
                echo "    Optimized (fnmatch): " . ($optimized_result ? 'MATCH' : 'NO') . "\n";

                if ($optimized_result !== $should_match) {
                    // fnmatch behavior might differ slightly depending on expectations.
                    // *.example.com matching example.com?
                    // fnmatch('*.example.com', 'example.com') -> false (expects at least one char before dot)
                    // If we want to match root domain too, we usually need explicit entry.
                    // But wait, the original regex logic (if fixed) `.*\.example\.com` matches `example.com` (0 chars).
                    // But `fnmatch` follows shell glob rules.
                    echo "    [NOTE] Optimized behavior differs from expectation? (Result: " . ($optimized_result ? 'true' : 'false') . ", Expected: " . ($should_match ? 'true' : 'false') . ")\n";
                }

                if ($original_result !== $optimized_result) {
                    echo "    [DIFF] Logic changed!\n";
                }
            }
        }
        echo "\n";

        // 2. Performance Benchmark
        echo "2. Performance Benchmark:\n";
        $allowed_origins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://djzeneyer.com',
            'https://www.djzeneyer.com',
            '*.djzeneyer.com',
            '*.example.com',
            '*.test.com',
            '*.staging.site',
            '*.dev.local',
            'https://*.subdomain.complex.org'
        ];

        $origin_match = 'https://api.djzeneyer.com';
        $origin_no_match = 'https://hacker.com';

        $iterations = 50000;

        // Baseline
        $start = microtime(true);
        for ($i = 0; $i < $iterations; $i++) {
            self::check_list_original($origin_match, $allowed_origins);
            self::check_list_original($origin_no_match, $allowed_origins);
        }
        $end = microtime(true);
        $original_time = $end - $start;
        echo "  Original: " . number_format($original_time, 4) . " seconds\n";

        // Optimized
        $start = microtime(true);
        for ($i = 0; $i < $iterations; $i++) {
            self::check_list_optimized($origin_match, $allowed_origins);
            self::check_list_optimized($origin_no_match, $allowed_origins);
        }
        $end = microtime(true);
        $optimized_time = $end - $start;
        echo "  Optimized: " . number_format($optimized_time, 4) . " seconds\n";

        $improvement = $original_time / $optimized_time;
        echo "  Improvement: " . number_format($improvement, 2) . "x faster\n";
    }

    private static function original_logic($origin, $allowed) {
        if (strpos($allowed, '*') !== false) {
            $pattern = str_replace('*', '.*', preg_quote($allowed, '/'));
            if (preg_match('/^' . $pattern . '$/', $origin)) {
                return true;
            }
        }
        return false;
    }

    private static function optimized_logic($origin, $allowed) {
        if (strpos($allowed, '*') !== false) {
            if (fnmatch($allowed, $origin)) {
                return true;
            }
        }
        return false;
    }

    private static function check_list_original($origin, $allowed_origins) {
        foreach ($allowed_origins as $allowed) {
            if (strpos($allowed, '*') !== false) {
                $pattern = str_replace('*', '.*', preg_quote($allowed, '/'));
                if (preg_match('/^' . $pattern . '$/', $origin)) {
                    return true;
                }
            }
        }
        return false;
    }

    private static function check_list_optimized($origin, $allowed_origins) {
        foreach ($allowed_origins as $allowed) {
            if (strpos($allowed, '*') !== false) {
                if (fnmatch($allowed, $origin)) {
                    return true;
                }
            }
        }
        return false;
    }
}

CorsVerification::run();
