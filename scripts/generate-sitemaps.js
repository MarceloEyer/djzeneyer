// scripts/generate-sitemaps.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://djzeneyer.com';
const LANGUAGES = ['pt', 'en'];

async function fetchFromWP(endpoint, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'DJ-Zen-Eyer-Sitemap-Generator/1.0'
        }
      });
      
      clearTimeout(timeout);
      
      if (res.ok) {
        return await res.json();
      }
      
      if (res.status === 404) {
        console.warn(`⚠️  ${endpoint} → 404 (endpoint não existe)`);
        return [];
      }
      
      console.warn(`⚠️  ${endpoint} → ${res.status}, retry ${i + 1}/${retries}`);
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint}:`, error.message);
      if (i === retries - 1) {
        console.error(`   → Pulando este endpoint`);
        return [];
      }
    }
  }
  return [];
}

async function generateSitemapForLang(lang) {
  const langPrefix = lang === 'pt' ? '' : `/${lang}`;
  const baseUrl = `${BASE_URL}${langPrefix}`;
  
  console.log(`🔄 Gerando sitemap para ${lang.toUpperCase()}...`);
  
  try {
    const [posts, pages, products, events] = await Promise.all([
      fetchFromWP(`/wp-json/wp/v2/posts?per_page=100&_fields=slug,modified,status`),
      fetchFromWP(`/wp-json/wp/v2/pages?per_page=100&_fields=slug,modified,status`),
      fetchFromWP(`/wp-json/wc/store/products?per_page=100`),
      fetchFromWP(`/wp-json/wp/v2/insigna?per_page=100&_fields=id,slug,modified,status`),
    ]);
    
    const staticRoutes = [
      { url: '', priority: 1.0, changefreq: 'daily' },
      { url: '/about', priority: 0.8, changefreq: 'monthly' },
      { url: '/music', priority: 0.8, changefreq: 'weekly' },
      { url: '/events', priority: 0.9, changefreq: 'weekly' },
      { url: '/shop', priority: 0.9, changefreq: 'daily' },
      { url: '/faq', priority: 0.6, changefreq: 'monthly' },
      { url: '/press-kit', priority: 0.7, changefreq: 'monthly' },
      { url: '/zen-tribe', priority: 0.8, changefreq: 'weekly' },
    ];
    
    const staticUrls = staticRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');
    
    const postUrls = (posts || [])
      .filter(post => post.status === 'publish') // ← NOVO: Filtra apenas publicados
      .map(post => `
  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${new Date(post.modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');
    
    const pageUrls = (pages || [])
      .filter(page => page.status === 'publish')
      .map(page => `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${new Date(page.modified).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');
    
    const productUrls = (products || []).map(product => {
      const permalink = product.permalink || `${baseUrl}/product/${product.slug}`;
      return `
  <url>
    <loc>${permalink}</loc>
    <lastmod>${new Date(product.date_modified || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('');
    
    const eventUrls = (events || [])
      .filter(event => event.status === 'publish')
      .map(event => `
  <url>
    <loc>${baseUrl}/events/${event.slug}</loc>
    <lastmod>${new Date(event.modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">${staticUrls}${postUrls}${pageUrls}${productUrls}${eventUrls}
</urlset>`;
    
    const filename = lang === 'pt' ? 'sitemap.xml' : `sitemap_${lang}.xml`;
    const publicDir = path.join(__dirname, '../public');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicDir, filename), xml);
    console.log(`✅ ${filename} gerado (${posts.length} posts, ${pages.length} páginas, ${products.length} produtos, ${events.length} eventos)`);
  } catch (error) {
    console.error(`❌ Erro gerando sitemap para ${lang}:`, error);
  }
}

async function generateSitemapIndex() {
  const sitemaps = LANGUAGES.map(lang => {
    const filename = lang === 'pt' ? 'sitemap.xml' : `sitemap_${lang}.xml`;
    return `
  <sitemap>
    <loc>${BASE_URL}/${filename}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`;
  }).join('');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}
</sitemapindex>`;
  
  const publicDir = path.join(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'sitemap_index.xml'), xml);
  console.log('✅ sitemap_index.xml gerado');
}

async function main() {
  console.log('🚀 Iniciando geração de sitemaps multilíngue...\n');
  
  const startTime = Date.now();
  
  try {
    await generateSitemapIndex();
    
    await Promise.all(
      LANGUAGES.map(lang => generateSitemapForLang(lang))
    );
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n🎉 Todos os sitemaps gerados com sucesso em ${duration}s!`);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

main();
