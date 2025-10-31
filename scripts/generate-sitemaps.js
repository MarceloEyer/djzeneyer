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

function getISOTimestamp(date = null) {
  try {
    // ✅ FIX: Handle invalid dates
    let validDate;
    
    if (!date) {
      validDate = new Date();
    } else if (typeof date === 'string') {
      validDate = new Date(date);
    } else if (date instanceof Date) {
      validDate = date;
    } else {
      console.warn(`⚠️  Invalid date format, using current time instead:`, date);
      validDate = new Date();
    }

    // ✅ FIX: Validate the date is actually valid
    if (isNaN(validDate.getTime())) {
      console.warn(`⚠️  Invalid date value (NaN), using current time instead`);
      return new Date().toISOString().split('T')[0];
    }

    return validDate.toISOString().split('T')[0];
  } catch (error) {
    console.error(`❌ Error formatting date:`, error.message);
    return new Date().toISOString().split('T')[0];
  }
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
      .map(post => {
        try {
          return formatUrlEntry(
            `${baseUrl}/${post.slug}`,
            getISOTimestamp(post.modified || new Date()),
            PRIORITY_MAP.posts.changefreq,
            getDynamicPriority(`${baseUrl}/${post.slug}`),
            LANGUAGES.map(l => ({
              code: l,
              url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}${post.slug}`
            }))
          );
        } catch (error) {
          console.warn(`⚠️  Error processing post ${post.slug}:`, error.message);
          return null;
        }
      })
      .filter(Boolean);
    urlEntries.push(...postUrls);

    // Pages (published only)
    const pageUrls = (pages || [])
      .filter(page => page.status === 'publish')
      .map(page => {
        try {
          return formatUrlEntry(
            `${baseUrl}/${page.slug}`,
            getISOTimestamp(page.modified || new Date()),
            PRIORITY_MAP.pages.changefreq,
            getDynamicPriority(`${baseUrl}/${page.slug}`),
            LANGUAGES.map(l => ({
              code: l,
              url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}${page.slug}`
            }))
          );
        } catch (error) {
          console.warn(`⚠️  Error processing page ${page.slug}:`, error.message);
          return null;
        }
      })
      .filter(Boolean);
    urlEntries.push(...pageUrls);

    // Products
    const productUrls = (products || [])
      .map(product => {
        try {
          const permalink = product.permalink || `${baseUrl}/product/${product.slug}`;
          return formatUrlEntry(
            permalink,
            getISOTimestamp(product.date_modified || new Date()),
            PRIORITY_MAP.products.changefreq,
            getDynamicPriority(permalink),
            LANGUAGES.map(l => ({
              code: l,
              url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}product/${product.slug}`
            }))
          );
        } catch (error) {
          console.warn(`⚠️  Error processing product ${product.slug}:`, error.message);
          return null;
        }
      })
      .filter(Boolean);
    urlEntries.push(...productUrls);

    // Events (published only)
    const eventUrls = (events || [])
      .filter(event => event.status === 'publish')
      .map(event => {
        try {
          return formatUrlEntry(
            `${baseUrl}/events/${event.slug}`,
            getISOTimestamp(event.modified || new Date()),
            PRIORITY_MAP.events.changefreq,
            getDynamicPriority(`${baseUrl}/events/${event.slug}`),
            LANGUAGES.map(l => ({
              code: l,
              url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}events/${event.slug}`
            }))
          );
        } catch (error) {
          console.warn(`⚠️  Error processing event ${event.slug}:`, error.message);
          return null;
        }
      })
      .filter(Boolean);
    urlEntries.push(...eventUrls);

    // Categories
    const categoryUrls = (categories || [])
      .map(cat => {
        try {
          return formatUrlEntry(
            `${baseUrl}/category/${cat.slug}`,
            getISOTimestamp(cat.modified || new Date()),
            PRIORITY_MAP.categories.changefreq,
            getDynamicPriority(`${baseUrl}/category/${cat.slug}`),
            LANGUAGES.map(l => ({
              code: l,
              url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}category/${cat.slug}`
            }))
          );
        } catch (error) {
          console.warn(`⚠️  Error processing category ${cat.slug}:`, error.message);
          return null;
        }
      })
      .filter(Boolean);
    urlEntries.push(...categoryUrls);

    // Tags (lower priority for SEO)
    const tagUrls = (tags || [])
      .map(tag => {
        try {
          return formatUrlEntry(
            `${baseUrl}/tag/${tag.slug}`,
            getISOTimestamp(tag.modified || new Date()),
            PRIORITY_MAP.tags.changefreq,
            getDynamicPriority(`${baseUrl}/tag/${tag.slug}`),
            LANGUAGES.map(l => ({
              code: l,
              url: `${BASE_URL}/${l === 'pt' ? '' : `${l}/`}tag/${tag.slug}`
            }))
          );
        } catch (error) {
          console.warn(`⚠️  Error processing tag ${tag.slug}:`, error.message);
          return null;
        }
      })
      .filter(Boolean);
    urlEntries.push(...tagUrls);

    console.log(`✅ Generated ${urlEntries.length} URLs for ${lang.toUpperCase()}`);

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
        console.log(`✅ ${filename} generated (${chunk.length} URLs)`);
      });
    } else {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;

      const filename = lang === 'pt' ? 'sitemap.xml' : `sitemap-${lang}.xml`;
      fs.writeFileSync(path.join(publicDir, filename), xml);
      console.log(`✅ ${filename} generated (${urlEntries.length} URLs)`);
    }

    return {
      filename: lang === 'pt' ? 'sitemap.xml' : `sitemap-${lang}.xml`,
      url: `${BASE_URL}/${lang === 'pt' ? '' : `${lang}/`}${lang === 'pt' ? 'sitemap.xml' : `sitemap-${lang}.xml`}`,
      lastmod: getISOTimestamp(),
    };

  } catch (error) {
    console.error(`❌ Error generating sitemap for ${lang}:`, error.message);
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
}

async function generateRobotsTxt() {
  const robotsTxt = `# DJ Zen Eyer - Robots.txt
# Last updated: ${new Date().toISOString()}

# Allow all bots
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap_index.xml

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
  console.log('🚀 DJ Zen Eyer - Sitemap Generator MASTER v3.0.1');
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

    // Generate index and robots.txt
    await generateSitemapIndex(sitemaps);
    await generateRobotsTxt();

    // Ping Google
    await pingGoogle(`${BASE_URL}/sitemap_index.xml`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n========================================');
    console.log(`✅ All sitemaps generated successfully in ${duration}s!`);
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
main();
