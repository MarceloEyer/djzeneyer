#!/usr/bin/env node
/**
 * SSR PRERENDER v18.4 - SSOT + CONTENT AWARE
 * 1. Single Source of Truth: Lê estritamente de scripts/routes-config.json
 * 2. Content Aware: Espera seletores reais (h1, main) para evitar arquivos vazios
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================
// 1. CARREGAR ROTAS (SSOT)
// =============================
let routesList = [];
const ROUTES_CONFIG_PATH = join(__dirname, 'routes-config.json');

try {
    if (!existsSync(ROUTES_CONFIG_PATH)) {
        throw new Error(`Arquivo de rotas não encontrado em: ${ROUTES_CONFIG_PATH}`);
    }
    const routesConfig = JSON.parse(readFileSync(ROUTES_CONFIG_PATH, 'utf8'));
    routesList = routesConfig.routes;
    console.log(`📋 Carregadas ${routesList.length} rotas da SSOT.`);
} catch (e) {
    console.error('❌ Erro crítico: Não foi possível carregar a configuração de rotas.');
    console.error(e.message);
    process.exit(1); // Falha se não tiver a fonte da verdade
}

// =============================
// CONFIGURAÇÃO
// =============================
const CONFIG = {
  serverBase: 'http://localhost:5173',
  entryPoint: 'http://localhost:5173',
  distDir: join(process.cwd(), 'dist'),
  timeout: 90000, // 90s para garantir
  // Seletores para confirmar que o conteúdo carregou (não apenas o #root vazio)
  waitForSelectors: ['h1', 'main', '.page-content', 'article', '.hero'], 
  
  routes: routesList
};

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║   🏗️  PRERENDER v18.4 - SSOT + CONTENT AWARE          ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log(`📡 Server: ${CONFIG.entryPoint}`);
console.log(`📂 Output: ${CONFIG.distDir}\n`);

// =============================
// HELPER: WAIT & CHECK CONNECTION
// =============================
const wait = (ms) => new Promise(r => setTimeout(r, ms));

async function checkConnection(url, timeout) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true;
    } catch (e) {}
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
    
    console.log(`⏳ Aguardando conexão em ${CONFIG.serverBase} (Timeout: 60s)...`);
    const isReady = await checkConnection(CONFIG.serverBase, 60000);

    if (isReady) {
      console.log('\n✅ Servidor respondeu! Conexão estabelecida.');
      resolve();
    } else {
      stopDevServer();
      reject(new Error(`Server start timeout: Não conectou na porta 5173.`));
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
      const routePath = route.startsWith('/') ? route : `/${route}`;
      const cleanEntryPoint = CONFIG.entryPoint.endsWith('/') ? CONFIG.entryPoint.slice(0, -1) : CONFIG.entryPoint;
      const url = `${cleanEntryPoint}${routePath}`;
      
      let outputPath;
      if (route === '/' || route === '') {
        outputPath = join(CONFIG.distDir, 'index.html');
      } else {
        const folderName = routePath.slice(1);
        const targetDir = join(CONFIG.distDir, folderName);
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }
        outputPath = join(targetDir, 'index.html');
      }

      try {
        console.log(`📄 Rendering: ${route}`);
        
        // Navegar
        await page.goto(url, { 
          waitUntil: 'domcontentloaded',
          timeout: CONFIG.timeout 
        });

        // Espera Inteligente por Conteúdo (Não só #root vazio)
        try {
            // Tenta achar qualquer um dos seletores de conteúdo real
            await page.waitForFunction(
                (selectors) => document.querySelector(selectors),
                { timeout: 15000 }, // 15s para hidratação
                CONFIG.waitForSelectors.join(',')
            );
        } catch (e) {
            console.warn(`   ⚠️ Warning: Nenhum conteúdo detectado para ${route} (pode gerar arquivo pequeno)`);
        }

        // Scroll Hack para lazy loading
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await wait(500);
        await page.evaluate(() => window.scrollTo(0, 0));
        
        // Pausa final para estabilização
        await wait(2000);

        const html = await page.content();
        
        const finalHtml = html.replace(
          '<head>',
          `<head>\n  <meta name="prerender-generated" content="true" data-route="${route}">`
        );

        writeFileSync(outputPath, finalHtml, 'utf8');
        
        const displayPath = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
        console.log(`   ✅ Saved: ${displayPath} (${finalHtml.length} bytes)`);
        
        if (finalHtml.length < 1000) {
             console.warn(`   ⚠️ ALERTA: Arquivo muito pequeno! Verifique a renderização.`);
        }

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

process.on('SIGINT', () => {
  stopDevServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopDevServer();
  process.exit(0);
});

prerender();