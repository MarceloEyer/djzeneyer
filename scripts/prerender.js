// scripts/prerender.js
// v8.0 - BULLETPROOF VERSION

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

const ROUTES = [
  { path: '/', minSize: 10000, waitFor: 'header, h1, footer' },
  { path: '/events', minSize: 8000, waitFor: 'h1, .event-card, footer' },
  { path: '/music', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/about', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/zentribe', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/shop', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/work-with-me', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/media', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/faq', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/conduct', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/privacy-policy', minSize: 8000, waitFor: 'h1, footer' },
  { path: '/terms', minSize: 8000, waitFor: 'h1, footer' }
];

// Validação de HTML
function validateHTML(content, route) {
  const errors = [];
  const warnings = [];

  // CRITICAL: Deve ter H1
  if (!/<h1[^>]*>[\s\S]+?<\/h1>/.test(content)) {
    errors.push('Missing <h1> tag');
  }

  // CRITICAL: Deve ter footer
  if (!/<footer/i.test(content) && !/footer/i.test(content)) {
    errors.push('Missing footer element');
  }

  // CRITICAL: Não pode ter mensagens de dev
  if (content.includes('React Development')) {
    errors.push('Contains development environment message');
  }

  // WARNING: Deve ter meta tags
  if (!/<meta name="description"/i.test(content)) {
    warnings.push('Missing meta description');
  }

  // WARNING: Tamanho mínimo
  const size = Buffer.byteLength(content, 'utf8');
  if (size < route.minSize) {
    warnings.push(`HTML size (${size} bytes) below expected minimum (${route.minSize} bytes)`);
  }

  return { errors, warnings, size };
}

// Espera elemento com retry
async function waitForElement(page, selector, timeout = 20000) {
  const start = Date.now();
  
  while (Date.now() - start < timeout) {
    try {
      await page.waitForSelector(selector, { timeout: 2000 });
      return true;
    } catch (e) {
      // Retry
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return false;
}

// Espera conteúdo carregar
async function waitForContent(page, route) {
  console.log(`⏳ Esperando conteúdo carregar...`);
  
  // Tenta esperar por múltiplos seletores
  const selectors = route.waitFor.split(',').map(s => s.trim());
  const found = [];
  const missing = [];
  
  for (const selector of selectors) {
    const success = await waitForElement(page, selector, 15000);
    if (success) {
      found.push(selector);
      console.log(`   ✓ ${selector}`);
    } else {
      missing.push(selector);
      console.log(`   ✗ ${selector} (timeout)`);
    }
  }
  
  // Pelo menos h1 E footer devem existir
  const hasH1 = found.some(s => s.includes('h1'));
  const hasFooter = found.some(s => s.includes('footer'));
  
  if (!hasH1 || !hasFooter) {
    console.warn(`⚠️ Conteúdo crítico não carregou: h1=${hasH1}, footer=${hasFooter}`);
    return false;
  }
  
  // Extra: espera um pouco para garantir que APIs terminaram
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return true;
}

async function prerenderRoute(page, route, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${BASE_URL}${route.path}`;
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🚏 ROTA: ${route.path} (Tentativa ${attempt}/${retries})`);
      console.log(`${'='.repeat(60)}`);
      console.log(`➡️  URL: ${url}`);

      // Navega
      const response = await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 60000
      });

      if (!response || !response.ok()) {
        throw new Error(`HTTP ${response?.status()} - ${response?.statusText()}`);
      }

      // Espera conteúdo
      const loaded = await waitForContent(page, route);
      if (!loaded) {
        throw new Error('Conteúdo crítico não carregou no tempo esperado');
      }

      // Pega HTML
      const content = await page.content();

      // Valida
      const validation = validateHTML(content, route);
      
      console.log(`\n📊 Validação:`);
      console.log(`   Tamanho: ${validation.size.toLocaleString()} bytes`);
      
      if (validation.errors.length > 0) {
        console.log(`   ❌ Erros:`);
        validation.errors.forEach(e => console.log(`      - ${e}`));
        throw new Error('Validação falhou: ' + validation.errors.join(', '));
      }
      
      if (validation.warnings.length > 0) {
        console.log(`   ⚠️  Avisos:`);
        validation.warnings.forEach(w => console.log(`      - ${w}`));
      }

      // Salva arquivo
      const routePath = route.path === '/' ? '/index.html' : `${route.path}/index.html`;
      const filePath = path.join(DIST_PATH, routePath);
      const dir = path.dirname(filePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`\n💾 Salvo em: ${filePath}`);
      console.log(`✅ ${route.path} gerado com sucesso!\n`);
      
      return true;

    } catch (err) {
      console.error(`\n❌ Erro na tentativa ${attempt}:`, err.message);
      
      if (attempt < retries) {
        console.log(`🔄 Tentando novamente em 3s...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error(`❌ FALHA FINAL em ${route.path} após ${retries} tentativas`);
        return false;
      }
    }
  }
  
  return false;
}

async function prerender() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║   🏗️  PRERENDER v8.0 - BULLETPROOF EDITION          ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  console.log(`📁 DIST_PATH: ${DIST_PATH}`);
  console.log(`🌐 PUBLIC_PATH: ${PUBLIC_PATH}\n`);

  // Valida dist/
  if (!fs.existsSync(DIST_PATH)) {
    console.error('❌ ERRO: dist/ não encontrado! Execute npm run build primeiro.');
    process.exit(1);
  }

  // Sobe servidor
  const app = express();
  app.use(PUBLIC_PATH, express.static(DIST_PATH));
  app.use(express.static(DIST_PATH));
  app.use('*', (req, res) => {
    const indexPath = path.join(DIST_PATH, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return res.status(500).send('index.html não encontrado');
    }
    res.sendFile(indexPath);
  });

  const server = createServer(app);
  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) reject(err);
      else {
        console.log(`📡 Servidor rodando em ${BASE_URL}\n`);
        resolve();
      }
    });
  });

  let browser;
  const results = { success: [], failed: [] };

  try {
    // Lança Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // Injeta config WordPress
    await page.evaluateOnNewDocument(() => {
      window.wpData = {
        siteUrl: 'https://djzeneyer.com',
        restUrl: 'https://djzeneyer.com/wp-json/',
        themeUrl: 'https://djzeneyer.com/wp-content/themes/zentheme',
        nonce: '',
        isUserLoggedIn: false
      };
    });

    // Logs do browser
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error' && !text.includes('favicon')) {
        console.error(`   [Browser Error] ${text}`);
      }
    });

    page.on('pageerror', (err) => {
      console.error(`   [Page Crash] ${err.toString()}`);
    });

    // Otimiza rede (não baixa imagens/fonts durante build)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (type === 'image' || type === 'font' || type === 'media') {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Processa cada rota
    for (const route of ROUTES) {
      const success = await prerenderRoute(page, route, 2);
      
      if (success) {
        results.success.push(route.path);
      } else {
        results.failed.push(route.path);
      }
    }

  } catch (err) {
    console.error('\n❌ ERRO FATAL:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  // Relatório final
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║              📊 RELATÓRIO FINAL                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  
  console.log(`✅ Sucesso: ${results.success.length}/${ROUTES.length}`);
  if (results.success.length > 0) {
    results.success.forEach(r => console.log(`   ✓ ${r}`));
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Falhas: ${results.failed.length}`);
    results.failed.forEach(r => console.log(`   ✗ ${r}`));
  }
  
  console.log('\n' + '═'.repeat(60) + '\n');

  if (results.failed.length > 0) {
    console.error('❌ Build FALHOU - Algumas rotas não foram pré-renderizadas');
    process.exit(1);
  } else {
    console.log('🎉 Build COMPLETO - Todas as rotas pré-renderizadas!\n');
    process.exit(0);
  }
}

prerender();