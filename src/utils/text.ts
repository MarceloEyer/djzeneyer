/**
 * Utility to strip HTML tags from a string.
 * Optimized for both Client (DOMParser) and SSR (Regex fallback).
 */
export const stripHtml = (html: string): string => {
    if (!html) return '';

    // If in a browser environment, use DOMParser for accurate stripping (handles entities)
    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
        try {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return doc.body.textContent || '';
        } catch {
            // Fallback if DOMParser fails
        }
    }

    // SSR Fallback or if DOMParser is unavailable: use Regex
    return html
        .replace(/<!--[\s\S]*?-->/g, '')                                   // Remove comments (WP)
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Remove styles
        .replace(/<[^>]*>?/gm, '')                                         // Remove tags
        .replace(/&nbsp;/g, ' ')                                           // Decode basic entities
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
};
