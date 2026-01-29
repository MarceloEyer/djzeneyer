#!/usr/bin/env node
/**
 * SSR PRERENDER v17.1 - ROBUST POLLING
 * Gera versões HTML estáticas para bots (Googlebot, etc)
 * Correção: Timeout de CI e detecção de servidor via HTTP Ping
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
  server: 'http://localhost:5173', // Base URL para check de conexão
  entryPoint: 'http://localhost:5173/wp-content/themes/zentheme/dist', // URL real das rotas
  distDir: join(process.cwd(), 'dist'),
  timeout: 60000, // Aumentado para 60s (CI Friendly)
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
console.log('║   🏗️  PRERENDER v17.1 - ROBUST POLLING                ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log(`📡 Server Entry: ${CONFIG.entryPoint}`);
console.log(`📄 Routes: ${CONFIG.routes.length}`);
console.log(`📂 Output: ${CONFIG.distDir}\n`);

// =============================
// HELPER: WAIT & CHECK CONNECTION
// =============================
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function checkConnection(url, timeout) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      // Tenta conectar. Se der 200 ou 404, o servidor existe.
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch (e) {
      // ECONNREFUSED = Servidor ainda não subiu. Espera.
    }
    await wait(1000);
    process.stdout.write('.'); // Feedback visual
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
    
    // 1. Inicia o processo com output herdado (para ver erros no CI)
    viteProcess = spawn('npx', ['vite', 'preview', '--port', '5173', '--host'], {
      cwd: process.cwd(),
      stdio: 'inherit', 
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    viteProcess.on('error', (err) => reject(err));
    
    // 2. Polling Ativo: Tenta conectar até conseguir
    console.log(`⏳ Aguardando conexão em ${CONFIG.server} (Timeout: ${CONFIG.timeout}ms)...`);
    const isReady = await checkConnection(CONFIG.server, CONFIG.timeout);

    if (isReady) {
      console.log('\n✅ Servidor respondeu! Conexão estabelecida.');
      resolve();
    } else {
      stopDevServer();
      reject(new Error(`Server start timeout: Não foi possível conectar na porta 5173 após ${CONFIG.timeout / 1000} segundos.`));
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

    // LAUNCH COM ARGS PARA AMBIENTES RESTRITOS (CI)
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
    
    // User-agent de bot
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    
    let successCount = 0;
    let errorCount = 0;

    for (const route of CONFIG.routes) {
      // Ajuste na URL: remove barra duplicada se houver
      const routePath = route.startsWith('/') ? route : `/${route}`;
      const url = `${CONFIG.entryPoint}${routePath}`;
      
      const filename = route === '/' ? 'index' : route.slice(1).replace(/\//g, '-');
      const outputPath = join(CONFIG.distDir, `${filename}_ssr.html`);

      try {
        console.log(`📄 Rendering: ${route}`);
        
        await page.goto(url, { 
          waitUntil: 'networkidle0',
          timeout: CONFIG.timeout 
        });

        // Espera seletor principal ou timeout menor para não travar tudo
        try {
            await page.waitForSelector(CONFIG.waitForSelector, { timeout: 5000 });
        } catch (e) {
            console.warn(`   ⚠️ Warning: Selector ${CONFIG.waitForSelector} not found (might be 404 page)`);
        }
        
        const html = await page.content();
        
        // Injetar meta para identificação
        const finalHtml = html.replace(
          '<head>',
          `<head>\n  <meta name="prerender-generated" content="true" data-route="${route}">`
        );

        if (!existsSync(CONFIG.distDir)) {
            mkdirSync(CONFIG.distDir, { recursive: true });
        }

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
    if (browser) {
        try { await browser.close(); } catch(e) {}
    }
    stopDevServer();
    
    // FORÇA O ENCERRAMENTO PARA NÃO TRAVAR O CI
    console.log('👋 Prerender complete. Exiting...');
    process.exit(0);
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