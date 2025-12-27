<?php
/**
 * DJ Zen Eyer - Dashboard API Endpoints (Universal Backend)
 * Gerencia dados do usuário: Tracks, Streak, Eventos e Atividades (Zen-RA).
 * @version 2.0.0 (Fixes 500 Error + Zen-RA Compatibility)
 */

if (!defined('ABSPATH')) exit;

class DJZ_Dashboard_API {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        // Namespace 1: Padrão do Tema
        $ns_theme = 'djzeneyer/v1';
        
        // Namespace 2: Compatibilidade com Zen-RA (Hooks antigos/Gamipress)
        $ns_zenra = 'zen-ra/v1';

        // --- ROTAS DO TEMA (djzeneyer/v1) ---

        // Tracks
        register_rest_route($ns_theme, '/tracks/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_tracks'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // Streak
        register_rest_route($ns_theme, '/streak/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_streak'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // Eventos
        register_rest_route($ns_theme, '/events/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_events'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // --- ROTAS DE COMPATIBILIDADE (zen-ra/v1) ---
        
        // Activity (Correção do Erro 500)
        register_rest_route($ns_zenra, '/activity/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_zen_activity'], // Nova função segura
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // Gamipress (Mock seguro para evitar 404/500)
        register_rest_route($ns_zenra, '/gamipress/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_zen_gamipress'],
            'permission_callback' => [$this, 'check_permission'],
        ]);
    }

    /**
     * Segurança: Verifica Logado + Dono dos dados
     */
    public function check_permission($request) {
        $user_id = (int) $request['id'];
        $current = get_current_user_id();
        
        if (!$current) return new WP_Error('rest_forbidden', 'Login required', ['status' => 401]);
        
        // Permite se for o próprio usuário ou Admin
        return ($current === $user_id) || current_user_can('edit_users');
    }

    // --- CALLBACKS ---

    public function get_user_tracks($request) {
        // Retorna array vazio para não quebrar o frontend
        return rest_ensure_response([
            'total' => 0,
            'tracks' => []
        ]);
    }

    public function get_user_streak($request) {
        $user_id = $request['id'];
        // Tenta pegar metadados reais ou usa padrão
        $points = get_user_meta($user_id, '_gamipress_points', true);
        return rest_ensure_response([
            'current_streak' => 1,
            'best_streak' => 1,
            'last_login' => date('Y-m-d H:i:s'),
            'points' => (int) $points
        ]);
    }

    public function get_user_events($request) {
        return rest_ensure_response([
            'upcoming' => [],
            'past' => []
        ]);
    }

    /**
     * CORREÇÃO DO ERRO 500: Endpoint de Atividade Seguro
     */
    public function get_zen_activity($request) {
        try {
            // Simula uma resposta válida do Zen-RA para o React ficar feliz
            $activities = [
                [
                    'id' => 'welcome-1',
                    'type' => 'achievement',
                    'title' => 'Bem-vindo à Tribo!',
                    'description' => 'Você acessou o dashboard pela primeira vez.',
                    'xp' => 100,
                    'date' => date('Y-m-d'),
                    'timestamp' => time(),
                    'meta' => []
                ]
            ];

            return rest_ensure_response([
                'success' => true,
                'activities' => $activities
            ]);
        } catch (Exception $e) {
            // Em caso de erro real, retorna JSON de erro em vez de tela branca (500)
            return new WP_Error('server_error', $e->getMessage(), ['status' => 500]);
        }
    }

    /**
     * Endpoint Seguro do Gamipress
     */
    public function get_zen_gamipress($request) {
        return rest_ensure_response([
            'success' => true,
            'stats' => [
                'xp' => 100,
                'level' => 1,
                'rank' => [
                    'current' => 'Iniciado',
                    'icon' => '',
                    'next_milestone' => 500,
                    'progress_percent' => 20
                ]
            ]
        ]);
    }
}

new DJZ_Dashboard_API();