import type { VideoSchemaData } from '../components/HeadlessSEO';

const YOUTUBE_ID_REGEX =
  /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)?([\w-]{11})(?:[?&"\s]|$)/i;

const YOUTUBE_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)+([\w-]{11})/i;

export function extractYouTubeId(urlOrIframe: string): string | null {
  if (!urlOrIframe) return null;
  const match = urlOrIframe.match(YOUTUBE_URL_REGEX);
  return match ? match[1] : null;
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
