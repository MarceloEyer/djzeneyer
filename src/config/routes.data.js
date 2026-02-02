const normalizePaths = (paths) => (Array.isArray(paths) ? paths : [paths]);

const clampIndex = (index, maxIndex) => Math.max(0, Math.min(index, maxIndex));

export const routes = [
  {
    key: 'home',
    paths: { en: '', pt: '' },
    isIndex: true,
  },
  {
    key: 'about',
    paths: { en: 'about', pt: 'sobre' },
  },
  {
    key: 'events',
    paths: { en: 'events', pt: 'eventos' },
  },
  {
    key: 'events-detail',
    paths: { en: 'events/:id', pt: 'eventos/:id' },
    prerender: false,
  },
  {
    key: 'music',
    paths: { en: 'music', pt: 'musica' },
  },
  {
    key: 'music-detail',
    paths: { en: 'music/:slug', pt: 'musica/:slug' },
    prerender: false,
  },
  {
    key: 'news',
    paths: { en: 'news', pt: 'noticias' },
  },
  {
    key: 'news-detail',
    paths: { en: 'news/:slug', pt: 'noticias/:slug' },
    prerender: false,
  },
  {
    key: 'zen-tribe',
    paths: {
      en: ['zentribe', 'tribe', 'zen-tribe'],
      pt: ['tribo-zen', 'tribo'],
    },
  },
  {
    key: 'press-kit',
    paths: { en: 'work-with-me', pt: 'trabalhe-comigo' },
  },
  {
    key: 'shop-product',
    paths: { en: 'shop/product/:slug', pt: 'loja/produto/:slug' },
    prerender: false,
  },
  {
    key: 'shop',
    paths: { en: 'shop', pt: 'loja' },
    hasWildcard: true,
  },
  {
    key: 'cart',
    paths: { en: 'cart', pt: 'carrinho' },
  },
  {
    key: 'checkout',
    paths: { en: 'checkout', pt: 'finalizar-compra' },
  },
  {
    key: 'tickets',
    paths: { en: 'tickets', pt: 'ingressos' },
  },
  {
    key: 'tickets-checkout',
    paths: { en: 'tickets-checkout', pt: 'finalizar-ingressos' },
  },
  {
    key: 'dashboard',
    paths: { en: 'dashboard', pt: 'painel' },
  },
  {
    key: 'my-account',
    paths: { en: 'my-account', pt: 'minha-conta' },
  },
  {
    key: 'faq',
    paths: { en: 'faq', pt: 'perguntas-frequentes' },
  },
  {
    key: 'philosophy',
    paths: { en: 'my-philosophy', pt: 'minha-filosofia' },
  },
  {
    key: 'media',
    paths: { en: 'media', pt: 'na-midia' },
  },
  {
    key: 'support-artist',
    paths: { en: 'support-the-artist', pt: 'apoie-o-artista' },
  },
  {
    key: 'privacy-policy',
    paths: { en: 'privacy-policy', pt: 'politica-de-privacidade' },
  },
  {
    key: 'return-policy',
    paths: { en: 'return-policy', pt: 'reembolso' },
  },
  {
    key: 'terms',
    paths: { en: 'terms', pt: 'termos' },
  },
  {
    key: 'code-of-conduct',
    paths: { en: 'conduct', pt: 'regras-de-conduta' },
  },
];

export const getLocalizedPaths = (route, lang) => normalizePaths(route.paths[lang]);

export const buildFullPath = (path, lang) => {
  if (!path) {
    return lang === 'pt' ? '/pt/' : '/';
  }

  return lang === 'pt' ? `/pt/${path}` : `/${path}`;
};

export const getLocalizedRoutePairs = (route) => {
  const enPaths = getLocalizedPaths(route, 'en');
  const ptPaths = getLocalizedPaths(route, 'pt');
  const maxPtIndex = Math.max(0, ptPaths.length - 1);

  return enPaths.map((enPath, index) => ({
    en: enPath,
    pt: ptPaths[clampIndex(index, maxPtIndex)] ?? '',
  }));
};

export const getLocalizedRouteEntries = ({ prerenderOnly = false } = {}) => {
  const filteredRoutes = prerenderOnly ? routes.filter(route => route.prerender !== false) : routes;

  return filteredRoutes.flatMap(route =>
    getLocalizedRoutePairs(route).map(paths => ({
      route,
      paths,
      fullPaths: {
        en: buildFullPath(paths.en, 'en'),
        pt: buildFullPath(paths.pt, 'pt'),
      },
    })),
  );
};

export default {
  routes,
  getLocalizedPaths,
  buildFullPath,
  getLocalizedRoutePairs,
  getLocalizedRouteEntries,
};
