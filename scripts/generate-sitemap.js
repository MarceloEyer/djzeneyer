// scripts/generate-sitemap.js
// v4.0 - SITEMAP COM ROTAS NOVAS (Mídia, Jurídico) + TRAILING SLASH

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração
const BASE_URL = 'https://djzeneyer.com';
const ROUTE_MAP_PATH = '../src/data/routeMap.json'; 
const PUBLIC_DIR = '../public'; // Agora salva na public para o build copiar

// Nomes dos Arquivos
const PAGES_SITEMAP = 'sitemap-pages.xml';
const INDEX_SITEMAP = 'sitemap.xml';
const WP_DYNAMIC_SITEMAP = 'sitemap-dynamic.xml'; // Gerado pelo WordPress (Posts/Produtos)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🆕 ROTAS MANUAIS (Garante que as páginas novas entrem mesmo sem routeMap)
const MANUAL_ROUTES = [
  { key: 'media', en: '/media/', pt: '/midia/' },
  { key: 'privacy', en: '/privacy-policy/', pt: '/politica-de-privacidade/' },
  { key: 'terms', en: '/terms/', pt: '/termos/' },
  { key: 'conduct', en: '/conduct/', pt: '/conduta/' },
  { key: 'faq', en: '/faq/', pt: '/faq/' }
];

// 🚫 LISTA NEGRA
const EXCLUDED_ROUTES = [
  '/dashboard', '/my-account', '/minha-conta', '/painel', 
  '/login', '/register', '/reset-password', '/cart', 
  '/checkout', '/404', '/thank-you'
];

// Helper: Garante barra no final
const ensureSlash = (str) => str.endsWith('/') ? str : `${str}/`;

try {
  console.log('🗺️  Iniciando geração da Estrutura de Sitemaps v4.0...');

  // --- 1. CARREGAR ROUTEMAP EXISTENTE ---
  const routeMapPath = path.resolve(__dirname, ROUTE_MAP_PATH);
  let routeMap = {};
  
  if (fs.existsSync(routeMapPath)) {
    const routeMapRaw = fs.readFileSync(routeMapPath, 'utf-8');
    routeMap = JSON.parse(routeMapRaw);
  } else {
    console.warn('⚠️  RouteMap não encontrado. Usando apenas rotas manuais.');
  }

  // --- 2. MERGE: Juntar RouteMap com Rotas Manuais ---
  // Se a rota manual não existir no routeMap, adiciona.
  MANUAL_ROUTES.forEach(route => {
    if (!routeMap[route.key]) {
      routeMap[route.key] = { en: route.en, pt: route.pt };
    }
  });

  // --- 3. GERAR XML ---
  const date = new Date().toISOString();
  let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  let count = 0;

  Object.keys(routeMap).forEach(key => {
    if (key.includes(':')) return; // Pula rotas dinâmicas (:id)

    const routeData = routeMap[key];
    
    // Filtro de Segurança
    const isExcluded = EXCLUDED_ROUTES.some(badRoute => 
      routeData.en.includes(badRoute) || (routeData.pt && routeData.pt.includes(badRoute))
    );
    if (isExcluded) return;

    // Padronização de URL (Com Trailing Slash)
    const pathEn = ensureSlash(routeData.en === '/' ? '' : routeData.en);
    const urlEn = routeData.en === '/' ? BASE_URL + '/' : `${BASE_URL}${pathEn}`;
    
    // Rota Principal (EN)
    if (routeData.en) {
      // Se tiver PT
      let xhtmlLinks = '';
      if (routeData.pt) {
        const pathPt = ensureSlash(routeData.pt);
        const urlPt = `${BASE_URL}/pt${pathPt}`; // Assume prefixo /pt para rotas traduzidas
        
        // Correção: Se routeData.pt já vier com /pt no inicio, não duplica
        // Mas o padrão do routeMap geralmente é só o slug. Vamos assumir slug.
        // AJUSTE FINO: Se o routeData.pt começar com /, remove para concatenar limpo
        // ou verifica se seu routeMap já tem o prefixo completo.
        // VAMOS SIMPLIFICAR: Confie no dado do routeMap, mas garanta a barra final.
        
        const finalUrlPt = routeData.pt.startsWith('/pt') 
            ? `${BASE_URL}${ensureSlash(routeData.pt)}` 
            : `${BASE_URL}/pt${ensureSlash(routeData.pt)}`;

        xhtmlLinks = `
    <xhtml:link rel="alternate" hreflang="pt" href="${finalUrlPt}" />
    <xhtml:link rel="alternate" hreflang="en" href="${urlEn}" />`;
      }

      pagesXml += `
  <url>
    <loc>${urlEn}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${urlEn === BASE_URL + '/' ? '1.0' : '0.8'}</priority>${xhtmlLinks}
  </url>`;
      count++;
      
      // Se quiser gerar entrada separada para PT (Opcional, mas hreflang já cobre)
      // O Google recomenda que cada URL tenha sua entrada. Vamos adicionar a URL PT explicitamente?
      // Sim, melhor para indexação.
      if (routeData.pt) {
         const finalUrlPt = routeData.pt.startsWith('/pt') 
            ? `${BASE_URL}${ensureSlash(routeData.pt)}` 
            : `${BASE_URL}/pt${ensureSlash(routeData.pt)}`;

         pagesXml += `
  <url>
    <loc>${finalUrlPt}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${urlEn}" />
    <xhtml:link rel="alternate" hreflang="pt" href="${finalUrlPt}" />
  </url>`;
         count++;
      }
    }
  });

  pagesXml += `\n</urlset>`;
  
  const pagesPath = path.resolve(__dirname, PUBLIC_DIR, PAGES_SITEMAP);
  fs.writeFileSync(pagesPath, pagesXml);
  console.log(`✅ ${PAGES_SITEMAP} gerado com sucesso (${count} URLs).`);

  // --- 4. GERAR SITEMAP INDEX ---
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
  console.log(`✅ ${INDEX_SITEMAP} (Index) atualizado.`);

} catch (error) {
  console.error('❌ Erro:', error);
  process.exit(1);
}