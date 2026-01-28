// scripts/prerender.js
// v15.0 - UNIFIED: Usa mesma estrutura do routes.ts como única fonte da verdade

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';
import { createServer } from 'http';

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;
const DIST_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const PUBLIC_PATH = '/wp-content/themes/zentheme/dist';

// ============================================================================
// ROUTES CONFIGURATION (Synced with src/config/routes.ts)
// ============================================================================

const ROUTES_CONFIG = [
  { en: '', pt: '' },  // Home
  { en: 'about', pt: 'sobre' },
  { en: 'events', pt: 'eventos' },
  { en: 'music', pt: 'musica' },
  { en: 'news', pt: 'noticias' },
  { en: 'zentribe', pt: 'tribo-zen' },  // Using first alias
  { en: 'work-with-me', pt: 'trabalhe-comigo' },
  { en: 'faq', pt: 'perguntas-frequentes' },
  { en: 'my-philosophy', pt: 'minha-filosofia' },
  { en: 'media', pt: 'na-midia' },
  { en: 'support-the-artist', pt: 'apoie-o-artista' },
  { en: 'privacy-policy', pt: 'politica-de-privacidade' },
  { en: 'return-policy', pt: 'reembolso' },
  { en: 'terms', pt: 'termos' },
  { en: 'conduct', pt: 'regras-de-conduta' },
];

// Routes to skip from prerendering
const SKIP_PRERENDER = [
  'shop', 'loja',  // Skip shop - dynamic prices
  'cart', 'carrinho',
  'checkout', 'finalizar-compra',
  'dashboard', 'painel',
  'my-account', 'minha-conta',
  'tickets-checkout', 'finalizar-ingressos',
  'order-complete', 'pedido-completo',
];

// Build routes array from config
const ROUTES = [];

ROUTES_CONFIG.forEach(route => {
  const shouldSkip = SKIP_PRERENDER.some(skip => 
    route.en.includes(skip) || route.pt.includes(skip)
  );
  
  if (shouldSkip) return;

  // Add EN route
  ROUTES.push({
    path: route.en === '' ? '/' : `/${route.en}`,
    minSize: route.en === '' ? 3000 : 2000,
    waitFor: 'h1, footer'
  });

  // Add PT route
  ROUTES.push({
    path: route.pt === '' ? '/pt' : `/pt/${route.pt}`,
    minSize: 2000,
    waitFor: 'h1, footer'
  });
});

console.log(`
╔═══════════════════════════════════════════════════════╗
║   🏗️  PRERENDER v15.0 - UNIFIED WITH ROUTES.TS       ║
╚═══════════════════════════════════════════════════════╝

📡 Servidor: ${BASE_URL}
📄 Rotas para pre-render: ${ROUTES.length}
`);

// ============================================================================
// HELPERS
// ============================================================================

function normalizeUrl(path) {
  return path.split('?')[0].replace(/\/$/, '') || '/';
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

  const size = Buffer.byteLength(content, 'utf8');
  if (size < route.minSize) {
    warnings.push(`HTML size (${size} bytes) below expected minimum`);
  }

  return { errors, warnings, size };
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function prerender() {
  let server;
  let browser;

  try {
    const app = express();
    app.use(express.static(DIST_PATH));
    app.get('*', (req, res) => {
      res.sendFile(path.join(DIST_PATH, 'index.html'));
    });

    server = createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`✅ Servidor Express rodando na porta ${PORT}\n`);

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    let successCount = 0;
    let errorCount = 0;

    for (const route of ROUTES) {
      try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (compatible; Prerenderer/15.0)');

        const url = `${BASE_URL}${route.path}`;
        console.log(`\n🔍 Renderizando: ${route.path}`);

        await page.goto(url, { 
          waitUntil: 'networkidle0', 
          timeout: 30000 
        });

        if (route.waitFor) {
          await page.waitForSelector(route.waitFor.split(',')[0].trim(), { 
            timeout: 10000 
          });
        }

        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

        const content = await page.content();
        const validation = validateHTML(content, route);

        if (validation.errors.length > 0) {
          console.error(`❌ Erros de validação:`, validation.errors.join(', '));
          errorCount++;
        } else {
          const fileName = normalizeUrl(route.path).replace(/\//g, '_') || 'index';
          const outputPath = path.join(DIST_PATH, `${fileName}_prerendered.html`);
          fs.writeFileSync(outputPath, content, 'utf-8');
          console.log(`✅ Salvo: ${fileName}_prerendered.html (${validation.size} bytes)`);
          
          if (validation.warnings.length > 0) {
            console.warn(`⚠️  Avisos:`, validation.warnings.join(', '));
          }
          
          successCount++;
        }

        await page.close();
      } catch (error) {
        console.error(`❌ Erro ao renderizar ${route.path}:`, error.message);
        errorCount++;
      }
    }

    console.log(`
════════════════════════════════════════════════════════════
🎉 Sucesso total!

✅ Renderizados com sucesso: ${successCount}
❌ Erros: ${errorCount}

📝 IMPORTANTE: Rotas sincronizadas com src/config/routes.ts
   Para adicionar novas rotas, atualize ROUTES_CONFIG neste arquivo
   e em generate-sitemap.js
════════════════════════════════════════════════════════════
`);

  } catch (error) {
    console.error('\n❌ ERRO GERAL:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }
}

prerender().catch(console.error);
