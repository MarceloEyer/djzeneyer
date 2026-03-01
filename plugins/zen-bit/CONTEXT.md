# BandsInTown Plugin Context - /plugins/zen-bit

> **Responsibility:** Sync and display BandsInTown events with SEO optimization.

## Logic Flow
1. **API Integration:** Consome a API do BandsInTown usando o `artist_id` e `api_key` configurados no admin.
2. **Data Ownership:** O plugin é o único responsável por filtrar eventos sem data, validar campos obrigatórios e sanitizar o conteúdo. O frontend apenas renderiza o que este plugin entrega via REST.
3. **REST Endpoints:** 
   - `zen-bit/v1/events`: Retorna eventos normalizados.
   - `zen-bit/v1/events-schema`: Retorna o grafo JSON-LD para SEO.
3. **Caching:** Usa `transients` do WordPress com expiração de 24h (`zen_bit_throttle_hours`) para evitar rate limit da API externa.

## Rules
1. **Performance:** Assets (`css`/`js`) só devem ser carregados se o shortcode `[zen_bit_events]` estiver presente na página.
2. **SEO:** O shortcode `[zen_bit_events_schema]` é fundamental para injetar o `Ld+Json` no SSR.
3. **Architecture:** Segue o padrão Singleton. O bootstrap principal ocorre em `zen-bit.php`.

## Key Files
- `includes/class-zen-bit-api.php`: Onde reside a lógica de fetch e cache.
- `includes/class-zen-bit-shortcode.php`: Gerenciamento da renderização via shortcode.

---
*Mantenha os eventos sincronizados e o cache respeitado para evitar bloqueios na API.*
