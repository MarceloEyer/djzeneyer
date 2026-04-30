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
 * - Booking: work-with-me / trabalhe-comigo
 * - ZenLink: zenlink / links-zen
 */

import { lazy, ComponentType } from 'react';

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

// HomePage também é lazy para reduzir o bundle inicial e aliviar o custo de parse/execução
// no carregamento da primeira tela.
const HomePage = lazy(() => import('../pages/HomePage'));

// Demais páginas são lazy loaded
const AboutPage = lazy(() => import('../pages/AboutPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const MusicPage = lazy(() => import('../pages/MusicPage'));
const ZenTribePage = lazy(() => import('../pages/ZenTribePage'));
const MediaPage = lazy(() => import('../pages/MediaPage'));
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
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

import routesSlugs from './routes-slugs.json';

// Helper: map para O(1) slug lookup
const slugMap = new Map(routesSlugs.routes.map(r => [r.key, r]));

// Helper: slug por key e idioma
const slug = (key: string, lang: Language): string | string[] => {
  const route = slugMap.get(key);
  if (!route) return '';
  const base = route[lang as keyof typeof route] as string;
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

  // Media / Clipping
  {
    key: 'media',
    component: MediaPage,
    paths: { en: slug('media', 'en') as string, pt: slug('media', 'pt') as string },
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
/**
 * Normaliza chave de rota para comparação interna.
 * Otimizado: Remove RegExps pesadas substituindo por métodos nativos de string.
 */
export const normalizeRouteKey = (key: string): string => {
  if (!key) return '';
  const trimmed = key.trim();
  if (!trimmed || trimmed === '/' || trimmed === '/pt') return '';

  let clean = trimmed;
  if (clean.startsWith('/pt/')) clean = clean.slice(4); // Remove prefixo /pt/ (length 4)
  else if (clean === '/pt') return ''; // Fallback
  else if (clean.startsWith('/')) clean = clean.slice(1); // Remove leading slash

  if (clean.endsWith('/')) clean = clean.slice(0, -1); // Remove trailing slash

  return clean;
};

/**
 * Lookup map for Logical Keys to optimize getLocalizedRoute
 */
const KEY_ROUTE_MAP = new Map<string, RouteConfig>();

/**
 * Lookup map for all possible paths (including aliases) to Logical Keys
 */
const PATH_TO_KEY_MAP = new Map<string, string>();

/**
 * Lookup map for dynamic path prefixes (like 'events/', 'pt/eventos-zouk/') to their detail keys.
 * O(1) lookup for nested/detail routes, avoiding O(N*L) loops in findKeyByPath.
 */
const PREFIX_PATH_MAP = new Map<string, string>();

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

  // 3. Prefix Map (for detail/nested routes)
  let detailKey = route.key; // Fallback mapping
  if (route.key === 'events') detailKey = 'events-detail';
  else if (route.key === 'news') detailKey = 'news-detail';
  else if (route.key === 'shop') detailKey = 'product-detail';

  const enPaths = Array.isArray(route.paths.en) ? route.paths.en : [route.paths.en];
  const ptPaths = Array.isArray(route.paths.pt) ? route.paths.pt : [route.paths.pt];

  for (const p of [...enPaths, ...ptPaths]) {
    if (!p) continue;
    // remove leading slash if it exists
    let cleanP = p.startsWith('/') ? p.slice(1) : p;
    // remove trailing slash if it exists
    cleanP = cleanP.endsWith('/') ? cleanP.slice(0, -1) : cleanP;

    if (cleanP) {
      PREFIX_PATH_MAP.set(cleanP + '/', detailKey);
    }
  }
});

/**
 * Tenta encontrar a chave lógica a partir de um caminho/slug (Omni-language)
 */
export const findKeyByPath = (path: string): string | undefined => {
  const cleanPath = normalizeRouteKey(path);
  if (!cleanPath) return 'home';

  // 1. Busca exata (slug primário) - O(1) Lookup
  const exact = PATH_TO_KEY_MAP.get(cleanPath);
  if (exact) return exact;

  // 2. Busca de prefixo para páginas de detalhes/nested - O(K) Lookup, K é minúsculo
  for (const [prefix, detailKey] of PREFIX_PATH_MAP.entries()) {
    if (cleanPath.startsWith(prefix)) {
      return detailKey;
    }
  }

  return undefined;
};

/**
 * Obtém o caminho localizado para uma rota, a partir de sua CHAVE LÓGICA ou um PATH legado
 */
export const getLocalizedRoute = (keyOrPath: string, lang: Language): string => {
  // 0. Sanitiza a chave (remove leading slashes se houver)
  const sanitizedKey = normalizeRouteKey(keyOrPath);
  const finalKey = sanitizedKey || keyOrPath; // se vazio (home), mantém original

  // 1. Tenta como chave direta ou descoberta por path
  let route = KEY_ROUTE_MAP.get(finalKey) || KEY_ROUTE_MAP.get(keyOrPath);

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
 * Encontra a rota correspondente a um caminho.
 * Usa findKeyByPath + KEY_ROUTE_MAP para lookup O(1)/O(K) em vez de O(N*M).
 */
export const findRouteByPath = (path: string): RouteConfig | undefined => {
  const key = findKeyByPath(path);
  return key ? KEY_ROUTE_MAP.get(key) : undefined;
};

/**
 * Retorna links alternativos para o path atual
 * VERSÃO DEFINITIVA: Robusta contra 404 e slugs variados
 */
export const getAlternateLinks = (
  currentPath: string,
  currentLang?: Language
): Record<string, string> => {
  const alternates: Record<string, string> = { en: '/', pt: '/pt/', 'x-default': '/' };

  if (!currentPath || currentPath === '/' || currentPath === '/pt' || currentPath === '/pt/') {
    return alternates;
  }

  // Identifica a chave lógica da página atual
  const key = findKeyByPath(currentPath);
  if (!key) {
    // Fallback inteligente se não encontrar a chave (Otimizado sem Regex)
    let clean = currentPath;
    if (clean.startsWith('/pt/')) clean = clean.slice(4); // Remove /pt/ (length 4)
    else if (clean === '/pt') clean = '';
    else if (clean.startsWith('/')) clean = clean.slice(1);

    // Devolve a barra inicial
    clean = '/' + clean;

    return {
      en: clean,
      pt: clean === '/' ? '/pt/' : `/pt${clean}`,
      'x-default': clean
    };
  }

  let route = KEY_ROUTE_MAP.get(key);
  if (!route && key.endsWith('-detail')) {
    route = KEY_ROUTE_MAP.get(key.slice(0, -7));
  }
  if (!route) return alternates;

  // Pega os slugs primários
  const enSlug = Array.isArray(route.paths.en) ? route.paths.en[0] : route.paths.en;
  const ptSlug = Array.isArray(route.paths.pt) ? route.paths.pt[0] : route.paths.pt;

  // Calcula o sufixo dinâmico (ID do evento, slug da noticia, etc)
  let suffix = '';
  const currentClean = normalizeRouteKey(currentPath);
  
  // Encontra qual slug (ou alias) deu match para calcular o sufixo corretamente.
  // Usa a rota de detalhe (ex: events-detail) para ter os paths com /:slug.
  const detailRoute = KEY_ROUTE_MAP.get(key) ?? route;
  const allCurrentLangPaths = getLocalizedPaths(detailRoute, currentLang || (currentPath.startsWith('/pt') ? 'pt' : 'en'));
  for (const p of allCurrentLangPaths) {
    // Extrai apenas o prefixo estático: "/events/:slug" → "/events"
    const dynamicIdx = p.indexOf('/:');
    const staticPart = dynamicIdx === -1 ? p : p.slice(0, dynamicIdx);
    let cleanP = staticPart.startsWith('/') ? staticPart.slice(1) : staticPart;
    cleanP = cleanP.endsWith('/') ? cleanP.slice(0, -1) : cleanP;

    if (currentClean.startsWith(cleanP + '/')) {
      suffix = currentClean.slice(cleanP.length);
      break;
    }
  }

  // Garante que enSlug e ptSlug não começam com slash para o buildFullPath
  const cleanEnSlug = enSlug.startsWith('/') ? enSlug.slice(1) : enSlug;
  const cleanPtSlug = ptSlug.startsWith('/') ? ptSlug.slice(1) : ptSlug;

  alternates.en = buildFullPath(`${cleanEnSlug}${suffix}`, 'en');
  alternates.pt = buildFullPath(`${cleanPtSlug}${suffix}`, 'pt');
  alternates['x-default'] = alternates.en;

  return alternates;
};
