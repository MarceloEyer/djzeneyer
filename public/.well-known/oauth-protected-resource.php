<?php
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: public, max-age=300, stale-while-revalidate=60');
header('Access-Control-Allow-Origin: *');
header('X-Content-Type-Options: nosniff');
readfile(__DIR__ . '/oauth-protected-resource');
