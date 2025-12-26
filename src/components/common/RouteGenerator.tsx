/**
 * RouteGenerator - Dynamic Route Generation Component
 * 
 * Gera rotas React Router dinamicamente a partir da configuração centralizada.
 * Elimina duplicação de código e facilita manutenção.
 */

import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import { 
  ROUTES_CONFIG, 
  NOT_FOUND_COMPONENT,
  getLocalizedPaths,
  type Language 
} from '../../config/routes';
import MainLayout from '../../layouts/MainLayout';

// ============================================================================
// TYPES
// ============================================================================

interface RouteGeneratorProps {
  /** Idioma para gerar as rotas */
  language: Language;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Gera todas as rotas para um idioma específico
 * 
 * ESTRUTURA GERADA:
 * <Route path="/" element={<MainLayout />}>  (EN)
 *   <Route index element={<HomePage />} />
 *   <Route path="about" element={<AboutPage />} />
 *   ...
 * </Route>
 * 
 * <Route path="/pt" element={<MainLayout />}>  (PT)
 *   <Route index element={<HomePage />} />
 *   <Route path="sobre" element={<AboutPage />} />
 *   ...
 * </Route>
 */
export const RouteGenerator: React.FC<RouteGeneratorProps> = ({ language }) => {
  const basePath = language === 'pt' ? '/pt' : '/';

  return (
    <Route path={basePath} element={<MainLayout />}>
      {ROUTES_CONFIG.flatMap((routeConfig, index) => {
        const Component = routeConfig.component;
        const paths = getLocalizedPaths(routeConfig, language);

        // Para cada path (pode ter múltiplos aliases)
        return paths.flatMap((path, pathIndex) => {
          const key = `${language}-${index}-${pathIndex}`;

          // Index route (/)
          if (routeConfig.isIndex) {
            return <Route key={key} index element={<Component />} />;
          }

          // Route com wildcard (ex: shop/*)
          if (routeConfig.hasWildcard) {
            return [
              <Route key={`${key}-main`} path={path} element={<Component />} />,
              <Route key={`${key}-wildcard`} path={`${path}/*`} element={<Component />} />
            ];
          }

          // Route normal
          return <Route key={key} path={path} element={<Component />} />;
        });
      })}
    </Route>
  );
};

/**
 * Gera a rota 404 (fallback)
 */
export const NotFoundRoute: React.FC = () => {
  const NotFound = NOT_FOUND_COMPONENT;
  return <Route path="*" element={<NotFound />} />;
};
