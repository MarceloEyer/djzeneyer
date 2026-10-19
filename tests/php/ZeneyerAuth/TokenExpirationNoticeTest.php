<?php

declare(strict_types=1);

namespace ZenEyer\Tests;

use Brain\Monkey;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;
use ZenEyer\Auth\Admin\Settings_Page;

/**
 * Regression for a CodeRabbit finding on the historical-ambiguity admin
 * notice: it used to decide whether to warn, and what number to show, from
 * the raw stored `token_expiration` value — not the EFFECTIVE value
 * JWT_Manager::get_expiration_minutes() actually emits once it clamps an
 * out-of-range value to DEFAULT_EXPIRATION. That could show a confusing
 * number (or wrongly warn/not warn) that doesn't match what the site is
 * actually doing.
 */
final class TokenExpirationNoticeTest extends TestCase
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

    private function renderNotice(?int $storedTokenExpiration, bool $canManageOptions = true): string
    {
        Functions\when('current_user_can')->justReturn($canManageOptions);
        Functions\when('get_option')->alias(function ($name, $default = []) use ($storedTokenExpiration) {
            if ($name === 'zeneyer_auth_settings') {
                return $storedTokenExpiration === null ? [] : ['token_expiration' => $storedTokenExpiration];
            }
            return $default;
        });
        Functions\when('esc_html__')->returnArg(1);

        $page = new Settings_Page();
        ob_start();
        $page->maybe_warn_about_token_expiration_units();
        return ob_get_clean();
    }

    public function test_shows_warning_for_a_valid_but_short_raw_value(): void
    {
        // 7 is within JWT_Manager's valid range (>= MIN_EXPIRATION_MINUTES),
        // so the effective value IS 7 — a legitimate reason to warn.
        $output = $this->renderNotice(7);

        $this->assertStringContainsString('notice-warning', $output);
        $this->assertStringContainsString('7', $output);
    }

    public function test_does_not_warn_when_effective_value_is_safe_despite_invalid_raw_value(): void
    {
        // A raw value outside JWT_Manager's valid range is clamped to
        // DEFAULT_EXPIRATION (60) at emission time. The notice must reflect
        // that — not warn about a number the site isn't actually using.
        $output = $this->renderNotice(-999999);

        $this->assertSame('', $output);
    }

    public function test_does_not_warn_for_a_valid_high_value(): void
    {
        $output = $this->renderNotice(120);

        $this->assertSame('', $output);
    }

    public function test_does_not_warn_without_manage_options_capability(): void
    {
        $output = $this->renderNotice(7, false);

        $this->assertSame('', $output);
    }

    public function test_does_not_warn_when_nothing_is_stored(): void
    {
        $output = $this->renderNotice(null);

        $this->assertSame('', $output);
    }
}
