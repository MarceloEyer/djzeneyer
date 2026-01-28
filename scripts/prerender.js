#!/usr/bin/env node
/**
 * SSR PRERENDER v17.0 - ENVIRONMENT-SAFE
 * Gera versões HTML estáticas para bots (Googlebot, etc)
 */

import { spawn } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================
// CONFIGURAÇÃO
// =============================
const CONFIG = {
  server: 'http://localhost:5173/wp-content/themes/zentheme/dist',
  distDir: join(process.cwd(), 'dist'),
  timeout: 30000,
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
console.log('║   🏗️  PRERENDER v17.0 - ENVIRONMENT-SAFE            ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log(`📡 Server: ${CONFIG.server}`);
console.log(`📄 Routes: ${CONFIG.routes.length}`);
console.log(`📂 Output: ${CONFIG.distDir}\n`);

// =============================
// SERVIDOR VITE
// =============================
let viteProcess = null;

function startDevServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting dev server...');
    
    viteProcess = spawn('npx', ['vite', 'preview', '--port', '5173', '--host'], {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let resolved = false;
    
    const onData = (data) => {
      const output = data.toString();
      process.stdout.write(output); // Mostrar output
      
      if (!resolved && (output.includes('5173') || output.includes('Local:') || output.includes('preview'))) {
        resolved = true;
        setTimeout(() => resolve(), 3000);
      }
    };

    viteProcess.stdout.on('data', onData);
    viteProcess.stderr.on('data', onData);

    viteProcess.on('error', (err) => {
      if (!resolved) reject(err);
    });
    
    setTimeout(() => {
      if (!resolved) reject(new Error('Server start timeout'));
    }, 30000);
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
    console.log('✅ Dev server running\n');

    // LAUNCH COM ARGS PARA AMBIENTES RESTRITOS
    browser = await puppeteer.launch({
      headless: 'shell', // Modo shell (mais compatível)
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
    
    // User-agent de bot
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    
    let successCount = 0;
    let errorCount = 0;

    for (const route of CONFIG.routes) {
      const url = `${CONFIG.server}${route}`;
      const filename = route === '/' ? 'index' : route.slice(1).replace(/\//g, '-');
      const outputPath = join(CONFIG.distDir, `${filename}_ssr.html`);

      try {
        console.log(`📄 Rendering: ${route}`);
        
        await page.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: CONFIG.timeout 
        });

        await page.waitForSelector(CONFIG.waitForSelector, { timeout: 5000 });
        await new Promise(resolve => setTimeout(resolve, 1000));

        const html = await page.content();
        
        // Injetar meta para identificação
        const finalHtml = html.replace(
          '<head>',
          `<head>\n  <meta name="prerender-generated" content="true" data-route="${route}">`
        );

        writeFileSync(outputPath, finalHtml, 'utf8');
        console.log(`   ✅ Saved: ${filename}_ssr.html`);
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
    if (browser) await browser.close();
    stopDevServer();
  }
}

// Trap de sinais
process.on('SIGINT', () => {
  stopDevServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopDevServer();
  process.exit(0);
});

// EXECUTAR
prerender();