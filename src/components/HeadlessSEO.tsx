// src/components/HeadlessSEO.tsx
// Componente SEO otimizado para WordPress Headless + React

import { Helmet } from 'react-helmet-async';
import { ARTIST, ARTIST_SCHEMA_BASE, getSocialUrls, getVerificationUrls } from '../data/artistData';

interface HrefLang {
  lang: string;
  url: string;
}

interface HeadlessSEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  isHomepage?: boolean;
  hrefLang?: HrefLang[];
  schema?: object; // Schema.org JSON-LD personalizado
  noindex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

// Helper para gerar URLs hrefLang a partir do routeMap
export const getHrefLangUrls = (path: string, baseUrl: string): HrefLang[] => {
  const cleanPath = path.replace(/^\/pt/, '').replace(/^\//, '') || '/';
  
  return [
    { lang: 'en', url: `${baseUrl}${cleanPath === '/' ? '' : `/${cleanPath}`}` },
    { lang: 'pt-BR', url: `${baseUrl}/pt${cleanPath === '/' ? '' : `/${cleanPath}`}` },
    { lang: 'x-default', url: `${baseUrl}${cleanPath === '/' ? '' : `/${cleanPath}`}` },
  ];
};

// Schema padrão do artista (usado quando não há schema personalizado)
const getDefaultArtistSchema = (url: string) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  ...ARTIST_SCHEMA_BASE,
  "url": url,
});

export const HeadlessSEO: React.FC<HeadlessSEOProps> = ({
  title,
  description,
  url,
  image = `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.jpg`,
  type = 'website',
  isHomepage = false,
  hrefLang = [],
  schema,
  noindex = false,
  article,
}) => {
  // Limitar description a 160 caracteres para SEO
  const truncatedDesc = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;

  // Schema final (usa o personalizado ou o padrão)
  const finalSchema = schema || getDefaultArtistSchema(url);

  return (
    <Helmet>
      {/* Básico */}
      <title>{title}</title>
      <meta name="description" content={truncatedDesc} />
      <link rel="canonical" href={url} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="pt_BR" />
      
      {/* Article specific OG tags */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.tags?.map((tag, i) => <meta key={i} property="article:tag" content={tag} />)}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@djzeneyer" />
      <meta name="twitter:creator" content="@djzeneyer" />
      
      {/* hrefLang para SEO internacional */}
      {hrefLang.map(({ lang, url: hrefUrl }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={hrefUrl} />
      ))}
      
      {/* Identificadores de Autoridade (ajudam IAs e Knowledge Graphs) */}
      <meta name="author" content={ARTIST.identity.stageName} />
      <link rel="author" href={ARTIST.identifiers.wikidataUrl} />
      <link rel="me" href={ARTIST.social.instagram.url} />
      <link rel="me" href={ARTIST.social.soundcloud.url} />
      <link rel="me" href={ARTIST.social.spotify.url} />
      
      {/* Preconnect para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema, null, 0)}
      </script>
    </Helmet>
  );
};

export default HeadlessSEO;