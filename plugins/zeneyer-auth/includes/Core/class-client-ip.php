<?php
/**
 * Client IP resolver
 *
 * Single source of truth for the visitor IP. Proxy headers (CF-Connecting-IP,
 * X-Forwarded-For) are only honoured when the TCP peer (REMOTE_ADDR) is a
 * trusted proxy: Cloudflare edge ranges, loopback, or anything added through
 * the `zeneyer_auth_trusted_proxies` filter. Requests that reach the origin
 * directly cannot spoof their IP with headers.
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.4.0
 */

namespace ZenEyer\Auth\Core;

if (!defined('ABSPATH')) {
    exit;
}

final class Client_IP
{
    /**
     * Cloudflare edge ranges (https://www.cloudflare.com/ips/).
     * Review when Cloudflare publishes changes; extend via the
     * `zeneyer_auth_trusted_proxies` filter without editing this file.
     */
    private const CLOUDFLARE_RANGES = [
        '173.245.48.0/20',
        '103.21.244.0/22',
        '103.22.200.0/22',
        '103.31.4.0/22',
        '141.101.64.0/18',
        '108.162.192.0/18',
        '190.93.240.0/20',
        '188.114.96.0/20',
        '197.234.240.0/22',
        '198.41.128.0/17',
        '162.158.0.0/15',
        '104.16.0.0/13',
        '104.24.0.0/14',
        '172.64.0.0/13',
        '131.0.72.0/22',
        '2400:cb00::/32',
        '2606:4700::/32',
        '2803:f800::/32',
        '2405:b500::/32',
        '2405:8100::/32',
        '2a06:98c0::/29',
        '2c0f:f248::/32',
    ];

    /**
     * Resolve the client IP for the current request.
     *
     * @return string Valid IP address, or 0.0.0.0 when unknown.
     */
    public static function get(): string
    {
        $remote = self::server_ip('REMOTE_ADDR');

        if ($remote === '') {
            return '0.0.0.0';
        }

        if (!self::is_trusted_proxy($remote)) {
            return $remote;
        }

        // Cloudflare sets a single, already-validated client IP.
        $cf_ip = self::server_ip('HTTP_CF_CONNECTING_IP');
        if ($cf_ip !== '') {
            return $cf_ip;
        }

        // Generic proxy chain: walk right-to-left and return the first hop
        // that is not itself a trusted proxy.
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR']) && is_string($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $chain = array_reverse(explode(',', wp_unslash($_SERVER['HTTP_X_FORWARDED_FOR'])));
            foreach ($chain as $hop) {
                $hop = trim($hop);
                if (filter_var($hop, FILTER_VALIDATE_IP) === false) {
                    break; // Malformed chain: stop trusting it.
                }
                if (!self::is_trusted_proxy($hop)) {
                    return $hop;
                }
            }
        }

        return $remote;
    }

    /**
     * Whether an IP belongs to a trusted proxy.
     */
    public static function is_trusted_proxy(string $ip): bool
    {
        foreach (self::trusted_ranges() as $range) {
            if (self::ip_in_range($ip, $range)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @return string[] IPs or CIDR ranges.
     */
    private static function trusted_ranges(): array
    {
        $ranges = array_merge(['127.0.0.1', '::1'], self::CLOUDFLARE_RANGES);
        $filtered = apply_filters('zeneyer_auth_trusted_proxies', $ranges);

        return is_array($filtered) ? array_values(array_filter($filtered, 'is_string')) : $ranges;
    }

    private static function server_ip(string $key): string
    {
        if (empty($_SERVER[$key]) || !is_string($_SERVER[$key])) {
            return '';
        }

        $value = trim(wp_unslash($_SERVER[$key]));

        return filter_var($value, FILTER_VALIDATE_IP) !== false ? $value : '';
    }

    /**
     * IPv4/IPv6 aware CIDR match. A bare IP is treated as /32 or /128.
     */
    private static function ip_in_range(string $ip, string $range): bool
    {
        $packed_ip = @inet_pton($ip);
        if ($packed_ip === false) {
            return false;
        }

        if (strpos($range, '/') === false) {
            $packed_range = @inet_pton($range);
            return $packed_range !== false && $packed_range === $packed_ip;
        }

        [$subnet, $bits] = explode('/', $range, 2);
        $packed_subnet = @inet_pton($subnet);

        if ($packed_subnet === false || strlen($packed_subnet) !== strlen($packed_ip) || !ctype_digit($bits)) {
            return false;
        }

        $bits = (int) $bits;
        if ($bits > strlen($packed_ip) * 8) {
            return false;
        }

        $full_bytes = intdiv($bits, 8);
        if ($full_bytes > 0 && substr($packed_ip, 0, $full_bytes) !== substr($packed_subnet, 0, $full_bytes)) {
            return false;
        }

        $remaining = $bits % 8;
        if ($remaining === 0) {
            return true;
        }

        $mask = (0xFF << (8 - $remaining)) & 0xFF;

        return (ord($packed_ip[$full_bytes]) & $mask) === (ord($packed_subnet[$full_bytes]) & $mask);
    }
}
