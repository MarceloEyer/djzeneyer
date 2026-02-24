# GamiPress API & Integration Guide

Este documento centraliza as informações técnicas sobre a integração com o GamiPress no projeto **DJ Zen Eyer**. Ele serve como referência para o desenvolvimento de endpoints customizados, hooks de backend e consumo no frontend.

---

## 1. Estrutura de Dados (Core)

O GamiPress utiliza Custom Post Types (CPTs) para organizar seus elementos:

| Elemento | CPT Slug | Função |
|----------|----------|--------|
| **Achievements** | `achievement` | Conquistas, medalhas, badges. |
| **Points** | `points-type` | Tipo de moeda (XP, ZenCoins, etc). |
| **Ranks** | `rank` | Níveis de progressão do usuário. |
| **Requirements** | `requirement` | Condições para ganhar conquistas/ranks. |

---

## 2. Funções PHP Essenciais (Backend)

Sempre verifique `function_exists()` antes de chamar estas funções para evitar crashes caso o plugin seja desativado.

### Pontos (Points)
- `gamipress_get_points_types()`: Retorna todos os tipos registrados.
- `gamipress_get_user_points( $user_id, $points_type )`: Retorna o saldo atual.
- `gamipress_award_points_to_user( $user_id, $amount, $points_type, $args )`: Adiciona pontos.

### Conquistas (Achievements)
- `gamipress_has_user_earned_achievement( $achievement_id, $user_id )`: Retorna objeto da conquista se ganha, ou false.
- `gamipress_get_user_earnings( $user_id, $args )`: Lista todas as conquistas ganhas pelo usuário.
- `gamipress_award_achievement_to_user( $achievement_id, $user_id )`: Libera uma conquista manualmente.

### Ranks
- `gamipress_get_user_rank( $user_id, $rank_type )`: Retorna o post do rank atual.
- `gamipress_get_next_rank( $rank_id )`: Retorna o post do próximo rank na sequência.
- `gamipress_get_user_rank_priority( $user_id, $rank_type )`: Prioridade numérica do rank.

### Logs
- `gamipress_get_logs( $args )`: Busca entradas no log de atividades (pontos ganhos, conquistas, etc).
    - `limit`: Quantidade de logs.
    - `user_id`: Filtro por usuário.

---

## 3. REST API (WP-JSON)

Embora o GamiPress tenha um add-on "Rest API Extended", o core expõe vários campos úteis:

### Endpoints Oficiais
- `GET /wp-json/wp/v2/achievement`: Lista conquistas disponíveis.
- `GET /wp-json/wp/v2/gamipress-logs`: Logs de atividades.

### Endpoint Customizado (DJ Zen Eyer)
Atualmente implementado em `inc/api.php`:
- `GET /wp-json/djzeneyer/v1/gamipress/user-data`
- **Retorno**: Payload unificado com pontos, rank atual/próximo, feed de logs e conquistas (ganhas e bloqueadas).

---

## 4. Hooks & Filtros Úteis

- `gamipress_earned_achievement`: Action disparada quando o usuário ganha algo. Ótimo para enviar notificações ou disparar confetti no frontend via WebSockets/polling.
- `gamipress_get_user_points`: Filter para modificar o valor de pontos retornado.
- `gamipress_public_achievement_{slug}`: Filter para esconder conquistas secretas da API/Frontend.

---

## 5. Boas Práticas

1. **Caching**: Use Transients para os dados do GamiPress no backend. O cálculo de conquistas e ranks pode ser pesado em sites com muitos usuários.
2. **Locked States**: Sempre envie a lista de conquistas bloqueadas para o frontend para incentivar o engajamento (Grounded in Psychology).
3. **Imagens**: Sempre use os thumbnails configurados no admin do GamiPress para manter a identidade visual.
