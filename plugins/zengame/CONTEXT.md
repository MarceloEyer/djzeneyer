# ZenGame Plugin Context - /plugins/zengame

> **Responsibility:** Gaming & Activity Bridge (GamiPress + WooCommerce).

## Logic Flow
1. **SSOT for Gamification:** Este plugin é o **único** lugar onde a lógica de pontuação, níveis e conquistas deve ser processada. 
2. **REST Endpoints:**
   - `/djzeneyer/v1/gamipress/user-data`: Agrega pontos, ranks (1000pt/nível), conquistas e logs.
   - `/djzeneyer/v1/gamipress/leaderboard`: Ranking público cacheado.
3. **Data Aggregation:** Cruza dados do GamiPress com o WooCommerce (ex: `totalTracks` via downloads e `eventsAttended` via categorias de pedido).

## Rules
1. **Brain Principle:** O frontend (**DashboardPage.tsx**) nunca deve calcular progresso ou filtrar conquistas. Ele apenas consome o que este plugin entrega.
2. **Exclusividade:** Este plugin é o **único** dono da lógica de jogo. Se a IA tentar criar rotas de GamiPress em `inc/`, ela está errada.
3. **Caching:** Usa transients (`djz_gamipress_v7`) com 24h de TTL. Invalida automaticamente em novos pedidos ou premiações.

## Key Functions
- `get_gamipress_user_data()`: O "faz-tudo" para o dashboard do usuário.
- `get_user_events_attended()`: Lógica complexa de filtragem de pedidos por categoria.

---
*Não duplique cálculos de GamiPress no React. Se o cálculo mudar, mude aqui.*
