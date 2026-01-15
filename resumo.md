# 🎧 DJ Zen Eyer - Resumo Técnico Completo do Projeto

**Versão:** 1.1.0
**Última Atualização:** Janeiro 2026
**Arquitetura:** Headless WordPress + React SPA
**Status:** Produção Ativa

---

## 📖 Índice

1. [Visão Geral](#-visão-geral)
2. [Arquitetura do Sistema](#-arquitetura-do-sistema)
3. [Estrutura de Diretórios](#-estrutura-de-diretórios)
4. [Fluxo de Dados](#-fluxo-de-dados)
5. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
6. [Plugins Customizados](#-plugins-customizados)
7. [Sistema de Autenticação](#-sistema-de-autenticação)
8. [Internacionalização (i18n)](#-internacionalização-i18n)
9. [SEO e Performance](#-seo-e-performance)
10. [Build e Deploy](#-build-e-deploy)
11. [Como Adicionar Features](#-como-adicionar-features)
12. [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

O site **djzeneyer.com** é uma aplicação web moderna de alta performance para o DJ Zen Eyer (Campeão Mundial de Brazilian Zouk 2x). O projeto utiliza uma arquitetura headless onde:

- **Frontend:** React 18 renderiza toda a interface do usuário
- **Backend:** WordPress funciona apenas como API REST (sem renderização de templates)
- **Hosting:** Hostinger VPS com LiteSpeed + Cloudflare CDN
- **Deploy:** Automático via GitHub Actions

### Características Principais

✅ **Bilíngue:** Inglês (padrão) e Português via Polylang
✅ **SSG + SPA:** HTML pré-renderizado para SEO + navegação SPA para velocidade
✅ **Autenticação:** JWT + Google OAuth via plugin customizado
✅ **E-commerce:** Integração com WooCommerce
✅ **Gamificação:** Sistema de pontos, ranks e conquistas via GamiPress
✅ **Performance:** LCP < 1.8s, bundle < 200KB gzipped
✅ **SEO:** Schema.org, sitemap dinâmico, meta tags otimizadas

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO FINAL                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   CLOUDFLARE CDN      │ ◄── Cache de Edge
         │   (Cache + Security)   │     SSL/TLS, DDoS Protection
         └───────────┬───────────┘
                     │
                     ▼
    ┌────────────────────────────────────┐
    │   HOSTINGER VPS (LiteSpeed)        │
    │  ┌──────────────────────────────┐  │
    │  │  FRONTEND (React SPA)        │  │
    │  │  /dist/ (HTML estático)      │  │
    │  └──────────────────────────────┘  │
    │  ┌──────────────────────────────┐  │
    │  │  BACKEND (WordPress API)     │  │
    │  │  /wp-json/                   │  │
    │  │  • REST API                  │  │
    │  │  • Custom Plugins            │  │
    │  │  • WooCommerce               │  │
    │  │  • GamiPress                 │  │
    │  └──────────────────────────────┘  │
    │  ┌──────────────────────────────┐  │
    │  │  DATABASE (MySQL)            │  │
    │  │  • wp_posts, wp_users        │  │
    │  │  • WooCommerce tables        │  │
    │  │  • GamiPress tables          │  │
    │  └──────────────────────────────┘  │
    └────────────────────────────────────┘
                     ▲
                     │
         ┌───────────────────────┐
         │  GITHUB ACTIONS       │ ◄── CI/CD
         │  (Build & Deploy)     │     Automático no push
         └───────────────────────┘
```

### Fluxo de Requisição

1. **Primeira Visita (SSR/SSG):**
   - Usuário acessa `djzeneyer.com/about`
   - Cloudflare serve HTML pré-renderizado do cache
   - Página carrega instantaneamente com SEO completo
   - React "hidrata" a página e assume o controle

2. **Navegação Subsequente (SPA):**
   - Usuário clica em link interno
   - React Router intercepta navegação
   - Dados carregados via fetch do WordPress REST API
   - Transição suave sem reload de página

3. **Requisição de API:**
   ```
   React Component → fetch() → WordPress REST API → MySQL → Response JSON
   ```

---

## 📁 Estrutura de Diretórios

```
djzeneyer/
│
├── 📂 src/                          # FRONTEND REACT
│   ├── 📂 components/               # Componentes reutilizáveis
│   │   ├── AppRoutes.tsx           # Configuração de rotas
│   │   ├── EventsList.tsx          # Lista de eventos
│   │   ├── HeadlessSEO.tsx         # ⭐ Gerenciador de SEO
│   │   ├── 📂 auth/                # Modais de login/registro
│   │   ├── 📂 common/              # Footer, Navbar, UserMenu
│   │   └── 📂 account/             # Componentes de conta do usuário
│   │
│   ├── 📂 pages/                    # Páginas do site (lazy loaded)
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── DashboardPage.tsx       # Painel do usuário
│   │   └── ...
│   │
│   ├── 📂 contexts/                 # Estado global React
│   │   ├── UserContext.tsx         # Auth state
│   │   ├── CartContext.tsx         # Carrinho WooCommerce
│   │   └── MusicPlayerContext.tsx  # Player de música
│   │
│   ├── 📂 hooks/                    # Custom React Hooks
│   │   ├── useQueries.ts           # React Query hooks
│   │   ├── useUserEvents.ts
│   │   └── useGamiPress.ts
│   │
│   ├── 📂 locales/                  # Traduções i18n
│   │   ├── en/translation.json
│   │   └── pt/translation.json
│   │
│   ├── 📂 config/                   # Configurações
│   │   ├── api.ts                  # URLs de API
│   │   ├── routes.ts               # Mapa de rotas
│   │   └── siteConfig.ts           # Config do site
│   │
│   ├── App.tsx                      # Componente raiz
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Estilos globais Tailwind
│
├── 📂 inc/                          # BACKEND WORDPRESS (PHP)
│   ├── setup.php                   # Configurações do tema
│   ├── api.php                     # ⭐ Endpoints REST customizados
│   ├── cpt.php                     # Custom Post Types
│   ├── spa.php                     # Integração React SPA
│   ├── vite.php                    # Injeção de assets Vite
│   ├── csp.php                     # Content Security Policy
│   ├── cleanup.php                 # Otimizações WordPress
│   ├── metaboxes.php               # Admin metaboxes
│   └── ai-llm.php                  # Suporte para AI/LLM bots
│
├── 📂 plugins/                      # PLUGINS CUSTOMIZADOS
│   ├── 📂 zen-seo-lite/            # ⭐ SEO Engine
│   │   ├── zen-seo-lite.php
│   │   ├── includes/
│   │   │   ├── class-zen-seo-meta-tags.php
│   │   │   ├── class-zen-seo-schema.php
│   │   │   ├── class-zen-seo-sitemap.php
│   │   │   └── class-zen-seo-rest-api.php
│   │   └── admin/
│   │
│   ├── 📂 zeneyer-auth/            # ⭐ Autenticação JWT + OAuth
│   │   ├── zeneyer-auth.php
│   │   └── includes/
│   │       ├── Auth/
│   │       │   ├── class-google-provider.php
│   │       │   └── class-password-auth.php
│   │       ├── Core/
│   │       │   ├── class-jwt-manager.php
│   │       │   ├── class-cors-handler.php
│   │       │   └── class-rate-limiter.php
│   │       └── API/
│   │           └── class-rest-routes.php
│   │
│   ├── 📂 zen-bit/                 # Integração Bandsintown
│   └── 📂 zen-ra/                  # Recent Activity API
│
├── 📂 scripts/                      # BUILD SCRIPTS
│   ├── generate-sitemap.js         # Gera sitemap XML
│   └── prerender.js                # SSG com Puppeteer
│
├── 📂 docs/                         # DOCUMENTAÇÃO
│   ├── 📂 setup/
│   ├── 📂 plugins/
│   ├── 📂 guides/
│   └── 📂 troubleshooting/
│
├── 📂 public/                       # ASSETS ESTÁTICOS
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.ico
│   └── ...
│
├── 📂 dist/                         # ⭐ BUILD DE PRODUÇÃO
│   ├── index.html                  # HTML pré-renderizado
│   ├── assets/                     # JS/CSS minificados
│   └── ...
│
├── .htaccess                        # Regras Apache/LiteSpeed
├── functions.php                    # Carrega /inc/*.php
├── header.php                       # Injeta React root
├── footer.php                       # Fecha HTML
├── index.php                        # Entry point WordPress
├── package.json                     # Dependências Node.js
├── vite.config.ts                  # Configuração Vite
├── tailwind.config.js              # Configuração Tailwind
└── tsconfig.json                    # Configuração TypeScript
```

---

## 🔄 Fluxo de Dados

### 1. Autenticação (JWT + Google OAuth)

```
┌─────────────────────────────────────────────────────┐
│ FRONTEND (React)                                     │
│                                                      │
│  [Login Form] ──────► AuthModal.tsx                 │
│        │                                             │
│        │ POST /wp-json/zeneyer-auth/v1/login        │
│        ▼                                             │
└────────┼──────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ BACKEND (WordPress Plugin: zeneyer-auth)            │
│                                                      │
│  class-rest-routes.php                              │
│    │                                                 │
│    ├──► Valida credenciais (MySQL)                 │
│    ├──► Gera JWT token (Firebase PHP-JWT)          │
│    └──► Retorna: { token, user, expires }          │
│                                                      │
└────────┬──────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│ FRONTEND (React)                                     │
│                                                      │
│  UserContext.tsx                                    │
│    ├──► Salva token em localStorage                │
│    ├──► Atualiza estado global do usuário          │
│    └──► Redireciona para /dashboard                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 2. Carrinho WooCommerce

```
React Component (ShopPage)
    │
    ├──► useCart() hook
    │      │
    │      ├──► ADD_TO_CART
    │      │      └──► POST /wp-json/wc/store/v1/cart/add-item
    │      │
    │      ├──► GET_CART
    │      │      └──► GET /wp-json/wc/store/v1/cart
    │      │
    │      └──► REMOVE_ITEM
    │             └──► DELETE /wp-json/wc/store/v1/cart/items/:key
    │
    └──► CartContext atualiza estado global
```

### 3. Gamificação (GamiPress)

```
DashboardPage.tsx
    │
    ├──► useGamiPress() hook
    │      │
    │      ├──► GET /wp-json/gamipress/v1/users/:id/points
    │      ├──► GET /wp-json/gamipress/v1/users/:id/ranks
    │      └──► GET /wp-json/gamipress/v1/users/:id/achievements
    │
    └──► Renderiza:
         - UserStatsCards (pontos, rank, achievements)
         - GamificationWidget (progresso, badges)
```

### 4. SEO Headless

```
Qualquer Page Component
    │
    └──► <HeadlessSEO
           title="About DJ Zen Eyer"
           description="..."
           url="/about"
           image="..."
           schema={customSchema}
         />
              │
              ├──► React Helmet injeta:
              │      • <title>
              │      • <meta name="description">
              │      • <link rel="canonical">
              │      • Open Graph tags
              │      • Twitter Card tags
              │      • Schema.org JSON-LD
              │      • hreflang tags (en/pt)
              │
              └──► Durante build (prerender.js):
                     Puppeteer captura HTML final
                     → Salva em dist/about/index.html
                     → Google indexa conteúdo completo
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend Stack

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 18.3.1 | Biblioteca UI principal |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 5.4.21 | Build tool ultra-rápido |
| **Tailwind CSS** | 3.4.19 | Framework de estilos |
| **Framer Motion** | 11.18.2 | Animações fluidas |
| **React Router** | 7.0.0 | Navegação SPA |
| **React Query** | 5.90.12 | Cache de dados API |
| **i18next** | 25.7.2 | Internacionalização |
| **React Helmet Async** | 2.0.5 | Gerenciamento de `<head>` |
| **Google OAuth** | 0.13.1 | Login social |

### Backend Stack

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **WordPress** | 6.0+ | Headless CMS |
| **PHP** | 7.4+ | Linguagem backend |
| **MySQL** | 5.7+ | Banco de dados |
| **WooCommerce** | Latest | E-commerce |
| **GamiPress** | Latest | Gamificação |
| **Polylang** | Latest | Multilíngue |

### Infrastructure

| Componente | Tecnologia |
|------------|------------|
| **Web Server** | LiteSpeed |
| **CDN** | Cloudflare |
| **Hosting** | Hostinger VPS |
| **CI/CD** | GitHub Actions |
| **SSL** | Let's Encrypt (via Cloudflare) |

---

## 🔌 Plugins Customizados

### 1. Zen SEO Lite Pro v8.0.0

**Localização:** `/plugins/zen-seo-lite/`

**Função:** Motor de SEO completo para arquitetura headless.

**Recursos:**
- ✅ API REST para meta tags (`/wp-json/zen-seo/v1/meta/:slug`)
- ✅ Schema.org automatizado (Person, MusicGroup, Event)
- ✅ Sitemap XML dinâmico com cache
- ✅ Metabox no admin WordPress para customização
- ✅ Suporte a eventos (event_date, event_location, event_ticket)
- ✅ Open Graph e Twitter Cards
- ✅ Cache inteligente (Redis/Memcached compatible)

**Endpoints:**
```
GET /wp-json/zen-seo/v1/meta/{slug}?lang=pt
GET /wp-json/zen-seo/v1/sitemap
GET /wp-json/zen-seo/v1/schema/{type}/{id}
```

**Exemplo de Uso:**
```typescript
const { data } = await fetch(
  `${wpRestUrl}/zen-seo/v1/meta/about?lang=${currentLang}`
);

<HeadlessSEO
  data={data}
  schema={data.schema}
  hrefLang={getHrefLangUrls(location.pathname, siteUrl)}
/>
```

---

### 2. ZenEyer Auth Pro v2.0.0

**Localização:** `/plugins/zeneyer-auth/`

**Função:** Sistema de autenticação JWT com Google OAuth para headless WordPress.

**Recursos:**
- ✅ Login via email/senha
- ✅ Login via Google OAuth 2.0
- ✅ Geração e validação de JWT tokens
- ✅ Rate limiting (proteção contra brute force)
- ✅ CORS configurado para React
- ✅ Refresh tokens automáticos
- ✅ Logout com blacklist de tokens

**Endpoints:**
```
POST /wp-json/zeneyer-auth/v1/login
POST /wp-json/zeneyer-auth/v1/register
POST /wp-json/zeneyer-auth/v1/google-login
POST /wp-json/zeneyer-auth/v1/refresh
POST /wp-json/zeneyer-auth/v1/logout
GET  /wp-json/zeneyer-auth/v1/validate
```

**Fluxo de Autenticação:**
```typescript
// 1. Login
const response = await fetch(`${wpRestUrl}/zeneyer-auth/v1/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const { token, user, expires } = await response.json();

// 2. Salvar token
localStorage.setItem('authToken', token);

// 3. Usar em requisições subsequentes
fetch(`${wpRestUrl}/wp/v2/users/me`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 3. Zen BIT v1.0.0

**Localização:** `/plugins/zen-bit/`

**Função:** Integração com Bandsintown API para exibir eventos ao vivo.

**Recursos:**
- ✅ Cache de eventos (TTL: 1 hora)
- ✅ Formatação automática de datas/localização
- ✅ Shortcode: `[zen_bit_events]`
- ✅ REST API endpoint
- ✅ Design responsivo

**Endpoint:**
```
GET /wp-json/zen-bit/v1/events
```

---

### 4. Zen-RA v1.0.0

**Localização:** `/plugins/zen-ra/`

**Função:** Recent Activity API - histórico gamificado do usuário.

**Recursos:**
- ✅ Integra WooCommerce orders + GamiPress achievements
- ✅ Timeline de atividades
- ✅ Badges e conquistas
- ✅ Streak tracking (dias consecutivos)

**Endpoint:**
```
GET /wp-json/zen-ra/v1/activity/:user_id
```

**Retorna:**
```json
{
  "activities": [
    {
      "type": "purchase",
      "title": "Comprou Zen Zouk Pack Vol. 3",
      "date": "2025-01-15T10:30:00Z",
      "icon": "shopping-bag"
    },
    {
      "type": "achievement",
      "title": "Desbloqueou: Zouk Master",
      "date": "2025-01-14T18:20:00Z",
      "icon": "trophy"
    }
  ],
  "streak": {
    "current": 7,
    "longest": 14
  }
}
```

---

## 🔐 Sistema de Autenticação

### Arquitetura de Segurança

```
┌────────────────────────────────────────────────┐
│  FRONTEND (React)                               │
│                                                 │
│  1. Usuário clica em "Login"                   │
│  2. AuthModal.tsx renderiza formulário         │
│  3. Envia credenciais via HTTPS                │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │ CLOUDFLARE WAF  │ ◄── Firewall, DDoS
         └─────────┬───────┘
                   │
                   ▼
┌────────────────────────────────────────────────┐
│  BACKEND (WordPress + ZenEyer Auth)            │
│                                                 │
│  1. Rate Limiter (max 5 tentativas/min)       │
│  2. Valida credenciais (password_verify)       │
│  3. Gera JWT token (HS256, exp: 7 dias)       │
│  4. Retorna: { token, user, expires }         │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────┐
│  FRONTEND (React)                               │
│                                                 │
│  1. Armazena token em localStorage             │
│  2. Inclui em header de todas as requisições:  │
│     Authorization: Bearer {token}              │
│  3. Auto-refresh antes de expirar              │
│                                                 │
└────────────────────────────────────────────────┘
```

### Proteções Implementadas

✅ **HTTPS Only:** Todas as requisições via SSL
✅ **CORS Restritivo:** Apenas djzeneyer.com autorizado
✅ **Rate Limiting:** Proteção contra brute force
✅ **Token Expiration:** JWT expira em 7 dias
✅ **XSS Protection:** DOMPurify sanitiza inputs
✅ **CSRF Protection:** Nonces WordPress
✅ **SQL Injection:** Prepared statements
✅ **CSP Headers:** Content Security Policy ativo

---

## 🌍 Internacionalização (i18n)

### Sistema de Idiomas

O site utiliza **dual-language routing**:

- **Inglês (EN):** `/about`, `/events`, `/shop` (padrão)
- **Português (PT):** `/pt/about`, `/pt/events`, `/pt/shop`

### Fluxo de Detecção de Idioma

```typescript
// 1. Detecção automática (primeira visita)
const browserLang = navigator.language; // "pt-BR"
if (browserLang.startsWith('pt')) {
  window.location.href = '/pt';
}

// 2. Persistência
localStorage.setItem('preferredLanguage', 'pt');

// 3. Troca manual
<button onClick={() => i18n.changeLanguage('pt')}>
  Português
</button>
```

### Arquivos de Tradução

**Localização:** `src/locales/`

```
locales/
├── en/
│   └── translation.json  ◄── { "welcome": "Welcome", ... }
└── pt/
    └── translation.json  ◄── { "welcome": "Bem-vindo", ... }
```

**Uso em Componentes:**
```typescript
import { useTranslation } from 'react-i18next';

function Header() {
  const { t } = useTranslation();

  return <h1>{t('welcome')}</h1>;
}
```

### Conteúdo WordPress Bilíngue

**Plugin:** Polylang

```php
// No WordPress, posts/pages têm idioma associado
$posts_en = get_posts(['lang' => 'en']);
$posts_pt = get_posts(['lang' => 'pt']);
```

**API Request:**
```typescript
// Frontend especifica idioma via query param
fetch(`${wpRestUrl}/wp/v2/posts?lang=pt`);
```

---

## 🚀 SEO e Performance

### Estratégia de SEO

#### 1. Static Site Generation (SSG)

**Problema:** SPAs não são bem indexadas por crawlers (Google, Bing).

**Solução:** Pré-renderizar HTML durante build.

```bash
npm run build
  │
  ├──► vite build (gera JS/CSS)
  │
  └──► scripts/prerender.js
         │
         ├──► Puppeteer inicia servidor local
         ├──► Navega por cada rota:
         │      /about → dist/about/index.html
         │      /events → dist/events/index.html
         │      /pt/about → dist/pt/about/index.html
         │
         └──► HTML final contém:
                • Meta tags completas
                • Schema.org JSON-LD
                • Conteúdo textual indexável
```

**Resultado:**
- Google vê HTML completo instantaneamente
- LCP (Largest Contentful Paint) < 1.8s
- CLS (Cumulative Layout Shift) < 0.05

#### 2. HeadlessSEO Component

**Arquivo:** `src/components/HeadlessSEO.tsx`

**Responsabilidade:** Gerenciar todo o SEO de forma centralizada.

```typescript
<HeadlessSEO
  title="DJ Zen Eyer - About"
  description="Two-time World Champion Brazilian Zouk DJ..."
  url="/about"
  image="/images/zen-eyer-og.jpg"
  type="profile"
  locale="en_US"
  hrefLang={[
    { lang: 'en', url: 'https://djzeneyer.com/about/' },
    { lang: 'pt-BR', url: 'https://djzeneyer.com/pt/about/' },
    { lang: 'x-default', url: 'https://djzeneyer.com/about/' }
  ]}
  schema={{
    "@type": "Person",
    "name": "Marcelo Eyer Fernandes",
    "alternateName": "DJ Zen Eyer",
    "jobTitle": "DJ & Music Producer"
  }}
/>
```

**Output:**
```html
<head>
  <title>DJ Zen Eyer - About</title>
  <meta name="description" content="Two-time World Champion...">
  <link rel="canonical" href="https://djzeneyer.com/about/">

  <!-- Open Graph -->
  <meta property="og:title" content="DJ Zen Eyer - About">
  <meta property="og:type" content="profile">
  <meta property="og:image" content="https://djzeneyer.com/images/zen-eyer-og.jpg">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- Hreflang -->
  <link rel="alternate" hreflang="en" href="https://djzeneyer.com/about/">
  <link rel="alternate" hreflang="pt-BR" href="https://djzeneyer.com/pt/about/">

  <!-- Schema.org -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Marcelo Eyer Fernandes",
    "alternateName": "DJ Zen Eyer",
    "jobTitle": "DJ & Music Producer"
  }
  </script>
</head>
```

#### 3. Performance Optimization

**Bundle Size:**
- Código split por rota (lazy loading)
- Tree shaking automático (Vite)
- Minificação (Terser)
- Gzip compression

**Caching Strategy:**

```
┌─────────────────────────────────────────┐
│ CLOUDFLARE (Edge Cache)                 │
│ • HTML: 2 horas                         │
│ • CSS/JS: 30 dias (cache busting hash) │
│ • Imagens: 7 dias                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ LITESPEED CACHE (Server Cache)          │
│ • HTML: 1 hora                          │
│ • API Responses: 10 minutos             │
│ • Database queries: 30 minutos          │
└─────────────────────────────────────────┘
```

**Lighthouse Scores:**
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## 📦 Build e Deploy

### Pipeline CI/CD

**Arquivo:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      1. Checkout código
      2. Setup Node.js 18
      3. npm ci (instala dependências)
      4. npm run build (compila React)
      5. rsync dist/ → Hostinger VPS
      6. Purge LiteSpeed Cache
      7. Ping sitemap ao Google
```

### Processo Manual

```bash
# 1. Desenvolvimento local
npm run dev

# 2. Build de produção
npm run build
   │
   ├──► Gera sitemaps (scripts/generate-sitemap.js)
   ├──► TypeScript compilation (tsc)
   ├──► Vite build (dist/assets/)
   └──► Prerender HTML (scripts/prerender.js)

# 3. Resultado em /dist/
dist/
├── index.html
├── about/index.html
├── events/index.html
├── pt/about/index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── sitemap.xml

# 4. Upload para servidor
# Via FTP/SFTP ou rsync:
rsync -avz dist/ user@server:/path/to/public_html/

# 5. Limpar cache
# LiteSpeed: Admin Panel > LiteSpeed Cache > Purge All
# Cloudflare: Dashboard > Caching > Purge Everything
```

### Estrutura no Servidor

```
/home/djzeneyer/public_html/
│
├── dist/                    # React build (frontend)
│   ├── index.html
│   ├── assets/
│   └── ...
│
├── wp-admin/               # WordPress admin
├── wp-content/
│   ├── plugins/           # Zen SEO, ZenEyer Auth, etc.
│   ├── themes/
│   │   └── djzeneyer/     # Tema headless (header/footer apenas)
│   └── uploads/
│
├── wp-json/               # REST API endpoint
│
└── .htaccess              # Rewrite rules
```

### Regras .htaccess Cruciais

```apache
# Redireciona tudo para index.html (SPA mode)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # API WordPress - não redireciona
  RewriteRule ^wp-json - [L]
  RewriteRule ^wp-admin - [L]
  RewriteRule ^wp-includes - [L]

  # SPA - redireciona para React
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 2 hours"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
</IfModule>
```

---

## ➕ Como Adicionar Features

### 1. Nova Página

**Exemplo:** Criar página `/courses` (cursos de Zouk)

```bash
# 1. Criar componente da página
touch src/pages/CoursesPage.tsx
```

```typescript
// src/pages/CoursesPage.tsx
import React from 'react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useTranslation } from 'react-i18next';

export const CoursesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeadlessSEO
        title="Zouk Courses - DJ Zen Eyer"
        description="Learn Brazilian Zouk with world champion DJ"
        url="/courses"
      />

      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold">{t('courses.title')}</h1>
        {/* Conteúdo */}
      </div>
    </>
  );
};
```

```typescript
// 2. Adicionar lazy import em src/App.tsx
const CoursesPage = lazy(() =>
  import('./pages/CoursesPage').then(m => ({ default: m.CoursesPage }))
);

// 3. Adicionar rota
<Route path="/courses" element={<CoursesPage />} />
<Route path="/pt/courses" element={<CoursesPage />} />
```

```json
// 4. Adicionar traduções
// src/locales/en/translation.json
{
  "courses": {
    "title": "Zouk Courses"
  }
}

// src/locales/pt/translation.json
{
  "courses": {
    "title": "Cursos de Zouk"
  }
}
```

```javascript
// 5. Adicionar ao prerender
// scripts/prerender.js
const routes = [
  { path: '/', lang: 'en' },
  // ...
  { path: '/courses', lang: 'en' },
  { path: '/pt/courses', lang: 'pt' }
];
```

```bash
# 6. Rebuild
npm run build
```

---

### 2. Novo Endpoint REST API

**Exemplo:** API para listar playlists do Spotify

```php
// inc/api.php
add_action('rest_api_init', function() {
  register_rest_route('djzeneyer/v1', '/playlists', [
    'methods' => 'GET',
    'callback' => 'get_spotify_playlists',
    'permission_callback' => '__return_true'
  ]);
});

function get_spotify_playlists(WP_REST_Request $request) {
  $lang = $request->get_param('lang') ?? 'en';

  // Busca playlists do banco ou API externa
  $playlists = get_posts([
    'post_type' => 'playlist',
    'lang' => $lang
  ]);

  return rest_ensure_response([
    'success' => true,
    'data' => $playlists
  ]);
}
```

```typescript
// src/hooks/usePlaylists.ts
import { useQuery } from '@tanstack/react-query';

export function usePlaylists() {
  return useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_WP_REST_URL}/djzeneyer/v1/playlists`
      );
      return res.json();
    }
  });
}
```

```typescript
// Usar no componente
const { data, isLoading } = usePlaylists();
```

---

### 3. Novo Custom Post Type

```php
// inc/cpt.php
function register_course_cpt() {
  register_post_type('course', [
    'labels' => [
      'name' => 'Courses',
      'singular_name' => 'Course'
    ],
    'public' => true,
    'show_in_rest' => true, // ⭐ CRUCIAL para API
    'supports' => ['title', 'editor', 'thumbnail'],
    'rewrite' => ['slug' => 'courses']
  ]);
}
add_action('init', 'register_course_cpt');
```

```typescript
// Consumir no React
const courses = await fetch(
  `${wpRestUrl}/wp/v2/course?_embed`
).then(r => r.json());
```

---

## 🔧 Troubleshooting

### Problema: React não carrega (tela branca)

**Causa:** Assets (JS/CSS) não encontrados.

**Solução:**
1. Verificar se build foi feito: `ls -la dist/assets/`
2. Verificar .htaccess permite acesso a assets
3. Limpar cache: LiteSpeed + Cloudflare
4. Verificar console do navegador (F12)

---

### Problema: CORS error ao fazer login

**Erro:** `Access-Control-Allow-Origin missing`

**Solução:**
```php
// plugins/zeneyer-auth/includes/Core/class-cors-handler.php

// Verificar se origem está autorizada:
$allowed_origins = [
  'https://djzeneyer.com',
  'http://localhost:5173' // dev
];
```

---

### Problema: SEO não funciona (meta tags vazias)

**Causa:** Crawlers não esperam React renderizar.

**Solução:**
1. Verificar se prerender rodou: `cat dist/about/index.html`
2. Deve conter `<meta name="description"...>`
3. Se vazio, rodar: `npm run build` novamente
4. Verificar `scripts/prerender.js` sem erros

---

### Problema: Imagens não aparecem em produção

**Causa:** Paths relativos incorretos.

**Solução:**
```typescript
// ❌ Errado
<img src="/images/logo.png" />

// ✅ Correto
<img src={`${import.meta.env.VITE_SITE_URL}/images/logo.png`} />

// ou colocar imagens em /public/
<img src="/logo.png" /> // Vite copia automaticamente
```

---

### Problema: Traduções não funcionam

**Causa:** i18next não inicializado corretamente.

**Solução:**
```typescript
// src/i18n.ts - verificar inicialização
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: enTranslations },
    pt: { translation: ptTranslations }
  }
});
```

---

## 📊 Métricas de Performance

### Atual (Janeiro 2026)

**Lighthouse Scores:**
- Performance: 96/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): 1.6s ✅
- FID (First Input Delay): 45ms ✅
- CLS (Cumulative Layout Shift): 0.02 ✅

**Bundle Size:**
- Initial JS: 68.52 KB (gzipped)
- Initial CSS: 9.30 KB (gzipped)
- Total: ~78 KB ✅ (meta: < 200 KB)

---

## 🎯 Roadmap

### Q1 2026
- [ ] PWA (Progressive Web App) com service workers
- [ ] Notificações push para novos eventos
- [ ] Dark mode toggle
- [ ] Chat ao vivo com suporte

### Q2 2026
- [ ] App mobile nativo (React Native)
- [ ] Integração com Spotify API
- [ ] Sistema de reviews de eventos
- [ ] Programa de afiliados

---

## 📞 Contatos & Suporte

**Developer:** Marcelo Eyer Fernandes
**Website:** [djzeneyer.com](https://djzeneyer.com)
**Email:** contato@djzeneyer.com
**GitHub:** [MarceloEyer/djzeneyer](https://github.com/MarceloEyer/djzeneyer)

---

## 📄 Licença

GPL v2 or later

---

**Última atualização:** Janeiro 15, 2026
**Versão do documento:** 1.0.0
