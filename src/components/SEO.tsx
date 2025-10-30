// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'event' | 'music';
  schema?: Record<string, unknown>;
  aiTags?: string[];
  aiSummary?: string;
  aiEvent?: string;
  aiMusic?: string;
}

const SEO = ({
  title,
  description,
  image = 'https://djzeneyer.com/dist/og-image.jpg',
  type = 'website',
  schema = {},
  aiTags = [],
  aiSummary = '',
  aiEvent,
  aiMusic,
}: SEOProps) => {
  const { pathname } = useLocation();
  const canonicalUrl = `https://djzeneyer.com${pathname}`;

  // Schema.org dinâmico (complementa o schema base do header.php)
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description: description,
    url: canonicalUrl,
    image: image,
    ...schema,
  };

  return (
    <Helmet>
      {/* DYNAMIC: Title (always updates) */}
      <title>{title}</title>

      {/* DYNAMIC: Meta tags básicas */}
      <meta name="description" content={description} />
      {aiTags.length > 0 && <meta name="keywords" content={aiTags.join(', ')} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* DYNAMIC: Open Graph (override do header.php) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* DYNAMIC: Twitter Cards (override do header.php) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* AI METADATA: Dinâmico (sem dupes com header.php) */}
      {aiSummary && <meta name="ai:summary" content={aiSummary} />}
      {aiTags.length > 0 && <meta name="ai:tags" content={aiTags.join(', ')} />}
      {aiEvent && <meta name="ai:event" content={aiEvent} />}
      {aiMusic && <meta name="ai:music" content={aiMusic} />}

      {/* SCHEMA: Dinâmico (complementa o base) */}
      <script type="application/ld+json">
        {JSON.stringify(defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
