<?php
namespace ZenEyer\Auth;

class Logger {
    
    public static function log($message, $level = 'info', $context = []) {
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            return;
        }
        
        $log_message = sprintf(
            '[ZenEyer Auth] [%s] %s',
            strtoupper($level),
            $message
        );
        
        if (!empty($context)) {
            $log_message .= ' | Context: ' . json_encode($context);
        }
        
        error_log($log_message);
    }
    
    public static function error($message, $context = []) {
        self::log($message, 'error', $context);
    }
    
    public static function warning($message, $context = []) {
        self::log($message, 'warning', $context);
    }
    
    public static function info($message, $context = []) {
        self::log($message, 'info', $context);
    }
}
