# API Endpoints â€” DJ Zen Eyer

**Base URL:** `https://djzeneyer.com/wp-json/`

---

## ðŸ§© Tema & Core (`djzeneyer/v1`)

### GET /menu
Estrutura de navegaÃ§Ã£o (main menu para Navbar).
```
GET /djzeneyer/v1/menu?lang=en|pt
Response: [ { ID, title, url, target } ]
```

### GET /theme-config
ConfiguraÃ§Ãµes globais do tema (branding, urls, etc).
```
GET /djzeneyer/v1/theme-config
Response: { site_title, site_description, primary_color, ... }
```

### POST /subscribe
InscriÃ§Ã£o na newsletter MailPoet.
```
POST /djzeneyer/v1/subscribe
Body: { email }
```

---

## ðŸ§  ZenGame â€” O CÃ©rebro (`zengame/v1`)

### GET /me
Dashboard completo de gamificaÃ§Ã£o do usuÃ¡rio autenticado.
```
GET /zengame/v1/me
Headers: { Authorization: "Bearer {token}" }
Response: { user_id, points, main_points, rank, achievements, logs, next_rank, stats, version }
```

### GET /leaderboard
Ranking pÃºblico cacheado.
```
GET /zengame/v1/leaderboard?point_type=zouk-points&limit=10
Response: [ { user_id, display_name, points, rank_name, avatar } ]
```

---

## ðŸ” AutenticaÃ§Ã£o (`zeneyer-auth/v1`) â€” v2.3.0

> [!NOTE]
> **Auth Bridge:** GraÃ§as Ã  v2.3.0, os endpoints nativos do WordPress (`/wp/v2/*`) agora aceitam `Authorization: Bearer` automaticamente.

### POST /login
JWT Login via email + password.
```
POST /zeneyer-auth/v1/login
Body: { email, password }
Response: { success: true, data: { token, refresh_token, user } }
```

### GET /session
Verifica o estado da sessÃ£o atual. **Essencial para o Frontend.**
```
GET /zeneyer-auth/v1/session
Headers: { Authorization: "Bearer {token}" }
Response: { authenticated: true, user, roles, exp }
```

### GET /validate
ValidaÃ§Ã£o rÃ¡pida de token (legado).
```
GET /zeneyer-auth/v1/validate
Headers: { Authorization: "Bearer {token}" }
Response: { success: true, data: { valid: true, user } }
```

### GET /profile
Dados estendidos do perfil (Real Name, Dance Role, Social).
```
GET /zeneyer-auth/v1/profile
Headers: { Authorization: "Bearer {token}" }
Response: { success: true, data: { id, email, real_name, dance_role, gender, ... } }
```

### POST /profile
Atualiza metadados do perfil.
```
POST /zeneyer-auth/v1/profile
Headers: { Authorization: "Bearer {token}" }
Body: { real_name, preferred_name, dance_role, gender, ... }
```

### GET /newsletter
Status de inscriÃ§Ã£o no MailPoet (ou User Meta fallback).
```
GET /zeneyer-auth/v1/newsletter
Headers: { Authorization: "Bearer {token}" }
Response: { success: true, subscribed: true, method: "mailpoet|user_meta" }
```

### POST /newsletter
Ativa/Desativa inscriÃ§Ã£o.
```
POST /zeneyer-auth/v1/newsletter
Headers: { Authorization: "Bearer {token}" }
Body: { enabled: true|false }
```

---

## ðŸ“… Eventos (`zen-bit/v2`)

### GET /events
Lista de eventos via Bandsintown (SWR cached).
```
GET /zen-bit/v2/events
Query params:
  - mode: upcoming|past|all
  - limit: 50 (default)
  - lang: en|pt
Response: { success, count, events: [ ZenBitEventListItem ] }
```

### GET /events/{event_id}
Detalhes completos (3-tier cache lookup).
```
GET /zen-bit/v2/events/12345
Response: { success, event: ZenBitEventDetail }
```

### GET /events/schema
JSON-LD @graph para SEO.
```
GET /zen-bit/v2/events/schema?mode=upcoming
```

---

## ðŸ›’ Store (`wc/store/v1`)

### GET /products
Lista nativa do WooCommerce Store API.
```
GET /wc/store/v1/products
```

### GET /cart
Estado do carrinho (requer Nonce ou Auth).
```
GET /wc/store/v1/cart
```

---

## ðŸ” SEO & Sitemaps (`zen-seo/v1`)

### GET /metadata
Meta tags dinÃ¢micas para HeadlessSEO.
```
GET /zen-seo/v1/meta?url=/events/slug
```

---

## ðŸ“‹ Resumo de Query Params Comuns

| Param | Valor | Uso |
|-------|-------|-----|
| `limit` | nÃºmero | PaginaÃ§Ã£o |
| `mode` | upcoming\|past | Filtro de eventos (Zen BIT) |
| `point_type`| slug | Filtro de leaderboard |
| `lang` | en\|pt | InternacionalizaÃ§Ã£o |
| `_fields` | csv | **ObrigatÃ³rio** para `wc/store/v1` (otimizaÃ§Ã£o) |

---

> [!IMPORTANT]
> **Namespace Zen BIT:** Usar obrigatoriamente `v2` para suporte a SWR e JWT.
> **Namespace ZenGame:** Usar `zengame/v1` em vez de `djzeneyer/v1` para isolamento do plugin.
> **Auth:** Todos os endpoints privativos (`/me`, `admin/*`, `cart/*`) aceitam obrigatoriamente `Authorization: Bearer`.

