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
 */

import { lazy, ComponentType } from 'react';
import routesData from './routes.data.json';

// ============================================================================
// TYPES
// ============================================================================

export type Language = 'en' | 'pt';

export const normalizeLanguage = (lang: string): Language => {
  const normalized = lang.trim().toLowerCase();
  return normalized.startsWith('pt') ? 'pt' : 'en';
};

export interface RouteConfig {
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
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// ============================================================================
// ROUTES CONFIGURATION
// ============================================================================

type RouteData = {
  key: string;
  paths: Record<Language, string | string[]>;
  isIndex?: boolean;
  hasWildcard?: boolean;
};

const ROUTE_COMPONENTS: Record<string, ComponentType> = {
  home: HomePage,
  about: AboutPage,
  events: EventsPage,
  'events-detail': EventsPage,
  music: MusicPage,
  'music-detail': MusicPage,
  news: NewsPage,
  'news-detail': NewsPage,
  zentribe: ZenTribePage,
  'press-kit': PressKitPage,
  shop: ShopPage,
  'shop-product': ProductPage,
  cart: CartPage,
  checkout: CheckoutPage,
  tickets: TicketsPage,
  'tickets-checkout': TicketsCheckoutPage,
  dashboard: DashboardPage,
  'my-account': MyAccountPage,
  faq: FAQPage,
  philosophy: PhilosophyPage,
  media: MediaPage,
  'support-artist': SupportArtistPage,
  'privacy-policy': PrivacyPolicyPage,
  'return-policy': ReturnPolicyPage,
  terms: TermsPage,
  conduct: CodeOfConductPage,
};

const ROUTES_DATA = routesData as RouteData[];

export const ROUTES_CONFIG: RouteConfig[] = ROUTES_DATA.map((route) => ({
  component: ROUTE_COMPONENTS[route.key],
  paths: route.paths,
  isIndex: route.isIndex,
  hasWildcard: route.hasWildcard,
}));

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
 * Encontra a rota correspondente a um caminho
 */
export const findRouteByPath = (path: string, lang: Language): RouteConfig | undefined => {
  return ROUTES_CONFIG.find(route => {
    const paths = getLocalizedPaths(route, lang);
    return paths.some(p => {
      const fullPath = buildFullPath(p, lang);
      return fullPath === path || path.startsWith(fullPath + '/');
    });
  });
};

/**
 * Retorna links alternativos para o path atual
 */
export const getAlternateLinks = (currentPath: string, currentLang: Language): Record<Language, string> => {
  const alternates: Record<Language, string> = {} as Record<Language, string>;

  // Se o path está vazio, retorna as raízes
  if (!currentPath || currentPath === '/') {
    return { en: '/', pt: '/' };
  }

  // Remove leading slash
  const cleanPath = currentPath.startsWith('/') ? currentPath.slice(1) : currentPath;

  // Tenta encontrar a rota correspondente
  for (const route of ROUTES_CONFIG) {
    const paths = getLocalizedPaths(route, 'en');
    const enPath = Array.isArray(paths) ? paths[0] : paths;

    const pathsPt = getLocalizedPaths(route, 'pt');
    const ptPath = Array.isArray(pathsPt) ? pathsPt[0] : pathsPt;

    // Verifica se o caminho atual corresponde a esta rota
    if (cleanPath === enPath || cleanPath.startsWith(enPath + '/')) {
      alternates.en = `/${enPath}`;
      alternates.pt = `/${ptPath}`;
      return alternates;
    }

    if (cleanPath === ptPath || cleanPath.startsWith(ptPath + '/')) {
      alternates.en = `/${enPath}`;
      alternates.pt = `/${ptPath}`;
      return alternates;
    }
  }

  // Fallback: retorna o mesmo path para ambos os idiomas
  return { en: currentPath, pt: currentPath };
};
