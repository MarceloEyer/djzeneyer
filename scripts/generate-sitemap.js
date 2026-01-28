// scripts/generate-sitemap.js
// v5.0 - UNIFIED: Usa routes.ts como única fonte da verdade

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ============================================================================
// CONFIGURATION
// ============================================================================

const BASE_URL = 'https://djzeneyer.com';
const PUBLIC_DIR = '../public';

const PAGES_SITEMAP = 'sitemap-pages.xml';
const INDEX_SITEMAP = 'sitemap.xml';
const WP_DYNAMIC_SITEMAP = 'sitemap-dynamic.xml';
const EVENTS_SITEMAP = 'sitemap-events.xml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes imported from routes.ts (manually extracted - TypeScript can't be imported directly in Node)
// This list is synced with src/config/routes.ts
const ROUTES_FROM_CONFIG = [
  { en: '', pt: '' },  // Home
  { en: 'about', pt: 'sobre' },
  { en: 'events', pt: 'eventos' },
  { en: 'music', pt: 'musica' },
  { en: 'news', pt: 'noticias' },
  { en: ['zentribe', 'tribe', 'zen-tribe'], pt: ['tribo-zen', 'tribo'] },
  { en: 'work-with-me', pt: 'trabalhe-comigo' },
  { en: 'shop', pt: 'loja' },
  { en: 'faq', pt: 'perguntas-frequentes' },
  { en: 'my-philosophy', pt: 'minha-filosofia' },
  { en: 'media', pt: 'na-midia' },
  { en: 'support-the-artist', pt: 'apoie-o-artista' },
  { en: 'privacy-policy', pt: 'politica-de-privacidade' },
  { en: 'return-policy', pt: 'reembolso' },
  { en: 'terms', pt: 'termos' },
  { en: 'conduct', pt: 'regras-de-conduta' },
];

// Routes to exclude from sitemap (auth, admin, dynamic)
const EXCLUDED_ROUTES = [
  'dashboard', 'painel',
  'my-account', 'minha-conta',
  'cart', 'carrinho',
  'checkout', 'finalizar-compra',
  'tickets-checkout', 'finalizar-ingressos',
  'order-complete', 'pedido-completo',
];

// ============================================================================
// HELPERS
// ============================================================================

const ensureSlash = (str) => {
  if (!str || str === '') return '/';
  return str.endsWith('/') ? str : `${str}/`;
};

const shouldExclude = (path) => {
  return EXCLUDED_ROUTES.some(excluded => path.includes(excluded)) || 
         path.includes(':') ||  // Dynamic routes
         path.includes('*');    // Wildcard routes
};

// ============================================================================
// MAIN
// ============================================================================

try {
  console.log('🗺️  Iniciando geração da Estrutura de Sitemaps v5.0 (UNIFIED)...');

  const date = new Date().toISOString();
  let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  let count = 0;
  const processedUrls = new Set(); // Avoid duplicates

  ROUTES_FROM_CONFIG.forEach(route => {
    // Handle array paths (multiple aliases)
    const enPaths = Array.isArray(route.en) ? route.en : [route.en];
    const ptPaths = Array.isArray(route.pt) ? route.pt : [route.pt];

    // Use first path as canonical
    const enPath = enPaths[0];
    const ptPath = ptPaths[0];

    // Skip excluded routes
    if (shouldExclude(enPath) || shouldExclude(ptPath)) return;

    // Build EN URL
    const urlEn = enPath === '' 
      ? `${BASE_URL}/` 
      : `${BASE_URL}${ensureSlash('/' + enPath)}`;

    // Build PT URL
    const urlPt = ptPath === ''
      ? `${BASE_URL}/pt/`
      : `${BASE_URL}/pt${ensureSlash('/' + ptPath)}`;

    // Skip if already processed
    if (processedUrls.has(urlEn)) return;
    processedUrls.add(urlEn);
    processedUrls.add(urlPt);

    // EN entry with PT alternate
    pagesXml += `
  <url>
    <loc>${urlEn}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${urlEn === `${BASE_URL}/` ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${urlEn}" />
    <xhtml:link rel="alternate" hreflang="pt" href="${urlPt}" />
  </url>`;
    count++;

    // PT entry with EN alternate
    pagesXml += `
  <url>
    <loc>${urlPt}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${urlPt}" />
    <xhtml:link rel="alternate" hreflang="en" href="${urlEn}" />
  </url>`;
    count++;
  });

  pagesXml += `\n</urlset>`;

  // Write pages sitemap
  const pagesPath = path.resolve(__dirname, PUBLIC_DIR, PAGES_SITEMAP);
  fs.writeFileSync(pagesPath, pagesXml);
  console.log(`✅ ${PAGES_SITEMAP} gerado com sucesso (${count} URLs).`);

  // Generate sitemap index
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/${PAGES_SITEMAP}</loc>
    <lastmod>${date}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/${WP_DYNAMIC_SITEMAP}</loc>
    <lastmod>${date}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/${EVENTS_SITEMAP}</loc>
    <lastmod>${date}</lastmod>
  </sitemap>
</sitemapindex>`;

  const indexPath = path.resolve(__dirname, PUBLIC_DIR, INDEX_SITEMAP);
  fs.writeFileSync(indexPath, indexXml);
  console.log(`✅ ${INDEX_SITEMAP} (Index) atualizado.`);
  console.log('');
  console.log('📝 IMPORTANTE: Este script usa uma cópia manual das rotas do routes.ts');
  console.log('   Quando adicionar novas rotas, atualize ROUTES_FROM_CONFIG neste arquivo.');
  console.log('   Fonte da verdade: src/config/routes.ts');

} catch (error) {
  console.error('❌ Erro:', error);
  process.exit(1);
}
