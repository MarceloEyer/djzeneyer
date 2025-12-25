// scripts/generate-sitemap.js
// Gera sitemap estático baseado no routeMap.json para evitar Soft 404
// Salva diretamente em /public para ser copiado no build final.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de Caminhos (Relativos à pasta scripts/)
const BASE_URL = 'https://djzeneyer.com';
const ROUTE_MAP_PATH = '../src/data/routeMap.json'; 
const OUTPUT_PATH = '../public/sitemap-static.xml'; 

// Helpers para ler o arquivo JSON (compatível com "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  console.log('🗺️  Iniciando geração do Sitemap Estático...');

  // 1. Ler o RouteMap
  const routeMapPath = path.resolve(__dirname, ROUTE_MAP_PATH);
  const routeMapRaw = fs.readFileSync(routeMapPath, 'utf-8');
  const routeMap = JSON.parse(routeMapRaw);

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  const date = new Date().toISOString();

  // 2. Iterar sobre as rotas
  Object.keys(routeMap).forEach(key => {
    // Ignora rotas dinâmicas (com ":")
    if (key.includes(':')) return;

    const routeData = routeMap[key];
    
    // Rota em Inglês (Padrão)
    if (routeData.en) {
      const urlEn = routeData.en === '/' ? BASE_URL : `${BASE_URL}${routeData.en}`;
      xmlContent += `
  <url>
    <loc>${urlEn}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${urlEn === BASE_URL ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="pt" href="${BASE_URL}${routeData.pt}" />
    <xhtml:link rel="alternate" hreflang="en" href="${urlEn}" />
  </url>`;
    }

    // Rota em Português (apenas se for diferente da EN para evitar duplicação na home se houver)
    if (routeData.pt && routeData.pt !== routeData.en) {
      const urlPt = `${BASE_URL}${routeData.pt}`;
      xmlContent += `
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

  xmlContent += `
</urlset>`;

  // 3. Salvar o arquivo na pasta PUBLIC
  const outputPath = path.resolve(__dirname, OUTPUT_PATH);
  fs.writeFileSync(outputPath, xmlContent);
  console.log(`✅ Sitemap estático gerado com sucesso em: ${outputPath}`);

} catch (error) {
  console.error('❌ Erro fatal ao gerar sitemap:', error);
  process.exit(1);
}