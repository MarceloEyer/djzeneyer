// src/utils/routeUtils.ts
export const normalizePath = (p: string) => {
  if (!p) return '/';
  try {
    const u = p.split('?')[0].split('#')[0];
    return u.replace(/\/+$/,'') || '/';
  } catch {
    return '/';
  }
};

/**
 * Try simple dynamic conversions for common patterns:
 * - events/:id  <-> /pt/eventos/:id
 * - music/:slug  <-> /pt/musica/:slug
 * - shop/product/:id  <-> /pt/loja/produto/:id  (example)
 */
export const tryDynamicMapping = (path: string, newLang: 'pt'|'en') => {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return null;

  // events
  if (parts[0] === 'events' || parts[0] === 'eventos') {
    const rest = parts.slice(1).join('/');
    return newLang === 'pt' ? `/pt/eventos${rest ? '/' + rest : ''}` : `/events${rest ? '/' + rest : ''}`;
  }

  // music
  if (parts[0] === 'music' || parts[0] === 'musica') {
    const rest = parts.slice(1).join('/');
    return newLang === 'pt' ? `/pt/musica${rest ? '/' + rest : ''}` : `/music${rest ? '/' + rest : ''}`;
  }

  // shop product example: /shop/product/123 -> /pt/loja/produto/123
  if (parts[0] === 'shop' && parts[1] === 'product') {
    const rest = parts.slice(2).join('/');
    return newLang === 'pt' ? `/pt/loja/produto${rest ? '/' + rest : ''}` : `/shop/product${rest ? '/' + rest : ''}`;
  }

  return null;
};
