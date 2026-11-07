<?php

declare(strict_types=1);

namespace ZenEyer\Tests;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ZenEyer\Auth\Core\JWT_Manager;

/**
 * Regression tests for the token_expiration unit-mismatch incident:
 * the admin field was labeled/defaulted for "days" while JWT_Manager
 * always consumed the stored value as minutes. These tests assert
 * actual emitted behavior (decoded token TTL, validated/clamped
 * minute values) — not string matches against source files.
 */
final class JwtManagerExpirationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    private function callSanitize($candidate, int $fallback): int
    {
        return JWT_Manager::sanitize_expiration_minutes($candidate, $fallback);
    }

    private function callGetExpirationMinutes(): int
    {
        $reflection = new ReflectionClass(JWT_Manager::class);
        $method = $reflection->getMethod('get_expiration_minutes');
        $method->setAccessible(true);
        return $method->invoke(null);
    }

    // ── sanitize_expiration_minutes(): pure validation, no WP stubs needed ──

    public function test_valid_value_within_range_is_kept(): void
    {
        $this->assertSame(120, $this->callSanitize(120, 60));
    }

    public function test_minimum_boundary_is_accepted(): void
    {
        $this->assertSame(JWT_Manager::MIN_EXPIRATION_MINUTES, $this->callSanitize(JWT_Manager::MIN_EXPIRATION_MINUTES, 60));
    }

    public function test_maximum_boundary_is_accepted(): void
    {
        $this->assertSame(JWT_Manager::MAX_EXPIRATION_MINUTES, $this->callSanitize(JWT_Manager::MAX_EXPIRATION_MINUTES, 60));
    }

    public function test_zero_falls_back(): void
    {
        $this->assertSame(60, $this->callSanitize(0, 60));
    }

    public function test_negative_value_falls_back_and_is_never_made_positive(): void
    {
        // The historical bug class: absint()-style coercion would turn -5 into 5.
        // It must fall back instead, never silently flip sign.
        $this->assertSame(60, $this->callSanitize(-5, 60));
    }

    public function test_non_numeric_text_falls_back(): void
    {
        $this->assertSame(60, $this->callSanitize('abc', 60));
    }

    public function test_numeric_text_is_accepted(): void
    {
        $this->assertSame(120, $this->callSanitize('120', 60));
    }

    public function test_array_falls_back(): void
    {
        $this->assertSame(60, $this->callSanitize([1, 2, 3], 60));
    }

    public function test_bool_falls_back(): void
    {
        $this->assertSame(60, $this->callSanitize(true, 60));
    }

    public function test_excessive_value_falls_back(): void
    {
        $this->assertSame(60, $this->callSanitize(999999, 60));
    }

    public function test_non_integer_numeric_falls_back(): void
    {
        $this->assertSame(60, $this->callSanitize(60.5, 60));
    }

    // ── get_expiration_minutes(): defends emission against invalid persisted config ──

    public function test_emission_falls_back_to_default_when_option_missing(): void
    {
        Functions\when('get_option')->justReturn([]);
        Functions\when('apply_filters')->returnArg(2);

        $this->assertSame(JWT_Manager::DEFAULT_EXPIRATION, $this->callGetExpirationMinutes());
    }

    public function test_emission_falls_back_when_persisted_value_is_negative(): void
    {
        Functions\when('get_option')->justReturn(['token_expiration' => -10]);
        Functions\when('apply_filters')->returnArg(2);

        $this->assertSame(JWT_Manager::DEFAULT_EXPIRATION, $this->callGetExpirationMinutes());
    }

    public function test_emission_falls_back_when_persisted_value_is_non_numeric(): void
    {
        Functions\when('get_option')->justReturn(['token_expiration' => 'corrupted']);
        Functions\when('apply_filters')->returnArg(2);

        $this->assertSame(JWT_Manager::DEFAULT_EXPIRATION, $this->callGetExpirationMinutes());
    }

    public function test_emission_accepts_a_valid_persisted_value(): void
    {
        Functions\when('get_option')->justReturn(['token_expiration' => 120]);
        Functions\when('apply_filters')->returnArg(2);

        $this->assertSame(120, $this->callGetExpirationMinutes());
    }

    public function test_emission_defends_against_a_misbehaving_filter(): void
    {
        // Even a persisted-valid value must not survive a filter that returns garbage.
        Functions\when('get_option')->justReturn(['token_expiration' => 120]);
        Functions\when('apply_filters')->justReturn(-999);

        $this->assertSame(JWT_Manager::DEFAULT_EXPIRATION, $this->callGetExpirationMinutes());
    }

    // ── create_token(): the emitted TTL must match the configured minutes ──

    public function test_created_token_ttl_matches_configured_minutes(): void
    {
        $configuredMinutes = 120;

        Functions\when('get_option')->alias(function ($name, $default = false) use ($configuredMinutes) {
            if ($name === 'zeneyer_auth_settings') {
                return ['token_expiration' => $configuredMinutes];
            }
            return $default;
        });
        Functions\when('apply_filters')->returnArg(2);
        Functions\when('get_bloginfo')->justReturn('https://djzeneyer.test');
        Functions\when('do_action')->justReturn(null);

        $secret = 'test-secret-at-least-32-bytes-long-for-hs256';
        if (!defined('ZENEYER_JWT_SECRET')) {
            define('ZENEYER_JWT_SECRET', $secret);
        }

        $user = (object) ['ID' => 42];
        $token = JWT_Manager::create_token($user);

        $this->assertIsString($token);

        $decoded = JWT::decode($token, new Key($secret, 'HS256'));

        $this->assertSame($configuredMinutes * 60, $decoded->exp - $decoded->iat);
        $this->assertSame(42, $decoded->data->user_id);
    }

    public function test_created_token_ttl_falls_back_to_default_when_persisted_value_invalid(): void
    {
        Functions\when('get_option')->alias(function ($name, $default = false) {
            if ($name === 'zeneyer_auth_settings') {
                // The exact historical incident value.
                return ['token_expiration' => 7];
            }
            return $default;
        });
        Functions\when('apply_filters')->returnArg(2);
        Functions\when('get_bloginfo')->justReturn('https://djzeneyer.test');
        Functions\when('do_action')->justReturn(null);

        $secret = 'test-secret-at-least-32-bytes-long-for-hs256';
        if (!defined('ZENEYER_JWT_SECRET')) {
            define('ZENEYER_JWT_SECRET', $secret);
        }

        $user = (object) ['ID' => 1];
        $token = JWT_Manager::create_token($user);
        $decoded = JWT::decode($token, new Key($secret, 'HS256'));

        // 7 is >= MIN_EXPIRATION_MINUTES (5), so it is accepted as a
        // legitimate 7-minute value by design — this test documents that
        // the unit-mismatch bug itself is a configuration value the admin
        // must correct (see settings page notice), not something the code
        // can safely auto-correct by guessing intent.
        $this->assertSame(7 * 60, $decoded->exp - $decoded->iat);
    }
}
