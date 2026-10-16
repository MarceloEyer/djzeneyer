<?php
/**
 * Regression cases for the AES-256-GCM sealing of the one-time invite/reset transient
 * (Zen_Private_Music::encrypt_invite_url() / decrypt_invite_url() / invite_encryption_key()).
 *
 * No WordPress install is required: the three methods under test are plain PHP (no WP
 * API calls), so only ABSPATH needs to be defined to satisfy the file's guard clause.
 *
 * Usage: php scripts/php/test-private-music-invite-crypto.php
 */
define('ABSPATH', __DIR__);
function __($text, $domain = null) { return $text; }
require dirname(__DIR__, 2) . '/plugins/zen-private-music-delivery/includes/class-zen-private-music.php';

/**
 * Invoke a private static method on Zen_Private_Music via reflection.
 */
function zpm_call(string $method, array $args = []) {
    static $reflection = null;
    if ($reflection === null) {
        $reflection = new ReflectionClass(Zen_Private_Music::class);
    }
    $m = $reflection->getMethod($method);
    $m->setAccessible(true);
    return $m->invokeArgs(null, $args);
}

function zpm_define_secrets(): void {
    if (!defined('AUTH_KEY')) {
        define('AUTH_KEY', 'unit-test-auth-key-' . bin2hex(random_bytes(8)));
    }
    if (!defined('SECURE_AUTH_KEY')) {
        define('SECURE_AUTH_KEY', 'unit-test-secure-auth-key-' . bin2hex(random_bytes(8)));
    }
}

$failures = [];
function zpm_assert(bool $condition, string $label, array &$failures): void {
    if (!$condition) {
        $failures[] = $label;
    }
}

// --- With secrets configured (the normal production case) -----------------------------
zpm_define_secrets();

$url = 'https://example.com/reset-password/?action=reset_password&key=AbCdEf123456&login=zen';

// Round-trip.
$sealed = zpm_call('encrypt_invite_url', [$url]);
zpm_assert($sealed !== '', 'encrypt_invite_url() succeeds when secrets are configured', $failures);
zpm_assert(strpos($sealed, 'AbCdEf123456') === false, 'sealed value does not contain the plaintext reset key', $failures);
zpm_assert(zpm_call('decrypt_invite_url', [$sealed]) === $url, 'round-trip: decrypt(encrypt(url)) === url', $failures);

// Tampered ciphertext must fail closed (null), not throw or return the plaintext.
$raw = base64_decode($sealed);
$raw[strlen($raw) - 1] = chr(ord($raw[strlen($raw) - 1]) ^ 0xFF);
$tampered = base64_encode($raw);
zpm_assert(zpm_call('decrypt_invite_url', [$tampered]) === null, 'tampered ciphertext is rejected (auth tag mismatch)', $failures);

// Invalid / malformed payloads must fail closed, not warn or throw.
foreach (['', 'not-base64-!!!', base64_encode('too-short'), 'AAAA'] as $garbage) {
    zpm_assert(zpm_call('decrypt_invite_url', [$garbage]) === null, "malformed payload rejected: " . var_export($garbage, true), $failures);
}

// --- Without any configured secret: must fail closed, never derive a key from '' -------
// Simulate "constants absent" by calling the key/encrypt/decrypt logic through a second,
// constant-free class loaded from an isolated copy of the file (PHP constants, once
// defined above, cannot be undefined in-process).
$source = file_get_contents(dirname(__DIR__, 2) . '/plugins/zen-private-music-delivery/includes/class-zen-private-music.php');
$source = str_replace('class Zen_Private_Music', 'class Zen_Private_Music_No_Secrets', $source);
$source = str_replace("defined('AUTH_KEY')", "defined('ZPM_NO_SUCH_AUTH_KEY')", $source);
$source = str_replace("defined('SECURE_AUTH_KEY')", "defined('ZPM_NO_SUCH_SECURE_AUTH_KEY')", $source);
$tmp = tempnam(sys_get_temp_dir(), 'zpm_no_secrets_') . '.php';
file_put_contents($tmp, $source);
require $tmp;
unlink($tmp);

function zpm_call_no_secrets(string $method, array $args = []) {
    static $reflection = null;
    if ($reflection === null) {
        $reflection = new ReflectionClass(Zen_Private_Music_No_Secrets::class);
    }
    $m = $reflection->getMethod($method);
    $m->setAccessible(true);
    return $m->invokeArgs(null, $args);
}

zpm_assert(zpm_call_no_secrets('invite_encryption_key') === null, 'invite_encryption_key() fails closed (null) when AUTH_KEY/SECURE_AUTH_KEY are absent', $failures);
zpm_assert(zpm_call_no_secrets('encrypt_invite_url', [$url]) === '', 'encrypt_invite_url() fails closed ("") when no secret is configured, never the plaintext URL', $failures);
zpm_assert(zpm_call_no_secrets('decrypt_invite_url', [$sealed]) === null, 'decrypt_invite_url() fails closed (null) when no secret is configured', $failures);

// --- redirect_admin() must not report success nor store anything when sealing fails ----
// (Documents the contract redirect_admin() relies on; the admin-notice wiring itself needs
// a WordPress request/redirect to exercise end-to-end — see the PR description for the
// manual verification steps that cover that part on a real WordPress install.)
zpm_assert(
    zpm_call('notice_message', ['invite_encryption_failed']) !== zpm_call('notice_message', ['invite_generated']),
    'the encryption-failure notice is distinct from the success notice text',
    $failures
);
zpm_assert(zpm_call('notice_is_error', ['invite_encryption_failed']) === true, 'invite_encryption_failed is flagged as an error notice', $failures);
zpm_assert(zpm_call('notice_is_error', ['invite_generated']) === false, 'invite_generated is not flagged as an error notice', $failures);

if ($failures) {
    fwrite(STDERR, "FAILED:\n - " . implode("\n - ", $failures) . "\n");
    exit(1);
}
echo "Private music invite crypto regression cases passed.\n";
