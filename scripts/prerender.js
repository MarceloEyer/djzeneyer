#!/usr/bin/env node
/**
 * SSR PRERENDER v18.0 - PRODUCTION READY
 * Estrutura: dist/about/index.html (correto para URLs limpas)
 * Polling HTTP: Confiável em CI/CD
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================
// CONFIGURAÇÃO
// =============================
const CONFIG = {
  server: 'http://localhost:5173',
  entryPoint: 'http://localhost:5173/wp-content/themes/zentheme/dist',
  distDir: join(process.cwd(), 'dist'),
  timeout: 60000,
  waitForSelector: '#root',
  
  routes: [
    '/',
    '/about',
    '/events',
    '/classes',
    '/shop',
    '/contact',
    '/blog',
    '/login',
    '/register',
    '/dashboard',
    '/workshops',
    '/private-lessons',
    '/festival-prep',
    '/demo-program',
    '/team',
    '/media',
    '/testimonials',
    '/faq',
    '/privacy',
    '/terms',
    '/sitemap',
    '/thank-you',
    '/gamification',
    '/profile'
  ]
};

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║   🏗️  PRERENDER v18.0 - PRODUCTION READY             ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log(`📡 Server Entry: ${CONFIG.entryPoint}`);
console.log(`📄 Routes: ${CONFIG.routes.length}`);
console.log(`📂 Output: ${CONFIG.distDir}\n`);

// =============================
// HELPER: HTTP POLLING
// =============================
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function checkConnection(url, timeout) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch (e) {
      // ECONNREFUSED = servidor ainda não subiu
    }
    await wait(1000);
    process.stdout.write('.');
  }
  return false;
}

// =============================
// SERVIDOR VITE
// =============================
let viteProcess = null;

function startDevServer() {
  return new Promise(async (resolve, reject) => {
    console.log('🚀 Starting dev server (Vite Preview)...');
    
    viteProcess = spawn('npx', ['vite', 'preview', '--port', '5173', '--host'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    viteProcess.on('error', (err) => reject(err));
    
    console.log(`⏳ Aguardando conexão em ${CONFIG.server} (Timeout: ${CONFIG.timeout}ms)...`);
    const isReady = await checkConnection(CONFIG.server, CONFIG.timeout);

    if (isReady) {
      console.log('\n✅ Servidor respondeu! Conexão estabelecida.');
      resolve();
    } else {
      stopDevServer();
      reject(new Error(`Server timeout após ${CONFIG.timeout / 1000}s`));
    }
  });
}

function stopDevServer() {
  if (viteProcess) {
    console.log('🛑 Stopping dev server...');
    viteProcess.kill();
    viteProcess = null;
  }
}

// =============================
// PRERENDER
// =============================
async function prerender() {
  let browser = null;
  
  try {
    await startDevServer();
    console.log('✅ Prerender process starting...\n');

    browser = await puppeteer.launch({
      headless: 'shell',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
        '--disable-software-rasterizer'
      ]
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    
    let successCount = 0;
    let errorCount = 0;

    for (const route of CONFIG.routes) {
      const url = `${CONFIG.entryPoint}${route}`;
      
      // Estrutura correta: /about -> dist/about/index.html
      let outputPath;
      if (route === '/') {
        outputPath = join(CONFIG.distDir, 'index.html');
      } else {
        const dir = join(CONFIG.distDir, route.slice(1));
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true });
        }
        outputPath = join(dir, 'index.html');
      }

      try {
        console.log(`📄 Rendering: ${route}`);
        
        await page.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: CONFIG.timeout 
        });

        // Esperar hidratação completa
        await page.waitForSelector(CONFIG.waitForSelector, { timeout: 10000 });
        
        // Trigger lazy loading
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await wait(500);
        await page.evaluate(() => window.scrollTo(0, 0));
        await wait(2000);

        const html = await page.content();
        
        const finalHtml = html.replace(
          '<head>',
          `<head>\n  <meta name="prerender-generated" content="true" data-route="${route}">`
        );

        writeFileSync(outputPath, finalHtml, 'utf8');
        const displayPath = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
        console.log(`   ✅ Saved: ${displayPath}`);
        successCount++;

      } catch (error) {
        console.error(`   ❌ Failed: ${route} - ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log(`║  ✅ SUCCESS: ${successCount}/${CONFIG.routes.length} routes rendered`);
    if (errorCount > 0) {
      console.log(`║  ⚠️  ERRORS: ${errorCount} routes failed`);
    }
    console.log('╚═══════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    process.exit(1);
  } finally {
    if (browser) {
      try { await browser.close(); } catch(e) {}
    }
    stopDevServer();
    
    console.log('👋 Prerender complete. Exiting...');
    process.exit(0);
  }
}

// Signal handlers
process.on('SIGINT', () => {
  stopDevServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopDevServer();
  process.exit(0);
});

prerender();