export interface HrefLang {
  lang: string;
  url: string;
}

export const ensureTrailingSlash = (url: string): string => {
  if (!url) return '/';
  if (url.endsWith('/')) return url;
  const hasQuery = url.includes('?');
  const hasHash = url.includes('#');

  if (hasQuery || hasHash) {
    const [basePath, ...rest] = url.split(/(\?|#)/);
    return `${basePath}/${rest.join('')}`;
  }

  if (/\.[a-z0-9]{2,4}$/i.test(url)) return url;
  return `${url}/`;
};

/**
 * @deprecated Use HeadlessSEO component which now handles this automatically.
 */
export const getHrefLangUrls = (path: string, baseUrl: string): HrefLang[] => {
  // Keeping for backward compatibility but implementation is legacy naive
  const cleanPath = path.replace(/^\/pt/, '').replace(/^\//, '').replace(/\/$/, '') || '/';
  const suffix = cleanPath === '/' ? '' : `/${cleanPath}/`;

  const enUrl = ensureTrailingSlash(`${baseUrl}${suffix}`);
  const ptUrl = ensureTrailingSlash(`${baseUrl}/pt${suffix}`);

  return [
    { lang: 'en', url: enUrl },
    { lang: 'pt-BR', url: ptUrl },
    { lang: 'x-default', url: enUrl },
  ];
};
