#!/usr/bin/env node
/**
 * SSR PRERENDER v18.8 - PATH FIX & DEBUG
 * Tenta corrigir o problema de carregamento de assets em sub-rotas e mostra erros de JS.
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { getLocalizedRouteEntries } from '../src/config/routes.data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routeEntries = getLocalizedRouteEntries({ prerenderOnly: true });
const routesList = Array.from(
  new Set(routeEntries.flatMap(entry => [entry.fullPaths.en, entry.fullPaths.pt])),
);

console.log(`📋 SSOT: ${routesList.length} rotas.`);

const CONFIG = {
  serverBase: 'http://localhost:5173',
  distDir: join(process.cwd(), 'dist'),
  timeout: 60000,
  waitForSelector: '#root',
  routes: routesList,
};

const wait = (ms) => new Promise(r => setTimeout(r, ms));

// Servidor Vite
let viteProcess = null;
function startDevServer() {
  return new Promise(async (resolve, reject) => {
    console.log('🚀 Iniciando Vite...');
    viteProcess = spawn('npx', ['vite', 'preview', '--port', '5173', '--host'], {
      cwd: process.cwd(),
      stdio: 'inherit', env: { ...process.env, FORCE_COLOR: '1' },
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
      } catch (e) {}
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

    // 🚨 DEBUG: Ver erros do navegador
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`[JS ERROR]: ${msg.text()}`);
    });
    page.on('pageerror', err => console.log(`[PAGE CRASH]: ${err.message}`));
    page.on('requestfailed', req => {
      if (req.url().endsWith('.js') || req.url().endsWith('.css')) {
        console.log(`[ASSET 404]: ${req.url()}`); // Isso vai confirmar se é erro de caminho
      }
    });

    let successCount = 0;

    for (const route of CONFIG.routes) {
      const cleanRoute = route.replace(/^\/+/, '').replace(/\/+$/, '');
      const url = cleanRoute ? `${CONFIG.serverBase}/${cleanRoute}` : CONFIG.serverBase;

      let outputPath;
      if (!cleanRoute) {
        outputPath = join(CONFIG.distDir, 'index.html');
      } else {
        const targetDir = join(CONFIG.distDir, cleanRoute);
        if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
        outputPath = join(targetDir, 'index.html');
      }

      try {
        // console.log(`📄 Renderizando: ${route}`); // Menos log
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        // Tenta esperar o React montar
        try {
          await page.waitForSelector('#root div', { timeout: 5000 }); // Espera algo DENTRO do root
        } catch (e) {}

        const html = await page.content();

        // Verifica se pegou só o shell vazio
        if (html.length < 1000) {
          console.warn(`❌ ${route} VAZIO (${html.length}b). Erro de JS ou 404?`);
        } else {
          const finalHtml = html.replace('<head>', `<head>\n<meta name="prerender-generated" content="true">`);
          writeFileSync(outputPath, finalHtml, 'utf8');
          console.log(`✅ ${route} (${finalHtml.length}b)`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Erro em ${route}: ${error.message}`);
      }
    }

    // Se falhar muitos, avisa
    if (successCount < CONFIG.routes.length) {
      console.error(`⚠️ Apenas ${successCount}/${CONFIG.routes.length} rotas geradas corretamente.`);
      // Não damos exit(1) aqui para deixar o script de validação decidir se falha o build
    }
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
