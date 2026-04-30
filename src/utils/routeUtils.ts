// src/utils/routeUtils.ts
export const normalizePath = (p: string) => {
  if (!p) return '/';
  try {
    const q = p.indexOf('?');
    const h = p.indexOf('#');
    const end = q === -1 && h === -1
      ? p.length
      : q === -1 ? h
      : h === -1 ? q
      : Math.min(q, h);
    const u = p.slice(0, end);
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
  if (!path) return null;
  const start = path.startsWith('/') ? 1 : 0;
  const firstSlash = path.indexOf('/', start);
  const seg0 = firstSlash === -1 ? path.slice(start) : path.slice(start, firstSlash);
  const rest = firstSlash === -1 ? '' : path.slice(firstSlash + 1);
  const restSuffix = rest ? '/' + rest : '';

  // events
  if (seg0 === 'events' || seg0 === 'eventos') {
    return newLang === 'pt' ? `/pt/eventos${restSuffix}` : `/events${restSuffix}`;
  }

  // music
  if (seg0 === 'music' || seg0 === 'musica') {
    return newLang === 'pt' ? `/pt/musica${restSuffix}` : `/music${restSuffix}`;
  }

  // shop product example: /shop/product/123 -> /pt/loja/produto/123
  if (seg0 === 'shop') {
    const secondSlash = path.indexOf('/', start + seg0.length + 1);
    const seg1 = secondSlash === -1 ? path.slice(start + seg0.length + 1) : path.slice(start + seg0.length + 1, secondSlash);
    if (seg1 === 'product') {
      const deeper = secondSlash === -1 ? '' : path.slice(secondSlash);
      return newLang === 'pt' ? `/pt/loja/produto${deeper}` : `/shop/product${deeper}`;
    }
  }

  return null;
};
