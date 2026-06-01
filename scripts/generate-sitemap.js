#!/usr/bin/env node
/**
 * Sitemap Generator v8.1 - EVENTS + POSTS SUPPORT
 * Gera sitemaps baseado em arquivo JSON estático e conteúdo público do WordPress
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalizeBaseUrl = (url) => String(url || '').replace(/\/+$/, '');

const BASE_URL = normalizeBaseUrl(process.env.SITE_BASE_URL || 'https://djzeneyer.com');
const REST_BASE_URL = normalizeBaseUrl(
  process.env.WP_REST_URL || process.env.VITE_WP_REST_URL || `${BASE_URL}/wp-json`
);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ROUTES_DATA_PATH = path.resolve(__dirname, '../src/config/routes-slugs.json');
const ENCYCLOPEDIA_TERMS_PATH = path.resolve(__dirname, '../src/config/encyclopedia-term-slugs.json');

console.log('🗺️  Sitemap Generator v8.1 - EVENTS + POSTS SUPPORT\n');

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

function buildSitemapIndexEntry(url, date) {
  return `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
  </sitemap>`;
}

const BANDSINTOWN_ARTIST_ID = process.env.BANDSINTOWN_ARTIST_ID || 'id_15619775';
const BANDSINTOWN_APP_ID = process.env.BANDSINTOWN_APP_ID || 'f8f1216ea03be95a3ea91c7ebe7117e7';

async function fetchEvents() {
  let raw = null;
  let source = 'NONE';

  // 1. Tentar API Interna do WordPress (Recomendado)
  try {
    const INTERNAL_API_EVENTS = `${REST_BASE_URL}/zen-bit/v2/events?mode=upcoming&days=365`;
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
  return raw.map(ev => ({
    event_id: String(ev.id || ev.event_id || ''),
    image: ev.artist?.image_url || ev.artist?.thumb_url || ev.image || DEFAULT_IMAGE,
    canonical_path: ev.canonical_path
  }));
}

async function fetchPosts() {
  const fields = 'id,date,modified,slug,link,featured_image_src,featured_image_src_full';
  const result = { en: [], pt: [] };

  await Promise.all(['en', 'pt'].map(async (lang) => {
    try {
      const postsUrl = `${REST_BASE_URL}/wp/v2/posts?per_page=100&lang=${lang}&_fields=${encodeURIComponent(fields)}`;
      console.log(`📡 Fetching posts (${lang}) from ${postsUrl}...`);
      const res = await fetch(postsUrl, { headers: { Accept: 'application/json' } });

      if (!res.ok) {
        console.warn(`⚠️ Posts (${lang}): API respondeu ${res.status}.`);
        return;
      }

      const data = await res.json();
      result[lang] = Array.isArray(data) ? data.filter(post => post?.slug) : [];
      console.log(`✅ Posts (${lang}): ${result[lang].length} items`);
    } catch (error) {
      console.warn(`⚠️ Posts (${lang}): falha ao buscar — ${error.message}`);
    }
  }));

  return result;
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

    const encyclopediaRoute = routesData.routes.find(route => route.key === 'encyclopedia');
    let encyclopediaTerms = [];
    try {
      const parsed = JSON.parse(fs.readFileSync(ENCYCLOPEDIA_TERMS_PATH, 'utf-8'));
      if (parsed && Array.isArray(parsed.terms)) {
        encyclopediaTerms = parsed.terms;
      } else {
        console.warn(`⚠️ Encyclopedia: propriedade 'terms' ausente ou inválida em ${ENCYCLOPEDIA_TERMS_PATH}`);
      }
    } catch (e) {
      console.warn(`⚠️ Encyclopedia: falha ao ler ${ENCYCLOPEDIA_TERMS_PATH}: ${e.message}`);
    }
    if (encyclopediaRoute && encyclopediaTerms.length > 0) {
      console.log(`📚 Encyclopedia: ${encyclopediaTerms.length} termos carregados.`);
      for (const term of encyclopediaTerms) {
        if (typeof term !== 'string' || !term.trim()) {
          console.warn(`⚠️ Encyclopedia: termo inválido ignorado: ${JSON.stringify(term)}`);
          continue;
        }
        const enUrl = getSitemapUrl('en', `${encyclopediaRoute.en}/${term}`);
        const ptUrl = getSitemapUrl('pt', `${encyclopediaRoute.pt}/${term}`);
        pagesXml += buildUrlEntry(enUrl, date, '0.7', ptUrl, DEFAULT_IMAGE, true);
        pagesXml += buildUrlEntry(ptUrl, date, '0.7', enUrl, DEFAULT_IMAGE, false);
        pageCount += 2;
      }
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
    let eventsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    if (events.length > 0) {
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
    }

    eventsXml += '\n</urlset>';
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-events.xml'), eventsXml);
    console.log(`✅ sitemap-events.xml created (${eventCount} URLs)`);

    // 3. Posts Sitemap
    const posts = await fetchPosts();
    const newsRoute = routesData.routes.find(r => r.key === 'news');
    if (!newsRoute?.en || !newsRoute?.pt) {
      throw new Error('routes-slugs.json precisa conter a rota "news" com slugs EN/PT antes de gerar o sitemap de posts.');
    }

    const postsByLang = {
      en: new Map(posts.en.map(post => [post.slug, post])),
      pt: new Map(posts.pt.map(post => [post.slug, post])),
    };
    const postSlugs = [...new Set([...postsByLang.en.keys(), ...postsByLang.pt.keys()])];

    let postCount = 0;
    let postsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    for (const slug of postSlugs) {
      const enPost = postsByLang.en.get(slug);
      const ptPost = postsByLang.pt.get(slug);
      const canonicalPost = enPost || ptPost;
      if (!canonicalPost) continue;

      const lastmod = canonicalPost.modified || canonicalPost.date || date;
      const image = canonicalPost.featured_image_src_full || canonicalPost.featured_image_src || DEFAULT_IMAGE;
      const enUrl = getSitemapUrl('en', `${newsRoute.en}/${slug}`);
      const ptUrl = getSitemapUrl('pt', `${newsRoute.pt}/${slug}`);

      if (enPost) {
        postsXml += buildUrlEntry(enUrl, lastmod, '0.7', ptUrl, image, true);
        postCount++;
      }
      if (ptPost) {
        postsXml += buildUrlEntry(ptUrl, lastmod, '0.7', enUrl, image, false);
        postCount++;
      }
    }

    postsXml += '\n</urlset>';
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-posts.xml'), postsXml);
    console.log(`✅ sitemap-posts.xml created (${postCount} URLs)`);

    // 4. Index Sitemap
    let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    sitemapIndex += buildSitemapIndexEntry(`${BASE_URL}/sitemap-pages.xml`, date);

    sitemapIndex += buildSitemapIndexEntry(`${BASE_URL}/sitemap-events.xml`, date);

    sitemapIndex += buildSitemapIndexEntry(`${BASE_URL}/sitemap-posts.xml`, date);

    sitemapIndex += '\n</sitemapindex>';
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndex);
    console.log('✅ sitemap.xml index created');

    console.log('\n════════════════════════════════════════');
    console.log('✅ Sitemap generation complete!');
    console.log(`📄 Total: ${pageCount + eventCount + postCount} URLs`);
    console.log(`📍 Location: ${PUBLIC_DIR}`);
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateSitemaps();
