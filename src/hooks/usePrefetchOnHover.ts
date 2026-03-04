import { useCallback } from 'react';
import { queryClient, QUERY_KEYS } from '../config/queryClient';
import { fetchEventsFn, fetchTracksFn, fetchNewsFn, fetchProductsFn } from './useQueries';

/**
 * Custom hook to prefetch data on hover based on the URL.
 * Extracted from Navbar for reusability and cleaner code.
 */
export const usePrefetchOnHover = () => {
    return useCallback((url: string) => {
        if (!url) return;
        const lowerUrl = url.toLowerCase();
        const lang = lowerUrl.startsWith('/pt') ? 'pt' : 'en';

        // 1. Events Page
        if (lowerUrl.includes('event')) {
            const params = { limit: 10, lang, upcomingOnly: true };
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.events.list(params),
                queryFn: () => fetchEventsFn(params)
            });
        }
        // 2. Music Page
        else if (lowerUrl.includes('music') || lowerUrl.includes('musica') || lowerUrl.includes('música')) {
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.tracks.list(),
                queryFn: fetchTracksFn
            });
        }
        // 3. News Page (Blog)
        else if (lowerUrl.includes('news') || lowerUrl.includes('noticias')) {
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.posts.list(lang),
                queryFn: () => fetchNewsFn(lang)
            });
        }
        // 4. Shop Page
        else if (lowerUrl.includes('shop') || lowerUrl.includes('loja')) {
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.products.list(lang),
                queryFn: () => fetchProductsFn(lang)
            });
        }
    }, []);
};
