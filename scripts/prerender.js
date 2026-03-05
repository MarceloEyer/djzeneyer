#!/usr/bin/env node
/**
 * SSR PRERENDER v20.0 - BASE PATH FIXED
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Servidor Vite
let viteProcess = null;
function startDevServer() {
  return new Promise(async (resolve, reject) => {
    console.log('🚀 Iniciando Vite Preview...');
    viteProcess = spawn('npx', ['vite', 'preview', '--port', '5173', '--host'], {
      cwd: process.cwd(),
      stdio: 'inherit',
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
    browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // 🛡️ API INTERCEPTION: Global for all pages
    await page.setRequestInterception(true);
    page.on('request', request => {
      const reqUrl = request.url();
      if (reqUrl.includes('/wp-json/')) {
        let mockData = [];
        if (reqUrl.includes('/posts')) mockData = [{ id: 1, title: { rendered: 'Build Preview' }, slug: 'preview', date: new Date().toISOString() }];
        if (reqUrl.includes('/products')) mockData = [];
        if (reqUrl.includes('/gamipress')) mockData = {};
        if (reqUrl.includes('/v1/menu')) mockData = [];
        if (reqUrl.includes('/zen-bit/v2/events')) mockData = { success: true, events: [] };
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
