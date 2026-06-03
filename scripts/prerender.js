import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync, unlinkSync } from 'fs';
import { createServer } from 'net';
import { join, dirname } from 'path';
import { fileURLToPath, URL } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BANDSINTOWN_ARTIST_ID = process.env.BANDSINTOWN_ARTIST_ID || 'id_15619775';
const BANDSINTOWN_APP_ID = process.env.BANDSINTOWN_APP_ID || 'f8f1216ea03be95a3ea91c7ebe7117e7';
const SITE_BASE_URL = process.env.SITE_BASE_URL || 'https://djzeneyer.com';
const PRERENDER_PORT = parsePrerenderPort(process.env.PRERENDER_PORT);
const PRERENDER_HOME_EVENTS_LIMIT = 3;
const PRERENDER_EVENTS_LIST_LIMIT = 50;
const PRERENDER_EVENTS_DAYS = 365;
const INTERNAL_API_EVENTS = `${SITE_BASE_URL}/wp-json/zen-bit/v2/events?mode=upcoming&days=${PRERENDER_EVENTS_DAYS}&limit=${PRERENDER_EVENTS_LIST_LIMIT}`;
const EVENTS_ROUTE_EN = '/zouk-events';
const EVENTS_ROUTE_PT = '/pt/eventos-zouk';
const bandsintownArtistEndpoint = `https://rest.bandsintown.com/artists/${BANDSINTOWN_ARTIST_ID}/events?app_id=${BANDSINTOWN_APP_ID}&date=upcoming`;
console.log(`📡 Bandsintown Endpoint (Fallback): ${bandsintownArtistEndpoint}`);
console.log(`📡 Internal API Endpoint: ${INTERNAL_API_EVENTS}`);

// 1. Carregar Rotas (SSOT — src/config/routes-slugs.json)
let routesList = [];
const ROUTES_DATA_PATH = join(__dirname, '..', 'src', 'config', 'routes-slugs.json');
const ENCYCLOPEDIA_TERMS_PATH = join(__dirname, '..', 'src', 'config', 'encyclopedia-term-slugs.json');
try {
  if (existsSync(ROUTES_DATA_PATH)) {
    const data = JSON.parse(readFileSync(ROUTES_DATA_PATH, 'utf8'));
    data.routes.forEach(r => {
      // Ignora rotas privadas e dinâmicas; o prerender só cobre páginas públicas estáticas
      if (!r.excludeFromPrerender && !r.en.includes(':') && !r.pt.includes(':')) {
        routesList.push(r.en === '' ? '/' : `/${r.en}`);
        routesList.push(r.pt === '' ? '/pt' : `/pt/${r.pt}`);
      }
    });
    const encyclopediaRoute = data.routes.find(r => r.key === 'encyclopedia');
    let encyclopediaTerms = [];
    try {
      const parsed = JSON.parse(readFileSync(ENCYCLOPEDIA_TERMS_PATH, 'utf8'));
      if (parsed && Array.isArray(parsed.terms)) {
        encyclopediaTerms = parsed.terms;
      } else {
        console.warn(`⚠️ Encyclopedia: propriedade 'terms' ausente ou inválida em encyclopedia-term-slugs.json`);
      }
    } catch (e) {
      console.warn(`⚠️ Encyclopedia: falha ao ler encyclopedia-term-slugs.json: ${e.message}`);
    }
    if (encyclopediaRoute && encyclopediaTerms.length > 0) {
      let added = 0;
      for (const term of encyclopediaTerms) {
        const enRoute = `/${encyclopediaRoute.en}/${term}`;
        const ptRoute = `/pt/${encyclopediaRoute.pt}/${term}`;
        if (!routesList.includes(enRoute)) { routesList.push(enRoute); added++; }
        if (!routesList.includes(ptRoute)) { routesList.push(ptRoute); added++; }
      }
      console.log(`📚 Encyclopedia: ${added} rotas adicionadas ao prerender.`);
    }
    console.log(`📋 SSOT: ${routesList.length} rotas (EN + PT).`);
  } else {
    throw new Error('SSOT routes-slugs.json não encontrado em src/config/');
  }
} catch (e) {
  console.error('❌ Erro na SSOT:', e.message);
  process.exit(1);
}

const CONFIG = {
  serverBase: process.env.PRERENDER_SERVER_BASE || `http://localhost:${PRERENDER_PORT}`,
  distDir: join(__dirname, '..', 'dist'),
  timeout: 60000,
  waitForSelector: '#root',
  routes: routesList
};

const wait = ms => new Promise(r => setTimeout(r, ms));

function parsePrerenderPort(value) {
  const parsed = Number(value || '5173');
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 65535 ? parsed : 5173;
}

function assertPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        reject(new Error(`Porta ${port} já está em uso. Encerre o vite preview antigo ou rode com PRERENDER_PORT=outra_porta.`));
        return;
      }
      reject(error);
    });
    server.once('listening', () => {
      server.close(resolve);
    });
    server.listen(port, '127.0.0.1');
  });
}

function safeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function slugify(value) {
  return safeText(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getHtmlAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\s${attribute}\\s*=\\s*["']([^"']+)["']`, 'i'));
  return match?.[1] || '';
}

function removeEarlierMatchesByKey(input, regex, getKey) {
  const matches = [...input.matchAll(regex)]
    .map(match => ({ index: match.index, text: match[0], key: getKey(match[0]) }))
    .filter(match => Boolean(match.key));

  return removeEarlierCollectedMatches(input, matches);
}

function removeEarlierCollectedMatches(input, matches) {

  if (matches.length <= 1) return input;

  const seen = new Set();
  const removeIndexes = new Set();

  for (let index = matches.length - 1; index >= 0; index--) {
    const match = matches[index];
    if (seen.has(match.key)) {
      removeIndexes.add(match.index);
      continue;
    }
    seen.add(match.key);
  }

  if (removeIndexes.size === 0) return input;

  let output = '';
  let cursor = 0;
  matches.forEach((match) => {
    if (!removeIndexes.has(match.index)) return;
    output += input.slice(cursor, match.index);
    cursor = match.index + match.text.length;
  });

  output += input.slice(cursor);
  return output;
}

function dedupeJsonLdScripts(input) {
  const matches = [];
  const lowerInput = input.toLowerCase();
  let cursor = 0;

  while (cursor < input.length) {
    const openStart = lowerInput.indexOf('<script', cursor);
    if (openStart === -1) break;

    const openEnd = input.indexOf('>', openStart);
    if (openEnd === -1) break;

    const closeStart = lowerInput.indexOf('</script', openEnd + 1);
    if (closeStart === -1) break;

    const closeEnd = input.indexOf('>', closeStart);
    if (closeEnd === -1) break;

    const openTag = input.slice(openStart, openEnd + 1);
    if (getHtmlAttribute(openTag, 'type').toLowerCase() === 'application/ld+json') {
      const json = input.slice(openEnd + 1, closeStart).trim();
      if (json) {
        matches.push({
          index: openStart,
          text: input.slice(openStart, closeEnd + 1),
          key: `script:ld-json:${json}`,
        });
      }
    }

    cursor = closeEnd + 1;
  }

  return removeEarlierCollectedMatches(input, matches);
}

function removeLaterMatchesByKey(input, regex, getKey) {
  const matches = [...input.matchAll(regex)]
    .map(match => ({ index: match.index, text: match[0], key: getKey(match[0]) }))
    .filter(match => Boolean(match.key));

  if (matches.length <= 1) return input;

  const seen = new Set();
  const removeIndexes = new Set();
  matches.forEach((match) => {
    if (seen.has(match.key)) {
      removeIndexes.add(match.index);
      return;
    }
    seen.add(match.key);
  });

  if (removeIndexes.size === 0) return input;

  let output = '';
  let cursor = 0;
  matches.forEach((match) => {
    if (!removeIndexes.has(match.index)) return;
    output += input.slice(cursor, match.index);
    cursor = match.index + match.text.length;
  });

  output += input.slice(cursor);
  return output;
}

function dedupePrerenderHead(html) {
  let cleaned = removeLaterMatchesByKey(html, /<title[\s\S]*?<\/title>/gi, () => 'title');

  cleaned = removeEarlierMatchesByKey(cleaned, /<meta\s+[^>]*>/gi, (tag) => {
    const property = getHtmlAttribute(tag, 'property').toLowerCase();
    if (property) return `meta:property:${property}`;

    const name = getHtmlAttribute(tag, 'name').toLowerCase();
    if (name) return `meta:name:${name}`;

    const charset = getHtmlAttribute(tag, 'charset').toLowerCase();
    if (charset) return 'meta:charset';

    return '';
  });

  cleaned = removeEarlierMatchesByKey(cleaned, /<link\s+[^>]*>/gi, (tag) => {
    const rel = getHtmlAttribute(tag, 'rel').toLowerCase();
    if (!rel) return '';

    if (rel === 'canonical') return 'link:canonical';
    if (rel === 'alternate') {
      return `link:alternate:${getHtmlAttribute(tag, 'hreflang').toLowerCase()}`;
    }
    if (rel === 'me') return `link:me:${getHtmlAttribute(tag, 'href')}`;

    return '';
  });

  cleaned = dedupeJsonLdScripts(cleaned);

  return cleaned;
}

function buildCanonicalPath(event, lang = 'en') {
  const eventDate = safeText(event.starts_at).slice(0, 10);
  const titlePart = slugify(event.title || `${event.location?.venue || 'event'} ${event.location?.city || ''}`);
  const base = lang === 'pt' ? EVENTS_ROUTE_PT : EVENTS_ROUTE_EN;
  return `${base}/${eventDate}-${titlePart}-${event.event_id}`;
}

function localizeCanonicalPath(event, lang = 'en') {
  const existingPath = safeText(event?.canonical_path);
  if (!existingPath) return buildCanonicalPath(event, lang);

  if (lang === 'pt') {
    if (existingPath.startsWith(`${EVENTS_ROUTE_PT}/`)) return existingPath;
    if (existingPath.startsWith(`${EVENTS_ROUTE_EN}/`)) {
      return `${EVENTS_ROUTE_PT}${existingPath.slice(EVENTS_ROUTE_EN.length)}`;
    }
  }

  if (existingPath.startsWith(`${EVENTS_ROUTE_EN}/`)) return existingPath;
  if (existingPath.startsWith(`${EVENTS_ROUTE_PT}/`)) {
    return `${EVENTS_ROUTE_EN}${existingPath.slice(EVENTS_ROUTE_PT.length)}`;
  }

  return buildCanonicalPath(event, lang);
}

function normalizeZenBitEvent(raw, lang = 'en') {
  const normalized = {
    ...raw,
    event_id: String(raw?.event_id ?? raw?.id ?? ''),
    title: safeText(raw?.title) || 'DJ Zen Eyer',
    starts_at: safeText(raw?.starts_at || raw?.datetime || ''),
    timezone: raw?.timezone || undefined,
    location: {
      venue: safeText(raw?.location?.venue),
      city: safeText(raw?.location?.city),
      region: safeText(raw?.location?.region),
      country: safeText(raw?.location?.country),
      latitude: raw?.location?.latitude ? String(raw.location.latitude) : undefined,
      longitude: raw?.location?.longitude ? String(raw.location.longitude) : undefined,
    },
    source_url: safeText(raw?.source_url || raw?.url),
  };

  const canonical_path = localizeCanonicalPath(normalized, lang);

  return {
    ...normalized,
    canonical_path,
    canonical_url: `${SITE_BASE_URL}${canonical_path}`,
  };
}

function normalizeBandsintownEvent(raw, lang = 'en') {
  const venue = raw?.venue || {};
  const startsAt = raw?.datetime || raw?.starts_at || '';
  const title =
    safeText(raw?.title) ||
    [safeText(raw?.artist?.name), safeText(venue?.name), safeText(venue?.city)]
      .filter(Boolean)
      .join(' at ')
      .trim() ||
    'DJ Zen Eyer';

  const normalized = {
    event_id: String(raw?.id ?? ''),
    title,
    starts_at: startsAt,
    timezone: raw?.timezone || undefined,
    location: {
      venue: safeText(venue?.name),
      city: safeText(venue?.city),
      region: safeText(venue?.region),
      country: safeText(venue?.country),
      latitude: venue?.latitude ? String(venue.latitude) : undefined,
      longitude: venue?.longitude ? String(venue.longitude) : undefined,
    },
    source_url: safeText(raw?.url),
    image: safeText(raw?.artist?.image_url || raw?.artist?.thumb_url || ''),
    offers: Array.isArray(raw?.offers)
      ? raw.offers
          .filter(Boolean)
          .map(o => ({
            url: safeText(o?.url),
            type: safeText(o?.type),
            status: safeText(o?.status),
          }))
          .filter(o => o.url)
      : [],
  };

  const canonical_path = buildCanonicalPath(normalized, lang);

  return {
    ...normalized,
    canonical_path,
    canonical_url: `${SITE_BASE_URL}${canonical_path}`,
    tickets: normalized.offers.map(o => o.url),
    description: safeText(raw?.description || ''),
    artists: Array.isArray(raw?.lineup)
      ? raw.lineup
          .filter(Boolean)
          .map(name => ({ name: safeText(name) }))
          .filter(a => a.name)
      : [],
  };
}

async function fetchEvents() {
  const cacheFile = join(CONFIG.distDir, '.prerender-bandsintown-cache.json');
  let raw = null;
  let source = 'NONE';

  // 1. Tentar API Interna do WordPress (Recomendado pelo Usuário)
  try {
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
      const res = await fetch(bandsintownArtistEndpoint, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 WordPress/Prerender'
        },
      });
      if (res.ok) {
        raw = await res.json();
        source = 'BANDSINTOWN_DIRECT';
      } else {
        const errorBody = await res.text().catch(() => 'No body');
        console.warn(`⚠️ Bandsintown respondeu ${res.status}: ${errorBody.slice(0, 50)}`);
      }
    } catch (e) {
      console.warn('⚠️ Falha ao conectar no Bandsintown diretamente.');
    }
  }

  // 3. Processar e Gerar Payload
  try {
    if (!raw && existsSync(cacheFile)) {
      console.warn(`⚠️ Usando cache local do prerender.`);
      return JSON.parse(readFileSync(cacheFile, 'utf8'));
    }

    const items = Array.isArray(raw) ? raw : [];
    
    // Internal API events are already normalized by zen-bit. Only normalize raw
    // Bandsintown fallback payloads from scratch.
    const normalizer = source === 'INTERNAL_API' ? normalizeZenBitEvent : normalizeBandsintownEvent;
    const eventsEn = items.map(item => normalizer(item, 'en')).filter(e => e.event_id);
    const eventsPt = items.map(item => normalizer(item, 'pt')).filter(e => e.event_id);
    const detailById = Object.fromEntries(eventsEn.map((event, index) => [event.event_id, { en: event, pt: eventsPt[index] }]));

    const payload = {
      fetchedAt: new Date().toISOString(),
      source,
      list: { en: eventsEn, pt: eventsPt },
      detailById,
    };

    if (items.length > 0) {
      writeFileSync(cacheFile, JSON.stringify(payload, null, 2), 'utf8');
      console.log(`🎫 Eventos: ${eventsEn.length} carregados via ${source}.`);
    }

    return payload;
  } catch (error) {
    console.warn(`⚠️ Erro ao processar eventos: ${error.message}`);
    return { fetchedAt: new Date().toISOString(), source: 'ERROR', list: { en: [], pt: [] }, detailById: {} };
  }
}

// Servidor Vite
let viteProcess = null;
function startDevServer() {
  return new Promise(async (resolve, reject) => {
    console.log('🚀 Iniciando Vite Preview...');
    try {
      await assertPortAvailable(PRERENDER_PORT);
    } catch (error) {
      reject(error);
      return;
    }

    const viteBin = join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    viteProcess = spawn(process.execPath, [viteBin, 'preview', '--port', String(PRERENDER_PORT), '--host'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: false,
      env: { ...process.env, FORCE_COLOR: '1', PRERENDER_MODE: 'true' },
    });
    viteProcess.on('error', reject);

    // Polling de conexão
    const start = Date.now();
    while (Date.now() - start < 60000) {
      try {
        const res = await fetch(CONFIG.serverBase);
        if (res.ok || res.status === 404) {
          console.log('✅ Servidor OK.');
          return resolve();
        }
      } catch (e) { }
      await wait(1000);
      process.stdout.write('.');
    }
    reject(new Error('Timeout Vite'));
  });
}


/**
 * Busca posts do WordPress para injetar no __PRERENDER_DATA__.
 * Inclui todos os campos necessários para lista e detalhe de post.
 */
async function fetchPosts() {
  const POSTS_FIELDS = 'id,date,modified,slug,title,content,excerpt,categories,tags,featured_image_src,featured_image_src_full,author_name';
  const POSTS_PER_PAGE = 10;
  const result = { list: { en: [], pt: [] }, bySlugEn: {}, bySlugPt: {} };

  await Promise.all(['en', 'pt'].map(async (lang) => {
    try {
      const url = `${SITE_BASE_URL}/wp-json/wp/v2/posts?per_page=${POSTS_PER_PAGE}&lang=${lang}&_fields=${encodeURIComponent(POSTS_FIELDS)}`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const data = await res.json();
        result.list[lang] = Array.isArray(data) ? data : [];
        console.log(`📰 Posts (${lang}): ${result.list[lang].length} carregados.`);
      } else {
        console.warn(`⚠️ Posts (${lang}): API respondeu ${res.status}.`);
      }
    } catch (e) {
      console.warn(`⚠️ Posts (${lang}): Falha ao buscar — ${e.message}`);
    }
  }));

  // Indexar por slug para responder requisições de detalhe no Puppeteer
  result.list.en.forEach(post => { if (post.slug) result.bySlugEn[post.slug] = post; });
  result.list.pt.forEach(post => { if (post.slug) result.bySlugPt[post.slug] = post; });

  return result;
}

const NEWS_ROUTE_EN = '/releases';
const NEWS_ROUTE_PT = '/pt/lancamentos';

function getRouteLang(route) {
  return route === '/pt' || route.startsWith('/pt/') ? 'pt' : 'en';
}

function isHomeRoute(route) {
  return route === '/' || route === '' || route === '/pt';
}

function isEventsListRoute(route) {
  return route === EVENTS_ROUTE_EN || route === EVENTS_ROUTE_PT;
}

function isNewsListRoute(route) {
  return route === NEWS_ROUTE_EN || route === NEWS_ROUTE_PT;
}

function buildPrerenderPayloadForRoute(route, bandsintownData, postsData) {
  const lang = getRouteLang(route);
  const payload = {
    fetchedAt: bandsintownData.fetchedAt,
  };

  if (isHomeRoute(route)) {
    payload.events = { [lang]: (bandsintownData.list?.[lang] || []).slice(0, PRERENDER_HOME_EVENTS_LIMIT) };
    payload.eventsLimit = PRERENDER_HOME_EVENTS_LIMIT;
    payload.eventsMode = 'upcoming';
    payload.eventsDays = PRERENDER_EVENTS_DAYS;
  } else if (isEventsListRoute(route)) {
    payload.events = { [lang]: bandsintownData.list?.[lang] || [] };
    payload.eventsLimit = PRERENDER_EVENTS_LIST_LIMIT;
    payload.eventsMode = 'upcoming';
    payload.eventsDays = PRERENDER_EVENTS_DAYS;
  } else if (isNewsListRoute(route)) {
    payload.news = { [lang]: postsData?.list?.[lang] || [] };
  }

  return payload;
}

async function prerender() {
  let browser = null;
  try {
    await startDevServer();
    const [bandsintownData, postsData] = await Promise.all([fetchEvents(), fetchPosts()]);

    // 🌟 Inject Dynamic Event Routes into Prerender List
    if (bandsintownData && bandsintownData.list) {
      ['en', 'pt'].forEach(lang => {
        if (Array.isArray(bandsintownData.list[lang])) {
          bandsintownData.list[lang].forEach(event => {
            if (event.canonical_path && !CONFIG.routes.includes(event.canonical_path)) {
              CONFIG.routes.push(event.canonical_path);
            }
          });
        }
      });
      console.log(`📋 Rotas dinâmicas de eventos injetadas. Total:`, CONFIG.routes.length);
    }

    // 🌟 Inject Dynamic Post Routes into Prerender List
    const NEWS_SLUG_BY_LANG = { en: 'releases', pt: 'pt/lancamentos' };
    if (postsData && postsData.list) {
      ['en', 'pt'].forEach(lang => {
        if (Array.isArray(postsData.list[lang])) {
          postsData.list[lang].forEach(post => {
            if (post.slug) {
              const path = `/${NEWS_SLUG_BY_LANG[lang]}/${post.slug}`;
              if (!CONFIG.routes.includes(path)) CONFIG.routes.push(path);
            }
          });
        }
      });
      console.log(`📋 Rotas dinâmicas de posts injetadas. Total:`, CONFIG.routes.length);
    }

    browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const createPrerenderPage = async () => {
      // Inicia uma nova página (tab) no Puppeteer
      const page = await browser.newPage();
      
      // Bloquear requests desnecessários para poupar memória no CI/CD
      await page.setRequestInterception(true);
      page.on('request', request => {
        const reqUrl = request.url();
        const resourceType = request.resourceType();
        
        // Bloqueia fontes, analytics e mídias pesadas que não afetam o DOM/SEO
        if (['font', 'media', 'websocket'].includes(resourceType) || reqUrl.includes('google-analytics') || reqUrl.includes('googletagmanager')) {
            request.abort();
            return;
        }

        const urlObj = new URL(reqUrl);
        const lang = (urlObj.searchParams.get('lang') || 'en').toLowerCase().startsWith('pt') ? 'pt' : 'en';

        if (reqUrl.includes('/wp-json/')) {
        let mockData = [];
        if (reqUrl.includes('/posts')) {
          const slugParam = urlObj.searchParams.get('slug');
          if (slugParam) {
            // Detalhe de post por slug — responde com o post específico
            const postsBySlug = lang === 'pt' ? postsData?.bySlugPt : postsData?.bySlugEn;
            const post = postsBySlug?.[slugParam] || null;
            mockData = post ? [post] : [];
          } else {
            // Lista de posts — responde com os posts reais paginados
            const perPage = Number(urlObj.searchParams.get('per_page') || 10);
            mockData = (postsData?.list?.[lang] || postsData?.list?.en || []).slice(0, perPage);
          }
        }
        if (reqUrl.includes('/products')) mockData = [];
        if (reqUrl.includes('/gamipress')) mockData = {};
        if (reqUrl.includes('/v1/menu')) mockData = menuData[lang] || menuData.en || [];

        if (reqUrl.includes('/zen-bit/v2/events/')) {
          const eventId = reqUrl.split('/zen-bit/v2/events/')[1]?.split('?')[0];
          const detail = bandsintownData.detailById?.[eventId]?.[lang] || null;
          mockData = { success: true, event: detail };
        } else if (reqUrl.includes('/zen-bit/v2/events')) {
          const list = bandsintownData.list?.[lang] || bandsintownData.list?.en || [];
          const params = urlObj.searchParams;
          const limit = Number(params.get('limit') || list.length || 0);
          const mode = params.get('mode') || 'upcoming';
          const now = Date.now();
          const filtered = list.filter(event => {
            const t = Date.parse(event.starts_at);
            if (!Number.isFinite(t)) return true;
            if (mode === 'past') return t < now;
            if (mode === 'upcoming') return t >= now;
            return true;
          }).slice(0, limit || list.length);
          mockData = { success: true, count: filtered.length, mode, events: filtered };
        }

        if (reqUrl.includes('/zen-seo/v1/settings')) mockData = { success: true, data: { real_name: "DJ Zen Eyer", default_og_image: "" } };

        request.respond({
          status: 200,
          contentType: 'application/json',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'X-Requested-With': 'XMLHttpRequest' // Adicionado para tentar contornar bloqueios
          },
          body: JSON.stringify(mockData)
        });
      } else if (reqUrl.includes('/wp-content/themes/zentheme/dist/')) {
        // ⭐ REDIRECT THEME PATHS TO LOCALHOST: Ensure assets load during prerender
        const localPath = reqUrl.split('/wp-content/themes/zentheme/dist/')[1];
        if (localPath.includes('.htaccess')) {
          request.abort();
          return;
        }
        const localUrl = `${CONFIG.serverBase}/${localPath}`;
        request.continue({ url: localUrl });
      } else {
        request.continue();
      }
    });

      page.on('console', msg => {
        if (msg.type() !== 'error') return;
        const text = msg.text();
        // "Failed to load resource" = network-level failure (external APIs unreachable in CI); not a JS error
        if (text.startsWith('Failed to load resource:')) return;
        if (text.includes('.png') || text.includes('.svg') || text.includes('.jpg')) return;
        console.log(`[JS ERROR]: ${text}`);
      });

      page.on('pageerror', err => {
        const msg = err.toString();
        // DOMException NetworkError = external fetch blocked in CI headless env; expected, not a render failure
        if (msg.includes('NetworkError') || msg.includes('Failed to fetch')) return;
        console.log(`[PAGE FATAL ERROR]: ${msg}`);
      });

      return page;
    };

    let successCount = 0;
    const BATCH_SIZE = 5; // Process 5 routes concurrently to speed up CI/CD without blowing up memory
    const PRERENDER_WAIT_MS = Math.max(1, parseInt(process.env.PRERENDER_WAIT_MS || '3000', 10) || 3000);

    for (let i = 0; i < CONFIG.routes.length; i += BATCH_SIZE) {
      const batch = CONFIG.routes.slice(i, i + BATCH_SIZE);
      console.log(`\n⏳ Processando lote ${Math.floor(i / BATCH_SIZE) + 1} de ${Math.ceil(CONFIG.routes.length / BATCH_SIZE)}...`);
      
      await Promise.all(batch.map(async (route) => {
        const cleanRoute = route.replace(/^\//, '');
        const url = `${CONFIG.serverBase}/${cleanRoute}`;

        let outputPath;
        if (route === '/' || route === '') {
          outputPath = join(CONFIG.distDir, 'index.html');
        } else {
          const targetDir = join(CONFIG.distDir, cleanRoute);
          if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
          outputPath = join(targetDir, 'index.html');
        }

        let page = null;
        let previousHtml = null;
        try {
          if (route !== '/' && route !== '' && existsSync(outputPath)) {
            previousHtml = readFileSync(outputPath, 'utf8');
            unlinkSync(outputPath);
          }

          const prerenderPayloadObj = buildPrerenderPayloadForRoute(route, bandsintownData, postsData);
          page = await createPrerenderPage();
          
          // Injeta o __PRERENDER_DATA__ na window do navegador Headless
          await page.evaluateOnNewDocument((payload) => {
            window.__PRERENDER_DATA__ = payload;
          }, prerenderPayloadObj);

          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

          try {
            await page.waitForSelector('h1', { timeout: 10000 });
            await wait(PRERENDER_WAIT_MS);
          } catch (e) {
            console.warn(`⚠️ Warning: Timeout on ${route}`);
          }

          const html = await page.content();

          if (html.length > 500) {
            const prerenderPayload = JSON.stringify(prerenderPayloadObj).replace(/<\/script>/gi, '<\\/script>');
            const prerenderInlineScript = `<script>window.__PRERENDER_DATA__=${prerenderPayload};</script>`;

            let finalHtml = html.includes('name="prerender-generated"')
              ? html
              : html.replace('<head>', `<head>\n<meta name="prerender-generated" content="true">`);

            if (finalHtml.includes('window.__PRERENDER_DATA__')) {
              finalHtml = finalHtml.replace(
                /<script>window\.__PRERENDER_DATA__=.*?<\/script>/s,
                prerenderInlineScript
              );
            } else {
              finalHtml = finalHtml.replace('</head>', `${prerenderInlineScript}\n</head>`);
            }

            finalHtml = dedupePrerenderHead(finalHtml);

            writeFileSync(outputPath, finalHtml, 'utf8');
            console.log(`✅ ${route} (${finalHtml.length}b)`);
            successCount++;
          }
        } catch (error) {
          console.error(`❌ Erro em ${route}: ${error.message}`);
          if (previousHtml !== null && !existsSync(outputPath)) {
            writeFileSync(outputPath, previousHtml, 'utf8');
            console.warn(`HTML anterior preservado para ${route}`);
          }
        } finally {
          if (page && !page.isClosed()) {
            await page.close();
          }
        }
      }));
    }

    console.log(`\n🎉 Prerender concluído: ${successCount}/${CONFIG.routes.length} rotas.`);

  } catch (error) {
    console.error('FATAL:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    if (viteProcess) viteProcess.kill();
    process.exit(0);
  }
}

prerender();
