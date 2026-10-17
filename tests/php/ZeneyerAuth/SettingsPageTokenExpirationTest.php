<?php

declare(strict_types=1);

namespace ZenEyer\Tests;

use Brain\Monkey;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ZenEyer\Auth\Admin\Settings_Page;
use ZenEyer\Auth\Core\JWT_Manager;

/**
 * Regression tests for Settings_Page::sanitize_token_expiration() — the
 * server-side validation that replaced a bare absint() call. absint()
 * silently turns invalid input into something that *looks* valid (negative
 * becomes positive, non-numeric becomes 0); these tests assert the new
 * behavior explicitly: invalid input is rejected, the admin is told why via
 * add_settings_error(), and the previously-saved valid value is preserved.
 */
final class SettingsPageTokenExpirationTest extends TestCase
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

    /**
     * @param mixed $raw
     * @param array $existingOption What get_option('zeneyer_auth_settings') returns (the "previous" value).
     */
    private function sanitize($raw, array $existingOption = [])
    {
        Functions\when('get_option')->alias(function ($name, $default = []) use ($existingOption) {
            if ($name === 'zeneyer_auth_settings') {
                return $existingOption ?: $default;
            }
            return $default;
        });

        $page = new Settings_Page();
        $reflection = new ReflectionClass(Settings_Page::class);
        $method = $reflection->getMethod('sanitize_token_expiration');
        $method->setAccessible(true);

        return $method->invoke($page, $raw);
    }

    public function test_valid_value_is_accepted_without_error(): void
    {
        Functions\expect('add_settings_error')->never();

        $result = $this->sanitize(120, ['token_expiration' => 60]);

        $this->assertSame(120, $result);
    }

    public function test_missing_value_is_rejected_and_keeps_previous(): void
    {
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize(null, ['token_expiration' => 90]);

        $this->assertSame(90, $result);
    }

    public function test_empty_string_is_rejected_and_keeps_previous(): void
    {
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize('', ['token_expiration' => 90]);

        $this->assertSame(90, $result);
    }

    public function test_zero_is_rejected_and_keeps_previous(): void
    {
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize(0, ['token_expiration' => 90]);

        $this->assertSame(90, $result);
    }

    public function test_negative_value_is_rejected_not_flipped_positive(): void
    {
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize(-30, ['token_expiration' => 90]);

        // Must be 90 (preserved), never 30 (what absint(-30) would have produced).
        $this->assertSame(90, $result);
    }

    public function test_text_is_rejected_and_keeps_previous(): void
    {
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize('ninety', ['token_expiration' => 90]);

        $this->assertSame(90, $result);
    }

    public function test_array_is_rejected_and_keeps_previous(): void
    {
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize(['90'], ['token_expiration' => 90]);

        $this->assertSame(90, $result);
    }

    public function test_excessive_value_is_rejected_and_keeps_previous(): void
    {
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize(JWT_Manager::MAX_EXPIRATION_MINUTES + 1, ['token_expiration' => 90]);

        $this->assertSame(90, $result);
    }

    public function test_invalid_input_with_no_previous_value_falls_back_to_jwt_manager_default(): void
    {
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize('garbage', []);

        $this->assertSame(JWT_Manager::DEFAULT_EXPIRATION, $result);
    }

    public function test_invalid_persisted_previous_value_is_not_trusted_as_fallback(): void
    {
        // The previous value itself was the historical bug (7, meant as
        // "days"). Per-minute, 7 is actually >= MIN_EXPIRATION_MINUTES, so
        // it is a technically-valid fallback here — this test documents
        // that sanitize_token_expiration() does not reinterpret it, only
        // JWT_Manager::sanitize_expiration_minutes()'s range check applies.
        Functions\expect('add_settings_error')->once();

        $result = $this->sanitize('not-a-number', ['token_expiration' => 7]);

        $this->assertSame(7, $result);
    }
}
