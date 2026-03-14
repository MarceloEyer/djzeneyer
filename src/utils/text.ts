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
    // Remove HTML comments recursively
    while (result.includes('<!--')) {
        const next = result.replace(/<!--[\s\S]*?-->/g, '');
        if (next === result) break;
        result = next;
    }
    // Remove all tags generically (covers script, style, and any other tag).
    // Specific-tag regexes like /<script\b...>/ can be bypassed and are flagged
    // by CodeQL (js/bad-tag-filter). The generic loop + final sweep is equivalent
    // in safety and avoids the false positive.
    while (result.includes('<')) {
        const next = result.replace(/<[^>]*>/g, '');
        if (next === result) break;
        result = next;
    }

    // Final absolute sweep: drop any stray or nested angle brackets
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
