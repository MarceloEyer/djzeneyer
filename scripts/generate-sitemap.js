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

    /**
     * Constrói URL canônica sem barras duplas e com trailing slash (exceto root)
     */
    const getSitemapUrl = (lang, slug) => {
      const parts = [BASE_URL];
      if (lang === 'pt') parts.push('pt');
      
      const cleanSlug = (slug || '').replace(/^\/+|\/+$/g, '');
      if (cleanSlug) parts.push(cleanSlug);
      
      let url = parts.join('/');
      // Garante trailing slash em tudo (padrão do projeto)
      if (!url.endsWith('/')) url += '/';
      return url;
    };

    let pageCount = 0;
    for (const route of routesData.routes) {
      if (route.excludeFromSitemap || route.noindex) {
        continue;
      }

      const enUrl = getSitemapUrl('en', route.en);
      const ptUrl = getSitemapUrl('pt', route.pt);
      const priority = (route.en === '' || route.en === '/') ? '1.0' : '0.8';

      // EN entry: x-default points to EN
      pagesXml += buildUrlEntry(enUrl, date, priority, ptUrl, DEFAULT_IMAGE, true);
      // PT entry: x-default still points to EN (canonical language)
      pagesXml += buildUrlEntry(ptUrl, date, priority, enUrl, DEFAULT_IMAGE, false);
      pageCount += 2;
    }
    pagesXml += '\n</urlset>';
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pages.xml'), pagesXml);
    console.log(`✅ sitemap-pages.xml created (${pageCount} URLs)`);

    // 2. Events Sitemap
    const events = await fetchEvents();
    
    // Obter slugs canônicos de eventos do routes-slugs.json
    const eventsRoute = routesData.routes.find(r => r.key === 'events');
    if (!eventsRoute?.en || !eventsRoute?.pt) {
      throw new Error('routes-slugs.json precisa conter a rota "events" com slugs EN/PT antes de gerar o sitemap.');
    }
    const eventsSlugEn = eventsRoute.en.replace(/^\/+|\/+$/g, '');
    const eventsSlugPt = eventsRoute.pt.replace(/^\/+|\/+$/g, '');
    const normalizePathSegment = value => String(value || '').replace(/^\/+|\/+$/g, '');
    const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const eventRouteAliases = [
      eventsSlugEn,
      eventsSlugPt,
      ...(eventsRoute.aliases?.en ?? []),
      ...(eventsRoute.aliases?.pt ?? []),
    ].map(normalizePathSegment).filter(Boolean);
    const removableEventPrefixes = [...new Set([
      ...eventRouteAliases,
      ...eventRouteAliases.map(routePath => `en/${routePath}`),
      ...eventRouteAliases.map(routePath => `pt/${routePath}`),
    ])].sort((a, b) => b.length - a.length);
    const eventPrefixRegex = new RegExp(`^/?(?:${removableEventPrefixes.map(escapeRegex).join('|')})(?:/|$)`, 'i');

    let eventCount = 0;
    if (events.length > 0) {
      let eventsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

      for (const event of events) {
        // Extração robusta do slug final (ID ou path real)
        let relativePath = event.canonical_path || String(event.event_id);
        
        // Remove prefixos conhecidos para isolar o ID/Slug final do evento
        relativePath = relativePath
          .replace(/^https?:\/\/[^\/]+/, '') // Remove domínio se vier absoluto
          .replace(eventPrefixRegex, '')
          .replace(/^\/+|\/+$/g, '');

        if (!relativePath) continue;

        // Construímos os URLs usando os slugs REAIS da configuração SSOT
        const enEventUrl = getSitemapUrl('en', `${eventsSlugEn}/${relativePath}`);
        const ptEventUrl = getSitemapUrl('pt', `${eventsSlugPt}/${relativePath}`);

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
