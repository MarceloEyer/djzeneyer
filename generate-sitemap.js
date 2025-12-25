// generate-sitemap.js
// Gera sitemap estático baseado no routeMap.json para evitar Soft 404

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração
const BASE_URL = 'https://djzeneyer.com';
const ROUTE_MAP_PATH = './src/data/routeMap.json'; // Ajuste se seu caminho for diferente
const OUTPUT_PATH = './public/sitemap-static.xml'; // Vai para a pasta public para ser acessível

// Helpers para ler o arquivo JSON (compatível com ES Modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  console.log('🗺️  Iniciando geração do Sitemap Estático...');

  // 1. Ler o RouteMap
  const routeMapRaw = fs.readFileSync(path.resolve(__dirname, ROUTE_MAP_PATH), 'utf-8');
  const routeMap = JSON.parse(routeMapRaw);

  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  const date = new Date().toISOString();

  // 2. Iterar sobre as rotas
  // Ignora rotas dinâmicas com ":" (ex: /shop/product/:id) pois o WordPress cuidará delas
  Object.keys(routeMap).forEach(key => {
    // Pula rotas dinâmicas
    if (key.includes(':')) return;

    const routeData = routeMap[key];
    
    // Adiciona entrada para Inglês (Padrão)
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

    // Adiciona entrada para Português
    if (routeData.pt) {
      const urlPt = `${BASE_URL}${routeData.pt}`;
      // Evita duplicar se a rota pt for igual a en (ex: home /pt apontando pra raiz, se houver lógica assim)
      if (routeData.pt !== routeData.en) {
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
    }
  });

  xmlContent += `
</urlset>`;

  // 3. Salvar o arquivo
  fs.writeFileSync(path.resolve(__dirname, OUTPUT_PATH), xmlContent);
  console.log(`✅ Sitemap estático gerado com sucesso em: ${OUTPUT_PATH}`);

} catch (error) {
  console.error('❌ Erro ao gerar sitemap:', error);
  process.exit(1);
}