#!/usr/bin/env node
/**
 * SSR PRERENDER v18.7 - SHELL ONLY (Offline Safe)
 * * OBJECTIVE: Generate the file structure (e.g., /about/index.html) to prevent 404s.
 * CONSTRAINT: No API access during build.
 * LOGIC: Load page -> Wait for React mount (#root) -> Save immediately.
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// =============================
// 1. LOAD ROUTES (SSOT)
// =============================
let routesList = [];
const ROUTES_CONFIG_PATH = join(__dirname, 'routes-config.json');

try {
    if (!existsSync(ROUTES_CONFIG_PATH)) {
        console.warn('⚠️ Routes JSON not found. Using minimal fallback.');
        routesList = ['/', '/about', '/shop'];
    } else {
        const routesConfig = JSON.parse(readFileSync(ROUTES_CONFIG_PATH, 'utf8'));
        routesList = routesConfig.routes;
        console.log(`📋 SSOT: Loaded ${routesList.length} routes for structure generation.`);
    }
} catch (e) {
    console.error('❌ Error reading routes. Proceeding with home only.');
    routesList = ['/'];
}

// =============================
// CONFIGURATION
// =============================
const CONFIG = {
  serverBase: 'http://localhost:5173',
  entryPoint: 'http://localhost:5173',
  distDir: join(process.cwd(), 'dist'),
  timeout: 60000, 
  // Wait only for the main container, NOT specific content (h1, article)
  waitForSelector: '#root', 
  routes: routesList
};

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║   🏗️  PRERENDER v18.7 - SHELL ONLY (Offline Safe)     ║');
console.log('╚═══════════════════════════════════════════════════════╝');

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

let viteProcess = null;

function startDevServer() {
  return new Promise(async (resolve, reject) => {
    console.log('🚀 Starting Vite Server (Preview)...');
    
    viteProcess = spawn('npx', ['vite', 'preview', '--port', '5173', '--host'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    viteProcess.on('error', (err) => reject(err));
    
    console.log(`⏳ Waiting for server...`);
    const isReady = await checkConnection(CONFIG.serverBase, 60000);

    if (isReady) {
      console.log('\n✅ Server Online.');
      resolve();
    } else {
      stopDevServer();
      reject(new Error(`Timeout connecting to Vite.`));
    }
  });
}

function stopDevServer() {
  if (viteProcess) {
    console.log('🛑 Stopping server...');
    viteProcess.kill();
    viteProcess = null;
  }
}

async function prerender() {
  let browser = null;
  
  try {
    await startDevServer();
    
    browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    // Generic User Agent to avoid blocking
    await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');

    let successCount = 0;

    for (const route of CONFIG.routes) {
      const routePath = route.startsWith('/') ? route : `/${route}`;
      const url = `${CONFIG.entryPoint}${routePath}`;
      
      // Path Definition
      let outputPath;
      if (route === '/' || route === '') {
        outputPath = join(CONFIG.distDir, 'index.html');
      } else {
        const folderName = routePath.slice(1);
        const targetDir = join(CONFIG.distDir, folderName);
        if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
        outputPath = join(targetDir, 'index.html');
      }

      try {
        // Fast navigation: domcontentloaded is enough for Shell
        await page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });

        // Minimal wait for React to mount basic structure (Header/Footer)
        try {
            await page.waitForSelector('#root', { timeout: 5000 });
            await wait(1000); // Small pause for CSS/JS injection
        } catch (e) {
            // If it fails, save anyway (better empty HTML than 404)
        }

        const html = await page.content();
        
        // Inject meta tag to confirm prerender
        const finalHtml = html.replace('<head>', `<head>\n  <meta name="prerender-generated" content="true">`);
        
        writeFileSync(outputPath, finalHtml, 'utf8');
        
        console.log(`✅ Generated: ${route} (${finalHtml.length} bytes)`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error on ${route}: ${error.message}`);
        // Do not fail build, just log error
      }
    }

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log(`║  ✅ COMPLETED: ${successCount}/${CONFIG.routes.length} files generated.`);
    console.log('╚═══════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error);
    process.exit(1);
  } finally {
    if (browser) try { await browser.close(); } catch(e) {}
    stopDevServer();
    process.exit(0);
  }
}

process.on('SIGINT', () => { stopDevServer(); process.exit(0); });
process.on('SIGTERM', () => { stopDevServer(); process.exit(0); });

prerender();