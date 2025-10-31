/**
 * DJ Zen Eyer - Sitemap Generator MASTER
 * Generates multilingual sitemaps for SEO with advanced features
 *
 * Usage: node scripts/generate-sitemaps.js
 * Schedule: Daily via cron or deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// ⚙️ CONFIGURATION
// ============================================

const BASE_URL = 'https://djzeneyer.com';
const LANGUAGES = ['pt', 'en'];
const MAX_URLS_PER_SITEMAP = 50000;
const TIMEOUT = 10000;
const RETRIES = 3;
const CACHE_TTL = 3600000; // 1 hour

// ============================================
// 🗺️ SITEMAP TYPES
// ============================================

const WP_ENDPOINTS = {
  posts: '/wp-json/wp/v2/posts?per_page=100&_fields=slug,modified,status',
  pages: '/wp-json/wp/v2/pages?per_page=100&_fields=slug,modified,status',
  products: '/wp-json/wc/store/products?per_page=100&_fields=id,name,slug,date_modified',
  events: '/wp-json/wp/v2/insigna?per_page=100&_fields=id,slug,modified,status',
  categories: '/wp-json/wp/v2/categories?per_page=100&_fields=slug,modified',
  tags: '/wp-json/wp/v2/tags?per_page=100&_fields=slug,modified',
};

const PRIORITY_MAP = {
  homepage: { priority: 1.0, changefreq: 'daily' },
  posts: { priority: 0.7, changefreq: 'weekly' },
  pages: { priority: 0.6, changefreq: 'monthly' },
  products: { priority: 0.8, changefreq: 'weekly' },
  events: { priority: 0.9, changefreq: 'daily' },
  categories: { priority: 0.7, changefreq: 'weekly' },
  tags: { priority: 0.5, changefreq: 'monthly' },
};

const STATIC_ROUTES = {
  pt: [
    { url: '', ...PRIORITY_MAP.homepage },
    { url: '/sobre', ...PRIORITY_MAP.pages },
    { url: '/musica', ...PRIORITY_MAP.pages },
    { url: '/eventos', priority: 0.9, changefreq: 'weekly' },
    { url: '/loja', priority: 0.9, changefreq: 'daily' },
    { url: '/faq', priority: 0.6, changefreq: 'monthly' },
    { url: '/kit-imprensa', priority: 0.7, changefreq: 'monthly' },
    { url: '/zen-tribe', priority: 0.8, changefreq: 'weekly' },
  ],
  en: [
    { url: '', ...PRIORITY_MAP.homepage },
    { url: '/about', ...PRIORITY_MAP.pages },
    { url: '/music', ...PRIORITY_MAP.pages },
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

const cache = new Map();

async function fetchFromWPWithCache(endpoint, retries = RETRIES) {
  const cacheKey = endpoint;
  const cached = cache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`🔄 Using cached data for ${endpoint}`);
    return cached.data;
  }

  const data = await fetchFromWP(endpoint);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

async function fetchFromWP(endpoint, retries = RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT);

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'DJ-Zen-Eyer-Sitemap-Generator/3.0.0',
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ ${endpoint.split('?')[0]} → ${Array.isArray(data) ? data.length : 1} items`);
        return data;
      }

      if (res.status === 404) {
        console.warn(`⚠️  ${endpoint} → 404 (endpoint doesn't exist)`);
        return [];
      }

      console.warn(`⚠️  ${endpoint} → ${res.status}, retry ${i + 1}/${retries}`);
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    } catch (error) {
      console.error(`❌ Fetch error for ${endpoint}:`, error.message);
      if (i === retries - 1) {
        console.error(`   → Skipping this endpoint`);
        return [];
      }
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  return [];
}

function formatUrlEntry(loc, lastmod, changefreq, priority, hreflang = []) {
  let entry = `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
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

function getISOTimestamp(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function getDynamicPriority(url) {
  if (url.includes('/eventos/') || url.includes('/events/')) {
    return 0.9;
  }
  if (url.includes('/musica/') || url.includes('/music/')) {
    return 0.8;
  }
  return 0.6;
}

function splitSitemap(urlEntries, maxUrls = MAX_URLS_PER_SITEMAP) {
  const chunks = [];
  for (let i = 0; i < urlEntries.length; i += maxUrls) {
    chunks.push(urlEntries.slice(i, i + maxUrls));
  }
  return chunks;
}

async function pingGoogle(sitemapUrl) {
  try {
    const res = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'DJ-Zen-Eyer-Sitemap-Generator/3.0.0',
      }
    });

    if (res.ok) {
      console.log(`✅ Google pinged successfully for ${sitemapUrl}`);
    } else {
      console.warn(`⚠️ Google ping failed for ${sitemapUrl}: ${res.status}`);
    }
  } catch (error) {
    console.error(`❌ Error pinging Google:`, error.message);
  }
}

// ============================================
// 🗺️ SITEMAP GENERATION
// ============================================

async function generateSitemapForLang(lang) {
  const langPrefix = lang === 'pt' ? '' : `/${lang}`;
  const baseUrl = `${BASE_URL}${langPrefix}`;

  console.log(`\n🔄 Generating sitemap for ${lang.toUpperCase()}...`);

  try {
    const [posts, pages, products, events, categories, tags] = await Promise.all([
      fetchFromWPWithCache(WP_ENDPOINTS.posts),
      fetchFromWPWithCache(WP_ENDPOINTS.pages),
      fetchFromWPWithCache(WP_ENDPOINTS.products),
      fetchFromWPWithCache(WP_ENDPOINTS.events),
      fetchFromWPWithCache(WP_ENDPOINTS.categories),
      fetchFromWPWithCache(WP_ENDPOINTS.tags),
    ]);

    const urlEntries = [];
    const publicDir = path.join(__dirname, '../public');

    // Static routes
    const staticUrls = STATIC_ROUTES[lang]
      .map(route => formatUrlEntry(
        `${baseUrl}${route.url}`,
        getISOTimestamp(),
        route.changefreq,
        route.priority,
        LANGUAGES.map(l => ({
          code: l,
          url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}${route.url.replace(/^\//, '')}`
        }))
      ));
    urlEntries.push(...staticUrls);

    // Posts (published only)
    const postUrls = (posts || [])
      .filter(post => post.status === 'publish')
      .map(post => formatUrlEntry(
        `${baseUrl}/${post.slug}`,
        getISOTimestamp(new Date(post.modified)),
        PRIORITY_MAP.posts.changefreq,
        getDynamicPriority(`${baseUrl}/${post.slug}`),
        LANGUAGES.map(l => ({
          code: l,
          url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}${post.slug}`
        }))
      ));
    urlEntries.push(...postUrls);

    // Pages (published only)
    const pageUrls = (pages || [])
      .filter(page => page.status === 'publish')
      .map(page => formatUrlEntry(
        `${baseUrl}/${page.slug}`,
        getISOTimestamp(new Date(page.modified)),
        PRIORITY_MAP.pages.changefreq,
        getDynamicPriority(`${baseUrl}/${page.slug}`),
        LANGUAGES.map(l => ({
          code: l,
          url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}${page.slug}`
        }))
      ));
    urlEntries.push(...pageUrls);

    // Products
    const productUrls = (products || [])
      .map(product => {
        const permalink = product.permalink || `${baseUrl}/product/${product.slug}`;
        return formatUrlEntry(
          permalink,
          getISOTimestamp(new Date(product.date_modified || Date.now())),
          PRIORITY_MAP.products.changefreq,
          getDynamicPriority(permalink),
          LANGUAGES.map(l => ({
            code: l,
            url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}product/${product.slug}`
          }))
        );
      });
    urlEntries.push(...productUrls);

    // Events (published only)
    const eventUrls = (events || [])
      .filter(event => event.status === 'publish')
      .map(event => formatUrlEntry(
        `${baseUrl}/events/${event.slug}`,
        getISOTimestamp(new Date(event.modified)),
        PRIORITY_MAP.events.changefreq,
        getDynamicPriority(`${baseUrl}/events/${event.slug}`),
        LANGUAGES.map(l => ({
          code: l,
          url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}events/${event.slug}`
        }))
      ));
    urlEntries.push(...eventUrls);

    // Categories
    const categoryUrls = (categories || [])
      .map(cat => formatUrlEntry(
        `${baseUrl}/category/${cat.slug}`,
        getISOTimestamp(new Date(cat.modified)),
        PRIORITY_MAP.categories.changefreq,
        getDynamicPriority(`${baseUrl}/category/${cat.slug}`),
        LANGUAGES.map(l => ({
          code: l,
          url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}category/${cat.slug}`
        }))
      ));
    urlEntries.push(...categoryUrls);

    // Tags (lower priority for SEO)
    const tagUrls = (tags || [])
      .map(tag => formatUrlEntry(
        `${baseUrl}/tag/${tag.slug}`,
        getISOTimestamp(new Date(tag.modified)),
        PRIORITY_MAP.tags.changefreq,
        getDynamicPriority(`${baseUrl}/tag/${tag.slug}`),
        LANGUAGES.map(l => ({
          code: l,
          url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}tag/${tag.slug}`
        }))
      ));
    urlEntries.push(...tagUrls);

    // Check URL limit
    if (urlEntries.length > MAX_URLS_PER_SITEMAP) {
      console.warn(`⚠️  Total URLs (${urlEntries.length}) exceeds limit (${MAX_URLS_PER_SITEMAP})`);
      const sitemapChunks = splitSitemap(urlEntries);
      sitemapChunks.forEach((chunk, index) => {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${chunk.join('\n')}
</urlset>`;

        const filename = lang === 'pt'
          ? `sitemap${index > 0 ? `-part-${index + 1}` : ''}.xml`
          : `sitemap-${lang}${index > 0 ? `-part-${index + 1}` : ''}.xml`;

        fs.writeFileSync(path.join(publicDir, filename), xml);
        console.log(`✅ ${filename} generated`);
      });
    } else {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;

      const filename = lang === 'pt' ? 'sitemap.xml' : `sitemap-${lang}.xml`;
      fs.writeFileSync(path.join(publicDir, filename), xml);
      console.log(`✅ ${filename} generated`);
      console.log(`   → ${urlEntries.length} URLs included`);
    }

    return {
      filename: lang === 'pt' ? 'sitemap.xml' : `sitemap-${lang}.xml`,
      url: `${BASE_URL}/${lang === 'pt' ? '' : `${lang}/`}${lang === 'pt' ? 'sitemap.xml' : `sitemap-${lang}.xml`}`,
      lastmod: getISOTimestamp(),
    };

  } catch (error) {
    console.error(`❌ Error generating sitemap for ${lang}:`, error);
    throw error;
  }
}

async function generateSitemapIndex(sitemaps) {
  const sitemapEntries = sitemaps
    .map(sitemap => `  <sitemap>
    <loc>${escapeXml(sitemap.url)}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;

  const publicDir = path.join(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'sitemap_index.xml'), xml);
  console.log('✅ sitemap_index.xml generated');
  console.log(`   → ${sitemaps.length} sitemaps included`);
}

async function generateRobotsTxt() {
  const robotsTxt = `# DJ Zen Eyer - Robots.txt
# Last updated: ${new Date().toISOString()}

# Allow all bots
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap_index.xml
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-en.xml
Sitemap: ${BASE_URL}/sitemap-images.xml
Sitemap: ${BASE_URL}/sitemap-media.xml
Sitemap: ${BASE_URL}/sitemap-news.xml

# Crawl delay
Crawl-delay: 1

# Disallow private areas
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /wp-includes/
Disallow: /wp-content/plugins/
Disallow: /?s=
Disallow: /search/

# Allow search engines to index media
Allow: /wp-content/uploads/`;

  const publicDir = path.join(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('✅ robots.txt generated');
}

async function generateImageSitemap() {
  const imageUrls = [
    { loc: `${BASE_URL}/wp-content/uploads/2023/10/dj-zen-eyer.jpg`, title: 'DJ Zen Eyer Live' },
    { loc: `${BASE_URL}/wp-content/uploads/2023/11/event-cover.jpg`, title: 'Evento Tech House' },
  ];

  const imageEntries = imageUrls.map(img => `
    <url>
      <loc>${escapeXml(img.loc)}</loc>
      <image:image>
        <image:loc>${escapeXml(img.loc)}</image:loc>
        <image:title>${escapeXml(img.title)}</image:title>
      </image:image>
    </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries.join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'sitemap-images.xml'), xml);
  console.log('✅ sitemap-images.xml generated');
}

async function generateMediaSitemap() {
  const mediaUrls = [
    {
      loc: `${BASE_URL}/musicas/cremosa`,
      title: 'Cremosa - DJ Zen Eyer',
      type: 'audio/mpeg',
      duration: '245',
      playerLoc: 'https://open.spotify.com/track/123456789'
    },
  ];

  const mediaEntries = mediaUrls.map(media => `
    <url>
      <loc>${escapeXml(media.loc)}</loc>
      <video:video>
        <video:title>${escapeXml(media.title)}</video:title>
        <video:content_loc>${escapeXml(media.playerLoc)}</video:content_loc>
        <video:duration>${media.duration}</video:duration>
      </video:video>
    </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${mediaEntries.join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'sitemap-media.xml'), xml);
  console.log('✅ sitemap-media.xml generated');
}

async function generateNewsSitemap() {
  const newsUrls = [
    { loc: `${BASE_URL}/noticias/lancamento-novo-album`, title: 'Lançamento do Novo Álbum', date: '2023-10-15' },
  ];

  const newsEntries = newsUrls.map(news => `
    <url>
      <loc>${escapeXml(news.loc)}</loc>
      <news:news>
        <news:publication>
          <news:name>DJ Zen Eyer</news:name>
          <news:language>pt</news:language>
        </news:publication>
        <news:publication_date>${news.date}</news:publication_date>
        <news:title>${escapeXml(news.title)}</news:title>
      </news:news>
    </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsEntries.join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'sitemap-news.xml'), xml);
  console.log('✅ sitemap-news.xml generated');
}

// ============================================
// 🚀 MAIN EXECUTION
// ============================================

async function main() {
  console.log('========================================');
  console.log('🚀 DJ Zen Eyer - Sitemap Generator MASTER v3.0.0');
  console.log('========================================\n');

  const startTime = Date.now();
  const sitemaps = [];

  try {
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Generate sitemaps for each language in parallel
    const sitemapResults = await Promise.all(
      LANGUAGES.map(lang => generateSitemapForLang(lang))
    );
    sitemaps.push(...sitemapResults);

    // Generate additional sitemaps
    await generateImageSitemap();
    await generateMediaSitemap();
    await generateNewsSitemap();

    // Generate index and robots.txt
    await generateSitemapIndex(sitemaps);
    await generateRobotsTxt();

    // Ping Google
    await pingGoogle(`${BASE_URL}/sitemap_index.xml`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n========================================');
    console.log(`✅ All sitemaps generated successfully in ${duration}s!`);
    console.log('========================================\n');
    console.log('📍 Files created:');
    console.log('   • sitemap.xml');
    console.log('   • sitemap-en.xml');
    console.log('   • sitemap-images.xml');
    console.log('   • sitemap-media.xml');
    console.log('   • sitemap-news.xml');
    console.log('   • sitemap_index.xml');
    console.log('   • robots.txt');
    console.log('\n🔗 Submit to Google Search Console:');
    console.log(`   → ${BASE_URL}/sitemap_index.xml\n`);

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
main();
