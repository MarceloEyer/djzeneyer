#!/usr/bin/env node
/**
 * Sitemap Generator v8.2 - AUDIT-HARDENED EVENTS + POSTS SUPPORT
 * Gera sitemaps a partir de rotas estáticas, eventos públicos e conteúdo indexável do WordPress.
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

console.log('🗺️  Sitemap Generator v8.2 - AUDIT-HARDENED EVENTS + POSTS SUPPORT\n');

const DEFAULT_IMAGE = `${BASE_URL}/images/zen-eyer-og-image.png`;

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toIsoDate(value, fallback) {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

function buildUrlEntry(url, date, priority = '0.8', altUrl = null, imageUrl = null, isEnglish = true) {
  let entry = `
  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${escapeXml(date)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${escapeXml(priority)}</priority>`;

  if (altUrl) {
    const enUrl = isEnglish ? url : altUrl;
    const ptUrl = isEnglish ? altUrl : url;
    entry += `
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(enUrl)}" />
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${escapeXml(ptUrl)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enUrl)}" />`;
  }

  if (imageUrl) {
    entry += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
    </image:image>`;
  }

  entry += `
  </url>`;
  return entry;
}

function buildSitemapIndexEntry(url, date) {
  return `
  <sitemap>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${escapeXml(date)}</lastmod>
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
    const res = await fetch(INTERNAL_API_EVENTS, { headers: { Accept: 'application/json' } });
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
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 WordPress/SitemapGenerator',
        },
      });

      if (response.ok) {
        raw = await response.json();
        source = 'BANDSINTOWN_DIRECT';
      } else {
        const errorText = await response.text().catch(() => 'No body');
        console.warn(`⚠️ Bandsintown respondeu ${response.status}: ${errorText.slice(0, 100)}`);
      }
    } catch (error) {
      console.warn('\n❌ SITEMAP ERROR: Could not fetch events:', error instanceof Error ? error.message : String(error));
    }
  }

  if (!raw || !Array.isArray(raw)) return [];

  console.log(`✅ Events loaded via ${source}: ${raw.length} items`);

  // Mapeia para o formato que o gerador espera
  return raw.map(ev => ({
    event_id: String(ev.id || ev.event_id || ''),
    image: ev.artist?.image_url || ev.artist?.thumb_url || ev.image || DEFAULT_IMAGE,
    canonical_path: ev.canonical_path,
  }));
}

function normalizeLanguage(lang) {
  const value = String(lang || '').trim().toLowerCase();
  return value.startsWith('pt') ? 'pt' : 'en';
}

function normalizeHreflang(lang) {
  const value = String(lang || '').trim();
  if (!value) return '';
  if (value.toLowerCase().startsWith('pt')) return 'pt-BR';
  if (value.toLowerCase().startsWith('en')) return 'en';
  return value;
}

function normalizeFrontendUrl(value) {
  if (!value) return '';
  const raw = String(value).trim();
  if (!raw) return '';

  let pathname = raw;
  try {
    if (/^https?:\/\//i.test(raw)) {
      const parsed = new URL(raw);
      pathname = parsed.pathname || '/';
    }
  } catch (_) {
    pathname = raw;
  }

  pathname = pathname.replace(/^https?:\/\/[^/]+/i, '');
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/+/g, '/');

  let url = `${BASE_URL}${pathname}`;
  if (!url.endsWith('/')) url += '/';
  return url;
}

function normalizeTranslations(translations) {
  if (!translations || typeof translations !== 'object') return {};

  const normalized = {};
  for (const [lang, url] of Object.entries(translations)) {
    const hreflang = normalizeHreflang(lang);
    const normalizedUrl = normalizeFrontendUrl(url);
    if (hreflang && normalizedUrl) {
      normalized[hreflang] = normalizedUrl;
    }
  }
  return normalized;
}

function isNoindexPost(post) {
  const robots = String(post?.robots || post?.zen_seo?.robots || '').toLowerCase();
  return Boolean(
    post?.noindex ||
    post?.zen_seo?.noindex ||
    post?._zen_seo_data?.noindex ||
    robots.includes('noindex')
  );
}

function normalizePost(post, fallbackLang = 'en') {
  const slug = String(post?.slug || post?.post_name || '').replace(/^\/+|\/+$/g, '');
  const lang = normalizeLanguage(post?.lang || post?.language || fallbackLang);
  const translations = normalizeTranslations(post?.translations || post?.zen_translations || {});

  if (!translations.en && lang === 'en' && post?.link) translations.en = normalizeFrontendUrl(post.link);
  if (!translations['pt-BR'] && lang === 'pt' && post?.link) translations['pt-BR'] = normalizeFrontendUrl(post.link);

  return {
    id: String(post?.id || post?.ID || ''),
    type: String(post?.type || post?.post_type || 'post'),
    slug,
    lang,
    modified: post?.modified || post?.date || '',
    image: post?.featured_image_src_full || post?.featured_image_src || post?.image || '',
    translations,
    noindex: isNoindexPost(post),
  };
}

async function fetchPostsFromZenSeoSitemap() {
  const url = `${REST_BASE_URL}/zen-seo/v1/sitemap`;
  console.log(`📡 Fetching indexable posts from Zen SEO sitemap endpoint: ${url}...`);

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      console.warn(`⚠️ Zen SEO sitemap endpoint respondeu ${res.status}. Usando fallback wp/v2/posts.`);
      return [];
    }

    const payload = await res.json();
    const posts = payload?.data?.posts;
    if (!Array.isArray(posts)) {
      console.warn('⚠️ Zen SEO sitemap endpoint sem data.posts válido. Usando fallback wp/v2/posts.');
      return [];
    }

    const normalized = posts
      .map(post => normalizePost(post, post?.lang || 'en'))
      .filter(post => post.type === 'post' && post.slug && !post.noindex);

    console.log(`✅ Indexable posts loaded via Zen SEO endpoint: ${normalized.length}`);
    return normalized;
  } catch (error) {
    console.warn('⚠️ Error fetching Zen SEO sitemap endpoint:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

/**
 * Fetches all published posts for a given language with pagination.
 * Fallback usado quando o endpoint zen-seo/v1/sitemap não está disponível.
 */
async function fetchPostsForLang(lang) {
  const fields = 'id,date,modified,slug,link,featured_image_src,featured_image_src_full,zen_seo,zen_translations';
  const posts = [];
  let page = 1;
  while (true) {
    const url = `${REST_BASE_URL}/wp/v2/posts?lang=${lang}&per_page=100&page=${page}&status=publish&orderby=modified&order=desc&_fields=${encodeURIComponent(fields)}`;
    let res;
    try {
      res = await fetch(url, { headers: { Accept: 'application/json' } });
    } catch (error) {
      console.warn(`⚠️ Error fetching posts (lang=${lang}, page=${page}):`, error instanceof Error ? error.message : String(error));
      break;
    }
    if (!res.ok) {
      console.warn(`⚠️ Posts (${lang}): API respondeu ${res.status}.`);
      break;
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    posts.push(
      ...data
        .map(post => normalizePost(post, lang))
        .filter(post => post.slug && !post.noindex)
    );
    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    if (page >= totalPages) break;
    page++;
  }
  return posts;
}

async function fetchPosts() {
  const endpointPosts = await fetchPostsFromZenSeoSitemap();
  if (endpointPosts.length > 0) {
    return endpointPosts;
  }

  console.log('📡 Fetching posts from WP REST API fallback...');
  const [en, pt] = await Promise.all([
    fetchPostsForLang('en'),
    fetchPostsForLang('pt'),
  ]);
  const posts = [...en, ...pt];
  console.log(`✅ Posts loaded via wp/v2 fallback: ${en.length} EN, ${pt.length} PT`);
  return posts;
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
      console.warn(`⚠️ Encyclopedia: falha ao ler ${ENCYCLOPEDIA_TERMS_PATH}: ${e instanceof Error ? e.message : String(e)}`);
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
          .replace(/^https?:\/\/[^/]+/, '') // Remove domínio se vier absoluto
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

    let postCount = 0;
    const seenPostUrls = new Set();
    let postsXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    const buildPostUrl = (lang, slug) => getSitemapUrl(lang, `${lang === 'pt' ? newsRoute.pt : newsRoute.en}/${slug}`);
    const getPostUrlByLang = (post, lang) => {
      const hreflang = lang === 'pt' ? 'pt-BR' : 'en';
      if (post.translations?.[hreflang]) return post.translations[hreflang];
      if (post.lang === lang && post.slug) return buildPostUrl(lang, post.slug);
      return '';
    };

    for (const post of posts) {
      if (!post.slug || post.noindex) continue;

      const lastmod = toIsoDate(post.modified, date);
      const image = post.image || null;
      const enUrl = getPostUrlByLang(post, 'en');
      const ptUrl = getPostUrlByLang(post, 'pt');

      if (enUrl && ptUrl) {
        if (!seenPostUrls.has(enUrl)) {
          postsXml += buildUrlEntry(enUrl, lastmod, '0.7', ptUrl, image, true);
          seenPostUrls.add(enUrl);
          postCount++;
        }
        if (!seenPostUrls.has(ptUrl)) {
          postsXml += buildUrlEntry(ptUrl, lastmod, '0.7', enUrl, image, false);
          seenPostUrls.add(ptUrl);
          postCount++;
        }
        continue;
      }

      const fallbackUrl = enUrl || ptUrl || buildPostUrl(post.lang, post.slug);
      if (!fallbackUrl || seenPostUrls.has(fallbackUrl)) continue;

      postsXml += buildUrlEntry(fallbackUrl, lastmod, '0.7', null, image, post.lang === 'en');
      seenPostUrls.add(fallbackUrl);
      postCount++;
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
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

generateSitemaps();