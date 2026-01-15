// src/hooks/useMenu.ts
// v1.1 - Public Content Hook (React Query Cached)

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getSiteUrl } from '../config/api';
import { useMenuQuery } from './useQueries';

/* =========================
 * INTERFACES
 * ========================= */

interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

/* =========================
 * HOOK
 * ========================= */

/**
 * Hook para buscar menu de navegação com cache automático
 *
 * - Conteúdo público
 * - Cacheado via React Query
 * - Atualiza ao trocar idioma
 */
export function useMenu(): MenuItem[] {
  const { i18n } = useTranslation();

  const langToFetch = i18n.language.startsWith('pt') ? 'pt' : 'en';

  const { data, isLoading, error } = useMenuQuery(langToFetch);

  if (import.meta.env.DEV) {
    console.log(
      '[useMenu]',
      'lang:', langToFetch,
      'loading:', isLoading,
      'cached:', Boolean(data)
    );
  }

  const formattedItems = useMemo<MenuItem[]>(() => {
    if (!Array.isArray(data)) return [];

    const siteUrl = getSiteUrl();

    return data.map((item) => ({
      ...item,
      url: (item.url || '/').replace(siteUrl, '') || '/',
    }));
  }, [data]);

  if (error && import.meta.env.DEV) {
    console.error('[useMenu] Failed to fetch menu:', error);
  }

  return formattedItems;
}
