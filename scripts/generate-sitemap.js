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
const ROUTES_DATA_PATH = path.resolve(__dirname, '../src/config/routes-slugs.json');

console.log('🗺️  Sitemap Generator v8.0 - EVENTS SUPPORT\n');

const DEFAULT_IMAGE = `${BASE_URL}/images/zen-eyer-og-image.png`;

function buildUrlEntry(url, date, priority = '0.8', altUrl = null, imageUrl = null, isEnglish = true) {
  let entry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>`;

  if (altUrl) {
    const enUrl  = isEnglish ? url : altUrl;
    const ptUrl  = isEnglish ? altUrl : url;
    entry += `
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${ptUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />`;
  }

  if (imageUrl) {
    entry += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
    </image:image>`;
  }

  entry += `
  </url>`;
  return entry;
}

const BANDSINTOWN_ARTIST_ID = process.env.BANDSINTOWN_ARTIST_ID || 'id_15619775';
const BANDSINTOWN_APP_ID = process.env.BANDSINTOWN_APP_ID || 'f8f1216ea03be95a3ea91c7ebe7117e7';

async function fetchEvents() {
  let raw = null;
  let source = 'NONE';

  // 1. Tentar API Interna do WordPress (Recomendado)
  try {
    const INTERNAL_API_EVENTS = `${BASE_URL}/wp-json/zen-bit/v2/events?mode=upcoming&days=365`;
    console.log(`📡 Fetching events from internal API: ${INTERNAL_API_EVENTS}...`);
    const res = await fetch(INTERNAL_API_EVENTS, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.events)) {
        raw = data.events;
        source = 'INTERNAL_API';
      }
    }
  } catch (e) {
    console.warn('⚠️ Falha ao conectar na API interna. Tentando Bandsintown...');
  }

  // 2. Fallback: Bandsintown Direto
  if (!raw) {
    try {
      const BIT_API_URL = `https://rest.bandsintown.com/artists/${BANDSINTOWN_ARTIST_ID}/events?app_id=${BANDSINTOWN_APP_ID}&date=upcoming`;
      console.log(`📡 Fetching events from ${BIT_API_URL}...`);
      const response = await fetch(BIT_API_URL, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 WordPress/SitemapGenerator'
        }
      });

      if (response.ok) {
        raw = await response.json();
        source = 'BANDSINTOWN_DIRECT';
      } else {
        const errorText = await response.text().catch(() => 'No body');
        console.warn(`⚠️ Bandsintown respondeu ${response.status}: ${errorText.slice(0, 100)}`);
      }
    } catch (error) {
      console.warn('\n❌ SITEMAP ERROR: Could not fetch events:', error.message);
    }
  }

  if (!raw || !Array.isArray(raw)) return [];

  console.log(`✅ Events loaded via ${source}: ${raw.length} items`);

  // Mapeia para o formato que o gerador espera
  return raw.map(ev => {
    const venue = ev.venue || {};
    return {
      event_id: String(ev.id || ev.event_id || ''),
      image: ev.artist?.image_url || ev.artist?.thumb_url || ev.image || DEFAULT_IMAGE,
      canonical_path: ev.canonical_path
    };
  });
}

async function generateSitemaps() {
  try {
    const routesData = JSON.parse(fs.readFileSync(ROUTES_DATA_PATH, 'utf-8'));
    const date = new Date().toISOString();

    // 1. Pages Sitemap
    let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    let pageCount = 0;
    for (const route of routesData.routes) {
      if (route.excludeFromSitemap) {
        continue;
      }

      const enSlug = route.en === '' ? '' : route.en.replace(/^\/+/, '');
      const ptSlug = route.pt === '' ? '' : route.pt.replace(/^\/+/, '');
      const enUrl = enSlug === '' ? `${BASE_URL}/` : `${BASE_URL}/${enSlug}/`;
      const ptUrl = ptSlug === '' ? `${BASE_URL}/pt/` : `${BASE_URL}/pt/${ptSlug}/`;
      const priority = enSlug === '' ? '1.0' : '0.8';

      // EN entry: x-default points to EN
      pagesXml += buildUrlEntry(enUrl, date, priority, ptUrl, DEFAULT_IMAGE, true);
      // PT entry: x-default still points to EN (canonical language)
      pagesXml += buildUrlEntry(ptUrl, date, priority, enUrl, DEFAULT_IMAGE, false);
      pageCount += 2;
    }
    pagesXml += '\n</urlset>';
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pages.xml'), pagesXml);
    console.log(`✅ sitemap-pages.xml created (${pageCount} URLs with images)`);

    // 2. Events Sitemap
    const events = await fetchEvents();
    let eventCount = 0;
    if (events.length > 0) {
      let eventsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

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

        // Adicionamos ambos ao sitemap com link alternativo e imagem do evento
        eventsXml += buildUrlEntry(enEventUrl, date, '0.7', ptEventUrl, event.image, true);
        eventsXml += buildUrlEntry(ptEventUrl, date, '0.7', enEventUrl, event.image, false);

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
