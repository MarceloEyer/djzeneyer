/**
 * DJ Zen Eyer - Sitemap Generator (Build-based)
 * Gera sitemaps baseado em rotas estáticas + rotas do build
 * Roda no GitHub Actions (sem dependência de WordPress)
 *
 * Usage: node scripts/generate-sitemaps.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// ⚙️ CONFIGURATION
// ============================================

const BASE_URL = 'https://djzeneyer.com';
const LANGUAGES = ['pt', 'en'];
const PUBLIC_DIR = path.join(__dirname, '../public');

// ============================================
// 📄 STATIC ROUTES (Definidas no projeto)
// ============================================

const STATIC_ROUTES = {
  pt: [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/sobre', priority: 0.8, changefreq: 'monthly' },
    { url: '/musica', priority: 0.8, changefreq: 'monthly' },
    { url: '/eventos', priority: 0.9, changefreq: 'weekly' },
    { url: '/loja', priority: 0.9, changefreq: 'daily' },
    { url: '/faq', priority: 0.6, changefreq: 'monthly' },
    { url: '/kit-imprensa', priority: 0.7, changefreq: 'monthly' },
    { url: '/zen-tribe', priority: 0.8, changefreq: 'weekly' },
  ],
  en: [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/music', priority: 0.8, changefreq: 'monthly' },
    { url: '/events', priority: 0.9, changefreq: 'weekly' },
    { url: '/shop', priority: 0.9, changefreq: 'daily' },
    { url: '/faq', priority: 0.6, changefreq: 'monthly' },
    { url: '/press-kit', priority: 0.7, changefreq: 'monthly' },
    { url: '/zen-tribe', priority: 0.8, changefreq: 'weekly' },
  ],
};

// ============================================
// 🔧 UTILITY FUNCTIONS
// ============================================

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function getISOTimestamp() {
  const now = new Date();
  if (isNaN(now.getTime())) {
    console.warn('⚠️  Invalid date, using fallback');
    return new Date().toISOString().split('T')[0];
  }
  return now.toISOString().split('T')[0];
}

function formatUrlEntry(loc, priority, changefreq, hreflang = []) {
  let entry = `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${getISOTimestamp()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`;

  if (hreflang.length > 0) {
    hreflang.forEach(lang => {
      entry += `
    <xhtml:link rel="alternate" hreflang="${lang.code}" href="${escapeXml(lang.url)}" />`;
    });
  }

  entry += `
  </url>`;
  return entry;
}

// ============================================
// 🗺️ DISCOVER ROUTES FROM VITE BUILD
// ============================================

function discoverRoutesFromBuild() {
  console.log('🔍 Descobrindo rotas do build Vite...\n');

  const buildDir = path.join(__dirname, '../dist');
  const discoveredRoutes = {
    pt: new Set(),
    en: new Set(),
  };

  try {
    // Procura por arquivos HTML/JSON que representam rotas
    const files = fs.readdirSync(buildDir, { recursive: true });

    files.forEach(file => {
      const filePath = path.join(buildDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile()) {
        // Identifica arquivos de rota
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);

        // ✅ Rotas detectadas:
        // index.html (página raiz)
        // [slug].html (páginas dinâmicas)
        // products/[id].html (produtos)
        // events/[slug].html (eventos)
        // etc.

        if (baseName === 'index' && ext === '.html') {
          // Raiz ou subpasta
          const dir = path.dirname(file);
          const routePath = dir === '.' ? '' : `/${dir.replace(/\\/g, '/')}`;
          
          // Tenta identificar o idioma pela pasta
          if (routePath.startsWith('/en')) {
            discoveredRoutes.en.add(routePath.replace(/^\/en/, '') || '/');
          } else {
            discoveredRoutes.pt.add(routePath);
          }

          console.log(`✅ Rota descoberta: ${routePath || '/'} (${file})`);
        }

        // Procura por rotas em subpastas dinâmicas
        if (file.includes('products/') || file.includes('events/') || 
            file.includes('category/') || file.includes('tag/')) {
          const lang = file.includes('/en') ? 'en' : 'pt';
          const route = `/${file.replace(/\\/g, '/').replace(/\.html$/, '')}`;
          discoveredRoutes[lang].add(route);
          console.log(`✅ Rota dinâmica: ${route}`);
        }
      }
    });

  } catch (error) {
    console.warn(`⚠️  Erro ao descobrir rotas:`, error.message);
  }

  return discoveredRoutes;
}

// ============================================
// 🗺️ GENERATE SITEMAP
// ============================================

function generateSitemap(lang) {
  console.log(`\n🔄 Gerando sitemap para ${lang.toUpperCase()}...`);

  const langPrefix = lang === 'pt' ? '' : `/${lang}`;
  const baseUrl = `${BASE_URL}${langPrefix}`;

  try {
    const urlEntries = [];
    const timestamp = getISOTimestamp();

    // 1️⃣ Adiciona rotas estáticas
    console.log(`\n📌 Adicionando ${STATIC_ROUTES[lang].length} rotas estáticas...`);
    
    STATIC_ROUTES[lang].forEach(route => {
      const loc = `${baseUrl}${route.url}`;
      const hreflang = LANGUAGES.map(l => ({
        code: l,
        url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}${route.url.replace(/^\//, '')}`
      }));

      urlEntries.push(
        formatUrlEntry(loc, route.priority, route.changefreq, hreflang)
      );
    });

    // 2️⃣ Adiciona rotas descobertas do build
    console.log(`\n🏗️ Adicionando rotas do build Vite...`);
    
    const discoveredRoutes = discoverRoutesFromBuild();
    const routes = discoveredRoutes[lang];

    routes.forEach(route => {
      // Evita duplicatas de rotas estáticas
      const staticUrls = STATIC_ROUTES[lang].map(r => r.url);
      if (!staticUrls.includes(route)) {
        const loc = `${baseUrl}${route}`;
        
        // Detecta tipo de rota para prioridade
        let priority = 0.6;
        if (route.includes('/product') || route.includes('/event')) {
          priority = 0.8;
        } else if (route.includes('/category') || route.includes('/tag')) {
          priority = 0.5;
        }

        urlEntries.push(
          formatUrlEntry(loc, priority, 'weekly', [])
        );
      }
    });

    // 3️⃣ Gera XML do sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;

    const filename = lang === 'pt' ? 'sitemap.xml' : `sitemap-${lang}.xml`;
    const filePath = path.join(PUBLIC_DIR, filename);

    fs.writeFileSync(filePath, xml);
    console.log(`✅ ${filename} gerado com ${urlEntries.length} URLs`);

    return {
      filename,
      url: `${BASE_URL}/${lang === 'pt' ? '' : `${lang}/`}${filename}`,
      count: urlEntries.length,
    };

  } catch (error) {
    console.error(`❌ Erro gerando sitemap para ${lang}:`, error.message);
    throw error;
  }
}

// ============================================
// 🗺️ GENERATE SITEMAP INDEX
// ============================================

function generateSitemapIndex(sitemaps) {
  console.log(`\n📑 Gerando sitemap_index.xml...`);

  const sitemapEntries = sitemaps
    .map(sitemap => `  <sitemap>
    <loc>${escapeXml(sitemap.url)}</loc>
    <lastmod>${getISOTimestamp()}</lastmod>
  </sitemap>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

  const filePath = path.join(PUBLIC_DIR, 'sitemap_index.xml');
  fs.writeFileSync(filePath, xml);
  console.log('✅ sitemap_index.xml gerado');
}

// ============================================
// 🤖 GENERATE ROBOTS.TXT
// ============================================

function generateRobotsTxt() {
  console.log(`\n🤖 Gerando robots.txt...`);

  const robotsTxt = `# DJ Zen Eyer - robots.txt
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap_index.xml
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-en.xml

Crawl-delay: 1

# Disallow private areas
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /wp-includes/
Disallow: /?s=
Disallow: /search/

# Allow media
Allow: /wp-content/uploads/
`;

  const filePath = path.join(PUBLIC_DIR, 'robots.txt');
  fs.writeFileSync(filePath, robotsTxt);
  console.log('✅ robots.txt gerado');
}

// ============================================
// 🚀 MAIN
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🚀 Sitemap Generator (Build-based)   ║');
  console.log('╚════════════════════════════════════════╝\n');

  const startTime = Date.now();

  try {
    // Cria diretório se não existir
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      console.log(`✅ Diretório criado: ${PUBLIC_DIR}\n`);
    }

    // Gera sitemaps para cada idioma
    const sitemaps = [];
    for (const lang of LANGUAGES) {
      const result = generateSitemap(lang);
      sitemaps.push(result);
    }

    // Gera index e robots.txt
    generateSitemapIndex(sitemaps);
    generateRobotsTxt();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Resumo final
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║ ✅ SITEMAPS GERADOS COM SUCESSO!      ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`📊 RESUMO:`);
    console.log(`   ⏱️  Tempo: ${duration}s`);
    console.log(`   📄 Total URLs: ${sitemaps.reduce((a, b) => a + b.count, 0)}`);
    console.log(`\n📁 Arquivos gerados:`);
    sitemaps.forEach(s => {
      console.log(`   ✅ ${s.filename} (${s.count} URLs)`);
    });
    console.log(`   ✅ sitemap_index.xml`);
    console.log(`   ✅ robots.txt`);
    console.log(`\n🔗 Acesse: ${BASE_URL}/sitemap_index.xml\n`);

  } catch (error) {
    console.error('\n❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

main();
