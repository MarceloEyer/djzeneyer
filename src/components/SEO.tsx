// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string;
}

export default function SEO({
  title,
  description,
  image = 'https://djzeneyer.com/social-share.jpg',
  canonical: customCanonical,
  type = 'website',
  keywords
}: SEOProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language;
  const isPt = currentLang === 'pt';
  
  // Remove /pt do início para obter o caminho base
  const basePath = location.pathname.replace(/^\/pt/, '');
  
  // URLs corretas para cada idioma
  const enUrl = `https://djzeneyer.com${basePath}`;
  const ptUrl = basePath === '/' 
    ? 'https://djzeneyer.com/pt' 
    : `https://djzeneyer.com/pt${basePath}`;

  // Canonical: usa custom ou URL atual
  const canonical = customCanonical || `https://djzeneyer.com${location.pathname}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <meta name="language" content={isPt ? 'Portuguese' : 'English'} />

      {/* Canonical & Alternate (hreflang) */}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="pt" href={ptUrl} />
      <link rel="alternate" hrefLang="pt-BR" href={ptUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:locale" content={isPt ? 'pt_BR' : 'en_US'} />
      <meta property="og:locale:alternate" content={isPt ? 'en_US' : 'pt_BR'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@djzeneyer" />
      <meta name="twitter:creator" content="@djzeneyer" />

      {/* Schema.org (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": canonical,
          "inLanguage": isPt ? "pt-BR" : "en-US",
          "isPartOf": {
            "@type": "WebSite",
            "name": "DJ Zen Eyer",
            "url": "https://djzeneyer.com"
          },
          "publisher": {
            "@type": "Person",
            "name": "DJ Zen Eyer",
            "url": "https://djzeneyer.com",
            "sameAs": [
              "https://instagram.com/djzeneyer",
              "https://soundcloud.com/djzeneyer",
              "https://youtube.com/@djzeneyer"
            ]
          }
        })}
      </script>
    </Helmet>
  );
}
