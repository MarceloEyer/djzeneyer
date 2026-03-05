# API Endpoints — DJ Zen Eyer

**Base URL:** `https://djzeneyer.com/wp-json/`

## 🧩 Tema & Core (`djzeneyer/v1`)
- `GET /gamipress/{user_id}`: Dados de gamificacao completos.
- `GET /activity`: Atividade recente global.
- `GET /menu`: Estrutura de navegacao.
- `GET /theme-config`: Configuracoes globais do tema.

## 🔐 Autenticacao (`zeneyer-auth/v1`)
- `POST /login`: JWT Login.
- `POST /register`: Registro de novo usuario.
- `POST /google-login`: OAuth2 via Google.
- `POST /refresh`: Renovacao de token.
- `GET  /validate`: Validacao de token atual.

## 📅 Eventos (`zen-bit/v1`)
- `GET /events`: Lista de eventos via Bandsintown (cached 1h).

## 🛒 Store (`wc/store/v1`)
- `GET  /products`: Lista de produtos WooCommerce.
- `POST /cart/add-item`: Adicionar ao carrinho.
- `GET  /checkout`: Dados para finalizacao de compra.

## 🔍 SEO & Sitemaps (`zen-seo/v1`)
- `GET /metadata?url={path}`: Meta tags dinâmicas.
- `GET /sitemap`: Lista de URLs indexaveis.

> [!IMPORTANT]
> **Namespace Descontinuado:** NUNCA usar `zen-ra/v1`. Use `djzeneyer/v1`.
