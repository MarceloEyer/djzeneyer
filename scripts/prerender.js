// scripts/prerender.js
// v14.1 - DADOS REAIS + API SAFE + NOVAS PÁGINAS

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';
import { createServer } from 'http';

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;
const DIST_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../dist'
);
const PUBLIC_PATH = '/wp-content/themes/zentheme/dist';

// CONFIGURAÇÃO DAS ROTAS (EN + PT + SHOP + NOVAS PÁGINAS)
const ROUTES = [
  // --- INGLÊS (Main) ---
  { path: '/', minSize: 3000, waitFor: 'header, h1, footer' },
  { path: '/events', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/music', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/about', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/zentribe', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/work-with-me', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/faq', minSize: 3000, waitFor: 'h1, footer' },
  
  // Novas Páginas (Jurídico & Mídia)
  { path: '/media', minSize: 2000, waitFor: 'h1, footer' },
  { path: '/privacy-policy', minSize: 2000, waitFor: 'h1, footer' },
  { path: '/terms', minSize: 2000, waitFor: 'h1, footer' },
  { path: '/conduct', minSize: 2000, waitFor: 'h1, footer' },

  // --- PORTUGUÊS ---
  { path: '/pt', minSize: 3000, waitFor: 'header, h1, footer' },
  { path: '/pt/eventos', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/pt/musica', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/pt/sobre', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/pt/tribo-zen', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/pt/trabalhe-comigo', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/pt/faq', minSize: 3000, waitFor: 'h1, footer' },
  
  // Novas Páginas PT
  { path: '/pt/midia', minSize: 2000, waitFor: 'h1, footer' },
  { path: '/pt/politica-de-privacidade', minSize: 2000, waitFor: 'h1, footer' },
  { path: '/pt/termos', minSize: 2000, waitFor: 'h1, footer' },
  { path: '/pt/conduta', minSize: 2000, waitFor: 'h1, footer' },

  // --- LOJA (Dados Reais) ---
  // REMOVIDO DO PRERENDER PARA EVITAR PREÇOS DESATUALIZADOS
  // { path: '/shop', minSize: 3000, waitFor: 'h1, .card, footer' },
  // { path: '/pt/loja', minSize: 3000, waitFor: 'h1, .card, footer' },
];

// ... (Resto do código permanece IDÊNTICO ao v14.0 que você mandou) ...
// Só vou repetir as funções abaixo para garantir que você tenha o arquivo funcional
// Se quiser, pode apenas atualizar o array ROUTES acima no seu arquivo.

// Normalizar URLs para evitar duplicatas no cache
function normalizeUrl(path) {
  // Remove query params de tracking (?utm_*, ?fbclid, etc) e barra final
  return path.split('?')[0].replace(/\/$/, '') || '/';
}

// Futuro: Verificar se a loja deve ser pulada (timeout de API)
async function shouldSkipShop(page) {
  // Verificar se produtos foram carregados via API
  const hasProducts = await page.evaluate(() => {
    return document.querySelectorAll('.card').length > 0;
  });

  if (!hasProducts) {
    console.warn('⚠️  Loja sem produtos - provavelmente timeout de API');
    return true;
  }
  return false;
}

function validateHTML(content, route) {
  const errors = [];
  const warnings = [];

  if (!/<h1[^>]*>[\s\S]+?<\/h1>/.test(content)) {
    errors.push('Missing <h1> tag');
  }
  if (!/<footer/i.test(content) && !/footer/i.test(content)) {
    errors.push('Missing footer element');
  }
   
  if (route.path.includes('shop') || route.path.includes('loja')) {
    if (!content.includes('price') && !content.includes('R$')) {
      warnings.push('Shop page might be missing products (API timeout?)');
    }
  }

  const size = Buffer.byteLength(content, 'utf8');
  if (size < route.minSize) {
    warnings.push(`HTML size (${size} bytes) below expected minimum`);
  }
  return { errors, warnings, size };
}

async function waitForElement(page, selector, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await page.waitForSelector(selector, { timeout: 1000 });
      return true;
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  return false;
}

async function waitForContent(page, route) {
  const selectors = route.waitFor.split(',').map(s => s.trim());
  const elementTimeout = (route.path.includes('shop') || route.path.includes('loja')) ? 15000 : 8000;
  
  const found = [];
  for (const selector of selectors) {
    const success = await waitForElement(page, selector, elementTimeout);
    if (success) found.push(selector);
  }
  
  const hasFooter = found.some(s => s.includes('footer'));
  const hasContent = found.some(s => s.includes('h1') || s.includes('card'));
  
  if (!hasFooter || !hasContent) {
    console.warn(`⚠️  Incompleto: Encontrado=[${found.join(', ')}]`);
    return false;
  }
  
  // Aguardar XHRs finais (1s de pausa)
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
}

async function prerenderRoute(page, route, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${BASE_URL}${route.path}`;
      console.log(`\n🚏 ROTA: ${route.path}`);

      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded', // Mais confiável que networkidle0
        timeout: 60000
      });

      if (!response || !response.ok()) {
        throw new Error(`HTTP ${response?.status()}`);
      }

      const loaded = await waitForContent(page, route);
      if (!loaded) throw new Error('Conteúdo visual incompleto');

      const content = await page.content();
      const validation = validateHTML(content, route);
      
      if (validation.errors.length > 0) throw new Error(`Validação: ${validation.errors.join(', ')}`);
      if (validation.warnings.length > 0) console.warn(`   ⚠️ Avisos: ${validation.warnings.join(', ')}`);

      const routePath = route.path === '/' ? '/index.html' : `${route.path}/index.html`;
      const filePath = path.join(DIST_PATH, routePath);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, content);
      
      console.log(`✅ Sucesso (${validation.size} bytes)`);
      return true;

    } catch (err) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Retry exponencial
      console.error(`   Tentativa ${attempt} falhou: ${err.message}`);

      if (attempt === retries) return false;

      console.log(`   Aguardando ${delay}ms antes de retentar...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      await page.goto('about:blank'); 
    }
  }
  return false;
}

async function prerender() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   🏗️  PRERENDER v14.1 - API SAFE + NEW PAGES          ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ ERRO: dist/ não encontrado!');
    process.exit(1);
  }

  const app = express();
  app.use(PUBLIC_PATH, express.static(DIST_PATH));
  app.use(express.static(DIST_PATH));
  app.use('*', (req, res) => res.sendFile(path.join(DIST_PATH, 'index.html')));

  const server = createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`📡 Servidor: ${BASE_URL}`);

  let browser;
  const results = { success: [], failed: [] };

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });

    const page = await browser.newPage();
    
    await page.evaluateOnNewDocument(() => {
      window.wpData = {
        siteUrl: 'https://djzeneyer.com',
        restUrl: 'https://djzeneyer.com/wp-json/',
        themeUrl: 'https://djzeneyer.com/wp-content/themes/zentheme',
        nonce: '',
        isUserLoggedIn: false
      };
    });

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      const url = req.url().toLowerCase();

      // GOLDEN RULE: Permitir API calls
      if (['xhr', 'fetch', 'document', 'script'].includes(type)) {
        req.continue();
        return;
      }

      const blockTypes = ['image', 'media', 'font', 'stylesheet'];
      const blockUrls = ['google-analytics', 'facebook', 'googletagmanager'];

      if (blockTypes.includes(type) || blockUrls.some(u => url.includes(u))) {
        req.abort();
      } else {
        req.continue();
      }
    });

    for (const route of ROUTES) {
      const success = await prerenderRoute(page, route, 2);
      if (success) results.success.push(route.path);
      else results.failed.push(route.path);
    }

  } catch (err) {
    console.error('\n❌ ERRO GERAL:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  console.log('\n' + '═'.repeat(60));
  if (results.failed.length > 0) {
    console.warn(`⚠️  ${results.failed.length} rotas falharam.`);
    process.exit(0); 
  } else {
    console.log(`🎉 Sucesso total!`);
    process.exit(0);
  }
}

prerender();