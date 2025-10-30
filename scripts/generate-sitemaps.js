/**
 * DJ Zen Eyer - Sitemap Generator
 * Generates multilingual sitemaps for SEO
 * 
 * Usage: node scripts/generate-sitemaps.js
 * Schedule: Daily via cron or deployment
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
const MAX_URLS_PER_SITEMAP = 50000; // Google limit
const TIMEOUT = 10000; // 10 seconds
const RETRIES = 3;

// WordPress REST API endpoints
const WP_ENDPOINTS = {
  posts: '/wp-json/wp/v2/posts?per_page=100&_fields=slug,modified,status',
  pages: '/wp-json/wp/v2/pages?per_page=100&_fields=slug,modified,status',
  products: '/wp-json/wc/store/products?per_page=100&_fields=id,name,slug,date_modified',
  events: '/wp-json/wp/v2/insigna?per_page=100&_fields=id,slug,modified,status',
  categories: '/wp-json/wp/v2/categories?per_page=100&_fields=slug,modified',
  tags: '/wp-json/wp/v2/tags?per_page=100&_fields=slug,modified',
};

// Priority & change frequency mapping
const PRIORITY_MAP = {
  homepage: { priority: 1.0, changefreq: 'daily' },
  posts: { priority: 0.7, changefreq: 'weekly' },
  pages: { priority: 0.6, changefreq: 'monthly' },
  products: { priority: 0.8, changefreq: 'weekly' },
  events: { priority: 0.9, changefreq: 'daily' },
  categories: { priority: 0.7, changefreq: 'weekly' },
  tags: { priority: 0.5, changefreq: 'monthly' },
};

// Static routes (non-WordPress)
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

/**
 * Fetch data from WordPress REST API with retry logic
 */
async function fetchFromWP(endpoint, retries = RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT);

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'DJ-Zen-Eyer-Sitemap-Generator/2.5.0',
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
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
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

/**
 * Format URL entry for XML
 */
function formatUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Escape XML special characters
 */
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

/**
 * Get current timestamp in ISO format
 */
function getISOTimestamp(date = new Date()) {
  return date.toISOString().split('T')[0];
}

// ============================================
// 🗺️ SITEMAP GENERATION
// ============================================

/**
 * Generate sitemap for specific language
 */
async function generateSitemapForLang(lang) {
  const langPrefix = lang === 'pt' ? '' : `/${lang}`;
  const baseUrl = `${BASE_URL}${langPrefix}`;

  console.log(`\n🔄 Generating sitemap for ${lang.toUpperCase()}...`);

  try {
    // Fetch all content types in parallel
    const [posts, pages, products, events, categories, tags] = await Promise.all([
      fetchFromWP(WP_ENDPOINTS.posts),
      fetchFromWP(WP_ENDPOINTS.pages),
      fetchFromWP(WP_ENDPOINTS.products),
      fetchFromWP(WP_ENDPOINTS.events),
      fetchFromWP(WP_ENDPOINTS.categories),
      fetchFromWP(WP_ENDPOINTS.tags),
    ]);

    // Build URL entries array
    const urlEntries = [];

    // Static routes
    const staticUrls = STATIC_ROUTES[lang]
      .map(route => formatUrlEntry(
        `${baseUrl}${route.url}`,
        getISOTimestamp(),
        route.changefreq,
        route.priority
      ));
    urlEntries.push(...staticUrls);

    // Posts (published only)
    const postUrls = (posts || [])
      .filter(post => post.status === 'publish')
      .map(post => formatUrlEntry(
        `${baseUrl}/${post.slug}`,
        getISOTimestamp(new Date(post.modified)),
        PRIORITY_MAP.posts.changefreq,
        PRIORITY_MAP.posts.priority
      ));
    urlEntries.push(...postUrls);

    // Pages (published only)
    const pageUrls = (pages || [])
      .filter(page => page.status === 'publish')
      .map(page => formatUrlEntry(
        `${baseUrl}/${page.slug}`,
        getISOTimestamp(new Date(page.modified)),
        PRIORITY_MAP.pages.changefreq,
        PRIORITY_MAP.pages.priority
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
          PRIORITY_MAP.products.priority
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
        PRIORITY_MAP.events.priority
      ));
    urlEntries.push(...eventUrls);

    // Categories
    const categoryUrls = (categories || [])
      .map(cat => formatUrlEntry(
        `${baseUrl}/category/${cat.slug}`,
        getISOTimestamp(new Date(cat.modified)),
        PRIORITY_MAP.categories.changefreq,
        PRIORITY_MAP.categories.priority
      ));
    urlEntries.push(...categoryUrls);

    // Tags (lower priority for SEO)
    const tagUrls = (tags || [])
      .map(tag => formatUrlEntry(
        `${baseUrl}/tag/${tag.slug}`,
        getISOTimestamp(new Date(tag.modified)),
        PRIORITY_MAP.tags.changefreq,
        PRIORITY_MAP.tags.priority
      ));
    urlEntries.push(...tagUrls);

    // Check URL limit
    if (urlEntries.length > MAX_URLS_PER_SITEMAP) {
      console.warn(`⚠️  Total URLs (${urlEntries.length}) exceeds limit (${MAX_URLS_PER_SITEMAP})`);
      console.warn('   → Consider splitting into multiple sitemaps');
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${urlEntries.join('\n')}
</urlset>`;

    // Write to file
    const filename = lang === 'pt' ? 'sitemap.xml' : `sitemap-${lang}.xml`;
    const publicDir = path.join(__dirname, '../public');

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, filename), xml);
    console.log(`✅ ${filename} generated`);
    console.log(`   → ${urlEntries.length} URLs included`);

    return {
      filename,
      url: `${BASE_URL}/${filename}`,
      lastmod: getISOTimestamp(),
    };

  } catch (error) {
    console.error(`❌ Error generating sitemap for ${lang}:`, error);
    throw error;
  }
}

/**
 * Generate sitemap index (for Google Search Console)
 */
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

/**
 * Generate robots.txt
 */
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

// ============================================
// 🚀 MAIN EXECUTION
// ============================================

async function main() {
  console.log('========================================');
  console.log('🚀 DJ Zen Eyer - Sitemap Generator v2.5.0');
  console.log('========================================\n');

  const startTime = Date.now();
  const sitemaps = [];

  try {
    // Generate sitemaps for each language in parallel
    const sitemapResults = await Promise.all(
      LANGUAGES.map(lang => generateSitemapForLang(lang))
    );
    sitemaps.push(...sitemapResults);

    // Generate index and robots.txt
    await generateSitemapIndex(sitemaps);
    await generateRobotsTxt();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n========================================');
    console.log(`✅ All sitemaps generated successfully in ${duration}s!`);
    console.log('========================================\n');
    console.log('📍 Files created:');
    sitemaps.forEach(s => console.log(`   • ${s.filename}`));
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