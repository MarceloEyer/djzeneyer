/**
 * Routes Configuration - Centralized Route Management
 * * PRINCÍPIOS:
 * - DRY (Don't Repeat Yourself): Uma única definição para todas as rotas
 * - KISS (Keep It Simple): Configuração declarativa e fácil de entender
 * - Escalável: Adicionar novos idiomas é trivial
 * * ATUALIZAÇÃO v2.0:
 * - Adicionada rota de News (Notícias)
 * - Adicionada rota de Videos
 * * ATUALIZAÇÃO v3.0:
 * - Sincronizado com todas as páginas do WordPress
 * - Adicionadas rotas: Cart, Checkout, Return Policy, Support Artist, Tickets
 * - Slugs limpos e otimizados para SEO (sem sufixos -2)
 * * ATUALIZAÇÃO v4.0:
 * - Slugs definitivos aprovados pelo usuário (março 2026)
 * - About: about-dj-zen-eyer / sobre-dj-zen-eyer
 * - Music: zouk-music / musica-zouk
 * - Support: support-dj-zen-eyer / apoie-dj-zen-eyer
 * - PressKit: press-kit-dj-zen-eyer / kit-de-imprensa
 * - ZenLink: zenlink / links-zen
 */

import { lazy, ComponentType } from 'react';
import { matchPath, generatePath } from 'react-router-dom';

// ============================================================================
// TYPES
// ============================================================================

export type Language = 'en' | 'pt';

export const normalizeLanguage = (lang: string): Language => {
  const normalized = lang.trim().toLowerCase();
  return normalized.startsWith('pt') ? 'pt' : 'en';
};

export interface RouteConfig {
  /** Chave lógica única (ex: 'about', 'events') */
  key: string;
  /** Componente da página (lazy loaded) */
  component: ComponentType;
  /** Caminhos por idioma */
  paths: Record<Language, string | string[]>;
  /** Se true, a rota é index (sem path) */
  isIndex?: boolean;
  /** Se true, permite rotas filhas com wildcard */
  hasWildcard?: boolean;
}

// ============================================================================
// LAZY LOADED COMPONENTS
// ============================================================================

// HomePage não é lazy (carrega imediatamente)
import HomePage from '../pages/HomePage';

// Demais páginas são lazy loaded
const AboutPage = lazy(() => import('../pages/AboutPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const MusicPage = lazy(() => import('../pages/MusicPage'));
const ZenTribePage = lazy(() => import('../pages/ZenTribePage'));
const PressKitPage = lazy(() => import('../pages/PressKitPage'));
const ShopPage = lazy(() => import('../pages/ShopPage'));
const ProductPage = lazy(() => import('../pages/ProductPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const MyAccountPage = lazy(() => import('../pages/MyAccountPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const PhilosophyPage = lazy(() => import('../pages/PhilosophyPage'));
const NewsPage = lazy(() => import('../pages/NewsPage'));
const MediaPage = lazy(() => import('../pages/MediaPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const ReturnPolicyPage = lazy(() => import('../pages/ReturnPolicyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const CodeOfConductPage = lazy(() => import('../pages/CodeOfConductPage'));
const SupportArtistPage = lazy(() => import('../pages/SupportArtistPage'));
const TicketsPage = lazy(() => import('../pages/TicketsPage'));
const TicketsCheckoutPage = lazy(() => import('../pages/TicketsCheckoutPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const ZenLinkPage = lazy(() => import('../pages/ZenLinkPage').then(m => ({ default: m.ZenLinkPage })));
const ZoukPersonaQuizPage = lazy(() => import('../pages/ZoukPersonaQuizPage'));
const PayMePage = lazy(() => import('../pages/PayMePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

import routesSlugs from './routes-slugs.json';

// Helper: slug por key e idioma
const slug = (key: string, lang: Language): string | string[] => {
  const route = routesSlugs.routes.find(r => r.key === key);
  if (!route) return '';
  const base = route[lang] as string;
  const aliases = (route.aliases as Record<string, string[]> | undefined)?.[lang] ?? [];
  return aliases.length > 0 ? [base, ...aliases] : base;
};

// ============================================================================
// ROUTES CONFIGURATION
// ============================================================================

export const ROUTES_CONFIG: RouteConfig[] = [
  // Home (Index)
  {
    key: 'home',
    component: HomePage,
    paths: { en: '', pt: '' },
    isIndex: true,
  },

  // About
  {
    key: 'about',
    component: AboutPage,
    paths: { en: slug('about', 'en') as string, pt: slug('about', 'pt') as string },
  },

  // Events (com rota dinâmica :id)
  {
    key: 'events',
    component: EventsPage,
    paths: { en: slug('events', 'en') as string, pt: slug('events', 'pt') as string },
  },
  {
    key: 'events-detail',
    component: EventsPage,
    paths: { en: `${slug('events', 'en')}/:id`, pt: `${slug('events', 'pt')}/:id` },
  },

  // Music (com rota dinâmica :slug)
  {
    key: 'music',
    component: MusicPage,
    paths: { en: slug('music', 'en') as string, pt: slug('music', 'pt') as string },
  },
  {
    key: 'music-detail',
    component: MusicPage,
    paths: { en: `${slug('music', 'en')}/:slug`, pt: `${slug('music', 'pt')}/:slug` },
  },

  // News / Blog
  {
    key: 'news',
    component: NewsPage,
    paths: { en: slug('news', 'en') as string, pt: slug('news', 'pt') as string },
  },
  {
    key: 'news-detail',
    component: NewsPage,
    paths: { en: `${slug('news', 'en')}/:slug`, pt: `${slug('news', 'pt')}/:slug` },
  },

  // Zen Tribe (com aliases)
  {
    key: 'zentribe',
    component: ZenTribePage,
    paths: { en: slug('zentribe', 'en'), pt: slug('zentribe', 'pt') },
  },

  // Press Kit / Booking
  {
    key: 'booking',
    component: PressKitPage,
    paths: { en: slug('booking', 'en') as string, pt: slug('booking', 'pt') as string },
  },

  // Shop (com wildcard para subrotas)
  {
    key: 'product-detail',
    component: ProductPage,
    paths: { en: `${slug('shop', 'en')}/product/:slug`, pt: `${slug('shop', 'pt')}/produto/:slug` },
  },
  {
    key: 'shop',
    component: ShopPage,
    paths: { en: slug('shop', 'en') as string, pt: slug('shop', 'pt') as string },
    hasWildcard: true,
  },

  // Cart / Carrinho
  {
    key: 'cart',
    component: CartPage,
    paths: { en: slug('cart', 'en') as string, pt: slug('cart', 'pt') as string },
  },

  // Checkout / Finalizar Compra
  {
    key: 'checkout',
    component: CheckoutPage,
    paths: { en: slug('checkout', 'en') as string, pt: slug('checkout', 'pt') as string },
  },

  // Tickets / Compra de Ingressos
  {
    key: 'tickets',
    component: TicketsPage,
    paths: { en: slug('tickets', 'en') as string, pt: slug('tickets', 'pt') as string },
  },

  // Tickets Checkout / Finalizar Ingressos
  {
    key: 'tickets-checkout',
    component: TicketsCheckoutPage,
    paths: { en: slug('tickets-checkout', 'en') as string, pt: slug('tickets-checkout', 'pt') as string },
  },

  // Dashboard
  {
    key: 'dashboard',
    component: DashboardPage,
    paths: { en: slug('dashboard', 'en') as string, pt: slug('dashboard', 'pt') as string },
  },

  // My Account
  {
    key: 'my-account',
    component: MyAccountPage,
    paths: { en: slug('my-account', 'en') as string, pt: slug('my-account', 'pt') as string },
  },

  // FAQ
  {
    key: 'faq',
    component: FAQPage,
    paths: { en: slug('faq', 'en') as string, pt: slug('faq', 'pt') as string },
  },

  // Philosophy
  {
    key: 'philosophy',
    component: PhilosophyPage,
    paths: { en: slug('philosophy', 'en') as string, pt: slug('philosophy', 'pt') as string },
  },

  // Press Kit (EPK + Media)
  {
    key: 'presskit',
    component: MediaPage,
    paths: { en: slug('presskit', 'en') as string, pt: slug('presskit', 'pt') as string },
  },

  // Support the Artist
  {
    key: 'support',
    component: SupportArtistPage,
    paths: { en: slug('support', 'en') as string, pt: slug('support', 'pt') as string },
  },

  // Privacy Policy
  {
    key: 'privacy',
    component: PrivacyPolicyPage,
    paths: { en: slug('privacy', 'en') as string, pt: slug('privacy', 'pt') as string },
  },

  // Return Policy
  {
    key: 'returns',
    component: ReturnPolicyPage,
    paths: { en: slug('returns', 'en') as string, pt: slug('returns', 'pt') as string },
  },

  // Terms of Use
  {
    key: 'terms',
    component: TermsPage,
    paths: { en: slug('terms', 'en') as string, pt: slug('terms', 'pt') as string },
  },

  // Code of Conduct
  {
    key: 'conduct',
    component: CodeOfConductPage,
    paths: { en: slug('conduct', 'en') as string, pt: slug('conduct', 'pt') as string },
  },

  // Zen Link (com aliases)
  {
    key: 'zenlink',
    component: ZenLinkPage,
    paths: { en: slug('zenlink', 'en'), pt: slug('zenlink', 'pt') },
  },

  // Zouk Persona Quiz
  {
    key: 'quiz',
    component: ZoukPersonaQuizPage,
    paths: { en: slug('quiz', 'en') as string, pt: slug('quiz', 'pt') as string },
  },

  // Password Reset
  {
    key: 'reset-password',
    component: ResetPasswordPage,
    paths: { en: slug('reset-password', 'en') as string, pt: slug('reset-password', 'pt') as string },
  },

  // PayMe / Pagamentos
  {
    key: 'payme',
    component: PayMePage,
    paths: { en: slug('payme', 'en') as string, pt: slug('payme', 'pt') as string },
  },
];

/**
 * Componente 404 (usado fora do loop de rotas)
 */
export const NOT_FOUND_COMPONENT = NotFoundPage;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtém o caminho localizado para uma rota
 */
export const getLocalizedPaths = (routeConfig: RouteConfig, lang: Language): string[] => {
  const paths = routeConfig.paths[lang];
  return Array.isArray(paths) ? paths : [paths];
};

/**
 * Obtém o prefixo de idioma para a rota base
 */
export const getLanguagePrefix = (lang: Language): string => {
  return lang === 'pt' ? '/pt' : '/';
};

/**
 * Constrói o caminho completo da rota
 */
export const buildFullPath = (path: string, lang: Language): string => {
  const prefix = getLanguagePrefix(lang);
  if (!path) return prefix; // Index route
  return prefix === '/' ? `/${path}` : `${prefix}/${path}`;
};

/**
 * Normaliza chave de rota para comparação interna
 */
export const normalizeRouteKey = (key: string): string => {
  if (!key) return '';
  const trimmed = key.trim();
  if (!trimmed || trimmed === '/' || trimmed === '/pt') return '';

  return trimmed
    .replace(/^\/pt(\/|$)/, '/')
    .replace(/^\//, '')
    .replace(/\/$/, '');
};

/**
 * Lookup map for Logical Keys to optimize getLocalizedRoute
 */
const KEY_ROUTE_MAP = new Map<string, RouteConfig>();

/**
 * Lookup map for all possible paths (including aliases) to Logical Keys
 */
const PATH_TO_KEY_MAP = new Map<string, string>();

// Pre-calculate mappings
ROUTES_CONFIG.forEach(route => {
  // 1. Key Map
  KEY_ROUTE_MAP.set(route.key, route);

  // 2. Path Map (for reverse lookup)
  Object.values(route.paths).forEach(p => {
    const pathsArray = Array.isArray(p) ? p : [p];
    pathsArray.forEach(path => {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      if (cleanPath) PATH_TO_KEY_MAP.set(cleanPath, route.key);
    });
  });
});

/**
 * Tenta encontrar a chave lógica a partir de um caminho/slug
 */
export const findKeyByPath = (path: string): string | undefined => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (!cleanPath) return 'home';
  return PATH_TO_KEY_MAP.get(cleanPath);
};

/**
 * Obtém o caminho localizado para uma rota, a partir de sua CHAVE LÓGICA ou um PATH legado
 */
export const getLocalizedRoute = (keyOrPath: string, lang: Language): string => {
  // 1. Tenta como chave direta
  let route = KEY_ROUTE_MAP.get(keyOrPath);

  // 2. Se não encontrou, tenta descobrir a chave pelo path (Reverse Lookup)
  if (!route) {
    const discoveredKey = findKeyByPath(keyOrPath);
    if (discoveredKey) {
      route = KEY_ROUTE_MAP.get(discoveredKey);
    }
  }

  // 3. Se ainda não encontrou, fallback para o path original (preservando formato)
  if (!route) {
    return buildFullPath(keyOrPath, lang);
  }

  const localizedPaths = getLocalizedPaths(route, lang);
  const localizedPath = Array.isArray(localizedPaths) ? localizedPaths[0] : localizedPaths;

  return buildFullPath(localizedPath, lang);
};

/**
 * Obtém todas as rotas configuradas para um idioma
 */
export const getRoutesForLanguage = (lang: Language) => {
  return ROUTES_CONFIG.flatMap(route => {
    const paths = getLocalizedPaths(route, lang);
    return paths.map(path => ({
      component: route.component,
      path,
      isIndex: route.isIndex,
      hasWildcard: route.hasWildcard,
    }));
  });
};

/**
 * Cached structure for finding routes by path efficiently
 * Reduces O(N) nested loops and string allocations down to a single linear array iteration
 */
interface RouteMatch {
  config: RouteConfig;
  exactPath: string;
  prefixPath: string;
}

const buildRouteMatchCache = (): Record<Language, RouteMatch[]> => {
  const cache: Record<Language, RouteMatch[]> = { en: [], pt: [] };
  const langs: Language[] = ['en', 'pt'];

  for (const lang of langs) {
    for (const route of ROUTES_CONFIG) {
      const paths = getLocalizedPaths(route, lang);
      for (const p of paths) {
        const fullPath = buildFullPath(p, lang);
        cache[lang].push({
          config: route,
          exactPath: fullPath,
          prefixPath: fullPath + '/'
        });
      }
    }
  }

  return cache;
};

const routeMatchCache = buildRouteMatchCache();

/**
 * Encontra a rota correspondente a um caminho
 */
export const findRouteByPath = (path: string, lang: Language): RouteConfig | undefined => {
  const matches = routeMatchCache[lang];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (path === match.exactPath || path.startsWith(match.prefixPath)) {
      return match.config;
    }
  }
  return undefined;
};

/**
 * Retorna links alternativos para o path atual
 * CORRIGIDO v3.1: Agora retorna paths localizados corretos
 */
export const getAlternateLinks = (
  currentPath: string,
  currentLang: string
): Record<string, string> => {
  const alternates: Record<string, string> = {};

  if (!currentPath || currentPath === '/') {
    return { en: '/', pt: '/pt/' };
  }

  // Remove o prefixo de idioma e barras extras
  const cleanPath = currentPath
    .replace(/^\/pt\//, '') // Remove /pt/ se existir
    .replace(/^\//, '') // Remove / inicial
    .replace(/\/$/, ''); // Remove / final

  for (const route of ROUTES_CONFIG) {
    // Pega os paths em inglês
    const pathsEn = getLocalizedPaths(route, 'en');
    const enPath = Array.isArray(pathsEn) ? pathsEn[0] : pathsEn;

    // Pega os paths em português
    const pathsPt = getLocalizedPaths(route, 'pt');
    const ptPath = Array.isArray(pathsPt) ? pathsPt[0] : pathsPt;

    // Verifica se o cleanPath corresponde ao path em inglês
    if (cleanPath === enPath || cleanPath.startsWith(enPath + '/')) {
      const suffix = cleanPath.slice(enPath.length);
      alternates.en = enPath ? `/${enPath}${suffix}` : `/${suffix}`;
      alternates.pt = ptPath ? `/pt/${ptPath}${suffix}` : `/pt/${suffix}`;
      alternates['x-default'] = alternates.en;
      return alternates;
    }

    // Verifica se o cleanPath corresponde ao path em português
    if (cleanPath === ptPath || cleanPath.startsWith(ptPath + '/')) {
      const suffix = cleanPath.slice(ptPath.length);
      alternates.en = enPath ? `/${enPath}${suffix}` : `/${suffix}`;
      alternates.pt = ptPath ? `/pt/${ptPath}${suffix}` : `/pt/${suffix}`;
      alternates['x-default'] = alternates.en;
      return alternates;
    }
  }

  // Fallback: retorna o path atual se não encontrar
  return {
    en: currentPath.replace(/^\/pt/, ''),
    pt: currentPath.startsWith('/pt') ? currentPath : `/pt${currentPath}`,
    'x-default': currentPath.replace(/^\/pt/, ''),
  };
};
