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
const API_URL = 'https://djzeneyer.com/wp-json/zen-bit/v2/events';
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ROUTES_DATA_PATH = path.resolve(__dirname, 'routes-data.json');

console.log('🗺️  Sitemap Generator v8.0 - EVENTS SUPPORT\n');

function buildUrlEntry(url, date, priority = '0.8', ptUrl = null) {
  let entry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>`;

  if (ptUrl) {
    entry += `
    <xhtml:link rel="alternate" hreflang="en" href="${url}" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${ptUrl}" />`;
  }

  entry += `
  </url>`;
  return entry;
}

async function fetchEvents() {
  try {
    // Busca direto no Bandsintown para contornar o WAF (Cloudflare 403) no Github Actions
    const BIT_API_URL = 'https://rest.bandsintown.com/artists/djzeneyer/events?app_id=djzeneyer&date=upcoming';
    console.log(`📡 Fetching events from ${BIT_API_URL}...`);
    const response = await fetch(BIT_API_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No body');
      throw new Error(`HTTP error! status: ${response.status} - Body: ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    // Mapeia o formato do Bandsintown para o formato que o gerador espera
    return data.map(ev => ({
      event_id: ev.id,
      canonical_path: undefined // Vai assumir eventId como fallback
    }));
  } catch (error) {
    console.warn('\n❌ SITEMAP ERROR: Could not fetch events:', error.message);
    return [];
  }
}

async function generateSitemaps() {
  try {
    const routesData = JSON.parse(fs.readFileSync(ROUTES_DATA_PATH, 'utf-8'));
    const date = new Date().toISOString();

    // 1. Pages Sitemap
    let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    let pageCount = 0;
    for (const route of routesData.routes) {
      const enSlug = route.en === '' ? '' : route.en.replace(/^\/+/, '');
      const ptSlug = route.pt === '' ? '' : route.pt.replace(/^\/+/, '');
      const enUrl = enSlug === '' ? `${BASE_URL}/` : `${BASE_URL}/${enSlug}/`;
      const ptUrl = ptSlug === '' ? `${BASE_URL}/pt/` : `${BASE_URL}/pt/${ptSlug}/`;
      const priority = enSlug === '' ? '1.0' : '0.8';

      pagesXml += buildUrlEntry(enUrl, date, priority, ptUrl);
      pagesXml += buildUrlEntry(ptUrl, date, priority, enUrl);
      pageCount += 2;
    }
    pagesXml += '\n</urlset>';
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pages.xml'), pagesXml);
    console.log(`✅ sitemap-pages.xml created (${pageCount} URLs)`);

    // 2. Events Sitemap
    const events = await fetchEvents();
    let eventCount = 0;
    if (events.length > 0) {
      let eventsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

      for (const event of events) {
        // Determinamos o slug independente do idioma
        const eventId = event.event_id;
        const relativePath = event.canonical_path
          ? event.canonical_path.replace(/^\/events\//, '')
          : eventId;

        if (!relativePath) continue;

        // Construímos os URLs conforme as rotas definidas no routes.ts
        const enEventUrl = `${BASE_URL}/events/${relativePath}/`;
        const ptEventUrl = `${BASE_URL}/pt/eventos/${relativePath}/`;

        // Adicionamos ambos ao sitemap com link alternativo
        eventsXml += buildUrlEntry(enEventUrl, date, '0.7', ptEventUrl);
        eventsXml += buildUrlEntry(ptEventUrl, date, '0.7', enEventUrl);

        eventCount += 2;
      }
      eventsXml += '\n</urlset>';
      fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-events.xml'), eventsXml);
      console.log(`✅ sitemap-events.xml created (${eventCount} URLs)`);
    }

    // 3. Index Sitemap
    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-pages.xml</loc>
    <lastmod>${date}</lastmod>
  </sitemap>`;

    if (eventCount > 0) {
      sitemapIndex += `
  <sitemap>
    <loc>${BASE_URL}/sitemap-events.xml</loc>
    <lastmod>${date}</lastmod>
  </sitemap>`;
    }

    sitemapIndex += '\n</sitemapindex>';
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndex);
    console.log('✅ sitemap.xml index created');

    console.log('\n════════════════════════════════════════');
    console.log('✅ Sitemap generation complete!');
    console.log(`📄 Total: ${pageCount + eventCount} URLs`);
    console.log(`📍 Location: ${PUBLIC_DIR}`);
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateSitemaps();
