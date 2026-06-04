import type { VideoSchemaData } from '../components/HeadlessSEO';

export function extractYouTubeId(urlOrIframe: string): string | null {
  if (!urlOrIframe) return null;
  
  // Match youtube iframe src OR direct url
  // Handles: youtube.com/embed/ID, youtube.com/watch?v=ID, youtu.be/ID
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = urlOrIframe.match(regex);
  return match ? match[1] : null;
}

export function buildYouTubeVideoObject(
  htmlContent: string, 
  titleFallback: string, 
  dateFallback: string
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
