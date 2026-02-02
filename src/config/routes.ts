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
 * * ATUALIZAÇÃO v3.1:
 * - Corrigido bug de i18n route switching (getAlternateLinks)
 */

import { lazy, ComponentType } from 'react';
import { matchPath, generatePath } from 'react-router-dom';
import routesData from './routes.data.js';

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

interface RouteDataEntry {
  key: string;
  paths: Record<Language, string | string[]>;
  isIndex?: boolean;
  hasWildcard?: boolean;
  prerender?: boolean;
}

interface RoutesData {
  routes: RouteDataEntry[];
}

const ROUTES_DATA = routesData as RoutesData;

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

const ROUTE_COMPONENTS: Record<RouteDataEntry['key'], ComponentType> = {
  home: HomePage,
  about: AboutPage,
  events: EventsPage,
  'events-detail': EventsPage,
  music: MusicPage,
  'music-detail': MusicPage,
  news: NewsPage,
  'news-detail': NewsPage,
  'zen-tribe': ZenTribePage,
  'press-kit': PressKitPage,
  'shop-product': ProductPage,
  shop: ShopPage,
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
  'code-of-conduct': CodeOfConductPage,
};

export const ROUTES_CONFIG: RouteConfig[] = ROUTES_DATA.routes.map(route => {
  const component = ROUTE_COMPONENTS[route.key];
  if (!component) {
    // Lança um erro descritivo para facilitar a depuração durante o desenvolvimento.
    throw new Error(`Mapeamento de componente ausente para a chave de rota: "${route.key}"`);
  }
  return {
    component,
    paths: route.paths,
    isIndex: route.isIndex,
    hasWildcard: route.hasWildcard,
  };
});

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
 * Obtém o caminho localizado para uma rota, a partir de uma chave em inglês
 */
export const getLocalizedRoute = (key: string, lang: Language): string => {
  const normalizedKey = normalizeRouteKey(key);
  if (!normalizedKey) return buildFullPath('', lang);

  const route = ROUTES_CONFIG.find(routeConfig => {
    const enPaths = getLocalizedPaths(routeConfig, 'en');
    return enPaths.some(path => path === normalizedKey);
  });

  if (!route) {
    return buildFullPath(normalizedKey, lang);
  }

  const enPaths = getLocalizedPaths(route, 'en');
  const localizedPaths = getLocalizedPaths(route, lang);
  const matchedIndex = enPaths.findIndex(path => path === normalizedKey);
  const localizedPath = localizedPaths[Math.max(0, Math.min(matchedIndex, localizedPaths.length - 1))] ?? localizedPaths[0];

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
 * CORRIGIDO v3.1: Agora retorna paths localizados corretos
 */
export const getAlternateLinks = (currentPath: string, currentLang: string): Record<string, string> => {
  const alternates: Record<string, string> = {};

  if (!currentPath || currentPath === '/') {
    return { en: '/', pt: '/pt/' };
  }

  // Remove o prefixo de idioma e barras extras
  const cleanPath = currentPath
    .replace(/^\/pt\//, '')  // Remove /pt/ se existir
    .replace(/^\//, '')       // Remove / inicial
    .replace(/\/$/, '');      // Remove / final

  for (const route of ROUTES_CONFIG) {
    // Pega os paths em inglês
    const pathsEn = getLocalizedPaths(route, 'en');
    const enPath = Array.isArray(pathsEn) ? pathsEn[0] : pathsEn;

    // Pega os paths em português
    const pathsPt = getLocalizedPaths(route, 'pt');
    const ptPath = Array.isArray(pathsPt) ? pathsPt[0] : pathsPt;

    // Verifica se o cleanPath corresponde ao path em inglês
    if (cleanPath === enPath || cleanPath.startsWith(enPath + '/')) {
      alternates.en = enPath ? `/${enPath}` : '/';
      alternates.pt = ptPath ? `/pt/${ptPath}` : '/pt/';
      alternates['x-default'] = alternates.en;
      return alternates;
    }

    // Verifica se o cleanPath corresponde ao path em português
    if (cleanPath === ptPath || cleanPath.startsWith(ptPath + '/')) {
      alternates.en = enPath ? `/${enPath}` : '/';
      alternates.pt = ptPath ? `/pt/${ptPath}` : '/pt/';
      alternates['x-default'] = alternates.en;
      return alternates;
    }
  }

  // Fallback: retorna o path atual se não encontrar
  return { 
    en: currentPath.replace(/^\/pt/, ''), 
    pt: currentPath.startsWith('/pt') ? currentPath : `/pt${currentPath}`,
    'x-default': currentPath.replace(/^\/pt/, '')
  };
};
