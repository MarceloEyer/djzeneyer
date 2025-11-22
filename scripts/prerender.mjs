#!/usr/bin/env node
// scripts/prerender.mjs
// Static Site Generation (SSG) script for DJ Zen Eyer
// Generates static HTML files for all routes in EN and PT

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

// All routes to pre-render (without language prefix)
const routes = [
  '/',
  '/about',
  '/events',
  '/music',
  '/zentribe',
  '/work-with-me',
  '/shop',
  '/faq',
];

// SEO metadata for each route
const routeMetadata = {
  '/': {
    en: {
      title: 'DJ Zen Eyer | 2× World Champion Brazilian Zouk DJ & Producer',
      description: 'DJ Zen Eyer, two-time world champion (Best Remix & Best DJ Performance). Creator of "A pressa é inimiga da cremosidade". Book for international events.',
      keywords: 'DJ Zen Eyer, Brazilian Zouk, World Champion DJ, Zouk Music, DJ Sets, Brazilian DJ',
    },
    pt: {
      title: 'DJ Zen Eyer | Bicampeão Mundial de Zouk Brasileiro',
      description: 'DJ Zen Eyer, bicampeão mundial nas categorias Melhor Remix e Melhor Performance. Criador do conceito "A pressa é inimiga da cremosidade". Disponível para eventos internacionais.',
      keywords: 'DJ Zen Eyer, Zouk Brasileiro, DJ Campeão Mundial, Música Zouk, Sets de DJ, DJ Brasileiro',
    },
  },
  '/about': {
    en: {
      title: 'About Zen Eyer | The Story Behind the Music',
      description: 'Discover Zen Eyer\'s personal journey: from Niterói to the world, the philosophy behind "creamy" sets and the passion that drives his music.',
      keywords: 'Zen Eyer biography, DJ story, Brazilian Zouk artist, Mensa member',
    },
    pt: {
      title: 'Sobre Zen Eyer | A História Por Trás da Música',
      description: 'Conheça a jornada pessoal de Zen Eyer: de Niterói para o mundo, a filosofia por trás dos sets "cremosos" e a paixão que move sua música.',
      keywords: 'biografia Zen Eyer, história DJ, artista Zouk Brasileiro, membro Mensa',
    },
  },
  '/events': {
    en: {
      title: 'Events & Booking | DJ Zen Eyer - Brazilian Zouk',
      description: 'Book DJ Zen Eyer for your congress, festival or private event. View upcoming performances and past events worldwide.',
      keywords: 'DJ booking, Zouk events, Brazilian Zouk congress, hire DJ, event bookings',
    },
    pt: {
      title: 'Eventos & Contratação | DJ Zen Eyer - Zouk Brasileiro',
      description: 'Contrate DJ Zen Eyer para seu congresso, festival ou evento privado. Veja apresentações futuras e eventos passados pelo mundo.',
      keywords: 'contratar DJ, eventos Zouk, congresso Zouk Brasileiro, booking DJ, eventos musicais',
    },
  },
  '/music': {
    en: {
      title: 'Download Music & Sets | DJ Zen Eyer - Brazilian Zouk',
      description: 'Download extended tracks, thematic sets and exclusive remixes by DJ Zen Eyer. Professional quality for DJs and guaranteed flow for dancers.',
      keywords: 'Zouk music download, DJ sets, Brazilian Zouk tracks, remixes, extended mixes',
    },
    pt: {
      title: 'Download Músicas e Sets | DJ Zen Eyer - Zouk Brasileiro',
      description: 'Baixe faixas estendidas, sets temáticos e remixes exclusivos de DJ Zen Eyer. Qualidade profissional para DJs e fluidez garantida para dançarinos.',
      keywords: 'download música Zouk, sets de DJ, músicas Zouk Brasileiro, remixes, mixagens estendidas',
    },
  },
  '/zentribe': {
    en: {
      title: 'Join Zen Tribe | Community & Rewards',
      description: 'Join the Zen Tribe community. Get exclusive content, early access to sets, and connect with Brazilian Zouk enthusiasts worldwide.',
      keywords: 'Zen Tribe, Zouk community, DJ fan club, exclusive content, rewards program',
    },
    pt: {
      title: 'Tribo Zen | Comunidade & Recompensas',
      description: 'Junte-se à comunidade Tribo Zen. Acesso exclusivo a conteúdo, sets em primeira mão e conexão com entusiastas de Zouk Brasileiro do mundo todo.',
      keywords: 'Tribo Zen, comunidade Zouk, clube de fãs DJ, conteúdo exclusivo, programa de recompensas',
    },
  },
  '/work-with-me': {
    en: {
      title: 'Press Kit & Booking | DJ Zen Eyer - 2× World Champion',
      description: 'Professional press kit, high-resolution photos, and booking information for DJ Zen Eyer. Available for congresses, festivals, and workshops worldwide.',
      keywords: 'DJ press kit, booking information, professional photos, media kit, event hiring',
    },
    pt: {
      title: 'Press Kit & Contratação | DJ Zen Eyer - Bicampeão Mundial',
      description: 'Press kit profissional, fotos em alta resolução e informações para contratação de DJ Zen Eyer. Disponível para congressos, festivais e workshops internacionais.',
      keywords: 'press kit DJ, informações contratação, fotos profissionais, kit de mídia, contratar eventos',
    },
  },
  '/shop': {
    en: {
      title: 'Shop | DJ Zen Eyer Official Merchandise',
      description: 'Official DJ Zen Eyer merchandise, music packs, and exclusive products. Support the artist and show your Zen Tribe pride.',
      keywords: 'DJ merchandise, Zouk products, official shop, music packs, artist support',
    },
    pt: {
      title: 'Loja | Produtos Oficiais DJ Zen Eyer',
      description: 'Produtos oficiais DJ Zen Eyer, pacotes de música e itens exclusivos. Apoie o artista e mostre seu orgulho da Tribo Zen.',
      keywords: 'produtos DJ, itens Zouk, loja oficial, pacotes música, apoiar artista',
    },
  },
  '/faq': {
    en: {
      title: 'FAQ | Frequently Asked Questions - DJ Zen Eyer',
      description: 'Common questions about DJ Zen Eyer, Brazilian Zouk music, booking process, and event information.',
      keywords: 'FAQ, frequently asked questions, DJ questions, booking FAQ, event information',
    },
    pt: {
      title: 'FAQ | Perguntas Frequentes - DJ Zen Eyer',
      description: 'Perguntas comuns sobre DJ Zen Eyer, música Zouk Brasileira, processo de contratação e informações sobre eventos.',
      keywords: 'FAQ, perguntas frequentes, dúvidas DJ, FAQ contratação, informações eventos',
    },
  },
};

// Generate HTML template with proper meta tags
function generateHTML(route, lang = 'en') {
  const metadata = routeMetadata[route]?.[lang] || routeMetadata['/'][lang];
  const baseUrl = 'https://djzeneyer.com';
  const canonicalPath = lang === 'pt' ? `/pt${route === '/' ? '' : route}` : route;
  const alternatePath = lang === 'pt' ? route : `/pt${route === '/' ? '' : route}`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary Meta Tags -->
  <title>${metadata.title}</title>
  <meta name="title" content="${metadata.title}" />
  <meta name="description" content="${metadata.description}" />
  <meta name="keywords" content="${metadata.keywords}" />
  <meta name="author" content="DJ Zen Eyer" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

  <!-- Canonical & Alternate -->
  <link rel="canonical" href="${baseUrl}${canonicalPath}" />
  <link rel="alternate" hreflang="${lang}" href="${baseUrl}${canonicalPath}" />
  <link rel="alternate" hreflang="${lang === 'en' ? 'pt' : 'en'}" href="${baseUrl}${alternatePath}" />
  <link rel="alternate" hreflang="x-default" href="${baseUrl}${route}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${baseUrl}${canonicalPath}" />
  <meta property="og:title" content="${metadata.title}" />
  <meta property="og:description" content="${metadata.description}" />
  <meta property="og:image" content="${baseUrl}/images/zen-eyer-og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="${lang === 'pt' ? 'pt_BR' : 'en_US'}" />
  <meta property="og:site_name" content="DJ Zen Eyer" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${baseUrl}${canonicalPath}" />
  <meta name="twitter:title" content="${metadata.title}" />
  <meta name="twitter:description" content="${metadata.description}" />
  <meta name="twitter:image" content="${baseUrl}/images/zen-eyer-og-image.jpg" />
  <meta name="twitter:creator" content="@djzeneyer" />

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

  <!-- Web App Manifest -->
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#FF6B6B" />

  <!-- Preconnect to improve performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- JSON-LD Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DJ Zen Eyer",
    "url": "${baseUrl}",
    "description": "${metadata.description}",
    "inLanguage": "${lang === 'pt' ? 'pt-BR' : 'en'}",
    "publisher": {
      "@type": "Person",
      "@id": "${baseUrl}/#artist",
      "name": "Zen Eyer",
      "alternateName": ["DJ Zen Eyer", "Marcelo Eyer Fernandes"],
      "jobTitle": "DJ e Produtor Musical de Zouk Brasileiro",
      "url": "${baseUrl}",
      "sameAs": [
        "https://instagram.com/djzeneyer",
        "https://soundcloud.com/djzeneyer",
        "https://youtube.com/@djzeneyer",
        "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
        "https://www.wikidata.org/wiki/Q136551855",
        "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154"
      ]
    }
  }
  </script>

  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</head>
<body>
  <div id="root"></div>
  <noscript>
    <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
      <h1>DJ Zen Eyer - Brazilian Zouk</h1>
      <p>Please enable JavaScript to view this website.</p>
      <p>${metadata.description}</p>
    </div>
  </noscript>
</body>
</html>`;
}

// Create directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Main prerender function
async function prerender() {
  console.log('🚀 Starting static site generation...\n');

  // Read base index.html from dist
  const baseIndexPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(baseIndexPath)) {
    console.error('❌ Error: dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  let processedRoutes = 0;

  // Generate HTML for each route in both languages
  for (const route of routes) {
    // English version
    const enPath = route === '/' ? '' : route;
    const enDir = path.join(distDir, enPath);
    ensureDir(enDir);

    const enHtml = generateHTML(route, 'en');
    const enFile = path.join(enDir, 'index.html');
    fs.writeFileSync(enFile, enHtml, 'utf-8');
    console.log(`✅ Generated: ${enFile}`);
    processedRoutes++;

    // Portuguese version
    const ptPath = `/pt${route === '/' ? '' : route}`;
    const ptDir = path.join(distDir, 'pt', route === '/' ? '' : route.substring(1));
    ensureDir(ptDir);

    const ptHtml = generateHTML(route, 'pt');
    const ptFile = path.join(ptDir, 'index.html');
    fs.writeFileSync(ptFile, ptHtml, 'utf-8');
    console.log(`✅ Generated: ${ptFile}`);
    processedRoutes++;
  }

  console.log(`\n✨ Successfully generated ${processedRoutes} static HTML files!`);
  console.log(`📦 Output directory: ${distDir}`);
  console.log('\n🎯 Next steps:');
  console.log('   1. Test locally: npm run preview');
  console.log('   2. Validate SEO: View source (Ctrl+U) in browser');
  console.log('   3. Deploy to production\n');
}

// Run prerender
prerender().catch((error) => {
  console.error('❌ Prerender failed:', error);
  process.exit(1);
});
