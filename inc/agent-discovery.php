<?php
/**
 * Agent discovery response headers.
 *
 * @package zentheme
 */

if (!defined('ABSPATH')) {
    exit;
}

function djz_is_homepage_request_uri(string $request_uri): bool
{
    $path = wp_parse_url($request_uri, PHP_URL_PATH);
    $path = is_string($path) ? rtrim($path, '/') : '';

    return $path === '' || $path === '/index.html';
}

function djz_agent_discovery_link_header_value(): string
{
    return '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", ' .
        '</.well-known/ai-plugin.json>; rel="service-desc"; type="application/json", ' .
        '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json", ' .
        '</.well-known/agent-skills/index.json>; rel="service-desc"; type="application/json", ' .
        '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"; type="application/json", ' .
        '</auth.md>; rel="service-doc"; type="text/markdown", ' .
        '</.well-known/auth.md>; rel="service-doc"; type="text/markdown", ' .
        '</llms.txt>; rel="service-doc"; type="text/plain", ' .
        '</llms-full.txt>; rel="describedby"; type="text/plain"';
}

function djz_send_agent_discovery_headers(): void
{
    $request_uri = isset($_SERVER['REQUEST_URI']) ? (string) wp_unslash($_SERVER['REQUEST_URI']) : '/';

    if (!djz_is_homepage_request_uri($request_uri) || headers_sent()) {
        return;
    }

    header('Link: ' . djz_agent_discovery_link_header_value(), false);
}

add_action('send_headers', 'djz_send_agent_discovery_headers', 20);
