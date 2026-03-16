import React, { lazy } from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
const ZenLinkPage = lazy(() => import('../pages/ZenLinkPage').then(m => ({ default: m.ZenLinkPage })));
// CORREÇÃO: Apontando para o local correto onde você definiu suas rotas
import {
  ROUTES_CONFIG,
  NOT_FOUND_COMPONENT,
  Language
} from '../config/routes';

// Função auxiliar robusta para gerar rotas do React Router v6
const generateRoutes = (lang: Language): RouteObject[] => {
  return ROUTES_CONFIG.flatMap((route) => {
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
          element: <Component />,
        };
      }

      // Caso B: Rota Normal (ex: 'sobre')
      // Nota: Não colocamos '/' antes, pois é relativo ao pai (/pt)
      return {
        path: path,
        element: <Component />,
        // Suporte para rotas com * (wildcard) como na Loja
        children: route.hasWildcard ? [
          { path: '*', element: <Component /> }
        ] : undefined
      };
    });
  });
};

const AppRoutes = () => {
  const NotFound = NOT_FOUND_COMPONENT;

  const element = useRoutes([
    // 🇧🇷 Rotas em Português (Raiz /pt)
    // Movido para cima para garantir prioridade na detecção
    {
      path: '/pt',
      element: <MainLayout />,
      children: generateRoutes('pt'),
    },

    // 🇬🇧 Rotas em Inglês (Raiz /)
    {
      path: '/',
      element: <MainLayout />,
      children: generateRoutes('en'),
    },

    // 🔗 ZenLink — página independente (sem Navbar/Footer)
    {
      path: '/zenlink',
      element: <ZenLinkPage />,
    },

    // 🚫 404 Catch-all
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return element;
};

export default AppRoutes;