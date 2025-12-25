// scripts/generate-sitemap.js
// v3.0 - SITEMAP INDEX MASTER (FINAL)
// Gera: 
// 1. sitemap-pages.xml (Rotas estáticas do React)
// 2. sitemap.xml (Índice que aponta para Pages + WP Dynamic)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração
const BASE_URL = 'https://djzeneyer.com';
const ROUTE_MAP_PATH = '../src/data/routeMap.json'; 
const PUBLIC_DIR = '../public';

// Nomes dos Arquivos (Devem bater com o deploy.yml e plugin WP)
const PAGES_SITEMAP = 'sitemap-pages.xml';
const INDEX_SITEMAP = 'sitemap.xml';
const WP_DYNAMIC_SITEMAP = 'sitemap-dynamic.xml'; // Gerado pelo WordPress

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  console.log('🗺️  Iniciando geração da Estrutura de Sitemaps...');

  // --- 1. GERAR SITEMAP DE PÁGINAS (ESTÁTICO) ---
  const routeMapPath = path.resolve(__dirname, ROUTE_MAP_PATH);
  
  if (!fs.existsSync(routeMapPath)) {
    throw new Error(`RouteMap não encontrado em: ${routeMapPath}`);
  }

  const routeMapRaw = fs.readFileSync(routeMapPath, 'utf-8');
  const routeMap = JSON.parse(routeMapRaw);
  const date = new Date().toISOString();

  let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  Object.keys(routeMap).forEach(key => {
    if (key.includes(':')) return; // Pula rotas dinâmicas

    const routeData = routeMap[key];
    
    // Rota EN (Padrão)
    if (routeData.en) {
      const urlEn = routeData.en === '/' ? BASE_URL : `${BASE_URL}${routeData.en}`;
      pagesXml += `
  <url>
    <loc>${urlEn}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${urlEn === BASE_URL ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${BASE_URL}${routeData.pt}" />
    <xhtml:link rel="alternate" hreflang="en" href="${urlEn}" />
  </url>`;
    }

    // Rota PT (se diferente)
    if (routeData.pt && routeData.pt !== routeData.en) {
      const urlPt = `${BASE_URL}${routeData.pt}`;
      pagesXml += `
  <url>
    <loc>${urlPt}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${routeData.en === '/' ? BASE_URL : BASE_URL + routeData.en}" />
    <xhtml:link rel="alternate" hreflang="pt" href="${urlPt}" />
  </url>`;
    }
  });

  pagesXml += `\n</urlset>`;
  
  const pagesPath = path.resolve(__dirname, PUBLIC_DIR, PAGES_SITEMAP);
  fs.writeFileSync(pagesPath, pagesXml);
  console.log(`✅ ${PAGES_SITEMAP} gerado com sucesso.`);


  // --- 2. GERAR SITEMAP INDEX (O MESTRE) ---
  // Aponta para o sitemap de páginas (acima) e para o dinâmico (do WordPress)
  
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
</sitemapindex>`;

  const indexPath = path.resolve(__dirname, PUBLIC_DIR, INDEX_SITEMAP);
  fs.writeFileSync(indexPath, indexXml);
  console.log(`✅ ${INDEX_SITEMAP} (Index) gerado com sucesso.`);

} catch (error) {
  console.error('❌ Erro fatal ao gerar sitemaps:', error);
  process.exit(1);
}