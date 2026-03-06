# API Endpoints — DJ Zen Eyer

**Base URL:** `https://djzeneyer.com/wp-json/`

---

## 🧩 Tema & Core (`djzeneyer/v1`)

### GET /menu
Estrutura de navegação (main menu para Navbar).
```
GET /djzeneyer/v1/menu?lang=en|pt
Response: [ { ID, title, url, target } ]
```

### GET /theme-config
Configurações globais do tema (branding, urls, etc).
```
GET /djzeneyer/v1/theme-config
Response: { site_title, site_description, primary_color, ... }
```

### POST /subscribe
Inscrição na newsletter MailPoet.
```
POST /djzeneyer/v1/subscribe
Body: { email }
```

---

## 🧠 ZenGame — O Cérebro (`zengame/v1`)

### GET /me
Dashboard completo de gamificação do usuário autenticado.
```
GET /zengame/v1/me
Headers: { Authorization: "Bearer {token}" }
Response: { user_id, points, main_points, rank, achievements, logs, next_rank, stats, version }
```

### GET /leaderboard
Ranking público cacheado.
```
GET /zengame/v1/leaderboard?point_type=zouk-points&limit=10
Response: [ { user_id, display_name, points, rank_name, avatar } ]
```

---

## 🔐 Autenticação (`zeneyer-auth/v1`) — v2.3.0

> [!NOTE]
> **Auth Bridge:** Graças à v2.3.0, os endpoints nativos do WordPress (`/wp/v2/*`) agora aceitam `Authorization: Bearer` automaticamente.

### POST /login
JWT Login via email + password.
```
POST /zeneyer-auth/v1/login
Body: { email, password }
Response: { success: true, data: { token, refresh_token, user } }
```

### GET /session
Verifica o estado da sessão atual. **Essencial para o Frontend.**
```
GET /zen-bit/v1/session
Headers: { Authorization: "Bearer {token}" }
Response: { authenticated: true, user, roles, exp }
```

### GET /validate
Validação rápida de token (legado).
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
Status de inscrição no MailPoet (ou User Meta fallback).
```
GET /zeneyer-auth/v1/newsletter
Headers: { Authorization: "Bearer {token}" }
Response: { success: true, subscribed: true, method: "mailpoet|user_meta" }
```

### POST /newsletter
Ativa/Desativa inscrição.
```
POST /zeneyer-auth/v1/newsletter
Headers: { Authorization: "Bearer {token}" }
Body: { enabled: true|false }
```

---

## 📅 Eventos (`zen-bit/v2`)

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

## 🛒 Store (`wc/store/v1`)

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

## 🔍 SEO & Sitemaps (`zen-seo-lite/v1`)

### GET /metadata
Meta tags dinâmicas para HeadlessSEO.
```
GET /zen-seo-lite/v1/metadata?url=/events/slug
```

---

## 📋 Resumo de Query Params Comuns

| Param | Valor | Uso |
|-------|-------|-----|
| `limit` | número | Paginação |
| `mode` | upcoming\|past | Filtro de eventos (Zen BIT) |
| `point_type`| slug | Filtro de leaderboard |
| `lang` | en\|pt | Internacionalização |
| `_fields` | csv | **Obrigatório** para `wc/store/v1` (otimização) |

---

> [!IMPORTANT]
> **Namespace Zen BIT:** Usar obrigatoriamente `v2` para suporte a SWR e JWT.
> **Namespace ZenGame:** Usar `zengame/v1` em vez de `djzeneyer/v1` para isolamento do plugin.
> **Auth:** Todos os endpoints privativos (`/me`, `admin/*`, `cart/*`) aceitam obrigatoriamente `Authorization: Bearer`.
