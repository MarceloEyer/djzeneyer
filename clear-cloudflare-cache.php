<?php
/**
 * Clear Cloudflare Cache
 * 
 * Access this file once to purge Cloudflare cache and force .htaccess reload
 * Then DELETE this file for security
 */

// Cloudflare API credentials (get from Cloudflare dashboard)
$cf_zone_id = 'YOUR_ZONE_ID'; // Get from Cloudflare dashboard
$cf_api_token = 'YOUR_API_TOKEN'; // Create API token with "Cache Purge" permission

// Only allow access from localhost or specific IP
$allowed_ips = ['127.0.0.1', '::1'];
if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips) && !isset($_GET['force'])) {
    die('Access denied. Add ?force=1 to URL if you are the site owner.');
}

echo "<h1>Cloudflare Cache Clear</h1>";

// Method 1: Purge everything via Cloudflare API
if ($cf_zone_id !== 'YOUR_ZONE_ID' && $cf_api_token !== 'YOUR_API_TOKEN') {
    $url = "https://api.cloudflare.com/client/v4/zones/{$cf_zone_id}/purge_cache";
    
    $data = json_encode(['purge_everything' => true]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $cf_api_token,
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data)
    ]);
    
    $result = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code === 200) {
        echo "<p style='color: green;'>✅ Cloudflare cache cleared successfully!</p>";
    } else {
        echo "<p style='color: red;'>❌ Failed to clear Cloudflare cache: " . htmlspecialchars($result) . "</p>";
    }
} else {
    echo "<p style='color: orange;'>⚠️ Cloudflare API credentials not configured.</p>";
    echo "<p>To use API method:</p>";
    echo "<ol>";
    echo "<li>Go to Cloudflare Dashboard → Your Site → Overview</li>";
    echo "<li>Copy Zone ID</li>";
    echo "<li>Go to My Profile → API Tokens → Create Token</li>";
    echo "<li>Use 'Cache Purge' template</li>";
    echo "<li>Update this file with credentials</li>";
    echo "</ol>";
}

// Method 2: Manual instructions
echo "<hr>";
echo "<h2>Manual Method (Recommended)</h2>";
echo "<ol>";
echo "<li>Go to <a href='https://dash.cloudflare.com' target='_blank'>Cloudflare Dashboard</a></li>";
echo "<li>Select your site: <strong>djzeneyer.com</strong></li>";
echo "<li>Go to <strong>Caching</strong> → <strong>Configuration</strong></li>";
echo "<li>Click <strong>Purge Everything</strong></li>";
echo "<li>Confirm the purge</li>";
echo "<li>Wait 30 seconds</li>";
echo "<li>Hard refresh your site (Ctrl+Shift+R or Cmd+Shift+R)</li>";
echo "</ol>";

echo "<hr>";
echo "<h2>Verify CSP Headers</h2>";
echo "<p>After clearing cache, check if CSP headers are updated:</p>";
echo "<pre>";
echo "curl -I https://djzeneyer.com | grep -i content-security-policy\n";
echo "</pre>";
echo "<p>Should include:</p>";
echo "<ul>";
echo "<li>https://static.cloudflareinsights.com</li>";
echo "<li>https://rest.bandsintown.com</li>";
echo "<li>https://r2cdn.perplexity.ai</li>";
echo "</ul>";

echo "<hr>";
echo "<p style='color: red; font-weight: bold;'>⚠️ DELETE THIS FILE AFTER USE FOR SECURITY!</p>";
?>
