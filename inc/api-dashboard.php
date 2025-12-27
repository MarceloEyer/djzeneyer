<?php
/**
 * DJ Zen Eyer - Dashboard API Endpoints
 * Gerencia dados do usuário: Tracks, Streak e Eventos.
 * * @version 1.0.0 (Diamond Master)
 */

if (!defined('ABSPATH')) exit;

class DJZ_Dashboard_API {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Registra as rotas que o React está procurando
     */
    public function register_routes() {
        // Namespace deve ser IGUAL ao que o frontend chama: djzeneyer/v1
        $namespace = 'djzeneyer/v1';

        // 1. Rota de Tracks (Músicas)
        // Resolve: GET /wp-json/djzeneyer/v1/tracks/6
        register_rest_route($namespace, '/tracks/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_tracks'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // 2. Rota de Streak (Pontuação/Dias)
        // Resolve: GET /wp-json/djzeneyer/v1/streak/6
        register_rest_route($namespace, '/streak/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_streak'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // 3. Rota de Eventos
        // Resolve: GET /wp-json/djzeneyer/v1/events/6
        register_rest_route($namespace, '/events/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_events'],
            'permission_callback' => [$this, 'check_permission'],
        ]);
    }

    /**
     * Segurança: Só permite se o usuário estiver logado e for dono dos dados
     * (ou se for administrador)
     */
    public function check_permission($request) {
        $user_id_requested = (int) $request['id'];
        $current_user_id = get_current_user_id();

        // Se não estiver logado, bloqueia
        if (!$current_user_id) {
            return new WP_Error('rest_forbidden', 'Você precisa estar logado.', ['status' => 401]);
        }

        // Permite se for o próprio usuário ou Admin
        return ($current_user_id === $user_id_requested) || current_user_can('edit_users');
    }

    /**
     * CALLBACK: Retorna as Músicas
     */
    public function get_user_tracks($request) {
        // Como você disse que ainda não tem músicas, retornamos um array vazio por enquanto.
        // O Frontend vai receber [] e mostrar "Nenhuma música encontrada" sem dar erro.
        
        $tracks = []; 

        // Se quiser testar como ficaria com música, descomente abaixo:
        /*
        $tracks = [
            [
                'id' => 1,
                'title' => 'Zouk Flow (Demo)',
                'artist' => 'DJ Zen Eyer',
                'cover' => 'https://djzeneyer.com/wp-content/uploads/cover-placeholder.jpg',
                'url' => '#'
            ]
        ];
        */

        return rest_ensure_response($tracks);
    }

    /**
     * CALLBACK: Retorna o Streak (Gamification)
     */
    public function get_user_streak($request) {
        $user_id = $request['id'];
        
        // Tenta pegar dados reais do banco (se Gamipress estiver salvando)
        // Se não tiver, retorna padrão para não quebrar
        $points = get_user_meta($user_id, '_gamipress_points', true);
        
        return rest_ensure_response([
            'current_streak' => 1,    // Padrão
            'best_streak' => 1,       // Padrão
            'points' => (int) $points // Pontos reais ou 0
        ]);
    }

    /**
     * CALLBACK: Retorna Eventos
     */
    public function get_user_events($request) {
        // Retorna array vazio se não tiver ingressos comprados
        return rest_ensure_response([]);
    }
}

// Inicializa a API
new DJZ_Dashboard_API();