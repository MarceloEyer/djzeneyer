import type { ComponentType } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ErrorBoundary from './common/ErrorBoundary';
import {
  ROUTES_CONFIG,
  NOT_FOUND_COMPONENT,
  Language,
  buildFullPath,
  getLocalizedPaths,
} from '../config/routes';

const STANDALONE_ROUTE_KEYS = new Set(['zenlink']);

const wrapRouteElement = (Component: ComponentType) => (
  <ErrorBoundary>
    <Component />
  </ErrorBoundary>
);

// Função auxiliar robusta para gerar rotas do React Router v6
const generateRoutes = (lang: Language): RouteObject[] => {
  return ROUTES_CONFIG.flatMap((route) => {
    if (STANDALONE_ROUTE_KEYS.has(route.key)) return [];

    // 1. Acessa diretamente a propriedade do idioma (en ou pt)
    const rawPath = route.paths[lang];

    // 2. Garante que seja um array para iterar (mesmo que seja string única)
    const paths = Array.isArray(rawPath) ? rawPath : [rawPath];
    const Component = route.component;

    // 3. Mapeia para objetos de rota
    return paths.map((path) => {
      // Caso A: Rota Index (Home)
      if (route.isIndex || path === '') {
        return {
          index: true,
          element: wrapRouteElement(Component),
        };
      }

      // Caso B: Rota Normal (ex: 'sobre')
      // Nota: Não colocamos '/' antes, pois é relativo ao pai (/pt)
      return {
        path: path,
        element: wrapRouteElement(Component),
        // Suporte para rotas com * (wildcard) como na Loja
        children: route.hasWildcard ? [
          {
            path: '*',
            element: wrapRouteElement(Component),
          }
        ] : undefined
      };
    });
  });
};

const generateStandaloneRoutes = (): RouteObject[] => {
  const seen = new Set<string>();

  return ROUTES_CONFIG.flatMap((route) => {
    if (!STANDALONE_ROUTE_KEYS.has(route.key)) return [];

    const Component = route.component;

    return (['en', 'pt'] as Language[]).flatMap((lang) => {
      return getLocalizedPaths(route, lang).flatMap((path) => {
        const fullPath = buildFullPath(path, lang);
        if (seen.has(fullPath)) return [];
        seen.add(fullPath);

        return [{
          path: fullPath,
          element: wrapRouteElement(Component),
        }];
      });
    });
  });
};

const NotFound = NOT_FOUND_COMPONENT;

// ⚡ Bolt: Extracted static routes configuration outside the component to prevent O(N) object
// reallocation and nested JSX re-instantiation on every render of AppRoutes.
const STATIC_ROUTES: RouteObject[] = [
  // 🔗 Standalone routes — sem Navbar/Footer para máxima conversão em link-in-bio
  ...generateStandaloneRoutes(),

  // 🇧🇷 Rotas em Português (Raiz /pt)
  // Movido para cima para garantir prioridade na detecção
  {
    path: '/pt',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: generateRoutes('pt'),
  },

  // 🇬🇧 Rotas em Inglês (Raiz /)
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: generateRoutes('en'),
  },

  // 🚫 404 Catch-all
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
  },
];

const AppRoutes = () => {
  const element = useRoutes(STATIC_ROUTES);
  return element;
};

export default AppRoutes;
