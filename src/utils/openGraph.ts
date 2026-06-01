import { ARTIST } from '../data/artistData';
import { DISCOGRAPHY } from '../data/artist.schema';
import type { Language } from '../config/routes';

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE = '/images/zen-eyer-og-image.png';
/** @deprecated Use getOpenGraphAltForPath(path, lang) — this constant is English-only */
export const DEFAULT_OG_IMAGE_ALT = 'Zen Eyer performing a Brazilian Zouk DJ set';

// ─── Bilingual alt-text translations ────────────────────────────────────────
type AltKey = 'default' | 'home' | 'about' | 'events' | 'music' | 'press' | 'facts' | 'shop' | 'support';

const OG_ALT_TRANSLATIONS: Record<AltKey, Record<Language, string>> = {
  default: {
    en: 'Zen Eyer performing a Brazilian Zouk DJ set',
    pt: 'Zen Eyer numa performance de DJ de Zouk Brasileiro',
  },
  home: {
    en: 'Zen Eyer performing live at an international Brazilian Zouk event',
    pt: 'Zen Eyer ao vivo num evento internacional de Zouk Brasileiro',
  },
  about: {
    en: 'Portrait of Zen Eyer, Brazilian Zouk DJ and music artist',
    pt: 'Retrato de Zen Eyer, DJ e músico de Zouk Brasileiro',
  },
  events: {
    en: 'Zen Eyer playing a Brazilian Zouk DJ set for dancers',
    pt: 'Zen Eyer tocando Zouk Brasileiro para os dançarinos',
  },
  music: {
    en: 'Zen Eyer at the DJ decks for his Brazilian Zouk music catalog',
    pt: 'Zen Eyer nas pick-ups do seu catálogo de música Zouk Brasileiro',
  },
  press: {
    en: 'Official press image of Zen Eyer',
    pt: 'Imagem oficial de imprensa de Zen Eyer',
  },
  facts: {
    en: 'Zen Eyer with his Brazilian Zouk DJ world championship trophy',
    pt: 'Zen Eyer com seu troféu de campeão mundial de DJ de Zouk Brasileiro',
  },
  shop: {
    en: 'Zen Eyer celebrating with the Brazilian Zouk community',
    pt: 'Zen Eyer celebrando com a comunidade de Zouk Brasileiro',
  },
  support: {
    en: 'Zen Eyer connected with the Brazilian Zouk dance community',
    pt: 'Zen Eyer conectado com a comunidade de dança Zouk Brasileiro',
  },
};

// ─── Route → OG image map ────────────────────────────────────────────────────
const PAGE_OG_IMAGES: Array<{ match: RegExp; image: string; altKey: AltKey }> = [
  {
    match: /^\/(pt\/)?$/,
    image: '/images/og/zen-eyer-home-og.jpg',
    altKey: 'home',
  },
  {
    match: /^\/(pt\/)?(about|sobre)\/?$/,
    image: '/images/og/zen-eyer-about-og.jpg',
    altKey: 'about',
  },
  {
    match: /^\/(pt\/)?(events|zouk-events|eventos-zouk)(\/|$)/,
    image: '/images/og/zen-eyer-events-og.jpg',
    altKey: 'events',
  },
  {
    match: /^\/(pt\/)?(music|musica)(\/|$)/,
    image: '/images/og/zen-eyer-music-og.jpg',
    altKey: 'music',
  },
  {
    match: /^\/(pt\/)?(press-kit|kit-imprensa|media|midia)(\/|$)/,
    image: '/images/og/zen-eyer-press-og.jpg',
    altKey: 'press',
  },
  {
    match: /^\/(pt\/)?(verified-facts|fatos-verificados)(\/|$)/,
    image: '/images/og/zen-eyer-facts-og.jpg',
    altKey: 'facts',
  },
  {
    match: /^\/(pt\/)?(shop|loja|tickets|ingressos)(\/|$)/,
    image: '/images/og/zen-eyer-shop-og.jpg',
    altKey: 'shop',
  },
  {
    match: /^\/(pt\/)?(support|apoie|zenlink)(\/|$)/,
    image: '/images/og/zen-eyer-support-og.jpg',
    altKey: 'support',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toAbsolute = (image: string, baseUrl: string): string => {
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${baseUrl.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
};

export const getOpenGraphImageForPath = (pathname: string, baseUrl: string): string => {
  const normalizedPath = pathname || '/';
  const match = PAGE_OG_IMAGES.find((entry) => entry.match.test(normalizedPath));
  return toAbsolute(match?.image || DEFAULT_OG_IMAGE, baseUrl);
};

/**
 * Returns the localized Open Graph alt text for the given path.
 * Falls back to the `default` key when no route match is found.
 */
export const getOpenGraphAltForPath = (pathname: string, lang: Language = 'en'): string => {
  const normalizedPath = pathname || '/';
  const key = PAGE_OG_IMAGES.find((entry) => entry.match.test(normalizedPath))?.altKey ?? 'default';
  return OG_ALT_TRANSLATIONS[key][lang] ?? OG_ALT_TRANSLATIONS[key].en;
};

export const getOpenGraphImageType = (imageUrl: string): string | undefined => {
  const cleanUrl = imageUrl.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  return undefined;
};

/** Truncates at a word boundary to avoid mid-word cuts. */
const truncateAtWord = (value: string, maxLength: number): string => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  const slice = normalized.slice(0, maxLength - 3);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > maxLength * 0.5 ? slice.slice(0, lastSpace) : slice).trim() + '...';
};

export const getOpenGraphTitle = (value: string, maxLength = 90): string =>
  truncateAtWord(value, maxLength);

export const getOpenGraphDescription = (value: string, maxLength = 200): string =>
  truncateAtWord(value, maxLength);

export const getMetaDescription = (value: string, maxLength = 160): string =>
  truncateAtWord(value, maxLength);

export const findReleaseByNewsSlug = (slug: string | undefined, lang: Language) => {
  if (!slug) return undefined;
  return DISCOGRAPHY.find((release) => {
    const localizedSlug = release.newsSlugs?.[lang];
    return localizedSlug === slug || release.id === slug;
  });
};

export const getReleaseOpenGraphType = (releaseType: string | undefined): string =>
  releaseType === 'album' || releaseType === 'ep' ? 'music.album' : 'music.song';

/** Returns a localized "<releaseName> by/por <artist>" alt text. */
export const getReleaseOpenGraphAlt = (releaseName: string, lang: Language = 'en'): string => {
  const by = lang === 'pt' ? 'por' : 'by';
  return `${releaseName} ${by} ${ARTIST.identity.stageName}`;
};
