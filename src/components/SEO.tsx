// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

export default function SEO({
  title,
  description,
  image = 'https://djzeneyer.com/social-share.jpg',
  canonical: customCanonical
}: SEOProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isPt = i18n.language === 'pt';
  
  // Remove /pt do início para obter o caminho base
  const basePath = location.pathname.replace(/^\/pt/, '');
  const enPath = basePath;
  const ptPath = basePath === '/' ? '/pt' : `/pt${basePath}`;

  const canonical = customCanonical || `https://djzeneyer.com${location.pathname}`;
  const enUrl = `https://djzeneyer.com${enPath}`;
  const ptUrl = `https://djzeneyer.com${ptPath}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      {/* Canonical & Alternate (hreflang) */}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="pt" href={ptUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="DJ Zen Eyer" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": canonical,
          "inLanguage": isPt ? "pt-BR" : "en-US",
          "publisher": {
            "@type": "Person",
            "name": "DJ Zen Eyer",
            "url": "https://djzeneyer.com"
          }
        })}
      </script>
    </Helmet>
  );
}