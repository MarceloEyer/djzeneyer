#!/usr/bin/env node
/**
 * Sitemap Generator v7.0 - SIMPLIFIED
 * Gera sitemaps baseado em arquivo JSON estático
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://djzeneyer.com';
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ROUTES_DATA = path.resolve(__dirname, 'routes-config.json');

console.log('🗺️  Sitemap Generator v7.0 - SIMPLIFIED\n');

function buildUrlEntry(route, date) {
  const cleanPath = route === '/' ? '' : route.replace(/^\/+/, '');
  const enUrl = cleanPath === '' ? `${BASE_URL}/` : `${BASE_URL}/${cleanPath}`;
  const ptUrl = cleanPath === '' ? `${BASE_URL}/pt/` : `${BASE_URL}/pt/${cleanPath}`;

  const priority = cleanPath === '' ? '1.0' : '0.8';

  return `
  <url>
    <loc>${enUrl}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="pt" href="${ptUrl}" />
  </url>`;
}

function generateSitemaps() {
  try {
    const routesData = JSON.parse(fs.readFileSync(ROUTES_DATA, 'utf-8'));
    const date = new Date().toISOString();

    let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    let urlCount = 0;

    for (const route of routesData.routes) {
      pagesXml += buildUrlEntry(route, date);
      urlCount++;
    }

    pagesXml += '\n</urlset>';

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pages.xml'), pagesXml);
    console.log(`✅ sitemap-pages.xml created (${urlCount} URLs)\n`);

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${date}</lastmod>
  </sitemap>
</sitemapindex>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndex);
    console.log('✅ sitemap.xml index created\n');

    console.log('════════════════════════════════════════');
    console.log('✅ Sitemap generation complete!');
    console.log(`📄 Total URLs: ${urlCount}`);
    console.log(`📍 Location: ${PUBLIC_DIR}`);
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateSitemaps();
