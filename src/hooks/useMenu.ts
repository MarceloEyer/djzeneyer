// src/hooks/useMenu.ts
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

const getWpConfig = () => {
    if (window.wpData?.restUrl) return window.wpData;
    // Fallback para ambiente de desenvolvimento
    if (import.meta.env.VITE_WP_REST_URL) {
      return {
        siteUrl: import.meta.env.VITE_WP_SITE_URL || '',
        restUrl: import.meta.env.VITE_WP_REST_URL || '',
        nonce: 'dev-nonce'
      };
    }
    return { siteUrl: '', restUrl: '', nonce: '' };
};

export function useMenu() {
  const { i18n } = useTranslation(); // Obter o hook de tradução
  const [items, setItems] = useState<MenuItem[]>([]);
  const config = getWpConfig();

  useEffect(() => {
    if (!config.restUrl) return;

    const controller = new AbortController();
    // Usar o idioma atual do i18n para buscar o menu
    const langToFetch = i18n.language.startsWith('pt') ? 'pt' : 'en';
    console.log("useMenu - Buscando menu para idioma:", langToFetch); // Log de depuração

    fetch(`${config.restUrl}djzeneyer/v1/menu?lang=${langToFetch}`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("useMenu - Dados recebidos:", data); // Log de depuração
        if (Array.isArray(data)) {
          const formattedData = data.map((item: any) => ({
            ...item,
            // Usando a lógica mais segura para formatar a URL
            url: (item.url || '').replace(config.siteUrl, '') || '/',
          }));
          setItems(formattedData);
        } else {
          setItems([]);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Falha ao buscar menu:", err);
          setItems([]);
        }
      });

    return () => {
      controller.abort();
    };
  }, [i18n.language, config.restUrl, config.siteUrl]); // Adicionamos i18n.language como dependência

  return items;
}