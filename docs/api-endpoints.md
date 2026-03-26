# WordPress REST API Endpoints — DJ Zen Eyer

Esta é a lista completa de rotas disponíveis na API do site `https://djzeneyer.com/wp-json/`.
Documento canônico para consultas de agentes de IA.

## 🟢 Namespace: `djzeneyer/v1` (Core Tema)
| Método | Endpoint | Função |
|---|---|---|
| GET | `/djzeneyer/v1/menu` | Menu principal (Polylang sync) |
| GET | `/djzeneyer/v1/shop/page` | Configurações da página de loja |
| GET | `/djzeneyer/v1/products` | Atalho para listagem de produtos |
| POST | `/djzeneyer/v1/subscribe` | Newsletter MailPoet |
| POST | `/djzeneyer/v1/user/update-profile` | Update de perfil (Demitido em favor de zeneyer-auth/v1) |

## 🔵 Namespace: `zeneyer-auth/v1` (Autenticação Master)
| Método | Endpoint | Função |
|---|---|---|
| POST | `/zeneyer-auth/v1/login` | Login (JWT + Google) |
| POST | `/zeneyer-auth/v1/register` | Registro com Turnstile |
| GET | `/zeneyer-auth/v1/me` | Perfil do usuário atual |
| POST | `/zeneyer-auth/v1/update` | Atualização de perfil (SSOT) |
| GET | `/zeneyer-auth/v1/validate` | Valida token Bearer |

## 🟣 Namespace: `zengame/v1` (Gamificação)
| Método | Endpoint | Função |
|---|---|---|
| GET | `/zengame/v1/me` | Dashboard completo (points, ranks, achivs) |
| GET | `/zengame/v1/leaderboard` | Ranking público (cached 1h) |
| POST | `/zengame/v1/track` | Track interaction (download, share, click) |

## 🟠 Namespace: `zen-bit/v2` (Eventos & Bandsintown)
| Método | Endpoint | Função |
|---|---|---|
| GET | `/zen-bit/v2/events` | Listagem de eventos (Bandsintown cached) |
| GET | `/zen-bit/v2/event/(?P<slug>[a-z0-9-]+)` | Detalhe de evento individual |
| GET | `/zen-bit/v2/gallery` | Galeria de fotos do Instagram/Events |

## 🟡 Namespace: `zen-seo/v1` (SEO Headless)
| Método | Endpoint | Função |
|---|---|---|
| GET | `/zen-seo/v1/metadata` | Tags dinâmicas por URL |
| GET | `/zen-seo/v1/sitemap` | Links para geração de sitemap |

---

## 🛠️ Namespaces Nativos / Plugins Terceiros (Referência)

### WooCommerce Store API (`/wc/store/v1`)
*Sempre usar `_fields` para evitar over-fetching.*
- **GET** `/cart`
- **POST** `/cart/add-item`
- **CHECKOUT** `/checkout`

### MailPoet (`/mailpoet/v1`)
- **GET** `/automations`
- **GET** `/automation-templates`

### Polylang (`/pll/v1`)
- **GET** `/languages`
- **GET** `/settings`

### Jetpack (`/jetpack/v4`)
- **GET** `/connection/check`
- **POST** `/remote_authorize`

### LiteSpeed (`/litespeed/v3`)
- **POST** `/ping`
- **POST** `/cdn_status`

---

## ⚠️ Regras Técnicas para IAs
1. **Cache**: Endpoints `zengame` e `zen-bit` usam transients pesados. Use `?nocache=1` em dev se necessário (se implementado).
2. **Auth**: Endpoints de perfil exigem header `Authorization: Bearer <TOKEN>`.
3. **Mojibake**: Este arquivo foi saneado. Não introduza caracteres como `Ã§` ou `Â©`. Use acentos normais UTF-8.
