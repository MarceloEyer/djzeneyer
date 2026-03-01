# Config Context - /src/config

> **Authority:** API Endpoints & Application Routing.

## Rules
1. **SSOT (Single Source of Truth):**
   - API URLs: `api.ts`
   - Route Mappings: `routes.ts`
2. **Priority:** Sempre usar `getApiConfig()` que prioriza `window.wpData` (injetado via PHP) antes de variáveis de ambiente.
3. **Security:** O `nonce` do WordPress deve ser obtido via `getNonce()` para qualquer requisição POST/PUT/DELETE.

## Key Files
- `api.ts`: Configuração central da API REST.
- `routes.ts`: Mapeamento de rotas PT/EN. **Não altere sem atualizar o `routes-data.json` nos scripts.**
- `siteConfig.ts`: Metadados globais.

---
*Configurações erradas aqui quebram a comunicação com o WordPress.*
