import { DISCOGRAPHY } from '../data/artist.discography';
import type { Language } from '../config/routes';

export const findReleaseByNewsSlug = (slug: string | undefined, lang: Language) => {
  if (!slug) return undefined;
  return DISCOGRAPHY.find((release) => {
    const localizedSlug = release.newsSlugs?.[lang];
    return localizedSlug === slug || release.id === slug;
  });
};

export const getReleaseOpenGraphType = (releaseType: string | undefined): string =>
  releaseType === 'album' || releaseType === 'ep' ? 'music.album' : 'music.song';
