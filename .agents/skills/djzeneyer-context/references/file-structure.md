# File Structure — DJ Zen Eyer

## 🎨 Frontend (React SPA — Vite)

```
src/
├── assets/
│   ├── images/          → Imagens (PNG, JPG, WebP)
│   ├── svgs/            → SVGs (icons, patterns)
│   └── fonts/           → Web fonts
│
├── components/
│   ├── Layout/
│   │   ├── Navbar.tsx   → Menu de navegação
│   │   ├── Footer.tsx   → Rodapé
│   │   └── Sidebar.tsx  → Menu lateral (mobile)
│   │
│   ├── auth/
│   │   ├── AuthModal.tsx        → Modal de login/register
│   │   └── ProtectedRoute.tsx   → Wrapper para rotas privadas
│   │
│   ├── HeadlessSEO.tsx  → ⭐ CRÍTICO — Meta tags dinâmicas em TODA página
│   ├── Loading.tsx
│   ├── ErrorBoundary.tsx
│   └── [outros componentes].tsx
│
├── config/              → ⭐ FONTE DE VERDADE para constantes
│   ├── api.ts           → BASE_URL, endpoints
│   ├── routes.ts        → Rotas da aplicação
│   ├── siteConfig.ts    → ⭐ Brand, titles, IDs globais
│   └── i18n.ts          → Configuração i18n
│
├── hooks/
│   ├── useQueries.ts    → ⭐⭐⭐ SSOT para TODOS os hooks de dados
│   ├── useAuth.ts       → Autenticação JWT
│   ├── useLocalStorage.ts
│   └── [outros].ts
│
├── layouts/
│   ├── MainLayout.tsx   → Layout padrão (Navbar + Content + Footer)
│   └── AuthLayout.tsx   → Layout para páginas de autenticação
│
├── pages/
│   ├── Home.tsx         → Lazy-loaded
│   ├── Events.tsx       → Lazy-loaded
│   ├── Shop.tsx         → Lazy-loaded
│   ├── Dashboard.tsx    → Lazy-loaded
│   ├── Checkout.tsx     → Lazy-loaded
│   ├── NotFound.tsx
│   └── [páginas novas].tsx
│
├── locales/             → Traduções (i18n)
│   ├── en/
│   │   └── translation.json
│   └── pt/
│       └── translation.json
│
├── types/
│   ├── api.ts           → Types para respostas da API
│   ├── models.ts        → Types para models (Event, Product, etc)
│   └── [outros].ts
│
├── utils/
│   ├── api-client.ts    → Instância do fetch/axios
│   ├── format.ts        → Formatters (data, moeda, etc)
│   └── validators.ts    → Validações de formulário
│
├── App.tsx              → Root component (providers, routes)
├── main.tsx             → Entry point
└── index.css            → Global styles (Tailwind imports)
```

### 🧠 Arquivo Crítico: `src/hooks/useQueries.ts`

**ESTE é o arquivo ÚNICO onde todo data fetching vive.**

```typescript
// ✅ Exemplo estrutura
import { useQuery } from '@tanstack/react-query';
import { API_BASE } from '../config/api';

export const useEventsList = (status?: string) => {
    return useQuery({
        queryKey: ['events', status],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            const res = await fetch(`${API_BASE}/zen-bit/v2/events?${params}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        },
        staleTime: 1000 * 60 * 5, // 5 min
    });
};

export const useGamiPress = (userId: number) => {
    return useQuery({
        queryKey: ['gamipress', userId],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/djzeneyer/v1/gamipress/${userId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        },
        staleTime: 1000 * 60 * 60, // 1 hora
    });
};

// NUNCA FAÇA fetch() direto em componentes — use estes hooks!
```

### 🎯 Arquivo Crítico: `src/config/siteConfig.ts`

**SSOT para todas as constantes globais.**

```typescript
export const siteConfig = {
    siteName: 'DJ Zen Eyer',
    siteUrl: 'https://djzeneyer.com',
    description: 'Bicampeão Mundial de Brazilian Zouk',
    
    // Branding
    primaryColor: '#1f2937',
    accentColor: '#f97316',
    
    // Redes sociais
    social: {
        instagram: 'https://instagram.com/djzeneyer',
        tiktok: 'https://tiktok.com/@djzeneyer',
        youtube: 'https://youtube.com/@djzeneyer',
    },
    
    // WooCommerce
    wcConsumerKey: process.env.VITE_WC_CONSUMER_KEY,
    wcConsumerSecret: process.env.VITE_WC_CONSUMER_SECRET,
    
    // Contato
    email: 'booking@djzeneyer.com',
    phone: '+55 (XX) XXXX-XXXX',
};
```

---

## ⚙️ Backend (WordPress Headless)

```
wp-content/
├── themes/
│   └── zentheme/
│       ├── inc/                  → Lógica core do tema
│       │   ├── class-loader.php  → Bootstrap de hooks
│       │   ├── cors.php          → Configuração CORS
│       │   ├── rest-api.php      → Endpoints customizados
│       │   └── caching.php       → Transients
│       │
│       ├── dist/                 → Output do build React (rsync alvo)
│       │   ├── index.html
│       │   └── assets/
│       │       ├── *.js
│       │       └── *.css
│       │
│       ├── functions.php         → Entrypoint do tema
│       ├── index.php             → Fallback (pode estar vazio)
│       ├── style.css             → Metadados do tema
│       └── screenshot.png        → Imagem do tema no admin
│
└── plugins/
    │
    ├── zen-bit/                  → Bandsintown API integration
    │   ├── zen-bit.php           → Main file (namespace ZenBit\)
    │   ├── inc/
    │   │   ├── class-api.php     → Lógica de fetch
    │   │   ├── class-cache.php   → Transients
    │   │   └── class-rest.php    → Endpoints zen-bit/v2
    │   └── uninstall.php
    │
    ├── zeneyer-auth/             → JWT & Security Bridge (v2.3.0 Master)
    │   ├── zeneyer-auth.php      → Main file (namespace ZenEyer\Auth\ ✅)
    │   ├── includes/
    │   │   ├── API/              → class-rest-routes.php (v1 aliases)
    │   │   ├── Admin/            → class-settings-page.php
    │   │   ├── Auth/             → class-password-auth.php, class-google-provider.php
    │   │   ├── Core/             → class-jwt-manager.php, class-wp-auth-integration.php
    │   │   └── class-activator.php → Turnstile key check
    │   └── uninstall.php
    │
    ├── zen-seo-lite/             → SEO dinâmico
    │   ├── zen-seo-lite.php      → Main file (namespace ZenEyer\SEO\)
    │   ├── inc/
    │   │   ├── class-meta.php    → Meta tags dinâmicas
    │   │   └── class-rest.php    → Endpoints zen-seo-lite/v1
    │   └── uninstall.php
    │
    ├── zengame/                  → Gaming & Activity Bridge (SSOT)
    │   ├── zengame.php           → Main file (namespace ZenEyer\Game\ ✅)
        └── inc/
            └── [estrutura similar]
```

---

## 🛡️ DevOps & CI/CD

```
.github/
└── workflows/
    └── deploy.yml               → Production deploy pipeline
                                   - Build React (npm run build)
                                   - rsync para Hostinger
                                   - Health checks pós-deploy

scripts/
├── prerender.js                 → SSG via Puppeteer (para SEO)
├── generate-sitemaps.js         → Geração de sitemaps
├── verify-namespaces.sh         → Validação de namespacing
├── new-page.sh                  → Blueprint para nova página
├── pre-deploy-check.sh          → Validações antes de deploy
└── routes-config.json           → Configuração de rotas para prerender

public/
├── robots.txt                   → Para buscadores
├── sitemap.xml                  → Sitemap manual (fallback)
├── favicon.ico
└── [arquivos estáticos]

.gitignore
.eslintrc.json
.prettierrc.json
tsconfig.json
vite.config.ts
package.json
```

---

## 📋 Checklist: Estrutura Válida?

- [ ] `src/hooks/useQueries.ts` existe e contém TODOS os hooks
- [ ] `src/config/siteConfig.ts` é a SSOT para constantes
- [ ] Nenhum `fetch()` em componentes (sempre via useQueries)
- [ ] `src/components/HeadlessSEO` importado em TODAS as páginas
- [ ] Plugins em `plugins/` têm namespace correto (verificar com `scripts/verify-namespaces.sh`)
- [ ] `dist/` é o alvo do rsync (não tocar manualmente)
- [ ] Traduções em `src/locales/{pt,en}/translation.json`
- [ ] Novo componente/página criado? Verificar `scripts/new-page.sh`
