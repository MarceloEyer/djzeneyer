// src/hooks/useMenu.ts
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getSiteUrl } from "../config/api";
import { useMenuQuery } from "./useQueries";

interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

/**
 * Hook para buscar menu de navegação com cache automático
 * 
 * PERFORMANCE:
 * - Cache de 5 minutos (React Query)
 * - Não refaz request ao trocar de página
 * - Atualiza automaticamente ao trocar idioma
 * 
 * ANTES: Fetch manual em cada render
 * DEPOIS: Cache automático + deduplicação
 */
export function useMenu(): MenuItem[] {
  const { i18n } = useTranslation();
  const langToFetch = i18n.language.startsWith('pt') ? 'pt' : 'en';
  
  // React Query: cache automático + deduplicação
  const { data, isLoading, error } = useMenuQuery(langToFetch);
  
  // Log apenas em desenvolvimento
  if (import.meta.env.DEV) {
    console.log("useMenu - Idioma:", langToFetch, "| Loading:", isLoading, "| Cached:", !!data);
  }
  
  // Formata URLs (remove siteUrl para paths relativos)
  const formattedItems = useMemo(() => {
    if (!data) return [];
    
    const siteUrl = getSiteUrl();
    return data.map((item) => ({
      ...item,
      url: (item.url || '').replace(siteUrl, '') || '/',
    }));
  }, [data]);
  
  // Log de erro
  if (error) {
    console.error("Falha ao buscar menu:", error);
  }
  
  return formattedItems;
}