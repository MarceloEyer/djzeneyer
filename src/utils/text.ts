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

    // SSR Fallback or if DOMParser is unavailable: use an O(N) iterative parser
    // This avoids CodeQL bypass flags (js/bad-tag-filter) caused by generic regexes
    // or nested tags, and runs significantly faster than recursive replaces.
    let result = '';
    let i = 0;
    const len = html.length;
    while (i < len) {
        if (html[i] === '<') {
            if (html.startsWith('<!--', i)) {
                const end = html.indexOf('-->', i + 4);
                i = end === -1 ? len : end + 3;
            } else {
                const end = html.indexOf('>', i + 1);
                i = end === -1 ? len : end + 1;
            }
        } else if (html[i] === '>') {
            i++; // drop stray absolute sweep
        } else {
            // Fast-forward to the next tag or stray bracket
            const nextTag = html.indexOf('<', i);
            const nextClose = html.indexOf('>', i);
            const next = (nextTag !== -1 && nextClose !== -1)
                ? Math.min(nextTag, nextClose)
                : Math.max(nextTag, nextClose);

            if (next === -1) {
                result += html.slice(i);
                break;
            } else {
                result += html.slice(i, next);
                i = next;
            }
        }
    }

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
