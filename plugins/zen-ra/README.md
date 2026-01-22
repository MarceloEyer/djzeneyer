# Zen-RA (Zen Recent Activity Engine)

**Plugin WordPress de Gamificação Interna** para a Tribo Zen. 

⚠️ **IMPORTANTE**: Este plugin funciona como **engine interna** (não expõe REST API própria). 
Os endpoints REST são expostos pelo tema via `inc/api-dashboard.php`.

## Arquitetura

```
Frontend React
    ↓
WordPress REST API: /djzeneyer/v1/*
    ↓
inc/api-dashboard.php (Adapter/Facade)
    ↓
Zen_RA Plugin (Engine Interna)
    ↓
WooCommerce + GamiPress + Custom Meta
```

## O que este plugin faz

### ✅ Agregação de Dados
- **Combina múltiplas fontes**: WooCommerce orders + GamiPress achievements + Custom user meta
- **Feed unificado**: Retorna atividades ordenadas por timestamp em um único array
- **Filtros customizados**: Separa produtos comprados por categoria (tracks vs events)

### ✅ Gamificação de Compras
- **XP por pedidos**: Atribui XP configurável (padrão 50) quando pedido WooCommerce é completado
- **XP por conquistas**: Integra com sistema de pontos do GamiPress
- **Sistema de níveis**: Calcula nível baseado em XP (1000 XP = 1 nível)

### ✅ Features Customizadas
- **Login Streak**: Rastreia logins consecutivos (não disponível no GamiPress)
- **Cache inteligente**: 10 minutos com auto-clear em novas atividades
- **Performance**: Batch queries para evitar N+1

## Métodos Públicos (PHP)

### `get_player_stats(array $request)`
Retorna estatísticas do jogador:
```php
$stats = Zen_RA::get_instance()->get_player_stats(['id' => 123]);
// ['success' => true, 'stats' => ['xp' => 1500, 'level' => 2, 'rank' => [...]]]
```

### `get_activity_feed(array $request)`
Retorna feed de atividades (pedidos + conquistas):
```php
$feed = Zen_RA::get_instance()->get_activity_feed(['id' => 123]);
// ['success' => true, 'activities' => [...]]
```

### `get_user_tracks(array $request)`
Retorna produtos comprados da categoria 'music' ou 'tracks':
```php
$tracks = Zen_RA::get_instance()->get_user_tracks(['id' => 123]);
// ['success' => true, 'tracks' => [...]]
```

### `get_user_events(array $request)`
Retorna produtos comprados da categoria 'events' ou 'eventos':
```php
$events = Zen_RA::get_instance()->get_user_events(['id' => 123]);
// ['success' => true, 'events' => [...]]
```

### `get_streak_data(array $request)`
Retorna contador de login streak:
```php
$streak = Zen_RA::get_instance()->get_streak_data(['id' => 123]);
// ['success' => true, 'streak' => 7]
```

## Endpoints REST (via tema)

**Namespace**: `/wp-json/djzeneyer/v1/`

| Endpoint | Método | Descrição |
|----------|--------|------------|
| `/activity/{id}` | GET | Feed de atividades do usuário |
| `/tracks/{id}` | GET | Produtos de música comprados |
| `/events/{id}` | GET | Ingressos de eventos comprados |
| `/streak/{id}` | GET | Contador de login streak |

### Exemplos de uso:

```bash
# Activity feed
curl https://djzeneyer.com/wp-json/djzeneyer/v1/activity/123

# User tracks
curl https://djzeneyer.com/wp-json/djzeneyer/v1/tracks/123

# Login streak
curl https://djzeneyer.com/wp-json/djzeneyer/v1/streak/123
```

## Instalação

1. Upload da pasta `zen-ra` para `/wp-content/plugins/`
2. Ative o plugin no admin WordPress
3. Configure em **Settings → Zen Gamification**

## Configuração

Acesse **Settings → Zen Gamification** no admin:

- **XP por Compra**: Pontos atribuídos quando pedido WooCommerce é completado (padrão: 50)
- **XP Padrão Conquista**: XP para conquistas GamiPress sem pontos definidos (padrão: 10)
- **Cache (segundos)**: TTL do cache (padrão: 600 = 10 minutos)

## Error Handling

O plugin implementa tratamento de erros robusto:

1.  **Try-Catch Blocks**: Todos os métodos públicos (`get_player_stats`, `get_activity_feed`, etc.) são envolvidos em blocos `try-catch` para evitar Fatal Errors no site.
2.  **Graceful Degradation**: Se ocorrer um erro (ex: GamiPress não instalado, erro de banco), o plugin retorna um array vazio ou valores padrão (streak: 0, activities: []) para que o frontend continue funcionando.
3.  **Logs**: Erros são registrados no `error_log` do servidor com o prefixo `[Zen_RA]`.

## Como funciona o cache

### Auto-clear automático
O cache é limpo automaticamente quando:
- ✅ Novo pedido WooCommerce criado
- ✅ Status de pedido muda para 'completed'
- ✅ Nova conquista GamiPress desbloqueada
- ✅ Pontos GamiPress atualizados

### Performance
- **Batch queries**: Busca categorias de produtos em lote (evita N+1)
- **Cache por usuário**: Cada usuário tem cache independente
- **Memória**: Usa `wp_cache` (compatível com Redis/Memcached)

## Requirements

- **WordPress**: 5.0+
- **PHP**: 7.4+
- **WooCommerce**: Opcional (mas recomendado)
- **GamiPress**: Opcional (mas recomendado)

## Changelog

### 3.0.0-ENGINE (2026-01-21)
- ✅ Refatorado para engine interna (sem REST API própria)
- ✅ Otimização de queries N+1 em produtos
- ✅ Documentação atualizada para refletir arquitetura real

### 2.0.0 (2025-12-01)
- ✅ Sistema de cache inteligente
- ✅ Login streak tracking
- ✅ Integração WooCommerce + GamiPress

## Author

**DJ Zen Eyer** - Two-time World Champion Brazilian Zouk DJ

## License

GPL v2 or later
