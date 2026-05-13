# File Structure â€” DJ Zen Eyer

## ðŸŽ¨ Frontend (React SPA â€” Vite)

```
src/
â”œâ”€â”€ assets/
â”‚   â”œâ”€â”€ images/          â†’ Imagens (PNG, JPG, WebP)
â”‚   â”œâ”€â”€ svgs/            â†’ SVGs (icons, patterns)
â”‚   â””â”€â”€ fonts/           â†’ Web fonts
â”‚
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ Layout/
â”‚   â”‚   â”œâ”€â”€ Navbar.tsx   â†’ Menu de navegaÃ§Ã£o
â”‚   â”‚   â”œâ”€â”€ Footer.tsx   â†’ RodapÃ©
â”‚   â”‚   â””â”€â”€ Sidebar.tsx  â†’ Menu lateral (mobile)
â”‚   â”‚
â”‚   â”œâ”€â”€ auth/
â”‚   â”‚   â”œâ”€â”€ AuthModal.tsx        â†’ Modal de login/register
â”‚   â”‚   â””â”€â”€ ProtectedRoute.tsx   â†’ Wrapper para rotas privadas
â”‚   â”‚
â”‚   â”œâ”€â”€ HeadlessSEO.tsx  â†’ â­ CRÃTICO â€” Meta tags dinÃ¢micas em TODA pÃ¡gina
â”‚   â”œâ”€â”€ Loading.tsx
â”‚   â”œâ”€â”€ ErrorBoundary.tsx
â”‚   â””â”€â”€ [outros componentes].tsx
â”‚
â”œâ”€â”€ config/              â†’ â­ FONTE DE VERDADE para constantes
â”‚   â”œâ”€â”€ api.ts           â†’ BASE_URL, endpoints
â”‚   â”œâ”€â”€ routes.ts        â†’ Rotas da aplicaÃ§Ã£o
â”‚   â”œâ”€â”€ siteConfig.ts    â†’ â­ Brand, titles, IDs globais
â”‚   â””â”€â”€ i18n.ts          â†’ ConfiguraÃ§Ã£o i18n
â”‚
â”œâ”€â”€ hooks/
â”‚   â”œâ”€â”€ useQueries.ts    â†’ â­â­â­ SSOT para TODOS os hooks de dados
â”‚   â”œâ”€â”€ useAuth.ts       â†’ AutenticaÃ§Ã£o JWT
â”‚   â”œâ”€â”€ useLocalStorage.ts
â”‚   â””â”€â”€ [outros].ts
â”‚
â”œâ”€â”€ layouts/
â”‚   â”œâ”€â”€ MainLayout.tsx   â†’ Layout padrÃ£o (Navbar + Content + Footer)
â”‚   â””â”€â”€ AuthLayout.tsx   â†’ Layout para pÃ¡ginas de autenticaÃ§Ã£o
â”‚
â”œâ”€â”€ pages/
â”‚   â”œâ”€â”€ Home.tsx         â†’ Lazy-loaded
â”‚   â”œâ”€â”€ Events.tsx       â†’ Lazy-loaded
â”‚   â”œâ”€â”€ Shop.tsx         â†’ Lazy-loaded
â”‚   â”œâ”€â”€ Dashboard.tsx    â†’ Lazy-loaded
â”‚   â”œâ”€â”€ Checkout.tsx     â†’ Lazy-loaded
â”‚   â”œâ”€â”€ NotFound.tsx
â”‚   â””â”€â”€ [pÃ¡ginas novas].tsx
â”‚
â”œâ”€â”€ locales/             â†’ TraduÃ§Ãµes (i18n)
â”‚   â”œâ”€â”€ en/
â”‚   â”‚   â””â”€â”€ translation.json
â”‚   â””â”€â”€ pt/
â”‚       â””â”€â”€ translation.json
â”‚
â”œâ”€â”€ types/
â”‚   â”œâ”€â”€ api.ts           â†’ Types para respostas da API
â”‚   â”œâ”€â”€ models.ts        â†’ Types para models (Event, Product, etc)
â”‚   â””â”€â”€ [outros].ts
â”‚
â”œâ”€â”€ utils/
â”‚   â”œâ”€â”€ api-client.ts    â†’ InstÃ¢ncia do fetch/axios
â”‚   â”œâ”€â”€ format.ts        â†’ Formatters (data, moeda, etc)
â”‚   â””â”€â”€ validators.ts    â†’ ValidaÃ§Ãµes de formulÃ¡rio
â”‚
â”œâ”€â”€ App.tsx              â†’ Root component (providers, routes)
â”œâ”€â”€ main.tsx             â†’ Entry point
â””â”€â”€ index.css            â†’ Global styles (Tailwind imports)
```

### ðŸ§  Arquivo CrÃ­tico: `src/hooks/useQueries.ts`

**ESTE Ã© o arquivo ÃšNICO onde todo data fetching vive.**

```typescript
// âœ… Exemplo estrutura
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

// NUNCA FAÃ‡A fetch() direto em componentes â€” use estes hooks!
```

### ðŸŽ¯ Arquivo CrÃ­tico: `src/config/siteConfig.ts`

**SSOT para todas as constantes globais.**

```typescript
export const siteConfig = {
    siteName: 'DJ Zen Eyer',
    siteUrl: 'https://djzeneyer.com',
    description: 'BicampeÃ£o Mundial de Brazilian Zouk',
    
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

## âš™ï¸ Backend (WordPress Headless)

```
wp-content/
â”œâ”€â”€ themes/
â”‚   â””â”€â”€ zentheme/
â”‚       â”œâ”€â”€ inc/                  â†’ LÃ³gica core do tema
â”‚       â”‚   â”œâ”€â”€ class-loader.php  â†’ Bootstrap de hooks
â”‚       â”‚   â”œâ”€â”€ cors.php          â†’ ConfiguraÃ§Ã£o CORS
â”‚       â”‚   â”œâ”€â”€ rest-api.php      â†’ Endpoints customizados
â”‚       â”‚   â””â”€â”€ caching.php       â†’ Transients
â”‚       â”‚
â”‚       â”œâ”€â”€ dist/                 â†’ Output do build React (rsync alvo)
â”‚       â”‚   â”œâ”€â”€ index.html
â”‚       â”‚   â””â”€â”€ assets/
â”‚       â”‚       â”œâ”€â”€ *.js
â”‚       â”‚       â””â”€â”€ *.css
â”‚       â”‚
â”‚       â”œâ”€â”€ functions.php         â†’ Entrypoint do tema
â”‚       â”œâ”€â”€ index.php             â†’ Fallback (pode estar vazio)
â”‚       â”œâ”€â”€ style.css             â†’ Metadados do tema
â”‚       â””â”€â”€ screenshot.png        â†’ Imagem do tema no admin
â”‚
â””â”€â”€ plugins/
    â”‚
    â”œâ”€â”€ zen-bit/                  â†’ Bandsintown API integration
    â”‚   â”œâ”€â”€ zen-bit.php           â†’ Main file (namespace ZenBit\)
    â”‚   â”œâ”€â”€ inc/
    â”‚   â”‚   â”œâ”€â”€ class-api.php     â†’ LÃ³gica de fetch
    â”‚   â”‚   â”œâ”€â”€ class-cache.php   â†’ Transients
    â”‚   â”‚   â””â”€â”€ class-rest.php    â†’ Endpoints zen-bit/v2
    â”‚   â””â”€â”€ uninstall.php
    â”‚
    â”œâ”€â”€ zeneyer-auth/             â†’ JWT & Security Bridge (v2.3.0 Master)
    â”‚   â”œâ”€â”€ zeneyer-auth.php      â†’ Main file (namespace ZenEyer\Auth\ âœ…)
    â”‚   â”œâ”€â”€ includes/
    â”‚   â”‚   â”œâ”€â”€ API/              â†’ class-rest-routes.php (v1 aliases)
    â”‚   â”‚   â”œâ”€â”€ Admin/            â†’ class-settings-page.php
    â”‚   â”‚   â”œâ”€â”€ Auth/             â†’ class-password-auth.php, class-google-provider.php
    â”‚   â”‚   â”œâ”€â”€ Core/             â†’ class-jwt-manager.php, class-wp-auth-integration.php
    â”‚   â”‚   â””â”€â”€ class-activator.php â†’ Turnstile key check
    â”‚   â””â”€â”€ uninstall.php
    â”‚
    â”œâ”€â”€ zen-seo-lite/             â†’ SEO dinÃ¢mico
    â”‚   â”œâ”€â”€ zen-seo-lite.php      â†’ Main file (namespace ZenEyer\SEO\)
    â”‚   â”œâ”€â”€ inc/
    â”‚   â”‚   â”œâ”€â”€ class-meta.php    â†’ Meta tags dinÃ¢micas
    â”‚   â”‚   â””â”€â”€ class-rest.php    â†’ Endpoints zen-seo/v1
    â”‚   â””â”€â”€ uninstall.php
    â”‚
    â”œâ”€â”€ zengame/                  â†’ Gaming & Activity Bridge (SSOT)
    â”‚   â”œâ”€â”€ zengame.php           â†’ Main file (namespace ZenEyer\Game\ âœ…)
        â””â”€â”€ inc/
            â””â”€â”€ [estrutura similar]
```

---

## ðŸ›¡ï¸ DevOps & CI/CD

```
.github/
â””â”€â”€ workflows/
    â””â”€â”€ deploy.yml               â†’ Production deploy pipeline
                                   - Build React (npm run build)
                                   - rsync para Hostinger
                                   - Health checks pÃ³s-deploy

scripts/
â”œâ”€â”€ prerender.js                 â†’ SSG via Puppeteer (para SEO)
â”œâ”€â”€ generate-sitemaps.js         â†’ GeraÃ§Ã£o de sitemaps
â”œâ”€â”€ verify-namespaces.sh         â†’ ValidaÃ§Ã£o de namespacing
â”œâ”€â”€ new-page.sh                  â†’ Blueprint para nova pÃ¡gina
â”œâ”€â”€ pre-deploy-check.sh          â†’ ValidaÃ§Ãµes antes de deploy
â””â”€â”€ routes-config.json           â†’ ConfiguraÃ§Ã£o de rotas para prerender

public/
â”œâ”€â”€ robots.txt                   â†’ Para buscadores
â”œâ”€â”€ sitemap.xml                  â†’ Sitemap manual (fallback)
â”œâ”€â”€ favicon.ico
â””â”€â”€ [arquivos estÃ¡ticos]

.gitignore
.eslintrc.json
.prettierrc.json
tsconfig.json
vite.config.ts
package.json
```

---

## ðŸ“‹ Checklist: Estrutura VÃ¡lida?

- [ ] `src/hooks/useQueries.ts` existe e contÃ©m TODOS os hooks
- [ ] `src/config/siteConfig.ts` Ã© a SSOT para constantes
- [ ] Nenhum `fetch()` em componentes (sempre via useQueries)
- [ ] `src/components/HeadlessSEO` importado em TODAS as pÃ¡ginas
- [ ] Plugins em `plugins/` tÃªm namespace correto (verificar com `scripts/verify-namespaces.sh`)
- [ ] `dist/` Ã© o alvo do rsync (nÃ£o tocar manualmente)
- [ ] TraduÃ§Ãµes em `src/locales/{pt,en}/translation.json`
- [ ] Novo componente/pÃ¡gina criado? Verificar `scripts/new-page.sh`

