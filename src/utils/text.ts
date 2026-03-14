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
    let result = html;
    let previous;
    do {
        previous = result;
        result = result
            .replace(/<!--[\s\S]*?-->/g, '')                                   // Remove comments (WP)
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Remove styles
            .replace(/<[^>]*>/gm, '');                                         // Remove well-formed tags
    } while (result !== previous);

    // Final sweep to remove any stray or maliciously nested angle brackets
    // as recommended by CodeQL (js/incomplete-multi-character-sanitization)
    result = result.replace(/[<>]/g, '');

    return result
        .replace(/&nbsp;/g, ' ')                                           // Decode basic entities
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
};
