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
import { matchPath, generatePath } from 'react-router-dom';

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
const ProductPage = lazy(() => import('../pages/ProductPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const MyAccountPage = lazy(() => import('../pages/MyAccountPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const PhilosophyPage = lazy(() => import('../pages/PhilosophyPage'));
const NewsPage = lazy(() => import('../pages/NewsPage'));
const MediaPage = lazy(() => import('../pages/MediaPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('../pages/TermsPage'));
const CodeOfConductPage = lazy(() => import('../pages/CodeOfConductPage'));
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
      en: ['zentribe', 'tribe', 'zen-tribe'],
      pt: ['tribo-zen', 'tribo']
    },
  },

  // Press Kit / Work With Me
  {
    component: PressKitPage,
    paths: { en: 'work-with-me', pt: 'trabalho' },
  },

  // Shop (com wildcard para subrotas)
  {
    component: ProductPage,
    paths: { en: 'shop/product/:slug', pt: 'loja/produto/:slug' },
  },
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
    paths: { en: 'faq', pt: 'perguntas-frequentes' },
  },

  // Philosophy
  {
    component: PhilosophyPage,
    paths: { en: 'my-philosophy', pt: 'minha-filosofia' },
  },

  // Media / Press
  {
    component: MediaPage,
    paths: { en: 'media', pt: 'midia' },
  },

  // Privacy Policy
  {
    component: PrivacyPolicyPage,
    paths: { en: 'privacy-policy', pt: 'politica-de-privacidade' },
  },

  // Terms of Use
  {
    component: TermsPage,
    paths: { en: 'terms', pt: 'termos' },
  },

  // Code of Conduct
  {
    component: CodeOfConductPage,
    paths: { en: 'conduct', pt: 'conduta' },
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
  /**
 * Retorna links alternativos para o path atual
 */
export const getAlternateLinks = (currentPath: string, currentLang: Language): Record<string, string> => {
  const alternates: Record<string, string> = {};
  
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
