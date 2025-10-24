// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title: string;
  description: string;
}

export default function SEO({ title, description }: SEOProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isPt = i18n.language === 'pt';
  
  // Mapeie rotas para versões em outros idiomas
  const getAlternatePath = () => {
    const path = location.pathname.replace(/^\/pt/, '');
    return isPt ? path : `/pt${path}`;
  };

  const canonical = `https://djzeneyer.com${location.pathname}`;
  const alternate = `https://djzeneyer.com${getAlternatePath()}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* hreflang */}
      <link rel="alternate" hrefLang="en" href={isPt ? alternate : canonical} />
      <link rel="alternate" hrefLang="pt" href={isPt ? canonical : alternate} />
      <link rel="alternate" hrefLang="x-default" href={`https://djzeneyer.com${location.pathname.replace(/^\/pt/, '')}`} />
      
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}