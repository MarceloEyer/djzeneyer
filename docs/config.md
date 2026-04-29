# Guia de Configuracao - DJ Zen Eyer

> Documento historico de configuracao.
> A referencia atual e `docs/CONFIGURATION.md`.
> Regras globais e precedencia vivem em `AI_CONTEXT_INDEX.md`.
> Ultima revisao: 2026-04-27

---

## Índice

1. [WordPress Core — wp-config.php](#1-wordpress-core--wp-configphp)
2. [WordPress — Painel de Administração](#2-wordpress--painel-de-administração)
3. [LiteSpeed Cache](#3-litespeed-cache)
4. [Polylang](#4-polylang)
5. [WooCommerce](#5-woocommerce)
6. [GamiPress](#6-gamipress)
7. [MailPoet](#7-mailpoet)
8. [PagBank Connect](#8-pagbank-connect)
9. [Zen BIT — Bandsintown Events](#9-zen-bit--bandsintown-events)
10. [Zen SEO Lite Pro](#10-zen-seo-lite-pro)
11. [ZenEyer Auth Pro](#11-zeneyer-auth-pro)
12. [ZenGame Pro](#12-zengame-pro)
13. [Zen Plugins Overview](#13-zen-plugins-overview)
14. [Query Monitor](#14-query-monitor)
15. [Cloudflare](#15-cloudflare)
16. [Plugins: Adicionar / Remover](#16-plugins-adicionar--remover)
17. [Checklist pós-deploy](#17-checklist-pós-deploy)

---

## 1. WordPress Core — wp-config.php

### 1.1 Configurações críticas (aplicar agora)

```php
// ⚠️ CRÍTICO: Debug NUNCA deve ser true em produção — causa erros PHP no JSON da API REST
define('WP_DEBUG',         false);
define('WP_DEBUG_DISPLAY', false);
define('WP_DEBUG_LOG',     true);   // Mantém log sem expor erros ao usuário
@ini_set('display_errors', 0);

// URLs canônicas
define('WP_HOME',    'https://djzeneyer.com');
define('WP_SITEURL', 'https://djzeneyer.com');

// Modo headless
define('HEADLESS_MODE_ENABLED', true);
define('FORCE_SSL_ADMIN',       true);
define('DISALLOW_FILE_EDIT',    true);  // Bloqueia editor de arquivos no painel (segurança)
define('DISALLOW_FILE_MODS',    false); // Deixar false para atualizar plugins normalmente

// Memória — servidor suporta 1536M; 512M é suficiente para o stack atual
define('WP_MEMORY_LIMIT',     '512M');
define('WP_MAX_MEMORY_LIMIT', '512M');

// Autosave e revisões — reduzem peso no banco
define('AUTOSAVE_INTERVAL', 300);   // 5 minutos (padrão: 60s)
define('WP_POST_REVISIONS',   5);   // Máximo de revisões por post (padrão: ilimitado)

// Lixeira automática
define('EMPTY_TRASH_DAYS', 30);

// Cron — desativar WP-Cron nativo e usar cron de sistema (mais confiável em VPS)
define('DISABLE_WP_CRON', true);
// No crontab do servidor (PHP CLI é mais eficiente que curl — sem overhead de rede):
// */5 * * * * /usr/bin/php /caminho/para/wp/wp-cron.php > /dev/null 2>&1
// Alternativa com wp-cli: */5 * * * * wp --path=/caminho/para/wp cron event run --due-now

// JWT para autenticação headless
// ⚠️ SEGURANÇA: usar chave aleatória de 64+ chars — nunca hardcodar em repositório
// Gerar: openssl rand -hex 32 (64 chars hex) ou openssl rand -base64 48
define('JWT_AUTH_SECRET_KEY',    'TROCAR_POR_CHAVE_SEGURA_64_CHARS');
define('JWT_AUTH_CORS_ENABLE',   true);

// Segurança de banco de dados
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', 'utf8mb4_unicode_ci');
```

### 1.2 Chaves de segurança

Gerar em: https://api.wordpress.org/secret-key/1.1/salt/
Trocar todas as `AUTH_KEY`, `SECURE_AUTH_KEY`, `LOGGED_IN_KEY`, etc.
**Trocar a cada 6 meses ou após suspeita de comprometimento.**

### 1.3 .htaccess (raiz do WordPress)

> **Nota**: Snippet para Apache 2.4+. Adaptar em servidores com versão anterior.
> A CSP é gerada dinamicamente pelo PHP (`inc/csp.php`) — não declarar aqui.

```apache
# Bloquear acesso direto a wp-config.php (Apache 2.4+)
<files wp-config.php>
  Require all denied
</files>

# Bloquear XML-RPC (não usado em headless)
<Files xmlrpc.php>
  Require all denied
</Files>

# Headers de segurança
<IfModule mod_headers.c>
  Header unset Server
  Header unset X-Powered-By
  Header always unset X-Pingback
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" env=HTTPS
  # COOP: unsafe-none permite o popup do Google Login comunicar com o site
  Header always set Cross-Origin-Opener-Policy "unsafe-none"
  # Nota: Content-Security-Policy é gerada pelo PHP (inc/csp.php) — não definir aqui
</IfModule>

# Compressão (LiteSpeed também faz, mas é bom ter no .htaccess como fallback)
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>
```

---

## 2. WordPress — Painel de Administração

### 2.1 Configurações Gerais (Settings > General)

| Campo | Valor |
|---|---|
| Site Title | DJ Zen Eyer |
| Tagline | 2x World Champion Brazilian Zouk DJ & Producer |
| WordPress Address | https://djzeneyer.com |
| Site Address | https://djzeneyer.com |
| Administration Email | email de admin real (não público) |
| Membership | ✅ Anyone can register (para o sistema de login/ZenGame) |
| New User Default Role | Subscriber |
| Timezone | America/Sao_Paulo |
| Date Format | d/m/Y |
| Language | Portuguese (Brazil) no painel; EN no site |

### 2.2 Permalinks (Settings > Permalinks)

- Estrutura: **Post name** → `/%postname%/`
- Isso é obrigatório para o headless funcionar corretamente com Polylang

### 2.3 Leitura (Settings > Reading)

- "Your homepage displays": **A static page** → Homepage: qualquer página placeholder (o React SPA é o front-end real)
- "Search engine visibility": **desmarcado** (deixar o Cloudflare/React lidar com isso)
- Blog pages show at most: 10 posts

### 2.4 Discussão (Settings > Discussion)

- Desativar comentários globalmente se não usado:
  - ☐ Allow people to submit comments on new posts
  - ☐ Allow link notifications from other blogs

### 2.5 Mídia (Settings > Media)

- Thumbnail size: 150×150
- Medium size: 768×0 (altura automática)
- Large size: 1200×0
- ☑ Organize my uploads into month- and year-based folders

### 2.6 REST API — Headers CORS (via plugin ou functions.php do tema)

> **Origens canônicas**: `https://djzeneyer.com`, `https://www.djzeneyer.com`, `http://localhost:5173`, `http://127.0.0.1:5173`.
> Gerenciadas pela função `djz_allowed_origins()` em `inc/setup.php` — não duplicar aqui.

```php
// Em functions.php do tema (djzeneyer theme):
// Referencia djz_allowed_origins() definida em inc/setup.php
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = esc_url_raw( wp_unslash( $_SERVER['HTTP_ORIGIN'] ?? '' ) );
        if (in_array($origin, djz_allowed_origins(), true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With');
        }
        return $value;
    });
}, 15);
```

---

## 3. LiteSpeed Cache

> Plugin: v7.8.1 | **Maior impacto em performance de todos os plugins.**

### 3.1 Cache (LiteSpeed Cache > Cache)

| Setting | Valor | Motivo |
|---|---|---|
| Enable Cache | ✅ ON | |
| Cache Logged-in Users | ❌ OFF | Dashboard/MyAccount devem renderizar dados reais |
| Cache Commenters | ❌ OFF | |
| Cache REST API | ✅ ON | Endpoints públicos da API são cacheáveis |
| Cache Login Page | ❌ OFF | |
| Cache favicon.ico | ✅ ON | |
| Purge All on Upgrade | ✅ ON | Limpar cache em updates |
| Serve Stale | ✅ ON | Serve conteúdo expirado enquanto regenera |
| TTL | 604800 (7 dias) | REST API pública muda raramente; o CI invalida via wp-cli |

**Regras de exclusão de cache (LiteSpeed Cache > Cache > Do Not Cache):**

```text
URI contém: /dashboard
URI contém: /my-account
URI contém: /minha-conta
URI contém: /painel
URI contém: /cart
URI contém: /checkout
URI contém: /wp-json/zeneyer-auth
URI contém: /wp-json/zengame
URI contém: /wp-admin
Cookie contém: wordpress_logged_in
```

### 3.2 CDN (LiteSpeed Cache > CDN)

| Setting | Valor |
|---|---|
| Use CDN | ❌ OFF (usar Cloudflare diretamente — ver seção 15) |
| CDN URL | Deixar vazio se usando Cloudflare |

> **Por que desativar o CDN do LiteSpeed?** O `cdn.quic.cloud` aparece no PageSpeed como um preconnect não utilizado, adicionando ~20ms de overhead desnecessário. O Cloudflare já faz o papel de CDN global.

### 3.3 Otimização de CSS/JS (LiteSpeed Cache > Page Optimization)

| Setting | Valor | Observação |
|---|---|---|
| CSS Minify | ✅ ON | |
| CSS Combine | ❌ OFF | O React SPA já tem CSS otimizado pelo Vite; combinar pode quebrar |
| CSS Load Asynchronously | ❌ OFF | ⚠️ O `litespeed-dummy.css` bloqueante vem desta opção — DESATIVAR |
| JS Minify | ✅ ON | |
| JS Combine | ❌ OFF | Vite já combina; combinar novamente pode quebrar chunks |
| JS Defer | ✅ ON | Defer para scripts não-críticos |
| JS Delay | ❌ OFF | Pode quebrar a inicialização do React |
| Load Google Fonts Asynchronously | ✅ ON | Redundante com nosso index.html, mas não prejudica |
| Remove Google Fonts | ❌ OFF | Estamos usando as fontes |
| DNS Prefetch | ❌ OFF | Gerenciado diretamente no index.html |

> **Nota**: O `litespeed-dummy.css` (1.1 KiB, 160ms de bloqueio no PSI) é gerado pela opção "CSS Load Asynchronously". Desativando essa opção, o arquivo desaparece do critical path.

### 3.4 Otimização de Imagens (LiteSpeed Cache > Image Optimization)

| Setting | Valor |
|---|---|
| Auto Request Cron | ✅ ON |
| Optimize Original Images | ✅ ON |
| WebP Replacement | ✅ ON |
| Extra WebP Only | ❌ OFF |
| Lossless Optimization | ❌ OFF (usar lossy para melhor compressão) |
| Quality | 85 |
| Resize Images | ✅ ON — Max Width: 1920px |
| Lazy Load Images | ✅ ON |
| Lazy Load Excludes | `/images/hero-background` (LCP — não lazy) |
| Generate AVIF | ✅ ON (se disponível no servidor) |

### 3.5 Configurações Avançadas (LiteSpeed Cache > Advanced)

| Setting | Valor | Observação |
|---|---|---|
| Instant Click | ✅ ON | Prefetch ao hover nos links internos |
| Object Cache | ✅ ON | Cache de objetos PHP (reduz queries DB) |
| HTTP/2 Push | ❌ OFF | Cloudflare já gerencia; duplicar causa overhead |
| Browser Cache TTL | 31536000 (1 ano) | Assets estáticos com hash de Vite |

> **Object Cache**: Requer Redis ou Memcached instalado no servidor para funcionar completamente.
> No Hostinger VPS, verificar se o Redis está disponível (`php -m | grep redis`).
> Sem backend de cache, o LiteSpeed usa cache em memória local (menos eficiente mas funcional).

### 3.6 ESI (Edge Side Includes)

| Setting | Valor | Observação |
|---|---|---|
| Enable ESI | ❌ OFF | Não usamos ESI no stack headless |

---

## 4. Polylang

> Plugin: v3.8.3 | Gerencia tradução de conteúdo WordPress (posts, produtos, páginas).
> **NÃO confundir com i18next** — o i18next gerencia strings de UI do React.

### 4.1 Configuração de Idiomas

| Setting | Valor |
|---|---|
| Default language | English (EN) |
| URL modification | **The language is set from the directory name in pretty permalinks** |
| Hide URL language information for default language | ✅ ON (EN sem prefixo — `/slug` em vez de `/en/slug`) |
| Default language redirect | ❌ OFF (não redirecionar automaticamente por browser language) |
| The homepage is translated | ✅ ON |
| Force default language | ❌ OFF |

**Resultado de URLs:**
- EN: `djzeneyer.com/about-dj-zen-eyer`
- PT: `djzeneyer.com/pt/sobre-dj-zen-eyer`

### 4.2 CPTs e Taxonomias a Traduzir

Ativar nas configurações do Polylang:
- ✅ Posts, Pages, Products, Attachments
- ✅ Categories, Tags, Product Categories, Product Brands

### 4.3 Sincronização entre idiomas

- ✅ Sync: Featured image, Post date, Post format
- ✅ Sync: Custom fields (para posts de eventos e produtos)

---

## 5. WooCommerce

> Plugin: v10.7.0 | HPOS ativo.

### 5.1 Configurações Gerais (WooCommerce > Settings > General)

| Setting | Valor |
|---|---|
| Store Address | Endereço real para emissão de notas |
| Selling Locations | All countries (ou Brazil only, se venda local) |
| Currency | BRL (R$) |
| Currency Position | Left (R$ 99,00) |
| Thousand Separator | . |
| Decimal Separator | , |
| Number of Decimals | 2 |

### 5.2 Produtos (WooCommerce > Settings > Products)

| Setting | Valor |
|---|---|
| Shop Page | Definir página placeholder para /shop |
| Cart Page | Página do carrinho |
| Checkout Page | Página do checkout |
| Reviews | ❌ OFF (não usado no site) |
| Stock Management | ✅ ON (se vendendo produtos físicos/digitais) |

### 5.3 HPOS (High-Performance Order Storage)

- Manter **HPOS ativo** (já está).
- **Nunca** fazer queries SQL diretas em `wp_posts` para pedidos.
- Sempre usar `wc_get_orders()` com HPOS-compatible args.

### 5.4 Emails (WooCommerce > Settings > Emails)

- From Name: DJ Zen Eyer
- From Address: noreply@djzeneyer.com (ou endereço real)
- ✅ Ativar todos os emails transacionais de pedidos

### 5.5 Avançado (WooCommerce > Settings > Advanced)

| Setting | Valor |
|---|---|
| REST API | ✅ Habilitado |
| Legacy API | ❌ OFF (não usamos WooCommerce REST legacy) |

---

## 6. GamiPress

> Plugin: v7.8.7 | Gamificação — pontos, conquistas, rankings.

### 6.1 Tipos de Pontos

Criar/confirmar o tipo de pontos principal:
- **Slug canônico**: verificar e anotar em `CLAUDE.md` como `main_points_slug`
- Nome: "Zen Points" (ou equivalente)
- Plural: "Zen Points"

> **Armadilha conhecida**: `gamipress_get_rank_types()` retorna array **associativo** (slug → objeto). Sempre usar `array_values()` antes de `[0]` no PHP. Registrado em CLAUDE.md.

### 6.2 Performances / Caching

| Cache | TTL | Chave |
|---|---|---|
| Leaderboard | 1h | `djz_gamipress_leaderboard_v16_{limit}` |
| Dashboard por usuário | 24h | `djz_gamipress_dashboard_v16_{user_id}` |
| Stats tracks/events | 6h | `djz_stats_tracks_{uid}` / `djz_stats_events_{uid}` |

> O cache é gerenciado pelo **ZenGame Pro** — não alterar TTLs diretamente no GamiPress.

### 6.3 Rank Types

- Confirmar que `array_values(gamipress_get_rank_types())` retorna os ranks na ordem esperada.
- Se mudar nomes/slugs de rank types, atualizar lógica de `class-rest-handler.php` no ZenGame Pro.

### 6.4 Triggers recomendados

| Evento | Pontos |
|---|---|
| Novo cadastro | +50 pts |
| Login diário | +10 pts |
| Compra concluída | +100 pts |
| Compartilhamento social (webhook) | +25 pts |
| Completar quiz | +30 pts |

---

## 7. MailPoet

> Plugin: v5.23.2 | Newsletter e emails de boas-vindas.

### 7.1 Configurações Gerais (MailPoet > Settings)

| Setting | Valor |
|---|---|
| Sending method | MailPoet Sending Service (gratuito até 1000 subs) ou SMTP próprio |
| From Name | DJ Zen Eyer |
| From Email | newsletter@djzeneyer.com |
| Reply-to | contato@djzeneyer.com |

### 7.2 Subscription Page

- Endpoint ativo: `djzeneyer/v1/subscribe` → conectado ao MailPoet via hook
- Formulário inline no site: usa esse endpoint (não o shortcode do MailPoet)

### 7.3 Sequência de Boas-Vindas (5 emails — Fase 5 do plano de marketing)

| Email | Delay | Assunto sugerido |
|---|---|---|
| 1 | Imediato | Bem-vindo à Tribo Zen 🎵 |
| 2 | +2 dias | A filosofia da Cremosidade |
| 3 | +5 dias | Minha jornada: de estudante a 2x campeão |
| 4 | +10 dias | Spotify exclusivo: faixas que moldaram meu som |
| 5 | +15 dias | Você já conhece o ZenGame? |

### 7.4 GDPR / LGPD

- ✅ Double opt-in ativado
- ✅ Unsubscribe link em todos os emails
- ✅ Link para política de privacidade no formulário

---

## 8. PagBank Connect

> Plugin: v4.54.1 | **Atualmente INATIVO.**

### 8.1 Quando ativar

Ativar apenas quando:
- A loja WooCommerce estiver com produtos físicos ou digitais pagos ativos
- CNPJ/dados fiscais configurados no PagBank
- Ambiente de produção testado (sandbox primeiro)

### 8.2 Configuração (quando ativar)

| Setting | Valor |
|---|---|
| Ambiente | Produção (após testes em sandbox) |
| Connect Key | Chave do painel PagBank |
| Métodos de pagamento | PIX ✅, Cartão de crédito ✅, Boleto ✅ |
| Parcelamento máximo | 12x (sem juros até 6x recomendado) |
| Soft Descriptor | DJ ZEN EYER |

### 8.3 Integração com HPOS

- O plugin é compatível com HPOS? Verificar antes de ativar em produção.
- Usar `wc_get_orders()` — nunca SQL direto em `wp_posts`.

---

## 9. Zen BIT — Bandsintown Events

> Plugin: v3.1.0 | Proxy Bandsintown com cache SWR e JSON-LD MusicEvent.

### 9.1 Configurações

| Setting | Valor |
|---|---|
| Bandsintown Artist ID | `id_15619775` |
| Bandsintown App ID | Chave configurada em `wp-config.php` ou settings |
| Cache TTL | 6h (padrão) |
| Auto-fetch cron | ✅ ON — disparado a cada 6h via WP-Cron (ou cron de sistema) |
| Days ahead | 365 |

### 9.2 Endpoints REST

```text
GET /wp-json/zen-bit/v2/events              → lista de eventos
GET /wp-json/zen-bit/v2/events/{id}         → detalhe de evento
GET /wp-json/zen-bit/v2/events/{id}/schema  → JSON-LD MusicEvent
POST /wp-json/zen-bit/v2/admin/fetch-now    → forçar fetch (admin)
POST /wp-json/zen-bit/v2/admin/clear-cache  → limpar cache (admin)
GET /wp-json/zen-bit/v2/admin/health        → health check (admin)
```

### 9.3 Regras de Schema MusicEvent (obrigatórias — Google Search Console)

Os campos abaixo NUNCA devem ser omitidos na geração de schema:

| Campo | Regra |
|---|---|
| `eventStatus` | Sempre `EventScheduled` — inclusive em eventos passados |
| `endDate` | Obrigatório. Fallback: `startDate + 4h` |
| `location.address` | PostalAddress com sub-campos condicionais (nunca string vazia) |
| `description` | Fallback: `"Live Brazilian Zouk DJ set by DJ Zen Eyer at {venue}."` |
| `image` | Fallback: `/images/zen-eyer-og-image.png` |
| `offers` | Fallback: `Offer` com `url = canonical_url` + availability por data |
| `performer` | Sempre presente — `build_performer_entity()` |

> Implementado em `plugins/zen-bit/includes/class-zen-bit-normalizer.php` → `build_event_schema()`.

---

## 10. Zen SEO Lite Pro

> Plugin: v8.1.1 | SEO headless com Schema.org, sitemap multilíngue e REST API.
> Namespace canônico: `zen-seo/v1` (não `zen-seo-lite/v1`).

### 10.1 Endpoints REST

```text
GET /wp-json/zen-seo/v1/meta       → meta tags por URL
GET /wp-json/zen-seo/v1/settings   → configurações globais (OG image, nome)
GET /wp-json/zen-seo/v1/sitemap    → sitemap gerado dinamicamente
POST /wp-json/zen-seo/v1/cache/clear → limpar cache SEO (CI/deploy)
```

### 10.2 Configurações

| Setting | Valor |
|---|---|
| Site Name | DJ Zen Eyer |
| Default OG Image | `/images/zen-eyer-og-image.png` |
| Schema @type principal | Person (para DJ Zen Eyer) |
| Wikidata sameAs | `https://www.wikidata.org/wiki/Q136551855` |
| hreflang default | EN (sem prefixo) |

### 10.3 Rotas excluídas do sitemap

Configurar no plugin:
```text
/dashboard, /painel
/my-account, /minha-conta
/cart, /checkout
/tickets-checkout
/reset-password
/quiz, /perguntas
```

---

## 11. ZenEyer Auth Pro

> Plugin: v2.4.0 | JWT Authentication + Google OAuth.
> Namespace: `zeneyer-auth/v1`.

### 11.1 Configurações

| Setting | Valor |
|---|---|
| JWT Secret | Definido em `wp-config.php` → `JWT_AUTH_SECRET_KEY` |
| JWT Expiry | 7 dias (access token) |
| Refresh Token Expiry | 30 dias |
| Google OAuth Client ID | Configurado no Google Cloud Console |
| Google OAuth Client Secret | Configurado no Google Cloud Console |
| CORS Origins | Ver [seção 2.6](#26-rest-api--headers-cors-via-plugin-ou-functionsphp-do-tema) — gerenciado por `djz_allowed_origins()` |

### 11.2 Endpoints REST

```text
POST /wp-json/zeneyer-auth/v1/login
POST /wp-json/zeneyer-auth/v1/register
POST /wp-json/zeneyer-auth/v1/google
POST /wp-json/zeneyer-auth/v1/refresh
POST /wp-json/zeneyer-auth/v1/logout
GET  /wp-json/zeneyer-auth/v1/session
GET  /wp-json/zeneyer-auth/v1/me
```

### 11.3 Segurança

- ✅ Rate limiting em `/login` e `/register` (máx 10 req/min por IP)
- ✅ Anti-Bot Security Shield ativado
- ✅ Tokens armazenados em `httpOnly` cookie (não localStorage para o JWT)
- ❌ Nunca expor o JWT Secret em logs ou respostas de API

### 11.4 Armadilha conhecida

- `logout()` é função **síncrona** — nunca usar com `async/await`.

---

## 12. ZenGame Pro

> Plugin: v1.4.0 | Bridge GamiPress + React headless.
> Namespace: `zengame/v1`.

### 12.1 Endpoints REST

```text
GET /wp-json/zengame/v1/me          → dashboard do usuário logado
GET /wp-json/zengame/v1/leaderboard → ranking geral
```

### 12.2 Configurações de Cache

| Cache | TTL | Invalidação |
|---|---|---|
| Dashboard por usuário | 24h | Toda conquista/premiação |
| Leaderboard | 1h | Toda premiação |
| Stats tracks | 6h | — |
| Stats events | 6h | — |

### 12.3 Armadilhas conhecidas

- `gamipress_get_rank_requirements_progress()` não existe no GamiPress free → o plugin usa fallback via `gamipress_get_user_points()` vs `_gamipress_points` meta.
- `rankProgress` tinha bug histórico (ternário retornava `0.0` nos dois lados) — corrigido em `class-rest-handler.php`. Ao alterar lógica de rank, sempre testar esse caminho.
- Zod schema no React: `main_points_slug`, `lastUpdate`, `version` usam `.catch()` para não quebrar o dashboard em falhas de parse.

### 12.4 Pós-deploy

Limpar caches via WP-CLI após cada deploy:
```bash
wp cache flush
wp transient delete --all
```

---

## 13. Zen Plugins Overview

> Plugin: v3.0.0 | Dashboard de status de todos os plugins Zen.

### 13.1 Uso

- Painel em: WordPress Admin > Zen Overview
- Verificar status de todos os endpoints Zen em um só lugar
- Health check para diagnóstico rápido

### 13.2 Configurações

Nenhuma configuração adicional necessária. Plugin de diagnóstico apenas.

---

## 14. Query Monitor

> Plugin: v4.0.6 | **Atualmente INATIVO. Manter assim em produção.**

### 14.1 Política de uso

- ✅ Ativar apenas em ambiente de desenvolvimento local
- ✅ Ativar temporariamente em produção para diagnóstico pontual (máx. 1h)
- ❌ **Nunca deixar ativo em produção permanentemente** — expõe queries SQL, hooks, variáveis de ambiente e dados do servidor para usuários logados como admin

### 14.2 Ativação segura para diagnóstico em produção

```php
// wp-config.php — adicionar temporariamente:
define('QM_DISABLED', false);
// Remover após diagnóstico!
```

---

## 15. Cloudflare

> Configurações para o domínio `djzeneyer.com`.

### 15.1 DNS

| Tipo | Nome | Valor | Proxy |
|---|---|---|---|
| A | @ | IP do servidor Hostinger | ✅ Proxied |
| A | www | IP do servidor Hostinger | ✅ Proxied |
| CNAME | mail | Valor do provedor de e-mail | ❌ DNS Only |
| TXT | @ | SPF record do e-mail | ❌ DNS Only |
| TXT | _dmarc | DMARC record | ❌ DNS Only |
| MX | @ | Registros MX do provedor | ❌ DNS Only |

> ⚠️ **Importante**: O IP do servidor Hostinger deve ser o IP real do VPS, não um IP de CDN. Verificar no painel Hostinger.

### 15.2 SSL/TLS

| Setting | Valor |
|---|---|
| SSL/TLS Mode | **Full (strict)** — certificado válido no servidor |
| Always Use HTTPS | ✅ ON |
| HTTP Strict Transport Security (HSTS) | ✅ ON — Max Age: 6 months |
| Minimum TLS Version | TLS 1.2 |
| TLS 1.3 | ✅ ON |
| Automatic HTTPS Rewrites | ✅ ON |

### 15.3 Cache — Cache Rules

**Regra 1: Cache assets estáticos do React (longa duração)**
- When: `djzeneyer.com/assets/*`
- Cache Status: Override → Cache Everything
- Edge Cache TTL: 1 year
- Browser Cache TTL: 1 year

**Regra 2: Não cachear rotas privadas e autenticadas**
- When: URI Path contains `/dashboard` OR `/my-account` OR `/minha-conta` OR `/painel` OR `/cart` OR `/checkout` OR `/wp-admin`
- Cache Status: Bypass

**Regra 3: Não cachear REST API dinâmica (auth, zengame, cart)**
- When: URI Path contains `/wp-json/zeneyer-auth` OR `/wp-json/zengame` OR `/wp-json/wc`
- Cache Status: Bypass

**Regra 4: Cache REST API pública (eventos, menu, SEO)**
- When: URI Path contains `/wp-json/zen-bit/v2/events` OR `/wp-json/djzeneyer/v1/menu` OR `/wp-json/zen-seo/v1`
- Cache Status: Cache Everything
- Edge Cache TTL: 6 hours
- Cache Key: Include query string

### 15.4 Speed — Optimization

| Setting | Valor |
|---|---|
| Auto Minify: JavaScript | ✅ ON |
| Auto Minify: CSS | ✅ ON |
| Auto Minify: HTML | ✅ ON |
| Brotli | ✅ ON |
| Early Hints | ✅ ON (pré-carrega assets críticos) |
| Rocket Loader | ❌ **OFF** — **Quebra a inicialização do React/Vite** |
| Mirage (lazy load images) | ❌ OFF — conflita com o lazy loading do LiteSpeed |
| Polish (image compression) | Lossless (se plano pago) |

> ⚠️ **Rocket Loader DEVE estar desligado.** Ele intercepta scripts e atrasa a execução do bundle React, causando tela branca ou hidratação quebrada.

### 15.5 Security

| Setting | Valor |
|---|---|
| Security Level | Medium |
| Bot Fight Mode | ✅ ON |
| Browser Integrity Check | ✅ ON |
| Challenge Passage | 30 minutes |
| WAF (Firewall) | ✅ ON — ruleset gerenciado pela Cloudflare |
| Rate Limiting | Criar regra: `/wp-login.php` → máx 10 req/min |

**Regra de Firewall: Bloquear acesso direto ao WP Admin por IP não autorizado (opcional)**
- When: URI Path = `/wp-admin` AND IP não está na lista de IPs confiáveis
- Action: Managed Challenge

**Regra de Firewall: Proteção de REST API**
- When: URI Path contains `/wp-json/` AND Method = POST AND NOT `zeneyer-auth` (login é POST legítimo)
- Action: Rate Limit (máx 30 req/5min por IP)

### 15.6 Network

| Setting | Valor |
|---|---|
| HTTP/2 | ✅ ON |
| HTTP/3 (QUIC) | ✅ ON |
| 0-RTT Connection Resumption | ✅ ON |
| gRPC | ❌ OFF (não usado) |
| WebSockets | ✅ ON (para futuras funcionalidades real-time) |

### 15.7 Headers customizados (via Transform Rules)

Adicionar aos responses:

```text
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 15.8 Page Rules (legacy — migrar para Cache Rules quando possível)

```text
djzeneyer.com/wp-admin*
  → Cache Level: Bypass
  → SSL: Full

djzeneyer.com/wp-login.php
  → Cache Level: Bypass
  → Security Level: High
```

### 15.9 Invalidação de cache pós-deploy (via API Cloudflare no CI)

```bash
# No GitHub Actions, após rsync:
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything": true}'
```

> Para cache seletivo (mais rápido): usar `{"files": [...urls específicas...]}` em vez de purge_everything.

---

## 16. Plugins: Adicionar / Remover

### 16.1 Remover (ou manter inativo permanentemente)

| Plugin | Motivo |
|---|---|
| **Query Monitor** | Ferramenta de dev — nunca em produção. Manter instalado mas sempre desativo. |

### 16.2 Não são necessários (já cobertos pelo stack atual)

| Plugin que NÃO instalar | Motivo |
|---|---|
| Yoast SEO / RankMath | Zen SEO Lite Pro já faz SEO headless completo |
| WP Rocket | LiteSpeed Cache já faz cache + otimização |
| Wordfence | Cloudflare WAF + ZenEyer Auth Pro (anti-bot) já cobrem |
| Contact Form 7 | Não temos formulário de contato no site atual |
| Elementor / WPBakery | Site é 100% React — page builders são irrelevantes |
| Redirection | Gerenciar redirects no `.htaccess` ou Cloudflare Page Rules |

### 16.3 Considerar adicionar

| Plugin | Motivo | Prioridade |
|---|---|---|
| **WP Mail SMTP** | Garante entrega de emails transacionais via SMTP real (Mailgun/SendGrid) — emails via PHP mail() têm alta taxa de spam | 🔴 Alta |
| **UpdraftPlus** | Backup automático do banco de dados e arquivos para Google Drive/S3 | 🔴 Alta |
| **Two Factor Authentication** | 2FA para o painel WordPress admin — segurança crítica | 🟡 Média |
| **User Switching** | Permite logar como qualquer usuário sem saber a senha (debugging de ZenGame) | 🟢 Baixa |

### 16.4 Configuração do WP Mail SMTP (se adicionar)

| Setting | Valor |
|---|---|
| Mailer | SendGrid ou Mailgun (transacional, alta entrega) |
| From Email | noreply@djzeneyer.com |
| From Name | DJ Zen Eyer |
| SMTP Host | smtp.sendgrid.net (ou Mailgun) |
| Encryption | TLS |
| Port | 587 |

---

## 17. Checklist pós-deploy

Executar após cada deploy em produção:

```bash
# 1. Limpar caches WordPress
wp cache flush
wp transient delete --all

# 2. Limpar cache LiteSpeed
wp litespeed-purge all

# 3. Limpar cache do plugin SEO
curl -X POST https://djzeneyer.com/wp-json/zen-seo/v1/cache/clear \
  -H "Authorization: Bearer ${ADMIN_JWT}"

# 4. Forçar re-fetch de eventos (opcional, se mudou lineup)
curl -X POST https://djzeneyer.com/wp-json/zen-bit/v2/admin/fetch-now \
  -H "Authorization: Bearer ${ADMIN_JWT}"

# 5. Invalidar cache Cloudflare
curl -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything": true}'
```

> Os passos 1–3 são executados automaticamente pelo CI (`.github/workflows/*.yml`). Os passos 4–5 podem ser manuais ou automatizados dependendo do tipo de deploy.

---

*Criado em 2026-04-27. Revisar na rotina mensal de sincronização (ver `docs/AI_GOVERNANCE.md § 6`).*
