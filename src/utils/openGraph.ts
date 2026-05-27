import { ARTIST, DISCOGRAPHY } from '../data/artistData';
import type { Language } from '../config/routes';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE = '/images/zen-eyer-og-image.png';
export const DEFAULT_OG_IMAGE_ALT = 'Zen Eyer performing a Brazilian Zouk DJ set';

const PAGE_OG_IMAGES: Array<{ match: RegExp; image: string; alt: string }> = [
  {
    match: /^\/(pt\/)?$/,
    image: '/images/og/zen-eyer-home-og.jpg',
    alt: 'Zen Eyer performing live at an international Brazilian Zouk event',
  },
  {
    match: /^\/(pt\/)?(about|sobre)\/?$/,
    image: '/images/og/zen-eyer-about-og.jpg',
    alt: 'Portrait of Zen Eyer, Brazilian Zouk DJ and music artist',
  },
  {
    match: /^\/(pt\/)?(events|zouk-events|eventos-zouk)(\/|$)/,
    image: '/images/og/zen-eyer-events-og.jpg',
    alt: 'Zen Eyer playing a Brazilian Zouk DJ set for dancers',
  },
  {
    match: /^\/(pt\/)?(music|musica)(\/|$)/,
    image: '/images/og/zen-eyer-music-og.jpg',
    alt: 'Zen Eyer at the DJ decks for his Brazilian Zouk music catalog',
  },
  {
    match: /^\/(pt\/)?(press-kit|kit-imprensa|media|midia)(\/|$)/,
    image: '/images/og/zen-eyer-press-og.jpg',
    alt: 'Official press image of Zen Eyer',
  },
  {
    match: /^\/(pt\/)?(verified-facts|fatos-verificados)(\/|$)/,
    image: '/images/og/zen-eyer-facts-og.jpg',
    alt: 'Zen Eyer with his Brazilian Zouk DJ world championship trophy',
  },
  {
    match: /^\/(pt\/)?(shop|loja|tickets|ingressos)(\/|$)/,
    image: '/images/og/zen-eyer-shop-og.jpg',
    alt: 'Zen Eyer celebrating with the Brazilian Zouk community',
  },
  {
    match: /^\/(pt\/)?(support|apoie|zenlink)(\/|$)/,
    image: '/images/og/zen-eyer-support-og.jpg',
    alt: 'Zen Eyer connected with the Brazilian Zouk dance community',
  },
];

const toAbsolute = (image: string, baseUrl: string): string => {
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${baseUrl.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
};

export const getOpenGraphImageForPath = (pathname: string, baseUrl: string): string => {
  const normalizedPath = pathname || '/';
  const match = PAGE_OG_IMAGES.find((entry) => entry.match.test(normalizedPath));
  return toAbsolute(match?.image || DEFAULT_OG_IMAGE, baseUrl);
};

export const getOpenGraphAltForPath = (pathname: string): string => {
  const normalizedPath = pathname || '/';
  return PAGE_OG_IMAGES.find((entry) => entry.match.test(normalizedPath))?.alt || DEFAULT_OG_IMAGE_ALT;
};

export const getOpenGraphImageType = (imageUrl: string): string | undefined => {
  const cleanUrl = imageUrl.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  return undefined;
};

export const getOpenGraphTitle = (value: string, maxLength = 90): string => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1).trim()}...` : normalized;
};

export const getOpenGraphDescription = (value: string, maxLength = 200): string => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1).trim()}...` : normalized;
};

export const getMetaDescription = (value: string, maxLength = 160): string => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 3).trim()}...` : normalized;
};

export const findReleaseByNewsSlug = (slug: string | undefined, lang: Language) => {
  if (!slug) return undefined;
  return DISCOGRAPHY.find((release) => {
    const localizedSlug = release.newsSlugs?.[lang];
    return localizedSlug === slug || release.id === slug;
  });
};

export const getReleaseOpenGraphType = (releaseType: string | undefined): string =>
  releaseType === 'album' || releaseType === 'ep' ? 'music.album' : 'music.song';

export const getReleaseOpenGraphAlt = (releaseName: string): string =>
  `${releaseName} by ${ARTIST.identity.stageName}`;
