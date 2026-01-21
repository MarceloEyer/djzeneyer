# API de Gamificação - DJ Zen Eyer

## Visão Geral

Este documento descreve a arquitetura e funcionamento da API de gamificação do DJ Zen Eyer, que integra WooCommerce e GamiPress em um sistema headless WordPress.

## Arquitetura

```
Frontend React (Next.js)
    ↓ HTTP Requests
WordPress REST API: /wp-json/djzeneyer/v1/*
    ↓ Facade Pattern
inc/api-dashboard.php (Adapter/Facade)
    ↓ PHP Method Calls
plugins/zen-ra/zen-ra.php (Engine Interna)
    ↓ Data Aggregation
WooCommerce + GamiPress + WordPress User Meta
```

## Componentes

### 1. Frontend React
- Consome REST API no namespace `/djzeneyer/v1/`
- Autenticação via WordPress nonce
- Exibe feeds de atividade, estatísticas e conquistas

### 2. API Dashboard (inc/api-dashboard.php)
**Papel**: Adapter/Facade entre frontend e plugin

**Responsabilidades**:
- Registra rotas REST API no namespace `djzeneyer/v1`
- Roteia requisições para métodos do plugin Zen_RA
- Valida permissões (público apenas GET)

### 3. Plugin Zen-RA (plugins/zen-ra/zen-ra.php)
**Papel**: Engine interna de gamificação

**Responsabilidades**:
- Agrega dados de WooCommerce + GamiPress
- Gerencia cache inteligente (10 min, auto-clear)
- Calcula XP, níveis e ranks
- Rastreia login streaks
- Filtra produtos por categoria

**IMPORTANTE**: Este plugin NÃO expõe REST API própria!

## Endpoints REST API

### GET /djzeneyer/v1/activity/{id}
Retorna feed de atividades do usuário (pedidos + conquistas)

**Exemplo**:
```bash
curl https://djzeneyer.com/wp-json/djzeneyer/v1/activity/123
```

**Resposta**:
```json
{
  "success": true,
  "activities": [
    {
      "id": "ord_456",
      "type": "loot",
      "description": "Order #456",
      "xp": 50,
      "timestamp": 1737417600
    }
  ]
}
```

### GET /djzeneyer/v1/tracks/{id}
Retorna produtos de música comprados

### GET /djzeneyer/v1/events/{id}
Retorna ingressos de eventos comprados

### GET /djzeneyer/v1/streak/{id}
Retorna contador de login consecutivo

## Fluxo de Dados

1. **Frontend faz requisição**: `GET /djzeneyer/v1/activity/123`
2. **WordPress roteia** para `api-dashboard.php`
3. **Adapter chama plugin**: `Zen_RA::get_instance()->get_activity_feed(['id' => 123])`
4. **Plugin verifica cache**: Se hit, retorna; senão continua
5. **Plugin busca dados**:
   - WooCommerce: 5 últimos pedidos completados
   - GamiPress: 5 últimas conquistas
6. **Plugin agrega e ordena** por timestamp
7. **Plugin salva no cache** (10 min)
8. **Plugin retorna** array de atividades
9. **Adapter formata** para REST response
10. **Frontend recebe** JSON

## Cache

### Estratégia
- **TTL**: 600 segundos (10 minutos)
- **Tipo**: WordPress Object Cache (compatível Redis/Memcached)
- **Escopo**: Por usuário + tipo de dados

### Auto-clear
Cache é limpo automaticamente em:
- Novo pedido WooCommerce
- Mudança de status de pedido para 'completed'
- Nova conquista GamiPress
- Atualização de pontos GamiPress

## Vantagens da Arquitetura

### Por que NÃO usar GamiPress + WooCommerce diretamente?

1. **Agregação**: Frontend precisaria fazer múltiplas chamadas
2. **Cache centralizado**: Melhor performance
3. **Lógica customizada**: XP por compras, filtros por categoria, streaks
4. **Abstração**: Frontend não conhece estrutura interna do WP
5. **Flexibilidade**: Fácil adicionar novas fontes de dados

## Configuração

Acesse **WordPress Admin → Settings → Zen Gamification**:

- **XP por Compra**: 50 (padrão)
- **XP Padrão Conquista**: 10 (padrão)
- **Cache TTL**: 600 segundos (padrão)

## Desenvolvimento

### Adicionar novo endpoint

1. **No api-dashboard.php**, adicione rota:
```php
register_rest_route($ns, '/meu-endpoint/{id}', [
    'methods' => 'GET',
    'callback' => [$this, 'meu_callback'],
    'permission_callback' => '__return_true',
]);
```

2. **Crie método adapter**:
```php
public function meu_callback($request) {
    $plugin = $this->plugin();
    return rest_ensure_response(
        $plugin->meu_metodo(['id' => $request['id']])
    );
}
```

3. **No zen-ra.php**, implemente lógica**:
```php
public function meu_metodo(array $request) {
    // Lógica aqui
    return ['success' => true, 'data' => $result];
}
```

## Troubleshooting

### Erro 404 na API
- ✅ Verifica se está usando namespace correto: `/djzeneyer/v1/*`
- ❌ NÃO use: `/zen-ra/v1/*` (não existe!)

### Cache não atualiza
- Verifique se hooks de auto-clear estão registrados
- Force clear: `wp_cache_delete("feed_{$user_id}", 'zen_ra_cache')`

### Plugin não encontrado
- Verifique se `class_exists('Zen_RA')` retorna true
- Garanta que plugin está ativado no admin

## Referências

- [Plugin README](../plugins/zen-ra/README.md)
- [Código do Plugin](../plugins/zen-ra/zen-ra.php)
- [Código do Adapter](../inc/api-dashboard.php)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [GamiPress Documentation](https://gamipress.com/docs/)
