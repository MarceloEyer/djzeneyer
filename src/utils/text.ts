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
        result = result.replace(/<!--[\s\S]*?-->/g, '');
        result = result.replace(/<script\b[\s\S]*?<\/script\s*>/gi, '');
        result = result.replace(/<style\b[\s\S]*?<\/style\s*>/gi, '');
        result = result.replace(/<[^>]*>/g, '');
    } while (result !== previous);

    // Final sweep to remove any stray or maliciously nested angle brackets
    // as recommended by CodeQL (js/incomplete-multi-character-sanitization)
    result = result.replace(/[<>]/g, '');

    // Single-pass entity decoder to prevent double-unescaping (CodeQL: js/double-escaping)
    const entityMap: Record<string, string> = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&quot;': '"',
        '&lt;': '<',
        '&gt;': '>',
        '&apos;': "'"
    };

    return result.replace(/&(?:nbsp|amp|quot|lt|gt|apos);/g, (match) => entityMap[match] || match).trim();
};
