// scripts/prerender.js
// v13.0 - MULTILINGUAL FIX (Inclui rotas PT para resolver erros 5xx)

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

// CONFIGURAÇÃO DAS ROTAS (EN + PT)
const ROUTES = [
  // --- INGLÊS (Main) ---
  { path: '/', minSize: 3000, waitFor: 'header, h1, footer' },
  { path: '/events', minSize: 3000, waitFor: 'h1, footer' }, 
  { path: '/music', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/about', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/zentribe', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/work-with-me', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/faq', minSize: 3000, waitFor: 'h1, footer' },

  // --- PORTUGUÊS (Adicionado para corrigir erros 5xx/No Outgoing Links) ---
  { path: '/pt', minSize: 3000, waitFor: 'header, h1, footer' },
  { path: '/pt/eventos', minSize: 3000, waitFor: 'h1, footer' }, 
  { path: '/pt/musica', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/pt/sobre', minSize: 3000, waitFor: 'h1, footer' }, // Confirme se a URL é 'sobre' ou 'minha-filosofia'
  { path: '/pt/tribo-zen', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/pt/trabalhe-comigo', minSize: 3000, waitFor: 'h1, footer' },
  { path: '/pt/faq', minSize: 3000, waitFor: 'h1, footer' },
  
  // Rotas que apareceram no Ahrefs (Orphan/Errors)
  { path: '/pt/minha-filosofia', minSize: 3000, waitFor: 'h1, footer' },

  // Rotas Temporariamente Desativadas (Loja/Admin)
  // { path: '/shop', minSize: 3000, waitFor: 'h1, .product, footer' },
  // { path: '/pt/loja', minSize: 3000, waitFor: 'h1, .product, footer' },
];

function validateHTML(content, route) {
  const errors = [];
  const warnings = [];

  if (!/<h1[^>]*>[\s\S]+?<\/h1>/.test(content)) {
    errors.push('Missing <h1> tag');
  }
  if (!/<footer/i.test(content) && !/footer/i.test(content)) {
    errors.push('Missing footer element');
  }
  if (content.includes('React Development')) {
    errors.push('Contains development environment message');
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
  const found = [];
  for (const selector of selectors) {
    const success = await waitForElement(page, selector, 8000);
    if (success) found.push(selector);
  }
  const hasFooter = found.some(s => s.includes('footer'));
  const hasContent = found.some(s => s !== 'footer');
  
  if (!hasFooter || !hasContent) {
    console.warn(`⚠️  Incompleto: Encontrado=[${found.join(', ')}]`);
    return false;
  }
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
}

async function prerenderRoute(page, route, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${BASE_URL}${route.path}`;
      console.log(`\n🚏 ROTA: ${route.path}`);

      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded', 
        timeout: 30000
      });

      if (!response || !response.ok()) {
        throw new Error(`HTTP ${response?.status()}`);
      }

      const loaded = await waitForContent(page, route);
      if (!loaded) throw new Error('Conteúdo visual incompleto');

      const content = await page.content();
      const validation = validateHTML(content, route);
      
      if (validation.errors.length > 0) {
        throw new Error(`Validação: ${validation.errors.join(', ')}`);
      }

      const routePath = route.path === '/' ? '/index.html' : `${route.path}/index.html`;
      const filePath = path.join(DIST_PATH, routePath);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, content);
      
      console.log(`✅ Sucesso (${validation.size} bytes)`);
      return true;

    } catch (err) {
      console.error(`   Tentativa ${attempt} falhou: ${err.message}`);
      if (attempt === retries) return false;
      await page.goto('about:blank'); 
    }
  }
  return false;
}

async function prerender() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   🏗️  PRERENDER v13.0 - MULTILINGUAL EDITION        ║');
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
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-web-security', 
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    const page = await browser.newPage();
    await page.setCacheEnabled(false);

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
      const url = req.url().toLowerCase();
      const type = req.resourceType();
      if (
        type === 'image' || type === 'media' || type === 'font' ||
        url.includes('google-analytics') || url.includes('facebook') ||
        url.includes('googletagmanager')
      ) {
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
    console.warn(`⚠️  Atenção: ${results.failed.length} rotas falharam, mas o deploy continuará.`);
    process.exit(0); 
  } else {
    console.log(`🎉 Sucesso total!`);
    process.exit(0);
  }
}

prerender();