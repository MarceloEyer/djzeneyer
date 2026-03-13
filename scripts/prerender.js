import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, URL } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BANDSINTOWN_ARTIST_ID = process.env.BANDSINTOWN_ARTIST_ID || 'id_15619775';
const BANDSINTOWN_APP_ID = process.env.BANDSINTOWN_APP_ID || 'f8f1216ea03be95a3ea91c7ebe7117e7';
const SITE_BASE_URL = process.env.SITE_BASE_URL || 'https://djzeneyer.com';
const INTERNAL_API_EVENTS = `${SITE_BASE_URL}/wp-json/zen-bit/v2/events?mode=upcoming&days=365`;
const EVENTS_ROUTE_EN = '/zouk-events';
const EVENTS_ROUTE_PT = '/pt/eventos-zouk';
const bandsintownArtistEndpoint = `https://rest.bandsintown.com/artists/${BANDSINTOWN_ARTIST_ID}/events?app_id=${BANDSINTOWN_APP_ID}&date=upcoming`;
console.log(`📡 Bandsintown Endpoint (Fallback): ${bandsintownArtistEndpoint}`);
console.log(`📡 Internal API Endpoint: ${INTERNAL_API_EVENTS}`);

// 1. Carregar Rotas (SSOT — src/config/routes-slugs.json)
let routesList = [];
const ROUTES_DATA_PATH = join(__dirname, '..', 'src', 'config', 'routes-slugs.json');
try {
  if (existsSync(ROUTES_DATA_PATH)) {
    const data = JSON.parse(readFileSync(ROUTES_DATA_PATH, 'utf8'));
    data.routes.forEach(r => {
      // Ignora rotas dinâmicas (com :param) — o prerender só cobre rotas estáticas
      if (!r.en.includes(':') && !r.pt.includes(':')) {
        routesList.push(r.en === '' ? '/' : `/${r.en}`);
        routesList.push(r.pt === '' ? '/pt' : `/pt/${r.pt}`);
      }
    });
    console.log(`📋 SSOT: ${routesList.length} rotas (EN + PT).`);
  } else {
    throw new Error('SSOT routes-slugs.json não encontrado em src/config/');
  }
} catch (e) {
  console.error('❌ Erro na SSOT:', e.message);
  process.exit(1);
}

const CONFIG = {
  serverBase: 'http://localhost:5173',
  distDir: join(__dirname, '..', 'dist'),
  timeout: 60000,
  waitForSelector: '#root',
  routes: routesList
};

const wait = ms => new Promise(r => setTimeout(r, ms));

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

function buildCanonicalPath(event, lang = 'en') {
  const eventDate = safeText(event.starts_at).slice(0, 10);
  const titlePart = slugify(event.title || `${event.location?.venue || 'event'} ${event.location?.city || ''}`);
  const base = lang === 'pt' ? EVENTS_ROUTE_PT : EVENTS_ROUTE_EN;
  return `${base}/${eventDate}-${titlePart}-${event.event_id}`;
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
    
    // Se vier da API interna, já está normalizado. Mas passamos pelo normalizeBandsintownEvent 
    // novamente para garantir que a estrutura 'detailById' (en/pt) seja criada corretamente
    // se o prerender precisar de campos específicos de tradução.
    const eventsEn = items.map(item => normalizeBandsintownEvent(item, 'en')).filter(e => e.event_id);
    const eventsPt = items.map(item => normalizeBandsintownEvent(item, 'pt')).filter(e => e.event_id);
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
    const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    viteProcess = spawn(command, ['vite', 'preview', '--port', '5173', '--host'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: process.platform === 'win32',
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

async function prerender() {
  let browser = null;
  try {
    await startDevServer();
    const bandsintownData = await fetchEvents();

    browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // 🛡️ API INTERCEPTION: Global for all pages
    await page.evaluateOnNewDocument((payload) => {
      window.__PRERENDER_DATA__ = payload;
    }, {
      events: bandsintownData.list,
      fetchedAt: bandsintownData.fetchedAt,
    });

    await page.setRequestInterception(true);
    page.on('request', request => {
      const reqUrl = request.url();
      const urlObj = new URL(reqUrl);
      const lang = (urlObj.searchParams.get('lang') || 'en').toLowerCase().startsWith('pt') ? 'pt' : 'en';

        if (reqUrl.includes('/wp-json/')) {
        let mockData = [];
        if (reqUrl.includes('/posts')) {
          mockData = [{ 
            id: 1, 
            title: { rendered: 'Build Preview' }, 
            slug: 'preview', 
            date: new Date().toISOString(),
            excerpt: { rendered: 'Prerender Preview Excerpt' },
            content: { rendered: '<p>Prerender Preview Content</p>' },
            author_name: 'System'
          }];
        }
        if (reqUrl.includes('/products')) mockData = [];
        if (reqUrl.includes('/gamipress')) mockData = {};
        if (reqUrl.includes('/v1/menu')) mockData = [];

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
      const text = msg.text();
      // Silenciar erros de assets (imagens/svgs) para não sujar o log principal
      if (msg.type() === 'error' && !text.includes('.png') && !text.includes('.svg') && !text.includes('.jpg')) {
        console.log(`[JS ERROR]: ${text}`);
      }
    });

    page.on('pageerror', err => {
        console.log(`[PAGE FATAL ERROR]: ${err.toString()}`);
    });

    let successCount = 0;

    for (const route of CONFIG.routes) {
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

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        try {
          // Espera o h1 ou filhos do root carregar
          await page.waitForSelector('#root > *', { timeout: 10000 });
          await wait(2500); // Respiro para React Helmet async injetar tags no <head> e i18n
        } catch (e) {
          console.warn(`⚠️ Warning: Timeout on ${route}`);
        }

        const html = await page.content();

        if (html.length > 500) {
          // ⭐ VITE BASE PATH: Agora o Vite já gera caminhos como '/wp-content/themes/zentheme/dist/assets/...'
          // Não precisamos mais do replace manual, apenas injetamos a meta tag.
          const finalHtml = html.includes('name="prerender-generated"')
            ? html
            : html.replace('<head>', `<head>\n<meta name="prerender-generated" content="true">`);

          writeFileSync(outputPath, finalHtml, 'utf8');
          console.log(`✅ ${route} (${finalHtml.length}b)`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Erro em ${route}: ${error.message}`);
      }
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
