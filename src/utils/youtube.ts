import type { VideoSchemaData } from '../components/HeadlessSEO';

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_URL_REGEX =
  /\b(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube(?:-nocookie)?\.com|youtu\.be)\/[^\s"'<>]+/gi;

const YOUTUBE_PATH_PREFIXES = ['/embed/', '/v/', '/shorts/', '/live/'];

function normalizeYouTubeUrl(candidate: string): URL | null {
  try {
    return new URL(candidate.startsWith('http') ? candidate : `https://${candidate}`);
  } catch {
    return null;
  }
}

function extractYouTubeIdFromUrl(candidate: string): string | null {
  const url = normalizeYouTubeUrl(candidate);
  if (!url) return null;

  const hostname = url.hostname.replace(/^(?:www\.|m\.)/, '');
  if (hostname === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  if (hostname !== 'youtube.com' && hostname !== 'youtube-nocookie.com') {
    return null;
  }

  for (const watchId of url.searchParams.getAll('v')) {
    if (YOUTUBE_ID_REGEX.test(watchId)) {
      return watchId;
    }
  }

  for (const prefix of YOUTUBE_PATH_PREFIXES) {
    if (url.pathname.startsWith(prefix)) {
      const id = url.pathname.slice(prefix.length).split('/')[0];
      return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
    }
  }

  return null;
}

export function extractYouTubeId(urlOrIframe: string): string | null {
  if (!urlOrIframe) return null;
  if (YOUTUBE_ID_REGEX.test(urlOrIframe)) return urlOrIframe;

  for (const match of urlOrIframe.matchAll(YOUTUBE_URL_REGEX)) {
    const videoId = extractYouTubeIdFromUrl(match[0]);
    if (videoId) return videoId;
  }

  return null;
}

export function buildYouTubeVideoObject(
  htmlContent: string,
  titleFallback: string,
  dateFallback: string,
): VideoSchemaData | null {
  const videoId = extractYouTubeId(htmlContent);
  if (!videoId) return null;

  return {
    name: titleFallback,
    description: titleFallback,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    uploadDate: dateFallback,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}
