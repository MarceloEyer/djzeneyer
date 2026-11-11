<?php

declare(strict_types=1);

namespace ZenEyer\Tests;

use Brain\Monkey;
use Brain\Monkey\Functions;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ZenEyer\Auth\Activator;
use ZenEyer\Auth\Core\JWT_Manager;

/**
 * Regression test for a fresh install: Activator::set_default_options()
 * used to hardcode token_expiration => 7 (the same unmoored "7" that, read
 * as minutes by JWT_Manager, caused 7-minute access tokens in production).
 * It must now persist JWT_Manager::DEFAULT_EXPIRATION.
 */
final class ActivatorDefaultOptionsTest extends TestCase
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

    public function test_fresh_install_persists_jwt_manager_default_expiration(): void
    {
        Functions\when('get_option')->justReturn(false); // "no option saved yet"

        $capturedDefaults = null;
        Functions\when('add_option')->alias(function ($name, $value) use (&$capturedDefaults) {
            if ($name === 'zeneyer_auth_settings') {
                $capturedDefaults = $value;
            }
            return true;
        });

        $reflection = new ReflectionClass(Activator::class);
        $method = $reflection->getMethod('set_default_options');
        $method->setAccessible(true);
        $method->invoke(null);

        $this->assertIsArray($capturedDefaults);
        $this->assertSame(
            JWT_Manager::DEFAULT_EXPIRATION,
            $capturedDefaults['token_expiration'],
            'Fresh installs must not persist the historical hardcoded "7" — it is consumed as 7 minutes, not 7 days.'
        );
    }

    public function test_existing_install_is_not_overwritten(): void
    {
        Functions\when('get_option')->justReturn(['token_expiration' => 120, 'google_client_id' => 'abc']);
        Functions\expect('add_option')->never();

        $reflection = new ReflectionClass(Activator::class);
        $method = $reflection->getMethod('set_default_options');
        $method->setAccessible(true);
        $method->invoke(null);

        $this->addToAssertionCount(1); // Reaching here without add_option firing is the assertion.
    }
}
