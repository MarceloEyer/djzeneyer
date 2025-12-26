import { useRoutes, RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { 
  ROUTES_CONFIG, 
  NOT_FOUND_COMPONENT, 
  getLocalizedPaths,
  Language 
} from '../config/routes';

// Função auxiliar para converter nossa config em objetos de rota do React Router
const generateRoutes = (lang: Language): RouteObject[] => {
  return ROUTES_CONFIG.flatMap((route) => {
    const paths = getLocalizedPaths(route, lang);
    const Component = route.component;

    return paths.map((path) => ({
      path: path || undefined, // undefined para index routes
      index: route.isIndex,
      element: <Component />,
      // Se tiver wildcard, adiciona a rota filha *
      children: route.hasWildcard ? [
        { path: '*', element: <Component /> }
      ] : undefined
    }));
  });
};

const AppRoutes = () => {
  const NotFound = NOT_FOUND_COMPONENT;

  // O hook useRoutes substitui o componente <Routes> e é muito mais limpo
  const element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: generateRoutes('en'),
    },
    {
      path: '/pt',
      element: <MainLayout />,
      children: generateRoutes('pt'),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return element;
};

export default AppRoutes;