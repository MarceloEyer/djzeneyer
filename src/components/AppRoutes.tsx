import { useRoutes, RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
// Certifique-se que o caminho do import está correto para onde seu arquivo de config está
import { 
  ROUTES_CONFIG, 
  NOT_FOUND_COMPONENT, 
  Language 
} from '../scripts/routes-config'; 

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
    // 🇬🇧 Rotas em Inglês (Raiz /)
    {
      path: '/',
      element: <MainLayout />,
      children: generateRoutes('en'),
    },
    
    // 🇧🇷 Rotas em Português (Raiz /pt)
    {
      path: '/pt',
      element: <MainLayout />,
      children: generateRoutes('pt'),
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