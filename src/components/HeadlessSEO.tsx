import { Helmet } from 'react-helmet-async';

// O Schema.org MusicGroup e Organization (anteriormente na Seção 4 do seo.php)
const SCHEMA_JSON = {
  "@context": "https://schema.org",
  "@graph": [
    // 1. SCHEMA PRINCIPAL: MusicGroup + Person
    {
      "@type": ["MusicGroup", "Person"],
      "@id": "https://djzeneyer.com/#artist",
      "name": "DJ Zen Eyer",
      "alternateName": ["Zen Eyer", "DJ Zen", "Marcelo Eyer Fernandes"],
      "legalName": "Marcelo Eyer Fernandes",
      // ... (Outros campos como birthDate, location, etc. devem ser incluídos aqui)
      
      "identifier": [
          { "@type": "PropertyValue", "propertyID": "ISNI", "value": "0000000528931015" },
          { "@type": "PropertyValue", "propertyID": "MusicBrainz", "value": "13afa63c-8164-4697-9cad-c5100062a154" },
          { "@type": "PropertyValue", "propertyID": "Wikidata", "value": "Q136551855" }
      ],
      
      // 💡 Gêneros (Zouk em primeiro, conforme diretriz)
      "genre": ["Brazilian Zouk", "Zouk", "Kizomba", "RnB", "Reggaeton"],
      "url": "https://djzeneyer.com",
      "sameAs": [
          "https://www.wikidata.org/wiki/Q136551855",
          // ... (Todos os links sameAs removidos do PHP devem ir aqui)
          "https://instagram.com/djzeneyer",
          "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw"
      ]
    },
    // 2. SCHEMA: Organization (Dados Legais - CNPJ)
    {
      "@type": "Organization",
      "@id": "https://djzeneyer.com/#organization",
      "name": "Zen Eyer",
      "taxID": "44063765000146",
      "url": "https://djzeneyer.com"
      // ... (Outros campos de contato)
    }
  ]
};

// Componente para Metadados e Schema da Página Home
interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  isHomepage?: boolean;
}

export const HeadlessSEO: React.FC<SEOProps> = ({ title, description, url, image, isHomepage = false }) => {
  return (
    <Helmet>
      {/* TÍTULO E DESCRIÇÃO DINÂMICOS */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OPEN GRAPH (OG) / TWITTER - Dinâmicos por rota */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={isHomepage ? "website" : "article"} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {image && <meta name="twitter:image" content={image} />}

      {/* SCHEMA.ORG JSON-LD (Apenas na Home) */}
      {isHomepage && (
        <script type="application/ld+json">
          {JSON.stringify(SCHEMA_JSON)}
        </script>
      )}

      {/* Metadados estáticos removidos do PHP, se necessário sobrescrever */}
      <meta name="robots" content="index, follow, max-image-preview:large" />
    </Helmet>
  );
};