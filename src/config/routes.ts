/**
 * Routes Configuration - Centralized Route Management
 * * PRINCÍPIOS:
 * - DRY (Don't Repeat Yourself): Uma única definição para todas as rotas
 * - KISS (Keep It Simple): Configuração declarativa e fácil de entender
 * - Escalável: Adicionar novos idiomas é trivial
 * * ATUALIZAÇÃO v2.0:
 * - Adicionada rota de News (Notícias)
 * - Adicionada rota de Videos
 */

import { lazy, ComponentType } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type Language = 'en' | 'pt';

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
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const MyAccountPage = lazy(() => import('../pages/MyAccountPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const PhilosophyPage = lazy(() => import('../pages/PhilosophyPage'));
const NewsPage = lazy(() => import('../pages/NewsPage')); // ✨ Nova página
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// ============================================================================
// ROUTES CONFIGURATION
// ============================================================================

export const ROUTES_CONFIG: RouteConfig[] = [
  // Home (Index)
  {
    component: HomePage,
    paths: { en: '', pt: '' },
    isIndex: true,
  },

  // About
  {
    component: AboutPage,
    paths: { en: 'about', pt: 'sobre' },
  },

  // Events (com rota dinâmica :id)
  {
    component: EventsPage,
    paths: { en: 'events', pt: 'eventos' },
  },
  {
    component: EventsPage,
    paths: { en: 'events/:id', pt: 'eventos/:id' },
  },

  // Music (com rota dinâmica :slug)
  {
    component: MusicPage,
    paths: { en: 'music', pt: 'musica' },
  },
  {
    component: MusicPage,
    paths: { en: 'music/:slug', pt: 'musica/:slug' },
  },

  // News / Blog (✨ NOVO)
  {
    component: NewsPage,
    paths: { en: 'news', pt: 'noticias' },
  },
  {
    component: NewsPage, // Idealmente seria NewsDetailPage, mas NewsPage pode tratar o slug
    paths: { en: 'news/:slug', pt: 'noticias/:slug' },
  },

  // Zen Tribe (múltiplos aliases)
  {
    component: ZenTribePage,
    paths: { 
      en: ['tribe', 'zen-tribe', 'zentribe'], 
      pt: ['tribo', 'tribo-zen'] 
    },
  },

  // Press Kit / Work With Me
  {
    component: PressKitPage,
    paths: { en: 'work-with-me', pt: 'contrate' },
  },

  // Shop (com wildcard para subrotas)
  {
    component: ShopPage,
    paths: { en: 'shop', pt: 'loja' },
    hasWildcard: true,
  },

  // Dashboard
  {
    component: DashboardPage,
    paths: { en: 'dashboard', pt: 'painel' },
  },

  // My Account
  {
    component: MyAccountPage,
    paths: { en: 'my-account', pt: 'minha-conta' },
  },

  // FAQ
  {
    component: FAQPage,
    paths: { en: 'faq', pt: 'faq' },
  },

  // Philosophy
  {
    component: PhilosophyPage,
    paths: { en: 'my-philosophy', pt: 'minha-filosofia' },
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