<?php
/**
 * ZenGame Pro Constants
 *
 * @package ZenGamePro
 * @since 1.4.0
 */

namespace ZenEyer\GamePro\Core;

if (!defined('ABSPATH')) {
    exit;
}

final class Constants
{
    // Points & Balance
    public const POINTS_BALANCE = 'zengame_points_balance';
    public const POINTS_REWARD = '_zengame_points_reward';
    public const POINTS_REQUIRED = '_zengame_points_required';

    // User Stats
    public const TOTAL_TRACKS = 'zengame_total_tracks';
    public const EVENTS_ATTENDED = 'zengame_events_attended';
    public const LOGIN_STREAK = '_zengame_login_streak';
    public const LAST_LOGIN_DATE = '_zengame_last_login_date';

    // Orders & Idempotency
    public const ORDER_POINTS_AWARDED = '_zengamepro_points_awarded';

    // Database & Options
    public const DB_VERSION_OPTION = 'zengamepro_db_version';
    public const LOGS_TABLE = 'zengame_logs';

    /**
     * Prevent instantiation
     */
    private function __construct() {}
}
