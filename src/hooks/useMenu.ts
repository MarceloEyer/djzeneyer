import { useState, useEffect } from "react";

export interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

// Você pode configurar sua URL de API como variável de ambiente em .env
const restUrl = import.meta.env.VITE_WP_API_URL ?? window.wpData?.restUrl;

export function useMenu(lang: "pt" | "en") {
  const [items, setItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    if (!restUrl) return;
    const controller = new AbortController();
    fetch(`${restUrl}djzeneyer/v1/menu?lang=${lang}`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : [])
      .then(data =>
        Array.isArray(data)
          ? setItems(data.map(i => ({
              ...i,
              url: i.url.replace(restUrl.replace(/\/$/, ''), '')
            })))
          : setItems([])
      )
      .catch(err => { if (err.name !== 'AbortError') console.error(err); });
    return () => controller.abort();
  }, [lang]);
  return items;
}
